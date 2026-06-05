import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { RecadosService } from "./recados.service";
import { Recado } from "./entities/recado.entity";

@Controller("recados")
export class RecadosController {
    constructor(private readonly recadosService: RecadosService) {}

    @Get()
    findAll(@Query() pagination: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unused-vars
        const { limit = 10, offset = 0 } = pagination as any;
        // return `Essa rota retorna todos os recados. Limit=${limit}, Offset=${offset}`;
        return this.recadosService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.recadosService.findOne(id);
    }

    @Post()
    create(@Body() body: Omit<Recado, "id">) {
        return this.recadosService.create(body);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() body: Partial<Omit<Recado, "id">>) {
        return this.recadosService.update(id, body);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.recadosService.remove(id);
    }
}
