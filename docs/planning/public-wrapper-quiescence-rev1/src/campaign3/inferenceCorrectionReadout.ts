/** inference-correction-experiment/0.1-candidate: diagnostic of public evidence only.
 * No new character state, majority decision rule, truth accessor or mutation. */
import {type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {decodeAgency} from './agencyCodecs';
import {OBSERVERS,localEpisode} from './agencyModel';
export function inferenceCorrectionReadout(publicView:Uint8Array,observer:number,episode:number) {
 if(![0,1].includes(observer)||!Number.isInteger(episode)||episode<1||episode>8)throw Error('CORRECTION_READOUT_SCOPE');
 const result:{at:bigint;numerator:bigint|null;denominator:bigint|null;diagnostic:string}[]=[];
 for(const v of items(decodeAgency(publicView),'list')){
  if(typeof v==='boolean')throw Error('CORRECTION_NOT_PUBLIC_VIEW');
  if(v.kind==='record'){
   if(![975n,976n,982n].includes(v.schema.typeId)||key(f(v,2n))!==key(OBSERVERS[observer]))throw Error('CORRECTION_NOT_PUBLIC_VIEW');
   continue;
  }
  if(v.kind!=='list'||v.items.length!==4)throw Error('CORRECTION_NOT_PUBLIC_VIEW');
  const [tag,at,holder,knowledge]=v.items;
  if(typeof tag==='boolean'||tag.kind!=='text'||tag.value!=='agency-belief'||typeof at==='boolean'||at.kind!=='signed'||key(holder)!==key(OBSERVERS[observer]))throw Error('CORRECTION_NOT_PUBLIC_VIEW');
  const belief=items(f(rec(knowledge,979n),1n),'list').find(b=>key(f(rec(b,978n),1n))===key(localEpisode(observer,episode)));
  if(!belief){result.push({at:at.value,numerator:null,denominator:null,diagnostic:'Unknown'});continue;}
  const n=uint(f(rec(belief,978n),2n)),d=uint(f(rec(belief,978n),3n));
  if(d===0n||n>d)throw Error('CORRECTION_BELIEF_DOMAIN');
  result.push({at:at.value,numerator:n,denominator:d,diagnostic:2n*n===d?'Mixed':2n*n>d?'SupportsObstruction':'SupportsAbsence'});
 }
 return result;
}
