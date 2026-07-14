import { PartialType } from "@nestjs/mapped-types";
import { CreatePessoaDTO } from "./create-pessoa.dto";

export class UpdatePessoaDTO extends PartialType(CreatePessoaDTO) {}
