import {it,expect,vi} from 'vitest';
import {list,text,signed,unsigned,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {isSocialEpisodePath,EPISODIC_OWNER,MEMORY_PRESENTATION} from '../assembled/memory';
import {AFFECT_MEMORY,AFFECT_RECALL,AFFECT_MEMORY_VERSION,compileAffectMemory,unpackAffectCue} from '../assembled/affectMemory';
import {personPath,personHistory,personMean} from '../assembled/social';
import {REAPPRAISAL_APPRAISAL} from '../assembled/reappraisal';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {BODY_OBSERVER} from '../assembled/body';
import {WORKSPACE} from '../assembled/workspace';
import {sid} from '../assembled/skill';
import {dataField as f,dataRecord as rec,dataUnsigned as uint,dataIdentity as id} from '../campaign2/canonicalData';
import {readQ,bounded} from '../campaign2/cognitiveMath';
import {createAffectRetrievalRun} from '../campaign3/affectRetrieval';
import * as publication from '../campaign3/recollectionProduction';
import {affectRetrievalCases} from './affectRetrievalFixtures';
import {source,data,decode,items,key,enc,target,type Mode} from './fixtures/assembledAffectMemory';
import {through,outputs,draws,signedValue,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const episodes=(r:Run)=>state(r).entries().filter(e=>isSocialEpisodePath(e.path));
const belief=(r:Run)=>state(r).read(personPath(C,target)).value;
const social=(r:Run)=>reports(r,'assembled-social-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(p=>key(p[2])===key(target))!;
const mean=(r:Run)=>items(social(r)[4],'list')[0];
const audit=(r:Run)=>reports(r,AFFECT_RECALL).find(a=>signedValue(a[1])===4n)!;
const frac=(v:CanonicalValue)=>{const n=readQ(v);return `${n.numerator}/${n.denominator}`;};
const json=(v:unknown)=>JSON.stringify(v,(_k,x)=>typeof x==='bigint'?String(x):x);
async function run(law='UncontrolledGain',mode:Mode='main',graph=true,slots=1,workspace=5,at=4n){const r=await createCharacterRun(await prepareCharacterModel(source(law,graph,slots,workspace)),data(mode));await through(r,at);return r;}
function live(r:Run){expect(personHistory(belief(r))).toHaveLength(2);expect(personMean(belief(r))!.equals(readQ(q(1,2)))).toBe(true);expect(items(social(r)[4],'list')).toHaveLength(1);const joint=reports(r,JOINT_APPRAISAL).at(-1)!;expect(joint).toBeDefined();expect(items(joint[4],'list').some(v=>items(v,'list').length===5)).toBe(true);}
function projected(r:Run){const a=audit(r),byId=new Map(episodes(r).map(e=>{const x=items(e.value,'list');return [uint(id(x[1]).payload),signedValue(x[5])];}));return {gain:frac(a[3]),scores:items(a[4],'list').map(v=>{const x=items(v,'list');return {at:byId.get(uint(x[0])),base:frac(x[1]),pull:frac(x[2]),score:frac(x[3])};}).sort((a,b)=>Number(a.at!-b.at!)),winner:items(a[5],'list').map(v=>byId.get(uint(items(v,'list')[0]))),mean:frac(mean(r)),draws:draws(r,4n).length};}
it('calibration: fixed original rank and unchanged reason thresholds before behavior',async()=>{
 const defs=items(items(decode(source().registry),'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n)),dice=rec(f(defs.find(v=>key(f(v,1n))===key(sid(1027,'definition/task-reason-dice')))!,4n),437n);expect(f(dice,2n)).toEqual(q(37,100));expect(bounded(readQ(q(1,1))).equals(readQ(q(1,2)))).toBe(true);expect(bounded(readQ(q(0,1))).equals(readQ(q(0,1)))).toBe(true);
 for(const law of ['UncontrolledGain','NoFeedback'] as const){const old=createAffectRetrievalRun(law,affectRetrievalCases().high);for(let i=0;i<4;i++)await old.step();const a=old.snapshot().rows[3];expect(a.gain).toBe(law==='UncontrolledGain'?'2/1':'1/1');expect(a.selected).toBe(law==='UncontrolledGain'?1:2);expect(a.scores.map(s=>[s.base,s.pull,s.score])).toEqual([['1/3','1/8',law==='UncontrolledGain'?'7/12':'11/24'],['1/2','0/1','1/2']]);}
 console.info('M43 CALIBRATION original A base1/3 pull1/8:7/12 vs11/24; B1/2. Fixed threshold37/100, raw1->1/2,0->0. Judgment gate; no choice claim, seed0.');
});
it('connection: fixed episodes cue and history reproduce original gain winner and consumed judgment',async()=>{
 const a=await run('UncontrolledGain','main',true,1,5,3n),b=await run('NoFeedback','main',true,1,5,3n);expect(episodes(a)).toEqual(episodes(b));const before=episodes(a);expect(before.map(e=>items(e.value,'list')[4])).toEqual([list([signed(2)]),list([signed(3)])]);await through(a,4n);await through(b,4n);for(const r of [a,b])live(r);
 expect(projected(a)).toMatchObject({gain:'2/1',scores:[{at:1n,base:'1/3',pull:'1/8',score:'7/12'},{at:2n,base:'1/2',pull:'0/1',score:'1/2'}],winner:[1n],mean:'1/1'});expect(projected(b)).toMatchObject({gain:'1/1',scores:[{at:1n,base:'1/3',pull:'1/8',score:'11/24'},{at:2n,base:'1/2',pull:'0/1',score:'1/2'}],winner:[2n],mean:'0/1'});
 expect(audit(a)[2]).toEqual(audit(b)[2]);for(const r of [a,b])expect(audit(r)[6]).toEqual(list([BODY_OBSERVER,C]));expect(belief(a)).toEqual(belief(b));for(const r of [a,b]){expect(episodes(r).map(e=>items(e.value,'list').filter((_v,i)=>i!==4))).toEqual(before.map(e=>items(e.value,'list').filter((_v,i)=>i!==4)));expect(items(reports(r,JOINT_APPRAISAL).at(-1)![6],'list').slice(1)).toContainEqual(list(social(r)));const selected=items(reports(r,WORKSPACE).at(-1)![4],'list');expect(selected).toHaveLength(1);expect(items(social(r)[6],'list')[3]).toEqual(list([items(selected[0],'list')[0]]));}
 expect(reports(a,JOINT_APPRAISAL).at(-1)![4]).not.toEqual(reports(b,JOINT_APPRAISAL).at(-1)![4]);const traces=outputs(a.snapshot().trace,160n),recall=traces.find(t=>key(f(t,6n))===key(text(AFFECT_MEMORY_VERSION))&&signedValue(f(rec(f(t,4n),130n),2n))===4n&&uint(f(rec(f(t,4n),130n),3n))===20n)!;expect(recall).toBeDefined();const e=rec(f(recall,4n),130n),source=unpackAffectCue(f(e,6n),4n).source;expect(items(f(e,8n),'list')).toContainEqual(unsigned(source!));expect(items(f(recall,11n),'list')).toHaveLength(2);
 console.info('M43 CONNECTION '+json([projected(a),projected(b)]));
},600000);
it('controls: zero unknown late current and hidden evidence preserve prior-only affect access',async()=>{
 const primary=await run();for(const mode of ['zero','unknown','late','current','hidden'] as const){const r=await run('UncontrolledGain',mode);live(r);expect(projected(r).winner).toEqual(['zero','unknown','late'].includes(mode)?[2n]:[1n]);if(mode==='late'){expect(items(reports(r,REAPPRAISAL_APPRAISAL).at(-1)![6],'list')).toEqual([q(1,1),q(1,1)]);expect(unpackAffectCue(audit(r)[2],4n).carry?.status).toBe('Unavailable');}if(mode==='current'){expect(items(reports(r,REAPPRAISAL_APPRAISAL).at(-1)![6],'list')).toEqual([q(1,2),q(1,2)]);expect(projected(r).gain).toBe('2/1');}if(mode==='zero')expect(unpackAffectCue(audit(r)[2],4n).carry?.status).toBe('Known');if(mode==='unknown')expect(unpackAffectCue(audit(r)[2],4n).carry?.status).toBe('Unavailable');if(mode==='hidden'){expect(episodes(r)).toEqual(episodes(primary));expect(social(r)).toEqual(social(primary));expect(reports(r,WORKSPACE)).toEqual(reports(primary,WORKSPACE));}console.info('M43 SOURCE '+mode+' '+json(projected(r)));}
},600000);
it('access: denied cue empty graph zero slots and crowded workspace retain distinct effects',async()=>{
 for(const [name,mode,graph,slots,workspace,expected]of [['denied','denied',true,1,5,q(1,2)],['graph','main',false,1,5,q(0,1)],['slots','main',true,0,5,q(1,2)],['workspace','main',true,1,3,q(1,2)]] as const){const r=await run('UncontrolledGain',mode,graph,slots,workspace);live(r);expect(mean(r)).toEqual(expected);expect(episodes(r)).toHaveLength(2);if(name==='denied')expect(audit(r)).toBeUndefined();if(name==='graph')expect(projected(r).scores.every(s=>s.pull==='0/1')).toBe(true);if(name==='workspace')expect(projected(r).winner).toEqual([1n]);console.info('M43 ACCESS '+name+' mean='+frac(mean(r)));}
},600000);
it('persistence: exact repeat and restore carry earlier affect and presentation histories',async()=>{
 const s=source(),d=data(),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,3n);await through(b,3n);expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});expect(restored.snapshot()).toEqual(a.snapshot());await through(a,4n);await through(restored,4n);expect(restored.snapshot()).toEqual(a.snapshot());expect(restored.save()).toEqual(a.save());expect(episodes(a).map(e=>items(e.value,'list')[4])).toEqual([list([signed(2),signed(4)]),list([signed(3)])]);console.info('M43 PERSISTENCE exact3->4');
},600000);
it('boundaries: foreign owner content rewrite direct publication and inadmissible graph reject',async()=>{
 const r=await run(),e=episodes(r)[0],m=await compileCharacterModel(source()),c=await compileCharacterState(m),a=[...items(e.value,'list')];a[4]=list([...items(a[4],'list'),signed(5)]);const op={kind:'set' as const,path:e.path,expected:{presence:true as const,value:e.value},newValue:list(a)};expect(()=>c.stateModel.applyPatch(state(r),{operations:[op]},sid(1025,'authority/person-model'))).toThrow();a[1]={kind:'typedIdentifier',namespaceId:1125n,payload:unsigned(999)};expect(()=>c.stateModel.applyPatch(state(r),{operations:[{...op,newValue:list(a)}]},EPISODIC_OWNER)).toThrow('immutable');
 const d=data();await expect(createCharacterRun(await prepareCharacterModel(source()),{...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),list([signed(4),unsigned(140),MEMORY_PRESENTATION,list([text('forged'),e.value]),list([])])]))})).rejects.toThrow();expect(()=>unpackAffectCue(audit(r)[2],3n)).toThrow('prior');expect(()=>compileAffectMemory(list([text(AFFECT_MEMORY),text('UncontrolledGain'),list([list([target,unsigned(1),unsigned(1),unsigned(1),q(1,4)])])]),[target],8)).toThrow();expect(()=>compileAffectMemory(list([text(AFFECT_MEMORY),text('UncontrolledGain'),list([])]),[target],33)).toThrow();console.info('M43 BOUNDARIES PASS');
},600000);
it('rollback: injected failure after actual publication leaves whole instant unchanged',async()=>{
 const r=await run('UncontrolledGain','main',true,1,5,3n),before=r.snapshot(),saved=r.save(),publish=publication.publishRecollections;const spy=vi.spyOn(publication,'publishRecollections').mockImplementation((view,allocate)=>{publish(view,allocate);throw Error('M43 after-publication fault');});try{await expect(r.settleNextInstant()).rejects.toThrow('M43 after-publication fault');expect({...r.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}const d=data(),restored=await restoreCharacterRun(source(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save:saved});await through(restored,4n);live(restored);expect(mean(restored)).toEqual(q(1,1));console.info('M43 ROLLBACK after real publication; exact snapshot rollback and successful restored continuation');
},600000);
