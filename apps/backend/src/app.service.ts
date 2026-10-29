import { Injectable } from '@nestjs/common';
import { SHARED_APP_NAME } from '@vacancies-analysis/shared';

@Injectable()
export class AppService {
  getHealthStatus(): { status: string; app: string; timestamp: string } {
    return {
      status: 'ok',
      app: SHARED_APP_NAME,
      timestamp: new Date().toISOString(),
    };
  }
}
