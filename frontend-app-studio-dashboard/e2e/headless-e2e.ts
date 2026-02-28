import { execFile } from 'node:child_process';
const CHROME_BIN = process.env.CHROME_BIN || 'google-chrome';
const BASE_URL = process.env.E2E_BASE_URL || 'http://127.0.0.1:4173';

type RouteCheck = {
  path: string;
  mustContain: string[];
};

const checks: RouteCheck[] = [
  {
    path: '/course/',
    mustContain: ['Studio Dashboard', 'Manage courses and libraries from one place.']
  },
  {
    path: '/dashboard',
    mustContain: ['LMS Dashboard', 'React migration entry for legacy LMS dashboard and learner-home flows.']
  },
  {
    path: '/system-status',
    mustContain: ['System Status', 'React migration for core health and status-oriented legacy endpoints.']
  }
];

async function dumpDom(url: string): Promise<string> {
  const { stdout, stderr } = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    execFile(
      CHROME_BIN,
      [
        '--headless=new',
        '--disable-gpu',
        '--no-sandbox',
        '--virtual-time-budget=20000',
        '--dump-dom',
        url
      ],
      { maxBuffer: 16 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ stdout, stderr });
      }
    );
  });

  if (!stdout || stdout.trim().length === 0) {
    throw new Error(`Empty DOM output for ${url}. stderr=${stderr || ''}`);
  }
  return stdout;
}

async function verifyRoute(check: RouteCheck): Promise<{ ok: boolean; detail: string }> {
  const url = `${BASE_URL}${check.path}`;
  try {
    const dom = await dumpDom(url);
    const missing = check.mustContain.filter((token) => !dom.includes(token));
    if (missing.length > 0) {
      return { ok: false, detail: `${check.path} missing tokens: ${missing.join(', ')}` };
    }
    return { ok: true, detail: `${check.path} passed` };
  } catch (error) {
    return { ok: false, detail: `${check.path} execution error: ${String(error)}` };
  }
}

async function main() {
  console.log(`Running TS headless e2e checks against ${BASE_URL}`);
  let hasFailure = false;
  for (const check of checks) {
    const result = await verifyRoute(check);
    const prefix = result.ok ? 'PASS' : 'FAIL';
    console.log(`${prefix}: ${result.detail}`);
    if (!result.ok) {
      hasFailure = true;
    }
  }

  if (hasFailure) {
    process.exit(1);
  }
  console.log('All headless e2e checks passed.');
}

main().catch((error) => {
  console.error(`Fatal e2e error: ${String(error)}`);
  process.exit(1);
});
