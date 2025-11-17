// NOTE: resources are served by another microservice. Do not implement here.
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeController, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../oauth/jwt-auth.guard';
import { FurnituresService } from './furnitures.service';

@ApiTags('rooms.furnitures')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@ApiExcludeController()
@Controller('api/v1/rooms/:roomId/furnitures')
export class FurnituresController {
  constructor(private readonly furnituresService: FurnituresService) {}

  // TODO: implement furnitures CRUD
  @Post()
  @ApiOperation({ summary: 'Create furniture (scaffold)' })
  @ApiResponse({ status: 501, description: 'Not Implemented' })
  create(@Param('roomId') _roomId: string, @Body() _payload: unknown) {
    return this.furnituresService.create();
  }

  // TODO: implement furnitures CRUD
  @Get()
  @ApiOperation({ summary: 'List furnitures (scaffold)' })
  @ApiResponse({ status: 501, description: 'Not Implemented' })
  findAll(@Param('roomId') _roomId: string) {
    return this.furnituresService.findAll();
  }

  // TODO: implement furnitures CRUD
  @Get(':furnitureId')
  @ApiOperation({ summary: 'Get furniture by id (scaffold)' })
  @ApiResponse({ status: 501, description: 'Not Implemented' })
  findOne(@Param('roomId') _roomId: string, @Param('furnitureId') _furnitureId: string) {
    return this.furnituresService.findOne();
  }

  // TODO: implement furnitures CRUD
  @Put(':furnitureId')
  @ApiOperation({ summary: 'Replace furniture (scaffold)' })
  @ApiResponse({ status: 501, description: 'Not Implemented' })
  update(@Param('roomId') _roomId: string, @Param('furnitureId') _furnitureId: string, @Body() _payload: unknown) {
    return this.furnituresService.update();
  }

  // TODO: implement furnitures CRUD
  @Patch(':furnitureId')
  @ApiOperation({ summary: 'Patch furniture (scaffold)' })
  @ApiResponse({ status: 501, description: 'Not Implemented' })
  patch(@Param('roomId') _roomId: string, @Param('furnitureId') _furnitureId: string, @Body() _payload: unknown) {
    return this.furnituresService.update();
  }

  // TODO: implement furnitures CRUD
  @Delete(':furnitureId')
  @ApiOperation({ summary: 'Delete furniture (scaffold)' })
  @ApiResponse({ status: 501, description: 'Not Implemented' })
  remove(@Param('roomId') _roomId: string, @Param('furnitureId') _furnitureId: string) {
    return this.furnituresService.remove();
  }
}

