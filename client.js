window.__ModuleLoader__.load({
  id: 'dsh-skill-categories',
  factory(require) {
    const React = require('react');
    const { useState, useEffect, useRef, useSyncExternalStore } = React;
    const h = React.createElement;
    const CSS = "/* Hallmark · shape: app screen · genre: modern-minimal · theme: DSH host tokens · signature: skill classification ledger · v2.0.0 */\n/* Hallmark · pre-emit critique: P4 H4 E4 S4 R5 V3 · weakest: V; use the real skill ledger and arrival queue, not dashboard cards. */\n.dshsc {\n  --sc-bg: var(--dsw-alias-bg-base, #171c21);\n  --sc-panel: var(--dsw-alias-bg-layer-1, #20272d);\n  --sc-ink: var(--dsw-alias-label-primary, #e2e7ed);\n  --sc-muted: var(--dsw-alias-label-secondary, #a8b4c1);\n  --sc-line: var(--dsw-alias-border-l1, #41505c);\n  --sc-accent: var(--dsw-alias-brand-primary, #8ed9bd);\n  --sc-on-accent: #132f26;\n  --sc-danger: var(--dsw-alias-state-error-primary, #ffb3b3);\n  --sc-shade: #10161db3;\n  --sc-font: inherit;\n  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 24px; --space-6: 32px;\n  --sc-radius: 8px;\n}\n\n/* Hallmark · shape: app screen · genre: modern-minimal · theme: DSH host tokens · v2.0.0 */\n/* Hallmark · pre-emit critique: P4 H4 E4 S4 R5 V3 · weakest: V; flat skill ledger replaces generic dashboard cards. */\n.dshsc { box-sizing:border-box; font-family:var(--sc-font); font-size:14px; line-height:1.55; color:var(--sc-ink); }\n.dshsc *, .dshsc *::before, .dshsc *::after { box-sizing:border-box; }\n.dshsc.sc-page { height:100%; overflow:auto; overflow-x:clip; background:var(--sc-bg); }\n.dshsc .sc-wrap { max-width:1200px; margin:0 auto; padding:var(--space-6); }\n.dshsc h1,.dshsc h2,.dshsc h3 { margin:0; min-width:0; overflow-wrap:break-word; text-wrap:balance; font-weight:600; color:var(--sc-ink); }\n.dshsc h1 { font-size:24px; } .dshsc h2 { font-size:19px; } .dshsc h3 { font-size:16px; }\n.dshsc p { margin:var(--space-2) 0; max-width:70ch; }\n.dshsc .sc-muted { color:var(--sc-muted); font-size:13px; }\n.dshsc .sc-row { display:flex; align-items:center; gap:var(--space-3); flex-wrap:wrap; }\n.dshsc .sc-head { display:flex; justify-content:space-between; align-items:center; gap:var(--space-4); margin-bottom:var(--space-5); }\n.dshsc button:not(:where(.sc-native-row button)),.dshsc input,.dshsc select { font:inherit; }\n.dshsc button:not(:where(.sc-native-row button)),.dshsc select,.dshsc input:not([type=checkbox]) { min-height:40px; border:1px solid var(--sc-line); border-radius:var(--sc-radius); color:var(--sc-ink); background:var(--sc-panel); padding:var(--space-2) var(--space-3); max-width:100%; }\n.dshsc button { cursor:pointer; display:inline-flex; justify-content:center; align-items:center; gap:var(--space-2); }\n.dshsc button:hover:not(:disabled) { border-color:var(--sc-accent); }\n.dshsc button:active:not(:disabled) { transform:translateY(1px); }\n.dshsc button:disabled,.dshsc input:disabled,.dshsc select:disabled { opacity:.55; cursor:not-allowed; }\n.dshsc .sc-picker-launch { height:26px; min-height:26px; padding:0 9px; gap:4px; border-radius:8px; border-color:var(--dsw-alias-border-l2,var(--sc-line)); background:transparent; color:var(--dsw-alias-label-secondary,var(--sc-muted)); font-family:var(--dsw-font-family,inherit); font-size:12px; line-height:normal; white-space:nowrap; }\n.dshsc .sc-picker-launch:hover:not(:disabled) { border-color:var(--dsw-alias-border-l2,var(--sc-line)); background:var(--dsw-alias-interactive-bg-hover,var(--sc-panel)); color:var(--dsw-alias-label-primary,var(--sc-ink)); }\n.dshsc .sc-picker-results { display:grid; gap:var(--space-2); max-height:45vh; overflow:auto; }\n.dshsc .sc-picker-skill { display:flex; justify-content:flex-start; flex-wrap:wrap; text-align:left; width:100%; }\n.dshsc .sc-picker-desc { display:block; flex-basis:100%; overflow-wrap:anywhere; }\n.dshsc .sc-picker-skill strong { overflow-wrap:anywhere; }\n.dshsc [aria-busy=true] { cursor:progress; }\n.dshsc :is(button,input,select,a,summary):focus-visible { outline:2px solid var(--sc-accent); outline-offset:2px; }\n.dshsc .sc-primary { background:var(--sc-accent); color:var(--sc-on-accent); border-color:var(--sc-accent); }\n.dshsc .sc-danger { color:var(--sc-danger); }\n.dshsc .sc-tool { width:44px; min-height:44px; padding:var(--space-2); }\n.dshsc .sc-quiet { background:var(--sc-bg); }\n.dshsc .sc-layout { display:grid; grid-template-columns:225px minmax(0,1fr); gap:var(--space-5); }\n.dshsc .sc-rail { border-right:1px solid var(--sc-line); padding-right:var(--space-4); min-width:0; }\n.dshsc .sc-filter { width:100%; justify-content:space-between; background:var(--sc-bg); margin-bottom:var(--space-2); text-align:left; }\n.dshsc .sc-filter[aria-pressed=true] { color:var(--sc-accent); border-color:var(--sc-accent); }\n.dshsc .sc-count { font-variant-numeric:tabular-nums; color:var(--sc-muted); }\n.dshsc .sc-toolbar { display:flex; flex-wrap:wrap; gap:var(--space-3); margin-bottom:var(--space-4); }\n.dshsc .sc-search { flex:1 1 220px; min-width:0; }\n.dshsc .sc-check { display:inline-flex; gap:var(--space-2); align-items:center; min-height:44px; cursor:pointer; }\n.dshsc input[type=checkbox] { width:17px; height:17px; accent-color:var(--sc-accent); cursor:pointer; flex-shrink:0; }\n.dshsc .sc-batch { padding:var(--space-3) 0; border-top:1px solid var(--sc-line); border-bottom:1px solid var(--sc-line); justify-content:space-between; }\n.dshsc .sc-item { display:grid; grid-template-columns:28px minmax(0,1fr) auto; align-items:start; gap:var(--space-3); padding:var(--space-4) 0; border-bottom:1px solid var(--sc-line); }\n.dshsc .sc-item-name { font-weight:600; font-size:16px; overflow-wrap:anywhere; }\n.dshsc .sc-item-description { color:var(--sc-muted); overflow-wrap:anywhere; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }\n.dshsc .sc-path { overflow-wrap:anywhere; color:var(--sc-muted); }\n.dshsc .sc-path summary { cursor:pointer; width:fit-content; min-height:32px; }\n.dshsc .sc-label { font-size:12px; border:1px solid var(--sc-line); border-radius:4px; padding:0 var(--space-2); color:var(--sc-muted); display:inline-block; }\n.dshsc .sc-state { padding:var(--space-6) var(--space-4); text-align:center; }\n.dshsc .sc-state p { margin:var(--space-3) auto; }\n.dshsc .sc-notice { padding:var(--space-3) var(--space-4); margin:var(--space-3) 0; background:var(--sc-panel); border:1px solid var(--sc-line); border-radius:var(--sc-radius); }\n.dshsc .sc-notice[data-error=true] { color:var(--sc-danger); }\n.dshsc .sc-settings { border-top:1px solid var(--sc-line); padding-top:var(--space-4); margin-top:var(--space-5); }\n.dshsc.sc-dialog { padding:0; width:min(560px,calc(100% - 32px)); max-height:85dvh; border:1px solid var(--sc-line); border-radius:12px; background:var(--sc-bg); color:var(--sc-ink); }\n.dshsc.sc-dialog::backdrop { background:var(--sc-shade); }\n.dshsc .sc-dialog-head,.dshsc .sc-dialog-body,.dshsc .sc-dialog-foot { padding:var(--space-4) var(--space-5); }\n.dshsc .sc-dialog-head { display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--sc-line); }\n.dshsc .sc-dialog-body { max-height:55dvh; overflow:auto; }\n.dshsc .sc-dialog-foot { display:flex; justify-content:flex-end; gap:var(--space-3); border-top:1px solid var(--sc-line); }\n.dshsc .sc-field { display:grid; gap:var(--space-2); margin-bottom:var(--space-4); }\n.dshsc .sc-manage-row { display:flex; gap:var(--space-2); align-items:center; padding:var(--space-2) 0; border-bottom:1px solid var(--sc-line); }\n.dshsc .sc-manage-row span:first-child { flex:1; overflow-wrap:anywhere; }\n.dshsc .sc-arrivals { display:grid; gap:var(--space-2); margin:var(--space-3) 0; padding:0; list-style:none; max-height:160px; overflow:auto; }\n.dshsc .sc-skeleton { height:70px; border-bottom:1px solid var(--sc-line); background:var(--sc-panel); margin-top:var(--space-2); }\n.dshsc.sc-icon { display:inline-flex; position:relative; }\n.dshsc .sc-inbox-mark { position:absolute; right:-8px; top:-8px; border-radius:8px; padding:0 var(--space-1); background:var(--sc-accent); color:var(--sc-on-accent); font-size:10px; line-height:16px; }\n@media (max-width:780px) { .dshsc .sc-wrap { padding:var(--space-4); } .dshsc .sc-layout { grid-template-columns:minmax(0,1fr); } .dshsc .sc-rail { border-right:0; border-bottom:1px solid var(--sc-line); padding:0 0 var(--space-3); display:flex; flex-wrap:wrap; gap:var(--space-2); } .dshsc .sc-filter { width:auto; margin:0; } .dshsc .sc-head { align-items:flex-start; flex-wrap:wrap; } }\n@media (max-width:480px) { .dshsc .sc-item { grid-template-columns:24px minmax(0,1fr); } .dshsc .sc-item > button { grid-column:2; justify-self:start; } .dshsc .sc-dialog-head,.dshsc .sc-dialog-body,.dshsc .sc-dialog-foot { padding:var(--space-4); } .dshsc .sc-manage-row { flex-wrap:wrap; } }\n.dshsc.sc-embedded { height:auto; min-height:0; flex:1; }\n.dshsc.sc-embedded .sc-wrap { padding:16px 0; }\n.dshsc.sc-embedded .sc-head { margin-bottom:16px; }\n.dshsc.sc-inline-category { display:flex; align-items:center; flex-wrap:wrap; gap:6px; margin:6px 0; font-size:12px; }\n.dshsc.sc-inline-category .sc-label { height:20px; padding:0 5px; border-radius:4px; font-size:11px; line-height:18px; }\n.dshsc.sc-inline-category button { height:24px; min-height:24px; padding:0 7px; border:1px solid transparent; border-radius:4px; background:transparent; color:var(--sc-muted); font-size:11px; line-height:16px; box-shadow:none; }\n.dshsc.sc-inline-category button:hover:not(:disabled) { border-color:var(--sc-line); background:var(--sc-panel); color:var(--sc-ink); }\n.dshsc.sc-unified { flex:1; min-height:0; overflow:auto; padding:16px; }\n.dshsc.sc-unified .sc-layout { grid-template-columns:190px minmax(0,1fr); gap:20px; }\n.dshsc.sc-unified .sc-main { min-width:0; }\n.dshsc.sc-unified .sc-rail { align-self:start; }\n.dshsc.sc-unified .sc-rail button { min-height:32px; padding:5px 8px; font-size:12px; }\n.dshsc.sc-unified .sc-filter span:first-child { min-width:0; overflow-wrap:anywhere; }\n.dshsc.sc-unified .sc-toolbar { gap:8px; margin-bottom:12px; }\n.dshsc.sc-unified .sc-toolbar :is(button,select,input) { min-height:32px; padding:5px 8px; font-size:12px; }\n.dshsc.sc-unified .sc-batch { gap:8px; font-size:12px; }\n.dshsc.sc-unified .sc-batch button { min-height:30px; padding:4px 8px; font-size:12px; }\n.dshsc.sc-unified .sc-group { margin-top:12px; min-width:0; }\n.dshsc.sc-unified .sc-group-title { width:100%; justify-content:flex-start; min-height:34px; padding:6px 8px; border:0; background:transparent; font-size:13px; font-weight:600; }\n.dshsc.sc-unified .sc-native-row { position:relative; min-width:0; padding-left:28px; border-bottom:1px solid var(--sc-line); }\n.dshsc.sc-unified .sc-native-select { position:absolute; left:0; top:10px; min-height:17px; }\n.dshsc.sc-unified .sc-native-row article { min-width:0; overflow-wrap:anywhere; }\n.dshsc.sc-unified .sc-settings { font-size:12px; }\n@media(max-width:780px) { .dshsc.sc-unified { padding:12px; } .dshsc.sc-unified .sc-layout { grid-template-columns:minmax(0,1fr); gap:12px; } .dshsc.sc-unified .sc-rail { align-self:auto; } }\n@media (prefers-reduced-motion:reduce) { .dshsc button:active:not(:disabled) { transform:none; } }\n";
    const explorerFactory = (function(require) {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/api.ts
		/**
		* Skill center API client (browser half). Talks to the host route family over
		* same-origin fetch; the host enforces the trust fence on its side.
		*/
		/**
		* Route paths mirrored from the host (src/routes.ts ROUTES).
		*
		* DOCUMENT-RELATIVE on purpose (no leading slash): the harness serves the GUI
		* with `<base href="./">`, so a sub-path deployment (`/dsh/dsh/`) is the
		* entry directory. A root-absolute `/api/...` escapes that prefix and the
		* request never reaches the plugin's route (issue #1707); the official client
		* posts its own routes the same way (`api/session.list`).
		*/
		const API = {
			list: "api/dsh-skill-explorer/list",
			read: "api/dsh-skill-explorer/read",
			setEnabled: "api/dsh-skill-explorer/set-enabled",
			setProviderEnabled: "api/dsh-skill-explorer/set-provider-enabled",
			create: "api/dsh-skill-explorer/create",
			update: "api/dsh-skill-explorer/update",
			delete: "api/dsh-skill-explorer/delete",
			import: "api/dsh-skill-explorer/import"
		};
		/** One thrown API error with the host-provided message. */
		var ApiError = class extends Error {};
		/** Skill center API client. */
		var SkillApi = class {
			/** Fetch the grouped skill list. */
			async list(cwd) {
				const url = typeof cwd === "string" && cwd.trim() !== "" ? `${API.list}?cwd=${encodeURIComponent(cwd)}` : API.list;
				return this.request(url);
			}
			/** Enable or disable a skill (rewrites disable-model-invocation). */
			async setEnabled(name, path, enabled) {
				return this.request(API.setEnabled, {
					method: "POST",
					body: {
						name,
						path,
						enabled
					}
				});
			}
			/**
			* Switch a plugin-provided skill off/on in this panel.
			*
			* There is no path to certify: the row's file belongs to the provider and
			* sits outside the roots this panel scans, so the host records the
			* (provider, name) pair in the panel's own store instead of rewriting a
			* SKILL.md the panel does not own. The host answers with the stored state;
			* the invocable view itself comes from the next list call.
			*/
			async setProviderEnabled(name, provider, enabled) {
				return this.request(API.setProviderEnabled, {
					method: "POST",
					body: {
						name,
						provider,
						enabled
					}
				});
			}
			/** Create a skill file under the user or project root. */
			async create(payload) {
				return this.request(API.create, {
					method: "POST",
					body: payload
				});
			}
			/** One skill's editable fields and body, resolved from the panel's path. */
			async read(name, path) {
				return this.request(`${API.read}?name=${encodeURIComponent(name)}&path=${encodeURIComponent(path)}`);
			}
			/** Rewrite an existing skill file in place (name and location unchanged). */
			async update(payload) {
				return this.request(API.update, {
					method: "POST",
					body: payload
				});
			}
			/**
			* Batch-create skills from a host directory or a .zip archive.
			*
			* The directory form names a path on the host (the route is loopback-only,
			* so the browser and the host are the same machine by construction); the
			* archive form carries the bytes the browser read, base64-encoded, so the
			* user can pick a file through the ordinary file dialog. Both only ever
			* create new files under the chosen root; a name that already resolves at
			* the same or a stronger source comes back skipped with its reason.
			*/
			async importSkills(payload) {
				return this.request(API.import, {
					method: "POST",
					body: payload
				});
			}
			/** Delete a skill (moves it into .trash). */
			async remove(name, path) {
				return this.request(API.delete, {
					method: "POST",
					body: {
						name,
						path
					}
				});
			}
			async request(path, options = {}) {
				const headers = options.body === void 0 ? new Headers() : new Headers({ "content-type": "application/json" });
				const response = await fetch(path, {
					method: options.method ?? "GET",
					headers,
					body: options.body === void 0 ? void 0 : JSON.stringify(options.body)
				});
				let body;
				try {
					body = await response.json();
				} catch {
					body = void 0;
				}
				if (!response.ok) throw new ApiError(typeof body === "object" && body !== null && typeof body.error === "string" ? body.error : `HTTP ${response.status}`);
				return body;
			}
		};
		//#endregion
		//#region src/client/panel/controller.ts
		/** Stable id shared by the sidebar panel row and the main-slot page. */
		const SKILL_EXPLORER_PANEL_ID = "skill-explorer";
		/** The panel state owner the sidebar row and the view both read. */
		var PanelController = class {
			deps;
			panelOpen = false;
			activeTab = "skills";
			editing;
			template;
			listeners = /* @__PURE__ */ new Set();
			/** Cached so getSnapshot stays referentially stable between changes. */
			snapshot = {
				panelOpen: false,
				activeTab: "skills",
				editing: void 0,
				template: void 0
			};
			constructor(deps = {}) {
				this.deps = deps;
			}
			getSnapshot() {
				return this.snapshot;
			}
			subscribe(fn) {
				this.listeners.add(fn);
				return () => {
					this.listeners.delete(fn);
				};
			}
			/**
			* Show the panel. The layout owns which panel the column renders, so the
			* state flip and the selection travel together; the selection is requested
			* after the snapshot flips, so a subscriber never observes "open" while the
			* shell still shows the conversation.
			*/
			open() {
				if (this.panelOpen) return;
				this.panelOpen = true;
				this.commit();
				this.selectPanel(SKILL_EXPLORER_PANEL_ID);
			}
			/** Return the column to the conversation, asking the layout explicitly. */
			close() {
				if (!this.panelOpen) return;
				this.panelOpen = false;
				this.commit();
				this.selectPanel(null);
			}
			toggle() {
				if (this.panelOpen) this.close();
				else this.open();
			}
			/**
			* Reflect a selection made outside this controller (the user clicked another
			* sidebar row, or the layout dropped the panel id), keeping `panelOpen`
			* aligned with what the column actually shows.
			* @param panelId - the layout's current panel id, or null for the conversation.
			*/
			syncPanelSelection(panelId) {
				const open = panelId === SKILL_EXPLORER_PANEL_ID;
				if (open === this.panelOpen) return;
				this.panelOpen = open;
				this.commit();
			}
			/** Switch tabs without touching the editor target. */
			setActiveTab(tab) {
                if (tab === "categories") tab = "skills";
				if (this.activeTab === tab) return;
				this.activeTab = tab;
				this.commit();
			}
			/** Open the editor for one row; the edit tab appears while it is set. */
			openEditor(skill) {
				this.editing = skill;
				this.activeTab = "edit";
				this.commit();
			}
			/** Leave the editor; the list remounts and refetches the saved copy. */
			closeEditor() {
				this.editing = void 0;
				this.activeTab = "skills";
				this.commit();
			}
			/**
			* Open the create tab prefilled from an existing skill. Leaving the editor
			* target alone keeps a half-finished edit reachable from its own tab.
			*/
			openCreateFromTemplate(draft) {
				this.template = draft;
				this.activeTab = "create";
				this.commit();
			}
			/**
			* Drop the pending template, so a later visit to the create tab starts from
			* a blank form. Called when the template has been used or dismissed.
			*/
			clearTemplate() {
				if (this.template === void 0) return;
				this.template = void 0;
				this.commit();
			}
			commit() {
				this.snapshot = {
					panelOpen: this.panelOpen,
					activeTab: this.activeTab,
					editing: this.editing,
					template: this.template
				};
				for (const fn of [...this.listeners]) fn();
			}
			/** Ask the layout to select a panel; a shell without the face is a no-op. */
			selectPanel(panelId) {
				try {
					this.deps.panel?.select(panelId);
				} catch {}
			}
		};
		//#endregion
		//#region src/client/locales.ts
		/**
		* skill-explorer surface copy: zh is the key source, en mirrors every key.
		*/
		const zh = {
			"entry.label": "技能中心",
			"entry.tooltip": "技能中心：浏览与管理已加载的 skill",
			"panel.title": "技能中心",
			"tab.list": "技能",
			"tab.create": "创建",
			"tab.import": "导入",
			"tab.edit": "编辑技能",
			"group.bundled": "系统内置",
			"group.project-dsh": "项目技能（.dsh/skills）",
			"group.project-agents": "项目技能（.agents/skills）",
			"group.custom": "自定义目录",
			"group.user-dsh": "用户技能（~/.dsh/skills）",
			"group.user-agents": "用户技能（~/.agents/skills）",
			"group.runtime": "运行时注册",
			"groupHint.bundled": "DSH 内置与插件随附的全局技能",
			"groupHint.project-dsh": "存放于项目目录，作用于所在项目",
			"groupHint.project-agents": "存放于项目目录，作用于对应项目",
			"groupHint.custom": "customSkillDirs 自定义配置目录",
			"groupHint.user-dsh": "全局技能（~/.dsh/skills），本机所有项目共享",
			"groupHint.user-agents": "全局技能（~/.agents/skills），本机所有项目共享",
			"groupHint.runtime": "插件运行时代码内嵌注册",
			"list.loading": "加载中…",
			"list.loadFailed": "加载失败：{error}",
			"list.empty": "当前没有已加载的 skill。",
			"list.count": "{count} 个",
			"list.when": "适用：{when}",
			"list.invokable": "可调用：{marks}",
			"list.invokableTooltip": "模型可自动调用该技能；手动 /skill 指令不受影响",
			"list.linked": "软链接",
			"list.noFile": "无本地文件",
			"list.noFileTooltip": "该技能由插件在运行时注册或随包提供，没有 SKILL.md 文件",
			"list.noFileHint": "该技能没有本地 SKILL.md 文件，无法在此启用/禁用、编辑或删除。",
			"list.providerFile": "由插件提供",
			"list.providerFileTooltip": "该技能的文件由插件 provider 提供，未落在本面板扫描的技能根目录下",
			"list.providerFileHint": "该技能由插件提供、确有 SKILL.md 文件，但不在本面板扫描的技能根目录下，因此无法在此编辑或删除；开关只改变本面板的可调用视图，不会改变模型实际加载的技能。",
			"list.mark.model": "模型",
			"list.mark.user": "用户",
			"provider.filesystem": "文件系统",
			"provider.tooltip": "技能来源：{provider}",
			"list.enabled": "已启用：模型可调用（点击禁用）",
			"list.disabled": "已禁用：模型不可调用（点击启用）",
			"list.toggleFailed": "操作失败：{error}",
			"list.delete": "删除",
			"list.deleteConfirm": "删除技能「{name}」？将移入 .trash。",
			"list.deleteFailed": "删除失败：{error}",
			"list.edit": "编辑",
			"list.duplicate": "复制为模板",
			"list.duplicateFailed": "复制失败：{error}",
			"create.root": "创建位置",
			"create.root.user": "用户技能（~/.dsh/skills，所有项目可用）",
			"create.root.project": "项目技能（当前项目 .dsh/skills）",
			"create.name": "技能名（kebab-case，与文件目录同名）",
			"create.namePlaceholder": "如 my-workflow",
			"create.description": "描述（模型判断触发条件的依据）",
			"create.whenToUse": "适用场景（可选）",
			"create.content": "指令内容（SKILL.md 正文，Markdown）",
			"create.submit": "创建技能",
			"create.empty": "技能名/描述/内容不能为空",
			"create.created": "已创建：{path}",
			"create.failed": "创建失败：{error}",
			"create.note": "创建后立即生效（skill-filesystem 会热扫描）。内容会作为指令注入模型上下文——不要写入敏感信息。",
			"create.template": "来自模板「{name}」：改好名称与字段后再创建。",
			"create.templateClear": "清除模板",
			"edit.name": "技能名（不可修改）",
			"edit.loading": "正在读取技能内容…",
			"edit.loadFailed": "读取失败：{error}",
			"edit.submit": "保存修改",
			"edit.back": "返回列表",
			"edit.failed": "保存失败：{error}",
			"edit.note": "只改描述、适用场景与正文：技能名、位置和启用状态保持不变。保存后立即生效（skill-filesystem 会热扫描）。",
			"filter.workspaceLabel": "工作区",
			"filter.workspaceAll": "全部工作区",
			"filter.workspaceCurrent": "当前工作区 ({name})",
			"filter.searchLabel": "搜索",
			"filter.searchPlaceholder": "按名称或描述筛选",
			"filter.empty": "没有匹配「{query}」的技能",
			"filter.emptyWorkspace": "当前筛选下没有技能。",
			"filter.toggle": "筛选",
			"filter.sourceLabel": "来源",
			"filter.statusLabel": "状态",
			"filter.status.all": "全部",
			"filter.status.enabled": "已启用",
			"filter.status.disabled": "已禁用",
			"filter.markLabel": "标记",
			"filter.mark.provider-file": "由插件提供",
			"filter.mark.no-file": "无本地文件",
			"filter.mark.linked": "软链接",
			"filter.clear": "清除筛选",
			"import.open": "导入",
			"import.root": "导入到",
			"import.source": "导入来源",
			"import.source.directory": "本地目录",
			"import.source.archive": ".zip 压缩包",
			"import.directoryLabel": "目录路径（本机绝对路径）",
			"import.directoryPlaceholder": "包含 <名称>/SKILL.md 的目录",
			"import.archiveLabel": "选择 .zip 文件",
			"import.submit": "开始导入",
			"import.summary": "已导入 {imported} 个，跳过 {skipped} 个。",
			"import.imported": "已导入",
			"import.reason.unknown": "已跳过",
			"import.reason.invalid-frontmatter": "frontmatter 缺少名称或描述",
			"import.reason.invalid-name": "名称不符合 kebab-case 规则",
			"import.reason.too-large": "内容超过 64KB",
			"import.reason.duplicate": "同一来源中重名",
			"import.reason.exists": "该位置已有同名技能",
			"import.reason.shadowed": "已被更高优先级的来源覆盖",
			"import.failed": "导入失败：{error}",
			"import.directoryRequired": "请填写要导入的目录",
			"import.archiveRequired": "请选择 .zip 文件",
			"import.archiveTooLarge": "压缩包不能超过 {size}",
			"import.note": "导入只新建文件，不会覆盖已有技能。同名冲突按官方来源优先级（项目 100 → 内置 600）裁决：优先级更高的同名技能不会被替换，对应条目显示为跳过。目录导入只读取一层（<名称>/SKILL.md 或 <名称>.md），软链接与点目录会被忽略。",
			"workspace.isolated": "工作区隔离",
			"workspace.isolatedHint": "该技能属于工作区「{workspace}」，在当前会话上下文隔离不生效",
			"refresh": "刷新"
		};
		const en = {
			"entry.label": "Skill Center",
			"entry.tooltip": "Skill center: browse and manage loaded skills",
			"panel.title": "Skill Center",
			"tab.list": "Skills",
			"tab.create": "Create",
			"tab.import": "Import",
			"tab.edit": "Edit skill",
			"group.bundled": "System bundled",
			"group.project-dsh": "Project skills (.dsh/skills)",
			"group.project-agents": "Project skills (.agents/skills)",
			"group.custom": "Custom directories",
			"group.user-dsh": "User skills (~/.dsh/skills)",
			"group.user-agents": "User skills (~/.agents/skills)",
			"group.runtime": "Runtime registered",
			"groupHint.bundled": "Global skills shipped with DSH and its plugins",
			"groupHint.project-dsh": "Located in the project directory, scoped to its workspace",
			"groupHint.project-agents": "Located in the project directory, scoped to its workspace",
			"groupHint.custom": "customSkillDirs config",
			"groupHint.user-dsh": "Global skills (~/.dsh/skills), shared across all projects",
			"groupHint.user-agents": "Global skills (~/.agents/skills), shared across all projects",
			"groupHint.runtime": "Skills registered at runtime by plugins",
			"list.loading": "Loading…",
			"list.loadFailed": "Failed to load: {error}",
			"list.empty": "No skills loaded yet.",
			"list.count": "{count}",
			"list.when": "When: {when}",
			"list.invokable": "Invokable: {marks}",
			"list.invokableTooltip": "The model can invoke this skill automatically; manual /skill commands remain available",
			"list.linked": "symlinked",
			"list.noFile": "No local file",
			"list.noFileTooltip": "This skill is registered at runtime or shipped by a plugin, so it has no SKILL.md file",
			"list.noFileHint": "This skill has no local SKILL.md file, so it cannot be enabled/disabled, edited, or deleted here.",
			"list.providerFile": "Provided by plugin",
			"list.providerFileTooltip": "This skill has a file supplied by its plugin provider, outside the skill roots this panel scans",
			"list.providerFileHint": "This skill is supplied by a plugin and does have a SKILL.md file, but it sits outside the skill roots this panel scans, so it cannot be edited or deleted here. Its switch only changes what this panel considers invocable; the model still loads the skill.",
			"list.mark.model": "model",
			"list.mark.user": "user",
			"provider.filesystem": "Filesystem",
			"provider.tooltip": "Skill source: {provider}",
			"list.enabled": "Enabled: invokable by the model (click to disable)",
			"list.disabled": "Disabled: not invokable by the model (click to enable)",
			"list.toggleFailed": "Operation failed: {error}",
			"list.delete": "Delete",
			"list.deleteConfirm": "Delete skill \"{name}\"? It moves into .trash.",
			"list.deleteFailed": "Delete failed: {error}",
			"list.edit": "Edit",
			"list.duplicate": "Duplicate as template",
			"list.duplicateFailed": "Duplicate failed: {error}",
			"create.root": "Location",
			"create.root.user": "User skills (~/.dsh/skills, available to all projects)",
			"create.root.project": "Project skills (current project .dsh/skills)",
			"create.name": "Skill name (kebab-case, same as the directory name)",
			"create.namePlaceholder": "e.g. my-workflow",
			"create.description": "Description (how the model decides when to trigger)",
			"create.whenToUse": "When to use (optional)",
			"create.content": "Instructions (SKILL.md body, Markdown)",
			"create.submit": "Create skill",
			"create.empty": "Skill name/description/content must not be empty",
			"create.created": "Created: {path}",
			"create.failed": "Create failed: {error}",
			"create.note": "The skill takes effect immediately (skill-filesystem hot-scans). Its content is injected into the model context as instructions — do not put sensitive information in it.",
			"create.template": "Copied from the template \"{name}\": adjust the name and fields before creating.",
			"create.templateClear": "Clear template",
			"edit.name": "Skill name (fixed)",
			"edit.loading": "Loading the skill…",
			"edit.loadFailed": "Failed to load: {error}",
			"edit.submit": "Save changes",
			"edit.back": "Back to list",
			"edit.failed": "Save failed: {error}",
			"edit.note": "Only the description, when-to-use, and body change: the name, location, and enabled state stay as they are. The edit takes effect immediately (skill-filesystem hot-scans).",
			"filter.workspaceLabel": "Workspace",
			"filter.workspaceAll": "All workspaces",
			"filter.workspaceCurrent": "Current workspace ({name})",
			"filter.searchLabel": "Search",
			"filter.searchPlaceholder": "Filter by name or description",
			"filter.empty": "No skills match \"{query}\"",
			"filter.emptyWorkspace": "No skills under the current filter.",
			"filter.toggle": "Filters",
			"filter.sourceLabel": "Source",
			"filter.statusLabel": "Status",
			"filter.status.all": "All",
			"filter.status.enabled": "Enabled",
			"filter.status.disabled": "Disabled",
			"filter.markLabel": "Marks",
			"filter.mark.provider-file": "Provided by plugin",
			"filter.mark.no-file": "No local file",
			"filter.mark.linked": "Symlinked",
			"filter.clear": "Clear filters",
			"import.open": "Import",
			"import.root": "Import into",
			"import.source": "Import source",
			"import.source.directory": "Local directory",
			"import.source.archive": ".zip archive",
			"import.directoryLabel": "Directory path (absolute, on this machine)",
			"import.directoryPlaceholder": "A directory holding <name>/SKILL.md",
			"import.archiveLabel": "Choose a .zip file",
			"import.submit": "Import skills",
			"import.summary": "Imported {imported}, skipped {skipped}.",
			"import.imported": "Imported",
			"import.reason.unknown": "Skipped",
			"import.reason.invalid-frontmatter": "Frontmatter lacks a name or description",
			"import.reason.invalid-name": "Name is not kebab-case",
			"import.reason.too-large": "Content exceeds 64KB",
			"import.reason.duplicate": "Duplicate name in the same source",
			"import.reason.exists": "A skill with this name already lives there",
			"import.reason.shadowed": "A stronger source already provides this name",
			"import.failed": "Import failed: {error}",
			"import.directoryRequired": "Enter the directory to import",
			"import.archiveRequired": "Choose a .zip file",
			"import.archiveTooLarge": "The archive must not exceed {size}",
			"import.note": "Import only creates files; it never overwrites an existing skill. A same-name conflict resolves by the official source rank (project 100 → bundled 600): a stronger same-name skill is left alone and the candidate is listed as skipped. A directory import reads one level (<name>/SKILL.md or <name>.md); symlinks and dot entries are ignored.",
			"workspace.isolated": "Workspace isolated",
			"workspace.isolatedHint": "This skill belongs to workspace \"{workspace}\" and is isolated from the current session context",
			"refresh": "Refresh"
		};
		//#endregion
		//#region src/client/panel-helpers.ts
		/**
		* Shared panel helpers: the active-dictionary pick (document-language based)
		* and the tiny {name} interpolator. All copy stays in locales.ts.
		*/
		/** Active dictionary, picked by the document language at call time. */
		function dictionary() {
			return (typeof document !== "undefined" ? document.documentElement.lang : "zh").toLowerCase().startsWith("en") ? { ...en } : { ...zh };
		}
		/**
		* SDK translate seat wired by the browser apply() once ctx.locale is bound
		* (setRuntimeTranslate): reads the ACTIVE locale at call time, so plain-DOM
		* surfaces follow a runtime language switch. The document-language pick stays
		* as the unwired fallback (locale service absent, module-scope early callers).
		*/
		let runtimeT;
		/** Wire the SDK translate seat; pass undefined to restore the document-language pick. */
		function setRuntimeTranslate(t) {
			runtimeT = t;
		}
		/** Translate a key with optional {name} template params (current language). */
		function tt(key, values) {
			if (runtimeT !== void 0) return runtimeT(key, values);
			let text = dictionary()[key] ?? key;
			if (values !== void 0) for (const [name, value] of Object.entries(values)) text = text.replaceAll(`{${name}}`, String(value));
			return text;
		}
		//#endregion
		//#region \0dsh-css:packages/dsh-skill-explorer/src/client/panel/panel.module.css.mjs
		const css = ".ptK59a_view{height:100%;min-height:0;overflow:hidden}.ptK59a_panel{background:var(--dsw-alias-bg-base);min-width:0;height:100%;min-height:0;color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-family);flex-direction:column;gap:10px;padding:14px 16px 16px;display:flex}.ptK59a_panelHeader{flex:none;align-items:center;gap:10px;display:flex}.ptK59a_panelTitle{color:var(--dsw-alias-label-primary);white-space:nowrap;flex:1;margin:0;font-size:16px;font-weight:700}.ptK59a_tabBar{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;gap:2px;display:flex}.ptK59a_tab{color:var(--dsw-alias-label-secondary);cursor:pointer;white-space:nowrap;background:0 0;border:none;border-bottom:2px solid #0000;border-radius:6px 6px 0 0;padding:7px 14px;font-size:13px}.ptK59a_tab:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}.ptK59a_tab[data-active]{color:var(--dsw-alias-label-primary);border-bottom-color:var(--dsw-alias-state-business-primary);font-weight:600}.ptK59a_panelContent{flex-direction:column;flex:1;min-height:0;display:flex;overflow:hidden}.ptK59a_fillBody{flex-direction:column;flex:1;gap:10px;min-height:0;display:flex;overflow:hidden}.ptK59a_tabBody{flex-direction:column;flex:1;gap:10px;min-height:0;display:flex;overflow-y:auto}.ptK59a_toolbar{flex-wrap:wrap;flex:none;align-items:center;gap:8px;display:flex}.ptK59a_search{min-width:120px;color:var(--dsw-alias-label-primary);background:var(--dsw-specific-input-major);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;outline:none;flex:0 260px;padding:6px 10px;font-size:13px}.ptK59a_search::placeholder{color:var(--dsw-alias-label-tertiary)}.ptK59a_select{color:var(--dsw-alias-label-primary);background:var(--dsw-specific-input-major);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;outline:none;padding:6px 8px;font-size:13px}.ptK59a_toolbarSpacer{flex:1}.ptK59a_checkboxLabel{color:var(--dsw-alias-label-secondary);cursor:pointer;align-items:center;gap:6px;font-size:12px;display:inline-flex}.ptK59a_facetBar{border:1px solid var(--dsw-alias-border-l1);border-radius:8px;flex-direction:column;flex:none;gap:6px;padding:8px 10px;display:flex}.ptK59a_facetRow{flex-wrap:wrap;align-items:center;gap:6px;display:flex}.ptK59a_facetLabel{min-width:34px;color:var(--dsw-alias-label-secondary);font-size:11px;font-weight:600}.ptK59a_facetChip{color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l2);cursor:pointer;white-space:nowrap;background:0 0;border-radius:999px;align-items:center;gap:5px;padding:2px 9px;font-size:11.5px;line-height:1.7;display:inline-flex}.ptK59a_facetChip:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}.ptK59a_facetChip[data-active]{color:var(--dsw-alias-state-business-primary);border-color:var(--dsw-alias-state-business-primary);background:var(--dsw-alias-interactive-bg-hover)}.ptK59a_facetCount{color:var(--dsw-alias-label-tertiary);font-size:10.5px}.ptK59a_facetChip[data-active] .ptK59a_facetCount{color:var(--dsw-alias-state-business-primary)}.ptK59a_ghostButton[data-active]{color:var(--dsw-alias-state-business-primary);border-color:var(--dsw-alias-state-business-primary)}.ptK59a_ghostButton{color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l2);cursor:pointer;white-space:nowrap;background:0 0;border-radius:8px;padding:5px 12px;font-size:12px}.ptK59a_ghostButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.ptK59a_ghostButton:disabled{opacity:.45;cursor:default}.ptK59a_formActions{align-items:center;gap:8px;display:flex}.ptK59a_primaryButton{color:var(--dsw-alias-label-primary-foreground);background:var(--dsw-alias-button-primary-fill);cursor:pointer;white-space:nowrap;border:none;border-radius:8px;align-self:flex-start;padding:6px 14px;font-size:13px;font-weight:600}.ptK59a_primaryButton:hover:not(:disabled){background:var(--dsw-alias-button-primary-hover)}.ptK59a_primaryButton:disabled{opacity:.5;cursor:default}.ptK59a_linkButton{color:var(--dsw-alias-state-business-primary);cursor:pointer;white-space:nowrap;background:0 0;border:none;padding:0;font-size:12px}.ptK59a_linkButton:hover:not(:disabled){text-decoration:underline}.ptK59a_linkButton:disabled{opacity:.45;cursor:default}.ptK59a_linkButton[data-danger]{color:var(--dsw-alias-state-error-primary)}.ptK59a_banner{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere;border-radius:8px;padding:8px 12px;font-size:12.5px;line-height:1.5}.ptK59a_banner[data-kind=ok]{color:var(--dsw-alias-state-success-primary);border-color:var(--dsw-alias-state-success-primary)}.ptK59a_banner[data-kind=error]{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary)}.ptK59a_empty{text-align:center;color:var(--dsw-alias-label-tertiary);padding:28px 12px;font-size:12.5px}.ptK59a_list{border:1px solid var(--dsw-alias-border-l1);border-radius:10px;flex-direction:column;flex:1;gap:14px;min-height:0;padding:8px 12px 10px;display:flex;overflow-y:auto}.ptK59a_group{flex-direction:column;gap:6px;display:flex}.ptK59a_groupToggle{width:100%;color:var(--dsw-alias-label-primary);cursor:pointer;text-align:left;background:0 0;border:none;border-radius:6px;align-items:center;gap:6px;padding:4px 2px;font-size:13px;font-weight:600;display:flex}.ptK59a_groupToggle:hover{background:var(--dsw-alias-interactive-bg-hover)}.ptK59a_groupCaret{border-bottom:1.5px solid;border-right:1.5px solid;flex:none;width:6px;height:6px;transition:transform .15s;transform:rotate(-45deg)}.ptK59a_groupToggle[aria-expanded=true] .ptK59a_groupCaret{transform:rotate(45deg)}.ptK59a_groupTitleText{font-weight:600}.ptK59a_count{color:var(--dsw-alias-label-secondary);margin-left:6px;font-weight:400}.ptK59a_groupHint{color:var(--dsw-alias-label-secondary);margin:0;font-size:11px}.ptK59a_skillRow{border-bottom:1px solid var(--dsw-alias-border-l1);padding:8px 0}.ptK59a_skillRow:last-child{border-bottom:none}.ptK59a_skillRow:hover{background:var(--dsw-alias-interactive-bg-hover)}.ptK59a_skillHeader{flex-wrap:wrap;align-items:center;gap:8px;display:flex}.ptK59a_skillName{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:600;font-family:var(--ds-font-family-code)}.ptK59a_badge{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);white-space:nowrap;border-radius:999px;padding:1px 8px;font-size:11px;line-height:1.6;display:inline-block}.ptK59a_badgeWorkspace{color:var(--dsw-alias-label-secondary)}.ptK59a_badgeInvokable{color:var(--dsw-alias-state-success-primary);border-color:var(--dsw-alias-state-success-primary)}.ptK59a_badgeIsolated{color:var(--dsw-alias-state-warn-primary);border-color:var(--dsw-alias-state-warn-primary)}.ptK59a_skillIsolated{opacity:.76}.ptK59a_skillIsolated:hover{opacity:.98}.ptK59a_switch{cursor:pointer;background:0 0;border:none;border-radius:99px;align-items:center;margin-left:auto;padding:2px;display:inline-flex}.ptK59a_switch:disabled{opacity:.45;cursor:default}.ptK59a_switchTrack{background:var(--dsw-alias-border-l2);border-radius:99px;flex:none;width:30px;height:16px;transition:background .18s;position:relative}.ptK59a_switchThumb{background:var(--dsw-alias-bg-base);border-radius:50%;width:12px;height:12px;transition:left .18s;position:absolute;top:2px;left:2px}.ptK59a_switch[aria-checked=true] .ptK59a_switchTrack{background:var(--dsw-alias-state-success-primary)}.ptK59a_switch[aria-checked=true] .ptK59a_switchThumb{left:16px}.ptK59a_deleteButton{margin-left:4px}.ptK59a_skillDesc{color:var(--dsw-alias-label-primary);margin:6px 0 0;font-size:12px;line-height:1.5}.ptK59a_skillWhen{color:var(--dsw-alias-label-secondary);margin:4px 0 0;font-size:11px}.ptK59a_skillPath{color:var(--dsw-alias-label-tertiary);font-size:10px;font-family:var(--ds-font-family-code);word-break:break-all;margin:6px 0 0}.ptK59a_form{flex-direction:column;gap:10px;max-width:640px;display:flex}.ptK59a_field{flex-direction:column;gap:5px;display:flex}.ptK59a_fieldLabel{color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600}.ptK59a_fieldGroup{border:none;flex-direction:column;gap:5px;margin:0;padding:0;display:flex}.ptK59a_radioRow{flex-wrap:wrap;align-items:center;gap:14px;display:flex}.ptK59a_outcomeList{flex-direction:column;gap:4px;max-height:260px;margin:8px 0 0;padding:0;list-style:none;display:flex;overflow-y:auto}.ptK59a_outcomeItem{flex-wrap:wrap;align-items:baseline;gap:8px;font-size:12px;display:flex}.ptK59a_outcomeName{font-family:var(--ds-font-family-code);color:var(--dsw-alias-label-primary);font-weight:600}.ptK59a_outcomeReason{color:var(--dsw-alias-label-secondary);font-size:11.5px}.ptK59a_outcomeItem[data-status=skipped] .ptK59a_outcomeReason{color:var(--dsw-alias-state-warn-primary)}.ptK59a_bannerAction{margin-left:8px}.ptK59a_input{color:var(--dsw-alias-label-primary);background:var(--dsw-specific-input-major);border:1px solid var(--dsw-alias-border-l2);resize:vertical;border-radius:8px;outline:none;padding:7px 10px;font-family:inherit;font-size:13px}.ptK59a_input:focus{border-color:var(--dsw-alias-state-business-primary)}.ptK59a_input::placeholder{color:var(--dsw-alias-label-tertiary)}.ptK59a_input:disabled{opacity:.55}.ptK59a_textarea{min-height:140px;font-family:var(--ds-font-family-code)}.ptK59a_note{color:var(--dsw-alias-label-tertiary);margin:0;font-size:11px;line-height:1.7}";
		var panel_module_css_default = {
			"badge": "ptK59a_badge",
			"badgeInvokable": "ptK59a_badgeInvokable",
			"badgeIsolated": "ptK59a_badgeIsolated",
			"badgeWorkspace": "ptK59a_badgeWorkspace",
			"banner": "ptK59a_banner",
			"bannerAction": "ptK59a_bannerAction",
			"checkboxLabel": "ptK59a_checkboxLabel",
			"count": "ptK59a_count",
			"deleteButton": "ptK59a_deleteButton",
			"empty": "ptK59a_empty",
			"facetBar": "ptK59a_facetBar",
			"facetChip": "ptK59a_facetChip",
			"facetCount": "ptK59a_facetCount",
			"facetLabel": "ptK59a_facetLabel",
			"facetRow": "ptK59a_facetRow",
			"field": "ptK59a_field",
			"fieldGroup": "ptK59a_fieldGroup",
			"fieldLabel": "ptK59a_fieldLabel",
			"fillBody": "ptK59a_fillBody",
			"form": "ptK59a_form",
			"formActions": "ptK59a_formActions",
			"ghostButton": "ptK59a_ghostButton",
			"group": "ptK59a_group",
			"groupCaret": "ptK59a_groupCaret",
			"groupHint": "ptK59a_groupHint",
			"groupTitleText": "ptK59a_groupTitleText",
			"groupToggle": "ptK59a_groupToggle",
			"input": "ptK59a_input",
			"linkButton": "ptK59a_linkButton",
			"list": "ptK59a_list",
			"note": "ptK59a_note",
			"outcomeItem": "ptK59a_outcomeItem",
			"outcomeList": "ptK59a_outcomeList",
			"outcomeName": "ptK59a_outcomeName",
			"outcomeReason": "ptK59a_outcomeReason",
			"panel": "ptK59a_panel",
			"panelContent": "ptK59a_panelContent",
			"panelHeader": "ptK59a_panelHeader",
			"panelTitle": "ptK59a_panelTitle",
			"primaryButton": "ptK59a_primaryButton",
			"radioRow": "ptK59a_radioRow",
			"search": "ptK59a_search",
			"select": "ptK59a_select",
			"skillDesc": "ptK59a_skillDesc",
			"skillHeader": "ptK59a_skillHeader",
			"skillIsolated": "ptK59a_skillIsolated",
			"skillName": "ptK59a_skillName",
			"skillPath": "ptK59a_skillPath",
			"skillRow": "ptK59a_skillRow",
			"skillWhen": "ptK59a_skillWhen",
			"switch": "ptK59a_switch",
			"switchThumb": "ptK59a_switchThumb",
			"switchTrack": "ptK59a_switchTrack",
			"tab": "ptK59a_tab",
			"tabBar": "ptK59a_tabBar",
			"tabBody": "ptK59a_tabBody",
			"textarea": "ptK59a_textarea",
			"toolbar": "ptK59a_toolbar",
			"toolbarSpacer": "ptK59a_toolbarSpacer",
			"view": "ptK59a_view"
		};
		//#endregion
		//#region src/client/panel/CreateTab.tsx
		/**
		* Create tab: the new-skill form (user or project root).
		*
		* The host's create route needs the workspace the panel is showing, which the
		* list payload carries. The inactive tab unmounts, so a user who opens this
		* tab first has no cwd: the first submit resolves it with one list call and
		* reuses it afterwards.
		*
		* A row's "duplicate as template" action leaves a draft in the controller and
		* opens this tab; the draft is read once at mount (the tab remounts on every
		* visit, so a later duplicate hands the next visit a fresh one) and dropped
		* from the controller once the skill is created or the draft is dismissed.
		*/
		/** The create tab body. */
		function CreateTab({ api, controller }) {
			const [template, setTemplate] = (0, react.useState)(() => controller.getSnapshot().template);
			const [root, setRoot] = (0, react.useState)("user");
			const [name, setName] = (0, react.useState)(template?.name ?? "");
			const [description, setDescription] = (0, react.useState)(template?.description ?? "");
			const [whenToUse, setWhenToUse] = (0, react.useState)(template?.whenToUse ?? "");
			const [content, setContent] = (0, react.useState)(template?.content ?? "");
			const [cwd, setCwd] = (0, react.useState)(void 0);
			const [busy, setBusy] = (0, react.useState)(false);
			const [feedback, setFeedback] = (0, react.useState)(void 0);
			/** Blank the form and drop the pending draft, so the next visit starts fresh. */
			const reset = () => {
				setName("");
				setDescription("");
				setWhenToUse("");
				setContent("");
				setTemplate(void 0);
				controller.clearTemplate();
			};
			const submit = async (event) => {
				event.preventDefault();
				if (name.trim() === "" || description.trim() === "" || content.trim() === "") {
					setFeedback({
						text: tt("create.empty"),
						kind: "error"
					});
					return;
				}
				setBusy(true);
				try {
					const workspace = cwd ?? (await api.list()).cwd;
					setCwd(workspace);
					const result = await api.create({
						root,
						name: name.trim(),
						description: description.trim(),
						whenToUse: whenToUse.trim() || void 0,
						content,
						cwd: workspace
					});
					setFeedback({
						text: tt("create.created", { path: result.path }),
						kind: "ok"
					});
					reset();
				} catch (err) {
					setFeedback({
						text: tt("create.failed", { error: err instanceof Error ? err.message : String(err) }),
						kind: "error"
					});
				} finally {
					setBusy(false);
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: panel_module_css_default.tabBody,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
					className: panel_module_css_default.form,
					onSubmit: (event) => {
						submit(event);
					},
					children: [
						template !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: panel_module_css_default.banner,
							"data-dsh-part": "template-banner",
							children: [tt("create.template", { name: template.from }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: `${panel_module_css_default.linkButton} ${panel_module_css_default.bannerAction}`,
								onClick: reset,
								children: tt("create.templateClear")
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: panel_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: panel_module_css_default.fieldLabel,
								children: tt("create.root")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
								className: panel_module_css_default.select,
								value: root,
								onChange: (event) => {
									setRoot(event.target.value);
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "user",
									children: tt("create.root.user")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "project",
									children: tt("create.root.project")
								})]
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: panel_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: panel_module_css_default.fieldLabel,
								children: tt("create.name")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								className: panel_module_css_default.input,
								value: name,
								placeholder: tt("create.namePlaceholder"),
								onChange: (event) => {
									setName(event.target.value);
								}
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: panel_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: panel_module_css_default.fieldLabel,
								children: tt("create.description")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								className: panel_module_css_default.input,
								value: description,
								onChange: (event) => {
									setDescription(event.target.value);
								}
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: panel_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: panel_module_css_default.fieldLabel,
								children: tt("create.whenToUse")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								className: panel_module_css_default.input,
								value: whenToUse,
								onChange: (event) => {
									setWhenToUse(event.target.value);
								}
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: panel_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: panel_module_css_default.fieldLabel,
								children: tt("create.content")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
								className: `${panel_module_css_default.input} ${panel_module_css_default.textarea}`,
								value: content,
								onChange: (event) => {
									setContent(event.target.value);
								}
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "submit",
							className: panel_module_css_default.primaryButton,
							disabled: busy,
							children: tt("create.submit")
						}),
						feedback !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: panel_module_css_default.banner,
							"data-kind": feedback.kind,
							children: feedback.text
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: panel_module_css_default.note,
							children: tt("create.note")
						})
					]
				})
			});
		}
		//#endregion
		//#region src/client/panel/EditTab.tsx
		/**
		* Edit tab: the in-place editor for one skill.
		*
		* The list carries metadata only, so the host re-reads the file before the form
		* is shown and writes it back on save; the name and the location are fixed, and
		* the enabled state keeps its own control on the row.
		*/
		/** The edit tab body. */
		function EditTab({ api, skill, onDone, onCancel }) {
			const skillPath = skill.path ?? "";
			const [description, setDescription] = (0, react.useState)("");
			const [whenToUse, setWhenToUse] = (0, react.useState)("");
			const [content, setContent] = (0, react.useState)("");
			const [loading, setLoading] = (0, react.useState)(true);
			const [busy, setBusy] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)(void 0);
			(0, react.useEffect)(() => {
				let cancelled = false;
				const load = async () => {
					try {
						const current = await api.read(skill.name, skillPath);
						if (cancelled) return;
						setDescription(current.description);
						setWhenToUse(current.whenToUse ?? "");
						setContent(current.content);
						setError(void 0);
					} catch (err) {
						if (cancelled) return;
						setError(tt("edit.loadFailed", { error: err instanceof Error ? err.message : String(err) }));
					} finally {
						if (!cancelled) setLoading(false);
					}
				};
				load();
				return () => {
					cancelled = true;
				};
			}, [
				api,
				skill.name,
				skillPath
			]);
			const submit = async (event) => {
				event.preventDefault();
				if (description.trim() === "" || content.trim() === "") {
					setError(tt("create.empty"));
					return;
				}
				setBusy(true);
				setError(void 0);
				try {
					await api.update({
						name: skill.name,
						path: skillPath,
						description: description.trim(),
						whenToUse: whenToUse.trim() || void 0,
						content
					});
					onDone();
				} catch (err) {
					setError(tt("edit.failed", { error: err instanceof Error ? err.message : String(err) }));
				} finally {
					setBusy(false);
				}
			};
			if (loading) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: panel_module_css_default.tabBody,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: panel_module_css_default.empty,
					children: tt("edit.loading")
				})
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: panel_module_css_default.tabBody,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
					className: panel_module_css_default.form,
					onSubmit: (event) => {
						submit(event);
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: panel_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: panel_module_css_default.fieldLabel,
								children: tt("edit.name")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								className: panel_module_css_default.input,
								value: skill.name,
								readOnly: true
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: panel_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: panel_module_css_default.fieldLabel,
								children: tt("create.description")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								className: panel_module_css_default.input,
								value: description,
								onChange: (event) => {
									setDescription(event.target.value);
								}
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: panel_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: panel_module_css_default.fieldLabel,
								children: tt("create.whenToUse")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								className: panel_module_css_default.input,
								value: whenToUse,
								onChange: (event) => {
									setWhenToUse(event.target.value);
								}
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: panel_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: panel_module_css_default.fieldLabel,
								children: tt("create.content")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
								className: `${panel_module_css_default.input} ${panel_module_css_default.textarea}`,
								value: content,
								onChange: (event) => {
									setContent(event.target.value);
								}
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: panel_module_css_default.formActions,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: panel_module_css_default.ghostButton,
								disabled: busy,
								onClick: onCancel,
								children: tt("edit.back")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "submit",
								className: panel_module_css_default.primaryButton,
								disabled: busy,
								children: tt("edit.submit")
							})]
						}),
						error !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: panel_module_css_default.banner,
							"data-kind": "error",
							children: error
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: panel_module_css_default.note,
							children: tt("edit.note")
						})
					]
				})
			});
		}
		//#endregion
		//#region src/client/import-source.ts
		/**
		* Import-source helpers (browser half): turn a file the user picked into the
		* base64 string the host route carries.
		*
		* The archive travels as base64 inside the JSON body rather than as a
		* multipart upload because the route family's shared body reader is JSON-only;
		* the cap here matches the host's own archive limit, so an oversized file is
		* refused before a multi-megabyte request is built.
		*/
		/**
		* The largest archive the import route accepts. Mirrors IMPORT_LIMITS in the
		* host half (src/import.ts): the browser refuses the file early instead of
		* streaming something the host would reject after reading it.
		*/
		const MAX_IMPORT_ARCHIVE_BYTES = 4 * 1024 * 1024;
		/** Chunk size for the fromCharCode conversion (well under the argument cap). */
		const BASE64_CHUNK = 32768;
		/**
		* Encode bytes as base64, in chunks.
		*
		* `String.fromCharCode(...bytes)` on a multi-megabyte array overflows the
		* argument list and throws, so the conversion walks the buffer in bounded
		* chunks before handing the binary string to btoa.
		* @param bytes - the raw archive bytes.
		* @returns the base64 encoding.
		*/
		function bytesToBase64(bytes) {
			let binary = "";
			for (let offset = 0; offset < bytes.length; offset += BASE64_CHUNK) binary += String.fromCharCode(...bytes.subarray(offset, offset + BASE64_CHUNK));
			return btoa(binary);
		}
		//#endregion
		//#region src/client/panel/ImportTab.tsx
		/**
		* Import tab: batch-create skills from a local directory or a .zip archive.
		*
		* Both forms end at the same host route. The directory form names a path on
		* the host, which is meaningful because the route is loopback-only (browser and
		* host are the same machine by construction); the archive form carries the
		* bytes the browser read, so the user picks the file through the ordinary file
		* dialog. Nothing is overwritten: every outcome the host reports says either
		* that one SKILL.md was created or why that candidate was skipped.
		*
		* The tab unmounts whenever another tab or panel takes the center column, so
		* the workspace it needs is resolved with one list call on the first import
		* (the same lazy pattern the create tab uses) instead of being held here.
		*/
		/** Human-readable size, for the archive cap message. */
		function megabytes(bytes) {
			return `${Math.round(bytes / (1024 * 1024))}MB`;
		}
		/** Localized skip reason with a fallback for an outcome that carries none. */
		function reasonLabel(outcome) {
			if (outcome.status === "imported") return tt("import.imported");
			const reason = outcome.reason;
			return reason === void 0 ? tt("import.reason.unknown") : tt(`import.reason.${reason}`);
		}
		/** The import tab body. */
		function ImportTab({ api }) {
			const [root, setRoot] = (0, react.useState)("user");
			const [mode, setMode] = (0, react.useState)("directory");
			const [dir, setDir] = (0, react.useState)("");
			const [archive, setArchive] = (0, react.useState)(void 0);
			const [cwd, setCwd] = (0, react.useState)(void 0);
			const [busy, setBusy] = (0, react.useState)(false);
			const [report, setReport] = (0, react.useState)(void 0);
			const [error, setError] = (0, react.useState)(void 0);
			const busyRef = (0, react.useRef)(false);
			const chooseArchive = async (event) => {
				const file = event.target.files?.[0];
				setReport(void 0);
				if (file === void 0) {
					setArchive(void 0);
					return;
				}
				if (file.size > 4194304) {
					setArchive(void 0);
					setError(tt("import.archiveTooLarge", { size: megabytes(MAX_IMPORT_ARCHIVE_BYTES) }));
					return;
				}
				setError(void 0);
				try {
					setArchive({
						name: file.name,
						data: bytesToBase64(new Uint8Array(await file.arrayBuffer()))
					});
				} catch (err) {
					setArchive(void 0);
					setError(tt("import.failed", { error: err instanceof Error ? err.message : String(err) }));
				}
			};
			const submit = async (event) => {
				event.preventDefault();
				if (busyRef.current) return;
				let source;
				if (mode === "directory") {
					if (dir.trim() === "") {
						setError(tt("import.directoryRequired"));
						return;
					}
					source = {
						kind: "directory",
						path: dir.trim()
					};
				} else {
					if (archive === void 0) {
						setError(tt("import.archiveRequired"));
						return;
					}
					source = {
						kind: "archive",
						data: archive.data
					};
				}
				busyRef.current = true;
				setBusy(true);
				setError(void 0);
				setReport(void 0);
				try {
					const workspace = cwd ?? (await api.list()).cwd;
					setCwd(workspace);
					setReport(await api.importSkills({
						root,
						cwd: workspace,
						source
					}));
				} catch (err) {
					setError(tt("import.failed", { error: err instanceof Error ? err.message : String(err) }));
				} finally {
					busyRef.current = false;
					setBusy(false);
				}
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: panel_module_css_default.tabBody,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("form", {
					className: panel_module_css_default.form,
					onSubmit: (event) => {
						submit(event);
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: panel_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: panel_module_css_default.fieldLabel,
								children: tt("import.root")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
								className: panel_module_css_default.select,
								value: root,
								onChange: (event) => {
									setRoot(event.target.value);
								},
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "user",
									children: tt("create.root.user")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "project",
									children: tt("create.root.project")
								})]
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("fieldset", {
							className: panel_module_css_default.fieldGroup,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("legend", {
								className: panel_module_css_default.fieldLabel,
								children: tt("import.source")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: panel_module_css_default.radioRow,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: panel_module_css_default.checkboxLabel,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "radio",
										name: "import-mode",
										checked: mode === "directory",
										onChange: () => {
											setMode("directory");
										}
									}), tt("import.source.directory")]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: panel_module_css_default.checkboxLabel,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "radio",
										name: "import-mode",
										checked: mode === "archive",
										onChange: () => {
											setMode("archive");
										}
									}), tt("import.source.archive")]
								})]
							})]
						}),
						mode === "directory" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: panel_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: panel_module_css_default.fieldLabel,
								children: tt("import.directoryLabel")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								className: panel_module_css_default.input,
								value: dir,
								spellCheck: false,
								placeholder: tt("import.directoryPlaceholder"),
								onChange: (event) => {
									setDir(event.target.value);
								}
							})]
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: panel_module_css_default.field,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: panel_module_css_default.fieldLabel,
									children: tt("import.archiveLabel")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "file",
									accept: ".zip,application/zip",
									"aria-label": tt("import.archiveLabel"),
									onChange: (event) => {
										chooseArchive(event);
									}
								}),
								archive !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: panel_module_css_default.note,
									children: archive.name
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "submit",
							className: panel_module_css_default.primaryButton,
							disabled: busy,
							children: tt("import.submit")
						}),
						error !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: panel_module_css_default.banner,
							"data-kind": "error",
							children: error
						}),
						report !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							"data-dsh-part": "import-report",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
								className: panel_module_css_default.banner,
								"data-kind": report.imported > 0 ? "ok" : void 0,
								children: tt("import.summary", {
									imported: report.imported,
									skipped: report.skipped
								})
							}), report.outcomes.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
								className: panel_module_css_default.outcomeList,
								children: report.outcomes.map((outcome) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
									className: panel_module_css_default.outcomeItem,
									"data-status": outcome.status,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: panel_module_css_default.outcomeName,
											children: outcome.name
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: panel_module_css_default.outcomeReason,
											children: reasonLabel(outcome)
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: panel_module_css_default.skillPath,
											children: outcome.origin
										})
									]
								}, outcome.origin))
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: panel_module_css_default.note,
							children: tt("import.note")
						})
					]
				})
			});
		}
		//#endregion
		//#region src/client/panel-prefs.ts
		/** The localStorage key holding the whole preference document. */
		const LIST_VIEW_STORAGE_KEY = "dsh-skill-explorer:list-view:v1";
		/**
		* Source groups opened on first use. These are the roots the user is actively
		* working with (project and user skills); the global and machine-level
		* sources — system bundled, custom directories, runtime registrations — start
		* collapsed so a wide catalog does not paint every row at once.
		*/
		const DEFAULT_EXPANDED_LEVELS = [
			"project-dsh",
			"project-agents",
			"user-dsh",
			"user-agents"
		];
		/** Bounds on the persisted document, so a hostile or buggy write stays small. */
		const MAX_LIST_ENTRIES = 64;
		const MAX_STORAGE_BYTES = 8 * 1024;
		const STATUSES = [
			"all",
			"enabled",
			"disabled"
		];
		const MARKS = [
			"linked",
			"provider-file",
			"no-file"
		];
		/** The preferences a browser with no stored document uses. */
		function defaultListPrefs() {
			return {
				levels: [],
				status: "all",
				marks: [],
				collapsed: {}
			};
		}
		/** Read a bounded string array, dropping anything that is not a string. */
		function stringList(value, allowed) {
			if (!Array.isArray(value)) return [];
			const out = [];
			for (const entry of value) {
				if (typeof entry !== "string" || entry === "") continue;
				if (allowed !== void 0 && !allowed.includes(entry)) continue;
				if (out.includes(entry)) continue;
				out.push(entry);
				if (out.length >= MAX_LIST_ENTRIES) break;
			}
			return out;
		}
		/** Read the collapse map, keeping boolean decisions only. */
		function collapseMap(value) {
			if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
			const out = {};
			let kept = 0;
			for (const [key, decision] of Object.entries(value)) {
				if (typeof decision !== "boolean" || key === "") continue;
				out[key] = decision;
				kept += 1;
				if (kept >= MAX_LIST_ENTRIES) break;
			}
			return out;
		}
		/**
		* Read the stored preferences, falling back to the defaults for a missing,
		* unreadable, oversized or malformed document. Every field is validated on its
		* own, so one bad field never discards the rest of the user's view.
		* @param storage - storage to read, or undefined when none is available.
		* @returns the preferences the tab should start from.
		*/
		function loadListPrefs(storage) {
			const defaults = defaultListPrefs();
			if (storage === void 0) return defaults;
			let raw;
			try {
				raw = storage.getItem(LIST_VIEW_STORAGE_KEY);
			} catch {
				return defaults;
			}
			if (raw === null || raw === "" || raw.length > MAX_STORAGE_BYTES) return defaults;
			let parsed;
			try {
				parsed = JSON.parse(raw);
			} catch {
				return defaults;
			}
			if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return defaults;
			const document = parsed;
			const status = document.status;
			return {
				levels: stringList(document.levels),
				status: typeof status === "string" && STATUSES.includes(status) ? status : defaults.status,
				marks: stringList(document.marks, MARKS),
				collapsed: collapseMap(document.collapsed)
			};
		}
		/**
		* Persist the preferences. A browser that refuses storage (private mode, a
		* sandboxed frame, a full quota) is not an error: the view still works for
		* this page load, it just does not survive a refresh.
		* @param storage - storage to write, or undefined when none is available.
		* @param prefs - the preferences to store.
		* @returns whether the document was persisted.
		*/
		function saveListPrefs(storage, prefs) {
			if (storage === void 0) return false;
			try {
				storage.setItem(LIST_VIEW_STORAGE_KEY, JSON.stringify(prefs));
				return true;
			} catch {
				return false;
			}
		}
		/**
		* Whether a source group is open, given the user's recorded decisions.
		* @param key - the group's source key.
		* @param collapsed - recorded per-group decisions.
		* @returns whether the group's rows are visible.
		*/
		function isGroupExpanded(key, collapsed) {
			const recorded = collapsed[key];
			return recorded === void 0 ? DEFAULT_EXPANDED_LEVELS.includes(key) : !recorded;
		}
		/**
		* Flip one group's collapse decision, recording it explicitly so the choice
		* survives a remount and later default changes cannot silently reopen it.
		* @param key - the group's source key.
		* @param collapsed - current recorded decisions.
		* @returns a new decision map with this group flipped.
		*/
		function toggleGroupCollapsed(key, collapsed) {
			return {
				...collapsed,
				[key]: isGroupExpanded(key, collapsed)
			};
		}
		//#endregion
		//#region src/client/skill-filter.ts
		/**
		* Match rank of one skill against a lowercased needle: 0 when the name hits,
		* 1 when only the description hits, undefined when neither does. An empty
		* needle matches everything at rank 0.
		*/
		function matchRank(skill, needle) {
			if (needle === "") return 0;
			if (skill.name.toLowerCase().includes(needle)) return 0;
			if (skill.description.toLowerCase().includes(needle)) return 1;
		}
		/**
		* The marks a row carries. "Provided by plugin" and "No local file" are the
		* two halves of one classification (a file the panel cannot write versus no
		* file at all), so at most one of them ever applies; a symlinked skill is a
		* separate fact and can carry either.
		* @param skill - the row's entry.
		* @returns every mark that applies to the row.
		*/
		function marksOf(skill) {
			const marks = [];
			if (skill.fileState === "provider-file") marks.push("provider-file");
			else if (skill.fileState === "virtual") marks.push("no-file");
			if (skill.linked === true) marks.push("linked");
			return marks;
		}
		/**
		* Whether a skill survives the mark facet. An empty selection keeps every row;
		* a non-empty one keeps a row carrying ANY selected mark, the same union
		* semantics the source facet uses, so ticking two boxes widens the result
		* instead of emptying it.
		*/
		function inMarks(skill, marks) {
			if (marks === void 0 || marks.length === 0) return true;
			const carried = marksOf(skill);
			return marks.some((mark) => carried.includes(mark));
		}
		/**
		* Whether a skill survives the enabled/disabled facet. This reads the model's
		* automatic-invocation state (the same value the row's switch shows), not the
		* user-invocable policy, so "disabled" means exactly what the switch reads.
		*/
		function inStatus(skill, status) {
			if (status === void 0 || status === "all") return true;
			return status === "enabled" ? skill.modelInvocable : !skill.modelInvocable;
		}
		/**
		* Whether a skill survives the workspace axis. Skills without a workspace
		* root are global and stay visible in every selection; that is the pre-search
		* behavior and the search must not change it.
		*/
		function inWorkspace(skill, workspace) {
			if (workspace === "all") return true;
			return skill.workspaceRoot === void 0 || skill.workspaceRoot === workspace;
		}
		/**
		* Apply every axis to a payload's groups: the source facet drops whole groups,
		* then the workspace, status, mark and query axes narrow each one (name hits
		* ranked before description hits, stable within a rank). Empty groups are
		* dropped so the caller renders only what has content.
		* @param groups - host payload groups in host order.
		* @param filter - workspace + query + optional source / status / mark facets.
		* @returns the visible groups; the input is never mutated.
		*/
		function selectGroups(groups, filter) {
			const needle = filter.query.trim().toLowerCase();
			const levels = filter.levels ?? [];
			return groups.filter((group) => levels.length === 0 || levels.includes(group.key)).map((group) => {
				const ranked = group.skills.filter((skill) => inWorkspace(skill, filter.workspace) && inStatus(skill, filter.status) && inMarks(skill, filter.marks)).map((skill) => ({
					skill,
					rank: matchRank(skill, needle)
				})).filter((row) => row.rank !== void 0);
				if (needle !== "") ranked.sort((left, right) => left.rank - right.rank);
				return {
					...group,
					skills: ranked.map((row) => row.skill)
				};
			}).filter((group) => group.skills.length > 0);
		}
		//#endregion
		//#region src/client/panel/SkillsTab.tsx
		/**
		* Skills tab: the grouped skill list with the search / facet / workspace
		* toolbar, collapsible source groups, and the per-row enable switch, edit,
		* duplicate and delete actions.
		*
		* The host route family is the only data source; a failed refresh keeps the
		* previous payload visible with an inline error. Which facets are applied and
		* which source groups are open are view preferences, not payload state: they
		* are persisted in localStorage (panel-prefs.ts), because the layout unmounts
		* this page whenever another panel takes the center column.
		*/
		/** The mark facets, in the order the filter bar lists them. */
		const MARK_FACETS = [
			"provider-file",
			"no-file",
			"linked"
		];
		/** The enabled/disabled facets, in the order the filter bar lists them. */
		const STATUS_FACETS = [
			"all",
			"enabled",
			"disabled"
		];
		/** Localized provider label with fallback to the raw provider id. */
		function providerLabel(provider) {
			const key = `provider.${provider}`;
			return key in zh ? tt(key) : provider;
		}
		/** Localized source-group title, falling back to the host's own copy. */
		function groupTitle(group) {
			const key = `group.${group.key}`;
			return key in zh ? tt(key) : group.title;
		}
		/** Localized source-group hint, falling back to the host's own copy. */
		function groupHintOf(group) {
			const key = `groupHint.${group.key}`;
			return key in zh ? tt(key) : group.hint;
		}
		/** The browser's localStorage, or undefined when this context refuses it. */
		function listStorage() {
			try {
				return typeof localStorage === "undefined" ? void 0 : localStorage;
			} catch {
				return;
			}
		}
		/** Whether any facet narrows the list (the source/status/mark facets only). */
		function hasActiveFacets(prefs) {
			return prefs.levels.length > 0 || prefs.status !== "all" || prefs.marks.length > 0;
		}
		/** How many facet selections are active, for the toolbar badge. */
		function activeFacetCount(prefs) {
			return prefs.levels.length + (prefs.status === "all" ? 0 : 1) + prefs.marks.length;
		}
		/** The name a duplicate starts from; the user can change it before creating. */
		function duplicateSkillName(name) {
			return `${name}-copy`;
		}
		/**
		* Whether this row carries an enable switch.
		*
		* A row with a writable path switches by rewriting its own SKILL.md
		* frontmatter. A plugin-provided file (issue #1854) has no such path, so its
		* switch is recorded in the panel's own store; a truly fileless registration
		* has nothing to switch and still shows none.
		* @param skill - the row's entry.
		* @returns whether the row offers the switch.
		*/
		function canToggle(skill) {
			return skill.path !== void 0 || skill.fileState === "provider-file";
		}
		/**
		* The local-file badge for a row that the write routes cannot serve.
		*
		* A skill with a plugin-supplied file and a skill with no file at all are
		* different facts (issue #1842): the first is "Provided by plugin", only the
		* second is "No local file". Both are pathless, so neither offers file
		* controls.
		* @param skill - the row's entry.
		* @returns the badge copy and its tooltip.
		*/
		function localFileBadge(skill) {
			return skill.fileState === "provider-file" ? {
				label: tt("list.providerFile"),
				tooltip: tt("list.providerFileTooltip")
			} : {
				label: tt("list.noFile"),
				tooltip: tt("list.noFileTooltip")
			};
		}
		/** The explanation shown under a row the write routes cannot serve. */
		function localFileHint(skill) {
			return skill.fileState === "provider-file" ? tt("list.providerFileHint") : tt("list.noFileHint");
		}
		/** Marks shown next to a skill (model/user invocable). */
		function invokableMarks(skill) {
			const marks = [];
			if (skill.modelInvocable) marks.push(tt("list.mark.model"));
			if (skill.userInvocable) marks.push(tt("list.mark.user"));
			return marks.join(" / ");
		}
		/** One skill row: name, badges, enable switch, edit, duplicate and delete actions. */
		function SkillRow({ skill, api, onChanged, onEdit, onDuplicate }) {
			const [busy, setBusy] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)(void 0);
			const busyRef = (0, react.useRef)(false);
			const toggle = async () => {
				if (busyRef.current || !canToggle(skill)) return;
				busyRef.current = true;
				setBusy(true);
				setError(void 0);
				try {
					if (skill.path !== void 0) await api.setEnabled(skill.name, skill.path, !skill.modelInvocable);
					else await api.setProviderEnabled(skill.name, skill.provider, !skill.modelInvocable);
					onChanged();
				} catch (err) {
					setError(tt("list.toggleFailed", { error: err instanceof Error ? err.message : String(err) }));
				} finally {
					busyRef.current = false;
					setBusy(false);
				}
			};
			const remove = async () => {
				const path = skill.path;
				if (path === void 0) return;
				if (!window.confirm(tt("list.deleteConfirm", { name: skill.name }))) return;
				if (busyRef.current) return;
				busyRef.current = true;
				setBusy(true);
				setError(void 0);
				try {
					await api.remove(skill.name, path);
					onChanged();
				} catch (err) {
					setError(tt("list.deleteFailed", { error: err instanceof Error ? err.message : String(err) }));
				} finally {
					busyRef.current = false;
					setBusy(false);
				}
			};
			/**
			* Copy this skill's fields into the create form as a starting point. The
			* read route resolves the row's own path through a fresh scan, so the draft
			* can only ever come from a skill the panel is showing.
			*/
			const duplicate = async () => {
				const path = skill.path;
				if (path === void 0 || busyRef.current) return;
				busyRef.current = true;
				setBusy(true);
				setError(void 0);
				try {
					const source = await api.read(skill.name, path);
					onDuplicate({
						from: skill.name,
						name: duplicateSkillName(skill.name),
						description: source.description,
						...source.whenToUse === void 0 ? {} : { whenToUse: source.whenToUse },
						content: source.content
					});
				} catch (err) {
					setError(tt("list.duplicateFailed", { error: err instanceof Error ? err.message : String(err) }));
				} finally {
					busyRef.current = false;
					setBusy(false);
				}
			};
			const isIsolated = skill.isActiveWorkspace === false;
			const fileBadge = skill.path === void 0 ? localFileBadge(skill) : void 0;
			const canCopy = skill.path !== void 0;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("article", {
				className: `${panel_module_css_default.skillRow}${isIsolated ? ` ${panel_module_css_default.skillIsolated}` : ""}`,
				"data-dsh-part": "skill-row",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: panel_module_css_default.skillHeader,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: panel_module_css_default.skillName,
								children: skill.name
							}),
							skill.workspaceName !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: `${panel_module_css_default.badge} ${panel_module_css_default.badgeWorkspace}`,
								children: skill.workspaceName
							}),
							isIsolated && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: `${panel_module_css_default.badge} ${panel_module_css_default.badgeIsolated}`,
								title: tt("workspace.isolatedHint", { workspace: skill.workspaceName ?? "" }),
								children: tt("workspace.isolated")
							}),
							skill.provider !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: panel_module_css_default.badge,
								title: tt("provider.tooltip", { provider: providerLabel(skill.provider) }),
								children: providerLabel(skill.provider)
							}),
							skill.linked === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: panel_module_css_default.badge,
								children: tt("list.linked")
							}),
							fileBadge !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: panel_module_css_default.badge,
								title: fileBadge.tooltip,
								children: fileBadge.label
							}),
							(skill.modelInvocable || skill.userInvocable) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: `${panel_module_css_default.badge} ${panel_module_css_default.badgeInvokable}`,
								title: tt("list.invokableTooltip"),
								children: tt("list.invokable", { marks: invokableMarks(skill) })
							}),
							canToggle(skill) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: panel_module_css_default.switch,
								role: "switch",
								"aria-checked": skill.modelInvocable,
								"aria-label": skill.modelInvocable ? tt("list.enabled") : tt("list.disabled"),
								title: skill.modelInvocable ? tt("list.enabled") : tt("list.disabled"),
								disabled: busy,
								onClick: () => {
									toggle();
								},
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: panel_module_css_default.switchTrack,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { className: panel_module_css_default.switchThumb })
								})
							}),
							canCopy && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: panel_module_css_default.linkButton,
								disabled: busy,
								onClick: () => {
									duplicate();
								},
								children: tt("list.duplicate")
							}),
							skill.path !== void 0 && skill.linked !== true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: panel_module_css_default.linkButton,
								disabled: busy,
								onClick: () => {
									onEdit(skill);
								},
								children: tt("list.edit")
							}),
							skill.path !== void 0 && skill.linked !== true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: `${panel_module_css_default.linkButton} ${panel_module_css_default.deleteButton}`,
								"data-danger": "",
								disabled: busy,
								onClick: () => {
									remove();
								},
								children: tt("list.delete")
							})
						]
					}),
					CategoryRow && react.createElement(CategoryRow, {skill}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: panel_module_css_default.skillDesc,
						children: skill.description
					}),
					skill.whenToUse !== void 0 && skill.whenToUse !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: panel_module_css_default.skillWhen,
						children: tt("list.when", { when: skill.whenToUse })
					}),
					skill.path !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: panel_module_css_default.skillPath,
						children: skill.path
					}),
					skill.path === void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: panel_module_css_default.skillWhen,
						children: localFileHint(skill)
					}),
					error !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: panel_module_css_default.banner,
						"data-kind": "error",
						children: error
					})
				]
			});
		}
		/** The skills tab body. */
		function SkillsTab(props) { return UnifiedSkillsView ? react.createElement(UnifiedSkillsView, props) : null; }
		//#endregion
		//#region src/client/panel/SkillPanel.tsx
		/**
		* The skill center panel shell: a title header, a tab bar, and the active
		* tab's content.
		*
		* The tab and the editor target live in the controller, not in component
		* state: the layout mounts this page only while the panel is selected, so
		* local state would drop the open tab and any in-progress edit on every panel
		* switch. The inactive tab unmounts, so the tab that needs the workspace
		* resolves it itself and the list refetches when it returns.
		*
		* The edit tab appears only while a skill is being edited: the list row hands
		* the chosen skill over, and leaving the editor returns to the list. The
		* import tab is always listed, and the list's import button opens it; a row's
		* "duplicate as template" action hands a draft to the create tab through the
		* controller for the same mount reason.
		*/
		/** The skill center panel. */
		let UnifiedSkillsView, CategoryRow;
		function SkillPanel({ controller, api }) {
			const { activeTab, editing } = (0, react.useSyncExternalStore)((listener) => controller.subscribe(listener), () => controller.getSnapshot());
			const tabs = [
				{
					id: "skills",
					label: () => tt("tab.list")
				},
				{
					id: "create",
					label: () => tt("tab.create")
				},
				{
					id: "import",
					label: () => tt("tab.import")
				},
				...editing === void 0 ? [] : [{
					id: "edit",
					label: () => tt("tab.edit")
				}]
			];
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: panel_module_css_default.panel,
				"data-dsh-plugin": "skill-explorer",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: panel_module_css_default.panelHeader,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
							className: panel_module_css_default.panelTitle,
							children: tt("panel.title")
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: panel_module_css_default.tabBar,
						role: "tablist",
						"data-dsh-part": "tab-bar",
						children: tabs.map((tab) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": activeTab === tab.id,
							"data-active": activeTab === tab.id ? "" : void 0,
							"data-dsh-part": "tab",
							className: panel_module_css_default.tab,
							onClick: () => {
								controller.setActiveTab(tab.id);
							},
							children: tab.label()
						}, tab.id))
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: panel_module_css_default.panelContent,
						children: [
							activeTab === "skills" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SkillsTab, {
								api,
								onEdit: (skill) => {
									controller.openEditor(skill);
								},
								onImport: () => {
									controller.setActiveTab("import");
								},
								onDuplicate: (draft) => {
									controller.openCreateFromTemplate(draft);
								}
							}),
							activeTab === "create" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CreateTab, {
								api,
								controller
							}),
							activeTab === "import" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ImportTab, { api }),
							activeTab === "edit" && editing !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(EditTab, {
								api,
								skill: editing,
								onDone: () => {
									controller.closeEditor();
								},
								onCancel: () => {
									controller.closeEditor();
								}
							})
						]
					})
				]
			});
		}
		//#endregion
		//#region src/client/native-panel.tsx
		/** Row order among the shell's global panel rows (Plugins 0, Schedule 10, board 20). */
		const PANEL_ORDER = 30;
		/**
		* The sidebar row glyph the shell asks for at its own size and active state.
		* The shell owns the button, label, tooltip and rail geometry; this component
		* draws only the glyph, like every other panel row.
		*
		* The glyph carries `data-dsh-panel-entry` because it is the only DOM this
		* panel's own code owns inside that shell-owned row: the L2 contract (skins)
		* resolves which row belongs to which plugin through it, since the shell
		* stamps no per-entry hook of its own (see contracts/semantic-attrs-v1.md).
		* @param props - the shell's icon share: square edge and selection state.
		* @returns the decorative skill-center glyph.
		*/
		function SkillExplorerPanelIcon({ size }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
				"data-dsh-panel-entry": SKILL_EXPLORER_PANEL_ID,
				viewBox: "0 0 16 16",
				width: size,
				height: size,
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "1.3",
				strokeLinecap: "round",
				strokeLinejoin: "round",
				"aria-hidden": "true",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8 3.2C6.6 2 4.5 2 3 2v10.5c1.5 0 3.6 0 5 1.3 1.4-1.3 3.5-1.3 5-1.3V2c-1.5 0-3.6 0-5 1.2z" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", { d: "M8 3.2v10.6" })]
			});
		}
		/**
		* The main-slot page. The layout mounts it only while this panel is selected,
		* so the conversation keeps the center column untouched the rest of the time;
		* the wrapper carries the pinned `data-dsh-skill-explorer-view` semantic
		* anchor (L2 contract, skins) the takeover container used to own.
		* @param props - the framework main-slot share plus this entry's injected face.
		* @returns the skill center page.
		*/
		function SkillExplorerPanelPage({ controller, api }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: panel_module_css_default.view,
				"data-dsh-skill-explorer-view": "",
				"data-dsh-plugin": "skill-explorer",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SkillPanel, {
					controller,
					api
				})
			});
		}
		/**
		* Register the skill center's sidebar row and center-column page.
		*
		* Both seats are declared by shell plugins this package does not depend on at
		* runtime, so each registration is wrapped in `ctx.slots.inject`: the callback
		* runs only after the owning entry declares the seat, and a shell that never
		* declares it leaves the panel simply absent instead of failing boot.
		* @param ctx - client root context (services: slots).
		* @param controller - the controller the page and the row drive.
		* @param api - the skill center API client the page operates through.
		* @returns disposer releasing both registrations.
		*/
return { SkillApi, PanelController, Page:SkillExplorerPanelPage, css, SkillRow, selectGroups, groupTitle, groupHintOf, loadListPrefs, saveListPrefs, listStorage, MARK_FACETS, STATUS_FACETS, initialize(ctx, extension) { UnifiedSkillsView=extension.UnifiedSkillsView; CategoryRow=extension.CategoryRow; ctx.effect(()=>ctx.locale.register('dsh-skill-explorer',{zh,en}),'skill-center: dictionaries'); setRuntimeTranslate(ctx.locale.bind('dsh-skill-explorer')); } };
});
    const pickerTools = ((()=>{// Shared pure/host-face helpers for the composer picker. No filesystem or draft fallback.
function createPickerTools() {
  const validName=name=>typeof name==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name);
  function assignmentFor(snapshot,name){return Object.hasOwn(snapshot?.assignments||{},name)?snapshot.assignments[name]:undefined;}
  function filterSkills(skills,snapshot,{category='all',query=''}={}) {
    const terms=String(query).trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const categories=new Map((snapshot?.categories||[]).map(c=>[c.id,c.name]));
    return skills.filter(skill=>{
      if(!validName(skill.name))return false;
      const assignment=assignmentFor(snapshot,skill.name);
      const id=categories.has(assignment?.categoryId)?assignment.categoryId:null;
      if(category==='uncategorized'?id!==null:category!=='all'&&id!==category)return false;
      const text=[skill.name,skill.description||'',categories.get(id)||'未分类',...(assignment?.tags||[])].join(' ').toLocaleLowerCase();
      return terms.every(term=>text.includes(term));
    }).sort((a,b)=>a.name.localeCompare(b.name));
  }
  async function loadCatalog({sessions,remote},sessionId,signal) {
    signal.throwIfAborted();
    if(sessions.subagentAddress(sessionId)!==undefined)throw new Error('子代理会话暂不支持分类引用。');
    if(sessions.binding(sessionId)===undefined)throw new Error('当前会话尚未就绪，请关闭后重试。');
    return sessions.using(sessionId,{source:'skillCategoriesPicker',signal},async reference=>{
      signal.throwIfAborted();
      const state=reference.binding.session.getSnapshot();
      if(state.openState!=='open')throw new Error('当前会话尚未打开，请关闭后重试。');
      const result=await remote.skills.list({sessionId},signal);
      signal.throwIfAborted();
      if(!result?.ok||!Array.isArray(result.value?.skills))throw new Error('技能目录读取失败，请关闭后重试。');
      return result.value.skills.filter(skill=>validName(skill.name));
    });
  }
  function insert(inputActions,name) {
    if(!validName(name)||typeof inputActions?.captureInsertion!=='function'||typeof inputActions?.insertText!=='function')return false;
    try {
      const span=inputActions.captureInsertion();
      if(!span||!Number.isSafeInteger(span.draftRev)||!Number.isSafeInteger(span.start)||!Number.isSafeInteger(span.end)||span.start<0||span.end<span.start)return false;
      return inputActions.insertText(`/${name} `,span)===true;
    }catch{return false;}
  }
  return {filterSkills,loadCatalog,insert};
}

return createPickerTools;})())();
    const unifiedTools = ((()=>{// Self-contained: build embeds createUnifiedTools.toString(), so keep all helpers inside.
function createUnifiedTools() {
  const own = (object, key) => object != null && Object.prototype.hasOwnProperty.call(object, key);
  const validName = name => typeof name === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name);
  const list = value => Array.isArray(value) ? value : [];
  const text = value => typeof value === 'string' ? value : '';

  /** Preserve native row identity, ordering and duplicates; never use snapshot.skills. */
  function filterGroups(groups, snapshot, { category = 'all', query = '', pending = [] } = {}) {
    const categories = new Map(list(snapshot?.categories).map(item => [item.id, item]));
    const pendingNames = new Set(list(pending));
    const needle = text(query).trim().toLowerCase();
    return list(groups).map(group => ({
      ...group,
      skills: list(group.skills).filter(skill => {
        const assignment = own(snapshot?.assignments, skill.name) ? snapshot.assignments[skill.name] : undefined;
        const current = categories.get(assignment?.categoryId);
        const matches = category === 'all' ||
          (category === 'uncategorized' && !current) ||
          (category === 'pending' && pendingNames.has(skill.name)) ||
          (!['all', 'uncategorized', 'pending'].includes(category) && current?.id === category);
        if (!matches) return false;
        return !needle || [text(skill.name), text(skill.description), text(current?.name), ...list(assignment?.tags).map(text)]
          .join(' ').toLowerCase().includes(needle);
      })
    })).filter(group => group.skills.length > 0);
  }

  function createView({ React, explorer, controller, useController, styles, Button }) {
    const h = React.createElement;
    const { useState, useEffect, useRef } = React;
    const statusLabels = { all: '全部状态', enabled: '已启用', disabled: '已停用' };
    const markLabels = { 'provider-file': '插件提供文件', 'no-file': '无本地文件', linked: '符号链接' };
    const errorText = error => error instanceof Error ? error.message : String(error);
    const readPrefs = () => {
      try { return explorer.loadListPrefs(explorer.listStorage()); }
      catch { return { levels: [], status: 'all', marks: [], collapsed: {} }; }
    };

    return function UnifiedSkillsView({ api, onEdit, onImport, onDuplicate }) {
      const state = useController(controller);
      const snapshot = state.views?.[''];
      const [payload, setPayload] = useState(null);
      const [query, setQuery] = useState('');
      const [category, setCategory] = useState('all');
      const [workspace, setWorkspace] = useState('all');
      const [prefs, setPrefs] = useState(readPrefs);
      const [source, setSource] = useState(() => list(prefs.levels).length === 1 ? prefs.levels[0] : 'all');
      const [filtersOpen, setFiltersOpen] = useState(() => list(prefs.marks).length > 0);
      const [selected, setSelected] = useState(() => new Set());
      const [loading, setLoading] = useState(true);
      const [metadataLoading, setMetadataLoading] = useState(true);
      const [listError, setListError] = useState('');
      const [metadataError, setMetadataError] = useState('');
      const live = useRef(false);
      const loadSeq = useRef(0);
      const metadataSeq = useRef(0);

      async function loadInventory() {
        const seq = ++loadSeq.current;
        if (!live.current) return;
        setLoading(true);
        try {
          const next = await api.list();
          if (!next || !Array.isArray(next.groups)) throw new Error('技能列表响应格式无效。');
          if (!live.current || seq !== loadSeq.current) return;
          setPayload(next);
          setListError('');
        } catch (error) {
          if (live.current && seq === loadSeq.current) setListError(errorText(error));
        } finally {
          if (live.current && seq === loadSeq.current) setLoading(false);
        }
      }
      async function loadMetadata() {
        const seq = ++metadataSeq.current;
        if (!live.current) return;
        setMetadataLoading(true);
        try {
          const next = await controller.refresh(null);
          if (!next) throw new Error('分类信息读取失败；技能文件列表仍可使用。');
          if (live.current && seq === metadataSeq.current) setMetadataError('');
        } catch (error) {
          if (live.current && seq === metadataSeq.current) setMetadataError(errorText(error));
        } finally {
          if (live.current && seq === metadataSeq.current) setMetadataLoading(false);
        }
      }
      async function reload() {
        // A category failure must never turn a successful inventory refresh into a failure.
        await Promise.all([loadInventory(), loadMetadata()]);
      }
      useEffect(() => {
        live.current = true;
        void reload();
        return () => { live.current = false; ++loadSeq.current; ++metadataSeq.current; };
      }, [api, controller]);
      useEffect(() => {
        try { explorer.saveListPrefs(explorer.listStorage(), prefs); } catch { /* Storage is optional. */ }
      }, [prefs]);

      const categories = list(snapshot?.categories);
      const selectedCategory = ['all', 'uncategorized', 'pending'].includes(category) || categories.some(item => item.id === category) ? category : 'all';
      useEffect(() => {
        if (snapshot && selectedCategory !== category) setCategory('all');
      }, [snapshot, category, selectedCategory]);
      const groups = list(payload?.groups);
      const workspaces = list(payload?.workspaces);
      const currentWorkspace = workspace === 'all' || workspaces.some(item => item.root === workspace) ? workspace : 'all';
      const currentSource = source === 'all' || groups.some(group => group.key === source) ? source : 'all';
      const inventoryNames = new Set(groups.flatMap(group => list(group.skills).map(skill => skill.name)));
      const pending = [...new Set(Object.values(state.views || {}).flatMap(view => list(view?.pending)))]
        .filter(name => inventoryNames.has(name));
      const baseGroups = explorer.selectGroups(groups, {
        workspace: currentWorkspace, query: '', levels: currentSource === 'all' ? [] : [currentSource],
        status: prefs.status || 'all', marks: list(prefs.marks)
      });
      const visibleGroups = filterGroups(baseGroups, snapshot, { category: selectedCategory, query, pending });
      const collapsed = prefs.collapsed || {};
      const isCollapsed = key => own(collapsed, key) && collapsed[key] === true;
      const visibleRows = visibleGroups.flatMap(group => isCollapsed(group.key) ? [] : group.skills);
      const eligibleNames = new Set(visibleRows.map(skill => skill.name).filter(validName));
      // Derive synchronously, not in an effect: a hidden name can never leak into the batch click.
      const activeSelected = [...selected].filter(name => eligibleNames.has(name));
      const allSelected = eligibleNames.size > 0 && activeSelected.length === eligibleNames.size;
      const metadataReady = !!snapshot && !metadataError;
      const busy = !!state.busy || loading || metadataLoading;
      const categoryBusy = busy || !metadataReady;
      const rowCount = visibleGroups.reduce((sum, group) => sum + group.skills.length, 0);
      const count = id => id !== 'all' && !snapshot ? '—' : filterGroups(baseGroups, snapshot, { category: id, pending }).reduce((sum, group) => sum + group.skills.length, 0);
      function toggle(name) {
        if (!eligibleNames.has(name)) return;
        setSelected(previous => {
          const next = new Set([...previous].filter(item => eligibleNames.has(item)));
          if (next.has(name)) next.delete(name); else next.add(name);
          return next;
        });
      }
      function selectAll() { setSelected(allSelected ? new Set() : new Set(eligibleNames)); }
      function clearFilters() {
        setQuery(''); setCategory('all'); setWorkspace('all'); setSource('all'); setSelected(new Set());
        setPrefs(previous => ({ ...previous, levels: [], status: 'all', marks: [] }));
      }
      function filterButton(id, label) {
        return h(Button, { key: id, type: 'button', className: 'sc-filter', 'aria-pressed': selectedCategory === id,
          disabled: busy || (id !== 'all' && !metadataReady), onClick: () => { setCategory(id); setSelected(new Set()); } },
        h('span', null, label), h('span', { className: 'sc-count' }, count(id)));
      }
      function message(error, retry) {
        return error && h('div', { className: 'sc-notice', role: 'alert' },
          h('span', null, error), h(Button, { type: 'button', disabled: busy, onClick: retry }, '重试'));
      }
      return h('div', { className: 'dshsc sc-unified', 'data-dsh-plugin': 'skill-categories' },
        typeof styles === 'function' ? styles() : styles,
        h('div', { className: 'sc-layout' },
          h('nav', { className: 'sc-rail', 'aria-label': '技能分类' },
            filterButton('all', '全部技能'), filterButton('uncategorized', '未分类'), filterButton('pending', '新增待整理'),
            categories.map(item => filterButton(item.id, item.name)),
            h(Button, { type: 'button', disabled: categoryBusy, onClick: () => controller.open({ kind: 'create', cwd: null }) }, '新建分类'),
            h(Button, { type: 'button', disabled: categoryBusy, onClick: () => controller.open({ kind: 'manage', cwd: null }) }, '管理分类')),
          h('section', { className: 'sc-main', 'aria-label': '技能列表' },
            h('div', { className: 'sc-toolbar' },
              h('input', { type: 'search', className: 'sc-search', value: query, 'aria-label': '搜索技能名称、描述、标签或分类名',
                placeholder: '搜索名称、描述、标签或分类名', onChange: event => setQuery(event.target.value) }),
              h('select', { value: currentWorkspace, 'aria-label': '筛选工作区', disabled: !!state.busy,
                onChange: event => setWorkspace(event.target.value) },
                h('option', { value: 'all' }, '全部工作区'), workspaces.map(item => h('option', { key: item.root, value: item.root }, `${item.name || item.root}${item.active ? '（当前）' : ''}`))),
              h('select', { value: currentSource, 'aria-label': '筛选技能来源', disabled: !!state.busy,
                onChange: event => { const value = event.target.value; setSource(value); setPrefs(previous => ({ ...previous, levels: value === 'all' ? [] : [value] })); } },
                h('option', { value: 'all' }, '全部来源'), groups.map(group => h('option', { key: group.key, value: group.key }, explorer.groupTitle(group)))),
              h('select', { value: prefs.status || 'all', 'aria-label': '筛选启用状态', disabled: !!state.busy,
                onChange: event => setPrefs(previous => ({ ...previous, status: event.target.value })) },
                list(explorer.STATUS_FACETS).map(status => h('option', { key: status, value: status }, statusLabels[status] || status))),
              h(Button, { type: 'button', disabled: busy, 'aria-expanded': filtersOpen, onClick: () => setFiltersOpen(value => !value) }, `其他筛选${list(prefs.marks).length ? `（${prefs.marks.length}）` : ''}`),
              h(Button, { type: 'button', disabled: busy || typeof onImport !== 'function', onClick: onImport }, '导入'),
              h(Button, { type: 'button', disabled: busy, onClick: reload }, busy ? '读取中…' : '刷新'),
              h(Button, { type: 'button', disabled: busy, onClick: clearFilters }, '清除筛选')),
            filtersOpen && h('div', { className: 'sc-row', 'aria-label': '其他技能筛选' }, list(explorer.MARK_FACETS).map(mark =>
              h('label', { className: 'sc-check', key: mark }, h('input', { type: 'checkbox', checked: list(prefs.marks).includes(mark), disabled: !!state.busy,
                onChange: () => setPrefs(previous => ({ ...previous, marks: list(previous.marks).includes(mark) ? previous.marks.filter(item => item !== mark) : [...list(previous.marks), mark] })) }), markLabels[mark] || mark))),
            message(listError && `技能文件列表读取失败：${listError}${payload ? '（保留上次成功结果）' : ''}`, loadInventory),
            message(metadataError, loadMetadata),
            state.error && message(state.error, loadMetadata),
            state.feedback && h('div', { className: 'sc-notice', role: 'status' }, state.feedback,
              h(Button, { type: 'button', disabled: busy, onClick: () => controller.clearFeedback() }, '知道了')),
            loading && h('p', { role: 'status' }, payload ? '正在刷新技能文件列表，暂保留上次结果…' : '正在读取技能文件列表…'),
            metadataLoading && h('p', { role: 'status' }, '正在读取分类信息…'),
            !metadataLoading && !snapshot && !metadataError && h('p', { role: 'status' }, '分类信息尚未就绪；技能文件列表仍可使用。'),
            snapshot?.complete === false && h('p', { role: 'status' }, '分类目录尚未完整就绪；技能文件列表以宿主返回结果为准。'),
            h('div', { className: 'sc-row sc-batch' },
              h('label', { className: 'sc-check' }, h('input', { type: 'checkbox', 'aria-label': '选择当前筛选的全部技能', checked: allSelected,
                disabled: categoryBusy || !eligibleNames.size, onChange: selectAll }), `已选 ${activeSelected.length} / 当前 ${rowCount} 行`),
              h(Button, { type: 'button', disabled: busy || !selected.size, onClick: () => setSelected(new Set()) }, '清空选择'),
              h(Button, { type: 'button', primary: true, disabled: categoryBusy || !activeSelected.length,
                onClick: () => { if (!categoryBusy && activeSelected.length) controller.open({ kind: 'assign', cwd: null, names: activeSelected }); } }, '批量分类')),
            payload && !rowCount && h('p', { className: 'sc-state' }, groups.some(group => list(group.skills).length) ? '没有符合当前筛选的技能。' : '尚未发现技能，可使用导入添加技能。'),
            visibleGroups.map((group, groupIndex) => h('section', { className: 'sc-group', key: `${group.key}:${groupIndex}` },
              h(Button, { type: 'button', className: 'sc-group-title', disabled: busy, 'aria-expanded': !isCollapsed(group.key),
                title: explorer.groupHintOf(group), onClick: () => setPrefs(previous => ({ ...previous, collapsed: { ...previous.collapsed, [group.key]: !isCollapsed(group.key) } })) },
                `${isCollapsed(group.key) ? '▸' : '▾'} ${explorer.groupTitle(group)}`, h('span', { className: 'sc-count' }, group.skills.length)),
              !isCollapsed(group.key) && group.skills.map((skill, index) => h('div', { className: 'sc-native-row', key: `${skill.name}:${skill.path || ''}:${index}` },
                h('input', { type: 'checkbox', className: 'sc-native-select', 'aria-label': `选择 ${skill.name}`,
                  checked: activeSelected.includes(skill.name), disabled: categoryBusy || !validName(skill.name),
                  title: validName(skill.name) ? '同名技能共享分类' : '名称不符合标准命名规则，暂不支持分类', onChange: () => toggle(skill.name) }),
                h(explorer.SkillRow, { skill, api, onChanged: reload, onEdit, onDuplicate }))))),
            h('div', { className: 'sc-settings' }, h('label', { className: 'sc-check' },
              h('input', { type: 'checkbox', checked: !!snapshot?.settings?.promptOnNew, disabled: categoryBusy,
                onChange: event => controller.mutate('settings', { promptOnNew: event.target.checked }, null) }), '发现新增技能后提示分类'),
              h('p', { className: 'sc-muted' }, '分类按技能名称共享；同名不同路径仍分别保留原生文件管理操作。')))));
    };
  }
  return { filterGroups, createView };
}

return createUnifiedTools;})())();
    // Only React is resolved through the module loader. JSX uses the same React instance.
    const explorer = explorerFactory(id => { if(id==='react')return React; if(id==='react/jsx-runtime')return {jsx:(type,props,key)=>h(type,{...props,...(key===undefined?{}:{key})}),jsxs:(type,props,key)=>h(type,{...props,...(key===undefined?{}:{key})}),Fragment:React.Fragment}; throw new Error('Unexpected explorer dependency: '+id); });
    function IconGraphic() { return h('svg', { width:20,height:20,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.7,'aria-hidden':true }, h('path',{d:'M3 4h7v7H3zM14 4h7v7h-7zM3 15h7v6H3zM14 15h7v6h-7z',strokeLinejoin:'round'})); }
    const Button = ({ children, primary, ...props }) => h('button', { type:'button',...props,className:[props.className,primary && 'sc-primary'].filter(Boolean).join(' ') }, children);
    const styles = () => h('style', null, CSS);
    function createController() {
      let state = { views:{}, busy:false, error:'', feedback:'', modal:null };
      const listeners = new Set(); const requests = new Set(); const notified = new Set();
      const importedNames = new Set();
      let stopped = false; let polling = false; let timer;
      const set = patch => { if (stopped) return; state={...state,...patch}; for (const fn of listeners) fn(); };
      const key = cwd => cwd || '';
      async function request(action, payload={}) {
        const abort = new AbortController(); requests.add(abort);
        try {
          const response = await fetch(new URL('api/skill-categories', document.baseURI), { method:'POST', credentials:'same-origin', cache:'no-store',headers:{'Content-Type':'application/json','X-DSH-Skill-Categories':'1'},body:JSON.stringify({action,...payload}),signal:abort.signal });
          let body; try { body=await response.json(); } catch { throw new Error('分类后端尚未就绪，请确认插件已启用后刷新。'); }
          if (!response.ok || !body.ok) { const e=new Error(body.error?.message || '操作失败，请重试。'); e.code=body.error?.code; throw e; }
          return body.value;
        } finally { requests.delete(abort); }
      }
      function accept(snapshot) {
        if (stopped) return;
        const views={};
        for (const [id,view] of Object.entries(state.views)) views[id]={...view,categories:snapshot.categories,assignments:snapshot.assignments,settings:snapshot.settings,revision:snapshot.revision,workspaces:snapshot.workspaces};
        views[key(snapshot.cwd)]=snapshot; set({views});
      }
      async function refresh(cwd=null, silent=false) {
        try { const value=await request('snapshot',{cwd}); accept(value); if (!silent) set({error:''}); return value; }
        catch(e) { if (e.name !== 'AbortError' && !silent) set({error:e.message}); return null; }
      }
      function considerPrompt() {
        if (state.modal || state.busy || document.hidden || !document.hasFocus() || document.querySelector('dialog[open], [aria-modal="true"]')) return;
        // Our own import response is authoritative even before the filesystem watcher settles.
        const root=state.views[''];
        if(importedNames.size && root) {
          if(!root.settings.promptOnNew) importedNames.clear();
          else {
            const names=[...importedNames]; importedNames.clear(); names.forEach(name=>notified.add(name));
            set({modal:{kind:'arrivals',cwd:null,names,fromImport:true}}); return;
          }
        }
        const focused=document.activeElement;
        if (focused && ['INPUT','TEXTAREA','SELECT'].includes(focused.tagName)) return;
        for (const value of Object.values(state.views)) {
          if (!value.complete || !value.settings.promptOnNew) continue;
          const visible=new Set(value.skills.map(skill=>skill.name));
          const names=value.pending.filter(name => visible.has(name) && !notified.has(name));
          if (!names.length) continue;
          names.forEach(name=>notified.add(name));
          set({modal:{kind:'arrivals',cwd:value.cwd,names}}); return;
        }
      }
      async function poll() {
        if (polling || stopped || state.busy) return;
        polling=true;
        try {
          const root=await refresh(null,!!state.views['']);
          if (!root) return;
          for (const workspace of root.workspaces) { if (stopped || state.busy) break; await refresh(workspace.cwd,true); }
          considerPrompt();
        } finally { polling=false; }
      }
      async function mutate(action, payload={}, cwd=null) {
        if (state.busy) return false;
        set({busy:true,error:'',feedback:''});
        try {
          const revision=state.views[key(cwd)]?.revision;
          const snapshot=await request(action,{...payload,cwd,revision});
          accept(snapshot);
          if (action==='assign'||action==='dismiss') {
            const names=new Set(payload.names);const views={};
            for(const [id,view]of Object.entries(state.views)) views[id]={...view,pending:view.pending.filter(name=>!names.has(name))};
            set({views});
          }
          set({feedback:'已保存。'}); return true;
        } catch(e) {
          if (e.name !== 'AbortError') {
            set({error:e.message});
            if (e.code === 'CONFLICT' || e.code === 'REVISION_CONFLICT') await refresh(cwd,true);
          }
          return false;
        } finally { set({busy:false}); }
      }
      return {
        subscribe(fn) { listeners.add(fn); return ()=>listeners.delete(fn); },
        getSnapshot:()=>state, refresh, mutate,
        async imported(report) {
          if(stopped)return;
          for(const outcome of report?.outcomes||[]) if(outcome.status==='imported' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(outcome.name) && !notified.has(outcome.name)) importedNames.add(outcome.name);
          if(!importedNames.size)return;
          await refresh(null,true); considerPrompt();
        },
        open(modal) { set({modal,error:''}); }, close() { if(!state.busy) set({modal:null}); },
        clearFeedback:()=>set({feedback:''}),
        start() { void poll(); timer=setInterval(()=>{ if (!document.hidden) void poll(); },10000); },
        stop() { stopped=true; clearInterval(timer); requests.forEach(r=>r.abort()); listeners.clear(); },
      };
    }
    function useController(controller) { return useSyncExternalStore(controller.subscribe,controller.getSnapshot,controller.getSnapshot); }
    function Dialog({title,children,footer,busy,onClose}) {
      const ref=useRef(null); const id=React.useId();
      useEffect(()=>{
        const dialog=ref.current; const previous=document.activeElement;
        if (!dialog.open) dialog.showModal();
        return ()=>{ if(dialog.open) dialog.close(); if(previous?.isConnected && previous.focus) previous.focus(); };
      },[]);
      return h('dialog',{ref,className:'dshsc sc-dialog','aria-labelledby':id,onClick:e=>e.stopPropagation(),onKeyDown:e=>e.stopPropagation(),onCancel:e=>{e.preventDefault();if(!busy)onClose();}},styles(),
        h('header',{className:'sc-dialog-head'},h('h2',{id},title),h(Button,{className:'sc-tool',disabled:busy,'aria-label':'关闭弹窗',onClick:onClose},'×')),
        h('div',{className:'sc-dialog-body'},children),footer && h('footer',{className:'sc-dialog-foot'},footer));
    }
    function ClassificationDialog({controller,state,modal,snapshot}) {
      const [categoryId,setCategory]=useState(modal.categoryId || '');
      const [tags,setTags]=useState(modal.tags?.join('，') || '');
      const [editTags,setEditTags]=useState(!!modal.tags);
      const [localError,setLocalError]=useState('');
      const names=modal.names;
      const selectedExists=!categoryId || snapshot.categories.some(c=>c.id===categoryId);
      async function save() {
        const parsed=tags.split(/[,，]/).map(t=>t.trim()).filter(Boolean);
        if (editTags && (parsed.length>20 || parsed.some(t=>t.length>40))) { setLocalError('最多 20 个标签，每个标签不超过 40 字。'); return; }
        if (await controller.mutate('assign',{names,categoryId:categoryId||null,...(editTags?{tags:[...new Set(parsed)]}:{})},modal.cwd)) controller.close();
      }
      async function skip() { if(await controller.mutate('dismiss',{names},modal.cwd)) controller.close(); }
      return h(Dialog,{title:modal.kind==='arrivals'?'给新增技能找个位置':'整理技能',busy:state.busy,onClose:controller.close,
        footer:h(React.Fragment,null,h(Button,{disabled:state.busy,onClick:modal.kind==='arrivals'?skip:controller.close},modal.kind==='arrivals'?'暂不分类':'取消'),h(Button,{primary:true,disabled:state.busy||!selectedExists,onClick:save},state.busy?'保存中…':'保存分类'))},
        h('p',{className:'sc-muted'},modal.kind==='arrivals'?(modal.fromImport?'导入已成功。现在为本次成功导入的技能选择分类，跳过不会撤销导入。':'检测到新增技能。归类不会改变启用状态，也不会影响刚才的导入。'):`本次整理 ${names.length} 个技能；分类按技能名称共享。`),
        h('ul',{className:'sc-arrivals'},names.map(name=>h('li',{key:name},name))),
        h('label',{className:'sc-field'},'目标分类',h('select',{value:categoryId,disabled:state.busy,onChange:e=>setCategory(e.target.value)},h('option',{value:''},'未分类'),snapshot.categories.map(c=>h('option',{key:c.id,value:c.id},c.name)))),
        h('label',{className:'sc-check'},h('input',{type:'checkbox',checked:editTags,disabled:state.busy,onChange:e=>setEditTags(e.target.checked)}),'同时替换标签'),
        editTags && h('label',{className:'sc-field'},'标签（逗号分隔，留空清除）',h('input',{value:tags,disabled:state.busy,maxLength:840,onChange:e=>setTags(e.target.value),placeholder:'例如：写作，常用'})),
        (localError||state.error) && h('p',{role:'alert',className:'sc-danger'},localError||state.error));
    }
    function CategoryDialog({controller,state,modal,snapshot}) {
      const [name,setName]=useState(modal.name||'');
      const remove=modal.kind==='delete';
      const valid=name.trim().length>0 && name.trim().length<=60;
      async function save() {
        const action=remove?'category.delete':modal.kind==='rename'?'category.rename':'category.create';
        if(await controller.mutate(action,remove?{id:modal.id}:{id:modal.id,name:name.trim()},modal.cwd)) controller.close();
      }
      return h(Dialog,{title:remove?'删除分类':modal.kind==='rename'?'重命名分类':'新建分类',busy:state.busy,onClose:controller.close,footer:h(React.Fragment,null,h(Button,{disabled:state.busy,onClick:controller.close},'取消'),h(Button,{primary:!remove,className:remove?'sc-danger':'',disabled:state.busy||(!remove&&!valid),onClick:save},state.busy?'保存中…':remove?'删除分类':'保存'))},
        remove?h('p',null,`删除“${modal.name}”后，其中技能回到未分类。技能文件、标签和调用能力不变。`):h('label',{className:'sc-field'},'分类名称',h('input',{value:name,maxLength:60,autoFocus:true,disabled:state.busy,onChange:e=>setName(e.target.value),onKeyDown:e=>{if(e.key==='Enter'&&!e.nativeEvent.isComposing&&valid){e.preventDefault();void save();}},placeholder:'例如：开发工具'})),
        state.error&&h('p',{role:'alert',className:'sc-danger'},state.error));
    }
    function ManageDialog({controller,state,modal,snapshot}) {
      async function move(index,delta) { const ids=snapshot.categories.map(c=>c.id); [ids[index],ids[index+delta]]=[ids[index+delta],ids[index]]; await controller.mutate('category.reorder',{ids},modal.cwd); }
      return h(Dialog,{title:'管理分类',busy:state.busy,onClose:controller.close,footer:h(Button,{disabled:state.busy,onClick:controller.close},'完成')},
        snapshot.categories.length?snapshot.categories.map((c,i)=>h('div',{key:c.id,className:'sc-manage-row'},h('span',null,c.name),h(Button,{className:'sc-tool',disabled:state.busy||i===0,'aria-label':`上移 ${c.name}`,onClick:()=>move(i,-1)},'↑'),h(Button,{className:'sc-tool',disabled:state.busy||i===snapshot.categories.length-1,'aria-label':`下移 ${c.name}`,onClick:()=>move(i,1)},'↓'),h(Button,{disabled:state.busy,onClick:()=>controller.open({kind:'rename',id:c.id,name:c.name,cwd:modal.cwd})},'重命名'),h(Button,{disabled:state.busy,className:'sc-danger',onClick:()=>controller.open({kind:'delete',id:c.id,name:c.name,cwd:modal.cwd})},'删除'))):h('p',{className:'sc-muted'},'还没有分类。先创建一个，再整理技能。'),
        h(Button,{disabled:state.busy,onClick:()=>controller.open({kind:'create',cwd:modal.cwd})},'新建分类'),state.error&&h('p',{role:'alert',className:'sc-danger'},state.error));
    }
    function GlobalDialogs({controller}) {
      const state=useController(controller); const modal=state.modal;
      if(!modal) return null;
      const snapshot=state.views[modal.cwd||''];
      if(!snapshot) return null;
      const props={controller,state,modal,snapshot,key:JSON.stringify(modal)};
      if(modal.kind==='arrivals'||modal.kind==='assign')return h(ClassificationDialog,props);
      if(modal.kind==='manage')return h(ManageDialog,props);
      return h(CategoryDialog,props);
    }
    function ComposerPickerDialog({controller,services,sessionId,inputActions,onClose}) {
      const state=useController(controller);
      const [data,setData]=useState(null),[error,setError]=useState(''),[query,setQuery]=useState(''),[category,setCategory]=useState('all'),[attempt,setAttempt]=useState(0);
      useEffect(()=>{
        const abort=new AbortController();let live=true;setData(null);setError('');
        Promise.all([pickerTools.loadCatalog(services,sessionId,abort.signal),controller.refresh(null,true)]).then(([skills,snapshot])=>{
          if(!live)return;if(!snapshot)throw new Error('分类信息读取失败，请重试。');setData({skills,snapshot});
        }).catch(e=>{if(live&&e.name!=='AbortError')setError(e.message);});
        return()=>{live=false;abort.abort();};
      },[controller,services,sessionId,attempt]);
      const snapshot=state.views['']||data?.snapshot;
      const categories=snapshot?.categories||[];
      const selected=category==='all'||category==='uncategorized'||categories.some(c=>c.id===category)?category:'all';
      const rows=data?pickerTools.filterSkills(data.skills,snapshot,{category:selected,query}):[];
      const count=id=>data?pickerTools.filterSkills(data.skills,snapshot,{category:id}).length:0;
      function pick(skill){if(pickerTools.insert(inputActions,skill.name))onClose();else setError('未能插入：输入框可能正在发送或已切换。请关闭后重试，草稿未被覆盖。');}
      return h(Dialog,{title:'按分类引用技能',onClose,footer:h('p',{className:'sc-muted'},'只插入 /技能名称，不会自动发送。技能范围以当前会话为准。')},
        h('label',{className:'sc-field'},'搜索技能或分类',h('input',{autoFocus:true,value:query,onChange:e=>setQuery(e.target.value),placeholder:'搜索名称、描述、标签或分类名'})),
        h('label',{className:'sc-field'},'筛选分类',h('select',{value:selected,onChange:e=>setCategory(e.target.value),disabled:!data},h('option',{value:'all'},`全部分类（${count('all')}）`),h('option',{value:'uncategorized'},`未分类（${count('uncategorized')}）`),categories.map(c=>h('option',{key:c.id,value:c.id},`${c.name}（${count(c.id)}）`)))),
        error&&h('div',{role:'alert'},h('p',{className:'sc-danger'},error),!data&&h(Button,{onClick:()=>setAttempt(n=>n+1)},'重试')),
        !data&&!error&&h('p',{role:'status'},'正在读取当前会话的技能与分类…'),
        data&&h('p',{className:'sc-muted',role:'status'},`找到 ${rows.length} 个技能${rows.length>200?'，先显示 200 个，请继续搜索缩小范围':''}`),
        data&&!rows.length&&h('p',{className:'sc-muted'},data.skills.length?'没有匹配的技能，试试其他分类或关键词。':'当前会话没有可引用技能。'),
        data&&h('div',{className:'sc-picker-results'},rows.slice(0,200).map(skill=>{
          const assignment=Object.hasOwn(snapshot.assignments,skill.name)?snapshot.assignments[skill.name]:undefined;
          const label=categories.find(c=>c.id===assignment?.categoryId)?.name||'未分类';
          return h(Button,{key:skill.name,className:'sc-picker-skill',onClick:()=>pick(skill)},h('strong',null,skill.name),h('span',{className:'sc-label'},label),skill.modelInvocable===false&&h('span',{className:'sc-label'},'仅用户调用'),h('span',{className:'sc-muted sc-picker-desc'},skill.description||'暂无描述'));
        })));
    }
    function ComposerPicker({controller,services,sessionId,inputActions}) {
      const [open,setOpen]=useState(false);
      const supported=typeof inputActions?.captureInsertion==='function'&&typeof inputActions?.insertText==='function';
      if(!sessionId||services.sessions.subagentAddress(sessionId)!==undefined)return null;
      return h(React.Fragment,null,h('span',{className:'dshsc'},styles(),h(Button,{className:'sc-picker-launch',disabled:!supported,title:supported?'按已有分类搜索并引用当前会话技能':'当前宿主未提供安全的输入插入接口','aria-haspopup':'dialog','aria-expanded':open,onClick:()=>setOpen(true)},'分类引用')),open&&h(ComposerPickerDialog,{controller,services,sessionId,inputActions,onClose:()=>setOpen(false)}));
    }
    function SidebarIcon({controller}) {
      const state=useController(controller);
      const count=new Set(Object.values(state.views).flatMap(v=>v.pending)).size;
      return h(React.Fragment,null,h('span',{className:'dshsc sc-icon'},styles(),h(IconGraphic),count>0&&h('span',{className:'sc-inbox-mark','aria-label':`${count} 个技能待整理`},count>99?'99+':count)),h(GlobalDialogs,{controller}));
    }
    return {
      inject:['slots','locale','layout'],
      apply(ctx) {
        const controller=createController();
        const UnifiedSkillsView=unifiedTools.createView({React,explorer,controller,useController,styles,Button});
        function CategoryRow({skill}) {
          const state=useController(controller), snapshot=state.views[''];
          const assignment=snapshot?.assignments[skill.name];
          const category=snapshot?.categories.find(c=>c.id===assignment?.categoryId);
          const supported=/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skill.name);
          return h('div',{className:'dshsc sc-row sc-inline-category'},styles(),h('span',{className:'sc-label'},category?.name||'未分类'),(assignment?.tags||[]).map(tag=>h('span',{key:tag,className:'sc-label'},tag)),h(Button,{disabled:state.busy||!snapshot||!supported,title:supported?'分类按技能名称共享，不更改技能文件':'该技能名称不符合标准命名规则，暂不支持分类',onClick:()=>controller.open({kind:'assign',cwd:null,names:[skill.name],categoryId:assignment?.categoryId,tags:assignment?.tags||[]})},'分类与标签'));
        }
        explorer.initialize(ctx,{UnifiedSkillsView,CategoryRow});
        class IntegratedApi extends explorer.SkillApi {
          async importSkills(payload) {
            const report=await super.importSkills(payload);
            // Classifying is independent of successful import: never convert a classification failure into an import failure.
            void controller.imported(report).catch(()=>{});
            return report;
          }
        }
        const api=new IntegratedApi();
        const panelController=new explorer.PanelController({panel:{select:id=>ctx.layout.selectPanel(id)}});
        panelController.setActiveTab('skills');
        function Panel(){return h(React.Fragment,null,h('style',null,explorer.css),styles(),h(explorer.Page,{controller:panelController,api}));}
        function Icon(){return h(SidebarIcon,{controller});}
        const disposers=[];
        ctx.effect(()=>{
          disposers.push(ctx.slots.inject('sidebar.panellist',()=>ctx.slots.register({name:'sidebar.panellist',id:'skill-explorer',order:30,label:'技能中心'},Icon)));
          disposers.push(ctx.slots.inject('main',()=>ctx.slots.register({name:'main',key:'skill-explorer'},Panel)));
          // Keep pre-upgrade selected panels usable without adding a second sidebar entry.
          disposers.push(ctx.slots.inject('main',()=>ctx.slots.register({name:'main',key:'dsh-skill-categories'},Panel)));
          return()=>{for(const dispose of disposers.splice(0))dispose();};
        },'skill-center: unified mounts');
        if(typeof ctx.inject==='function')ctx.inject(['sessions','remote','remote.skills'],scope=>{
          const services={sessions:scope.sessions,remote:scope.remote};
          function Picker(props){return h(ComposerPicker,{key:props.sessionId,...props,controller,services});}
          scope.effect(()=>ctx.slots.inject('conversation.input.left',()=>ctx.slots.register({name:'conversation.input.left',id:'skill-categories-picker',order:61,label:'分类引用'},Picker)),'skill-categories: composer picker');
        });
        ctx.effect(()=>{controller.start();return()=>controller.stop();},'skill-categories: poller');
      },
    };
  },
});
