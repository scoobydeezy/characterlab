import {EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
import {it,expect,vi} from 'vitest';
import {fixture,taskA,create,capture,decode,items,key,enc,list,text,signed,u,q,rec,f,uint,outputs,bytes,through,finish,C,sid,type Run,type CanonicalValue} from './fixtures/assembledObstructionWitness';
import {INTERFERENCE_WITNESS,INTERFERENCE_APPRAISAL,INTERFERENCE_OBS,INTERFERENCE_LEARN,INTERFERENCE_SOURCE,interferencePath,interferenceJournal,interferenceObservation,appendInterference,INTERFERENCE_EVIDENCE} from '../assembled/interferenceExpectation';
import {OBSTRUCTION_SOURCE,OBSTRUCTION_RESULT,obstructionSource} from '../assembled/externalObstruction';
import {PERFORMANCE_OBS,outcomePath} from '../assembled/performance';
import {ACTION_BODY} from '../assembled/actionBody';
import {restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterState} from '../assembled/state';
import {KNOWLEDGE_OWNER} from '../assembled/strategy';
import {createCausalExecution} from '../assembled/causalAttribution';
import {compileCharacterModel,EXTERNAL_OBSTRUCTION_RULES,EXTERNAL_OBSTRUCTION_REGISTRY} from '../assembled/model';
import {foldAgencyEvidence,admitAgencyEvidence,type Observation} from '../campaign3/agencyInterferenceSource';
import * as traceModule from '../substrate/trace';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const labelled=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(label))).map(v=>items(v,'list'));
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const journal=(r:Run,people:CanonicalValue[])=>interferenceJournal(state(r).read(interferencePath(taskA)).value,taskA,EXTENDED_TIME_LIMIT,people);
function appraisal(r:Run,at:bigint,value:CanonicalValue){const rows=labelled(r,INTERFERENCE_APPRAISAL).filter(a=>uint(a[1])===at);expect(rows).toHaveLength(1);expect(rows[0][2]).toEqual(taskA);expect(rows[0][6]).toEqual(value);if(items(value,'list').length===0)expect(rows[0][7]).toEqual(list([]));return rows[0];}
function estimate(r:Run,at:bigint,value:CanonicalValue){const rows=labelled(r,INTERFERENCE_APPRAISAL).filter(a=>uint(a[1])===at);expect(rows).toHaveLength(1);expect(rows[0][2]).toEqual(taskA);expect(rows[0][6]).toEqual(value);expect(rows[0][7]).not.toEqual(list([]));return rows[0];}
function live(r:Run){const p=capture(r),o=labelled(r,PERFORMANCE_OBS).filter(a=>uint(a[2])===10n&&eq(a[3],taskA));expect(o,'actual compared task outcome').toHaveLength(1);expect(o[0][6]).toBe(false);expect(o[0][7]).toBe(true);expect(uint(o[0][4])).toBe(0n);const body=labelled(r,ACTION_BODY).find(a=>eq(a[1],f(rec(p.execution!,433n),1n)))!;expect(body[5]).toEqual(text('Blocked'));return {p,o:o[0]};}
function full(a:Run,b:Run){expect(a.snapshot()).toEqual(b.snapshot());bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());bytes(a.decisionHistory(),b.decisionHistory());bytes(a.decisionPresentation(),b.decisionPresentation());}
it('M193 witnessed blocking and later contrary explanation revise actual prior appraisal',async()=>{
 const a=await create(fixture()),b=await create(fixture({seen:false})),x=live(a.run),y=live(b.run);expect(x.p.d).toEqual(y.p.d);expect(x.p.intent).toEqual(y.p.intent);expect(x.p.expression).toEqual(y.p.expression);expect(x.o).toEqual(y.o);
 appraisal(a.run,10n,list([]));appraisal(b.run,10n,list([]));
 const direct=journal(a.run,a.b.people);expect(direct).toHaveLength(1);const d=items(direct[0],'list');expect(d[0]).toEqual(text(INTERFERENCE_WITNESS));expect(d[4]).toEqual(u(0));expect(d[6]).toEqual(list(x.o));expect(d[7]).toEqual(a.b.people[0]);expect(journal(b.run,b.b.people)).toHaveLength(0);
 await through(a.run,12n);await through(b.run,12n);estimate(a.run,12n,q(1,1));appraisal(b.run,12n,list([]));
 await through(a.run,14n);await through(b.run,14n);const pa=estimate(a.run,14n,q(1,2)),pb=estimate(b.run,14n,q(0,1));expect(pa[7]).not.toEqual(pb[7]);expect(pa[8]).toEqual(list(journal(a.run,a.b.people)));
 const current=journal(a.run,a.b.people),observations:Observation[]=current.map(v=>{const r=items(v,'list');return {observer:'A',episode:'visible-attempt10',...(eq(r[0],text(INTERFERENCE_WITNESS))?{kind:'obstruction' as const,source:'direct0',actor:key(r[7])}:{kind:'report' as const,source:'receipt'+uint(r[4]),positive:r[5]===true})};});
 const evidence=admitAgencyEvidence('A',observations),mean=foldAgencyEvidence(evidence,'GroupedMean').get('visible-attempt10')!,last=foldAgencyEvidence(evidence,'LastClaim').get('visible-attempt10')!;
 expect(q(BigInt(mean.numerator),BigInt(mean.denominator))).toEqual(pa[6]);expect(q(BigInt(last.numerator),BigInt(last.denominator))).toEqual(q(0,1));expect(admitAgencyEvidence('A',observations,true)).toEqual([]);
 for(const r of[a.run,b.run]){await finish(r);expect(outputs(r.snapshot().outputs,426n)).toContainEqual(x.p.expression);expect(items(state(r).read(outcomePath(taskA)).value!,'list')[1]).toEqual(list([list(x.o)]));}
 console.info('M193 CONNECTION PASS actual competent failure, same frozen choice; sight gives prior1 vs unknown, later negative report gives1/2 vs0; original GroupedMean/LastClaim/OutcomeOnly discriminate; full101.');
},570000);
it('M193 private blocker identity remains hidden when sight is denied',async()=>{
 const a=await create(fixture({seen:false,blocker:1})),b=await create(fixture({seen:false,blocker:2}));live(a.run);live(b.run);
 const safe=(r:Run)=>list(items(decode(r.snapshot().outputs),'list').filter(v=>!(typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(OBSTRUCTION_RESULT)))));
 for(let n=0;;n++){expect(n).toBeLessThan(32);bytes(a.run.snapshot().state,b.run.snapshot().state);expect(safe(a.run)).toEqual(safe(b.run));bytes(a.run.decisionHistory(),b.run.decisionHistory());bytes(a.run.decisionPresentation(),b.run.decisionPresentation());const more=await a.run.settleNextInstant();expect(await b.run.settleNextInstant()).toBe(more);if(!more)break;}expect(a.run.snapshot().clock).toBe(101n);
 console.info('M193 PRIVACY PASS denied sight/private blocker swap preserves every later state/safe output/history/player through101; no world identity inferred.');
},570000);
it('M193 absent outcome no block denied explanation and repeated receipt keep distinct meanings',async()=>{
 const absent=await create(fixture({outcome:false}));capture(absent.run);const unbound=journal(absent.run,absent.b.people);expect(unbound).toHaveLength(1);expect(items(unbound[0],'list')[6]).toEqual(list([]));await through(absent.run,14n);appraisal(absent.run,14n,list([]));await finish(absent.run);
 const none=await create(fixture({blocker:0}));capture(none.run);expect(journal(none.run,none.b.people)).toHaveLength(0);await finish(none.run);
 const denied=await create(fixture({report:false}));live(denied.run);await through(denied.run,14n);estimate(denied.run,14n,q(1,1));expect(journal(denied.run,denied.b.people)).toHaveLength(1);await finish(denied.run);
 const duplicate=await create(fixture({duplicate:true}));live(duplicate.run);await through(duplicate.run,16n);estimate(duplicate.run,16n,q(1,2));expect(journal(duplicate.run,duplicate.b.people)).toHaveLength(3);await finish(duplicate.run);
 console.info('M193 BOUNDARIES PASS unbound witness never gains an outcome; no-block has no witness; denied explanation not negative; duplicate receipt no added weight; full101.');
},570000);
it('M193 witness knowledge continuation and reached common140 rollback',async()=>{
 const b=fixture(),failed=await create(b,9n),repeat=await create(b,9n),saved=failed.run.save(),before=failed.run.snapshot();let reached=false;const original=traceModule.traceRecordValue;
 const spy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(v=>{const row=original(v);if(eq(v.event.eventTypeId,INTERFERENCE_LEARN)&&v.event.dueAt===10n){reached=true;throw Error('M193 reached witness140');}return row;});
 try{await expect(failed.run.settleNextInstant()).rejects.toThrow('M193 reached witness140');expect(reached).toBe(true);expect({...failed.run.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:saved});await through(repeat.run,10n);await through(recovered,10n);live(repeat.run);full(repeat.run,recovered);
 const direct=journal(repeat.run,b.people)[0],traces=outputs(repeat.run.snapshot().trace,160n),observation=traces.find(t=>eq(f(t,13n),list([direct])))!;expect(observation).toBeDefined();expect(uint(f(rec(f(observation,4n),130n),3n))).toBe(120n);
 const learned=traces.find(t=>eq(f(rec(f(t,4n),130n),5n),INTERFERENCE_LEARN))!;expect(learned).toBeDefined();expect(uint(f(rec(f(learned,4n),130n),3n))).toBe(140n);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:repeat.run.save()});full(repeat.run,restored);
 for(let n=0;;n++){expect(n).toBeLessThan(32);const more=await repeat.run.settleNextInstant();for(const r of[recovered,restored]){expect(await r.settleNextInstant()).toBe(more);full(repeat.run,r);}if(!more)break;}
 expect(repeat.run.snapshot().clock).toBe(101n);const pa=estimate(repeat.run,14n,q(1,2)),appraisalTrace=outputs(repeat.run.snapshot().trace,160n).find(t=>eq(f(t,13n),list(pa)))!;expect(appraisalTrace).toBeDefined();expect(items(f(appraisalTrace,11n),'list')).toHaveLength(1);expect(uint(f(rec(f(appraisalTrace,4n),130n),3n))).toBe(50n);console.info('M193 CONTINUATION PASS reached witness140 rollback; recovery/public save10 exact all later state/output/trace/save/identity/history/player through101.');
},570000);
it('M193 source and witness grammar reject foreign or manufactured evidence',async()=>{
 const b=fixture(),model=await prepareCharacterModel(b.s),rows=items(decode(b.d.orderedInputs),'list'),source=rows.find(v=>eq(items(v,'list')[2],OBSTRUCTION_SOURCE))!;
 const alter=(f:(a:CanonicalValue[])=>void)=>{const a=[...items(source,'list')];f(a);return {...b.d,orderedInputs:enc(list(rows.map(v=>v===source?list(a):v)))};};
 await expect(createCharacterRun(await prepareCharacterModel({...b.s,rulesVersion:EXTERNAL_OBSTRUCTION_RULES,registrySchemaVersion:EXTERNAL_OBSTRUCTION_REGISTRY}),b.d)).rejects.toThrow('external obstruction');
 await expect(createCharacterRun(model,alter(a=>{const s=items(a[3],'list');a[3]=list([...s.slice(0,3),list([text('foreign task')])]);}))).rejects.toThrow('witness task');
 const report=rows.find(v=>eq(items(v,'list')[2],INTERFERENCE_SOURCE))!,same=[...items(report,'list')];same[0]=signed(10);const payload=[...items(same[3],'list')];payload[2]=u(9);same[3]=list(payload);
 await expect(createCharacterRun(model,{...b.d,orderedInputs:enc(list([...rows,list(same)]))})).rejects.toThrow('competing causal report');
 const v=list([text(INTERFERENCE_WITNESS),u(10),taskA,u(10),u(0),true,list([]),b.people[0]]);
 expect(()=>interferenceObservation(v,taskA)).toThrow('observation');
 for(const change of[(a:CanonicalValue[])=>{a[7]=text('foreign actor');},(a:CanonicalValue[])=>{a[4]=u(1);},(a:CanonicalValue[])=>{a[3]=u(9);},(a:CanonicalValue[])=>{a[5]=false;}]){const a=[...items(v,'list')];change(a);expect(()=>interferenceObservation(list(a),taskA,EXTENDED_TIME_LIMIT,b.people)).toThrow('observation');}
 const compiled=await compileCharacterModel(b.s),component=await compileCharacterState(compiled),initial=component.initialState(b.d.initialState),path=interferencePath(taskA),value=appendInterference(undefined,v,taskA,EXTENDED_TIME_LIMIT,b.people),scope={writableRoots:[1000n],targetPaths:[path]},patch={operations:[{kind:'set' as const,path,expected:{presence:false as const},newValue:value}]};
 expect(()=>component.stateModel.applyPatch(initial,patch,sid(1025,'foreign writer'),scope)).toThrow();const learned=component.stateModel.applyPatch(initial,patch,KNOWLEDGE_OWNER,scope).state;expect(()=>component.initialState(enc(learned.canonicalValue()))).toThrow('initial strategy');
 const action=compiled.strategy!.find(r=>eq(r.task,taskA))!.plans[0].actionId,fake=list([text(PERFORMANCE_OBS),{kind:'typedIdentifier' as const,namespaceId:1164n,payload:u(777)},u(10),taskA,u(0),action,false,true]),forged=[...items(v,'list')];forged[6]=fake;
 expect(()=>component.stateModel.applyPatch(initial,{operations:[{...patch.operations[0],newValue:appendInterference(undefined,list(forged),taskA,EXTENDED_TIME_LIMIT,b.people)}]},KNOWLEDGE_OWNER,scope)).toThrow('original support');
 await expect(createCharacterRun(model,{...b.d,orderedInputs:enc(list([...rows,list([signed(10),u(130),INTERFERENCE_EVIDENCE,v,list([])])]))})).rejects.toThrow();
 const handler=createCausalExecution(C,compiled.strategy!,component.stateModel,[],compiled.modelIdentity.value,compiled.modelIdentity.value,true,true,EXTENDED_TIME_LIMIT,b.people);handler.begin(10n);
 const parent={eventId:999n,eventSequence:999n,eventTypeId:sid(1001,'event/assembled-performance-observe'),dueAt:10n as never,phase:120n,payload:list([action,false,list([list([taskA,u(0),true,u(0)])]),true]),dependencies:list([]),causalParentEventIds:[]};
 const plan=handler.observeObstruction(parent,[fake],{task:taskA,blocker:b.people[0]})!;expect(()=>plan.bind([{...plan.emissions[0],phase:140n,eventId:1000n,eventSequence:1000n,causalParentEventIds:[999n]}])).toThrow('witness child association');
 expect(()=>handler.prepare([{...parent,phase:140n,eventTypeId:INTERFERENCE_LEARN,payload:v}],initial)).toThrow('unbound generated');handler.close();
 console.info('M193 ADMISSION PASS old source version, foreign task/actor, same-instant competing report, direct source identity/time/polarity, generated child, learned S0, sole owner and fabricated support reject.');
},570000);
