import { HealthCheckService } from '@nestjs/terminus';
import { HealthController, PrismaHealthIndicator } from './health.controller';
import { PrismaService } from './prisma/prisma.service';

describe('PrismaHealthIndicator', () => {
  it('should report UP when the database responds', async () => {
    const prisma = {
      $queryRaw: jest.fn().mockResolvedValue([1]),
    } as unknown as PrismaService;
    const indicator = new PrismaHealthIndicator(prisma);

    const result = await indicator.isHealthy('postgresql');

    expect(prisma.$queryRaw).toHaveBeenCalled();
    expect(result.postgresql.status).toBe('up');
  });

  it('should report DOWN when the database rejects', async () => {
    const prisma = {
      $queryRaw: jest.fn().mockRejectedValue(new Error('offline')),
    } as unknown as PrismaService;
    const indicator = new PrismaHealthIndicator(prisma);

    const result = await indicator.isHealthy('postgresql');

    expect(result.postgresql.status).toBe('down');
    expect(result.postgresql).toHaveProperty('message', 'offline');
  });
});

describe('HealthController', () => {
  let controller: HealthController;
  let healthService: { check: jest.Mock };
  let indicator: PrismaHealthIndicator;

  beforeEach(() => {
    healthService = {
      check: jest.fn(),
    };
    indicator = new PrismaHealthIndicator({
      $queryRaw: jest.fn(),
    } as unknown as PrismaService);
    controller = new HealthController(healthService as unknown as HealthCheckService, indicator);
  });

  it('should convert successful health checks into UP status', async () => {
    healthService.check.mockResolvedValue({
      status: 'ok',
      info: {
        postgresql: { status: 'up' },
      },
    });

    const response = await controller.check();

    expect(healthService.check).toHaveBeenCalledWith([expect.any(Function)]);
    expect(response).toEqual({
      status: 'UP',
      components: {
        postgresql: { status: 'UP' },
      },
    });
  });

  it('should convert errors to DOWN components', async () => {
    healthService.check.mockResolvedValue({
      status: 'error',
      info: {},
      error: {
        postgresql: { status: 'down', detail: 'unreachable' },
      },
    });

    const response = await controller.check();

    expect(response.status).toBe('DOWN');
    expect(response.components).toEqual({
      postgresql: {
        status: 'DOWN',
        details: { status: 'down', detail: 'unreachable' },
      },
    });
  });

  it('should handle responses that omit the info block entirely', async () => {
    healthService.check.mockResolvedValue({
      status: 'ok',
    });

    const response = await controller.check();

    expect(response).toEqual({
      status: 'UP',
      components: {},
    });
  });

  it('should ignore info entries that do not expose a status field', async () => {
    healthService.check.mockResolvedValue({
      status: 'ok',
      info: {
        cache: { healthy: true },
      },
    });

    const response = await controller.check();

    expect(response.components).toEqual({});
  });

  it('should mark components as DOWN when info reports a down status', async () => {
    healthService.check.mockResolvedValue({
      status: 'ok',
      info: {
        postgresql: { status: 'down' },
      },
    });

    const response = await controller.check();

    expect(response.components).toEqual({
      postgresql: { status: 'DOWN' },
    });
  });
});
