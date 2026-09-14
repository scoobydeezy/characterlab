import {describe,it,expect} from 'vitest';
import {text,typedIdentifier,unsigned as u,rational,set,list,canonicalEncode as enc} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {cognitiveRecord as r} from '../campaign2/cognitiveCodecs';
import {workspaceOutput,appraisalOutput,concernOutput} from '../campaign2/cognitiveTransforms';
import {dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {projectPriorConcern,modulatePriorConcern} from '../campaign3/priorConcernFeedback';
const id=(n:number,s:string)=>typedIdentifier(n,text(s)),occ=(n:number)=>typedIdentifier(n,u(1));
const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
const tasks=['a','b'].map(name=>({key:r(371,[C,semanticReferentFromAuthoredContent(governedContentDefinitionId('content/task-'+name))]),specId:id(1027,'definition/task-'+name),activeFrom:1n,deadline:10n}));
function actual(mean=0,capacity=2,access=true){
 const w=workspaceOutput(occ(1128),C,id(1027,'definition/task-workspace'),r(378,[id(1027,'definition/measurement-prediction'),u(capacity),true,access]),tasks,2n,{status:()=>r(372,[u(1)]),prediction:()=>r(361,[rational(mean,1),set([r(237,[u(1),occ(1115)])])])}).output;
 const a=appraisalOutput(occ(1129),w,tasks.map(t=>({taskKey:t.key,specId:t.specId,minimum:Q.of(4n),maximum:Q.of(6n)})));
 return concernOutput(occ(1130),a,r(385,[rational(1,1),true]));
}
describe('actual concern transformation to narrow prior feedback component',()=>{
 it('PCF-A: projected actual concern yields exact later modulation without nested forecast access',()=>{
  const output=actual(),before=enc(output),carry=projectPriorConcern(output,2n);
  expect(carry.kind).toBe('Concern');expect(Object.keys(carry).sort()).toEqual(['concern','kind','response','sourceAt','subject']);
  expect(modulatePriorConcern(carry,C,3n,Q.of(1n,5n),true)).toEqual({sourceStatus:'KnownIntensity',branch:'EnabledKnown',residualPool:Q.of(3n,25n),omegaA:Q.of(7n,5n)});
  expect(enc(output)).toEqual(before);
 });
 it('PCF-B: known zero, unavailable and no selected task keep distinct status at equal baseline numbers',()=>{
  const results=[actual(5),actual(0,2,false),actual(0,0)].map(o=>modulatePriorConcern(projectPriorConcern(o,2n),C,3n,Q.of(1n,5n),true));
  expect(results.map(r=>r.sourceStatus)).toEqual(['KnownIntensity','Unavailable','NoSelectedTask']);
  for(const r of results){expect(r.residualPool).toEqual(Q.of(1n,5n));expect(r.omegaA).toEqual(Q.of(1n));}
 });
 it('PCF-C: disabled feedback preserves actual source status and earlier source bytes',()=>{
  const output=actual(),before=enc(output),carry=projectPriorConcern(output,2n),r=modulatePriorConcern(carry,C,3n,Q.of(1n,5n),false);
  expect(r).toEqual({sourceStatus:'KnownIntensity',branch:'DisabledFeedback',residualPool:Q.of(1n,5n),omegaA:Q.of(1n)});expect(enc(output)).toEqual(before);
 });
 it('PCF-D: same-instant, future and foreign-subject feedback rejects',()=>{
  const carry=projectPriorConcern(actual(),2n);for(const at of [1n,2n])expect(()=>modulatePriorConcern(carry,C,at,Q.of(1n),true)).toThrow('FUTURE_OR_CURRENT');
  const other=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/other'));expect(()=>modulatePriorConcern(carry,other,3n,Q.of(1n),true)).toThrow('SUBJECT');
 });
 it('PCF-E: multiple tasks and substituted response task keys reject instead of aggregating',()=>{
  expect(()=>projectPriorConcern(actual(0,3),2n)).toThrow('SINGLE_TASK');
  const c=rec(actual(),388n),bad=r(388,[f(c,1n),f(c,2n),list([r(387,[tasks[1].key,r(386,[u(2),rational(2,5)])])])]);expect(()=>projectPriorConcern(bad,2n)).toThrow('TASK_BINDING');
 });
 it('PCF-F: out-of-range response cannot clip; projection has detached canonical bytes',()=>{
  const c=rec(actual(),388n),bad=r(388,[f(c,1n),f(c,2n),list([r(387,[tasks[0].key,r(386,[u(2),rational(2,1)])])])]);expect(()=>projectPriorConcern(bad,2n)).toThrow('INTENSITY');
  const carry=projectPriorConcern(c,2n);if(carry.kind!=='Concern')throw Error('test');const before=enc(carry.response);
  (c.fields as Map<bigint,ReturnType<typeof r>>).set(3n,r(386,[u(1)]));expect(enc(carry.response)).toEqual(before);
 });
});
