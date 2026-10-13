import {it,expect} from 'vitest';
import {AdaptWorkbenchRun,ADAPT_PROGRAMS} from '../workbench/adaptAdapter';
import history from '../../docs/planning/CAMPAIGN2_ADAPT_PARENT_PAIR_PROOF.json';
import {digest,fromHex,exactKey} from '../workbench/canonical';
import {decodeMemory} from '../campaign2/memoryCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
it('replays both accepted ADAPT timelines and preserves historical exposure, formation and recollection bytes',async()=>{
 expect(ADAPT_PROGRAMS).toHaveLength(2);for(const h of history.timelines){const run=await AdaptWorkbenchRun.create('count-'+h.count);expect(run.snapshot().stateHash).toBe(await digest(fromHex(history.initialStateHex)));await run.advance();expect(run.snapshot().stateHash).toBe(await digest(fromHex(h.afterExposureStateHex)));const c=run.checkpoint(),restored=await AdaptWorkbenchRun.restore(c);expect(restored.snapshot()).toEqual(run.snapshot());await run.advance();await restored.advance();expect(restored.snapshot()).toEqual(run.snapshot());expect(run.snapshot().stateHash).toBe(await digest(fromHex(h.afterFormationStateHex)));await run.advance();await restored.advance();expect(restored.snapshot()).toEqual(run.snapshot());expect(run.snapshot().complete).toBe(true);expect(await run.advance()).toBe(false);const outputs=items(f(rec(decodeMemory(fromHex(run.checkpoint().saveHex)),132n),12n),'list'),recollection=outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===352n)!;expect(exactKey(recollection)).toBe(h.recollectionHex);await expect(AdaptWorkbenchRun.restore({...c,program:'count-'+(1-h.count)})).rejects.toThrow('prefix mismatch');}
},600000);
