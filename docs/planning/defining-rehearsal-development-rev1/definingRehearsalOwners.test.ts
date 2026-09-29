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
function setup(goal:'High'|'Low'|'Wide'|'Absent'){const b=compileDefiningLifecycleState(base,admit({...definingMeaningCases()[0],goal})),initial=b.model.initial.build(),adopt=b.model.state.applyStagePatch('defining-adopt',initial,b.transition('defining-adopt',b.source('defining-adopt'),initial,37n).patch).state,state=new AuthoritativeState([...base.state.restoreState(unhex(receipt.snapshots[0].state)).entries(),...adopt.entries().filter(e=>e.path.rootStateTypeId>=1485n)]);return {b,state};}
function apply(b:ReturnType<typeof compileDefiningLifecycleState>,s:AuthoritativeState,r:ReturnType<typeof settle>){let next=b.model.state.applyStagePatch('ordinary-memory-retention',s,r.memoryPatch).state;next=b.model.state.applyStagePatch('event-presentation-cleanup',next,r.historyPatch).state;return b.model.state.applyProtocolPatch(next,r.protocolPatch).state;}

import {prepareDefiningRecall} from '../campaign3/definingRehearsalRecall';
import {prepareDefiningRehearsalAttribution} from '../campaign3/definingRehearsalAttribution';
import {prepareDefiningRehearsalSettlement} from '../campaign3/definingRehearsalOwner';
import {prepareDefiningFinalPresentation} from '../campaign3/definingFinalPresentation';
import {definingRehearsalRecord as rr} from '../campaign3/definingRehearsalCodecs';
import {dataUnsigned as uint,dataIdentity as identity} from '../campaign2/canonicalData';
import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {atom} from '../campaign3/embodiedMath';
const all=items(decode(unhex(receipt.snapshots[0].outputs)),'list'),at=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='signed'?v.value:-1n;
const cue=all.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===623n).find(v=>at(f(rec(v,623n),3n))===37n)!,focus=all.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===680n).find(v=>at(f(rec(v,680n),5n))===37n)!;
const request=(now:bigint,rehearsal:boolean,present=true)=>rr(1491,new Map<bigint,CanonicalValue>([[1n,signed(now)],[2n,u(rehearsal?1:2)],[3n,u(present?1:2)],...(present?[[4n,cue] as [bigint,CanonicalValue]]:[]),...(rehearsal?[[5n,focus] as [bigint,CanonicalValue]]:[])]));
const ordinal=(v:CanonicalValue)=>uint(identity(v).payload);
it('matches all68 component continuations in memory, rehearsal history, final scores and winner; settles final presentation separately',()=>{
 for(const spec of definingMeaningCases()){
  const {b,state}=setup(spec.goal),historical=assess(state,delivery,38n,999n).output;let s=apply(b,state,settle(state,38n,spec.law,spec.capacity,historical)),next=1000n;
  for(let i=0;i<spec.rehearsals;i++){const now=39n+BigInt(i),rank=prepareDefiningRecall(s,request(now,true),now),pubs=rank.publish(()=>next++);rank.close();expect(pubs).toHaveLength(16);const attr=prepareDefiningRehearsalAttribution(pubs,focus,now),a=attr.produce(()=>next++)[0];attr.close();expect(uint(f(rec(a,575n),7n))).toBe(1n);expect(items(f(rec(a,575n),8n),'set')).toHaveLength(16);const batch=rr(1492,[signed(now),u(1),list(pubs),focus,a]);s=apply(b,s,prepareDefiningRehearsalSettlement(s,now,spec.law,batch));}
  s=apply(b,s,settle(s,42n,spec.law,spec.capacity));const expected=runDefiningMeaning(training,spec).view,actual=definingTraining(enc(b.legacy(s).canonicalValue()));expect(actual.memory).toEqual(expected.memory);expect(actual.presentations).toEqual(expected.history);
  const final=prepareDefiningRecall(s,request(BigInt(spec.now),false,spec.cue==='matching'),BigInt(spec.now)),scores=items(f(rec(final.ranks[0],592n),5n),'list').map(v=>{const row=rec(v,591n);return [ordinal(f(row,1n)),f(row,4n)];});expect(scores).toEqual(expected.scores.map(row=>[row.acquisition,atom(row.score)]));const pubs=final.publish(()=>next++);final.close();expect(pubs.map(v=>ordinal(f(rec(f(rec(f(rec(v,590n),4n),588n),1n),587n),1n)))).toEqual(expected.publication.recollections.map(row=>row.content.winner.id));
  if(pubs.length){const before=definingTraining(enc(b.legacy(s).canonicalValue())),r=prepareDefiningFinalPresentation(s,rr(1492,[signed(spec.now),u(2),list(pubs)]),BigInt(spec.now)),nextState=b.model.state.applyStagePatch('event-presentation-owner',s,r.patch).state,after=definingTraining(enc(b.legacy(nextState).canonicalValue()));expect(after.memory).toEqual(before.memory);const id=expected.publication.recollections[0].content.winner.id;expect(after.presentations.get(id)).toEqual([...before.presentations.get(id)!,BigInt(spec.now)]);expect(r.reads.map(r=>r.path.rootStateTypeId)).toEqual([632n]);}
 }
},120000);
it('absent cue performs no owner reads and cannot publish, be reused, or settle an empty presentation',()=>{const {state}=setup('High'),rank=prepareDefiningRecall(state,request(50n,false,false),50n);expect(rank.reads).toEqual([]);expect(rank.publish(()=>1000n)).toEqual([]);expect(()=>rank.publish(()=>1001n)).toThrow('RECOLLECTION_VIEW');rank.close();expect(()=>prepareDefiningFinalPresentation(state,rr(1492,[signed(50),u(2),list([])]),50n)).toThrow();});
it('rejects off-calendar requests; partial publications cannot support use',()=>{const {state}=setup('High');expect(()=>prepareDefiningRecall(state,request(38n,true),38n)).toThrow();const rank=prepareDefiningRecall(state,request(39n,true),39n),pubs=rank.publish(()=>{return nextId++;});rank.close();const a=prepareDefiningRehearsalAttribution(pubs.slice(0,8),focus,39n),result=a.produce(()=>2000n)[0];a.close();expect(uint(f(rec(result,575n),7n))).toBe(2n);});
let nextId=1000n;
