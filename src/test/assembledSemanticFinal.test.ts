import {CURRENT_SEM_SOURCE,currentSource} from '../assembled/semanticLanes';
import * as ordering from '../semanticBinding/phaseOrdering';
import {lifecycleSource} from '../assembled/semanticLifecycle';
import {activeContinuantFilePath,activeEventFilePath} from '../semanticBinding/semanticStateAuthority';
import {restorePerceptualReferentId,restorePerceptualEventReferentId} from '../semanticBinding/semanticCodecs';
import {windowPath} from '../assembled/positionPerception';
import {SOCIAL_SOURCE} from '../assembled/social';
import {APPEARANCE_VERSION,appearanceSource,fullExperienceValue,CONTINUANT_FEATURES,EVENT_FEATURES} from '../assembled/semanticAppearance';
import {PerceptualEventFacetId as Facet} from '../semanticBinding/perceptualEventClassification';
import * as classification from '../semanticBinding/perceptualEventClassification';
import {SOCIAL_EPISODE,isSocialEpisodePath} from '../assembled/memory';
import {WORKSPACE} from '../assembled/workspace';
import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun,characterModelIdentity} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {OBSERVER,recognitionSource,CARRIER_OBSERVATION_VERSION} from '../assembled/recognition';
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
import {historyFixture,lanesFixture,lifecycleFixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledSemanticFinal';

const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs);
const reports=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M145 queue cap');}
async function create<B extends ReturnType<typeof historyFixture>|ReturnType<typeof lanesFixture>|ReturnType<typeof lifecycleFixture>>(b:B){const m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);return {b,m,r};}
const createHistory=(...args:Parameters<typeof historyFixture>)=>create(historyFixture(...args));
const createLanes=(...args:Parameters<typeof lanesFixture>)=>create(lanesFixture(...args));
const createLife=(...args:Parameters<typeof lifecycleFixture>)=>create(lifecycleFixture(...args));
function judgment(r:Run,b:{taskA:CanonicalValue;taskB:CanonicalValue},known:boolean){
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





it('primary145: partial cue access drives withdrawal, unchanged history and actual choice',async()=>{
 const a=historyFixture(),b=historyFixture(false),m=await prepareCharacterModel(a.s);bytes(a.d.initialState,b.d.initialState);bytes(a.d.runSeed,b.d.runSeed);
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
 const p=[judgment(withdrawn,a,false),judgment(held,b,true)];expect(p[0].equals(p[1])).toBe(false);console.info('M145 P(action B), visible/hidden contradiction: '+p.map(x=>x.numerator+'/'+x.denominator).join(' / '));
 for(const r of[withdrawn,held])await finish(r);
 console.info('M145 PRIMARY PASS partial permission -> explicit withdrawal -> withheld report attribution -> actual probability/execution; later correction preserves earlier evidence/history; full queues');
},590000);
it('histories145: no-cue persistence and unique replacement preserve the original report recipients',async()=>{
 const absent=await createHistory(true,'none');await through(absent.r,4n);expect(resolutionHistory(state(absent.r))).toHaveLength(1);judgment(absent.r,absent.b,true);await finish(absent.r);
 const replacement=await createHistory(true,'replacement');await through(replacement.r,2n);const h=resolutionHistory(state(replacement.r));expect(h).toHaveLength(2);
 expect(h[1].resolution).toEqual({kind:'asserted-candidate',candidateSemanticReferentId:key(replacement.b.other)});expect(h[1].perceptualReferentId).toEqual(h[0].perceptualReferentId);expect(h[1].revisesRecognitionResolutionId).toBe(h[0].recognitionResolutionId);
 const wrong=state(replacement.r).read(personPath(C,replacement.b.other)).value;expect(personMean(wrong)).toEqual(Q.of(0n));expect(personHistory(wrong)).toHaveLength(1);
 const frozen=outputs(snap(replacement.r).outputs,227n),history=outputs(snap(replacement.r).outputs,236n);await through(replacement.r,4n);
 const corrected=resolutionHistory(state(replacement.r));expect(corrected).toHaveLength(3);expect(corrected[2].resolution).toEqual({kind:'asserted-candidate',candidateSemanticReferentId:key(target)});expect(corrected[2].revisesRecognitionResolutionId).toBe(h[1].recognitionResolutionId);
 expect(state(replacement.r).read(personPath(C,replacement.b.other)).value).toEqual(wrong);
 expect(outputs(snap(replacement.r).outputs,227n).slice(0,frozen.length)).toEqual(frozen);expect(outputs(snap(replacement.r).outputs,236n).slice(0,history.length)).toEqual(history);
 judgment(replacement.r,replacement.b,false);await finish(replacement.r);
 console.info('M145 HISTORIES PASS absent cues retain identification; unique replacement and correction keep one track and exact revision chain; earlier wrongly attributed report never transfers; live choice/full queues');
},590000);
const traces=(r:Run)=>outputs(snap(r).trace,160n).filter(v=>key(f(v,6n))===key(text(CARRIER_OBSERVATION_VERSION)));
const phaseAt=(r:Run,p:bigint,at=2n)=>traces(r).find(v=>{const e=rec(f(v,4n),130n);return key(f(e,2n))===key(signed(at))&&uint(f(e,3n))===p;})!;
const projection=(r:Run,p:bigint,type:bigint)=>items(f(phaseAt(r,p),13n),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
function laneStructure(r:Run,corrected=false){
 const phases=traces(r).filter(v=>key(f(rec(f(v,4n),130n),2n))===key(signed(2))).map(v=>uint(f(rec(f(v,4n),130n),3n)));
 expect(phases).toEqual([0n,10n,11n,12n,13n,14n,15n,20n,21n,110n,120n,121n,122n,123n,124n,125n,126n,127n,130n,140n]);
 const current=projection(r,14n,227n)[0],consequence=projection(r,124n,227n)[0];expect(current).toBeDefined();expect(consequence).toBeDefined();
 expect(key(f(current,1n))).not.toBe(key(f(consequence,1n)));expect(f(current,4n)).toEqual(f(consequence,4n));
 for(const x of[current,consequence]){expect(items(f(x,6n),'set')).toHaveLength(6);expect(items(f(x,7n),'set')).toHaveLength(3);}
 const early=projection(r,21n,236n),late=projection(r,127n,236n);expect(early).toHaveLength(1);expect(late).toHaveLength(corrected?1:0);
 if(corrected){expect(f(late[0],8n)).toEqual(f(early[0],1n));expect(f(late[0],4n)).toEqual(f(early[0],4n));expect(f(late[0],9n)).toEqual(f(early[0],9n));}
 const history=resolutionHistory(state(r));expect(history.slice(1).every(h=>h.occurredAt===2n)).toBe(true);
 const fr=phaseAt(r,126n),reads=items(f(fr,11n),'list').map(v=>rec(v,147n));expect(reads.some(v=>f(v,3n)===true&&key(f(v,4n))===key(early[0])),'consequence actually consumes current resolution').toBe(true);
 return {current,consequence,early,late};
}

it('lanes145: current recognition controls consequence report attribution and same-instant correction is append-only',async()=>{
 const results=[] as Q[];
 for(const mode of ['target','other','corrected'] as const){
  const {b,r}=await createLanes(mode);await through(r,2n);
  const old=outputs(snap(r).outputs,236n),envelopes=outputs(snap(r).outputs,227n);
  if(mode!=='target')laneStructure(r,mode==='corrected');else{
   expect(projection(r,21n,236n)).toHaveLength(0);expect(projection(r,127n,236n)).toHaveLength(0);
   expect(projection(r,14n,227n)).toHaveLength(1);expect(projection(r,124n,227n)).toHaveLength(1);
  }
  if(mode==='other')expect(personMean(state(r).read(personPath(C,b.other)).value)).toEqual(Q.of(0n));
  await through(r,4n);expect(outputs(snap(r).outputs,236n).slice(0,old.length)).toEqual(old);expect(outputs(snap(r).outputs,227n).slice(0,envelopes.length)).toEqual(envelopes);
  results.push(judgment(r,b,mode!=='other'));expect(resolutionHistory(state(r)).at(-1)!.resolution).toEqual({kind:'asserted-candidate',candidateSemanticReferentId:key(target)});
  if(mode==='other')expect(personHistory(state(r).read(personPath(C,b.other)).value)).toHaveLength(1);
  await finish(r);
 }
 expect(results[0].equals(Q.of(47n,72n))).toBe(true);expect(results[1].equals(Q.of(1n))).toBe(true);expect(results[2].equals(results[0])).toBe(true);
 console.info('M145 PRIMARY PASS same kernels/owners across current and consequence; distinct immutable envelopes; actual126 read of21 resolution; ordered21->127 correction; current cue -> report recipient -> live actual choice/execution P47/72 vs1; full queues');
},590000);
it('continuation145: same-instant corrections survive restore and later-lane failure rolls back both lanes',async()=>{
 const {b,m,r}=await createLanes('corrected'),repeat=await createCharacterRun(m,b.d);await through(r,2n);await through(repeat,2n);exact(r,repeat);laneStructure(r,true);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);await finish(r,[repeat,restored]);
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const before=snap(fault),save=fault.save(),original=recognition.evaluateContinuantRecognition;let evaluations=0;
 const spy=vi.spyOn(recognition,'evaluateContinuantRecognition').mockImplementation((...args)=>{const result=original(...args);if(args[1].experience.occurredAt===2n&&++evaluations===2)throw Error('M145 after second-lane evaluation');return result;});
 try{await expect(advance(fault)).rejects.toThrow('M145 after second-lane evaluation');expect(evaluations).toBe(2);expect({...snap(fault),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});await finish(recovered);exact(r,recovered);
 console.info('M145 CONTINUATION PASS exact repeat/save2/all later boundaries; failed consequence restores both lanes and same-instant history; exact recovered finish');
},590000);
it('privacy145: denied current evidence allocates no experience and hidden truth is inert in both lanes',async()=>{
 const a=await createLanes('other'),b=await createLanes('hidden');for(let n=0;n<96;n++){const more=await advance(a.r);expect(await advance(b.r)).toBe(more);bytes(snap(a.r).state,snap(b.r).state);bytes(snap(a.r).outputs,snap(b.r).outputs);if(!more)break;expect(n).toBeLessThan(95);}
 const original=ordering.admitObservationLane,allocations:{lane:string;at:bigint;count:number;reservation:boolean}[]=[];
 const spy=vi.spyOn(ordering,'admitObservationLane').mockImplementation((request,allocate)=>{let count=0;const result=original(request,()=>{count++;return allocate();});allocations.push({lane:request.lane,at:request.dueAt,count,reservation:!!result.reservation});return result;});
 let denied:Awaited<ReturnType<typeof create>>;try{denied=await createLanes('denied');await through(denied.r,4n);}finally{spy.mockRestore();}
 expect(allocations.filter(x=>x.at===2n&&x.lane==='Current')).toEqual([{lane:'Current',at:2n,count:0,reservation:false}]);
 expect(projection(denied!.r,14n,227n)).toHaveLength(0);expect(projection(denied!.r,124n,227n)).toHaveLength(1);
 expect(judgment(denied!.r,denied!.b,true).equals(Q.of(47n,72n))).toBe(true);await finish(denied!.r);
 console.info('M145 PRIVACY PASS identical permitted evidence despite hidden truth; denied current has zero ExperienceId allocation/envelope and no recognition effect; consequence remains live');
},590000);
const frozenAt=(r:Run,at:bigint)=>outputs(snap(r).outputs,227n).find(x=>uint(f(x,3n))===at&&items(f(x,6n),'set').length===6)!;
const trackAt=(r:Run,at:bigint)=>f(rec(items(f(frozenAt(r,at),5n),'set')[0],224n),4n);
const eventAt=(r:Run,at:bigint)=>items(f(frozenAt(r,at),4n),'set')[0];
function lifeStructure(r:Run,b:ReturnType<typeof lifecycleFixture>,earlier:CanonicalValue[]){
 const retired=['reacquire','hidden'].includes(b.mode),split=retired||b.mode==='split',t1=trackAt(r,1n),t2=trackAt(r,2n),e1=eventAt(r,1n),e2=eventAt(r,2n);
 expect(key(t1)===key(t2)).toBe(!split);expect(key(e1)===key(e2)).toBe(b.mode==='continued');
 expect(state(r).read(activeContinuantFilePath(restorePerceptualReferentId(t1))).presence).toBe(!retired);
 expect(state(r).read(activeEventFilePath(restorePerceptualEventReferentId(e1))).presence).toBe(!(retired||b.mode==='eventSplit'));
 expect(outputs(snap(r).outputs,218n)).toHaveLength(retired?1:0);expect(outputs(snap(r).outputs,220n)).toHaveLength(retired||b.mode==='eventSplit'?1:0);
 const transition=outputs(snap(r).outputs,219n).find(v=>uint(f(v,7n))===2n)!;expect(f(transition,3n)).toEqual(e2);expect(uint(f(transition,5n))).toBe(b.mode==='continued'?2n:1n);
 expect(outputs(snap(r).outputs,236n).slice(0,earlier.length)).toEqual(earlier);
 if(split)expect(restorePerceptualReferentId(t2).observerTrackSequence).toBeGreaterThan(restorePerceptualReferentId(t1).observerTrackSequence);
 if(b.mode!=='continued')expect(restorePerceptualEventReferentId(e2).observerEventSequence).toBeGreaterThan(restorePerceptualEventReferentId(e1).observerEventSequence);
 const x=frozenAt(r,1n),memory=state(r).entries().filter(e=>isSocialEpisodePath(e.path)).map(e=>items(e.value,'list')).find(a=>key(a[5])===key(signed(1)))!;
 expect(memory,'earlier real episode retained').toBeDefined();expect(memory[3]).toEqual(x);
 // Exact end support cites the current permitted observation, never a truth handle.
 for(const end of [...outputs(snap(r).outputs,218n),...outputs(snap(r).outputs,220n)])expect(f(end,3n)).toEqual(f(frozenAt(r,2n),8n));
}
async function retainedUse(r:Run,retired:boolean){
 await through(r,21n);const selected=items(reports(r,WORKSPACE).at(-1)![4],'list').map(v=>items(v,'list'));
 const recalled=selected.map(a=>items(a[1],'list')).filter(a=>key(a[0])===key(text(SOCIAL_EPISODE)));console.info('M145 selected acquisition times retired='+retired+': '+recalled.map(a=>String((a[5] as {value:bigint}).value)).join(','));const old=recalled.find(a=>!retired||key(a[5])===key(signed(1)))!;
 expect(old,'retired-file experience actually recalled').toBeDefined();expect(old[3]).toEqual(frozenAt(r,(old[5] as {value:bigint}).value));
 const row=reports(r,'assembled-social-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(a=>key(a[2])===key(target))!;
 expect(items(items(row[6],'list')[3],'list'),'actual memory consumer').toContainEqual(old[1]);
}

it('lifecycle145: explicit lifecycle preserves history and changes later choice only through current recognition',async()=>{
 const results=[] as Q[];
 for(const mode of ['continued','reacquire','split','eventSplit'] as const){
  const {b,r}=await createLife(mode);await through(r,1n);const earlier=outputs(snap(r).outputs,236n);expect(earlier).toHaveLength(1);
  await through(r,2n);lifeStructure(r,b,earlier);await through(r,4n);
  const known=mode==='continued'||mode==='eventSplit';results.push(judgment(r,b,known));
  const reportsNow=personHistory(state(r).read(personPath(C,target)).value);expect(reportsNow).toHaveLength(known?2:1);
  expect(key(trackAt(r,3n))).toBe(key(trackAt(r,2n)));
  await retainedUse(r,mode==='reacquire'||mode==='split');await finish(r);
 }
 expect(results[0].equals(Q.of(47n,72n))).toBe(true);expect(results[1].equals(Q.of(1n))).toBe(true);
 expect(results[2].equals(results[1])).toBe(true);expect(results[3].equals(results[0])).toBe(true);
 console.info('M145 PRIMARY PASS explicit track/event ends; fresh ordinals; event continuation/split; exact support; old recognition/memory retained and actually consumed; live actual P(B)47/72 vs1; split-only/retirement equivalence; complete queues');
},590000);
it('retirement145: retirement and continuation restore exactly and a later fault rolls back endings',async()=>{
 const {b,m,r}=await createLife(),repeat=await createCharacterRun(m,b.d);await through(r,2n);await through(repeat,2n);exact(r,repeat);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);await finish(r,[repeat,restored]);
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const before=snap(fault),save=fault.save(),original=classification.classifyPerceptualEvent;let reached=false;
 const spy=vi.spyOn(classification,'classifyPerceptualEvent').mockImplementation((...args)=>{const result=original(...args);if(args[1].occurredAt===2n){reached=true;throw Error('M145 after both retirements');}return result;});
 try{await expect(advance(fault)).rejects.toThrow('M145 after both retirements');expect(reached).toBe(true);expect({...snap(fault),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});await finish(recovered);exact(r,recovered);
 console.info('M145 CONTINUATION PASS repeat/save2/all later prefixes; post-retirement rollback and recovered whole continuation');
},590000);
it('files145: malformed or contradictory lifecycle and foreign/future/reused/absent files reject',async()=>{
 for(const v of[true,list([]),list([true,true,false,false]),list([false,false,true,true]),list([false,false,false,u(0)])])expect(()=>lifecycleSource(v)).toThrow();
 const {b,m,r}=await createLife();await through(r,2n);const settings=await compileCharacterModel(b.s),model=(await compileCharacterState(settings)).stateModel,s=state(r),old=restorePerceptualReferentId(trackAt(r,1n)),p=activeContinuantFilePath(old);
 expect(()=>model.applyPatch(s,{operations:[{kind:'set',path:p,expected:{presence:false},newValue:true}]},OWNER.Perception,{writableRoots:[241n],targetPaths:[p]})).toThrow('retired sequence reuse');
 expect(()=>model.applyPatch(s,{operations:[{kind:'remove',path:p,expectedOldValue:true}]},OWNER.Perception,{writableRoots:[241n],targetPaths:[p]})).toThrow();
 const current=activeContinuantFilePath(restorePerceptualReferentId(trackAt(r,2n)));
 expect(()=>model.applyPatch(s,{operations:[{kind:'remove',path:current,expectedOldValue:true}]},OWNER.RecognitionResolution,{writableRoots:[241n],targetPaths:[current]})).toThrow();
 for(const file of[{observerId:'foreign',observerTrackSequence:0n},{observerId:OBSERVER,observerTrackSequence:999n}]){
  const corrupt=new AuthoritativeState([...s.entries(),{path:activeContinuantFilePath(file),value:true}]);expect(()=>model.validateState(corrupt)).toThrow();
 }
 const w=windowPath(OBSERVER,'social'),existing=s.read(w).value!;
 expect(()=>model.applyPatch(s,{operations:[{kind:'set',path:w,expected:{presence:true,value:existing},newValue:existing}]},OWNER.Perception,{writableRoots:[241n],targetPaths:[w]})).toThrow('clock/attachment');
 // No source ordinal or inferred predecessor: first observed end has no current file.
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[0])===key(signed(1))&&key(a[2])===key(SOCIAL_SOURCE)){const p=[...items(a[3],'list')];p[3]=list([false,true,false,false]);a[3]=list(p);}return list(a);});
 const invalid=await createCharacterRun(m,{...b.d,orderedInputs:enc(list(rows))});await expect(through(invalid,1n)).rejects.toThrow('prior social track');

 await finish(r);console.info('M145 BOUNDARIES PASS strict flags; retired/future/foreign files; no end twice/reuse/wrong owner; immutable attachment; absent prior');
},590000);

it('knowledge145: actual frozen knowledge admits exact replacement operations and rejects stale or foreign authority',async()=>{
 const b=historyFixture(false),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);
 type Call=Parameters<typeof recognition.evaluateContinuantRecognition>;
 const calls:Call[]=[],original=recognition.evaluateContinuantRecognition;
 const spy=vi.spyOn(recognition,'evaluateContinuantRecognition').mockImplementation((...args)=>{calls.push(args);return original(...args);});
 try{await through(r,2n);}finally{spy.mockRestore();}
 const [model,request,next]=calls.find(a=>a[1].experience.occurredAt===2n)!;
 expect(request).toBeDefined();const originalRequest=structuredClone(request),oldOutputs=snap(r).outputs.slice(),oldHistory=resolutionHistory(state(r));
 const cue=request.cueEvidence.find(c=>c.recognitionCueSource.kind==='identity-claim-mapping')!;
 expect(cue).toBeDefined();if(cue.recognitionCueSource.kind!=='identity-claim-mapping')throw Error('mapping cue required');
 const mappingId=cue.recognitionCueSource.observerSymbolCandidateMappingId;
 const mapping=request.identitySymbolMappings.find(x=>x.observerSymbolCandidateMappingId===mappingId)!;
 const other=request.candidateCatalog.find(c=>c.candidateSemanticReferentId!==mapping.candidateSemanticReferentId)!;
 // CV-SEM-099 is a state-operation correspondence on actual operands. It does not
 // assert that the runtime has an online acquisition producer or mutate its knowledge.
 const replacement={...mapping,observerSymbolCandidateMappingId:next+100n,candidateSemanticReferentId:other.candidateSemanticReferentId};
 const base={...request,cueEvidence:[cue],priorResolutionHistory:[]};
 const activeB=request.identitySymbolMappings.map(x=>x===mapping?replacement:x);
 const newCue={...cue,candidateSemanticReferentId:replacement.candidateSemanticReferentId,recognitionCueSource:{...cue.recognitionCueSource,observerSymbolCandidateMappingId:replacement.observerSymbolCandidateMappingId}};
 expect(original(model,base,next).resolutionRecord!.resolution).toEqual({kind:'asserted-candidate',candidateSemanticReferentId:mapping.candidateSemanticReferentId});
 expect(original(model,{...base,identitySymbolMappings:activeB,cueEvidence:[newCue]},next).resolutionRecord!.resolution).toEqual({kind:'asserted-candidate',candidateSemanticReferentId:other.candidateSemanticReferentId});
 expect(()=>original(model,{...base,identitySymbolMappings:activeB},next)).toThrow('mapping');
 expect(()=>original(model,{...base,identitySymbolMappings:[...request.identitySymbolMappings,replacement]},next)).toThrow('more than one active mapping');
 expect(()=>original(model,{...base,candidateCatalog:[...request.candidateCatalog,request.candidateCatalog[0]]},next)).toThrow('duplicate candidate');
 expect(()=>original(model,{...base,cueEvidence:[{...cue,observerId:'foreign'}]},next)).toThrow();
 expect(()=>original(model,{...base,identitySymbolMappings:request.identitySymbolMappings.map(x=>({...x,observerId:'foreign'}))},next)).toThrow();
 const ambiguous={...newCue,recognitionCueEvidenceId:cue.recognitionCueEvidenceId+1000n,recognitionCueSource:{kind:'retained-template-match' as const,recognitionTemplateId:other.recognitionTemplateIds[0]}};
 expect(original(model,{...request,cueEvidence:[cue,ambiguous]},next).evaluation.result).toEqual({kind:'no-update',reason:'AmbiguousCandidates'});
 expect(original(model,{...request,cueEvidence:[]},next).evaluation.result).toEqual({kind:'no-update',reason:'NoQualifyingCandidate'});
 expect(request).toEqual(originalRequest);bytes(snap(r).outputs,oldOutputs);expect(resolutionHistory(state(r))).toEqual(oldHistory);
 const changed=historyFixture(false,'replacement'),changedModel=await prepareCharacterModel(changed.s);
 bytes(characterModelIdentity(m),characterModelIdentity(changedModel));
 const different=await createCharacterRun(changedModel,changed.d);expect(different.runIdentity()).not.toEqual(r.runIdentity());
 await expect(restoreCharacterRun(b.s,{initialState:changed.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()})).rejects.toThrow('commitments differ');
 const component=await compileCharacterState(await compileCharacterModel(b.s)),s=state(r),knowledge=s.entries().find(e=>e.path.rootStateTypeId===243n&&e.path.fieldId===1n)!;
 const patch={operations:[{kind:'set' as const,path:knowledge.path,expected:{presence:true as const,value:knowledge.value},newValue:knowledge.value}]};
 for(const owner of[OWNER.Perception,OWNER.RecognitionResolution,OWNER.RecognitionKnowledge])expect(()=>component.stateModel.applyPatch(s,patch,owner,{writableRoots:[243n],targetPaths:[knowledge.path]})).toThrow('immutable knowledge');
 for(const entry of s.entries().filter(e=>e.path.rootStateTypeId===243n)){
  const v=rec(entry.value,entry.path.fieldId===1n?228n:229n);
  for(const invalid of[{...v,schema:{...v.schema,schemaVersion:2n}},{...v,fields:new Map([...v.fields].map(([n,x])=>[n,n===(entry.path.fieldId===1n?1n:2n)?sid(1000,'foreign-observer'):x]))}]){
   expect(()=>component.stateModel.validateState(new AuthoritativeState(s.entries().map(e=>e===entry?{...e,value:invalid}:e)))).toThrow();
  }
 }
 const historyEntries=s.entries().filter(e=>e.path.rootStateTypeId===244n);
 expect(historyEntries.length).toBeGreaterThan(0);
 for(const entry of historyEntries){
  const v=rec(entry.value,236n),cycle={...v,fields:new Map([...v.fields].map(([n,x])=>[n,n===8n?list([f(v,1n)]):x]))};
  expect(()=>component.stateModel.validateState(new AuthoritativeState(s.entries().map(e=>e===entry?{...e,value:cycle}:e)))).toThrow();
 }
 await finish(r);await finish(different);
 const empty=new AuthoritativeState(restoreAuthoritativeState(decode(b.d.initialState)).entries().filter(e=>e.path.rootStateTypeId!==243n));
 const unfamiliar=await createCharacterRun(m,{...b.d,initialState:enc(empty.canonicalValue())});await finish(unfamiliar);
 expect(outputs(snap(unfamiliar).outputs,232n)).toHaveLength(0);expect(resolutionHistory(state(unfamiliar))).toHaveLength(0);
 console.info('M145 KNOWLEDGE PASS actual request replacement/stale/duplicate/ambiguity/foreign controls; original cue/history immutable; S0 changes run not model; wrong-S0 restore rejects; live empty knowledge stays unknown; no online acquisition claim');
},590000);

it('contracts145: native freeze operands, strict lane cutoffs and public source phase boundary',async()=>{
 const {b,m,r}=await createLanes('corrected'),original=ordering.freezeRecognitionInput;
 const freezes:Parameters<typeof original>[]=[],spy=vi.spyOn(ordering,'freezeRecognitionInput').mockImplementation((...args)=>{freezes.push(args);return original(...args);});
 try{await through(r,2n);}finally{spy.mockRestore();}
 expect(freezes.some(a=>a[0]==='Current'&&a[1].experience.occurredAt===2n)).toBe(true);
 expect(freezes.some(a=>a[0]==='Consequence'&&a[1].experience.occurredAt===2n)).toBe(true);
 for(const args of freezes){
  const request=structuredClone(args[2]),frozen=original(args[0],args[1],request,args[3]),before=structuredClone(frozen.request);
  (request.cueEvidence as unknown[]).splice(0);(request.candidateCatalog as unknown[]).splice(0);
  expect(frozen.request).toEqual(before);expect(Object.isFrozen(frozen.request)).toBe(true);
  const cutoff=ordering.OBSERVATION_LANES[args[0]].phases.Observation;
  expect(()=>ordering.assertTruthAvailableAtLaneEntry(args[0],cutoff-1n)).not.toThrow();
  for(const at of[cutoff,cutoff+1n])expect(()=>ordering.assertTruthAvailableAtLaneEntry(args[0],at)).toThrow('cutoff');
  expect(()=>original(args[0],args[1],args[2],150n)).toThrow('phase');
 }
 const rows=items(decode(b.d.orderedInputs),'list'),source=rows.find(v=>key(items(v,'list')[2])===key(CURRENT_SEM_SOURCE))!,raw=items(source,'list');
 for(const phase of[10n,110n,120n,150n]){
  const changed=rows.map(v=>v===source?list([raw[0],u(phase),...raw.slice(2)]):v);
  await expect(createCharacterRun(m,{...b.d,orderedInputs:enc(list(changed))})).rejects.toThrow('phase');
 }
 await expect(createCharacterRun(m,{...b.d,orderedInputs:enc(list([...rows,source]))})).rejects.toThrow('duplicate');
 expect(()=>ordering.assertOutcomeEvaluationRead('authoritative-world-outcome')).toThrow();
 expect(()=>ordering.assertAutomaticAdaptationOutput('character-learning-evidence')).toThrow();
 const evaluation=phaseAt(r,130n);
 expect(items(f(evaluation,11n),'list').some(v=>uint(f(rec(f(rec(v,147n),2n),140n),1n))===240n),'phase130 has no truth owner read').toBe(false);
 await finish(r);
 expect(outputs(snap(r).trace,160n).some(v=>uint(f(rec(f(v,4n),130n),3n))===150n)).toBe(false);
 console.info('M145 CONTRACTS PASS actual frozen current/consequence operands immutable; strict before/at/after cutoffs; public late/sentinel/duplicate rejection; phase130 safe/150 non-schedulable');
},590000);
