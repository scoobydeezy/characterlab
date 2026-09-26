import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {delayedRecipe} from '../campaign3/delayedModel';
import {prepareDelayedModel,createDelayedRun,restoreDelayedRun} from '../campaign3/delayedFactory';
import {decodeDelayed as decode} from '../campaign3/delayedCodecs';
import {decodeAgency} from '../campaign3/agencyCodecs';
import {cases,ordered,original,initialState,seed} from './delayedFixtures';
it('public whole-prefix restore advances exactly and rejects edited originals or state',async()=>{
  const source=delayedRecipe(),orderedInputs=ordered(cases().main),run=await createDelayedRun(await prepareDelayedModel(source),{initialState,orderedInputs,runSeed:seed});
  await run.settleNextInstant();await run.settleNextInstant();const save=run.save();await run.settleNextInstant();
  const restored=await restoreDelayedRun(source,{initialState,orderedInputs,save});await restored.settleNextInstant();expect(restored.save()).toEqual(run.save());
  const saved=rec(decode(save),132n),fields=new Map(saved.fields);fields.set(11n,list([]));
  await expect(restoreDelayedRun(source,{initialState,orderedInputs,save:enc(record(saved.schema,fields))})).rejects.toThrow();
  await expect(restoreDelayedRun(source,{initialState,orderedInputs:ordered(cases().absentOffer),save})).rejects.toThrow();
  expect(items(f(saved,10n),'list')).toHaveLength(0);
},30000);
it('rejects forged model handles, foreign schemas and observer handles',async()=>{
  const source=delayedRecipe(),model=await prepareDelayedModel(source),run=await createDelayedRun(model,{initialState,orderedInputs:ordered(cases().main),runSeed:seed});
  expect(()=>run.observerView(1)).toThrow('OBSERVER_HANDLE');
  expect(()=>decodeAgency(enc(original(1)))).toThrow();
  await expect(createDelayedRun({} as typeof model,{initialState,orderedInputs:ordered(cases().main),runSeed:seed})).rejects.toThrow('MODEL_HANDLE');
});
