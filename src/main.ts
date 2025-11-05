import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefer the explicit internal port configured in docker-compose (ROOMS_INTERNAL_API_PORT)
  const port = process.env.PORT ?? process.env.ROOMS_INTERNAL_API_PORT ?? 3000;
  const host = '0.0.0.0';

  await app.listen(port, host);
  console.log(`🚀 Rooms API is running on http://${host}:${port}`);
}

bootstrap();
