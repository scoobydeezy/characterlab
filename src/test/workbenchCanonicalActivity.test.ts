import {it,expect} from 'vitest';
import {list,map,signed,unsigned,text} from '../substrate/canonicalEncoding';
import {equalCanonicalText} from '../workbench/canonicalTextEquality';
import {exactText,fromHex} from '../workbench/canonical';
import {canonicalActivityIndex} from '../workbench/canonicalActivityIndex';
import {stateParticipation} from '../workbench/participation';
import {DispositionWorkbenchRun} from '../workbench/dispositionAdapter';
import {decodeDispositionPublic} from '../campaign3/dispositionPublicCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
it('preserves readable equality even when canonical type bytes differ',()=>{const values=[signed(1n),unsigned(1n),text('1'),list([]),map([]),list([list([text('a'),unsigned(2n)])]),map([[text('a'),unsigned(2n)]]),text('x😀'.repeat(100))];for(const a of values)for(const b of values)expect(equalCanonicalText(a,b)).toBe(exactText(a)===exactText(b));});
it('matches every original activity row without formatting trace payloads',async()=>{
 for(const program of ['Plastic/Main','Refold/Main','Plastic/InactiveProbes']){const run=await DispositionWorkbenchRun.create(program);for(let prefix=0;prefix<=2;prefix++){
  const checkpoint=run.checkpoint(),s=run.snapshot(),save=rec(decodeDispositionPublic(fromHex(checkpoint.saveHex)),132n),trace=items(f(save,11n),'list');expect(canonicalActivityIndex(f(save,5n),trace)).toEqual({events:s.timeline.length,rows:stateParticipation(s.timeline,s.fields)});expect(run.checkpoint()).toEqual(checkpoint);if(trace.length)expect(()=>canonicalActivityIndex(f(save,5n),[trace[0],trace[0]])).toThrow('Duplicate');if(prefix<2)await run.advance();
 }}
},600000);
