// NOTE: resources are served by another microservice. Do not implement here.
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

export const mapRoomToResponse = (room: RoomEntity): RoomResponse => ({
  _id: room.id,
  number: room.number,
  building: room.building,
  category: room.category,
  capacity: room.capacity,
  floor: room.floor,
  description: room.description,
  status: room.status,
  createdAt: room.createdAt,
  updatedAt: room.updatedAt,
  furnitures: room.furnitures,
  resources: room.resources,
});
