import test from 'node:test';
import assert from 'node:assert/strict';
import { createSkillCatalog } from '../src/catalog.js';

const FS = '@deepseek-ai/dsh-skill-filesystem';
function fixture() {
  const calls = []; const key = {}; let disposed = 0;
  const rows = [{ id: 'standard', modules: [{ moduleName: FS }], leakedServices: [] }];
  const agentPresets = {
    defaultId: 'standard', inspectCompositions: () => rows,
    acquireScope: async id => { calls.push(['acquire', id]); return { key, [Symbol.asyncDispose]: async () => { disposed++; } }; },
  };
  const summary = { name: 'user-skill', provider: 'filesystem', source: 'user-dsh', path: 'C:\\skills\\user-skill\\SKILL.md' };
  const skills = { snapshot: async options => { calls.push(['snapshot', options]); return { skills: [summary], complete: true }; } };
  return { agentPresets, skills, rows, summary, calls, key, get disposed() { return disposed; }, adapter: createSkillCatalog({ skills, agentPresets }) };
}

test('cold global catalog acquires default scope and reads scoped root registry', async () => {
  const f = fixture(); const result = await f.adapter.snapshot();
  assert.deepEqual(result, { skills: [f.summary], complete: true });
  assert.deepEqual(f.calls, [['acquire', 'standard'], ['snapshot', { scope: f.key }]]);
  assert.equal(f.disposed, 1);
});

test('workspace cwd and cancellation are forwarded but caller scope cannot override lease', async () => {
  const f = fixture(); const controller = new AbortController();
  await f.adapter.snapshot({ cwd: 'C:\\Allowed', signal: controller.signal, scope: 'untrusted' });
  assert.deepEqual(f.calls[1], ['snapshot', { cwd: 'C:\\Allowed', scope: f.key, signal: controller.signal }]);
  assert.equal(f.disposed, 1);
});

test('global null cwd is omitted, not replaced with process cwd', async () => {
  const f = fixture(); await f.adapter.snapshot({ cwd: null });
  assert.deepEqual(f.calls[1][1], { scope: f.key });
});

test('snapshot failures still dispose lease and propagate for last-good handling', async () => {
  const f = fixture(); f.skills.snapshot = async () => { throw new Error('unavailable'); };
  await assert.rejects(f.adapter.snapshot(), /unavailable/); assert.equal(f.disposed, 1);
});

test('acquisition failure is not downgraded to a complete empty catalog', async () => {
  const f = fixture(); f.agentPresets.acquireScope = async () => { throw new Error('broken preset'); };
  await assert.rejects(f.adapter.snapshot(), /broken preset/); assert.equal(f.disposed, 0);
});

test('registry partial/malformed observations never become complete', async () => {
  const f = fixture(); f.skills.snapshot = async () => ({ skills: [f.summary], complete: false });
  assert.equal((await f.adapter.snapshot()).complete, false);
  f.skills.snapshot = async () => ({ complete: true });
  assert.deepEqual(await f.adapter.snapshot(), { skills: [], complete: false }); assert.equal(f.disposed, 2);
});

test('default switch during read invalidates completion', async () => {
  const f = fixture(); f.skills.snapshot = async () => { f.agentPresets.defaultId = 'ptc'; return { skills: [f.summary], complete: true }; };
  assert.equal((await f.adapter.snapshot()).complete, false); assert.equal(f.disposed, 1);
});

test('missing presets, registry, inventory or selected declaration fail closed', async () => {
  for (const services of [{}, { skills: {} }, { agentPresets: {} }]) {
    assert.deepEqual(await createSkillCatalog(services).snapshot(), { skills: [], complete: false });
  }
  const f = fixture(); delete f.agentPresets.inspectCompositions;
  assert.deepEqual(await f.adapter.snapshot(), { skills: [], complete: false });
  assert.equal(f.disposed, 1); assert.equal(f.calls.length, 1);
});

test('preset-owned skills registry is not mistaken for root catalog', async () => {
  const f = fixture(); f.rows[0].modules.push({ moduleName: '@deepseek-ai/dsh-skill' });
  assert.deepEqual(await f.adapter.snapshot(), { skills: [], complete: false });
  assert.equal(f.disposed, 1); assert.equal(f.calls.length, 1);
});

test('minimal/providerless preset and ambiguous retained revision fail closed', async () => {
  const f = fixture(); f.rows[0].modules = [];
  assert.equal((await f.adapter.snapshot()).complete, false);
  f.rows[0].modules = [{ moduleName: FS }];
  f.rows.push({ id: 'standard', modules: [], leakedServices: [] });
  assert.equal((await f.adapter.snapshot()).complete, false); assert.equal(f.disposed, 2);
});

test('abort before acquisition and after acquisition both honor lifetime', async () => {
  const f = fixture(); const a = new AbortController(); a.abort();
  await assert.rejects(f.adapter.snapshot({ signal: a.signal }), { name: 'AbortError' }); assert.equal(f.calls.length, 0);
  const b = new AbortController(); const acquire = f.agentPresets.acquireScope;
  f.agentPresets.acquireScope = async id => { const lease = await acquire(id); b.abort(); return lease; };
  await assert.rejects(f.adapter.snapshot({ signal: b.signal }), { name: 'AbortError' }); assert.equal(f.disposed, 1);
});

test('inspection throws still release lease', async () => {
  const f = fixture(); f.agentPresets.inspectCompositions = () => { throw new Error('inventory failed'); };
  await assert.rejects(f.adapter.snapshot(), /inventory failed/); assert.equal(f.disposed, 1);
});
