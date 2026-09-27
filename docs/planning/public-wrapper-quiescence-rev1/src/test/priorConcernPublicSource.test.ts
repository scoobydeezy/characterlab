/** Public C2 producer evidence + component projection; not a public cross-run GA join. */
import {beforeAll,it,expect} from 'vitest';
import registryHex from '../../docs/planning/campaign2-task-cognitive-model/registry.cenc.hex?raw';
import contentHex from '../../docs/planning/campaign2-task-cognitive-model/content.cenc.hex?raw';
import parameterHex from '../../docs/planning/campaign2-task-cognitive-model/parameters.cenc.hex?raw';
import {canonicalEncode as enc,list,set,record,text,typedIdentifier,unsigned as u,signed,rational} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {taskModelReviewSource} from '../campaign2/taskModelReview';
import {cognitiveRecord as r,decodeCognitive as decode} from '../campaign2/cognitiveCodecs';
import {prepareCognitiveModel,createCognitiveRun,type CognitiveModel} from '../campaign2/cognitiveFactory';
import {dataField as f,dataRecord as rec,dataItems as items} from '../campaign2/canonicalData';
import {projectPriorConcern,modulatePriorConcern} from '../campaign3/priorConcernFeedback';
const hex=(s:string)=>Uint8Array.from(s.trim().match(/../g)!.map(v=>parseInt(v,16)));
const id=(ns:number,s:string)=>typedIdentifier(ns,text(s)),C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
// Select the existing frozen workspace-two cohort by its exact declaration change.
function workspaceTwoRegistry(){const slots=items(decode(hex(registryHex)),'list');return enc(list(slots.map((slot,i)=>i?slot:set(items(slot,'set').map(v=>{if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;const body=f(v,4n);if(typeof body==='boolean'||body.kind!=='record'||body.schema.typeId!==378n)return v;const next=record(body.schema,new Map([...body.fields,[2n,u(2)]]));return record(v.schema,new Map([...v.fields,[4n,next]]));})))));}
let model:CognitiveModel;
beforeAll(async()=>{model=await prepareCognitiveModel({...taskModelReviewSource(),rulesVersion:'rules/campaign2-task-cognitive/0.1-candidate',registrySchemaVersion:'campaign2-task-cognitive-registry/0.1-candidate',numericProfileVersion:'numeric/task-cognitive-exact/0.1-candidate',content:hex(contentHex),registry:workspaceTwoRegistry(),parameters:hex(parameterHex)});});
function data(displacement:number){
 const state=new AuthoritativeState([
  {path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:id(1000,'observer/bridge-subject')}]},value:r(267,[C])},
  ...(displacement?[{path:{rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey' as const,key:r(294,[C,id(1029,'variable/fixture-regulation')])}]},value:r(299,[signed(displacement)])}]:[]),
  ...['a','b'].flatMap((n,i)=>{const key=r(371,[C,semanticReferentFromAuthoredContent(governedContentDefinitionId('content/task-'+n))]);return [
   {path:{rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey' as const,key}]},value:r(372,[u(1)])},
   {path:{rootStateTypeId:373n,fieldId:2n,selectors:[{kind:'mapKey' as const,key}]},value:r(390,[id(1027,'definition/task-instruction-'+(i?'two':'one'))])}
  ];})]);
 return {initialState:enc(state.canonicalValue()),orderedInputs:enc(list([
  list([signed(1),u(110),id(1001,'event/regulatory-diagnostic-probe'),r(333,[id(1027,'definition/regulatory-diagnostic-probe')]),list([])]),
  list([signed(2),u(40),id(1001,'event/deliberation-opportunity'),r(377,[id(1000,'observer/bridge-subject'),id(1027,'definition/task-workspace')]),list([])])
 ])),runSeed:new Uint8Array(32)};
}
for(const [displacement,mean,intensity] of [[-50,0,2],[0,5,0],[50,10,2]] as const){
 it(`PCS-${mean}: public source and bounded continuation at positive instants`,async()=>{
  const run=await createCognitiveRun(model,data(displacement));expect(await run.settleNextInstant()).toBe(true);expect(run.snapshot().clock).toBe(1n);
  const before=run.snapshot(),first=items(decode(before.outputs),'list');expect(first.some(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===388n)).toBe(false);
  const learned=restoreAuthoritativeState(decode(before.state)).entries().find(e=>e.path.rootStateTypeId===362n);expect(learned).toBeDefined();expect(f(rec(learned!.value,361n),1n)).toEqual(rational(mean,1));
  if(mean===10){await expect(run.settleNextInstant()).rejects.toMatchObject({code:'ADAPTATION_REFERENCE_OUT_OF_RANGE'});expect(run.snapshot().state).toEqual(before.state);expect(run.snapshot().outputs).toEqual(before.outputs);expect(run.snapshot().trace).toEqual(before.trace);return;}
  expect(await run.settleNextInstant()).toBe(true);expect(run.snapshot().clock).toBe(2n);
  const outputs=items(decode(run.snapshot().outputs),'list'),concerns=outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===388n);expect(concerns).toHaveLength(1);
  const concern=rec(concerns[0],388n),appraisal=rec(f(concern,2n),384n),workspace=rec(f(appraisal,2n),381n),forecast=rec(f(workspace,5n),380n);
  if(mean===5){expect(items(f(workspace,4n),'list')).toHaveLength(0);expect(f(forecast,1n)).toEqual(u(1));const carry=projectPriorConcern(concern,2n);expect(carry.kind).toBe('NoSelectedTask');expect(modulatePriorConcern(carry,C,3n,Q.of(1n,5n),true).sourceStatus).toBe('NoSelectedTask');return;}
  const prediction=rec(f(forecast,2n),361n);
  expect(f(prediction,1n)).toEqual(rational(mean,1));expect(items(f(prediction,2n),'set')).toHaveLength(1);expect(f(workspace,2n)).toEqual(C);
  const carry=projectPriorConcern(concern,2n),feedback=modulatePriorConcern(carry,C,3n,Q.of(1n,5n),true);
  expect(feedback.sourceStatus).toBe('KnownIntensity');expect(feedback.omegaA).toEqual(Q.of(BigInt(5+intensity),5n));
  expect(()=>modulatePriorConcern(carry,C,2n,Q.of(1n,5n),true)).toThrow('FUTURE_OR_CURRENT');
 },30000);
}
