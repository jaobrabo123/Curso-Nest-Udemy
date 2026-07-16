import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(BadRequestException)
export class MyExceptionFilter implements ExceptionFilter<BadRequestException> {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        const statusCode = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        const error =
            typeof exceptionResponse === "string"
                ? {
                      message: exceptionResponse,
                  }
                : exceptionResponse;

        res.status(statusCode).json({
            ...error,
            timestamp: new Date().toISOString(),
            path: req.url,
        });
    }
}
