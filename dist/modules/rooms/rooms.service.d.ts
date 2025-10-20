import { PrismaService } from '../../prisma/prisma.service';
import { PrismaRoomRepository } from './prisma-room.repository';
import { CreateRoomDto } from './dto/create-room.dto';
import { PatchRoomDto, UpdateRoomDto } from './dto/update-room.dto';
import { QueryRoomDto } from './dto/query-room.dto';
export declare class RoomsService {
    private readonly prisma;
    private readonly repository;
    constructor(prisma: PrismaService, repository: PrismaRoomRepository);
    create(createRoomDto: CreateRoomDto): Promise<import("./entities/room.entity").RoomResponse>;
    findAll(query: QueryRoomDto): Promise<{
        items: any;
        meta: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/room.entity").RoomResponse>;
    update(id: string, updateRoomDto: UpdateRoomDto): Promise<import("./entities/room.entity").RoomResponse>;
    patch(id: string, patchRoomDto: PatchRoomDto): Promise<import("./entities/room.entity").RoomResponse>;
    remove(id: string): Promise<void>;
    private handlePrismaError;
    private retrieveRoomById;
}
