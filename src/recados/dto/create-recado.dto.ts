import { IsNotEmpty, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

export class CreateRecadoDTO {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(255)
    texto!: string;

    @IsPositive()
    deId!: number;

    @IsPositive()
    paraId!: number;
}
