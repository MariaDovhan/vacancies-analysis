import { describe, expect, it } from 'vitest';
import React from 'react';
import App from './App';

describe('Frontend Smoke Test - App component', () => {
  it('should create App element without throwing', () => {
    const element = React.createElement(App);
    expect(element).toBeDefined();
    expect(element.type).toBe(App);
  });
});
