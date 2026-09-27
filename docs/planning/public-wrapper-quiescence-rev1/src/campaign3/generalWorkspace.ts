/** Internal GA adapter for task-cognitive-path/0.1-candidate. The runtime must
 * authenticate the deliberation original and reserve its output occurrence before
 * calling construct; this adapter grants neither ingress nor allocation authority. */
import {canonicalEncode as enc,signed,list,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {AuthoritativeState,patternMatches,type StatePath,type ActualReadRecord} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataKey as key,invalidModel as fail,type RecordValue} from '../campaign2/canonicalData';
import {workspaceOutput} from '../campaign2/cognitiveTransforms';
import {generalRecord as r,generalId as id,generalSubject,generalStagePaths,generalDefinitionId as d,generalContentId as c,generalBindingContext} from './generalBindingProfile';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {validateGeneralPrimitive} from './generalPrimitiveGrammar';

export function compileGeneralWorkspace(definitions:ReadonlyMap<string,RecordValue>,validateLeaf:(path:StatePath,value:CanonicalValue)=>void){
 const context=generalBindingContext(),who=generalSubject(),domain=generalStagePaths('prior-concern-workspace').reads;
 const definition=(name:string,type:bigint)=>rec(decode(enc(f(definitions.get(key(d(name)))??fail('GA missing workspace definition'),4n)),context),type);
 const workspace=definition('workspace',378n),task=definition('task',370n);
 const time=(value:CanonicalValue)=>{validateGeneralPrimitive('Instant',value);return (value as Extract<CanonicalValue,{kind:'signed'}>).value;};
 const taskKey=r(371,[who.character,semanticReferentFromAuthoredContent(c('task'))]);
 const tasks=[{key:taskKey,specId:d('task'),activeFrom:time(f(task,5n)),deadline:time(f(task,6n))}];
 const path=(root:bigint,k:CanonicalValue):StatePath=>({rootStateTypeId:root,fieldId:1n,selectors:[{kind:'mapKey',key:k}]});
 const rosterPath=path(268n,who.observer),taskPath=path(373n,taskKey),predictionPath=path(362n,r(360,[who.character,f(workspace,1n)]));
 for(const p of [rosterPath,taskPath,predictionPath])if(!domain.some(d=>patternMatches(d,p)))fail('GA workspace read outside registration');
 return Object.freeze({
  construct(state:AuthoritativeState,original:CanonicalValue,occurrence:CanonicalValue,at:bigint){
   validateGeneralPrimitive('Instant',signed(at));
   const cue=rec(decode(enc(original),context),377n);
   if(key(f(cue,1n))!==key(who.observer)||key(f(cue,2n))!==key(d('workspace')))fail('GA workspace original subject/agenda');
   // Validate the supplied slot's grammar before any reads. Freshness and ownership
   // require the shared transactional allocator in the eventual runtime.
   decode(enc(r(381,[occurrence,who.character,d('workspace'),list([]),r(380,[u(1)])])),context);
   const reads:ActualReadRecord[]=[];
   const read=(p:StatePath,member:string)=>{
    const prior=state.read(p);if(prior.presence)validateLeaf(p,prior.value!);
    reads.push({accessorId:id(1028,member),path:p,presence:prior.presence,value:prior.value,derivedSources:[]});return prior;
   };
   const roster=read(rosterPath,'ResolvedCharacterSubject');
   if(!roster.presence)fail('GA workspace missing subject roster');
   const character=f(rec(roster.value!,267n),1n);
   if(key(character)!==key(who.character))fail('GA workspace wrong roster subject');
   reads[0]={accessorId:id(1028,'ResolvedCharacterSubject'),path:rosterPath,presence:true,value:character,derivedSources:[roster],transformationId:id(1028,'ResolvedCharacterSubject')};
   const result=workspaceOutput(occurrence,character,d('workspace'),workspace,tasks,at,{
    status(selected){if(key(selected)!==key(taskKey))fail('GA workspace foreign task');return read(taskPath,'accessor/workspace-task-status').value;},
    prediction(){return read(predictionPath,'accessor/measurement-prediction-prior').value;},
   });
   const output=enc(decode(enc(result.output),context));
   return Object.freeze({outputBytes:()=>output.slice(),unavailable:result.unavailable,actualReadRecords:()=>structuredClone(reads)});
  },
 });
}
