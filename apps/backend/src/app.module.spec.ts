import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';

describe('Backend Smoke Test', () => {
  it('should compile the root application module', async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(moduleRef).toBeDefined();
  });
});
