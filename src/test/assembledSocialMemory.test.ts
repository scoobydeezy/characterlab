import {it,expect} from 'vitest';
import {list,text,unsigned,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {SOCIAL_EPISODE,SOCIAL_RECALL,isSocialEpisodePath,validateSocialEpisode,EPISODIC_OWNER,MEMORY_FORMATION} from '../assembled/memory';
import {personPath,personHistory,personMean} from '../assembled/social';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {WORKSPACE} from '../assembled/workspace';
import {BODY_OBSERVER} from '../assembled/body';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {sid} from '../assembled/skill';
import {dataField as f,dataRecord as rec,dataUnsigned as uint,dataIdentity as id} from '../campaign2/canonicalData';
import {readQ,bounded} from '../campaign2/cognitiveMath';
import {source,data,decode,items,key,enc,target} from './fixtures/assembledSocialMemory';
import {through,outputs,draws,signedValue,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
import {workLimit} from './fixtures/assembledCharacter';
import {cases as recollectionCases} from './recollectionFixtures';
import {recallBodyByAcquisitionRecency as originalRecall} from '../campaign3/bodyRecall';
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const episodes=(r:Run)=>state(r).entries().filter(e=>isSocialEpisodePath(e.path));
const belief=(r:Run)=>state(r).read(personPath(C,target)).value;
const appraisal=(r:Run)=>reports(r,'assembled-social-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(p=>key(p[2])===key(target))!;
const known=(r:Run)=>items(appraisal(r)[4],'list')[0];
const diagnostic=(v:unknown)=>JSON.stringify(v,(_k,x)=>typeof x==='bigint'?String(x):x);
async function run(slots=1,capacity=8,mode:Parameters<typeof data>[0]='main',at=8n,workspace=5){const r=await createCharacterRun(await prepareCharacterModel(source(slots,capacity,workspace)),data(mode));await through(r,at);return r;}
function live(r:Run){expect(personHistory(belief(r))).toHaveLength(3);expect(personMean(belief(r))!.equals(readQ(q(1,3)))).toBe(true);expect(items(appraisal(r)[4],'list')).toHaveLength(1);expect(reports(r,JOINT_APPRAISAL).at(-1)).toBeDefined();expect(items(reports(r,JOINT_APPRAISAL).at(-1)![4],'list').some(v=>items(v,'list').length===5)).toBe(true);}
function summary(r:Run){return {clock:r.snapshot().clock,episodes:episodes(r).map(e=>({time:items(e.value,'list')[5],source:items(items(e.value,'list')[2],'list')[0]})),mean:known(r),semanticMean:items(appraisal(r)[6],'list')[2],workspace:reports(r,WORKSPACE).at(-1)?.[4],draws:draws(r,8n).length};}
it('calibration: fixed reference settings and exact cue controls before behavior',()=>{
 const definitions=items(items(decode(source().registry),'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n)),dice=rec(f(definitions.find(v=>key(f(v,1n))===key(sid(1027,'definition/task-reason-dice')))!,4n),437n);expect(f(dice,2n)).toEqual(q(37,100));
 expect(bounded(readQ(q(1,1))).equals(readQ(q(1,2)))).toBe(true);expect(bounded(readQ(q(1,3))).equals(readQ(q(1,4)))).toBe(true);
 const memory=[{id:1n,acquiredAt:1n,kind:'Interoceptive' as const,units:[{key:'receipt',views:[new Uint8Array([0])]}]}];expect(originalRecall(memory,{kind:'Absent'},3n,1).recalled).toHaveLength(0);expect(originalRecall(memory,{kind:'Present',signals:['wrong']},3n,1).recalled).toHaveLength(0);expect(originalRecall(memory,{kind:'Present',signals:['receipt']},3n,0).recalled).toHaveLength(0);expect(originalRecall(memory,{kind:'Present',signals:['receipt']},3n,1).recalled[0].acquiredAt).toBe(1n);expect(recollectionCases().knownFalse[0].display).toBe(false);
 console.info('M42 CALIBRATION '+diagnostic({threshold:f(dice,2n),dice,rawExamples:['1 -> 1/2','1/3 -> 1/4'],gate:'live contextual likelihood and joint appraisal; no choice-causality claim',seed:0}));
});
it('connection: surviving recall changes live social judgment without duplicate belief credit',async()=>{
 const a=await run(),b=await run(0),c=await run(1,0);for(const r of [a,b,c])live(r);
 expect(known(a)).toEqual(q(1,1));expect(known(b)).toEqual(q(1,3));expect(known(c)).toEqual(q(1,3));expect(episodes(a)).toHaveLength(3);expect(episodes(b)).toHaveLength(3);expect(episodes(c)).toHaveLength(0);
 expect(personHistory(belief(a)).map(v=>items(v,'list').slice(3))).toEqual(personHistory(belief(b)).map(v=>items(v,'list').slice(3)));expect(personHistory(belief(a)).map(v=>items(v,'list').slice(3))).toEqual(personHistory(belief(c)).map(v=>items(v,'list').slice(3)));
 const social=appraisal(a),selected=items(reports(a,WORKSPACE).at(-1)![4],'list');expect(selected).toHaveLength(1);const episode=items(items(selected[0],'list')[1],'list');expect(episode[5]).toEqual({kind:'signed',value:3n});expect(items(social[3],'list')).toEqual([episode[2]]);expect(items(social[6],'list')[2]).toEqual(list([q(1,3)]));
 const ja=reports(a,JOINT_APPRAISAL).at(-1)!,jb=reports(b,JOINT_APPRAISAL).at(-1)!;expect(key(ja[4])).not.toEqual(key(jb[4]));expect(items(ja[6],'list').slice(1).some(p=>key(p)===key(list(social)))).toBe(true);
 console.info('M42 CONNECTION '+diagnostic([summary(a),summary(b),summary(c)]));
},600000);
it('controls: perceived cues, workspace exclusion and hidden truth preserve the boundary',async()=>{
 const wrong=await run(1,8,'wrong'),denied=await run(1,8,'denied'),crowded=await run(1,8,'main',8n,3),hidden=await run(1,8,'hidden');for(const r of [wrong,denied,crowded,hidden])live(r);
 for(const r of [wrong,denied,crowded])expect(known(r)).toEqual(q(1,3));expect(known(hidden)).toEqual(q(1,1));for(const r of [wrong,denied,crowded,hidden])expect(episodes(r)).toHaveLength(3);
 const a=await run();expect(episodes(a)).toEqual(episodes(hidden));expect(appraisal(a)).toEqual(appraisal(hidden));expect(reports(a,WORKSPACE)).toEqual(reports(hidden,WORKSPACE));
 console.info('M42 CONTROLS '+diagnostic([summary(wrong),summary(denied),summary(crowded),summary(hidden)]));
},600000);
it('persistence: exact repeat and restore retain acquisition and pending cue',async()=>{
 const prepared=await prepareCharacterModel(source()),d=data(),a=await createCharacterRun(prepared,d),b=await createCharacterRun(prepared,d);await through(a,6n);await through(b,6n);expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());const before=episodes(a),saved=a.save(),restored=await restoreCharacterRun(source(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save:saved});expect(restored.snapshot()).toEqual(a.snapshot());await through(a,8n);await through(restored,8n);expect(restored.snapshot()).toEqual(a.snapshot());expect(restored.save()).toEqual(a.save());expect(episodes(a)).toEqual(before);
 console.info('M42 PERSISTENCE exact6/8 '+diagnostic({episodeCount:before.length,saveBytes:saved.length}));
},600000);
it('ownership: foreign authority, initial memory and direct formation reject',async()=>{
 const r=await run(1,8,'main',3n),e=episodes(r)[0],model=await compileCharacterModel(source()),component=await compileCharacterState(model),sm=component.stateModel;
 expect(()=>sm.applyPatch(restoreAuthoritativeState(decode(data().initialState)),{operations:[{kind:'set',path:e.path,expected:{presence:false},newValue:e.value}]},sid(1025,'authority/person-model'))).toThrow();
 const ev=[...items(e.value,'list')],obs=[...items(ev[2],'list')];obs[1]=sid(1002,'foreign');ev[2]=list(obs);expect(()=>validateSocialEpisode(list(ev),C)).toThrow('source');
 const d=data(),bad={...d,initialState:enc(new AuthoritativeState([...restoreAuthoritativeState(decode(d.initialState)).entries(),e]).canonicalValue())};await expect(createCharacterRun(await prepareCharacterModel(source()),bad)).rejects.toThrow();
 const direct={...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),list([{kind:'signed',value:1n},unsigned(140),MEMORY_FORMATION,e.value,list([])])]))};await expect(createCharacterRun(await prepareCharacterModel(source()),direct)).rejects.toThrow();
 const traces=outputs(r.snapshot().trace,160n).filter(t=>key(f(t,6n))===key(text('assembled-character-social-memory/0.1-candidate')));expect(traces.length).toBeGreaterThan(0);expect(traces.some(t=>items(f(t,9n),'list').some(v=>id(v).namespaceId===1125n))).toBe(true);expect(traces.some(t=>items(f(t,11n),'list').length>0)).toBe(true);
},600000);

it('rollback: failed social formation restores the whole instant',async()=>{
 const s=source(),d=data(),a=await createCharacterRun(await prepareCharacterModel(s),d);await through(a,1n);const events=new Map<string,ReturnType<typeof rec>>();for(const t of outputs(a.snapshot().trace,160n)){const e=rec(f(t,4n),130n);if(signedValue(f(e,2n))===1n)events.set(key(f(e,1n)),e);}const n=events.size;expect([...events.values()].some(e=>key(f(e,5n))===key(MEMORY_FORMATION))).toBe(true);
 const b=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(n-1))),d),before=b.snapshot();await expect(b.settleNextInstant()).rejects.toThrow('work ceiling');expect({...b.snapshot(),status:before.status}).toEqual(before);expect(episodes(b)).toHaveLength(0);console.info('M42 ROLLBACK '+(n-1)+'/'+n);
},600000);
