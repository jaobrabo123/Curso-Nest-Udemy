import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDTO } from "./dto/login.dto";
import { Repository } from "typeorm";
import { Pessoa } from "../pessoas/entities/pessoa.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { HashingService } from "./hashing/hashing.service";
import jwtConfig from "./config/jwt.config";
import type { ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenDTO } from "./dto/refresh-token.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Pessoa) private readonly pessoaRepository: Repository<Pessoa>,
        private readonly hashingService: HashingService,
        @Inject(jwtConfig.KEY) private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService,
    ) {}

    private throwInvalidCredentials(): never {
        throw new UnauthorizedException("Credenciais inválidas");
    }

    private async createJwtToken<T>(sub: number, expiresIn: number, payload?: T) {
        return await this.jwtService.signAsync(
            {
                sub,
                ...payload,
            },
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn,
            },
        );
    }

    private async createAuthTokens(pessoa: Pessoa) {
        const [accessToken, refreshToken] = await Promise.all([
            this.createJwtToken(pessoa.id, this.jwtConfiguration.jwtTtl, {
                email: pessoa.email,
            }),
            this.createJwtToken(pessoa.id, this.jwtConfiguration.jwtRefreshTtl),
        ]);

        return { accessToken, refreshToken };
    }

    async login(dto: LoginDTO) {
        const pessoa = await this.pessoaRepository.findOneBy({ email: dto.email, active: true });
        if (!pessoa) this.throwInvalidCredentials();

        const passwordIsValid = await this.hashingService.compare(
            dto.password,
            pessoa.passwordHash,
        );
        if (!passwordIsValid) this.throwInvalidCredentials();

        return this.createAuthTokens(pessoa);
    }

    async refresh(dto: RefreshTokenDTO) {
        try {
            const { sub } = await this.jwtService.verifyAsync<{ sub: number }>(
                dto.refreshToken,
                this.jwtConfiguration,
            );

            const pessoa = await this.pessoaRepository.findOneBy({ id: sub, active: true });

            if (!pessoa) {
                throw new Error("Pessoa não encontrada");
            }

            return this.createAuthTokens(pessoa);
        } catch (error: any) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            throw new UnauthorizedException(error.message);
        }
    }
}
