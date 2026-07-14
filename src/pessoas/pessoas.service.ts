import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreatePessoaDTO } from "./dto/create-pessoa.dto";
import { UpdatePessoaDTO } from "./dto/update-pessoa.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Pessoa } from "./entities/pessoa.entity";
import { Repository } from "typeorm";

@Injectable()
export class PessoasService {
    constructor(@InjectRepository(Pessoa) private readonly pessoaRepository: Repository<Pessoa>) {}

    async create(dto: CreatePessoaDTO) {
        try {
            const dadosPessoa = {
                nome: dto.nome,
                passwordHash: dto.password,
                email: dto.email,
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

    async update(id: number, dto: UpdatePessoaDTO) {
        const dadosPessoa = {
            nome: dto.nome,
            passwordHash: dto.password,
        };

        const pessoa = await this.pessoaRepository.preload({
            id,
            ...dadosPessoa,
        });

        if (!pessoa) {
            throw new NotFoundException("Pessoa não encontrada.");
        }

        return this.pessoaRepository.save(pessoa);
    }

    async remove(id: number) {
        const pessoa = await this.findOne(id);
        await this.pessoaRepository.remove(pessoa);
    }
}
