import { Prisma, Room } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export declare class PrismaRoomRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.RoomCreateInput): Promise<Room>;
    findById(id: string): Promise<Room | null>;
    findMany(params: Prisma.RoomFindManyArgs): Promise<Room[]>;
    update(id: string, data: Prisma.RoomUpdateInput): Promise<Room>;
    delete(id: string): Promise<Room>;
}
