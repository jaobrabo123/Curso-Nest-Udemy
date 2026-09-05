import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { PessoasService } from "./pessoas.service";
import { CreatePessoaDTO } from "./dto/create-pessoa.dto";
import { UpdatePessoaDTO } from "./dto/update-pessoa.dto";
import { ParseIntIdPipe } from "../common/pipes/parse-int-id.pipe";
import { AuthTokenGuard } from "../auth/guards/auth-token.guard";
import { TokenPayloadParam } from "../auth/params/token-payload.param";
import { TokenPayloadDTO } from "../auth/dto/token-payload.dto";

@Controller("pessoas")
export class PessoasController {
    constructor(private readonly pessoasService: PessoasService) {}

    @Post()
    create(@Body() createPessoaDto: CreatePessoaDTO) {
        return this.pessoasService.create(createPessoaDto);
    }

    @UseGuards(AuthTokenGuard)
    @Get()
    findAll() {
        return this.pessoasService.findAll();
    }

    @UseGuards(AuthTokenGuard)
    @Get(":id")
    findOne(@Param("id", ParseIntIdPipe) id: number) {
        return this.pessoasService.findOne(id);
    }

    @UseGuards(AuthTokenGuard)
    @Patch(":id")
    update(
        @Param("id", ParseIntIdPipe) id: number,
        @Body() dto: UpdatePessoaDTO,
        @TokenPayloadParam() tokenPayload: TokenPayloadDTO,
    ) {
        return this.pessoasService.update(id, dto, tokenPayload);
    }

    @UseGuards(AuthTokenGuard)
    @Delete(":id")
    remove(
        @Param("id", ParseIntIdPipe) id: number,
        @TokenPayloadParam() tokenPayload: TokenPayloadDTO,
    ) {
        return this.pessoasService.remove(id, tokenPayload);
    }
}
