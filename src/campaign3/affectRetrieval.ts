/** affect-retrieval-component/0.1-candidate; actual factor/rank/publication components. */
import {canonicalEncode,text} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {compareAffectFactors} from './affectFactorComparison';
import {prepareEventRecollections,publishRecollections,takeEventPresentation} from './recollectionProduction';
export const VERSION='affect-retrieval-component/0.1-candidate';
export const LAWS=['UncontrolledGain','NoFeedback','ExposureGain','HalfGain'] as const;
export type Law=typeof LAWS[number];
export interface Frame {at:number;display:boolean;truth:boolean;report:number|null;reportVisible:boolean;severity:number|null;vulnerability:number|null;control:number|null;contextVisible:boolean;cue:boolean;graph:boolean;}
export type Carry={at:number;status:'Known'|'Unavailable';exposure:string|null;uncontrolled:string|null};
const clone=<T>(v:T):T=>structuredClone(v),str=(q:Q)=>`${q.numerator}/${q.denominator}`,parse=(s:string)=>{const [n,d]=s.split('/').map(BigInt);return Q.of(n,d);};
export function affectRetrievalGain(carry:Carry|null,at:number,law:Law){
 if(!LAWS.includes(law)||!Number.isInteger(at)||at<1)throw Error('AR_GAIN');
 if(carry&&carry.at>=at)throw Error('AR_PRIOR_ONLY');
 if(!carry||carry.status==='Unavailable'||law==='NoFeedback')return Q.of(1n);
 const q=parse((law==='ExposureGain'?carry.exposure:carry.uncontrolled)!);if(q.compare(Q.of(0n))<0||q.compare(Q.of(1n))>0)throw Error('AR_AFFECT_DOMAIN');
 return Q.of(1n).add(law==='HalfGain'?q.divide(Q.of(2n)):q);
}
function validate(xs:readonly Frame[]){
 if(!Array.isArray(xs)||Object.getPrototypeOf(xs)!==Array.prototype||xs.length!==4||Reflect.ownKeys(xs).length!==5||Object.values(Object.getOwnPropertyDescriptors(xs)).some(d=>!('value'in d)))throw Error('AR_FRAMES');
 const keys=['at','display','truth','report','reportVisible','severity','vulnerability','control','contextVisible','cue','graph'];
 for(const [i,x] of xs.entries()){
  if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('AR_DATA');const ds=Object.getOwnPropertyDescriptors(x);if(Reflect.ownKeys(ds).length!==keys.length||keys.some(k=>!ds[k]||!('value'in ds[k])))throw Error('AR_DATA');
  if(x.at!==i+1||[x.report,x.severity,x.vulnerability,x.control].some(v=>![null,0,500,1000].includes(v))||[x.display,x.truth,x.reportVisible,x.contextVisible,x.cue,x.graph].some(v=>typeof v!=='boolean'))throw Error('AR_DOMAIN');
 }
}
export function createAffectRetrievalRun(law:Law,frames:readonly Frame[]){
 if(!LAWS.includes(law))throw Error('AR_LAW');validate(frames);const originals=clone(frames);
 let prefix=0,belief:number|null=null,affect:Carry|null=null,busy=false;
 let memory:{id:number;at:number;display:boolean}[]=[],history:{id:number;times:number[]}[]=[];
 let rows:{at:number;priorAffect:Carry|null;gain:string;beliefBefore:number|null;beliefAfter:number|null;affectAfter:Carry|null;memoryBefore:typeof memory;historyBefore:typeof history;selected:number|null;detail:boolean|null;scores:{id:number;base:string;pull:string;score:string}[]}[]=[];
 const snapshot=()=>clone({prefix,belief,affect,memory,history,rows}),save=()=>canonicalEncode(text(JSON.stringify({version:VERSION,law,originals,state:snapshot()})));
 return Object.freeze({snapshot,save,observerView:snapshot,
  async step(fault?:'after-publication'|'before-commit'){
   if(busy)throw Error('AR_CONCURRENT');if(prefix===4)return false;busy=true;
   try{
    const x=originals[prefix],gain=affectRetrievalGain(affect,x.at,law),key=(s:string)=>text('affect-retrieval/'+s);
    const cue=x.at===1||!x.cue?{kind:'Absent' as const}:{kind:'Present' as const,key:key(x.at===2?'a':x.at===3?'b':'q')};
    const prepared=prepareEventRecollections({observer:'observer/affect-retrieval',character:'character/affect-retrieval'},cue,BigInt(x.at),{beta:Q.of(1n,2n),scale:1000n,lambda:Q.of(1n),exponent:1,omegaB:Q.of(1n),omegaA:gain,k:1},()=>({memory:memory.map(e=>({id:BigInt(e.id),acquiredAt:BigInt(e.at),units:[{key:key(e.id===1?'a':'b'),views:[new TextEncoder().encode(JSON.stringify({display:e.display}))]}]})),graph:x.graph?{keys:[key('a'),key('q')],weights:[[Q.of(0n),Q.of(1n,4n)],[Q.of(0n),Q.of(0n)]]}:{keys:[],weights:[]},presentations:new Map(history.map(h=>[BigInt(h.id),h.times.map(BigInt)]))}));
    const publication=publishRecollections(prepared.view,()=>BigInt(x.at*10+1)),batch=takeEventPresentation(publication),winner=publication.recollections[0];
    if(fault==='after-publication')throw Error('AR_INJECTED');await Promise.resolve();
    const nextMemory=clone(memory),nextHistory=clone(history);
    for(const p of batch.presentations)nextHistory.find(h=>h.id===Number(p.acquisition))!.times.push(x.at);
    if(x.at<=2){nextMemory.push({id:x.at,at:x.at,display:x.display});nextHistory.push({id:x.at,times:[]});}
    let nextAffect=clone(affect);
    if(x.at>=3){const q=(v:number|null)=>v===null?undefined:Q.of(BigInt(v),1000n);const result=compareAffectFactors({likelihood:q(belief),severity:x.contextVisible?q(x.severity):undefined,vulnerability:x.contextVisible?q(x.vulnerability):undefined,control:x.contextVisible?q(x.control):undefined},'SplitExposure');nextAffect=result.status==='Known'?{at:x.at,status:'Known',exposure:str(result.coordinates[0]),uncontrolled:str(result.coordinates[1])}:{at:x.at,status:'Unavailable',exposure:null,uncontrolled:null};}
    const nextBelief=x.reportVisible&&x.report!==null?x.report:belief,scores=prepared.evaluation.scores.map(s=>({id:Number(s.acquisition),base:str(s.base),pull:str(s.pull),score:str(s.score)}));
    const nextRows=[...rows,{at:x.at,priorAffect:clone(affect),gain:str(gain),beliefBefore:belief,beliefAfter:nextBelief,affectAfter:nextAffect,memoryBefore:clone(memory),historyBefore:clone(history),selected:winner?Number(winner.content.winner.id):null,detail:winner?JSON.parse(new TextDecoder().decode(winner.content.winner.units[0].views[0])).display as boolean:null,scores}];
    if(fault==='before-commit')throw Error('AR_INJECTED');memory=nextMemory;history=nextHistory;belief=nextBelief;affect=nextAffect;rows=nextRows;prefix++;return true;
   }finally{busy=false;}
  }
 });
}
export async function restoreAffectRetrievalRun(law:Law,frames:readonly Frame[],prefix:number,saved:Uint8Array){
 if(!Number.isInteger(prefix)||prefix<0||prefix>4||!(saved instanceof Uint8Array))throw Error('AR_RESTORE');const copy=saved.slice(),run=createAffectRetrievalRun(law,frames);for(let i=0;i<prefix;i++)await run.step();const actual=run.save();if(actual.length!==copy.length||actual.some((v,i)=>v!==copy[i]))throw Error('AR_SAVE_MISMATCH');return run;
}
