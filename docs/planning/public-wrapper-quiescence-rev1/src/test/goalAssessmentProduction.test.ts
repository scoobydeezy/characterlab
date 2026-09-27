import {it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {typedIdentifier,text} from '../substrate/canonicalEncoding';
import {createLocalReserveSource} from '../campaign3/localReserveSource';
import {observeLocalReserveOpportunity} from '../campaign3/localReserveObservation';
import {adoptMaintenanceGoal} from '../campaign3/bodilyMaintenanceGoal';
import {prepareGoalAssessment as prepare,produceGoalAssessment as produce,closeGoalAssessment as close,type PreparedGoalAssessment} from '../campaign3/goalAssessmentProduction';
const observer='observer/a',character='character/a',signal='interoceptive-signal/A',q=(n:bigint)=>Q.of(n),range=(a:bigint,b:bigint)=>({lower:q(a),upper:q(b)});
function observation(available=true,lane:'Current'|'Consequence'='Consequence'){
 const source=createLocalReserveSource(['A','B','C'].map(k=>({key:'local-reserve/'+k,capacity:q(100n),rate:q(0n),amount:q(10n),anchoredAt:0n})),['A','B','C'].map(k=>({channel:'channel/'+k,physical:'local-reserve/'+k,signal:'interoceptive-signal/'+k,width:q(1n),available,permitted:true})));let n=0n;
 return observeLocalReserveOpportunity(source,typedIdentifier(1000,text(observer)),2n,['channel/A'],lane,()=>n++);
}
function inputs(){return {state:adoptMaintenanceGoal([],{character,goal:'maintain',signal,desired:range(30n,40n),adoptedAt:1n,activeFrom:1n,expiresAt:10n},new Map([[signal,range(0n,100n)]])),character,goal:'maintain',signal,now:2n,before:range(0n,1n),after:range(10n,11n),domains:new Map([[signal,{kind:'MetricInterval' as const,bounds:range(0n,100n)}]])};}
it('GAP-A: actual consequence staging allocates one assessment with a narrow qualification carry',()=>{
 const o=observation();let reads=0,allocations=0;const v=prepare(o.staged,observer,2n,()=>{reads++;return inputs();});expect(reads).toBe(1);expect(allocations).toBe(0);const r=produce(v,()=>{allocations++;return 100n;});expect(allocations).toBe(1);if(r.kind!=='Assessment')throw Error('assessment');expect(r.assessment).toMatchObject({assessmentId:100n,consequence:o.opportunityId,at:2n});expect(r.carry.qualification).toEqual({kind:'Qualifies',direction:'MovingCloser'});expect(Object.keys(r.carry).sort()).toEqual(['assessedAt','assessmentId','character','consequence','goal','observer','qualification','transformationVersion']);
});
it('GAP-B: actual observed absence reads no goal or evidence and allocates no substitute ID',()=>{
 const o=observation(false);expect(o.staged).toBeNull();const v=prepare(o.staged,observer,2n,()=>{throw Error('unexpected goal read');});expect(produce(v,()=>{throw Error('unexpected identity');})).toEqual({kind:'NoConsequence',observer,at:2n});expect(()=>produce(v,()=>100n)).toThrow('VIEW');
});
it('GAP-C: actual unavailable assessment remains distinct from no consequence',()=>{
 const o=observation(),v=prepare(o.staged,observer,2n,()=>({...inputs(),before:null})),r=produce(v,()=>100n);if(r.kind!=='Assessment')throw Error('assessment');expect(r.carry.qualification).toEqual({kind:'QualificationUnavailable',reason:'AssessmentUnavailable',cause:'MissingEvidence'});expect(r.assessment.assessmentId).toBe(100n);
});
it('GAP-D: wrong lane, producer, observer, instant and freeze phase reject before content reads',()=>{
 const actual=observation().staged!;const cases=[{s:observation(true,'Current').staged!,o:observer,at:2n},{s:{...actual,experience:{...actual.experience,transformationVersion:'other'}},o:observer,at:2n},{s:actual,o:'observer/b',at:2n},{s:actual,o:observer,at:3n},{s:{...actual,stagedAtPhase:125n},o:observer,at:2n}];let reads=0;for(const c of cases)expect(()=>prepare(c.s,c.o,c.at,()=>{reads++;return inputs();})).toThrow();expect(reads).toBe(0);
});
it('GAP-E: forged, reused, closed and failed-allocation capabilities cannot publish',()=>{
 expect(()=>produce({} as PreparedGoalAssessment,()=>100n)).toThrow('VIEW');const s=observation().staged,v=prepare(s,observer,2n,inputs);expect(()=>produce(v,()=>-1n)).toThrow('ALLOCATION');expect(()=>produce(v,()=>100n)).toThrow('VIEW');const w=prepare(s,observer,2n,inputs);close(w);expect(()=>produce(w,()=>100n)).toThrow('VIEW');
});
it('GAP-F: prepared assessment does not re-read a later changed goal state',()=>{
 const input=inputs(),v=prepare(observation().staged,observer,2n,()=>input);input.state.length=0;const r=produce(v,()=>100n);if(r.kind!=='Assessment')throw Error('assessment');expect(r.carry.qualification).toEqual({kind:'Qualifies',direction:'MovingCloser'});
});
