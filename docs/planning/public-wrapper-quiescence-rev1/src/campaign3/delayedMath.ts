import {list,map,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,readQ,qValue,compileReasonNuclei,readDistribution,analyzeOptions,absolute,expectation} from '../campaign2/cognitiveMath';
import {RandomRunOracle,randomAddressValue,type RandomAddress} from '../substrate/random';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataIdentity as id,dataUnsigned as uint} from '../campaign2/canonicalData';
import {delayedRecord as r} from './delayedCodecs';
import {receivingRecord as old} from './receivingCodecs';
import {OPTIONS,TASK,ACTOR,OBSERVER,sid,type DelayedCompiled} from './delayedModel';
export function evaluateDelayed(occ:CanonicalValue,at:bigint,knowledge:CanonicalValue,plan:CanonicalValue|undefined,law:number){
 const offers=items(f(rec(knowledge,1384n),1n),'list'),open=at===2n&&offers.length===1&&!plan;
 let now=ZERO,later=ZERO,admitted=false;
 if(open){const o=rec(f(rec(offers[0],1382n),4n),1380n),d=uint(f(o,3n)),future=uint(f(o,4n));now=readQ(f(o,1n));admitted=future>=2n;
  if(admitted){const discount=law===1?Q.of(1n,1n+d):law===2?ONE:Q.of(1n,2n**d),p=future===2n?Q.of(1n,2n):ONE;
   later=readQ(f(o,2n)).multiply(discount).multiply(p).subtract(readQ(f(o,5n)).multiply(Q.of(d)));if(later.compare(ZERO)<0)later=ZERO;}}
 return r(1386,[occ,signed(at),knowledge,list(plan?[plan]:[]),qValue(now),qValue(later),open,admitted]);
}
export function delayedOptions(app:CanonicalValue,occ:CanonicalValue){const a=rec(app,1386n);return r(1387,[occ,app,list(f(a,7n)===true?(f(a,8n)===true?OPTIONS.slice(0,2):[OPTIONS[0]]):[OPTIONS[2]])]);}
export function delayedRaw(options:CanonicalValue,occ:CanonicalValue){const o=rec(options,1387n),a=rec(f(o,2n),1386n),signals:CanonicalValue[]=[];
 for(const option of items(f(o,3n),'list')){const index=OPTIONS.findIndex(x=>key(x)===key(option)),value=index<2?f(a,index===0?5n:6n):qValue(ZERO);if(readQ(value).compare(ZERO)>0)signals.push(old(402,[old(401,[option,TASK,u(1)]),value,old(400,[map([])])]));}
 return r(1388,[occ,options,list(signals)]);
}
export function delayedReasons(model:DelayedCompiled,raw:CanonicalValue,occ:CanonicalValue){return r(1389,[occ,raw,list(compileReasonNuclei(items(f(rec(raw,1388n),3n),'list'),f(model.content,5n)))]);}
export async function delayedDecision(reasons:CanonicalValue,at:bigint,occ:CanonicalValue,seed:Uint8Array){const rs=rec(reasons,1389n),nuclei=items(f(rs,3n),'list'),options=items(f(rec(f(rec(f(rs,2n),1388n),2n),1387n),3n),'list'),distributions=options.map(option=>{const n=nuclei.find(n=>key(f(rec(f(rec(n,407n),1n),404n),1n))===key(option)),distribution=n?readDistribution(f(rec(n,407n),7n)):new Map([[0n,ONE]]);return {key:option,distribution,reasonMass:absolute(expectation(distribution))};}),analysis=analyzeOptions(distributions,ONE,ONE),mode={Auto:1,QuietRoll:2,PlayerFacingRoll:3}[analysis.mode as 'Auto'|'QuietRoll'|'PlayerFacingRoll'],oracle=new RandomRunOracle(seed),draws:CanonicalValue[]=[],scores=new Map(options.map(o=>[key(o),0n]));let chosen=analysis.ranked[0].key;
 async function draw(purpose:string,bindings:RandomAddress['subjectBindings'],span:bigint){const d=await oracle.drawBounded({causalRootId:id(occ),purposeId:sid(1042,'purpose/delayed/'+purpose),subjectBindings:bindings,drawIndex:0n},span);draws.push(old(411,[randomAddressValue(d.localAddress),d.effectiveKey,u(d.result),u(d.span),u(d.limit),d.fallback,list(d.attempts.map(a=>old(410,[u(a.internalCandidateIndex),u(a.candidate),a.rejected])))]));return d.result;}
 const binding=(role:string,v:CanonicalValue)=>({subjectRoleId:sid(1043,'subject/delayed/'+role),subjectId:id(v)});
 if(mode!==1){for(const value of nuclei){const n=rec(value,407n),nk=rec(f(n,1n),404n),option=rec(f(nk,1n),395n),face=await draw('reason-face',[binding('actor',ACTOR),binding('action',f(option,2n)),binding('ground',f(nk,3n))],uint(f(n,4n))),standing=f(n,5n),situation=f(n,6n);if(typeof standing==='boolean'||standing.kind!=='signed'||typeof situation==='boolean'||situation.kind!=='signed')throw Error('DELAYED_MODIFIER');scores.set(key(option),(uint(f(nk,4n))===1n?1n:-1n)*(face+1n+standing.value+situation.value));}const top=[...scores.values()].reduce((a,b)=>a>b?a:b),leaders=options.filter(o=>scores.get(key(o))===top).sort((a,b)=>key(a)<key(b)?-1:1);chosen=leaders[0];if(leaders.length>1)chosen=leaders[Number(await draw('tie',[binding('actor',ACTOR)],BigInt(leaders.length)))];}
 return r(1390,[occ,signed(at),reasons,list(analysis.probabilities.map(p=>old(421,[p.key,qValue(p.probability)]))),u(mode),list(draws),chosen]);}

export function learnDelayed(prior:CanonicalValue,offers:readonly CanonicalValue[],receipts:readonly CanonicalValue[]){
 const p=rec(prior,1384n),beforeOffer=items(f(p,1n),'list'),beforeReceipt=items(f(p,2n),'list');
 for(const v of [...offers,...receipts])if(typeof v==='boolean'||v.kind!=='record'||key(f(v,2n))!==key(OBSERVER))throw Error('DELAYED_FOREIGN_OBSERVER');
 if(beforeOffer.length&&offers.length)throw Error('DELAYED_DUPLICATE_OFFER');
 if(beforeReceipt.length&&receipts.length&&key(f(rec(beforeReceipt[0],1383n),5n))!==key(f(rec(receipts[0],1383n),5n)))throw Error('DELAYED_RECEIPT_CONFLICT');
 return r(1384,[list(beforeOffer.length?beforeOffer:offers),list(beforeReceipt.length?beforeReceipt:receipts)]);
}
export function delayedObserverView(outputs:readonly CanonicalValue[],observer=0){if(observer!==0)throw Error('DELAYED_OBSERVER_HANDLE');return list(outputs.filter(v=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('DELAYED_OUTPUT_ROSTER');const t=v.schema.typeId;if(t===1399n)return false;if(![1382n,1383n,1386n,1387n,1388n,1389n,1390n,1391n,1392n,1395n,1396n,1400n].includes(t))throw Error('DELAYED_OUTPUT_ROSTER');return true;}));}
