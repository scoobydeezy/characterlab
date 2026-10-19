import {it,expect} from 'vitest';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import plan from '../../docs/planning/LONGITUDINAL_GOAL_PLAN_REV1.json';
import {LONG_GOAL_COMPARISONS,compareLongGoalSnapshots} from '../workbench/longGoalComparison';
import type {LongGoalSnapshot} from '../workbench/longGoalAdapter';
const hash=(s:string)=>createHash('sha256').update(Buffer.from(s,'hex')).digest('hex');
function historical(index:number):LongGoalSnapshot{
 const p=plan.runs[index],r=JSON.parse(fs.readFileSync(`docs/planning/longitudinal-goal-execution-rev1/${String(index).padStart(3,'0')}.json`,'utf8'));
 expect(r.modelIdentity).toBe(p.modelIdentity);expect(r.runIdentity).toBe(p.runIdentity);
 return{index,law:p.law,mode:p.mode,seed:p.seed,keepEpisodes:p.keepEpisodes,seamVersion:'longitudinal-goal-component/0.1-candidate',boundary:'native-source-plus-component-receiver',prefix:16,complete:true,modelHash:hash(p.modelIdentity),runHash:hash(p.runIdentity),saveHash:r.prefixHashes[16],nativeSaveHash:r.nativeHashes[16],state:r.state,scope:'Historical fixture; not current adapter parity'};
}
it('preserves historical coarse/zero/action equalities and distinguishes goals, retention and probabilities',async()=>{
 expect(LONG_GOAL_COMPARISONS.length).toBe(120);expect(new Set(LONG_GOAL_COMPARISONS.map(p=>p.id)).size).toBe(120);expect(new Set(LONG_GOAL_COMPARISONS.flatMap(p=>[p.control,p.candidate])).size).toBe(120);
 for(const id of ['feedback:Maintained:0','coarse:Maintained:0','feedback:Maintained:4','feedback:Maintained:7','retention:Maintained:0','lifecycle:Replaced:0','opportunity-withdrawn:0']){
  const spec=LONG_GOAL_COMPARISONS.find(p=>p.id===id)!,a=historical(spec.control),b=historical(spec.candidate),before=JSON.stringify([a,b]),r=await compareLongGoalSnapshots(id,a,b);
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
