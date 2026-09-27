import { it, expect } from 'vitest';
import { compileAgencyModel, compileAgencyInputs, agencyRecipe } from '../campaign3/agencyModel';
import { createAgencyRuntime } from '../campaign3/agencyRuntime';
import { cases, ordered, initialState, seed, records } from './agencyFixtures';
it('development integration reaches real decision, expression, execution and owned evidence',async()=>{
  const model=await compileAgencyModel(agencyRecipe()),input=await compileAgencyInputs(model,initialState,ordered(cases().main),seed),runtime=createAgencyRuntime(model,input);
  while(await runtime.settle()) {}
  const snapshot=runtime.snapshot();
  expect(records(snapshot.outputs,425n)).toHaveLength(1);
  expect(records(snapshot.outputs,974n)).toHaveLength(1);
  expect(snapshot.randomAddresses.length).toBeGreaterThan(0);
  expect(snapshot.state.entries().length).toBe(3);
  expect(runtime.save().length).toBeGreaterThan(0);
},30000);
