/** interference-expectation-component/0.1-candidate; consumer of own public agency evidence. */
import {canonicalEncode,text} from '../substrate/canonicalEncoding';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {decodeAgency} from './agencyCodecs';
import {OBSERVERS} from './agencyModel';
import {ExactRational as Q} from '../substrate/exactMath';
import {compareAffectFactors} from './affectFactorComparison';
export const VERSION='interference-expectation-component/0.1-candidate';
export const LAWS=['AcrossEpisodeMean','LatestEpisode','EpisodeOnly','NoLearning'] as const;
export type Law=typeof LAWS[number];
export interface Frame {view:Uint8Array;context:'A'|'B'|null;goal:0|1;}
type Episode={key:string;context:Frame['context'];order:number;support:{source:string;positive:boolean}[]};
const copy=<T>(x:T):T=>structuredClone(x),str=(q:Q)=>`${q.numerator}/${q.denominator}`;
function observations(view:Uint8Array){const out:{episode:string;kind:number;source:string;positive:boolean;id:string}[]=[];for(const v of items(decodeAgency(view),'list')){if(typeof v==='boolean')throw Error('IE_VIEW');if(v.kind==='list'){if(v.items.length!==4||key(v.items[2])!==key(OBSERVERS[0]))throw Error('IE_HOLDER');continue;}if(v.kind!=='record'||![975n,976n,982n].includes(v.schema.typeId)||key(f(v,2n))!==key(OBSERVERS[0]))throw Error('IE_HOLDER');if(v.schema.typeId===975n)out.push({episode:key(f(v,4n)),kind:Number(uint(f(v,5n))),source:key(f(v,7n)),positive:f(v,6n)===true,id:key(f(v,1n))});}return out;}
export function createInterferenceExpectationRun(law:Law,frames:readonly Frame[]){
 if(!LAWS.includes(law)||!Array.isArray(frames)||Object.getPrototypeOf(frames)!==Array.prototype||frames.length!==8||Reflect.ownKeys(frames).length!==9||Object.values(Object.getOwnPropertyDescriptors(frames)).some(d=>!('value'in d)))throw Error('IE_INPUT');
 for(const x of frames){if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('IE_DATA');const ds=Object.getOwnPropertyDescriptors(x);if(Reflect.ownKeys(ds).length!==3||['view','context','goal'].some(k=>!ds[k]||!('value'in ds[k])))throw Error('IE_DATA');if(!(x.view instanceof Uint8Array)||!['A','B',null].includes(x.context)||![0,1].includes(x.goal))throw Error('IE_INPUT');observations(x.view);}
 const originals=frames.map(x=>({...x,view:x.view.slice()}));let prefix=0,busy=false,episodes:Episode[]=[],seen:string[]=[];
 let rows:{at:number;context:Frame['context'];goal:number;eligible:number;expectation:string|null;affect:string[]|null}[]=[];
 const snapshot=()=>copy({prefix,episodes,seen,rows}),save=()=>canonicalEncode(text(JSON.stringify({version:VERSION,law,originals:originals.map(x=>({...x,view:Array.from(x.view)})),state:snapshot()})));
 return Object.freeze({snapshot,observerView:snapshot,save,async step(fault?:'after-evidence'|'before-commit'){
  if(busy)throw Error('IE_CONCURRENT');if(prefix===8)return false;busy=true;
  try{const x=originals[prefix],eligible=x.context===null?[]:episodes.filter(e=>e.context===x.context&&e.support.length),values=eligible.map(e=>Q.of(BigInt(e.support.filter(s=>s.positive).length),BigInt(e.support.length)));
   const estimate=!values.length||law==='EpisodeOnly'||law==='NoLearning'?undefined:law==='LatestEpisode'?values.at(-1)!:values.reduce((a,b)=>a.add(b),Q.of(0n)).divide(Q.of(BigInt(values.length)));
   const affect=compareAffectFactors({likelihood:estimate,severity:Q.of(BigInt(x.goal)),vulnerability:Q.of(1n),control:Q.of(0n)},'SplitExposure');
   const next=copy(episodes),nextSeen=[...seen];for(const o of observations(x.view)){if(nextSeen.includes(o.id))continue;nextSeen.push(o.id);let episode=next.find(e=>e.key===o.episode);if(o.kind===1&&!episode){episode={key:o.episode,context:x.context,order:next.length,support:[]};next.push(episode);}if(o.kind!==1&&episode&&law!=='NoLearning'&&!episode.support.some(s=>s.source===o.source))episode.support.push({source:o.source,positive:o.positive});}
   if(fault==='after-evidence')throw Error('IE_INJECTED');await Promise.resolve();const nextRows=[...rows,{at:prefix+1,context:x.context,goal:x.goal,eligible:eligible.length,expectation:estimate?str(estimate):null,affect:affect.status==='Known'?affect.coordinates.map(str):null}];if(fault==='before-commit')throw Error('IE_INJECTED');episodes=next;seen=nextSeen;rows=nextRows;prefix++;return true;
  }finally{busy=false;}
 }});
}
export async function restoreInterferenceExpectationRun(law:Law,frames:readonly Frame[],prefix:number,saved:Uint8Array){if(!Number.isInteger(prefix)||prefix<0||prefix>8||!(saved instanceof Uint8Array))throw Error('IE_RESTORE');const expected=saved.slice(),r=createInterferenceExpectationRun(law,frames);for(let i=0;i<prefix;i++)await r.step();const actual=r.save();if(actual.length!==expected.length||actual.some((b,i)=>b!==expected[i]))throw Error('IE_SAVE_MISMATCH');return r;}
