window.__ModuleLoader__.load({
  id: 'dsh-skill-categories',
  factory(require) {
    const React = require('react');
    const { useState, useEffect, useRef, useSyncExternalStore } = React;
    const h = React.createElement;
    const CSS = __SKILL_CATEGORIES_CSS__;
    const explorerFactory = __SKILL_EXPLORER_FACTORY__;
    const pickerTools = (__SKILL_PICKER_TOOLS__)();
    const unifiedTools = (__SKILL_UNIFIED_TOOLS__)();
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
