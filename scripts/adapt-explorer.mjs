// Adapter for the pinned BSD-3-Clause skill center 0.4.8. Fails closed on upstream drift.
// The installed third-party package is never modified. No runtime DOM/fetch interception.
export function adaptExplorer(source) {
  function replaceOnce(text, before, after) {
    if (text.split(before).length !== 2) throw new Error('Skill explorer 0.4.8 adapter anchor changed: '+before.slice(0,100));
    return text.replace(before,after);
  }
  let body=source.slice(source.indexOf('\n\t\tvar module ='),source.indexOf('\n\t\t//#region src/client/telemetry.ts'));
  if(!body||!body.includes('function SkillPanel('))throw new Error('Unsupported skill explorer build');
  // React owns the stylesheet lifetime instead of a module-evaluation head insertion.
  const start=body.indexOf('\n\t\tconst tagId =');
  const end=body.indexOf('\n\t\tvar panel_module_css_default =',start);
  if(start<0||end<start)throw new Error('Missing upstream CSS anchor');
  body=body.slice(0,start)+body.slice(end);
  body=replaceOnce(body,'\n\t\tfunction SkillPanel({ controller, api }) {','\n\t\tlet UnifiedSkillsView, CategoryRow;\n\t\tfunction SkillPanel({ controller, api }) {');
  // Replace only the list view. Native file actions, create/import/editor and row remain upstream-owned.
  const listStart=body.indexOf('\n\t\tfunction SkillsTab({ api, onEdit, onImport, onDuplicate }) {');
  const listEnd=body.indexOf('\n\t\t//#endregion\n\t\t//#region src/client/panel/SkillPanel.tsx',listStart);
  if(listStart<0||listEnd<listStart)throw new Error('Missing upstream SkillsTab anchor');
  body=body.slice(0,listStart)+'\n\t\tfunction SkillsTab(props) { return UnifiedSkillsView ? react.createElement(UnifiedSkillsView, props) : null; }'+body.slice(listEnd);
  // Preserve callers of the old category tab without leaving a duplicate navigation item.
  body=replaceOnce(body,'setActiveTab(tab) {','setActiveTab(tab) {\n                if (tab === "categories") tab = "skills";');
  body=replaceOnce(body,'\n\t\t\t\t\t/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {\n\t\t\t\t\t\tclassName: panel_module_css_default.skillDesc,','\n\t\t\t\t\tCategoryRow && react.createElement(CategoryRow, {skill}),\n\t\t\t\t\t/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {\n\t\t\t\t\t\tclassName: panel_module_css_default.skillDesc,');
  // Native registrations are deliberately not reused: our plugin owns the single sidebar row.
  const registrations=body.indexOf('\n\t\tfunction registerSkillExplorerPanel(');
  if(registrations<0)throw new Error('Missing panel registration anchor');
  body=body.slice(0,registrations);
  return `(function(require) {${body}\nreturn { SkillApi, PanelController, Page:SkillExplorerPanelPage, css, SkillRow, selectGroups, groupTitle, groupHintOf, loadListPrefs, saveListPrefs, listStorage, MARK_FACETS, STATUS_FACETS, initialize(ctx, extension) { UnifiedSkillsView=extension.UnifiedSkillsView; CategoryRow=extension.CategoryRow; ctx.effect(()=>ctx.locale.register('dsh-skill-explorer',{zh,en}),'skill-center: dictionaries'); setRuntimeTranslate(ctx.locale.bind('dsh-skill-explorer')); } };\n})`;
}
