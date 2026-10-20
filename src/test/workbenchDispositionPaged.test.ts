import {it,expect} from 'vitest';
import {DispositionPagedRun,type DispositionTextSelector} from '../workbench/dispositionPagedAdapter';
import {DispositionWorkbenchRun} from '../workbench/dispositionAdapter';
import {decodeDispositionPublic} from '../campaign3/dispositionPublicCodecs';
import {dataRecord,dataField,dataItems} from '../campaign2/canonicalData';
import {exactText,fromHex} from '../workbench/canonical';
import {dispositionArchitecture} from '../workbench/dispositionArchitecture';
import {inspectDispositionReasons} from '../workbench/dispositionReasonDiagnostics';
import {dispositionCalibration} from '../workbench/dispositionCalibration';
import {dispositionResolution} from '../workbench/dispositionResolution';
import {dispositionFactorSources} from '../workbench/dispositionFactorSources';
import {dispositionCanonicalInspection} from '../workbench/dispositionCanonicalInspection';
it('matches original identities, headers, selected exact text and checkpoints across advancement and restore',async()=>{
 const original=await DispositionWorkbenchRun.create(),paged=await DispositionPagedRun.create();let oldHash='',oldText='';
 for(let prefix=0;prefix<=2;prefix++){
  const s=original.snapshot(),summary=paged.summary(),checkpoint=original.checkpoint();
  for(const key of ['program','seamVersion','constitution','law','prefix','complete','clock','modelHash','runHash','stateHash','saveHash','projectionHash'] as const)expect(summary[key]).toEqual(s[key]);
  expect(summary.fields).toEqual(s.fields.map(({root,path})=>({root,path})));expect(summary.timeline).toEqual(s.timeline.map(({id,instant,phase,stage,parents})=>({id,instant,phase,stage,parents})));expect(paged.checkpoint()).toEqual(checkpoint);
  const check=(selector:DispositionTextSelector,text:string)=>{for(const offset of [0,Math.floor(text.length/2),text.length]){const page=paged.textPage(summary.saveHash,selector,offset,97);expect(page.text).toBe(text.slice(offset,offset+97));expect(page.totalCodeUnits).toBe(text.length);expect(page.saveHash).toBe(summary.saveHash);}};
  check({kind:'projection'},s.mechanismProjection);for(const f of s.fields)check({kind:'state',path:f.path},f.exact);
  const save=dataRecord(decodeDispositionPublic(fromHex(checkpoint.saveHex)),132n),raw=dataItems(dataField(save,11n),'list');
  const stored=paged.diagnostic(summary.saveHash,{kind:'storedState'});expect(stored.identity.saveHash).toBe(checkpoint.saveHash);expect(stored.report).toHaveProperty('constitution.exact',s.constitution);
  expect(paged.diagnostic(summary.saveHash,{kind:'architecture'}).report).toEqual(dispositionArchitecture(s));
  let stateReads=0;const lazyState=()=>{stateReads++;return dataField(save,5n);};
  for(const e of s.timeline){
   const report=paged.diagnostic(summary.saveHash,{kind:'eventState',eventId:e.id}).report;expect(report).toHaveProperty('counts',{reads:e.reads.length,mutations:e.diffs.length,changes:e.diffs.filter(d=>d.changed).length});
   if(e.stage==='reasons'){
    expect(paged.diagnostic(summary.saveHash,{kind:'reasons',eventId:e.id}).report).toEqual(inspectDispositionReasons(e));
    expect(paged.diagnostic(summary.saveHash,{kind:'calibration',eventId:e.id}).report).toEqual(dispositionCalibration(e,s.seamVersion));
    expect(paged.diagnostic(summary.saveHash,{kind:'resolution',eventId:e.id}).report).toEqual(dispositionResolution(s.timeline,e.id,s.seamVersion));
    const factors=dispositionFactorSources(e),factorReport=paged.diagnostic(summary.saveHash,{kind:'factorSources',eventId:e.id}).report;expect(factorReport).toHaveProperty('rows',factors.rows);expect(factorReport).toHaveProperty('nuclei',factors.nuclei);
    dispositionCanonicalInspection(summary,lazyState,raw,summary.saveHash,{kind:'resolution',eventId:e.id});
   }
  }
  expect(stateReads).toBe(0);dispositionCanonicalInspection(summary,lazyState,raw,summary.saveHash,{kind:'storedState'});expect(stateReads).toBe(1);dispositionCanonicalInspection(summary,lazyState,raw,summary.saveHash,{kind:'architecture'});expect(stateReads).toBe(2);
  stored.identity.saveHash='detached';expect(paged.diagnostic(summary.saveHash,{kind:'storedState'}).identity.saveHash).toBe(checkpoint.saveHash);
  for(let i=0;i<s.timeline.length;i++){const e=s.timeline[i];for(const part of ['input','output','draws','quantization'] as const)check({kind:'event',id:e.id,part},e[part]);check({kind:'event',id:e.id,part:'record'},exactText(raw[i]));for(const [part,id]of [['reads',11n],['diffs',17n]] as const)check({kind:'event',id:e.id,part},exactText(dataField(dataRecord(raw[i],160n),id)));}
  if(prefix===1){oldHash=summary.saveHash;oldText=paged.textPage(oldHash,{kind:'event',id:summary.timeline[0].id,part:'output'}).text;const restored=await DispositionPagedRun.restore(checkpoint);expect(restored.summary()).toEqual(summary);expect(restored.checkpoint()).toEqual(checkpoint);expect(restored.diagnostic(oldHash,{kind:'architecture'})).toEqual(paged.diagnostic(oldHash,{kind:'architecture'}));}
  if(prefix===2){expect(()=>paged.textPage(oldHash,{kind:'projection'})).toThrow('Stale');expect(()=>paged.diagnostic(oldHash,{kind:'storedState'})).toThrow('Stale');expect(paged.textPage(summary.saveHash,{kind:'event',id:summary.timeline[0].id,part:'output'}).text).toBe(oldText);}
  const detached=paged.summary();detached.fields.length=0;expect(paged.summary()).toEqual(summary);expect(paged.checkpoint()).toEqual(checkpoint);
  expect(()=>paged.textPage(summary.saveHash,{kind:'event',id:'missing',part:'record'})).toThrow('Unknown');expect(()=>paged.textPage(summary.saveHash,{kind:'state',path:'missing'})).toThrow('Unknown');expect(()=>paged.textPage(summary.saveHash,{kind:'projection'},-1)).toThrow('bounds');
  if(prefix<2){await original.advance();const advancing=paged.advance();expect(()=>paged.summary()).toThrow('in flight');expect(()=>paged.textPage(summary.saveHash,{kind:'projection'})).toThrow('in flight');expect(()=>paged.diagnostic(summary.saveHash,{kind:'architecture'})).toThrow('in flight');await advancing;}
 }
},600000);
