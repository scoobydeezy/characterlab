import {it,expect} from 'vitest';
import {LongRoutineWorkbenchRun} from '../workbench/longRoutineAdapter';
import {projectLongRoutineOwnedState as project} from '../workbench/longRoutineOwnedProjection';
import {describeLongRoutineOwnedState as describe} from '../workbench/longRoutineStateDescription';
it('preserves history through negative report and distinguishes later observed extinction',async()=>{
 const r=await LongRoutineWorkbenchRun.create(0);expect(describe(project(r.snapshot().state)).belief.value).toBeNull();for(let n=0;n<8;n++)await r.advance();const p=project(r.snapshot().state),before=r.checkpoint(),a=describe(p);expect(a.belief.value).toBe(false);expect(a.history.count).toBe(6);expect(a.cache.originalCue).toBe('63/64');expect(a.goals[0].status).toBe('Open');await r.advance();expect(describe(project(r.snapshot().state))).toEqual(a);await r.advance();const later=describe(project(r.snapshot().state));expect(later.history.records.at(-1)).toMatchObject({at:'15',reward:false});expect(later.cache.originalCue).toBe('63/128');expect(describe(p)).toEqual(a);expect(before.prefix).toBe(8);expect(()=>describe({...p,derivedCache:'00'})).toThrow();expect(()=>describe({...p,goals:[...p.goals,p.goals[0]]})).toThrow();
});
it('withholds scenario and source details, preserves goal withdrawal and opposed adoption',async()=>{
 const r=await LongRoutineWorkbenchRun.create(64);for(let n=0;n<8;n++)await r.advance();const s=r.snapshot().state,owned=project(s),report=describe(owned),prior=r.checkpoint();expect(report.goals.map(g=>[g.id,g.status,g.activeFrom])).toEqual([['practice','Withdrawn','2'],['rest','Open','9']]);const changed={...s,profile:{...s.profile,seed:255},rows:[]};expect(describe(project(changed))).toEqual(report);report.history.records.length=0;expect(describe(owned).history.count).toBe(6);expect(r.checkpoint()).toEqual(prior);
});
