import {describe,it,expect} from 'vitest';
import {embodiedRecord as r,embodiedSchema,decodeEmbodied} from '../campaign3/embodiedCodecs';
import {record,canonicalEncode as enc,rational as q,unsigned as u,signed,text,typedIdentifier as tid} from '../substrate/canonicalEncoding';
import {decodeCognitive} from '../campaign2/cognitiveCodecs';
const id=(ns:number,p:string)=>tid(ns,text(p));
const sample=()=>r(461,[tid(1115,u(0)),id(1000,'observer/embodied-subject'),id(1005,'channel/embodied-fuel-level'),signed(10),r(462,[q(40,1),q(50,1)]),text('embodied-level-observation/0.1-candidate')]);
describe('allocated EMB codec boundary (no source authentication)',()=>{
 it('preserves new finite level records and excludes them from the old decoder',()=>{
  const value=sample();expect(enc(decodeEmbodied(enc(value)))).toEqual(enc(value));expect(()=>decodeCognitive(enc(value))).toThrow();
 });
 it('rejects point, reversed and negative level intervals',()=>{for(const [a,b] of [[1,1],[2,1],[-1,1]])expect(()=>r(462,[q(a,1),q(b,1)])).toThrow();});
 it('applies parameter domains to the allocated channel and pressure definitions',()=>{
  const channel=(width:number)=>r(458,[id(1005,'channel/embodied-fuel-level'),id(1000,'observer/embodied-subject'),id(1039,'unit/embodied-fuel-stock'),id(1006,'modality/embodied-fuel-level'),q(100,1),q(width,1),true,true]);
  expect(()=>channel(10)).not.toThrow();for(const w of [0,30,101])expect(()=>channel(w)).toThrow();
  expect(()=>r(460,[id(1027,'definition/embodied-level-channel'),q(0,1)])).toThrow();
 });
 it('does not substitute integer atoms for quantities',()=>{expect(()=>r(454,[u(80),signed(0)])).toThrow();});
 it('rejects negative or overflowing instants',()=>{for(const t of [-1n,9223372036854775808n])expect(()=>r(454,[q(80,1),signed(t)])).toThrow();});
 it('keeps Known zero distinct from unavailable and closes their payloads',()=>{
  expect(enc(r(481,[u(1),q(0,1)]))).not.toEqual(enc(r(481,[u(2)])));
  for(const values of [[u(1)],[u(2),q(0,1)],[u(3)],[u(1),q(2,1)]])expect(()=>r(481,values)).toThrow();
 });
 it('requires matching carrier branch and genuine typed reservation field',()=>{
  expect(()=>r(482,[u(1),sample(),tid(1106,u(1))])).not.toThrow();
  expect(()=>r(482,[u(2),sample()])).toThrow();expect(()=>r(482,[u(1),sample()])).toThrow();
  expect(()=>r(482,[u(1),sample(),tid(1115,u(1))])).toThrow();
 });
 it('checks exact bin arithmetic including both endpoint rules',()=>{
  for(const [level,k] of [[0,0],[20,1],[100,4]])expect(()=>r(484,[q(level,1),q(100,1),q(20,1),u(k)])).not.toThrow();
  for(const [level,k] of [[20,0],[100,5],[101,5]])expect(()=>r(484,[q(level,1),q(100,1),q(20,1),u(k)])).toThrow();
  expect(()=>r(484,[q(0,1),q(100,1),q(30,1),u(0)])).toThrow();
 });
 it('rejects unknown fields even under an allocated type number',()=>{
  const schema={...embodiedSchema(462n),fields:[...embodiedSchema(462n).fields,{id:3n,name:'HiddenTruth',required:true}]};
  const value=record(schema,new Map([[1n,q(1,1)],[2n,q(2,1)],[3n,q(1,1)]]));expect(()=>decodeEmbodied(enc(value))).toThrow();
 });
});
