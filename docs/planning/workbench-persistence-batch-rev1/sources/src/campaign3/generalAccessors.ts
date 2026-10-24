/** Internal compiler for general-attention-registry-member-shape/0.1-candidate
 * and general-attention-recall-projection/0.1-candidate.
 * PRJ uses the authoritative roster; recall views use the canonical erasure.
 * Source authentication and whole-model admission remain the caller's obligation.
 * No caller-provided derived value or derive function is accepted. */
import inventory from '../../docs/planning/GA_REGISTRY_MEMBER_SHAPE_REV1.json';
import {canonicalEncode as enc,list,text,typedIdentifier,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,patternMatches,statePathValue,type StatePath,type StatePathPattern,type ActualReadRecord} from '../substrate/state';
import {validateSemanticReferent} from '../substrate/referentOrigin';
import {dataKey as key,dataRecord as rec,dataField as field,dataUnsigned as uint,dataItems as items,invalidModel as fail} from '../campaign2/canonicalData';
import {decodeGeneralAttention as decode,generalAttentionSchema as schema} from './generalAttentionCodecs';
import {projectCanonicalRecallPartition} from './canonicalRecallProjection';
import {validateGeneralPrimitive,type GeneralPrimitiveContext} from './generalPrimitiveGrammar';
import {signed} from '../substrate/canonicalEncoding';

export interface GeneralAccessorDeclaration {
 readonly member:string;
 readonly path:StatePath;
 readonly resultTypeId:bigint;
 readonly projection:'Identity'|'EventPartition'|'BodyPartition';
}
const prefix='accessor/general-attention-';
function allowed(stage:string):readonly string[]{
 if(['current-event-rank','consequence-event-rank','prior-concern-event-rank'].includes(stage))return ['event-recall-evidence','association-prior','presentations-prior'];
 if(['current-body-rank','consequence-body-rank','goal-baseline-rank'].includes(stage))return ['body-recall-evidence'];
 if(['ordinary-memory-formation','ordinary-memory-use','ordinary-memory-significance','ordinary-memory-retention'].includes(stage))return ['episodes-prior'];
 if(['event-association-formation','event-association-retention'].includes(stage))return ['association-prior'];
 if(['event-presentation-formation','event-presentation-cleanup','event-presentation-owner'].includes(stage))return ['presentations-prior'];
 if(['goal-command-owner','goal-deadline-owner','goal-outcome-assessment'].includes(stage))return ['goals-prior'];
 if(['current-track','consequence-track'].includes(stage))return ['tracking-prior','panel-prior'];
 return [];
}
const accessor=(name:string)=>typedIdentifier(1028,text(name));
const path=(root:bigint,subject:CanonicalValue):StatePath=>({rootStateTypeId:root,fieldId:1n,selectors:[{kind:'mapKey',key:subject}]});

/** Compile only the eight new projections. Existing SEM counters/active files,
 * task/prediction and physical sampling retain their separate inherited compilers.
 * observer/character must already belong to the compiled content domain. */
export function compileGeneralAccessors(stage:string,declarations:readonly GeneralAccessorDeclaration[],readDomain:readonly StatePathPattern[],
 subject:{readonly observer:TypedIdentifierValue;readonly character:TypedIdentifierValue},context:GeneralPrimitiveContext,projectionRequired=false){
 if(!inventory.stages.some(s=>s.name===stage))fail('GA unknown accessor stage');
 const expected=allowed(stage).map(s=>prefix+s),bindings=structuredClone(declarations),domain=structuredClone(readDomain),who=structuredClone(subject),bounds=structuredClone(context);
 validateSemanticReferent(who.character);
 if(who.observer.namespaceId!==1000n||typeof who.observer.payload==='boolean'||who.observer.payload.kind!=='text'||!who.observer.payload.value)fail('GA observer domain');
 if(bindings.length!==expected.length||new Set(bindings.map(b=>b.member)).size!==bindings.length)fail('GA accessor set');
 for(const b of bindings){
  const spec=inventory.accessors.find(a=>a.member===b.member);
  if(!spec||!expected.includes(b.member)||b.resultTypeId!==BigInt(spec.resultTypeId)||b.projection!==spec.projection)fail('GA accessor grammar/consumer');
  const exact=path(BigInt(spec.rootTypeId),spec.key==='CharacterId'?who.character:who.observer);
  if(key(statePathValue(b.path))!==key(statePathValue(exact)))fail('GA accessor root/subject');
  if(!domain.some(p=>patternMatches(p,b.path)))fail('GA accessor outside ReadDomain');
 }
 const characterRead=projectionRequired||bindings.some(b=>inventory.accessors.find(a=>a.member===b.member)!.key==='CharacterId');
 const rosterPath=path(268n,who.observer);
 if(characterRead&&!domain.some(p=>patternMatches(p,rosterPath)))fail('GA subject projection outside ReadDomain');
 const rank=stage.endsWith('-rank'),body=expected.includes(prefix+'body-recall-evidence');
 return Object.freeze({
  /** Only completed, source-authenticated operands may reach this internal method.
   * The nested cue cannot replace the independently supplied admitted observer. */
  construct(state:AuthoritativeState,observer:TypedIdentifierValue,now:bigint,cue?:CanonicalValue,absentConsequence=false){
   if(typeof absentConsequence!=='boolean'||absentConsequence&&stage!=='goal-outcome-assessment')fail('GA absent consequence consumer');
   validateGeneralPrimitive('Instant',signed(now));
   if(key(observer)!==key(who.observer))fail('GA wrong admitted observer');
   const reads:ActualReadRecord[]=[],values=new Map<string,CanonicalValue>();
   if(characterRead){
    const source=state.read(rosterPath);
    if(!source.presence)fail('GA missing subject roster');
    const resolved=field(rec(decode(enc(source.value!),bounds),267n),1n);
    if(key(resolved)!==key(who.character))fail('GA wrong roster subject');
    reads.push({accessorId:accessor('ResolvedCharacterSubject'),path:rosterPath,presence:true,value:resolved,derivedSources:[source],transformationId:accessor('ResolvedCharacterSubject')});
   }
   let available=!absentConsequence;
   if(rank){
    if(cue===undefined)fail('GA missing completed cue');
    const c=rec(decode(enc(cue),bounds),schema(body?'BodySignalCue':'CueEvidence').typeId);
    if(key(field(c,1n))!==key(who.observer))fail('GA foreign cue observer');
    const at=field(c,body?2n:3n);
    if(typeof at==='boolean'||at.kind!=='signed'||at.value!==now)fail('GA cue time');
    available=uint(field(c,body?4n:5n))===1n;
    if(body){
     const signals=items(field(c,5n),'set'),support=items(field(c,6n),'set');
     if(available?(!signals.length||!support.length||!c.fields.has(3n)):(signals.length>0||support.length>0))fail('GA body cue status/evidence');
    }else if(available?(!c.fields.has(4n)||!c.fields.has(6n)||!c.fields.has(7n)):(c.fields.has(6n)||c.fields.has(7n)))fail('GA event cue status/evidence');
   }else if(cue!==undefined)fail('GA cue supplied to non-ranker');
   // Absent cue still performed IDN above, but does not even probe the owner roots.
   if(available)for(const b of bindings){
    const source=state.read(b.path);
    if(!source.presence)fail('GA required owner leaf absent');
    const owner=decode(enc(source.value!),bounds);
    let value:CanonicalValue;
    if(b.projection==='Identity'){rec(owner,b.resultTypeId);value=owner;}
    else value=list(projectCanonicalRecallPartition(owner,who.observer,b.projection==='EventPartition'?'EventContinuant':'Interoceptive',now,bounds));
    values.set(b.member,value);
    reads.push({accessorId:accessor(b.member),path:b.path,presence:true,value,derivedSources:[source],transformationId:accessor(b.member)});
   }
   return Object.freeze({
    read(member:string){const value=values.get(member);if(value===undefined)fail('GA unavailable or undeclared accessor');return decode(enc(value),bounds);},
    actualReadRecords:()=>structuredClone(reads),
   });
  },
 });
}
