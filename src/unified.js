// Self-contained: build embeds createUnifiedTools.toString(), so keep all helpers inside.
export function createUnifiedTools() {
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
