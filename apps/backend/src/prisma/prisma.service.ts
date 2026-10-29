import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit(): Promise<void> {
    try {
      if (process.env.DATABASE_URL) {
        await this.$connect();
        this.logger.log('Connected to PostgreSQL via Prisma');
      } else {
        this.logger.warn('DATABASE_URL not set; skipping database connection on init');
      }
    } catch (error) {
      this.logger.warn(`Failed to connect to database on startup: ${(error as Error).message}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
