import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Rooms API')
    .setDescription('API para gerenciamento de salas e mobílias com autenticação OAuth')
    .setVersion('1.0.0')
    .addServer('http://localhost:8188', 'Servidor de desenvolvimento - Rooms API')
    .addServer('http://localhost:8180', 'Servidor de desenvolvimento - OAuth')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token JWT obtido via endpoint POST /login do serviço OAuth (http://localhost:8180/login)',
        name: 'Authorization',
        in: 'header',
      },
      'bearer',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    customSiteTitle: 'Rooms API - Swagger UI',
    customfavIcon: 'https://swagger.io/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .opblock-tag { font-size: 14px; padding: 8px 20px; }
      .swagger-ui .opblock-tag-section { margin-bottom: 10px; }
    `,
  });

  // Prefer the explicit internal port configured in docker-compose (ROOMS_INTERNAL_API_PORT)
  const port = process.env.PORT ?? process.env.ROOMS_INTERNAL_API_PORT ?? 3000;
  const host = '0.0.0.0';

  await app.listen(port, host);
  console.log(`🚀 Rooms API is running on http://${host}:${port}`);
  console.log(`📚 Swagger UI available at http://${host}:${port}/api/v1/docs`);
}

bootstrap();
