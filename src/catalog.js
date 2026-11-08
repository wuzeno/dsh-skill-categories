/**
 * Cold catalog adapter for the stock Web composition. Only public services are
 * used; no Agent is created, no Loader rows or skill files are inspected.
 *
 * Host evidence: dsh-agent-preset-registry/lib/index.js defaultId 470-473,
 * inspectCompositions 575-581, acquireScope 791-803; dsh-skill/lib/index.js
 * snapshot 234-239; dsh-web-app/cordis.patch.yml 512-525.
 *
 * The public cold lease exposes a scope key, NOT an isolated service accessor.
 * A preset-owned skills registry is therefore deliberately unsupported. The
 * public composition inventory lets us conservatively reject known isolated
 * registries and presets without the official filesystem provider. Third-party
 * plugins secretly publishing their own skills service need a future public
 * cold service accessor; this adapter does not attempt private reflection.
 */
const FILESYSTEM = '@deepseek-ai/dsh-skill-filesystem';
const REGISTRY = '@deepseek-ai/dsh-skill';
const ownsModule = (name, module) => name === module || name?.startsWith(`${module}/`);

function supportsSharedCatalog(presets, id) {
  if (typeof presets.inspectCompositions !== 'function') return false;
  const rows = presets.inspectCompositions();
  if (!Array.isArray(rows)) return false;
  const matches = rows.filter(row => row?.id === id);
  // The inventory includes retained older revisions. Any ambiguous revision
  // fails closed: it is not possible to correlate a public inventory row with
  // the opaque lease key, and a partial root catalog must not become a baseline.
  return matches.length > 0 && matches.every(row => Array.isArray(row.modules)
    && row.modules.some(module => ownsModule(module?.moduleName, FILESYSTEM))
    && !row.modules.some(module => ownsModule(module?.moduleName, REGISTRY))
    && Array.isArray(row.leakedServices) && row.leakedServices.length === 0);
}

/**
 * @param {{skills: object, agentPresets: object}} services Host services.
 * @returns {{snapshot: function}} Drop-in SkillCategoriesService skills adapter.
 * Invoke snapshot in request handling, never await it during plugin apply:
 * preset acquisition may wait for the Host Loader's activation to settle.
 */
export function createSkillCatalog({ skills, agentPresets }) {
  return {
    async snapshot({ cwd, signal } = {}) {
      signal?.throwIfAborted();
      if (!agentPresets || typeof agentPresets.acquireScope !== 'function'
        || !skills || typeof skills.snapshot !== 'function') {
        return { skills: [], complete: false };
      }
      const id = agentPresets.defaultId;
      if (typeof id !== 'string' || !id) return { skills: [], complete: false };
      const lease = await agentPresets.acquireScope(id);
      try {
        signal?.throwIfAborted();
        if (!lease?.key || !supportsSharedCatalog(agentPresets, id)) {
          return { skills: [], complete: false };
        }
        const observation = await skills.snapshot({
          ...(cwd === undefined || cwd === null ? {} : { cwd }),
          scope: lease.key,
          ...(signal === undefined ? {} : { signal }),
        });
        signal?.throwIfAborted();
        return {
          skills: Array.isArray(observation?.skills) ? observation.skills : [],
          complete: Array.isArray(observation?.skills) && observation.complete === true
            && agentPresets.defaultId === id,
        };
      } finally {
        // Registry leases are explicitly idempotent async disposables.
        await lease?.[Symbol.asyncDispose]?.();
      }
    },
  };
}
