import { PartialType } from "@nestjs/swagger";
import { CreateRecadoDTO } from "./create-recado.dto";
import { IsBoolean, IsOptional } from "class-validator";

export class UpdateRecadoDTO extends PartialType(CreateRecadoDTO) {
    @IsOptional()
    @IsBoolean()
    lido?: boolean;
}
