/** Internal first-profile codec/bootstrap under campaign2-ordered-input/0.1-candidate.
 * The fixed factory selects this profile from its RulesVersion bundle, never from input shape.
 * This component admits only D's authored source. Other initial kinds require their owning adapter.
 */
import {bytes,canonicalEncode,list,text,signed,unsigned,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createRunIdentity,restoreRunIdentity,type StructuralIdentity} from '../substrate/identity';
import {scheduledEventValue,SaveContractError} from '../substrate/persistence';
import {SchedulerContractError,type ScheduledEvent} from '../substrate/scheduler';
import {simInstant} from '../substrate/time';
import {decodeCampaign2,campaign2Record} from './codecs';
import {decodeProbeReview} from './probeCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as id,dataKey as key} from './canonicalData';
import type {compileValDeclarations} from './valDeclarations';
import type {compileAdaptationDomains} from './adaptationDomains';

export const ORDERED_INPUT_PROFILE='campaign2-ordered-input/0.1-candidate' as const;
export const AUTHORED_FACT_EVENT=typedIdentifier(1001n,text('event/authored-adaptation-fact'));
export const PROBE_INPUT_PROFILE='campaign2-probe-ordered-input/0.1-candidate';
export const PROBE_SOURCE_EVENT=typedIdentifier(1001n,text('event/regulatory-diagnostic-probe'));
export const COGNITIVE_INPUT_PROFILE='campaign2-task-cognitive-ordered-input/0.1-candidate';
export const DELIBERATION_EVENT=typedIdentifier(1001n,text('event/deliberation-opportunity'));
type Content=Awaited<ReturnType<ReturnType<typeof compileValDeclarations>['compileContent']>>;
type Domains=Pick<ReturnType<typeof compileAdaptationDomains>,'hasProcedure'>;
function invalid(message:string):never {throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);}
declare const compilationBrand:unique symbol;
export interface OrderedInputCompilation {readonly [compilationBrand]:true;}
const compilations=new WeakMap<object,{events:readonly ScheduledEvent[];initialState?:CanonicalValue}>();
export function compiledInputSchedule(compilation:OrderedInputCompilation,initialStateBytes:Uint8Array){
  const facts=compilations.get(compilation);if(!facts||facts.initialState===undefined||!sameBytes(canonicalEncode(facts.initialState),initialStateBytes))invalid('initial state differs from admitted run commitment');
  return {events:structuredClone(facts.events),allocators:{nextRuntimeId:0n,nextEventId:BigInt(facts.events.length),nextEventSequence:BigInt(facts.events.length)}};
}
const sameBytes=(a:Uint8Array,b:Uint8Array)=>a.length===b.length&&a.every((v,i)=>v===b[i]);

/** Fixed source adapter capability; kept inside the runtime, never the data-only facade.
 * Its evidence is the compiler's original schedule, not a caller's event-type or payload claim.
 */
export function beginAuthoredSourceInstant(compilation:OrderedInputCompilation,instant:bigint){
  const original=compilations.get(compilation)?.events;if(!original)invalid('missing input compiler authority');
  simInstant(instant);let active=true;const consumed=new Set<bigint>();
  return Object.freeze({
    execute(event:ScheduledEvent,allocator:{allocateRuntimeId():bigint}):CanonicalValue {
      if(!active||event.dueAt!==instant||consumed.has(event.eventId))invalid('expired or repeated authored source execution');
      const expected=original!.find(e=>e.eventId===event.eventId);
      if(key(event.eventTypeId)!==key(AUTHORED_FACT_EVENT))invalid('not an authored adaptation source');
      if(!expected||key(scheduledEventValue(expected))!==key(scheduledEventValue(event)))invalid('event was not created by the admitted input compiler');
      // Every check precedes the sole shared semantic occurrence allocation.
      consumed.add(event.eventId);
      return campaign2Record('AutomaticAdaptationInput',{
        AutomaticAdaptationInputId:typedIdentifier(1118n,unsigned(allocator.allocateRuntimeId())),
        Basis:f(rec(event.payload,304n),1n),OccurredAt:signed(event.dueAt),TransformationVersion:text('adaptation-input/0.31-candidate'),
      });
    },
    close():void {active=false;consumed.clear();},
  });
}

/** Probe source authentication only; this capability cannot allocate or read state. */
export function beginProbeSourceInstant(compilation:OrderedInputCompilation,instant:bigint){
 const original=compilations.get(compilation)?.events;if(!original)invalid('missing input compiler authority');
 let active=true;const used=new Set<bigint>();
 return Object.freeze({admit(event:ScheduledEvent){
  if(!active||event.dueAt!==instant||used.has(event.eventId)||key(event.eventTypeId)!==key(PROBE_SOURCE_EVENT))invalid('invalid probe source execution');
  const expected=original!.find(e=>e.eventId===event.eventId);
  if(!expected||key(scheduledEventValue(expected))!==key(scheduledEventValue(event)))invalid('probe source not in original compilation');
  used.add(event.eventId);
 },close(){active=false;used.clear();}});
}

/** Original cognition authority; identity projection follows admission, never precedes it. */
export function beginCognitiveSourceInstant(compilation:OrderedInputCompilation,instant:bigint){
 const original=compilations.get(compilation)?.events;if(!original)invalid('missing input compiler authority');
 let active=true;const used=new Set<bigint>();
 return Object.freeze({admit(event:ScheduledEvent){
  if(!active||event.dueAt!==instant||used.has(event.eventId)||key(event.eventTypeId)!==key(DELIBERATION_EVENT))invalid('invalid cognitive source execution');
  const expected=original!.find(e=>e.eventId===event.eventId);
  if(!expected||key(scheduledEventValue(expected))!==key(scheduledEventValue(event)))invalid('cognitive source not in original compilation');
  used.add(event.eventId);
 },close(){active=false;used.clear();}});
}

/** Trusted construction component. Selection is an explicit version, not duck typing.
 * The eventual facade must supply the version from its fixed model bundle, not caller options.
 */
export function compileOrderedInputProfile(profileVersion:string,content:Content,domains:Domains,decodeInitialState:(bytes:Uint8Array)=>CanonicalValue=decodeCampaign2){
  if(profileVersion!==ORDERED_INPUT_PROFILE&&profileVersion!==PROBE_INPUT_PROFILE&&profileVersion!==COGNITIVE_INPUT_PROFILE)throw new SchedulerContractError('INVALID_CONFIGURATION','unadmitted ordered-input profile');
  const cognitive=profileVersion===COGNITIVE_INPUT_PROFILE,probe=profileVersion===PROBE_INPUT_PROFILE||cognitive,decodeValue=cognitive?decodeInitialState:probe?decodeProbeReview:decodeCampaign2;
  function decode(inputBytes:Uint8Array){
    const manifest=decodeValue(inputBytes);
    const entries=items(manifest,'list').map(value=>{
      const entry=items(value,'list');if(entry.length!==5)invalid('ordered input requires exactly five positions');
      const [at,phase,eventType,payload,dependencies]=entry;
      if(typeof at==='boolean'||at.kind!=='signed'||typeof phase==='boolean'||phase.kind!=='unsigned')invalid('wrong DueAt/Phase scalar tag');
      const dueAt=simInstant(at.value);
      const isProbe=probe&&key(id(eventType))===key(PROBE_SOURCE_EVENT);
      if(cognitive){
        const deliberation=key(id(eventType))===key(DELIBERATION_EVENT);
        if(!isProbe&&!deliberation)invalid('cognitive profile excludes this original source');
        if(dueAt<=0n||dueAt>(isProbe?99n:100n)||phase.value!==(deliberation?40n:110n))invalid('cognitive original time/phase domain');
        if(key(dependencies)!==key(list([])))invalid('cognitive original requires empty dependencies');
        if(deliberation){const cue=rec(payload,377n);content.validateRecordRoles(canonicalEncode(cue));if(key(f(cue,2n))!==key(typedIdentifier(1027n,text('definition/task-workspace'))))invalid('unresolved cognitive agenda');}
        else if(key(f(rec(payload,333n),1n))!==key(typedIdentifier(1027n,text('definition/regulatory-diagnostic-probe'))))invalid('unresolved probe definition');
        return {dueAt,phase:phase.value,eventTypeId:id(eventType),payload,dependencies};
      }
      if(!isProbe&&key(id(eventType))!==key(AUTHORED_FACT_EVENT))invalid('event type is not admitted as an initial input');
      if(dueAt<=0n||phase.value!==110n)invalid('authored fact requires positive DueAt and phase 110');
      if(key(dependencies)!==key(list([])))invalid('authored fact requires empty-list dependencies');
      if(isProbe){
        if(key(f(rec(payload,333n),1n))!==key(typedIdentifier(1027n,text('definition/regulatory-diagnostic-probe'))))invalid('unresolved probe definition');
        return {dueAt,phase:phase.value,eventTypeId:id(eventType),payload,dependencies};
      }
      const fact=f(rec(payload,304n),1n);
      if(typeof fact==='boolean'||fact.kind!=='record'||![305n,306n].includes(fact.schema.typeId))invalid('wrong authored fact basis');
      content.validateRecordRoles(canonicalEncode(payload));
      content.qualifyCharacter(f(fact,1n));
      const subject=id(f(fact,2n));
      if(fact.schema.typeId===305n){if(subject.namespaceId!==1002n)invalid('exposure requires SemanticReferentId');}
      else if(subject.namespaceId!==1034n||!domains.hasProcedure(subject))invalid('unknown procedure');
      return {dueAt,phase:phase.value,eventTypeId:id(eventType),payload,dependencies};
    });
    if(cognitive){if(entries.length>100||new Set(entries.map(e=>e.dueAt)).size!==entries.length)invalid('cognitive profile requires at most100 exclusive original instants');}
    else if(probe)for(const e of entries.filter(e=>key(e.eventTypeId)===key(PROBE_SOURCE_EVENT)))if(entries.filter(x=>x.dueAt===e.dueAt).length!==1)invalid('probe instant must have exactly one source');
    return {manifest,entries};
  }
  // This function is deliberately private. No partial manifest returns a schedule or source authority.
  function schedule(entries:ReturnType<typeof decode>['entries']):ScheduledEvent[]{
    return entries.map((entry,index)=>({...structuredClone(entry),eventId:BigInt(index),eventSequence:BigInt(index),causalParentEventIds:[]}));
  }
  return Object.freeze({
    /** Rebuild only original source authority; no original state, replay or allocator reset. */
    async restoreAuthority(inputBytes:Uint8Array,runIdentityBytes:Uint8Array){
      const {manifest,entries}=decode(inputBytes),runValue=decodeCampaign2(runIdentityBytes);
      const runIdentity=await restoreRunIdentity(runValue),ordered=await commitManifest(manifest);
      if(key(f(rec(runValue,104n),3n))!==key(bytes(ordered.digest)))throw new SaveContractError('original ordered-input manifest differs from RunIdentity');
      const events=schedule(entries),result={runIdentity,manifestBytes:ordered.canonicalBytes.slice(),initialEvents:events,
        initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(events.length),nextEventSequence:BigInt(events.length)}};
      compilations.set(result,{events:structuredClone(events)});return result as typeof result & OrderedInputCompilation;
    },
    async create(inputBytes:Uint8Array,initialStateBytes:Uint8Array,modelIdentity:StructuralIdentity<'ModelIdentity'>,runSeed:Uint8Array){
      const {manifest,entries}=decode(inputBytes),initial=decodeInitialState(initialStateBytes);
      // Snapshot all inputs before asynchronous hashing; returned copies never own internal state.
      const model=structuredClone(modelIdentity),seed=new Uint8Array(runSeed);
      const ordered=await commitManifest(manifest),state=await commitManifest(initial);
      const runIdentity=await createRunIdentity({modelIdentity:model,initialState:state,orderedInputSequence:ordered,runSeed:seed});
      const events=schedule(entries);
      const result={runIdentity,manifestBytes:ordered.canonicalBytes.slice(),initialEvents:events,
        initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(events.length),nextEventSequence:BigInt(events.length)}};
      compilations.set(result,{events:structuredClone(events),initialState:structuredClone(initial)});
      return result as typeof result & OrderedInputCompilation;
    },
    /** Additional D restore check; the caller must also perform existing save/model/state validation. */
    async validatePending(inputBytes:Uint8Array,runIdentityBytes:Uint8Array,boundary:bigint,pendingQueue:readonly ScheduledEvent[]):Promise<void>{
      try{
      const {manifest,entries}=decode(inputBytes),run=rec(decodeCampaign2(runIdentityBytes),104n);
      const queue=structuredClone(pendingQueue);simInstant(boundary);
      const commitment=await commitManifest(manifest);
      if(key(f(run,3n))!==key(bytes(commitment.digest)))throw new SaveContractError('original ordered-input manifest differs from RunIdentity');
      const expected=schedule(entries).filter(e=>e.dueAt>boundary);
      const pending=queue.filter(e=>key(e.eventTypeId)===key(AUTHORED_FACT_EVENT)||(probe&&key(e.eventTypeId)===key(PROBE_SOURCE_EVENT))||(cognitive&&key(e.eventTypeId)===key(DELIBERATION_EVENT)));
      if(new Set(queue.map(e=>e.eventId)).size!==queue.length||new Set(queue.map(e=>e.eventSequence)).size!==queue.length)
        throw new SaveContractError('duplicate pending event identity/sequence');
      const eventKeys=(events:readonly ScheduledEvent[])=>events.map(e=>key(scheduledEventValue(e))).sort();
      if(JSON.stringify(eventKeys(expected))!==JSON.stringify(eventKeys(pending)))throw new SaveContractError('pending InputOnly events differ from original compiled schedule');
      }catch(error){if(error instanceof SaveContractError)throw error;throw new SaveContractError(error instanceof Error?error.message:String(error));}
    },
  });
}
