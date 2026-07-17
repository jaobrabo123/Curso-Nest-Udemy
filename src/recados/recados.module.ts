import { forwardRef, Module } from "@nestjs/common";
import { RecadosController } from "./recados.controller";
import { RecadosService } from "./recados.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Recado } from "./entities/recado.entity";
import { PessoasModule } from "../pessoas/pessoas.module";
import { RecadoUtils, RecadoUtilsMock } from "./recados.utils";
import {
    ONLY_LOWER_CASE_LETTERS_REGEX,
    REMOVE_SPACES_REGEX,
    SERVER_NAME,
} from "./recados.constant";
import { RemoveSpacesRegex } from "../common/regex/remove-spaces.regex";
import { OnlyLowerCaseLettersRegex } from "../common/regex/only-lower-case-letters.regex";

@Module({
    imports: [TypeOrmModule.forFeature([Recado]), forwardRef(() => PessoasModule)],
    controllers: [RecadosController],
    providers: [
        RecadosService,
        {
            provide: RecadoUtils,
            useValue: new RecadoUtilsMock(),
        },
        {
            provide: SERVER_NAME,
            useValue: "My name is NestJS",
        },
        {
            provide: ONLY_LOWER_CASE_LETTERS_REGEX,
            useClass: OnlyLowerCaseLettersRegex,
        },
        {
            provide: REMOVE_SPACES_REGEX,
            useClass: RemoveSpacesRegex,
        },
    ],
    exports: [RecadoUtils],
})
export class RecadosModule {}
