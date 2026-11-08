import { CategoriesError, requireValue } from './service.js';

export const API_PATH = '/api/skill-categories';
export const dispatch = (service, input) => service.dispatch(input);
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: {
  'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
} });
const MAX_BODY_BYTES = 256 * 1024;
async function readInput(request) {
  const length = Number(request.headers.get('Content-Length') ?? 0);
  requireValue(Number.isFinite(length) && length >= 0 && length <= MAX_BODY_BYTES, 'REQUEST_TOO_LARGE', '请求过大。');
  const reader = request.body?.getReader(); const chunks = []; let size = 0;
  if (reader) {
    try {
      while (true) {
        const part = await reader.read(); if (part.done) break;
        size += part.value.byteLength;
        requireValue(size <= MAX_BODY_BYTES, 'REQUEST_TOO_LARGE', '请求过大。'); chunks.push(part.value);
      }
    } finally { await reader.cancel().catch(() => {}); }
  }
  try { return JSON.parse(Buffer.concat(chunks, size).toString('utf8')); }
  catch { throw new CategoriesError('INVALID_JSON', '请求不是有效JSON。'); }
}

/** Shared HOST HTTP API only; browser-peer admission is required for reads and writes. */
export function createFetchHandler(service, connection) {
  return async request => {
    try {
      const admission = connection.admit({ headers: request.headers });
      if ('rejection' in admission) return json(admission.rejection, { ok: false, error: { code: 'UNAUTHENTICATED', message: '请从已登录的DSH界面使用技能分类。' } });
      if (!admission.peer || admission.peer.id !== connection.browserPeer.id) return json(403, { ok: false, error: { code: 'USER_ONLY', message: '仅允许已登录的浏览器用户管理技能分类。' } });
      if (request.method !== 'POST') return json(405, { ok: false, error: { code: 'METHOD_NOT_ALLOWED', message: '仅接受POST。' } });
      requireValue(request.headers.get('X-DSH-Skill-Categories') === '1' && request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() === 'application/json', 'INVALID_REQUEST', '请求格式不正确。');
      return json(200, { ok: true, value: await dispatch(service, await readInput(request)) });
    } catch (error) {
      const known = error instanceof CategoriesError;
      const status = error.code === 'REVISION_CONFLICT' ? 409 : error.code === 'REQUEST_TOO_LARGE' ? 413 : known ? 400 : 500;
      return json(status, { ok: false, error: { code: known ? error.code : 'INTERNAL_ERROR', message: known ? error.message : '技能分类操作失败，请重试。', ...(known && error.details !== undefined ? { details: error.details } : {}) } });
    }
  };
}
