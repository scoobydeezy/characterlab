/** Actual RNG/decision components. Generated public runtime qualification remains separate. */
import {describe,it,expect} from 'vitest';
import {list,set,text,typedIdentifier,unsigned as u,rational,canonicalEncode as enc,record} from '../substrate/canonicalEncoding';
import registryHex from '../../docs/planning/campaign2-task-cognitive-model/registry.cenc.hex?raw';
import {restoreObservationChannel,validatePermittedEvidenceRecordClosure} from '../observation/observation';
import {simInstant} from '../substrate/time';
import {compileProtocolObservation} from '../campaign2/protocolObservation';
import {compileProtocolBridge} from '../campaign2/protocolBridge';
import type {ScheduledEvent} from '../substrate/scheduler';
import {compileBridgeObservation} from '../campaign2/bridgeObservation';
import {ExactRational as Q} from '../substrate/exactMath';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {cognitiveRecord as r,decodeCognitive} from '../campaign2/cognitiveCodecs';
import {appraisalOutput,concernOutput,motiveOutput,candidateOutput,rawSignalOutput} from '../campaign2/cognitiveTransforms';
import {compileReasonNuclei} from '../campaign2/cognitiveMath';
import {createCognitiveRandomSession,arbitrationOutput} from '../campaign2/cognitiveArbitration';
import {intentOutput,expressionOutput,qualificationOutput,planOutput,attemptOutput,executionOutput} from '../campaign2/cognitiveChoice';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataKey as key} from '../campaign2/canonicalData';
const id=(n:number,s:string)=>typedIdentifier(n,text(s)),occ=(n:number)=>typedIdentifier(n,u(1));
const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
function fixture(alias=false,equal=false){
 const tasks=['a','b'].map(name=>({key:r(371,[C,semanticReferentFromAuthoredContent(governedContentDefinitionId('content/task-'+name))]),specId:id(1027,'definition/task-'+name)}));
 const workspace=r(381,[occ(1128),C,id(1027,'definition/task-workspace'),list(tasks.map(t=>r(379,[t.key,t.specId]))),r(380,[u(2),r(361,[rational(0,1),set([r(237,[u(1),typedIdentifier(1115,u(1))])])])])]);
 const criteria=tasks.map((t,i)=>({taskKey:t.key,specId:t.specId,minimum:Q.of(BigInt(4+(equal?0:i))),maximum:Q.of(BigInt(6+(equal?0:i)))}));
 const motive=motiveOutput(occ(1131),concernOutput(occ(1130),appraisalOutput(occ(1129),workspace,criteria),r(385,[rational(1,1),true])),r(392,[rational(1,10),true]));
 const candidates=candidateOutput(occ(1132),motive,true,t=>({instructionId:id(1027,'definition/task-instruction-one'),actionId:id(1027,'definition/protocol-contact-'+(alias||key(t)===key(tasks[0].key)?'one':'two'))}));
 const raw=rawSignalOutput(occ(1133),candidates,false,Q.of(1n,10n),()=>undefined).output;
 const dice=r(437,[r(438,[1,2,3,4,5].map(n=>rational(n,5))),rational(37,100),r(439,[rational(1,1),u(3)]),r(439,[rational(1,1),u(3)])]);
 const nuclei=compileReasonNuclei(items(f(rec(raw,403n),3n),'set'),dice);
 return {context:r(408,[occ(1134),raw,list(nuclei)]),nuclei,definition:r(440,[rational(1,2),rational(1,2)])};
}
describe('task arbitration with actual addressed RNG',()=>{
 it('records genuine reason-face transcripts sharing the reserved output root',async()=>{
  const t=fixture(),session=createCognitiveRandomSession(new Uint8Array(32));session.begin();
  const result=rec(await arbitrationOutput(occ(1135),2n,t.context,t.definition,session.forResolution(occ(1135),t.context)),409n),data=rec(f(rec(f(result,4n),419n),2n),420n);
  expect(uint(f(data,8n))).toBe(3n);expect(items(f(data,2n),'list').map(v=>f(rec(v,421n),2n))).toEqual([rational(1,2),rational(1,2)]);
  const draws=items(f(data,9n),'list');expect(draws).toHaveLength(2);
  for(const reason of draws){const draw=rec(f(rec(reason,422n),5n),411n),address=rec(f(draw,1n),110n);expect(f(address,1n)).toEqual(occ(1135));expect(uint(f(draw,4n))).toBe(4n);expect(items(f(draw,7n),'list').length).toBeGreaterThan(0);}
  session.prepareCommit();session.commit();session.close();expect(session.committedAddressKeys().length).toBeGreaterThanOrEqual(2);
 });
 it('discards post-draw failure addresses and repeats exact bytes on fresh retry',async()=>{
  const t=fixture(),session=createCognitiveRandomSession(new Uint8Array(32));session.begin();const first=await arbitrationOutput(occ(1135),2n,t.context,t.definition,session.forResolution(occ(1135),t.context));session.close();
  expect(session.committedAddressKeys()).toEqual([]);session.begin();const retry=await arbitrationOutput(occ(1135),2n,t.context,t.definition,session.forResolution(occ(1135),t.context));expect(enc(retry)).toEqual(enc(first));session.prepareCommit();session.commit();session.close();
 });
 it('rejects stale capabilities and committed duplicate addresses',async()=>{
  const t=fixture(),session=createCognitiveRandomSession(new Uint8Array(32));session.begin();const old=session.forResolution(occ(1135),t.context);await old.reason(t.nuclei[0]);session.prepareCommit();session.commit();session.close();
  session.begin();await expect(old.reason(t.nuclei[1])).rejects.toThrow('expired');const current=session.forResolution(occ(1135),t.context);await expect(current.reason(t.nuclei[0])).rejects.toThrow('repeated');session.close();
 });
 it('rejects a lookalike nucleus rather than granting a generic draw oracle',async()=>{
  const t=fixture(),session=createCognitiveRandomSession(new Uint8Array(32));session.begin();const cap=session.forResolution(occ(1135),t.context);await expect(cap.reason(r(408,[occ(1134),f(rec(t.context,408n),2n),list([])]))).rejects.toThrow('unauthenticated');session.close();expect(session.committedAddressKeys()).toEqual([]);
 });
 it('keeps frozen meaning and eligible evidence identical when execution is blocked',async()=>{
  const t=fixture(),session=createCognitiveRandomSession(new Uint8Array(32));session.begin();const resolution=await arbitrationOutput(occ(1135),2n,t.context,t.definition,session.forResolution(occ(1135),t.context));
  const intent=intentOutput(occ(1136),resolution),expression=expressionOutput(occ(1137),intent),qualification=qualificationOutput(occ(1138),expression);
  expect(uint(f(rec(f(rec(qualification,429n),3n),430n),1n))).toBe(1n);
  const attempt=attemptOutput(occ(1140),planOutput(occ(1139),intent,r(391,[u(2)]))),allowed=executionOutput(occ(1141),attempt,true),blocked=executionOutput(occ(1141),attempt,false);
  expect(f(rec(allowed,433n),3n)).toEqual(u(2));expect(f(rec(blocked,433n),3n)).toEqual(u(0));
  expect(f(rec(allowed,433n),2n)).toEqual(f(rec(blocked,433n),2n));expect(enc(qualificationOutput(occ(1138),expression))).toEqual(enc(qualification));session.close();
 });
 it.each([[false,true,2n],[true,false,1n]] as const)('rejects equal meaning/zero authorship in its frozen priority (alias=%s equal=%s)',async(alias,equal,reason)=>{
  const t=fixture(alias,equal),session=createCognitiveRandomSession(new Uint8Array(32));session.begin();const resolution=await arbitrationOutput(occ(1135),2n,t.context,t.definition,session.forResolution(occ(1135),t.context));
  const qualification=qualificationOutput(occ(1138),expressionOutput(occ(1137),intentOutput(occ(1136),resolution))),result=rec(f(rec(qualification,429n),3n),430n);
  expect(uint(f(result,1n))).toBe(2n);expect(uint(f(result,4n))).toBe(reason);expect(result.fields.size).toBe(2);session.close();
 });
 it.each([0,1,2])('uses the actual generic observer for completed=%s without leaking execution identity',async completed=>{
  const rows=items(items(decodeCognitive(Uint8Array.from(registryHex.trim().match(/../g)!.map(x=>parseInt(x,16)))),'list')[0],'set');
  const row=rows.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(id(1027,'definition/protocol-observation')))!;
  const definition=rec(f(rec(row,171n),4n),451n),channel=restoreObservationChannel(f(definition,3n));
  const t=fixture(),session=createCognitiveRandomSession(new Uint8Array(32));session.begin();const resolution=await arbitrationOutput(occ(1135),2n,t.context,t.definition,session.forResolution(occ(1135),t.context));
  const attempt=attemptOutput(occ(1140),planOutput(occ(1139),intentOutput(occ(1136),resolution),r(391,[u(completed||1)]))),outcome=executionOutput(occ(1141),attempt,completed!==0);
  const safe=rec(compileProtocolObservation(outcome,channel,typedIdentifier(1115,u(7)),simInstant(2n)),203n),interval=rec(f(safe,6n),204n);
  expect(f(interval,2n)).toEqual(rational(completed,1));expect(f(interval,3n)).toBe(completed!==2);expect(f(safe,10n)).toEqual(list([]));expect(f(safe,11n)).toEqual(text('protocol-consequence-observation/0.1-candidate'));
  expect(()=>decodeCognitive(enc(safe))).not.toThrow();
  const leaked=new Map(safe.fields);leaked.set(10n,list([occ(1141)]));expect(()=>validatePermittedEvidenceRecordClosure(record(safe.schema,leaked))).toThrow('projection closure');
  if(completed===2){const point=new Map(safe.fields);point.set(6n,r(204,[true,rational(2,1),true,rational(2,1)]));point.set(7n,u(1));expect(()=>validatePermittedEvidenceRecordClosure(record(safe.schema,point))).toThrow('projection closure');}
  if(completed!==1)expect(()=>compileBridgeObservation({before:Q.of(0n),potentialEffect:Q.of(BigInt(completed)),applied:Q.of(BigInt(completed)),overflow:Q.of(0n),after:Q.of(BigInt(completed)),minimum:Q.of(0n),maximum:Q.of(2n),provenance:{slots:new Map()},truthRecordId:occ(1141)},channel,typedIdentifier(1115,u(7)),simInstant(2n))).toThrow('unexpected raw bridge measurement');
  const bridge=compileProtocolBridge(definition).begin(2n),source:ScheduledEvent={eventId:20n,eventSequence:20n,dueAt:simInstant(2n),phase:110n,eventTypeId:id(1001,'event/protocol-execution'),payload:attempt,dependencies:list([]),causalParentEventIds:[19n]};
  let parent=source,plan=bridge.source(source,outcome),ordinal=7n,next=21n;const outputTypes:bigint[]=[];
  expect(()=>bridge.finish()).toThrow('unfinished');
  for(let stage=0;stage<5;stage++){
   const emission=plan.emissions()[0],event:ScheduledEvent={...emission,eventId:next,eventSequence:next++,causalParentEventIds:[parent.eventId]};plan.bindAllocatedChildren([event]);
   expect(()=>bridge.execute({...event,eventId:999n},{allocateRuntimeId:()=>ordinal++})).toThrow('unadmitted');
   const result=bridge.execute(event,{allocateRuntimeId:()=>ordinal++});for(const v of result.outputs)outputTypes.push((v as ReturnType<typeof rec>).schema.typeId);parent=event;plan=result.plan;
  }
  plan.bindAllocatedChildren([]);bridge.finish();expect(outputTypes).toEqual([203n,227n]);expect(ordinal).toBe(9n);
  const disabled=new Map(definition.fields);disabled.set(4n,false);const suppressed=compileProtocolBridge(record(definition.schema,disabled)).begin(2n),empty=suppressed.source(source,outcome);expect(empty.emissions()).toEqual([]);empty.bindAllocatedChildren([]);suppressed.finish();expect(ordinal).toBe(9n);
  session.close();
 });
});
