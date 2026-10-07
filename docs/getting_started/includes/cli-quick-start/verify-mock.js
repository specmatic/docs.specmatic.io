const assert = require('node:assert/strict');
const expected = require('./pet.json');
async function main() {
  const url = `http://localhost:${process.argv[2]}`;
  const named = await fetch(`${url}/pets/1`, { signal: AbortSignal.timeout(5000) });
  assert.equal(named.status, 200);
  assert.deepEqual(await named.json(), expected);
  const generated = await fetch(`${url}/pets/123`, { signal: AbortSignal.timeout(5000) });
  assert.equal(generated.status, 200);
  const body = await generated.json();
  assert.equal(typeof body.id, 'number');
  for (const field of ['name', 'type', 'status']) assert.equal(typeof body[field], 'string');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
