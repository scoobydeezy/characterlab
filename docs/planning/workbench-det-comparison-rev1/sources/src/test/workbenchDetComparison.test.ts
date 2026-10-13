import {it,expect} from 'vitest';
import {DetWorkbenchRun} from '../workbench/detAdapter';
import {compareDet} from '../workbench/detComparison';
it('separates restored equality, unaligned prefixes and changed-model RNG domains',async()=>{
 const a=await DetWorkbenchRun.create('baseline'),b=await DetWorkbenchRun.create('equal-criteria');
 const initial=compareDet(a,b);expect(initial).toMatchObject({kind:'declared-model-contrast',aligned:true,sameModel:false,sameInitialState:true,sameInputs:true,sameSeed:true,stateEqual:true,saveEqual:false});
 await a.advance();expect(compareDet(a,b)).toMatchObject({aligned:false,stateEqual:null,drawRecordsEqual:null});await a.advance();await b.advance();await b.advance();
 const before=[a.checkpoint(),b.checkpoint()],contrast=compareDet(a,b);expect(contrast.draws.every(ds=>ds.length>0)).toBe(true);expect(contrast.identityContributionCounts[1]).toBe(0);expect(contrast.coupling).toContain('do not establish');expect([a.checkpoint(),b.checkpoint()]).toEqual(before);
 const restored=await DetWorkbenchRun.restore(before[0]),replay=compareDet(a,restored);expect(replay).toMatchObject({kind:'same-program-replay',sameRunIdentity:true,saveEqual:true,traceEqual:true,drawRecordsEqual:true});expect(replay.sections.every(s=>s.equal===true)).toBe(true);
 expect(()=>compareDet(b,a)).toThrow('Undeclared');
},600000);
