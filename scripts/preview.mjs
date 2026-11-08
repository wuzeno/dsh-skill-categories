// Standalone fixture, never installed into the host. No server or external URLs.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const react=await readFile(new URL('node_modules/react/umd/react.development.js',root),'utf8');
const dom=await readFile(new URL('node_modules/react-dom/umd/react-dom.development.js',root),'utf8');
const client=await readFile(new URL('client.js',root),'utf8');
const safe=source=>source.replaceAll('</script','<\\/script');
const setup=`
const fixture={revision:1,cwd:null,complete:true,baseline:true,categories:[],assignments:{},settings:{promptOnNew:true},pending:[],known:['agent-reach','good-learning','hallmark','humanizer-zh'],workspaces:[],skills:[{name:'agent-reach',description:'只读获取各平台公开内容，用于测试搜索与分类。',source:'user-dsh'},{name:'good-learning',description:'制定备考与学科学习计划。',source:'user-dsh'},{name:'hallmark',description:'设计与构建网站和页面。',source:'user-dsh'},{name:'humanizer-zh',description:'编辑中文文章，让语言自然并保留事实。',source:'user-dsh'}]};
window.__fixture=fixture;const clone=x=>JSON.parse(JSON.stringify(x));
window.fetch=async(_url,options={})=>{const url=String(_url);if(url.includes('dsh-skill-explorer/')){const endpoint=url.split('/').pop().split('?')[0];let value;if(endpoint==='list')value={groups:[{key:'user-dsh',title:'用户技能',skills:fixture.skills.map(s=>({...s,path:'C:/fixture/'+s.name+'/SKILL.md',modelInvocable:true,userInvocable:true,description:s.description,invocation:'both',fileState:'file'}))}],workspaces:[]};else if(endpoint==='import'){const name='fixture-imported-skill';if(!fixture.skills.some(s=>s.name===name))fixture.skills.push({name,description:'独立预览导入示例，未写入真实技能目录。',source:'user-dsh'});value={imported:1,skipped:0,outcomes:[{name,status:'imported',origin:'fixture'}]};}else value={ok:true};return {ok:true,status:200,json:async()=>clone(value)};}const x=JSON.parse(options.body);let error;
if(x.action==='category.create')fixture.categories.push({id:'cat-'+fixture.revision,name:x.name});
if(x.action==='category.rename')fixture.categories.find(c=>c.id===x.id).name=x.name;
if(x.action==='category.reorder')fixture.categories=x.ids.map(id=>fixture.categories.find(c=>c.id===id));
if(x.action==='category.delete'){fixture.categories=fixture.categories.filter(c=>c.id!==x.id);Object.values(fixture.assignments).forEach(a=>{if(a.categoryId===x.id)a.categoryId=null;});}
if(x.action==='assign'){x.names.forEach(name=>{fixture.assignments[name]={categoryId:x.categoryId,tags:x.tags??fixture.assignments[name]?.tags??[]};});fixture.pending=fixture.pending.filter(n=>!x.names.includes(n));}
if(x.action==='dismiss')fixture.pending=fixture.pending.filter(n=>!x.names.includes(n));
if(x.action==='settings')fixture.settings.promptOnNew=x.promptOnNew;
if(x.action!=='snapshot')fixture.revision++;
return {ok:true,json:async()=>({ok:true,value:clone(fixture)})};};
const disposers=[],slots={};const draft={rev:0};window.__fixtureInputCalls=[];
const inputActions={captureInsertion(){const el=document.getElementById('fixture-draft');return{start:el.selectionStart,end:el.selectionEnd,draftRev:draft.rev};},insertText(text,span){if(span.draftRev!==draft.rev)return false;const el=document.getElementById('fixture-draft');el.value=el.value.slice(0,span.start)+text+el.value.slice(span.end);draft.rev++;window.__fixtureInputCalls.push(text);return true;}};
window.__ModuleLoader__={load(m){const p=m.factory(id=>{if(id!=='react')throw Error(id);return React;});const ctx={locale:{register(){return()=>{};},bind(){return undefined;}},layout:{panels:{select(){}}},slots:{inject(_name,fn){fn();return()=>{};},register(options,Component){slots[options.name]=Component;return()=>{};}},effect(fn){disposers.push(fn());}};
ctx.inject=(_deps,fn)=>fn({effect:ctx.effect,sessions:{subagentAddress(){return undefined;},binding(){return {};},async using(id,options,fn){return fn({binding:{session:{getSnapshot(){return{openState:'open'};}}}});}},remote:{skills:{async list(){return {ok:true,value:{skills:clone(fixture.skills)}};}}}});
p.apply(ctx);const Icon=slots['sidebar.panellist'],App=slots.main,Picker=slots['conversation.input.left'];ReactDOM.createRoot(document.getElementById('app')).render(React.createElement(React.Fragment,null,React.createElement('aside',{'aria-label':'测试侧栏',style:{padding:'12px 24px'}},React.createElement(Icon)),React.createElement('section',{'aria-label':'独立输入框示例',style:{padding:'12px 24px'}},React.createElement('textarea',{id:'fixture-draft','aria-label':'示例草稿',defaultValue:'示例草稿 ',onChange:()=>{draft.rev++;}}),React.createElement(Picker,{sessionId:'fixture-session',inputActions})),React.createElement(App)));}};
`;
await mkdir(new URL('preview/',root),{recursive:true});
await writeFile(new URL('preview/index.html',root),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>技能分类 · 独立测试预览（非宿主）</title><style>html,body,#app{height:100%;margin:0}body{background:#17191c;color:#f1f3f5;font-family:system-ui,sans-serif}#fixture-note{font-size:12px;padding:8px 24px;border-bottom:1px solid #3a4048}</style><div id="fixture-note">独立界面测试 · 示例数据 · 不是已登录的 DSH 页面</div><div id="app"></div><script>${safe(react)}</script><script>${safe(dom)}</script><script>${safe(setup)}</script><script>${safe(client)}</script></html>`);
console.log('Created preview/index.html (standalone fixture, no server)');
