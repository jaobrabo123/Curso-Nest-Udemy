import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RecadosModule } from "../recados/recados.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PessoasModule } from "../pessoas/pessoas.module";
import { ConfigModule, ConfigType } from "@nestjs/config";
import appConfig from "./app.config";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            // load: [appConfig],
            // isGlobal: true,
            // validationSchema: Joi.object({
            //     DATABASE_TYPE: Joi.string().required(),
            //     DATABASE_HOST: Joi.string().required(),
            //     DATABASE_PORT: Joi.number().required(),
            //     DATABASE_USERNAME: Joi.string().required(),
            //     DATABASE_NAME: Joi.string().required(),
            //     DATABASE_PASSWORD: Joi.string().required(),
            //     DATABASE_AUTO_LOAD_ENTITIES: Joi.boolean().default(false),
            //     DATABASE_SYNCHRONIZE: Joi.boolean().default(false),
            // }),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(appConfig)],
            inject: [appConfig.KEY],
            useFactory: (appConfigurations: ConfigType<typeof appConfig>) => {
                return {
                    type: appConfigurations.database.type,
                    host: appConfigurations.database.host,
                    port: appConfigurations.database.port,
                    username: appConfigurations.database.username,
                    database: appConfigurations.database.database,
                    password: appConfigurations.database.password,
                    autoLoadEntities: appConfigurations.database.autoLoadEntities,
                    synchronize: appConfigurations.database.synchronize,
                };
            },
        }),
        RecadosModule,
        PessoasModule,
        AuthModule,
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
