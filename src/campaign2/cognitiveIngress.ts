/** task-cognitive-path/0.1-candidate: the inherited EVID/ADAPT ingress slice.
 * The cognitive engine owns its other registrations; this is not a whole-graph
 * registry or a second producer API. Only the frozen regulatory producer changes.
 */
import {canonicalEncode as enc,record,set,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {decodeCognitive,cognitiveSchemaByType,cognitiveNamed} from './cognitiveCodecs';
import {campaign2Schema} from './codecs';
import {compileAdaptationEvaluator} from './adaptationEvaluation';
import {compileOccurrenceIdentities} from './occurrenceIdentity';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as u,invalidModel} from './canonicalData';
import type {compileCognitiveModel} from './cognitiveModel';
import type {compileCognitiveState} from './cognitiveState';
const atom=(ns:number,s:string)=>typedIdentifier(ns,text(s));
function replace(value:CanonicalValue,field:bigint,next:CanonicalValue){if(typeof value==='boolean'||value.kind!=='record')return invalidModel('record replacement required');return record(value.schema,new Map([...value.fields].map(([k,v])=>[k,k===field?next:v])));}

export function compileCognitiveIngress(model:Awaited<ReturnType<typeof compileCognitiveModel>>,state:Awaited<ReturnType<typeof compileCognitiveState>>){
 const base=state.prior.base,slots=items(decodeCognitive(model.source.registry),'list');
 const rows=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n));
 const singleton=rows.find(r=>key(f(r,1n))===key(atom(1027,'definition/transition-admission')))??invalidModel('missing admission singleton');
 const occurrences=compileOccurrenceIdentities(enc(f(rec(f(singleton,4n),279n),3n)),model.content,{decode:decodeCognitive,schema:cognitiveSchemaByType});
 const mapping=f(rec(f(singleton,4n),279n),2n);if(typeof mapping==='boolean'||mapping.kind!=='map')invalidModel('route map required');
 const routes=new Map(mapping.entries.map(([transition,route])=>[key(transition),key(route)])),closures=new Map<string,Set<string>>();
 for(const [transition,route] of routes){
  const row=rows.find(r=>key(f(r,1n))===transition)??invalidModel('unresolved routed transition');let value=f(row,4n);
  if(typeof value!=='boolean'&&value.kind==='record'&&[356n,357n].includes(value.schema.typeId))value=f(value,1n);
  if(typeof value==='boolean'||value.kind!=='record'||![272n,318n,347n,364n,375n,376n,450n].includes(value.schema.typeId))invalidModel('unsupported routed cognitive registration');
  const outputs=[450n,375n].includes(value.schema.typeId)?f(value,5n):[364n,376n].includes(value.schema.typeId)?f(value,6n):f(rec(f(value,3n),value.schema.typeId===318n?319n:value.schema.typeId===347n?348n:271n),3n),schemas=closures.get(route)??new Set<string>();
  for(const output of items(outputs,'set')){const schema=rec(f(rec(output,277n),1n),254n);schemas.add(`${u(f(schema,1n))}/${u(f(schema,2n))}`);}
  if(value.schema.typeId===318n){const schema=rec(f(rec(f(rec(f(value,5n),317n),3n),323n),2n),254n);schemas.add(`${u(f(schema,1n))}/${u(f(schema,2n))}`);}
  closures.set(route,schemas);
 }
 const learning=key(atom(1026,'route/character-learning'));
 if(JSON.stringify([...(closures.get(learning)??[])].sort())!==JSON.stringify(['269/1','270/1','342/1','429/1']))invalidModel('cognitive learning closure must retain EVID, memory evidence and qualification');
 const oldRows=items(decodeCognitive(base.adaptation.registrationBytes()),'set').map(v=>rec(v,171n));
 const replacements=new Map<string,Uint8Array>();
 const adaptedRows=oldRows.map(old=>{
  const current=rows.find(r=>key(f(r,1n))===key(f(old,1n)))??invalidModel('missing retained ADAPT registration');
  const r=rec(f(current,4n),318n),oldR=rec(f(old,4n),318n),d=rec(f(r,3n),319n),input=rec(f(d,1n),320n),producer=rec(f(input,2n),321n);
  if(key(f(old,1n))===key(atom(1009,'transition/regulatory-adaptation'))){
   if(u(f(producer,1n))!==2n||key(f(producer,5n))!==key(atom(1009,'ProtocolActualFactBridgeTransition')))invalidModel('wrong fixed protocol producer');
   const originalProducer=f(rec(f(rec(f(oldR,3n),319n),1n),320n),2n);
   const normalized=replace(current,4n,replace(r,3n,replace(d,1n,replace(input,2n,originalProducer))));
   if(key(normalized)!==key(old))invalidModel('protocol producer change cannot alter retained ADAPT semantics');
  }else if(key(current)!==key(old))invalidModel('retained procedural ADAPT changed');
  replacements.set(key(f(old,1n)),enc(r));return current;
 });
 const ruleRows=rows.filter(r=>key(f(r,2n))===key(atom(1023,'registry/adaptation-rule')));
 if(ruleRows.length!==base.adaptation.ruleCount)invalidModel('changed ADAPT rule inventory');
 for(const r of ruleRows){const old=base.adaptation.ruleDefinition(f(r,1n));if(!old||key(old)!==key(f(r,4n)))invalidModel('changed retained ADAPT rule');}
 const adaptation=Object.freeze({...base.adaptation,registrationBytes:()=>enc(set(adaptedRows)).slice()});
 const registrations=base.admission.registrations().map(r=>({...r,registration:replacements.get(r.transitionKey)??r.registration}));
 const admission=Object.freeze({...base.admission,decode:decodeCognitive,
  registrations:()=>registrations.map(r=>({...r,registration:r.registration.slice()})),
  occurrenceIdentity:(bytes:Uint8Array)=>occurrences.extract(bytes),
  routeKeyForTransition:(transition:string)=>routes.get(transition),
  outputClosure:(route:CanonicalValue)=>[...(closures.get(key(route))??[])].sort(),
  registrationForEvent(event:CanonicalValue){
   for(const bytes of replacements.values()){const r=rec(decodeCognitive(bytes),318n);if(key(f(rec(f(r,4n),276n),1n))===key(event))return bytes.slice();}
   return base.admission.registrationForEvent(event);
  },
 });
 const evaluator=compileAdaptationEvaluator(adaptation,base.domains,state.stateModel,{decode:decodeCognitive,record:(name,values)=>cognitiveNamed(Number(campaign2Schema(name).typeId),values)});
 return Object.freeze({admission,adaptation,evaluator});
}
