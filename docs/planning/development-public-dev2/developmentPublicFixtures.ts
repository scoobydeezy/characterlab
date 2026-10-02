import {developmentRoster} from './developmentRoster';
import {developmentRecipe,developmentInitial,developmentOrdered,compileDevelopmentModel,compileDevelopmentInputs} from '../campaign3/developmentPublicModel';
import {createDevelopmentPublicRuntime} from '../campaign3/developmentPublicRuntime';
import {createDevelopmentPublicRun,prepareDevelopmentModel} from '../campaign3/developmentPublicFactory';
export function publicCase(name='Main',limit?:number){const row=developmentRoster().find(x=>x.name===name)!;const frames=limit?row.frames.slice(0,limit):row.frames;return {...row,frames,source:developmentRecipe(row.profile),initialState:developmentInitial(),orderedInputs:developmentOrdered(row.profile,frames),runSeed:new Uint8Array(32)};}
export const publicInput=(c=publicCase())=>({initialState:c.initialState,orderedInputs:c.orderedInputs,runSeed:c.runSeed});
export const restoreInput=(c:ReturnType<typeof publicCase>,save:Uint8Array)=>({initialState:c.initialState,orderedInputs:c.orderedInputs,save});
export async function nativeRun(c=publicCase()){return createDevelopmentPublicRun(await prepareDevelopmentModel(c.source),publicInput(c));}
export async function nativeRuntime(c=publicCase()){const model=await compileDevelopmentModel(c.source),input=await compileDevelopmentInputs(model,c.initialState,c.orderedInputs,c.runSeed);return {model,input,runtime:createDevelopmentPublicRuntime(model,input)};}
