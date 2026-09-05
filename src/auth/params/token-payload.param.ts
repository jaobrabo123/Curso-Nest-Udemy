import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import { REQUEST_TOKEN_PAYLOAD_KEY } from "../auth.constants";

export const TokenPayloadParam = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return request[REQUEST_TOKEN_PAYLOAD_KEY];
});
