import { DynamicModule, Module } from "@nestjs/common";

export type MyDinamicModuleConfig = {
    apiKey: string;
    apiUrl: string;
};

export const MY_DINAMIC_CONFIG = "MY_DINAMIC_CONFIG";

@Module({})
export class MyDinamicModule {
    static register(config: MyDinamicModuleConfig): DynamicModule {
        return {
            module: MyDinamicModule,
            imports: [],
            providers: [
                {
                    provide: MY_DINAMIC_CONFIG,
                    useValue: config,
                },
            ],
            controllers: [],
            exports: [MY_DINAMIC_CONFIG],
            global: false,
        };
    }
}
