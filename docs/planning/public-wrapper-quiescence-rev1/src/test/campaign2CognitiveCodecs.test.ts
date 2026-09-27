import {describe,it,expect} from 'vitest';
import cognitiveRegistryHex from '../../docs/planning/campaign2-task-cognitive-model/registry.cenc.hex?raw';
import taskRegistryHex from '../../docs/planning/campaign2-task-commitment-model/registry.cenc.hex?raw';
import {canonicalEncode as enc,record,typedIdentifier,text,unsigned as u,signed,rational,list,map,type CanonicalValue} from '../substrate/canonicalEncoding';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {decodeTask} from '../campaign2/taskCodecs';
import {cognitiveRecord as r,cognitiveNamed as named,cognitiveSchemaByType,decodeCognitive} from '../campaign2/cognitiveCodecs';

const id=(n:number,p:CanonicalValue)=>typedIdentifier(n,p);
const bytesFromHex=(value:string)=>Uint8Array.from(value.trim().match(/../g)!.map(pair=>Number.parseInt(pair,16)));
const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
const raw=(type:number,fields:[number,CanonicalValue][])=>record(cognitiveSchemaByType(BigInt(type)),new Map(fields.map(([n,v])=>[BigInt(n),v])));

describe('task-cognitive-path/0.1-candidate receiving codec boundary',()=>{
 it('round trips the frozen joined registry through old envelopes containing new records',()=>{
  const bytes=bytesFromHex(cognitiveRegistryHex);
  expect(enc(decodeCognitive(bytes))).toEqual(bytes);
  expect(()=>decodeTask(bytes)).toThrow();
 });
 it('preserves the predecessor registry bytes and its own decoder',()=>{
  const bytes=bytesFromHex(taskRegistryHex);
  expect(enc(decodeCognitive(bytes))).toEqual(enc(decodeTask(bytes)));
 });
 it('keeps373/schema1 distinct from its required two-field successor',()=>{
  expect(cognitiveSchemaByType(373n,1n).fields).toHaveLength(1);
  expect(cognitiveSchemaByType(373n).schemaVersion).toBe(2n);
  const empty=r(373,[map([]),map([])]);expect(enc(decodeCognitive(enc(empty)))).toEqual(enc(empty));
  expect(()=>r(373,[map([])])).toThrow();expect(()=>decodeTask(enc(empty))).toThrow();
 });
 it('distinguishes semantic absence, known zero and no-choice tags',()=>{
  const absent=r(386,[u(1)]),zero=r(386,[u(2),rational(0,1)]);
  expect(enc(absent)).not.toEqual(enc(zero));
  expect(enc(r(419,[u(1)]))).not.toEqual(enc(r(419,[u(2)])));
  expect(()=>named(386,{VariantTag:u(1),Intensity:rational(0,1)})).toThrow();
  expect(()=>r(386,[u(2)])).toThrow();expect(()=>r(419,[u(3)])).toThrow();
 });
 it('rejects an unknown tag rather than preserving a future union branch',()=>{
  for(const type of [380,382,386,399,419,423,430])expect(()=>decodeCognitive(enc(raw(type,[[1,u(999)]])))).toThrow();
 });
 it('does not accept a rejection with an eligible numeric payload',()=>{
  expect(()=>named(430,{VariantTag:u(2),RejectionReason:u(1),Weight:rational(1,2)})).toThrow();
  expect(()=>named(430,{VariantTag:u(1),Weight:rational(1,2),SignedContribution:rational(1,10),RejectionReason:u(2)})).toThrow();
  expect(()=>r(430,[u(2)])).toThrow();
 });
 it('checks optional reference families without giving them another occurrence',()=>{
  const atom=named(399,{VariantTag:u(2),QualificationOccurrenceId:id(1138,u(7))});expect(enc(decodeCognitive(enc(atom)))).toEqual(enc(atom));
  expect(()=>named(399,{VariantTag:u(2),QualificationOccurrenceId:id(1135,u(7))})).toThrow();
  expect(()=>named(399,{VariantTag:u(2),QualificationOccurrenceId:id(1138,text('7'))})).toThrow();
 });
 it('retains one nonrecursive identity history and exact signed contributions',()=>{
  const key=r(412,[C,id(1041,text('CommitmentFidelity'))]);
  const history=r(414,[list([r(413,[id(1138,u(7)),id(1135,u(4)),signed(2),rational(-1,35)])])]);
  const state=r(415,[map([[key,history]])]);expect(enc(decodeCognitive(enc(state)))).toEqual(enc(state));
  // This is only record grammar, not S0 or prefix-authenticated history admission.
  expect(()=>r(415,[map([[C,history]])])).toThrow();
  expect(()=>r(412,[C,id(1041,text('arbitrary-trait'))])).toThrow();
 });
 it('rejects primitive coercion and wrong nested schema before semantic use',()=>{
  expect(()=>r(378,[id(1027,text('definition/measurement-prediction')),signed(3),true,true])).toThrow();
  expect(()=>r(437,[r(439,[rational(1,1),u(3)]),rational(1,2),r(439,[rational(1,1),u(3)]),r(439,[rational(1,1),u(3)])])).toThrow();
  expect(()=>r(381,[id(1128,u(1)),id(1000,text('observer')),id(1027,text('definition/task-workspace')),list([]),r(380,[u(1)])])).toThrow();
 });
});
