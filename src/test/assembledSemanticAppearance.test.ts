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
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledSemanticAppearance';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs);
const reports=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M133 queue cap');}
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


const frozenAt=(r:Run,at:bigint)=>outputs(snap(r).outputs,227n).find(x=>uint(f(x,3n))===at)!;
function structure(r:Run,mode:'full'|'missing'|'negative'){
 const x=frozenAt(r,2n);expect(x).toBeDefined();const c=items(f(x,6n),'set').map(v=>rec(v,225n)),e=items(f(x,7n),'set').map(v=>rec(v,226n));
 expect(c).toHaveLength(6);expect(new Set(c.map(v=>key(f(v,5n)))).size).toBe(6);expect(c.every(v=>f(v,6n)===true)).toBe(true);
 expect(e).toHaveLength(mode==='missing'?2:3);const rope=e.find(v=>key(id(f(v,5n)).payload)===key(text(Facet.AppearsRopeSkippingPatternLike)));
 if(mode==='missing')expect(rope).toBeUndefined();else expect(f(rope!,6n)).toBe(mode==='full');
 const features=outputs(snap(r).outputs,221n).filter(v=>uint(f(v,9n))===2n),eventFeatures=outputs(snap(r).outputs,222n).filter(v=>uint(f(v,10n))===2n);
 expect(features).toHaveLength(6);expect(eventFeatures).toHaveLength(mode==='missing'?4:5);
 const ids=new Set([...features,...eventFeatures].map(v=>key(f(v,1n))));for(const v of[...c,...e])for(const ref of items(f(v,8n),'set'))expect(ids.has(key(ref)),'actual allocated feature support').toBe(true);
 const memory=state(r).entries().filter(v=>isSocialEpisodePath(v.path)).map(v=>items(v.value,'list')).find(a=>key(a[5])===key(signed(2)))!;
 expect(memory,'actual selected episode').toBeDefined();expect(memory[3]).toEqual(x);return x;
}
it('primary133: full appearance evidence reaches memory and actual later use without becoming identity or pressure',async()=>{
 const runs=[] as Awaited<ReturnType<typeof create>>[];
 for(const mode of['full','negative','missing'] as const){const x=await create(mode);runs.push(x);await through(x.r,2n);structure(x.r,mode);await through(x.r,4n);}
 const p=runs.map(x=>judgment(x.r,x.b,true));expect(p.every(x=>x.equals(p[0])),'appearance alone cannot author choice').toBe(true);
 const histories=runs.map(x=>state(x.r).read(personPath(C,target)).value);expect(histories[0]).toEqual(histories[1]);expect(histories[0]).toEqual(histories[2]);
 for(const x of runs){await through(x.r,21n);
  const workspace=reports(x.r,WORKSPACE).at(-1)!,selected=items(workspace[4],'list').map(v=>items(v,'list'));
  const recalled=selected.map(a=>items(a[1],'list')).filter(a=>key(a[0])===key(text(SOCIAL_EPISODE)));expect(recalled.length,'actual social recall').toBeGreaterThan(0);
  for(const a of recalled){const full=rec(a[3],227n);expect(items(f(full,6n),'set')).toHaveLength(6);expect(items(f(full,7n),'set').length).toBeGreaterThan(0);}
  const appraisal=reports(x.r,'assembled-social-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(a=>key(a[2])===key(target))!;
  expect(items(items(appraisal[6],'list')[3],'list'),'actual recalled report consumer').toEqual(recalled.map(a=>a[1]));
  await finish(x.r);
 }
 const withdrawal=await create('full',true);await through(withdrawal.r,4n);const other=judgment(withdrawal.r,withdrawal.b,false);expect(other.equals(p[0])).toBe(false);await finish(withdrawal.r);
 console.info('M133 PRIMARY PASS six continuant/three event facets; true/false/absent conjunction; actual allocated support; full experience -> episode -> recall -> appraisal; feature-only P='+p[0].numerator+'/'+p[0].denominator+'; rich withdrawal P='+other.numerator+'/'+other.denominator+'; full queues');
},590000);
it('boundaries133: exact independent feature grammar, no hidden or classification identity shortcut',async()=>{
 for(const sample of[list([]),list([list([])]),list([list([list([text('unadmitted'),true,true])]),list([])]),list([list([list([text(CONTINUANT_FEATURES[0]),true,u(1)])]),list([])])])expect(()=>appearanceSource(sample)).toThrow();
 const tuple=list([text(CONTINUANT_FEATURES[0]),false,false]);expect(()=>appearanceSource(list([list([tuple,tuple]),list([])]))).toThrow('duplicate');
 expect(appearanceSource(list([list([tuple]),list([])]))).toEqual(list([list([]),list([])]));
 const all=list([list([...CONTINUANT_FEATURES].reverse().map(x=>list([text(x),false,true]))),list([])]),safe=items(appearanceSource(all),'list');expect(items(safe[0],'list').map(v=>items(v,'list')[1])).toEqual(CONTINUANT_FEATURES.map(()=>false));
 const b=fixture(),old=await prepareCharacterModel(b.legacy.s);await expect(createCharacterRun(old,b.d)).rejects.toThrow('appearance');
 console.info('M133 BOUNDARIES PASS typed six/five feature domains, duplicates, hidden/false, canonical order, old grammar');
},590000);
it('continuation133: both classification sets survive exact restore and classifier rollback',async()=>{
 const {b,m,r}=await create(),repeat=await createCharacterRun(m,b.d);await through(r,2n);await through(repeat,2n);exact(r,repeat);structure(r,'full');
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);await finish(r,[repeat,restored]);
 const fault=await createCharacterRun(m,b.d);await through(fault,1n);const before=snap(fault),save=fault.save(),original=classification.classifyPerceptualEvent;let reached=false;
 const spy=vi.spyOn(classification,'classifyPerceptualEvent').mockImplementation((...args)=>{const result=original(...args);if(args[1].occurredAt===2n){reached=true;throw Error('M133 after event classification');}return result;});
 try{await expect(advance(fault)).rejects.toThrow('M133 after event classification');expect(reached).toBe(true);expect({...snap(fault),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});await finish(recovered);exact(r,recovered);
 console.info('M133 CONTINUATION PASS full classification bytes in repeat/save2/every later prefix; whole-instant rollback and recovered continuation');
},590000);
it('privacy133: denied feature polarity and hidden truth never enter experience or cognition',async()=>{
 const a=await create('missing'),b=await create('hidden');
 for(let n=0;n<96;n++){const more=await advance(a.r);expect(await advance(b.r)).toBe(more);bytes(snap(a.r).state,snap(b.r).state);bytes(snap(a.r).outputs,snap(b.r).outputs);if(!more)break;expect(n).toBeLessThan(95);}
 const denied=await create('denied');await through(denied.r,4n);expect(frozenAt(denied.r,2n)).toBeUndefined();judgment(denied.r,denied.b,false);await finish(denied.r);
 console.info('M133 PRIVACY PASS masked feature/truth changes inert in all safe prefixes; global denied source has no experience/learning credit');
},590000);
