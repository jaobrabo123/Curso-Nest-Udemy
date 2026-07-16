import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { PessoasService } from "./pessoas.service";
import { CreatePessoaDTO } from "./dto/create-pessoa.dto";
import { UpdatePessoaDTO } from "./dto/update-pessoa.dto";
import { ParseIntIdPipe } from "../common/pipes/parse-int-id.pipe";

@Controller("pessoas")
export class PessoasController {
    constructor(private readonly pessoasService: PessoasService) {}

    @Post()
    create(@Body() createPessoaDto: CreatePessoaDTO) {
        return this.pessoasService.create(createPessoaDto);
    }

    @Get()
    findAll() {
        return this.pessoasService.findAll();
    }

    @Get(":id")
    findOne(@Param("id", ParseIntIdPipe) id: number) {
        return this.pessoasService.findOne(id);
    }

    @Patch(":id")
    update(@Param("id", ParseIntIdPipe) id: number, @Body() updatePessoaDto: UpdatePessoaDTO) {
        return this.pessoasService.update(id, updatePessoaDto);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntIdPipe) id: number) {
        return this.pessoasService.remove(id);
    }
}
