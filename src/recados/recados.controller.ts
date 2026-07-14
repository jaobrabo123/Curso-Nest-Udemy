import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from "@nestjs/common";
import { RecadosService } from "./recados.service";
import { CreateRecadoDTO } from "./dto/create-recado.dto";
import { UpdateRecadoDTO } from "./dto/update-recado.dto";
import { PaginationDTO } from "../common/dto/pagination.dto";

@Controller("recados")
export class RecadosController {
    constructor(private readonly recadosService: RecadosService) {}

    @Get()
    findAll(@Query() pagination: PaginationDTO) {
        return this.recadosService.findAll(pagination);
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number) {
        return this.recadosService.findOne(id);
    }

    @Post()
    create(@Body() body: CreateRecadoDTO) {
        return this.recadosService.create(body);
    }

    @Patch(":id")
    update(@Param("id", ParseIntPipe) id: number, @Body() body: UpdateRecadoDTO) {
        return this.recadosService.update(id, body);
    }

    @Delete(":id")
    remove(@Param("id", ParseIntPipe) id: number) {
        return this.recadosService.remove(id);
    }
}
