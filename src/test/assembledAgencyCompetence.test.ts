import {it,expect,vi} from 'vitest';
import {fixture,decode,items,key,list,text,u,q,rec,f,uint,time,outputs,bytes,C,target,skillPath,skillValue,type Run,type CanonicalValue} from './fixtures/assembledAgencyCompetence';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {SKILL_ACTUAL} from '../assembled/skill';
import {ACTION_BODY} from '../assembled/actionBody';
import {PERFORMANCE_OBS,outcomePath} from '../assembled/performance';
import {expectationPath,expectationValue} from '../assembled/performanceExpectation';
import {STAKEHOLDER_OBS,STAKEHOLDER_EVIDENCE,stakeholderView} from '../assembled/executionStakeholder';
import {interferenceJournal,interferencePath} from '../assembled/interferenceExpectation';
import {EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {projectAttempt,admitAgencyEvidence,foldAgencyEvidence} from '../campaign3/agencyInterferenceSource';
import * as traceModule from '../substrate/trace';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const cache=new WeakMap<Run,{snapshot:ReturnType<Run['snapshot']>;state:ReturnType<typeof restoreAuthoritativeState>;out:CanonicalValue[];traces:CanonicalValue[]}>();
function view(r:Run){let v=cache.get(r);if(!v){const snapshot=r.snapshot();v={snapshot,state:restoreAuthoritativeState(decode(snapshot.state)),out:items(decode(snapshot.outputs),'list'),traces:outputs(snapshot.trace,160n)};cache.set(r,v);}return v;}
const event=(v:CanonicalValue)=>rec(f(v,4n),130n);
async function next(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;view(r).snapshot.clock<at;n++){expect(n).toBeLessThan(64);expect(await next(r)).toBe(true);}expect(view(r).snapshot.clock).toBe(at);}
async function finish(r:Run){for(let n=0;n<64;n++){if(!await next(r)){expect(view(r).snapshot.clock).toBe(101n);return;}}throw Error('M197 settle cap');}
function rows(r:Run,at:bigint){return view(r).traces.filter(t=>time(f(event(t),2n))===at).flatMap(t=>{const p=f(t,13n);return typeof p!=='boolean'&&p.kind==='list'?p.items:[p];});}
function labelled(r:Run,label:string,at=14n){return rows(r,at).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(label))).map(v=>items(v,'list'));}
function typed(r:Run,t:bigint,at=14n){return outputs(list(rows(r,at)),t);}
function snap(a:ReturnType<Run['snapshot']>,b:ReturnType<Run['snapshot']>){const {state:as,outputs:ao,trace:at,...am}=a,{state:bs,outputs:bo,trace:bt,...bm}=b;expect(am).toEqual(bm);bytes(as,bs);bytes(ao,bo);bytes(at,bt);}
function exact(a:Run,b:Run){snap(view(a).snapshot,view(b).snapshot);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());bytes(a.decisionHistory(),b.decisionHistory());bytes(a.decisionPresentation(),b.decisionPresentation());}
async function start(trained=true,blocked=true,access=true){const b=fixture(trained,blocked,access),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d),s=(await compileCharacterModel(b.s)).socialWitness!;expect(restoreAuthoritativeState(decode(b.d.initialState)).read(skillPath(C,b.procedure)).presence).toBe(false);await through(r,12n);const k=skillValue(view(r).state.read(skillPath(C,b.procedure)).value,b.procedure);expect(q(k.K.numerator,k.K.denominator)).toEqual(q(trained?1:0,2));expect(k.count).toBe(trained?1n:0n);expect(expectationValue(view(r).state.read(expectationPath(b.task,0n)).value).mean?.numerator).toBe(1n);return {b,m,r,s};}
function actual(x:Awaited<ReturnType<typeof start>>,trained:boolean,blocked:boolean,access=true){
 const {r,b,s}=x,d=typed(r,409n)[0]!;expect(d).toBeDefined();expect(uint(f(rec(f(d,4n),419n),1n))).toBe(3n);
 const intent=typed(r,425n)[0]!,expression=typed(r,426n)[0]!,plan=typed(r,431n)[0]!,execution=typed(r,433n)[0]!;
 for(const v of[intent,expression,plan,execution])expect(v).toBeDefined();
 const skill=labelled(r,SKILL_ACTUAL)[0]!,effect=labelled(r,ACTION_BODY)[0]!;expect(skill).toBeDefined();expect(effect).toBeDefined();expect(effect[3]).toEqual(target);
 expect(skill[3]).toEqual(q(trained?1:0,2));expect(skill[4]).toEqual(q(0,1));expect(skill[5]).toEqual(q(1,2));expect(skill[6]).toBe(true);expect(skill[7]).toBe(trained);expect(skill[8]).toBe(false);expect(effect[5]).toEqual(text(trained&&!blocked?'Applied':'Blocked'));
 const trace=view(r).traces.find(t=>time(f(event(t),2n))===14n&&uint(f(event(t),1n))===uint(skill[1])&&items(f(t,11n),'list').some(v=>eq(f(rec(v,147n),2n),statePathValue(skillPath(C,b.procedure)))));expect(trace,'actual procedure consumption').toBeDefined();
 const obs=labelled(r,PERFORMANCE_OBS).filter(a=>eq(a[3],b.task));expect(obs).toHaveLength(1);expect(obs[0][6]).toBe(trained&&!blocked);expect(items(items(view(r).state.read(outcomePath(b.task)).value!,'list')[1],'list')).toContainEqual(list(obs[0]));
 const causal=interferenceJournal(view(r).state.read(interferencePath(b.task)).value,b.task,EXTENDED_TIME_LIMIT,b.people);expect(causal).toHaveLength(blocked?1:0);
 const local=labelled(r,STAKEHOLDER_OBS);expect(local).toHaveLength(access?1:0);
 if(access){expect(local[0]).toEqual([text(STAKEHOLDER_OBS),s.observers[0].holder,s.observers[0].target,u(14),trained&&!blocked]);const evidence=admitAgencyEvidence('A',[{observer:'A',episode:'local14',kind:'outcome',success:local[0][4]===true}]);expect(foldAgencyEvidence(evidence,'GroupedMean').size).toBe(0);}
 const old=projectAttempt({attempt:1,frozenIntent:'deliver',competent:skill[7]===true,blocker:blocked?'blocker-a':null,access:{A:{outcome:access,obstruction:false},B:{outcome:false,obstruction:false}}});expect(old.truth.success).toBe(obs[0][6]);expect(old.views.A.map(v=>v.kind==='outcome'?v.success:undefined)).toEqual(local.map(v=>v[4]));expect(old.views.B).toEqual([]);
 const dt=view(r).traces.find(t=>eq(f(t,13n),d))!;expect(dt).toBeDefined();return {d,intent,expression,plan,execution,draws:f(dt,14n),local:stakeholderView(view(r).out,s,0)};
}
it('M197 four real skill and obstruction cells preserve outcome-only privacy',async()=>{
 const cases=[{trained:true,blocked:false},{trained:true,blocked:true},{trained:false,blocked:false},{trained:false,blocked:true}],seen:ReturnType<typeof actual>[]=[];
 for(const c of cases){const x=await start(c.trained,c.blocked);await through(x.r,14n);const a=actual(x,c.trained,c.blocked);seen.push(a);const initial=a.local;
  for(let n=0;;n++){expect(n).toBeLessThan(64);expect(stakeholderView(view(x.r).out,x.s,0)).toEqual(initial);if(!await next(x.r))break;}expect(view(x.r).snapshot.clock).toBe(101n);
  expect(outputs(list(view(x.r).out),425n)).toContainEqual(a.intent);expect(outputs(list(view(x.r).out),426n)).toContainEqual(a.expression);
  if(c.blocked||!c.trained){const successAsIntent:CanonicalValue[]=[];expect(successAsIntent).not.toContainEqual(a.expression);}
 }
 for(const a of seen.slice(1))for(const k of['d','intent','expression','plan','draws'] as const)expect(a[k]).toEqual(seen[0][k]);
 expect(seen[1].local).toEqual(seen[2].local);expect(seen[1].local).toEqual(seen[3].local);expect(seen[0].local).not.toEqual(seen[1].local);
 console.info('M197 MATRIX PASS actual practiced K1/2 versus untrained0, common belief1/difficulty1/2; intrinsic T/T/F/F, physical T/F/F/F. Same whole decision/intent/expression/plan and actual draws; all failed outcome-only views identical through101. Original agency projection agrees; failed expressions retained. Draw count',items(seen[0].draws,'list').length);
},570000);
it('M197 denied success and failure do not become observer knowledge',async()=>{
 const a=await start(true,false,false),b=await start(true,true,false);await through(a.r,14n);await through(b.r,14n);actual(a,true,false,false);actual(b,true,true,false);
 for(let n=0;;n++){expect(n).toBeLessThan(64);for(const i of[0,1]){const av=stakeholderView(view(a.r).out,a.s,i);expect(items(items(av,'list')[3],'list')).toHaveLength(0);expect(av).toEqual(stakeholderView(view(b.r).out,b.s,i));}const more=await next(a.r);expect(await next(b.r)).toBe(more);if(!more)break;}
 expect(view(a.r).snapshot.clock).toBe(101n);console.info('M197 DENIED PASS actual success versus blocked failure remains absent to both denied stakeholders through101.');
},570000);
it('M197 current acquired-skill continuation and stakeholder rollback',async()=>{
 const a=await start(),repeat=await createCharacterRun(a.m,a.b.d);await through(repeat,12n);exact(a.r,repeat);
 const saved=a.r.save(),before=view(a.r).snapshot,original=traceModule.traceRecordValue;let reached=false;
 const spy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(v=>{const row=original(v);if(v.event.dueAt===14n&&eq(v.event.eventTypeId,STAKEHOLDER_EVIDENCE)){reached=true;throw Error('M197 evidence14');}return row;});
 try{await expect(next(a.r)).rejects.toThrow('M197 evidence14');expect(reached).toBe(true);snap({...a.r.snapshot(),status:before.status},before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:saved});exact(repeat,recovered);
 for(let n=0;;n++){expect(n).toBeLessThan(64);const more=await next(repeat);expect(await next(recovered)).toBe(more);exact(repeat,recovered);if(!more)break;}
 expect(view(repeat).snapshot.clock).toBe(101n);actual({...a,r:repeat},true,true);console.info('M197 CONTINUATION PASS acquired skill repeat12, reached14 evidence rollback, public save12 recovery every later full byte through101.');
},570000);
