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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreateRoomDto {
    number;
    building;
    category;
    capacity;
    floor;
    description;
    status;
}
exports.CreateRoomDto = CreateRoomDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique room number within the building',
        example: '101A',
        maxLength: 20,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 20),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "number", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Building identifier where the room is located',
        example: 'BLD1',
        maxLength: 10,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 10),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "building", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category describing the room usage',
        example: 'LAB',
        maxLength: 10,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(1, 10),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total capacity of the room',
        example: 30,
        minimum: 1,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateRoomDto.prototype, "capacity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Floor number where the room is located',
        example: 2,
    }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateRoomDto.prototype, "floor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional information about the room',
        maxLength: 255,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(255),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Operational status of the room',
        enum: client_1.RoomStatus,
        default: client_1.RoomStatus.ACTIVE,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.RoomStatus),
    __metadata("design:type", String)
], CreateRoomDto.prototype, "status", void 0);
//# sourceMappingURL=create-room.dto.js.map