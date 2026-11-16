import {LANES_VERSION,CURRENT_SEM_SOURCE,currentSource} from '../assembled/semanticLanes';
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
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledSemanticLanes';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs);
const reports=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M135 queue cap');}
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




const traces=(r:Run)=>outputs(snap(r).trace,160n).filter(v=>key(f(v,6n))===key(text(LANES_VERSION)));
const phaseAt=(r:Run,p:bigint,at=2n)=>traces(r).find(v=>{const e=rec(f(v,4n),130n);return key(f(e,2n))===key(signed(at))&&uint(f(e,3n))===p;})!;
const projection=(r:Run,p:bigint,type:bigint)=>items(f(phaseAt(r,p),13n),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
function structure(r:Run,corrected=false){
 const phases=traces(r).filter(v=>key(f(rec(f(v,4n),130n),2n))===key(signed(2))).map(v=>uint(f(rec(f(v,4n),130n),3n)));
 expect(phases).toEqual([0n,10n,11n,12n,13n,14n,20n,21n,110n,120n,121n,122n,123n,124n,126n,127n,130n,140n]);
 const current=projection(r,14n,227n)[0],consequence=projection(r,124n,227n)[0];expect(current).toBeDefined();expect(consequence).toBeDefined();
 expect(key(f(current,1n))).not.toBe(key(f(consequence,1n)));expect(f(current,4n)).toEqual(f(consequence,4n));
 for(const x of[current,consequence]){expect(items(f(x,6n),'set')).toHaveLength(6);expect(items(f(x,7n),'set')).toHaveLength(3);}
 const early=projection(r,21n,236n),late=projection(r,127n,236n);expect(early).toHaveLength(1);expect(late).toHaveLength(corrected?1:0);
 if(corrected){expect(f(late[0],8n)).toEqual(f(early[0],1n));expect(f(late[0],4n)).toEqual(f(early[0],4n));expect(f(late[0],9n)).toEqual(f(early[0],9n));}
 const history=resolutionHistory(state(r));expect(history.slice(1).every(h=>h.occurredAt===2n)).toBe(true);
 const fr=phaseAt(r,126n),reads=items(f(fr,11n),'list').map(v=>rec(v,147n));expect(reads.some(v=>f(v,3n)===true&&key(f(v,4n))===key(early[0])),'consequence actually consumes current resolution').toBe(true);
 return {current,consequence,early,late};
}
it('primary135: current recognition controls consequence report attribution and same-instant correction is append-only',async()=>{
 const results=[] as Q[];
 for(const mode of ['target','other','corrected'] as const){
  const {b,r}=await create(mode);await through(r,2n);
  const old=outputs(snap(r).outputs,236n),envelopes=outputs(snap(r).outputs,227n);
  if(mode!=='target')structure(r,mode==='corrected');else{
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
 console.info('M135 PRIMARY PASS same kernels/owners across current and consequence; distinct immutable envelopes; actual126 read of21 resolution; ordered21->127 correction; current cue -> report recipient -> live actual choice/execution P47/72 vs1; full queues');
},590000);
it('continuation135: same-instant corrections survive restore and later-lane failure rolls back both lanes',async()=>{
 const {b,m,r}=await create('corrected'),repeat=await createCharacterRun(m,b.d);await through(r,2n);await through(repeat,2n);exact(r,repeat);structure(r,true);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);await finish(r,[repeat,restored]);
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const before=snap(fault),save=fault.save(),original=recognition.evaluateContinuantRecognition;let evaluations=0;
 const spy=vi.spyOn(recognition,'evaluateContinuantRecognition').mockImplementation((...args)=>{const result=original(...args);if(args[1].experience.occurredAt===2n&&++evaluations===2)throw Error('M135 after second-lane evaluation');return result;});
 try{await expect(advance(fault)).rejects.toThrow('M135 after second-lane evaluation');expect(evaluations).toBe(2);expect({...snap(fault),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});await finish(recovered);exact(r,recovered);
 console.info('M135 CONTINUATION PASS exact repeat/save2/all later boundaries; failed consequence restores both lanes and same-instant history; exact recovered finish');
},590000);
it('boundaries135: current source cannot smuggle reports, wrong cutoffs, duplicate lanes or incompatible windows',async()=>{
 const b=fixture(),m=await prepareCharacterModel(b.s),model=await compileCharacterModel(b.s),rows=items(decode(b.d.orderedInputs),'list'),source=rows.find(v=>key(items(v,'list')[2])===key(CURRENT_SEM_SOURCE))!,raw=items(source,'list'),payload=items(raw[3],'list');
 for(const index of[3,4]){const p=[...payload],o=[...items(p[1],'list')];o[index]=u(index===3?3:1);p[1]=list(o);expect(()=>currentSource(list(p),model.recognition!)).toThrow('sensory');}
 expect(()=>currentSource(list(payload.slice(0,6)),model.recognition!)).toThrow('grammar');
 for(const badPhase of[10n,110n,120n,150n]){const changed=rows.map(v=>v===source?list([raw[0],u(badPhase),...raw.slice(2)]):v);await expect(createCharacterRun(m,{...b.d,orderedInputs:enc(list(changed))})).rejects.toThrow('phase');}
 await expect(createCharacterRun(m,{...b.d,orderedInputs:enc(list([...rows,source]))})).rejects.toThrow('duplicate');
 const legacy=await prepareCharacterModel(b.legacy.s);await expect(createCharacterRun(legacy,b.d)).rejects.toThrow('version');
 const r=await createCharacterRun(m,b.d);await through(r,2n);const sm=(await compileCharacterState(model)).stateModel,s=state(r),path=windowPath(OBSERVER,'social'),v=s.read(path).value!,a=items(v,'list');expect(uint(a[4])).toBe(121n);
 for(const generation of[11n,21n,121n]){const replacement=list([...a.slice(0,4),u(generation)]);expect(()=>sm.applyPatch(s,{operations:[{kind:'set',path,expected:{presence:true,value:v},newValue:replacement}]},OWNER.Perception,{writableRoots:[241n],targetPaths:[path]})).toThrow();}
 await finish(r);console.info('M135 BOUNDARIES PASS exact sensory grammar; no authored report/receipt; strict0/110 cutoffs; duplicate/source-version and same-clock window-generation protection');
},590000);
it('privacy135: denied current evidence allocates no experience and hidden truth is inert in both lanes',async()=>{
 const a=await create('other'),b=await create('hidden');for(let n=0;n<96;n++){const more=await advance(a.r);expect(await advance(b.r)).toBe(more);bytes(snap(a.r).state,snap(b.r).state);bytes(snap(a.r).outputs,snap(b.r).outputs);if(!more)break;expect(n).toBeLessThan(95);}
 const original=ordering.admitObservationLane,allocations:{lane:string;at:bigint;count:number;reservation:boolean}[]=[];
 const spy=vi.spyOn(ordering,'admitObservationLane').mockImplementation((request,allocate)=>{let count=0;const result=original(request,()=>{count++;return allocate();});allocations.push({lane:request.lane,at:request.dueAt,count,reservation:!!result.reservation});return result;});
 let denied:Awaited<ReturnType<typeof create>>;try{denied=await create('denied');await through(denied.r,4n);}finally{spy.mockRestore();}
 expect(allocations.filter(x=>x.at===2n&&x.lane==='Current')).toEqual([{lane:'Current',at:2n,count:0,reservation:false}]);
 expect(projection(denied!.r,14n,227n)).toHaveLength(0);expect(projection(denied!.r,124n,227n)).toHaveLength(1);
 expect(judgment(denied!.r,denied!.b,true).equals(Q.of(47n,72n))).toBe(true);await finish(denied!.r);
 console.info('M135 PRIVACY PASS identical permitted evidence despite hidden truth; denied current has zero ExperienceId allocation/envelope and no recognition effect; consequence remains live');
},590000);
