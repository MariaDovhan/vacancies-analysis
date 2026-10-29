import { describe, expect, it } from 'vitest';
import { SHARED_APP_NAME } from './index.js';

describe('Shared package smoke test', () => {
  it('should export the shared app constant correctly', () => {
    expect(SHARED_APP_NAME).toBe('vacancies-analysis');
  });
});
