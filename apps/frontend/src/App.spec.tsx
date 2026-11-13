import { describe, expect, it } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import App from './App';

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('Frontend Smoke Test', () => {
  it('should render the application without crashing', async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(<App />);
    });

    expect(container.innerHTML).toContain('Vacancies Analysis');
    expect(container.innerHTML).toContain('Frontend is running.');

    await act(async () => {
      root.unmount();
    });
    container.remove();
  });
});
