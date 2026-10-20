import {it,expect} from 'vitest';
import {DispositionWorkbenchRun} from '../workbench/dispositionAdapter';
import {dispositionCanonicalInspection} from '../workbench/dispositionCanonicalInspection';
import {dispositionArchitecture} from '../workbench/dispositionArchitecture';
import {inspectDispositionReasons} from '../workbench/dispositionReasonDiagnostics';
import {dispositionResolution} from '../workbench/dispositionResolution';
import {dispositionCanonicalStoredState} from '../workbench/dispositionCanonicalStoredState';
import {decodeDispositionPublic} from '../campaign3/dispositionPublicCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {fromHex} from '../workbench/canonical';
import type {DispositionInspectionSummary} from '../workbench/dispositionPagedAdapter';
it('dispatches canonical diagnostics with revision-bound selection and original report parity',async()=>{
 for(const program of ['Plastic/Main','Refold/Main','Plastic/InactiveProbes']){
  const run=await DispositionWorkbenchRun.create(program);const history:unknown[]=[];let retained='';
  for(let prefix=0;prefix<=2;prefix++){
   const s=run.snapshot(),checkpoint=run.checkpoint(),save=rec(decodeDispositionPublic(fromHex(checkpoint.saveHex)),132n),state=f(save,5n),trace=items(f(save,11n),'list');
   const summary:DispositionInspectionSummary={...s,version:'disposition-paged-inspection/0.1',fields:s.fields.map(({root,path})=>({root,path})),timeline:s.timeline.map(({id,instant,phase,stage,parents})=>({id,instant,phase,stage,parents}))};
   const call=(selection:Parameters<typeof dispositionCanonicalInspection>[4])=>dispositionCanonicalInspection(summary,state,trace,s.saveHash,selection);
   expect(call({kind:'storedState'}).report).toEqual(dispositionCanonicalStoredState(s,state));
   expect(call({kind:'architecture'}).report).toEqual(dispositionArchitecture(s));
   for(const event of s.timeline.filter(e=>e.stage==='reasons')){
    const reasons=call({kind:'reasons',eventId:event.id}),resolution=call({kind:'resolution',eventId:event.id});
    expect(reasons.report).toEqual(inspectDispositionReasons(event));expect(resolution.report).toEqual(dispositionResolution(s.timeline,event.id,s.seamVersion));
    expect(reasons.identity.saveHash).toBe(checkpoint.saveHash);expect(reasons.selection).toEqual({kind:'reasons',eventId:event.id});
    expect(Object.keys(reasons.identity).sort()).toEqual(['program','seamVersion','prefix','modelHash','runHash','stateHash','saveHash'].sort());
    if(prefix===1){history.push(reasons,resolution);retained=JSON.stringify(history);}
   }
   expect(()=>dispositionCanonicalInspection(summary,state,trace,'stale',{kind:'architecture'})).toThrow('Stale');
   expect(()=>dispositionCanonicalInspection({...summary,prefix:19},state,trace,s.saveHash,{kind:'storedState'})).toThrow('prefix');
   expect(()=>call({kind:'reasons',eventId:'missing'})).toThrow('Unknown');
   if(trace.length){
    expect(()=>dispositionCanonicalInspection({...summary,timeline:summary.timeline.map((h,i)=>i===0?{...h,id:'mislabelled'}:h)},state,trace,s.saveHash,{kind:'architecture'})).toThrow('header');
    expect(()=>call({kind:'reasons',eventId:s.timeline[0].id})).toThrow('reasons');
   }
   if(prefix===2)expect(JSON.stringify(history)).toBe(retained);
   expect(run.checkpoint()).toEqual(checkpoint);if(prefix<2)await run.advance();
  }
 }
},600000);
