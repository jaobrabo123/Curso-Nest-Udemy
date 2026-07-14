import { Controller, Get } from "@nestjs/common";
import { ConceitosManualService } from "./conceitos-manual.service";

@Controller("conceitos-manual")
export class ConceitosManualController {
    constructor(private readonly conceitosManualService: ConceitosManualService) {}

    @Get()
    home() {
        return this.conceitosManualService.solucionaHome();
    }
}
