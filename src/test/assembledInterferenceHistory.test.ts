import {it,expect,vi} from 'vitest';
import {fixture,decode,items,key,enc,list,text,signed,u,q,rec,f,uint,outputs,bytes,taskB,sid,type Run,type CanonicalValue,type Variant} from './fixtures/assembledInterferenceHistory';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {INTERFERENCE_SOURCE,INTERFERENCE_OBS,INTERFERENCE_APPRAISAL,INTERFERENCE_LEARN,interferencePath,interferenceJournal,interferenceObservation} from '../assembled/interferenceExpectation';
import {PERFORMANCE_OBS,outcomePath} from '../assembled/performance';
import {ACTION_BODY} from '../assembled/actionBody';
import {SKILL_ACTUAL} from '../assembled/skill';
import {EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {agencyRecord,decodeAgency} from '../campaign3/agencyCodecs';
import {typedIdentifier} from '../substrate/canonicalEncoding';
import {OBSERVERS} from '../campaign3/agencyModel';
import {createInterferenceExpectationRun,LAWS,type Frame} from '../campaign3/interferenceExpectation';
import {interferenceSources} from './interferenceExpectationFixtures';
import {successorSource} from './interferenceExpectationSuccessorFixtures';
import * as traceModule from '../substrate/trace';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const cache=new WeakMap<Run,{snapshot:ReturnType<Run['snapshot']>;state:ReturnType<typeof restoreAuthoritativeState>;out:readonly CanonicalValue[];traces:ReturnType<typeof outputs>}>();
function view(r:Run){let v=cache.get(r);if(!v){const snapshot=r.snapshot();v={snapshot,state:restoreAuthoritativeState(decode(snapshot.state)),out:items(decode(snapshot.outputs),'list'),traces:outputs(snapshot.trace,160n)};cache.set(r,v);}return v;}
async function next(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;view(r).snapshot.clock<at;n++){expect(n).toBeLessThan(64);expect(await next(r)).toBe(true);}expect(view(r).snapshot.clock).toBe(at);}
async function finish(r:Run){for(let n=0;n<64;n++){if(!await next(r)){expect(view(r).snapshot.clock).toBe(101n);return;}}throw Error('M202 settle cap');}
const labelled=(r:Run,label:string)=>view(r).out.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(label))).map(v=>items(v,'list'));
const history=(r:Run)=>interferenceJournal(view(r).state.read(interferencePath(taskB)).value,taskB,EXTENDED_TIME_LIMIT);
function appraisal(r:Run,at:number,n:number,d:number,count:number){
 const rows=labelled(r,INTERFERENCE_APPRAISAL).filter(a=>uint(a[1])===BigInt(at));expect(rows).toHaveLength(1);const a=rows[0];
 expect(a[2]).toEqual(taskB);expect(a[3]).toEqual(u(1));expect(a[5]).toEqual(u(count));expect(a[6]).toEqual(count?q(n,d):list([]));expect(a[7]).toEqual(count?list([q(n,d),q(n,d)]):list([]));
 const trace=view(r).traces.find(t=>eq(f(t,13n),list(a)))!;expect(trace).toBeDefined();expect(uint(f(rec(f(trace,4n),130n),3n))).toBe(50n);
 const reads=items(f(trace,11n),'list');expect(reads.some(v=>eq(f(rec(v,147n),2n),statePathValue(interferencePath(taskB))))).toBe(true);return a;
}
function live(r:Run,at:number){
 const ds=outputs(list(view(r).out),409n),d=ds.find(v=>eq(f(v,2n),signed(at)))!;expect(d,'actual choice'+at).toBeDefined();expect(uint(f(rec(f(d,4n),419n),1n))).toBe(3n);
 const intent=outputs(list(view(r).out),425n).find(v=>eq(f(v,2n),d))!,expression=outputs(list(view(r).out),426n).find(v=>eq(f(v,2n),intent))!;
 expect(intent).toBeDefined();expect(expression).toBeDefined();
 const execution=outputs(list(view(r).out),433n).find(v=>eq(f(rec(f(rec(f(v,2n),432n),2n),431n),2n),intent))!;expect(execution).toBeDefined();
 const effect=labelled(r,ACTION_BODY).find(a=>eq(a[1],f(execution,1n)))!;expect(effect).toBeDefined();expect(effect[5]).toEqual(text('Blocked'));
 const skill=labelled(r,SKILL_ACTUAL).find(a=>eq(a[2],effect[1]))!;expect(skill).toBeDefined();expect(skill[3]).toEqual(q(0,1));expect(skill[5]).toEqual(q(1,1));expect(skill[6]).toBe(true);expect(skill[7]).toBe(false);expect(skill[8]).toBe(false);
 const obs=labelled(r,PERFORMANCE_OBS).filter(a=>eq(a[3],taskB)&&uint(a[2])===BigInt(at));expect(obs).toHaveLength(1);expect(obs[0][4]).toEqual(u(1));expect(obs[0][6]).toBe(false);expect(obs[0][7]).toBe(true);
 expect(items(items(view(r).state.read(outcomePath(taskB)).value!,'list')[1],'list')).toContainEqual(list(obs[0]));
 return {d,intent,expression,execution,observation:list(obs[0])};
}
function frame(r:Run):Frame{
 // Only actual admitted outcome/report records enter the historical diagnostic.
 const rows:CanonicalValue[]=[];
 for(const a of labelled(r,PERFORMANCE_OBS).filter(a=>eq(a[3],taskB))){
  const ticket=uint(a[2]);expect([10n,12n,14n]).toContain(ticket);
  rows.push(agencyRecord(975,[typedIdentifier(1163,u(ticket*2n)),OBSERVERS[0],signed(ticket-9n),sid(1027,'episode/'+ticket),u(1),a[6],sid(1027,'outcome/'+ticket),list([])]));
 }
 for(const v of history(r)){const o=interferenceObservation(v,taskB,EXTENDED_TIME_LIMIT);expect(o.outcome).toBeDefined();expect(o.route).toBe(1n);
  rows.push(agencyRecord(975,[typedIdentifier(1163,u(o.at*2n+1n)),OBSERVERS[0],signed(o.at-9n),sid(1027,'episode/'+o.ticket),u(3),o.positive,sid(1027,'receipt/'+o.receipt),list([])]));
 }
 return {view:enc(list(rows)),context:'A',goal:1};
}
async function original(frames:Frame[],variant:Variant){
 for(const law of LAWS){const run=createInterferenceExpectationRun(law,frames);while(await run.step()){}const s=run.snapshot();
  const expected=law==='AcrossEpisodeMean'?(variant==='correction'?'1/2':'2/3'):law==='LatestEpisode'?'0/1':null;
  expect(s.rows[7].expectation).toBe(expected);expect(s.rows[7].affect).toEqual(expected?[expected,expected]:null);
  if(law==='AcrossEpisodeMean'){expect(s.rows[6].expectation).toBe('2/3');expect(s.rows[7].eligible).toBe(3);expect(s.episodes.map(e=>e.support.length)).toEqual(variant==='repeat'?[1,1,2]:variant==='correction'?[2,1,1]:[1,1,1]);}
 }
}
function correspondence(variant:Variant){
 const b=fixture(variant),source=variant==='duplicate'||variant==='repeat'?successorSource(variant==='repeat'):interferenceSources()[variant].orderedInputs;
 const old=items(decodeAgency(source),'list').map(v=>rec(v,973n)),rows=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list'));
 for(const v of old){const t=Number((f(v,1n) as {value:bigint}).value),kind=uint(f(v,2n));
  if(kind===1n){expect(f(v,4n)).toBe(false);expect(f(v,6n)).toEqual({kind:'set',items:[u(1)]});}
  if(kind===2n){const a=rows.find(a=>eq(a[0],signed(t+9))&&eq(a[2],INTERFERENCE_SOURCE))!,p=items(a[3],'list');expect(p[2]).toEqual(u(8n+2n*uint(f(v,3n))));expect(p[3]).toEqual(f(v,8n));expect(p[4]).toBe(true);expect(p[5]).toEqual(f(v,9n));}
 }
 expect(rows.filter(a=>eq(a[2],INTERFERENCE_SOURCE))).toHaveLength(4);return b;
}
async function scenario(variant:Variant){
 const b=correspondence(variant),r=await createCharacterRun(await prepareCharacterModel(b.s),b.d),frames:Frame[]=[],attempts:ReturnType<typeof live>[]=[];let prior:CanonicalValue[]=[];let prefix:{state:Uint8Array;outputs:Uint8Array;history:Uint8Array;draws:CanonicalValue}|undefined;
 for(let t=10;t<=17;t++){await through(r,BigInt(t));if([10,12,14].includes(t))attempts.push(live(r,t));
  if(t===10)appraisal(r,t,0,1,0);if(t===12||t===14)appraisal(r,t,1,1,t===12?1:2);
  if(t===15)prefix={state:view(r).snapshot.state,outputs:view(r).snapshot.outputs,history:r.decisionHistory(),draws:list(view(r).traces.flatMap(t=>items(f(t,14n),'list')))};
  if(t===16){appraisal(r,t,2,3,3);prior=labelled(r,INTERFERENCE_APPRAISAL).filter(a=>uint(a[1])<=16n).map(list);}
  if(t===17)appraisal(r,t,variant==='correction'?1:2,variant==='correction'?2:3,3);
  frames.push(frame(r));
 }
 const h=history(r);expect(h).toHaveLength(variant==='main'?3:4);
 if(variant==='repeat'){const pol=h.map(v=>interferenceObservation(v,taskB,EXTENDED_TIME_LIMIT).positive);expect(q(BigInt(pol.filter(Boolean).length),BigInt(pol.length))).toEqual(q(2,4));}
 await original(frames,variant);await finish(r);
 for(const a of attempts){expect(outputs(list(view(r).out),425n)).toContainEqual(a.intent);expect(outputs(list(view(r).out),426n)).toContainEqual(a.expression);}
 for(const a of prior)expect(view(r).out).toContainEqual(a);
 console.info('M202 '+variant+' PASS three actual K0/difficulty1 failures10/12/14 -> positive/positive/negative reports -> prior16=2/3, later17='+(variant==='correction'?'1/2':'2/3')+'; original four laws on actual admitted frames; full101.');
 return prefix!;
}
function prefixEqual(a:Awaited<ReturnType<typeof scenario>>,b:Awaited<ReturnType<typeof scenario>>){bytes(a.state,b.state);bytes(a.outputs,b.outputs);bytes(a.history,b.history);expect(a.draws).toEqual(b.draws);}
it('M202 main and duplicate preserve three native episode samples',async()=>{const a=await scenario('main'),b=await scenario('duplicate');prefixEqual(a,b);},570000);
it('M202 distinct report and older correction reach the later native appraisal',async()=>{const a=await scenario('repeat'),b=await scenario('correction');prefixEqual(a,b);},570000);
function snapshot(a:ReturnType<Run['snapshot']>,b:ReturnType<Run['snapshot']>){const {state:as,outputs:ao,trace:at,...am}=a,{state:bs,outputs:bo,trace:bt,...bm}=b;expect(am).toEqual(bm);bytes(as,bs);bytes(ao,bo);bytes(at,bt);}
function exact(a:Run,b:Run){snapshot(view(a).snapshot,view(b).snapshot);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());bytes(a.decisionHistory(),b.decisionHistory());bytes(a.decisionPresentation(),b.decisionPresentation());}
it('M202 late report rollback and continuation preserve complete three-episode history',async()=>{
 const b=fixture('correction'),m=await prepareCharacterModel(b.s),a=await createCharacterRun(m,b.d),repeat=await createCharacterRun(m,b.d);
 await through(a,15n);await through(repeat,15n);exact(a,repeat);const saved=a.save(),before=view(a).snapshot;let reached=false;const original=traceModule.traceRecordValue;
 const spy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(v=>{const row=original(v);if(eq(v.event.eventTypeId,INTERFERENCE_LEARN)&&v.event.dueAt===16n){reached=true;throw Error('M202 late140');}return row;});
 try{await expect(next(a)).rejects.toThrow('M202 late140');expect(reached).toBe(true);snapshot({...a.snapshot(),status:before.status},before);}finally{spy.mockRestore();}
 const recovery=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:saved});
 await through(repeat,16n);await through(recovery,16n);exact(repeat,recovery);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:repeat.save()});
 exact(repeat,restored);
 for(let n=0;;n++){expect(n).toBeLessThan(64);const more=await next(repeat);for(const r of[recovery,restored]){expect(await next(r)).toBe(more);exact(repeat,r);}if(!more)break;}
 appraisal(repeat,17,1,2,3);expect(view(repeat).snapshot.clock).toBe(101n);
 console.info('M202 CONTINUATION PASS independent repeat15; reached late140 rollback; save15 recovery/save16 all later complete snapshot/save/identity/history/presentation bytes through101.');
},570000);
