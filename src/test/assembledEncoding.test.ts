import {it,expect,vi} from 'vitest';
import {list,text,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {ENCODING,validateEncoding,encodeExperience} from '../assembled/encoding';
import {source,data,decode,items,key,type Mode} from './fixtures/assembledEncoding';
import {through,draws,outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {attentionFixture} from './attentionFixtures';
import {EventRoleId as R} from '../semanticBinding/eventBindings';
const reports=(r:Run)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(ENCODING))).map(v=>items(v,'list'));
async function run(mode:Mode='main',capacity=1,at=4n,attention='role-calibrated'){const r=await createCharacterRun(await prepareCharacterModel(source(capacity,attention)),data(mode));await through(r,at);return r;}
it('calibration: original selected encoder factors before behavioral comparison',()=>{for(const [role,attention,raw]of [[R.Actor,'role-calibrated',q(3,10)],[R.Target,'role-calibrated',q(243,1000)],[R.Target,'disabled-attention',q(27,100)]] as const){const original=attentionFixture([[role]]),result=encodeExperience(original.experience,{capacity:1,attention},30n),a=items(result.value,'list'),row=items(items(a[8],'list')[0],'list');expect(result.positive).toBe(true);expect(row.slice(5)).toEqual([raw,raw]);expect(validateEncoding(result.value,a[4])).toBe(true);}console.info('M44 CALIBRATION Actor3/10 Target243/1000 disabled27/100; fixed historical-shared/UnitBudget; seed0 unchanged.');});
it('producer: actual observed role binding selects evidence and hidden physical role does not',async()=>{const a=await run('main',1,1n),b=await run('hidden',1,1n),c=await run('unknown',1,1n);expect(reports(a)).toHaveLength(1);expect(reports(b)).toEqual(reports(a));expect(b.snapshot().state).toEqual(a.snapshot().state);const first=reports(a)[0];expect(items(first[8],'list')).toHaveLength(1);expect(validateEncoding(list(first),first[4])).toBe(true);expect(items(reports(c)[0][8],'list')).toHaveLength(0);expect(items(items(reports(c)[0][6],'list')[0],'list')[2]).toEqual(text('MissingRole'));console.info('M44 PRODUCER actual SEM242/224/240 selected, hidden invariant, unresolved MissingRole');},600000);

import {restoreAuthoritativeState} from '../substrate/state';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {isSocialEpisodePath,EPISODIC_OWNER,MEMORY_FORMATION} from '../assembled/memory';
import {personPath,personHistory,personMean} from '../assembled/social';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {WORKSPACE} from '../assembled/workspace';
import {AFFECT_RECALL} from '../assembled/affectMemory';
import {sid} from '../assembled/skill';
import {dataField as f,dataRecord as rec,dataUnsigned as uint,dataIdentity as id} from '../campaign2/canonicalData';
import {signed,unsigned} from '../substrate/canonicalEncoding';
import {C} from './fixtures/campaign2Cognitive';
import {target,enc} from './fixtures/assembledEncoding';
import * as encoder from '../assembled/encoding';
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const episodes=(r:Run)=>state(r).entries().filter(e=>isSocialEpisodePath(e.path));
const report=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const belief=(r:Run)=>state(r).read(personPath(C,target)).value;
const social=(r:Run)=>report(r,'assembled-social-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(a=>key(a[2])===key(target))!;
const mean=(r:Run)=>items(social(r)[4],'list')[0];
function live(r:Run){expect(personHistory(belief(r))).toHaveLength(2);expect(personMean(belief(r))!.numerator).toBe(1n);expect(personMean(belief(r))!.denominator).toBe(2n);expect(items(social(r)[4],'list')).toHaveLength(1);const joint=report(r,JOINT_APPRAISAL).at(-1)!;expect(joint).toBeDefined();expect(items(joint[4],'list').some(v=>items(v,'list').length===5)).toBe(true);}
it('connection and continuation: excluded at encoding changes recalled judgment with semantic belief fixed',async()=>{
 const a=await run('main',1,3n),b=await run('unknown',1,3n),d=data(),restored=await restoreCharacterRun(source(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});expect(restored.snapshot()).toEqual(a.snapshot());const before=episodes(a);expect(before).toHaveLength(2);expect(episodes(b)).toHaveLength(1);expect(items(episodes(b)[0].value,'list')[5]).toEqual(signed(2));
 await through(a,4n);await through(b,4n);await through(restored,4n);expect(restored.snapshot()).toEqual(a.snapshot());expect(restored.save()).toEqual(a.save());for(const r of [a,b])live(r);
 expect(mean(a)).toEqual(q(1,1));expect(mean(b)).toEqual(q(0,1));expect(personHistory(belief(a)).map(v=>items(v,'list').slice(1))).toEqual(personHistory(belief(b)).map(v=>items(v,'list').slice(1)));console.info('M44 OCCURRENCE IDs '+[a,b].map(r=>personHistory(belief(r)).map(v=>uint(id(items(v,'list')[0]).payload).toString()).join(',')).join(' vs '));
 for(const r of [a,b]){const selected=items(report(r,WORKSPACE).at(-1)![4],'list');expect(selected).toHaveLength(1);expect(items(social(r)[6],'list')[3]).toEqual(list([items(selected[0],'list')[0]]));expect(items(report(r,JOINT_APPRAISAL).at(-1)![6],'list').slice(1)).toContainEqual(list(social(r)));expect(draws(r,4n)).toHaveLength(0);}
 for(const e of episodes(a)){const old=before.find(v=>key(items(v.value,'list')[1])===key(items(e.value,'list')[1]))!;expect(items(e.value,'list')[6]).toEqual(items(old.value,'list')[6]);expect(validateEncoding(items(e.value,'list')[6],items(e.value,'list')[3])).toBe(true);}
 const traces=outputs(a.snapshot().trace,160n),formation=traces.find(t=>key(f(rec(f(t,4n),130n),5n))===key(MEMORY_FORMATION)&&signedValue(f(rec(f(t,4n),130n),2n))===1n)!;expect(formation).toBeDefined();expect(items(f(rec(f(formation,4n),130n),6n),'list')[6]).toEqual(reports(a)[0]&&list(reports(a)[0]));
 expect(report(a,JOINT_APPRAISAL).at(-1)![4]).not.toEqual(report(b,JOINT_APPRAISAL).at(-1)![4]);console.info('M44 CONNECTION A/B stored vs B only; live recalled means1/0, semantic1/2 both, zero draws at4; exact restore3->4 and immutable acquisition provenance.');
},600000);
it('controls: zero selection unsupported role and absent future cue keep formation distinct',async()=>{
 const denied=await run('denied',1,1n);expect(episodes(denied)).toHaveLength(0);expect(reports(denied)).toHaveLength(0);expect(state(denied).entries().filter(e=>e.path.rootStateTypeId===242n)).toHaveLength(0);
 const zero=await run('main',0),unsupported=await run('unsupported'),noCue=await run('no-cue',1,2n);live(zero);live(unsupported);expect(episodes(zero)).toHaveLength(0);expect(mean(zero)).toEqual(q(1,2));expect(episodes(unsupported)).toHaveLength(1);expect(mean(unsupported)).toEqual(q(0,1));expect(items(items(reports(unsupported)[0][6],'list')[0],'list')[2]).toEqual(text('UnsupportedRole'));expect(episodes(noCue)).toHaveLength(2);for(const e of episodes(noCue))expect(items(e.value,'list')).toHaveLength(7);
 for(const [attention,expected]of [['role-calibrated',q(243,1000)],['disabled-attention',q(27,100)]] as const){const r=await run('target',1,1n,attention);expect(episodes(r)).toHaveLength(1);expect(items(items(reports(r)[0][8],'list')[0],'list')[6]).toEqual(expected);}
 console.info('M44 CONTROLS denied source no event/assessment/episode; capacity0 no memory/global1/2; unsupported A absent/B context0; no future cue still forms1/2; actual Target243/1000 vs27/100.');
},600000);
it('boundaries and repeat: admission owners immutable annex and direct formation reject',async()=>{
 const a=await run('main',1,1n),b=await run('main',1,1n);expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());const e=episodes(a)[0],m=await compileCharacterModel(source()),c=await compileCharacterState(m),v=[...items(e.value,'list')],annex=[...items(v[6],'list')];annex[1]=unsigned(0);v[6]=list(annex);v[4]=list([signed(2)]);const op={kind:'set' as const,path:e.path,expected:{presence:true as const,value:e.value},newValue:list(v)};expect(()=>c.stateModel.applyPatch(state(a),{operations:[op]},EPISODIC_OWNER)).toThrow();v[6]=items(e.value,'list')[6];expect(()=>c.stateModel.applyPatch(state(a),{operations:[{...op,newValue:list(v)}]},sid(1025,'authority/person-model'))).toThrow();
 const d=data();await expect(createCharacterRun(await prepareCharacterModel(source()),{...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),list([signed(2),unsigned(140),MEMORY_FORMATION,e.value,list([])])]))})).rejects.toThrow();await expect(prepareCharacterModel(source(3))).rejects.toThrow();
 console.info('M44 BOUNDARIES exact repeat/save; changed annex, foreign owner, direct child, invalid capacity reject.');
},600000);
it('rollback: failure after real selected encoding rolls back perception and whole instant',async()=>{
 const d=data(),s=source(),r=await createCharacterRun(await prepareCharacterModel(s),d),before=r.snapshot(),saved=r.save(),original=encoder.encodeExperience;let reached=false;const spy=vi.spyOn(encoder,'encodeExperience').mockImplementation((...args)=>{original(...args);reached=true;throw Error('M44 after actual encoding');});try{await expect(r.settleNextInstant()).rejects.toThrow('M44 after actual encoding');expect(reached).toBe(true);expect({...r.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:saved});await through(restored,1n);expect(episodes(restored)).toHaveLength(1);console.info('M44 ROLLBACK actual encoder failure leaves state/outputs/trace/clock unchanged; restored continuation forms normally.');
},600000);
