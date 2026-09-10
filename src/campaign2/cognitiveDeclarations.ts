/** task-cognitive-path/0.1-candidate: governed declaration closure.
 * Namespace qualification is separate from runtime occurrence authenticity. */
import allocation from '../../docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json';
import {canonicalEncode as enc,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {compileTaskContentDeclarations} from './taskDeclarations';
import {decodeCognitive} from './cognitiveCodecs';
import {dataRecord as rec,dataField as f,dataIdentity as id,dataItems as items,dataUnsigned as u,dataText as txt,dataKey as key,invalidModel} from './canonicalData';

const ident=(ns:number,payload:string)=>typedIdentifier(ns,text(payload));
const definitionKinds:Readonly<Record<string,readonly [number,string]>>={
 'task-workspace':[378,'task-workspace'],'task-concern':[385,'task-concern'],
 'task-motive':[392,'task-motive'],'task-candidates':[435,'task-candidates'],
 'task-reason-source':[436,'task-reason-source'],'task-reason-dice':[437,'task-reason-dice'],
 'task-arbitration':[440,'task-arbitration'],'protocol-execution':[434,'protocol-execution'],
 'protocol-observation':[451,'protocol-observation'],
 'task-instruction-one':[389,'task-instruction'],'task-instruction-two':[389,'task-instruction'],
 'protocol-contact-one':[391,'protocol-action'],'protocol-contact-two':[391,'protocol-action'],
};
const referenceFields:Readonly<Record<string,number>>={
 '378/1':359,'389/1':391,'417/5':378,'418/2':385,'441/2':392,
 '442/2':435,'443/2':436,'444/2':437,'445/2':440,'446/2':434,
};

export async function compileCognitiveDeclarations(contentBytes:Uint8Array,registryBytes:Uint8Array){
 const content=await compileTaskContentDeclarations(contentBytes,registryBytes,'cognitive');
 const slots=items(decodeCognitive(registryBytes),'list');
 const rows=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n));
 const byId=new Map(rows.map(row=>[key(f(row,1n)),row]));
 const definition=(value:CanonicalValue,type:number)=>{const row=byId.get(key(value));if(!row)invalidModel('missing cognitive definition');return rec(f(row,4n),BigInt(type));};
 for(const [name,[type,kind]] of Object.entries(definitionKinds)){
  const stable=ident(1027,'definition/'+name),row=byId.get(key(stable));
  if(!row||key(f(row,2n))!==key(ident(1023,'registry/'+kind)))invalidModel('wrong cognitive definition kind: '+name);
  definition(stable,type);
 }
 // Every scalar role is mandatory even when its record has no runtime witness yet.
 for(const expected of allocation.roles){
  const bytes=content.recordRole(BigInt(expected.recordTypeId),BigInt(expected.fieldId));
  if(!bytes)invalidModel('missing cognitive scalar role');
  const role=rec(decodeCognitive(bytes),263n),validator=role.fields.get(2n);
  if(u(f(role,1n))!==BigInt(expected.requiredNamespace))invalidModel('wrong cognitive role namespace');
  if(expected.domainValidatorId===null?validator!==undefined:validator===undefined||key(validator)!==key(ident(1021,expected.domainValidatorId)))invalidModel('wrong cognitive role predicate');
 }
 function visit(value:CanonicalValue):void {
  if(typeof value==='boolean')return;
  if(value.kind==='record'){
   for(const [field,child] of value.fields){const target=referenceFields[`${value.schema.typeId}/${field}`];if(target!==undefined)definition(child,target);visit(child);}
   if(value.schema.typeId===416n){const specs=items(f(value,2n),'set');if(specs.length!==2)invalidModel('workspace task target coverage');for(const spec of specs)definition(spec,370);}
   if(value.schema.typeId===447n||value.schema.typeId===448n){
    const plan=value.schema.typeId===447n,path=rec(f(value,3n),149n);
    if(u(f(path,1n))!==(plan?373n:415n)||u(f(path,2n))!==(plan?2n:1n)||key(f(value,4n))!==key(ident(1028,plan?'accessor/task-plan-binding':'accessor/task-identity-history')))invalidModel('cognitive read target mismatch');
   }
   if(value.schema.typeId===451n){
    if(key(f(value,1n))!==key(ident(1009,'ProtocolExecutionTransition')))invalidModel('wrong protocol observation producer');
    if(u(f(rec(f(value,2n),254n),1n))!==433n||u(f(rec(f(value,6n),254n),1n))!==310n)invalidModel('protocol observation schema mismatch');
    const unit=id(f(rec(f(value,3n),201n),5n));if(unit.namespaceId!==1039n||txt(unit.payload)!=='unit/fixture-pulse')invalidModel('protocol unit outside closed profile');
   }
  }else if(value.kind==='list'||value.kind==='set')value.items.forEach(visit);
  else if(value.kind==='map')for(const [k,v] of value.entries){visit(k);visit(v);}
 }
 visit(slots[0]);
 content.validateRecordRoles(enc(decodeCognitive(registryBytes)));
 return content;
}
