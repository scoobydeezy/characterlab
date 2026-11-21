import {it,expect} from 'vitest';
import {fixture,start,state,labels,through,at,decode,items,key,enc,list,text,u,C,rec,f,uint,outputs,exact,type Run} from './fixtures/assembledProtectiveIdentity';
import {PROTECTION,PROTECTION_CHANNEL,PROTECTION_GOAL,PROTECTION_STANDING,compileProtection,protectiveRaw} from '../assembled/protectiveIdentity';
import {CHANNELS,EXPERIMENT,ELIGIBILITY,identityContext,identityJournal,journalPath,qualificationChannels,qualificationParts,qualifyIdentity,frozenIdentityExpression} from '../assembled/identityEligibility';
import {formationPath,formationValue} from '../assembled/formation';
import {cognitiveRecord as r} from '../assembled/codecs';
import {CONTROL_VIEW} from '../assembled/control';
import {compileCharacterModel,WITHHOLDING_RULES,WITHHOLDING_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {restoreCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {rational as q,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,statePathValue,statePathPatternValue,stateSchemas} from '../substrate/state';
import {SKILL_OWNER,sid} from '../assembled/skill';
import {dataIdentity as id} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
const jp=journalPath(r(412,[C,PROTECTION_CHANNEL],2)),fp=formationPath(C,PROTECTION_CHANNEL);
const decision=(r:Run,t:bigint)=>outputs(r.snapshot().outputs,409n).find(v=>at(f(v,2n))===t)!;
const raw=(d:CanonicalValue)=>rec(f(rec(f(rec(d,409n),3n),408n),2n),403n);
const chosen=(d:CanonicalValue)=>rec(f(rec(f(rec(d,409n),4n),419n),2n),420n);
const journal=(r:Run)=>identityJournal(state(r).read(jp).value);
function live(run:Run,t:bigint){const v=labels(run,CONTROL_VIEW).find(v=>uint(v[1])===t)!;expect(v).toBeDefined();expect(v[2]).toBe(true);expect(v[3]).toBe(true);expect(v[9]).toBe(false);const d=decision(run,t);expect(d).toBeDefined();const x=raw(d);expect(items(f(rec(f(x,2n),398n),3n),'list')).toHaveLength(2);expect(items(f(x,6n),'list').some(v=>key(items(v,'list')[0])===key(text(PROTECTION_GOAL)))).toBe(true);return d;}
it('native212 protective history has a live later reason consumer and explicit intervention control',async()=>{
 const a=await start(fixture()),b=await start(fixture(false)),repeat=await start(fixture());
 for(const x of [a,b,repeat])await through(x.run,12n);exact(a.run,repeat.run);
 expect(journal(a.run)).toHaveLength(0);expect(state(a.run).read(fp).presence).toBe(false);
 const restored=cachedMemory(await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()}));exact(a.run,restored);
 for(const run of [a.run,b.run,restored])await through(run,14n);exact(a.run,restored);
 const da=live(a.run,14n),db=live(b.run,14n);expect(da).toEqual(db);expect(items(f(chosen(da),9n),'list').length).toBeGreaterThan(0);
 const fidelity={...jp,fieldId:1n,selectors:[{kind:'mapKey' as const,key:r(412,[C,sid(1041,'CommitmentFidelity')])}]};expect(state(a.run).read(fidelity)).toEqual(state(b.run).read(fidelity));expect(state(a.run).read(formationPath(C))).toEqual(state(b.run).read(formationPath(C)));
 const qa=labels(a.run,CHANNELS).map(v=>list(v)).map(v=>qualificationChannels(v)[1]).find(v=>qualificationParts(v).at.value===14n)!;
 const qb=labels(b.run,CHANNELS).map(v=>list(v)).map(v=>qualificationChannels(v)[1]).find(v=>qualificationParts(v).at.value===14n)!;
 console.info('M212 acquisition',JSON.stringify({authorship:key(f(chosen(da),7n)),natural:items(qa,'list')[6],effective:items(qa,'list')[3],withheld:items(qb,'list')[3],channels:items(f(qualificationParts(qa).expression,3n),'list').length}));
 expect(qualificationParts(qa).accepted).toBe(true);expect(qualificationParts(qb).accepted).toBe(false);expect(items(qb,'list')[6]).toEqual(text('Accepted'));expect(items(qb,'list')[3]).toEqual(text('ExperimentWithheld'));
 expect(journal(a.run)).toHaveLength(1);expect(journal(b.run)).toHaveLength(0);const savedJournal=journal(a.run)[0],formed=formationValue(state(a.run).read(fp).value);expect(formed.entries).toHaveLength(1);expect(formed.P.numerator).not.toBe(0n);
 const model=await compileCharacterModel(a.b.s),compiled=await compileCharacterState(model),current=state(a.run),value=current.read(jp).value!,np={...jp,fieldId:1n},numeric=current.read(np).value!,patch={operations:[{kind:'set' as const,path:jp,expected:{presence:false as const},newValue:value},{kind:'set' as const,path:np,expected:{presence:false as const},newValue:numeric}]};
 expect(()=>compiled.initialState(a.run.snapshot().state)).toThrow('initial');expect(()=>compiled.stateModel.validatePath({...jp,selectors:[{kind:'mapKey',key:list([])}]})).toThrow('foreign');expect(()=>compiled.stateModel.applyPatch(compiled.initialState(a.b.d.initialState),patch,SKILL_OWNER)).toThrow();
 expect(()=>compiled.stateModel.validateState(new AuthoritativeState(current.entries().filter(e=>key(statePathValue(e.path))!==key(statePathValue(np)))))).toThrow('presence');
 const registration=rec(f(items(items(decode(model.baseRegistry),'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n)).find(v=>key(f(v,1n))===key(sid(1009,'TaskIdentityApplicationTransition')))!,4n),450n),owner=id(f(rec(f(registration,6n),322n),2n));
 expect(()=>compiled.stateModel.applyPatch(current,{operations:[{kind:'set',path:jp,expected:{presence:true,value},newValue:value},{kind:'set',path:np,expected:{presence:true,value:numeric},newValue:numeric}]},owner)).toThrow('history rewrite');
 const xp=items(qa,'list'),oldEnvelope=items(xp[2],'list');let contextCases=0;
 for(const significance of [q(0,1),q(1,4),q(1,1)])for(const pressure of [q(0,1),q(1,2),q(1,1)]){
  const ctx=list([text(ELIGIBILITY),significance,pressure,false]),envelope=frozenIdentityExpression(qualificationParts(qa).expression,uint(oldEnvelope[2]),ctx,true),result=items(qualifyIdentity(xp[1],envelope,PROTECTION_CHANNEL),'list');
  expect(result[3]).toEqual(text(readQ(significance).numerator===readQ(significance).denominator?(readQ(pressure).numerator===0n?'Accepted':'Constrained'):'Insignificant'));contextCases++;
 }
 expect(()=>qualificationParts(list([xp[0],xp[1],xp[2],text('Accepted'),q(1,1),...xp.slice(5)]))).toThrow('correspondence');
 console.info('M212 eligibility/owner controls',contextCases,'contexts; history rewrite and forged contribution rejected; first dice and fidelity numeric/formation held fixed');
 for(const run of [a.run,b.run,restored])await through(run,16n);exact(a.run,restored);const ra=raw(live(a.run,16n)),rb=raw(live(b.run,16n)),standing=(v:CanonicalValue)=>items(f(rec(v,403n),6n),'list').filter(v=>key(items(v,'list')[0])===key(text(PROTECTION_STANDING)));
 expect(standing(ra)).toHaveLength(1);expect(standing(rb)).toHaveLength(0);const signal=rec(items(standing(ra)[0],'list')[2],402n);expect(readQ(f(signal,2n)).numerator).not.toBe(0n);expect(key(f(signal,3n))).toContain(key(qualificationParts(savedJournal).id));
 const pt=outputs(a.run.snapshot().trace,160n).find(t=>at(f(rec(f(t,4n),130n),2n))===16n&&key(f(t,5n))===key(sid(1036,'seam/assembled-protective-meaning')))!;expect(pt).toBeDefined();const noFeedback=protectiveRaw(model.protection!,f(pt,12n),state(a.run),compiled.stateModel,model.timeLimit,false);expect(standing(noFeedback.output)).toHaveLength(0);expect(items(f(rec(noFeedback.output,403n),6n),'list').filter(v=>key(items(v,'list')[0])===key(text(PROTECTION_GOAL)))).toHaveLength(1);
 const nucleiA=f(rec(f(decision(a.run,16n),3n),408n),3n),nucleiB=f(rec(f(decision(b.run,16n),3n),408n),3n);expect(nucleiA).not.toEqual(nucleiB);
 const pa=f(chosen(decision(a.run,16n)),2n),pb=f(chosen(decision(b.run,16n)),2n);expect(pa).not.toEqual(pb);console.info('M212 exact probabilities',...([pa,pb].map(v=>items(v,'list').map(p=>{const x=readQ(f(rec(p,421n),2n));return x.numerator+'/'+x.denominator;}))));
 console.info('M212 NATIVE PASS live protection, identical first decision/draws under experimental withholding, distinct channel/journal and single D3 formation; actual later standing/reason consumer; repeat12 and exact restore12->14->16; state ownership/S0/foreign/pair guards');
},600000);
it('admission212 old context and model reject experiment while successor remains explicit',async()=>{
 const safe=list([text(ELIGIBILITY),q(1,1),q(0,1),false]),wrapped=list([text(EXPERIMENT),safe,false]);expect(()=>identityContext(wrapped)).toThrow();expect(identityContext(wrapped,true)).toEqual(identityContext(safe));expect(()=>identityContext(list([text(EXPERIMENT),safe,q(0,1)]),true)).toThrow();
 const b=fixture();await expect(compileCharacterModel({...b.s,rulesVersion:WITHHOLDING_RULES,registrySchemaVersion:WITHHOLDING_REGISTRY})).rejects.toThrow('slot count');
 const slots=items(decode(b.s.registry),'list'),decl=items(slots[56],'list');expect(()=>compileProtection(list([decl[0],decl[1],decl[2],q(2,1)]),[{action:decl[1],count:0n}],[decl[2]],[])).toThrow('importance');expect(()=>compileProtection(slots[56],[{action:decl[1],count:1n}],[decl[2]],[])).toThrow('action');console.info('M212 ADMISSION PASS versioned experiment separate from safe context, declared zero action and bounded importance');
},180000);

it('codec212 only the successor receives Protection keys inside state and trace paths',()=>{
 const identityKey=r(412,[C,PROTECTION_CHANNEL],2),path=statePathValue(jp),pattern=statePathPatternValue({...jp,selectors:jp.selectors.map(selector=>({kind:'exact' as const,selector}))});
 for(const v of [identityKey,path,pattern,new AuthoritativeState([{path:jp,value:list([])},{path:fp,value:list([])}]).canonicalValue()])expect(decode(enc(v))).toEqual(v);
 expect(()=>r(412,[C,PROTECTION_CHANNEL])).toThrow('channel/schema');expect(()=>r(427,[PROTECTION_CHANNEL,q(1,2)])).toThrow('channel/schema');
 expect(()=>decode(enc(record(stateSchemas.typedEntitySelector,new Map([[1n,identityKey]]))))).toThrow('unrelated record');
 console.info('M212 CODEC PASS Protection412/2 and formation keys in state/path/pattern; old412/427 and unrelated typed-entity metadata reject');
});
