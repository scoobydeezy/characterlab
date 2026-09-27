import {it,expect} from 'vitest';
import allocation from '../../docs/formal/GENERAL_ATTENTION_CARRIER_ALLOCATION_TABLE.json';
import {generalAttentionRecord as r,generalAttentionRawRecord as raw,generalAttentionSchema as schema,generalAttentionSupportedSchemas,decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {decodeAttention} from '../campaign3/attentionCodecs';
import {embodiedRecord} from '../campaign3/embodiedCodecs';
import {embodiedSchema} from '../campaign3/embodiedCodecs';
import {canonicalEncode as enc,record,unsigned as u,signed,text,typedIdentifier as tid,list,set,map,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {semanticReferentFromRuntimeEntity} from '../substrate/referentOrigin';
import {statePatchValue,actualReadRecordValue} from '../substrate/state';
import {scheduledEventValue} from '../substrate/persistence';
import {simInstant} from '../substrate/time';
const version='carrier-test/1',context={admittedVersions:[version],graphScale:1000n},id=(ns:number,n=1)=>tid(ns,u(n)),vocab=(ns:number,s:string)=>tid(ns,text(s)),observer=vocab(1000,'observer/test');
const referent=(n:number)=>semanticReferentFromRuntimeEntity(id(1122,n));
const sample=()=>embodiedRecord(461,[id(1115),observer,vocab(1005,'channel/test'),signed(1),embodiedRecord(462,[q(0,1),q(10,1)]),text('embodied-level-observation/0.1-candidate')]);
const body=()=>r('PositiveBodyAcquisitionContent',[list([r('PositiveBodySignalGroup',[vocab(1045,'interoceptive-signal/alpha'),list([r('RetainedBodyView',[sample()])])])])]);
const formation=()=>r('AcquisitionFormationEvidence',[id(1145),observer,signed(1),id(1143),text(version),body()],context);
const unchecked=(name:string,values:CanonicalValue[])=>record(schema(name),new Map(values.map((v,i)=>[BigInt(i+1),v])));
it('admits extended values only through inherited canonical payload slots and validates their real nested grammar',()=>{
 const value=formation(),path={rootStateTypeId:630n,fieldId:1n,selectors:[{kind:'mapKey' as const,key:referent(1)}]};
 const envelopes=(v:CanonicalValue)=>[
  statePatchValue({operations:[{kind:'set',path,expected:{presence:false},newValue:v}]}),
  actualReadRecordValue({accessorId:vocab(1028,'accessor/test'),path,presence:true,value:v,derivedSources:[{path,presence:true,value:v}]}),
  scheduledEventValue({eventId:0n,eventSequence:0n,dueAt:simInstant(1n),phase:130n,eventTypeId:vocab(1001,'event/test'),payload:v,dependencies:list([]),causalParentEventIds:[]}),
 ];
 for(const envelope of envelopes(value))expect(enc(decode(enc(envelope),context))).toEqual(enc(envelope));
 for(const envelope of envelopes(unchecked('GoalQualifies',[u(3)])))expect(()=>decode(enc(envelope),context)).toThrow(/finite tag/);
});
it('GAC-A: frozen schema inventory has unique exact numeric homes and field requirements',()=>{
 const all=generalAttentionSupportedSchemas();expect(new Set(all.map(s=>`${s.typeId}/${s.schemaVersion}`)).size).toBe(all.length);
 for(const a of allocation.records){const s=schema(a.name);expect(Number(s.typeId)).toBe(a.typeId);expect(s.schemaVersion).toBe(1n);expect(s.fields.map(f=>({id:Number(f.id),name:f.name,required:f.required}))).toEqual(a.fields.map(({id,name,required})=>({id,name,required})));}
});
it('GAC-B: actual inherited sample composes into acquisition bytes without merging selection identity',()=>{
 const value=formation(),bytes=enc(value);expect(enc(decode(bytes,context))).toEqual(bytes);expect(()=>decodeAttention(bytes)).toThrow();
 expect(value.fields.get(1n)).toEqual(id(1145));expect(value.fields.get(4n)).toEqual(id(1143));
 expect(()=>r('AcquisitionFormationEvidence',[id(1143),observer,signed(1),id(1143),text(version),body()],context)).toThrow();
});
it('GAC-C: record-union alternatives are discriminated by schema, including unavailable result',()=>{
 const key=r('MaintenanceGoalKey',[referent(1),referent(2)]),args=[id(1146),observer,key,id(1106),signed(2),text(version)];
 const absent=r('GoalAssessmentUnavailable',[u(1)]),qualification=r('GoalQualificationUnavailable',[u(1)]);
 const value=r('GoalOutcomeAssessment',[...args,absent,qualification],context);expect(enc(decode(enc(value),context))).toEqual(enc(value));
 expect(()=>r('GoalOutcomeAssessment',[...args,qualification,absent],context)).toThrow();
 expect(()=>r('GoalOutcomeAssessment',[...args,u(1),qualification],context)).toThrow();
});
it('GAC-D: required fields and unknown fields reject even with forged caller schema',()=>{
 const s=schema('GeneralDefinitionBinding');
 const missing=record({...s,fields:s.fields.map(f=>({...f,required:false}))},new Map([[1n,u(1)]]));expect(()=>decode(enc(missing))).toThrow();
 const extra=record({...s,fields:[...s.fields,{id:3n,name:'Truth',required:true}]},new Map([[1n,u(1)],[2n,vocab(1027,'definition/test')],[3n,u(0)]]));expect(()=>decode(enc(extra))).toThrow();
 expect(()=>raw('GeneralDefinitionBinding',new Map([[1n,u(1)]]))).toThrow();
});
it('GAC-E: optional opportunity is absence, not a fabricated or null occurrence',()=>{
 const row=r('BodySelectionAuditRow',[vocab(1045,'interoceptive-signal/alpha'),u(0),u(3)]);
 const fields=new Map<bigint,CanonicalValue>([[1n,id(1143)],[2n,observer],[3n,signed(1)],[5n,list([row])]]);
 const absent=raw('BodySelectionAudit',fields);expect(absent.fields.has(4n)).toBe(false);
 fields.set(4n,id(1106));expect(enc(raw('BodySelectionAudit',fields))).not.toEqual(enc(absent));
 fields.set(4n,false);expect(()=>raw('BodySelectionAudit',fields)).toThrow();
});
it('GAC-F: nested collection grammar enforces kind, lower and upper bounds',()=>{
 const signal=vocab(1045,'interoceptive-signal/alpha'),view=r('RetainedBodyView',[sample()]);
 for(const n of[1,3])expect(()=>r('PositiveBodySignalGroup',[signal,list(Array(n).fill(view))])).not.toThrow();
 for(const n of[0,4])expect(()=>r('PositiveBodySignalGroup',[signal,list(Array(n).fill(view))])).toThrow();
 expect(()=>r('PositiveBodySignalGroup',[signal,set([view])])).toThrow();
});
it('GAC-G: finite tags and exact version context fail closed',()=>{
 for(const n of[0,15])expect(()=>r('GeneralDefinitionBinding',[u(n),vocab(1027,'definition/test')])).toThrow();
 expect(()=>decode(enc(formation()))).toThrow();expect(()=>decode(enc(formation()),{admittedVersions:['different/1']})).toThrow();
 const bad=unchecked('GoalQualifies',[u(3)]);for(const value of[bad,list([bad]),map([[u(1),bad]]),tid(9999,bad)])expect(()=>decode(enc(value),context)).toThrow();
});
it('GAC-H: typed payload grammar preserves referent origins and text vocabulary',()=>{
 expect(()=>r('LocalReserveKey',[referent(1),vocab(1044,'local-reserve/alpha')])).not.toThrow();
 for(const bad of[vocab(1002,'character/fake'),id(1002),id(1122)])expect(()=>r('LocalReserveKey',[bad,vocab(1044,'local-reserve/alpha')])).toThrow();
 for(const bad of[vocab(1045,'local-reserve/alpha'),vocab(1044,''),id(1044),vocab(1044,'e\u0301')])expect(()=>r('LocalReserveKey',[referent(1),bad])).toThrow();
});
it('GAC-I: canonical duplicate keys/items and noncanonical rationals reject before admission',()=>{
 const good=formation();expect(()=>decode(enc(set([good,good])),context)).toThrow();expect(()=>decode(enc(map([[u(1),good],[u(1),good]])),context)).toThrow();
 expect(()=>decode(enc({kind:'rational',numerator:2n,denominator:4n}),context)).toThrow();
});
it('GAC-J: inherited EMB domain validation survives the combined registry',()=>{
 const badInterval=record(embodiedSchema(462n),new Map([[1n,q(10,1)],[2n,q(0,1)]]));
 const badSample=record(embodiedSchema(461n),new Map<bigint,CanonicalValue>([[1n,id(1115)],[2n,observer],[3n,vocab(1005,'channel/test')],[4n,signed(1)],[5n,badInterval],[6n,text('embodied-level-observation/0.1-candidate')]]));
 expect(()=>r('RetainedBodyView',[badSample])).toThrow();expect(()=>decode(enc(badInterval))).toThrow();
 expect(enc(decode(enc(sample())))).toEqual(enc(sample()));
});
