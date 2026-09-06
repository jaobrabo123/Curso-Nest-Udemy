import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { CreatePessoaDTO } from "./dto/create-pessoa.dto";
import { UpdatePessoaDTO } from "./dto/update-pessoa.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Pessoa } from "./entities/pessoa.entity";
import { Repository } from "typeorm";
import { HashingService } from "../auth/hashing/hashing.service";
import { TokenPayloadDTO } from "../auth/dto/token-payload.dto";

@Injectable()
export class PessoasService {
    constructor(
        @InjectRepository(Pessoa) private readonly pessoaRepository: Repository<Pessoa>,
        private readonly hashingService: HashingService,
    ) {}

    async create(dto: CreatePessoaDTO) {
        try {
            const passwordHash = await this.hashingService.hash(dto.password);

            const dadosPessoa = {
                nome: dto.nome,
                passwordHash,
                email: dto.email,
                routePolicies: dto.routePolicies,
            };

            const novaPessoa = this.pessoaRepository.create(dadosPessoa);
            return await this.pessoaRepository.save(novaPessoa);
        } catch (error: any) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (error.code === "23505") {
                throw new ConflictException("Email já cadastrado.");
            }
            throw error;
        }
    }

    findAll() {
        return this.pessoaRepository.find({ order: { id: "DESC" } });
    }

    async findOne(id: number) {
        const pessoa = await this.pessoaRepository.findOneBy({ id });
        if (!pessoa) {
            throw new NotFoundException("Pessoa não encontrada.");
        }

        return pessoa;
    }

    async update(id: number, dto: UpdatePessoaDTO, tokenPayload: TokenPayloadDTO) {
        const dadosPessoa = {
            nome: dto.nome,
        };

        if (dto.password) {
            const passwordHash = await this.hashingService.hash(dto.password);
            dadosPessoa["passwordHash"] = passwordHash;
        }

        const pessoa = await this.pessoaRepository.preload({
            id,
            ...dadosPessoa,
        });

        if (!pessoa) {
            throw new NotFoundException("Pessoa não encontrada.");
        }

        if (pessoa.id !== tokenPayload.sub) {
            throw new ForbiddenException("Você não é essa pessoa");
        }

        return this.pessoaRepository.save(pessoa);
    }

    async remove(id: number, tokenPayload: TokenPayloadDTO) {
        const pessoa = await this.findOne(id);

        if (pessoa.id !== tokenPayload.sub) {
            throw new ForbiddenException("Você não é essa pessoa");
        }

        await this.pessoaRepository.remove(pessoa);
    }
}
