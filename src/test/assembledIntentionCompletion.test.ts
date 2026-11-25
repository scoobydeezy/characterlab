import {it,expect,vi} from 'vitest';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Lossless evidence.
import {deflateSync,inflateSync} from 'node:zlib';
// @ts-expect-error Hashing.
import {createHash} from 'node:crypto';
import * as trace from '../substrate/trace';
import {createCharacterRun,restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {WORKSPACE} from '../assembled/workspace';
import {MEMORY_RECALL} from '../assembled/memory';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {itemPath} from '../assembled/itemWorld';
import {CRITERION_VERSION} from '../assembled/criterionSensing';
import {POST_ITEM_PROBE} from '../assembled/itemProbe';
import {STRATEGY_EVAL} from '../assembled/strategy';
import {INTENTION_MEMORY,instructionEpisode} from '../assembled/intentionMemory';
import {characterEvidenceRefValue} from '../semanticBinding/semanticEvidenceCodecs';
import {runIntention} from '../campaign3/intentionForgetting';
import {intentionCases} from './intentionForgettingFixtures';
import {start,fixture,cases,through,outputs,rec,f,uint,items,key,decode,enc,list,text,q,u,sid,taskA,target,origin,destination,type Case,type CanonicalValue} from './fixtures/assembledIntentionCompletion';
const file='docs/planning/ASSEMBLED_CHARACTER_M260_EVIDENCE.json',hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')});
const put=(k:string,v:unknown)=>{const d=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};if(d[k]!==undefined){expect(d[k]).toEqual(v);return;}d[k]=v;writeFileSync(file,JSON.stringify(d,null,2)+'\n');};
type X=Awaited<ReturnType<typeof start>>;type Run=X['run'];
const at=(v:CanonicalValue)=>(v as {value:bigint}).value,path={rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey' as const,key:taskA}]};
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const goal=(r:Run)=>rec(state(r).read(path).value!,372n);
const traces=(r:Run)=>outputs(r.snapshot().trace,160n),event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n);
const tagged=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
function capture(r:Run){const s=r.snapshot();return {at:String(s.clock),state:zip(s.state),outputs:zip(s.outputs),trace:zip(s.trace),save:hash(r.save())};}
const atDecision=(r:Run,t:bigint)=>outputs(r.snapshot().outputs,409n).find(v=>at(f(v,2n))===t)!;
const attemptAt=(r:Run,t:bigint)=>outputs(r.snapshot().outputs,433n).filter(v=>at(f(rec(f(rec(f(rec(f(rec(f(v,2n),432n),2n),431n),2n),425n),2n),409n),2n))===t);
async function finish(r:Run){for(let n=0;n<128;n++)if(!await r.settleNextInstant())return;throw Error('M260 queue cap');}
function proof(x:X){
 const {run:r,b}=x,t=b.actionAt,fulfilled=!b.hidden&&(!b.failed||b.name==='falseReceipt'),g=goal(r),ts=traces(r);
 expect(uint(f(g,1n))).toBe(fulfilled?2n:1n);expect(state(r).read(itemPath(target)).value).toEqual(b.failed?origin:destination);
 const d=atDecision(r,t);expect(d,'live decision').toBeDefined();expect(uint(f(rec(f(d,4n),419n),1n))).toBe(3n);
 const plan=tagged(r,STRATEGY_EVAL).find(v=>uint(v[2])===t)!;expect(plan).toBeDefined();const task=items(items(plan[3],'list').find(v=>key(items(v,'list')[0])===key(taskA))!,'list');expect(uint(task[1])).toBe(b.name==='routeB'?1n:0n);expect(items(task.at(-1)!,'list')[0]).toEqual(text(INTENTION_MEMORY));expect(items(items(task.at(-1)!,'list')[1],'list')).toHaveLength(1);
 const attempts=attemptAt(r,t);expect(attempts).toHaveLength(1);expect(uint(f(attempts[0],3n))).toBe(b.failed?0n:uint(f(rec(f(rec(f(attempts[0],2n),432n),2n),431n),3n)));
 const observations=outputs(r.snapshot().outputs,203n).filter(v=>at(f(v,5n))===t&&key(f(v,11n))===key(text(CRITERION_VERSION)));
 expect(observations).toHaveLength(b.hidden?0:1);
 if(!b.hidden){const o=observations[0];expect(f(rec(f(o,6n),204n),2n)).toEqual(q(fulfilled?1:0,1));
  const probe=ts.find(v=>at(f(event(v),2n))===t&&key(f(v,6n))===key(text(POST_ITEM_PROBE)))!;expect(probe,'actual post-execution sensor').toBeDefined();expect(uint(f(event(probe),3n))).toBe(120n);const read=rec(items(f(probe,11n),'list')[0],147n);expect(f(read,2n)).toEqual(statePathValue(itemPath(target)));expect(f(read,4n)).toEqual(b.failed?origin:destination);
  const episode=outputs(r.snapshot().outputs,342n).find(v=>key(f(rec(f(v,2n),337n),2n))===key(o))!;expect(episode,'same observed criterion acquired').toBeDefined();
  const settlement=ts.find(v=>at(f(event(v),2n))===t&&key(f(event(v),5n))===key(sid(1001,'event/task-measurement-settlement')))!;expect(settlement,'existing goal owner consumes episode').toBeDefined();expect(f(settlement,12n)).toEqual(episode);expect(uint(f(event(settlement),3n))).toBe(140n);
  if(fulfilled){expect(at(f(g,3n))).toBe(t);expect(f(g,2n)).toEqual(characterEvidenceRefValue({kind:'observation',observationId:uint((f(o,1n) as Extract<CanonicalValue,{kind:'typedIdentifier'}>).payload)}));}
 }
 return {at:String(t),truth:!b.failed,criterion:b.hidden?null:fulfilled,status:Number(uint(f(g,1n))),route:Number(uint(task[1])),completed:String(uint(f(attempts[0],3n)))};
}
it('completion260 primary memory action perception and goal retirement',async()=>{
 for(const name of ['main','blocked','routeB'] as const){const x=await start(name);await through(x.run,4n);expect(uint(f(goal(x.run),1n))).toBe(1n);await through(x.run,5n);put(name+'-raw',capture(x.run));put(name+'-proof',proof(x));await through(x.run,6n);expect(attemptAt(x.run,6n)).toHaveLength(name==='blocked'?1:0);await finish(x.run);put(name+'-terminal',{goal:Number(uint(f(goal(x.run),1n))),save:hash(x.run.save())});}
},590000);
async function receipt(name:Case){const x=await start(name);await through(x.run,x.b.late?2n:4n);expect(uint(f(goal(x.run),1n))).toBe(1n);if(x.b.late){await through(x.run,5n);expect(attemptAt(x.run,5n)).toHaveLength(0);expect(uint(f(goal(x.run),1n))).toBe(1n);}await through(x.run,x.b.actionAt);put(name+'-raw',capture(x.run));put(name+'-proof',proof(x));if(!x.b.late){await through(x.run,6n);expect(attemptAt(x.run,6n)).toHaveLength(x.b.hidden?1:0);put(name+'-6',capture(x.run));}await finish(x.run);put(name+'-terminal',{goal:Number(uint(f(goal(x.run),1n))),save:hash(x.run.save())});}
it('completion260 receipt boundaries',async()=>{for(const name of ['hidden','hiddenBlocked','falseReceipt','trueReceipt'] as const)await receipt(name);},590000);
it('completion260 delayed cue',async()=>{await receipt('lateCue');},590000);

const saved=()=>JSON.parse(readFileSync(file,'utf8'));
const unzip=(s:string)=>new Uint8Array(inflateSync(Uint8Array.from(atob(s),c=>c.charCodeAt(0))));
const exact=(a:Run,b:Run)=>{expect(a.snapshot().clock).toBe(b.snapshot().clock);for(const k of ['state','outputs','trace'] as const)expect(hash(a.snapshot()[k])).toBe(hash(b.snapshot()[k]));expect(hash(a.save())).toBe(hash(b.save()));};
it('completion260 exact repeat restore and reached settlement rollback',async()=>{
 const x=await start('main'),repeat=cachedMemory(await createCharacterRun(x.m,x.b.d));for(const r of [x.run,repeat])await through(r,4n);exact(x.run,repeat);const save=x.run.save();
 const restore=async()=>cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));
 const bad=await restore(),before=bad.snapshot(),original=trace.traceRecordValue;let reached=false;
 const spy=vi.spyOn(trace,'traceRecordValue').mockImplementation(v=>{if(v.event.dueAt===5n&&key(v.event.eventTypeId)===key(sid(1001,'event/task-measurement-settlement'))){reached=true;throw Error('M260 settlement fault');}return original(v);});
 try{await expect(bad.settleNextInstant()).rejects.toThrow('M260 settlement fault');expect(reached).toBe(true);expect(bad.snapshot().clock).toBe(before.clock);for(const k of ['state','outputs','trace'] as const)expect(hash(bad.snapshot()[k])).toBe(hash(before[k]));expect(()=>bad.save()).toThrow('active quiescent');}finally{spy.mockRestore();}
 const restored=await restore();exact(x.run,restored);
 for(let n=0;n<128;n++){const more=await x.run.settleNextInstant();for(const r of [repeat,restored]){expect(await r.settleNextInstant()).toBe(more);exact(x.run,r);}if(more&&x.run.snapshot().clock===6n){const recalled=traces(x.run).find(v=>at(f(event(v),2n))===6n&&key(f(event(v),5n))===key(MEMORY_RECALL)&&key(f(v,13n)).includes(key(text(INTENTION_MEMORY))));expect(recalled,'reminder still retrieves instruction after fulfillment').toBeDefined();expect(attemptAt(x.run,6n)).toHaveLength(0);put('fulfilled6',capture(x.run));}if(!more){expect(hash(x.run.save())).toBe(saved()['main-terminal'].save);put('continuation',{checkpoint:zip(save),terminal:hash(x.run.save()),reachedSettlementRollback:reached,exactRepeatRestore:true});return;}}
 throw Error('M260 continuation cap');
},590000);
it('completion260 original receipt correspondence and hidden projections',()=>{
 const e=saved(),originals=intentionCases(),rows:Record<string,unknown>={};
 for(const name of cases){const raw=e[name+'-raw'],os=unzip(raw.outputs.deflate),all=items(decode(os),'list'),p=e[name+'-proof'];const taggedRows=(tag:string)=>all.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));const ws=taggedRows(WORKSPACE).find(v=>at(v[1])===BigInt(p.at))!;expect(ws,'live workspace').toBeDefined();const appraisal=taggedRows(JOINT_APPRAISAL).find(v=>key(f(rec(v[1],384n),2n))===key(ws[3]))!;expect(appraisal,'live appraisal').toBeDefined();expect(items(appraisal[4],'list').some(v=>key(items(v,'list')[0])===key(taskA))).toBe(true);expect(items(ws[4],'list').some(v=>key(items(v,'list')[1]).includes(key(text(INTENTION_MEMORY))))).toBe(true);const plan=taggedRows(STRATEGY_EVAL).find(v=>uint(v[2])===BigInt(p.at))!,task=items(items(plan[3],'list').find(v=>key(items(v,'list')[0])===key(taskA))!,'list'),operand=items(items(task.at(-1)!,'list')[1],'list')[0],instruction=instructionEpisode(operand);expect(items(ws[4],'list').some(v=>key(items(v,'list')[1])===key(operand))).toBe(true);
 const d=outputs(os,409n).find(v=>at(f(v,2n))===BigInt(p.at))!,ctx=rec(f(d,3n),408n),signals=rec(f(ctx,2n),403n),candidates=items(f(rec(f(signals,2n),398n),3n),'list').filter(v=>items(f(rec(v,397n),2n),'set').some(o=>key(f(rec(o,396n),1n))===key(taskA)));expect(candidates).toHaveLength(1);const candidate=rec(candidates[0],397n);expect(items(f(candidate,2n),'set').some(o=>key(f(rec(o,396n),2n))===key(instruction[4]))).toBe(true);const resolved=rec(f(rec(f(d,4n),419n),2n),420n);expect(f(resolved,1n)).toEqual(f(candidate,1n));expect(uint(f(resolved,8n))).toBe(1n);expect(items(f(signals,3n),'set').some(v=>key(f(rec(f(rec(v,402n),1n),401n),2n))===key(taskA))).toBe(true);
 const original=runIntention('RetainedCue',originals[name],Number(p.at)),last=original.rows.at(-1)!;expect(p.status).toBe(last.goal==='Fulfilled'?2:1);expect(p.truth).toBe(original.world.at(-1)!.success);expect(p.criterion).toBe((last.observation as {received:unknown}).received);expect(p.route+1).toBe((last.expression as {intent:number}).intent);rows[name]={native:p,original:last.goal,scope:'Original action instant only; native extra reminder5 is a separate continuation.'};}
 const project=(name:string,t:bigint)=>{const raw=e[name+(t===5n?'-raw':'-6')],os=unzip(raw.outputs.deflate),ts=unzip(raw.trace.deflate),ss=restoreAuthoritativeState(decode(unzip(raw.state.deflate))),d=outputs(os,409n).find(v=>at(f(v,2n))===t)!;const context=rec(f(d,3n),408n),signals=rec(f(context,2n),403n),result=rec(f(d,4n),419n);
 const recalls=outputs(ts,160n).filter(v=>at(f(event(v),2n))===t&&key(f(event(v),5n))===key(MEMORY_RECALL)).map(v=>key(f(v,13n)));
 return {goalStatus:String(uint(f(rec(ss.read(path).value!,372n),1n))),recalls,rawReasons:key(f(signals,3n)),result:key(result)};};
 const pairs=[['hidden','hiddenBlocked'],['falseReceipt','trueReceipt']];for(const [a,b]of pairs){for(const t of [5n,6n])expect(project(a,t)).toEqual(project(b,t));expect(e[a+'-proof'].truth).not.toBe(e[b+'-proof'].truth);}
 put('correspondence',{rows,pairs,projection:'goal status, recalled operands, raw evaluation reasons and decision result at action5 and continuation6; excludes run/model identity, execution truth and physical state'});
});
