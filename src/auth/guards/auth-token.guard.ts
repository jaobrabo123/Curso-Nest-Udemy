import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import jwtConfig from "../config/jwt.config";
import type { ConfigType } from "@nestjs/config";
import { REQUEST_TOKEN_PAYLOAD_KEY } from "../auth.constants";
import { InjectRepository } from "@nestjs/typeorm";
import { Pessoa } from "../../pessoas/entities/pessoa.entity";
import { Repository } from "typeorm";
import { TokenPayloadDTO } from "../dto/token-payload.dto";

@Injectable()
export class AuthTokenGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY) private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        @InjectRepository(Pessoa) private readonly pessoaRepository: Repository<Pessoa>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException("Não logado");
        }

        try {
            const payload = await this.jwtService.verifyAsync<TokenPayloadDTO>(
                token,
                this.jwtConfiguration,
            );

            const pessoa = await this.pessoaRepository.findOneBy({ id: payload.sub });

            if (!pessoa) {
                throw new UnauthorizedException("Pessoa não autorizada");
            }

            payload["pessoa"] = pessoa;
            request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
        } catch (err) {
            console.log(err);
            throw new UnauthorizedException("Falha ao validar token");
        }

        return true;
    }

    extractTokenFromHeader(request: Request): string | undefined {
        const authorization = request.headers.authorization;

        if (!authorization || typeof authorization !== "string") {
            return;
        }

        return authorization.split(" ")[1];
    }
}
