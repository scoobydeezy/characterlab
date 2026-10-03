/** interoceptive-uncertainty-component/0.1-candidate; controlled source, no native admission. */
import {biologicalChoice} from './biologicalChoice';
import {canonicalEncode,text} from '../substrate/canonicalEncoding';
export const VERSION='interoceptive-uncertainty-component/0.1-candidate';
export const LAWS=['UpperRisk','MidpointRisk','LowerRisk','PointBelief','NoLearning'] as const;
export type Law=typeof LAWS[number];
export type Interval={lower:number;upper:number};
export interface Frame {at:number;actual:number;bias:number;width:number;available:boolean;}
const clone=<T>(v:T):T=>structuredClone(v);
export function projectReserveEvidence(actual:number,bias:number,width:number,available:boolean):Interval|null{
 if(!available)return null;
 const sensed=Math.min(1000,Math.max(0,actual+bias));if(width===0)return {lower:sensed,upper:sensed};
 const center=500+width*Math.floor((sensed-500+width/2)/width);
 return {lower:Math.max(0,center-width/2),upper:Math.min(1000,center+width/2)};
}
export function updateIntervalBelief(prior:Interval|null,evidence:Interval|null,law:Law):Interval|null{
 if(!evidence||law==='NoLearning')return clone(prior);
 const middle=(evidence.lower+evidence.upper)/2;return law==='PointBelief'?{lower:middle,upper:middle}:clone(evidence);
}
export function deficitGround(belief:Interval|null,law:Law){
 if(!belief)return 0;
 const level=law==='MidpointRisk'?(belief.lower+belief.upper)/2:law==='LowerRisk'?belief.upper:belief.lower;
 return Math.min(1000,2*Math.max(0,600-level));
}
function validate(xs:readonly Frame[]){
 if(!Array.isArray(xs)||Object.getPrototypeOf(xs)!==Array.prototype||xs.length!==4||Reflect.ownKeys(xs).length!==5||Object.values(Object.getOwnPropertyDescriptors(xs)).some(d=>!('value'in d)))throw Error('UNC_FRAMES');
 const keys=['at','actual','bias','width','available'];
 for(const [i,x] of xs.entries()){
  if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('UNC_DATA');const ds=Object.getOwnPropertyDescriptors(x);
  if(Reflect.ownKeys(ds).length!==keys.length||keys.some(k=>!ds[k]||!('value'in ds[k])))throw Error('UNC_DATA');
  if(x.at!==i+1||!Number.isInteger(x.actual)||x.actual<0||x.actual>1000||!Number.isInteger(x.bias)||Math.abs(x.bias)>1000||![0,200,600].includes(x.width)||typeof x.available!=='boolean')throw Error('UNC_DOMAIN');
  if(i>0&&x.actual!==xs[0].actual)throw Error('UNC_STATIC_TARGET');
 }
}
export function createUncertaintyRun(law:Law,frames:readonly Frame[],seed=7){
 if(!LAWS.includes(law)||!Number.isInteger(seed)||seed<0||seed>255)throw Error('UNC_PROFILE');validate(frames);const originals=clone(frames);
 let prefix=0,belief:Interval|null=null,busy=false;
 let rows:{at:number;prior:Interval|null;observation:Interval|null;after:Interval|null;strength:number;choice:Awaited<ReturnType<typeof biologicalChoice>>}[]=[];
 const snapshot=()=>clone({prefix,belief,rows});
 const save=()=>canonicalEncode(text(JSON.stringify({version:VERSION,law,originals,seed,state:snapshot()})));
 return Object.freeze({snapshot,save,observerView:()=>snapshot(),
  async step(fault?:'after-choice'|'before-commit'){
   if(busy)throw Error('UNC_CONCURRENT');if(prefix===4)return false;busy=true;
   try{
    const input=originals[prefix],strength=deficitGround(belief,law);
    const choice=await biologicalChoice(['restore','other'],[{option:'restore',domain:'reserve-uncertainty',strength},{option:'other',domain:'other-task',strength:500}],input.at,seed);
    if(fault==='after-choice')throw Error('UNC_INJECTED');
    const observation=projectReserveEvidence(input.actual,input.bias,input.width,input.available),after=updateIntervalBelief(belief,observation,law);
    const next=[...rows,{at:input.at,prior:clone(belief),observation,after:clone(after),strength,choice}];
    if(fault==='before-commit')throw Error('UNC_INJECTED');
    rows=next;belief=after;prefix++;return true;
   }finally{busy=false;}
  }
 });
}
export async function restoreUncertaintyRun(law:Law,frames:readonly Frame[],seed:number,prefix:number,saved:Uint8Array){
 if(!Number.isInteger(prefix)||prefix<0||prefix>4||!(saved instanceof Uint8Array))throw Error('UNC_RESTORE');
 const copy=saved.slice(),run=createUncertaintyRun(law,frames,seed);for(let i=0;i<prefix;i++)await run.step();
 const actual=run.save();if(actual.length!==copy.length||actual.some((v,i)=>v!==copy[i]))throw Error('UNC_SAVE_MISMATCH');return run;
}
