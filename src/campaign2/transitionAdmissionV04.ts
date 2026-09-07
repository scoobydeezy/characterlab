/** Construction and output closure for transition-admission/0.4-candidate.
 * Internal shared substrate component. Runtime producer trust/ingress is a separate gate.
 */
import {canonicalEncode,set,type CanonicalValue} from '../substrate/canonicalEncoding';
import {SCHEDULABLE_ORDERING_PHASES,SchedulerContractError} from '../substrate/scheduler';
import {decodeCampaign2,campaign2SchemaByType} from './codecs';
import {compileOccurrenceIdentities} from './occurrenceIdentity';
import {decodeStatePattern} from './stateModel';
import {dataRecord as rec,dataField as f,dataUnsigned as u,dataIdentity as id,dataText as str,dataItems as items,dataKey as key,invalidModel} from './canonicalData';
import type {compileValDeclarations} from './valDeclarations';
import type {compileAdaptationTransitions} from './adaptationTransitions';
type Content=Awaited<ReturnType<ReturnType<typeof compileValDeclarations>['compileContent']>>;
function exactId(value:CanonicalValue,ns:bigint,payload?:string){
  const v=id(value);if(v.namespaceId!==ns||(payload!==undefined&&str(v.payload)!==payload))invalidModel('unadmitted transition identity');return v;
}
function schemaKey(value:CanonicalValue){
  const r=rec(value,254n),type=u(f(r,1n)),version=u(f(r,2n));
  if(campaign2SchemaByType(type).schemaVersion!==version)invalidModel('unsupported transition schema');return `${type}/${version}`;
}
function mapping(value:CanonicalValue){if(typeof value==='boolean'||value.kind!=='map')return invalidModel('requires map');return value.entries;}
const VERSION='transition-admission/0.4-candidate';
export function compileTransitionAdmissionV04(registrationBytes:Uint8Array,singletonBytes:Uint8Array,content:Content){
  return compileSharedAdmission(registrationBytes,singletonBytes,content,false);
}
export function compileTransitionAdmissionV06(v04Bytes:Uint8Array,singletonBytes:Uint8Array,content:Content,adaptation:ReturnType<typeof compileAdaptationTransitions>){
  const v04=items(decodeCampaign2(v04Bytes),'set'),v06=items(decodeCampaign2(adaptation.registrationBytes()),'set');
  for(const v of v04)if(str(f(rec(v,171n),3n))!==VERSION)invalidModel('V04 input collection contains another version');
  return compileSharedAdmission(canonicalEncode(set([...v04,...v06])),singletonBytes,content,true);
}
function compileSharedAdmission(registrationBytes:Uint8Array,singletonBytes:Uint8Array,content:Content,withAdaptation:boolean){
  const singleton=rec(decodeCampaign2(singletonBytes),171n);
  exactId(f(singleton,1n),1027n,'definition/transition-admission');exactId(f(singleton,2n),1023n,'registry/transition-admission');
  if(str(f(singleton,3n))!==VERSION)invalidModel('unsupported V04 admission bundle');
  const bundle=rec(f(singleton,4n),279n),occurrences=compileOccurrenceIdentities(canonicalEncode(f(bundle,3n)),content);
  const knownRoutes=new Set<string>();
  for(const route of items(f(bundle,1n),'set')){
    const r=exactId(route,1026n);if(!['route/character-learning','route/automatic-adaptation'].includes(str(r.payload)))invalidModel('unknown learning route');knownRoutes.add(key(r));
  }
  const registrations=new Map<string,{
    v06:boolean;bytes:Uint8Array;eventKey:string;phase:bigint;input:string;producer:CanonicalValue;outputs:readonly string[];
  }>();
  const events=new Set<string>();
  for(const value of items(decodeCampaign2(registrationBytes),'set')){
    const e=rec(value,171n),kind=exactId(f(e,1n),1009n);exactId(f(e,2n),1023n,'registry/transition-registration');
    const v06=str(f(e,3n))==='transition-admission-extension/0.6-candidate';
    if((v06&&!withAdaptation)||(!v06&&str(f(e,3n))!==VERSION))invalidModel('unsupported transition registration version');
    if(registrations.has(key(kind)))invalidModel('duplicate TransitionKind');
    const r=rec(f(e,4n),v06?318n:272n),d=rec(f(r,3n),v06?319n:271n),ingress=rec(f(r,4n),276n);
    exactId(f(r,1n),1036n);if(!str(f(r,2n)))invalidModel('empty executing seam version');
    const eventKey=key(exactId(f(ingress,1n),1001n)),phase=u(f(ingress,3n));
    if(events.has(eventKey))invalidModel('consumer event type assigned twice');events.add(eventKey);
    if(!SCHEDULABLE_ORDERING_PHASES.some(p=>p===phase))invalidModel('unschedulable consumer phase');
    for(const p of items(f(d,2n),'set'))decodeStatePattern(p);
    const admission=rec(f(d,1n),v06?320n:274n),input=schemaKey(f(admission,1n)),producer=rec(f(admission,2n),v06?321n:275n);
    const outputs=items(f(d,3n),'set').map(o=>schemaKey(f(rec(o,277n),1n)));
    if(v06)outputs.push(schemaKey(f(rec(f(rec(f(r,5n),317n),3n),323n),2n)));
    if(new Set(outputs).size!==outputs.length)invalidModel('duplicate output schema');
    for(const s of [input,...outputs]){const [t,v]=s.split('/').map(BigInt);if(!occurrences.has(t,v))invalidModel('missing required occurrence identity rule');}
    // Structural union decoder already proves the sole NoStateWrites variant and finite rules.
    rec(f(d,4n),v06?322n:273n);
    registrations.set(key(kind),{v06,bytes:canonicalEncode(r),eventKey,phase,input,producer,outputs});
  }
  for(const r of registrations.values()){
    const p=rec(r.producer,r.v06?321n:275n);
    if(u(f(p,1n))===1n){
      exactId(f(p,2n),1036n,'seam/event-truth-to-pre-recognition-experience');
      if(str(f(p,3n))!=='semantic-binding/0.1-candidate#SEM-001H'||r.input!=='227/1')invalidModel('invalid frozen SEM producer');
      const lane=u(f(p,4n)),sourcePhase=lane===1n?14n:124n;
      if(r.phase<sourcePhase)invalidModel('consumer precedes frozen SEM production');
    }else if(u(f(p,1n))===3n){
      if(!r.v06||r.input!=='307/1'||r.phase!==140n)invalidModel('invalid authored producer input');
      exactId(f(p,6n),1027n,'definition/authored-adaptation-facts');
    }else{
      const source=registrations.get(key(exactId(f(p,5n),1009n)));
      if(!source||!source.outputs.includes(r.input))invalidModel('unresolved/incompatible registered producer');
      if(withAdaptation&&source!.v06)invalidModel('initial ADAPT outputs are terminal');
      if(r.phase<source.phase)invalidModel('consumer precedes registered producer');
    }
  }
  const routes=new Map<string,string>();
  for(const [transition,route] of mapping(f(bundle,2n))){
    const t=key(exactId(transition,1009n)),r=key(exactId(route,1026n));
    if(!registrations.has(t)||!knownRoutes.has(r))invalidModel('unresolved transition route');routes.set(t,r);
  }
  for(const [t,r] of registrations){
    if(r.v06&&routes.get(t)!==key(exactId({kind:'typedIdentifier',namespaceId:1026n,payload:{kind:'text',value:'route/automatic-adaptation'}},1026n)))invalidModel('V06 route must be automatic adaptation');
    if(withAdaptation&&!r.v06&&r.phase===140n)invalidModel('ordinary phase-140 registration is forbidden');
  }
  return Object.freeze({
    decode:decodeCampaign2,
    registrations():readonly {transitionKey:string;registration:Uint8Array}[] {
      return [...registrations].map(([transitionKey,r])=>({transitionKey,registration:r.bytes.slice()}));
    },
    occurrenceIdentity(bytes:Uint8Array):CanonicalValue {return occurrences.extract(bytes);},
    routeKeyForTransition(transitionKey:string):string|undefined {return routes.get(transitionKey);},
    registrationForEvent(eventType:CanonicalValue):Uint8Array|undefined {
      const r=[...registrations.values()].find(r=>r.eventKey===key(eventType));return r?.bytes.slice();
    },
    outputClosure(route:CanonicalValue):readonly string[] {
      const result=new Set<string>();for(const [t,r] of routes)if(r===key(route))registrations.get(t)!.outputs.forEach(s=>result.add(s));return [...result].sort();
    },
    validateOutputs(transition:CanonicalValue,outputBytes:readonly Uint8Array[]):readonly CanonicalValue[] {
      const r=registrations.get(key(transition));if(!r)return invalidModel('unknown output-producing transition');
      if(r.v06)invalidModel('V06 output validation requires its closed rule execution result');
      try{
        const outputs=outputBytes.map(decodeCampaign2),schemas:string[]=[],identities=new Set<string>();
        for(const output of outputs){
          if(typeof output==='boolean'||output.kind!=='record')throw Error('domain output must be record');
          const s=`${output.schema.typeId}/${output.schema.schemaVersion}`;
          if(!r.outputs.includes(s)||schemas.includes(s))throw Error('wrong/duplicate output schema');schemas.push(s);
          content.validateRecordRoles(canonicalEncode(output));
          const occurrence=key(occurrences.extract(canonicalEncode(output)));
          if(identities.has(occurrence))throw Error('repeated output occurrence');identities.add(occurrence);
        }
        if(schemas.length!==r.outputs.length)throw Error('missing required domain output');
        return outputs;
      }catch(error){throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION',error instanceof Error?error.message:String(error));}
    },
  });
}
