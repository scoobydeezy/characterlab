import {beforeAll,it,expect} from 'vitest';
import receipt from '../../docs/planning/DEFINING_MEMORY_TRAINING_REV1.json';
import {canonicalEncode as enc,list,unsigned as u,signed} from '../substrate/canonicalEncoding';
import {definingMemoryTrace} from '../campaign3/definingMemoryTrace';
import {createDefiningMemoryModel} from '../campaign3/definingMemoryModel';
import {generalId} from '../campaign3/generalBindingProfile';
import {simInstant} from '../substrate/time';
import {AuthoritativeState} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {generalRecord as gr,generalSubject} from '../campaign3/generalBindingProfile';
import {decodeDefiningMemoryOwner as decode} from '../campaign3/definingMemoryOwnerCodecs';
import {compileGeneralModelCandidate} from '../campaign3/generalModelCandidate';
import {buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {compileDefiningLifecycleState} from '../campaign3/definingLifecycleState';
import {admitDefiningContinuationProgram as admit} from '../campaign3/definingContinuationProgram';
import {definingMeaningCases,meaningTraining,runDefiningMeaning} from '../campaign3/definingMeaning';
import {definingTraining,definingLaws} from '../campaign3/definingMemoryExperiment';
import {prepareDefiningHistoricalMeaning as assess,prepareDefiningMemorySettlement as settle} from '../campaign3/definingMemoryOwner';
import {projectGoalQualification as project} from '../campaign3/goalOutcomeQualification';
const unhex=(s:string)=>Uint8Array.from(s.match(/../g)!.map(x=>parseInt(x,16))),training=meaningTraining(unhex(receipt.snapshots[0].state),unhex(receipt.snapshots[0].outputs));
const attribution=items(decode(unhex(receipt.snapshots[0].outputs)),'list').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===575n)!,delivery=gr(683,[generalSubject().observer,u(999),signed(38),attribution,signed(37)]);
let base:Awaited<ReturnType<typeof compileGeneralModelCandidate>>['model'];
beforeAll(async()=>{base=(await compileGeneralModelCandidate(buildGeneralDeclarationPacket('credit-significance-first'))).model;},120000);
function setup(goal:'High'|'Low'|'Wide'|'Absent',report:'original'|'contrary'|'missing'='original'){const b=compileDefiningLifecycleState(base,admit({...definingMeaningCases()[0],goal,report})),initial=b.model.initial.build(),adopt=b.model.state.applyStagePatch('defining-adopt',initial,b.transition('defining-adopt',b.source('defining-adopt'),initial,37n).patch).state,state=new AuthoritativeState([...base.state.restoreState(unhex(receipt.snapshots[0].state)).entries(),...adopt.entries().filter(e=>e.path.rootStateTypeId>=1485n)]);return {b,state};}
function apply(b:ReturnType<typeof compileDefiningLifecycleState>,s:AuthoritativeState,r:ReturnType<typeof settle>){let next=b.model.state.applyStagePatch('ordinary-memory-retention',s,r.memoryPatch).state;next=b.model.state.applyStagePatch('event-presentation-cleanup',next,r.historyPatch).state;return b.model.state.applyProtocolPatch(next,r.protocolPatch).state;}

import {prepareDefiningCurrentAssessment as current} from '../campaign3/definingCurrentAssessment';
import {definingMemoryOwnerRecord} from '../campaign3/definingMemoryOwnerCodecs';
import {decodeDefiningCurrent} from '../campaign3/definingCurrentCodecs';
function reported(b:ReturnType<typeof compileDefiningLifecycleState>,state:AuthoritativeState){return b.model.state.applyStagePatch('defining-report',state,b.transition('defining-report',b.source('defining-report'),state,43n).patch).state;}
it('matches all68 component current assessments through independently owned admitted report',()=>{for(const spec of definingMeaningCases()){const {b,state}=setup(spec.goal,spec.report),historical=assess(state,delivery,38n,999n).output,s=reported(b,state),before=enc(s.canonicalValue()),result=current(s,historical,43n,1000n);expect(project(result.result)).toEqual(project(runDefiningMeaning(training,spec).view.current));expect(result.reads.map(r=>r.path.rootStateTypeId)).toEqual([1485n,1486n]);expect(enc(s.canonicalValue())).toEqual(before);expect(decodeDefiningCurrent(enc(result.output))).toEqual(result.output);}},120000);
it('capacity-zero loss cannot be reversed by a present current report or historical delivery',()=>{const {b,state}=setup('High','contrary'),historical=assess(state,delivery,38n,999n).output,lost=apply(b,apply(b,state,settle(state,38n,'SignificanceFirst',0,historical)),settle(apply(b,state,settle(state,38n,'SignificanceFirst',0,historical)),42n,'SignificanceFirst',0)),s=reported(b,lost),before=enc(s.canonicalValue());const result=current(s,historical,43n,1000n);expect(f(rec(result.output,1490n),5n)).toEqual(historical);expect(project(result.result)).toEqual(project(runDefiningMeaning(training,{...definingMeaningCases()[0],report:'contrary',capacity:0}).view.current));expect(enc(s.canonicalValue())).toEqual(before);expect(definingTraining(enc(b.legacy(s).canonicalValue())).memory.filter(a=>a.kind==='EventContinuant')).toHaveLength(0);});
it('rejects assessment before actual report admission and foreign, stale or differently goal-bound historical receipts',()=>{const {b,state}=setup('High'),h=assess(state,delivery,38n,999n).output,s=reported(b,state);expect(()=>current(state,h,43n,1000n)).toThrow('report before assessment');expect(()=>current(s,h,42n,1000n)).toThrow('current clock');for(const [field,value] of [[2n,generalId(1000,'other-observer')],[3n,signed(37)]] as const){const fields=new Map(h.fields);fields.set(field,value);expect(()=>current(s,definingMemoryOwnerRecord(1489,fields),43n,1000n)).toThrow('historical receipt');}const low=setup('Low'),other=assess(low.state,delivery,38n,999n).output;expect(()=>current(s,other,43n,1000n)).toThrow('interpretation goal binding');});
