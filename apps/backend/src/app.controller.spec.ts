import 'reflect-metadata';
import { describe, expect, it, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('Backend Smoke Test - AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return health status "ok"', () => {
    const health = appController.getHealth();
    expect(health.status).toBe('ok');
    expect(health.app).toBe('vacancies-analysis');
    expect(typeof health.timestamp).toBe('string');
  });
});
