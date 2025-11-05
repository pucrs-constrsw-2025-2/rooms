import { CreateRoomDto } from './dto/create-room.dto';
import { PatchRoomDto, UpdateRoomDto } from './dto/update-room.dto';
import { QueryRoomDto } from './dto/query-room.dto';
import { RoomsService } from './rooms.service';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    create(createRoomDto: CreateRoomDto): Promise<import("./entities/room.entity").RoomResponse>;
    findAll(query: QueryRoomDto): Promise<{
        items: import("./entities/room.entity").RoomResponse[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/room.entity").RoomResponse>;
    update(id: string, updateRoomDto: UpdateRoomDto): Promise<import("./entities/room.entity").RoomResponse>;
    patch(id: string, patchRoomDto: PatchRoomDto): Promise<import("./entities/room.entity").RoomResponse>;
    remove(id: string): Promise<void>;
}
