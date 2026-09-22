import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {goalStrategyRecipe} from '../campaign3/goalStrategyModel';
import {prepareGoalStrategyModel,createGoalStrategyRun,restoreGoalStrategyRun} from '../campaign3/goalStrategyFactory';
import {decodeGoalStrategy as decode} from '../campaign3/goalStrategyCodecs';
import {decodeAgency} from '../campaign3/agencyCodecs';
import {cases,ordered,original,initialState,seed} from './goalStrategyFixtures';
it('public whole-prefix restore advances exactly and rejects edited originals or state',async()=>{
  const source=goalStrategyRecipe(),orderedInputs=ordered(cases().main),run=await createGoalStrategyRun(await prepareGoalStrategyModel(source),{initialState,orderedInputs,runSeed:seed});
  await run.settleNextInstant();await run.settleNextInstant();const save=run.save();await run.settleNextInstant();
  const restored=await restoreGoalStrategyRun(source,{initialState,orderedInputs,save});await restored.settleNextInstant();expect(restored.save()).toEqual(run.save());
  const saved=rec(decode(save),132n),fields=new Map(saved.fields);fields.set(11n,list([]));
  await expect(restoreGoalStrategyRun(source,{initialState,orderedInputs,save:enc(record(saved.schema,fields))})).rejects.toThrow();
  await expect(restoreGoalStrategyRun(source,{initialState,orderedInputs:ordered(cases().noAdoption),save})).rejects.toThrow();
  expect(items(f(saved,10n),'list')).toHaveLength(0);
},30000);
it('rejects forged model handles, foreign schemas and observer handles',async()=>{
  const source=goalStrategyRecipe(),model=await prepareGoalStrategyModel(source),run=await createGoalStrategyRun(model,{initialState,orderedInputs:ordered(cases().main),runSeed:seed});
  expect(()=>run.observerView(1)).toThrow('OBSERVER_HANDLE');
  expect(()=>decodeAgency(enc(original(1)))).toThrow();
  await expect(createGoalStrategyRun({} as typeof model,{initialState,orderedInputs:ordered(cases().main),runSeed:seed})).rejects.toThrow('MODEL_HANDLE');
});
