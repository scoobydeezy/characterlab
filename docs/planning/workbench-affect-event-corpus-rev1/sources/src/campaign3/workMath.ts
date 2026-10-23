/** workspace-control/0.1-candidate; inherited exact reasons and addressed arbitration. */
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
export async function workDecision(model:WorkCompiled,reasons:CanonicalValue,at:bigint,occurrence:CanonicalValue,seed:Uint8Array){
 const nuclei=items(f(rec(reasons,775n),3n),'list'),options=OPTIONS.map(option=>{const n=nuclei.find(n=>key(f(rec(f(rec(n,407n),1n),404n),1n))===key(option));const distribution=n?readDistribution(f(rec(n,407n),7n)):new Map([[0n,ONE]]);return {key:option,distribution,reasonMass:absolute(expectation(distribution))};});
 const def=rec(f(model.content,6n),440n),analysis=analyzeOptions(options,readQ(f(def,1n)),readQ(f(def,2n))),mode={Auto:1,QuietRoll:2,PlayerFacingRoll:3}[analysis.mode as 'Auto'|'QuietRoll'|'PlayerFacingRoll'];
 const oracle=new RandomRunOracle(seed),draws:CanonicalValue[]=[],scores=new Map<string,bigint>(OPTIONS.map(o=>[key(o),0n]));let chosen=nuclei.length?analysis.ranked[0].key:undefined;
 async function draw(purpose:string,bindings:RandomAddress['subjectBindings'],span:bigint){const d=await oracle.drawBounded({causalRootId:id(occurrence),purposeId:wid(1042,'purpose/work/'+purpose),subjectBindings:bindings,drawIndex:0n},span);draws.push(old(411,[randomAddressValue(d.localAddress),d.effectiveKey,u(d.result),u(d.span),u(d.limit),d.fallback,list(d.attempts.map(a=>old(410,[u(a.internalCandidateIndex),u(a.candidate),a.rejected])))]));return d.result;}
 const binding=(role:string,v:CanonicalValue)=>({subjectRoleId:wid(1043,'subject/work/'+role),subjectId:id(v)});
 if(nuclei.length&&mode!==1){for(const value of nuclei){const n=rec(value,407n),nk=rec(f(n,1n),404n),option=rec(f(nk,1n),395n),face=await draw('reason-face',[binding('actor',CHARACTER),binding('action',f(option,2n)),binding('ground',f(nk,3n))],uint(f(n,4n))),standing=f(n,5n),situation=f(n,6n);if(typeof standing==='boolean'||standing.kind!=='signed'||typeof situation==='boolean'||situation.kind!=='signed')throw Error('WORK_MODIFIER');scores.set(key(option),(uint(f(nk,4n))===1n?1n:-1n)*(face+1n+standing.value+situation.value));}
  const top=[...scores.values()].reduce((a,b)=>a>b?a:b),leaders=OPTIONS.filter(o=>scores.get(key(o))===top).sort((a,b)=>key(a)<key(b)?-1:1);chosen=leaders[0];if(leaders.length===2)chosen=leaders[Number(await draw('tie',[binding('actor',CHARACTER)],2n))];
 }
 const fields=new Map<bigint,CanonicalValue>([[1n,occurrence],[2n,signed(at)],[3n,reasons],[4n,list(analysis.probabilities.map(p=>old(421,[p.key,qValue(p.probability)])))],[5n,u(mode)],[6n,list(draws)],[7n,map(OPTIONS.map(o=>[o,signed(scores.get(key(o))!)]))]]);if(chosen)fields.set(8n,chosen);return r(776,fields);
}
