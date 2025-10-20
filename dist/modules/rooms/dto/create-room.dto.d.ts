import { RoomStatus } from '@prisma/client';
export declare class CreateRoomDto {
    number: string;
    building: string;
    category: string;
    capacity: number;
    floor: number;
    description?: string;
    status?: RoomStatus;
}
