/** Materialized declaration/component fixtures, not an activated public model. */
import registryHex from '../../docs/planning/embodied-receiving-model-review-rev1/baseline/registry.cenc.hex?raw';
import contentHex from '../../docs/planning/embodied-receiving-model-review-rev1/baseline/content.cenc.hex?raw';
import parametersHex from '../../docs/planning/embodied-receiving-model-review-rev1/baseline/parameters.cenc.hex?raw';
import review from '../../docs/planning/embodied-receiving-model-review-rev1/REVIEW.json';
import {canonicalEncode as enc,list,set,map,record,unsigned as u,signed,text,rational,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {commitManifest,createModelIdentity} from '../substrate/identity';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {receivingRecord as r,decodeReceiving as decode,receivingSchema as schema} from '../campaign3/receivingCodecs';
import {dataField as f,dataRecord as rec,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileReceivingTaskContentDeclarations} from '../campaign2/taskDeclarations';
import {compileCampaign2StateModel} from '../campaign2/stateModel';
import {workspaceOutput,appraisalOutput,concernOutput,motiveOutput,candidateOutput,rawSignalOutput} from '../campaign2/cognitiveTransforms';
import {readQ} from '../campaign2/cognitiveMath';
const bytes=(s:string)=>Uint8Array.from(s.trim().match(/../g)!.map(s=>Number.parseInt(s,16)));
export const receivingSource={...review.versions,registry:bytes(registryHex),content:bytes(contentHex),parameters:bytes(parametersHex)};
export const receivingSlots=items(decode(receivingSource.registry),'list');
export const receivingDefinitions=items(receivingSlots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n));
export const def=(name:string)=>f(receivingDefinitions.find(v=>key(f(v,1n))===key(id(1027,'definition/'+name)))!,4n);
export const id=(ns:number,s:string)=>typedIdentifier(ns,text(s));
export const occurrence=(ns:number,n:number)=>typedIdentifier(ns,u(n));
export const C=f(rec(def('measurement-prediction'),359n),2n),O=id(1000,'observer/embodied-subject');
export const taskKey=r(371,[C,semanticReferentFromAuthoredContent(id(1038,'content/task-a'))]);
export function initialReceiving(adopted:readonly string[]=['a'],task=true){return new AuthoritativeState([
 {path:{rootStateTypeId:455n,fieldId:1n,selectors:[{kind:'mapKey',key:C}]},value:r(454,[rational(80,1),signed(0)])},
 {path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:O}]},value:r(267,[C])},
 {path:{rootStateTypeId:487n,fieldId:1n,selectors:[{kind:'mapKey',key:C}]},value:r(486,[set(adopted.map(s=>id(1027,'definition/embodied-response-'+s)))])},
 ...(task?[{path:{rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey' as const,key:taskKey}]},value:r(372,[u(1)])},{path:{rootStateTypeId:373n,fieldId:2n,selectors:[{kind:'mapKey' as const,key:taskKey}]},value:r(390,[id(1027,'definition/task-instruction-two')])}]:[]),
 ]);}
export async function receivingComponents(){const content=await compileReceivingTaskContentDeclarations(receivingSource.content,receivingSource.registry),state=compileCampaign2StateModel(enc(receivingSlots[2]),enc(receivingSlots[3]),enc(receivingSlots[4]),content,{decode,schema});const modelIdentity=await createModelIdentity({...receivingSource,contentManifest:await commitManifest(decode(receivingSource.content)),registryManifest:await commitManifest(decode(receivingSource.registry)),parameterSet:await commitManifest(decode(receivingSource.parameters))});return {content,state,modelIdentity};}
export function receivingOriginals(at=45,deliveries=false){return list([
 list([signed(at),u(10),id(1001,'event/embodied-level-sample'),r(459,[O,id(1027,'definition/embodied-level-channel')]),list([])]),
 list([signed(at),u(40),id(1001,'event/embodied-receiving-workspace'),r(377,[O,id(1027,'definition/task-workspace')]),list([])]),
 ...(deliveries?['5','30','60'].map(n=>list([signed(at),u(110),id(1001,'event/embodied-reserve-replenishment'),r(478,[id(1027,'definition/embodied-delivery-'+n)]),list([])])):[]),
 ]);}
export function taskSource(action='two',adopted=true,base=true){
 const workspace=workspaceOutput(occurrence(1128,10),C,id(1027,'definition/task-workspace'),def('task-workspace'),[{key:taskKey,specId:id(1027,'definition/task-a'),activeFrom:0n,deadline:100n}],45n,{status:()=>adopted?r(372,[u(1)]):undefined,prediction:()=>{throw Error('forecast must not read');}}).output;
 const appraisal=appraisalOutput(occurrence(1129,11),workspace,[{taskKey,specId:id(1027,'definition/task-a'),minimum:readQ(rational(4,1)),maximum:readQ(rational(6,1))}]);
 const concern=concernOutput(occurrence(1130,12),appraisal,def('task-concern'));
 const motive=motiveOutput(occurrence(1131,13),concern,r(392,[rational(1,4),base]));
 const candidates=candidateOutput(occurrence(1132,14),motive,true,()=>({instructionId:id(1027,'definition/task-instruction-'+action),actionId:id(1027,'definition/protocol-contact-'+action)}));
 const raw=rawSignalOutput(occurrence(1133,15),candidates,false,readQ(rational(1,10)),()=>{throw Error('standing must not read');}).output;
 return {workspace,appraisal,concern,motive,candidates,raw};
}
export const positivePressure=()=>r(464,[occurrence(1142,2),C,r(461,[occurrence(1115,0),O,id(1005,'channel/embodied-fuel-level'),signed(45),r(462,[rational(30,1),rational(40,1)]),text('embodied-level-observation/0.1-candidate')]),r(481,[u(1),rational(1,3)]),text('embodied-pressure/0.2-candidate')]);
export function receivingVariant(name:string){
 const replace=(v:CanonicalValue,n:number,value:CanonicalValue)=>{const x=rec(v,(v as {schema:{typeId:bigint}}).schema.typeId);return record(x.schema,new Map([...x.fields].map(([k,v])=>[k,k===BigInt(n)?value:v])));};
 const changes:Record<string,[string,number,CanonicalValue]>={slower:['embodied-reserve-parameters',3,rational(1,2)],coarser:['embodied-level-channel',6,rational(20,1)],denied:['embodied-level-channel',8,false],unavailable:['embodied-level-channel',7,false],'task-base-off':['task-motive',2,false],'task-plan-off':['task-candidates',1,false],'execution-blocked':['protocol-execution',1,false],quiet:['task-arbitration',2,rational(1,1)],auto:['task-arbitration',1,rational(1,1)],'weak-task':['task-motive',1,rational(1,20)]};
 if(name==='baseline')return receivingSource;
 if(name==='work25')return {...receivingSource,parameters:enc(list([r(133,[u(25)])]))};
 if(!changes[name]&&name!=='no-coverage-control')throw Error('unknown fixture variant');
 const slot=items(receivingSlots[0],'set').map(v=>{if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;
  if(changes[name]){const [definition,field,value]=changes[name];if(key(f(v,1n))===key(id(1027,'definition/'+definition)))return replace(v,4,replace(f(v,4n),field,value));}
  if(name==='no-coverage-control'&&['EmbodiedReceivingMixedRawTransition','EmbodiedReceivingMixedReasonsTransition'].some(s=>key(f(v,1n))===key(id(1009,s)))){const version=text('embodied-task-reasons-no-coverage-control/0.1-candidate');return replace(replace(v,3,version),4,replace(f(v,4n),3,version));}return v;});
 return {...receivingSource,registry:enc(list([set(slot),...receivingSlots.slice(1)]))};
}
