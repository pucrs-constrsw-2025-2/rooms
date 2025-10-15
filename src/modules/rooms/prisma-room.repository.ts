// NOTE: resources are served by another microservice. Do not implement here.
import { Injectable } from '@nestjs/common';
import { Prisma, Room } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PrismaRoomRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.RoomCreateInput): Promise<Room> {
    return this.prisma.room.create({ data });
  }

  async findById(id: string): Promise<Room | null> {
    return this.prisma.room.findUnique({
      where: { id },
      include: {
        furnitures: true,
      },
    });
  }

  async findMany(params: Prisma.RoomFindManyArgs): Promise<Room[]> {
    return this.prisma.room.findMany({
      ...params,
      include: {
        furnitures: true,
      },
    });
  }

  async update(id: string, data: Prisma.RoomUpdateInput): Promise<Room> {
    return this.prisma.room.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Room> {
    return this.prisma.room.delete({ where: { id } });
  }
}
