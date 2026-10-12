import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import { ValidationPipe } from "@nestjs/common";
import helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.use(helmet());
    app.enableCors({
        origin: "*",
    });

    const config = new DocumentBuilder()
        .setTitle("Recados API")
        .setVersion("1.0.0")
        .addBearerAuth({ type: "http" }, "accessToken")
        .addSecurityRequirements("accessToken")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api-docs", app, document);

    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
