// NOTE: resources are served by another microservice. Do not implement here.
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoomStatus } from '@prisma/client';
import { JwtAuthGuard } from '../../oauth/jwt-auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { PatchRoomDto, UpdateRoomDto } from './dto/update-room.dto';
import { QueryRoomDto } from './dto/query-room.dto';
import { RoomsService } from './rooms.service';

@ApiTags('rooms')
@ApiBearerAuth('bearer')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Room created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Room already exists' })
  async create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'List rooms with filters and pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'building', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'status', required: false, enum: RoomStatus })
  @ApiQuery({ name: 'minCapacity', required: false, type: Number })
  @ApiQuery({ name: 'maxCapacity', required: false, type: Number })
  @ApiQuery({ name: 'number', required: false })
  @ApiResponse({ status: HttpStatus.OK, description: 'Rooms fetched successfully' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async findAll(@Query() query: QueryRoomDto) {
    return this.roomsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve room by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Room found' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Replace an existing room' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Room updated successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Duplicate room detected' })
  async update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Patch partial room data' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Room patched successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Validation failed' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Duplicate room detected' })
  async patch(@Param('id') id: string, @Body() patchRoomDto: PatchRoomDto) {
    return this.roomsService.patch(id, patchRoomDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a room' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Room deleted successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Room not found' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.roomsService.remove(id);
  }
}
