import {carryPath,compareCarry,carryMetadata,replay269} from './fixtures/assembledActivationCarry';
import {it,expect,vi,afterEach} from 'vitest';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Lossless evidence.
import {deflateSync,inflateSync} from 'node:zlib';
// @ts-expect-error Hashing.
import {createHash} from 'node:crypto';
import {restoreAuthoritativeState} from '../substrate/state';
import {runIntention} from '../campaign3/intentionForgetting';
import {MEMORY_RECALL,RECALL,POSITION_EPISODE} from '../assembled/memory';
import {INTENTION_MEMORY,isIntentionCue,instructionEpisode} from '../assembled/intentionMemory';
import {ATTEMPT_RECEIPT,CRITERION_VERSION,replaceCriterionField} from '../assembled/criterionSensing';
import {HABIT_SOURCE} from '../assembled/habit';
import {REWARD_SOURCE} from '../assembled/rewardExperience';
import {itemPath} from '../assembled/itemWorld';
import {WORKSPACE} from '../assembled/workspace';
import {STRATEGY_EVAL} from '../assembled/strategy';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {createCharacterRun,restorePreparedCharacterRun,prepareCharacterModel} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {fixture as oldFixture} from './fixtures/assembledIntentionCompletion';
import {PROBE_SOURCE_EVENT} from '../campaign2/orderedInputs';
import {cognitiveRecord} from '../assembled/codecs';
import * as trace from '../substrate/trace';
import {start,fixture,names,rec,f,uint,items,key,decode,enc,list,text,q,u,sid,taskA,origin,target,type Case,type CanonicalValue} from './fixtures/assembledIntentionSchedules';
import {outputs} from './fixtures/assembledIntentionSchedules';
const originalFile='docs/planning/ASSEMBLED_CHARACTER_M261_EVIDENCE.json',file=carryPath(originalFile),hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')});
const saved=()=>existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};
function put(k:string,v:unknown){const destination=['withheld-action','admission'].includes(k)?carryPath('docs/planning/ASSEMBLED_CHARACTER_M262_EVIDENCE.json'):file;const e=existsSync(destination)?JSON.parse(readFileSync(destination,'utf8')):{};if(replay269)e._activationCarry=carryMetadata(originalFile);if(e[k]!==undefined){expect(e[k]).toEqual(v);compareCarry(originalFile,k,v);return;}e[k]=v;writeFileSync(destination,JSON.stringify(e,null,2)+'\n');compareCarry(originalFile,k,v);}
const at=(v:CanonicalValue)=>(v as {value:bigint}).value,ev=(v:CanonicalValue)=>rec(f(rec(v,160n),4n),130n),path={rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey' as const,key:taskA}]};
type X=Awaited<ReturnType<typeof start>>;type Run=X['run'];
let active:Run|undefined;
afterEach(ctx=>{if(replay269&&ctx.task.result?.state==='fail'&&active)put('failure-'+Object.keys(saved()).filter(k=>k.startsWith('failure-')).length,{test:ctx.task.name,...capture(active)});active=undefined;});
const tags=(os:Uint8Array,tag:string)=>items(decode(os),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
function capture(r:Run){const s=r.snapshot();return {at:String(s.clock),state:zip(s.state),outputs:zip(s.outputs),trace:zip(s.trace),save:hash(r.save())};}
async function finish(r:Run){for(let n=0;n<128;n++)if(!await r.settleNextInstant())return;throw Error('M261 queue cap');}
function row(x:X,t:bigint){const s=x.run.snapshot(),state=restoreAuthoritativeState(decode(s.state)),tr=outputs(s.trace,160n).filter(v=>at(f(ev(v),2n))===t),g=state.read(path),goal=g.presence?['Absent','Open','Fulfilled','Expired','Cancelled'][Number(uint(f(rec(g.value!,372n),1n)))]: 'Absent';
 const retained=state.entries().filter(e=>e.path.rootStateTypeId===346n&&typeof e.value!=='boolean'&&e.value.kind==='list').map(e=>items(e.value,'list')).filter(a=>[INTENTION_MEMORY,POSITION_EPISODE].some(tag=>key(a[0])===key(text(tag)))).map(a=>key(a[0])===key(text(INTENTION_MEMORY))?1:2).sort();
 const recalls=tr.filter(v=>key(f(ev(v),5n))===key(MEMORY_RECALL)&&isIntentionCue(f(ev(v),6n))).flatMap(v=>items(f(v,13n),'list')).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(RECALL))).map(v=>items(items(v,'list')[2],'list')).map(a=>key(a[0])===key(text(INTENTION_MEMORY))?1:2);
 const d=outputs(s.outputs,409n).find(v=>at(f(v,2n))===t),result=d?rec(f(d,4n),419n):undefined,raw=d?rec(f(rec(f(d,3n),408n),2n),403n):undefined;
 const attempts=outputs(s.outputs,433n).filter(v=>at(f(rec(f(rec(f(rec(f(rec(f(v,2n),432n),2n),431n),2n),425n),2n),409n),2n))===t);expect(attempts.length).toBeLessThanOrEqual(1);
 let intent=0,success=false,mode='None';if(attempts.length){const resolved=rec(f(result!,2n),420n),option=rec(f(resolved,1n),395n);intent=x.b.route.plans.findIndex(p=>key(p.actionId)===key(f(option,2n)))+1;expect(intent).toBeGreaterThan(0);success=uint(f(attempts[0],3n))>0n;mode=String(uint(f(resolved,8n)));expect(mode).toBe('1');
  const workspace=tags(s.outputs,WORKSPACE).find(v=>at(v[1])===t)!;expect(workspace,'live workspace').toBeDefined();const appraisal=tags(s.outputs,JOINT_APPRAISAL).find(v=>key(f(rec(v[1],384n),2n))===key(workspace[3]))!;expect(appraisal,'live appraisal').toBeDefined();expect(items(appraisal[4],'list').some(v=>key(items(v,'list')[0])===key(taskA))).toBe(true);
  const plan=tags(s.outputs,STRATEGY_EVAL).find(v=>uint(v[2])===t)!,task=items(items(plan[3],'list').find(v=>key(items(v,'list')[0])===key(taskA))!,'list'),operand=items(items(task.at(-1)!,'list')[1],'list')[0];expect(items(workspace[4],'list').some(v=>key(items(v,'list')[1])===key(operand))).toBe(true);expect(instructionEpisode(operand)[4]).toEqual(x.b.route.plans[intent-1].instructionId);
  const signals=items(f(raw!,3n),'set').map(v=>rec(v,402n));expect(signals.some(v=>key(f(rec(f(v,1n),401n),2n))===key(taskA)&&uint(f(rec(f(v,1n),401n),3n))===1n&&key(f(v,2n))===key(q(1,1)))).toBe(true);
 }
 const obs=t===1n?[]:outputs(s.outputs,203n).filter(v=>at(f(v,5n))===t&&key(f(v,11n))===key(text(CRITERION_VERSION)));expect(obs.length).toBeLessThanOrEqual(1);const received=obs.length?key(f(rec(f(obs[0],6n),204n),2n))===key(q(1,1)):null;
 const gate=tr.find(v=>key(f(v,6n))===key(text(ATTEMPT_RECEIPT)));if(t>=2n&&x.b.frames[Number(t)-1].receipt){expect(gate).toBeDefined();const audit=items(f(gate!,12n),'list');expect(audit[2]).toBe(attempts.length>0);expect(items(audit[1],'list')).toHaveLength(attempts.length);if(attempts.length)expect(items(items(audit[1],'list')[0],'list')[1]).toEqual(attempts[0]);expect(obs).toHaveLength(attempts.length);}
 return {at:Number(t),retained,recalls,intent,success,received,goal,mode,safe:{goal,recalls,reasons:raw?hash(enc(f(raw,3n))):null,result:result?hash(enc(result)):null}};
}
async function scenario(name:Case){const x=await start(name),original=runIntention('RetainedCue',x.b.frames),rows=[];active=x.run;for(let t=1n;t<=8n;t++){while(x.run.snapshot().clock<t)expect(await x.run.settleNextInstant()).toBe(true);expect(x.run.snapshot().clock).toBe(t);const actual=row(x,t);rows.push(actual);put(name+'-prefix'+t,actual);const expected=original.rows[Number(t)-1] as any,world=original.world[Number(t)-1];expect(actual.retained,name+' retained '+t).toEqual(expected.retained.map((v:any)=>v.id).sort());expect(actual.recalls,name+' recall '+t).toEqual(expected.recall);expect(actual.intent,name+' intent '+t).toBe(expected.expression.intent);expect(actual.success,name+' success '+t).toBe(world.success);expect(actual.received,name+' receipt '+t).toBe(expected.observation.received);expect(actual.goal,name+' goal '+t).toBe(expected.goal);}
 put(name+'-8',capture(x.run));await finish(x.run);put(name+'-terminal',{save:hash(x.run.save()),rows:rows.length});}
it('schedule261 final first nine',async()=>{for(const n of names.slice(0,9))await scenario(n);},590000);
it('schedule261 final last nine',async()=>{for(const n of names.slice(9))await scenario(n);},590000);

async function through(r:Run,t:bigint){while(r.snapshot().clock<t)expect(await r.settleNextInstant()).toBe(true);expect(r.snapshot().clock).toBe(t);}
const exact=(a:Run,b:Run)=>{expect(a.snapshot().clock).toBe(b.snapshot().clock);for(const k of ['state','outputs','trace'] as const)expect(hash(a.snapshot()[k])).toBe(hash(b.snapshot()[k]));expect(hash(a.save())).toBe(hash(b.save()));};
it('schedule261 continuation rollback and old version carry',async()=>{
 const x=await start('main'),repeat=cachedMemory(await createCharacterRun(x.m,x.b.d));for(const r of [x.run,repeat])await through(r,4n);exact(x.run,repeat);const save=x.run.save(),restore=async()=>cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));
 const bad=await restore(),before=bad.snapshot(),original=trace.traceRecordValue;let hit=false;const spy=vi.spyOn(trace,'traceRecordValue').mockImplementation(v=>{if(v.event.dueAt===5n&&key(v.event.eventTypeId)===key(sid(1001,'event/task-measurement-settlement'))){hit=true;throw Error('M261 settlement fault');}return original(v);});
 try{await expect(bad.settleNextInstant()).rejects.toThrow('M261 settlement fault');expect(hit).toBe(true);expect(bad.snapshot().clock).toBe(before.clock);for(const k of ['state','outputs','trace'] as const)expect(hash(bad.snapshot()[k])).toBe(hash(before[k]));expect(()=>bad.save()).toThrow('active quiescent');}finally{spy.mockRestore();}
 const restored=await restore();exact(x.run,restored);let done=false;for(let n=0;n<128;n++){const more=await x.run.settleNextInstant();for(const r of [repeat,restored]){expect(await r.settleNextInstant()).toBe(more);exact(x.run,r);}if(!more){done=true;break;}}expect(done).toBe(true);expect(hash(x.run.save())).toBe(saved()['main-terminal'].save);
 const b=oldFixture('main'),m=await prepareCharacterModel(b.s),old=cachedMemory(await createCharacterRun(m,b.d));await finish(old);expect(hash(old.save())).toBe(JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M260_EVIDENCE.json','utf8'))['main-terminal'].save);
 put('continuation',{checkpoint:zip(save),terminal:hash(x.run.save()),fullRepeatRestore:true,settlementRollback:hit,old0158Terminal:hash(old.save())});
},590000);
it('schedule261 admission and nonmatching withholding gates',async()=>{
 const x=await start('main'),rows=items(decode(x.b.d.orderedInputs),'list'),change=(fn:(a:readonly CanonicalValue[])=>CanonicalValue)=>({...x.b.d,orderedInputs:enc(list(rows.map(v=>{const a=items(v,'list');return key(a[2])===key(PROBE_SOURCE_EVENT)&&at(a[0])>=2n?list([a[0],a[1],a[2],fn(items(a[3],'list')),a[4]]):v;})))});
 const old=await prepareCharacterModel(oldFixture('main').s);await expect(createCharacterRun(old,x.b.d)).rejects.toThrow('admitted tag');
 for(const actions of [[],[x.b.route.plans[0].actionId,x.b.route.plans[0].actionId],[sid(1027,'foreign-action')]])await expect(createCharacterRun(x.m,change(a=>list([a[0],a[1],a[2],list(actions)])))).rejects.toThrow();
 for(const mode of [u(3),true])await expect(createCharacterRun(x.m,change(a=>list([...a,mode])))).rejects.toThrow('report mode');
 await expect(createCharacterRun(x.m,change(a=>list([a[0],a[1],{kind:'signed',value:10n},a[3],u(1)])))).rejects.toThrow('zero bias');
 await expect(createCharacterRun(x.m,change(()=>list([])))).rejects.toThrow();
 const unrelated=cachedMemory(await createCharacterRun(x.m,change(a=>list([a[0],a[1],a[2],list([x.b.route.plans[1].actionId])]))));await through(unrelated,6n);const gates=(r:Run)=>outputs(r.snapshot().trace,160n).filter(v=>key(f(v,6n))===key(text(ATTEMPT_RECEIPT)));expect(gates(unrelated).every(v=>items(f(v,12n),'list')[2]===false)).toBe(true);expect(outputs(unrelated.snapshot().outputs,433n)).toHaveLength(1);expect(outputs(unrelated.snapshot().outputs,203n).filter(v=>at(f(v,5n))>=2n&&key(f(v,11n))===key(text(CRITERION_VERSION)))).toHaveLength(0);expect(uint(f(rec(restoreAuthoritativeState(decode(unrelated.snapshot().state)).read(path).value!,372n),1n))).toBe(1n);put('nonmatching-action',capture(unrelated));await finish(unrelated);
 const reportedFailure=cachedMemory(await createCharacterRun(x.m,change(a=>list([...a,u(2)]))));await through(reportedFailure,6n);const failureObs=outputs(reportedFailure.snapshot().outputs,203n).filter(v=>at(f(v,5n))>=2n&&key(f(v,11n))===key(text(CRITERION_VERSION)));expect(failureObs).toHaveLength(1);expect(f(rec(f(failureObs[0],6n),204n),2n)).toEqual(q(0,1));expect(uint(f(outputs(reportedFailure.snapshot().outputs,433n)[0],3n))).toBeGreaterThan(0n);expect(uint(f(rec(restoreAuthoritativeState(decode(reportedFailure.snapshot().state)).read(path).value!,372n),1n))).toBe(1n);put('reported-failure',capture(reportedFailure));await finish(reportedFailure);
 const slots=[...items(decode(x.b.s.registry),'list')],action=x.b.route.plans[0].actionId;slots[0]={kind:'set',items:items(slots[0],'set').map(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(action)?replaceCriterionField(replaceCriterionField(v,3n,text('bounded-protocol-execution/0.2-candidate')),4n,cognitiveRecord(391,[u(0)])):v)};
 // M262: a zero-count option cannot remain a rewarding practiced movement. Neither
 // reward nor habit sources are present; associate these dormant declarations with B.
 const other=x.b.route.plans[1].actionId,reward=items(slots[57],'list'),habit=items(slots[16],'list');
 slots[57]=list([reward[0],other,...reward.slice(2)]);slots[16]=list([habit[0],other]);
 expect(rows.every(v=>![HABIT_SOURCE,REWARD_SOURCE].some(t=>key(items(v,'list')[2])===key(t)))).toBe(true);
 const wm=await prepareCharacterModel({...x.b.s,registry:enc(list(slots))}),withheld=cachedMemory(await createCharacterRun(wm,x.b.d));await through(withheld,6n);const outcomes=outputs(withheld.snapshot().outputs,433n);expect(outcomes).toHaveLength(1);const decision=rec(f(rec(f(rec(f(rec(f(outcomes[0],2n),432n),2n),431n),2n),425n),2n),409n),selected=rec(f(rec(f(decision,4n),419n),2n),420n);expect(f(rec(f(selected,1n),395n),2n)).toEqual(action);expect(uint(f(rec(f(rec(f(outcomes[0],2n),432n),2n),431n),3n))).toBe(0n);expect(gates(withheld).every(v=>items(f(v,12n),'list')[2]===false)).toBe(true);expect(outputs(withheld.snapshot().outputs,203n).filter(v=>at(f(v,5n))>=2n&&key(f(v,11n))===key(text(CRITERION_VERSION)))).toHaveLength(0);expect(uint(f(rec(restoreAuthoritativeState(decode(withheld.snapshot().state)).read(path).value!,372n),1n))).toBe(1n);expect(restoreAuthoritativeState(decode(withheld.snapshot().state)).read(itemPath(target)).value).toEqual(origin);put('withheld-action',capture(withheld));await finish(withheld);put('admission',{oldVersionRejected:true,emptyDuplicateForeignRejected:true,nonmatchingSuppressed:true,withholdingSuppressed:true,fixedFailureReport:true,invalidReportRejected:true});
},590000);
it('schedule261 full correspondence and privacy',()=>{
 const e=saved();for(const name of names){expect(e[name+'-terminal'].rows).toBe(8);for(let t=2;t<=8;t++)if(e[name+'-prefix'+t].intent)expect(e[name+'-prefix'+(t-1)].goal,'live prior goal').toBe('Open');}const pairs=[['hidden','hiddenBlocked'],['falseReceipt','trueReceipt'],['denied','deniedB']];for(const [a,b] of pairs)for(let t=1;t<=8;t++)expect(e[a+'-prefix'+t].safe).toEqual(e[b+'-prefix'+t].safe);
 put('correspondence',{cases:names,originalTicks:144,reference:'RetainedCue',retainedControls:'M258 NoLoss/PersistentAccess; 54 runs/486 prefixes',pairedSafeViews:pairs,projection:'semantic retention/recall, instructed action, success, received report, end goal each original tick; native records/lane expansion remain explicit'});
});

it('schedule261 preserved early counterexample',()=>{const e=saved()['pre-opportunity-timing-correction'],p=e['noNeutral-prefix3'];expect(p.retained).toEqual([1]);expect(p.recalls).toEqual([1]);expect(p.intent).toBe(0);expect(p.goal).toBe('Open');const raw=e['noNeutral-diagnostic3'],os=new Uint8Array(inflateSync(Uint8Array.from(atob(raw.outputs.deflate),c=>c.charCodeAt(0)))),plan=tags(os,STRATEGY_EVAL).find(v=>uint(v[2])===3n)!,a=items(items(plan[3],'list').find(v=>key(items(v,'list')[0])===key(taskA))!,'list');expect(uint(a[1])).toBe(2n);expect(items(a[2],'list').every(v=>key(items(v,'list')[0])===key(text('KnownUnavailable')))).toBe(true);});
