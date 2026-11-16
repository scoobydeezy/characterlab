import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun,characterModelIdentity} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {catalogEntries,validateSeedCatalog,RECOGNITION_SEED_VERSION} from '../assembled/recognition';
import {resolutionHistory} from '../assembled/recognitionState';
import * as recognition from '../semanticBinding/recognition';
import {SemanticMutationAuthority as OWNER} from '../semanticBinding/semanticStateAuthority';
import {personPath,personMean,personHistory} from '../assembled/social';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {set,unsigned as u} from '../substrate/canonicalEncoding';
import {dataIdentity as id} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {sid} from '../assembled/skill';
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledRecognitionSeed';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs);
const reports=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M130 queue cap');}
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
it('primary130: same model, observations and seed; initial familiarity changes later actual choice',async()=>{
 const a=fixture(),b=fixture(false),m=await prepareCharacterModel(a.s),again=await prepareCharacterModel(b.s);bytes(characterModelIdentity(m),characterModelIdentity(again));bytes(a.d.orderedInputs,b.d.orderedInputs);bytes(a.d.runSeed,b.d.runSeed);
 const familiar=await createCharacterRun(m,a.d),unknown=await createCharacterRun(m,b.d);expect(familiar.runIdentity()).not.toEqual(unknown.runIdentity());
 for(const r of[familiar,unknown])await through(r,2n);
 const frozen=outputs(snap(familiar).outputs,227n),other=outputs(snap(unknown).outputs,227n);expect(frozen).toEqual(other);
 expect(resolutionHistory(state(familiar))).toHaveLength(2);expect(resolutionHistory(state(unknown))).toHaveLength(1);
 expect(outputs(snap(familiar).outputs,232n).filter(x=>uint(f(x,9n))===2n)).toHaveLength(1);expect(outputs(snap(unknown).outputs,232n).filter(x=>uint(f(x,9n))===2n)).toHaveLength(0);
 const histories=[familiar,unknown].map(r=>outputs(snap(r).outputs,236n));
 for(const r of[familiar,unknown])await through(r,4n);
 for(const [i,r]of[familiar,unknown].entries()){expect(outputs(snap(r).outputs,227n).slice(0,frozen.length)).toEqual(frozen);expect(outputs(snap(r).outputs,236n).slice(0,histories[i].length)).toEqual(histories[i]);expect(resolutionHistory(state(r))).toHaveLength(2);}
 const p=[judgment(familiar,a,true),judgment(unknown,b,false)];console.info('M130 P(action B), familiar/unfamiliar: '+p.map(x=>x.numerator+'/'+x.denominator).join(' / '));expect(p[0].equals(p[1]),'actual probability difference').toBe(false);
 for(const r of[familiar,unknown])await finish(r);
 console.info('M130 PRIMARY PASS one model/fixed input/seed; S0 changes run identity; actual seed -> cue -> recognition -> belief -> appraisal/reasons/choice/attempt; later recognition never backfills; immutable history/full queues');
},590000);
it('boundaries130: closed seeded domain, canonical identity, immutable owner and initial-state restore binding',async()=>{
 const b=fixture(false),model=await compileCharacterModel(b.s),component=await compileCharacterState(model),s=component.initialState(b.d.initialState),entries=catalogEntries(model.recognition!),targetEntry=entries.find(e=>key(f(rec(e.value,228n),2n))===key(target))!;
 const original=s.read(targetEntry.path).value!,v=rec(original,228n),changed=(field:bigint,value:CanonicalValue)=>({...v,fields:new Map([...v.fields].map(([n,x])=>[n,n===field?value:x]))});
 const withValue=(value:CanonicalValue)=>enc(new AuthoritativeState(s.entries().map(e=>e.path.rootStateTypeId===243n&&key(f(rec(e.value,228n),2n))===key(target)?{...e,value}:e)).canonicalValue());
 expect(()=>component.initialState(withValue(changed(4n,set([]))))).not.toThrow();
 const allowed=items(f(rec(targetEntry.value,228n),4n),'set'),badTemplate={...id(allowed[0]),payload:text('appearance/unadmitted')};
 for(const value of[{...v,schema:{...v.schema,schemaVersion:2n}},changed(4n,set([badTemplate])),changed(4n,list([])),changed(3n,u(2)),changed(5n,text('foreign/version')),changed(1n,sid(1000,'foreign-observer'))])expect(()=>component.initialState(withValue(value))).toThrow();
 expect(()=>component.initialState(enc(new AuthoritativeState(s.entries().filter(e=>!(e.path.rootStateTypeId===243n&&key(f(rec(e.value,228n),2n))===key(target)))).canonicalValue()))).toThrow('missing initial catalog');
 expect(()=>new AuthoritativeState([...s.entries(),{path:targetEntry.path,value:targetEntry.value}])).toThrow();
 const permutation=withValue(changed(4n,set([...items(f(v,4n),'set')].reverse())));bytes(permutation,b.d.initialState);
 const old=await compileCharacterState(await compileCharacterModel(b.legacy.s));expect(()=>old.initialState(b.d.initialState)).toThrow('bound initial catalog');
 const patch={operations:[{kind:'set' as const,path:targetEntry.path,expected:{presence:true as const,value:original},newValue:targetEntry.value}]};
 for(const owner of[OWNER.Perception,OWNER.RecognitionResolution,OWNER.RecognitionKnowledge])expect(()=>component.stateModel.applyPatch(s,patch,owner,{writableRoots:[243n],targetPaths:[targetEntry.path]})).toThrow('immutable knowledge');
 const m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d),seed=b.d.runSeed.slice();seed[31]^=1;const seeded=await createCharacterRun(m,{...b.d,runSeed:seed});expect(seeded.runIdentity()).not.toEqual(r.runIdentity());
 const same=await createCharacterRun(m,{...b.d,initialState:permutation});bytes(same.runIdentity(),r.runIdentity());
 const slots=[...items(decode(b.s.registry),'list')],domain=[...items(slots[21],'list')];domain[1]=list(items(domain[1],'list').map(x=>{const row=items(x,'list');return key(row[0])===key(target)?list([row[0],list(items(row[1],'list').filter(t=>key(t)!==key(text('appearance/coat'))))]):x;}));slots[21]=list(domain);
 expect(characterModelIdentity(await prepareCharacterModel({...b.s,registry:enc(list(slots))}))).not.toEqual(characterModelIdentity(m));
 await expect(restoreCharacterRun(b.s,{initialState:fixture(true).d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()})).rejects.toThrow('commitments differ');
 console.info('M130 BOUNDARIES PASS empty/permuted knowledge; missing/foreign/schema/domain/template rejection; all in-run knowledge writes blocked; seed/S0 changes run, domain changes model; wrong-S0 restore rejects');
},590000);
it('continuation130: seed knowledge is traced, persists exactly and rolls back with recognition',async()=>{
 const {b,m,r}=await create(false),repeat=await createCharacterRun(m,b.d);await through(r,2n);await through(repeat,2n);exact(r,repeat);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);
 const traces=outputs(snap(r).trace,160n),freeze=traces.find(t=>{const e=rec(f(t,4n),130n);return key(f(e,2n))===key(signed(2))&&uint(f(e,3n))===126n&&key(f(t,6n))===key(text(RECOGNITION_SEED_VERSION));})!;
 expect(freeze).toBeDefined();const reads=items(f(freeze,11n),'list').map(v=>rec(v,147n)).filter(v=>uint(f(rec(f(v,2n),140n),1n))===243n);
 const path=catalogEntries((await compileCharacterModel(b.s)).recognition!).find(e=>key(f(rec(e.value,228n),2n))===key(target))!.path;expect(reads).toHaveLength(4);expect(reads.some(x=>key(f(x,4n))===key(state(r).read(path).value!))).toBe(true);
 await finish(r,[repeat,restored]);
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const before=snap(fault),save=fault.save(),original=recognition.evaluateContinuantRecognition;let reached=false;
 const spy=vi.spyOn(recognition,'evaluateContinuantRecognition').mockImplementation((...args)=>{const result=original(...args);if(args[1].experience.occurredAt===2n){reached=true;throw Error('M130 after recognition');}return result;});
 try{await expect(advance(fault)).rejects.toThrow('M130 after recognition');expect(reached).toBe(true);expect({...snap(fault),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});await finish(recovered);exact(r,recovered);
 console.info('M130 CONTINUATION PASS actual seed reads; repeat/save2/every later boundary/full queue; post-evaluation fault rolls whole instant back; recovered prefix exact');
},590000);
it('privacy130: hidden truth cannot supply familiarity; denied encounter cannot earn belief',async()=>{
 const a=await create(),b=await create(true,'hidden');
 for(let n=0;n<96;n++){const more=await advance(a.r);expect(await advance(b.r)).toBe(more);bytes(snap(a.r).state,snap(b.r).state);bytes(snap(a.r).outputs,snap(b.r).outputs);if(!more)break;expect(n).toBeLessThan(95);}
 const denied=await create(true,'denied');await through(denied.r,4n);judgment(denied.r,denied.b,false);await finish(denied.r);
 console.info('M130 PRIVACY PASS hidden outcomes/physical roles inert in all future safe states/outputs; denied encounter emits no learning credit');
},590000);
