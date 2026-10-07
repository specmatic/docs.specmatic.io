// PetStore test fixture, kept outside the generic runner.
const http = require('node:http');
const fs = require('node:fs');
const { once } = require('node:events');
const expected = require('./pet.json');
async function main() {
  // Fail before starting mocks if a documented port belongs to another process.
  for (const port of [9000, 9002]) {
    const probe = http.createServer();
    probe.listen(port, '0.0.0.0');
    await once(probe, 'listening');
    await new Promise(resolve => probe.close(resolve));
  }
  const provider = http.createServer((request, response) => {
    if (request.method === 'GET' && request.url === '/pets/1') {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(expected));
    } else { response.writeHead(404); response.end(); }
  });
  provider.listen(0, '127.0.0.1');
  await once(provider, 'listening');
  fs.writeFileSync('provider-url.txt', `http://127.0.0.1:${provider.address().port}`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
