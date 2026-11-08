import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../client.js',import.meta.url),'utf8').replace("    return {\n      inject:['slots','locale','layout'],","    return { __test:{createController,explorer},\n      inject:['slots','locale','layout'],");
const base=(extra={})=>({schemaVersion:1,revision:1,cwd:null,categories:[],assignments:{},settings:{promptOnNew:true},skills:[{name:'writer',description:'Writing'}],complete:true,baseline:true,known:['writer'],pending:[],workspaces:[],...extra});
function harness(values=[]) {
 let module;const calls=[];let tick;const aborts=[];
 const document={baseURI:'http://127.0.0.1:19737/',hidden:false,hasFocus:()=>true,activeElement:null,querySelector:()=>null};
 const context={window:{__ModuleLoader__:{load(value){module=value;}}},document,URL,AbortController,Set,Map,console,setInterval(fn){tick=fn;return 1;},clearInterval(){tick=null;},fetch:async(url,options)=>{calls.push({url:String(url),options,body:JSON.parse(options.body)});aborts.push(options.signal);const next=values.shift()||base();return {ok:next.ok!==false,json:async()=>next.ok===false?next:{ok:true,value:next}};}};
 vm.runInNewContext(source,context);const plugin=module.factory(name=>{assert.equal(name,'react');return {};});
 return {controller:plugin.__test.createController(),calls,document,tick:()=>tick?.(),aborts};
}
const flush=()=>new Promise(resolve=>setImmediate(resolve));
test('global requests use authenticated same-origin host route, cwd null and marker',async()=>{
 const h=harness();await h.controller.refresh();assert.equal(h.calls[0].url,'http://127.0.0.1:19737/api/skill-categories');assert.equal(h.calls[0].body.cwd,null);assert.equal(h.calls[0].options.credentials,'same-origin');assert.equal(h.calls[0].options.headers['X-DSH-Skill-Categories'],'1');h.controller.stop();
});
test('accept synchronizes global revisions across directory views and mutations clear all pending',async()=>{
 const h=harness([base({revision:2,pending:['writer']}),base({cwd:'C:\\project',revision:3,pending:['writer']}),base({revision:4,pending:[]})]);
 await h.controller.refresh();await h.controller.refresh('C:\\project');assert.equal(h.controller.getSnapshot().views[''].revision,3);
 assert.equal(await h.controller.mutate('dismiss',{names:['writer']}),true);assert.equal(h.calls[2].body.revision,3);assert.equal(h.controller.getSnapshot().views['C:\\project'].pending.length,0);h.controller.stop();
});
test('poll baselines all registered directories and only prompts once for visible additions',async()=>{
 const root=base({workspaces:[{id:'p',title:'Project',cwd:'C:\\project'}],pending:['gone']});
 const project=base({cwd:'C:\\project',pending:['writer']});const h=harness([root,project,root,project]);h.controller.start();await flush();
 assert.equal(h.calls.length,2);assert.equal(h.controller.getSnapshot().modal.kind,'arrivals');assert.equal(h.controller.getSnapshot().modal.names[0],'writer');h.controller.close();h.tick();await flush();assert.equal(h.controller.getSnapshot().modal,null);h.controller.stop();
});
test('other native dialogs and active inputs defer the classification prompt',async()=>{
 const h=harness([base({pending:['writer']}),base({pending:['writer']}),base({pending:['writer']})]);h.document.querySelector=()=>({});h.controller.start();await flush();assert.equal(h.controller.getSnapshot().modal,null);
 h.document.querySelector=()=>null;h.document.activeElement={tagName:'INPUT'};h.tick();await flush();assert.equal(h.controller.getSnapshot().modal,null);
 h.document.activeElement=null;h.tick();await flush();assert.equal(h.controller.getSnapshot().modal.kind,'arrivals');h.controller.stop();
});
test('incomplete or disabled observations never auto-open dialogs',async()=>{
 for(const extra of [{complete:false},{settings:{promptOnNew:false}}]){const h=harness([base({...extra,pending:['writer']})]);h.controller.start();await flush();assert.equal(h.controller.getSnapshot().modal,null);h.controller.stop();}
});
test('conflicts surface the error and refresh without automatic write replay',async()=>{
 const h=harness([base(),{ok:false,error:{code:'REVISION_CONFLICT',message:'stale'}},base({revision:8})]);await h.controller.refresh();assert.equal(await h.controller.mutate('category.create',{name:'Writing'}),false);assert.equal(h.calls.length,3);assert.equal(h.controller.getSnapshot().views[''].revision,8);assert.equal(h.controller.getSnapshot().error,'stale');assert.equal(h.controller.getSnapshot().busy,false);h.controller.stop();
});
test('stop clears poller and aborts outstanding work',async()=>{const h=harness();h.controller.start();h.controller.stop();assert.equal(h.aborts[0].aborted,true);await flush();assert.equal(Object.keys(h.controller.getSnapshot().views).length,0);});
test('successful local import prompts immediately from report, including first scan, and skips non-imported outcomes',async()=>{
 const h=harness([base({skills:[],complete:false})]);h.document.activeElement={tagName:'INPUT'};
 await h.controller.imported({outcomes:[{status:'imported',name:'new-skill'},{status:'skipped',name:'old-skill'},{status:'imported',name:'../bad'}]});
 const modal=h.controller.getSnapshot().modal;assert.equal(modal.kind,'arrivals');assert.equal(modal.fromImport,true);assert.deepEqual([...modal.names],['new-skill']);
 h.controller.close();await h.controller.imported({outcomes:[{status:'imported',name:'new-skill'}]});assert.equal(h.controller.getSnapshot().modal,null);h.controller.stop();
});
test('local import classification respects settings, modal deferral and stop',async()=>{
 const h=harness([base({settings:{promptOnNew:false}})]);await h.controller.imported({outcomes:[{status:'imported',name:'new-skill'}]});assert.equal(h.controller.getSnapshot().modal,null);h.controller.stop();
 const m=harness([base(),base()]);m.document.querySelector=()=>({});await m.controller.imported({outcomes:[{status:'imported',name:'new-skill'}]});assert.equal(m.controller.getSnapshot().modal,null);m.document.querySelector=()=>null;m.controller.start();await flush();assert.equal(m.controller.getSnapshot().modal.fromImport,true);m.controller.stop();
 const stopped=harness();stopped.controller.stop();await stopped.controller.imported({outcomes:[{status:'imported',name:'new-skill'}]});assert.equal(stopped.calls.length,0);
});
test('skipped-only imports do not start classification requests',async()=>{const h=harness();await h.controller.imported({outcomes:[{status:'skipped',name:'existing'}]});assert.equal(h.calls.length,0);h.controller.stop();});
