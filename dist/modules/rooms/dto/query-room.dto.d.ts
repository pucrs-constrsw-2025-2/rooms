import { RoomStatus } from '@prisma/client';
export declare class QueryRoomDto {
    page?: number;
    limit?: number;
    building?: string;
    category?: string;
    status?: RoomStatus;
    minCapacity?: number;
    maxCapacity?: number;
    number?: string;
}
