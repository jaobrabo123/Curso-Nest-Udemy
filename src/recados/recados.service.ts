import { ForbiddenException, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { Recado } from "./entities/recado.entity";
import { CreateRecadoDTO } from "./dto/create-recado.dto";
import { UpdateRecadoDTO } from "./dto/update-recado.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PessoasService } from "../pessoas/pessoas.service";
import { PaginationDTO } from "../common/dto/pagination.dto";
import { TokenPayloadDTO } from "../auth/dto/token-payload.dto";

@Injectable({ scope: Scope.DEFAULT })
export class RecadosService {
    constructor(
        @InjectRepository(Recado) private readonly recadoRepository: Repository<Recado>,
        private readonly pessoasService: PessoasService,
    ) {}

    async findAll(pagination: PaginationDTO) {
        const { limit = 10, offset = 0 } = pagination;

        const recados = await this.recadoRepository.find({
            relations: { de: true, para: true },
            order: { id: "DESC" },
            select: {
                de: {
                    id: true,
                    nome: true,
                },
                para: {
                    id: true,
                    nome: true,
                },
            },
            take: limit,
            skip: offset,
        });
        return recados;
    }

    async findOne(id: number) {
        const recado = await this.recadoRepository.findOne({
            where: { id },
            relations: { de: true, para: true },
            select: {
                de: {
                    id: true,
                    nome: true,
                },
                para: {
                    id: true,
                    nome: true,
                },
            },
        });
        if (!recado) throw new NotFoundException("Recado não encontrado.");
        return recado;
    }

    async create(dto: CreateRecadoDTO, tokenPayload: TokenPayloadDTO) {
        const { paraId } = dto;

        const de = await this.pessoasService.findOne(tokenPayload.sub);
        const para = await this.pessoasService.findOne(paraId);

        const novoRecado = {
            texto: dto.texto,
            de,
            para,
            data: new Date(),
        };

        const recado = this.recadoRepository.create(novoRecado);
        await this.recadoRepository.save(recado);

        return {
            ...recado,
            de: {
                id: recado.de.id,
                nome: recado.de.nome,
            },
            para: {
                id: recado.para.id,
                nome: recado.para.nome,
            },
        };
    }

    async update(id: number, dto: UpdateRecadoDTO, tokenPayload: TokenPayloadDTO) {
        const recado = await this.findOne(id);

        if (recado.de.id !== tokenPayload.sub) {
            throw new ForbiddenException("Esse recado não é seu");
        }

        recado.texto = dto.texto ?? recado.texto;
        recado.lido = dto.lido ?? recado.lido;

        return this.recadoRepository.save(recado);
    }

    async remove(id: number, tokenPayload: TokenPayloadDTO) {
        const recado = await this.findOne(id);
        if (!recado) throw new NotFoundException("Recado não encontrado.");

        if (recado.de.id !== tokenPayload.sub) {
            throw new ForbiddenException("Esse recado não é seu");
        }

        return this.recadoRepository.remove(recado);
    }
}
