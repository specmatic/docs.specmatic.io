const fs = require('node:fs');
const name = process.env.DOC_EXAMPLE_NAME;
const url = process.argv[2];
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2));
const service = spec => ({ version: 3, systemUnderTest: { service: { $ref: '#/components/services/service', runOptions: { openapi: { type: 'test', baseUrl: url } } } }, components: { services: { service: { definitions: [{ definition: { source: { filesystem: { directory: '.' } }, specs: [{ spec: { path: spec } }] } }] } } } });
if (name === 'external-examples.sh') {
  fs.copyFileSync('external-examples-fixture/employees.yaml', 'employees.yaml');
  fs.cpSync('external-examples-fixture/employees_examples', 'employees_examples', { recursive: true });
}
if (name === 'boundary.sh') fs.copyFileSync('boundary-settings.yaml', 'specmatic.yaml');
if (name?.startsWith('filter-')) {
  const body = { type: 'object', required: ['id'], properties: { id: { type: 'integer' } } };
  const paths = {};
  for (const [route, method, statuses] of [
    ['/users','post',[201]], ['/users','get',[200]], ['/users/{id}','get',[200,404]],
    ['/users/{id}/profile','get',[200]], ['/products','post',[201]], ['/products','get',[200]],
    ['/products/{id}/v1','get',[200]], ['/unauthorized','get',[401]], ['/forbidden','get',[403]],
  ]) {
    const parameters = route.includes('{id}') ? [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' }, examples: Object.fromEntries(statuses.map(status => [`EXAMPLE_${status}`, { value: status === 404 ? 100 : 1 }])) }] : [];
    const responses = Object.fromEntries(statuses.map(status => [status, { description: 'Example response', content: { 'application/json': { schema: body, examples: { [`EXAMPLE_${status}`]: { value: { id: 1 } } } } } }]));
    const operation = { parameters, responses };
    if (method === 'post') operation.requestBody = { required: true, content: { 'application/json': { schema: body, examples: { EXAMPLE_201: { value: { id: 1 } } } } } };
    (paths[route] ||= {})[method] = operation;
  }
  write('filter-api.json', { openapi: '3.0.3', info: { title: 'Filter fixtures', version: '1' }, paths });
  write('specmatic.yaml', service('filter-api.json'));
}

if (name === 'configured-contracts.sh') {
  const { execFileSync } = require('node:child_process');
  fs.mkdirSync('contract-repo');
  fs.copyFileSync('employees.yaml', 'contract-repo/employees.yaml');
  const git = args => execFileSync('git', args, { cwd: 'contract-repo' });
  git(['init', '--initial-branch=main']);
  git(['add', 'employees.yaml']);
  git(['-c', 'user.name=Documentation fixture', '-c', 'user.email=docs@example.invalid', 'commit', '-m', 'Employee contract fixture']);
  const config = service('employees.yaml');
  config.components.services.service.definitions[0].definition.source = { git: { url: require('node:path').resolve('contract-repo') } };
  write('specmatic.yaml', config);
}
