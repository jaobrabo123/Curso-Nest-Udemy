import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Recado } from "./entities/recado.entity";
import { CreateRecadoDTO } from "./dto/create-recado.dto";
import { UpdateRecadoDTO } from "./dto/update-recado.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PessoasService } from "../pessoas/pessoas.service";
import { PaginationDTO } from "../common/dto/pagination.dto";
import { RecadoUtils } from "./recados.utils";
import {
    ONLY_LOWER_CASE_LETTERS_REGEX,
    REMOVE_SPACES_REGEX,
    SERVER_NAME,
} from "./recados.constant";
import type { RegexProtocol } from "../common/regex/protocol.regex";

@Injectable()
export class RecadosService {
    constructor(
        @InjectRepository(Recado) private readonly recadoRepository: Repository<Recado>,
        private readonly pessoasService: PessoasService,
        private readonly recadoUtils: RecadoUtils,
        @Inject(SERVER_NAME) private readonly serverName: string,
        @Inject(REMOVE_SPACES_REGEX) private readonly removeSpacesRegex: RegexProtocol,
        @Inject(ONLY_LOWER_CASE_LETTERS_REGEX)
        private readonly onlyLowerCaseLettersRegex: RegexProtocol,
    ) {}

    async findAll(pagination: PaginationDTO) {
        console.log(this.recadoUtils.invertString("joao"));
        console.log(this.serverName);
        console.log(this.removeSpacesRegex.execute(this.serverName));
        console.log(this.onlyLowerCaseLettersRegex.execute(this.serverName));

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

    async create(dto: CreateRecadoDTO) {
        const { deId, paraId } = dto;

        const de = await this.pessoasService.findOne(deId);
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
            },
            para: {
                id: recado.para.id,
            },
        };
    }

    async update(id: number, dto: UpdateRecadoDTO) {
        const recado = await this.findOne(id);

        recado.texto = dto.texto ?? recado.texto;
        recado.lido = dto.lido ?? recado.lido;

        return this.recadoRepository.save(recado);
    }

    async remove(id: number) {
        const recado = await this.recadoRepository.findOneBy({ id });
        if (!recado) throw new NotFoundException("Recado não encontrado.");
        return this.recadoRepository.remove(recado);
    }
}
