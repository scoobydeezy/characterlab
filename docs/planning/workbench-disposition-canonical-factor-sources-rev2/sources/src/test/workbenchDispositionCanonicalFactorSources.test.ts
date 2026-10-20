import {it,expect} from 'vitest';
import {record,list,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {DispositionWorkbenchRun} from '../workbench/dispositionAdapter';
import {dispositionCanonicalFactorSources} from '../workbench/dispositionCanonicalFactorSources';
import {dispositionCanonicalInspection} from '../workbench/dispositionCanonicalInspection';
import {dispositionFactorSources} from '../workbench/dispositionFactorSources';
import {decodeDispositionPublic} from '../campaign3/dispositionPublicCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {fromHex,exactText} from '../workbench/canonical';
import type {DispositionInspectionSummary} from '../workbench/dispositionPagedAdapter';
const replace=(r:ReturnType<typeof rec>,id:bigint,value:CanonicalValue)=>rec(record(r.schema,new Map([...r.fields].map(([key,v])=>[key,key===id?value:v]))),r.schema.typeId);
it('preserves raw factors and overlap while referencing exact native read records for paging',async()=>{
 let checked=0,readsChecked=0;
 for(const program of ['Plastic/Main','Refold/Main','Plastic/InactiveProbes']){
  const run=await DispositionWorkbenchRun.create(program);
  for(let prefix=1;prefix<=2;prefix++){
   await run.advance();const s=run.snapshot(),checkpoint=run.checkpoint(),save=rec(decodeDispositionPublic(fromHex(checkpoint.saveHex)),132n),trace=items(f(save,11n),'list');
   const summary:DispositionInspectionSummary={...s,version:'disposition-paged-inspection/0.1',fields:s.fields.map(({root,path})=>({root,path})),timeline:s.timeline.map(({id,instant,phase,stage,parents})=>({id,instant,phase,stage,parents}))};
   for(const [i,event]of s.timeline.entries())if(event.stage==='reasons'){
    const raw=rec(trace[i],160n),output=f(raw,13n),reads=f(raw,11n),expected=dispositionFactorSources(event),actual=dispositionCanonicalFactorSources(event,output,reads);
    expect(actual.version).toBe('disposition-factor-sources/0.2');expect(actual.eventId).toBe(expected.eventId);expect(actual.emitted).toBe(expected.emitted);expect(actual.rows).toEqual(expected.rows);expect(actual.nuclei).toEqual(expected.nuclei);expect('reads' in actual).toBe(false);
    const dispatched=dispositionCanonicalInspection(summary,f(save,5n),trace,s.saveHash,{kind:'factorSources',eventId:event.id});expect(dispatched.report).toEqual(actual);expect(dispatched.identity.saveHash).toBe(checkpoint.saveHash);
    if(actual.emitted&&expected.emitted){
     expect(actual.readSelection).toEqual({kind:'event',id:event.id,part:'reads'});
     expect(actual.readSources).toEqual(expected.reads.map((r,index)=>({index,path:r.path,presence:r.exact!=='Absent'})));
     for(const source of actual.readSources){const read=rec(items(reads,'list')[source.index],147n);expect(source.presence?exactText(f(read,4n)):'Absent').toBe(expected.reads[source.index].exact);readsChecked++;}
     if(items(reads,'list').length){const bad=[...items(reads,'list')];bad[0]=replace(rec(bad[0],147n),3n,unsigned(0n));expect(()=>dispositionCanonicalFactorSources(event,output,list(bad))).toThrow('presence');}
     const envelope=items(output,'list'),operands=rec(envelope[0],1455n),reason=rec(envelope[1],1430n),context=rec(f(reason,5n),408n),signals=rec(f(reason,4n),403n),values=items(f(signals,3n),'list');
     if(values.length){
      const duplicate=replace(signals,3n,list([values[0],values[0]])),joined=replace(replace(reason,4n,duplicate),5n,replace(context,2n,duplicate));
      expect(()=>dispositionCanonicalFactorSources(event,list([replace(operands,8n,joined),joined]),reads)).toThrow('Duplicate');
      const mismatched=replace(reason,4n,duplicate);
      expect(()=>dispositionCanonicalFactorSources(event,list([replace(operands,8n,mismatched),mismatched]),reads)).toThrow('lineage');
     }
    }
    const absent=dispositionCanonicalFactorSources(event,list([]),list([]));expect(absent).toEqual({version:'disposition-factor-sources/0.2',eventId:event.id,emitted:false,rows:[],nuclei:[]});checked++;
   }
   expect(run.checkpoint()).toEqual(checkpoint);
  }
 }
 expect(checked).toBe(9);expect(readsChecked).toBeGreaterThan(0);
},600000);
