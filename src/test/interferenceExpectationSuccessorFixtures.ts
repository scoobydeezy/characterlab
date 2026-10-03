import {original,ordered,initialState,seed} from './agencyFixtures';
import {agencyRecipe} from '../campaign3/agencyModel';
import {prepareAgencyModel,createAgencyRun} from '../campaign3/agencyFactory';
import type {Frame} from '../campaign3/interferenceExpectation';
export function successorSource(repeated:boolean){return ordered([original(1,1,1,{competent:false,blocker:1,outcome:[1],obstruction:[]}),original(2,2,1,{receipt:1,positive:true,recipients:[1]}),original(3,1,2,{competent:false,blocker:1,outcome:[1],obstruction:[]}),original(4,2,2,{receipt:2,positive:true,recipients:[1]}),original(5,1,3,{competent:false,blocker:0,outcome:[1],obstruction:[]}),original(6,2,3,{receipt:3,positive:false,recipients:[1]}),original(7,2,3,{receipt:repeated?4:3,positive:false,recipients:[1]}),original(8,3,4)]);}
export async function successorFrames(repeated:boolean){const run=await createAgencyRun(await prepareAgencyModel(agencyRecipe(1)),{initialState,orderedInputs:successorSource(repeated),runSeed:seed}),frames:Frame[]=[];while(await run.settleNextInstant())frames.push({view:run.observerView(0),context:'A',goal:1});return frames;}
