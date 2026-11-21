import {readQ} from '../campaign2/cognitiveMath';
import {it,expect,vi} from 'vitest';
import {fixture,decode,items,key,enc,list,text,signed,u,q,rec,f,uint,outputs,bytes,taskB,sid,type Run,type CanonicalValue,type ScopeCase} from './fixtures/assembledInterferenceAcquisition';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {INTERFERENCE,INTERFERENCE_ACQUISITION,INTERFERENCE_ACQUIRE_LEARN,INTERFERENCE_CONTEXT,INTERFERENCE_APPRAISAL,INTERFERENCE_OBS,INTERFERENCE_WITNESS,interferencePath,interferenceJournal,interferenceObservation,interferenceAppraisal} from '../assembled/interferenceExpectation';
import {OBSTRUCTION_RESULT} from '../assembled/externalObstruction';
import {PERFORMANCE_OBS,outcomePath} from '../assembled/performance';
import {ACTION_BODY} from '../assembled/actionBody';
import {SKILL_ACTUAL} from '../assembled/skill';
import {KNOWLEDGE_OWNER} from '../assembled/strategy';
import {EXTENDED_TIME_LIMIT as LIMIT} from '../assembled/timeDomain';
import {AuthoritativeState,restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {agencyRecord} from '../campaign3/agencyCodecs';
import {typedIdentifier} from '../substrate/canonicalEncoding';
import {OBSERVERS} from '../campaign3/agencyModel';
import {createInterferenceExpectationRun,LAWS,type Frame} from '../campaign3/interferenceExpectation';
import * as traceModule from '../substrate/trace';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const cache=new WeakMap<Run,{snapshot:ReturnType<Run['snapshot']>;state:ReturnType<typeof restoreAuthoritativeState>;out:readonly CanonicalValue[];traces:ReturnType<typeof outputs>}>();
function view(r:Run){let v=cache.get(r);if(!v){const snapshot=r.snapshot();v={snapshot,state:restoreAuthoritativeState(decode(snapshot.state)),out:items(decode(snapshot.outputs),'list'),traces:outputs(snapshot.trace,160n)};cache.set(r,v);}return v;}
async function next(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;view(r).snapshot.clock<at;n++){expect(n).toBeLessThan(64);expect(await next(r)).toBe(true);}expect(view(r).snapshot.clock).toBe(at);}
const labelled=(r:Run,label:string)=>view(r).out.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(label))).map(v=>items(v,'list'));
const history=(r:Run)=>interferenceJournal(view(r).state.read(interferencePath(taskB)).value,taskB,LIMIT,undefined,true);
const observed=(v:CanonicalValue)=>interferenceObservation(v,taskB,LIMIT,undefined,true);
function appraisal(r:Run,b:ReturnType<typeof fixture>,at:number){
 const rows=labelled(r,INTERFERENCE_APPRAISAL).filter(a=>uint(a[1])===BigInt(at));expect(rows).toHaveLength(1);const a=rows[0];
 const absent=['noContext','recovery','hidden'].includes(b.name),count=at===10||absent||b.name==='otherContext'&&at===14?0:at===12?1:at===14||b.name==='otherContext'?2:3;
 const mean=count?(at<16||b.name==='otherContext'?q(1,1):q(2,3)):list([]),c=b.scope(at);
 expect(a[2]).toEqual(taskB);expect(a[3]).toEqual(c===null?list([]):u(c));expect(a[4]).toEqual(u(b.goal));expect(a[5]).toEqual(u(count));expect(a[6]).toEqual(mean);
 expect(a[7]).toEqual(count?list(b.goal?[mean,mean]:[q(0,1),q(0,1)]):list([]));
 const trace=view(r).traces.find(t=>eq(f(t,13n),list(a)))!;expect(trace).toBeDefined();expect(uint(f(rec(f(trace,4n),130n),3n))).toBe(50n);
 expect(items(f(trace,11n),'list').some(v=>eq(f(rec(v,147n),2n),statePathValue(interferencePath(taskB))))).toBe(true);
 for(const v of items(a[8],'list'))expect(observed(v).at).toBeLessThan(BigInt(at));
 return a;
}
function live(r:Run,action:CanonicalValue,at:number){
 const d=outputs(list(view(r).out),409n).find(v=>eq(f(v,2n),signed(at)))!;expect(d,'live choice'+at).toBeDefined();expect(uint(f(rec(f(d,4n),419n),1n))).toBe(3n);
 const intent=outputs(list(view(r).out),425n).find(v=>eq(f(v,2n),d))!,expression=outputs(list(view(r).out),426n).find(v=>eq(f(v,2n),intent))!;
 expect(intent).toBeDefined();expect(expression).toBeDefined();
 const execution=outputs(list(view(r).out),433n).find(v=>eq(f(rec(f(rec(f(v,2n),432n),2n),431n),2n),intent))!;expect(execution).toBeDefined();
 const effect=labelled(r,ACTION_BODY).find(a=>eq(a[1],f(execution,1n)))!;expect(effect).toBeDefined();expect(effect[5]).toEqual(text('Blocked'));expect(effect[3]).toEqual(action);
 const skill=labelled(r,SKILL_ACTUAL).find(a=>eq(a[2],effect[1]))!;expect(skill).toBeDefined();expect(skill[3]).toEqual(q(0,1));expect(skill[5]).toEqual(q(1,1));expect(skill.slice(6,9)).toEqual([true,false,false]);
 const os=labelled(r,PERFORMANCE_OBS).filter(a=>eq(a[3],taskB)&&uint(a[2])===BigInt(at));expect(os).toHaveLength(1);expect(os[0][4]).toEqual(u(1));expect(os[0][6]).toBe(false);
 expect(items(items(view(r).state.read(outcomePath(taskB)).value!,'list')[1],'list')).toContainEqual(list(os[0]));
 const acquisitions=history(r).map(observed).filter(o=>o.acquisition&&o.at===BigInt(at));expect(acquisitions).toHaveLength(1);expect(acquisitions[0].outcome).toEqual(list(os[0]));
 return {intent,expression};
}
function frame(r:Run,b:ReturnType<typeof fixture>):Frame{
 const rows:CanonicalValue[]=[];
 for(const a of labelled(r,PERFORMANCE_OBS).filter(a=>eq(a[3],taskB))){const ticket=uint(a[2]);rows.push(agencyRecord(975,[typedIdentifier(1163,u(ticket*2n)),OBSERVERS[0],signed(ticket-9n),sid(1027,'episode/'+ticket),u(1),a[6],sid(1027,'outcome/'+ticket),list([])]));}
 for(const v of history(r)){const o=observed(v);if(o.acquisition)continue;rows.push(agencyRecord(975,[typedIdentifier(1163,u(o.at*2n+1n)),OBSERVERS[0],signed(o.at-9n),sid(1027,'episode/'+o.ticket),u(3),o.positive,sid(1027,'receipt/'+o.receipt),list([])]));}
 const c=b.scope(Number(view(r).snapshot.clock));return {view:enc(list(rows)),context:c===null?null:c===1?'A':'B',goal:b.goal};
}
async function original(frames:Frame[],b:ReturnType<typeof fixture>,r:Run){
 for(const law of LAWS){const old=createInterferenceExpectationRun(law,frames);while(await old.step()){}const rows=old.snapshot().rows;
  if(law==='AcrossEpisodeMean')for(const at of[10,12,14,16,17]){const a=appraisal(r,b,at),row=rows[at-10],known=typeof a[6]!=='boolean'&&a[6].kind==='rational';expect(row.eligible).toBe(Number(uint(a[5])));expect(row.expectation).toBe(known?canonicalRatio(a[6]):null);expect(row.affect).toEqual(items(a[7],'list').length?items(a[7],'list').map(canonicalRatio):null);}
  else {const absent=['noContext','recovery','hidden'].includes(b.name),value=absent||law!=='LatestEpisode'?null:b.name==='otherContext'?'1/1':'0/1';expect(rows[7].expectation).toBe(value);}
 }
}
function canonicalRatio(v:CanonicalValue){const x=readQ(v);return x.numerator+'/'+x.denominator;}
function safeEqual(a:Run,b:Run){
 bytes(view(a).snapshot.state,view(b).snapshot.state);
 const safe=(r:Run)=>enc(list(view(r).out.filter(v=>!(typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(OBSTRUCTION_RESULT))))));
 bytes(safe(a),safe(b));bytes(a.decisionHistory(),b.decisionHistory());bytes(a.decisionPresentation(),b.decisionPresentation());
 expect(list(view(a).traces.flatMap(t=>items(f(t,14n),'list')))).toEqual(list(view(b).traces.flatMap(t=>items(f(t,14n),'list'))));
}
async function group(names:ScopeCase[],privacy=false){
 const bs=names.map(n=>fixture(n)),m=await prepareCharacterModel(bs[0].s),compiled=await compileCharacterModel(bs[0].s),action=compiled.strategy!.find(s=>eq(s.task,taskB))!.plans[1].actionId;
 const rs:Run[]=[];for(const b of bs){bytes(bs[0].s.registry,b.s.registry);bytes(bs[0].d.initialState,b.d.initialState);bytes(bs[0].d.runSeed,b.d.runSeed);rs.push(await createCharacterRun(m,b.d));}
 const frames=rs.map(()=>[] as Frame[]),attempts=rs.map(()=>[] as ReturnType<typeof live>[]);
 for(let n=0;;n++){expect(n).toBeLessThan(64);let more:boolean|undefined;
  for(let i=0;i<rs.length;i++){const stepped=await next(rs[i]);if(i)expect(stepped).toBe(more);else more=stepped;
   if(stepped){const at=Number(view(rs[i]).snapshot.clock);if([10,12,14].includes(at))attempts[i].push(live(rs[i],action,at));if([10,12,14,16,17].includes(at))appraisal(rs[i],bs[i],at);if(at>=10&&at<=17)frames[i].push(frame(rs[i],bs[i]));}
  }
  if(privacy)safeEqual(rs[0],rs[1]);if(!more)break;
 }
 for(let i=0;i<rs.length;i++){
  const r=rs[i];expect(view(r).snapshot.clock).toBe(101n);expect(attempts[i]).toHaveLength(3);expect(frames[i]).toHaveLength(8);
  const h=history(r).map(observed);expect(h.filter(o=>o.acquisition)).toHaveLength(3);expect(h.filter(o=>!o.acquisition)).toHaveLength(3);
  for(const o of h.filter(o=>o.acquisition))expect(o.scope).toBe(bs[i].scope(Number(o.at))===null?null:BigInt(bs[i].scope(Number(o.at))!));
  for(const x of attempts[i]){expect(outputs(list(view(r).out),425n)).toContainEqual(x.intent);expect(outputs(list(view(r).out),426n)).toContainEqual(x.expression);}
  await original(frames[i],bs[i],r);
 }
 if(names.includes('goalZero'))bytes(enc(list(history(rs[0]))),enc(list(history(rs[names.indexOf('goalZero')]))));
 console.info('M204 '+names.join('/')+' PASS actual three failures; fixed acquisition context and later live appraisal; original four laws; full101'+(privacy?'; complete safe state/output/history/presentation/draw privacy':''));
 return {bs,rs,compiled};
}
it('M204 native scope filtering and goal separation',async()=>{
 const {rs,compiled,bs}=await group(['main','otherContext','goalZero']);
 const r=rs[0],h=history(r),acquisition=h[0],task=taskB;
 expect(()=>interferenceJournal(list([text(INTERFERENCE),list(h)]),task,LIMIT)).toThrow('acquisition version');
 const bad=[...items(acquisition,'list')];bad[4]=u(2);expect(()=>observed(list(bad))).toThrow('acquisition context');
 const acquireOnly=interferenceAppraisal([acquisition],task,1n,1n,11n,LIMIT,undefined,true);expect(items(acquireOnly,'list')[6]).toEqual(list([]));
 const component=await compileCharacterState(compiled),state=view(r).state,p=interferencePath(task),prior=state.read(p).value!;
 const changed=[...items(acquisition,'list')];changed[4]=u(0);
 const extra=list([text(INTERFERENCE_OBS),u(18),task,u(14),u(4),false,observed(h[4]).outcome!]);
 const rewrite=list([text(INTERFERENCE),list([list(changed),...h.slice(1),extra])]),patch={operations:[{kind:'set' as const,path:p,expected:{presence:true as const,value:prior},newValue:rewrite}]};
 expect(()=>component.stateModel.applyPatch(state,patch,KNOWLEDGE_OWNER)).toThrow('interference append only');
 expect(()=>component.stateModel.applyPatch(state,patch,sid(1034,'foreign-owner'))).toThrow();
 const forged=[...items(acquisition,'list')],outcome=[...items(forged[3],'list')];outcome[1]=typedIdentifier(1164,u(999999));forged[3]=list(outcome);
 const invalid=new AuthoritativeState(state.entries().map(e=>eq(statePathValue(e.path),statePathValue(p))?{...e,value:list([text(INTERFERENCE),list([list(forged),...h.slice(1).map(v=>{const x=[...items(v,'list')];if(eq(x[6]??list([]),items(acquisition,'list')[3]))x[6]=list(outcome);return list(x);})])])}:e));
 expect(()=>component.stateModel.validateState(invalid)).toThrow('interference original support mismatch');
 const rows=items(decode(bs[0].d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(eq(a[2],INTERFERENCE_CONTEXT)){const c=[...items(a[3],'list')];c[2]=u(2);a[3]=list(c);}return list(a);});
 await expect(createCharacterRun(await prepareCharacterModel(bs[0].s),{...bs[0].d,orderedInputs:enc(list(rows))})).rejects.toThrow('route');
 console.info('M204 ADMISSION PASS legacy/new context, no unsupported causal polarity, immutable acquisition, authority, original-support and invalid input checks.');
},570000);
it('M204 absent acquisition is not repaired by later context or hidden truth',async()=>{await group(['noContext','hidden','recovery'],true);},570000);
function snapshot(a:ReturnType<Run['snapshot']>,b:ReturnType<Run['snapshot']>){const {state:as,outputs:ao,trace:at,...am}=a,{state:bs,outputs:bo,trace:bt,...bm}=b;expect(am).toEqual(bm);bytes(as,bs);bytes(ao,bo);bytes(at,bt);}
function exact(a:Run,b:Run){snapshot(view(a).snapshot,view(b).snapshot);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());bytes(a.decisionHistory(),b.decisionHistory());bytes(a.decisionPresentation(),b.decisionPresentation());}
it('M204 acquisition and witness survive atomic rollback and exact continuation',async()=>{
 const b=fixture('witness'),m=await prepareCharacterModel(b.s),a=await createCharacterRun(m,b.d),repeat=await createCharacterRun(m,b.d);
 await through(a,12n);await through(repeat,12n);exact(a,repeat);
 // Actual same-instant acquisition + direct witness, not an authored state row.
 const h=interferenceJournal(view(repeat).state.read(interferencePath(taskB)).value,taskB,LIMIT,b.people,true),o=h.map(v=>interferenceObservation(v,taskB,LIMIT,b.people,true));
 expect(o.filter(x=>x.at===10n).map(x=>x.acquisition)).toEqual([true,false]);expect(items(h[1],'list')[0]).toEqual(text(INTERFERENCE_WITNESS));expect(o[1].positive).toBe(true);
 const saved=a.save();await through(a,13n);const before=view(a).snapshot;let reached=false;const originalTrace=traceModule.traceRecordValue;
 const spy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(v=>{const row=originalTrace(v);if(eq(v.event.eventTypeId,INTERFERENCE_ACQUIRE_LEARN)&&v.event.dueAt===14n){reached=true;throw Error('M204 acquisition140');}return row;});
 try{await expect(next(a)).rejects.toThrow('M204 acquisition140');expect(reached).toBe(true);snapshot({...a.snapshot(),status:before.status},before);}finally{spy.mockRestore();}
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:saved});exact(repeat,restored);
 for(let n=0;;n++){expect(n).toBeLessThan(64);const more=await next(repeat);expect(await next(restored)).toBe(more);exact(repeat,restored);if(!more)break;}
 expect(view(repeat).snapshot.clock).toBe(101n);
 const final=labelled(repeat,INTERFERENCE_APPRAISAL).find(a=>uint(a[1])===17n)!;expect(final[5]).toEqual(u(3));expect(final[6]).toEqual(q(2,3));
 console.info('M204 CONTINUATION PASS acquisition/direct witness atomic10; repeat/save12/reached acquisition14 rollback/recovery every later full byte101.');
},570000);
