import {list,text,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {PEOPLE_RULES,PEOPLE_REGISTRY} from '../../assembled/model';
import {SOCIAL_PEOPLE,SOCIAL_SOURCE} from '../../assembled/social';
import {REL_PEOPLE} from '../../assembled/relationship';
import {newAction} from './assembledConfiguration';
import {catalogSource,catalogData,entriesFor,target,other,decode,items,key,enc,type Frame} from './assembledRecognitionCatalog';
export function peopleSource(singleton=false){const s=catalogSource(),slots=[...items(decode(s.registry),'list')],social=items(slots[19],'list'),tasks=items(social[2],'list'),contact=items(slots[20],'list')[1];
 slots[19]=list([text(SOCIAL_PEOPLE),list(singleton?[list([target,list(tasks)])]:[list([target,list(tasks.slice(0,2))]),list([other,list(tasks.slice(2))])])]);
 slots[20]=list([text(REL_PEOPLE),list([list([target,contact]),...(singleton?[]:[list([other,newAction])])])]);
 return {...s,rulesVersion:PEOPLE_RULES,registrySchemaVersion:PEOPLE_REGISTRY,registry:enc(list(slots))};}
export function peopleData(second=false,seed=0,frames:Frame[]=[{at:1,signals:[[second?'appearance/plain':'appearance/coat',true]]},{at:2,signals:[[second?'appearance/plain':'appearance/coat',true]],continuity:true}]){return catalogData(false,seed,frames);}
export function changeReports(data:ReturnType<typeof peopleData>,change:(at:number,social:CanonicalValue[])=>void){return {...data,orderedInputs:enc(list(items(decode(data.orderedInputs),'list').map(v=>{const row=[...items(v,'list')];if(key(row[2])===key(SOCIAL_SOURCE)){const at=row[0];if(typeof at==='boolean'||at.kind!=='signed')throw Error('time');const payload=[...items(row[3],'list')],social=[...items(payload[1],'list')];change(Number(at.value),social);payload[1]=list(social);row[3]=list(payload);}return list(row);}))) };}
export {target,other,decode,items,key,enc,entriesFor};
