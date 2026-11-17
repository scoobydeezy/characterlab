import {it,expect,vi} from 'vitest';
import {createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,RECEIPT_REASON_RULES,RECEIPT_REASON_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {AuthoritativeState,statePathValue} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import * as skill from '../assembled/skill';
import {relationshipHistory,relationshipFold,REL_OWNER} from '../assembled/relationship';
import {personPath,personMean,personHistory} from '../assembled/social';
import {isSocialEpisodePath} from '../assembled/memory';
import {qualificationParts} from '../assembled/identityEligibility';
import {randomDrawRecord} from '../assembled/codecs';
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,u,type Mode} from './fixtures/assembledLongitudinalCompletion';
import {start,state,learned,actual,report} from './assembledLongitudinalCompletion.test';
import {through} from './assembledMultiReceipts.test';
const K=(x:Awaited<ReturnType<typeof start>>)=>skill.skillValue(learned(x).skill,x.b.procedure,true);
const draws4=(x:Awaited<ReturnType<typeof start>>)=>outputs(x.r.snapshot().trace,160n).filter(t=>key(f(rec(f(t,4n),130n),2n))===key(signed(4))).flatMap(t=>items(f(t,14n),'list')).map(v=>{const r=randomDrawRecord(v);return list([f(r,2n),f(r,3n),f(r,4n)]);});
it('comparisons152: isolated owners agree; loss and fresh practice affect real execution; storage alternatives preserve only named queries',async()=>{
 const base=await start();await through(base.r,9n);const acquired=learned(base);
 for(const mode of['bioOnly','skillOnly','relOnly'] as const){const x=await start(mode);await through(x.r,9n);const b=learned(x);
  if(mode==='bioOnly'){expect(b.bio).toEqual(acquired.bio);expect(draws4(x)).toEqual(draws4(base));expect(draws4(base).length).toBeGreaterThan(0);}
  if(mode==='skillOnly')expect(K(x)).toEqual(K(base));
  if(mode==='relOnly'){expect(relationshipFold(b.rel)).toEqual(relationshipFold(acquired.rel));expect(relationshipHistory(b.rel).map(v=>items(v,'list').slice(1))).toEqual(relationshipHistory(acquired.rel).map(v=>items(v,'list').slice(1)));}
 }
 await through(base.r,36n);const clean=await start('noLoss'),untrained=await start('untrained');for(const x of[clean,untrained])await through(x.r,36n);
 expect(K(base).K).toEqual(Q.of(3n,8n));expect(K(clean).K).toEqual(Q.of(5n,8n));expect(K(untrained).K).toEqual(Q.of(1n,8n));actual(base,30,true);actual(base,32,false);actual(clean,32,true);actual(base,36,true);actual(untrained,36,false);
 // Test-only alternatives over acquired native operands. No substitute enters a run.
 let cached={count:0n,rupture:false};for(const v of relationshipHistory(acquired.rel)){const kind=uint(items(v,'list')[6]);cached={count:cached.count+(kind===1n?1n:0n),rupture:kind===2n};}
 expect({...cached,comfort:cached.count>=2n&&!cached.rupture}).toEqual(relationshipFold(acquired.rel));
 const overwritten=[acquired.bio,acquired.skill,acquired.rel].reduce<unknown>((_,v)=>v,undefined);expect(overwritten).toEqual(acquired.rel);expect(overwritten).not.toEqual(acquired.bio);expect(overwritten).not.toEqual(acquired.skill);
 expect(learned(base).episodes.filter(e=>isSocialEpisodePath(e.path)&&[8n,9n].includes((items(e.value,'list')[5] as {value:bigint}).value))).toHaveLength(0);expect(relationshipFold(learned(base).rel).comfort).toBe(true);
 console.info('M152 COMPARISONS PASS isolated BIO exact with identical actual natural draws; skill/REL projections equal; no-loss32 succeeds, untrained36 fails; compact fold equal/overwrite loses families/silent encounter receipts not episodic evidence; separate encoded-encounter comparison required');
},590000);
it('boundaries152: fixed-display hidden truth and later false claims preserve historical learning; owner and initial-state checks reject shortcuts',async()=>{
 const x=await start(),hidden=await start('hidden'),claim=await start('falseClaim');for(const a of[x,hidden,claim])await through(a.r,36n);
 expect(learned(hidden).bio).toEqual(learned(x).bio);expect(learned(hidden).rel).toEqual(learned(x).rel);expect(K(hidden)).toEqual(K(x));bytes(x.r.snapshot().state,hidden.r.snapshot().state);
 expect(learned(claim).bio).toEqual(learned(x).bio);expect(learned(claim).rel).toEqual(learned(x).rel);expect(personMean(state(claim).read(personPath(C,target)).value)).not.toEqual(personMean(state(x).read(personPath(C,target)).value));
 const c=await compileCharacterState(await compileCharacterModel(x.b.s)),p=skill.skillPath(C,x.b.procedure),v=state(x).read(p).value!;
 expect(()=>c.stateModel.applyPatch(state(x),{operations:[{kind:'set',path:p,expected:{presence:true,value:v},newValue:v}]},REL_OWNER)).toThrow();expect(()=>c.stateModel.read(state(x),skill.skillPath(target,x.b.procedure))).toThrow('foreign');
 const initial=c.initialState(x.b.d.initialState);await expect(createCharacterRun(x.m,{...x.b.d,initialState:enc(new AuthoritativeState([...initial.entries(),{path:p,value:v}]).canonicalValue())})).rejects.toThrow('initial');
 console.info('M152 BOUNDARIES PASS fixed-evidence hidden full state; later false belief cannot revise historical expression/relationship; wrong owner/foreign/learned S0 reject');
},590000);
it('persistence152: repeat and saves before and after loss preserve all bytes at every settlement',async()=>{
 const x=await start(),repeat=await createCharacterRun(x.m,x.b.d);let n=0;while(x.r.snapshot().clock<9n){expect(n++).toBeLessThan(96);expect(await x.r.settleNextInstant()).toBe(true);expect(await repeat.settleNextInstant()).toBe(true);exact(x.r,repeat);}
 const early=await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.r.save()});exact(x.r,early);
 while(x.r.snapshot().clock<30n){expect(n++).toBeLessThan(96);expect(await x.r.settleNextInstant()).toBe(true);for(const r of[repeat,early]){expect(await r.settleNextInstant()).toBe(true);exact(x.r,r);}}
 const late=await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.r.save()});exact(x.r,late);let ended=false;
 for(;n<96;n++){const more=await x.r.settleNextInstant();for(const r of[repeat,early,late]){expect(await r.settleNextInstant()).toBe(more);exact(x.r,r);}if(!more){ended=true;break;}}
 expect(ended).toBe(true);expect(x.r.snapshot().clock).toBeGreaterThanOrEqual(36n);expect(K(x).K).toEqual(Q.of(3n,8n));expect(learned(x).journal).toHaveLength(1);expect(relationshipFold(learned(x).rel).count).toBe(2n);
 console.info('M152 PERSISTENCE PASS repeat/save9/save30 all bytes every settlement; terminal',String(x.r.snapshot().clock));
},590000);
it('rollback152: fault after computed loss rolls back whole instant and all learned owners',async()=>{
 const x=await start();await through(x.r,26n);const before=x.r.snapshot(),original=skill.interferedPractice;let reached=false;const spy=vi.spyOn(skill,'interferedPractice').mockImplementation((...a)=>{const v=original(...a);if(a[4]){reached=true;throw Error('M152 after loss');}return v;});
 try{await expect(x.r.settleNextInstant()).rejects.toThrow('M152 after loss');}finally{spy.mockRestore();}expect(reached).toBe(true);expect({...x.r.snapshot(),status:before.status}).toEqual(before);expect(K(x).K).toEqual(Q.of(1n,2n));console.info('M152 ROLLBACK PASS loss140, whole state/queue/allocations/draws/output/trace');
},590000);

it('encoding152: actually encoded encounters disappear while owned relationship remains; episodic-only receipt retention loses comfort',async()=>{
 const x=await start('encodedEpisodes');await through(x.r,9n);const before=learned(x),episodes=before.episodes.filter(e=>isSocialEpisodePath(e.path)&&[8n,9n].includes((items(e.value,'list')[5] as {value:bigint}).value));expect(episodes).toHaveLength(2);expect(relationshipFold(before.rel).comfort).toBe(true);
 const projection=(value:ReturnType<typeof learned>)=>{const retained=new Set(value.episodes.filter(e=>isSocialEpisodePath(e.path)).map(e=>key(items(e.value,'list')[5])));return relationshipFold(list([text('assembled-relationship/0.1'),list(relationshipHistory(value.rel).filter(v=>retained.has(key(items(v,'list')[3]))))]));};
 expect(projection(before)).toEqual(relationshipFold(before.rel));await through(x.r,30n);const after=learned(x);expect(after.bio).toEqual(before.bio);expect(after.rel).toEqual(before.rel);const retained=new Set(after.episodes.map(e=>key(statePathValue(e.path))));for(const e of episodes)expect(retained.has(key(statePathValue(e.path)))).toBe(false);
 expect(projection(after)).toEqual({count:0n,rupture:false,comfort:false});expect(relationshipFold(after.rel).comfort).toBe(true);
 console.info('M152 ENCODING PASS two native encounter episodes8/9 present then removed; own relationship remains; diagnostic receipt retention keyed to actual episode survival loses comfort. No report-to-cooperation inference or production reduction.');
},590000);
it('version152: retained zero is valid only in successor; old bundle rejects new source grammar',async()=>{
 const x=await start(),model=await compileCharacterModel(x.b.s),c=await compileCharacterState(model),initial=c.initialState(x.b.d.initialState),path=skill.skillPath(C,x.b.procedure),zero=list([text(skill.PROCEDURES),q(0,1),u(1),x.b.procedure]);
 const patch={operations:[{kind:'set' as const,path,expected:{presence:false as const},newValue:zero}]};const next=c.stateModel.applyPatch(initial,patch,skill.SKILL_OWNER).state;c.stateModel.validateState(next);bytes(enc(c.stateModel.restoreState(enc(next.canonicalValue())).canonicalValue()),enc(next.canonicalValue()));
 const oldSource={...x.b.s,rulesVersion:RECEIPT_REASON_RULES,registrySchemaVersion:RECEIPT_REASON_REGISTRY},old=await compileCharacterState(await compileCharacterModel(oldSource));expect(()=>old.stateModel.applyPatch(old.initialState(x.b.d.initialState),patch,skill.SKILL_OWNER)).toThrow('skill value domain');
 const oldModel=await import('../assembled/character').then(c=>c.prepareCharacterModel(oldSource));await expect(createCharacterRun(oldModel,x.b.d)).rejects.toThrow('practice setting grammar');
 console.info('M152 VERSION PASS successor zero validates/restores; predecessor rejects zero and new source; structural permission does not admit learned S0');
},590000);

it('unknownRole152: reports with unknown event role update belief but do not create qualifying encounter episodes',async()=>{
 const x=await start('unencodedReports');await through(x.r,9n);expect(personHistory(state(x).read(personPath(C,target)).value).filter(v=>[8n,9n].includes((items(v,'list')[3] as {value:bigint}).value))).toHaveLength(2);
 expect(learned(x).episodes.filter(e=>isSocialEpisodePath(e.path)&&[8n,9n].includes((items(e.value,'list')[5] as {value:bigint}).value))).toHaveLength(0);expect(relationshipFold(learned(x).rel).comfort).toBe(true);
 console.info('M152 UNKNOWN ROLE CONTROL PASS reports8/9 admitted, own relation retained, no qualifying episodic encoding; original failed precondition preserved');
},590000);
