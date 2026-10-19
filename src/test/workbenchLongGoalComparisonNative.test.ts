import {it,expect} from 'vitest';
import {LongGoalWorkbenchRun} from '../workbench/longGoalAdapter';
import {LONG_GOAL_COMPARISONS,compareLongGoalSnapshots} from '../workbench/longGoalComparison';
it('projects detached current native goal snapshots without changing checkpoints',async()=>{
 const spec=LONG_GOAL_COMPARISONS.find(p=>p.id==='feedback:Maintained:0')!,a=await LongGoalWorkbenchRun.create(spec.control),b=await LongGoalWorkbenchRun.create(spec.candidate);
 for(let prefix=0;prefix<=1;prefix++){
  const before=[a.checkpoint(),b.checkpoint()],r=await compareLongGoalSnapshots(spec.id,a.snapshot(),b.snapshot());expect(r.status).toBe('ALIGNED_COMPONENT_PREFIX');if(r.status!=='ALIGNED_COMPONENT_PREFIX')throw Error('Alignment');expect(r.identity.nativeSaveEqual).toBe(true);expect(r.fields.find(f=>f.name==='goalLedger')?.equal).toBe(true);expect(r.fields.find(f=>f.name==='standing')?.equal).toBe(true);expect([a.checkpoint(),b.checkpoint()]).toEqual(before);
  if(prefix===0){await a.advance();expect((await compareLongGoalSnapshots(spec.id,a.snapshot(),b.snapshot())).status).toBe('UNALIGNED_PREFIXES');await b.advance();}
 }
},600000);
