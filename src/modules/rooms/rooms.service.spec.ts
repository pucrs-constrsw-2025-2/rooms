import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaRoomRepository } from './prisma-room.repository';
import { Prisma, RoomStatus } from '@prisma/client';
import { DEFAULT_LIMIT } from './rooms.constants';

const createPrismaError = (code: string) =>
  new Prisma.PrismaClientKnownRequestError('error', {
    code,
    clientVersion: '6.17.1',
  });

const createRoomEntity = () => {
  const now = new Date();
  return {
    id: 'room-1',
    number: '101',
    building: 'Main',
    category: 'Classroom',
    capacity: 20,
    floor: 1,
    description: null,
    status: RoomStatus.ACTIVE,
    createdAt: now,
    updatedAt: now,
    furnitures: [],
  };
};

describe('RoomsService', () => {
  let service: RoomsService;
  let prisma: jest.Mocked<PrismaService>;
  let repository: jest.Mocked<PrismaRoomRepository>;

  beforeEach(() => {
    prisma = {
      room: {
        count: jest.fn(),
        findUnique: jest.fn(),
      },
    } as unknown as jest.Mocked<PrismaService>;

    repository = {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PrismaRoomRepository>;

    service = new RoomsService(prisma, repository);
  });

  describe('create', () => {
    it('should persist a room and return the mapped response', async () => {
      const dto = { number: '101', building: 'Main', capacity: 20, category: 'Classroom', floor: 1 };
      const entity = createRoomEntity();

      repository.create.mockResolvedValue({ id: entity.id } as any);
      prisma.room.findUnique.mockResolvedValue(entity as any);

      const result = await service.create(dto as any);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        _id: entity.id,
        number: entity.number,
        building: entity.building,
        category: entity.category,
        capacity: entity.capacity,
        floor: entity.floor,
        description: entity.description,
        status: entity.status,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        furnitures: entity.furnitures,
        resources: undefined,
      });
    });

    it('should translate Prisma duplicate errors to ConflictException', async () => {
      const prismaError = createPrismaError('P2002');
      repository.create.mockRejectedValue(prismaError);

      await expect(
        service.create({} as any),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('should propagate unknown Prisma error codes without masking them', async () => {
      const prismaError = createPrismaError('P9999');
      repository.create.mockRejectedValue(prismaError);

      await expect(service.create({} as any)).rejects.toBe(prismaError);
    });

    it('should report unknown id when a P2025 error happens before an id exists', async () => {
      const prismaError = createPrismaError('P2025');
      repository.create.mockRejectedValue(prismaError);

      await expect(service.create({} as any)).rejects.toThrow(/unknown/);
    });
  });

  describe('findAll', () => {
    it('should paginate and map rooms', async () => {
      const entity = createRoomEntity();
      repository.findMany.mockResolvedValue([entity as any]);
      prisma.room.count.mockResolvedValue(1);

      const result = await service.findAll({ limit: 10, page: 2, building: 'Main' } as any);

      expect(repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
          where: expect.objectContaining({ building: 'Main' }),
        }),
      );
      expect(result.meta).toEqual({
        page: 2,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
      expect(result.items[0]._id).toBe(entity.id);
    });

    it('should refuse when minCapacity is greater than maxCapacity', async () => {
      await expect(
        service.findAll({ minCapacity: 20, maxCapacity: 10 } as any),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(repository.findMany).not.toHaveBeenCalled();
    });

    it('should default pagination values when query omits them', async () => {
      repository.findMany.mockResolvedValue([]);
      prisma.room.count.mockResolvedValue(0);

      const result = await service.findAll({} as any);

      expect(repository.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: DEFAULT_LIMIT,
        }),
      );
      expect(result.meta).toEqual({
        page: 1,
        limit: DEFAULT_LIMIT,
        total: 0,
        totalPages: 0,
      });
    });

    it('should apply capacity filters when range params are provided', async () => {
      repository.findMany.mockResolvedValue([createRoomEntity() as any]);
      prisma.room.count.mockResolvedValue(1);

      await service.findAll({ minCapacity: 10, maxCapacity: 30 } as any);

      const call = repository.findMany.mock.calls[0][0];
      expect(call.where.capacity).toEqual({ gte: 10, lte: 30 });
    });

    it('should propagate unexpected errors thrown by the repository', async () => {
      const unexpected = new Error('boom');
      repository.findMany.mockRejectedValue(unexpected);
      prisma.room.count.mockResolvedValue(0);

      await expect(service.findAll({} as any)).rejects.toBe(unexpected);
    });
  });

  describe('findOne', () => {
    it('should throw when room is missing', async () => {
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update & patch', () => {
    it('should re-fetch and return updated room', async () => {
      const entity = createRoomEntity();
      prisma.room.findUnique.mockResolvedValue(entity as any);
      repository.update.mockResolvedValue(entity as any);

      const payload = { capacity: 30 };
      const result = await service.update('room-1', payload as any);

      expect(repository.update).toHaveBeenCalledWith('room-1', payload);
      expect(result._id).toBe(entity.id);
    });

    it('should propagate NotFound when Prisma reports missing record', async () => {
      const prismaError = createPrismaError('P2025');
      repository.update.mockRejectedValue(prismaError);

      await expect(service.update('missing', {} as any)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should map duplicate errors during patch operations to ConflictException', async () => {
      const prismaError = createPrismaError('P2002');
      repository.update.mockRejectedValue(prismaError);

      await expect(service.patch('room-1', {} as any)).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete after ensuring the room exists', async () => {
      prisma.room.findUnique.mockResolvedValue(createRoomEntity() as any);
      repository.delete.mockResolvedValue({} as any);

      await service.remove('room-1');

      expect(repository.delete).toHaveBeenCalledWith('room-1');
    });

    it('should throw when the room does not exist', async () => {
      prisma.room.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toBeInstanceOf(NotFoundException);
      expect(repository.delete).not.toHaveBeenCalled();
    });
  });
});
