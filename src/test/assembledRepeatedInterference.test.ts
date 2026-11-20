import {it,expect,vi} from 'vitest';
import {fixture,taskB,create,decode,items,key,list,text,u,q,rec,f,uint,outputs,bytes,through,finish,type Run,type CanonicalValue} from './fixtures/assembledRepeatedInterference';
import {INTERFERENCE_WITNESS,INTERFERENCE_APPRAISAL,INTERFERENCE_LEARN,interferencePath,interferenceJournal,interferenceObservation,interferenceAppraisal,routeExpectation,type Episode} from '../assembled/interferenceExpectation';
import {EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
import {OBSTRUCTION_RESULT} from '../assembled/externalObstruction';
import {ACTION_BODY} from '../assembled/actionBody';
import {SKILL_ACTUAL} from '../assembled/skill';
import {PERFORMANCE_OBS,outcomePath} from '../assembled/performance';
import {restoreAuthoritativeState} from '../substrate/state';
import {restoreCharacterRun} from '../assembled/character';
import {signedValue} from './fixtures/assembledComparison';
import * as traceModule from '../substrate/trace';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const labelled=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(label))).map(v=>items(v,'list'));
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const journal=(r:Run,people:CanonicalValue[])=>interferenceJournal(state(r).read(interferencePath(taskB)).value,taskB,EXTENDED_TIME_LIMIT,people);
function appraisal(r:Run,at:bigint,mean:CanonicalValue,count:number){
 const rows=labelled(r,INTERFERENCE_APPRAISAL).filter(a=>uint(a[1])===at);expect(rows).toHaveLength(1);const a=rows[0];
 expect(a[2]).toEqual(taskB);expect(a[5]).toEqual(u(count));expect(a[6]).toEqual(mean);
 expect(a[7]).toEqual(count?list([mean,mean]):list([]));
 const trace=outputs(r.snapshot().trace,160n).find(t=>eq(f(t,13n),list(a)))!;expect(trace,'actual prior knowledge consumption').toBeDefined();expect(items(f(trace,11n),'list')).toHaveLength(1);expect(uint(f(rec(f(trace,4n),130n),3n))).toBe(50n);
 return a;
}
function live(r:Run,at:bigint){
 const os=r.snapshot().outputs,d=outputs(os,409n).find(v=>signedValue(f(v,2n))===at)!;expect(d,'actual decision at'+at).toBeDefined();
 const status=rec(f(d,4n),419n);expect(uint(f(status,1n)),'chosen at'+at).toBe(3n);
 const intent=outputs(os,425n).find(v=>eq(f(v,2n),d))!,expression=outputs(os,426n).find(v=>eq(f(v,2n),intent))!;
 expect(intent).toBeDefined();expect(expression).toBeDefined();
 const execution=outputs(os,433n).find(v=>eq(f(rec(f(rec(f(v,2n),432n),2n),431n),2n),intent))!;expect(execution).toBeDefined();
 const effect=labelled(r,ACTION_BODY).find(a=>eq(a[1],f(execution,1n)))!;expect(effect).toBeDefined();expect(effect[5]).toEqual(text('Blocked'));
 const skill=labelled(r,SKILL_ACTUAL).find(a=>eq(a[2],effect[1]))!;expect(skill).toBeDefined();expect(skill[6]).toBe(true);expect(skill[7]).toBe(true);
 const obs=labelled(r,PERFORMANCE_OBS).filter(a=>uint(a[2])===at&&eq(a[3],taskB));expect(obs,'actual B observation at'+at).toHaveLength(1);expect(obs[0][4]).toEqual(u(1));expect(obs[0][5]).toEqual(effect[3]);expect(obs[0][6]).toBe(false);expect(obs[0][7]).toBe(true);
 const trace=outputs(r.snapshot().trace,160n).find(t=>eq(f(t,13n),d))!;expect(trace).toBeDefined();const draws=f(trace,14n);if(at===10n)expect(items(draws,'list').length).toBeGreaterThan(0);else{expect(items(draws,'list')).toHaveLength(0);const choice=rec(f(status,2n),420n);expect(f(choice,8n)).toEqual(u(1));const probabilities=items(f(choice,2n),'list');expect(probabilities).toHaveLength(1);expect(f(rec(probabilities[0],421n),2n)).toEqual(q(1,1));}
 return {d,intent,expression,execution,effect,skill,observation:list(obs[0]),draws};
}
function full(a:Run,b:Run){expect(a.snapshot()).toEqual(b.snapshot());bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());bytes(a.decisionHistory(),b.decisionHistory());bytes(a.decisionPresentation(),b.decisionPresentation());}
it('M195 repeated actual blocks change prior expectation without rewriting intent',async()=>{
 const a=await create(fixture()),b=await create(fixture({secondSeen:false})),first=live(a.run,10n),other=live(b.run,10n);expect(first).toEqual(other);
 const early=appraisal(a.run,10n,list([]),0);appraisal(b.run,10n,list([]),0);
 await through(a.run,12n);await through(b.run,12n);const second=live(a.run,12n);expect(second).toEqual(live(b.run,12n));
 const prior=appraisal(a.run,12n,q(1,2),1);appraisal(b.run,12n,q(1,2),1);
 const h=journal(a.run,a.b.people);expect(h).toHaveLength(3);expect(h.map(v=>interferenceObservation(v,taskB,EXTENDED_TIME_LIMIT,a.b.people).ticket)).toEqual([10n,10n,12n]);
 expect(items(h[0],'list')[0]).toEqual(text(INTERFERENCE_WITNESS));expect(items(h[2],'list')[0]).toEqual(text(INTERFERENCE_WITNESS));
 expect(items(h[0],'list')[6]).toEqual(first.observation);expect(items(h[2],'list')[6]).toEqual(second.observation);
 await through(a.run,14n);await through(b.run,14n);const current=appraisal(a.run,14n,q(3,4),2);appraisal(b.run,14n,q(1,2),1);expect(current[8]).toEqual(list(h));
 const groups=new Map<string,Episode>();for(const row of h){const o=interferenceObservation(row,taskB,EXTENDED_TIME_LIMIT,a.b.people);expect(o.outcome).toBeDefined();const k=key(o.outcome!),e=groups.get(k)??{context:String(o.route),support:[]};groups.set(k,{...e,support:[...e.support,{source:String(o.receipt),positive:o.positive}]});}
 const episodes=[...groups.values()];expect(episodes).toHaveLength(2);const mean=routeExpectation(episodes,'1',1).estimate!;expect(q(mean.numerator,mean.denominator)).toEqual(current[6]);
 const latest=routeExpectation(episodes,'1',1,'LatestEpisode').estimate!;expect(q(latest.numerator,latest.denominator)).toEqual(q(1,1));
 for(const law of['EpisodeOnly','NoLearning'] as const)expect(routeExpectation(episodes,'1',1,law).estimate).toBeUndefined();
 const flat=episodes.flatMap(e=>e.support);expect(q(BigInt(flat.filter(s=>s.positive).length),BigInt(flat.length))).toEqual(q(2,3));expect(q(2,3)).not.toEqual(current[6]);
 expect(items(interferenceAppraisal(h,taskB,0n,1n,17n,EXTENDED_TIME_LIMIT,a.b.people),'list')[6]).toEqual(list([]));
 await through(a.run,16n);await through(b.run,16n);appraisal(a.run,16n,q(3,4),2);appraisal(b.run,16n,q(1,2),1);expect(journal(a.run,a.b.people)).toHaveLength(4);
 for(const r of[a.run,b.run]){await finish(r);expect(outputs(r.snapshot().outputs,425n)).toContainEqual(first.intent);expect(outputs(r.snapshot().outputs,426n)).toContainEqual(first.expression);expect(outputs(r.snapshot().outputs,425n)).toContainEqual(second.intent);expect(outputs(r.snapshot().outputs,426n)).toContainEqual(second.expression);expect(labelled(r,INTERFERENCE_APPRAISAL)).toContainEqual(early);expect(labelled(r,INTERFERENCE_APPRAISAL)).toContainEqual(prior);expect(items(items(state(r).read(outcomePath(taskB)).value!,'list')[1],'list')).toEqual([first.observation,second.observation]);}
 console.info('M195 CONNECTION PASS two actual competent B/route1 blocks10/12 with matched first draws/deterministic retry; prior12 half, later14/16 three-quarters versus half; two episodes not receipts; duplicate ignored, prior intentions/appraisals immutable, full101. Latest1/flat2/3/unknown alternatives distinguish.');
},570000);
it('M195 denied repeated causes preserve private-world independence',async()=>{
 const a=await create(fixture({private:true,blocker:1})),b=await create(fixture({private:true,blocker:2}));live(a.run,10n);live(b.run,10n);
 const safe=(r:Run)=>list(items(decode(r.snapshot().outputs),'list').filter(v=>!(typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(OBSTRUCTION_RESULT)))));
 for(let n=0;;n++){expect(n).toBeLessThan(32);bytes(a.run.snapshot().state,b.run.snapshot().state);expect(safe(a.run)).toEqual(safe(b.run));bytes(a.run.decisionHistory(),b.run.decisionHistory());bytes(a.run.decisionPresentation(),b.run.decisionPresentation());expect(journal(a.run,a.b.people)).toHaveLength(0);const more=await a.run.settleNextInstant();expect(await b.run.settleNextInstant()).toBe(more);if(!more)break;}
 live(a.run,12n);live(b.run,12n);for(const r of[a.run,b.run]){for(const at of[10n,12n,14n,16n])appraisal(r,at,list([]),0);expect(r.snapshot().clock).toBe(101n);}
 console.info('M195 PRIVACY PASS hidden blockers plus denied report never become causal evidence; identical complete state/safe output/history/player at every later instant; two actual failures, full101.');
},570000);
it('M195 second witness rollback and full continuation preserve accumulated history',async()=>{
 const b=fixture(),failed=await create(b,11n),repeat=await create(b,11n);full(failed.run,repeat.run);
 const saved=failed.run.save(),before=failed.run.snapshot(),original=traceModule.traceRecordValue;let reached=false;
 const spy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(v=>{const row=original(v);if(eq(v.event.eventTypeId,INTERFERENCE_LEARN)&&v.event.dueAt===12n){reached=true;throw Error('M195 second witness140');}return row;});
 try{await expect(failed.run.settleNextInstant()).rejects.toThrow('M195 second witness140');expect(reached).toBe(true);expect({...failed.run.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:saved});await through(repeat.run,12n);await through(recovered,12n);live(repeat.run,12n);full(repeat.run,recovered);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:repeat.run.save()});full(repeat.run,restored);
 for(let n=0;;n++){expect(n).toBeLessThan(32);const more=await repeat.run.settleNextInstant();for(const r of[recovered,restored]){expect(await r.settleNextInstant()).toBe(more);full(repeat.run,r);}if(!more)break;}
 expect(repeat.run.snapshot().clock).toBe(101n);appraisal(repeat.run,16n,q(3,4),2);
 console.info('M195 CONTINUATION PASS repeat11, reached second witness140 rollback, save11 recovery/save12 restoration all later complete bytes through101; prior history retained.');
},570000);

it('M195 preserves expired setup and changes only latest declared route validity',()=>{
 const old=fixture({originalExpired:true,alternateRetry:true}),now=fixture({alternateRetry:true});expect(old.s).toEqual(now.s);expect(old.d.initialState).toEqual(now.d.initialState);expect(old.d.runSeed).toEqual(now.d.runSeed);
 const a=items(decode(old.d.orderedInputs),'list'),b=items(decode(now.d.orderedInputs),'list');expect(a).toHaveLength(b.length);const changed=a.flatMap((v,i)=>eq(v,b[i])?[]:[i]);expect(changed).toHaveLength(1);
 const x=items(a[changed[0]],'list'),y=items(b[changed[0]],'list');expect(signedValue(x[0])).toBe(8n);expect(x.slice(0,3)).toEqual(y.slice(0,3));expect(x[4]).toEqual(y[4]);const before=items(items(x[3],'list')[1],'list'),after=items(items(y[3],'list')[1],'list');expect(before).toHaveLength(after.length);
 for(let i=0;i<before.length;i++){const p=items(before[i],'list'),qv=items(after[i],'list');expect(p[5]).toEqual(u(10));expect(qv).toEqual([...p.slice(0,5),u(16),p[6]]);}
 console.info('M195 AMENDMENT PASS only latest issued8 route validity10->16 changes; original expired fixture remains, all source values/seed/model/initial state otherwise fixed.');
});

it('M195 original available alternative remains a one-episode control',async()=>{
 const b=fixture({alternateRetry:true}),a=await create(b);live(a.run,10n);await through(a.run,12n);
 const d=outputs(a.run.snapshot().outputs,409n).find(v=>signedValue(f(v,2n))===12n)!;expect(d).toBeDefined();expect(uint(f(rec(f(d,4n),419n),1n))).toBe(3n);
 const outcomes=labelled(a.run,PERFORMANCE_OBS).filter(o=>uint(o[2])===12n);expect(outcomes).toHaveLength(1);expect(eq(outcomes[0][3],taskB)).toBe(false);expect(outcomes[0][6]).toBe(false);expect(outcomes[0][7]).toBe(true);
 expect(journal(a.run,b.people)).toHaveLength(2);await through(a.run,14n);appraisal(a.run,14n,q(1,2),1);await finish(a.run);
 console.info('M195 ORIGINAL CONTROL PASS live blocked alternative12 is not a second B episode; B expectation remains1/2. No report or world fact invents missing B outcome; full101.');
},570000);
