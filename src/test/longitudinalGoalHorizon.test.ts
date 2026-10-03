import {it,expect} from 'vitest';
import {createLongitudinalGoalRun as create,restoreLongitudinalGoalRun as restore} from '../campaign3/longitudinalGoal';
it('the complete sixteen-instant horizon preserves the replacement ledger and terminal replay',async()=>{
 const r=await create('FineStanding','Replaced');while(await r.step()){}
 const s=r.snapshot();expect(s.prefix).toBe(16);expect(s.rows.map(x=>x.at)).toEqual([1,2,3,4,5,6,7,8,14,15,16,17,18,19,20,21]);
 expect(s.goals.map(x=>[x.id,x.status,x.changedAt])).toEqual([['original','Withdrawn','8'],['replacement','Open','8']]);
 expect(s.rows[8].episodes).toBe(0);expect(s.rows[15].episodes).toBeGreaterThan(0);expect(s.rows[8].standing).toBe(s.rows[15].standing);
 expect(s.rows.slice(8).every(x=>x.choice.chosen!==null)).toBe(true);
 const copy=await restore('FineStanding','Replaced',0,false,16,r.save());expect(await copy.step()).toBe(false);expect(copy.save()).toEqual(r.save());
},300000);
