/** Internal binding of the actual inherited regulatory probe interpreter. Its
 * eight source stages retain their original versions and output semantics. */
import {canonicalEncode as enc,list,set,map,signed,unsigned as u,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {compileRegulatoryReferences} from '../campaign2/regulatoryReference';
import {compileProbeExecution} from '../campaign2/probeExecution';
import {validateProbeArchive} from '../campaign2/probeCodecs';
import {executeMeasurementIntake} from '../campaign2/measurementExecution';
import {measurementEpisodeEvidence} from '../campaign2/memoryExecution';
import {measurementPredictionValue} from '../campaign2/predictionExecution';
import {dataRecord as rec,dataField as f,dataKey as key,invalidModel as fail} from '../campaign2/canonicalData';
import {AuthoritativeState,type ActualReadRecord,type StatePatch} from '../substrate/state';
import {generalDefinitionId as d} from './generalBindingProfile';
import {generalRecord as r,generalId as id,generalSubject,generalContentId as c} from './generalBindingProfile';
import {generalRecipe} from './generalDefinitionProfile';
import type {StatePath} from '../substrate/state';
export function compileGeneralInheritedSource(recipeName:string,content:Omit<Parameters<typeof compileRegulatoryReferences>[1],'canonicalBytes'|'recordRole'>){
 const p=generalRecipe(recipeName).source,who=generalSubject(),variable=id(1029,'variable/fixture-regulation'),parameter=id(1030,'parameter/general-attention-reference');
 const entry=(stable:CanonicalValue,kind:string,version:string,value:CanonicalValue)=>r(171,[stable,id(1023,kind),text(version),value]);
 const rate=r(120,[parameter,signed(0),u(1),signed(0),signed(100)]),anchor=r(121,[signed(p.probeAuthoredReference),u(0),parameter,u(0)]);
 const regulatory=entry(variable,'registry/regulatory-variable','regulatory-reference/0.5-candidate',r(283,[r(280,[u(p.regScale),signed(0),signed(100)]),r(282,[map([[r(281,[who.character]),anchor]]),map([[parameter,rate]])])]));
 const probe=entry(id(1027,'definition/regulatory-diagnostic-probe'),'registry/regulatory-diagnostic-probe','regulatory-diagnostic-probe/0.1-candidate',r(331,[who.character,variable,r(332,[id(1005,'channel/regulatory-probe'),who.observer,who.character,id(1006,'modality/diagnostic-regulatory-probe'),id(1039,'unit/fixture-pulse')]),p.probeAvailable,p.probePermitted]));
 const character=r(170,[c('subject'),id(1004,'semantic-kind/character'),...Array.from({length:14},()=>list([]))]);
 const references=compileRegulatoryReferences(enc(set([regulatory])),{...content,canonicalBytes:enc(set([character])),recordRole(type,field){return type===281n&&field===1n?enc(r(263,[u(1002),id(1021,'validator/character-qualification')])):undefined;}});
 const registry=list([set([regulatory,probe])]),execution=compileProbeExecution(registry,references);
 const path:StatePath=execution.path;
 return Object.freeze({execution,definitionBytes:()=>enc(registry),initialEntries:()=>p.initialDisplacement===null?[]:[{path:structuredClone(path),value:r(299,[signed(p.initialDisplacement)])}],
  begin(at:bigint){
   const engine=execution.begin(at),observations=new WeakMap<object,CanonicalValue>(),carriages=new WeakMap<object,CanonicalValue>(),evidence=new WeakMap<object,CanonicalValue>();let active=true,observed=false,intaken=false,produced=false,applied=false;
   const live=()=>{if(!active)fail('GA inherited source closed');};
   const slot=(value:CanonicalValue,namespace:bigint)=>{if(typeof value==='boolean'||value.kind!=='typedIdentifier'||value.namespaceId!==namespace||typeof value.payload==='boolean'||value.payload.kind!=='unsigned')fail('GA inherited output slot');};
   return Object.freeze({
    execute(...args:Parameters<typeof engine.execute>){live();const result=engine.execute(...args);const observation=result.outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===203n);if(observation){if(observed)fail('GA duplicate actual probe observation');observed=true;observations.set(result,observation);}return result;},
    intake(actualProbeResult:object,occurrence:CanonicalValue){live();const observation=observations.get(actualProbeResult);if(!observation)fail('GA actual probe result required');slot(occurrence,1124n);observations.delete(actualProbeResult);
     validateProbeArchive(observation,execution.channel,execution.variableDefinition,execution.definitionId,execution);
     const value=executeMeasurementIntake(observation,id(1039,'unit/fixture-pulse'),occurrence),token=Object.freeze({output:()=>structuredClone(value)});carriages.set(token,value);intaken=true;return token;
    },
    evidence(actualCarriage:object,occurrence:CanonicalValue){live();const carriage=carriages.get(actualCarriage);if(!carriage)fail('GA actual carriage required');slot(occurrence,1125n);carriages.delete(actualCarriage);const value=measurementEpisodeEvidence(carriage,occurrence),token=Object.freeze({output:()=>structuredClone(value)});evidence.set(token,value);produced=true;return token;},
    prediction(actualEvidence:object,state:AuthoritativeState){live();const source=evidence.get(actualEvidence);if(!source)fail('GA actual M1 required');evidence.delete(actualEvidence);
     const rosterPath:StatePath={rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:who.observer}]},roster=state.read(rosterPath);if(!roster.presence||key(f(rec(roster.value!,267n),1n))!==key(who.character))fail('GA inherited prediction roster');
     const target:StatePath={rootStateTypeId:362n,fieldId:1n,selectors:[{kind:'mapKey',key:r(360,[who.character,d('prediction')])}]},prior=state.read(target),observation=rec(f(rec(f(rec(source,342n),2n),337n),2n),203n),value=measurementPredictionValue(prior.value,observation,16n);
     const patch:StatePatch={operations:[{kind:'set',path:target,expected:prior.presence?{presence:true,value:prior.value!}:{presence:false},newValue:value}]};
     const reads:ActualReadRecord[]=[{accessorId:id(1028,'ResolvedCharacterSubject'),path:rosterPath,presence:true,value:who.character,derivedSources:[roster],transformationId:id(1028,'ResolvedCharacterSubject')},{accessorId:id(1028,'accessor/measurement-prediction-prior'),path:target,presence:prior.presence,value:prior.value,derivedSources:[]}];applied=true;
     return Object.freeze({patch:()=>structuredClone(patch),actualReadRecords:()=>structuredClone(reads)});
    },
    finish(){live();engine.finish();if(observed&&(!intaken||!produced||!applied))fail('GA incomplete inherited prediction path');},
    close(){engine.abort();active=false;},
   });
  },
 });
}
