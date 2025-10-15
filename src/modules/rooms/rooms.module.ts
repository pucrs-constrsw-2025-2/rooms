// NOTE: resources are served by another microservice. Do not implement here.
import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../oauth/jwt-auth.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { FurnituresModule } from './furnitures/furnitures.module';
import { PrismaRoomRepository } from './prisma-room.repository';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  imports: [FurnituresModule],
  controllers: [RoomsController],
  providers: [RoomsService, PrismaRoomRepository, PrismaService, JwtAuthGuard],
  exports: [RoomsService],
})
export class RoomsModule {}

