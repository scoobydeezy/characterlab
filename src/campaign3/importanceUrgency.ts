/** importance-urgency-component/0.1-candidate; no public scheduler admission. */
import {biologicalChoice} from './biologicalChoice';
import {canonicalEncode,text} from '../substrate/canonicalEncoding';
export const VERSION='importance-urgency-component/0.1-candidate';
export const LAWS=['Factored','RefoldImportance','ImportanceOnly','UrgencyOnly','FrozenProduct'] as const;
export type Law=typeof LAWS[number];
export interface Frame {at:number;adopt:number|null;adoptionVisible:boolean;urgency:number|null;urgencyVisible:boolean;hiddenUrgency:number;}
type Choice=Awaited<ReturnType<typeof biologicalChoice>>;
type Row={at:number;importance:number|null;urgency:number|null;strength:number;choice:Choice};
const clone=<T>(v:T):T=>structuredClone(v);
const keys=['at','adopt','adoptionVisible','urgency','urgencyVisible','hiddenUrgency'];
export function validateImportanceFrames(xs:readonly Frame[]){
 if(!Array.isArray(xs)||Object.getPrototypeOf(xs)!==Array.prototype||xs.length!==6||Reflect.ownKeys(xs).length!==7||Object.values(Object.getOwnPropertyDescriptors(xs)).some(d=>!('value'in d)))throw Error('IU_FRAMES');
 for(const [i,x] of xs.entries()){
  if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('IU_DATA');
  const ds=Object.getOwnPropertyDescriptors(x);if(Reflect.ownKeys(ds).length!==keys.length||keys.some(k=>!ds[k]||!('value'in ds[k])))throw Error('IU_DATA');
  if(x.at!==i+1||![null,0,500,1000].includes(x.adopt)||![null,0,1000].includes(x.urgency)||![0,1000].includes(x.hiddenUrgency)||typeof x.adoptionVisible!=='boolean'||typeof x.urgencyVisible!=='boolean'||(i>0&&x.adopt!==null))throw Error('IU_DOMAIN');
 }
}
export function createImportanceRun(law:Law,frames:readonly Frame[],seed=7){
 if(!LAWS.includes(law)||!Number.isInteger(seed)||seed<0||seed>255)throw Error('IU_PROFILE');
 validateImportanceFrames(frames);const originals=clone(frames);
 let prefix=0,importance:number|null=null,frozen:number|null=null,history:number[]=[],rows:Row[]=[],busy=false;
 const snapshot=()=>clone({prefix,importance,frozen,history,rows});
 const save=()=>canonicalEncode(text(JSON.stringify({version:VERSION,law,originals,seed,state:snapshot()})));
 return Object.freeze({snapshot,save,observerView:()=>clone({history,rows}),
  async step(fault?:'after-choice'|'before-commit'){
   if(busy)throw Error('IU_CONCURRENT');if(prefix===6)return false;busy=true;
   try{
    const input=originals[prefix],nextHistory=[...history];
    if(input.adoptionVisible&&input.adopt!==null)nextHistory.push(input.adopt);
    const effective=law==='RefoldImportance'?(nextHistory[0]??null):input.adoptionVisible&&input.adopt!==null?input.adopt:importance,u=input.urgencyVisible?input.urgency:null;
    const factored=effective===null||u===null?0:effective*(1000+u)/2000;
    const nextFrozen=frozen??(effective!==null&&u!==null?factored:null);
    const strength=effective===null||u===null?0:law==='ImportanceOnly'?effective/2:law==='UrgencyOnly'?u:law==='FrozenProduct'?nextFrozen!:factored;
    const choice=await biologicalChoice(['respond','other'],[{option:'respond',domain:'importance-task',strength},{option:'other',domain:'other-task',strength:500}],input.at,seed);
    if(fault==='after-choice')throw Error('IU_INJECTED');
    const nextRows=[...rows,{at:input.at,importance:effective,urgency:u,strength,choice}];
    if(fault==='before-commit')throw Error('IU_INJECTED');
    rows=nextRows;history=nextHistory;
    importance=law==='RefoldImportance'?null:effective;frozen=law==='FrozenProduct'?nextFrozen:null;prefix++;return true;
   }finally{busy=false;}
  }
 });
}
/** Prefix count is supplied independently and verified against the complete saved state. */
export async function restoreImportanceRun(law:Law,frames:readonly Frame[],seed:number,prefix:number,saved:Uint8Array){
 if(!Number.isInteger(prefix)||prefix<0||prefix>6||!(saved instanceof Uint8Array))throw Error('IU_RESTORE');
 const copy=saved.slice(),run=createImportanceRun(law,frames,seed);
 for(let i=0;i<prefix;i++)await run.step();const actual=run.save();
 if(actual.length!==copy.length||actual.some((v,i)=>v!==copy[i]))throw Error('IU_SAVE_MISMATCH');return run;
}
