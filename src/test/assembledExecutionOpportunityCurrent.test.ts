import {SK} from '../assembled/stakeholderKnowledge';
import {fixture as originalOpportunity} from './fixtures/assembledExecutionOpportunity';
import {it,expect,vi} from 'vitest';
import {executionOpportunity as fixture} from './fixtures/assembledAgencyCurrent';
import {create,capture,decode,items,key,enc,list,set,text,signed,u,q,rec,f,uint,outputs,bytes,through,finish,C,type Run,type CanonicalValue} from './fixtures/assembledExecutionOpportunity';
import {OPPORTUNITY,OPPORTUNITY_SOURCE,OPPORTUNITY_RESULT,OPPORTUNITY_VERSION,opportunitySource,createExternalObstruction,OBSTRUCTION_RESULT} from '../assembled/externalObstruction';
import {ACTION_BODY,ACTION_BODY_EVENT,ACTION_BODY_RECEIPT} from '../assembled/actionBody';
import {SKILL_ACTUAL} from '../assembled/skill';
import {PERFORMANCE_OBS,outcomePath} from '../assembled/performance';
import {expectationPath,expectationValue} from '../assembled/performanceExpectation';
import {restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {STAKEHOLDER_RULES,STAKEHOLDER_REGISTRY,OBSTRUCTION_WITNESS_RULES,OBSTRUCTION_WITNESS_REGISTRY} from '../assembled/model';
import * as traceModule from '../substrate/trace';
import {fixture as oldFixture} from './fixtures/assembledObstruction';
import {simInstant} from '../substrate/time';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const labels=(values:CanonicalValue,label:string)=>items(values,'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(label))).map(v=>items(v,'list'));
function live(run:Run,blocked:boolean,visible=true){
 const p=capture(run),snapshot=run.snapshot(),os=decode(snapshot.outputs),state=restoreAuthoritativeState(decode(snapshot.state));
 const effect=labels(os,ACTION_BODY).find(a=>eq(a[1],f(rec(p.execution!,433n),1n)))!;
 expect(effect,'actual selected physical effect').toBeDefined();expect(effect[5]).toEqual(text(blocked?'Blocked':'Applied'));
 const opportunity=labels(os,OPPORTUNITY_RESULT).find(a=>eq(a[2],effect[1]))!;
 expect(opportunity).toBeDefined();expect(opportunity[3]).toEqual(effect[2]);expect(opportunity[4]).toEqual(effect[3]);expect(opportunity[5]).toBe(!blocked);expect(labels(os,OBSTRUCTION_RESULT)).toHaveLength(0);
 const skill=labels(os,SKILL_ACTUAL).find(a=>eq(a[2],effect[1]))!;expect(skill).toBeDefined();expect(skill[6]).toBe(true);expect(skill[7]).toBe(true);
 const observations=labels(os,PERFORMANCE_OBS).filter(a=>uint(a[2])===10n);expect(observations.length).toBe(visible?1:0);
 for(const o of observations){
  expect(o[5]).toEqual(effect[3]);expect(o[6]).toBe(!blocked);expect(o[7]).toBe(true);
  const journal=items(state.read(outcomePath(o[3])).value!,'list');expect(items(journal[1],'list')).toContainEqual(list(o));
  const belief=expectationValue(state.read(expectationPath(o[3],uint(o[4]))).value);expect([belief.mean?.numerator,belief.mean?.denominator]).toEqual([blocked?0n:1n,1n]);expect(belief.supports.length).toBeGreaterThan(0);
 }
 const traces=outputs(snapshot.trace,160n),source=traces.find(t=>eq(f(rec(f(t,4n),130n),1n),opportunity[1]))!;
 expect(source).toBeDefined();expect(uint(f(rec(f(source,4n),130n),3n))).toBe(100n);expect(f(source,6n)).toEqual(text(OPPORTUNITY_VERSION));expect(items(f(source,11n),'list')).toHaveLength(0);
 const physical=traces.find(t=>eq(f(rec(f(t,4n),130n),5n),ACTION_BODY_EVENT)&&items(f(t,13n),'list').some(o=>eq(o,list(opportunity))))!;
 expect(physical).toBeDefined();expect(uint(f(rec(f(physical,4n),130n),3n))).toBe(110n);
 expect(f(physical,6n)).toEqual(text(SK+'-candidate'));

 const phaseOf=(value:CanonicalValue)=>{const t=traces.find(t=>eq(f(t,13n),value)||(typeof f(t,13n)!=='boolean'&&(f(t,13n) as {kind:string}).kind==='list'&&items(f(t,13n),'list').some(o=>eq(o,value))));expect(t).toBeDefined();return uint(f(rec(f(t!,4n),130n),3n));};
 expect(phaseOf(p.intent)).toBe(90n);expect(phaseOf(p.expression)).toBe(90n);
 const attempt=rec(f(p.execution!,2n),432n);expect(phaseOf(attempt)).toBe(110n);
 expect(p.transcript.length).toBeGreaterThan(0);
 expect(state.entries().filter(e=>e.path.rootStateTypeId===1000n&&e.path.fieldId===7n)).toHaveLength(0);
 return {p,state,os,snapshot,effect,opportunity,skill,observations};

}
function snapshots(a:ReturnType<Run['snapshot']>,b:ReturnType<Run['snapshot']>){const {state:as,outputs:ao,trace:at,...am}=a,{state:bs,outputs:bo,trace:bt,...bm}=b;expect(am).toEqual(bm);bytes(as,bs);bytes(ao,bo);bytes(at,bt);}
function full(a:Run,b:Run){snapshots(a.snapshot(),b.snapshot());bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());bytes(a.decisionHistory(),b.decisionHistory());bytes(a.decisionPresentation(),b.decisionPresentation());}
it('M200 lost opportunity prevents a competent chosen effect and ordinary outcome learning follows',async()=>{
 const a=await create(fixture(true)),b=await create(fixture(false)),x=live(a.run,false),y=live(b.run,true);
 expect(x.p.d).toEqual(y.p.d);expect(x.p.intent).toEqual(y.p.intent);expect(x.p.expression).toEqual(y.p.expression);expect(x.p.execution).toEqual(y.p.execution);
 expect(x.p.transcript).toEqual(y.p.transcript);expect(x.skill).toEqual(y.skill);expect(x.state.entries().filter(e=>e.path.rootStateTypeId===785n)).toEqual(y.state.entries().filter(e=>e.path.rootStateTypeId===785n));
 expect(x.state.entries().filter(e=>e.path.rootStateTypeId===455n)).not.toEqual(y.state.entries().filter(e=>e.path.rootStateTypeId===455n));
 const intent=x.p.intent,expression=x.p.expression;for(const r of[a.run,b.run]){await finish(r);expect(outputs(r.snapshot().outputs,425n)).toContainEqual(intent);expect(outputs(r.snapshot().outputs,426n)).toContainEqual(expression);}
 console.info('M200 CONNECTION PASS same actual decision/intent/expression/plan/attempt/protocol acknowledgement/intrinsic skill; world source100 after frozen choice changes body Applied->Blocked and authentic performance observation/learning1->0; full101.');
},570000);
it('M200 full continuation and reached physical fault preserve atomicity',async()=>{
 const b=fixture(false),a=await create(b,9n),repeat=await create(b,9n),restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.run.save()});full(a.run,repeat.run);full(a.run,restored);
 const saved=a.run.save(),before=a.run.snapshot(),original=traceModule.traceRecordValue;let reached=false;
 const spy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(value=>{const row=original(value);if(value.seamVersion===SK+'-candidate'&&value.event.dueAt===10n&&eq(value.event.eventTypeId,ACTION_BODY_EVENT)&&labels(value.outputProjection,OPPORTUNITY_RESULT).some(r=>r[5]===false)){reached=true;throw Error('M200 after actual lost opportunity');}return row;});
 try{await expect(a.run.settleNextInstant()).rejects.toThrow('M200 after actual lost opportunity');expect(reached).toBe(true);snapshots({...a.run.snapshot(),status:before.status},before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:saved});
 for(let n=0;;n++){expect(n).toBeLessThan(32);const more=await repeat.run.settleNextInstant();for(const r of[restored,recovered]){expect(await r.settleNextInstant()).toBe(more);full(repeat.run,r);}if(!more)break;}
 expect(repeat.run.snapshot().clock).toBe(101n);expect(repeat.run.diagnostic()).toBeUndefined();
 console.info('M200 CONTINUATION PASS repeat/public save9/recovery all later complete state/output/trace/save/identity/history/player bytes through101; reached110 lost opportunity fault atomic.');
},570000);

it('M200 admission privacy selected-action scope and old-version compatibility',async()=>{
 const b=fixture(),m=await prepareCharacterModel(b.s),rows=items(decode(b.d.orderedInputs),'list'),source=rows.at(-1)!;
 const altered=(change:(a:CanonicalValue[])=>void)=>{const a=[...items(source,'list')];change(a);return {...b.d,orderedInputs:enc(list([...rows.slice(0,-1),list(a)]))};};
 for(const d of[
  ...[30,90,110].map(phase=>altered(a=>{a[1]=u(phase);})),altered(a=>{a[0]=signed(0);}),
  altered(a=>{a[3]=list([text(OPPORTUNITY),b.people[0],items(a[3],'list')[2]]);}),
  altered(a=>{a[3]=list([text(OPPORTUNITY),C,set([])]);}),
  altered(a=>{a[3]=list([text(OPPORTUNITY),C,set(b.actions.map(x=>list([x,text('true')])))]);}),
  altered(a=>{a[4]=list([u(1)]);}),{...b.d,orderedInputs:enc(list([...rows,source]))}
 ])await expect(createCharacterRun(m,d)).rejects.toThrow('execution opportunity');
 const legacySlots=[...items(decode(b.s.registry),'list')],legacyObserver=[...items(legacySlots[50],'list')];legacyObserver[3]=list(items(legacyObserver[3],'list').map(v=>list(items(v,'list').slice(0,3))));legacySlots[50]=list(legacyObserver);
 await expect(createCharacterRun(await prepareCharacterModel({...b.s,registry:enc(list(legacySlots)),rulesVersion:OBSTRUCTION_WITNESS_RULES,registrySchemaVersion:OBSTRUCTION_WITNESS_REGISTRY}),b.d)).rejects.toThrow('execution opportunity version');
 for(const covered of[set([list([text('foreign'),true])]),set(b.actions.map(()=>list([b.actions[0],true])))])
  expect(()=>opportunitySource(list([text(OPPORTUNITY),C,covered]),C,b.actions)).toThrow('execution opportunity');
 const event={eventId:1n,eventSequence:1n,eventTypeId:OPPORTUNITY_SOURCE,dueAt:simInstant(10n),phase:100n,payload:items(source,'list')[3],dependencies:list([]),causalParentEventIds:[]};
 const h=createExternalObstruction(C,b.people,[event],C,C,undefined,b.actions);h.begin(10n);
 expect(()=>h.execute({event:{...event,payload:list([text(OPPORTUNITY),C,set(b.actions.map(x=>list([x,false])))])}} as never)).toThrow('unbound source');
 expect(()=>h.prepareCommit()).toThrow('unconsumed');h.close();
 const a=await create(b),x=live(a.run,false),chosen=x.effect[3];
 const nonchosen=altered(a=>{a[3]=list([text(OPPORTUNITY),C,set(b.actions.map(x=>list([x,eq(x,chosen)])))]);});
 expect(b.actions.some(x=>!eq(x,chosen))).toBe(true);
 const c=await create({...b,d:nonchosen}),y=live(c.run,false);
 expect(x.p.d).toEqual(y.p.d);expect(x.effect).toEqual(y.effect);bytes(a.run.snapshot().state,c.run.snapshot().state);
 // No input source is equivalent to the previous version; no source ID allocation comparison.
 const old=oldFixture(0,true,false),now={...old,s:b.s};
 const o=await create(old),n=await create(now);expect(capture(o.run).d).toEqual(capture(n.run).d);bytes(o.run.snapshot().state,n.run.snapshot().state);
 for(const r of[a.run,c.run,o.run,n.run])await finish(r);
 for(const available of[true,false]){const z=await create(fixture(available,false)),v=live(z.run,!available,false);expect(v.state.entries().filter(e=>e.path.rootStateTypeId===1000n&&[6n,7n].includes(e.path.fieldId))).toHaveLength(0);await finish(z.run);}
 console.info('M200 BOUNDARIES PASS phase/time/holder/action/coverage/duplicate/dependencies/old version/source authentication reject; nonselected loss and absent source preserve effects; hidden outcome unknown; no actor witness; full101.');
},570000);
it('M200 opportunity loss blocks queue creation but not a prior committed delayed receipt',async()=>{
 const delayed=(blocked:0|1)=>{const b=fixture(!blocked),slots=[...items(decode(b.s.registry),'list')],actuator=items(slots[10],'list');
  slots[10]=list([actuator[0],actuator[1],set(items(actuator[2],'set').map(v=>{const a=items(v,'list');return list([a[0],a[1],u(2)]);}))]);
  const rows=items(decode(b.d.orderedInputs),'list');return {...b,s:{...b.s,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list([...rows,list([signed(12),u(100),OPPORTUNITY_SOURCE,list([text(OPPORTUNITY),C,set(b.actions.map(action=>list([action,false])))]),list([])])]))}};};
 const a=await create(delayed(0)),b=await create(delayed(1)),x=capture(a.run),y=capture(b.run);expect(x.d).toEqual(y.d);expect(x.intent).toEqual(y.intent);expect(x.expression).toEqual(y.expression);
 const effect=(run:Run,p:ReturnType<typeof capture>)=>labels(decode(run.snapshot().outputs),ACTION_BODY).find(r=>eq(r[1],f(rec(p.execution!,433n),1n)))!;
 const queued=effect(a.run,x),blocked=effect(b.run,y);expect(queued[5]).toEqual(text('Queued'));expect(blocked[5]).toEqual(text('Blocked'));
 await through(a.run,12n);await through(b.run,12n);
 expect(labels(decode(a.run.snapshot().outputs),ACTION_BODY_RECEIPT).filter(r=>eq(r[1],queued[1]))).toHaveLength(1);
 expect(labels(decode(b.run.snapshot().outputs),ACTION_BODY_RECEIPT).filter(r=>eq(r[1],blocked[1]))).toHaveLength(0);
 for(const r of[a.run,b.run])await finish(r);
 expect(labels(decode(a.run.snapshot().outputs),ACTION_BODY_RECEIPT).filter(r=>eq(r[1],queued[1]))).toHaveLength(1);
 expect(labels(decode(b.run.snapshot().outputs),ACTION_BODY_RECEIPT).filter(r=>eq(r[1],blocked[1]))).toHaveLength(0);
 console.info('M200 DELAY PASS fixed delay2: blocked10 never queues/receives; unblocked10 receipt still arrives12 despite a new opportunity loss12. Same original choice, full101.');
},570000);

it('M200 opportunity transfer preserves every original source',()=>{
 const old=originalOpportunity(),now=fixture();bytes(old.d.orderedInputs,now.d.orderedInputs);bytes(old.d.initialState,now.d.initialState);bytes(old.d.runSeed,now.d.runSeed);
 const a=items(decode(old.s.registry),'list'),b=items(decode(now.s.registry),'list');expect(a).toHaveLength(55);expect(b).toHaveLength(55);for(let i=0;i<55;i++)if(i!==50)expect(b[i]).toEqual(a[i]);
 console.info('M200 SCHEMA PASS opportunity originals/S0/seed unchanged; only current version bundle and local actor mapping differ.');
});
