// NOTE: resources are served by another microservice. Do not implement here.
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { RoomStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, Length, MaxLength } from 'class-validator';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDto extends CreateRoomDto {
  // PUT keeps the same schema as CreateRoomDto.
}

export class PatchRoomDto extends PartialType(CreateRoomDto) {
  @ApiPropertyOptional({
    description: 'Optional updated room number',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  override number?: string;

  @ApiPropertyOptional({
    description: 'Optional updated building identifier',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  override building?: string;

  @ApiPropertyOptional({
    description: 'Optional updated category',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  override category?: string;

  @ApiPropertyOptional({
    description: 'Optional updated capacity',
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  override capacity?: number;

  @ApiPropertyOptional({
    description: 'Optional updated floor',
  })
  @IsOptional()
  @IsInt()
  override floor?: number;

  @ApiPropertyOptional({
    description: 'Optional updated description',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  override description?: string;

  @ApiPropertyOptional({
    description: 'Optional updated status',
    enum: RoomStatus,
  })
  @IsOptional()
  @IsEnum(RoomStatus)
  override status?: RoomStatus;
}

