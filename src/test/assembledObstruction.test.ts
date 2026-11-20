import {it,expect,vi} from 'vitest';
import {fixture,create,capture,decode,items,key,enc,list,text,signed,u,q,rec,f,uint,outputs,bytes,through,finish,C,type Run,type CanonicalValue} from './fixtures/assembledObstruction';
import {OBSTRUCTION,OBSTRUCTION_SOURCE,OBSTRUCTION_RESULT,OBSTRUCTION_VERSION,obstructionSource,createExternalObstruction} from '../assembled/externalObstruction';
import {ACTION_BODY,ACTION_BODY_EVENT} from '../assembled/actionBody';
import {SKILL_ACTUAL} from '../assembled/skill';
import {PERFORMANCE_OBS,outcomePath} from '../assembled/performance';
import {expectationPath,expectationValue} from '../assembled/performanceExpectation';
import {restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {CALIBRATED_SENSING_RULES,CALIBRATED_SENSING_REGISTRY} from '../assembled/model';
import * as traceModule from '../substrate/trace';
import {fixture as oldFixture} from './fixtures/assembledDecisionCurrent';
import {simInstant} from '../substrate/time';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const labels=(values:CanonicalValue,label:string)=>items(values,'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(label))).map(v=>items(v,'list'));
function live(run:Run,blocked:boolean,visible=true){
 const p=capture(run),snapshot=run.snapshot(),os=decode(snapshot.outputs),state=restoreAuthoritativeState(decode(snapshot.state));
 const effect=labels(os,ACTION_BODY).find(a=>eq(a[1],f(rec(p.execution!,433n),1n)))!;
 expect(effect,'actual selected physical effect').toBeDefined();expect(effect[5]).toEqual(text(blocked?'Blocked':'Applied'));
 const obstruction=labels(os,OBSTRUCTION_RESULT).find(a=>eq(a[2],effect[1]))!;
 expect(obstruction).toBeDefined();expect(obstruction[3]).toEqual(effect[2]);expect(obstruction[4]).toEqual(effect[3]);expect(obstruction[6]).toBe(blocked);
 const skill=labels(os,SKILL_ACTUAL).find(a=>eq(a[2],effect[1]))!;expect(skill).toBeDefined();expect(skill[6]).toBe(true);expect(skill[7]).toBe(true);
 const observations=labels(os,PERFORMANCE_OBS).filter(a=>uint(a[2])===10n);expect(observations.length).toBe(visible?1:0);
 for(const o of observations){
  expect(o[5]).toEqual(effect[3]);expect(o[6]).toBe(!blocked);expect(o[7]).toBe(true);
  const journal=items(state.read(outcomePath(o[3])).value!,'list');expect(items(journal[1],'list')).toContainEqual(list(o));
  const belief=expectationValue(state.read(expectationPath(o[3],uint(o[4]))).value);expect([belief.mean?.numerator,belief.mean?.denominator]).toEqual([blocked?0n:1n,1n]);expect(belief.supports.length).toBeGreaterThan(0);
 }
 const traces=outputs(snapshot.trace,160n),source=traces.find(t=>eq(f(rec(f(t,4n),130n),1n),obstruction[1]))!;
 expect(source).toBeDefined();expect(uint(f(rec(f(source,4n),130n),3n))).toBe(30n);expect(f(source,6n)).toEqual(text(OBSTRUCTION_VERSION));expect(items(f(source,11n),'list')).toHaveLength(0);
 const physical=traces.find(t=>eq(f(rec(f(t,4n),130n),5n),ACTION_BODY_EVENT)&&items(f(t,13n),'list').some(o=>eq(o,list(obstruction))))!;
 expect(physical).toBeDefined();expect(uint(f(rec(f(physical,4n),130n),3n))).toBe(110n);
 expect(f(physical,6n)).toEqual(text(OBSTRUCTION_VERSION));
 return {p,state,os,snapshot,effect,obstruction,skill,observations};
}
function full(a:Run,b:Run){expect(a.snapshot()).toEqual(b.snapshot());bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());bytes(a.decisionHistory(),b.decisionHistory());bytes(a.decisionPresentation(),b.decisionPresentation());}
it('M192 external actor prevents a competent chosen effect and ordinary outcome learning follows',async()=>{
 const a=await create(fixture(0)),b=await create(fixture(1)),x=live(a.run,false),y=live(b.run,true);
 expect(x.p.d).toEqual(y.p.d);expect(x.p.intent).toEqual(y.p.intent);expect(x.p.expression).toEqual(y.p.expression);expect(x.p.execution).toEqual(y.p.execution);
 expect(x.skill).toEqual(y.skill);expect(x.state.entries().filter(e=>e.path.rootStateTypeId===785n)).toEqual(y.state.entries().filter(e=>e.path.rootStateTypeId===785n));
 expect(x.state.entries().filter(e=>e.path.rootStateTypeId===455n)).not.toEqual(y.state.entries().filter(e=>e.path.rootStateTypeId===455n));
 const intent=x.p.intent,expression=x.p.expression;for(const r of[a.run,b.run]){await finish(r);expect(outputs(r.snapshot().outputs,425n)).toContainEqual(intent);expect(outputs(r.snapshot().outputs,426n)).toContainEqual(expression);}
 console.info('M192 CONNECTION PASS same actual decision/intent/expression/plan/attempt/protocol acknowledgement/intrinsic skill; external actor changes body Applied->Blocked and authentic performance observation/learning1->0; full101.');
},570000);
it('M192 private blocker identity is not cognition and absent outcome is not observed failure',async()=>{
 const a=await create(fixture(1)),b=await create(fixture(2));live(a.run,true);live(b.run,true);
 const safe=(r:Run)=>{const v=items(decode(r.snapshot().outputs),'list');return list(v.filter(o=>!(typeof o!=='boolean'&&o.kind==='list'&&o.items.length&&eq(o.items[0],text(OBSTRUCTION_RESULT)))));};
 for(let n=0;;n++){
  expect(n).toBeLessThan(32);bytes(a.run.snapshot().state,b.run.snapshot().state);expect(safe(a.run)).toEqual(safe(b.run));bytes(a.run.decisionHistory(),b.run.decisionHistory());bytes(a.run.decisionPresentation(),b.run.decisionPresentation());
  const more=await a.run.settleNextInstant();expect(await b.run.settleNextInstant()).toBe(more);if(!more)break;
 }
 expect(a.run.snapshot().clock).toBe(101n);
 for(const blocked of[false,true]){const x=await create(fixture(blocked?1:0,false)),p=live(x.run,blocked,false);expect(p.state.entries().filter(e=>e.path.rootStateTypeId===1000n&&[6n,7n].includes(e.path.fieldId))).toHaveLength(0);await finish(x.run);}
 console.info('M192 PRIVACY PASS swapped private blockers yield identical state/safe outputs/history/player every later instant101; hidden outcome absent in both physical arms; no authored causal attribution.');
},570000);
it('M192 full continuation and reached physical fault preserve atomicity',async()=>{
 const b=fixture(1),a=await create(b,9n),repeat=await create(b,9n),restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.run.save()});full(a.run,repeat.run);full(a.run,restored);
 const saved=a.run.save(),before=a.run.snapshot(),original=traceModule.traceRecordValue;let reached=false;
 const spy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(value=>{const row=original(value);if(value.seamVersion===OBSTRUCTION_VERSION&&eq(value.event.eventTypeId,ACTION_BODY_EVENT)){reached=true;throw Error('M192 after actual physical obstruction');}return row;});
 try{await expect(a.run.settleNextInstant()).rejects.toThrow('M192 after actual physical obstruction');expect(reached).toBe(true);expect({...a.run.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:saved});
 for(let n=0;;n++){expect(n).toBeLessThan(32);const more=await repeat.run.settleNextInstant();for(const r of[restored,recovered]){expect(await r.settleNextInstant()).toBe(more);full(repeat.run,r);}if(!more)break;}
 expect(repeat.run.snapshot().clock).toBe(101n);expect(repeat.run.diagnostic()).toBeUndefined();
 console.info('M192 CONTINUATION PASS repeat/public save9/recovery all later complete state/output/trace/save/identity/history/player bytes through101; reached110 physical obstruction fault atomic.');
},570000);
it('M192 admission source authentication and no-source compatibility',async()=>{
 const b=fixture(),m=await prepareCharacterModel(b.s),rows=items(decode(b.d.orderedInputs),'list'),source=rows.at(-1)!;
 const altered=(change:(a:CanonicalValue[])=>void)=>{const a=[...items(source,'list')];change(a);return {...b.d,orderedInputs:enc(list([...rows.slice(0,-1),list(a)]))};};
 for(const d of[altered(a=>{a[1]=u(110);}),altered(a=>{a[0]=signed(0);}),altered(a=>{a[3]=list([text(OBSTRUCTION),b.people[0],list([])]);}),altered(a=>{a[3]=list([text(OBSTRUCTION),C,list([C])]);}),altered(a=>{a[3]=list([text(OBSTRUCTION),C,list([text('undeclared')])]);}),{...b.d,orderedInputs:enc(list([...rows,source]))}])await expect(createCharacterRun(m,d)).rejects.toThrow('external obstruction');
 await expect(createCharacterRun(await prepareCharacterModel({...b.s,rulesVersion:CALIBRATED_SENSING_RULES,registrySchemaVersion:CALIBRATED_SENSING_REGISTRY}),b.d)).rejects.toThrow('external obstruction version');
 expect(()=>obstructionSource(list([text(OBSTRUCTION),C,list([b.people[0],b.people[1]])]),C,b.people)).toThrow('declared participant');
 const event={eventId:1n,eventSequence:1n,eventTypeId:OBSTRUCTION_SOURCE,dueAt:simInstant(10n),phase:30n,payload:items(source,'list')[3],dependencies:list([]),causalParentEventIds:[]};
 const h=createExternalObstruction(C,b.people,[event],C,C);h.begin(10n);expect(()=>h.execute({event:{...event,payload:list([text(OBSTRUCTION),C,list([])])}} as never)).toThrow('unbound source');expect(()=>h.prepareCommit()).toThrow('unconsumed');h.close();
 const old=oldFixture(),now={...old,s:{...old.s,rulesVersion:b.s.rulesVersion,registrySchemaVersion:b.s.registrySchemaVersion}},a=await create(old),c=await create(now);
 const x=capture(a.run),y=capture(c.run);expect(y.d).toEqual(x.d);expect(y.intent).toEqual(x.intent);expect(y.expression).toEqual(x.expression);bytes(a.run.snapshot().state,c.run.snapshot().state);
 await finish(a.run);await finish(c.run);
 console.info('M192 ADMISSION PASS phase/time/holder/participant/duplicate/old-version/source tampering reject; no-source0.129/0.130 same decision/intent/expression/state; full101.');
},570000);
