import {it,expect} from 'vitest';
import {prepareAgencyModel,createAgencyRun} from '../campaign3/agencyFactory';
import {agencyRecipe} from '../campaign3/agencyModel';
import {original,ordered,initialState,seed} from './agencyFixtures';
it('an unreceived report cannot change a later observer view through occurrence allocation',async()=>{
  const handle=await prepareAgencyModel(agencyRecipe());
  const views=[];
  for(const middle of [original(2,2,1,{recipients:[1]}),original(2,3)]) {
    const run=await createAgencyRun(handle,{initialState,runSeed:seed,orderedInputs:ordered([original(1),middle,original(3,1,2),original(4,3)])});
    while(await run.settleNextInstant()){}
    views.push(run.observerView(1));
  }
  expect(views[0]).toEqual(views[1]);
},30000);
