import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Response } from "express";
import { map, Observable } from "rxjs";

export class ChangeDataInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            map(data => {
                if (Array.isArray(data)) {
                    return {
                        data,
                        count: data.length,
                    };
                }

                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return data;
            }),
        );
    }
}
