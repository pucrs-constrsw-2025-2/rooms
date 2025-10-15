// NOTE: resources are served by another microservice. Do not implement here.
import { Module } from '@nestjs/common';
import { JwtAuthGuard } from '../../../oauth/jwt-auth.guard';
import { FurnituresController } from './furnitures.controller';
import { FurnituresService } from './furnitures.service';

@Module({
  controllers: [FurnituresController],
  providers: [FurnituresService, JwtAuthGuard],
})
export class FurnituresModule {}
