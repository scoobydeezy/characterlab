/** identity-belief/0.1-candidate: composed research component, not native admission. */
import {canonicalEncode as enc,list,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataItems as items,dataUnsigned as uint,dataKey as key} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {decodeReceiving as decode} from './receivingCodecs';
import {data,value} from './biologyPublicData';
import {compareAffectFactors} from './affectFactorComparison';
import {createEligibilityRun,eligibilitySummary,type EligibilityInput} from './identityEligibility';

export const IDENTITY_BELIEF_VERSION='identity-belief/0.1-candidate';
export const IDENTITY_BELIEF_LAWS=['Mean','Latest','NoLearning','StandingAlias','PrivateOracle'] as const;
export type IdentityBeliefLaw=typeof IDENTITY_BELIEF_LAWS[number];
export const HOLDERS=['self','observer-a','observer-b'] as const;
export type Holder=typeof HOLDERS[number];
export type Mode='Actual'|'Opposite'|'Neutral'|'Absent';
export interface IdentityBeliefInput {source:EligibilityInput[];channels:Mode[][];goals:(1|-1)[][];}
export interface IdentityEvidence {holder:Holder;target:'target';proposition:'positive-task-fidelity';ticket:number;polarity:-1|0|1;}
export interface IdentityEstimate {value:string|null;evidence:number;}
const fraction=(x:Q)=>`${x.numerator}/${x.denominator}`;
const parse=(s:string)=>{const [n,d]=s.split('/').map(BigInt);return Q.of(n,d);};
function fields(x:unknown,names:string[]){if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('IDENTITY_BELIEF_FIELDS');const ds=Object.getOwnPropertyDescriptors(x);if(Reflect.ownKeys(ds).length!==names.length||names.some(n=>!ds[n]||!('value'in ds[n])))throw Error('IDENTITY_BELIEF_FIELDS');}
function array(x:unknown,n:number):unknown[]{if(!Array.isArray(x)||x.length!==n||Reflect.ownKeys(x).length!==n+1)throw Error('IDENTITY_BELIEF_ARRAY');return Array.from({length:n},(_,i)=>{const d=Object.getOwnPropertyDescriptor(x,String(i));if(!d||!('value'in d))throw Error('IDENTITY_BELIEF_ARRAY');return d.value;});}
function checked(input:IdentityBeliefInput):IdentityBeliefInput{
 fields(input,['source','channels','goals']);const source=array(input.source,5).map(x=>{fields(x,['setting','significance','pressure','instructed','movement','permitted']);return {...x as EligibilityInput};});
 createEligibilityRun('Threshold',0,source); // Reuse the exact accepted source domain.
 const channels=array(input.channels,5).map(row=>array(row,3).map((x,i)=>{if(!['Actual','Opposite','Neutral','Absent'].includes(x as string)||i===0&&!['Actual','Absent'].includes(x as string))throw Error('IDENTITY_BELIEF_CHANNEL');return x as Mode;}));
 const goals=array(input.goals,5).map(row=>array(row,3).map(x=>{if(x!==1&&x!==-1)throw Error('IDENTITY_BELIEF_GOAL');return x;}));
 return {source,channels,goals};
}
export const identityBeliefInputValue=(x:IdentityBeliefInput)=>data(checked(x));
function evidenceChecked(e:IdentityEvidence,holder:Holder){fields(e,['holder','target','proposition','ticket','polarity']);if(e.holder!==holder||!HOLDERS.includes(holder)||e.target!=='target'||e.proposition!=='positive-task-fidelity'||!Number.isInteger(e.ticket)||e.ticket<1||e.ticket>4||![-1,0,1].includes(e.polarity))throw Error('IDENTITY_BELIEF_EVIDENCE');}
/** Capability boundary: only this holder's safe evidence, never a source row. */
export function learnIdentityBelief(holder:Holder,prior:readonly IdentityEvidence[],e:IdentityEvidence|null,law:IdentityBeliefLaw):IdentityEvidence[]{
 if(!IDENTITY_BELIEF_LAWS.includes(law))throw Error('IDENTITY_BELIEF_LAW');
 let last=0;for(const x of prior){evidenceChecked(x,holder);if(x.ticket<=last)throw Error('IDENTITY_BELIEF_ORDER');last=x.ticket;}
 if(prior.length>4)throw Error('IDENTITY_BELIEF_LIMIT');if(e){evidenceChecked(e,holder);if(e.ticket<=last)throw Error('IDENTITY_BELIEF_DUPLICATE');}
 if(law==='NoLearning')return [];return [...prior,...(e?[e]:[])].map(x=>({...x}));
}
export function estimateIdentityBelief(history:readonly IdentityEvidence[],law:IdentityBeliefLaw):IdentityEstimate{
 const xs=law==='Latest'?history.slice(-1):history;return {value:xs.length?fraction(Q.of(BigInt(xs.reduce((n,e)=>n+e.polarity,0)),BigInt(xs.length))):null,evidence:history.length};
}
/** No biography, target state, source records or evidence are in the consumer input. */
export function identityBeliefAppraisal(estimate:IdentityEstimate,goal:1|-1){
 if(goal!==1&&goal!==-1)throw Error('IDENTITY_BELIEF_GOAL');if(estimate.value===null)return {adverse:null,affect:null};
 const x=parse(estimate.value);if(x.compare(Q.of(-1n))<0||x.compare(Q.of(1n))>0)throw Error('IDENTITY_BELIEF_ESTIMATE');
 const p=Q.of(1n).add(x).divide(Q.of(2n)),adverse=goal===1?Q.of(1n).subtract(p):p;
 const affect=compareAffectFactors({likelihood:adverse,severity:Q.of(1n),vulnerability:Q.of(1n),control:Q.of(0n)},'SplitExposure');
 return {adverse:fraction(adverse),affect:affect.status==='Known'?affect.coordinates.map(fraction):null};
}
/** Source-side projection. It deliberately does not return private history/provenance. */
function projectSource(row:CanonicalValue):-1|1|undefined {const xs=items(row,'list'),qualification=items(xs[3],'list');if(!qualification.length)return undefined;const n=readQ(qualification[4]);return n.numerator===0n?undefined:n.numerator>0n?1:-1;}
function receive(polarity:-1|1|undefined,mode:Mode,holder:Holder,ticket:number):IdentityEvidence|null{
 if(polarity===undefined||mode==='Absent')return null;
 return {holder,target:'target',proposition:'positive-task-fidelity',ticket,polarity:mode==='Neutral'?0:mode==='Opposite'?(polarity===1?-1:1):polarity};
}
type Appraisal=ReturnType<typeof identityBeliefAppraisal>;
const clone=(v:CanonicalValue)=>decode(enc(v));
export function createIdentityBeliefRun(law:IdentityBeliefLaw,seed:number,original:IdentityBeliefInput){
 if(!IDENTITY_BELIEF_LAWS.includes(law)||!Number.isInteger(seed)||seed<0||seed>7)throw Error('IDENTITY_BELIEF_MODEL');
 const input=checked(original),inputValue=data(input);let at=0,busy=false,sourceState:CanonicalValue=createEligibilityRun('Threshold',seed,input.source).snapshot(),histories:IdentityEvidence[][]=HOLDERS.map(()=>[]),log:CanonicalValue[]=[];
 const save=()=>enc(list([text(IDENTITY_BELIEF_VERSION),text(law),u(seed),inputValue,u(at),sourceState,list(histories.map(data)),list(log)]));
 return Object.freeze({
  async step(failBeforeCommit=false){if(busy)throw Error('IDENTITY_BELIEF_CONCURRENT');if(at===5)return false;busy=true;
   try{
    // Staging on a fresh source keeps its private transaction out of our commit.
    const source=createEligibilityRun('Threshold',seed,input.source);for(let i=0;i<=at;i++)await source.step();const nextSource=source.snapshot(),sourceRows=items(items(nextSource,'list')[1],'list'),sourceRow=sourceRows.at(-1)!,polarity=projectSource(sourceRow);
    const observations=HOLDERS.map((holder,i)=>receive(polarity,input.channels[at][i],holder,at+1));
    const next=HOLDERS.map((holder,i)=>learnIdentityBelief(holder,histories[i],observations[i],law));
    const estimates=next.map(h=>estimateIdentityBelief(h,law));
    if(law==='StandingAlias')estimates[0]={value:eligibilitySummary(sourceRow).strength,evidence:items(items(nextSource,'list')[0],'list').length};
    if(law==='PrivateOracle')for(const i of [1,2])estimates[i]={...estimates[0]}; // Explicit rejected boundary control.
    const appraisals=estimates.map((e,i)=>identityBeliefAppraisal(e,input.goals[at][i]));
    const row=list([u(at+1),sourceRow,data(observations),data(estimates),data(input.goals[at]),data(appraisals)]);clone(row);
    if(failBeforeCommit)throw Error('IDENTITY_BELIEF_INJECTED');sourceState=nextSource;histories=next;log=[...log,row];at++;return true;
   }finally{busy=false;}
  },save:()=>save().slice(),snapshot:()=>clone(list([sourceState,list(histories.map(data)),list(log)])),
  observerView(holder:Holder){const i=HOLDERS.indexOf(holder);if(i<0)throw Error('IDENTITY_BELIEF_HOLDER');return enc(list(log.map(v=>{const r=items(v,'list');return list([r[0],data(value<(IdentityEvidence|null)[]>(r[2])[i]),data(value<IdentityEstimate[]>(r[3])[i]),data(value<number[]>(r[4])[i]),data(value<Appraisal[]>(r[5])[i])]);})));},
 });
}
export async function restoreIdentityBeliefRun(law:IdentityBeliefLaw,seed:number,input:IdentityBeliefInput,saved:Uint8Array){
 const copy=saved.slice(),v=items(decode(copy),'list');if(v.length!==8)throw Error('IDENTITY_BELIEF_SAVE');const count=uint(v[4]);if(count>5n)throw Error('IDENTITY_BELIEF_PREFIX');
 const run=createIdentityBeliefRun(law,seed,input);for(let i=0n;i<count;i++)await run.step();if(key(decode(run.save()))!==key(decode(copy)))throw Error('IDENTITY_BELIEF_RESTORE');return run;
}
export function identityBeliefRows(snapshot:CanonicalValue){return items(items(snapshot,'list')[2],'list').map(v=>{const r=items(v,'list');return {at:Number(uint(r[0])),source:eligibilitySummary(r[1]),observations:value<(IdentityEvidence|null)[]>(r[2]),estimates:value<IdentityEstimate[]>(r[3]),goals:value<number[]>(r[4]),appraisals:value<Appraisal[]>(r[5])};});}
