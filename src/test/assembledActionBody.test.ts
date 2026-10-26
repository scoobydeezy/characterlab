import {describe,it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,MEMORY_CONTEXT_RULES,MEMORY_CONTEXT_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {ACTION_BODY,ACTION_BODY_EVENT,selectedBodyEffect} from '../assembled/actionBody';
import {createBodyExecution,bodyId,BODY_SAMPLE} from '../assembled/body';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {isBodyEpisodePath} from '../assembled/memory';
import {canonicalEncode as enc,list,set,text,signed,unsigned,rational,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent} from '../substrate/scheduler';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataIdentity as id,dataText as txt,dataUnsigned as uint} from '../campaign2/canonicalData';
import {actionSource,actionData,replaceActuator} from './fixtures/assembledActionBody';
import {outputs} from './fixtures/assembledInteraction';
import {contextSource} from './fixtures/assembledMemoryContext';
import {workLimit} from './fixtures/assembledCharacter';
import {C} from './fixtures/campaign2Cognitive';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const reports=(run:Run,label:string)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const state=(run:Run)=>restoreAuthoritativeState(decode(run.snapshot().state));
const nonBody=(run:Run)=>state(run).entries().filter(e=>e.path.rootStateTypeId!==455n);
const traces=(run:Run)=>outputs(run.snapshot().trace,160n);
const event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n);
const name=(t:CanonicalValue)=>txt(id(f(rec(t,160n),7n)).payload);
const at=(t:CanonicalValue,time:bigint)=>key(f(event(t),2n))===key(signed(time));
const cognition=(run:Run)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId>=381n&&v.schema.typeId<=433n);
const draws=(run:Run)=>new Map(traces(run).flatMap(t=>items(f(t,14n),'list')).map(v=>[key(f(rec(v,411n),1n)),v]));
const choice=(run:Run,index=1)=>{const d=outputs(run.snapshot().outputs,409n)[index],r=rec(f(d,4n),419n);expect(uint(f(r,1n))).toBe(3n);return txt(id(f(rec(f(rec(f(r,2n),420n),1n),395n),2n)).payload);};
async function through(run:Run,time:bigint){for(let i=0;run.snapshot().clock<time;i++){expect(i).toBeLessThan(32);expect(await run.settleNextInstant()).toBe(true);}expect(run.snapshot().clock).toBe(time);}
async function finish(run:Run){for(let i=0;await run.settleNextInstant();i++)expect(i).toBeLessThan(32);expect(run.snapshot().clock).toBe(10n);expect(run.diagnostic()).toBeUndefined();}
const exact=(a:Run,b:Run)=>{expect(b.snapshot()).toEqual(a.snapshot());expect(b.save()).toEqual(a.save());expect(b.runIdentity()).toEqual(a.runIdentity());};
function scheduled(t:CanonicalValue):ScheduledEvent {const e=event(t),time=f(e,2n);if(typeof time==='boolean'||time.kind!=='signed')throw Error('time');return {eventId:uint(f(e,1n)),dueAt:simInstant(time.value),phase:uint(f(e,3n)),eventSequence:uint(f(e,4n)),eventTypeId:id(f(e,5n)),payload:f(e,6n),dependencies:f(e,7n),causalParentEventIds:items(f(e,8n),'list').map(uint)};}
function firstEffect(run:Run,allowed:boolean){
 const effect=reports(run,ACTION_BODY)[0],protocol=outputs(run.snapshot().outputs,433n)[0],attempt=rec(f(protocol,2n),432n);expect(effect[1]).toEqual(f(protocol,1n));expect(effect[2]).toEqual(f(attempt,1n));expect(effect[3]).toEqual(bodyId(1027,'definition/protocol-contact-two'));expect(effect[4]).toEqual(rational(80,1));expect(txt(effect[5])).toBe(allowed?'Applied':'Blocked');
 const body=traces(run).find(t=>name(t)==='event/assembled-action-body-effect'&&at(t,3n))!,producer=traces(run).find(t=>name(t)==='event/protocol-execution'&&at(t,3n))!;
 expect(uint(f(event(body),3n))).toBe(110n);expect(items(f(event(body),8n),'list')).toEqual([f(event(producer),1n)]);expect(f(event(body),6n)).toEqual(protocol);expect(f(producer,6n)).toEqual(text('assembled-character-protocol-body-source/0.1-candidate'));expect(f(body,6n)).toEqual(text('assembled-character-action-body/0.1-candidate'));expect(items(f(body,9n),'list')).toContainEqual(f(protocol,1n));
 const patch=items(f(body,17n),'list'); // committed structural diffs
 if(allowed){const physical=rec(effect[6],479n);expect([1n,2n,3n,4n,5n].map(n=>f(physical,n))).toEqual([7,80,80,0,87].map(n=>rational(n,1)));expect(patch.length).toBe(1);expect(items(f(body,11n),'list')).toHaveLength(1);}
 else {expect(effect[6]).toEqual(list([]));expect(patch).toHaveLength(0);expect(items(f(body,11n),'list')).toHaveLength(0);}
}
describe('M10 executed-action feedback',()=>{
 it('fixed16-seed matrix: identical first intent, actual actuation, later perception and changed later choice',async()=>{
  const models=[await prepareCharacterModel(actionSource(true)),await prepareCharacterModel(actionSource(false))];let changes=0,shared=0,overflow=0;
  for(let seed=0;seed<16;seed++){const runs:Run[]=[];for(const [i,m]of models.entries()){const run=await createCharacterRun(m,actionData(seed));await through(run,3n);firstEffect(run,i===0);runs.push(run);}
   const [a,b]=runs;expect(cognition(a)).toEqual(cognition(b));expect(nonBody(a)).toEqual(nonBody(b));expect(choice(a,0)).toBe(choice(b,0));expect(state(a).entries().filter(e=>e.path.rootStateTypeId===415n)).toEqual(state(b).entries().filter(e=>e.path.rootStateTypeId===415n));
   for(const [i,run]of runs.entries()){await through(run,5n);const sample=outputs(run.snapshot().outputs,461n).find(s=>key(f(s,4n))===key(signed(5)))!,interval=rec(f(sample,5n),462n);expect(f(interval,2n)).toEqual(rational(i===0?90:10,1));
    const j=reports(run,JOINT_APPRAISAL)[1];expect(j[2]).toEqual(sample);expect(txt(items(j[5],'list')[1])).toBe('Current');const rows=items(j[4],'list').map(v=>items(v,'list'));expect(rows.map(r=>r[4])).toEqual(i===0?[rational(1,20),rational(1,5)]:[rational(11,120),rational(11,30)]);
    expect(f(rec(f(rec(f(rec(j[1],384n),2n),381n),5n),380n),1n)).toEqual(unsigned(2));
    const modifiers=items(f(outputs(run.snapshot().outputs,408n)[1],3n),'list').map(n=>f(rec(n,407n),6n));expect(modifiers).toEqual([signed(0),signed(i===0?1:2)]);
    const effects=reports(run,ACTION_BODY);expect(effects).toHaveLength(2);expect(effects[1][3]).toEqual(bodyId(1027,choice(run)));if(i===0){const p=rec(effects[1][6],479n),isTwo=choice(run).endsWith('two');expect([1n,2n,3n,4n,5n].map(n=>f(p,n))).toEqual((isTwo?[85,80,15,65,100]:[85,0,0,0,85]).map(n=>rational(n,1)));if(isTwo)overflow++;}
    await finish(run);
   }
   for(const [address,draw]of draws(a))if(draws(b).has(address)){expect(draws(b).get(address)).toEqual(draw);shared++;}if(choice(a)!==choice(b))changes++;
   console.info('M10 seed '+seed+' first='+choice(a,0)+' later='+JSON.stringify(runs.map(r=>choice(r)))+' draws='+JSON.stringify(runs.map(r=>draws(r).size)));
  }console.info('M10 later choices differ='+changes+'/16; actual overlapping draw pairs='+shared+'; overflow witnesses='+overflow);expect(changes).toBeGreaterThan(0);expect(overflow).toBeGreaterThan(0);
 },540000);
 it('controls: without later sensing hidden actuation cannot change cognition, even with recalled old context',async()=>{
  const runs:Run[]=[];for(const allowed of [true,false]){const run=await createCharacterRun(await prepareCharacterModel(actionSource(allowed)),actionData(7,false));await through(run,5n);runs.push(run);}const [a,b]=runs;expect(a.snapshot().state).not.toEqual(b.snapshot().state);expect(cognition(a)).toEqual(cognition(b));expect(reports(a,JOINT_APPRAISAL)).toEqual(reports(b,JOINT_APPRAISAL));expect(draws(a)).toEqual(draws(b));expect(txt(items(reports(a,JOINT_APPRAISAL)[1][5],'list')[1])).toBe('RecalledContext');expect(choice(a)).toBe(choice(b));
  for(const run of runs)await finish(run);
 },90000);
 it('controls: whole-prefix repeat/restore after physical actuation at3 matches later boundaries and real draws',async()=>{
  const s=actionSource(),m=await prepareCharacterModel(s),d=actionData(7),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,3n);await through(b,3n);exact(a,b);const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);
  for(let i=0;;i++){expect(i).toBeLessThan(32);const more=await a.settleNextInstant();for(const peer of [b,restored]){expect(await peer.settleNextInstant()).toBe(more);exact(a,peer);}if(!more)break;}expect(draws(a).size).toBeGreaterThan(0);
 },150000);
 it('controls: hidden levels preserve safe cognition; zero/unselected mappings and absent choice cannot create gain',async()=>{
  const m=await prepareCharacterModel(actionSource()),a=await createCharacterRun(m,actionData(7,true,10)),b=await createCharacterRun(m,actionData(7,true,11));await through(a,3n);await through(b,3n);expect(a.snapshot().state).not.toEqual(b.snapshot().state);await finish(a);await finish(b);expect(cognition(a)).toEqual(cognition(b));expect(reports(a,JOINT_APPRAISAL)).toEqual(reports(b,JOINT_APPRAISAL));expect(draws(a)).toEqual(draws(b));
  const blocked=await createCharacterRun(await prepareCharacterModel(actionSource(false)),actionData());await finish(blocked);
  for(const one of [0,80]){const zero=await createCharacterRun(await prepareCharacterModel(actionSource(true,one,0)),actionData());await finish(zero);expect(cognition(zero)).toEqual(cognition(blocked));for(const e of reports(zero,ACTION_BODY)){expect(e[3]).toEqual(bodyId(1027,'definition/protocol-contact-two'));expect(e[4]).toEqual(rational(0,1));expect(f(rec(e[6],479n),3n)).toEqual(rational(0,1));}}
  const none=await createCharacterRun(await prepareCharacterModel(actionSource(true,0,80,0)),actionData());await finish(none);expect(outputs(none.snapshot().outputs,433n)).toHaveLength(0);expect(reports(none,ACTION_BODY)).toHaveLength(0);expect(traces(none).some(t=>name(t)==='event/assembled-action-body-effect')).toBe(false);
 },180000);
 it('controls: late failure after actual body application rolls back state, outputs, trace and queue',async()=>{
  const s=actionSource(),d=actionData(),ok=await createCharacterRun(await prepareCharacterModel(s),d);await through(ok,3n);firstEffect(ok,true);const ts=traces(ok).filter(t=>at(t,3n)),ids=[...new Set(ts.map(t=>key(f(event(t),1n))))],effect=ts.find(t=>name(t)==='event/assembled-action-body-effect')!;expect(ids.indexOf(key(f(event(effect),1n)))).toBeLessThan(ids.length-1);
  const failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(ids.length-1))),d);await through(failed,2n);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow();expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(failed.diagnostic()).toBeDefined();console.info('M10 late rollback '+ids.length+' events; limit'+(ids.length-1));
 },90000);
 it('controls: governed configuration rejects missing/foreign/duplicate/invalid effects and forged public source',async()=>{
  const s=actionSource(),a=bodyId(1027,'definition/protocol-contact-one'),b=bodyId(1027,'definition/protocol-contact-two'),pair=(action:CanonicalValue,amount:CanonicalValue)=>list([action,amount]),config=(rows:CanonicalValue[],permission:CanonicalValue=true)=>list([text(ACTION_BODY),permission,set(rows)]);
  for(const bad of [config([pair(a,rational(0,1))]),config([pair(a,rational(0,1)),pair(a,rational(1,1))]),config([pair(a,rational(0,1)),pair(bodyId(1027,'foreign'),rational(1,1))]),config([pair(a,rational(-1,1)),pair(b,rational(1,1))]),config([pair(a,rational(0,1)),pair(b,rational(101,1))]),config([pair(a,rational(0,1)),pair(b,rational(1,1))],unsigned(1))])await expect(prepareCharacterModel(replaceActuator(s,bad))).rejects.toThrow();
  await expect(prepareCharacterModel({...s,rulesVersion:MEMORY_CONTEXT_RULES,registrySchemaVersion:MEMORY_CONTEXT_REGISTRY})).rejects.toThrow('slot count');
  const m=await prepareCharacterModel(s),d=actionData();await expect(createCharacterRun(m,{...d,orderedInputs:enc(list([list([signed(3),unsigned(110),ACTION_BODY_EVENT,list([]),list([])])]))})).rejects.toThrow();
  const legal=await createCharacterRun(await prepareCharacterModel(actionSource(true,17,37)),actionData());await through(legal,3n);expect(reports(legal,ACTION_BODY)[0][4]).toEqual(rational(37,1));
 });
 it('controls: private execution binding rejects foreign attempts, forged/duplicate children and repeated execution',async()=>{
  const s=actionSource(),run=await createCharacterRun(await prepareCharacterModel(s),actionData());await through(run,2n);const before=state(run);await through(run,3n);
  const producer=traces(run).find(t=>name(t)==='event/protocol-execution'&&at(t,3n))!,childTrace=traces(run).find(t=>name(t)==='event/assembled-action-body-effect'&&at(t,3n))!,parent=scheduled(producer),child=scheduled(childTrace),out=outputs(run.snapshot().outputs,433n)[0],model=await compileCharacterModel(s),component=await compileCharacterState(model);
  const body=createBodyExecution(model.body!,C,component.stateModel,[],model.modelIdentity.value,decode(run.runIdentity()),model.actionBody);body.begin(3n);
  expect(()=>body.observeExecution({...parent,payload:list([])},out)).toThrow('attempt association');const plan=body.observeExecution(parent,out)!;expect(()=>body.prepareCommit()).toThrow('unfinished');expect(()=>body.observeExecution(parent,out)).toThrow('lifecycle');expect(()=>plan.bind([{...child,payload:list([])}])).toThrow('mismatch');plan.bind([child]);expect(()=>plan.bind([child])).toThrow('lifecycle');
  const context={state:before,event:child,instant:simInstant(3n),allocateRuntimeId(){throw Error('unexpected effect allocation');}};expect(()=>body.execute({...context,event:{...child,causalParentEventIds:[]}})).toThrow('unbound');const result=body.execute(context);expect(result.outputs[0]).toEqual(list(reports(run,ACTION_BODY)[0]));expect(()=>body.execute(context)).toThrow('lifecycle');body.prepareCommit();body.close();
  const bad=record(out.schema,new Map([...out.fields].map(([n,v])=>[n,n===3n?unsigned(7):v])));expect(()=>selectedBodyEffect(bad,C,model.actionBody!)).toThrow('count association');expect(()=>selectedBodyEffect(out,bodyId(1002,'foreign'),model.actionBody!)).toThrow('holder');
 });
});
