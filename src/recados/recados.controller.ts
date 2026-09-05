import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    // UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { RecadosService } from "./recados.service";
import { CreateRecadoDTO } from "./dto/create-recado.dto";
import { UpdateRecadoDTO } from "./dto/update-recado.dto";
import { PaginationDTO } from "../common/dto/pagination.dto";
import { ParseIntIdPipe } from "../common/pipes/parse-int-id.pipe";
import { AddHeaderInterceptor } from "../common/interceptors/add-header.interceptor";
import { AuthTokenGuard } from "../auth/guards/auth-token.guard";
import { TokenPayloadParam } from "../auth/params/token-payload.param";
import { TokenPayloadDTO } from "../auth/dto/token-payload.dto";
// import { IsAdminGuard } from "../common/guards/is-admin.guard";

@Controller("recados")
@UseInterceptors(AddHeaderInterceptor)
// @UseGuards(IsAdminGuard)
export class RecadosController {
    constructor(private readonly recadosService: RecadosService) {}

    @Get()
    findAll(@Query() pagination: PaginationDTO) {
        return this.recadosService.findAll(pagination);
    }

    @Get(":id")
    findOne(@Param("id", ParseIntIdPipe) id: number) {
        return this.recadosService.findOne(id);
    }

    @UseGuards(AuthTokenGuard)
    @Post()
    create(@Body() body: CreateRecadoDTO, @TokenPayloadParam() tokenPayload: TokenPayloadDTO) {
        return this.recadosService.create(body, tokenPayload);
    }

    @UseGuards(AuthTokenGuard)
    @Patch(":id")
    update(
        @Param("id", ParseIntIdPipe) id: number,
        @Body() body: UpdateRecadoDTO,
        @TokenPayloadParam() tokenPayload: TokenPayloadDTO,
    ) {
        return this.recadosService.update(id, body, tokenPayload);
    }

    @UseGuards(AuthTokenGuard)
    @Delete(":id")
    remove(
        @Param("id", ParseIntIdPipe) id: number,
        @TokenPayloadParam() tokenPayload: TokenPayloadDTO,
    ) {
        return this.recadosService.remove(id, tokenPayload);
    }
}
