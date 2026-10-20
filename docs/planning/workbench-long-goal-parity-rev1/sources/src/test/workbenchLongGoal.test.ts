import {it,expect} from 'vitest';
import {LongGoalWorkbenchRun,LONG_GOAL_CASES} from '../workbench/longGoalAdapter';
import {createLongitudinalGoalRun,type Law,type GoalMode} from '../campaign3/longitudinalGoal';
import {bytesToHex} from '../substrate/canonicalEncoding';
it('binds original component identities and preserves source/receiver saves through restore',async()=>{
 expect(LONG_GOAL_CASES).toHaveLength(120);const p=LONG_GOAL_CASES[0],a=await LongGoalWorkbenchRun.create(),native=await createLongitudinalGoalRun(p.law as Law,p.mode as GoalMode,p.seed,p.keepEpisodes);expect(a.checkpoint().saveHex).toBe(bytesToHex(native.save()));const pending=a.advance();await expect(a.advance()).rejects.toThrow('in flight');expect(()=>a.snapshot()).toThrow('advancing');await pending;await native.step();expect(a.checkpoint().saveHex).toBe(bytesToHex(native.save()));expect(a.snapshot().state).toEqual(native.snapshot());const c=a.checkpoint(),r=await LongGoalWorkbenchRun.restore(c);expect(r.snapshot()).toEqual(a.snapshot());await a.advance();await r.advance();expect(r.checkpoint()).toEqual(a.checkpoint());const copy=a.snapshot();copy.state.rows.length=0;expect(a.snapshot().state.rows.length).toBe(2);await expect(LongGoalWorkbenchRun.restore({...c,runHash:'bad'})).rejects.toThrow('identity');await expect(LongGoalWorkbenchRun.create(120)).rejects.toThrow('Unknown');
},600000);
