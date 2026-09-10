/** Frozen finite receiving cohort. This is not an arbitrary model-authoring DSL. */
import freeze from '../../docs/planning/campaign3-embodied-receiving-model-rev1/FREEZE.json';
import {canonicalEncode as enc,list,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,statePathValue,type StatePath} from '../substrate/state';
import {commitManifest,createModelIdentity} from '../substrate/identity';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {snapshotMemorySource} from '../campaign2/memoryModel';
import {compileReceivingTaskContentDeclarations} from '../campaign2/taskDeclarations';
import {compileCampaign2StateModel} from '../campaign2/stateModel';
import {compileOccurrenceIdentities} from '../campaign2/occurrenceIdentity';
import {compileReceivingRequiredProjections,compileEmbodiedRequiredProjections} from '../campaign2/requiredProjection';
import {dataField as f,dataRecord as rec,dataItems as items,dataKey as key,dataUnsigned as u,invalidModel as fail} from '../campaign2/canonicalData';
import {decodeReceiving as decode,receivingSchema as schema,receivingRecord as r} from './receivingCodecs';
import {readQ,ZERO} from '../campaign2/cognitiveMath';
import type {Campaign2ModelSource} from '../campaign2/factory';
const id=(ns:number,s:string)=>typedIdentifier(ns,text(s));
export async function compileReceivingModel(input:Campaign2ModelSource){
 const source=snapshotMemorySource(input);for(const [k,v] of Object.entries(freeze.versions))if(source[k as keyof typeof freeze.versions]!==v)fail('receiving version bundle');
 const registry=decode(source.registry),slots=items(registry,'list'),contentValue=decode(source.content),parameters=decode(source.parameters);
 const modelIdentity=await createModelIdentity({...source,registryManifest:await commitManifest(registry),contentManifest:await commitManifest(contentValue),parameterSet:await commitManifest(parameters)});
 const approved=freeze.models.find(m=>m.modelIdentity===key(modelIdentity.value));if(!approved)fail('model outside exact frozen receiving cohort');
 const content=await compileReceivingTaskContentDeclarations(source.content,source.registry);content.validateRecordRoles(source.registry);
 const state=compileCampaign2StateModel(enc(slots[2]),enc(slots[3]),enc(slots[4]),content,{decode,schema});
 const rows=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n));
 const row=(stable:CanonicalValue)=>rows.find(v=>key(f(v,1n))===key(stable))??fail('missing frozen definition');
 const definition=(name:string)=>decode(enc(f(row(id(1027,'definition/'+name)),4n)));
 const registration=(type:bigint)=>f(rows.find(v=>typeof f(v,4n)!=='boolean'&&(f(v,4n) as {schema:{typeId:bigint}}).schema.typeId===type)!,4n);
 const stages=rows.map(v=>f(v,4n)).filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===515n);
 for(const type of [465n,469n,470n]){const reg=rec(registration(type),type),d=rec(f(reg,3n),type===465n?466n:type===469n?471n:472n);compileEmbodiedRequiredProjections(enc(reg),enc(f(d,type===465n?3n:5n)),[],state,content);}
 const workspace=rec(stages.find(v=>u(f(rec(v,515n),1n))===1n)!,515n);compileReceivingRequiredProjections(enc(workspace),enc(f(workspace,9n)),[],state,content);
 const occurrences=compileOccurrenceIdentities(enc(f(rec(definition('transition-admission'),279n),3n)),content,{decode,schema});
 const C=f(rec(definition('measurement-prediction'),359n),2n),O=id(1000,'observer/embodied-subject'),task=r(371,[C,semanticReferentFromAuthoredContent(id(1038,'content/task-a'))]);
 const path=(root:bigint,field=1n):StatePath=>({rootStateTypeId:root,fieldId:field,selectors:[{kind:'mapKey',key:root===268n?O:root===373n?task:C}]});
 const allowed=new Set([path(268n),path(455n),path(487n),path(373n),path(373n,2n)].map(p=>key(statePathValue(p))));
 function validateState(value:AuthoritativeState,at:bigint,initial=false){state.validateState(value);const entries=value.entries();if(entries.length<3||entries.length>5||entries.some(e=>!allowed.has(key(statePathValue(e.path)))))fail('receiving exact state domain');
  for(const root of [268n,455n,487n])if(!value.read(path(root)).presence)fail('required receiving root absent');
  if(key(f(rec(value.read(path(268n)).value!,267n),1n))!==key(C))fail('receiving roster subject');
  const anchor=rec(value.read(path(455n)).value!,454n),amount=readQ(f(anchor,1n)),time=f(anchor,2n);if(amount.compare(ZERO)<0||amount.compare(readQ(f(rec(definition('embodied-reserve-parameters'),453n),2n)))>0||typeof time==='boolean'||time.kind!=='signed'||time.value<0n||time.value>at||initial&&(amount.denominator!==1n||time.value!==0n))fail('receiving body anchor domain');
  const adopted=items(f(rec(value.read(path(487n)).value!,486n),1n),'set');if(adopted.some(v=>!['a','a-copy','b'].some(s=>key(v)===key(id(1027,'definition/embodied-response-'+s)))))fail('unadmitted response instruction');
  const status=value.read(path(373n)),plan=value.read(path(373n,2n));if(status.presence!==plan.presence)fail('task/instruction co-presence');
  if(status.presence){const tag=u(f(rec(status.value!,372n),1n));if(initial?tag!==1n:tag!==1n&&tag!==3n)fail('unreachable task state');const instruction=f(rec(plan.value!,390n),1n);if(!['one','two'].some(s=>key(instruction)===key(id(1027,'definition/task-instruction-'+s))))fail('task instruction vocabulary');}
 }
 return Object.freeze({source,modelIdentity,content,state,occurrences,work:u(f(rec(items(parameters,'list')[0],133n),1n)),name:approved.name,
  definition,characterBytes:()=>enc(C),observerBytes:()=>enc(O),taskBytes:()=>enc(task),stageBytes:()=>stages.map(enc),path,
  definitionBytes:()=>enc(list(['embodied-reserve-parameters','embodied-level-channel','embodied-pressure','embodied-delivery-30','embodied-delivery-5','embodied-delivery-60'].map(definition))),
  validateState,initialState(bytes:Uint8Array){const value=state.restoreState(bytes);validateState(value,0n,true);return value;}});
}
