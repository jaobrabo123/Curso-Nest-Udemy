import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { REQUEST_TOKEN_PAYLOAD_KEY, ROUTE_POLICY_KEY } from "../auth.constants";
import { RoutePolicies } from "../enums/route-policies.enum";
import { Request } from "express";
import { TokenPayloadDTO } from "../dto/token-payload.dto";
import { Pessoa } from "../../pessoas/entities/pessoa.entity";

@Injectable()
export class RoutePolicyGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const routePolicyRequired = this.reflector.get<RoutePolicies | undefined>(
            ROUTE_POLICY_KEY,
            context.getHandler(),
        );

        if (!routePolicyRequired) return true;

        const request = context.switchToHttp().getRequest<Request>();
        const tokenPayload = request[REQUEST_TOKEN_PAYLOAD_KEY] as TokenPayloadDTO | undefined;

        if (!tokenPayload) {
            throw new UnauthorizedException("Usuário não logado");
        }

        const pessoa = tokenPayload["pessoa"] as Pessoa;

        if (!pessoa.routePolicies.includes(routePolicyRequired)) {
            throw new UnauthorizedException("Usuário não autorizado");
        }

        return true;
    }
}
