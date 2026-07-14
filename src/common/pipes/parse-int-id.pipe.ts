import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseIntIdPipe implements PipeTransform {
    transform(value: unknown, metadata: ArgumentMetadata) {
        if (metadata.type !== "param" || metadata.data !== "id") {
            return value;
        }

        return value;
    }
}
