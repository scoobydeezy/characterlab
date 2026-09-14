import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {adoptMaintenanceGoal} from '../campaign3/bodilyMaintenanceGoal';
import {qualifyGoalOutcome as qualify,deteriorationOnlyQualification as control,projectGoalQualification as project} from '../campaign3/goalOutcomeQualification';
import {settleMaintenanceGoal} from '../campaign3/bodilyMaintenanceGoal';
const r=(n:bigint,d=1n)=>({lower:Q.of(n,d),upper:Q.of(n,d)});
const bounds={lower:Q.of(0n),upper:Q.of(10n)},desired={lower:Q.of(6n),upper:Q.of(8n)};
const input=(before=r(5n),after=r(7n))=>({state:adoptMaintenanceGoal([],{character:'a',goal:'maintain',signal:'alpha',desired,adoptedAt:0n,activeFrom:0n,expiresAt:10n},new Map([['alpha',bounds]])),character:'a',goal:'maintain',signal:'alpha',now:1n,before,after,domains:new Map([['alpha',{kind:'MetricInterval' as const,bounds}]])});
describe('binary goal outcome qualification',()=>{
 it('GQ-A: both directions qualify with distinct provenance; comparator excludes only progress',()=>{for(const [a,b,direction] of [[5n,7n,'MovingCloser'],[7n,9n,'MovingFarther']] as const){const i=input(r(a),r(b)),result=qualify(i);expect(result).toMatchObject({kind:'Qualifies',direction});expect(control(i).kind).toBe(direction==='MovingCloser'?'DoesNotQualify':'Qualifies');expect(control(i).assessment).toEqual(result.assessment);}});
 it('GQ-B: same-distance crossing, indeterminate evidence and absence remain distinct',()=>{expect(qualify(input(r(5n),r(9n)))).toMatchObject({kind:'DoesNotQualify',reason:'SameDistance',assessment:{beforePosition:'BelowGoal',afterPosition:'AboveGoal'}});expect(qualify(input({lower:Q.of(3n),upper:Q.of(5n)},{lower:Q.of(4n),upper:Q.of(6n)}))).toMatchObject({kind:'QualificationUnavailable',reason:'IndeterminateRelation'});expect(qualify({...input(),before:null})).toMatchObject({kind:'QualificationUnavailable',reason:'AssessmentUnavailable',assessment:{reason:'MissingEvidence'}});});
 it('GQ-C: tiny and large definite changes qualify equally, including outside-to-outside progress',()=>{for(const [before,after] of [[r(3n),r(3001n,1000n)],[r(3n),r(4n)],[r(0n),r(7n)]])expect(qualify(input(before,after))).toMatchObject({kind:'Qualifies',direction:'MovingCloser'});expect(qualify(input(r(3n),r(4n))).assessment).toMatchObject({boundary:'NoBoundaryChange',beforePosition:'BelowGoal',afterPosition:'BelowGoal'});});
 it('GQ-D: repetition neither accumulates nor mutates goal state',()=>{const i=input(),before=i.state,result=qualify(i);for(let n=0;n<10;n++)expect(qualify(i)).toEqual(result);expect(i.state).toEqual(before);expect(i.state[0].status).toBe('Open');expect(Object.keys(result).sort()).toEqual(['assessment','direction','kind']);});
});
describe('qualification-only projection',()=>{
 it('GQP-A: numeric basis cannot be recovered from same-direction projections',()=>{
  const a=qualify(input(r(0n),r(7n))),b=qualify(input(r(5n),r(6n)));
  expect(a.assessment).not.toEqual(b.assessment);
  const projected=project(a);expect(projected).toEqual(project(b));
  expect(projected).toEqual({kind:'Qualifies',direction:'MovingCloser'});
  expect(Reflect.ownKeys(projected).sort()).toEqual(['direction','kind']);
  expect(Object.isFrozen(projected)).toBe(true);
  expect(project(qualify(input(r(7n),r(9n))))).toEqual({kind:'Qualifies',direction:'MovingFarther'});
 });
 it('GQP-B: negative and indeterminate results retain meaning without assessment objects',()=>{
  expect(project(qualify(input(r(5n),r(9n))))).toEqual({kind:'DoesNotQualify',reason:'SameDistance'});
  expect(project(control(input()))).toEqual({kind:'DoesNotQualify',reason:'ComparatorExcludesProgress'});
  expect(project(qualify(input({lower:Q.of(3n),upper:Q.of(5n)},{lower:Q.of(4n),upper:Q.of(6n)})))).toEqual({kind:'QualificationUnavailable',reason:'IndeterminateRelation'});
 });
 it('GQP-C: all absence causes survive projection without carrying goal state',()=>{
  const i=input(),d=new Map([['alpha',bounds]]);
  const cases=[
   ['MissingEvidence',{...i,before:null}],
   ['Absent',{...i,state:[]}],
   ['Pending',{...i,state:i.state.map(g=>({...g,activeFrom:2n}))}],
   ['Withdrawn',{...i,state:settleMaintenanceGoal(i.state,'a','maintain',1n,'Withdraw',d)}],
   ['Expired',{...i,now:10n,state:settleMaintenanceGoal(i.state,'a','maintain',10n,'Expire',d)}]
  ] as const;
  for(const [cause,source] of cases){const p=project(qualify(source));expect(p).toEqual({kind:'QualificationUnavailable',reason:'AssessmentUnavailable',cause});expect(Reflect.ownKeys(p).sort()).toEqual(['cause','kind','reason']);expect(Object.isFrozen(p)).toBe(true);}
 });
});
