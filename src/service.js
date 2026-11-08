import { randomUUID } from 'node:crypto';
import path from 'node:path';

export class CategoriesError extends Error {
  constructor(code, message, details) { super(message); this.name = 'CategoriesError'; this.code = code; if (details !== undefined) this.details = details; }
}
export function requireValue(value, code, message) { if (!value) throw new CategoriesError(code, message); }
const clone = value => structuredClone(value);
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const fields = {
  snapshot: [], 'category.create': ['name'], 'category.rename': ['id', 'name'],
  'category.delete': ['id'], 'category.reorder': ['ids'], assign: ['names', 'categoryId', 'tags'],
  dismiss: ['names'], settings: ['promptOnNew'],
};
export function initialState() {
  return { schemaVersion: 1, revision: 0, categories: [], assignments: {}, settings: { promptOnNew: true }, catalogs: {} };
}
function normalizedCwd(cwd) {
  if (typeof cwd !== 'string' || !cwd || cwd.length > 4096 || /[\x00-\x1f]/.test(cwd)) return null;
  const api = /^[a-zA-Z]:[\\/]|^\\\\/.test(cwd) ? path.win32 : path;
  if (!api.isAbsolute(cwd)) return null;
  const value = api.normalize(cwd);
  const normalized = value.length > api.parse(value).root.length ? value.replace(/[\\/]+$/, '') : value;
  return api === path.win32 ? normalized.toLowerCase() : normalized;
}
function categoryName(value) {
  requireValue(typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 120 && !/[\x00-\x1f\x7f]/.test(value), 'INVALID_NAME', '分类名须为不超过120字符的非空文本。');
  return value.trim();
}
function namesList(value) {
  requireValue(Array.isArray(value) && value.length > 0 && value.length <= 2000 && value.every(name => typeof name === 'string' && name.length <= 160 && NAME.test(name)), 'INVALID_NAMES', '技能名称列表无效。');
  return [...new Set(value)];
}
function tagsList(value) {
  requireValue(Array.isArray(value) && value.length <= 50 && value.every(tag => typeof tag === 'string' && tag.trim().length > 0 && tag.trim().length <= 80 && !/[\x00-\x1f\x7f]/.test(tag)), 'INVALID_TAGS', '标签须为不超过50项的文本列表，每项最多80字符。');
  return [...new Set(value.map(tag => tag.trim()))];
}

/** Metadata only. Never calls skills.get/register or writes any skill source. */
export class SkillCategoriesService {
  constructor({ state = initialState(), persist, skills, workspaces, id = randomUUID }) {
    requireValue(state?.schemaVersion === 1, 'INVALID_STATE', '分类存储版本不支持。');
    this.state = clone(state); this.persist = persist; this.skills = skills; this.workspaces = workspaces; this.id = id;
    this.tail = Promise.resolve(); this.epoch = 0; this.observations = new Map();
  }
  invalidate() { this.epoch++; }
  run(task) {
    const result = this.tail.then(task);
    this.tail = result.catch(() => {});
    return result;
  }
  async allowedWorkspaces() {
    const rows = await this.workspaces();
    requireValue(Array.isArray(rows), 'WORKSPACE_UNAVAILABLE', '无法读取允许的工作区。');
    // Only registry-owned directory entries confer cwd authority, never a request's scope/id.
    return rows.filter(row => row && typeof row.id === 'string' && typeof row.path === 'string' && normalizedCwd(row.path)).map(row => ({ id: row.id, title: String(row.title ?? row.path), cwd: row.path }));
  }
  async view(input) {
    const workspaces = await this.allowedWorkspaces();
    if (input.cwd === undefined || input.cwd === null) return { cwd: null, key: 'global', workspaces };
    const normalized = normalizedCwd(input.cwd);
    const workspace = normalized && workspaces.find(row => normalizedCwd(row.cwd) === normalized);
    requireValue(workspace, 'INVALID_CWD', 'cwd必须是已登记的工作区目录。');
    return { cwd: workspace.cwd, key: `cwd:${normalized}`, workspaces };
  }
  async commit(next) {
    if (JSON.stringify(next) === JSON.stringify(this.state)) return;
    next.revision = this.state.revision + 1;
    await this.persist(clone(next));
    this.state = next;
  }
  catalog(state, key) {
    return state.catalogs[key] ??= { baseline: false, known: [], pending: [], lastGood: [] };
  }
  async refresh(view) {
    const epoch = this.epoch;
    let observation;
    try { observation = await this.skills.snapshot(view.cwd === null ? {} : { cwd: view.cwd }); }
    catch { this.observations.set(view.key, { complete: false, epoch }); return; }
    const valid = observation && Array.isArray(observation.skills) && observation.skills.every(skill => skill && typeof skill.name === 'string' && NAME.test(skill.name));
    const complete = valid && observation.complete === true && epoch === this.epoch;
    this.observations.set(view.key, { complete: false, epoch });
    if (!complete) return; // Partial/failed scans cannot establish baseline, discover, or replace last-good.
    const next = clone(this.state);
    const catalog = this.catalog(next, view.key);
    const skills = [...new Map(observation.skills.map(skill => [skill.name, clone(skill)])).values()];
    const known = new Set(catalog.known);
    for (const skill of skills) if (!known.has(skill.name)) {
      known.add(skill.name);
      if (catalog.baseline) catalog.pending.push(skill.name);
    }
    catalog.known = [...known]; catalog.pending = [...new Set(catalog.pending)]; catalog.baseline = true; catalog.lastGood = skills;
    await this.commit(next);
    this.observations.set(view.key, { complete: true, epoch });
  }
  result(view) {
    const state = this.state;
    const catalog = state.catalogs[view.key] ?? { baseline: false, known: [], pending: [], lastGood: [] };
    const observation = this.observations.get(view.key);
    return clone({ schemaVersion: 1, revision: state.revision, cwd: view.cwd, categories: state.categories, assignments: state.assignments,
      settings: state.settings, skills: catalog.lastGood, complete: observation?.complete === true && observation.epoch === this.epoch,
      baseline: catalog.baseline, known: catalog.known, pending: catalog.pending, workspaces: view.workspaces });
  }
  dispatch(input) {
    return this.run(async () => {
      requireValue(input && typeof input === 'object' && !Array.isArray(input) && own(fields, input.action), 'INVALID_REQUEST', '未知分类操作。');
      const allowed = new Set(['action', 'cwd', ...(input.action === 'snapshot' ? [] : ['revision']), ...fields[input.action]]);
      requireValue(Object.keys(input).every(key => allowed.has(key)), 'INVALID_REQUEST', '请求包含不支持的字段。');
      const view = await this.view(input);
      if (input.action === 'snapshot') { await this.refresh(view); return this.result(view); }
      if (input.revision !== undefined) {
        requireValue(Number.isSafeInteger(input.revision) && input.revision >= 0, 'INVALID_REVISION', 'revision须为非负整数。');
        if (input.revision !== this.state.revision) throw new CategoriesError('REVISION_CONFLICT', '分类数据已更新，请刷新后重试。', { revision: this.state.revision });
      }
      const next = clone(this.state);
      const findCategory = id => {
        const category = next.categories.find(item => item.id === id);
        requireValue(category, 'CATEGORY_NOT_FOUND', '分类不存在。'); return category;
      };
      const uniqueName = (name, except) => requireValue(!next.categories.some(item => item.id !== except && item.name.toLocaleLowerCase() === name.toLocaleLowerCase()), 'DUPLICATE_CATEGORY', '分类名已存在。');
      switch (input.action) {
        case 'category.create': {
          const name = categoryName(input.name); uniqueName(name);
          next.categories.push({ id: this.id(), name }); break;
        }
        case 'category.rename': {
          const category = findCategory(input.id); const name = categoryName(input.name); uniqueName(name, category.id); category.name = name; break;
        }
        case 'category.delete': {
          findCategory(input.id); next.categories = next.categories.filter(item => item.id !== input.id);
          for (const assignment of Object.values(next.assignments)) if (assignment.categoryId === input.id) assignment.categoryId = null;
          break;
        }
        case 'category.reorder': {
          requireValue(Array.isArray(input.ids) && input.ids.length === next.categories.length && new Set(input.ids).size === input.ids.length && input.ids.every(id => next.categories.some(category => category.id === id)), 'INVALID_ORDER', 'ids必须完整且不重复地列出所有分类。');
          next.categories = input.ids.map(id => findCategory(id)); break;
        }
        case 'assign': {
          const names = namesList(input.names);
          requireValue(input.categoryId === null || typeof input.categoryId === 'string', 'INVALID_CATEGORY', 'categoryId须为分类id或null。');
          if (input.categoryId !== null) findCategory(input.categoryId);
          const tags = input.tags === undefined ? undefined : tagsList(input.tags);
          for (const name of names) {
            const previous = own(next.assignments, name) ? next.assignments[name] : undefined;
            Object.defineProperty(next.assignments, name, { value: { categoryId: input.categoryId, tags: tags ?? previous?.tags ?? [] }, enumerable: true, writable: true, configurable: true });
          }
          for (const catalog of Object.values(next.catalogs)) catalog.pending = catalog.pending.filter(name => !names.includes(name));
          break;
        }
        case 'dismiss': {
          const names = namesList(input.names);
          for (const catalog of Object.values(next.catalogs)) catalog.pending = catalog.pending.filter(name => !names.includes(name));
          break;
        }
        case 'settings': {
          requireValue(typeof input.promptOnNew === 'boolean', 'INVALID_SETTINGS', 'promptOnNew须为布尔值。'); next.settings.promptOnNew = input.promptOnNew; break;
        }
      }
      await this.commit(next);
      return this.result(view);
    });
  }
}
