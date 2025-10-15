// NOTE: resources are served by another microservice. Do not implement here.
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoomStatus } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({
    description: 'Unique room number within the building',
    example: '101A',
    maxLength: 20,
  })
  @IsString()
  @Length(1, 20)
  number!: string;

  @ApiProperty({
    description: 'Building identifier where the room is located',
    example: 'BLD1',
    maxLength: 10,
  })
  @IsString()
  @Length(1, 10)
  building!: string;

  @ApiProperty({
    description: 'Category describing the room usage',
    example: 'LAB',
    maxLength: 10,
  })
  @IsString()
  @Length(1, 10)
  category!: string;

  @ApiProperty({
    description: 'Total capacity of the room',
    example: 30,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  capacity!: number;

  @ApiProperty({
    description: 'Floor number where the room is located',
    example: 2,
  })
  @IsInt()
  floor!: number;

  @ApiPropertyOptional({
    description: 'Additional information about the room',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({
    description: 'Operational status of the room',
    enum: RoomStatus,
    default: RoomStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;
}

