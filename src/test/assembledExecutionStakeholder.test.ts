import {it,expect,vi} from 'vitest';
import {fixture,create,taskB,capture,decode,items,key,enc,list,text,u,rec,f,uint,outputs,bytes,through,finish,C,sid,type Run,type CanonicalValue} from './fixtures/assembledExecutionStakeholder';
import {compileCharacterModel,EXECUTION_OPPORTUNITY_RULES,EXECUTION_OPPORTUNITY_REGISTRY} from '../assembled/model';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {STAKEHOLDER,STAKEHOLDER_OBS,STAKEHOLDER_EVID,STAKEHOLDER_EVIDENCE,stakeholderView,createExecutionStakeholder} from '../assembled/executionStakeholder';
import {OBSTRUCTION_SOURCE,obstructionSource} from '../assembled/externalObstruction';
import {PERFORMANCE_OBS,PERFORMANCE_OBSERVE} from '../assembled/performance';
import {ACTION_BODY} from '../assembled/actionBody';
import {SKILL_ACTUAL} from '../assembled/skill';
import {interferencePath,interferenceJournal} from '../assembled/interferenceExpectation';
import {EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
import {restoreAuthoritativeState} from '../substrate/state';
import {foldAgencyEvidence,admitAgencyEvidence,type Observation} from '../campaign3/agencyInterferenceSource';
import * as traceModule from '../substrate/trace';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const all=(r:Run)=>items(decode(r.snapshot().outputs),'list');
const labelled=(r:Run,t:string)=>all(r).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(t))).map(v=>items(v,'list'));
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const journal=(r:Run,b:ReturnType<typeof fixture>)=>interferenceJournal(state(r).read(interferencePath(taskB)).value,taskB,EXTENDED_TIME_LIMIT,b.people);
function snap(a:ReturnType<Run['snapshot']>,b:ReturnType<Run['snapshot']>){const {state:as,outputs:ao,trace:at,...am}=a,{state:bs,outputs:bo,trace:bt,...bm}=b;expect(am).toEqual(bm);bytes(as,bs);bytes(ao,bo);bytes(at,bt);}
function exact(a:Run,b:Run){snap(a.snapshot(),b.snapshot());bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());bytes(a.decisionHistory(),b.decisionHistory());bytes(a.decisionPresentation(),b.decisionPresentation());}
function live(r:Run,success=false,outcome=true){
 const p=capture(r),effect=labelled(r,ACTION_BODY).find(a=>eq(a[1],f(rec(p.execution!,433n),1n)))!;expect(effect).toBeDefined();expect(effect[5]).toEqual(text(success?'Applied':'Blocked'));
 const skill=labelled(r,SKILL_ACTUAL).find(a=>eq(a[2],effect[1]))!;expect(skill).toBeDefined();expect(skill[6]).toBe(true);expect(skill[7]).toBe(true);
 const observed=labelled(r,PERFORMANCE_OBS).filter(a=>uint(a[2])===10n&&eq(a[3],taskB));expect(observed).toHaveLength(outcome?1:0);if(outcome){expect(observed[0][4]).toEqual(u(1));expect(observed[0][6]).toBe(success);}
 expect(p.transcript.length).toBeGreaterThan(0);return p;
}
it('M196 actual failure reaches only permitted stakeholder without private cause',async()=>{
 const a=await create(),b=await create(fixture({blocker:2})),s=(await compileCharacterModel(a.b.s)).socialWitness!,pa=live(a.run),pb=live(b.run);
 for(const k of ['d','intent','expression','execution','transcript'] as const)expect(pa[k]).toEqual(pb[k]);
 expect(items(journal(a.run,a.b)[0],'list')[7]).toEqual(a.b.people[0]);expect(items(journal(b.run,b.b)[0],'list')[7]).toEqual(b.b.people[1]);
 const expected=list([text(STAKEHOLDER_OBS),s.observers[0].holder,s.observers[0].target,u(10),false]);
 expect(labelled(a.run,STAKEHOLDER_OBS)).toEqual([items(expected,'list')]);expect(labelled(a.run,STAKEHOLDER_EVID)).toEqual([[text(STAKEHOLDER_EVID),...items(expected,'list').slice(1)]]);
 const local=stakeholderView(all(a.run),s,0);expect(items(items(stakeholderView(all(a.run),s,1),'list')[3],'list')).toHaveLength(0);
 const observed:Observation[]=[{observer:'A',episode:'local10',kind:'outcome',success:items(expected,'list')[4]===true}];
 const admitted=admitAgencyEvidence('A',observed);expect(admitted).toEqual([]);for(const law of ['GroupedMean','LastClaim'] as const)expect(foldAgencyEvidence(admitted,law).size).toBe(0);
 const omniscient=admitAgencyEvidence('A',[...observed,{observer:'A',episode:'local10',kind:'obstruction',actor:key(a.b.people[0]),source:'illegal-private-cause'}]);expect(foldAgencyEvidence(omniscient,'GroupedMean').size).toBe(1);
 const traces=outputs(a.run.snapshot().trace,160n),ot=traces.find(t=>eq(f(t,13n),list([expected])))!,et=traces.find(t=>eq(f(rec(f(t,4n),130n),5n),STAKEHOLDER_EVIDENCE))!;expect(ot).toBeDefined();expect(et).toBeDefined();expect(uint(f(rec(f(ot,4n),130n),3n))).toBe(120n);expect(uint(f(rec(f(et,4n),130n),3n))).toBe(130n);expect(items(f(rec(f(et,4n),130n),8n),'list')).toContainEqual(f(rec(f(ot,4n),130n),1n));
 for(let n=0;;n++){expect(n).toBeLessThan(32);expect(stakeholderView(all(a.run),s,0)).toEqual(stakeholderView(all(b.run),s,0));expect(stakeholderView(all(a.run),s,0)).toEqual(local);expect(stakeholderView(all(a.run),s,1)).toEqual(stakeholderView(all(b.run),s,1));const more=await a.run.settleNextInstant();expect(await b.run.settleNextInstant()).toBe(more);if(!more)break;}
 expect(a.run.snapshot().clock).toBe(101n);expect(outputs(a.run.snapshot().outputs,426n)).toContainEqual(pa.expression);
 console.info('M196 CONNECTION PASS actual competent B/route1 failure, identical nonempty draws/frozen intent, main sees different blockers; other stakeholder sees identical outcome-only120/130 throughout101. Original causal folds Unknown; private-reading control differs.');
},570000);
it('M196 independent visibility swapped access and real success',async()=>{
 const swapped=await create(fixture({access:[false,true]})),denied=await create(fixture({access:[false,false]})),ownDenied=await create(fixture({outcome:false})),success=await create(fixture({blocker:0}));
 const s=(await compileCharacterModel(swapped.b.s)).socialWitness!;live(swapped.run);live(denied.run);live(ownDenied.run,false,false);live(success.run,true);
 expect(labelled(swapped.run,STAKEHOLDER_OBS)).toEqual([[text(STAKEHOLDER_OBS),s.observers[1].holder,s.observers[1].target,u(10),false]]);expect(labelled(denied.run,STAKEHOLDER_OBS)).toHaveLength(0);expect(labelled(denied.run,STAKEHOLDER_EVID)).toHaveLength(0);
 expect(labelled(ownDenied.run,STAKEHOLDER_OBS)[0][4]).toBe(false);expect(labelled(success.run,STAKEHOLDER_OBS)[0][4]).toBe(true);
 expect(items(journal(ownDenied.run,ownDenied.b)[0],'list')[6]).toEqual(list([]));expect(journal(success.run,success.b)).toHaveLength(0);
 for(const r of[swapped.run,denied.run,ownDenied.run,success.run]){await finish(r);expect(r.snapshot().clock).toBe(101n);expect(outputs(r.snapshot().trace,160n).filter(t=>eq(f(rec(f(t,4n),130n),5n),STAKEHOLDER_EVIDENCE))).toHaveLength(1);}
 expect(()=>stakeholderView(all(swapped.run),s,2)).toThrow();expect(()=>stakeholderView(all(swapped.run),s,-1)).toThrow();expect(()=>stakeholderView(all(swapped.run),s,0.5)).toThrow();
 console.info('M196 BOUNDARY PASS independent main/passive channels, swapped and denied recipients, real no-block success; fixed evidence event including denied, full101.');
},570000);
it('M196 exact continuation and reached evidence rollback',async()=>{
 const b=fixture(),a=await create(b,9n),repeat=await create(b,9n);exact(a.run,repeat.run);const saved=a.run.save(),before=a.run.snapshot(),original=traceModule.traceRecordValue;let reached=false;
 const spy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(v=>{const row=original(v);if(eq(v.event.eventTypeId,STAKEHOLDER_EVIDENCE)){reached=true;throw Error('M196 evidence130');}return row;});
 try{await expect(a.run.settleNextInstant()).rejects.toThrow('M196 evidence130');expect(reached).toBe(true);snap({...a.run.snapshot(),status:before.status},before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:saved});await through(repeat.run,10n);await through(recovered,10n);live(repeat.run);exact(repeat.run,recovered);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:repeat.run.save()});exact(repeat.run,restored);
 for(let n=0;;n++){expect(n).toBeLessThan(32);const more=await repeat.run.settleNextInstant();for(const r of[recovered,restored]){expect(await r.settleNextInstant()).toBe(more);exact(repeat.run,r);}if(!more)break;}
 expect(repeat.run.snapshot().clock).toBe(101n);console.info('M196 CONTINUATION PASS reached130 rolls back whole instant; repeat9/recovery9/public save10 every later snapshot/save/identity/history/player byte through101.');
},570000);
it('M196 admission guards source and generated evidence',async()=>{
 const b=fixture(),m=await prepareCharacterModel(b.s),compiled=await compileCharacterModel(b.s),rows=items(decode(b.d.orderedInputs),'list'),source=rows.find(v=>eq(items(v,'list')[2],OBSTRUCTION_SOURCE))!,p=items(items(source,'list')[3],'list');
 await expect(createCharacterRun(await prepareCharacterModel({...b.s,rulesVersion:EXECUTION_OPPORTUNITY_RULES,registrySchemaVersion:EXECUTION_OPPORTUNITY_REGISTRY}),b.d)).rejects.toThrow('external obstruction');
 for(const change of[(x:CanonicalValue[])=>{x[4]=text('foreign-task');},(x:CanonicalValue[])=>{x[5]=list([true]);},(x:CanonicalValue[])=>{x[5]=list([true,u(1)]);},(x:CanonicalValue[])=>{x.push(false);}]){const x=[...p];change(x);expect(()=>obstructionSource(list(x),C,b.people,compiled.strategy!.map(r=>r.task),true)).toThrow();}
 const forged=[...items(source,'list')];forged[1]=u(130);forged[2]=STAKEHOLDER_EVIDENCE;forged[3]=list([list([]),list([])]);await expect(createCharacterRun(m,{...b.d,orderedInputs:enc(list([...rows,list(forged)]))})).rejects.toThrow();
 const handler=createExecutionStakeholder(C,compiled.socialWitness!,compiled.modelIdentity.value,compiled.modelIdentity.value);handler.begin(10n);
 const event={eventId:999n,eventSequence:999n,eventTypeId:PERFORMANCE_OBSERVE,dueAt:10n as never,phase:120n,payload:list([text('local-test-action'),false,list([list([taskB,u(1),true,u(0)])]),true]),dependencies:list([]),causalParentEventIds:[]};
 const plan=handler.observe(event,taskB,[true,false]);expect(()=>plan.bind([{...plan.emissions[0],eventId:1000n,eventSequence:1000n,causalParentEventIds:[998n]}])).toThrow('child binding');
 expect(()=>handler.execute({event:{...event,phase:130n,eventTypeId:STAKEHOLDER_EVIDENCE,payload:list([list([]),list([])])},state:restoreAuthoritativeState(decode(b.d.initialState))} as never)).toThrow('unbound generated');expect(()=>handler.prepareCommit()).toThrow('unfinished');handler.close();
 console.info('M196 ADMISSION PASS old version, foreign task, malformed Boolean permissions/shape, forged external evidence and generated parent reject.');
},570000);
