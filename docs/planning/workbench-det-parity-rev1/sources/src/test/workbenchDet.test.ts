import {it,expect} from 'vitest';
import {DetWorkbenchRun,DET_PROGRAMS} from '../workbench/detAdapter';
import {decodeCognitive} from '../campaign2/cognitiveCodecs';
import {fromHex} from '../workbench/canonical';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
it('restores genuine pre-save draws including rejected meaning and preserves full continuation',async()=>{
 expect(DET_PROGRAMS).toHaveLength(2);
 for(const p of DET_PROGRAMS){const run=await DetWorkbenchRun.create(p.id);await run.advance();await run.advance();const checkpoint=run.checkpoint(),snapshot=run.snapshot(),save=rec(decodeCognitive(fromHex(checkpoint.saveHex)),132n),draws=items(f(save,11n),'list').flatMap(v=>items(f(rec(v,160n),14n),'list'));expect(draws.length).toBeGreaterThan(0);if(p.id==='equal-criteria')expect(snapshot.fields.filter(e=>e.root==='415')).toEqual([]);
 const restored=await DetWorkbenchRun.restore(checkpoint);expect(restored.snapshot()).toEqual(snapshot);expect(run.checkpoint()).toEqual(checkpoint);const detached=run.snapshot();detached.fields.length=0;expect(run.snapshot()).toEqual(snapshot);
 while(await run.advance()){expect(await restored.advance()).toBe(true);expect(restored.checkpoint()).toEqual(run.checkpoint());}expect(await restored.advance()).toBe(false);expect(run.snapshot().complete).toBe(true);
 await expect(DetWorkbenchRun.restore({...checkpoint,program:p.id==='baseline'?'equal-criteria':'baseline'})).rejects.toThrow('prefix mismatch');
 await expect(DetWorkbenchRun.restore({...checkpoint,saveHash:'0'.repeat(64)})).rejects.toThrow('digest');
 }
},600000);
