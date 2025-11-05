"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapRoomToResponse = void 0;
const mapRoomToResponse = (room) => ({
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
exports.mapRoomToResponse = mapRoomToResponse;
//# sourceMappingURL=room.entity.js.map