// NOTE: resources are served by another microservice. Do not implement here.
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, PrismaClientKnownRequestError } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { mapRoomToResponse } from './entities/room.entity';
import { PrismaRoomRepository } from './prisma-room.repository';
import { CreateRoomDto } from './dto/create-room.dto';
import { PatchRoomDto, UpdateRoomDto } from './dto/update-room.dto';
import { QueryRoomDto } from './dto/query-room.dto';
import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from './rooms.constants';

@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repository: PrismaRoomRepository,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    try {
      const created = await this.repository.create(createRoomDto);
      return this.findOne(created.id);
    } catch (error) {
      this.handlePrismaError(error, 'create');
    }
  }

  async findAll(query: QueryRoomDto) {
    const page = query.page ?? DEFAULT_PAGE;
    const incomingLimit = query.limit ?? DEFAULT_LIMIT;
    const limit = Math.min(incomingLimit, MAX_LIMIT);
    const skip = (page - 1) * limit;

    if (query.minCapacity && query.maxCapacity && query.minCapacity > query.maxCapacity) {
      throw new BadRequestException('minCapacity cannot be greater than maxCapacity');
    }

    const capacityFilter: Prisma.IntFilter = {};
    if (query.minCapacity !== undefined) {
      capacityFilter.gte = query.minCapacity;
    }
    if (query.maxCapacity !== undefined) {
      capacityFilter.lte = query.maxCapacity;
    }

    const where: Prisma.RoomWhereInput = {
      building: query.building,
      category: query.category,
      status: query.status,
      number: query.number,
      ...(Object.keys(capacityFilter).length > 0 ? { capacity: capacityFilter } : {}),
    };

    try {
      const [data, total] = await Promise.all([
        this.repository.findMany({
          skip,
          take: limit,
          where,
          orderBy: {
            number: 'asc',
          },
        }),
        this.prisma.room.count({ where }),
      ]);

      return {
        items: data.map(mapRoomToResponse),
        meta: {
          page,
          limit,
          total,
          totalPages: total === 0 ? 0 : Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.handlePrismaError(error, 'findAll');
    }
  }

  async findOne(id: string) {
    const room = await this.retrieveRoomById(id);
    if (!room) {
      throw new NotFoundException(`Room with id "${id}" was not found`);
    }

    return mapRoomToResponse(room);
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    try {
      await this.repository.update(id, updateRoomDto);
      return this.findOne(id);
    } catch (error) {
      this.handlePrismaError(error, 'update', id);
    }
  }

  async patch(id: string, patchRoomDto: PatchRoomDto) {
    try {
      await this.repository.update(id, patchRoomDto);
      return this.findOne(id);
    } catch (error) {
      this.handlePrismaError(error, 'patch', id);
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.repository.delete(id);
    } catch (error) {
      this.handlePrismaError(error, 'delete', id);
    }
  }

  private handlePrismaError(
    error: unknown,
    action: string,
    id?: string,
  ): never {
    void action;

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('A room with the same number already exists in this building');
      }

      if (error.code === 'P2025') {
        throw new NotFoundException(`Room with id "${id ?? 'unknown'}" was not found`);
      }
    }

    throw error;
  }

  private async retrieveRoomById(id: string) {
    return this.prisma.room.findUnique({
      where: { id },
      include: {
        furnitures: true,
      },
    });
  }
}
