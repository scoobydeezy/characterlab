/** M175 ccdbdb15: current rich perceived sources, no authored memory. */
import {fixture as base,items,decode,enc,list,text,signed,u,key,type CanonicalValue} from './assembledFamiliarity';
import {prior} from './assembledSocialWitness';
import {currentMemory} from './assembledMemoryFinal';
import {SOCIAL,SOCIAL_SOURCE} from '../../assembled/social';
import {sid} from '../../assembled/skill';
import {dataUnsigned as uint} from '../../campaign2/canonicalData';
export type Mode='main'|'hidden'|'recency'|'older'|'tie';
export const signedValue=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('M175 expected signed time');return v.value;};
let cached:ReturnType<typeof base>|undefined,recognized:ReturnType<typeof prior>|undefined;
export function fixture(mode:Mode='main',k=2){
 const b=currentMemory(structuredClone(cached??(cached=base()))),normal=recognized??(recognized=prior()),slots=[...items(decode(b.s.registry),'list')],ret=[...items(slots[8],'list')];
 const association=items(items(slots[29],'list')[2],'list');if(uint(association[4])!==30n||uint(association[5])!==870n)throw Error('M175 graph capacity changed');
 const main=mode==='main'||mode==='hidden',delay=main?8:mode==='tie'?3:5;
 ret[2]=u(32);ret[3]=u(delay);ret[5]=u(32);slots[8]=list(ret);
 slots[9]=list([items(slots[9],'list')[0],u(k),text('PresentationFrequency')]);
 const people=items(slots[19],'list');slots[19]=list([people[0],list(items(people[1],'list').map(v=>list([items(v,'list')[0],list([])])))]);
 const schedule=main?[[1,5,0],[2,5,0],[3,5,0],[4,5,0],[5,1,3],[6,2,4],[7,3,3],[8,4,4]]:mode==='tie'?[[3,1,3],[5,5,0],[7,2,4]]:[[1,5,0],[3,1,3],[mode==='older'?4:5,2,4]];
 const template=items(items(decode(normal.d.orderedInputs),'list').find(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE))!,'list');
 const rows=schedule.map(([at,receipt,outcome],i)=>{
  const p=[...items(template[3],'list')];p[1]=list([text(SOCIAL),mode!=='hidden',u(1),u(outcome),u(receipt),true,true]);
  p[3]=list([i>0,false,false,false]);p[7]=list([u(1),u(1),list([])]);
  p[8]=list([false,u(0),false,false,false,true,true]);p[9]=list([false,u(0),true,u(0)]);p[10]=list([list([false,false,false]),list([false,false,false]),list([false,false,false])]);
  return list([signed(at),...template.slice(1,3),list(p),template[4]]);
 });
 if(main){
  const frame=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list')).filter(a=>key(a[0])===key(signed(4))&&(key(a[1])===key(u(30))||key(a[2])===key(sid(1001,'event/deliberation-opportunity'))));
  if(!frame.some(a=>key(a[2])===key(sid(1001,'event/deliberation-opportunity'))))throw Error('M175 missing current complete frame');
  rows.push(...frame.map(a=>list([signed(9),...a.slice(1)])));
 }
 return {s:{...b.s,registry:enc(list(slots))},d:{...b.d,runSeed:new Uint8Array(32),orderedInputs:enc(list(rows))}};
}
export {decode,enc,items,key,uint};
