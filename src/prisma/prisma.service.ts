// NOTE: resources are served by another microservice. Do not implement here.
import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    const on = (this.$on as unknown as ((event: 'beforeExit', callback: () => Promise<void>) => void) | undefined);
    on?.call(this, 'beforeExit', async () => {
      await app.close();
    });
  }
}
