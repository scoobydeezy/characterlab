import {describe,it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun,characterModelIdentity} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {BODY_SAMPLE,BODY_DELIVERY,BODY_OBSERVER,BODY_DEFINITION,BODY_OWNER,bodyPath,bodyId} from '../assembled/body';
import {canonicalEncode as enc,list,rational,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {decodeEmbodied as decode,embodiedRecord as r} from '../campaign3/embodiedCodecs';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import {interactionSource,interactionData,withoutChoice,outputs} from './fixtures/assembledInteraction';
import {C,id} from './fixtures/campaign2Cognitive';
import {workLimit} from './fixtures/assembledCharacter';

describe('M3 A: body evidence in the one character',()=>{
 it('executes physical delivery and actual current SEM, then restores the complete character',async()=>{
  const s=interactionSource(),d=withoutChoice(interactionData(0,1)),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d);
  expect(await a.settleNextInstant()).toBe(true);expect(a.snapshot().clock).toBe(1n);expect(await a.settleNextInstant()).toBe(true);
  const state=restoreAuthoritativeState(decode(a.snapshot().state));expect(f(rec(state.read(bodyPath(C)).value!,454n),1n)).toEqual(rational(88,1));
  const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});expect(restored.save()).toEqual(a.save());
  expect(await a.settleNextInstant()).toBe(true);expect(await restored.settleNextInstant()).toBe(true);expect(restored.snapshot()).toEqual(a.snapshot());expect(restored.save()).toEqual(a.save());
  const samples=outputs(a.snapshot().outputs,461n);expect(samples).toHaveLength(1);expect(f(samples[0],5n)).toEqual(r(462,[rational(80,1),rational(90,1)]));
  const experiences=outputs(a.snapshot().outputs,227n);expect(experiences.some(x=>items(f(x,8n),'set').some(s=>key(f(rec(s,216n),2n))===key(f(samples[0],1n))))).toBe(true);
  const trace=outputs(a.snapshot().trace,160n),body=trace.filter(t=>((f(t,7n) as {payload:{value:string}}).payload.value.startsWith('event/assembled-body-')));expect(body).toHaveLength(6);
  expect(body.map(t=>f(rec(f(t,4n),130n),3n))).toEqual([unsigned(110),unsigned(10),unsigned(11),unsigned(12),unsigned(13),unsigned(14)]);
  expect(body.filter(t=>items(f(t,15n),'list').length)).toHaveLength(1);
 },120000);
 it('rejects invalid declarations, foreign sources and body ownership',async()=>{
  const s=interactionSource(),slots=items(decode(s.registry),'list'),body=items(slots[6],'list');
  for(const [n,v] of [[1,rational(0,1)],[2,rational(-1,1)],[3,rational(3,1)],[4,rational(101,1)]] as const)await expect(prepareCharacterModel({...s,registry:enc(list([...slots.slice(0,6),list(body.map((x,i)=>i===n?v:x))]))})).rejects.toThrow();
  const m=await prepareCharacterModel(s),d=interactionData(0,0),rows=items(decode(d.orderedInputs),'list');
  for(const payload of [r(459,[id(1000,'observer/foreign'),BODY_DEFINITION]),r(459,[BODY_OBSERVER,id(1027,'definition/foreign')])])await expect(createCharacterRun(m,{...d,orderedInputs:enc(list(rows.map(row=>{const a=items(row,'list');return key(a[2])===key(BODY_SAMPLE)?list([a[0],a[1],a[2],payload,a[4]]):row;})))})).rejects.toThrow('body observer/channel');
  const model=await compileCharacterModel(s),component=await compileCharacterState(model),state=component.initialState(d.initialState),path=bodyPath(C),prior=state.read(path).value!;
  const patch={operations:[{kind:'set' as const,path,expected:{presence:true as const,value:prior},newValue:r(454,[rational(20,1),signed(1)])}]};
  expect(()=>component.stateModel.applyPatch(state,patch,id(1025,'authority/belief-expectation'))).toThrow();
  expect(()=>component.stateModel.applyPatch(state,{operations:[{...patch.operations[0],path:bodyPath(id(1002,'foreign'))}]},BODY_OWNER)).toThrow();
  const absent=new AuthoritativeState(state.entries().filter(e=>e.path.rootStateTypeId!==455n));expect(()=>component.initialState(enc(absent.canonicalValue()))).toThrow('required body');
 });
 it('permission and availability produce the same no-operand evidence, distinct from a known empty bin',async()=>{
  const rows=[];for(const [permission,availability] of [[false,true],[true,false],[true,true]]){
   const s=interactionSource(permission,availability),d=withoutChoice(interactionData(0,0,0,0));d.orderedInputs=enc(list(items(decode(d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])===key(BODY_SAMPLE))));
   const run=await createCharacterRun(await prepareCharacterModel(s),d);await run.settleNextInstant();rows.push(run.snapshot());
  }
  expect(rows[0].outputs).toEqual(rows[1].outputs);expect(outputs(rows[0].outputs,463n)).toHaveLength(1);expect(outputs(rows[0].outputs,227n)).toHaveLength(0);
  expect(outputs(rows[2].outputs,461n)).toHaveLength(1);expect(outputs(rows[2].outputs,463n)).toHaveLength(0);
 });
 it('rolls back an earlier body write when a later source in the same instant fails',async()=>{
  const s=interactionSource(),d=interactionData(0,0),badState=restoreAuthoritativeState(decode(d.initialState));
  const rows=[list([signed(2),unsigned(110),BODY_DELIVERY,list([C,rational(80,1)]),list([])]),list([signed(2),unsigned(40),id(1001,'event/deliberation-opportunity'),r(377,[id(1000,'observer/foreign'),id(1027,'definition/task-workspace')]),list([])])];
  // A tiny work cap causes failure after one successful delivery but before a second.
  const two=list([rows[0],rows[0]]),run=await createCharacterRun(await prepareCharacterModel(workLimit(s,1n)),{...d,orderedInputs:enc(two)}),before=run.snapshot();
  await expect(run.settleNextInstant()).rejects.toThrow();expect({...run.snapshot(),status:before.status}).toEqual(before);expect(run.diagnostic()).toBeDefined();
 });
});
