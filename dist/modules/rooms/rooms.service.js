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
exports.RoomsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const room_entity_1 = require("./entities/room.entity");
const prisma_room_repository_1 = require("./prisma-room.repository");
const rooms_constants_1 = require("./rooms.constants");
let RoomsService = class RoomsService {
    prisma;
    repository;
    constructor(prisma, repository) {
        this.prisma = prisma;
        this.repository = repository;
    }
    async create(createRoomDto) {
        try {
            const created = await this.repository.create(createRoomDto);
            return this.findOne(created.id);
        }
        catch (error) {
            this.handlePrismaError(error, 'create');
        }
    }
    async findAll(query) {
        const page = query.page ?? rooms_constants_1.DEFAULT_PAGE;
        const incomingLimit = query.limit ?? rooms_constants_1.DEFAULT_LIMIT;
        const limit = Math.min(incomingLimit, rooms_constants_1.MAX_LIMIT);
        const skip = (page - 1) * limit;
        if (query.minCapacity && query.maxCapacity && query.minCapacity > query.maxCapacity) {
            throw new common_1.BadRequestException('minCapacity cannot be greater than maxCapacity');
        }
        const capacityFilter = {};
        if (query.minCapacity !== undefined) {
            capacityFilter.gte = query.minCapacity;
        }
        if (query.maxCapacity !== undefined) {
            capacityFilter.lte = query.maxCapacity;
        }
        const where = {
            building: query.building,
            category: query.category,
            status: query.status,
            number: query.number,
            ...(Object.keys(capacityFilter).length > 0 ? { capacity: capacityFilter } : {}),
        };
        try {
            const [data, total] = await Promise.all([
                this.repository.findMany({
                    skip,
                    take: limit,
                    where,
                    orderBy: {
                        number: 'asc',
                    },
                }),
                this.prisma.room.count({ where }),
            ]);
            return {
                items: data.map(room_entity_1.mapRoomToResponse),
                meta: {
                    page,
                    limit,
                    total,
                    totalPages: total === 0 ? 0 : Math.ceil(total / limit),
                },
            };
        }
        catch (error) {
            this.handlePrismaError(error, 'findAll');
        }
    }
    async findOne(id) {
        const room = await this.retrieveRoomById(id);
        if (!room) {
            throw new common_1.NotFoundException(`Room with id "${id}" was not found`);
        }
        return (0, room_entity_1.mapRoomToResponse)(room);
    }
    async update(id, updateRoomDto) {
        try {
            await this.repository.update(id, updateRoomDto);
            return this.findOne(id);
        }
        catch (error) {
            this.handlePrismaError(error, 'update', id);
        }
    }
    async patch(id, patchRoomDto) {
        try {
            await this.repository.update(id, patchRoomDto);
            return this.findOne(id);
        }
        catch (error) {
            this.handlePrismaError(error, 'patch', id);
        }
    }
    async remove(id) {
        try {
            await this.findOne(id);
            await this.repository.delete(id);
        }
        catch (error) {
            this.handlePrismaError(error, 'delete', id);
        }
    }
    handlePrismaError(error, action, id) {
        void action;
        if (error instanceof client_1.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException('A room with the same number already exists in this building');
            }
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException(`Room with id "${id ?? 'unknown'}" was not found`);
            }
        }
        throw error;
    }
    async retrieveRoomById(id) {
        return this.prisma.room.findUnique({
            where: { id },
            include: {
                furnitures: true,
            },
        });
    }
};
exports.RoomsService = RoomsService;
exports.RoomsService = RoomsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        prisma_room_repository_1.PrismaRoomRepository])
], RoomsService);
//# sourceMappingURL=rooms.service.js.map