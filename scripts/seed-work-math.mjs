// Initial port of the already qualified reason-dice receiving stage; no old file edits.
import fs from 'node:fs';
const old=fs.readFileSync('src/campaign3/affectMath.ts','utf8');
const decision=old.slice(old.indexOf('export async function affectDecision'),old.indexOf('export function affectExpression')).replaceAll('affectDecision','workDecision').replaceAll('AffectCompiled','WorkCompiled').replaceAll('affect/','work/').replaceAll('AFFECT_','WORK_').replaceAll('aid(','wid(').replaceAll('756n','775n').replaceAll('r(757','r(776').replaceAll('f(model.content,7n)','f(model.content,6n)');
const header=`/** workspace-control/0.1-candidate; inherited exact reasons and addressed arbitration. */
import {list,map,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataIdentity as id} from '../campaign2/canonicalData';
import {ONE,readQ,qValue,compileReasonNuclei,readDistribution,analyzeOptions,absolute,expectation} from '../campaign2/cognitiveMath';
import {RandomRunOracle,randomAddressValue,type RandomAddress} from '../substrate/random';
import {workRecord as r} from './workCodecs';
import {receivingRecord as old} from './receivingCodecs';
import {TASKS,OPTIONS,CHARACTER,wid,type WorkCompiled} from './workModel';
export function workRaw(workspace:CanonicalValue,occurrence:CanonicalValue){
 const access=items(f(rec(workspace,773n),9n),'list');
 return r(774,[occurrence,workspace,list(access.map(v=>{const i=Number(uint(v))-1;return old(402,[old(401,[OPTIONS[i],TASKS[i],u(1)]),qValue(ONE),old(400,[map([])])]);}))]);
}
export function workReasons(model:WorkCompiled,raw:CanonicalValue,occurrence:CanonicalValue){return r(775,[occurrence,raw,list(compileReasonNuclei(items(f(rec(raw,774n),3n),'list'),f(model.content,5n)))]);}
`;
fs.writeFileSync('src/campaign3/workMath.ts',header+decision,{flag:'wx'});
