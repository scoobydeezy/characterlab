/** Pure receiving functions. No world or mutation capability. */
import {list,map,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataIdentity as id} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,readQ,qValue,compileReasonNuclei,readDistribution,analyzeOptions,absolute,expectation,choiceAlignment} from '../campaign2/cognitiveMath';
import {RandomRunOracle,randomAddressValue,type RandomAddress} from '../substrate/random';
import {affectRecord as r} from './affectCodecs';
import {receivingRecord as old} from './receivingCodecs';
import {compareAffectFactors,AFFECT_CANDIDATES} from './affectFactorComparison';
import {PROPOSITIONS,TASKS,OPTIONS,CHARACTER,aid,beliefKey,type AffectCompiled} from './affectModel';
const maximum=(a:Q,b:Q)=>a.compare(b)>0?a:b;
export function affectAppraisal(model:AffectCompiled,at:bigint,occurrence:CanonicalValue,beliefs:readonly (CanonicalValue|undefined)[],context:CanonicalValue|undefined,prior:CanonicalValue|undefined){
 const means=beliefs.map(b=>b?readQ(f(rec(b,739n),1n)):undefined),[p,b,t]=means;
 const efficacy=b&&t&&b.compare(ZERO)>0?maximum(ZERO,b.subtract(t).divide(model.settings.controlLaw===1?b:ONE)):undefined;
 const s=context?rec(context,750n):undefined,catalogue=s?uint(f(s,9n)):0n,c=catalogue===1n?ZERO:catalogue===2n?efficacy:undefined,reserve=s?.fields.get(10n),v=reserve?ONE.subtract(readQ(reserve)):undefined;
 const projected=compareAffectFactors({likelihood:p,severity:readQ(f(model.profile,6n)),vulnerability:v,control:c},AFFECT_CANDIDATES[model.settings.candidate-1]),raw=projected.status==='Known'?projected.coordinates:[];
 const previous=prior?rec(prior,754n):undefined,previousCoords=previous?items(f(previous,6n),'list'):[];
 let a=ZERO;
 const fields=new Map<bigint,CanonicalValue>([[1n,occurrence],[2n,signed(at)],[3n,map(beliefs.flatMap((v,i)=>v?[[beliefKey(PROPOSITIONS[i]),v] as const]:[]))],[4n,f(model.profile,6n)],[5n,list(raw.map(qValue))]]);
 if(model.settings.feedback&&previous&&previousCoords.length){const priorTime=f(previous,2n);if(typeof priorTime==='boolean'||priorTime.kind!=='signed'||priorTime.value>=at)throw Error('AFFECT_FEEDBACK_ORDER');a=readQ(previousCoords[0]);fields.set(11n,f(previous,1n));fields.set(12n,priorTime);fields.set(13n,qValue(a));}
 fields.set(6n,list(raw.map(z=>qValue(z.add(ONE.subtract(z).multiply(a).divide(Q.of(2n)))))));
 if(context)fields.set(7n,context);if(p)fields.set(8n,qValue(p));if(v)fields.set(9n,qValue(v));if(c)fields.set(10n,qValue(c));if(efficacy)fields.set(14n,qValue(efficacy));
 return r(754,fields);
}
export function affectRaw(model:AffectCompiled,appraisal:CanonicalValue,adopted:readonly boolean[],occurrence:CanonicalValue){
 const signals:CanonicalValue[]=[],app=rec(appraisal,754n),coords=items(f(app,6n),'list'),empty=old(400,[map([])]);
 // Commitment bases have no manufactured observational support. The contextual
 // modifier retains the exact supporting observation basis of its belief/context.
 const basisIds=new Map<string,CanonicalValue>();const beliefs=f(app,3n);if(typeof beliefs!=='boolean'&&beliefs.kind==='map')for(const [,b] of beliefs.entries)for(const s of items(f(rec(b,739n),3n),'set'))basisIds.set(key(s),s);
 const context=app.fields.get(7n);if(context){const s=f(rec(context,750n),1n);basisIds.set(key(s),s);}
 const basis=old(400,[map([...basisIds.values()].map(s=>[old(399,[u(1),old(237,[u(1),s])]),qValue(ONE)]))]);
 const signal=(i:number,role:number,strength:CanonicalValue,basis:CanonicalValue)=>old(402,[old(401,[OPTIONS[i],TASKS[i],u(role)]),strength,basis]);
 for(let i=0;i<2;i++)if(adopted[i])signals.push(signal(i,1,f(model.profile,i===0?8n:7n),empty));
 if(coords.length)signals.push(signal(0,2,coords.at(-1)!,basis));
 return r(755,[occurrence,appraisal,list(signals)]);
}
export function affectReasons(model:AffectCompiled,raw:CanonicalValue,occurrence:CanonicalValue){return r(756,[occurrence,raw,list(compileReasonNuclei(items(f(rec(raw,755n),3n),'list'),f(model.content,6n)))]);}
export async function affectDecision(model:AffectCompiled,reasons:CanonicalValue,at:bigint,occurrence:CanonicalValue,seed:Uint8Array){
 const nuclei=items(f(rec(reasons,756n),3n),'list'),options=OPTIONS.map(option=>{const n=nuclei.find(n=>key(f(rec(f(rec(n,407n),1n),404n),1n))===key(option));const distribution=n?readDistribution(f(rec(n,407n),7n)):new Map([[0n,ONE]]);return {key:option,distribution,reasonMass:absolute(expectation(distribution))};});
 const def=rec(f(model.content,7n),440n),analysis=analyzeOptions(options,readQ(f(def,1n)),readQ(f(def,2n))),mode={Auto:1,QuietRoll:2,PlayerFacingRoll:3}[analysis.mode as 'Auto'|'QuietRoll'|'PlayerFacingRoll'];
 const oracle=new RandomRunOracle(seed),draws:CanonicalValue[]=[],scores=new Map<string,bigint>(OPTIONS.map(o=>[key(o),0n]));let chosen=nuclei.length?analysis.ranked[0].key:undefined;
 async function draw(purpose:string,bindings:RandomAddress['subjectBindings'],span:bigint){const d=await oracle.drawBounded({causalRootId:id(occurrence),purposeId:aid(1042,'purpose/affect/'+purpose),subjectBindings:bindings,drawIndex:0n},span);draws.push(old(411,[randomAddressValue(d.localAddress),d.effectiveKey,u(d.result),u(d.span),u(d.limit),d.fallback,list(d.attempts.map(a=>old(410,[u(a.internalCandidateIndex),u(a.candidate),a.rejected])))]));return d.result;}
 const binding=(role:string,v:CanonicalValue)=>({subjectRoleId:aid(1043,'subject/affect/'+role),subjectId:id(v)});
 if(nuclei.length&&mode!==1){for(const value of nuclei){const n=rec(value,407n),nk=rec(f(n,1n),404n),option=rec(f(nk,1n),395n),face=await draw('reason-face',[binding('actor',CHARACTER),binding('action',f(option,2n)),binding('ground',f(nk,3n))],uint(f(n,4n))),standing=f(n,5n),situation=f(n,6n);if(typeof standing==='boolean'||standing.kind!=='signed'||typeof situation==='boolean'||situation.kind!=='signed')throw Error('AFFECT_MODIFIER');scores.set(key(option),(uint(f(nk,4n))===1n?1n:-1n)*(face+1n+standing.value+situation.value));}
  const top=[...scores.values()].reduce((a,b)=>a>b?a:b),leaders=OPTIONS.filter(o=>scores.get(key(o))===top).sort((a,b)=>key(a)<key(b)?-1:1);chosen=leaders[0];if(leaders.length===2)chosen=leaders[Number(await draw('tie',[binding('actor',CHARACTER)],2n))];
 }
 const fields=new Map<bigint,CanonicalValue>([[1n,occurrence],[2n,signed(at)],[3n,reasons],[4n,list(analysis.probabilities.map(p=>old(421,[p.key,qValue(p.probability)])))],[5n,u(mode)],[6n,list(draws)],[7n,map(OPTIONS.map(o=>[o,signed(scores.get(key(o))!)]))]]);if(chosen)fields.set(8n,chosen);return r(757,fields);
}
export function affectExpression(intent:CanonicalValue,occurrence:CanonicalValue){const decision=rec(f(rec(intent,758n),2n),757n),chosen=decision.fields.get(8n);return r(759,[occurrence,intent,list(chosen?OPTIONS.map(option=>qValue(choiceAlignment(chosen,new Map(OPTIONS.map(o=>[key(o),key(o)===key(option)?ONE:ZERO]))))):[])]);}
