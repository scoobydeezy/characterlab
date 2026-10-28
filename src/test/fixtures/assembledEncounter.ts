import {list,text,unsigned} from '../../substrate/canonicalEncoding';
import {ENCOUNTER_RULES,ENCOUNTER_REGISTRY} from '../../assembled/model';
import {REL,REL_SOURCE} from '../../assembled/relationship';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {recognitionModelSource,recognitionData,decode,items,key,enc,type CueFrame} from './assembledRecognition';
export const encounterModelSource=()=>({...recognitionModelSource(),rulesVersion:ENCOUNTER_RULES,registrySchemaVersion:ENCOUNTER_REGISTRY});
export type EncounterFrame=CueFrame&{participant?:boolean;ownAccess?:boolean;kind?:number;display?:number};
export function encounterData(participant=true,seed=0,frames:EncounterFrame[]=[{at:1,signals:[[0,true]],participant},{at:2,signals:[[0,true]],continuity:true,participant}]){
 const d=recognitionData(true,seed,frames),rows=items(decode(d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])!==key(REL_SOURCE)).map(v=>{
  const row=[...items(v,'list')];if(key(row[2])===key(SOCIAL_SOURCE)){const at=row[0];if(typeof at==='boolean'||at.kind!=='signed')throw Error('time');const frame=frames.find(x=>BigInt(x.at)===at.value)!;
   row[3]=list([...items(row[3],'list'),list([text(REL),unsigned(frame.kind??1),frame.participant??participant,frame.ownAccess??true,unsigned(frame.display??0)])]);}
  return list(row);
 });return {...d,orderedInputs:enc(list(rows))};
}
export {target,other,decode,items,key,enc} from './assembledRecognition';
