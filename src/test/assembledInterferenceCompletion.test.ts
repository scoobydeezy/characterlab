import {readQ} from '../campaign2/cognitiveMath';
import {it,expect,vi} from 'vitest';
import {fixture,decode,items,key,enc,list,text,signed,u,q,rec,f,uint,outputs,bytes,taskB,sid,type Run,type CanonicalValue,type Case} from './fixtures/assembledInterferenceCompletion';
import {compileCharacterModel} from '../assembled/model';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {INTERFERENCE_SOURCE,INTERFERENCE_APPRAISAL,INTERFERENCE_LEARN,interferencePath,interferenceJournal,interferenceObservation} from '../assembled/interferenceExpectation';
import {OBSTRUCTION_SOURCE,OBSTRUCTION_RESULT} from '../assembled/externalObstruction';
import {PERFORMANCE_SETTING,PERFORMANCE_OBS,outcomePath} from '../assembled/performance';
import {ACTION_BODY} from '../assembled/actionBody';
import {SKILL_ACTUAL} from '../assembled/skill';
import {EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {agencyRecord} from '../campaign3/agencyCodecs';
import {typedIdentifier} from '../substrate/canonicalEncoding';
import {OBSERVERS} from '../campaign3/agencyModel';
import {createInterferenceExpectationRun,LAWS,type Frame} from '../campaign3/interferenceExpectation';
import * as traceModule from '../substrate/trace';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const actions=new WeakMap<Run,CanonicalValue>();
const cache=new WeakMap<Run,{snapshot:ReturnType<Run['snapshot']>;state:ReturnType<typeof restoreAuthoritativeState>;out:readonly CanonicalValue[];traces:ReturnType<typeof outputs>}>();
function view(r:Run){let v=cache.get(r);if(!v){const snapshot=r.snapshot();v={snapshot,state:restoreAuthoritativeState(decode(snapshot.state)),out:items(decode(snapshot.outputs),'list'),traces:outputs(snapshot.trace,160n)};cache.set(r,v);}return v;}
async function next(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;view(r).snapshot.clock<at;n++){expect(n).toBeLessThan(64);expect(await next(r)).toBe(true);}expect(view(r).snapshot.clock).toBe(at);}
async function finish(r:Run){for(let n=0;n<64;n++){if(!await next(r)){expect(view(r).snapshot.clock).toBe(101n);return;}}throw Error('M205 settle cap');}
const labelled=(r:Run,label:string)=>view(r).out.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(label))).map(v=>items(v,'list'));
const history=(r:Run)=>interferenceJournal(view(r).state.read(interferencePath(taskB)).value,taskB,EXTENDED_TIME_LIMIT,undefined,true);
const unknown=(name:Case)=>['withheld','withheldChanged','noOpportunity'].includes(name);
function appraisal(r:Run,name:Case,at:number){
 const rows=labelled(r,INTERFERENCE_APPRAISAL).filter(a=>uint(a[1])===BigInt(at));expect(rows).toHaveLength(1);const a=rows[0];
 const count=at===10||unknown(name)?0:at===12?1:at===14?2:3,mean=count?(name==='clear'?q(0,1):name==='blocked'||at<16?q(1,1):name==='correction'&&at===17?q(1,2):q(2,3)):list([]);
 expect(a[2]).toEqual(taskB);expect(a[3]).toEqual(u(1));expect(a[5]).toEqual(u(count));expect(a[6]).toEqual(mean);expect(a[7]).toEqual(count?list([mean,mean]):list([]));
 const trace=view(r).traces.find(t=>eq(f(t,13n),list(a)))!;expect(trace).toBeDefined();expect(uint(f(rec(f(trace,4n),130n),3n))).toBe(50n);
 expect(items(f(trace,11n),'list').some(v=>eq(f(rec(v,147n),2n),statePathValue(interferencePath(taskB))))).toBe(true);
 for(const v of items(a[8],'list'))expect(interferenceObservation(v,taskB,EXTENDED_TIME_LIMIT,undefined,true).at).toBeLessThan(BigInt(at));
 return a;
}
function live(r:Run,name:Case,at:number){
 const d=outputs(list(view(r).out),409n).find(v=>eq(f(v,2n),signed(at)))!;expect(d,'choice'+at).toBeDefined();expect(uint(f(rec(f(d,4n),419n),1n))).toBe(3n);
 const intent=outputs(list(view(r).out),425n).find(v=>eq(f(v,2n),d))!,expression=outputs(list(view(r).out),426n).find(v=>eq(f(v,2n),intent))!;
 expect(intent).toBeDefined();expect(expression).toBeDefined();
 const execution=outputs(list(view(r).out),433n).find(v=>eq(f(rec(f(rec(f(v,2n),432n),2n),431n),2n),intent))!;expect(execution).toBeDefined();
 const effect=labelled(r,ACTION_BODY).find(a=>eq(a[1],f(execution,1n)))!;expect(effect).toBeDefined();expect(effect[5]).toEqual(text('Blocked'));expect(actions.get(r)).toBeDefined();expect(effect[3]).toEqual(actions.get(r));
 const skill=labelled(r,SKILL_ACTUAL).find(a=>eq(a[2],effect[1]))!;expect(skill).toBeDefined();expect(skill[3]).toEqual(q(0,1));expect(skill[5]).toEqual(q(1,1));expect(skill[6]).toBe(true);expect(skill[7]).toBe(false);expect(skill[8]).toBe(false);
 const obs=labelled(r,PERFORMANCE_OBS).filter(a=>eq(a[3],taskB)&&uint(a[2])===BigInt(at));expect(obs).toHaveLength(name==='noOpportunity'?0:1);
 if(name==='noOpportunity')expect(view(r).state.read(outcomePath(taskB)).presence).toBe(false);
 else{expect(obs[0][4]).toEqual(u(1));expect(obs[0][6]).toBe(false);expect(items(items(view(r).state.read(outcomePath(taskB)).value!,'list')[1],'list')).toContainEqual(list(obs[0]));}
 return {intent,expression};
}

function correspondence(name:Case){
 const b=fixture(name),rows=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list'));
 for(const v of b.original){const at=Number((f(v,1n) as {value:bigint}).value)+9,kind=uint(f(v,2n));
  if(kind===1n){expect(f(v,4n)).toBe(false);const p=items(rows.find(a=>eq(a[0],signed(at))&&eq(a[2],OBSTRUCTION_SOURCE))![3],'list'),block=Number(uint(f(v,5n)));expect(p[2]).toEqual(list(block?[b.people[block-1]]:[]));expect(p[3]).toEqual(list([]));expect(p[6]).toEqual(list([false,false]));
   const feed=items(rows.find(a=>eq(a[0],signed(at))&&eq(a[2],PERFORMANCE_SETTING))![3],'list'),target=items(feed[1],'list').map(v=>items(v,'list')).find(a=>eq(a[0],taskB))!;expect(target[1]).toBe(items(f(v,6n),'set').some(x=>eq(x,u(1))));expect(target[2]).toEqual(u(0));
  }else if(kind===2n){const p=items(rows.find(a=>eq(a[0],signed(at))&&eq(a[2],INTERFERENCE_SOURCE))![3],'list');expect(p[2]).toEqual(u(8n+2n*uint(f(v,3n))));expect(p[3]).toEqual(f(v,8n));expect(p[4]).toBe(items(f(v,10n),'set').some(x=>eq(x,u(1))));expect(p[5]).toEqual(f(v,9n));}
 }
 return b;
}
const observation=(v:CanonicalValue)=>interferenceObservation(v,taskB,EXTENDED_TIME_LIMIT,undefined,true);
function supports(r:Run){
 const h=history(r).map(observation),acq=h.filter(o=>o.acquisition);
 return acq.map(o=>{const receipts=new Map<bigint,boolean>();for(const s of h)if(!s.acquisition&&s.outcome&&eq(s.outcome,o.outcome!)&&!receipts.has(s.receipt))receipts.set(s.receipt,s.positive);return [...receipts.values()];});
}
function retained(r:Run,name:Case,attempts:ReturnType<typeof live>[]){
 const h=history(r).map(observation),acq=h.filter(o=>o.acquisition),reports=h.filter(o=>!o.acquisition),extra=['duplicate','repeat','successorDuplicate','successorRepeat','correction'].includes(name);
 expect(acq).toHaveLength(name==='noOpportunity'?0:3);expect(reports).toHaveLength(name.startsWith('withheld')?0:extra?4:3);
 for(const o of acq)expect(o.scope).toBe(1n);
 for(const o of reports){if(name==='noOpportunity'){expect(o.outcome).toBeUndefined();expect(o.route).toBeNull();}else{expect(o.outcome).toBeDefined();expect(o.route).toBe(1n);}}
 const sizes=supports(r).map(x=>x.length),expected=name==='noOpportunity'?[]:name.startsWith('withheld')?[0,0,0]:name==='repeat'||name==='successorRepeat'?[1,1,2]:name==='correction'?[2,1,1]:[1,1,1];
 expect(sizes).toEqual(expected);
 if(name==='repeat'||name==='successorRepeat'){const flat=supports(r).flat();expect(q(BigInt(flat.filter(Boolean).length),BigInt(flat.length))).toEqual(q(2,4));}
 for(const a of attempts){expect(outputs(list(view(r).out),425n)).toContainEqual(a.intent);expect(outputs(list(view(r).out),426n)).toContainEqual(a.expression);}
}
function frame(r:Run):Frame{
 const rows:CanonicalValue[]=[];
 for(const a of labelled(r,PERFORMANCE_OBS).filter(a=>eq(a[3],taskB))){const ticket=uint(a[2]);expect([10n,12n,14n]).toContain(ticket);rows.push(agencyRecord(975,[typedIdentifier(1163,u(ticket*2n)),OBSERVERS[0],signed(ticket-9n),sid(1027,'episode/'+ticket),u(1),a[6],sid(1027,'outcome/'+ticket),list([])]));}
 for(const v of history(r)){const o=observation(v);if(o.acquisition)continue;rows.push(agencyRecord(975,[typedIdentifier(1163,u(o.at*2n+1n)),OBSERVERS[0],signed(o.at-9n),sid(1027,'episode/'+o.ticket),u(3),o.positive,sid(1027,'receipt/'+o.receipt),list([])]));}
 return {view:enc(list(rows)),context:'A',goal:1};
}
const str=(v:CanonicalValue)=>{const x=readQ(v);return x.numerator+'/'+x.denominator;};
async function original(frames:Frame[],name:Case,native:Run){
 for(const law of LAWS){const r=createInterferenceExpectationRun(law,frames);while(await r.step()){}const s=r.snapshot();
  if(law==='AcrossEpisodeMean')for(const at of[10,12,14,16,17]){const a=appraisal(native,name,at),mean=typeof a[6]!=='boolean'&&a[6].kind==='rational'?str(a[6]):null;expect(s.rows[at-10].expectation).toBe(mean);expect(s.rows[at-10].eligible).toBe(Number(uint(a[5])));expect(s.rows[at-10].affect).toEqual(mean?[mean,mean]:null);}
  else expect(s.rows[7].expectation).toBe(unknown(name)||law!=='LatestEpisode'?null:name==='blocked'?'1/1':'0/1');
  if(law!=='NoLearning')expect(s.episodes.map(e=>e.support.map(x=>x.positive))).toEqual(supports(native));
 }
}
function safeEqual(a:Run,b:Run){
 bytes(view(a).snapshot.state,view(b).snapshot.state);
 const safe=(r:Run)=>enc(list(view(r).out.filter(v=>!(typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(OBSTRUCTION_RESULT))))));
 bytes(safe(a),safe(b));bytes(a.decisionHistory(),b.decisionHistory());bytes(a.decisionPresentation(),b.decisionPresentation());expect(list(view(a).traces.flatMap(t=>items(f(t,14n),'list')))).toEqual(list(view(b).traces.flatMap(t=>items(f(t,14n),'list'))));
}
async function group(names:Case[],privacy=false){
 const bs=names.map(correspondence),m=await prepareCharacterModel(bs[0].s),action=(await compileCharacterModel(bs[0].s)).strategy!.find(s=>eq(s.task,taskB))!.plans[1].actionId,rs:Run[]=[];
 for(const b of bs){bytes(b.s.registry,bs[0].s.registry);bytes(b.d.initialState,bs[0].d.initialState);bytes(b.d.runSeed,bs[0].d.runSeed);const r=await createCharacterRun(m,b.d);actions.set(r,action);rs.push(r);}
 const frames=rs.map(()=>[] as Frame[]),attempts=rs.map(()=>[] as ReturnType<typeof live>[]);
 for(let n=0;;n++){expect(n).toBeLessThan(64);let more:boolean|undefined;
  for(let i=0;i<rs.length;i++){const step=await next(rs[i]);if(i)expect(step).toBe(more);else more=step;
   if(step){const at=Number(view(rs[i]).snapshot.clock);if([10,12,14].includes(at))attempts[i].push(live(rs[i],names[i],at));if([10,12,14,16,17].includes(at))appraisal(rs[i],names[i],at);if(at>=10&&at<=17)frames[i].push(frame(rs[i]));}
  }
  if(privacy)safeEqual(rs[0],rs[1]);
  if(names[0]==='duplicate'||names[0]==='successorDuplicate'){if(view(rs[0]).snapshot.clock<16n)safeEqual(rs[0],rs[1]);}
  if(!more)break;
 }
 for(let i=0;i<rs.length;i++){expect(view(rs[i]).snapshot.clock).toBe(101n);expect(attempts[i]).toHaveLength(3);expect(frames[i]).toHaveLength(8);retained(rs[i],names[i],attempts[i]);await original(frames[i],names[i],rs[i]);}
 console.info('M205 '+names.join('/')+' PASS current0.135 three real failures; live prior-only appraisal; exact unique episode supports; original four-law projections; full101'+(privacy?'; whole safe state/output/history/presentation/draw privacy':''));
}
it('M205 clear and blocked retain known zero and one',async()=>{await group(['clear','blocked']);},570000);
it('M205 hidden causes preserve the reported history',async()=>{await group(['main','hidden'],true);},570000);
it('M205 denied report content preserves Unknown',async()=>{await group(['withheld','withheldChanged'],true);},570000);
it('M205 unobserved opportunity leaves reports unbound',async()=>{await group(['noOpportunity']);},570000);
it('M205 contrary correction changes only later appraisal',async()=>{await group(['correction']);},570000);
it('M205 successor receipts preserve three episode weighting',async()=>{await group(['successorDuplicate','successorRepeat']);},570000);
it('M205 primary terminal receipts cannot revise same instant appraisal',async()=>{await group(['duplicate','repeat']);},570000);
function snapshot(a:ReturnType<Run['snapshot']>,b:ReturnType<Run['snapshot']>){const {state:as,outputs:ao,trace:at,...am}=a,{state:bs,outputs:bo,trace:bt,...bm}=b;expect(am).toEqual(bm);bytes(as,bs);bytes(ao,bo);bytes(at,bt);}
function exact(a:Run,b:Run){snapshot(view(a).snapshot,view(b).snapshot);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());bytes(a.decisionHistory(),b.decisionHistory());bytes(a.decisionPresentation(),b.decisionPresentation());}
it('M205 late correction rollback and exact continuation preserve acquired episodes',async()=>{
 const b=correspondence('correction'),m=await prepareCharacterModel(b.s),a=await createCharacterRun(m,b.d),repeat=await createCharacterRun(m,b.d);
 await through(a,15n);await through(repeat,15n);exact(a,repeat);const saved=a.save(),before=view(a).snapshot;let reached=false;const originalTrace=traceModule.traceRecordValue;
 const spy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(v=>{const row=originalTrace(v);if(eq(v.event.eventTypeId,INTERFERENCE_LEARN)&&v.event.dueAt===16n){reached=true;throw Error('M205 late140');}return row;});
 try{await expect(next(a)).rejects.toThrow('M205 late140');expect(reached).toBe(true);snapshot({...a.snapshot(),status:before.status},before);}finally{spy.mockRestore();}
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:saved});exact(repeat,restored);
 for(let n=0;;n++){expect(n).toBeLessThan(64);const more=await next(repeat);expect(await next(restored)).toBe(more);exact(repeat,restored);if(!more)break;}
 appraisal(repeat,'correction',16);appraisal(repeat,'correction',17);expect(supports(repeat).map(x=>x.length)).toEqual([2,1,1]);expect(view(repeat).snapshot.clock).toBe(101n);
 console.info('M205 CONTINUATION PASS independent repeat/save15; reached correction16 learning140 rollback; restored every later complete state/output/trace/save/identity/history/presentation byte101.');
},570000);
