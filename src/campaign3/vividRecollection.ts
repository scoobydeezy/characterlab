/** vivid-recollection-component/0.1-candidate; existing component rank/publication, no native admission. */
import {canonicalEncode,text} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {prepareEventRecollections,publishRecollections,takeEventPresentation} from './recollectionProduction';
export const VERSION='vivid-recollection-component/0.1-candidate';
export const LAWS=['PerceptualFidelity','DetailCount','AccessOnly','KeepRich'] as const;
export type Law=typeof LAWS[number];
export interface Frame {at:number;truth:boolean[];display:boolean[];clarity:number[];visible:boolean;cue:'target'|'other'|'absent';}
type Facet={kind:'visual'|'auditory'|'spatial';value:boolean;clarity:number};
type Imprint={at:number;facets:Facet[]};
const kinds=['visual','auditory','spatial'] as const,clone=<T>(v:T):T=>structuredClone(v);
export function sensoryPresentation(facets:readonly Facet[],published:boolean,law:Law){
 if(!published)return 'Unavailable';if(law==='AccessOnly')return 'Vivid';
 if((law==='DetailCount'?facets.length:facets.filter(f=>f.clarity===2).length)>=2)return 'Vivid';
 return facets.length>=2?'Weak':facets.length?'Fragmentary':'Empty';
}
const calibration={beta:Q.of(1n,2n),scale:1000n,lambda:Q.of(1n),exponent:1,omegaB:Q.of(1n),omegaA:Q.of(1n),k:1};
function array(v:unknown,n:number):asserts v is unknown[]{if(!Array.isArray(v)||Object.getPrototypeOf(v)!==Array.prototype||v.length!==n||Reflect.ownKeys(v).length!==n+1||Object.values(Object.getOwnPropertyDescriptors(v)).some(d=>!('value'in d)))throw Error('VIVID_ARRAY');}
function validate(xs:readonly Frame[]){array(xs,6);const keys=['at','truth','display','clarity','visible','cue'];
 for(const [i,x] of xs.entries()){
  if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('VIVID_DATA');const ds=Object.getOwnPropertyDescriptors(x);if(Reflect.ownKeys(ds).length!==keys.length||keys.some(k=>!ds[k]||!('value'in ds[k])))throw Error('VIVID_DATA');
  array(x.truth,3);array(x.display,3);array(x.clarity,3);
  if(x.at!==i+1||x.truth.some(v=>typeof v!=='boolean')||x.display.some(v=>typeof v!=='boolean')||x.clarity.some(v=>![0,1,2].includes(v))||typeof x.visible!=='boolean'||!['target','other','absent'].includes(x.cue))throw Error('VIVID_DOMAIN');
 }
}
export function createVividRun(law:Law,frames:readonly Frame[]){
 if(!LAWS.includes(law))throw Error('VIVID_LAW');validate(frames);const originals=clone(frames);
 let prefix=0,imprint:Imprint|null=null,presentations:number[]=[],busy=false;
 let rows:{at:number;selected:boolean;facets:Facet[];band:string;acquisition:number|null;occurrence:number|null;historyBefore:number[];rank:string}[]=[];
 const snapshot=()=>clone({prefix,imprint,presentations,rows}),save=()=>canonicalEncode(text(JSON.stringify({version:VERSION,law,originals,state:snapshot()})));
 return Object.freeze({snapshot,save,observerView:snapshot,
  async step(fault?:'after-publication'|'before-commit'){
   if(busy)throw Error('VIVID_CONCURRENT');if(prefix===6)return false;busy=true;
   try{
    const input=originals[prefix],at=BigInt(input.at),cue=input.cue==='absent'?{kind:'Absent' as const}:{kind:'Present' as const,key:text('cue/'+input.cue)};
    const prepared=prepareEventRecollections({observer:'observer/vivid',character:'character/vivid'},cue,at,calibration,()=>({memory:imprint?[{id:1n,acquiredAt:BigInt(imprint.at),units:[{key:text('cue/target'),views:[new TextEncoder().encode(JSON.stringify({kind:'episode',label:1})),...imprint.facets.map(f=>new TextEncoder().encode(JSON.stringify(f)))]}]}]:[],graph:{keys:[],weights:[]},presentations:imprint?new Map([[1n,presentations.map(BigInt)]]):new Map()}));
    const publication=publishRecollections(prepared.view,()=>BigInt(input.at*10+1)),batch=takeEventPresentation(publication),winner=publication.recollections[0];
    const facets:Facet[]=winner?winner.content.winner.units.flatMap(u=>u.views.map(v=>JSON.parse(new TextDecoder().decode(v)))).filter(f=>f.kind!=='episode'):[];
    if(fault==='after-publication')throw Error('VIVID_INJECTED');
    // Yield before committing to exercise overlap while all authoritative state is still prior.
    await Promise.resolve();
    let next=clone(imprint);
    if(input.at===1&&input.visible)next={at:1,facets:kinds.flatMap((kind,i)=>input.clarity[i]?[{kind,value:input.display[i],clarity:input.clarity[i]}]:[])};
    if(next&&law!=='KeepRich'&&input.at-next.at>=3)next.facets=next.facets.filter(f=>f.kind==='visual');
    const nextHistory=[...presentations,...batch.presentations.map(()=>input.at)],rank=JSON.stringify(prepared.evaluation.scores,(_,v)=>typeof v==='bigint'?String(v):v);
    const nextRows=[...rows,{at:input.at,selected:!!winner,facets,band:sensoryPresentation(facets,!!winner,law),acquisition:winner?Number(winner.content.winner.id):null,occurrence:winner?Number(winner.occurrence):null,historyBefore:[...presentations],rank}];
    if(fault==='before-commit')throw Error('VIVID_INJECTED');imprint=next;presentations=nextHistory;rows=nextRows;prefix++;return true;
   }finally{busy=false;}
  }
 });
}
export async function restoreVividRun(law:Law,frames:readonly Frame[],prefix:number,saved:Uint8Array){
 if(!Number.isInteger(prefix)||prefix<0||prefix>6||!(saved instanceof Uint8Array))throw Error('VIVID_RESTORE');const copy=saved.slice(),run=createVividRun(law,frames);for(let i=0;i<prefix;i++)await run.step();const actual=run.save();if(actual.length!==copy.length||actual.some((v,i)=>v!==copy[i]))throw Error('VIVID_SAVE_MISMATCH');return run;
}
