import {beforeAll,it,expect} from 'vitest';
import {source,data,decode,items,key,enc} from './fixtures/assembledFormation';
import {C} from './fixtures/campaign2Cognitive';
import {through,outputs} from './fixtures/assembledComparison';
import {list,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath,type StatePatch} from '../substrate/state';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataIdentity as id,dataUnsigned as uint} from '../campaign2/canonicalData';
import {readQ,qValue,choiceAlignment,ZERO} from '../campaign2/cognitiveMath';
import {prepareCharacterModel,createCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {arbitrationOutput} from '../assembled/arbitration';
import {createAssembledRandomSession} from '../assembled/random';
import {intentOutput,expressionOutput} from '../assembled/choice';
import {cognitiveRecord as r} from '../assembled/codecs';
import {ELIGIBILITY,IDENTITY_VERSION,qualifyIdentity,qualificationParts,frozenIdentityExpression,journalPath,withQualifiedIdentityState} from '../assembled/identityEligibility';
import {FORMATION,FORMATION_OWNER,formationPath,formationValue,appendFormation,formationSignals} from '../assembled/formation';
import {SELF,SELF_VERSION,SELF_CONTEXT,selfPath,selfEvidence,selfBelief,appendSelf,projectSelf,createSelfBeliefExecution} from '../assembled/selfBelief';
import {withPerformanceState} from '../assembled/performance';
import {withSkillState,sid,SKILL_OWNER,practiced} from '../assembled/skill';
import {KNOWLEDGE_OWNER} from '../assembled/strategy';
import {LEGACY_TIME_LIMIT as OLD,EXTENDED_TIME_LIMIT as LONG,type TimeLimit} from '../assembled/timeDomain';

// Detached clock components, using the existing formation scenario's actual reasons.
// Seed0, original body/social channels and goals; no learned starting state.
// No public late source, timestamp remapping, new choice claim or corpus credit.
let model:Awaited<ReturnType<typeof compileCharacterModel>>,component:Awaited<ReturnType<typeof compileCharacterState>>,inputs:Awaited<ReturnType<typeof compileCharacterInputs>>,initial:AuthoritativeState;
let originalResolution:CanonicalValue,raw:CanonicalValue,identityOwner:ReturnType<typeof id>;
const qualifications=new Map<bigint,CanonicalValue>();
beforeAll(async()=>{
 const s=source(),d=data();model=await compileCharacterModel(s);component=await compileCharacterState(model);initial=component.initialState(d.initialState);inputs=await compileCharacterInputs(model,component,d);
 const run=await createCharacterRun(await prepareCharacterModel(s),d);await through(run,3n);
 originalResolution=outputs(run.snapshot().outputs,409n)[0];expect(originalResolution).toBeDefined();
 const reasons=f(rec(originalResolution,409n),3n);raw=f(rec(reasons,408n),2n);
 const rows=items(items(decode(model.baseRegistry),'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n);
 const reg=rec(f(rec(rows.find(v=>key(f(rec(v,171n),1n))===key(sid(1009,'TaskIdentityApplicationTransition')))!,171n),4n),450n);
 identityOwner=id(f(rec(f(reg,6n),322n),2n));
 for(const at of [100n,101n,4000n,LONG]){
  const random=createAssembledRandomSession(d.runSeed,undefined,model.taskLimit,model.valueReceiving,model.standingRounding);
  random.begin(at);let resolution:CanonicalValue;
  try{resolution=await arbitrationOutput(f(rec(originalResolution,409n),1n),at,reasons,component.definition('task-arbitration'),random.forResolution(f(rec(originalResolution,409n),1n),reasons),model.configurationEnabled?3:2);random.prepareCommit();random.commit();}finally{random.close();}
  expect(uint(f(rec(f(rec(resolution!,409n),4n),419n),1n))).toBe(3n);
  const expression=expressionOutput(typedIdentifier(1137,u(at)),intentOutput(typedIdentifier(1136,u(at)),resolution!));
  const qualification=qualifyIdentity(typedIdentifier(1138,u(at)),frozenIdentityExpression(expression,at,list([text(ELIGIBILITY),q(1,1),q(0,1),false])));
  expect(qualificationParts(qualification,LONG).accepted).toBe(true);qualifications.set(at,qualification);
 }
},120000);
const qp=()=>journalPath(component.identityKey),fp=()=>formationPath(C),bp=()=>selfPath(C);
function owner(limit:TimeLimit){
 // Remove the inherited journal/numeric pair together at this detached boundary.
 // The new qualified owner below validates both and their exact correspondence.
 const base={...component.stateModel,validateState(s:AuthoritativeState){component.stateModel.validateState(new AuthoritativeState(s.entries().filter(e=>e.path.rootStateTypeId!==415n)));}};
 return withQualifiedIdentityState(withSkillState(withPerformanceState(base,model.strategy!,true,C,undefined,false,false,limit),C,model.procedures,true,false,limit),component.identityKey,identityOwner,limit);
}
function op(s:AuthoritativeState,path:StatePath,newValue:CanonicalValue):StatePatch['operations'][number]{const p=s.read(path);return {kind:'set',path,expected:p.presence?{presence:true,value:p.value!}:{presence:false},newValue};}
function put(sm:ReturnType<typeof owner>,s:AuthoritativeState,p:StatePath,v:CanonicalValue,writer:ReturnType<typeof sid>){return sm.applyPatch(s,{operations:[op(s,p,v)]},writer).state;}
function populated(at:bigint,limit:TimeLimit){
 const sm=owner(limit),qual=qualifications.get(at)!,parts=qualificationParts(qual,limit),formed=appendFormation(undefined,parts.id,at,readQ(parts.contribution),4,limit),observed=projectSelf(qual,true,C,limit)!;
 let s=sm.applyPatch(initial,{operations:[op(initial,qp(),list([text(ELIGIBILITY),list([qual])])),op(initial,{...qp(),fieldId:1n},r(414,[list([parts.numeric])]))]},identityOwner).state;
 s=put(sm,s,fp(),formed.value,FORMATION_OWNER);
 s=put(sm,s,bp(),appendSelf(undefined,observed,C,limit),KNOWLEDGE_OWNER);
 return {sm,s,qual,formed,observed};
}
it('clock160: exact qualification/formation/self history boundaries and owner restore',()=>{
 for(const at of [100n,101n,4000n,LONG]){
  const {sm,s,qual,formed,observed}=populated(at,LONG);
  expect(qualificationParts(qual,LONG).at.value).toBe(at);
  expect(formationValue(sm.read(s,fp()).value,LONG).P).toEqual(formed.after);
  expect(selfEvidence(observed,C,LONG).ticket).toBe(at);
  expect(selfBelief(sm.read(s,bp()).value,C,LONG).history).toEqual([observed]);
  expect(enc(sm.restoreState(enc(s.canonicalValue())).canonicalValue())).toEqual(enc(s.canonicalValue()));
  if(at===OLD){expect(enc(populated(at,OLD).s.canonicalValue())).toEqual(enc(s.canonicalValue()));expect(enc(owner(OLD).restoreState(enc(s.canonicalValue())).canonicalValue())).toEqual(enc(s.canonicalValue()));}
  else{expect(()=>qualificationParts(qual)).toThrow('time');expect(()=>formationValue(formed.value)).toThrow('time');expect(()=>selfEvidence(observed,C)).toThrow('domain');expect(()=>owner(OLD).restoreState(enc(s.canonicalValue()))).toThrow();}
 }
});
it('clock160: widening retains qualification, authority, correspondence, history and count guards',()=>{
 const {sm,s,qual,formed,observed}=populated(4000n,LONG),parts=qualificationParts(qual,LONG);
 expect(()=>put(sm,initial,fp(),formed.value,SKILL_OWNER)).toThrow();
 expect(()=>put(sm,initial,bp(),appendSelf(undefined,observed,C,LONG),FORMATION_OWNER)).toThrow();
 expect(()=>sm.applyPatch(initial,{operations:[op(initial,fp(),formed.value)]},FORMATION_OWNER,{writableRoots:[1500n],targetPaths:[fp()]})).toThrow('scope');
 expect(()=>sm.applyPatch(initial,{operations:[op(initial,qp(),s.read(qp()).value!)]},identityOwner)).toThrow('joint');
 expect(()=>sm.validateState(new AuthoritativeState(s.entries().filter(e=>!(e.path.rootStateTypeId===415n&&e.path.fieldId===1n))))).toThrow('presence');
 const mismatched=new AuthoritativeState(s.entries().map(e=>e.path.rootStateTypeId===415n&&e.path.fieldId===1n?{...e,value:r(414,[list([qualificationParts(qualifications.get(101n)!,LONG).numeric])])}:e));
 expect(()=>sm.validateState(mismatched)).toThrow('equality');
 for(const [p,writer]of [[fp(),FORMATION_OWNER],[bp(),KNOWLEDGE_OWNER]] as const)expect(()=>put(sm,s,p,s.read(p).value!,writer)).toThrow();
 const rejected=qualifyIdentity(parts.id,frozenIdentityExpression(parts.expression,4000n,list([text(ELIGIBILITY),q(1,1),q(1,2),false])));
 expect(qualificationParts(rejected,LONG).accepted).toBe(false);expect(projectSelf(rejected,true,C,LONG)).toBeUndefined();
 expect(projectSelf(qual,false,C,LONG)).toBeUndefined();expect(()=>projectSelf(qual,true,list([]),LONG)).toThrow('subject');
 expect(()=>appendSelf(s.read(bp()).value,observed,C,LONG)).toThrow('order');
 expect(()=>appendFormation(formed.value,typedIdentifier(1138,u(4001)),4001n,readQ(q(1,1)),0,LONG)).toThrow('phase');
 for(const at of [0n,LONG+1n]){
  expect(()=>appendFormation(undefined,parts.id,at,readQ(parts.contribution),4,LONG)).toThrow('time');
  const a=[...items(observed,'list')];a[4]=u(at);expect(()=>selfEvidence(list(a),C,LONG)).toThrow('domain');
 }
 const entry=[...items(formed.entry,'list')];entry[4]=q(99,1);expect(()=>formationValue(list([text(FORMATION),list([list(entry)]),qValue(formed.after)]),LONG)).toThrow('gain');
 let full:CanonicalValue|undefined;
 for(let n=1;n<=16;n++)full=appendFormation(full,typedIdentifier(1138,u(n)),4000n+BigInt(n),readQ(q(1,1)),4,LONG).value;
 expect(()=>appendFormation(full,typedIdentifier(1138,u(17)),4017n,readQ(q(1,1)),4,LONG)).toThrow('capacity');
 expect(()=>practiced(readQ(q(1,1)),100n,4)).toThrow('count');
 const invalid=101n as TimeLimit;expect(()=>owner(invalid)).toThrow('time domain');expect(()=>qualificationParts(qual,invalid)).toThrow('time domain');expect(()=>formationValue(undefined,invalid)).toThrow('time domain');expect(()=>selfBelief(undefined,C,invalid)).toThrow('time domain');
});
function event(at:bigint,phase:bigint,eventId:bigint,payload:CanonicalValue,type=sid(1001,'event/task-appraisal'),parents:bigint[]=[]):ScheduledEvent{return {dueAt:simInstant(at),phase,eventId,eventSequence:eventId,eventTypeId:type,payload,dependencies:list([]),causalParentEventIds:parents};}
function selfHandler(sm:ReturnType<typeof owner>,originals:ScheduledEvent[]){return createSelfBeliefExecution(C,sm,originals,model.modelIdentity.value,inputs.runIdentity.value,LONG);}
it('clock160: permitted late self evidence reaches live later appraisal with exact continuation',()=>{
 const qual=qualifications.get(4000n)!,parts=qualificationParts(qual,LONG),arms=[];
 for(const visible of [true,false]){
  const sm=owner(LONG),context=event(4000n,30n,1n,list([text(SELF),visible,signed(1)]),SELF_CONTEXT),h=selfHandler(sm,[context]);
  h.begin(4000n);h.context(context);const prior=h.appraise(event(4000n,50n,2n,list([])),initial);
  expect(items(prior.report,'list')[5]).toEqual(u(0));expect(items(prior.report,'list')[6]).toEqual(list([]));
  h.decision(event(4000n,80n,3n,list([]),sid(1001,'event/task-arbitration')),parts.resolution);
  const projected=h.project(event(4000n,130n,4n,qual),qual),learn=event(4000n,140n,5n,qual,sid(1001,'event/task-identity-application'),[4n]);
  h.preflight(learn);const candidate=h.prepare(learn,initial),applied=sm.applyPatch(initial,candidate.patch,KNOWLEDGE_OWNER);
  expect(f(rec(candidate.trace(applied.diffs),160n),6n)).toEqual(text(SELF_VERSION+'+time-domain/0.1-candidate'));
  expect(projected.report!==undefined).toBe(visible);h.prepareCommit();h.close();
  const restored=sm.restoreState(enc(applied.state.canonicalValue()));
  function appraisal(s:AuthoritativeState,at=4001n){const c=event(at,30n,10n,list([text(SELF),true,signed(1)]),SELF_CONTEXT),later=selfHandler(sm,[c]);later.begin(at);later.context(c);try{return later.appraise(event(at,50n,11n,list([])),s);}finally{later.close();}}
  const live=appraisal(applied.state),replayed=appraisal(restored);
  expect(enc(live.report)).toEqual(enc(replayed.report));expect(enc(live.trace())).toEqual(enc(replayed.trace()));
  const a=items(live.report,'list');expect(a[5]).toEqual(u(visible?1:0));expect(a[6]).not.toBeUndefined();
  if(visible){expect(a[4]).not.toEqual(list([]));expect(a[6]).not.toEqual(list([]));expect(()=>appraisal(applied.state,4000n)).toThrow('same-instant');}
  else{expect(a[4]).toEqual(list([]));expect(a[6]).toEqual(list([]));}
  arms.push(live.report);
 }
 expect(key(arms[0])).not.toBe(key(arms[1]));
 console.info('M160 self4000 permitted/withheld -> live appraisal4001, unknown preserved, same-instant rejected, exact restored consumer/trace PASS');
});
it('clock160: late event-time formation changes existing reasons with original support',()=>{
 const {sm,s,formed}=populated(4000n,LONG),prior=sm.read(s,fp()).value,received=formationSignals(raw,prior,true,LONG),disabled=formationSignals(raw,prior,false,LONG);
 const standing=(v:CanonicalValue)=>items(f(rec(v,403n),3n),'set').filter(x=>uint(f(rec(f(rec(x,402n),1n),401n),3n))===3n);
 const rows=standing(received.output);expect(rows.length).toBeGreaterThan(0);expect(standing(disabled.output)).toEqual([]);
 const meaning=f(rec(raw,403n),4n);if(typeof meaning==='boolean'||meaning.kind!=='map')throw Error('meaning');
 const semantics=new Map(meaning.entries.map(([c,v])=>[key(c),readQ(v)]));
 for(const row of rows){const signal=rec(row,402n),candidate=f(rec(f(signal,1n),401n),1n),expected=formed.after.multiply(choiceAlignment(candidate,semantics));expect(expected.equals(ZERO)).toBe(false);expect(f(signal,2n)).toEqual(qValue(expected));}
 expect(items(received.report,'list')[4]).toEqual(list([qualificationParts(qualifications.get(4000n)!,LONG).id]));
 expect(formationSignals(raw,sm.restoreState(enc(s.canonicalValue())).read(fp()).value,true,LONG)).toEqual(received);
 expect(()=>formationSignals(received.output,prior,true,LONG)).toThrow('duplicate old standing');
 console.info('M160 formation4000 -> exact existing standing, frozen support and disabled-zero control; restore PASS');
});
