import {it,expect} from 'vitest';
import {DispositionPagedRun,type DispositionTextSelector} from '../workbench/dispositionPagedAdapter';
import {DispositionWorkbenchRun} from '../workbench/dispositionAdapter';
import {decodeDispositionPublic} from '../campaign3/dispositionPublicCodecs';
import {dataRecord,dataField,dataItems} from '../campaign2/canonicalData';
import {exactText,fromHex} from '../workbench/canonical';
it('matches original identities, headers, selected exact text and checkpoints across advancement and restore',async()=>{
 const original=await DispositionWorkbenchRun.create(),paged=await DispositionPagedRun.create();let oldHash='',oldText='';
 for(let prefix=0;prefix<=2;prefix++){
  const s=original.snapshot(),summary=paged.summary(),checkpoint=original.checkpoint();
  for(const key of ['program','seamVersion','constitution','law','prefix','complete','clock','modelHash','runHash','stateHash','saveHash','projectionHash'] as const)expect(summary[key]).toEqual(s[key]);
  expect(summary.fields).toEqual(s.fields.map(({root,path})=>({root,path})));expect(summary.timeline).toEqual(s.timeline.map(({id,instant,phase,stage,parents})=>({id,instant,phase,stage,parents})));expect(paged.checkpoint()).toEqual(checkpoint);
  const check=(selector:DispositionTextSelector,text:string)=>{for(const offset of [0,Math.floor(text.length/2),text.length]){const page=paged.textPage(summary.saveHash,selector,offset,97);expect(page.text).toBe(text.slice(offset,offset+97));expect(page.totalCodeUnits).toBe(text.length);expect(page.saveHash).toBe(summary.saveHash);}};
  check({kind:'projection'},s.mechanismProjection);for(const f of s.fields)check({kind:'state',path:f.path},f.exact);
  const save=dataRecord(decodeDispositionPublic(fromHex(checkpoint.saveHex)),132n),raw=dataItems(dataField(save,11n),'list');
  for(let i=0;i<s.timeline.length;i++){const e=s.timeline[i];for(const part of ['input','output','draws','quantization'] as const)check({kind:'event',id:e.id,part},e[part]);check({kind:'event',id:e.id,part:'record'},exactText(raw[i]));for(const [part,id]of [['reads',11n],['diffs',17n]] as const)check({kind:'event',id:e.id,part},exactText(dataField(dataRecord(raw[i],160n),id)));}
  if(prefix===1){oldHash=summary.saveHash;oldText=paged.textPage(oldHash,{kind:'event',id:summary.timeline[0].id,part:'output'}).text;const restored=await DispositionPagedRun.restore(checkpoint);expect(restored.summary()).toEqual(summary);expect(restored.checkpoint()).toEqual(checkpoint);}
  if(prefix===2){expect(()=>paged.textPage(oldHash,{kind:'projection'})).toThrow('Stale');expect(paged.textPage(summary.saveHash,{kind:'event',id:summary.timeline[0].id,part:'output'}).text).toBe(oldText);}
  const detached=paged.summary();detached.fields.length=0;expect(paged.summary()).toEqual(summary);expect(paged.checkpoint()).toEqual(checkpoint);
  expect(()=>paged.textPage(summary.saveHash,{kind:'event',id:'missing',part:'record'})).toThrow('Unknown');expect(()=>paged.textPage(summary.saveHash,{kind:'state',path:'missing'})).toThrow('Unknown');expect(()=>paged.textPage(summary.saveHash,{kind:'projection'},-1)).toThrow('bounds');
  if(prefix<2){await original.advance();const advancing=paged.advance();expect(()=>paged.summary()).toThrow('in flight');expect(()=>paged.textPage(summary.saveHash,{kind:'projection'})).toThrow('in flight');await advancing;}
 }
},600000);
