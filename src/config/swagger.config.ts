import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
    const config = new DocumentBuilder()
        .setTitle(process.env.APP_NAME)
        .setDescription(`The API documentation for ${process.env.APP_NAME}`)
        .setVersion('1.0')
        .addBasicAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api/docs', app, document);
}
