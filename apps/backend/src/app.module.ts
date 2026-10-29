import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarketModule } from './market/market.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { ScheduledJobsModule } from './scheduled-jobs/scheduled-jobs.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, MarketModule, AnalyticsModule, IngestionModule, ScheduledJobsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
