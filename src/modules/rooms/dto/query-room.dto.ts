// NOTE: resources are served by another microservice. Do not implement here.
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RoomStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
} from 'class-validator';
import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from '../rooms.constants';

export class QueryRoomDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: DEFAULT_PAGE,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    description: 'Maximum number of items per page',
    default: DEFAULT_LIMIT,
    minimum: 1,
    maximum: MAX_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Max(MAX_LIMIT)
  limit?: number = DEFAULT_LIMIT;

  @ApiPropertyOptional({
    description: 'Filter by building',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  building?: string;

  @ApiPropertyOptional({
    description: 'Filter by category',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter by exact status',
    enum: RoomStatus,
  })
  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;

  @ApiPropertyOptional({
    description: 'Filter for minimum allowed capacity',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  minCapacity?: number;

  @ApiPropertyOptional({
    description: 'Filter for maximum allowed capacity',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  maxCapacity?: number;

  @ApiPropertyOptional({
    description: 'Filter for exact room number',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  number?: string;
}

