import {REWARD_SOURCE,REWARD_SAMPLE,rewardBodyPath,rewardAnchor} from '../assembled/rewardExperience';
import {SKILL_ACTUAL,SKILL_UPDATE} from '../assembled/skill';
import {MOTOR} from '../assembled/sleepControl';
import {OPPORTUNITY_RESULT} from '../assembled/externalObstruction';
import {PERFORMANCE_OBS,PERFORMANCE_LEARN,outcomePath} from '../assembled/performance';
import {expectationPath,expectationValue} from '../assembled/performanceExpectation';
import {knowledgePath} from '../assembled/strategy';
import {it,expect,vi} from 'vitest';
import {start,fixture,names,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,at,sid,type Case,type CanonicalValue} from './fixtures/assembledGoalOutcomePrivacy';
import {campaign2Record as cr} from '../campaign2/codecs';
import {AuthoritativeState,restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {characterEvidenceRefValue} from '../semanticBinding/semanticEvidenceCodecs';
import {STRATEGY_EVAL} from '../assembled/strategy';
import {PRIORITY_MOTIVE} from '../assembled/priority';
import {ACTION_BODY} from '../assembled/actionBody';
import {compileLearningProtection} from '../assembled/learningProtection';
import {safe} from './assembledIntoxicationCohort.test';
import {restorePreparedCharacterRun,createCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import * as trace from '../substrate/trace';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Exact hashes.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless evidence.
import {deflateSync,inflateSync} from 'node:zlib';
type X=Awaited<ReturnType<typeof start>>;
const file='docs/planning/ASSEMBLED_CHARACTER_M235_EVIDENCE.json',saved=()=>JSON.parse(readFileSync(file,'utf8'));
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')}),unzip=(s:string)=>new Uint8Array(inflateSync(Uint8Array.from(atob(s),c=>c.charCodeAt(0))));
const put=(n:string,v:unknown)=>{const d=existsSync(file)?saved():{};expect(d[n]).toBeUndefined();d[n]=v;writeFileSync(file,JSON.stringify(d,null,2)+'\n');};
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const exact=(a:X['run'],b:X['run'])=>{const as=a.snapshot(),bs=b.snapshot();expect(bs.clock).toBe(as.clock);expect(bs.status).toBe(as.status);for(const k of ['state','outputs','trace']as const)bytes(as[k],bs[k]);bytes(a.save(),b.save());};
const state=(x:X)=>restoreAuthoritativeState(decode(x.run.snapshot().state)),out=(x:X)=>items(decode(x.run.snapshot().outputs),'list');
const records=(xs:readonly CanonicalValue[],n:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n);
const tagged=(xs:readonly CanonicalValue[],tag:string)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const path=(x:X,fieldId=1n)=>({rootStateTypeId:373n,fieldId,selectors:[{kind:'mapKey' as const,key:x.b.task}]}),goal=(x:X)=>state(x).read(path(x)).value!;
const status=(x:X)=>Number(uint(f(rec(goal(x),372n),1n)));
const traces=(x:X)=>items(decode(x.run.snapshot().trace),'list').map(v=>rec(v,160n));
const named=(x:X,name:string,t:bigint)=>traces(x).filter(v=>{const e=rec(f(v,4n),130n);return at(f(e,2n))===t&&key(f(e,5n))===key(sid(1001,name));});
async function runCase(name:Case){
 const x=await start(name),rows:any[]=[];let stable:string|undefined,checkpoint:ReturnType<typeof zip>|undefined;
 await through(x.run,1n);
 for(const t of [2,3,4,5]){
  const before=state(x),priorJournal=before.read(outcomePath(x.b.task)).value;
  await through(x.run,BigInt(t));const outputs=out(x),g=key(list([goal(x),state(x).read(path(x,2n)).value!,state(x).read(path(x,3n)).value!]));expect(status(x)).toBe(1);if(stable)expect(g).toBe(stable);else stable=g;
  const d=rec(records(outputs,409n).find(v=>at(f(rec(v,409n),2n))===BigInt(t))!,409n),ds=rec(f(d,4n),419n),chosen=uint(f(ds,1n))===3n?rec(f(ds,2n),420n):undefined,action=chosen?x.b.actions.findIndex(a=>key(a)===key(f(rec(f(chosen,1n),395n),2n))):-1;
  const switchNow=t===5&&!x.b.hidden&&!x.b.success,expected=t===2?-1:switchNow?1:0;expect(action).toBe(expected);
  const planner=tagged(outputs,STRATEGY_EVAL).find(a=>uint(a[2])===BigInt(t))!,row=items(planner[3],'list').find(v=>key(items(v,'list')[0])===key(x.b.task));
  if(t===2){expect(row).toBeUndefined();expect(tagged(outputs,PERFORMANCE_OBS)).toHaveLength(0);expect(state(x).read(outcomePath(x.b.task)).presence).toBe(false);continue;}
  expect(row).toBeDefined();const selected=items(row!,'list'),monitor=items(selected[3],'list');expect(uint(selected[1])).toBe(BigInt(expected));expect(items(selected[2],'list').map(v=>(items(v,'list')[0] as {value:string}).value)).toEqual(['KnownAvailable','KnownAvailable']);
  expect(uint(monitor[5])).toBe(BigInt(x.b.hidden||x.b.success?0:t-3));expect(monitor[6]).toBe(switchNow);expect(key(monitor[7])).toBe(key(priorJournal??list([])));
  const motives=tagged(outputs,PRIORITY_MOTIVE).find(v=>uint(v[1])===BigInt(t))!,m=items(motives[2],'list').find(v=>key(items(v,'list')[0])===key(x.b.task))!,strength=items(m,'list')[3];expect(typeof strength!=='boolean'&&strength.kind==='rational'&&strength.numerator>0n).toBe(true);expect(items(f(rec(f(d,3n),408n),3n),'list').length).toBeGreaterThan(0);expect(items(f(chosen!,2n),'list')).toHaveLength(1);expect(key(f(rec(items(f(chosen!,2n),'list')[0],421n),2n))).toBe(key(q(1,1)));
  const actual=rec(records(outputs,433n).find(v=>{const attempt=rec(f(rec(v,433n),2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n);return at(f(rec(f(intent,2n),409n),2n))===BigInt(t);})!,433n),oid=f(actual,1n);
  const effect=tagged(outputs,ACTION_BODY).find(a=>key(a[1])===key(oid))!,skill=tagged(outputs,SKILL_ACTUAL).find(a=>key(a[2])===key(oid))!,opportunity=tagged(outputs,OPPORTUNITY_RESULT).find(a=>key(a[2])===key(oid))!,motor=tagged(outputs,MOTOR).find(a=>key(a[1])===key(oid))!;
  expect(key(effect[5])).toBe(key(text(x.b.success?'Applied':'Blocked')));expect(key(effect[3])).toBe(key(x.b.actions[expected]));expect(uint(f(actual,3n))).toBe(1n);expect(skill[6]).toBe(true);expect(skill[7]).toBe(!x.b.incompetent);expect(skill[8]).toBe(false);expect(key(skill[3])).toBe(key(q(0,1)));expect(key(skill[5])).toBe(key(q(x.b.incompetent?1:0,1)));expect(opportunity[5]).toBe(!x.b.blocked);expect(motor.at(-1)).toBe(true);
  const observed=tagged(outputs,PERFORMANCE_OBS).filter(a=>uint(a[2])===BigInt(t));expect(observed).toHaveLength(x.b.hidden?0:1);
  const journal=state(x).read(outcomePath(x.b.task)).value,history=journal?items(items(journal,'list')[1],'list'):[];expect(history).toHaveLength(x.b.hidden?0:t-2);
  if(x.b.hidden){for(const route of [0n,1n])expect(state(x).read(expectationPath(x.b.task,route)).presence).toBe(false);}else{
   const o=observed[0];expect(o[6]).toBe(x.b.success);expect(o[7]).toBe(true);expect(uint(o[4])).toBe(BigInt(expected));expect(key(o[5])).toBe(key(effect[3]));expect(key(history.at(-1)!)).toBe(key(list(o)));
   const belief=expectationValue(state(x).read(expectationPath(x.b.task,BigInt(expected))).value,100n);expect(belief.mean!.numerator).toBe(x.b.success?1n:0n);expect(belief.mean!.denominator).toBe(1n);expect(belief.supports.map(v=>key(items(v,'list')[0]))).toEqual(history.filter(v=>uint(items(v,'list')[4])===BigInt(expected)).map(key));
  }
  const observedTrace=named(x,'event/assembled-performance-observe',BigInt(t)).filter(r=>key(f(r,5n))===key(sid(1036,'seam/assembled-performance')));expect(observedTrace).toHaveLength(1);expect(uint(f(rec(f(observedTrace[0],4n),130n),3n))).toBe(120n);
  const learned=named(x,'event/assembled-performance-learn',BigInt(t)).find(r=>key(f(r,5n))===key(sid(1036,'seam/assembled-performance')))!;expect(learned).toBeDefined();expect(uint(f(rec(f(learned,4n),130n),3n))).toBe(140n);expect(items(f(learned,17n),'list')).toHaveLength(x.b.hidden?0:2);
  const consumed=named(x,'event/deliberation-opportunity',BigInt(t)).flatMap(r=>items(f(r,11n),'list')).map(r=>rec(r,147n)).find(r=>key(f(r,2n))===key(statePathValue(outcomePath(x.b.task))));expect(consumed).toBeDefined();expect(f(consumed!,3n)).toBe(priorJournal!==undefined);if(priorJournal)expect(key(f(consumed!,4n))).toBe(key(priorJournal));
  rows.push({at:t,action,status:status(x),strength:key(strength),failures:Number(uint(monitor[5])),switched:monitor[6],actual:(effect[5] as {value:string}).value,intrinsic:skill[7],opportunity:opportunity[5],observed:observed.map(a=>key(list(a))),journal:journal?key(journal):null});
  if(t===3&&name==='visibleBlocked')checkpoint=zip(x.run.save());
 }
 const knowledge=state(x).read(knowledgePath(C)).value!;expect(items(items(knowledge,'list')[1],'list')).toHaveLength(2);expect(items(items(knowledge,'list')[1],'list').every(v=>items(v,'list')[6]===true)).toBe(true);
 const fullState=zip(x.run.snapshot().state),protectedState=zip(enc(new AuthoritativeState(state(x).entries().filter(e=>e.path.rootStateTypeId!==302n&&!(e.path.rootStateTypeId===455n&&e.path.fieldId===1n))).canonicalValue()));
 const closure=compileLearningProtection(items(decode(x.b.s.registry),'list')[49],decode(x.b.s.registry)),observer=zip(safe(x.run,items(closure.outputs(decode(x.run.snapshot().outputs)),'list'))),body=zip(enc(list(records(out(x),461n)))),draws=traces(x).flatMap(r=>items(f(r,14n),'list')).map(key);
 let done=false;for(let n=0;n<48;n++)if(!await x.run.settleNextInstant()){done=true;break;}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);expect(status(x)).toBe(3);
 put(name,{rows,fullState,protectedState,observer,body,draws,knowledge:key(knowledge),checkpoint,terminal:hash(x.run.save()),registry:hash(x.b.s.registry),initial:hash(x.b.d.initialState),inputs:hash(x.b.d.orderedInputs)});console.info('M235 PASS',name);
}
for(const name of names)it('goal235 native '+name,()=>runCase(name),230000);
it('goal235 privacy source and retained controls',async()=>{
 const d=saved();bytes(unzip(d.visibleBlocked.fullState.deflate),unzip(d.visibleIncompetent.fullState.deflate));
 const hiddenStates=['hiddenBlocked','hiddenSuccess'].map(n=>restoreAuthoritativeState(decode(unzip(d[n].fullState.deflate))));
 expect(hiddenStates[0].entries().map(e=>key(statePathValue(e.path)))).toEqual(hiddenStates[1].entries().map(e=>key(statePathValue(e.path))));
 const changed=hiddenStates[0].entries().filter(e=>key(e.value)!==key(hiddenStates[1].read(e.path).value!)).map(e=>String(e.path.rootStateTypeId)+'/'+e.path.fieldId);expect(changed.sort()).toEqual(['455/1','455/4']);
 expect(hiddenStates.map(s=>rewardAnchor(s.read(rewardBodyPath(C)).value!).level)).toEqual([0,1000]);
 const amendedProtected=hiddenStates.map(s=>zip(enc(new AuthoritativeState(s.entries().filter(e=>e.path.rootStateTypeId!==302n&&!(e.path.rootStateTypeId===455n&&[1n,4n].includes(e.path.fieldId)))).canonicalValue())));bytes(unzip(amendedProtected[0].deflate),unzip(amendedProtected[1].deflate));
 for(const [a,b]of [['visibleBlocked','visibleIncompetent'],['hiddenBlocked','hiddenSuccess']])for(const field of ['observer','body'])bytes(unzip(d[a][field].deflate),unzip(d[b][field].deflate));
 bytes(unzip(d.visibleBlocked.protectedState.deflate),unzip(d.visibleIncompetent.protectedState.deflate));
 for(const n of names){expect(items(decode(fixture(n).d.orderedInputs),'list').some(v=>key(items(v,'list')[2])===key(REWARD_SOURCE))).toBe(false);const permitted=items(decode(unzip(d[n].observer.deflate)),'list');expect(tagged(items(permitted[0],'list'),REWARD_SAMPLE)).toHaveLength(0);}
 expect(d.hiddenBlocked.rows.map((r:any)=>r.actual)).not.toEqual(d.hiddenSuccess.rows.map((r:any)=>r.actual));expect(d.visibleBlocked.rows.map((r:any)=>r.intrinsic)).not.toEqual(d.visibleIncompetent.rows.map((r:any)=>r.intrinsic));expect(new Set(names.map(n=>d[n].registry)).size).toBe(1);expect(new Set(names.map(n=>d[n].initial)).size).toBe(1);expect(new Set(names.map(n=>d[n].knowledge)).size).toBe(1);
 for(const n of names)expect(d[n].draws).toEqual([]);
 const x=await start('visibleBlocked'),forged=list([signed(6),u(140),PERFORMANCE_LEARN,list([]),list([])]);await expect(createCharacterRun(x.m,{...x.b.d,orderedInputs:enc(list([...items(decode(x.b.d.orderedInputs),'list'),forged]))})).rejects.toThrow('original kind');
 const references=Object.fromEntries([231,234].map(n=>{const p='docs/planning/ASSEMBLED_CHARACTER_M'+n+'_EVIDENCE.json';return [n,hash(readFileSync(p))];}));const old=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M231_EVIDENCE.json','utf8'));expect(old.frozen.rows).toHaveLength(19);expect(old.frozen.advancing+old.frozen.terminal).toBe(94);
 put('privacy',{physicalAmendment:{changedPaths:changed,rewardLevels:[0,1000],noRewardSourceOrSample:true,amendedProtected},completeCauseState:true,protectedHiddenState:true,completePermittedViews:true,bodyViewsEqual:true,noDraws:true,forgedLearningRejected:true,references});
},180000);
it('goal235 rollback and continuation',async()=>{
 const x=await start('visibleBlocked');await through(x.run,3n);const save=x.run.save(),old=saved().visibleBlocked;bytes(save,unzip(old.checkpoint.deflate));
 const restore=async()=>cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save})),bad=await restore(),before=bad.snapshot(),write=trace.traceRecordValue;let hit=false;
 const spy=vi.spyOn(trace,'traceRecordValue').mockImplementation(v=>{if(v.event.dueAt===4n&&key(v.event.eventTypeId)===key(PERFORMANCE_LEARN)&&v.statePatch.operations.some(o=>o.path.rootStateTypeId===1000n&&o.path.fieldId===3n)){expect(v.structuralMutationDiffs).toHaveLength(2);hit=true;throw Error('M235 after outcome learning');}return write(v);});
 try{await expect(bad.settleNextInstant()).rejects.toThrow('M235 after outcome learning');expect(hit).toBe(true);expect(bad.snapshot().clock).toBe(before.clock);for(const k of ['state','outputs','trace']as const)bytes(bad.snapshot()[k],before[k]);expect(()=>bad.save()).toThrow('active quiescent');}finally{spy.mockRestore();}
 const recovered=await restore();exact(x.run,recovered);let done=false;for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();expect(await recovered.settleNextInstant()).toBe(more);expect(recovered.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[4n,5n,101n].includes(x.run.snapshot().clock))exact(x.run,recovered);if(!more){done=true;break;}}expect(done).toBe(true);expect(hash(x.run.save())).toBe(old.terminal);put('rollback',{reached:hit,checkpoint:hash(save),terminal:hash(x.run.save()),failedRunReusable:false});
},440000);
