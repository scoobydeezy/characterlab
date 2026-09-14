import {describe,it,expect} from 'vitest';
import freeze from '../../docs/planning/campaign3-attention-model-rev2/FREEZE.json';
import {prepareAttentionModel,createAttentionRun,restoreAttentionRun} from '../campaign3/attentionFactory';
import {decodeAttention as decode,attentionRecord as r} from '../campaign3/attentionCodecs';
import {canonicalEncode as enc,list,set,unsigned,signed,text,typedIdentifier} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataItems as items,dataField as f,dataUnsigned as u,dataIdentity as id,dataText as str,dataKey as key} from '../campaign2/canonicalData';
import type {Campaign2ModelSource} from '../campaign2/factory';
import {attentionFixtureRead as read,attentionFixtureSource as source,attentionFixtureInitial as initial,attentionFixtureSeed as seed} from './attentionPublicFixtures';
const scenes={base:['actor','target','participant'],swap:['participant','actor','target'],tie:['actor','actor','participant'],'instrument-a':['instrument','target','participant'],'instrument-b':['actor','instrument','participant'],'instrument-c':['actor','target','instrument'],'beneficiary-a':['beneficiary','target','participant']} as const;
describe('attention-public-integration/0.1-candidate',()=>{
 it('executes all224 frozen model/scene combinations with exact graph and selection oracle',async()=>{
  for(const model of freeze.models){const handle=await prepareAttentionModel(source(model.name));for(const [scene,roles]of Object.entries(scenes)){
   const run=await createAttentionRun(handle,{initialState:initial(),orderedInputs:read('input-'+scene+'.cenc.hex'),runSeed:seed()}),before=run.snapshot(),n=model.modes.filter(m=>m!=='Denied').length;
   expect(key(decode(run.runIdentity()))).toBe(freeze.runs.find(r=>r.model===model.name&&r.scene===scene)!.runIdentity);
   if(model.work===8){await expect(run.settleNextInstant()).rejects.toThrow();expect(run.snapshot().state).toEqual(before.state);expect(items(decode(run.snapshot().outputs),'list')).toHaveLength(0);continue;}
   await run.settleNextInstant();const snapshot=run.snapshot(),trace=items(decode(snapshot.trace),'list'),outputs=items(decode(snapshot.outputs),'list'),q=roles.filter((role,i)=>model.modes[i]==='VisibleExact'&&role!=='beneficiary').length;
   expect(trace).toHaveLength(n?9:4);expect(outputs).toHaveLength(n?6+2*n+q:4);
   const audit=rec(outputs.find(o=>typeof o!=='boolean'&&o.kind==='record'&&o.schema.typeId===532n)!,532n),rows=items(f(audit,6n),'list'),receipt=rec(outputs.at(-1)!,535n);
   expect(rows).toHaveLength(n);const candidates=roles.map((role,i)=>({role,i,score:role==='actor'?10:role==='target'?9:role==='participant'?6:0})).filter(x=>model.modes[x.i]==='VisibleExact'&&x.score).sort((a,b)=>model.algorithm==='EqualPriority'?a.i-b.i:b.score-a.score||a.i-b.i).slice(0,model.algorithm==='Unlimited'?3:model.capacity);
   roles.map((role,i)=>({role,mode:model.modes[i]})).filter(x=>x.mode!=='Denied').forEach((x,i)=>{const row=rec(rows[i],531n),known=x.mode==='VisibleExact'&&x.role!=='beneficiary',supported=known&&x.role!=='instrument';expect(items(f(row,2n),'set').map(v=>str(id(v).payload))).toEqual(known?['causal-role/'+x.role]:[]);expect(u(f(row,3n))).toBe(!known?2n:!supported?4n:1n);expect(items(f(row,6n),'set')).toHaveLength(known?2:1);if(supported){const priority=f(row,4n) as {numerator:bigint;denominator:bigint};expect([priority.numerator,priority.denominator]).toEqual(model.algorithm==='EqualPriority'||x.role==='actor'?[1n,1n]:x.role==='target'?[9n,10n]:[3n,5n]);}else expect(row.fields.has(4n)).toBe(false);});
   const selected=rows.filter(v=>f(rec(v,531n),5n)===true).flatMap(v=>items(f(rec(v,531n),2n),'set').map(v=>str(id(v).payload))).sort();expect(selected).toEqual(candidates.map(c=>'causal-role/'+c.role).sort());expect(items(f(receipt,5n),'list')).toHaveLength(candidates.length*2);
   expect(items(decode(snapshot.state),'set')).toHaveLength(n?n+3:0);expect(await run.settleNextInstant()).toBe(false);
  }}
 },120000);
 it('restores both whole prefixes and rejects edited saved output',async()=>{
  for(const name of ['role-k1-channel-0','role-k1-channel-13','role-k0']){const modelSource=source(name),handle=await prepareAttentionModel(modelSource),input={initialState:initial(),orderedInputs:read('input-base.cenc.hex'),runSeed:seed()},run=await createAttentionRun(handle,input);
   const restored0=await restoreAttentionRun(modelSource,{initialState:initial(),orderedInputs:input.orderedInputs,save:run.save()});await restored0.settleNextInstant();await run.settleNextInstant();expect(restored0.save()).toEqual(run.save());
   const restored=await restoreAttentionRun(modelSource,{initialState:initial(),orderedInputs:input.orderedInputs,save:run.save()});expect(restored.save()).toEqual(run.save());const corrupt=run.save().slice();corrupt[corrupt.length-1]^=1;await expect(restoreAttentionRun(modelSource,{initialState:initial(),orderedInputs:input.orderedInputs,save:corrupt})).rejects.toThrow();
  }
 },60000);
 it('rejects generated originals, forged handles, model edits and executable data fields',async()=>{
  const s=source('role-k0'),handle=await prepareAttentionModel(s),ordinary={initialState:initial(),orderedInputs:read('input-base.cenc.hex'),runSeed:seed()};await expect(createAttentionRun({} as typeof handle,ordinary)).rejects.toThrow();
  const generated=enc(list([list([signed(1),unsigned(40),typedIdentifier(1001,text('event/attention-consume')),r('SelectedEvidenceView',[typedIdentifier(1143,unsigned(0)),typedIdentifier(1000,text('observer/attention-subject')),signed(1),list([])]),list([])])]));await expect(createAttentionRun(handle,{...ordinary,orderedInputs:generated})).rejects.toThrow();
  let called=false;const input={...ordinary};Object.defineProperty(input,'runSeed',{get(){called=true;return seed();}});await expect(createAttentionRun(handle,input)).rejects.toThrow();expect(called).toBe(false);
  await expect(prepareAttentionModel({...s,parameters:enc(list([r(133,[unsigned(10)])]))})).rejects.toThrow();
  expect(key(decode(ordinary.initialState))).toBe(key(set([])));
 });
});
