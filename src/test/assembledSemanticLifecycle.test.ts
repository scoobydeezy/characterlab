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
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledSemanticLifecycle';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs);
const reports=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M134 queue cap');}
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



const frozenAt=(r:Run,at:bigint)=>outputs(snap(r).outputs,227n).find(x=>uint(f(x,3n))===at&&items(f(x,6n),'set').length===6)!;
const trackAt=(r:Run,at:bigint)=>f(rec(items(f(frozenAt(r,at),5n),'set')[0],224n),4n);
const eventAt=(r:Run,at:bigint)=>items(f(frozenAt(r,at),4n),'set')[0];
function structure(r:Run,b:ReturnType<typeof fixture>,earlier:CanonicalValue[]){
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
 const recalled=selected.map(a=>items(a[1],'list')).filter(a=>key(a[0])===key(text(SOCIAL_EPISODE)));console.info('M134 selected acquisition times retired='+retired+': '+recalled.map(a=>String((a[5] as {value:bigint}).value)).join(','));const old=recalled.find(a=>!retired||key(a[5])===key(signed(1)))!;
 expect(old,'retired-file experience actually recalled').toBeDefined();expect(old[3]).toEqual(frozenAt(r,(old[5] as {value:bigint}).value));
 const row=reports(r,'assembled-social-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(a=>key(a[2])===key(target))!;
 expect(items(items(row[6],'list')[3],'list'),'actual memory consumer').toContainEqual(old[1]);
}
it('primary134: explicit lifecycle preserves history and changes later choice only through current recognition',async()=>{
 const results=[] as Q[];
 for(const mode of ['continued','reacquire','split','eventSplit'] as const){
  const {b,r}=await create(mode);await through(r,1n);const earlier=outputs(snap(r).outputs,236n);expect(earlier).toHaveLength(1);
  await through(r,2n);structure(r,b,earlier);await through(r,4n);
  const known=mode==='continued'||mode==='eventSplit';results.push(judgment(r,b,known));
  const reportsNow=personHistory(state(r).read(personPath(C,target)).value);expect(reportsNow).toHaveLength(known?2:1);
  expect(key(trackAt(r,3n))).toBe(key(trackAt(r,2n)));
  await retainedUse(r,mode==='reacquire'||mode==='split');await finish(r);
 }
 expect(results[0].equals(Q.of(47n,72n))).toBe(true);expect(results[1].equals(Q.of(1n))).toBe(true);
 expect(results[2].equals(results[1])).toBe(true);expect(results[3].equals(results[0])).toBe(true);
 console.info('M134 PRIMARY PASS explicit track/event ends; fresh ordinals; event continuation/split; exact support; old recognition/memory retained and actually consumed; live actual P(B)47/72 vs1; split-only/retirement equivalence; complete queues');
},590000);
it('continuation134: retirement and continuation restore exactly and a later fault rolls back endings',async()=>{
 const {b,m,r}=await create(),repeat=await createCharacterRun(m,b.d);await through(r,2n);await through(repeat,2n);exact(r,repeat);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);await finish(r,[repeat,restored]);
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const before=snap(fault),save=fault.save(),original=classification.classifyPerceptualEvent;let reached=false;
 const spy=vi.spyOn(classification,'classifyPerceptualEvent').mockImplementation((...args)=>{const result=original(...args);if(args[1].occurredAt===2n){reached=true;throw Error('M134 after both retirements');}return result;});
 try{await expect(advance(fault)).rejects.toThrow('M134 after both retirements');expect(reached).toBe(true);expect({...snap(fault),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});await finish(recovered);exact(r,recovered);
 console.info('M134 CONTINUATION PASS repeat/save2/all later prefixes; post-retirement rollback and recovered whole continuation');
},590000);
it('boundaries134: malformed or contradictory lifecycle and foreign/future/reused/absent files reject',async()=>{
 for(const v of[true,list([]),list([true,true,false,false]),list([false,false,true,true]),list([false,false,false,u(0)])])expect(()=>lifecycleSource(v)).toThrow();
 const {b,m,r}=await create();await through(r,2n);const settings=await compileCharacterModel(b.s),model=(await compileCharacterState(settings)).stateModel,s=state(r),old=restorePerceptualReferentId(trackAt(r,1n)),p=activeContinuantFilePath(old);
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
 const legacy=await prepareCharacterModel(b.legacy.s);await expect(createCharacterRun(legacy,b.d)).rejects.toThrow('continuity');
 await finish(r);console.info('M134 BOUNDARIES PASS strict flags; retired/future/foreign files; no end twice/reuse/wrong owner; immutable attachment; absent prior and old grammar');
},590000);
it('privacy134: hidden truth and denied ending cannot mutate perception or recognition',async()=>{
 const a=await create('reacquire'),b=await create('hidden');
 for(let n=0;n<96;n++){const more=await advance(a.r);expect(await advance(b.r)).toBe(more);bytes(snap(a.r).state,snap(b.r).state);bytes(snap(a.r).outputs,snap(b.r).outputs);if(!more)break;expect(n).toBeLessThan(95);}
 const denied=await create('denied');await through(denied.r,4n);expect(outputs(snap(denied.r).outputs,218n)).toHaveLength(0);expect(outputs(snap(denied.r).outputs,220n)).toHaveLength(0);expect(frozenAt(denied.r,2n)).toBeUndefined();judgment(denied.r,denied.b,false);await finish(denied.r);
 console.info('M134 PRIVACY PASS hidden truth/feature inert; globally denied endings cannot retire files or credit reports');
},590000);
