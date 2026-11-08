# Skill categories design

A DSH app screen, not a marketing page. Keep DSH's existing shell, typography, locale and theme tokens; no replacement navigation shell and no external assets.

- Material: real host skill summaries, source and path; real user categories, tags, pending arrivals. No fake metrics or sample skills in production.
- Audience: people with growing skill collections. Primary action: classify selected skills.
- Tone: utilitarian, calm, compact. Signature: a searchable category index with a persistent arrival inbox.
- Layout: capped work area; a category rail and a flat skill ledger. At narrow widths rail becomes a wrapping filter row, ledger stacks. No cards inside cards or hero.
- Tokens: scoped .dshsc theme block aliases --dsw-alias-* with neutral fallbacks, system font inherited. Never mutate host html/body styles.
- Modal: only explicitly requested category operations and optional new-skill classification; native dialog, Escape/skip, focus restore, bounded content. Import itself never blocks.
- States: loading, empty, error/retry, complete and incomplete snapshots; serialized writes, stale revision recovery; polite feedback.
- Motion: none. Controls use instantly visible focus rings and min 40px height; small reordering buttons have 44px hit targets.
- Classification is global by logical skill name, not physical source. Scope picker selects a global/workspace view, not an agent preset. Do not imply categories change model invocation.
