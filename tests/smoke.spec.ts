import { spawn, type ChildProcess } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { createServer as createViteServer, type ViteDevServer } from 'vite';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

function createSocketPath(name: string): string {
  const unique = `${name}-${process.pid}-${Date.now()}`;
  if (process.platform === 'win32') {
    return `\\\\.\\pipe\\${unique}`;
  }
  return path.join(os.tmpdir(), `${unique}.sock`);
}

function httpGetSocket(
  socketPath: string,
  reqPath: string,
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const req = http.get({ socketPath, path: reqPath }, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode ?? 0, body: data });
      });
    });
    req.on('error', reject);
    req.setTimeout(2000, () => req.destroy(new Error('Request timeout')));
  });
}

async function waitForBackend(
  socketPath: string,
  proc: ChildProcess,
  logs: string[],
  timeoutMs = 15000,
): Promise<void> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (proc.exitCode !== null) {
      throw new Error(`Backend exited early with code ${proc.exitCode}:\n${logs.join('')}`);
    }
    try {
      const response = await httpGetSocket(socketPath, '/');
      if (response.status >= 200 && response.status < 400) {
        return;
      }
    } catch {
      // Backend not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Timed out waiting for backend at ${socketPath}. Logs:\n${logs.join('')}`);
}

function stopProcess(proc: ChildProcess | undefined): Promise<void> {
  if (!proc || proc.killed || proc.exitCode !== null) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const pid = proc.pid;
    if (process.platform === 'win32' && pid) {
      const killer = spawn('taskkill', ['/pid', String(pid), '/T', '/F'], {
        stdio: 'ignore',
      });
      killer.on('close', () => resolve());
      killer.on('error', () => resolve());
    } else {
      proc.once('exit', () => resolve());
      proc.kill('SIGTERM');
    }
  });
}

describe('Frontend and Backend integration smoke test', () => {
  let backendProcess: ChildProcess | undefined;
  let viteServer: ViteDevServer | undefined;
  let frontendHttpServer: http.Server | undefined;
  let backendSocketPath: string;
  let frontendSocketPath: string;

  beforeAll(async () => {
    backendSocketPath = createSocketPath('vacancies-backend');
    frontendSocketPath = createSocketPath('vacancies-frontend');

    const backendLogs: string[] = [];
    backendProcess = spawn(process.execPath, [path.resolve('apps/backend/dist/src/main.js')], {
      cwd: path.resolve('apps/backend'),
      env: { ...process.env, PORT: backendSocketPath },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    backendProcess.stdout?.on('data', (d: Buffer) => backendLogs.push(d.toString()));
    backendProcess.stderr?.on('data', (d: Buffer) => backendLogs.push(d.toString()));

    await waitForBackend(backendSocketPath, backendProcess, backendLogs);

    viteServer = await createViteServer({
      configFile: path.resolve('apps/frontend/vite.config.ts'),
      root: path.resolve('apps/frontend'),
      logLevel: 'silent',
      server: {
        middlewareMode: true,
      },
    });

    frontendHttpServer = http.createServer((req, res) => {
      const url = req.url ?? '/';
      if (url.startsWith('/api')) {
        const targetPath = url.replace(/^\/api/, '') || '/';
        const proxyReq = http.request(
          {
            socketPath: backendSocketPath,
            path: targetPath,
            method: req.method,
            headers: req.headers,
          },
          (proxyRes) => {
            res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
            proxyRes.pipe(res);
          },
        );
        proxyReq.on('error', (err) => {
          res.statusCode = 502;
          res.end(err.message);
        });
        req.pipe(proxyReq);
        return;
      }

      viteServer?.middlewares(req, res);
    });

    await new Promise<void>((resolve) => {
      frontendHttpServer?.listen(frontendSocketPath, () => resolve());
    });
  }, 30000);

  afterAll(async () => {
    await new Promise<void>((resolve) => {
      if (!frontendHttpServer) {
        resolve();
        return;
      }
      frontendHttpServer.close(() => resolve());
    });
    await viteServer?.close();
    await stopProcess(backendProcess);

    if (process.platform !== 'win32') {
      for (const sock of [backendSocketPath, frontendSocketPath]) {
        if (sock && fs.existsSync(sock)) {
          fs.unlinkSync(sock);
        }
      }
    }
  });

  it('should start both frontend and backend and verify HTTP interaction', async () => {
    const frontendResponse = await httpGetSocket(frontendSocketPath, '/');
    expect(frontendResponse.status).toBe(200);
    expect(frontendResponse.body).toContain('<div id="root"></div>');

    const apiResponse = await httpGetSocket(frontendSocketPath, '/api');
    expect(apiResponse.status).toBe(200);
    expect(apiResponse.body).toBe('ok');
  });
});
