import test from 'node:test';
import assert from 'node:assert/strict';
import { API_PATH, createFetchHandler, dispatch } from '../src/http.js';
import { SkillCategoriesService, initialState } from '../src/service.js';

function fixture(peer = 'browser') {
  let saved = initialState();
  const service = new SkillCategoriesService({ state: saved, persist: async state => { saved = state; }, skills: { snapshot: async () => ({ skills: [], complete: true }) }, workspaces: () => [] });
  let admissionCalls = 0;
  const connection = { browserPeer: { id: 'browser' }, admit: ({ headers }) => { admissionCalls++; assert.ok(headers instanceof Headers); return peer === 'reject' ? { rejection: 401 } : { peer: { id: peer } }; } };
  const handler = createFetchHandler(service, connection);
  return { handler, service, get saved() { return saved; }, get admissionCalls() { return admissionCalls; },
    request: (input = { action: 'snapshot' }, options = {}) => handler(new Request(`http://host${API_PATH}`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-DSH-Skill-Categories': '1' }, body: JSON.stringify(input), ...options })) };
}

test('uses shared host API path and browser JSON response envelope', async () => {
  assert.equal(API_PATH, '/api/skill-categories'); const f = fixture(); const response = await f.request(); const body = await response.json();
  assert.equal(response.status, 200); assert.equal(body.ok, true); assert.equal(body.value.schemaVersion, 1); assert.equal(body.value.complete, true);
  assert.equal(response.headers.get('Cache-Control'), 'no-store'); assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff'); assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
  assert.equal(f.admissionCalls, 1);
});

test('unauthenticated requests never touch skills or storage', async () => {
  const f = fixture('reject'); f.service.skills.snapshot = () => { throw new Error('must not run'); };
  const response = await f.request(); assert.equal(response.status, 401); assert.equal((await response.json()).error.code, 'UNAUTHENTICATED'); assert.deepEqual(f.saved, initialState());
});

test('authenticated non-browser API peers cannot read or mutate', async () => {
  const f = fixture('api-peer');
  for (const input of [{ action: 'snapshot' }, { action: 'category.create', name: 'Test' }]) {
    const response = await f.request(input); assert.equal(response.status, 403); assert.equal((await response.json()).error.code, 'USER_ONLY');
  }
  assert.deepEqual(f.saved, initialState());
});

test('validates POST, content type, marker header, and JSON', async () => {
  const f = fixture();
  let response = await f.request({}, { method: 'GET', body: undefined }); assert.equal(response.status, 405);
  for (const headers of [{ 'Content-Type': 'application/json' }, { 'X-DSH-Skill-Categories': '1', 'Content-Type': 'text/plain' }]) {
    response = await f.request({}, { headers }); assert.equal(response.status, 400); assert.equal((await response.json()).error.code, 'INVALID_REQUEST');
  }
  response = await f.request({}, { body: '{' }); assert.equal(response.status, 400); assert.equal((await response.json()).error.code, 'INVALID_JSON');
  response = await f.request({}, { headers: { 'Content-Type': 'Application/JSON; charset=utf-8', 'X-DSH-Skill-Categories': '1' }, body: '{"action":"snapshot"}' }); assert.equal(response.status, 200);
});

test('enforces bounded streaming body even without Content-Length', async () => {
  const f = fixture(); let response = await f.request({}, { body: ' '.repeat(256 * 1024 + 1) }); assert.equal(response.status, 413); assert.equal((await response.json()).error.code, 'REQUEST_TOO_LARGE');
  response = await f.request({}, { headers: { 'Content-Type': 'application/json', 'X-DSH-Skill-Categories': '1', 'Content-Length': '9999999' } }); assert.equal(response.status, 413);
  assert.deepEqual(f.saved, initialState());
});

test('dispatch and HTTP share exactly the same action contract and conflict envelope', async () => {
  const f = fixture(); const first = await dispatch(f.service, { action: 'category.create', name: 'A', revision: 0 });
  const response = await f.request({ action: 'category.create', name: 'B', revision: 0 }); assert.equal(response.status, 409);
  const body = await response.json(); assert.equal(body.ok, false); assert.equal(body.error.code, 'REVISION_CONFLICT'); assert.equal(body.error.details.revision, first.revision);
  assert.equal(f.saved.categories.length, 1);
});

test('invalid scope and invalid action have known error envelopes', async () => {
  const f = fixture();
  for (const input of [{ action: 'snapshot', scope: 'injected' }, { action: 'not-an-action' }, null]) {
    const response = await f.request(input); const body = await response.json(); assert.equal(response.status, 400); assert.equal(body.ok, false); assert.equal(body.error.code, 'INVALID_REQUEST');
  }
});

test('storage errors are sanitized, and next serialized request still succeeds', async () => {
  const f = fixture(); const persist = f.service.persist; f.service.persist = async () => { throw new Error('secret path'); };
  let response = await f.request({ action: 'category.create', name: 'A' }); assert.equal(response.status, 500); const body = await response.json(); assert.equal(body.error.code, 'INTERNAL_ERROR'); assert.equal(JSON.stringify(body).includes('secret path'), false);
  f.service.persist = persist; response = await f.request({ action: 'category.create', name: 'A' }); assert.equal(response.status, 200); assert.equal(f.saved.categories.length, 1);
});
