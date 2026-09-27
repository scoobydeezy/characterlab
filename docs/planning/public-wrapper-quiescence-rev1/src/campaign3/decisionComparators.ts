/** DECISION component controls. Research results are not canonical decisions.
 * See DECISION_COMPARATOR_PREFLIGHT.md; no public qualification is implied. */
import {list,typedIdentifier,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {cognitiveRecord as r} from '../campaign2/cognitiveCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ZERO,ONE,absolute,expectation,convolve,readDistribution,analyzeOptions} from '../campaign2/cognitiveMath';
import {createCognitiveRandomSession,arbitrationOutput} from '../campaign2/cognitiveArbitration';
import {chosenData,intentOutput,expressionOutput,planOutput,attemptOutput,executionOutput} from '../campaign2/cognitiveChoice';
import {ExactRational as Q} from '../substrate/exactMath';
export const DECISION_LAWS=['Baseline','AlwaysRoll','NeverRoll','DecorativeDice','OpaqueWeightedChoice','IntentEqualsOutcome'] as const;
export type DecisionLaw=typeof DECISION_LAWS[number];
const occ=(n:number)=>typedIdentifier(n,u(1));
const sint=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('signed modifier required');return v.value;};
export async function decisionComparison(context:CanonicalValue,seed:Uint8Array,law:DecisionLaw,permitted:boolean){
 const nuclei=items(f(rec(context,408n),3n),'list'),raw=rec(f(rec(context,408n),2n),403n),options=items(f(rec(f(raw,2n),398n),3n),'list').map(v=>f(rec(v,397n),1n));
 const analytical=analyzeOptions(options.map(candidate=>{let distribution=new Map([[0n,ONE]]),reasonMass=ZERO;for(const value of nuclei){const n=rec(value,407n);if(key(f(rec(f(n,1n),404n),1n))!==key(candidate))continue;const d=readDistribution(f(n,7n));distribution=convolve(distribution,d);reasonMass=reasonMass.add(absolute(expectation(d)));}return {key:candidate,distribution,reasonMass};}),Q.of(1n,2n),Q.of(3n,4n));
 const session=createCognitiveRandomSession(seed);session.begin();const draws=session.forResolution(occ(1135),context);
 let chosen=analytical.ranked[0].key,mode=analytical.mode,transcript:CanonicalValue[]=[],resolution:CanonicalValue|undefined;
 try{
  if(law==='Baseline'||law==='IntentEqualsOutcome'){
   resolution=await arbitrationOutput(occ(1135),1n,context,r(440,[q(1,2),q(3,4)]),draws);const data=chosenData(resolution);chosen=f(data,1n);transcript=items(f(data,9n),'list').map(v=>f(rec(v,422n),5n));
   const tie=rec(f(data,10n),423n);if(uint(f(tie,1n))===2n)transcript.push(f(tie,3n));
  }else if(law==='NeverRoll'){mode='Auto';}
  else if(law==='OpaqueWeightedChoice'){
   if(mode!=='Auto'){
    if(!analytical.probabilities.every(p=>p.probability.equals(Q.of(1n,2n))))throw Error('opaque control admits only exactly balanced unresolved fixtures');
    const leaders=[...options].sort((a,b)=>key(a)<key(b)?-1:1),draw=await draws.tie(leaders);transcript.push(draw);chosen=leaders[Number(uint(f(rec(draw,411n),3n)))];
   }
  }else if(mode!=='Auto'||law==='AlwaysRoll'){
   if(mode==='Auto')mode='QuietRoll';
   const scores=new Map(options.map(o=>[key(o),0n]));
   for(const value of nuclei){const n=rec(value,407n),nk=rec(f(n,1n),404n),draw=await draws.reason(value);transcript.push(draw);const score=(uint(f(nk,4n))===1n?1n:-1n)*(uint(f(rec(draw,411n),3n))+1n+sint(f(n,5n))+sint(f(n,6n)));const k=key(f(nk,1n));scores.set(k,scores.get(k)!+score);}
   const max=[...scores.values()].reduce((a,b)=>a>b?a:b),leaders=options.filter(o=>scores.get(key(o))===max).sort((a,b)=>key(a)<key(b)?-1:1);let rolled=leaders[0];
   if(leaders.length===2){const draw=await draws.tie(leaders);transcript.push(draw);rolled=leaders[Number(uint(f(rec(draw,411n),3n)))];}
   if(law!=='DecorativeDice')chosen=rolled;
  }
  session.prepareCommit();session.commit();
 }finally{session.close();}
 const intent=resolution?intentOutput(occ(1136),resolution):undefined,expression=intent?expressionOutput(occ(1137),intent):undefined;
 const outcome=intent?executionOutput(occ(1141),attemptOutput(occ(1140),planOutput(occ(1139),intent,r(391,[u(1)]))),permitted):undefined;
 return {analytical,mode,chosen:law==='IntentEqualsOutcome'&&!permitted?undefined:chosen,transcript:list(transcript),addresses:session.committedAddressKeys(),intent,expression,outcome};
}
