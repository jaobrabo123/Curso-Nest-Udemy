import { PartialType } from "@nestjs/swagger";
import { CreatePessoaDTO } from "./create-pessoa.dto";

export class UpdatePessoaDTO extends PartialType(CreatePessoaDTO) {}
