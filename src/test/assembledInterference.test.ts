import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {routeExpectation,interferencePath,interferenceJournal,interferenceObservation,appendInterference,INTERFERENCE_OBS,INTERFERENCE_APPRAISAL,INTERFERENCE_SOURCE,INTERFERENCE_CONTEXT,INTERFERENCE_LEARN,INTERFERENCE_VERSION,type Episode} from '../assembled/interferenceExpectation';
import {createCausalExecution} from '../assembled/causalAttribution';
import {KNOWLEDGE_OWNER} from '../assembled/strategy';
import {outcomePath,PERFORMANCE_SETTING} from '../assembled/performance';
import {SKILL_ACTUAL,sid} from '../assembled/skill';
import {BODY_DELIVERY} from '../assembled/body';
import {createInterferenceExpectationRun,LAWS} from '../campaign3/interferenceExpectation';
import {interferenceSources,interferenceFrames} from './interferenceExpectationFixtures';
import {decodeAgency} from '../campaign3/agencyCodecs';
import {OBSERVERS} from '../campaign3/agencyModel';
import {list,text,unsigned,signed,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
import {source,data,task,decode,items,key,enc,type Options} from './fixtures/assembledInterference';
import {source as previousSource} from './fixtures/assembledCausalAttribution';
import {outputs,through,signedValue,type Run} from './fixtures/assembledComparison';
import {workLimit} from './fixtures/assembledCharacter';
import {C} from './fixtures/campaign2Cognitive';
const reports=(run:Run,label=INTERFERENCE_APPRAISAL)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const exact=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const str=(v:{numerator:bigint;denominator:bigint}|undefined)=>v?v.numerator+'/'+v.denominator:null;
it('math: all original thirteen sources and four laws preserve prior episode expectation and appraisal',async()=>{
 let checked=0;
 for(const name of Object.keys(interferenceSources()) as (keyof ReturnType<typeof interferenceSources>)[]){
  const frames=await interferenceFrames(name);
  for(const law of LAWS){
   const original=createInterferenceExpectationRun(law,frames),episodes=new Map<string,Episode>(),seen=new Set<string>();
   for(const frame of frames){
    const j=routeExpectation([...episodes.values()],frame.context,frame.goal,law);await original.step();const old=original.snapshot().rows.at(-1)!;
    expect({eligible:j.eligible,expectation:str(j.estimate),affect:j.affect.status==='Known'?j.affect.coordinates.map(str):null}).toEqual({eligible:old.eligible,expectation:old.expectation,affect:old.affect});
    for(const v of items(decodeAgency(frame.view),'list')){
     if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==975n)continue;
     expect(f(v,2n)).toEqual(OBSERVERS[0]);const identity=key(f(v,1n));if(seen.has(identity))continue;seen.add(identity);
     const episode=key(f(v,4n)),kind=uint(f(v,5n)),old=episodes.get(episode);
     if(kind===1n&&!old)episodes.set(episode,{context:frame.context,support:[]});
     if(kind!==1n&&old&&law!=='NoLearning')episodes.set(episode,{...old,support:[...old.support,{source:key(f(v,7n)),positive:f(v,6n)===true}]});
    }checked++;
   }
  }
 }
 expect(checked).toBe(416);console.info('M36 original13 sources x4 laws x8 prefixes =416 exact prior expectation/appraisal comparisons');
},500000);
it('connection: two actual attempts become one sample each and change later appraisal',async()=>{
 const m=await prepareCharacterModel(source()),a=await createCharacterRun(m,data()),b=await createCharacterRun(m,data({positive:true})),zero=await createCharacterRun(m,data({goal:0}));
 await through(a,3n);const intent=outputs(a.snapshot().outputs,425n)[0],old=reports(a)[0];expect(intent).toBeDefined();expect(old[6]).toEqual(list([]));
 await through(a,7n);await through(b,7n);await through(zero,7n);
 const aa=reports(a),bb=reports(b),zz=reports(zero);
 expect(aa.map(v=>v[6])).toEqual([list([]),q(1,1),q(1,2)]);expect(bb.map(v=>v[6])).toEqual([list([]),q(1,1),q(1,1)]);
 expect(aa.map(v=>v[5])).toEqual([0,1,2].map(unsigned));expect(bb.map(v=>v[5])).toEqual([0,1,2].map(unsigned));expect(aa[2][7]).toEqual(list([q(1,2),q(1,2)]));expect(zz.map(v=>v[6])).toEqual(aa.map(v=>v[6]));expect(zz[2][7]).toEqual(list([q(0,1),q(0,1)]));
 expect(state(a).read(interferencePath(task()))).toEqual(state(zero).read(interferencePath(task())));expect(aa[0]).toEqual(old);expect(outputs(a.snapshot().outputs,425n)[0]).toEqual(intent);
 for(const branch of [a,b])for(const v of interferenceJournal(state(branch).read(interferencePath(task())).value,task())){const o=interferenceObservation(v,task());expect(o.outcome).toBeDefined();expect(o.route).toBe(0n);expect(items(items(state(branch).read(outcomePath(task())).value!,'list')[1],'list')).toContainEqual(o.outcome);}
 const trace=outputs(a.snapshot().trace,160n).filter(v=>key(f(v,6n))===key(text(INTERFERENCE_VERSION)));
 expect(trace.filter(v=>key(f(rec(f(v,4n),130n),5n))===key(sid(1001,'event/task-appraisal')))).toHaveLength(3);
 for(const v of trace.filter(v=>[14n,50n].includes(uint(f(rec(f(v,4n),130n),3n)))))expect(items(f(v,11n),'list')).toHaveLength(1);
 console.info('M36 actual3/5 outcomes, direct4/6 reports -> appraisal7 half versus one; goal0 preserves expectation; exact original support/read joins');
},350000);
it('privacy: hidden physical outcomes and denied changed reports do not alter the admitted expectation',async()=>{
 const m=await prepareCharacterModel(source()),a=await createCharacterRun(m,data({difficulty:q(0,1)})),b=await createCharacterRun(m,data({difficulty:q(1,2)})),denied=await createCharacterRun(m,data({denied:true})),changed=await createCharacterRun(m,data({denied:true,changed:true,positive:true}));
 for(const r of [a,b,denied,changed])await through(r,5n);
 expect(reports(a,SKILL_ACTUAL)[0][7]).toBe(true);expect(reports(b,SKILL_ACTUAL)[0][7]).toBe(false);expect(reports(a)).toEqual(reports(b));expect(state(a).read(interferencePath(task()))).toEqual(state(b).read(interferencePath(task())));
 expect(reports(denied)).toEqual(reports(changed));expect(reports(denied)[1][6]).toEqual(list([]));expect(state(denied).read(interferencePath(task())).presence).toBe(false);expect(reports(denied,INTERFERENCE_OBS)).toHaveLength(0);console.info('M36 hidden physical difference and denied polarity invariance; latent diagnostics do not create direct support');
},300000);
it('gates: missing opportunity, duplicate source, other or absent context and current evidence',async()=>{
 const m=await prepareCharacterModel(source());
 for(const o of [{missing:true},{duplicate:true},{route:1},{route:null},{current:true}] as Options[]){
  const r=await createCharacterRun(m,data(o));await through(r,o.missing?5n:7n);const last=reports(r).at(-1)!;
  expect(last[6]).toEqual(o.missing||o.route!==undefined?list([]):q(1,1));
  expect(last[5]).toEqual(unsigned(o.missing||o.route!==undefined?0:1));
  if(o.missing){const rows=interferenceJournal(state(r).read(interferencePath(task())).value,task());expect(interferenceObservation(rows[0],task()).outcome).toBeUndefined();expect(rows).toHaveLength(1);}
  if(o.current){expect(reports(r,INTERFERENCE_OBS)).toHaveLength(2);expect(items(last[8],'list')).toHaveLength(1);expect(interferenceJournal(state(r).read(interferencePath(task())).value,task())).toHaveLength(2);}
 }
 console.info('M36 missing outcome stays unbound; duplicate first source wins; route/absence scopes; current14 report waits until140');
},400000);
it('persistence: exact repeat3 and restore5 through10',async()=>{
 const s=source(),d=data(),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,3n);await through(b,3n);exact(a,b);await through(a,5n);
 const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);while(a.snapshot().clock<10n){expect(await a.settleNextInstant()).toBe(await restored.settleNextInstant());exact(a,restored);}expect(await a.settleNextInstant()).toBe(false);expect(await restored.settleNextInstant()).toBe(false);exact(a,restored);console.info('M36 repeat3 and every restored settled state/output/trace/save5..10 exact');
},350000);
it('rollback: late shared instant preserves the whole prior character and random ledger',async()=>{
 const s=source(),d=data({current:true}),fault={...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),...Array.from({length:16},()=>list([signed(7),unsigned(110),BODY_DELIVERY,list([C,q(0,1)]),list([])]))]))},oracle=await createCharacterRun(await prepareCharacterModel(s),fault);await through(oracle,7n);
 const counts=new Map<bigint,Set<string>>();for(const t of outputs(oracle.snapshot().trace,160n)){const e=rec(f(t,4n),130n),at=signedValue(f(e,2n)),ids=counts.get(at)??new Set<string>();ids.add(key(f(e,1n)));counts.set(at,ids);}const n=counts.get(7n)!.size;
 expect(Math.max(...[...counts].filter(([t])=>t<7n).map(([,x])=>x.size))).toBeLessThan(n);const failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(n-1))),fault);await through(failed,6n);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow('work ceiling');expect({...failed.snapshot(),status:before.status}).toEqual(before);console.info('M36 late7 atomic failure cap'+(n-1)+'/'+n+' preserves state/output/trace/RNG');
},250000);
it('admission: source domains, original support, sole owner, append-only and generated-event guards',async()=>{
 const s=source(),d=data(),compiled=await compileCharacterModel(s),component=await compileCharacterState(compiled),m=await prepareCharacterModel(s),t=task(),path=interferencePath(t),o=list([text(INTERFERENCE_OBS),unsigned(4),t,unsigned(3),unsigned(1),true,list([])]),value=appendInterference(undefined,o,t),initial=component.initialState(d.initialState),patch={operations:[{kind:'set' as const,path,expected:{presence:false as const},newValue:value}]},scope={writableRoots:[1000n],targetPaths:[path]};
 expect(()=>component.stateModel.applyPatch(initial,patch,sid(1025,'authority/not-knowledge'),scope)).toThrow();const next=component.stateModel.applyPatch(initial,patch,KNOWLEDGE_OWNER,scope).state;
 expect(()=>component.initialState(enc(next.canonicalValue()))).toThrow('initial strategy');expect(()=>component.stateModel.applyPatch(next,{operations:[{kind:'remove',path,expectedOldValue:value}]},KNOWLEDGE_OWNER,scope)).toThrow();expect(()=>component.stateModel.applyPatch(next,{operations:[{kind:'set',path,expected:{presence:true,value},newValue:value}]},KNOWLEDGE_OWNER,scope)).toThrow('append only');
 const fabricated=list([text('assembled-performance-observation/0.1'),{kind:'typedIdentifier',namespaceId:1164n,payload:unsigned(777)},unsigned(3),t,unsigned(0),compiled.strategy![0].plans[0].actionId,false,true]),bad=list([text(INTERFERENCE_OBS),unsigned(4),t,unsigned(3),unsigned(1),true,fabricated]);
 expect(()=>component.stateModel.applyPatch(initial,{operations:[{...patch.operations[0],newValue:appendInterference(undefined,bad,t)}]},KNOWLEDGE_OWNER,scope)).toThrow('original support');
 const alter=(fn:(a:CanonicalValue[])=>CanonicalValue[])=>({...d,orderedInputs:enc(list(items(decode(d.orderedInputs),'list').map(v=>{const a=items(v,'list');return key(a[2])===key(INTERFERENCE_SOURCE)&&key(a[0])===key(signed(4))?list(fn([...a])):v;})))});
 for(const mutated of [alter(a=>{a[1]=unsigned(30);return a;}),alter(a=>{const p=[...items(a[3],'list')];p[1]=sid(1027,'unknown-task');a[3]=list(p);return a;}),alter(a=>{const p=[...items(a[3],'list')];p[3]=unsigned(0);a[3]=list(p);return a;}),alter(a=>{const p=[...items(a[3],'list')];p[2]=unsigned(4);a[3]=list(p);return a;}),alter(a=>{const p=[...items(a[3],'list')];p[5]=q(1,2);a[3]=list(p);return a;})])await expect(createCharacterRun(m,mutated)).rejects.toThrow();
 const missingContext={...d,orderedInputs:enc(list(items(decode(d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])!==key(INTERFERENCE_CONTEXT))))};await expect(createCharacterRun(m,missingContext)).rejects.toThrow('context missing');await expect(createCharacterRun(await prepareCharacterModel(previousSource()),d)).rejects.toThrow('interference source version');
 const handler=createCausalExecution(C,compiled.strategy!,component.stateModel,[],compiled.modelIdentity.value,compiled.modelIdentity.value,true);handler.begin(4n);const e={dueAt:4n as never,phase:140n,eventTypeId:INTERFERENCE_LEARN,payload:o,dependencies:list([]),eventId:999n,eventSequence:999n,causalParentEventIds:[]};expect(()=>handler.prepare([e],initial)).toThrow('unbound generated');handler.close();console.info('M36 source/context/version, exact original support, learned S0, sole owner, immutable history and bound evidence negatives');
},180000);

it('control: original failure remains a one-episode unbound-report witness',async()=>{
 const original=data({originalFailure:true}),amended=data(),xs=items(decode(original.orderedInputs),'list'),ys=items(decode(amended.orderedInputs),'list');
 expect(original.initialState).toEqual(amended.initialState);expect(original.runSeed).toEqual(amended.runSeed);expect(xs.length).toBe(ys.length);
 const changed=xs.flatMap((v,i)=>key(v)===key(ys[i])?[]:[i]);expect(changed).toHaveLength(1);
 const before=items(xs[changed[0]],'list'),after=items(ys[changed[0]],'list');expect(before[0]).toEqual(signed(3));expect(before[2]).toEqual(PERFORMANCE_SETTING);expect(after.slice(0,3)).toEqual(before.slice(0,3));expect(after[4]).toEqual(before[4]);
 const p=items(before[3],'list');expect(after[3]).toEqual(list([p[0],list(items(p[1],'list').map(v=>{const x=items(v,'list');if(key(x[0])!==key(task()))return v;expect(x[2]).toEqual(unsigned(1));return list([x[0],x[1],unsigned(2)]);}))]));
 const r=await createCharacterRun(await prepareCharacterModel(source()),original);await through(r,7n);
 expect(items(items(state(r).read(outcomePath(task())).value!,'list')[1],'list')).toHaveLength(1);
 const history=interferenceJournal(state(r).read(interferencePath(task())).value,task());expect(history).toHaveLength(2);expect(interferenceObservation(history[0],task()).outcome).toBeDefined();expect(interferenceObservation(history[1],task()).outcome).toBeUndefined();
 expect(reports(r).map(v=>v[6])).toEqual([list([]),q(1,1),q(1,1)]);
 console.info('M36 original failure control retained: one observed attempt; second report unbound; amendment changes exactly queried outcome3 mode1 to2');
},180000);
