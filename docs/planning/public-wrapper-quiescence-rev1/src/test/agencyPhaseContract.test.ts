import {it,expect} from 'vitest';
import {compileAgencyModel,compileAgencyInputs,agencyRecipe} from '../campaign3/agencyModel';
import {createAgencyRuntime} from '../campaign3/agencyRuntime';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {original,ordered,initialState,seed,records} from './agencyFixtures';
it('actual trace emits intent70, expression80, plan90, attempt100 and world execution110',async()=>{
  const model=await compileAgencyModel(agencyRecipe()),input=await compileAgencyInputs(model,initialState,ordered([original(1)]),seed),runtime=createAgencyRuntime(model,input);
  await runtime.settle();
  for(const [type,phase] of [[425n,70n],[426n,80n],[431n,90n],[432n,100n],[974n,110n]]) {
    const producers=runtime.snapshot().trace.map(v=>rec(v,160n)).filter(v=>records(items(f(v,13n),'list'),type).length>0);
    expect(producers).toHaveLength(1);
    expect(f(rec(f(producers[0],4n),130n),3n)).toEqual({kind:'unsigned',value:phase});
  }
},30000);
