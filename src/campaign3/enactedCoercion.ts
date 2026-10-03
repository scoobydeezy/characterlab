/** enacted-coercion-component/0.1-candidate. Controlled demands, not a coercion detector. */
import {biologicalChoice,type Ground} from './biologicalChoice';
import {ACTOR,sid} from './longitudinalModel';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {dataKey as key} from '../campaign2/canonicalData';
import {canonicalEncode as encode,text,signed,typedIdentifier,unsigned as u,rational as q} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {foldIdentityHistory,ONE} from '../campaign2/cognitiveMath';
import {receivingRecord as r} from './receivingCodecs';

export const VERSION='enacted-coercion-component/0.1-candidate';
export const LAWS=['Threshold','Graded','IgnorePressure','NoPressure','NoLearning','Latest'] as const;
export type Law=typeof LAWS[number];
export const TARGET=key(ACTOR);
export const COERCERS=Object.freeze(['a','b'].map(n=>key(semanticReferentFromAuthoredContent(sid(1038,'content/coercion/actor-'+n)))));
export interface Frame {
 at:number; demander:0|1; demand:boolean; penalty:0|250|1000; power:boolean;
 access:boolean; display:null|0|250|1000; permitted:boolean;
}
export interface Evidence {at:number;holder:string;demander:string;cost:number;}
export interface Expression {at:number;actor:string;action:string|null;authorship:string;alignment:string;}
export interface Row {
 at:number;demander:string;prior:Evidence[];anticipatedCost:number|null;pressure:number;
 choice:Awaited<ReturnType<typeof biologicalChoice>>;expression:Expression;
 qualification:{status:string;contribution:string};strength:string;
 executed:string|null;penaltyAttempt:boolean;loss:number;evidence:Evidence|null;
}
interface State {prefix:number;resources:number;evidence:Evidence[];rows:Row[];}
const fields=['at','demander','demand','penalty','power','access','display','permitted'];
const fraction=(x:Q)=>`${x.numerator}/${x.denominator}`;
const read=(s:string)=>{const [n,d]=s.split('/').map(BigInt);return Q.of(n,d);};
function checked(xs:readonly Frame[]){
 if(!Array.isArray(xs)||Object.getPrototypeOf(xs)!==Array.prototype||xs.length!==4||Reflect.ownKeys(xs).length!==5||Object.values(Object.getOwnPropertyDescriptors(xs)).some(d=>!('value'in d)))throw Error('EC_FRAMES');
 for(const [i,x] of xs.entries()){
  if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('EC_DATA');const ds=Object.getOwnPropertyDescriptors(x);
  if(Reflect.ownKeys(ds).length!==fields.length||fields.some(k=>!ds[k]||!('value'in ds[k])))throw Error('EC_DATA');
  if(x.at!==i+1||![0,1].includes(x.demander)||![0,250,1000].includes(x.penalty)||![null,0,250,1000].includes(x.display)||['demand','power','access','permitted'].some(k=>typeof ds[k].value!=='boolean'))throw Error('EC_DOMAIN');
 }
 return structuredClone(xs);
}
/** Only prior admitted observations for this target and demander enter this receiver. */
export function expectation(evidence:readonly Evidence[],demander:string,law:Law):number|null {
 const own=evidence.filter(e=>e.holder===TARGET&&e.demander===demander);
 if(!own.length)return null;
 if(law==='Latest')return own[own.length-1].cost;
 // Deliberately bounded integer receiving operand; raw samples remain available.
 return Math.floor(own.reduce((sum,e)=>sum+e.cost,0)/own.length);
}
function identity(rows:readonly Row[]){
 return fraction(foldIdentityHistory(rows.filter(x=>x.qualification.contribution!=='0/1').map(x=>r(413,[typedIdentifier(1138,u(x.at)),typedIdentifier(1135,u(x.at)),signed(x.at),q(read(x.qualification.contribution).numerator,read(x.qualification.contribution).denominator)])),ONE).strength);
}
export function createCoercionRun(law:Law,frames:readonly Frame[],seed=7){
 if(!LAWS.includes(law)||!Number.isInteger(seed)||seed<0||seed>255)throw Error('EC_PROFILE');
 const originals=checked(frames);let busy=false,state:State={prefix:0,resources:4000,evidence:[],rows:[]};
 const readable=()=>{if(busy)throw Error('EC_BUSY');};
 const snapshot=()=>{readable();return structuredClone(state);};
 const targetView=()=>{readable();return structuredClone({prefix:state.prefix,evidence:state.evidence,rows:state.rows.map(({penaltyAttempt:_p,loss:_l,executed:_x,...row})=>row)});};
 const save=()=>{readable();return encode(text(JSON.stringify({version:VERSION,law,originals,seed,state})));};
 return Object.freeze({snapshot,targetView,save,
  async step(fault?:'after-choice'|'after-consequence'|'before-commit'){
   if(busy)throw Error('EC_CONCURRENT');if(state.prefix===4)return false;busy=true;
   try{
    const x=originals[state.prefix],demander=COERCERS[x.demander];
    const prior=state.evidence.filter(e=>e.holder===TARGET&&e.demander===demander),anticipatedCost=expectation(prior,demander,law);
    const pressure=x.demand&&law!=='NoPressure'?(anticipatedCost??0):0;
    const grounds:Ground[]=[{option:'refuse',domain:'protect-undertaking',strength:750},{option:'comply',domain:'follow-request',strength:250}];
    if(pressure)grounds.push({option:'comply',domain:'avoid-refusal-cost',strength:pressure});
    const choice=await biologicalChoice(x.demand?['refuse','comply']:[],x.demand?grounds:[],x.at,seed);
    const alignment=choice.chosen==='refuse'?Q.of(1n,2n):choice.chosen==='comply'?Q.of(-1n,2n):Q.of(0n);
    // Authorship and task meaning freeze before execution or any new penalty evidence.
    const expression:Expression={at:x.at,actor:TARGET,action:choice.chosen,authorship:choice.authorship,alignment:fraction(alignment)};
    let contribution=read(choice.authorship).multiply(alignment),status='Accepted';
    if(!choice.chosen){status='NoChoice';contribution=Q.of(0n);}
    else if(law==='Graded')contribution=contribution.multiply(Q.of(BigInt(1000-pressure),1000n));
    else if(law!=='IgnorePressure'&&pressure>=500){status='Constrained';contribution=Q.of(0n);}
    if(status==='Accepted'&&contribution.numerator===0n)status='ZeroContribution';
    if(fault==='after-choice')throw Error('EC_INJECTED');
    const executed=x.permitted?choice.chosen:null;
    // External actor's controlled policy acts only on an actually enacted refusal.
    const penaltyAttempt=executed==='refuse',loss=penaltyAttempt&&x.power?x.penalty:0;
    const evidence:Evidence|null=penaltyAttempt&&x.access?{at:x.at,holder:TARGET,demander,cost:x.display??loss}:null;
    if(fault==='after-consequence')throw Error('EC_INJECTED');
    const row:Row={at:x.at,demander,prior:structuredClone(prior),anticipatedCost,pressure,choice,expression,qualification:{status,contribution:fraction(contribution)},strength:'0/1',executed,penaltyAttempt,loss,evidence};
    const rows=[...state.rows,row];row.strength=identity(rows);
    const next:State={prefix:state.prefix+1,resources:state.resources-loss,evidence:evidence&&law!=='NoLearning'?[...state.evidence,evidence]:state.evidence,rows};
    if(fault==='before-commit')throw Error('EC_INJECTED');state=next;return true;
   }finally{busy=false;}
  }
 });
}
export async function restoreCoercionRun(law:Law,frames:readonly Frame[],seed:number,prefix:number,saved:Uint8Array){
 if(!Number.isInteger(prefix)||prefix<0||prefix>4||!(saved instanceof Uint8Array))throw Error('EC_RESTORE');const copy=saved.slice(),run=createCoercionRun(law,frames,seed);
 for(let i=0;i<prefix;i++)await run.step();const actual=run.save();if(actual.length!==copy.length||actual.some((v,i)=>v!==copy[i]))throw Error('EC_SAVE_MISMATCH');return run;
}
