import {it,expect,vi} from 'vitest';
import {list,text,signed,unsigned,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {restoreAuthoritativeState,AuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {isSocialEpisodePath,EPISODIC_OWNER,MEMORY_FORMATION,MEMORY_PRESENTATION} from '../assembled/memory';
import {MEMORY_USE,MEMORY_USE_VERSION} from '../assembled/memoryUse';
import * as use from '../assembled/memoryUse';
import {retainedEpisodeIds,RETENTION} from '../assembled/retention';
import {retainSignificanceFirst} from '../campaign3/significanceFirstRetention';
import {retainWithUseProtection} from '../campaign3/useProtectedRetention';
import {retainByRecency} from '../campaign3/recencyRetention';
import {presentationAccessibility} from '../campaign3/encodingAccessMath';
import {personPath,personHistory,personMean} from '../assembled/social';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {AFFECT_RECALL} from '../assembled/affectMemory';
import {WORKSPACE} from '../assembled/workspace';
import {sid} from '../assembled/skill';
import {dataField as f,dataRecord as rec,dataUnsigned as uint,dataIdentity as id} from '../campaign2/canonicalData';
import {source,data,decode,items,key,enc,target} from './fixtures/assembledMemoryUse';
import {through,outputs,draws,signedValue,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const episodes=(r:Run)=>state(r).entries().filter(e=>isSocialEpisodePath(e.path));
const at=(v:CanonicalValue)=>signedValue(items(v,'list')[5]);
const ages=(r:Run)=>episodes(r).map(e=>at(e.value)).sort((a,b)=>Number(a-b));
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const belief=(r:Run)=>state(r).read(personPath(C,target)).value;
const social=(r:Run)=>reports(r,'assembled-social-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(a=>key(a[2])===key(target))!;
const mean=(r:Run)=>items(social(r)[4],'list')[0];
async function run(law='SignificanceFirst',capacity=3,workspace=5,at=7n,hidden=false){const r=await createCharacterRun(await prepareCharacterModel(source(law,capacity,workspace)),data(hidden));await through(r,at);return r;}
function live(r:Run){expect(personHistory(belief(r))).toHaveLength(3);expect(personMean(belief(r))!.equals(Q.of(1n,3n))).toBe(true);expect(items(social(r)[4],'list')).toHaveLength(1);expect(items(reports(r,JOINT_APPRAISAL).at(-1)![4],'list').some(v=>items(v,'list').length===5)).toBe(true);}
const contains=(v:CanonicalValue,w:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='list'&&v.items.some(x=>key(x)===key(w));
const content=(r:Run)=>personHistory(belief(r)).map(v=>items(v,'list').slice(1));
it('calibration: original used tier and AgeOnly preserve ties budgets and access arithmetic',()=>{
 const rows=[{acquisition:812n,acquiredAt:1n,kind:'body' as const,useProtection:true},{acquisition:900n,acquiredAt:1n,kind:'body' as const,useProtection:true},{acquisition:2n,acquiredAt:4n,kind:'body' as const,useProtection:false}];
 const original=rows.map(a=>({id:a.acquisition,acquiredAt:a.acquiredAt,kind:'EventContinuant' as const,units:[{key:'episode',views:[new Uint8Array([42])],useProtection:a.useProtection,outcomeSignificanceDirections:[]}]}));
 for(const cap of [0,1,2,3,4])for(const law of ['SignificanceFirst','AgeOnly'] as const){const expected=(law==='SignificanceFirst'?retainSignificanceFirst:retainByRecency)(original,5n,{EventContinuant:cap,Interoceptive:0}).acquisitions.map(a=>a.id);expect(retainedEpisodeIds(rows,5n,{diagnostic:0,body:cap},law)).toEqual(expected);expect(retainedEpisodeIds([...rows].reverse(),5n,{diagnostic:0,body:cap},law)).toEqual(expected);if(law==='SignificanceFirst')expect(retainWithUseProtection(original,5n,{EventContinuant:cap,Interoceptive:0}).acquisitions.map(a=>a.id)).toEqual(expected);}
 const base=presentationAccessibility([2n,4n],7n,Q.of(1n),1);expect(base.equals(Q.of(5n,12n))).toBe(true);expect(base.add(Q.of(1n,4n).multiply(Q.of(2n))).equals(Q.of(11n,12n))).toBe(true);expect(presentationAccessibility([6n],7n,Q.of(1n),1).equals(Q.of(1n,2n))).toBe(true);
 console.info('M45 CALIBRATION exact original SF/UP/AgeOnly capacities0..4/canonical ties; A history2,4 base5/12 + pull1/4*gain2=11/12 > C1/2. Graph1/2, seed0/dice unchanged.');
});
it('connection and continuation: committed use protects old evidence and changes later live judgment',async()=>{
 const a=await run('SignificanceFirst',3,5,4n),b=await run('AgeOnly',3,5,4n),repeat=await run('SignificanceFirst',3,5,4n);
 expect(repeat.snapshot()).toEqual(a.snapshot());expect(repeat.save()).toEqual(a.save());
 for(const r of [a,b]){expect(ages(r)).toEqual([1n,2n]);expect(episodes(r).map(e=>items(e.value,'list')[7])).toEqual([true,true]);expect(reports(r,MEMORY_USE).map(v=>at(v[5]))).toEqual([2n,1n]);}
 const d=data(),restored=await restoreCharacterRun(source(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});expect(restored.snapshot()).toEqual(a.snapshot());
 await through(a,5n);await through(b,5n);expect(ages(a)).toEqual([1n,2n,5n]);expect(ages(b)).toEqual([2n,5n]);expect(items(episodes(a).find(e=>at(e.value)===5n)!.value,'list')[7]).toBe(false);
 for(const r of [a,b]){const barrier=reports(r,RETENTION).find(v=>signedValue(v[1])===5n)!;expect(barrier).toBeDefined();console.info('M45 BARRIER '+String(items(barrier[5],'list').length)+' survivors; prior-use='+items(barrier[7],'list').map(v=>items(v,'list')[1]).join(','));}
 await through(a,7n);await through(b,7n);await through(restored,7n);expect(restored.snapshot()).toEqual(a.snapshot());expect(restored.save()).toEqual(a.save());for(const r of [a,b])live(r);
 expect(mean(a)).toEqual(q(1,1));expect(mean(b)).toEqual(q(0,1));expect(content(a)).toEqual(content(b));
 for(const r of [a,b]){const selected=items(reports(r,WORKSPACE).at(-1)![4],'list');expect(selected).toHaveLength(1);expect(items(social(r)[6],'list')[3]).toEqual(list([items(selected[0],'list')[0]]));expect(items(reports(r,JOINT_APPRAISAL).at(-1)![6],'list').slice(1)).toContainEqual(list(social(r)));}
 const useRows=reports(a,MEMORY_USE),traces=outputs(a.snapshot().trace,160n);expect(useRows.length).toBeGreaterThanOrEqual(4);for(const receipt of useRows){const consumer=rec(receipt[3],130n);expect(uint(f(consumer,3n))).toBe(50n);expect(traces.some(t=>key(f(t,4n))===key(consumer)&&contains(f(t,13n),receipt[4]))).toBe(true);expect(traces.some(t=>key(f(t,6n))===key(text(MEMORY_USE_VERSION))&&contains(f(t,12n),list(receipt))&&contains(f(t,13n),list(receipt)))).toBe(true);}
 const scores=items(reports(a,AFFECT_RECALL).find(v=>signedValue(v[1])===7n)![4],'list').map(v=>items(v,'list'));const old=items(episodes(a).find(e=>at(e.value)===1n)!.value,'list');expect(scores.find(v=>uint(v[0])===uint(id(old[1]).payload))!.slice(1)).toEqual([q(5,12),q(1,4),q(11,12)]);
 console.info('M45 CONNECTION used A/B survive pressure; AgeOnly loses A; live contexts1/0, semantic1/3 both; exact repeat/save and restore4->7; draws7='+[a,b].map(r=>draws(r,7n).length).join('/'));
},600000);
it('controls: presentation alone and same-barrier use do not protect; zero and ample quotas',async()=>{
 const crowded=await run('SignificanceFirst',3,3),tight=await run('SignificanceFirst',2,5,4n),zero=await run('SignificanceFirst',0),ample=await run('SignificanceFirst',4),ampleAge=await run('AgeOnly',4);
 live(crowded);live(zero);live(ample);live(ampleAge);expect(reports(crowded,MEMORY_USE)).toHaveLength(0);expect(episodes(crowded).every(e=>items(e.value,'list')[7]===false)).toBe(true);expect(ages(crowded)).not.toContain(1n);expect(mean(crowded)).toEqual(q(1,3));
 expect(reports(tight,MEMORY_USE).some(v=>signedValue(v[1])===4n&&at(v[5])===1n)).toBe(true);expect(ages(tight)).not.toContain(1n);expect(mean(tight)).toEqual(q(1,1));const a=reports(tight,RETENTION).find(v=>signedValue(v[1])===4n)!;expect(items(a[7],'list').map(v=>items(v,'list')[1]).filter(x=>x===true)).toHaveLength(1);
 expect(episodes(zero)).toHaveLength(0);expect(mean(zero)).toEqual(q(1,3));expect(mean(ample)).toEqual(q(1,1));expect(mean(ampleAge)).toEqual(q(1,1));
 console.info('M45 CONTROLS publication without workspace use no credit; use at4 cannot rescue A at4; quota0 loss/global1/3; ample4 both context1.');
},600000);
it('epistemic control: hidden physical role cannot change use retention or judgment',async()=>{
 const a=await run(),b=await run('SignificanceFirst',3,5,7n,true);for(const r of [a,b])live(r);expect(b.snapshot().state).toEqual(a.snapshot().state);expect(social(b)).toEqual(social(a));expect(reports(b,MEMORY_USE)).toEqual(reports(a,MEMORY_USE));expect(reports(b,RETENTION)).toEqual(reports(a,RETENTION));
 console.info('M45 HIDDEN physical-role changes leave complete state/use/retention/social judgment equal.');
},600000);
it('boundaries: formation false, binary repeat, immutable evidence and public/foreign writes reject',async()=>{
 const early=await run('SignificanceFirst',3,5,2n);expect(episodes(early).every(e=>items(e.value,'list')[7]===false)).toBe(true);
 const r=await run('SignificanceFirst',3,5,4n),e=episodes(r)[0],m=await compileCharacterModel(source()),c=await compileCharacterState(m),a=[...items(e.value,'list')];a[4]=list([...items(a[4],'list'),signed(5)]);const op={kind:'set' as const,path:e.path,expected:{presence:true as const,value:e.value},newValue:list(a)};
 expect(()=>c.stateModel.applyPatch(state(r),{operations:[op]},sid(1025,'authority/person-model'))).toThrow();
 const credited=use.creditPresentedEpisode(e.value,list(a));expect(items(credited,'list')[7]).toBe(true);expect(items(credited,'list').filter((_v,i)=>i!==4)).toEqual(items(e.value,'list').filter((_v,i)=>i!==4));
 a[7]=false;expect(()=>c.stateModel.applyPatch(state(r),{operations:[{...op,newValue:list(a)}]},EPISODIC_OWNER)).toThrow('immutable');a[7]=true;a[6]=list([]);expect(()=>c.stateModel.applyPatch(state(r),{operations:[{...op,newValue:list(a)}]},EPISODIC_OWNER)).toThrow();
 const forgedFresh=[...items(e.value,'list')];forgedFresh[4]=list([]);forgedFresh[7]=true;
 const without=new AuthoritativeState(state(r).entries().filter(x=>key(x.value)!==key(e.value)));expect(()=>c.stateModel.applyPatch(without,{operations:[{kind:'set',path:e.path,expected:{presence:false},newValue:list(forgedFresh)}]},EPISODIC_OWNER)).toThrow('fresh');
 const d=data();for(const event of [MEMORY_FORMATION,MEMORY_PRESENTATION])await expect(createCharacterRun(await prepareCharacterModel(source()),{...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),list([signed(7),unsigned(140),event,e.value,list([])])]))})).rejects.toThrow();await expect(prepareCharacterModel(source('invented'))).rejects.toThrow();
 console.info('M45 BOUNDARIES fresh false/presentation no credit; repeated true never stacks; clearing/encoding rewrite, foreign owner, credited formation, external child and unknown law reject.');
},600000);
it('rollback: failure after actual use discards candidate credit and whole instant',async()=>{
 const r=await run('SignificanceFirst',3,5,3n),before=r.snapshot(),saved=r.save(),original=use.creditPresentedEpisode;let reached=false;
 const spy=vi.spyOn(use,'creditPresentedEpisode').mockImplementation((...args)=>{original(...args);reached=true;throw Error('M45 after actual use');});
 try{await expect(r.settleNextInstant()).rejects.toThrow('M45 after actual use');expect(reached).toBe(true);expect({...r.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const d=data(),restored=await restoreCharacterRun(source(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save:saved}),fresh=await run('SignificanceFirst',3,5,4n);await through(restored,4n);expect(restored.snapshot()).toEqual(fresh.snapshot());expect(restored.save()).toEqual(fresh.save());console.info('M45 ROLLBACK after-use failure leaves snapshot unchanged; saved continuation reproduces complete allocator/queue/state/trace bytes.');
},600000);
