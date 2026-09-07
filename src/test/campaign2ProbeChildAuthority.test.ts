import {it,expect} from 'vitest';
import {list,signed,unsigned,text,typedIdentifier} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {simInstant} from '../substrate/time';
import {compileProbeModel} from '../campaign2/probeModel';
import {probeModelReviewSource} from '../campaign2/probeModelReview';
import {PROBE_SUCCESSOR_RULES} from '../campaign2/probeSuccessorReview';
import {probeRecord} from '../campaign2/probeCodecs';
import {PROBE_SOURCE_EVENT} from '../campaign2/orderedInputs';

it('PROBE-J: exact admitted children reject altered carriers, occurrence, phase, parents and replay',async()=>{
 const {probe}=await compileProbeModel({...probeModelReviewSource(),rulesVersion:PROBE_SUCCESSOR_RULES});
 const source={eventId:0n,eventSequence:0n,dueAt:simInstant(4n),phase:110n,eventTypeId:PROBE_SOURCE_EVENT,payload:probeRecord(333,[probe.definitionId]),dependencies:list([]),causalParentEventIds:[]};
 const state=new AuthoritativeState([]);
 for(const mode of ['payload','eventId','sequence','time','phase','kind','parents','dependencies']){
  const execution=probe.begin(4n);let n=0n;const allocator={allocateRuntimeId:()=>n++};
  const result=execution.execute(source,state,allocator),child={...result.plan.emissions()[0],eventId:1n,eventSequence:1n,causalParentEventIds:[0n]};
  const forged={...child,...({payload:{payload:probeRecord(335,[unsigned(1)])},eventId:{eventId:9n},sequence:{eventSequence:9n},time:{dueAt:simInstant(5n)},phase:{phase:121n},kind:{eventTypeId:PROBE_SOURCE_EVENT},parents:{causalParentEventIds:[9n]},dependencies:{dependencies:list([signed(9)])}}[mode])};
  expect(()=>execution.execute(forged,state,allocator)).toThrow();expect(n).toBe(1n);
  result.plan.bindAllocatedChildren([child]);
  expect(()=>execution.execute(forged,state,allocator)).toThrow();expect(n).toBe(1n);
  const observed=execution.execute(child,state,allocator);expect(observed.outputs).toHaveLength(1);expect(n).toBe(3n);
  expect(()=>execution.execute(child,state,allocator)).toThrow();expect(()=>result.plan.bindAllocatedChildren([child])).toThrow();
  expect(()=>execution.execute(source,state,allocator)).toThrow();execution.abort();expect(()=>execution.execute(child,state,allocator)).toThrow();
 }
 // A matching shape with the wrong definition cannot be associated with the source's emission.
 const execution=probe.begin(4n);let n=0n;
 const result=execution.execute(source,state,{allocateRuntimeId:()=>n++});
 const wrong={...result.plan.emissions()[0],payload:probeRecord(333,[typedIdentifier(1027,text('definition/forged'))]),eventId:1n,eventSequence:1n,causalParentEventIds:[0n]};
 expect(()=>result.plan.bindAllocatedChildren([wrong])).toThrow();execution.abort();
});
