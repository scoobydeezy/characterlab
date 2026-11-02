import {it,expect} from 'vitest';
import {list,set,text,signed,unsigned,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {simInstant,INT64_MAX} from '../substrate/time';
import type {ScheduledEvent} from '../substrate/scheduler';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {ACTION_BODY,ACTION_BODY_EVENT,ACTION_BODY_RECEIPT,ACTION_BODY_RECEIPT_EVENT,DELAYED_BODY_VERSION} from '../assembled/actionBody';
import {BODY_DELIVERY,createBodyExecution,bodyPath} from '../assembled/body';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {SKILL_ACTUAL,SKILL_UPDATE} from '../assembled/skill';
import {SIGNAL} from '../assembled/communication';
import {receivingRecord as rec,randomDrawRecord} from '../assembled/codecs';
import {dataField as f,dataUnsigned as uint,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
import {source,data,actuator,decode,items,key,enc} from './fixtures/assembledDelayedBody';
import {source as oldSource} from './fixtures/assembledCausalOpportunities';
import {mapIdentities} from './fixtures/assembledValueReceiving';
import {outputs,through,signedValue,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
import {workLimit} from './fixtures/assembledCharacter';
import {taskKeys} from './fixtures/assembledStrategy';
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const traces=(r:Run)=>outputs(r.snapshot().trace,160n),event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n);
const traceAt=(r:Run,type:CanonicalValue,at:bigint)=>traces(r).filter(t=>key(f(event(t),5n))===key(type)&&signedValue(f(event(t),2n))===at);
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const exact=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
const sample=(r:Run,at:bigint)=>outputs(r.snapshot().outputs,461n).find(v=>signedValue(f(v,4n))===at)!;
const bodyRows=(r:Run)=>reports(r,JOINT_APPRAISAL).map(a=>a[4]);
const physicalTasks=taskKeys();
const diagnostic=(value:unknown)=>JSON.stringify(value,(_key,v)=>typeof v==='bigint'?String(v):v instanceof Map?[...v]:v instanceof Uint8Array?[...v]:v);
function live(r:Run,index=1){
 const report=reports(r,JOINT_APPRAISAL)[index],rows=items(report[4],'list').map(v=>items(v,'list'));
 for(const task of physicalTasks){
  const row=rows.find(a=>key(a[0])===key(task));
  if(!row||row.length!==5)console.info('M38 liveness failure '+diagnostic({index,task,row,taskAppraisal:report[1],sample:report[2],experience:report[3],memory:report[5]}));
  expect(row,'liveness: physical task must be present before comparison; index='+index).toBeDefined();
  expect(row,'liveness: Unavailable/Deferred is not a behavioral comparison; index='+index).toHaveLength(5);
  for(const value of row!.slice(1))expect(typeof value!=='boolean'&&value.kind==='rational','liveness: known exact factor required').toBe(true);
 }
 return rows;
}
const modifiers=(r:Run,index:number)=>items(f(outputs(r.snapshot().outputs,408n)[index],3n),'list').map(v=>{const n=rec(v,407n);return list([f(n,1n),f(n,6n)]);});
const decisions=(r:Run)=>outputs(r.snapshot().outputs,409n).map(v=>{const status=rec(f(v,4n),419n);expect(uint(f(status,1n))).toBe(3n);const chosen=rec(f(status,2n),420n);return list([f(v,2n),...([1n,2n,3n,4n,8n].map(n=>f(chosen,n)))]);});
const draws=(r:Run)=>traces(r).flatMap(t=>items(f(t,14n),'list')).map(randomDrawRecord);
function scheduled(t:CanonicalValue):ScheduledEvent{const e=event(t);return {eventId:uint(f(e,1n)),dueAt:simInstant(signedValue(f(e,2n))),phase:uint(f(e,3n)),eventSequence:uint(f(e,4n)),eventTypeId:id(f(e,5n)),payload:f(e,6n),dependencies:f(e,7n),causalParentEventIds:items(f(e,8n),'list').map(uint)};}
async function mapped(delay:number,sense=true){const m=await prepareCharacterModel(source(delay)),setup=await createCharacterRun(m,data(sense));await through(setup,7n);const r=await createCharacterRun(m,data(sense,mapIdentities(setup)));await through(r,7n);return r;}
function coupled(a:Run,b:Run){const right=new Map(draws(b).map(v=>[key(f(v,2n)),v]));let n=0;for(const x of draws(a)){const y=right.get(key(f(x,2n)));if(y){for(const k of [2n,3n,4n,7n])expect(f(y,k)).toEqual(f(x,k));n++;}}console.info('M38 draws A='+draws(a).length+' B='+draws(b).length+' matched='+n+'; modes='+JSON.stringify([a,b].map(r=>outputs(r.snapshot().outputs,409n).map(v=>String(uint(f(rec(f(rec(f(v,4n),419n),2n),420n),8n)))))));return n;}
// Scenario: physical tasks, no social dependencies; live body3/5/7 and standard reports; reserve10.
it('connection: a performed action waits for delivery, then changes permitted body appraisal and reasons',async()=>{
 expect(f(rec(restoreAuthoritativeState(decode(data().initialState)).read(bodyPath(C)).value!,454n),1n)).toEqual(q(10,1));
 const a=await mapped(0),b=await mapped(2);live(a);live(b);console.info('M38 liveness PASS: both original physical-task rows have five known fields in both arms at5');coupled(a,b);
 expect(reports(a,ACTION_BODY)).toHaveLength(3);expect(reports(b,ACTION_BODY)).toHaveLength(3);
 expect(reports(a,ACTION_BODY).map(x=>x[5])).toEqual(Array(3).fill(text('Applied')));expect(reports(b,ACTION_BODY).map(x=>x[5])).toEqual(Array(3).fill(text('Queued')));
 // First performance matches; later selected procedures/retained skill may differ.
 for(const r of [a,b])expect(reports(r,SKILL_ACTUAL).map(x=>x[7])).toEqual([true,true,true]);
 expect(reports(a,SKILL_ACTUAL)[0].slice(3)).toEqual(reports(b,SKILL_ACTUAL)[0].slice(3));
 expect(reports(a,SKILL_UPDATE)).toHaveLength(3);expect(reports(b,SKILL_UPDATE)).toHaveLength(3);expect(reports(a,SIGNAL)[0].slice(3)).toEqual(reports(b,SIGNAL)[0].slice(3));
 for(const r of [a,b]){const signals=reports(r,SIGNAL),operations=reports(r,ACTION_BODY);expect(signals).toHaveLength(3);signals.forEach((signal,i)=>{expect(signal[3]).toEqual(operations[i][3]);expect(signal[4]).toBe(true);});}
 console.info('M38 connection projections '+diagnostic([a,b].map(r=>({sample5:sample(r,5n),appraisal5:reports(r,JOINT_APPRAISAL)[1],modifiers5:modifiers(r,1),skills:reports(r,SKILL_ACTUAL).map(x=>x.slice(3)),receipts:reports(r,ACTION_BODY_RECEIPT)}))));
 const request=traceAt(b,ACTION_BODY_EVENT,3n)[0],receipt=traceAt(b,ACTION_BODY_RECEIPT_EVENT,5n)[0],before=traceAt(b,ACTION_BODY_RECEIPT_EVENT,3n);
 expect(before).toEqual([]);expect(f(request,17n)).toEqual(list([]));expect(items(f(request,11n),'list')).toHaveLength(2);expect(reports(b,ACTION_BODY)[0][6]).toEqual(list([]));expect(f(request,6n)).toEqual(text(DELAYED_BODY_VERSION));
 expect(f(event(receipt),8n)).toEqual(list([f(event(request),1n)]));expect(f(event(receipt),6n)).toEqual(f(event(request),6n));expect(f(receipt,9n)).toEqual(f(request,9n));expect(items(f(receipt,17n),'list')).toHaveLength(1);
 const received=reports(b,ACTION_BODY_RECEIPT);expect(received).toHaveLength(2);expect(received[0].slice(1,5)).toEqual(reports(b,ACTION_BODY)[0].slice(1,5));expect([1n,2n,3n,4n,5n].map(k=>f(rec(received[0][5],479n),k))).toEqual([5,80,80,0,85].map(n=>q(n,1)));
 expect(f(rec(f(sample(a,5n),5n),462n),2n)).toEqual(q(90,1));expect(f(rec(f(sample(b,5n),5n),462n),2n)).toEqual(q(10,1));expect(f(rec(f(sample(b,7n),5n),462n),2n)).toEqual(q(90,1));
 for(const r of [a,b])expect(reports(r,JOINT_APPRAISAL)[1][2]).toEqual(sample(r,5n));expect(bodyRows(a)[1]).not.toEqual(bodyRows(b)[1]);expect(modifiers(a,1)).not.toEqual(modifiers(b,1));
 console.info('M38 first receipt5: before5 +80 =>85; sample5 upper immediate90/delayed10; sample7 delayed90; exact current-evidence body factors/reason modifiers differ');
},540000);
// Same physical scenario/channels; reserve100 is the original saturated-body control.
it('saturation: original reserve100 masks the delivery contrast through the permitted interval',async()=>{
 const runs:Run[]=[];for(const delay of [0,2]){const d=data(true,undefined,100),r=await createCharacterRun(await prepareCharacterModel(source(delay)),d);expect(f(rec(state(r).read(bodyPath(C)).value!,454n),1n)).toEqual(q(100,1));await through(r,7n);live(r);runs.push(r);for(const at of [3n,5n,7n])expect(f(rec(f(sample(r,at),5n),462n),2n)).toEqual(q(100,1));}
 const receipt=reports(runs[1],ACTION_BODY_RECEIPT)[0];expect([1n,2n,3n,4n,5n].map(k=>f(rec(receipt[5],479n),k))).toEqual([95,80,5,75,100].map(n=>q(n,1)));expect(bodyRows(runs[0])).toEqual(bodyRows(runs[1]));console.info('M38 retained reserve100 saturation: receipt5 95+80 ->100, applied5/overflow75; permitted intervals/body factors equal; no choice-effect claim');
},180000);
// Physical tasks; samples5/7 removed, sample3 retained; recalled-context liveness must be checked; reserve10.
it('controls: hidden delivery cannot affect cognition',async()=>{
 const a=await mapped(0,false),b=await mapped(2,false);for(const r of [a,b])for(const i of [0,1,2])live(r,i);coupled(a,b);expect(bodyRows(a)).toEqual(bodyRows(b));expect(decisions(a)).toEqual(decisions(b));expect(items(f(traceAt(a,ACTION_BODY_EVENT,3n)[0],17n),'list')).toHaveLength(1);expect(f(traceAt(b,ACTION_BODY_EVENT,3n)[0],17n)).toEqual(list([]));expect(outputs(a.snapshot().outputs,461n)).toHaveLength(1);expect(outputs(b.snapshot().outputs,461n)).toHaveLength(1);
 console.info('M38 hidden physical timing preserves live body factors/decisions');
},300000);
// Same physical scenario/channels, reserve10; disabled actuator or zero amount only.
it('blocked/zero: no queued receipt when blocked and no gain from zero amount',async()=>{
 for(const [permitted,amount]of [[false,80],[true,0]] as const){const r=await createCharacterRun(await prepareCharacterModel(source(2,permitted,amount)),data());await through(r,7n);const rs=reports(r,ACTION_BODY_RECEIPT);if(!permitted){expect(rs).toEqual([]);expect(reports(r,ACTION_BODY).every(x=>txt(x[5])==='Blocked')).toBe(true);}else{expect(rs).toHaveLength(2);for(const x of rs)expect(f(rec(x[5],479n),3n)).toEqual(q(0,1));}}
 console.info('M38 blocked has no queue; zero settles without gain');
},300000);
// Physical tasks and normal channels, reserve10; checkpoint3 while receipt5 is pending.
it('persistence: pending receipt survives exact repeat3 and restore3 through10',async()=>{
 const s=source(),d=data(),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,3n);await through(b,3n);exact(a,b);expect(reports(a,ACTION_BODY_RECEIPT)).toEqual([]);const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);
 while(a.snapshot().clock<10n){expect(await a.settleNextInstant()).toBe(await restored.settleNextInstant());exact(a,restored);}expect(await a.settleNextInstant()).toBe(false);expect(await restored.settleNextInstant()).toBe(false);exact(a,restored);expect(reports(a,ACTION_BODY_RECEIPT)).toHaveLength(3);expect(reports(a,SKILL_ACTUAL)).toHaveLength(3);expect(reports(a,SKILL_UPDATE)).toHaveLength(3);console.info('M38 pending receipt5 restored from3; exact continuation through10; three operations, three receipts, no duplicate practice');
},300000);
// Physical tasks and normal channels, reserve10; zero deliveries add late5 work only.
it('rollback: late5 failure preserves shared state and private receipt association retries atomically',async()=>{
 const s=source(),d=data(),fault={...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),...Array.from({length:16},()=>list([signed(5),unsigned(110),BODY_DELIVERY,list([C,q(0,1)]),list([])]))]))},oracle=await createCharacterRun(await prepareCharacterModel(s),fault);await through(oracle,5n);
 const counts=new Map<bigint,Set<string>>();for(const t of traces(oracle)){const e=event(t),at=signedValue(f(e,2n)),ids=counts.get(at)??new Set<string>();ids.add(key(f(e,1n)));counts.set(at,ids);}const n=counts.get(5n)!.size;expect(Math.max(...[...counts].filter(([t])=>t<5n).map(([,x])=>x.size))).toBeLessThan(n);const ordered=[...counts.get(5n)!],delivery=traceAt(oracle,ACTION_BODY_RECEIPT_EVENT,5n)[0];expect(ordered.indexOf(key(f(event(delivery),1n)))).toBeLessThan(n-1);
 const failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(n-1))),fault);await through(failed,4n);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow('work ceiling');expect({...failed.snapshot(),status:before.status}).toEqual(before);
 const m=await compileCharacterModel(s),c=await compileCharacterState(m),initial=c.initialState(d.initialState),body=createBodyExecution(m.body!,C,c.stateModel,[],m.modelIdentity.value,m.modelIdentity.value,m.actionBody),request=scheduled(traceAt(oracle,ACTION_BODY_EVENT,3n)[0]),parent=scheduled(traces(oracle).find(t=>key(f(event(t),1n))===key(unsigned(request.causalParentEventIds[0])))!),child=scheduled(delivery);
 body.begin(3n);body.observeExecution(parent,request.payload)!.bind([request]);const queued=body.execute({event:request,state:initial} as never);queued.traceFactory([child]);body.prepareCommit();body.commit();body.close();body.begin(4n);body.prepareCommit();body.commit();body.close();body.begin(6n);expect(()=>body.prepareCommit()).toThrow('unfinished');body.close();
 body.begin(5n);expect(()=>body.execute({event:{...child,payload:list([])},state:initial} as never)).toThrow('unbound');const first=body.execute({event:child,state:initial} as never);first.traceFactory([]);expect(()=>body.execute({event:child,state:initial} as never)).toThrow('lifecycle');body.close();body.begin(5n);const retry=body.execute({event:child,state:initial} as never);expect(retry.outputs).toEqual(first.outputs);expect(retry.nextState.entries()).toEqual(first.nextState.entries());retry.traceFactory([]);body.prepareCommit();body.commit();body.close();body.begin(5n);expect(()=>body.execute({event:child,state:initial} as never)).toThrow('unbound');body.close();
 const lateParent={...parent,dueAt:simInstant(INT64_MAX)},lateRequest={...request,dueAt:simInstant(INT64_MAX)};body.begin(INT64_MAX);body.observeExecution(lateParent,lateRequest.payload)!.bind([lateRequest]);expect(()=>body.execute({event:lateRequest,state:initial} as never)).toThrow('overflow');body.close();console.info('M38 late5 work limit '+(n-1)+'/'+n+'; private receipt rollback/retry, forged/duplicate/overdue delivery and overflow reject');
},180000);
// Physical tasks, normal channels, reserve10; validate declared dependencies without synthetic belief.
it('admission: governed delays reject invalid coverage, versions and public receipt injection',async()=>{
 const s=source(),a=items(items(decode(s.registry),'list')[10],'list'),rows=items(a[2],'set'),row=items(rows[0],'list');
 for(const bad of [actuator(s,a=>[...a.slice(0,2),set([list(row.slice(0,2)),...rows.slice(1)])]),actuator(s,a=>[...a.slice(0,2),set([list([...row.slice(0,2),unsigned(5)]),...rows.slice(1)])]),actuator(s,a=>[...a.slice(0,2),set([list([...row.slice(0,2),q(1,2)]),...rows.slice(1)])]),actuator(s,a=>[...a.slice(0,2),set([list([...row.slice(0,2),signed(-1)]),...rows.slice(1)])]),actuator(s,a=>[...a.slice(0,2),set(rows.slice(1))]),actuator(s,a=>[...a.slice(0,2),set([rows[0],list([row[0],q(3,1),unsigned(1)]),...rows.slice(2)])]),{...s,rulesVersion:oldSource().rulesVersion,registrySchemaVersion:oldSource().registrySchemaVersion}, {...oldSource(),rulesVersion:s.rulesVersion,registrySchemaVersion:s.registrySchemaVersion}])await expect(prepareCharacterModel(bad)).rejects.toThrow();
 const compiled=await compileCharacterModel(s);expect(compiled.social!.tasks).toEqual([]);expect(compiled.social!.targets).toHaveLength(2);
 const old=oldSource(),oldSlots=[...items(decode(old.registry),'list')];oldSlots[19]=items(decode(s.registry),'list')[19];await expect(prepareCharacterModel({...old,registry:enc(list(oldSlots))})).rejects.toThrow('person requires task');
 const socialSlots=[...items(decode(s.registry),'list')],social=items(socialSlots[19],'list'),groups=items(social[1],'list');
 for(const taskRows of [[list([text('foreign-task'),true])],[list([physicalTasks[0],true]),list([physicalTasks[0],false])]]){const invalid=[...socialSlots];invalid[19]=list([social[0],list([list([items(groups[0],'list')[0],list(taskRows)]),...groups.slice(1)])]);await expect(prepareCharacterModel({...s,registry:enc(list(invalid))})).rejects.toThrow();}
 const m=await prepareCharacterModel(s),d=data();expect(restoreAuthoritativeState(decode(d.initialState)).entries().some(e=>e.path.rootStateTypeId===810n)).toBe(false);await expect(createCharacterRun(m,{...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),list([signed(5),unsigned(110),ACTION_BODY_RECEIPT_EVENT,list([]),list([])])]))})).rejects.toThrow();await prepareCharacterModel(source(4));console.info('M38 delay0..4 governed; invalid scalar/coverage/version/public receipt rejected');
},90000);
