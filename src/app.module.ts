// NOTE: resources are served by another microservice. Do not implement here.
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomsModule } from './modules/rooms/rooms.module';
import { HealthController, PrismaHealthIndicator } from './health.controller';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [TerminusModule, PrismaModule, RoomsModule],
  controllers: [AppController, HealthController],
  providers: [AppService, PrismaHealthIndicator],
})
export class AppModule {}
