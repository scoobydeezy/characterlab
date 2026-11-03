import {it,expect,vi} from 'vitest';
import {list,text,signed,unsigned,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState,AuthoritativeState} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {source as socialSource,data as socialData} from './fixtures/assembledMemoryUse';
import {BODY_MEMORY_USE_RULES,BODY_MEMORY_USE_REGISTRY} from '../assembled/model';
import {MEMORY_USE} from '../assembled/memoryUse';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {isBodyEpisodePath,EPISODIC_OWNER,MEMORY_FORMATION,MEMORY_PRESENTATION} from '../assembled/memory';
import {BODY_MEMORY_USE,BODY_MEMORY_USE_VERSION} from '../assembled/memoryUse';
import * as use from '../assembled/memoryUse';
import {retainedEpisodeIds,RETENTION} from '../assembled/retention';
import {retainSignificanceFirst} from '../campaign3/significanceFirstRetention';
import {retainWithUseProtection} from '../campaign3/useProtectedRetention';
import {retainByRecency} from '../campaign3/recencyRetention';
import {deficitPressure} from '../campaign3/embodiedMath';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {sid} from '../assembled/skill';
import {dataField as f,dataRecord as rec,dataUnsigned as uint,dataIdentity as id} from '../campaign2/canonicalData';
import {source,data,decode,items,key,enc} from './fixtures/assembledBodyMemoryUse';
import {through,outputs,draws,signedValue,type Run} from './fixtures/assembledComparison';
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const episodes=(r:Run)=>state(r).entries().filter(e=>isBodyEpisodePath(e.path));
const age=(v:CanonicalValue)=>signedValue(items(v,'list')[5]);
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const joint=(r:Run)=>reports(r,JOINT_APPRAISAL).at(-1)!;
const mode=(r:Run)=>items(joint(r)[5],'list')[1];
async function run(law='SignificanceFirst',capacity=1,at=5n,variant:Parameters<typeof data>[0]='main'){const r=await createCharacterRun(await prepareCharacterModel(source(law,capacity)),data(variant));await through(r,at);return r;}
function live(r:Run){expect(mode(r)).toEqual(text('RecalledContext'));const rows=items(joint(r)[4],'list').map(v=>items(v,'list'));expect(rows.length).toBeGreaterThan(0);expect(rows.every(a=>a.length===5)).toBe(true);return rows;}
const contains=(v:CanonicalValue,w:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='list'&&v.items.some(x=>key(x)===key(w));
it('calibration: original body used tier and exact pressure before native comparison',()=>{
 const rows=[{acquisition:812n,acquiredAt:1n,kind:'body' as const,useProtection:true},{acquisition:900n,acquiredAt:1n,kind:'body' as const,useProtection:true},{acquisition:2n,acquiredAt:4n,kind:'body' as const,useProtection:false}];
 const original=rows.map(a=>({id:a.acquisition,acquiredAt:a.acquiredAt,kind:'Interoceptive' as const,units:[{key:'episode',views:[new Uint8Array([42])],useProtection:a.useProtection,outcomeSignificanceDirections:[]}]}));
 for(const cap of [0,1,2,3,4])for(const law of ['SignificanceFirst','AgeOnly'] as const){const expected=(law==='SignificanceFirst'?retainSignificanceFirst:retainByRecency)(original,5n,{EventContinuant:0,Interoceptive:cap}).acquisitions.map(a=>a.id);expect(retainedEpisodeIds(rows,5n,{diagnostic:0,body:cap},law)).toEqual(expected);expect(retainedEpisodeIds([...rows].reverse(),5n,{diagnostic:0,body:cap},law)).toEqual(expected);if(law==='SignificanceFirst')expect(retainWithUseProtection(original,5n,{EventContinuant:0,Interoceptive:cap}).acquisitions.map(a=>a.id)).toEqual(expected);}
 expect(deficitPressure(Q.of(10n),Q.of(60n)).equals(Q.of(5n,6n))).toBe(true);expect(deficitPressure(Q.of(90n),Q.of(60n)).equals(Q.of(0n))).toBe(true);
 // A current candidate credit must not be inserted into this prior-read input.
 expect(retainedEpisodeIds([{...rows[0],useProtection:false},rows[2]],4n,{body:1,diagnostic:0},'SignificanceFirst')).toEqual([2n]);
 console.info('M46 CALIBRATION original SF/UP/AgeOnly Interoceptive capacities0..4/ties; upper-bin10/90 threshold60 =>5/6/0; prior-use ordering unchanged.');
});
it('connection and continuation: real body use protects evidence and changes later live appraisal',async()=>{
 const a=await run('SignificanceFirst',1,2n),b=await run('AgeOnly',1,2n),repeat=await run('SignificanceFirst',1,2n);expect(repeat.snapshot()).toEqual(a.snapshot());expect(repeat.save()).toEqual(a.save());
 for(const r of [a,b]){live(r);expect(episodes(r)).toHaveLength(1);expect(age(episodes(r)[0].value)).toBe(1n);expect(items(episodes(r)[0].value,'list')[6]).toBe(true);expect(reports(r,BODY_MEMORY_USE)).toHaveLength(1);}
 const d=data(),restored=await restoreCharacterRun(source(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});expect(restored.snapshot()).toEqual(a.snapshot());
 await through(a,4n);await through(b,4n);expect(episodes(a).map(e=>age(e.value))).toEqual([1n]);expect(episodes(b).map(e=>age(e.value))).toEqual([4n]);expect(items(episodes(b)[0].value,'list')[6]).toBe(false);
 await through(a,5n);await through(b,5n);await through(restored,5n);expect(restored.snapshot()).toEqual(a.snapshot());expect(restored.save()).toEqual(a.save());const aa=live(a),bb=live(b);expect(aa.map(v=>v[0])).toEqual(bb.map(v=>v[0]));expect(aa.every(v=>key(v[2])===key(q(5,6)))).toBe(true);expect(bb.every(v=>key(v[2])===key(q(0,1)))).toBe(true);expect(aa.some((v,i)=>key(v[4])!==key(bb[i][4]))).toBe(true);expect(f(rec(f(rec(joint(a)[2],461n),5n),462n),2n)).toEqual(q(10,1));expect(f(rec(f(rec(joint(b)[2],461n),5n),462n),2n)).toEqual(q(90,1));
 for(const r of [a,b]){const receipts=reports(r,BODY_MEMORY_USE),traces=outputs(r.snapshot().trace,160n);for(const receipt of receipts){const consumer=rec(receipt[3],130n);expect(uint(f(consumer,3n))).toBe(50n);expect(traces.some(t=>key(f(t,4n))===key(consumer)&&contains(f(t,13n),receipt[4]))).toBe(true);expect(traces.some(t=>key(f(t,6n))===key(text(BODY_MEMORY_USE_VERSION))&&contains(f(t,12n),list(receipt))&&contains(f(t,13n),list(receipt)))).toBe(true);}}
 console.info('M46 CONNECTION used A1 survives4 vs AgeOnly B4; live recalled-context pressure5/6 vs0; exact repeat/save and restore2->5; draws5='+[a,b].map(r=>draws(r,5n).length).join('/')+'; no sampled-choice claim.');
},600000);
it('controls: recall alone current precedence zero and ample quotas',async()=>{
 const unused=await run('SignificanceFirst',1,4n,'unused');expect(reports(unused,BODY_MEMORY_USE)).toHaveLength(0);expect(episodes(unused).map(e=>age(e.value))).toEqual([4n]);expect(items(episodes(unused)[0].value,'list')[6]).toBe(false);
 // Same barrier: a normally perceived stand-in claim at2 creates a competing social episode; tasks remain physical.
 const barrier=await run('SignificanceFirst',1,2n,'same-barrier');live(barrier);expect(reports(barrier,BODY_MEMORY_USE)).toHaveLength(1);expect(episodes(barrier)).toHaveLength(0);const retention=reports(barrier,RETENTION).find(v=>signedValue(v[1])===2n)!;expect(items(retention[7],'list').every(v=>items(v,'list')[1]===false)).toBe(true);
 const current=await run('SignificanceFirst',1,2n,'current');expect(mode(current)).toEqual(text('Current'));expect(reports(current,BODY_MEMORY_USE)).toHaveLength(0);expect(episodes(current).map(e=>age(e.value))).toEqual([2n]);
 const zero=await run('SignificanceFirst',0);expect(episodes(zero)).toHaveLength(0);expect(mode(zero)).toEqual(text('Unavailable'));expect(reports(zero,BODY_MEMORY_USE)).toHaveLength(0);
 const ample=await run('SignificanceFirst',2),ageOnly=await run('AgeOnly',2);const aa=live(ample),bb=live(ageOnly);expect(aa).toEqual(bb);expect(episodes(ample).map(e=>age(e.value))).toEqual([1n,4n]);expect(aa.every(v=>key(v[2])===key(q(0,1)))).toBe(true);
 console.info('M46 CONTROLS same-barrier actual use cannot rescue A from new perceived social episode; recall-alone no credit; current perception prevents memory credit; zero quota unavailable; ample2 same latest-body appraisal.');
},600000);
it('epistemic: within-bin hidden reserve does not alter cognitive memory/use/appraisal',async()=>{
 const a=await run(),b=await run('SignificanceFirst',1,5n,'hidden');live(a);live(b);expect(b.snapshot().state).not.toEqual(a.snapshot().state);expect(episodes(b)).toEqual(episodes(a));expect(joint(b)).toEqual(joint(a));expect(reports(b,BODY_MEMORY_USE)).toEqual(reports(a,BODY_MEMORY_USE));expect(reports(b,RETENTION)).toEqual(reports(a,RETENTION));console.info('M46 HIDDEN reserve10/10.5 same observed bins; memory/use/retention/judgment equal.');
},600000);
it('boundaries: fresh false binary metadata immutable source and external writes',async()=>{
 const early=await run('SignificanceFirst',1,1n);expect(items(episodes(early)[0].value,'list')[6]).toBe(false);
 const r=await run('SignificanceFirst',1,2n),e=episodes(r)[0],m=await compileCharacterModel(source()),c=await compileCharacterState(m),a=[...items(e.value,'list')],op={kind:'set' as const,path:e.path,expected:{presence:true as const,value:e.value},newValue:e.value};expect(use.creditBodyEpisode(e.value)).toEqual(e.value);
 expect(()=>c.stateModel.applyPatch(state(r),{operations:[op]},sid(1025,'authority/person-model'))).toThrow();a[6]=false;expect(()=>c.stateModel.applyPatch(state(r),{operations:[{...op,newValue:list(a)}]},EPISODIC_OWNER)).toThrow('immutable');a[6]=true;a[5]=signed(0);expect(()=>use.assertBodyUseUpdate(e.value,list(a))).toThrow('immutable');
 const without=new AuthoritativeState(state(r).entries().filter(x=>key(x.value)!==key(e.value)));expect(()=>c.stateModel.applyPatch(without,{operations:[{kind:'set',path:e.path,expected:{presence:false},newValue:e.value}]},EPISODIC_OWNER)).toThrow('fresh');
 const d=data();for(const event of [MEMORY_FORMATION,MEMORY_PRESENTATION])await expect(createCharacterRun(await prepareCharacterModel(source()),{...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),list([signed(5),unsigned(140),event,list([text(BODY_MEMORY_USE),e.value]),list([])])]))})).rejects.toThrow();
 console.info('M46 BOUNDARIES no authored credit; fresh false; repeated true binary; source immutable; foreign writer/clearing/fresh true/external child reject.');
},600000);
it('rollback: failed actual-use settlement leaves whole instant unchanged',async()=>{
 const r=await run('SignificanceFirst',1,1n),before=r.snapshot(),saved=r.save(),original=use.creditBodyEpisode;let reached=false;const spy=vi.spyOn(use,'creditBodyEpisode').mockImplementation(v=>{original(v);reached=true;throw Error('M46 after body use');});
 try{await expect(r.settleNextInstant()).rejects.toThrow('M46 after body use');expect(reached).toBe(true);expect({...r.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const d=data(),restored=await restoreCharacterRun(source(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save:saved}),fresh=await run('SignificanceFirst',1,2n);await through(restored,2n);expect(restored.snapshot()).toEqual(fresh.snapshot());expect(restored.save()).toEqual(fresh.save());console.info('M46 ROLLBACK actual use failure leaves state/outputs/trace/queue unchanged; saved continuation exact.');
},600000);

it('regression: M45 social connection survives the0.47 body representation',async()=>{
 for(const law of ['SignificanceFirst','AgeOnly']){const old=socialSource(law),s={...old,rulesVersion:BODY_MEMORY_USE_RULES,registrySchemaVersion:BODY_MEMORY_USE_REGISTRY},r=await createCharacterRun(await prepareCharacterModel(s),socialData());await through(r,7n);const report=reports(r,'assembled-social-people/0.1/appraisal').at(-1)!,rows=report.slice(1).map(v=>items(v,'list')),liveSocial=rows.find(a=>items(a[4],'list').length===1)!;expect(liveSocial).toBeDefined();expect(items(joint(r)[4],'list').some(v=>items(v,'list').length===5)).toBe(true);expect(items(liveSocial[4],'list')[0]).toEqual(q(law==='SignificanceFirst'?1:0,1));expect(reports(r,MEMORY_USE).length).toBeGreaterThanOrEqual(4);expect(reports(r,BODY_MEMORY_USE)).toHaveLength(0);expect(episodes(r).every(e=>items(e.value,'list').length===7)).toBe(true);}
 console.info('M46 REGRESSION original M45 inputs under0.47 preserve live social means1/0 and social-use receipts; merely recalled body earns no credit.');
},600000);
