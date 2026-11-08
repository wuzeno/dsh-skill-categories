import test from 'node:test';
import assert from 'node:assert/strict';
import * as module from 'node:module';
import { initialState } from '../src/service.js';
import { inject as explorerInject, ROUTES, apply as applyExplorer } from '../vendor/skill-explorer/host.js';

// Mock the schema dependency only. Host lifecycle/storage/HTTP are borrowed same-process fakes.
// No installed packages, plugin manager, filesystem mutations, or background processes are needed.
test('apply injects independent storage domain, browser fetch registration, invalidation and cleanup', { skip: typeof module.registerHooks !== 'function' ? 'Node 22.15+ required for dependency mocking hook' : false }, async () => {
  const indexURL = new URL('../index.js', import.meta.url).href;
  const zodMock = `const schema = new Proxy({}, { get: (_target, key) => key === 'safeParse' ? value => ({success: value !== null}) : (..._args) => schema }); export const z = schema;`;
  const hook = module.registerHooks({ resolve(specifier, context, nextResolve) {
    if (specifier === 'zod' && context.parentURL === indexURL) return { url: `data:text/javascript,${encodeURIComponent(zodMock)}`, shortCircuit: true };
    return nextResolve(specifier, context);
  } });
  let plugin;
  try { plugin = await import(indexURL); } finally { hook.deregister(); }
  const categoryInject = ['skills', 'agentPresets', 'storageDomain', 'connection', 'workspaceRegistry'];
  assert.deepEqual(plugin.inject, [...new Set([...categoryInject, ...explorerInject])]);
  assert.equal(new Set(plugin.inject).size, plugin.inject.length);
  for (const dependency of explorerInject) assert.ok(plugin.inject.includes(dependency));
  const hostRoutes = []; const hostDisposals = new Map();
  let spec; let registration; let scans = 0; let closed = false; let unregistered = false; let saved; const effects = []; const listeners = new Map();
  const ctx = {
    webServer: { register(route) { hostRoutes.push(route); return () => hostDisposals.set(route.path, (hostDisposals.get(route.path) ?? 0) + 1); } },
    sessions: { list: () => [] }, logger: { warn: error => { throw error; } },
    storageDomain: { async open(value) { spec = value; saved = structuredClone(value.global.initial); return { global: { get: () => structuredClone(saved), set: async value => { saved = structuredClone(value); } }, close: async () => { closed = true; } }; } },
    agentPresets: { defaultId: 'standard', acquireScope: async () => ({key:'standard-scope',async [Symbol.asyncDispose]() {}}), inspectCompositions: () => [{id:'standard',modules:[{moduleName:'@deepseek-ai/dsh-skill-filesystem'}],leakedServices:[]}] },
    skills: { snapshot: async options => { assert.deepEqual(options, {scope:'standard-scope'}); scans++; return { skills: [{ name: 'old', description: 'Old' }], complete: true }; } },
    workspaceRegistry: { list: () => [{ id: 'w', path: 'C:\\Workspace', title: 'Workspace' }] },
    connection: { browserPeer: { id: 'browser' }, admit: () => ({ peer: { id: 'browser' } }), fetch: { register(value) { registration = value; return () => { unregistered = true; }; } } },
    on: (event, callback) => { listeners.set(event, callback); }, effect: callback => { effects.push(callback()); },
  };
  await plugin.apply(ctx);
  assert.deepEqual(hostRoutes.map(route => route.path).sort(), Object.values(ROUTES).sort());
  assert.equal(new Set(hostRoutes.map(route => route.path)).size, hostRoutes.length, 'each explorer route is mounted exactly once');
  assert.equal(spec.name, 'skill_categories'); assert.equal(spec.version, 1); assert.deepEqual(spec.tables, {}); assert.deepEqual(saved, initialState());
  assert.equal(registration.path, '/api/skill-categories'); assert.deepEqual(registration.methods, ['POST']); assert.equal(registration.requestBody, 'streaming'); assert.equal(scans, 0);
  const snapshot = async () => (await (await registration.fetch(new Request('http://host/api/skill-categories', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-DSH-Skill-Categories': '1' }, body: '{"action":"snapshot"}' }))).json()).value;
  let value = await snapshot(); assert.equal(value.baseline, true); assert.deepEqual(value.pending, []); assert.equal(saved.catalogs.global.baseline, true);
  listeners.get('skills/change')({ names: ['fake'] }); assert.equal(scans, 1); assert.deepEqual(saved.catalogs.global.known, ['old']);
  value = await snapshot(); assert.equal(value.complete, true); assert.equal(scans, 2);
  for (const dispose of effects.reverse()) await dispose();
  assert.equal(closed, true); assert.equal(unregistered, true);
  assert.deepEqual([...hostDisposals.keys()].sort(), Object.values(ROUTES).sort());
  assert.ok([...hostDisposals.values()].every(count => count === 1), 'every explorer route is disposed exactly once');
});

function explorerContext() {
  const routes = []; const disposed = []; const effects = [];
  return { routes, disposed, ctx: {
    webServer: { register(route) { routes.push(route.path); return () => disposed.push(route.path); } },
    skills: {}, sessions: { list: () => [] }, logger: { warn() {} },
    effect(callback) { effects.push(callback()); },
  }, async close() { for (const dispose of effects.splice(0).reverse()) await dispose(); } };
}

test('vendored single-instance guard mounts once and hands over only after cleanup', async () => {
  const first = explorerContext(); const waiting = explorerContext(); const cancelled = explorerContext();
  try {
    applyExplorer(first.ctx);
    applyExplorer(waiting.ctx);
    applyExplorer(cancelled.ctx);
    assert.deepEqual(first.routes.sort(), Object.values(ROUTES).sort());
    assert.deepEqual(waiting.routes, []);
    assert.deepEqual(cancelled.routes, []);
    await cancelled.close();
    await first.close();
    await new Promise(resolve => queueMicrotask(resolve));
    assert.deepEqual(first.disposed.sort(), Object.values(ROUTES).sort());
    assert.deepEqual(waiting.routes.sort(), Object.values(ROUTES).sort());
    assert.deepEqual(cancelled.routes, [], 'a disposed waiting fiber must never mount');
    await waiting.close();
    assert.deepEqual(waiting.disposed.sort(), Object.values(ROUTES).sort());
  } finally {
    await cancelled.close(); await waiting.close(); await first.close();
  }
});

test('integrated apply passes explorer config through without changing category storage', async () => {
  const plugin = await import('../index.js');
  const explorer = explorerContext(); let spec; const effects = [];
  const ctx = { ...explorer.ctx,
    storageDomain: { async open(value) { spec = value; return { global: { get: () => structuredClone(value.global.initial), set: async () => {} }, close: async () => {} }; } },
    agentPresets: {}, workspaceRegistry: { list: () => [] },
    connection: { fetch: { register: () => () => {} } },
    on() {}, effect(callback) { effects.push(callback()); },
  };
  try {
    await plugin.apply(ctx, { enabled: false });
    assert.deepEqual(explorer.routes, [], 'enabled=false is forwarded to the original host');
    assert.equal(spec.name, 'skill_categories');
    assert.equal(spec.version, 1);
    assert.deepEqual(spec.global.initial, initialState());
  } finally { for (const dispose of effects.reverse()) await dispose(); }
});
