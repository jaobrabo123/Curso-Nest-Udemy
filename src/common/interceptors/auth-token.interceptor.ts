import {
    CallHandler,
    ExecutionContext,
    NestInterceptor,
    UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";

export class AuthTokenInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>) {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.headers.authorization?.split(" ")[1];

        if (token !== "123456") {
            throw new UnauthorizedException("Usuário não logado");
        }

        console.log("Seu token é:", token);

        return next.handle();
    }
}
