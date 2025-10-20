"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FurnituresService = void 0;
const common_1 = require("@nestjs/common");
let FurnituresService = class FurnituresService {
    async create() {
        throw new common_1.NotImplementedException('Furnitures creation is not yet implemented.');
    }
    async findAll() {
        throw new common_1.NotImplementedException('Listing furnitures is not yet implemented.');
    }
    async findOne() {
        throw new common_1.NotImplementedException('Fetching a furniture item is not yet implemented.');
    }
    async update() {
        throw new common_1.NotImplementedException('Updating a furniture item is not yet implemented.');
    }
    async remove() {
        throw new common_1.NotImplementedException('Removing a furniture item is not yet implemented.');
    }
};
exports.FurnituresService = FurnituresService;
exports.FurnituresService = FurnituresService = __decorate([
    (0, common_1.Injectable)()
], FurnituresService);
//# sourceMappingURL=furnitures.service.js.map