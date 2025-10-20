import { Furniture, Resource, Room } from '@prisma/client';
export type RoomEntity = Room & {
    furnitures?: Furniture[];
    resources?: Resource[];
};
export type RoomResponse = Omit<Room, 'id'> & {
    _id: string;
    furnitures?: Furniture[];
    resources?: Resource[];
};
export declare const mapRoomToResponse: (room: RoomEntity) => RoomResponse;
