import {otherToleranceKey} from './toleranceFixtures';
import {it,expect} from 'vitest';
import {list,text,signed,unsigned,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {simInstant} from '../substrate/time';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {ACTION_BODY_EVENT,ACTION_BODY_RECEIPT,ACTION_BODY_RECEIPT_EVENT} from '../assembled/actionBody';
import {BODY_DELIVERY,createBodyExecution,bodyPath} from '../assembled/body';
import {TOLERANCE_EFFECT,TOLERANCE_VERSION,compileTolerance,deliveredPotential,tolerancePath} from '../assembled/tolerance';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {receivingRecord as rec,randomDrawRecord} from '../assembled/codecs';
import {dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
import {campaign2Record as record} from '../campaign2/codecs';
import {replenishReserve} from '../campaign3/embodiedMath';
import {LAWS,type ToleranceLaw} from '../campaign3/toleranceEffect';
import {source,data,variable,decode,items,key,enc} from './fixtures/assembledTolerance';
import {source as oldSource} from './fixtures/assembledDelayedBody';
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
function live(r:Run,index=2){
 const report=reports(r,JOINT_APPRAISAL)[index],rows=items(report[4],'list').map(v=>items(v,'list'));
 for(const task of physicalTasks){
  const row=rows.find(a=>key(a[0])===key(task));
  if(!row||row.length!==5)console.info('M39 liveness failure '+diagnostic({index,task,row,taskAppraisal:report[1],sample:report[2],experience:report[3],memory:report[5]}));
  expect(row,'liveness: physical task must be present before comparison; index='+index).toBeDefined();
  expect(row,'liveness: Unavailable/Deferred is not a behavioral comparison; index='+index).toHaveLength(5);
  for(const value of row!.slice(1))expect(typeof value!=='boolean'&&value.kind==='rational','liveness: known exact factor required').toBe(true);
 }
 return rows;
}
const modifiers=(r:Run,index:number)=>items(f(outputs(r.snapshot().outputs,408n)[index],3n),'list').map(v=>{const n=rec(v,407n);return list([f(n,1n),f(n,6n)]);});
const decisions=(r:Run)=>outputs(r.snapshot().outputs,409n).map(v=>{const status=rec(f(v,4n),419n);expect(uint(f(status,1n))).toBe(3n);const chosen=rec(f(status,2n),420n);return list([f(v,2n),...([1n,2n,3n,4n,8n].map(n=>f(chosen,n)))]);});
const draws=(r:Run)=>traces(r).flatMap(t=>items(f(t,14n),'list')).map(randomDrawRecord);
function coupled(a:Run,b:Run){const right=new Map(draws(b).map(v=>[key(f(v,2n)),v]));let n=0;for(const x of draws(a)){const y=right.get(key(f(x,2n)));if(y){for(const k of [2n,3n,4n,7n])expect(f(y,k)).toEqual(f(x,k));n++;}}console.info('M39 draws A='+draws(a).length+' B='+draws(b).length+' matched='+n+'; modes='+JSON.stringify([a,b].map(r=>outputs(r.snapshot().outputs,409n).map(v=>String(uint(f(rec(f(rec(f(v,4n),419n),2n),420n),8n)))))));return n;}
async function mapped(law:ToleranceLaw,hidden=false){const m=await prepareCharacterModel(source(law)),setup=await createCharacterRun(m,data(hidden));await through(setup,7n);const r=await createCharacterRun(m,data(hidden,mapIdentities(setup)));await through(r,7n);return r;}
const declaration=(law:ToleranceLaw='Reciprocal')=>compileTolerance(list([text('assembled-tolerance/0.1'),variable,text(law)]));
const magnitude=(n:bigint)=>record('ToleranceValue',{Magnitude:unsigned(n)});
const physical=(r:Run)=>reports(r,ACTION_BODY_RECEIPT).map(a=>[1n,2n,3n,4n,5n].map(k=>f(rec(a[5],479n),k)));
// Three physical tasks; all ordinary channels live, reserve10. No person dependency.
it('connection: earned adaptation changes delivered effect then live appraisal and reasons',async()=>{
 const a=await mapped('Reciprocal'),b=await mapped('Unattenuated');
 console.info('M39 primary '+diagnostic([a,b].map(r=>({tolerance:reports(r,TOLERANCE_EFFECT),physical:physical(r),sample7:sample(r,7n),appraisal7:reports(r,JOINT_APPRAISAL)[2],modifiers7:modifiers(r,2)}))));
 live(a);live(b);const n=coupled(a,b);console.info('M39 matched primary draws '+n+'; gate is live factors/reasons, not stochastic choice');
 for(const r of [a,b]){
  const effects=reports(r,TOLERANCE_EFFECT);expect(effects).toHaveLength(2);expect(effects[0][1]).toEqual(signed(5));expect(effects[0][2]).toEqual((tolerancePath(C,variable).selectors[0] as {key:CanonicalValue}).key);expect(effects[0][4]).toEqual(unsigned(1));expect(effects[0][5]).toEqual(q(80,1));
  expect(f(traceAt(r,ACTION_BODY_RECEIPT_EVENT,5n)[0],6n)).toEqual(text(TOLERANCE_VERSION));
  const queued=traceAt(r,ACTION_BODY_EVENT,3n)[0],received=traceAt(r,ACTION_BODY_RECEIPT_EVENT,5n)[0];expect(f(queued,17n)).toEqual(list([]));expect(items(f(queued,11n),'list')).toHaveLength(2);expect(items(f(received,11n),'list')).toHaveLength(2);expect(f(event(received),8n)).toEqual(list([f(event(queued),1n)]));
  expect(reports(r,JOINT_APPRAISAL)[2][2]).toEqual(sample(r,7n));
 }
 expect(physical(a)[0]).toEqual([5,40,40,0,45].map(n=>q(n,1)));expect(physical(b)[0]).toEqual([5,80,80,0,85].map(n=>q(n,1)));
 expect(f(rec(f(sample(a,7n),5n),462n),2n)).toEqual(q(50,1));expect(f(rec(f(sample(b,7n),5n),462n),2n)).toEqual(q(90,1));
 expect(bodyRows(a).slice(0,2)).toEqual(bodyRows(b).slice(0,2));expect(bodyRows(a)[2]).not.toEqual(bodyRows(b)[2]);expect(modifiers(a,2)).not.toEqual(modifiers(b,2));
 console.info('M39 PASS: actual execution earns t1; receipt5 potentials40/80, reserves45/85; sample7 upper50/90; live appraisal and reasons differ');
},540000);
// Same physical scenario, sample7 withheld; normal samples3/5 supply live recalled context7.
it('hidden: identical perceived history keeps cognition equal with actual dice coupled',async()=>{
 const a=await mapped('Reciprocal',true),b=await mapped('Unattenuated',true);
 console.info('M39 hidden '+diagnostic([a,b].map(r=>({tolerance:reports(r,TOLERANCE_EFFECT),physical:physical(r),appraisal7:reports(r,JOINT_APPRAISAL)[2],decisions:decisions(r)}))));
 live(a);live(b);for(const r of [a,b]){expect(outputs(r.snapshot().outputs,461n)).toHaveLength(2);expect(items(reports(r,JOINT_APPRAISAL)[2][5],'list')[1]).toEqual(text('RecalledContext'));}
 expect(physical(a)[0]).not.toEqual(physical(b)[0]);expect(bodyRows(a)).toEqual(bodyRows(b));expect(modifiers(a,2)).toEqual(modifiers(b,2));expect(decisions(a)).toEqual(decisions(b));const n=coupled(a,b);expect(draws(a)).toHaveLength(draws(b).length);expect(n).toBe(draws(a).length);console.info('M39 hidden PASS with '+n+' actual matched draws');
},480000);
// Identical physical scenario; checkpoint3 retains earned tolerance and pending delivery5.
it('persistence: exact repeat and restore carry tolerance together with pending delivery',async()=>{
 const s=source(),d=data(),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,3n);await through(b,3n);exact(a,b);expect(state(a).read(tolerancePath(C,variable)).value).toEqual(magnitude(1n));expect(reports(a,TOLERANCE_EFFECT)).toEqual([]);
 const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);
 while(a.snapshot().clock<10n){expect(await a.settleNextInstant()).toBe(await restored.settleNextInstant());exact(a,restored);}expect(await a.settleNextInstant()).toBe(false);expect(await restored.settleNextInstant()).toBe(false);exact(a,restored);expect(reports(a,TOLERANCE_EFFECT)).toHaveLength(3);console.info('M39 exact repeat3 and restore3..10 PASS; three actual deliveries');
},300000);
// Physical tasks and normal channels, reserve10; late5 ceiling after delivery must abort adaptation too.
it('rollback: late failure atomically preserves body and adaptation before receipt',async()=>{
 const s=source(),d=data(),fault={...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),...Array.from({length:16},()=>list([signed(5),unsigned(110),BODY_DELIVERY,list([C,q(0,1)]),list([])]))]))},oracle=await createCharacterRun(await prepareCharacterModel(s),fault);await through(oracle,5n);
 const counts=new Map<bigint,Set<string>>();for(const t of traces(oracle)){const e=event(t),at=signedValue(f(e,2n)),ids=counts.get(at)??new Set<string>();ids.add(key(f(e,1n)));counts.set(at,ids);}const n=counts.get(5n)!.size;expect(Math.max(...[...counts].filter(([t])=>t<5n).map(([,x])=>x.size))).toBeLessThan(n);expect([...counts.get(5n)!].indexOf(key(f(event(traceAt(oracle,ACTION_BODY_RECEIPT_EVENT,5n)[0]),1n)))).toBeLessThan(n-1);
 const failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(n-1))),fault);await through(failed,4n);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow('work ceiling');expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(state(failed).read(tolerancePath(C,variable)).value).toEqual(magnitude(1n));console.info('M39 rollback after delivery and before full settlement PASS: '+(n-1)+'/'+n);
},180000);
// Component controls isolate exact key selection and physical arithmetic, not authored cognitive history.
it('arithmetic: exact units, absent/wrong keys, unrelated leaves, zero and saturation',()=>{
 const p=tolerancePath(C,variable),other={...p,selectors:[{kind:'mapKey' as const,key:otherToleranceKey}]};
 for(const law of LAWS)for(let t=0n;t<=10n;t++)for(const capacity of [10n,100n])for(const amount of [0n,capacity*4n/5n]){
  const s=new AuthoritativeState(t?[{path:p,value:magnitude(t)}]:[]),v=deliveredPotential(s,C,declaration(law),Q.of(capacity),Q.of(amount),5n),expected=law==='Reciprocal'?Q.of(amount,1n+t):law==='Linear'?Q.of(amount*(10n-t),10n):Q.of(amount);expect(v.potential.equals(expected)).toBe(true);expect(v.reads).toHaveLength(1);
  const saturated=replenishReserve(Q.of(capacity),Q.of(capacity),v.potential);expect(saturated.applied.equals(Q.of(0n))).toBe(true);expect(saturated.overflow.equals(v.potential)).toBe(true);
 }
 for(const s of [new AuthoritativeState([{path:other,value:magnitude(8n)}]),new AuthoritativeState([{path:{...p,fieldId:2n,selectors:[{kind:'mapKey',key:record('SensitizationKey',{CharacterId:C,ExposureReferentId:C,RegulatoryVariableId:variable})}]},value:record('SensitizationValue',{Magnitude:unsigned(8)})}])]){const v=deliveredPotential(s,C,declaration(),Q.of(100n),Q.of(80n),5n);expect(v.potential.equals(Q.of(80n))).toBe(true);expect(items(v.output,'list')[4]).toEqual(unsigned(0));}
 console.info('M39 arithmetic exact all laws/t0..10, unit conversion, absent/wrong key/other field, zero/saturation PASS');
});
// Physical scenario unchanged; admission and world delivery controls must not open a hidden tolerance channel.
it('admission: declared variable/law/version, blocked effect and external world delivery boundaries',async()=>{
 const s=source(),slots=items(decode(s.registry),'list');
 for(const d of [list([text('assembled-tolerance/0.1'),variable,text('Other')]),list([text('assembled-tolerance/0.1'),typedIdentifier(1029,text('missing')),text('Reciprocal')]),list([text('assembled-tolerance/0.1'),typedIdentifier(1002,text('wrong')),text('Reciprocal')]),list([])])await expect(prepareCharacterModel({...s,registry:enc(list([...slots.slice(0,26),d]))})).rejects.toThrow();
 for(const v of [{...s,rulesVersion:oldSource().rulesVersion,registrySchemaVersion:oldSource().registrySchemaVersion},{...oldSource(),rulesVersion:s.rulesVersion,registrySchemaVersion:s.registrySchemaVersion}])await expect(prepareCharacterModel(v)).rejects.toThrow();
 await prepareCharacterModel(source('Linear'));const blocked=await createCharacterRun(await prepareCharacterModel(source('Reciprocal',2,false)),data());await through(blocked,5n);expect(reports(blocked,TOLERANCE_EFFECT)).toEqual([]);expect(reports(blocked,ACTION_BODY_RECEIPT)).toEqual([]);
 const m=await compileCharacterModel(s),c=await compileCharacterState(m),initial=c.initialState(data().initialState),delivery={eventId:1n,dueAt:simInstant(1n),phase:110n,eventSequence:1n,eventTypeId:BODY_DELIVERY,payload:list([C,q(80,1)]),dependencies:list([]),causalParentEventIds:[]},body=createBodyExecution(m.body!,C,c.stateModel,[delivery],m.modelIdentity.value,m.modelIdentity.value,m.actionBody,undefined,m.tolerance);
 body.begin(1n);const result=body.execute({event:delivery,state:initial} as never),trace=rec(result.traceFactory([])[0],160n);expect(result.outputs).toHaveLength(1);expect(items(f(trace,11n),'list')).toHaveLength(1);expect(f(rec(result.outputs[0],479n),2n)).toEqual(q(80,1));body.prepareCommit();body.commit();body.close();console.info('M39 admission, blocked and external delivery boundaries PASS');
},180000);
