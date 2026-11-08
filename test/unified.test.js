import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createUnifiedTools } from '../src/unified.js';

const { filterGroups, createView } = createUnifiedTools();
const row = (name, extra = {}) => ({ name, description: '', ...extra });
const group = (key, skills) => ({ key, title: key, hint: `${key} hint`, skills });
const names = groups => groups.flatMap(item => item.skills.map(skill => skill.name));
const metadata = extra => ({ categories: [{ id: 'code', name: '开发工具' }, { id: 'write', name: 'Writing' }], assignments: {}, settings: { promptOnNew: true }, pending: [], ...extra });

function freeze(value) {
  if (value && typeof value === 'object') { Object.freeze(value); Object.values(value).forEach(freeze); }
  return value;
}

test('pure filter preserves disabled/provider rows, duplicate names, groups and row references', () => {
  const first = row('same', { path: '/one', modelInvocable: false });
  const second = row('same', { path: '/two', fileState: 'virtual' });
  const input = [group('local', [first]), group('provider', [second])];
  const result = filterGroups(input, metadata({ assignments: { same: { categoryId: 'code' } } }), { category: 'code' });
  assert.deepEqual(names(result), ['same', 'same']);
  assert.equal(result[0].skills[0], first);
  assert.equal(result[1].skills[0], second);
  assert.notEqual(result[0], input[0]);
});

test('deleted category is uncategorized, but its tags remain searchable', () => {
  const snapshot = metadata({ assignments: { old: { categoryId: 'deleted', tags: ['retained'] }, known: { categoryId: 'code' } } });
  const groups = [group('local', [row('old'), row('new'), row('known')])];
  assert.deepEqual(names(filterGroups(groups, snapshot, { category: 'uncategorized' })), ['old', 'new']);
  assert.deepEqual(names(filterGroups(groups, snapshot, { category: 'deleted' })), []);
  assert.deepEqual(names(filterGroups(groups, snapshot, { query: 'retained' })), ['old']);
});

test('assignment lookup ignores inherited names, including prototype-unsafe keys', () => {
  const assignments = Object.create({ inherited: { categoryId: 'code', tags: ['injected'] } });
  Object.defineProperty(assignments, '__proto__', { enumerable: true, value: { categoryId: 'write' } });
  const groups = [group('provider', ['inherited', 'constructor', 'toString', '__proto__'].map(name => row(name)))];
  assert.deepEqual(names(filterGroups(groups, metadata({ assignments }), { category: 'code' })), []);
  assert.deepEqual(names(filterGroups(groups, metadata({ assignments }), { category: 'uncategorized' })), ['inherited', 'constructor', 'toString']);
  assert.deepEqual(names(filterGroups(groups, metadata({ assignments }), { category: 'write' })), ['__proto__']);
  assert.deepEqual(names(filterGroups(groups, metadata({ assignments }), { query: 'injected' })), []);
});

test('query searches category name, tags, skill name and description case-insensitively', () => {
  const snapshot = metadata({ assignments: { alpha: { categoryId: 'code', tags: ['HTTP'] } } });
  const groups = [group('local', [row('alpha', { description: 'Network Debugger' }), row('beta')])];
  for (const query of [' 开发 ', 'http', 'ALPHA', 'debugger']) assert.deepEqual(names(filterGroups(groups, snapshot, { query })), ['alpha']);
  assert.deepEqual(names(filterGroups(groups, snapshot, { category: 'write', query: 'alpha' })), []);
  assert.deepEqual(names(filterGroups(groups, snapshot, { query: 'not present' })), []);
});

test('pending uses explicit union input, intersects row inventory and keeps duplicate rows', () => {
  const groups = [group('local', [row('same'), row('other')]), group('plugin', [row('same')])];
  assert.deepEqual(names(filterGroups(groups, metadata({ pending: ['other'] }), { category: 'pending', pending: ['same', 'same', 'missing'] })), ['same', 'same']);
  assert.deepEqual(names(filterGroups(groups, metadata({ pending: ['other'] }), { category: 'pending' })), []);
});

test('filter never mutates inputs and tolerates absent metadata/optional descriptions', () => {
  const groups = freeze([group('local', [row('a'), row('b', { description: undefined })]), group('empty', [])]);
  const snapshot = freeze(metadata({ assignments: { a: { categoryId: 'code', tags: ['tag'] } } }));
  const before = JSON.stringify({ groups, snapshot });
  assert.deepEqual(names(filterGroups(groups, snapshot, { query: 'tag' })), ['a']);
  assert.equal(JSON.stringify({ groups, snapshot }), before);
  assert.deepEqual(names(filterGroups(groups, null)), ['a', 'b']);
  assert.deepEqual(filterGroups(null, null), []);
});

test('factory survives toString inlining without module helpers or imports', () => {
  const factory = Function(`return (${createUnifiedTools.toString()})`)();
  assert.deepEqual(names(factory().filterGroups([group('local', [row('ok')])], null)), ['ok']);
});

const defaultPrefs = () => ({ levels: [], status: 'all', marks: [], collapsed: {} });
function nativeSelect(groups, filter) {
  return groups.filter(item => !filter.levels.length || filter.levels.includes(item.key)).map(item => ({ ...item,
    skills: item.skills.filter(skill => (filter.workspace === 'all' || !skill.workspaceRoot || skill.workspaceRoot === filter.workspace)
      && (filter.status === 'all' || (filter.status === 'enabled' ? skill.modelInvocable : !skill.modelInvocable))
      && (!filter.marks.length || filter.marks.some(mark => mark === 'linked' ? skill.linked : mark === 'no-file' ? skill.fileState === 'virtual' : skill.fileState === mark)))
  })).filter(item => item.skills.length);
}
function explorerStub(overrides = {}) {
  return {
    SkillRow: function NativeSkillRow() {}, selectGroups: nativeSelect,
    groupTitle: item => item.title, groupHintOf: item => item.hint,
    loadListPrefs: defaultPrefs, saveListPrefs() {}, listStorage: () => undefined,
    MARK_FACETS: ['provider-file', 'no-file', 'linked'], STATUS_FACETS: ['all', 'enabled', 'disabled'], ...overrides
  };
}

test('SSR needs no window and explicitly renders initial inventory/category loading', () => {
  const View = createView({ React, explorer: explorerStub(), controller: {}, useController: () => ({ views: {} }),
    styles: () => null, Button: ({ children, primary, ...props }) => React.createElement('button', props, children) });
  const html = renderToStaticMarkup(React.createElement(View, { api: { list() { throw new Error('must not run during SSR'); } } }));
  assert.match(html, /正在读取技能文件列表/);
  assert.match(html, /正在读取分类信息/);
  assert.match(html, /全部技能/);
  assert.match(html, /未分类/);
  assert.doesNotMatch(html, /尚未发现技能/);
});

// Minimal deterministic hook host: no DOM, third-party renderer or browser globals needed.
function harness({ payload = { groups: [], workspaces: [] }, snapshot = metadata(), api, refresh, prefs, views = {} } = {}) {
  const cells = []; let cursor = 0; let effects = []; let unmounted = false; let lateSets = 0; let tree;
  const opened = []; const mutations = []; const facets = [];
  const state = { views: snapshot ? { '': snapshot, ...views } : { ...views }, busy: false, error: '', feedback: '' };
  const ReactMock = {
    createElement(type, props, ...children) { return { type, props: { ...props, children: children.flat(Infinity).filter(value => value !== false && value != null) } }; },
    useState(initial) {
      const id = cursor++;
      if (!cells[id]) cells[id] = { value: typeof initial === 'function' ? initial() : initial };
      return [cells[id].value, next => { if (unmounted) lateSets++; cells[id].value = typeof next === 'function' ? next(cells[id].value) : next; }];
    },
    useRef(initial) { const id = cursor++; if (!cells[id]) cells[id] = { current: initial }; return cells[id]; },
    useEffect(fn, deps) {
      const id = cursor++; const old = cells[id];
      if (!old || !deps.every((value, i) => Object.is(value, old.deps[i]))) {
        cells[id] = { deps, cleanup: old?.cleanup };
        effects.push(() => { cells[id].cleanup?.(); cells[id].cleanup = fn(); });
      }
    }
  };
  const explorer = explorerStub({ loadListPrefs: () => prefs || defaultPrefs(), selectGroups(groups, filter) { facets.push(filter); return nativeSelect(groups, filter); } });
  const controller = {
    async refresh(...args) { if (refresh) return refresh(...args); return snapshot; },
    open(modal) { opened.push(modal); }, mutate(...args) { mutations.push(args); }, clearFeedback() {}
  };
  const Button = function Button() {};
  const View = createView({ React: ReactMock, explorer, controller, useController: () => state, styles: () => null, Button });
  const props = { api: api || { async list() { return payload; } }, onEdit() {}, onImport() {}, onDuplicate() {} };
  function render() { cursor = 0; tree = View(props); const queue = effects; effects = []; queue.forEach(fn => fn()); return tree; }
  function nodes(predicate) {
    const found = [];
    function visit(node) { if (!node || typeof node !== 'object') return; if (predicate(node)) found.push(node); node.props.children.forEach(visit); }
    visit(tree); return found;
  }
  function label(node) { return typeof node === 'string' || typeof node === 'number' ? String(node) : node?.props?.children.map(label).join('') || ''; }
  const button = title => nodes(node => node.type === Button && label(node) === title)[0];
  const input = aria => nodes(node => node.props['aria-label'] === aria)[0];
  async function settle() { await new Promise(resolve => setImmediate(resolve)); render(); }
  render();
  return { render, settle, nodes, button, input, label, opened, mutations, facets, state, props, explorer,
    rows: () => nodes(node => node.type === explorer.SkillRow),
    unmount() { unmounted = true; cells.forEach(cell => cell?.cleanup?.()); }, lateSets: () => lateSets };
}
const deferred = () => { let resolve; let reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };

test('native inventory is authoritative even when classification fails; invalid rows stay visible', async () => {
  const h = harness({ snapshot: null, refresh: async () => null, payload: { groups: [group('plugin', [row('same', { path: '/1', modelInvocable: false }), row('same', { path: '/2', fileState: 'virtual' }), row('Bad_Name')])], workspaces: [] } });
  await h.settle();
  assert.equal(h.rows().length, 3);
  assert.equal(h.button('批量分类').props.disabled, true);
  assert.equal(h.input('选择 Bad_Name').props.disabled, true);
  assert.ok(h.nodes(node => node.props.role === 'alert').some(node => h.label(node).includes('分类信息读取失败')));
  assert.ok(h.button('新建分类').props.disabled);
  for (const native of h.rows()) {
    assert.equal(native.props.api, h.props.api);
    assert.equal(native.props.onEdit, h.props.onEdit);
    assert.equal(native.props.onDuplicate, h.props.onDuplicate);
    assert.equal(typeof native.props.onChanged, 'function');
  }
});

test('logical-name selection synchronizes duplicate rows, excludes hidden/invalid names and uses global modal', async () => {
  const h = harness({ payload: { groups: [group('local', [row('same'), row('same'), row('other'), row('Bad_Name')])], workspaces: [] } });
  await h.settle();
  h.input('选择当前筛选的全部技能').props.onChange(); h.render();
  assert.equal(h.nodes(node => node.props['aria-label'] === '选择 same').filter(node => node.props.checked).length, 2);
  h.button('批量分类').props.onClick();
  assert.deepEqual(h.opened.pop(), { kind: 'assign', cwd: null, names: ['same', 'other'] });
  h.input('搜索技能名称、描述、标签或分类名').props.onChange({ target: { value: 'other' } }); h.render();
  h.button('批量分类').props.onClick();
  assert.deepEqual(h.opened.pop().names, ['other']);
  h.input('搜索技能名称、描述、标签或分类名').props.onChange({ target: { value: 'no-match' } }); h.render();
  assert.equal(h.button('批量分类').props.disabled, true);
  h.button('批量分类').props.onClick(); assert.equal(h.opened.length, 0);
});

test('collapsed rows cannot execute a hidden batch selection', async () => {
  const h = harness({ payload: { groups: [group('local', [row('one')])], workspaces: [] } });
  await h.settle();
  h.input('选择 one').props.onChange(); h.render();
  h.nodes(node => node.props.className === 'sc-group-title')[0].props.onClick(); h.render();
  assert.equal(h.rows().length, 0);
  assert.equal(h.button('批量分类').props.disabled, true);
});

test('rail counts ignore query, native facets are forwarded, pending unions all scopes within inventory', async () => {
  const snapshot = metadata({ assignments: { alpha: { categoryId: 'code' } }, pending: ['alpha'] });
  const h = harness({ snapshot, views: { '/work': metadata({ pending: ['beta', 'absent'] }) },
    payload: { groups: [group('local', [row('alpha', { modelInvocable: true }), row('beta', { modelInvocable: false })])], workspaces: [{ root: '/work', name: 'Work', active: true }] } });
  await h.settle();
  h.input('搜索技能名称、描述、标签或分类名').props.onChange({ target: { value: 'alpha' } }); h.render();
  const pendingFilter = h.nodes(node => node.props.className === 'sc-filter' && h.label(node).startsWith('新增待整理'))[0];
  assert.equal(h.label(pendingFilter), '新增待整理2');
  assert.equal(h.facets.at(-1).query, '');
  h.input('筛选工作区').props.onChange({ target: { value: '/work' } });
  h.input('筛选技能来源').props.onChange({ target: { value: 'local' } });
  h.input('筛选启用状态').props.onChange({ target: { value: 'disabled' } }); h.render();
  assert.deepEqual(h.facets.at(-1), { workspace: '/work', query: '', levels: ['local'], status: 'disabled', marks: [] });
  assert.equal(h.nodes(node => node.props.className === 'sc-filter' && h.label(node).startsWith('新增待整理')).map(h.label)[0], '新增待整理1');
});

test('CRUD/settings use global scope and deleted selected category resets to all immediately', async () => {
  const h = harness({ payload: { groups: [group('local', [row('alpha'), row('beta')])], workspaces: [] }, snapshot: metadata({ assignments: { alpha: { categoryId: 'code' } } }) });
  await h.settle();
  h.button('新建分类').props.onClick(); h.button('管理分类').props.onClick();
  assert.deepEqual(h.opened, [{ kind: 'create', cwd: null }, { kind: 'manage', cwd: null }]);
  h.nodes(node => node.type === 'input' && node.props.type === 'checkbox').at(-1).props.onChange({ target: { checked: false } });
  assert.deepEqual(h.mutations, [['settings', { promptOnNew: false }, null]]);
  h.nodes(node => node.props.className === 'sc-filter' && h.label(node).startsWith('开发工具'))[0].props.onClick(); h.render();
  assert.equal(h.rows().length, 1);
  h.state.views[''] = metadata(); h.state.views[''].categories = [];
  h.render(); assert.equal(h.rows().length, 2);
  assert.equal(h.nodes(node => node.props.className === 'sc-filter' && h.label(node).startsWith('全部技能'))[0].props['aria-pressed'], true);
});

test('refresh list failure retains last-good rows independently of successful metadata', async () => {
  let fail = false;
  const h = harness({ api: { async list() { if (fail) throw new Error('offline'); return { groups: [group('local', [row('kept')])], workspaces: [] }; } } });
  await h.settle(); fail = true;
  await h.button('刷新').props.onClick(); await h.settle();
  assert.equal(h.rows()[0].props.skill.name, 'kept');
  assert.ok(h.nodes(node => node.props.role === 'alert').some(node => h.label(node).includes('保留上次成功结果')));
});

test('marks retain native multi-select semantics and saved collapse preferences', async () => {
  const h = harness({ prefs: { levels: [], status: 'all', marks: ['linked'], collapsed: { local: true } },
    payload: { groups: [group('local', [row('link', { linked: true }), row('virtual', { fileState: 'virtual' }), row('plain')])], workspaces: [] } });
  await h.settle();
  assert.equal(h.rows().length, 0);
  const noFile = h.nodes(node => node.type === 'label' && h.label(node) === '无本地文件')[0];
  noFile.props.children[0].props.onChange(); h.render();
  assert.deepEqual(h.facets.at(-1).marks, ['linked', 'no-file']);
  h.nodes(node => node.props.className === 'sc-group-title')[0].props.onClick(); h.render();
  assert.deepEqual(h.rows().map(node => node.props.skill.name), ['link', 'virtual']);
});

test('inventory renders before metadata resolves and metadata retry does not reload files', async () => {
  const pending = deferred(); let lists = 0; let refreshes = 0;
  const snapshot = metadata();
  const h = harness({ snapshot: null,
    api: { async list() { lists++; return { groups: [group('local', [row('usable')])], workspaces: [] }; } },
    refresh() { refreshes++; return refreshes === 1 ? pending.promise : snapshot; } });
  await h.settle();
  assert.equal(h.rows().length, 1);
  assert.equal(h.button('批量分类').props.disabled, true);
  pending.resolve(null); await h.settle();
  h.state.views[''] = snapshot;
  await h.button('重试').props.onClick(); await h.settle();
  assert.equal(lists, 1);
  assert.equal(refreshes, 2);
  assert.equal(h.button('新建分类').props.disabled, false);
});

test('load sequence rejects stale success and cleanup prevents setters after unmount', async () => {
  const first = deferred(); const second = deferred(); let calls = 0;
  const h = harness({ api: { list: () => (++calls === 1 ? first.promise : second.promise) } });
  const loadingRefresh = h.button('读取中…');
  const newer = loadingRefresh.props.onClick(); // Direct invocation deliberately stresses overlapping loads.
  second.resolve({ groups: [group('local', [row('newest')])], workspaces: [] });
  await newer; await h.settle();
  first.resolve({ groups: [group('local', [row('stale')])], workspaces: [] });
  await h.settle(); assert.equal(h.rows()[0].props.skill.name, 'newest');
  const pending = deferred(); h.props.api = { list: () => pending.promise }; h.render();
  h.unmount(); pending.resolve({ groups: [], workspaces: [] });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(h.lateSets(), 0);
});
