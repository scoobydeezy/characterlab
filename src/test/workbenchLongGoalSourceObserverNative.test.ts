import {it,expect} from 'vitest';
import {LongGoalWorkbenchRun} from '../workbench/longGoalAdapter';
import {describeLongGoalSource} from '../workbench/longGoalSourceObserver';
import {explainLongObserver} from '../workbench/longExplanations';
import {fromHex} from '../workbench/canonical';
it('uses the actual component-recorded native observer while leaving its checkpoint unchanged',async()=>{
 const run=await LongGoalWorkbenchRun.create(24);expect((await describeLongGoalSource({prefix:0,rows:[]})).status).toBe('NO_RECORDED_SOURCE_OBSERVATION');await run.advance();
 const s=run.snapshot(),before=run.checkpoint(),input={prefix:s.prefix,rows:s.state.rows.map(({at,sourceView})=>({at,sourceView}))},report=await describeLongGoalSource(input);
 expect(report.status).toBe('RECORDED_NATIVE_OBSERVER');if(report.status!=='RECORDED_NATIVE_OBSERVER')throw Error('Missing observer');expect(report.description).toEqual(await explainLongObserver(fromHex(s.state.rows[0].sourceView)));expect(report.sourceClock).toBe(1);expect(run.checkpoint()).toEqual(before);
},600000);
