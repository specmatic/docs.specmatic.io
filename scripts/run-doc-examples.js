// Provision the latest Specmatic CLI, then invoke the generic example runner.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { spawn, execFile } = require('node:child_process');
const { promisify } = require('node:util');
const execute = promisify(execFile);
const editions = {
  oss: {
    artifact: 'io/specmatic/specmatic-executable-all', name: 'specmatic-executable-all',
    jarName: 'specmatic.jar', versionPattern: /Specmatic Version: v?([^\s(]+)/,
    jarVariable: 'SPECMATIC_JAR', versionVariable: 'SPECMATIC_VERSION',
  },
  enterprise: {
    artifact: 'io/specmatic/enterprise/executable-all', name: 'executable-all',
    jarName: 'specmatic-enterprise.jar', versionPattern: /Specmatic Enterprise v?([^\s(]+)/,
    jarVariable: 'SPECMATIC_ENTERPRISE_JAR', versionVariable: 'SPECMATIC_ENTERPRISE_VERSION',
  },
};
async function cachedJar(version, edition, config) {
  const directory = path.join(os.homedir(), '.specmatic');
  const target = path.join(directory, config.jarName);
  async function matches(file) {
    try {
      const { stdout } = await execute('java', ['-jar', file, '--version'], { timeout: 15_000 });
      return stdout.match(config.versionPattern)?.[1] === version;
    } catch { return false; }
  }
  if (await matches(target)) {
    console.log(`Using cached Specmatic ${edition} ${version}: ${target}`);
    return target;
  }
  await fs.mkdir(directory, { recursive: true });
  const url = `https://repo.maven.apache.org/maven2/${config.artifact}/${version}/${config.name}-${version}.jar`;
  console.log(`Downloading Specmatic ${edition} ${version} to ${target}`);
  const response = await fetch(url, { signal: AbortSignal.timeout(120_000) });
  assert.ok(response.ok, `Download failed: ${response.status} ${url}`);
  // Download into a unique temporary directory, then publish the complete JAR atomically.
  const download = await fs.mkdtemp(path.join(directory, '.docs-download-'));
  try {
    const temporary = path.join(download, 'specmatic.jar');
    await fs.writeFile(temporary, Buffer.from(await response.arrayBuffer()));
    assert.ok(await matches(temporary), `Downloaded JAR does not report Specmatic ${version}`);
    await fs.rename(temporary, target);
  } finally { await fs.rm(download, { recursive: true, force: true }); }
  return target;
}
async function runEdition(edition, folders) {
  const config = editions[edition];
  const localJar = process.env[config.jarVariable];
  let version = process.env[config.versionVariable];
  if (!localJar) {
    const response = await fetch(`https://repo.maven.apache.org/maven2/${config.artifact}/maven-metadata.xml`, { signal: AbortSignal.timeout(30_000) });
    assert.ok(response.ok, `Version lookup failed: ${response.status}`);
    version = (await response.text()).match(/<release>([^<]+)<\/release>/)?.[1];
    assert.ok(version, 'Maven metadata has no release version');
  } else {
    assert.ok(version, `Set ${config.versionVariable} when supplying a local JAR`);
    const { stdout } = await execute('java', ['-jar', path.resolve(localJar), '--version'], { timeout: 15_000 });
    assert.equal(stdout.match(config.versionPattern)?.[1], version, `Local JAR must be Specmatic ${edition} ${version}`);
  }
  console.log(`Testing Specmatic ${edition} ${version}`);
  const jar = localJar ? path.resolve(localJar) : await cachedJar(version, edition, config);
  const bin = await fs.mkdtemp(path.join(os.tmpdir(), 'doc-example-cli-'));
  try {
    // Both editions execute the exact same published commands and expectations.
    await fs.writeFile(path.join(bin, 'specmatic'), '#!/usr/bin/env bash\nexec java -jar "$DOC_EXAMPLE_JAR" "$@"\n', { mode: 0o755 });
    for (const folder of folders) {
      const code = await new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [path.join(__dirname, 'check-doc-examples.js'), folder], {
          stdio: 'inherit', env: { ...process.env, DOC_EXAMPLE_JAR: jar, SPECMATIC_EDITION: edition, PATH: `${bin}${path.delimiter}${process.env.PATH}` },
        });
        child.once('error', reject);
        child.once('exit', resolve);
      });
      assert.equal(code, 0, `Example checks failed for ${edition} ${version}: ${folder}`);
    }
    console.log(`PASS: Specmatic ${edition} ${version}`);
  } finally { await fs.rm(bin, { recursive: true, force: true }); }
}
async function main() {
  const args = process.argv.slice(2);
  const folders = [];
  let selected = 'both';
  while (args.length) {
    const arg = args.shift();
    if (arg === '--edition') selected = args.shift();
    else {
      assert.ok(!arg.startsWith('--'), `Unknown option: ${arg}`);
      folders.push(arg);
    }
  }
  assert.ok(['both', ...Object.keys(editions)].includes(selected), '--edition must be oss, enterprise, or both');
  if (!folders.length) folders.push(
    path.join(__dirname, '../docs/getting_started/includes/cli-quick-start'),
    path.join(__dirname, '../docs/contract_driven_development/includes/contract-testing'),
  );
  const failures = [];
  for (const edition of selected === 'both' ? Object.keys(editions) : [selected]) {
    try { await runEdition(edition, folders); }
    catch (error) { console.error(`FAIL: Specmatic ${edition}: ${error.message}`); failures.push(edition); }
  }
  assert.equal(failures.length, 0, `Failed editions: ${failures.join(', ')}`);
}
main().catch(error => { console.error(error.stack); process.exitCode = 1; });
