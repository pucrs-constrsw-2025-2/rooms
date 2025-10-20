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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FurnituresController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../../oauth/jwt-auth.guard");
const furnitures_service_1 = require("./furnitures.service");
let FurnituresController = class FurnituresController {
    furnituresService;
    constructor(furnituresService) {
        this.furnituresService = furnituresService;
    }
    create(_roomId, _payload) {
        return this.furnituresService.create();
    }
    findAll(_roomId) {
        return this.furnituresService.findAll();
    }
    findOne(_roomId, _furnitureId) {
        return this.furnituresService.findOne();
    }
    update(_roomId, _furnitureId, _payload) {
        return this.furnituresService.update();
    }
    patch(_roomId, _furnitureId, _payload) {
        return this.furnituresService.update();
    }
    remove(_roomId, _furnitureId) {
        return this.furnituresService.remove();
    }
};
exports.FurnituresController = FurnituresController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create furniture (scaffold)' }),
    (0, swagger_1.ApiResponse)({ status: 501, description: 'Not Implemented' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FurnituresController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List furnitures (scaffold)' }),
    (0, swagger_1.ApiResponse)({ status: 501, description: 'Not Implemented' }),
    __param(0, (0, common_1.Param)('roomId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FurnituresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':furnitureId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get furniture by id (scaffold)' }),
    (0, swagger_1.ApiResponse)({ status: 501, description: 'Not Implemented' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Param)('furnitureId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FurnituresController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':furnitureId'),
    (0, swagger_1.ApiOperation)({ summary: 'Replace furniture (scaffold)' }),
    (0, swagger_1.ApiResponse)({ status: 501, description: 'Not Implemented' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Param)('furnitureId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], FurnituresController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':furnitureId'),
    (0, swagger_1.ApiOperation)({ summary: 'Patch furniture (scaffold)' }),
    (0, swagger_1.ApiResponse)({ status: 501, description: 'Not Implemented' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Param)('furnitureId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], FurnituresController.prototype, "patch", null);
__decorate([
    (0, common_1.Delete)(':furnitureId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete furniture (scaffold)' }),
    (0, swagger_1.ApiResponse)({ status: 501, description: 'Not Implemented' }),
    __param(0, (0, common_1.Param)('roomId')),
    __param(1, (0, common_1.Param)('furnitureId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FurnituresController.prototype, "remove", null);
exports.FurnituresController = FurnituresController = __decorate([
    (0, swagger_1.ApiTags)('rooms.furnitures'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/v1/rooms/:roomId/furnitures'),
    __metadata("design:paramtypes", [furnitures_service_1.FurnituresService])
], FurnituresController);
//# sourceMappingURL=furnitures.controller.js.map