import {it,expect} from 'vitest';
import {MultisourceWorkbenchRun,MULTISOURCE_PROGRAMS} from '../workbench/multisourceAdapter';
import history from '../../docs/planning/MULTISOURCE_PUBLIC_EXPERIMENT_REV1.json';
it('authenticates MULTISOURCE replay and detached researcher diagnostics',async()=>{
 expect(MULTISOURCE_PROGRAMS).toHaveLength(62);const a=await MultisourceWorkbenchRun.create(),old=history.results.find(r=>r.name===a.snapshot().program)!;
 const pending=a.advance();await expect(a.advance()).rejects.toThrow('in flight');await pending;const c=a.checkpoint(),before=a.snapshot(),b=await MultisourceWorkbenchRun.restore(c);expect(b.snapshot()).toEqual(before);const detached=a.snapshot();detached.fields.length=0;expect(a.snapshot()).toEqual(before);
 while(await a.advance()){await b.advance();expect(b.snapshot()).toEqual(a.snapshot());expect(a.snapshot().saveHash).toBe(old.checkpoints[a.snapshot().prefix].saveSha256);}expect(await b.advance()).toBe(false);expect(a.snapshot().stateHash).toBe(old.stateSha256);expect(a.snapshot().traceHash).toBe(old.traceSha256);
 await expect(MultisourceWorkbenchRun.restore({...c,prefix:0})).rejects.toThrow('prefix mismatch');await expect(MultisourceWorkbenchRun.restore({...c,saveHash:'0'.repeat(64)})).rejects.toThrow('digest');await expect(MultisourceWorkbenchRun.create('invented')).rejects.toThrow('Unknown');
},600000);
it('retains hidden physical differences without projecting them as character evidence',async()=>{
 const runs=await Promise.all(['hidden-21','hidden-29'].map(n=>MultisourceWorkbenchRun.create(n)));for(const r of runs)while(await r.advance()){}const [a,b]=runs.map(r=>r.snapshot());expect(a.outputsHash).toBe(b.outputsHash);expect(a.stateHash).not.toBe(b.stateHash);expect(a.projection).toContain('Researcher-only');expect(a).not.toHaveProperty('character');
},600000);
