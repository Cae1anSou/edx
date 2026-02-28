import { execFile } from 'node:child_process';
const CHROME_BIN = process.env.CHROME_BIN || 'google-chrome';
const BASE_URL = process.env.E2E_BASE_URL || 'http://127.0.0.1:4173';

type CheckResult = { ok: boolean; detail: string };

async function dumpDom(url: string): Promise<string> {
  const { stdout, stderr } = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    execFile(
      CHROME_BIN,
      ['--headless=new', '--disable-gpu', '--no-sandbox', '--virtual-time-budget=20000', '--dump-dom', url],
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

async function checkPage(path: string, mustContain: string[]): Promise<CheckResult> {
  const url = `${BASE_URL}${path}`;
  try {
    const dom = await dumpDom(url);
    const missing = mustContain.filter((item) => !dom.includes(item));
    if (missing.length > 0) {
      return { ok: false, detail: `${path} missing: ${missing.join(', ')}` };
    }
    return { ok: true, detail: `${path} page check passed` };
  } catch (error) {
    return { ok: false, detail: `${path} page check error: ${String(error)}` };
  }
}

async function checkApi(name: string, run: () => Promise<void>): Promise<CheckResult> {
  try {
    await run();
    return { ok: true, detail: `${name} passed` };
  } catch (error) {
    return { ok: false, detail: `${name} failed: ${String(error)}` };
  }
}

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const results: CheckResult[] = [];

  results.push(
    await checkPage('/course/', ['Studio Dashboard', 'Manage courses and libraries from one place.'])
  );
  results.push(
    await checkPage('/dashboard', ['LMS Dashboard', 'React migration entry for legacy LMS dashboard and learner-home flows.'])
  );
  results.push(
    await checkPage('/system-status', ['System Status', 'React migration for core health and status-oriented legacy endpoints.'])
  );

  results.push(
    await checkApi('auth branch (no X-User-Id -> 401)', async () => {
      const response = await fetch(`${BASE_URL}/api/studio/v1/dashboard`);
      assert(response.status === 401, `expected 401, got ${response.status}`);
    })
  );

  results.push(
    await checkApi('auth branch (with X-User-Id -> 200)', async () => {
      const response = await fetch(`${BASE_URL}/api/studio/v1/dashboard`, {
        headers: {
          'X-User-Id': 'studio-react-user'
        }
      });
      assert(response.status === 200, `expected 200, got ${response.status}`);
      const body = await response.json();
      assert(body?.code === 'OK', `expected body.code=OK, got ${body?.code}`);
      assert(body?.data?.courses, 'expected courses in dashboard response');
    })
  );

  results.push(
    await checkApi('write branch (create course with INSTRUCTOR role -> 200)', async () => {
      const response = await fetch(`${BASE_URL}/api/studio/v1/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'studio-react-user',
          'X-Roles': 'INSTRUCTOR'
        },
        body: JSON.stringify({
          display_name: 'E2E Release Course',
          org: 'edX',
          number: `R${Date.now() % 100000}`,
          run: '2026'
        })
      });
      assert(response.status === 200, `expected 200, got ${response.status}`);
      const body = await response.json();
      assert(body?.code === 'OK', `expected body.code=OK, got ${body?.code}`);
      assert(body?.data?.url, 'expected created course url');
    })
  );

  results.push(
    await checkApi('error branch (invalid create course payload -> 400)', async () => {
      const response = await fetch(`${BASE_URL}/api/studio/v1/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': 'studio-react-user',
          'X-Roles': 'INSTRUCTOR'
        },
        body: JSON.stringify({
          display_name: '',
          org: '',
          number: '',
          run: ''
        })
      });
      assert(response.status === 400, `expected 400, got ${response.status}`);
      const body = await response.json();
      assert(body?.code === 'INVALID_ARGUMENT', `expected INVALID_ARGUMENT, got ${body?.code}`);
    })
  );

  let failed = false;
  console.log(`Release readiness E2E against ${BASE_URL}`);
  for (const result of results) {
    console.log(`${result.ok ? 'PASS' : 'FAIL'}: ${result.detail}`);
    if (!result.ok) {
      failed = true;
    }
  }

  if (failed) {
    process.exit(1);
  }
  console.log('All release readiness E2E checks passed.');
}

main().catch((error) => {
  console.error(`Fatal release readiness E2E error: ${String(error)}`);
  process.exit(1);
});
