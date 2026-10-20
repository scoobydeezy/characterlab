import {it,expect} from 'vitest';
import {record,list,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {DispositionWorkbenchRun} from '../workbench/dispositionAdapter';
import {canonicalEventState} from '../workbench/canonicalEventState';
import {dispositionCanonicalInspection} from '../workbench/dispositionCanonicalInspection';
import {decodeDispositionPublic} from '../campaign3/dispositionPublicCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {fromHex,exactText} from '../workbench/canonical';
import type {DispositionInspectionSummary} from '../workbench/dispositionPagedAdapter';
const replace=(r:ReturnType<typeof rec>,id:bigint,value:CanonicalValue)=>rec(record(r.schema,new Map([...r.fields].map(([key,v])=>[key,key===id?value:v]))),r.schema.typeId);
it('preserves native event reads, before/after presence, readable changes and exact source references',async()=>{
 let count=0,controlled=false;
 for(const program of ['Plastic/Main','Refold/Main','Plastic/InactiveProbes']){
  const run=await DispositionWorkbenchRun.create(program),history=new Map<string,string>();
  for(let prefix=1;prefix<=2;prefix++){
   await run.advance();const s=run.snapshot(),checkpoint=run.checkpoint(),save=rec(decodeDispositionPublic(fromHex(checkpoint.saveHex)),132n),trace=items(f(save,11n),'list');
   const summary:DispositionInspectionSummary={...s,version:'disposition-paged-inspection/0.1',fields:s.fields.map(({root,path})=>({root,path})),timeline:s.timeline.map(({id,instant,phase,stage,parents})=>({id,instant,phase,stage,parents}))};
   for(const [i,e]of s.timeline.entries()){
    const report=canonicalEventState(trace[i]),row=rec(trace[i],160n),{id,instant,phase,stage,parents}=e;
    expect(report.event).toEqual({id,instant,phase,stage,parents});expect(report.reads).toEqual(e.reads.map(({path,label,exact},index)=>({index,path,label,presence:exact!=='Absent'})));
    expect(report.diffs).toEqual(e.diffs.map(({path,label,before,after,changed},index)=>({index,path,label,beforePresence:before!=='Absent',afterPresence:after!=='Absent',changed})));
    expect(report.counts).toEqual({reads:e.reads.length,mutations:e.diffs.length,changes:e.diffs.filter(d=>d.changed).length});
    for(const source of report.reads){const raw=rec(items(f(row,11n),'list')[source.index],147n);expect(source.presence?exactText(f(raw,4n)):'Absent').toBe(e.reads[source.index].exact);}
    for(const source of report.diffs){const raw=rec(items(f(row,17n),'list')[source.index],148n);expect(source.beforePresence?exactText(f(raw,3n)):'Absent').toBe(e.diffs[source.index].before);expect(source.afterPresence?exactText(f(raw,5n)):'Absent').toBe(e.diffs[source.index].after);}
    expect(report.sources).toEqual({reads:{kind:'event',id:e.id,part:'reads'},diffs:{kind:'event',id:e.id,part:'diffs'}});
    const envelope=dispositionCanonicalInspection(summary,f(save,5n),trace,s.saveHash,{kind:'eventState',eventId:e.id});expect(envelope.report).toEqual(report);expect(envelope.identity.saveHash).toBe(checkpoint.saveHash);
    const prior=history.get(e.id);if(prior)expect(JSON.stringify(report)).toBe(prior);else history.set(e.id,JSON.stringify(report));
    if(!controlled&&report.diffs.length){
     const raw=rec(items(f(row,17n),'list')[0],148n),sameText=replace(replace(replace(replace(raw,2n,true),3n,signed(1n)),4n,true),5n,unsigned(1n));
     expect(canonicalEventState(replace(row,17n,list([sameText]))).diffs[0].changed).toBe(false);
     expect(canonicalEventState(replace(row,17n,list([replace(sameText,4n,false)]))).diffs[0].changed).toBe(true);
     expect(canonicalEventState(replace(row,17n,list([replace(replace(sameText,2n,false),4n,false)]))).diffs[0].changed).toBe(false);
     expect(()=>canonicalEventState(replace(row,17n,list([replace(sameText,2n,unsigned(1n))])))).toThrow('presence');controlled=true;
    }
    count++;
   }
   expect(()=>dispositionCanonicalInspection(summary,f(save,5n),trace,s.saveHash,{kind:'eventState',eventId:'missing'})).toThrow('Unknown');expect(run.checkpoint()).toEqual(checkpoint);
  }
 }
 expect(count).toBe(90);expect(controlled).toBe(true);
},600000);
