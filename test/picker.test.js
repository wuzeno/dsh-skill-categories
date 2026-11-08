import test from 'node:test';
import assert from 'node:assert/strict';
import {createPickerTools} from '../src/picker.js';
const {filterSkills,loadCatalog,insert}=createPickerTools();
const skills=[{name:'alpha',description:'写作工具'},{name:'beta',description:'read docs'},{name:'gamma',description:'code'},{name:'constructor',description:'safe key'},{name:'bad/name'}];
const snapshot={categories:[{id:'writing',name:'写作'},{id:'code',name:'开发'}],assignments:JSON.parse('{"alpha":{"categoryId":"writing","tags":["常用"]},"gamma":{"categoryId":"code","tags":["JS"]},"constructor":{"categoryId":"gone"}}')};
test('picker filters category, uncategorized and combined query without mutating catalog',()=>{
 assert.deepEqual(filterSkills(skills,snapshot,{category:'writing'}).map(s=>s.name),['alpha']);
 assert.deepEqual(filterSkills(skills,snapshot,{category:'uncategorized'}).map(s=>s.name),['beta','constructor']);
 for(const query of ['写作','常用','alpha 写作','工具'])assert.deepEqual(filterSkills(skills,snapshot,{query}).map(s=>s.name),['alpha']);
 assert.deepEqual(filterSkills(skills,snapshot,{category:'writing',query:'开发'}),[]);
 assert.deepEqual(filterSkills(skills,snapshot,{query:'js'}).map(s=>s.name),['gamma']);
 assert.equal(skills.length,5);
});
function harness({subagent,opened=true,ok=true,binding=true}={}){
 const calls=[]; const services={sessions:{subagentAddress:()=>subagent,binding:()=>binding?{}:undefined,using:async(id,opts,fn)=>{calls.push(['lease',id,opts]);try{return await fn({binding:{session:{getSnapshot:()=>({openState:opened?'open':'closed'})}}});}finally{calls.push(['release']);}}},remote:{skills:{list:async(req,signal)=>{calls.push(['list',req,signal]);return {ok,value:{skills}};}}}};return {calls,services};
}
test('picker uses retained current-session catalog; releases lease and never enumerates all default skills',async()=>{
 const {calls,services}=harness();const abort=new AbortController();
 const result=await loadCatalog(services,'session-one',abort.signal);
 assert.equal(result.length,4);assert.deepEqual(calls[1],['list',{sessionId:'session-one'},abort.signal]);assert.equal(calls[0][2].source,'skillCategoriesPicker');assert.deepEqual(calls.at(-1),['release']);
});
test('picker rejects closed/unretained/subagent sessions and bad RPCs',async()=>{
 for(const opts of [{subagent:{}},{binding:false},{opened:false},{ok:false}]){
 const {services,calls}=harness(opts);await assert.rejects(loadCatalog(services,'s',new AbortController().signal));if(opts.opened===false)assert.deepEqual(calls.at(-1),['release']);
 }
});
test('picker cancellation avoids RPC and releases acquired session on in-flight abort',async()=>{
 const h=harness();const abort=new AbortController();abort.abort();await assert.rejects(loadCatalog(h.services,'s',abort.signal),{name:'AbortError'});assert.equal(h.calls.length,0);
 const other=harness();const b=new AbortController();other.services.remote.skills.list=async()=>{b.abort();return {ok:true,value:{skills}};};await assert.rejects(loadCatalog(other.services,'s',b.signal),{name:'AbortError'});assert.deepEqual(other.calls.at(-1),['release']);
});
test('picker captures revision at pick time, inserts exact skill reference and does not submit',()=>{
 let revision=1;const calls=[];const actions={captureInsertion:()=>({start:3,end:3,draftRev:revision}),insertText:(text,span)=>{calls.push([text,span]);return true;},submit:()=>assert.fail('must not submit'),setDraft:()=>assert.fail('must not replace draft')};revision=9;
 assert.equal(insert(actions,'alpha'),true);assert.deepEqual(calls,[['/alpha ',{start:3,end:3,draftRev:9}]]);
});
test('picker refuses unsupported, stale, malformed or throwing insertion without fallback',()=>{
 assert.equal(insert({},'alpha'),false);assert.equal(insert({captureInsertion:()=>null,insertText:()=>assert.fail()},'alpha'),false);
 const make=span=>({captureInsertion:()=>span,insertText:()=>assert.fail('invalid span')});
 for(const span of [{start:0,end:0},{start:-1,end:0,draftRev:1},{start:4,end:2,draftRev:1}])assert.equal(insert(make(span),'alpha'),false);
 assert.equal(insert({captureInsertion:()=>({start:0,end:0,draftRev:1}),insertText:()=>false},'alpha'),false);
 assert.equal(insert({captureInsertion:()=>{throw Error('closed');}},'alpha'),false);
 assert.equal(insert({captureInsertion:()=>assert.fail()},'bad/name'),false);
});
