const http = require('node:http');
const fs = require('node:fs');
const server = http.createServer((request, response) => {
  let raw = '';
  request.on('data', chunk => { raw += chunk; });
  request.on('end', () => {
    const route = new URL(request.url, 'http://localhost').pathname;
    let body;
    try { body = raw ? JSON.parse(raw) : {}; } catch { body = {}; }
    let status = request.method === 'POST' ? 201 : 200;
    if (route.endsWith('/100')) status = 404;
    if (route === '/unauthorized') status = 401;
    if (route === '/forbidden') status = 403;
    let result;
    if (route.startsWith('/users') || route.startsWith('/products') || route === '/unauthorized' || route === '/forbidden') result = { id: 1 };
    else if (status === 404) result = {};
    else {
      result = { id: 10, name: 'Jane Doe', department: 'Engineering', designation: 'Engineering Manager', ...body };
      if (request.method === 'GET' && route.endsWith('/employees')) result = [result];
    }
    response.writeHead(status, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(result));
  });
});
server.listen(0, '127.0.0.1', () => fs.writeFileSync('provider-url.txt', `http://127.0.0.1:${server.address().port}`));
