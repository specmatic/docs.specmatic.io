const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { promisify } = require('node:util');
const execFile = promisify(require('node:child_process').execFile);
const runner = path.join(__dirname, 'check-doc-examples.js');

async function fixture(files, check, timeout = '3000') {
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), 'example-runner-test-'));
  try {
    for (const [file, value] of Object.entries(files)) await fs.writeFile(path.join(folder, file), value.replaceAll('__FIXTURE__', folder));
    let result;
    try {
      result = { ...(await execFile(process.execPath, [runner, folder], {
        env: { ...process.env, DOC_EXAMPLE_TIMEOUT_MS: timeout }, timeout: 10_000,
      })), code: 0 };
    } catch (error) { result = error; }
    await check(result, folder);
  } finally { await fs.rm(folder, { recursive: true, force: true }); }
}

test('discovers arbitrary scripts, sources setup, copies fixtures, and isolates scenarios', async () => {
  await fixture({
    '.setup': 'export GREETING=hello\n',
    'input.txt': 'fixture\n',
    '01-any-command.sh': 'printf "%s\\n" "$GREETING"\ncat input.txt\nprintf "stderr excerpt\\n" >&2\nprintf changed > input.txt\n',
    '01-any-command.terminaloutput': 'hello\nfixture\nstderr excerpt\n',
    '02-unrelated.sh': 'cat input.txt\n',
    '02-unrelated.terminaloutput': 'fixture\n',
  }, result => { assert.equal(result.code, 0, result.stderr); assert.match(result.stdout, /2 command examples/); });
});
test('checks documented output and explicit intentional failure code', async () => {
  await fixture({ 'failure.sh': 'echo expected failure\nexit 7\n', 'failure.terminaloutput': 'expected failure\n', 'failure.exitcode': '7\n' },
    result => assert.equal(result.code, 0, result.stderr));
});
test('rejects missing pairs, orphan output, mismatches, and unexpected failures', async () => {
  const cases = [
    [{ 'sample.sh': 'echo ok\n' }, /Missing sample.terminaloutput/],
    [{ 'sample.sh': 'echo ok\n', 'sample.terminaloutput': 'ok\n', 'unused.terminaloutput': 'unused\n' }, /Orphan companion/],
    [{ 'sample.sh': 'echo actual\n', 'sample.terminaloutput': 'expected\n' }, /Missing sample.terminaloutput lines/],
    [{ 'sample.sh': 'echo ok\nexit 3\n', 'sample.terminaloutput': 'ok\n' }, /Unexpected exit code/],
  ];
  for (const [files, message] of cases) await fixture(files, result => {
    assert.notEqual(result.code, 0); assert.match(result.stderr, message);
  });
});
test('verifies long-running commands and cleans up the server', async () => {
  await fixture({
    'server.sh': 'echo "$$" > "__FIXTURE__/server.pid"\necho ready\nsleep 30\n',
    'server.terminaloutput': 'ready\n',
    'server.verify': 'kill -0 "$(cat "__FIXTURE__/server.pid")"\n',
  }, async (result, folder) => {
    assert.equal(result.code, 0, result.stderr);
    const pid = Number(await fs.readFile(path.join(folder, 'server.pid'), 'utf8'));
    assert.throws(() => process.kill(pid, 0), { code: 'ESRCH' });
  });
});
test('timeouts stop a hanging command and report its name', async () => {
  await fixture({ 'hung.sh': 'echo started\nsleep 30\n', 'hung.terminaloutput': 'started\n' }, result => {
    assert.notEqual(result.code, 0); assert.match(result.stderr, /hung.sh: Command timed out/);
  }, '200');
});

test('a failed verifier and a server that exits early fail validation', async () => {
  await fixture({ 'server.sh': 'echo ready\nsleep 30\n', 'server.terminaloutput': 'ready\n', 'server.verify': 'echo broken verification >&2\nexit 1\n' }, result => {
    assert.notEqual(result.code, 0); assert.match(result.stderr, /Verification failed/);
  });
  await fixture({ 'server.sh': 'echo ready\n', 'server.terminaloutput': 'ready\n', 'server.verify': 'true\n' }, result => {
    assert.notEqual(result.code, 0); assert.match(result.stderr, /Server command exited/);
  });
});
