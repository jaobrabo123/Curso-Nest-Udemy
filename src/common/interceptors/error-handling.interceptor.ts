import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { catchError, throwError } from "rxjs";

export class ErrorHandlingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>) {
        return next.handle().pipe(
            catchError(error => {
                // console.log(error.name);
                // console.log(error.message);

                return throwError(() => {
                    // if (error.name === "NotFoundException") {
                    //     return new BadRequestException(error.message);
                    // }
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    return error;
                });
            }),
        );
    }
}
