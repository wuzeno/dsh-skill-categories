import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ignored = new Set(['.git', 'node_modules', 'preview', 'artifacts']);
async function walk(dir) {
  const files = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (ignored.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...await walk(p));
    else if (e.isFile() && e.name.endsWith('.md')) files.push(p);
  }
  return files;
}
let links = 0; const errors = [];
for (const file of await walk(root)) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    const href = match[1].trim().replace(/^<|>$/g, '');
    if (/^(?:https?:|mailto:|#)/.test(href)) continue;
    const dest = decodeURIComponent(href.split('#')[0]);
    if (!dest) continue;
    links++;
    const target = path.resolve(path.dirname(file), dest);
    if (path.relative(root, target).startsWith('..')) errors.push(`${path.relative(root,file)}: external local path: ${href}`);
    else try { await stat(target); } catch { errors.push(`${path.relative(root,file)}: missing ${href}`); }
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode=1; }
else console.log(`Documentation check passed: ${links} local links resolve.`);
