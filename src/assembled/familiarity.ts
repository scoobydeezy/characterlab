/** Shared episodic appearance variant; familiarity-public/0.1 PartialMax port. */
import {list,text,unsigned as u,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataField as f,dataRecord as rec,dataKey as key,dataIdentity as id,dataUnsigned as uint,dataText as txt,invalidModel} from '../campaign2/canonicalData';
import type {StatePath,AuthoritativeState,StatePatch,ActualReadRecord} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {qValue} from '../campaign2/cognitiveMath';
import {PerceptualFeatureId as Feature,PerceptualFacetId as Facet} from '../semanticBinding/perceptualClassification';
export const APPEARANCE_EPISODE='assembled-appearance-episode/0.1';
export const VIVID='assembled-sensory-recollection/0.1';
export const FAMILIARITY='assembled-familiarity/0.1';
const demand=(ok:boolean,s:string)=>{if(!ok)invalidModel('familiarity '+s);};
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const record=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('familiarity record');return v;};
export const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<0n)throw Error('familiarity time');return v.value;};
function occurrence(v:CanonicalValue,ns:bigint){const x=id(v);demand(x.namespaceId===ns,'source namespace');return uint(x.payload);}
export function isAppearancePath(p:StatePath){const x=p.selectors[0];return p.rootStateTypeId===346n&&p.fieldId===1n&&x?.kind==='mapKey'&&typeof x.key!=='boolean'&&x.key.kind==='list'&&eq(x.key.items[0],text(APPEARANCE_EPISODE));}
export const appearancePath=(C:CanonicalValue,observation:CanonicalValue):StatePath=>({rootStateTypeId:346n,fieldId:1n,selectors:[{kind:'mapKey',key:list([text(APPEARANCE_EPISODE),C,observation])}]});
const optional=(v:CanonicalValue)=>{const a=items(v,'list');demand(a.length<=1&&a.every(x=>typeof x==='boolean'),'optional Boolean');return a;};
export function appearanceEpisode(v:CanonicalValue){const a=items(v,'list');demand([9,10].includes(a.length)&&txt(a[0])===APPEARANCE_EPISODE,'episode shape');occurrence(a[1],1125n);occurrence(a[2],1115n);occurrence(a[3],1106n);demand([1n,2n].includes(uint(a[4])),'category');time(a[5]);a.slice(6,9).forEach(optional);if(a.length===10){const q=items(a[9],'list');demand(q.length===3,'clarity vector');q.forEach((v,i)=>{const x=items(v,'list');demand(x.length<=1&&x.every(v=>[1n,2n].includes(uint(v)))&&(!x.length||optional(a[6+i]).length===1),'clarity requires retained feature');});}return a;}
export function appearancePathCheck(p:StatePath,C:CanonicalValue,v?:CanonicalValue){demand(isAppearancePath(p)&&p.selectors.length===1,'path');const a=items((p.selectors[0] as {key:CanonicalValue}).key,'list');demand(a.length===3&&eq(a[1],C),'holder');occurrence(a[2],1115n);if(v)demand(eq(appearanceEpisode(v)[2],a[2]),'key/source');}
export function fragmentAppearance(v:CanonicalValue){const a=appearanceEpisode(v);return list([...a.slice(0,8),list([]),...(a.length===10?[list([items(a[9],'list')[0],list([]),list([])])]:[])]);}
export function assertFragment(before:CanonicalValue,after:CanonicalValue){appearanceEpisode(after);demand(eq(after,fragmentAppearance(before)),'only peripheral detail and fidelity may be removed');}

/** Uses only the focal classifications of the actual frozen SEM experience. */
export function perceivedAppearance(observation:CanonicalValue,experience:CanonicalValue,focal:CanonicalValue){
 const o=items(observation,'list'),x=rec(experience,227n),bindings=items(f(x,5n),'set');
 demand(o.length===8&&time(o[3])===uint(f(x,3n)),'observation/experience time');
 demand(items(f(x,8n),'set').some(s=>eq(f(record(s),2n),o[0])),'actual observation support');
 demand(bindings.some(b=>eq(f(record(b),4n),focal)),'actual selected focal binding');
 const cs=items(f(x,6n),'set').map(record).filter(c=>focal&&eq(f(c,4n),focal));
 const value=(facet:string)=>{const c=cs.find(c=>txt(id(f(c,5n)).payload)===facet);return c?f(c,6n):undefined;};
 const person=value(Facet.AppearsPersonLike),place=value(Facet.AppearsInteriorSpaceLike);
 const category=person===true&&place!==true?1:place===true&&person!==true?2:0;
 const opt=(v:CanonicalValue|undefined)=>list(typeof v==='boolean'?[v]:[]);
 return list([o[0],f(x,1n),o[3],u(category),opt(value(Facet.AppearsMetallic)),opt(value(Facet.AppearsElongated)),opt(value(Facet.AppearsBlunt))]);
}
export function newAppearance(percept:CanonicalValue,acquisition:bigint,quality?:CanonicalValue){const p=items(percept,'list');const v=list([text(APPEARANCE_EPISODE),typedIdentifier(1125,u(acquisition)),p[0],p[1],p[3],p[2],...p.slice(4),...(quality?[quality]:[])]);appearanceEpisode(v);return v;}
export function deriveFamiliarity(percept:CanonicalValue,episodes:readonly CanonicalValue[]){
 const p=items(percept,'list'),category=uint(p[3]);
 const prior=episodes.map(appearanceEpisode).filter(a=>uint(a[4])===category).sort((a,b)=>time(a[5])<time(b[5])?-1:time(a[5])>time(b[5])?1:occurrence(a[1],1125n)<occurrence(b[1],1125n)?-1:1);
 const rows=prior.map(a=>{let equal=0,unequal=0;for(let i=0;i<2;i++){const old=optional(a[6+i]),now=optional(p[4+i]);if(old.length&&now.length){if(old[0]===now[0])equal++;else unequal++;}}const n=equal+unequal;return {a,equal,unequal,n,score:n?Q.of(BigInt(equal),BigInt(n)):undefined};});
 const known=rows.filter(r=>r.score!==undefined);let status=category===0n?0:prior.length?2:1,maximum:Q|undefined,best:typeof rows=[];
 if(category&&known.length){maximum=known.reduce((q,r)=>r.score!.compare(q)>0?r.score!:q,known[0].score!);best=known.filter(r=>r.score!.equals(maximum!));status=maximum.numerator===0n?3:best.some(r=>r.unequal>0)?5:4;}
 return list([text(FAMILIARITY),p[2],percept,u(status),list(maximum?[qValue(maximum)]:[]),list(best.map(r=>r.a[2])),list(rows.map(r=>list([r.a[2],u(r.equal),u(r.unequal),u(r.n),list(r.score?[qValue(r.score)]:[]),r.a[8]])))]);
}
export function appearanceReads(state:AuthoritativeState,C:CanonicalValue){return state.entries().filter(e=>isAppearancePath(e.path)).map(e=>{appearancePathCheck(e.path,C,e.value);return {accessorId:typedIdentifier(1028,text('accessor/assembled-familiarity')),path:e.path,presence:true,value:e.value,derivedSources:[]} as ActualReadRecord;});}
export function fragmentPatch(reads:readonly ActualReadRecord[],at:bigint):StatePatch{return {operations:reads.flatMap(r=>{const a=appearanceEpisode(r.value!),next=fragmentAppearance(r.value!);return at-time(a[5])>=3n&&!eq(next,r.value!)?[{kind:'set' as const,path:r.path,expected:{presence:true as const,value:r.value!},newValue:next}]:[];})};}
const sensoryFeatures=[Feature.ObservedMetallicSurface,Feature.ObservedElongatedForm,Feature.ObservedBluntForm];
export function retainedClarity(percept:CanonicalValue,packet:CanonicalValue){const p=items(percept,'list'),a=items(packet,'list');demand(a.length===2&&eq(a[0],p[0]),'quality observation binding');const rows=items(a[1],'list').map(v=>items(v,'list'));demand(rows.every(r=>r.length===2&&sensoryFeatures.includes(txt(r[0]) as typeof Feature.ObservedMetallicSurface)&&[1n,2n].includes(uint(r[1])))&&new Set(rows.map(r=>txt(r[0]))).size===rows.length,'safe quality domain');return list(sensoryFeatures.map((name,i)=>{const row=rows.find(r=>txt(r[0])===name);demand(!row||items(p[4+i],'list').length===1,'quality without perceived feature');return list(row?[row[1]]:[]);}));}
export function sensoryRecall(recollection:CanonicalValue,episodes:readonly CanonicalValue[]){const r=items(recollection,'list'),refs=items(r[3],'list'),e=refs.length?episodes.map(appearanceEpisode).find(e=>eq(e[2],refs[0])):undefined;
 const facets=e&&e.length===10?items(e[9],'list').flatMap((q,i)=>items(q,'list').length?[list([text(sensoryFeatures[i]),items(e[6+i],'list')[0],items(q,'list')[0]])]:[]):[];
 const clear=facets.filter(v=>uint(items(v,'list')[2])===2n).length,band=!e?'Unavailable':clear>=2?'Vivid':facets.length>=2?'Weak':facets.length?'Fragmentary':'Empty';
 return list([text(VIVID),r[1],r[3],list(facets),text(band)]);
}
