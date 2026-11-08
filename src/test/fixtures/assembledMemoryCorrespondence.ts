/** M64: observed source mapping, never authored memories or recall outputs. */
import {list,text,unsigned as u,signed} from '../../substrate/canonicalEncoding';
import {fixture as previous} from './assembledMemoryReplay';
import {fixture as current} from '../assembledActionMemory.test';
import {learnedData} from './assembledLearnedDisclosure';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {ACQUISITION_RULES,ACQUISITION_REGISTRY} from '../../assembled/model';
import {decode,enc,items,key,uint,signedValue} from './assembledMemoryReplay';
export type Mode='main'|'hidden'|'recency'|'older'|'tie';
export function fixture(mode:Mode='main',k=2){
 const b=previous('main',k),slots=[...items(decode(b.s.registry),'list')],ret=[...items(slots[8],'list')];
 const main=mode==='main'||mode==='hidden',delay=main?8:mode==='tie'?3:5;
 ret[3]=u(delay);slots[8]=list(ret);
 const schedule=main?[[1,5,0],[2,5,0],[3,5,0],[4,5,0],[5,1,3],[6,2,4],[7,3,3],[8,4,4]]
  :mode==='tie'?[[3,1,3],[5,5,0],[7,2,4]]:[[1,5,0],[3,1,3],[mode==='older'?4:5,2,4]];
 const data=learnedData(0,schedule.map(([at],i)=>({at,signals:[['appearance/coat',true]],continuity:i>0,participant:false})),[]);
 const rows=items(decode(data.orderedInputs),'list').filter(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE)).map(v=>{
  const r=[...items(v,'list')],entry=schedule.find(e=>BigInt(e[0])===signedValue(r[0]))!,p=[...items(r[3],'list')],o=[...items(p[1],'list')];
  o[1]=mode!=='hidden';o[2]=u(1);o[3]=u(entry[2]);o[4]=u(entry[1]);o[5]=true;p[1]=list(o);
  p.push(list([u(1),u(1)]),list([false,u(0),false,false,false,true,true]),list([false,u(0),true,u(0)]),list([list([false,false,false]),list([false,false,false]),list([false,false,false])]));
  r[3]=list(p);return list(r);
 });
 if(main){
  const original=items(decode(current().d.orderedInputs),'list');const opportunity=items(original.find(v=>{
   const event=items(v,'list')[2];return typeof event!=='boolean'&&event.kind==='typedIdentifier'&&key(event.payload)===key(text('event/deliberation-opportunity'));
  })!,'list');rows.push(list([signed(9),...opportunity.slice(1)]));
  const names=['event/assembled-identity-context','event/assembled-self-context','event/assembled-values-context'];
  const contexts=original.map(v=>items(v,'list')).filter(row=>{const event=row[2];return key(row[0])===key(opportunity[0])&&typeof event!=='boolean'&&event.kind==='typedIdentifier'&&names.some(n=>key(text(n))===key(event.payload));});
  if(contexts.length!==3)throw Error('M64 missing original opportunity context bundle');
  for(const row of contexts)rows.push(list([signed(9),...row.slice(1)]));
 }
 return {s:{...b.s,rulesVersion:ACQUISITION_RULES,registrySchemaVersion:ACQUISITION_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {decode,enc,items,key,uint,signedValue};
