/** latent-cause-component/0.1-candidate: explicit safe diagnostics, two competing explanations. */
import {canonicalEncode,text} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {compareAffectFactors} from './affectFactorComparison';
export const VERSION='latent-cause-component/0.1-candidate';
export const LAWS=['JointDiagnostics','MotionOnly','OutcomeOnly','NoLearning'] as const;
export type Law=typeof LAWS[number];
export interface Frame {at:number;capable:boolean;blocked:boolean;outcome:boolean|null;motion:boolean|null;drag:boolean|null;visible:boolean;episode:number;receipt:number;goal:'ProtectRoute'|'RepairCapability';}
type Evidence={at:number;receipt:number;motion:boolean|null;drag:boolean|null};
const copy=<T>(x:T):T=>structuredClone(x),str=(q:Q)=>`${q.numerator}/${q.denominator}`;
function validate(xs:readonly Frame[]){
 if(!Array.isArray(xs)||Object.getPrototypeOf(xs)!==Array.prototype||xs.length!==6||Reflect.ownKeys(xs).length!==7||Object.values(Object.getOwnPropertyDescriptors(xs)).some(d=>!('value'in d)))throw Error('LC_FRAMES');
 const keys=['at','capable','blocked','outcome','motion','drag','visible','episode','receipt','goal'];
 for(const [i,x] of xs.entries()){if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('LC_DATA');const ds=Object.getOwnPropertyDescriptors(x);if(Reflect.ownKeys(ds).length!==keys.length||keys.some(k=>!ds[k]||!('value'in ds[k])))throw Error('LC_DATA');if(x.at!==i+1||[x.capable,x.blocked,x.visible].some(v=>typeof v!=='boolean')||[x.outcome,x.motion,x.drag].some(v=>v!==null&&typeof v!=='boolean')||![1,2].includes(x.episode)||!Number.isInteger(x.receipt)||x.receipt<1||x.receipt>6||!['ProtectRoute','RepairCapability'].includes(x.goal)||i>0&&x.outcome!==null)throw Error('LC_DOMAIN');}
}
function infer(outcome:boolean|null,evidence:readonly Evidence[],law:Law){
 if(outcome===null)return {status:'Unknown',blockage:null,limitation:null};if(outcome)return {status:'NotFailure',blockage:null,limitation:null};
 let motion:boolean|null=null,drag:boolean|null=null;for(const e of evidence){if(e.motion!==null)motion=e.motion;if(e.drag!==null)drag=e.drag;}
 let odds=Q.of(1n);for(const v of law==='OutcomeOnly'?[]:law==='MotionOnly'?[motion]:[motion,drag])if(v!==null)odds=odds.multiply(v?Q.of(3n):Q.of(1n,3n));
 const b=odds.divide(Q.of(1n).add(odds));return {status:b.compare(Q.of(1n,2n))===0?'Ambiguous':b.compare(Q.of(1n,2n))>0?'Obstruction':'Limitation',blockage:str(b),limitation:str(Q.of(1n).subtract(b))};
}
export function createLatentCauseRun(law:Law,frames:readonly Frame[]){
 if(!LAWS.includes(law))throw Error('LC_LAW');validate(frames);const originals=copy(frames);let prefix=0,outcome:boolean|null=null,busy=false,evidence:Evidence[]=[];
 let observations:{at:number;episode:number;receipt:number;outcome:boolean|null;motion:boolean|null;drag:boolean|null}[]=[],intent:{at:number;action:string}|null=null;
 let rows:{at:number;goal:Frame['goal'];inference:ReturnType<typeof infer>;affect:string[]|null}[]=[];
 const observerView=()=>copy({prefix,intent,outcome,evidence,observations,rows});
 const snapshot=()=>({...observerView(),world:prefix?{at:1,capable:originals[0].capable,blocked:originals[0].blocked,success:originals[0].capable&&!originals[0].blocked}:null});
 const save=()=>canonicalEncode(text(JSON.stringify({version:VERSION,law,originals,state:snapshot()})));
 return Object.freeze({observerView,snapshot,save,async step(fault?:'after-evidence'|'before-commit'){
  if(busy)throw Error('LC_CONCURRENT');if(prefix===6)return false;busy=true;
  try{const x=originals[prefix],judgment=infer(outcome,evidence,law),v=x.goal==='ProtectRoute'?judgment.blockage:judgment.limitation;
   const likelihood=v===null?undefined:Q.of(...v.split('/').map(BigInt) as [bigint,bigint]),a=compareAffectFactors({likelihood,severity:Q.of(1n),vulnerability:Q.of(1n),control:Q.of(0n)},'SplitExposure');
   let nextOutcome=outcome;const nextEvidence=copy(evidence),nextObservations=copy(observations),nextIntent=intent??{at:1,action:'AttemptDelivery'};
   if(x.visible&&(x.outcome!==null||x.motion!==null||x.drag!==null)){nextObservations.push({at:x.at,episode:x.episode,receipt:x.receipt,outcome:x.outcome,motion:x.motion,drag:x.drag});if(law!=='NoLearning'&&x.episode===1){if(x.outcome!==null)nextOutcome=x.outcome;if((x.motion!==null||x.drag!==null)&&!nextEvidence.some(e=>e.receipt===x.receipt))nextEvidence.push({at:x.at,receipt:x.receipt,motion:x.motion,drag:x.drag});}}
   if(fault==='after-evidence')throw Error('LC_INJECTED');await Promise.resolve();
   const nextRows=[...rows,{at:x.at,goal:x.goal,inference:judgment,affect:a.status==='Known'?a.coordinates.map(str):null}];
   if(fault==='before-commit')throw Error('LC_INJECTED');intent=nextIntent;outcome=nextOutcome;evidence=nextEvidence;observations=nextObservations;rows=nextRows;prefix++;return true;
  }finally{busy=false;}
 }});
}
export async function restoreLatentCauseRun(law:Law,frames:readonly Frame[],prefix:number,saved:Uint8Array){if(!Number.isInteger(prefix)||prefix<0||prefix>6||!(saved instanceof Uint8Array))throw Error('LC_RESTORE');const expected=saved.slice(),run=createLatentCauseRun(law,frames);for(let i=0;i<prefix;i++)await run.step();const actual=run.save();if(actual.length!==expected.length||actual.some((b,i)=>b!==expected[i]))throw Error('LC_SAVE_MISMATCH');return run;}
