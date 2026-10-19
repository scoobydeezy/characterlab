/** Exact inherited task-commitment/0.2-candidate deadline owner. */
import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {AuthoritativeState,type StatePath,type StatePatch,type ActualReadRecord} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataKey as key,invalidModel as fail,type RecordValue} from '../campaign2/canonicalData';
import {taskDeadlineValue} from '../campaign2/taskExecution';
import {generalRecord as r,generalSubject,generalDefinitionId as d,generalContentId as c,generalId as id} from './generalBindingProfile';
export function compileGeneralTaskOwner(definitions:ReadonlyMap<string,RecordValue>){
 const who=generalSubject(),definition=rec(f(definitions.get(key(d('task')))!,4n),370n),deadline=f(definition,6n);if(typeof deadline==='boolean'||deadline.kind!=='signed')fail('GA task deadline');
 const target=r(371,[who.character,semanticReferentFromAuthoredContent(c('task'))]),path:StatePath={rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:target}]};
 return Object.freeze({at:deadline.value,payload:()=>structuredClone(target),deadline(state:AuthoritativeState,payload:CanonicalValue,now:bigint){
  if(now!==deadline.value||key(payload)!==key(target))fail('GA task deadline original');const prior=state.read(path),value=taskDeadlineValue(prior.value);
  const patch:StatePatch={operations:value===undefined?[]:[{kind:'set',path,expected:{presence:true,value:prior.value!},newValue:value}]};
  const reads:ActualReadRecord[]=[{accessorId:id(1028,'accessor/task-commitment-prior'),...prior,derivedSources:[]}];
  return {patch:()=>structuredClone(patch),actualReadRecords:()=>structuredClone(reads)};
 }});
}
