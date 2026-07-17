import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RecadosModule } from "../recados/recados.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PessoasModule } from "../pessoas/pessoas.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: "localhost",
            port: 5433,
            username: "postgres",
            database: "curso-nest",
            password: "senha",
            autoLoadEntities: true, // Carrega entidades sem precisar especificá-las
            synchronize: true, // Sincroniza com o BD
        }),
        RecadosModule,
        PessoasModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        // {
        //     provide: APP_FILTER,
        //     useClass: MyExceptionFilter,
        // },
    ],
})
export class AppModule implements NestModule {
    configure(_consumer: MiddlewareConsumer) {
        // consumer.apply(SimpleMiddleware).forRoutes({
        //     path: "*",
        //     method: RequestMethod.ALL,
        // });
    }
}
