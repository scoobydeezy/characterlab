import {describe,it,expect} from 'vitest';
import freeze from '../../docs/planning/campaign3-embodied-model-rev2/FREEZE.json';
import {embodiedFixtureBytes as bytes} from './embodiedFixtures';
import {compileEmbodiedModel} from '../campaign3/embodiedModel';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as id,dataText as str} from '../campaign2/canonicalData';
import {canonicalEncode as enc,record,list,set,text,unsigned,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {resolveAdmissibleEvidenceReference} from '../semanticBinding/evidenceProvenance';
import {permittedEvidenceValue,validatePermittedEvidenceRecordClosure,EvidenceKindId,type PresentObservation} from '../observation/observation';
import {ExactRational as Q} from '../substrate/exactMath';
import {simInstant} from '../substrate/time';
import {compileEmbodiedInputs} from '../campaign3/embodiedAdmission';
const source=()=>({...freeze.versions,content:bytes('baseline/content.cenc.hex'),registry:bytes('baseline/registry.cenc.hex'),parameters:bytes('baseline/parameters.cenc.hex')});
const replace=(v:CanonicalValue,n:bigint,value:CanonicalValue)=>{const r=rec(v,(v as {schema:{typeId:bigint}}).schema.typeId);return record(r.schema,new Map([...r.fields].map(([k,x])=>[k,k===n?value:x])));};
const ID=(ns:number,s:string)=>typedIdentifier(ns,text(s));
describe('EMB declaration-role and legacy consumer exclusion',()=>{
 it('does not relabel bounded effect evidence as finite level evidence',async()=>{
  const point:PresentObservation={kind:'present',observationId:typedIdentifier(1115,unsigned(0)),observerId:ID(1000,'observer/embodied-subject'),subjectId:ID(1005,'control-subject'),observationChannelId:ID(1005,'channel/embodied-fuel-level'),occurredAt:simInstant(10n),measurementInterval:{lower:Q.of(40n),upper:Q.of(40n)},evidenceKindId:EvidenceKindId.Point,precision:Q.of(1n),perceivedConceptTokens:[],safeSourceReferences:[],transformationVersion:'observation/0.1-candidate'};
  const old=permittedEvidenceValue(point);expect(()=>validatePermittedEvidenceRecordClosure(old)).not.toThrow();expect(()=>permittedEvidenceValue({...point,measurementInterval:{lower:Q.of(40n),upper:Q.of(50n)}})).toThrow(/interval/);
  const model=await compileEmbodiedModel(source()),rows=items(decode(bytes('runs/baseline/ordered-inputs.cenc.hex')),'list'),first=items(rows[0],'list');
  await expect(compileEmbodiedInputs(enc(list([list(first.map((v,i)=>i===3?old:v))])),bytes('runs/baseline/initial-state.cenc.hex'),model.modelIdentity,new Uint8Array(32))).rejects.toThrow();
 });
 it('keeps definition collection membership distinct from record-field VAL',async()=>{
  const s=source(),slots=items(decode(s.registry),'list'),edit=(stable:string,fn:(v:CanonicalValue)=>CanonicalValue)=>({...s,registry:enc(list(slots.map((v,i)=>i?v:set(items(v,'set').map(e=>typeof e!=='boolean'&&e.kind==='record'&&e.schema.typeId===171n&&((id(f(e,1n)).payload as {value?:string}).value===stable)?fn(e):e)))))});
  const bad=[
   edit('definition/embodied-level-source',e=>replace(e,4n,replace(f(rec(e,171n),4n),3n,replace(f(rec(f(rec(e,171n),4n),465n),3n),4n,set([ID(1009,'EmbodiedPresentPressureTransition')]))))),
   edit('definition/embodied-level-source',e=>replace(e,4n,replace(f(rec(e,171n),4n),3n,replace(f(rec(f(rec(e,171n),4n),465n),3n),4n,set([ID(1027,'definition/not-declared')]))))),
   edit('definition/embodied-replenishment',e=>replace(e,4n,replace(f(rec(e,171n),4n),5n,set([ID(1009,'EmbodiedPresentPressureTransition')])))),
   edit('definition/embodied-replenishment',e=>replace(e,4n,replace(f(rec(e,171n),4n),5n,set([ID(1027,'definition/embodied-pressure')])))),
   edit('definition/embodied-level-channel',e=>replace(e,2n,ID(1023,'registry/embodied-pressure-definition'))),
   edit('definition/embodied-level-channel',e=>replace(e,3n,text('embodied-level-observation/other'))),
   edit('EmbodiedPresentPressureTransition',e=>replace(e,1n,ID(1027,'definition/EmbodiedPresentPressureTransition'))),
   edit('definition/embodied-level-source',e=>replace(e,4n,replace(f(rec(e,171n),4n),3n,replace(f(rec(f(rec(e,171n),4n),465n),3n),3n,set([]))))),
  ];
  expect(await compileEmbodiedModel(s)).toBeDefined();for(const candidate of bad)await expect(compileEmbodiedModel(candidate)).rejects.toThrow();
 });
 it('old evidence admission rejects the new producing schema/seam even with a real occurrence index',()=>{
  const ref={kind:'observation' as const,observationId:0n},occurrence={ref,observerId:'observer/embodied-subject',occurredAt:10n,recordSchemaVersion:'461/1',producingEpistemicSeamVersion:'embodied-level-observation/0.1-candidate',scope:{}};
  expect(()=>resolveAdmissibleEvidenceReference(ref,[occurrence],{transitionKindId:'legacy-consumer',permittedEvidenceSchemas:[{refKind:'observation',recordSchemaVersion:'203/1',producingEpistemicSeamVersion:'observation/0.1-candidate'}],temporalScope:'HistoricalOrCurrent'},{observerId:occurrence.observerId,occurredAt:10n})).toThrow(/not admitted/);
 });
});
