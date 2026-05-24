import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConceitosManualModule } from "../conceitos-manual/conceitos-manual.modules";
import { ConceitosAutomaticoModule } from "../conceitos-automatico/conceitos-automatico.module";

@Module({
    imports: [ConceitosManualModule, ConceitosAutomaticoModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
