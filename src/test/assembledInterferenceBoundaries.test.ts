import {it,expect,vi} from 'vitest';
import {fixture,decode,items,key,enc,list,text,signed,u,q,rec,f,uint,outputs,bytes,taskB,sid,type Run,type CanonicalValue,type Boundary} from './fixtures/assembledInterferenceBoundaries';
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
async function finish(r:Run){for(let n=0;n<64;n++){if(!await next(r)){expect(view(r).snapshot.clock).toBe(101n);return;}}throw Error('M203 settle cap');}
const labelled=(r:Run,label:string)=>view(r).out.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(label))).map(v=>items(v,'list'));
const history=(r:Run)=>interferenceJournal(view(r).state.read(interferencePath(taskB)).value,taskB,EXTENDED_TIME_LIMIT);
const unknown=(name:Boundary)=>['withheld','withheldChanged','noOpportunity'].includes(name);
function appraisal(r:Run,name:Boundary,at:number){
 const rows=labelled(r,INTERFERENCE_APPRAISAL).filter(a=>uint(a[1])===BigInt(at));expect(rows).toHaveLength(1);const a=rows[0];
 const count=at===10||unknown(name)?0:at===12?1:at===14?2:3,mean=count?(name==='clear'?q(0,1):name==='blocked'||at<16?q(1,1):q(2,3)):list([]);
 expect(a[2]).toEqual(taskB);expect(a[3]).toEqual(u(1));expect(a[5]).toEqual(u(count));expect(a[6]).toEqual(mean);expect(a[7]).toEqual(count?list([mean,mean]):list([]));
 const trace=view(r).traces.find(t=>eq(f(t,13n),list(a)))!;expect(trace).toBeDefined();expect(uint(f(rec(f(trace,4n),130n),3n))).toBe(50n);
 expect(items(f(trace,11n),'list').some(v=>eq(f(rec(v,147n),2n),statePathValue(interferencePath(taskB))))).toBe(true);
 if(unknown(name))expect(items(a[8],'list').every(v=>interferenceObservation(v,taskB,EXTENDED_TIME_LIMIT).outcome===undefined)).toBe(true);
 return a;
}
function live(r:Run,name:Boundary,at:number){
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
function frame(r:Run):Frame{
 const rows:CanonicalValue[]=[];
 for(const a of labelled(r,PERFORMANCE_OBS).filter(a=>eq(a[3],taskB))){const ticket=uint(a[2]);expect([10n,12n,14n]).toContain(ticket);rows.push(agencyRecord(975,[typedIdentifier(1163,u(ticket*2n)),OBSERVERS[0],signed(ticket-9n),sid(1027,'episode/'+ticket),u(1),a[6],sid(1027,'outcome/'+ticket),list([])]));}
 for(const v of history(r)){const o=interferenceObservation(v,taskB,EXTENDED_TIME_LIMIT);rows.push(agencyRecord(975,[typedIdentifier(1163,u(o.at*2n+1n)),OBSERVERS[0],signed(o.at-9n),sid(1027,'episode/'+o.ticket),u(3),o.positive,sid(1027,'receipt/'+o.receipt),list([])]));}
 return {view:enc(list(rows)),context:'A',goal:1};
}
async function original(frames:Frame[],name:Boundary){
 for(const law of LAWS){const r=createInterferenceExpectationRun(law,frames);while(await r.step()){}const s=r.snapshot(),value=unknown(name)||law==='EpisodeOnly'||law==='NoLearning'?null:name==='clear'?'0/1':name==='blocked'?'1/1':law==='LatestEpisode'?'0/1':'2/3';
  expect(s.rows[7].expectation).toBe(value);expect(s.rows[7].affect).toEqual(value?[value,value]:null);if(law==='AcrossEpisodeMean')expect(s.rows[7].eligible).toBe(unknown(name)?0:3);
 }
}
function correspondence(name:Boundary){
 const b=fixture(name),rows=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list'));
 for(const v of b.original){const at=Number((f(v,1n) as {value:bigint}).value)+9,kind=uint(f(v,2n));
  if(kind===1n){expect(f(v,4n)).toBe(false);const p=items(rows.find(a=>eq(a[0],signed(at))&&eq(a[2],OBSTRUCTION_SOURCE))![3],'list');const block=Number(uint(f(v,5n)));expect(p[2]).toEqual(list(block?[b.people[block-1]]:[]));expect(p[3]).toEqual(list([]));expect(p[6]).toEqual(list([false,false]));
   const feed=items(rows.find(a=>eq(a[0],signed(at))&&eq(a[2],PERFORMANCE_SETTING))![3],'list'),target=items(feed[1],'list').map(v=>items(v,'list')).find(a=>eq(a[0],taskB))!;
   expect(target[1]).toBe(items(f(v,6n),'set').some(x=>eq(x,u(1))));expect(target[2]).toEqual(u(0));
  }else if(kind===2n){const p=items(rows.find(a=>eq(a[0],signed(at))&&eq(a[2],INTERFERENCE_SOURCE))![3],'list');expect(p[2]).toEqual(u(8n+2n*uint(f(v,3n))));expect(p[3]).toEqual(f(v,8n));expect(p[4]).toBe(items(f(v,10n),'set').some(x=>eq(x,u(1))));expect(p[5]).toEqual(f(v,9n));}
 }return b;
}
function retained(r:Run,name:Boundary,attempts:ReturnType<typeof live>[]){
 const h=history(r);expect(h).toHaveLength(name.startsWith('withheld')?0:3);
 for(const v of h){const o=interferenceObservation(v,taskB,EXTENDED_TIME_LIMIT);if(name==='noOpportunity'){expect(o.outcome).toBeUndefined();expect(o.route).toBeNull();}else{expect(o.outcome).toBeDefined();expect(o.route).toBe(1n);}}
 for(const a of attempts){expect(outputs(list(view(r).out),425n)).toContainEqual(a.intent);expect(outputs(list(view(r).out),426n)).toContainEqual(a.expression);}
}
function safeEqual(a:Run,b:Run){
 bytes(view(a).snapshot.state,view(b).snapshot.state);
 const safe=(r:Run)=>enc(list(view(r).out.filter(v=>!(typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(OBSTRUCTION_RESULT))))));
 bytes(safe(a),safe(b));bytes(a.decisionHistory(),b.decisionHistory());bytes(a.decisionPresentation(),b.decisionPresentation());expect(list(view(a).traces.flatMap(t=>items(f(t,14n),'list')))).toEqual(list(view(b).traces.flatMap(t=>items(f(t,14n),'list'))));
}
async function pair(left:Boundary,right:Boundary,privacy:boolean){
 const bs=[correspondence(left),correspondence(right)];bytes(bs[0].s.registry,bs[1].s.registry);bytes(bs[0].d.initialState,bs[1].d.initialState);bytes(bs[0].d.runSeed,bs[1].d.runSeed);
 const m=await prepareCharacterModel(bs[0].s),rs=await Promise.all(bs.map(b=>createCharacterRun(m,b.d))),frames:Frame[][]=[[],[]],attempts:ReturnType<typeof live>[][]=[[],[]],names=[left,right];
 const action=(await compileCharacterModel(bs[0].s)).strategy!.find(s=>eq(s.task,taskB))!.plans[1].actionId;for(const r of rs)actions.set(r,action);
 // One scheduler runs at a time; paired comparison covers each complete instant.
 for(let n=0;;n++){expect(n).toBeLessThan(64);const more=await next(rs[0]);expect(await next(rs[1])).toBe(more);if(privacy)safeEqual(rs[0],rs[1]);if(!more)break;
  const at=Number(view(rs[0]).snapshot.clock);expect(view(rs[1]).snapshot.clock).toBe(BigInt(at));
  for(let i=0;i<2;i++){if([10,12,14].includes(at))attempts[i].push(live(rs[i],names[i],at));if([10,12,14,16,17].includes(at))appraisal(rs[i],names[i],at);if(at>=10&&at<=17)frames[i].push(frame(rs[i]));}
 }
 for(let i=0;i<2;i++){expect(view(rs[i]).snapshot.clock).toBe(101n);expect(attempts[i]).toHaveLength(3);expect(frames[i]).toHaveLength(8);retained(rs[i],names[i],attempts[i]);await original(frames[i],names[i]);}
 console.info('M203 '+left+'/'+right+' PASS three actual failed attempts; later known/Unknown appraisal and original four-law diagnostics; '+(privacy?'whole safe state/output/history/presentation/draw equality every settled instant; ':'')+'full101.');
}
it('M203 clear versus blocked retains known zero versus one',async()=>{await pair('clear','blocked',false);},570000);
it('M203 hidden causes preserve the complete permitted history',async()=>{await pair('main','hidden',true);},570000);
it('M203 changed denied reports preserve Unknown across three attempts',async()=>{await pair('withheld','withheldChanged',true);},570000);
function snapshot(a:ReturnType<Run['snapshot']>,b:ReturnType<Run['snapshot']>){const {state:as,outputs:ao,trace:at,...am}=a,{state:bs,outputs:bo,trace:bt,...bm}=b;expect(am).toEqual(bm);bytes(as,bs);bytes(ao,bo);bytes(at,bt);}
function exact(a:Run,b:Run){snapshot(view(a).snapshot,view(b).snapshot);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());bytes(a.decisionHistory(),b.decisionHistory());bytes(a.decisionPresentation(),b.decisionPresentation());}
it('M203 absent observed opportunities stay unbound through rollback and full continuation',async()=>{
 const b=correspondence('noOpportunity'),m=await prepareCharacterModel(b.s),a=await createCharacterRun(m,b.d),repeat=await createCharacterRun(m,b.d),frames:Frame[]=[],attempts:ReturnType<typeof live>[]=[];
 const action=(await compileCharacterModel(b.s)).strategy!.find(s=>eq(s.task,taskB))!.plans[1].actionId;actions.set(a,action);actions.set(repeat,action);
 for(let t=10;t<=12;t++){await through(a,BigInt(t));await through(repeat,BigInt(t));exact(a,repeat);if(t!==11){attempts.push(live(repeat,'noOpportunity',t));appraisal(repeat,'noOpportunity',t);}frames.push(frame(repeat));}
 const saved=a.save(),before=view(a).snapshot;let reached=false;const originalTrace=traceModule.traceRecordValue;
 const spy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(v=>{const row=originalTrace(v);if(eq(v.event.eventTypeId,INTERFERENCE_LEARN)&&v.event.dueAt===13n){reached=true;throw Error('M203 unbound140');}return row;});
 try{await expect(next(a)).rejects.toThrow('M203 unbound140');expect(reached).toBe(true);snapshot({...a.snapshot(),status:before.status},before);}finally{spy.mockRestore();}
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:saved});exact(repeat,restored);
 for(let n=0;;n++){expect(n).toBeLessThan(64);const more=await next(repeat);expect(await next(restored)).toBe(more);exact(repeat,restored);if(!more)break;const at=Number(view(repeat).snapshot.clock);
  if(at===14)attempts.push(live(repeat,'noOpportunity',at));if([14,16,17].includes(at))appraisal(repeat,'noOpportunity',at);if(at>=13&&at<=17)frames.push(frame(repeat));
  expect(view(repeat).state.read(outcomePath(taskB)).presence).toBe(false);
 }
 expect(attempts).toHaveLength(3);expect(frames).toHaveLength(8);retained(repeat,'noOpportunity',attempts);await original(frames,'noOpportunity');expect(view(repeat).snapshot.clock).toBe(101n);
 console.info('M203 NO OPPORTUNITY PASS three actual failures/three received unbound reports, zero eligible episodes/Unknown; no invented outcome; repeat/save12/reached13 rollback/recovery all later full bytes101; original four laws agree.');
},570000);
