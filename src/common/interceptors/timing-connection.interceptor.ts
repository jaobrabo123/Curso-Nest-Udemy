import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { tap } from "rxjs";

export class TimingConnectionInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>) {
        const start = Date.now();

        console.log("Antes");
        // await new Promise(res => setTimeout(res, 3000));

        return next.handle().pipe(
            tap(() => {
                const elapsedTime = Date.now() - start;

                console.log(`Depois, levou ${elapsedTime}ms para executar`);
            }),
        );
    }
}
