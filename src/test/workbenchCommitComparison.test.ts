import {expect,it} from 'vitest';
import {COMMIT_CONTRASTS,compareCommit} from '../workbench/commitComparison';
import {CommitWorkbenchRun} from '../workbench/commitAdapter';
import plan from '../../docs/planning/COMMIT_PUBLIC_EXPERIMENT_PLAN_REV1.json';
it('retains all nine declared pairs and exact law-control calendars',()=>{
 expect(COMMIT_CONTRASTS).toHaveLength(9);for(const c of COMMIT_CONTRASTS){const [a,b]=[c.a,c.b].map(id=>plan.runs.find(r=>`${r.law}/${r.name}`===id)!);expect(a).toBeDefined();expect(b).toBeDefined();if(c.kind==='model'){expect(a.modelIdentity).not.toBe(b.modelIdentity);expect(a.orderedInputs).toBe(b.orderedInputs);}else expect(a.modelIdentity).toBe(b.modelIdentity);}
});
it('separates recipient evidence from actor state and withholds unequal prefixes',async()=>{
 const a=await CommitWorkbenchRun.create('1/main'),b=await CommitWorkbenchRun.create('1/both');for(let i=0;i<3;i++){await a.advance();await b.advance();}let r=compareCommit('both',a.snapshot(),b.snapshot());expect(r.observerEqual).toEqual([false,false]);expect(r.admittedReportContentEqual).toEqual([true,false]);expect(r.stateEqual).toBe(false);await a.advance();r=compareCommit('both',a.snapshot(),b.snapshot());expect(r.observerEqual).toEqual([null,null]);expect(r.researchOutputsEqual).toBeNull();expect(()=>compareCommit('both',b.snapshot(),a.snapshot())).toThrow('ordered pair');
},600000);
