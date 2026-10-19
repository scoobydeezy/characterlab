import {it,expect} from 'vitest';
import {describeLongGoalSource} from '../workbench/longGoalSourceObserver';
import {historicalLongGoalSnapshot} from './longGoalHistoricalFixture';
it('describes only recorded native observer bytes and distinguishes missing initial observation',async()=>{
 const initial=await describeLongGoalSource({prefix:0,rows:[]});expect(initial.status).toBe('NO_RECORDED_SOURCE_OBSERVATION');expect('description' in initial).toBe(false);
 const s=await historicalLongGoalSnapshot(24),input={prefix:s.prefix,rows:s.state.rows.map(r=>({at:r.at,sourceView:r.sourceView}))},before=JSON.stringify(input),r=await describeLongGoalSource(input);
 expect(r.status).toBe('RECORDED_NATIVE_OBSERVER');if(r.status!=='RECORDED_NATIVE_OBSERVER')throw Error('Missing observation');expect(r.sourceClock).toBe(21);expect(r.description.rows.length).toBe(6);expect(await describeLongGoalSource(input)).toEqual(r);expect(JSON.stringify(input)).toBe(before);
 await expect(describeLongGoalSource({...input,prefix:15})).rejects.toThrow('prefix');await expect(describeLongGoalSource({prefix:1,rows:[{at:2,sourceView:input.rows[0].sourceView}]})).rejects.toThrow('clock');await expect(describeLongGoalSource({prefix:1,rows:[{at:1,sourceView:'00'}]})).rejects.toThrow();
});
