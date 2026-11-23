/** M234 nonsocial B, body10, target5.2..5.3; sensor conditions enter normal probe source. */
import {fixture as prior,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,type CanonicalValue} from './assembledGoalFulfillmentCurrent';
import {CRITERION_RULES,CRITERION_REGISTRY} from '../../assembled/model';
import {CRITERION_VERSION} from '../../assembled/criterionSensing';
import {PROBE_SOURCE_EVENT,AUTHORED_FACT_EVENT} from '../../campaign2/orderedInputs';
import {campaign2Record as cr} from '../../campaign2/codecs';
import {DISPLAY} from '../../assembled/strategy';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export const names=['falsePositive','negative','positive','falseNegative','silent'] as const;
export type Case=typeof names[number];
let base:ReturnType<typeof prior>|undefined,route:CanonicalValue|undefined;
export function fixture(name:Case){
 const b=base??(base=prior('externalNoRoute2')),count=name==='falsePositive'||name==='negative'?0:2,bias=name==='falsePositive'?2:name==='falseNegative'?-2:0;
 if(!route)route=items(items(decode(prior('revealed0').d.orderedInputs),'list').find(v=>at(items(v,'list')[0])===2n&&key(items(v,'list')[2])===key(DISPLAY))!,'list')[3];
 const inputs=items(decode(b.d.orderedInputs),'list').flatMap(v=>{const a=[...items(v,'list')],t=at(a[0]);
  if(key(a[2])===key(AUTHORED_FACT_EVENT))a[3]=cr('AuthoredActualAdaptationFact',{Fact:cr('RegulatoryExposureFact',{CharacterId:C,ExposureReferentId:C,ActualContactCount:u(count)})});
  if(t===6n&&key(a[2])===key(DISPLAY))a[3]=route!;
  if(t>1n&&key(a[2])===key(PROBE_SOURCE_EVENT)){if(name==='silent')return [];a[3]=list([text(CRITERION_VERSION),a[3],signed(bias)]);}
  return [list(a)];
 });
 return {...b,s:{...b.s,rulesVersion:CRITERION_RULES,registrySchemaVersion:CRITERION_REGISTRY},d:{...b.d,orderedInputs:enc(list(inputs))},count,bias};
}
let model:ReturnType<typeof prepareCharacterModel>|undefined;
export async function start(name:Case){const b=fixture(name),m=await(model??(model=prepareCharacterModel(b.s)));return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export {through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid};
export type {CanonicalValue};
