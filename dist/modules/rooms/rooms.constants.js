"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_VALIDATION_ENDPOINT_PLACEHOLDER = exports.ROOM_STATUS_VALUES = exports.MAX_LIMIT = exports.DEFAULT_LIMIT = exports.DEFAULT_PAGE = void 0;
const client_1 = require("@prisma/client");
exports.DEFAULT_PAGE = 1;
exports.DEFAULT_LIMIT = 20;
exports.MAX_LIMIT = 100;
exports.ROOM_STATUS_VALUES = [
    client_1.RoomStatus.ACTIVE,
    client_1.RoomStatus.INACTIVE,
    client_1.RoomStatus.MAINTENANCE,
];
exports.JWT_VALIDATION_ENDPOINT_PLACEHOLDER = 'https://placeholder.oauth.service/validate-token';
//# sourceMappingURL=rooms.constants.js.map