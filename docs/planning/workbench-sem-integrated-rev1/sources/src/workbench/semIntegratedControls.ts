import {chainFor,identityBindings,recordTypeIds,ACCEPTED_NAMESPACES,OCCURRENCE_NAMESPACES,FIELD_NAMESPACE_ALIASES,NAMESPACE_BY_NAME,originalSource} from './semIntegratedFixture';
import {MINA,DARIUS,GLEN,OBSERVER_AFFORDANCES,TRACK_FEATURES} from '../test/fixtures/phenSem001';
import {CONSUMED_TRACK,OBSERVE,handlerKey,initialState,observeHandler,observerPayload,scheduler} from '../test/fixtures/phenSem001Run';
import {bytesToHex,canonicalEncode,list} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import {negativeDiagnostic} from './semNegativeRecorder';
import {digest} from './canonical';

export async function runSemIntegratedControls(){
 const evidence=async(value:unknown)=>{const exact=negativeDiagnostic(value);return {encoding:'negative-ledger-diagnostic-json/0.1',exact,sha256:await digest(new TextEncoder().encode(exact))};};
 const chains=[];
 for(const observer of [MINA,DARIUS,GLEN]){
  const chain=chainFor(observer),bindings=identityBindings(chain,'<root>');
  const identities=bindings.map(b=>{const expected=NAMESPACE_BY_NAME.get(FIELD_NAMESPACE_ALIASES[b.fieldName]??b.fieldName);return {field:b.fieldName,namespace:String(b.namespaceId),expectedNamespace:expected===undefined?null:String(expected),payloadKind:b.payloadKind,accepted:ACCEPTED_NAMESPACES.has(b.namespaceId),correctField:expected===b.namespaceId,occurrence:OCCURRENCE_NAMESPACES.has(b.namespaceId)};});
  chains.push({observer,canonicalHex:bytesToHex(canonicalEncode(chain)),recordTypes:[...recordTypeIds(chain)].map(String),identities,evidence:await evidence(chain)});
 }
 const affordances=OBSERVER_AFFORDANCES[GLEN].map(a=>({...a,trackLabel:`poisoned/${a.trackLabel}/xyzzy`}));
 const features=Object.fromEntries(OBSERVER_AFFORDANCES[GLEN].map(a=>[`poisoned/${a.trackLabel}/xyzzy`,TRACK_FEATURES[a.trackLabel]??[]]));
 const poisoned=chainFor(GLEN,{affordances,trackFeatures:features,consumedTrackLabel:`poisoned/${CONSUMED_TRACK[GLEN]}/xyzzy`});
 const poison={originalLabels:OBSERVER_AFFORDANCES[GLEN].map(a=>a.trackLabel),poisonedLabels:affordances.map(a=>a.trackLabel),canonicalHex:bytesToHex(canonicalEncode(poisoned)),evidence:await evidence({affordances,features,chain:poisoned})};
 const instance=scheduler(initialState(),new Map([[handlerKey(OBSERVE),observeHandler({failAtSettlement:true})]]));
 instance.schedule({dueAt:simInstant(1n),phase:10n,eventTypeId:OBSERVE,payload:observerPayload(GLEN,1n),dependencies:list([])});
 const capture=()=>{const s=instance.exportQuiescentSnapshot();return {state:negativeDiagnostic(instance.getState()),allocators:negativeDiagnostic(instance.getAllocatorState()),trace:negativeDiagnostic(s.committedTrace),outputs:negativeDiagnostic(s.outputs),status:s.status};};
 const before=capture();let failure='';try{await instance.settleNextInstant();}catch(e){failure=e instanceof Error?e.message:String(e);}if(!failure.includes('injected integrated-instant commit failure'))throw Error('Integrated failure boundary not reached');const after=capture();
 const rollback={failure,before,after,preserved:{state:before.state===after.state,allocators:before.allocators===after.allocators,trace:before.trace===after.trace,outputs:before.outputs===after.outputs}};
 return {version:'sem-integrated-controls/0.1',contract:'semantic-binding/0.1-candidate#SEM-001J',source:originalSource,chains,poison,rollback,scope:'Original SEM-001J chain helpers for Mina, Darius and Glen; Glen-only scaffolding-label poisoning with permitted evidence held fixed. Canonical bytes and typed field namespaces are diagnostic evidence. Chain presence is not a read/write participation trace. Whole-instant rollback executes the original failing scheduler handler and checks committed data; failed status is retained. Document-ledger assertions, remaining shortcut refusals, seven-leaf authority and full acceptance remain separate. No UI or full SEM qualification.'};
}
