import {it,expect} from 'vitest';
import {list} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {decodeDispositionPublic} from '../campaign3/dispositionPublicCodecs';
import {DispositionWorkbenchRun} from '../workbench/dispositionAdapter';
import {fromHex} from '../workbench/canonical';
import {dispositionResolution} from '../workbench/dispositionResolution';
import {dispositionCanonicalResolution} from '../workbench/dispositionCanonicalResolution';
import {dispositionScoreMatrix} from '../workbench/dispositionScoreMatrix';
it('preserves original resolution links, draws, chosen intent and score matrix from canonical records',async()=>{
 for(const program of ['Plastic/Main','Refold/Main','Plastic/InactiveProbes']){const run=await DispositionWorkbenchRun.create(program);for(let prefix=1;prefix<=2;prefix++){
  await run.advance();const checkpoint=run.checkpoint(),s=run.snapshot(),save=rec(decodeDispositionPublic(fromHex(checkpoint.saveHex)),132n),raw=items(f(save,11n),'list'),events=s.timeline.map(({id,instant,phase,stage,parents},i)=>({id,instant,phase,stage,parents,output:f(rec(raw[i],160n),13n),draws:f(rec(raw[i],160n),14n)}));
  for(const reason of events.filter(e=>e.stage==='reasons')){const expected=dispositionResolution(s.timeline,reason.id,s.seamVersion),actual=dispositionCanonicalResolution(events,reason.id,s.seamVersion);expect(actual).toEqual(expected);expect(dispositionScoreMatrix(actual)).toEqual(dispositionScoreMatrix(expected));
   expect(()=>dispositionCanonicalResolution(events,reason.id,'unknown')).toThrow('profile');expect(()=>dispositionCanonicalResolution([...events,reason],reason.id,s.seamVersion)).toThrow('Unique');const decision=events.find(e=>e.stage==='decision'&&e.parents.includes(reason.id))!;expect(()=>dispositionCanonicalResolution(events.map(e=>e===decision?{...e,parents:[]}:e),reason.id,s.seamVersion)).toThrow('lineage');
   if(actual.emitted&&actual.draws.length)expect(()=>dispositionCanonicalResolution(events.map(e=>e===decision?{...e,draws:list([])}:e),reason.id,s.seamVersion)).toThrow('trace');
  }expect(run.checkpoint()).toEqual(checkpoint);
 }}
},600000);
