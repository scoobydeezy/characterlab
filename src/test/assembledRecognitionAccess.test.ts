import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun,characterModelIdentity} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {OBSERVER,recognitionSource,RECOGNITION_ACCESS_VERSION} from '../assembled/recognition';
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
import {fixture,symbol,alias,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledRecognitionAccess';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs);
const reports=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M132 queue cap');}
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

it('primary132: partial cue access drives withdrawal, unchanged history and actual choice',async()=>{
 const a=fixture(),b=fixture(false),m=await prepareCharacterModel(a.s);bytes(a.d.initialState,b.d.initialState);bytes(a.d.runSeed,b.d.runSeed);
 const withdrawn=await createCharacterRun(m,a.d),held=await createCharacterRun(m,b.d);
 for(const r of[withdrawn,held])await through(r,1n);
 const original=outputs(snap(withdrawn).outputs,236n);expect(original).toEqual(outputs(snap(held).outputs,236n));
 for(const r of[withdrawn,held])await through(r,2n);
 const h=resolutionHistory(state(withdrawn)),k=resolutionHistory(state(held));expect(h).toHaveLength(2);expect(k).toHaveLength(1);
 expect(h[1].resolution.kind).toBe('withdrawn');expect(h[1].revisesRecognitionResolutionId).toBe(h[0].recognitionResolutionId);expect(h[1].perceptualReferentId).toEqual(h[0].perceptualReferentId);
 const frozen=outputs(snap(withdrawn).outputs,227n);expect(frozen).toEqual(outputs(snap(held).outputs,227n));
 expect(outputs(snap(withdrawn).outputs,232n).filter(x=>uint(f(x,9n))===2n)).toHaveLength(2);expect(outputs(snap(held).outputs,232n).filter(x=>uint(f(x,9n))===2n)).toHaveLength(1);
 const prior=[withdrawn,held].map(r=>outputs(snap(r).outputs,236n));
 for(const [i,r]of[withdrawn,held].entries()){
  await through(r,4n);expect(outputs(snap(r).outputs,236n).slice(0,prior[i].length)).toEqual(prior[i]);expect(outputs(snap(r).outputs,227n).slice(0,frozen.length)).toEqual(frozen);
 }
 const corrected=resolutionHistory(state(withdrawn));expect(corrected).toHaveLength(3);expect(corrected[2].revisesRecognitionResolutionId).toBe(corrected[1].recognitionResolutionId);expect(corrected[2].perceptualReferentId).toEqual(corrected[0].perceptualReferentId);expect(corrected[2].resolution).toEqual({kind:'asserted-candidate',candidateSemanticReferentId:key(target)});
 expect(resolutionHistory(state(held))).toHaveLength(1);
 const p=[judgment(withdrawn,a,false),judgment(held,b,true)];expect(p[0].equals(p[1])).toBe(false);console.info('M132 P(action B), visible/hidden contradiction: '+p.map(x=>x.numerator+'/'+x.denominator).join(' / '));
 for(const r of[withdrawn,held])await finish(r);
 console.info('M132 PRIMARY PASS partial permission -> explicit withdrawal -> withheld report attribution -> actual probability/execution; later correction preserves earlier evidence/history; full queues');
},590000);
it('histories132: no-cue persistence and unique replacement preserve the original report recipients',async()=>{
 const absent=await create(true,'none');await through(absent.r,4n);expect(resolutionHistory(state(absent.r))).toHaveLength(1);judgment(absent.r,absent.b,true);await finish(absent.r);
 const replacement=await create(true,'replacement');await through(replacement.r,2n);const h=resolutionHistory(state(replacement.r));expect(h).toHaveLength(2);
 expect(h[1].resolution).toEqual({kind:'asserted-candidate',candidateSemanticReferentId:key(replacement.b.other)});expect(h[1].perceptualReferentId).toEqual(h[0].perceptualReferentId);expect(h[1].revisesRecognitionResolutionId).toBe(h[0].recognitionResolutionId);
 const wrong=state(replacement.r).read(personPath(C,replacement.b.other)).value;expect(personMean(wrong)).toEqual(Q.of(0n));expect(personHistory(wrong)).toHaveLength(1);
 const frozen=outputs(snap(replacement.r).outputs,227n),history=outputs(snap(replacement.r).outputs,236n);await through(replacement.r,4n);
 const corrected=resolutionHistory(state(replacement.r));expect(corrected).toHaveLength(3);expect(corrected[2].resolution).toEqual({kind:'asserted-candidate',candidateSemanticReferentId:key(target)});expect(corrected[2].revisesRecognitionResolutionId).toBe(h[1].recognitionResolutionId);
 expect(state(replacement.r).read(personPath(C,replacement.b.other)).value).toEqual(wrong);
 expect(outputs(snap(replacement.r).outputs,227n).slice(0,frozen.length)).toEqual(frozen);expect(outputs(snap(replacement.r).outputs,236n).slice(0,history.length)).toEqual(history);
 judgment(replacement.r,replacement.b,false);await finish(replacement.r);
 console.info('M132 HISTORIES PASS absent cues retain identification; unique replacement and correction keep one track and exact revision chain; earlier wrongly attributed report never transfers; live choice/full queues');
},590000);
it('boundaries132: strict per-cue admission and versioned observed projection',async()=>{
 const b=fixture(),model=await compileCharacterModel(b.s),old=await compileCharacterModel(b.legacy.s);
 const envelope=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list')).find(a=>key(a[0])===key(signed(2))&&key(a[2])===key(sid(1001,'event/assembled-social-source')))![3];
 const p=[...items(envelope,'list').slice(0,6)],signal=list([u(1),text('appearance/voice'),false,false]);p[5]=list([signal]);expect(recognitionSource(list(p),model.recognition!).signals).toEqual([]);
 await expect(createCharacterRun(await prepareCharacterModel(b.legacy.s),b.d)).rejects.toThrow('signal grammar');
 for(const tuple of[list([u(1),text('appearance/voice'),false]),list([u(1),text('appearance/voice'),false,u(0)]),list([u(1),text('unadmitted'),true,false]),list([u(2),text('appearance/voice'),true,false])]){
  p[5]=list([tuple]);expect(()=>recognitionSource(list(p),model.recognition!)).toThrow();
 }
 p[5]=list([signal,signal]);expect(()=>recognitionSource(list(p),model.recognition!)).toThrow('duplicate');
 p[5]=list([list([u(1),text('appearance/voice'),false])]);expect(recognitionSource(list(p),old.recognition!).signals).toEqual([{template:'appearance/voice',support:false}]);
 console.info('M132 BOUNDARIES PASS strict permission boolean/tuple/domain/duplicate; denied cue removed not negated; old0.97 grammar preserved');
},590000);
it('continuation132: withdrawal is ordered, persists exactly and rolls back with recognition',async()=>{
 const {b,m,r}=await create(true),repeat=await createCharacterRun(m,b.d);await through(r,2n);await through(repeat,2n);exact(r,repeat);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);
 const traces=outputs(snap(r).trace,160n),freeze=traces.find(t=>{const e=rec(f(t,4n),130n);return key(f(e,2n))===key(signed(2))&&uint(f(e,3n))===126n&&key(f(t,6n))===key(text(RECOGNITION_ACCESS_VERSION));})!;
 expect(freeze).toBeDefined();const reads=items(f(freeze,11n),'list').map(v=>rec(v,147n)).filter(v=>uint(f(rec(f(v,2n),140n),1n))===243n);
 expect(reads).toHaveLength(6);expect(reads.every(x=>f(x,3n)===true)).toBe(true);
 const phaseRows=traces.filter(t=>{const e=rec(f(t,4n),130n);return key(f(e,2n))===key(signed(2))&&key(f(t,6n))===key(text(RECOGNITION_ACCESS_VERSION));}).map(t=>uint(f(rec(f(t,4n),130n),3n)));
 expect(phaseRows.indexOf(126n)).toBeLessThan(phaseRows.indexOf(127n));expect(phaseRows.indexOf(127n)).toBeLessThan(phaseRows.indexOf(130n));
 expect(resolutionHistory(state(r)).at(-1)!.resolution.kind).toBe('withdrawn');
 await finish(r,[repeat,restored]);
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const before=snap(fault),save=fault.save(),original=recognition.evaluateContinuantRecognition;let reached=false;
 const spy=vi.spyOn(recognition,'evaluateContinuantRecognition').mockImplementation((...args)=>{const result=original(...args);if(args[1].experience.occurredAt===2n){reached=true;throw Error('M132 after recognition');}return result;});
 try{await expect(advance(fault)).rejects.toThrow('M132 after recognition');expect(reached).toBe(true);expect({...snap(fault),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});await finish(recovered);exact(r,recovered);
 console.info('M132 CONTINUATION PASS actual mapping reads and126/127/130 ordering; repeat/save2/every later boundary/full queue; post-evaluation fault rolls whole instant back; recovered prefix exact');
},590000);

it('privacy132: withheld polarity and hidden truth are inert, global denial earns no report',async()=>{
 const a=await create(false),b=await create(false,'hidden');
 for(let n=0;n<96;n++){const more=await advance(a.r);expect(await advance(b.r)).toBe(more);bytes(snap(a.r).state,snap(b.r).state);bytes(snap(a.r).outputs,snap(b.r).outputs);if(!more)break;expect(n).toBeLessThan(95);}
 const denied=await create(true,'denied');await through(denied.r,4n);judgment(denied.r,denied.b,false);expect(resolutionHistory(state(denied.r))).toHaveLength(1);await finish(denied.r);
 console.info('M132 PRIVACY PASS withheld polarity/hidden identity/outcome/roles inert in all safe prefixes; whole-encounter denial earns no report or withdrawal');
},590000);
