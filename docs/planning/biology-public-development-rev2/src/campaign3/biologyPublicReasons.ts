import {compileReasonNuclei,readDistribution} from '../campaign2/cognitiveMath';
import {multisourceBase} from './multisourceModelRecipe';
import {ACTOR,sid} from './longitudinalModel';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {map,unsigned as u,rational as q} from '../substrate/canonicalEncoding';
import {receivingRecord as old} from './receivingCodecs';
import {dataRecord as rec,dataField as f,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import type {Ground} from './biologicalChoice';
const definition=multisourceBase().get('task-reason-dice');
/** Reuse arithmetic only. Strip every TaskKey/Commitment semantic wrapper. */
export function nativeNuclei(grounds:readonly Ground[]){return grounds.flatMap(g=>{
 const option=old(395,[ACTOR,sid(1027,'action/biology/'+g.option)]),task=old(371,[ACTOR,semanticReferentFromAuthoredContent(sid(1038,'content/biology/'+g.domain))]);
 const signals=[g.strength,g.situation??0,g.standing??0].map((v,i)=>old(402,[old(401,[option,task,u(i+1)]),q(v,1000),old(400,[map([])])]));
 return compileReasonNuclei(signals,definition).map(raw=>{const v=rec(raw,407n),nk=rec(f(v,1n),404n);return {ground:g,sortKey:key(v),numerics:{polarity:Number(uint(f(nk,4n))),die:Number(uint(f(v,4n))),standing:Number((f(v,5n) as {value:bigint}).value),situation:Number((f(v,6n) as {value:bigint}).value),distribution:[...readDistribution(f(v,7n))].map(([score,p])=>[Number(score),`${p.numerator}/${p.denominator}`])}};});
 }).sort((a,b)=>a.sortKey.localeCompare(b.sortKey,'en'));}
export const sourceKind=(domain:string)=>domain==='pleasure'?2:['practice','protective-goal','work-goal'].includes(domain)?3:domain==='protection'?4:1;
