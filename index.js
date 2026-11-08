import { z } from 'zod';
import { SkillCategoriesService, initialState } from './src/service.js';
import { API_PATH, createFetchHandler } from './src/http.js';
import { createSkillCatalog } from './src/catalog.js';
import { apply as applySkillExplorer, inject as skillExplorerInject } from './vendor/skill-explorer/host.js';

export const inject = [...new Set(['skills', 'agentPresets', 'storageDomain', 'connection', 'workspaceRegistry', ...skillExplorerInject])];

export async function apply(ctx, config) {
  const assignment = z.object({ categoryId: z.string().nullable(), tags: z.array(z.string()) });
  const catalog = z.object({ baseline: z.boolean(), known: z.array(z.string()), pending: z.array(z.string()), lastGood: z.array(z.object({ name: z.string() }).passthrough()) });
  const domain = await ctx.storageDomain.open({ name: 'skill_categories', version: 1,
    global: { schema: z.object({ schemaVersion: z.literal(1), revision: z.number().int().nonnegative(),
      categories: z.array(z.object({ id: z.string(), name: z.string() })), assignments: z.record(z.string(), assignment),
      settings: z.object({ promptOnNew: z.boolean() }), catalogs: z.record(z.string(), catalog),
    }), initial: initialState() }, tables: {} });
  const service = new SkillCategoriesService({ state: domain.global.get(), persist: state => domain.global.set(state),
    skills: createSkillCatalog({ skills: ctx.skills, agentPresets: ctx.agentPresets }), workspaces: () => ctx.workspaceRegistry.list() });
  // Events only invalidate. A request/poll is the authoritative discovery boundary, never an event payload.
  ctx.on('skills/change', () => service.invalidate());
  ctx.effect(() => async () => { await service.tail; await domain.close(); }, 'skill-categories.state');
  ctx.effect(() => ctx.connection.fetch.register({ path: API_PATH, methods: ['POST'], requestBody: 'streaming',
    fetch: createFetchHandler(service, ctx.connection) }), 'skill-categories.http');
  // The original plugin must be disabled before this integrated host is activated.
  // Its unchanged guard and ctx.effect disposers own the explorer route lifecycle.
  await applySkillExplorer(ctx, config);
}
