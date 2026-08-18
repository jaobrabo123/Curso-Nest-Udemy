import { forwardRef, Module } from "@nestjs/common";
import { RecadosController } from "./recados.controller";
import { RecadosService } from "./recados.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Recado } from "./entities/recado.entity";
import { PessoasModule } from "../pessoas/pessoas.module";
import { RecadoUtils } from "./recados.utils";
// import { MyDinamicModule } from "../my-dinamic/my-dinamic.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Recado]),
        forwardRef(() => PessoasModule),
        // MyDinamicModule.register({
        //     apiKey: "atsdtad",
        //     apiUrl: "ajhgsdjhgajh",
        // }),
    ],
    controllers: [RecadosController],
    providers: [
        RecadosService,
        RecadoUtils,
        // RegexFactory,
        // {
        //     provide: REMOVE_SPACES_REGEX,
        //     useFactory: (regexFactory: RegexFactory) => {
        //         return regexFactory.create("RemoveSpacesRegex");
        //     },
        //     inject: [RegexFactory],
        // },
        // {
        //     provide: ONLY_LOWER_CASE_LETTERS_REGEX,
        //     useFactory: (regexFactory: RegexFactory) => {
        //         // console.log("Esperando a promise");
        //         // await new Promise(res => setTimeout(res, 3000));
        //         // console.log("Promise resolvida");
        //         return regexFactory.create("OnlyLowerCaseLettersRegex");
        //     },
        //     inject: [RegexFactory],
        // },
    ],
    exports: [RecadoUtils],
})
export class RecadosModule {}
