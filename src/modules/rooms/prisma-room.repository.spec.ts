import { PrismaRoomRepository } from './prisma-room.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { RoomStatus } from '@prisma/client';

describe('PrismaRoomRepository', () => {
  let repository: PrismaRoomRepository;
  let prisma: {
    room: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      room: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    repository = new PrismaRoomRepository(prisma as unknown as PrismaService);
  });

  it('should delegate create with provided data', async () => {
    const payload = { number: '101' };
    prisma.room.create.mockResolvedValue(payload);

    const result = await repository.create(payload as any);

    expect(prisma.room.create).toHaveBeenCalledWith({ data: payload });
    expect(result).toBe(payload);
  });

  it('should include furnitures when finding one', async () => {
    await repository.findById('room-1');

    expect(prisma.room.findUnique).toHaveBeenCalledWith({
      where: { id: 'room-1' },
      include: { furnitures: true },
    });
  });

  it('should include furnitures when listing rooms', async () => {
    const params = { take: 5, where: { status: RoomStatus.ACTIVE } };
    await repository.findMany(params);

    expect(prisma.room.findMany).toHaveBeenCalledWith({
      ...params,
      include: { furnitures: true },
    });
  });

  it('should forward update/delete operations', async () => {
    await repository.update('room-1', { capacity: 30 } as any);
    expect(prisma.room.update).toHaveBeenCalledWith({
      where: { id: 'room-1' },
      data: { capacity: 30 },
    });

    await repository.delete('room-1');
    expect(prisma.room.delete).toHaveBeenCalledWith({ where: { id: 'room-1' } });
  });
});
