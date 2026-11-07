/** M62: full current composition; physical tasks, reserve30/rate10, no sensing/choice.
 * Perceived coat stand-in; no authored memory/affect; original law selectors fixed.
 * Only replay parameters are recall delay1, K and empty fixed association apparatus.
 */
import {list,text,unsigned as u,signed,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {fixture as current} from '../assembledActionMemory.test';
import {learnedData} from './assembledLearnedDisclosure';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {RETENTION} from '../../assembled/retention';
import {RETRIEVAL} from '../../assembled/retrieval';
import {AFFECT_MEMORY} from '../../assembled/affectMemory';
import {decode,enc} from './assembledSpatialMeaning';
import {dataItems as items,dataKey as key,dataUnsigned as uint} from '../../campaign2/canonicalData';
import {signedValue} from './assembledComparison';
export type Mode='main'|'omitted'|'hidden'|'tie';
let cached:ReturnType<typeof current>|undefined;
export function fixture(mode:Mode='main',k=1){
 const b=structuredClone(cached??(cached=current())),slots=[...items(decode(b.s.registry),'list')];
 const original=slots.map(key),ret=items(slots[8],'list'),affect=items(slots[29],'list');
 slots[8]=list([text(RETENTION),ret[1],ret[2],u(1)]);
 slots[9]=list([text(RETRIEVAL),u(k)]);
 slots[29]=list([text(AFFECT_MEMORY),affect[1],list([])]);
 if(slots.length!==44||original.some((v,i)=>![8,9,29].includes(i)&&v!==key(slots[i])))throw Error('M62 reference composition changed');
 const schedule=mode==='tie'?[[2,1,3],[5,1,3],[6,2,4],[7,3,0]]:[[1,1,3],[2,2,4],[3,3,0],[5,3,0]];
 const data=learnedData(0,schedule.map(([at],i)=>({at,signals:[['appearance/coat',true]],continuity:i>0,participant:false})),[]);
 const rows=items(decode(data.orderedInputs),'list').filter(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE)).map(v=>{
  const r=[...items(v,'list')],at=Number(signedValue(r[0])),entry=schedule.find(x=>x[0]===at)!;
  const payload=[...items(r[3],'list')],obs=[...items(payload[1],'list')];
  obs[1]=mode!=='hidden';obs[2]=u(1);obs[3]=u(entry[2]);obs[4]=u(entry[1]);obs[5]=!(mode==='omitted'&&at===3);payload[1]=list(obs);
  // Current source's observed role, absent support/loss/evaluation channels.
  payload.push(list([u(1),u(1)]),list([false,u(0),false,false,false,true,true]),list([false,u(0),true,u(0)]),list([list([false,false,false]),list([false,false,false]),list([false,false,false])]));
  r[3]=list(payload);return list(r);
 });
 return {s:{...b.s,registry:enc(list(slots))},d:{...b.d,runSeed:new Uint8Array(32),orderedInputs:enc(list(rows))}};
}
export {decode,enc,items,key,uint,signedValue};
