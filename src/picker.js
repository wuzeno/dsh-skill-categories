// Shared pure/host-face helpers for the composer picker. No filesystem or draft fallback.
export function createPickerTools() {
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
