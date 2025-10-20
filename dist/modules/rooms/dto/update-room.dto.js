"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatchRoomDto = exports.UpdateRoomDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const swagger_2 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
const create_room_dto_1 = require("./create-room.dto");
class UpdateRoomDto extends create_room_dto_1.CreateRoomDto {
}
exports.UpdateRoomDto = UpdateRoomDto;
class PatchRoomDto extends (0, swagger_2.PartialType)(create_room_dto_1.CreateRoomDto) {
    number;
    building;
    category;
    capacity;
    floor;
    description;
    status;
}
exports.PatchRoomDto = PatchRoomDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional updated room number',
        maxLength: 20,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 20),
    __metadata("design:type", String)
], PatchRoomDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional updated building identifier',
        maxLength: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 10),
    __metadata("design:type", String)
], PatchRoomDto.prototype, "building", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional updated category',
        maxLength: 10,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 10),
    __metadata("design:type", String)
], PatchRoomDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional updated capacity',
        minimum: 1,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], PatchRoomDto.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional updated floor',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PatchRoomDto.prototype, "floor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional updated description',
        maxLength: 255,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], PatchRoomDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional updated status',
        enum: client_1.RoomStatus,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.RoomStatus),
    __metadata("design:type", typeof (_a = typeof client_1.RoomStatus !== "undefined" && client_1.RoomStatus) === "function" ? _a : Object)
], PatchRoomDto.prototype, "status", void 0);
//# sourceMappingURL=update-room.dto.js.map