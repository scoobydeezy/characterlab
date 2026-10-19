import {it,expect} from 'vitest';
import {LONG_GOAL_COMPARISONS,compareLongGoalSnapshots} from '../workbench/longGoalComparison';
import {historicalLongGoalSnapshot as historical} from './longGoalHistoricalFixture';
it('preserves historical coarse/zero/action equalities and distinguishes goals, retention and probabilities',async()=>{
 expect(LONG_GOAL_COMPARISONS.length).toBe(120);expect(new Set(LONG_GOAL_COMPARISONS.map(p=>p.id)).size).toBe(120);expect(new Set(LONG_GOAL_COMPARISONS.flatMap(p=>[p.control,p.candidate])).size).toBe(120);
 for(const id of ['feedback:Maintained:0','coarse:Maintained:0','feedback:Maintained:4','feedback:Maintained:7','retention:Maintained:0','lifecycle:Replaced:0','opportunity-withdrawn:0']){
  const spec=LONG_GOAL_COMPARISONS.find(p=>p.id===id)!,a=await historical(spec.control),b=await historical(spec.candidate),before=JSON.stringify([a,b]),r=await compareLongGoalSnapshots(id,a,b);
  expect(r.status).toBe('ALIGNED_COMPONENT_PREFIX');if(r.status!=='ALIGNED_COMPONENT_PREFIX')throw Error('Alignment');const equal=(name:string)=>r.fields.find(f=>f.name===name)!.equal;
  expect(r.rng.correspondence).toBe('NOT_INFERRED_FROM_SEED');expect(await compareLongGoalSnapshots(id,a,b)).toEqual(r);expect(JSON.stringify([a,b])).toBe(before);
  if(id==='feedback:Maintained:0'){expect(equal('probabilities')).toBe(false);expect(equal('actions')).toBe(false);expect(r.identity.nativeSaveEqual).toBe(true);}
  if(id.startsWith('coarse:')||id==='feedback:Maintained:4'){expect(equal('probabilities')).toBe(true);expect(equal('actions')).toBe(true);}
  if(id==='feedback:Maintained:7'){expect(equal('probabilities')).toBe(false);expect(equal('actions')).toBe(true);}
  if(id.startsWith('retention:')){expect(equal('episodes')).toBe(false);expect(equal('probabilities')).toBe(true);expect(equal('actions')).toBe(true);}
  if(id.startsWith('lifecycle:')){expect(equal('goalLedger')).toBe(false);expect(equal('standing')).toBe(true);expect(r.identity.nativeSaveEqual).toBe(true);}
  if(id.startsWith('opportunity-withdrawn:')){expect(equal('goalLifecycle')).toBe(true);expect(equal('probabilities')).toBe(true);expect(r.identity.runEqual).toBe(false);}
  await expect(compareLongGoalSnapshots(id,a,{...b,runHash:'bad'})).rejects.toThrow('identity');
  await expect(compareLongGoalSnapshots(id,a,{...b,prefix:15})).rejects.toThrow('prefix');
  const initial={...b,prefix:0,complete:false,state:{...b.state,prefix:0,goals:[],rows:[]}};
  expect((await compareLongGoalSnapshots(id,a,initial)).status).toBe('UNALIGNED_PREFIXES');
 }
});
