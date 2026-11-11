import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MarketModule } from './market/market.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { ScheduledJobsModule } from './scheduled-jobs/scheduled-jobs.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [MarketModule, AnalyticsModule, IngestionModule, ScheduledJobsModule, PrismaModule],
  controllers: [AppController],
})
export class AppModule {}
