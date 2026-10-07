// Convention-based shell example checks. No product-specific setup or assertions.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const timeout = Number(process.env.DOC_EXAMPLE_TIMEOUT_MS || 120_000);

function missingLines(expected, actual) {
  const lines = actual.replace(/\x1b\[[0-9;]*m/g, '').split(/\r?\n/);
  return expected.filter(line => !lines.some(actualLine => actualLine.includes(line)));
}
async function discover(folder) {
  const files = await fs.readdir(folder);
  const scripts = files.filter(file => file.endsWith('.sh')).sort();
  assert.ok(scripts.length, `No .sh examples in ${folder}`);
  for (const file of files.filter(file => /\.(terminaloutput|verify|exitcode)$/.test(file))) {
    assert.ok(files.includes(file.replace(/\.[^.]+$/, '.sh')), `Orphan companion file: ${file}`);
  }
  const scenarios = [];
  for (const script of scripts) {
    const stem = script.slice(0, -3);
    const output = `${stem}.terminaloutput`;
    assert.ok(files.includes(output), `Missing ${output} for ${script}`);
    const expected = (await fs.readFile(path.join(folder, output), 'utf8')).split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    assert.ok(expected.length, `Empty terminaloutput file: ${output}`);
    const exitText = files.includes(`${stem}.exitcode`) ? (await fs.readFile(path.join(folder, `${stem}.exitcode`), 'utf8')).trim() : '0';
    assert.match(exitText, /^\d+$/, `Invalid exitcode for ${script}`);
    const exitCode = Number(exitText);
    assert.ok(exitCode <= 255, `Invalid exitcode for ${script}`);
    const verify = files.includes(`${stem}.verify`) ? `${stem}.verify` : null;
    assert.ok(!verify || !files.includes(`${stem}.exitcode`), `Server example ${script} cannot have an exitcode companion`);
    scenarios.push({ script, output, expected, exitCode, verify });
  }
  return scenarios;
}
function start(script, cwd, name, setup = false) {
  const child = spawn('bash', ['-e', '-o', 'pipefail', '-c',
    setup ? 'if [[ -f .setup ]]; then source ./.setup; fi; bash -e -o pipefail "$1"' : 'exec bash -e -o pipefail "$1"',
    'doc-example', script], {
    cwd, detached: true, env: { ...process.env, DOC_EXAMPLE_NAME: name }, stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  let finished = false;
  child.stdout.on('data', chunk => { output += chunk; });
  child.stderr.on('data', chunk => { output += chunk; });
  const completion = new Promise(resolve => {
    child.once('error', error => { finished = true; output += error.message; resolve({ code: null }); });
    child.once('close', code => { finished = true; resolve({ code }); });
  });
  const signal = value => {
    if (!child.pid) return;
    try { process.kill(-child.pid, value); } catch (error) { if (error.code !== 'ESRCH') throw error; }
  };
  let expired = false;
  const timer = setTimeout(() => { expired = true; signal('SIGKILL'); }, timeout);
  completion.then(() => clearTimeout(timer));
  return { completion, signal, output: () => output, finished: () => finished, expired: () => expired };
}
async function stop(run) {
  // Kill the entire process group, including background services from .setup.
  run.signal('SIGTERM');
  const timer = setTimeout(() => run.signal('SIGKILL'), 2000);
  try { await run.completion; } finally { clearTimeout(timer); run.signal('SIGKILL'); }
}
async function check(folder, scenario) {
  const cwd = await fs.mkdtemp(path.join(os.tmpdir(), 'doc-example-'));
  let run;
  try {
    await fs.cp(folder, cwd, { recursive: true });
    console.log(`Checking ${scenario.script} against ${scenario.output}`);
    run = start(scenario.script, cwd, scenario.script, true);
    if (scenario.verify) {
      const deadline = Date.now() + timeout;
      while (missingLines(scenario.expected, run.output()).length && !run.finished() && Date.now() < deadline) await delay(100);
      assert.ok(!run.finished(), `Server command exited before verification:\n${run.output()}`);
      assert.deepEqual(missingLines(scenario.expected, run.output()), [], `Missing ${scenario.output} lines:\n${run.output()}`);
      const verification = start(scenario.verify, cwd, scenario.script);
      try {
        const result = await verification.completion;
        assert.ok(!verification.expired(), `Verification timed out:\n${verification.output()}`);
        assert.equal(result.code, 0, `Verification failed:\n${verification.output()}`);
        assert.ok(!run.finished(), `Server command exited during verification:\n${run.output()}`);
      } finally { await stop(verification); }
    } else {
      const result = await run.completion;
      assert.ok(!run.expired(), `Command timed out:\n${run.output()}`);
      assert.equal(result.code, scenario.exitCode, `Unexpected exit code:\n${run.output()}`);
      assert.deepEqual(missingLines(scenario.expected, run.output()), [], `Missing ${scenario.output} lines:\n${run.output()}`);
    }
    console.log(`PASS: ${scenario.script}`);
  } catch (error) { throw new Error(`${scenario.script}: ${error.message}`); }
  finally {
    if (run) await stop(run);
    await fs.rm(cwd, { recursive: true, force: true });
  }
}
async function main() {
  assert.equal(process.argv.length, 3, 'Usage: node scripts/check-doc-examples.js <folder>');
  assert.ok(Number.isFinite(timeout) && timeout > 0, 'DOC_EXAMPLE_TIMEOUT_MS must be positive');
  const folder = path.resolve(process.argv[2]);
  const scenarios = await discover(folder);
  for (const scenario of scenarios) await check(folder, scenario);
  console.log(`PASS: ${folder} — ${scenarios.length} command examples`);
}
main().catch(error => { console.error(error.stack); process.exitCode = 1; });
