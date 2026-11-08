import test from 'node:test';
import assert from 'node:assert/strict';
import { SkillCategoriesService, initialState } from '../src/service.js';

const summary = (name, description = name) => ({ name, description, source: 'test', provider: 'test' });
function fixture(state) {
  let output = { skills: [summary('old-skill')], complete: true }; let saved = state ?? initialState(); let fail = false; let id = 0; const calls = []; const writes = [];
  const workspace = { id: 'workspace-1', get path() { return 'C:\\Allowed\\Project'; }, get title() { return 'Project'; } };
  let workspaces = [workspace];
  const service = new SkillCategoriesService({ state: saved, id: () => `category-${++id}`, skills: { snapshot: async options => { calls.push(options); if (output instanceof Error) throw output; return structuredClone(output); } },
    workspaces: () => workspaces, persist: async next => { await Promise.resolve(); if (fail) throw new Error('disk failed'); saved = structuredClone(next); writes.push(saved); } });
  return { service, calls, writes, get saved() { return saved; }, output: value => { output = value; }, fail: value => { fail = value; }, workspaces: value => { workspaces = value; },
    dispatch: (action, input = {}) => service.dispatch({ action, ...input }), snapshot: input => service.dispatch({ action: 'snapshot', ...input }) };
}

test('initial complete catalog establishes baseline, not a queue of old skills', async () => {
  const f = fixture(); const value = await f.snapshot();
  assert.equal(value.schemaVersion, 1); assert.equal(value.baseline, true); assert.equal(value.complete, true);
  assert.deepEqual(value.known, ['old-skill']); assert.deepEqual(value.pending, []); assert.deepEqual(f.calls, [{}]);
  assert.deepEqual(value.workspaces, [{ id: 'workspace-1', title: 'Project', cwd: 'C:\\Allowed\\Project' }]);
  assert.equal(value.cwd, null); assert.equal(value.revision, 1);
});

test('snapshot polling discovers additions without any change event and persists pending', async () => {
  const f = fixture(); await f.snapshot();
  f.output({ skills: [summary('old-skill'), summary('new-skill')], complete: true });
  const value = await f.snapshot(); assert.deepEqual(value.pending, ['new-skill']);
  const reloaded = fixture(f.saved); const after = await reloaded.snapshot();
  assert.deepEqual(after.pending, ['new-skill']); assert.deepEqual(after.known, ['old-skill', 'new-skill']);
});

test('incomplete catalog does not establish baseline or replace persisted last-good', async () => {
  const f = fixture(); f.output({ skills: [summary('partial')], complete: false });
  let value = await f.snapshot(); assert.equal(value.baseline, false); assert.equal(value.complete, false); assert.deepEqual(value.skills, []); assert.deepEqual(value.known, []); assert.equal(f.writes.length, 0);
  f.output({ skills: [summary('old-skill')], complete: true }); await f.snapshot();
  f.output({ skills: [summary('new-skill')], complete: false }); value = await f.snapshot();
  assert.deepEqual(value.skills.map(row => row.name), ['old-skill']); assert.deepEqual(value.known, ['old-skill']); assert.deepEqual(value.pending, []); assert.equal(value.complete, false);
  f.output(new Error('scan failed')); value = await f.snapshot(); assert.equal(value.complete, false); assert.equal(value.skills[0].name, 'old-skill');
});

test('last-good survives restart and malformed complete observation fails closed', async () => {
  const f = fixture(); await f.snapshot(); const loaded = fixture(f.saved);
  loaded.output({ skills: [{ name: 'not valid' }], complete: true });
  const value = await loaded.snapshot(); assert.equal(value.complete, false); assert.equal(value.skills[0].name, 'old-skill');
});

test('known, assignments, and pending are not pruned by deletion or reappearance', async () => {
  const f = fixture(); await f.snapshot(); await f.dispatch('assign', { names: ['old-skill'], categoryId: null, tags: ['retain'] });
  f.output({ skills: [summary('new-skill')], complete: true }); await f.snapshot();
  f.output({ skills: [], complete: true }); let value = await f.snapshot();
  assert.deepEqual(value.known, ['old-skill', 'new-skill']); assert.deepEqual(value.pending, ['new-skill']); assert.deepEqual(value.assignments['old-skill'].tags, ['retain']);
  f.output({ skills: [summary('old-skill'), summary('new-skill')], complete: true }); value = await f.snapshot(); assert.deepEqual(value.pending, ['new-skill']);
});

test('skills/change only invalidates and does not trust event data or scan', async () => {
  const f = fixture(); await f.snapshot(); const before = structuredClone(f.service.state); const count = f.calls.length;
  f.service.invalidate({ skills: [summary('injected')] }); assert.deepEqual(f.service.state, before); assert.equal(f.calls.length, count);
  const value = await f.dispatch('settings', { promptOnNew: false }); assert.equal(value.complete, false);
  assert.equal((await f.snapshot()).complete, true);
});

test('an invalidation during a scan makes it incomplete and preserves known', async () => {
  const f = fixture(); await f.snapshot();
  f.service.skills.snapshot = async () => { f.service.invalidate(); return { skills: [summary('new-skill')], complete: true }; };
  const value = await f.snapshot(); assert.equal(value.complete, false); assert.deepEqual(value.known, ['old-skill']);
});

test('category CRUD/reorder and deleting a category only unclassifies metadata', async () => {
  const f = fixture(); let value = await f.dispatch('category.create', { name: ' Writing ' }); const a = value.categories[0].id;
  value = await f.dispatch('category.create', { name: 'Coding' }); const b = value.categories[1].id;
  value = await f.dispatch('category.rename', { id: a, name: 'Text' }); assert.equal(value.categories[0].name, 'Text');
  value = await f.dispatch('category.reorder', { ids: [b, a] }); assert.deepEqual(value.categories.map(row => row.id), [b, a]);
  await f.dispatch('assign', { names: ['old-skill', 'new-skill'], categoryId: a, tags: [' useful ', 'useful', 'daily'] });
  value = await f.dispatch('category.delete', { id: a }); assert.deepEqual(value.categories.map(row => row.id), [b]);
  assert.deepEqual(value.assignments['old-skill'], { categoryId: null, tags: ['useful', 'daily'] });
  assert.deepEqual(value.assignments['new-skill'], { categoryId: null, tags: ['useful', 'daily'] }); assert.deepEqual(f.calls, []);
});

test('assignments are keyed by logical name across source and workspace changes', async () => {
  const f = fixture(); await f.snapshot(); await f.dispatch('assign', { names: ['old-skill'], categoryId: null, tags: ['global'] });
  f.output({ skills: [{ ...summary('old-skill'), provider: 'other', path: 'different' }], complete: true });
  const value = await f.snapshot({ cwd: 'c:/allowed/project/' }); assert.deepEqual(value.assignments['old-skill'], { categoryId: null, tags: ['global'] });
  assert.deepEqual(value.pending, []); assert.deepEqual(f.calls.at(-1), { cwd: 'C:\\Allowed\\Project' });
});

test('batch assign keeps tags when omitted and clears them for explicit empty list', async () => {
  const f = fixture(); await f.dispatch('assign', { names: ['a', 'b', 'a'], categoryId: null, tags: ['tag'] });
  let value = await f.dispatch('assign', { names: ['a', 'b'], categoryId: null }); assert.deepEqual(value.assignments.a.tags, ['tag']);
  value = await f.dispatch('assign', { names: ['a'], categoryId: null, tags: [] }); assert.deepEqual(value.assignments.a.tags, []); assert.deepEqual(value.assignments.b.tags, ['tag']);
});

test('each directory gets its own first baseline; dismiss/assign resolve names across catalogs', async () => {
  const f = fixture(); await f.snapshot(); await f.snapshot({ cwd: 'C:\\Allowed\\Project' });
  f.output({ skills: [summary('old-skill'), summary('a'), summary('b')], complete: true });
  await f.snapshot(); let value = await f.snapshot({ cwd: 'C:\\Allowed\\Project' }); assert.deepEqual(value.pending, ['a', 'b']);
  await f.dispatch('dismiss', { names: ['a'] }); value = await f.dispatch('assign', { names: ['b'], categoryId: null }); assert.deepEqual(value.pending, []);
  value = await f.snapshot({ cwd: 'C:\\Allowed\\Project' }); assert.deepEqual(value.pending, []);
});

test('disabling prompt does not lose new-skill inbox entries', async () => {
  const f = fixture(); await f.snapshot(); await f.dispatch('settings', { promptOnNew: false });
  f.output({ skills: [summary('new-skill')], complete: true }); const value = await f.snapshot(); assert.deepEqual(value.pending, ['new-skill']); assert.equal(value.settings.promptOnNew, false);
});

test('cwd authority is exact registry path, never request scope or arbitrary directories', async () => {
  const f = fixture();
  for (const input of [{ cwd: 'C:\\Other' }, { cwd: 'C:\\Allowed\\Project\\child' }, { cwd: 'relative' }, { scope: { cwd: 'C:\\Allowed\\Project' } }, { cwd: 'C:Allowed' }]) {
    await assert.rejects(f.snapshot(input), error => ['INVALID_CWD', 'INVALID_REQUEST'].includes(error.code));
  }
  assert.equal(f.calls.length, 0);
  await f.snapshot({ cwd: 'C:\\Allowed\\Project' }); f.workspaces([]);
  await assert.rejects(f.snapshot({ cwd: 'C:\\Allowed\\Project' }), { code: 'INVALID_CWD' });
  assert.deepEqual((await f.snapshot()).workspaces, []);
});

test('registry errors fail closed and cwd-like fake fields are not authorized', async () => {
  const f = fixture(); f.workspaces([{ id: 'fake', cwd: 'C:\\Fake' }]); await assert.rejects(f.snapshot({ cwd: 'C:\\Fake' }), { code: 'INVALID_CWD' });
  f.service.workspaces = () => { throw new Error('registry failed'); }; await assert.rejects(f.snapshot(), /registry failed/); assert.equal(f.calls.length, 0);
});

test('strict validation is atomic for unknown category, names, fields, and order', async () => {
  const f = fixture(); await f.dispatch('category.create', { name: 'A' }); const before = structuredClone(f.service.state);
  const invalid = [
    ['category.create', { name: 'a' }, 'DUPLICATE_CATEGORY'], ['category.rename', { id: 'missing', name: 'B' }, 'CATEGORY_NOT_FOUND'],
    ['category.delete', { id: 'missing' }, 'CATEGORY_NOT_FOUND'], ['category.reorder', { ids: [] }, 'INVALID_ORDER'],
    ['category.reorder', { ids: ['missing'] }, 'INVALID_ORDER'], ['category.create', { name: ' ' }, 'INVALID_NAME'],
    ['assign', { names: ['good', 'bad name'], categoryId: null }, 'INVALID_NAMES'], ['assign', { names: ['good'], categoryId: 'missing' }, 'CATEGORY_NOT_FOUND'],
    ['assign', { names: ['good'] }, 'INVALID_CATEGORY'], ['assign', { names: ['good'], categoryId: null, tags: [''] }, 'INVALID_TAGS'],
    ['dismiss', { names: [] }, 'INVALID_NAMES'], ['settings', { promptOnNew: 1 }, 'INVALID_SETTINGS'], ['snapshot', { scope: 'forged' }, 'INVALID_REQUEST'],
    ['category.create', { name: 'B', scope: 'forged' }, 'INVALID_REQUEST'], ['bogus', {}, 'INVALID_REQUEST'],
  ];
  for (const [action, args, code] of invalid) { await assert.rejects(f.dispatch(action, args), { code }); assert.deepEqual(f.service.state, before); }
});

test('serialized writes do not lose concurrent changes and revision conflict checks occur in chain', async () => {
  const f = fixture();
  const results = await Promise.all([f.dispatch('category.create', { name: 'A' }), f.dispatch('category.create', { name: 'B' }), f.dispatch('category.create', { name: 'C' })]);
  assert.deepEqual(results.map(value => value.revision), [1, 2, 3]); assert.equal(f.saved.categories.length, 3);
  const revision = f.saved.revision;
  const attempts = await Promise.allSettled([f.dispatch('settings', { promptOnNew: false, revision }), f.dispatch('category.create', { name: 'D', revision })]);
  assert.equal(attempts[0].status, 'fulfilled'); assert.equal(attempts[1].reason.code, 'REVISION_CONFLICT'); assert.equal(attempts[1].reason.details.revision, revision + 1);
  await assert.rejects(f.dispatch('settings', { promptOnNew: true, revision: -1 }), { code: 'INVALID_REVISION' });
});

test('persist failure does not commit state, poison queue, or lose future discoveries', async () => {
  const f = fixture(); f.fail(true); await assert.rejects(f.dispatch('category.create', { name: 'A' }), /disk failed/); assert.deepEqual(f.service.state, initialState());
  await assert.rejects(f.snapshot(), /disk failed/); assert.deepEqual(f.service.state, initialState());
  f.fail(false); const value = await f.snapshot(); assert.equal(value.baseline, true); assert.equal(value.revision, 1); assert.deepEqual(value.pending, []);
  await f.dispatch('category.create', { name: 'B' }); assert.equal(f.saved.categories.length, 1);
});

test('explicit cwd:null is the global view for snapshots and mutations', async () => {
  const f = fixture(); const first = await f.snapshot({ cwd: null });
  assert.equal(first.cwd, null); assert.deepEqual(f.calls, [{}]);
  let value = await f.dispatch('category.create', { cwd: null, name: 'Global' }); assert.equal(value.cwd, null);
  value = await f.dispatch('assign', { cwd: null, names: ['old-skill'], categoryId: value.categories[0].id });
  assert.equal(value.assignments['old-skill'].categoryId, value.categories[0].id);
  assert.deepEqual((await f.snapshot()).assignments, value.assignments);
});

test('constructor is a safe own assignment key and prototype-shaped invalid names are rejected', async () => {
  const f = fixture(); const before = Object.getOwnPropertyDescriptors(Object.prototype);
  let value = await f.dispatch('assign', { names: ['constructor'], categoryId: null });
  assert.equal(Object.hasOwn(value.assignments, 'constructor'), true);
  assert.deepEqual(value.assignments.constructor, { categoryId: null, tags: [] });
  value = await f.dispatch('assign', { names: ['constructor'], categoryId: null, tags: ['own'] });
  value = await f.dispatch('assign', { names: ['constructor'], categoryId: null }); assert.deepEqual(value.assignments.constructor.tags, ['own']);
  for (const name of ['__proto__', 'prototype.name', 'toString']) await assert.rejects(f.dispatch('assign', { names: [name], categoryId: null }), { code: 'INVALID_NAMES' });
  assert.deepEqual(Object.getOwnPropertyDescriptors(Object.prototype), before);
});

test('returned values and persisted copies cannot mutate internal state; stable polling is no-op', async () => {
  const f = fixture(); const first = await f.snapshot(); first.known.push('fake'); first.skills[0].name = 'fake'; f.saved.catalogs.global.known.push('external');
  const second = await f.snapshot(); assert.deepEqual(second.known, ['old-skill']); assert.equal(second.skills[0].name, 'old-skill'); assert.equal(second.revision, 1); assert.equal(f.writes.length, 1);
});
