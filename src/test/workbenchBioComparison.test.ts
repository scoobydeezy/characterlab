import {it,expect} from 'vitest';
import {BioWorkbenchRun} from '../workbench/bioAdapter';
import {compareBioSnapshots} from '../workbench/bioComparison';
it('separates early-seed biography divergence from shared probe routing',async()=>{
 const a=await BioWorkbenchRun.create('Earned/6'),b=await BioWorkbenchRun.create('Earned/0');
 for(let i=0;i<5;i++){await a.advance();await b.advance();}
 const before=[a.checkpoint(),b.checkpoint()],r=await compareBioSnapshots('seed:Earned',a.snapshot(),b.snapshot());
 expect(r.status).toBe('ALIGNED_COMPONENT_PREFIX');if(r.status!=='ALIGNED_COMPONENT_PREFIX')throw Error('alignment');
 expect(r.identity.modelEqual).toBe(true);expect(r.identity.runEqual).toBe(false);expect(r.records[0].contextEqual).toBe(true);expect(r.records[0].reasonsEqual).toBe(true);expect(r.records[4].modifiers.equal).toBe(false);expect(r.records[4].rng.controlSeed).toBe(255);expect(r.records[4].rng.candidateSeed).toBe(255);expect(r.records.every(x=>x.rng.nondecisionEqual)).toBe(true);
 expect(await compareBioSnapshots('seed:Earned',a.snapshot(),b.snapshot())).toEqual(r);expect([a.checkpoint(),b.checkpoint()]).toEqual(before);
 const input=a.snapshot(),detached=await compareBioSnapshots('seed:Earned',input,b.snapshot());if(detached.status!=='ALIGNED_COMPONENT_PREFIX')throw Error('alignment');detached.records[0].probabilities.control[0]='edited';expect(input.records[0].summary.probabilities[0]).not.toBe('edited');
 await b.advance();expect((await compareBioSnapshots('seed:Earned',a.snapshot(),b.snapshot())).status).toBe('UNALIGNED_PREFIXES');
 await expect(compareBioSnapshots('seed:Earned',{...a.snapshot(),runHash:'forged'},b.snapshot())).rejects.toThrow('identity');
},600000);
it('preserves equivalent Refold records while distinguishing display-only alternatives',async()=>{
 const runs=await Promise.all(['Earned/6','Refold/6','DisplayOnly/6','HistoryOnly/6'].map(n=>BioWorkbenchRun.create(n)));
 for(let i=0;i<5;i++)for(const run of runs)await run.advance();
 const refold=await compareBioSnapshots('law:Refold:6',runs[0].snapshot(),runs[1].snapshot()),display=await compareBioSnapshots('display:6',runs[2].snapshot(),runs[3].snapshot());
 if(refold.status!=='ALIGNED_COMPONENT_PREFIX'||display.status!=='ALIGNED_COMPONENT_PREFIX')throw Error('alignment');expect(refold.records.every(r=>r.recordEqual)).toBe(true);expect(refold.identity.modelEqual).toBe(false);expect(display.records.every(r=>r.choice.equal&&r.probabilities.equal)).toBe(true);expect(display.records.some(r=>!r.displayEqual)).toBe(true);
 const invalid=runs[0].snapshot();invalid.seedRouting.probe=0;await expect(compareBioSnapshots('law:Refold:6',invalid,runs[1].snapshot())).rejects.toThrow('routing');
},600000);
