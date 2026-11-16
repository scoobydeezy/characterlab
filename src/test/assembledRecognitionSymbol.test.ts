import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun,characterModelIdentity} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {OBSERVER,recognitionSource,RECOGNITION_SYMBOL_VERSION} from '../assembled/recognition';
import {reserveSymbolMappings,symbolMappingValue} from '../assembled/recognitionSymbols';
import {resolutionHistory} from '../assembled/recognitionState';
import * as recognition from '../semanticBinding/recognition';
import {identitySymbolMappingPath,SemanticMutationAuthority as OWNER} from '../semanticBinding/semanticStateAuthority';
import {personPath,personMean,personHistory} from '../assembled/social';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {unsigned as u} from '../substrate/canonicalEncoding';
import {dataIdentity as id} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {sid} from '../assembled/skill';
import {fixture,symbol,alias,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledRecognitionSymbol';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs);
const reports=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M131 queue cap');}
async function create(...args:Parameters<typeof fixture>){const b=fixture(...args),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);return {b,m,r};}
function judgment(r:Run,b:ReturnType<typeof fixture>,known:boolean){
 const mean=known?q(1,2):q(1,1),belief=state(r).read(personPath(C,target)).value;
 expect(personMean(belief)).toEqual(known?Q.of(1n,2n):Q.of(1n));expect(personHistory(belief)).toHaveLength(known?2:1);
 const social=reports(r,'assembled-social-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(a=>key(a[2])===key(target))!;
 expect(items(social[4],'list'),'live person appraisal').toEqual([mean]);expect(items(items(social[6],'list')[3],'list'),'no premature recall').toHaveLength(0);
 const joint=reports(r,JOINT_APPRAISAL).at(-1)!;for(const task of[b.taskA,b.taskB])expect(items(joint[4],'list').map(v=>items(v,'list')).find(a=>key(a[0])===key(task)),'live task appraisal').toHaveLength(5);
 expect(items(joint[6],'list').slice(1)).toContainEqual(list(social));
 const d=outputs(snap(r).outputs,409n).find(v=>key(f(v,2n))===key(signed(4)))!;expect(d).toBeDefined();const result=rec(f(d,4n),419n);expect(uint(f(result,1n)),'actual resolved decision').toBe(3n);
 const context=rec(f(d,3n),408n);expect(items(f(context,3n),'list').length).toBeGreaterThan(0);
 const data=rec(f(result,2n),420n),isB=(v:CanonicalValue)=>key(f(rec(v,395n),2n))===key(sid(1027,'definition/protocol-contact-two')),row=items(f(data,2n),'list').map(v=>rec(v,421n)).find(v=>isB(f(v,1n))),p=uint(f(data,8n))===1n?Q.of(isB(f(data,1n))?1n:0n):row?readQ(f(row,2n)):Q.of(0n);
 const intent=outputs(snap(r).outputs,425n).find(v=>key(f(v,2n))===key(d))!,plan=outputs(snap(r).outputs,431n).find(v=>key(f(v,2n))===key(intent))!,attempt=outputs(snap(r).outputs,432n).find(v=>key(f(v,2n))===key(plan))!;
 expect(outputs(snap(r).outputs,433n).some(v=>key(f(v,2n))===key(attempt)),'actual execution').toBe(true);
 return p;
}
it('primary131: same observed name, retained mapping changes recognition and actual choice',async()=>{
 const a=fixture(),b=fixture(false),m=await prepareCharacterModel(a.s),again=await prepareCharacterModel(b.s);bytes(characterModelIdentity(m),characterModelIdentity(again));bytes(a.d.orderedInputs,b.d.orderedInputs);bytes(a.d.runSeed,b.d.runSeed);
 const familiar=await createCharacterRun(m,a.d),unknown=await createCharacterRun(m,b.d);expect(familiar.runIdentity()).not.toEqual(unknown.runIdentity());
 for(const r of[familiar,unknown])await through(r,2n);
 const frozen=outputs(snap(familiar).outputs,227n),other=outputs(snap(unknown).outputs,227n);expect(frozen).toEqual(other);
 expect(resolutionHistory(state(familiar))).toHaveLength(2);expect(resolutionHistory(state(unknown))).toHaveLength(1);
 expect(outputs(snap(familiar).outputs,232n).filter(x=>uint(f(x,9n))===2n)).toHaveLength(1);expect(outputs(snap(unknown).outputs,232n).filter(x=>uint(f(x,9n))===2n)).toHaveLength(0);
 const cue=outputs(snap(familiar).outputs,232n).find(x=>uint(f(x,9n))===2n)!,source=rec(f(cue,6n),230n);
 expect(uint(f(source,1n))).toBe(2n);expect(id(f(source,3n)).payload).toEqual(text(symbol));expect(uint(id(f(source,4n)).payload)).toBe(1n);
 expect(f(cue,5n)).toEqual(target);expect(items(f(cue,8n),'set')).toHaveLength(1);
 const histories=[familiar,unknown].map(r=>outputs(snap(r).outputs,236n));
 for(const r of[familiar,unknown])await through(r,4n);
 for(const [i,r]of[familiar,unknown].entries()){expect(outputs(snap(r).outputs,227n).slice(0,frozen.length)).toEqual(frozen);expect(outputs(snap(r).outputs,236n).slice(0,histories[i].length)).toEqual(histories[i]);expect(resolutionHistory(state(r))).toHaveLength(2);}
 const p=[judgment(familiar,a,true),judgment(unknown,b,false)];console.info('M131 P(action B), mapped/unmapped: '+p.map(x=>x.numerator+'/'+x.denominator).join(' / '));expect(p[0].equals(p[1]),'actual probability difference').toBe(false);
 for(const r of[familiar,unknown])await finish(r);
 console.info('M131 PRIMARY PASS one model/fixed input/seed; S0 changes run identity; actual name mapping -> cue -> recognition -> belief -> appraisal/reasons/choice/attempt; later recognition never backfills; immutable history/full queues');
},590000);

it('boundaries131: symbol admission, allocated knowledge, immutable owner and run identity',async()=>{
 const b=fixture(),model=await compileCharacterModel(b.s),component=await compileCharacterState(model),state0=component.initialState(b.d.initialState),path=identitySymbolMappingPath(OBSERVER,symbol),v=rec(state0.read(path).value!,229n),slots=reserveSymbolMappings(model.recognition!);
 expect(slots.nextRuntimeId).toBe(2n);expect(slots.slots.map(x=>x.occurrence)).toEqual([0n,1n]);
 const changed=(field:bigint,value:CanonicalValue)=>({...v,fields:new Map([...v.fields].map(([n,x])=>[n,n===field?value:x]))});
 const seeded=(value:CanonicalValue)=>enc(new AuthoritativeState(state0.entries().map(e=>e.path.rootStateTypeId===243n&&e.path.fieldId===2n&&key(e.value)===key(v)?{...e,value}:e)).canonicalValue());
 for(const value of[changed(1n,{...id(f(v,1n)),payload:u(0)}),changed(1n,{...id(f(v,1n)),namespaceId:999n}),changed(2n,sid(1000,'foreign')),changed(3n,{...id(f(v,3n)),payload:text(alias)}),changed(4n,C),changed(5n,text('other/version')),{...v,schema:{...v.schema,schemaVersion:2n}}])
  expect(()=>component.initialState(seeded(value))).toThrow();
 expect(()=>new AuthoritativeState([...state0.entries(),{path,value:v}])).toThrow();
 const unknown=fixture(false),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d),r0=await createCharacterRun(m,unknown.d);
 expect(r.runIdentity()).not.toEqual(r0.runIdentity());
 for(const run of[r,r0])expect(uint(f(rec(f(rec(decode(run.save()),132n),6n),131n),1n)),'same reserved global prefix').toBe(2n);
 await expect(restoreCharacterRun(b.s,{initialState:unknown.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()})).rejects.toThrow('commitments differ');
 const old=await compileCharacterState(await compileCharacterModel(b.legacy.s));expect(()=>old.initialState(b.d.initialState)).toThrow();
 const patch={operations:[{kind:'set' as const,path,expected:{presence:true as const,value:v},newValue:symbolMappingValue(symbol,target,1n)}]};
 for(const owner of[OWNER.Perception,OWNER.RecognitionResolution,OWNER.RecognitionKnowledge])expect(()=>component.stateModel.applyPatch(state0,patch,owner,{writableRoots:[243n],targetPaths:[path]})).toThrow('immutable knowledge');
 const domain=[...items(decode(b.s.registry),'list')],decl=[...items(domain[21],'list')];decl[3]=list([text(alias),text(symbol)]);domain[21]=list(decl);
 const permuted={...b.s,registry:enc(list(domain))};expect(characterModelIdentity(m)).not.toEqual(characterModelIdentity(await prepareCharacterModel(permuted)));expect(reserveSymbolMappings((await compileCharacterModel(permuted)).recognition!)).toEqual(slots);
 for(const bad of[[],[text(alias),text(alias)],[text('')]]){decl[3]=list(bad);domain[21]=list(decl);await expect(prepareCharacterModel({...b.s,registry:enc(list(domain))})).rejects.toThrow('symbol domain');}
 // Use the admitted source envelope itself, not a guessed event label.
 const envelope=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list')[3]).find(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text('assembled-recognition/0.1')))!;
 const p=[...items(envelope,'list').slice(0,6)],signal=list([u(2),text(symbol),true]);p[5]=list([signal,signal]);expect(()=>recognitionSource(list(p),model.recognition!)).toThrow('duplicate');
 p[5]=list([list([u(2),text('unadmitted'),true])]);expect(()=>recognitionSource(list(p),model.recognition!)).toThrow('signal domain');
 p[5]=list([list([u(1),text(symbol),true])]);expect(()=>recognitionSource(list(p),model.recognition!)).toThrow('signal domain');
 console.info('M131 BOUNDARIES PASS allocated prefix/domain/schema/observer/occurrence/candidate; duplicate/foreign/cross-kind signals; immutable mappings; old0.96 rejects; S0 run binding; fixed sorted allocation domain; raw manifest identity');
},590000);
it('continuation131: mapping knowledge is traced, persists exactly and rolls back with recognition',async()=>{
 const {b,m,r}=await create(false),repeat=await createCharacterRun(m,b.d);await through(r,2n);await through(repeat,2n);exact(r,repeat);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);
 const traces=outputs(snap(r).trace,160n),freeze=traces.find(t=>{const e=rec(f(t,4n),130n);return key(f(e,2n))===key(signed(2))&&uint(f(e,3n))===126n&&key(f(t,6n))===key(text(RECOGNITION_SYMBOL_VERSION));})!;
 expect(freeze).toBeDefined();const reads=items(f(freeze,11n),'list').map(v=>rec(v,147n)).filter(v=>uint(f(rec(f(v,2n),140n),1n))===243n);
 const path=identitySymbolMappingPath(OBSERVER,symbol);
 expect(reads).toHaveLength(6);const absent=reads.filter(x=>uint(f(rec(f(x,2n),140n),2n))===2n);
 expect(absent).toHaveLength(2);expect(absent.filter(x=>f(x,3n)===true)).toHaveLength(1);
 expect(f(absent.find(x=>f(x,3n)===true)!,4n)).toEqual(symbolMappingValue(alias,target,0n));expect(f(absent.find(x=>f(x,3n)===false)!,4n)).toBe(false);
 expect(state(r).read(path).presence).toBe(false);
 await finish(r,[repeat,restored]);
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const before=snap(fault),save=fault.save(),original=recognition.evaluateContinuantRecognition;let reached=false;
 const spy=vi.spyOn(recognition,'evaluateContinuantRecognition').mockImplementation((...args)=>{const result=original(...args);if(args[1].experience.occurredAt===2n){reached=true;throw Error('M131 after recognition');}return result;});
 try{await expect(advance(fault)).rejects.toThrow('M131 after recognition');expect(reached).toBe(true);expect({...snap(fault),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});await finish(recovered);exact(r,recovered);
 console.info('M131 CONTINUATION PASS actual mapping reads including absence; repeat/save2/every later boundary/full queue; post-evaluation fault rolls whole instant back; recovered prefix exact');
},590000);
it('privacy131: hidden truth cannot supply familiarity; denied encounter cannot earn belief',async()=>{
 const a=await create(),b=await create(true,'hidden');
 for(let n=0;n<96;n++){const more=await advance(a.r);expect(await advance(b.r)).toBe(more);bytes(snap(a.r).state,snap(b.r).state);bytes(snap(a.r).outputs,snap(b.r).outputs);if(!more)break;expect(n).toBeLessThan(95);}
 const denied=await create(true,'denied');await through(denied.r,4n);judgment(denied.r,denied.b,false);await finish(denied.r);
 console.info('M131 PRIVACY PASS hidden outcomes/physical roles inert in all future safe states/outputs; denied encounter emits no learning credit');
},590000);
