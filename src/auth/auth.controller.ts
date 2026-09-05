import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./dto/login.dto";
import { RefreshTokenDTO } from "./dto/refresh-token.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("login")
    login(@Body() dto: LoginDTO) {
        return this.authService.login(dto);
    }

    @Post("refresh")
    refresh(@Body() dto: RefreshTokenDTO) {
        return this.authService.refresh(dto);
    }
}
