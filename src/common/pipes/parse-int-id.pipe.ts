import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class ParseIntIdPipe implements PipeTransform<unknown, unknown> {
    transform(value: unknown, metadata: ArgumentMetadata) {
        if (metadata.type !== "param" || metadata.data !== "id") {
            return value;
        }

        const parsedValue = Number(value);

        if (isNaN(parsedValue)) {
            throw new BadRequestException("Validation failed (numeric string is expected)");
        }

        if (parsedValue < 0) {
            throw new BadRequestException("Validation failed (positive number is expected)");
        }

        return value;
    }
}
