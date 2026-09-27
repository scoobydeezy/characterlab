import {canonicalEncode as enc,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {value} from '../campaign3/biologyPublicData';
import {beliefRecipe,initialBytes,orderedBytes,compileBeliefModel,compileBeliefInputs,stateData,evidence} from '../campaign3/identityBeliefPublicModel';
import {createIdentityBeliefRuntime} from '../campaign3/identityBeliefRuntime';
import {prepareIdentityBeliefModel,createIdentityBeliefPublicRun} from '../campaign3/identityBeliefPublicFactory';
import {decodeIdentityBeliefPublic as decode} from '../campaign3/identityBeliefPublicCodecs';
import type {IdentityBeliefLaw} from '../campaign3/identityBelief';
import {identityBeliefInputs,type IdentityBeliefScenario} from './identityBeliefFixtures';
import {records,taskSemantic} from './identityPublicFixtures';
export {records,taskSemantic};
export function beliefCase(law:IdentityBeliefLaw='Mean',scenario:IdentityBeliefScenario='Primary',seed=1){const input=identityBeliefInputs(scenario);return {source:beliefRecipe(law),initialState:initialBytes(),orderedInputs:orderedBytes(input),runSeed:new Uint8Array(32).fill(seed),input};}
export async function nativeRuntime(c=beliefCase()){const model=await compileBeliefModel(c.source),input=await compileBeliefInputs(model,c.initialState,c.orderedInputs,c.runSeed);return {model,input,runtime:createIdentityBeliefRuntime(model,input)};}
export const nativeRun=async(c=beliefCase())=>createIdentityBeliefPublicRun(await prepareIdentityBeliefModel(c.source),c);
export const outputs=(run:{snapshot():{outputs:Uint8Array}})=>items(decode(run.snapshot().outputs),'list');
const optional=(v:CanonicalValue)=>{const xs=items(v,'list');if(!xs.length)return null;const q=readQ(xs[0]);return `${q.numerator}/${q.denominator}`;};
export function beliefRows(xs:readonly CanonicalValue[]){return Array.from({length:records(xs,1437).length},(_,i)=>{const select=(t:number)=>records(xs,t).filter(x=>uint(f(x,2n))===BigInt(i+1));return {at:i+1,observations:select(1448).map(x=>{const es=items(f(x,3n),'list');return es.length?evidence(es[0],Number(uint(f(x,1n)))):null;}),states:select(1449).map(x=>stateData(f(x,3n),Number(uint(f(x,1n))))),appraisals:select(1450).map(x=>({estimate:optional(f(x,4n)),adverse:optional(f(x,5n)),affect:value(f(x,6n))}))};});}
