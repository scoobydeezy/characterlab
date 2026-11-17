import {it,expect,vi} from 'vitest';
import {deriveEncodingRoles,type EncodingSettings} from '../assembled/encoding';
import {attentionFixture} from './attentionFixtures';
import {EventRoleId as R} from '../semanticBinding/eventBindings';
const settings:EncodingSettings={capacity:1,attention:'role-calibrated',multiUnit:true,sharedBindings:true,wideRoles:true,wideUnits:true,multiEvents:true,budgetLaw:'historical-shared',budgetCalibration:'UnitBudget'};
it('permission143: incoming binding cannot nominate its consumer permission',()=>{
 const full=attentionFixture([[R.Actor],[R.Target]]).experience;
 expect(deriveEncodingRoles(full,settings,[100n,101n]).claims).toHaveLength(2);
 const wrong={...full,perceivedBindings:full.perceivedBindings.map(b=>({...b,transformationVersion:'semantic-binding/0.1-candidate#SEM-001A'}))};
 expect(()=>deriveEncodingRoles(wrong,settings,[100n,101n])).toThrow('not admitted');
 console.info('M143 PERMISSION PASS fixed consumer SEM-001C rejects codec-admitted foreign producing seam');
});

import * as encoding from '../assembled/encoding';
import * as eventFiles from '../semanticBinding/perceptualEventFiles';
import {compileCausalRoleModel,deriveCausalRoleEvidence,INITIAL_CAUSAL_ROLE_RULE,resolveAdmissibleEvidenceReference,type ObserverSafeEvidenceOccurrence,type EvidenceConsumerContext} from '../semanticBinding/evidenceProvenance';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {causalRoleEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {fixture,rec,f,uint,items,key,decode,list,text,signed,outputs,exact,type Run,type CanonicalValue} from './fixtures/assembledCarrierObservation';
type Prepared=ReturnType<typeof deriveEncodingRoles>;
const originalModel=compileCausalRoleModel('M143-original-control',[INITIAL_CAUSAL_ROLE_RULE]);
const snap=(r:Run)=>r.snapshot();
async function through(r:Run,at:bigint){for(let n=0;r.snapshot().clock<at;n++){expect(n).toBeLessThan(96);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
async function finish(r:Run,peer?:Run){for(let n=0;n<96;n++){const more=await r.settleNextInstant();if(peer){expect(await peer.settleNextInstant()).toBe(more);exact(r,peer);}if(!more)return;}throw Error('M143 full queue cap');}
const errorCode=(fn:()=>unknown)=>{try{fn();throw Error('accepted forbidden evidence');}catch(e){expect(e).toHaveProperty('code');return (e as {code:string}).code;}};
function correspondence(p:Prepared){
 for(const request of p.requests){
  const expected=deriveCausalRoleEvidence(originalModel,request,0n).evidence,actual=p.claims.filter(c=>c.perceptualReferentId.observerTrackSequence===request.perceptualReferentId.observerTrackSequence&&c.perceptualEventReferentId.observerEventSequence===request.perceptualEventReferentId.observerEventSequence);
  expect(actual.map(c=>({...c,causalRoleEvidenceId:0n}))).toEqual(expected.map(c=>({...c,causalRoleEvidenceId:0n})));
  expect(request.readDomain.permittedEvidenceSchemas).toEqual([{refKind:'perceived-binding',recordSchemaVersion:'perceived-binding/0.1-candidate',producingEpistemicSeamVersion:eventFiles.PERCEPTUAL_EVENT_FILE_CONTRACT_VERSION}]);
 }
 const b=p.experience.perceivedBindings[0],occurrence=p.requests[0].evidenceOccurrences.find(o=>o.ref.kind==='perceived-binding'&&o.ref.perceivedBindingId===b.perceivedBindingId)!,domain=p.requests[0].readDomain;
 const consumer:EvidenceConsumerContext={observerId:p.experience.observerId,occurredAt:p.experience.occurredAt,experienceId:p.experience.experienceId,requiredCarrier:{kind:'continuant-in-event',perceptualReferentId:b.perceptualReferentId,perceptualEventReferentId:b.perceptualEventReferentId}};
 const resolve=(o:ObserverSafeEvidenceOccurrence,c=consumer,d=domain)=>resolveAdmissibleEvidenceReference(occurrence.ref,[o],d,c);
 expect(resolve(occurrence)).toEqual(occurrence);
 const bad:[ObserverSafeEvidenceOccurrence,string][]=[
  [{...occurrence,recordSchemaVersion:'perceived-binding/unknown'},'UNADMITTED_EVIDENCE_SCHEMA'],
  [{...occurrence,producingEpistemicSeamVersion:'semantic-binding/0.1-candidate#SEM-001A'},'UNADMITTED_EVIDENCE_SCHEMA'],
  [{...occurrence,occurredAt:consumer.occurredAt+1n},'FUTURE_EVIDENCE_REFERENCE'],
  [{...occurrence,scope:{...occurrence.scope,experienceId:p.experience.experienceId+1n}},'INVALID_TEMPORAL_SCOPE'],
  [{...occurrence,scope:{...occurrence.scope,carrier:{...consumer.requiredCarrier!,perceptualReferentId:{...b.perceptualReferentId,observerTrackSequence:999n}} as typeof consumer.requiredCarrier}},'INVALID_APPLICABILITY_SCOPE'],
 ];
 for(const[o,code]of bad)expect(errorCode(()=>resolve(o))).toBe(code);
 expect(errorCode(()=>resolve(occurrence,{...consumer,observerId:'observer/foreign',requiredCarrier:undefined}))).toBe('CROSS_OBSERVER_REFERENCE');
 expect(errorCode(()=>resolve(occurrence,consumer,{...domain,temporalScope:'SameWindow'}))).toBe('INVALID_TEMPORAL_SCOPE');
 expect(errorCode(()=>resolve(occurrence,consumer,{...domain,permittedModalityIds:['visual']}))).toBe('INVALID_APPLICABILITY_SCOPE');
 expect(errorCode(()=>resolve(occurrence,consumer,{...domain,permittedFeatureScopeIds:['required-feature']}))).toBe('INVALID_APPLICABILITY_SCOPE');
 expect(errorCode(()=>resolveAdmissibleEvidenceReference(occurrence.ref,[occurrence,occurrence],domain,consumer))).toBe('INVALID_EVIDENCE_REFERENCE');
 expect(errorCode(()=>resolveAdmissibleEvidenceReference({kind:'causal-role',causalRoleEvidenceId:b.perceivedBindingId},[occurrence],domain,consumer))).toBe('UNKNOWN_EVIDENCE_REFERENCE');
 expect(errorCode(()=>compileCausalRoleModel('recursive',[{...INITIAL_CAUSAL_ROLE_RULE,permittedBasisKinds:['causal-role']}]))).toBe('INVALID_CAUSAL_ROLE_MODEL');
 // Explicit same-observer references may be reused by two consumers; hidden ancestry is not a reference.
 expect(resolve(occurrence)).toEqual(resolve(occurrence));expect(errorCode(()=>resolve({...occurrence,hiddenAncestor:'world/private'} as ObserverSafeEvidenceOccurrence))).toBe('FORBIDDEN_TRUTH_LINKAGE');
}
function renamed(p:Prepared){
 const track=(t:typeof p.experience.perceivedBindings[number]['perceptualReferentId'])=>({...t,observerTrackSequence:t.observerTrackSequence+71n});
 const event=(t:typeof p.experience.perceptualEventReferentIds[number])=>({...t,observerEventSequence:t.observerEventSequence+31n});
 const observation=(o:typeof p.experience.supportingObservationIds[number])=>({...o,observationId:o.observationId+4000n});
 const exp={...p.experience,experienceId:p.experience.experienceId+1000n,perceptualEventReferentIds:p.experience.perceptualEventReferentIds.map(event),supportingObservationIds:p.experience.supportingObservationIds.map(observation),
 perceivedBindings:p.experience.perceivedBindings.map(b=>({...b,perceivedBindingId:b.perceivedBindingId+2000n,perceptualReferentId:track(b.perceptualReferentId),perceptualEventReferentId:event(b.perceptualEventReferentId),supportingObservationIds:b.supportingObservationIds.map(observation)}))};
 const actual=deriveEncodingRoles(exp,settings,p.ids.map(i=>i+3000n));
 expect(actual.claims).toEqual(p.claims.map(c=>({...c,causalRoleEvidenceId:c.causalRoleEvidenceId+3000n,experienceId:c.experienceId+1000n,perceptualReferentId:track(c.perceptualReferentId),perceptualEventReferentId:event(c.perceptualEventReferentId),supportingEvidenceRefs:c.supportingEvidenceRefs.map(ref=>ref.kind==='perceived-binding'?{...ref,perceivedBindingId:ref.perceivedBindingId+2000n}:ref)})));
}
it('native143: actual two-lane provenance matches original contracts and rolls forged seams back',async()=>{
 const b=fixture(),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d),captured:Prepared[]=[],original=encoding.deriveEncodingRoles;
 const spy=vi.spyOn(encoding,'deriveEncodingRoles').mockImplementation((...args)=>{const p=original(...args);if(args[0].occurredAt===2n)captured.push(p);return p;});
 try{await through(r,2n);}finally{spy.mockRestore();}
 expect(captured).toHaveLength(2);for(const p of captured){correspondence(p);renamed(p);}
 const trace=outputs(snap(r).trace,160n).filter(t=>{const e=rec(f(t,4n),130n);return key(f(e,2n))===key(signed(2))&&[15n,125n].includes(uint(f(e,3n)));});
 expect(trace).toHaveLength(2);trace.forEach((t,i)=>expect(items(f(t,13n),'list')).toEqual(captured[i].claims.map(causalRoleEvidenceValue)));
 const assessments=items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text('assembled-encoding/0.7'))).map(v=>items(v,'list'));
 expect(assessments.find(a=>uint(f(rec(a[4],227n),3n))===2n)![5]).toEqual(list(captured[1].claims.map(causalRoleEvidenceValue)));
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);await finish(r,restored);
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const before=fault.snapshot(),save=fault.save(),compile=eventFiles.compilePerceivedBindings;let calls=0;
 const bad=vi.spyOn(eventFiles,'compilePerceivedBindings').mockImplementation((...args)=>{const result=compile(...args);if(args[0][0]?.occurredAt===2n&&++calls===6)return {...result,bindings:result.bindings.map(x=>({...x,transformationVersion:'semantic-binding/0.1-candidate#SEM-001A'}))};return result;});
 try{await expect(fault.settleNextInstant()).rejects.toThrow('not admitted');expect(calls).toBeGreaterThanOrEqual(6);expect({...fault.snapshot(),status:before.status}).toEqual(before);}finally{bad.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});await finish(recovered);exact(r,recovered);
 console.info('M143 NATIVE PASS actual two-lane125->130 claims match original; exact permission/schema/observer/time/window/carrier/modality/feature/reference controls; typed ordinal bijection; save2/full queues/forged producer rollback and exact recovery');
},590000);
