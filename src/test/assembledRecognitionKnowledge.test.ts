import {RECOGNITION_KNOWLEDGE_VERSION,catalogEntries,validateSeedCatalog,readCatalog} from '../assembled/recognition';
import {candidateCatalogEntryPath} from '../semanticBinding/semanticStateAuthority';
import {statePathValue} from '../substrate/state';
import {set} from '../substrate/canonicalEncoding';
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
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledRecognitionKnowledge';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs);
const reports=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M137 queue cap');}
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





const traces=(r:Run)=>outputs(snap(r).trace,160n).filter(v=>key(f(v,6n))===key(text(RECOGNITION_KNOWLEDGE_VERSION)));
const phaseAt=(r:Run,p:bigint,at=2n)=>traces(r).find(v=>{const e=rec(f(v,4n),130n);return key(f(e,2n))===key(signed(at))&&uint(f(e,3n))===p;})!;
const projection=(r:Run,p:bigint,type:bigint)=>items(f(phaseAt(r,p),13n),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
function structure(r:Run,b:ReturnType<typeof fixture>){
 const path=candidateCatalogEntryPath(OBSERVER,key(b.other)),present=!!b.domain;
 for(const phase of[20n,126n]){
  const reads=items(f(phaseAt(r,phase),11n),'list').map(v=>rec(v,147n)),actual=reads.find(v=>key(f(v,2n))===key(statePathValue(path)))!;
  expect(actual,'actual catalog location read').toBeDefined();expect(f(actual,3n)).toBe(present);
  if(present){expect(f(actual,4n)).toEqual(state(r).read(path).value);expect(uint(f(rec(f(actual,4n),228n),3n))).toBe(BigInt(b.domain));}
 }
 const early=projection(r,21n,236n);expect(early).toHaveLength(present?1:0);expect(projection(r,20n,232n)).toHaveLength(present?1:0);
 if(present)expect(f(rec(f(early[0],5n),235n),2n)).toEqual(b.other);
 expect(projection(r,127n,236n)).toHaveLength(0);
 expect(projection(r,14n,227n)).toHaveLength(1);expect(projection(r,124n,227n)).toHaveLength(1);
 expect(projection(r,15n,240n).length).toBeGreaterThan(0);expect(projection(r,125n,240n).length).toBeGreaterThan(0);
 expect(resolutionHistory(state(r)).at(-1)!.resolution).toEqual({kind:'asserted-candidate',candidateSemanticReferentId:key(present?b.other:target)});
}
it('primary137: actual catalog availability changes choice; all three candidate domains preserve cue-based recognition',async()=>{
 const runs=[] as Awaited<ReturnType<typeof create>>[];
 for(const domain of[1,2,3,0] as const)runs.push(await create(domain));
 const first=runs[0];
 for(const x of runs){bytes(characterModelIdentity(x.m),characterModelIdentity(first.m));bytes(x.b.d.orderedInputs,first.b.d.orderedInputs);bytes(x.b.d.runSeed,first.b.d.runSeed);}
 expect(new Set(runs.map(x=>key(decode(x.r.runIdentity())))).size).toBe(4);
 for(const x of runs){await through(x.r,2n);structure(x.r,x.b);}
 const frozen=runs.map(x=>outputs(snap(x.r).outputs,227n)),history=runs.map(x=>outputs(snap(x.r).outputs,236n));
 for(const xs of frozen)expect(xs).toEqual(frozen[0]);
 for(const x of runs.slice(1,3))bytes(snap(first.r).outputs,snap(x.r).outputs);
 const results=[] as Q[];
 for(const [i,x]of runs.entries()){
  await through(x.r,4n);expect(outputs(snap(x.r).outputs,227n).slice(0,frozen[i].length)).toEqual(frozen[i]);expect(outputs(snap(x.r).outputs,236n).slice(0,history[i].length)).toEqual(history[i]);
  results.push(judgment(x.r,x.b,!x.b.domain));
  expect(resolutionHistory(state(x.r)).at(-1)!.resolution).toEqual({kind:'asserted-candidate',candidateSemanticReferentId:key(target)});
  if(x.b.domain)expect(personHistory(state(x.r).read(personPath(C,x.b.other)).value)).toHaveLength(1);
  await finish(x.r);
 }
 for(const p of results.slice(0,3))expect(p.equals(Q.of(1n))).toBe(true);expect(results[3].equals(Q.of(47n,72n))).toBe(true);
 for(const x of runs.slice(1,3))bytes(snap(first.r).outputs,snap(x.r).outputs);
 console.info('M137 PRIMARY PASS same model/input/seed, four run-owned catalogs; actual20/126 presence/absence; Person/Object/Place preserve outputs despite appearance; absent candidate cannot earn cue; no-cue persistence -> actual report recipient/belief/appraisal/reasons/choice/execution P1 vs47/72; immutable history/full queues');
},590000);
it('boundaries137: closed catalog domains and actual mapping membership; no synthesized knowledge or runtime writes',async()=>{
 const b=fixture(),model=await compileCharacterModel(b.s),component=await compileCharacterState(model),s=component.initialState(b.d.initialState),path=candidateCatalogEntryPath(OBSERVER,key(b.other)),original=s.read(path).value!,v=rec(original,228n);
 const change=(field:bigint,value:CanonicalValue)=>({...v,fields:new Map([...v.fields].map(([n,x])=>[n,n===field?value:x]))});
 const replace=(value:CanonicalValue)=>enc(new AuthoritativeState(s.entries().map(e=>key(statePathValue(e.path))===key(statePathValue(path))?{...e,value}:e)).canonicalValue());
 for(const domain of[1,2,3])expect(()=>component.initialState(replace(change(3n,u(domain))))).not.toThrow();
 expect(()=>component.initialState(replace(change(4n,set([]))))).not.toThrow();
 const allowed=catalogEntries(model.recognition!).find(e=>key(statePathValue(e.path))===key(statePathValue(path)))!.value;
 const template=items(f(v,4n),'set')[0],badTemplate={...id(template),payload:text('appearance/not-admitted')};
 const missing={...v,fields:new Map([...v.fields].filter(([n])=>n!==3n))},extra={...v,fields:new Map([...v.fields,[6n,true] as [bigint,CanonicalValue]])};
 for(const value of[change(3n,u(0)),change(3n,u(4)),change(3n,signed(1)),change(3n,text('Person')),change(1n,sid(1000,'foreign')),change(4n,set([badTemplate])),change(5n,text('wrong-version')),{...v,schema:{...v.schema,schemaVersion:2n}},missing,extra]){
  expect(()=>component.initialState(replace(value))).toThrow();
 }
 expect(()=>validateSeedCatalog(original,allowed)).toThrow();expect(readCatalog(original).candidateDomain).toBe('DiscreteObject');
 const absent=fixture(0),empty=fixture(0,'empty');expect(()=>component.initialState(absent.d.initialState)).not.toThrow();expect(()=>component.initialState(empty.d.initialState)).not.toThrow();
 const without=restoreAuthoritativeState(decode(absent.d.initialState)),mapping=without.entries().find(e=>e.path.rootStateTypeId===243n&&e.path.fieldId===2n)!,mv=rec(mapping.value,229n);
 const dangling={...mv,fields:new Map([...mv.fields].map(([n,x])=>[n,n===4n?b.other:x]))};
 expect(()=>component.initialState(enc(new AuthoritativeState(without.entries().map(e=>key(statePathValue(e.path))===key(statePathValue(mapping.path))?{...e,value:dangling}:e)).canonicalValue()))).toThrow('mapping candidate absent');
 expect(()=>new AuthoritativeState([...s.entries(),{path,value:original}])).toThrow();
 const patch={operations:[{kind:'set' as const,path,expected:{presence:true as const,value:original},newValue:change(3n,u(1))}]};
 for(const owner of[OWNER.Perception,OWNER.RecognitionResolution,OWNER.RecognitionKnowledge])expect(()=>component.stateModel.applyPatch(s,patch,owner,{writableRoots:[243n],targetPaths:[path]})).toThrow('immutable knowledge');
 const old=await compileCharacterState(await compileCharacterModel(b.legacy.s));expect(()=>old.initialState(b.d.initialState)).toThrow();expect(()=>old.initialState(absent.d.initialState)).toThrow();
 const m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);
 await expect(restoreCharacterRun(b.s,{initialState:fixture(3).d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()})).rejects.toThrow('commitments differ');
 const slots=[...items(decode(b.s.registry),'list')],catalog=[...items(slots[21],'list')];catalog[1]=list(items(catalog[1],'list').map(row=>{const a=items(row,'list');return key(a[0])===key(b.other)?list([a[0],list([...items(a[1],'list'),text('appearance/additional')])]):row;}));slots[21]=list(catalog);
 expect(characterModelIdentity(await prepareCharacterModel({...b.s,registry:enc(list(slots))}))).not.toEqual(characterModelIdentity(m));
 const unknown=await create(0,'empty');await through(unknown.r,2n);expect(resolutionHistory(state(unknown.r))).toHaveLength(0);expect(outputs(snap(unknown.r).outputs,232n)).toHaveLength(0);
 expect(state(unknown.r).entries().filter(e=>e.path.rootStateTypeId===243n)).toHaveLength(0);await finish(unknown.r);
 console.info('M137 BOUNDARIES PASS zero/subset/full catalogs and zero templates; exact enum/schema/observer/template and dangling mapping rejection; duplicate/old-version/wrong-S0 rejection; model/run separation; runtime writes prohibited; native empty catalog remains unknown/full queue');
},590000);
it('continuation137: missing catalog knowledge survives exact continuation and whole-instant rollback',async()=>{
 const {b,m,r}=await create(0),repeat=await createCharacterRun(m,b.d);await through(r,2n);await through(repeat,2n);exact(r,repeat);structure(r,b);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);await finish(r,[repeat,restored]);
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const before=snap(fault),save=fault.save(),original=recognition.evaluateContinuantRecognition;let calls=0;
 const spy=vi.spyOn(recognition,'evaluateContinuantRecognition').mockImplementation((...args)=>{const result=original(...args);if(args[1].experience.occurredAt===2n&&++calls===2)throw Error('M137 after consequence recognition');return result;});
 try{await expect(advance(fault)).rejects.toThrow('M137 after consequence recognition');expect(calls).toBe(2);expect({...snap(fault),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});await finish(recovered);exact(r,recovered);
 console.info('M137 CONTINUATION PASS repeat/save2/all later boundaries; missing knowledge not synthesized; post127 failure rolls both lanes/IDs back; exact recovery');
},590000);
it('privacy137: hidden truth cannot filter candidate domains or supply an absent cue',async()=>{
 const a=await create(2),b=await create(2,'hidden');for(let n=0;n<96;n++){const more=await advance(a.r);expect(await advance(b.r)).toBe(more);bytes(snap(a.r).state,snap(b.r).state);bytes(snap(a.r).outputs,snap(b.r).outputs);if(!more)break;expect(n).toBeLessThan(95);}
 const denied=await create(2,'denied');await through(denied.r,4n);expect(judgment(denied.r,denied.b,true).equals(Q.of(47n,72n))).toBe(true);await finish(denied.r);
 console.info('M137 PRIVACY PASS hidden physical truth/identity inert in all safe prefixes; denied current cue cannot select catalog candidate; live retained target judgment and execution/full queues');
},590000);
