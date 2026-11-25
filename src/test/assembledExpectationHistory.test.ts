import {it,expect} from 'vitest';
// @ts-expect-error Node-only evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Node-only evidence hashing.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless Node-only evidence.
import {deflateSync} from 'node:zlib';
import {createCharacterRun,restorePreparedCharacterRun} from '../assembled/character';
import {expectationPath,expectationValue} from '../assembled/performanceExpectation';
import {FROZEN,SIGNAL,knowledgePath} from '../assembled/communication';
import {PERFORMANCE_OBS} from '../assembled/performance';
import {SKILL_ACTUAL} from '../assembled/skill';
import {ACTION_BODY} from '../assembled/actionBody';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {qValue} from '../campaign2/cognitiveMath';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {start,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,u,type CanonicalValue} from './fixtures/assembledExpectationHistory';
const file='docs/planning/ASSEMBLED_CHARACTER_M255_EVIDENCE.json',hash=(v:Uint8Array)=>createHash('sha256').update(v).digest('hex'),zip=(v:Uint8Array)=>({hash:hash(v),bytes:v.length,deflate:deflateSync(v).toString('base64')});
const put=(k:string,v:unknown)=>{const e=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};if(e[k]!==undefined){expect(e[k]).toEqual(v);return;}e[k]=v;writeFileSync(file,JSON.stringify(e,null,2)+'\n');};
type Run=Awaited<ReturnType<typeof start>>['run'];type X=Awaited<ReturnType<typeof start>>;
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
function exact(a:Run,b:Run){const x=a.snapshot(),y=b.snapshot();expect(x.clock).toBe(y.clock);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.save(),b.save());}
const reports=(r:Run,t:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(t))).map(v=>items(v,'list'));
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const belief=(x:X,other=false)=>expectationValue(state(x.run).read(expectationPath(other?x.b.taskB:x.b.taskA,other?1n:0n)).value,1000000n);
const capture=(r:Run)=>{const s=r.snapshot();return {clock:String(s.clock),state:zip(s.state),outputs:zip(s.outputs),trace:zip(s.trace),save:hash(r.save())};};
async function finish(r:Run){for(let n=0;n<128;n++)if(!await r.settleNextInstant())return;throw Error('M255 queue cap');}
function live(x:X){
 const expected=[x.b.action,x.b.actionB,x.b.action,x.b.action,x.b.action,x.b.action];expect(key(x.b.action)).not.toBe(key(x.b.actionB));
 const frozen=reports(x.run,FROZEN);expect(frozen.map(v=>v[1])).toEqual([4,6,8,10,12,14].map(signed));expect(frozen.map(v=>v[3])).toEqual(expected);
 expect(reports(x.run,ACTION_BODY).map(v=>v[5])).toEqual(expected.map(()=>text('Applied')));
 expect(reports(x.run,SKILL_ACTUAL).every(v=>v[6]===true&&v[7]===true)).toBe(true);
 const observations=reports(x.run,PERFORMANCE_OBS);expect(observations).toHaveLength(5);expect(observations.map(v=>v[4])).toEqual([0,1,0,0,0].map(u));expect(observations.map(v=>v[5])).toEqual(expected.slice(0,5));
 for(const o of observations)expect(o[7]).toBe(true);
}
function claims(x:X,wanted:CanonicalValue[]){
 const frozen=reports(x.run,FROZEN);expect(frozen.map(v=>v[4])).toEqual(wanted);
 expect(reports(x.run,SIGNAL).map(v=>v[5])).toEqual([false,false,...wanted.slice(2).map(v=>items(v,'list').length===1)]);
 const received=state(x.run).read(knowledgePath(x.b.recipients[0])).value,history=received?items(received,'list'):[];
 expect(history.map(v=>items(v,'list')[3])).toEqual(wanted.slice(2).filter(v=>items(v,'list').length));
 expect(state(x.run).read(knowledgePath(x.b.recipients[1])).presence).toBe(false);
 const traces=outputs(x.run.snapshot().trace,160n).filter(v=>key(f(v,5n))===key(textId('seam/assembled-communication'))&&uint(f(rec(f(v,4n),130n),3n))===90n);
 expect(traces).toHaveLength(6);for(const t of traces){const reads=items(f(t,11n),'list');expect(reads).toHaveLength(1);expect(f(rec(reads[0],147n),2n)).toEqual(statePathValue(expectationPath(x.b.taskA,0n)));}
}
import {sid} from '../assembled/skill';
const textId=(s:string)=>sid(1036,s),empty=list([]),some=(n:number,d=1)=>list([q(n,d)]);
it('expectation255 primary repeated errors reach actual reports',async()=>{
 for(const mode of ['correction','positive'] as const){const x=await start(mode);await through(x.run,14n);put(mode+'-raw',capture(x.run));live(x);
  claims(x,mode==='correction'?[empty,some(0),some(0),some(1,2),some(3,4),some(7,8)]:[empty,some(1),some(1),some(1),some(1),some(1)]);
  const a=belief(x),b=belief(x,true);expect(qValue(a.mean!)).toEqual(mode==='correction'?q(7,8):q(1,1));expect(a.supports).toHaveLength(4);expect(qValue(b.mean!)).toEqual(q(1,1));expect(b.supports).toHaveLength(1);
  const rows=a.supports.map(v=>items(v,'list'));expect(rows.map(v=>v[1])).toEqual([0,0,0,0].map(u));expect(rows.map(v=>v[2])).toEqual([4,4,4,4].map(n=>q(n,1)));
  const errors:CanonicalValue[]=[];let predicted:Q|undefined;for(const support of rows){const observed=items(support[0],'list'),outcome=Q.of(observed[6]===true?1n:0n);if(predicted!==undefined){const error=outcome.subtract(predicted);errors.push(qValue(error));predicted=predicted.add(error.divide(Q.of(2n)));}else predicted=outcome;}
  expect(errors).toEqual(mode==='correction'?[q(1,1),q(1,2),q(1,4)]:[q(0,1),q(0,1),q(0,1)]);expect(predicted).toEqual(a.mean);
  put(mode+'-proof',{errors:errors.map(key),mean:key(qValue(a.mean!)),taskA:4,taskB:1,liveDelivered:true});await finish(x.run);put(mode+'-terminal',{save:hash(x.run.save())});
 }
 console.info('M255 PRIMARY A0 repeated errors1,1/2,1/4 -> mean7/8; same latest success differs from1; B1 remains separate; actual report14 delivered');
},590000);
it('expectation255 boundaries missing engagement denial and other action',async()=>{
 for(const mode of ['missing','nonengaged','denied','other-failure'] as const){const x=await start(mode);await through(x.run,14n);put(mode+'-raw',capture(x.run));
  if(mode==='missing'||mode==='nonengaged'){claims(x,[empty,empty,empty,some(1),some(1),some(1)]);expect(belief(x).supports).toHaveLength(3);expect(qValue(belief(x).mean!)).toEqual(q(1,1));if(mode==='nonengaged'){expect(reports(x.run,PERFORMANCE_OBS)[0][6]).toBe(true);expect(reports(x.run,PERFORMANCE_OBS)[0][7]).toBe(false);}}
  else if(mode==='denied'){claims(x,[empty,some(0),some(0),some(0),some(0),some(0)]);expect(belief(x).supports).toHaveLength(1);expect(qValue(belief(x).mean!)).toEqual(q(0,1));}
  else{live(x);claims(x,[empty,some(0),some(0),some(1,2),some(3,4),some(7,8)]);expect(qValue(belief(x,true).mean!)).toEqual(q(0,1));expect(qValue(belief(x).mean!)).toEqual(q(7,8));}
  await finish(x.run);put(mode+'-terminal',{save:hash(x.run.save())});
 }
 console.info('M255 BOUNDARIES unknown/zero, positive non-engaged report, denied corrections and B-only outcome isolation');
},590000);
it('expectation255 privacy and exact continuation',async()=>{
 const x=await start(),hidden=await start('hidden');await through(x.run,8n);await through(hidden.run,8n);const saved=x.run.save();
 const repeat=cachedMemory(await createCharacterRun(x.m,x.b.d)),restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:saved}));await through(repeat,8n);exact(x.run,repeat);exact(x.run,restored);
 const projection=(r:Run)=>{const s=state(r),means=[expectationPath(x.b.taskA,0n),expectationPath(x.b.taskB,1n)].map(p=>{const b=expectationValue(s.read(p).value,1000000n);return list([b.mean?qValue(b.mean):empty,list(b.supports.map(v=>{const a=items(v,'list'),o=items(a[0],'list');return list([list([o[0],...o.slice(2)]),a[1],a[2]]);} ))]);});return key(list([...means,...reports(r,FROZEN).map(v=>list([v[1],v[3],v[4],v[5]])),...x.b.recipients.map(p=>list((s.read(knowledgePath(p)).value?items(s.read(knowledgePath(p)).value!,'list'):[]).map(v=>list(items(v,'list').slice(1)))))]));};
 expect(reports(x.run,SKILL_ACTUAL)[0][7]).toBe(true);expect(reports(hidden.run,SKILL_ACTUAL)[0][7]).toBe(false);expect(projection(x.run)).toEqual(projection(hidden.run));
 put('privacy8',{main:capture(x.run),hidden:capture(hidden.run)});
 for(let n=0;n<128;n++){const more=await x.run.settleNextInstant();for(const r of [repeat,restored]){expect(await r.settleNextInstant()).toBe(more);exact(x.run,r);}expect(await hidden.run.settleNextInstant()).toBe(more);expect(projection(x.run)).toEqual(projection(hidden.run));if(!more){put('continuation',{checkpoint:hash(saved),terminal:hash(x.run.save()),exactRepeatRestore:true,hiddenPhysicalOutcomeDifferent:true,projectionHash:hash(new TextEncoder().encode(projection(x.run))),hidden:capture(hidden.run)});return;}}
 throw Error('M255 continuation cap');
},590000);
