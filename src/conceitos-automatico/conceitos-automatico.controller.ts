import { Controller, Get } from "@nestjs/common";
import { ConceitosAutomaticoService } from "./conceitos-automatico.service";

@Controller("conceitos-automatico")
export class ConceitosAutomaticoController {
    constructor(
        private readonly conceitosAutomaticoService: ConceitosAutomaticoService,
    ) {}

    @Get()
    home() {
        this.conceitosAutomaticoService.getHome();
    }
}
