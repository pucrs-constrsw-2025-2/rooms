import { RoomStatus } from '@prisma/client';
import { CreateRoomDto } from './create-room.dto';
export declare class UpdateRoomDto extends CreateRoomDto {
}
declare const PatchRoomDto_base: import("@nestjs/common").Type<Partial<CreateRoomDto>>;
export declare class PatchRoomDto extends PatchRoomDto_base {
    number?: string;
    building?: string;
    category?: string;
    capacity?: number;
    floor?: number;
    description?: string;
    status?: RoomStatus;
}
export {};
