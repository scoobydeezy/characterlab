import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {inferCause,causalAffect,causalJournal,causalPath,appendDiagnostic,CAUSAL,CAUSAL_OBS,CAUSAL_APPRAISAL,CAUSAL_VERSION,CAUSAL_SOURCE,CAUSAL_CONTEXT,CAUSAL_LEARN,createCausalExecution} from '../assembled/causalAttribution';
import {KNOWLEDGE_OWNER} from '../assembled/strategy';
import {outcomePath} from '../assembled/performance';
import {PRACTICE_SETTING,SKILL_ACTUAL,sid} from '../assembled/skill';
import {BODY_DELIVERY} from '../assembled/body';
import {createLatentCauseRun,LAWS} from '../campaign3/latentCause';
import {latentCauseCases} from './latentCauseFixtures';
import {list,text,unsigned,signed,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
import {source,data,task,decode,items,key,enc,type Options} from './fixtures/assembledCausalAttribution';
import {source as previousSource} from './fixtures/assembledValueReceiving';
import {outputs,through,signedValue,type Run} from './fixtures/assembledComparison';
import {workLimit} from './fixtures/assembledCharacter';
import {C} from './fixtures/campaign2Cognitive';
const reports=(run:Run,label=CAUSAL_APPRAISAL)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const exact=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const str=(v:{numerator:bigint;denominator:bigint}|null)=>v?v.numerator+'/'+v.denominator:null;
it('math: all original latent-cause cases and laws preserve inference and appraisal',async()=>{
 let checked=0;
 for(const frames of Object.values(latentCauseCases()))for(const law of LAWS){
  const original=createLatentCauseRun(law,frames);let outcome:boolean|null=null;const evidence:{receipt:bigint;motion:boolean|null;drag:boolean|null}[]=[];
  for(const x of frames){const j=inferCause(outcome,evidence,law),a=causalAffect(j,x.goal);await original.step();const old=original.observerView().rows.at(-1)!;
   expect({status:j.status,blockage:str(j.blockage),limitation:str(j.limitation)}).toEqual(old.inference);expect(a.status==='Known'?a.coordinates.map(str):null).toEqual(old.affect);
   if(x.visible&&law!=='NoLearning'&&x.episode===1){if(x.outcome!==null)outcome=x.outcome;if(x.motion!==null||x.drag!==null)evidence.push({receipt:BigInt(x.receipt),motion:x.motion,drag:x.drag});}checked++;
  }
 }
 expect(checked).toBe(336);console.info('M35 original14 cases x4 laws x6 prefixes =336 exact inference/appraisal comparisons');
});
it('connection: actual failed attempt, later correction and independent goal appraisal',async()=>{
 const m=await prepareCharacterModel(source()),a=await createCharacterRun(m,data()),b=await createCharacterRun(m,data({goal:'RepairCapability'}));
 await through(a,3n);const first=reports(a);const intent=outputs(a.snapshot().outputs,425n)[0],outcome=state(a).read(outcomePath(task())).value;expect(intent).toBeDefined();expect(items(items(outcome!,'list')[1],'list')[0]).toBeDefined();expect(first[0][5]).toEqual(text('Unknown'));expect(reports(a,CAUSAL_OBS)).toHaveLength(0);
 await through(a,7n);await through(b,7n);const aa=reports(a),bb=reports(b);
 expect(aa.map(v=>v[5])).toEqual(['Unknown','Limitation','Obstruction'].map(text));expect(aa.map(v=>v[6])).toEqual([list([]),q(1,10),q(9,10)]);expect(aa.map(v=>v[8])).toEqual([list([]),list([q(1,10),q(1,10)]),list([q(9,10),q(9,10)])]);expect(bb.map(v=>v[8])).toEqual([list([]),list([q(9,10),q(9,10)]),list([q(1,10),q(1,10)])]);
 expect(aa.map(v=>v.slice(5,8))).toEqual(bb.map(v=>v.slice(5,8)));expect(state(a).read(causalPath(task()))).toEqual(state(b).read(causalPath(task())));expect(aa[0]).toEqual(first[0]);expect(outputs(a.snapshot().outputs,425n)[0]).toEqual(intent);expect(items(items(state(a).read(outcomePath(task())).value!,'list')[1],'list')[0]).toEqual(items(items(outcome!,'list')[1],'list')[0]);
 const trace=outputs(a.snapshot().trace,160n).filter(v=>key(f(v,6n))===key(text(CAUSAL_VERSION))&&key(f(rec(f(v,4n),130n),5n))===key(sid(1001,'event/task-appraisal')));
 expect(trace).toHaveLength(3);for(const t of trace)expect(items(f(t,11n),'list')).toHaveLength(2);
 expect(reports(a,CAUSAL_OBS)).toHaveLength(2);expect(aa[2][9]).not.toEqual(list([]));console.info('M35 actual3 intent/outcome -> diagnostics4/6 -> appraisal5/7 pB1/10 then9/10; goal complements without changing knowledge');
},300000);
it('privacy: hidden physical outcome and denied changed displays',async()=>{
 const m=await prepareCharacterModel(source()),a=await createCharacterRun(m,data({difficulty:q(0,1)})),b=await createCharacterRun(m,data({difficulty:q(1,2)})),denied=await createCharacterRun(m,data({denied:true})),changed=await createCharacterRun(m,data({denied:true,changed:true}));
 for(const r of [a,b,denied,changed])await through(r,5n);
 expect(reports(a,SKILL_ACTUAL)[0][7]).toBe(true);expect(reports(b,SKILL_ACTUAL)[0][7]).toBe(false);expect(reports(a)).toEqual(reports(b));expect(state(a).read(causalPath(task()))).toEqual(state(b).read(causalPath(task())));expect(reports(denied)).toEqual(reports(changed));expect(reports(denied)[1][5]).toEqual(text('Ambiguous'));expect(state(denied).read(causalPath(task())).presence).toBe(false);expect(reports(denied,CAUSAL_OBS)).toHaveLength(0);console.info('M35 hidden physical success/failure and denied changed diagnostic equality');
},300000);
it('gates: missing outcome, duplicate receipt, foreign ticket and current evidence',async()=>{
 const m=await prepareCharacterModel(source());
 for(const options of [{missing:true},{duplicate:true},{foreign:true},{current:true}] as Options[]){
  const run=await createCharacterRun(m,data(options));await through(run,7n);const r=reports(run).at(-1)!;
  expect(r[5]).toEqual(text(options.missing?'Unknown':'Limitation'));expect(r[6]).toEqual(options.missing?list([]):q(1,10));
  if(options.current){expect(reports(run,CAUSAL_OBS)).toHaveLength(2);expect(causalJournal(state(run).read(causalPath(task())).value,task())).toHaveLength(2);expect(items(r[10],'list')).toHaveLength(1);}
 }
 console.info('M35 missing original, first-receipt wins, foreign ticket and same-instant correction exclusion');
},400000);
it('persistence: exact repeat3 and restore5 through10',async()=>{
 const s=source(),d=data(),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,3n);await through(b,3n);exact(a,b);await through(a,5n);const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);while(a.snapshot().clock<10n){expect(await a.settleNextInstant()).toBe(await restored.settleNextInstant());exact(a,restored);}expect(await a.settleNextInstant()).toBe(false);expect(await restored.settleNextInstant()).toBe(false);exact(a,restored);console.info('M35 repeat3 and every restored settled state/output/trace/save5..10 exact');
},350000);
it('rollback: late shared instant publishes no partial knowledge or RNG',async()=>{
 const s=source(),d=data({current:true}),fault={...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),...Array.from({length:16},()=>list([signed(7),unsigned(110),BODY_DELIVERY,list([C,q(0,1)]),list([])]))]))},oracle=await createCharacterRun(await prepareCharacterModel(s),fault);await through(oracle,7n);const counts=new Map<bigint,Set<string>>();for(const t of outputs(oracle.snapshot().trace,160n)){const e=rec(f(t,4n),130n),at=signedValue(f(e,2n)),ids=counts.get(at)??new Set<string>();ids.add(key(f(e,1n)));counts.set(at,ids);}const n=counts.get(7n)!.size;expect(Math.max(...[...counts].filter(([t])=>t<7n).map(([,x])=>x.size))).toBeLessThan(n);const failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(n-1))),fault);await through(failed,6n);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow('work ceiling');expect({...failed.snapshot(),status:before.status}).toEqual(before);console.info('M35 late7 atomic failure cap'+(n-1)+'/'+n+' preserves state/output/trace/RNG');
},250000);
it('admission: source, ownership, append-only history and generated-event guards',async()=>{
 const s=source(),d=data(),compiled=await compileCharacterModel(s),component=await compileCharacterState(compiled),m=await prepareCharacterModel(s),t=task(),path=causalPath(t),o=list([text(CAUSAL_OBS),unsigned(4),t,unsigned(3),unsigned(1),false,false]),value=appendDiagnostic(undefined,o,t),initial=component.initialState(d.initialState),patch={operations:[{kind:'set' as const,path,expected:{presence:false as const},newValue:value}]},scope={writableRoots:[1000n],targetPaths:[path]};
 expect(()=>component.stateModel.applyPatch(initial,patch,sid(1025,'authority/not-knowledge'),scope)).toThrow();const next=component.stateModel.applyPatch(initial,patch,KNOWLEDGE_OWNER,scope).state;expect(()=>component.initialState(enc(next.canonicalValue()))).toThrow('initial strategy');expect(()=>component.stateModel.applyPatch(next,{operations:[{kind:'remove',path,expectedOldValue:value}]},KNOWLEDGE_OWNER,scope)).toThrow();expect(()=>component.stateModel.applyPatch(next,{operations:[{kind:'set',path,expected:{presence:true,value},newValue:value}]},KNOWLEDGE_OWNER,scope)).toThrow('append only');
 const alter=(fn:(a:CanonicalValue[])=>CanonicalValue[])=>({...d,orderedInputs:enc(list(items(decode(d.orderedInputs),'list').map(v=>{const a=items(v,'list');return key(a[2])===key(CAUSAL_SOURCE)&&key(a[0])===key(signed(4))?list(fn([...a])):v;})))});
 for(const mutated of [alter(a=>{a[1]=unsigned(30);return a;}),alter(a=>{const p=[...items(a[3],'list')];p[1]=sid(1027,'unknown-task');a[3]=list(p);return a;}),alter(a=>{const p=[...items(a[3],'list')];p[3]=unsigned(0);a[3]=list(p);return a;}),alter(a=>{const p=[...items(a[3],'list')];p[2]=unsigned(4);a[3]=list(p);return a;}),alter(a=>{const p=[...items(a[3],'list')];p[5]=q(1,2);a[3]=list(p);return a;})])await expect(createCharacterRun(m,mutated)).rejects.toThrow();
 await expect(createCharacterRun(await prepareCharacterModel(previousSource()),d)).rejects.toThrow('causal source');
 const handler=createCausalExecution(C,compiled.strategy!,component.stateModel,[],compiled.modelIdentity.value,compiled.modelIdentity.value);handler.begin(4n);const e={dueAt:4n as never,phase:140n,eventTypeId:CAUSAL_LEARN,payload:o,dependencies:list([]),eventId:999n,eventSequence:999n,causalParentEventIds:[]};expect(()=>handler.prepare([e],initial)).toThrow('unbound generated');handler.close();console.info('M35 malformed source/admission, absent learned S0, sole owner, immutable history and bound generated evidence guards');
},180000);
