import {it,expect,vi} from 'vitest';
import {list,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import * as stateModule from '../substrate/state';
import {restoreAuthoritativeState,AuthoritativeState,statePathValue} from '../substrate/state';
import {dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
import {receivingRecord as rec,decodeCognitive} from '../assembled/codecs';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,EMBARRASSMENT_RULES,EMBARRASSMENT_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {knowledgePath,history,communicationEstimate,FROZEN,SIGNAL,RECEIVED,PROBE,CONTRARY,CONTRARY_VERSION,COMM_SOURCE} from '../assembled/communication';
import {EXPECTATION_TOPIC} from '../assembled/performanceExpectation';
import {personPath,personHistory,PERSON_OWNER} from '../assembled/social';
import {fixture,decode,items,key,enc,target,other,recipients,actionA,actionB,type Opt} from './fixtures/assembledContraryCommunication';
import {C} from './fixtures/campaign2Cognitive';
import {through,outputs,decisions,draws,choice,signedValue,type Run} from './fixtures/assembledComparison';
import {compileLyingModel,compileLyingInputs,lyingRecipe,path as nativePath} from '../campaign3/lyingModel';
import {createLyingRuntime} from '../campaign3/lyingRuntime';
import {estimate as nativeEstimate,emptyKnowledge} from '../campaign3/lyingMath';
import {cases,ordered,initialState,seed,records as nativeRecords} from './lyingFixtures';
const state=(r:Run)=>restoreAuthoritativeState(decodeCognitive(r.snapshot().state));
const knowledge=(r:Run,i=0)=>state(r).read(knowledgePath(recipients[i])).value;
const person=(r:Run)=>personHistory(state(r).read(personPath(C,target)).value);
const reports=(r:Run,name:string)=>items(decodeCognitive(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(name))).map(v=>items(v,'list'));
const at=(r:Run,name:string,t=3n)=>reports(r,name).find(a=>signedValue(a[1])===t)!;
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const exact=(a:Run,b:Run)=>{for(const k of ['state','outputs','trace'] as const)bytes(a.snapshot()[k],b.snapshot()[k]);bytes(a.save(),b.save());expect(a.snapshot().clock).toBe(b.snapshot().clock);};
async function run(o:Opt={},time=3n){const b=fixture(o),r=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(r,time);return r;}
function live(r:Run,honest=false,claim=true){
 const frozen=at(r,FROZEN);expect(frozen,'live expression').toBeDefined();expect(frozen[3]).toEqual(honest?actionA:actionB);expect(frozen[6]).toEqual(list([text(CONTRARY),list([claim]),u(honest?1:2)]));expect(frozen[4]).toEqual(list([honest?claim:!claim]));
 expect(person(r).some(v=>key(items(v,'list')[6])===key(list([claim])))).toBe(true);
 const resolution=decisions(r)[0],nuclei=items(f(rec(f(resolution,3n),408n),3n),'list');expect(nuclei.length).toBeGreaterThan(0);
 const result=rec(f(rec(f(resolution,4n),419n),2n),420n);expect(uint(f(result,8n))).toBe(1n);expect(f(result,3n)).toEqual(q(1,1));expect(f(result,4n)).toEqual(q(0,1));expect(items(f(result,2n),'list')).toHaveLength(1);expect(draws(r)).toHaveLength(0);
 expect(state(r).read(knowledgePath(C)).presence).toBe(false);return frozen;
}
it('connection: chosen truthful or contrary content reaches only the permitted recipient',async()=>{
 for(const honest of [true,false]){const r=await run({honest}),frozen=live(r,honest),signal=at(r,SIGNAL);expect(signal[2]).toEqual(frozen[2]);expect(signal[3]).toEqual(frozen[3]);expect(signal[4]).toBe(true);expect(signal[5]).toBe(true);expect(signal[6]).toEqual(frozen[4]);expect(signal[7]).toEqual(target);
  const received=reports(r,RECEIVED).map(x=>x[1]);expect(received).toHaveLength(2);expect(history(knowledge(r))).toEqual([received[0]]);expect(knowledge(r,1)).toBeUndefined();for(const [i,v]of received.entries()){const a=items(v,'list');expect(a).toHaveLength(5);expect(a[1]).toEqual(recipients[i]);expect(a[3]).toEqual(i===0?frozen[4]:list([]));expect(a[4]).toEqual(target);}
  const ts=outputs(r.snapshot().trace,160n).filter(t=>key(f(t,6n))===key(text(CONTRARY_VERSION))&&signedValue(f(rec(f(t,4n),130n),2n))===3n),phase=(t:ReturnType<typeof rec>)=>uint(f(rec(f(t,4n),130n),3n));
  for(const p of [10n,20n,40n,90n,110n,120n,140n])expect(ts.some(t=>phase(t)===p)).toBe(true);
  const expression=ts.find(t=>phase(t)===90n)!,latest=person(r).at(-1)!;expect(f(expression,9n)).toEqual(list([items(latest,'list')[0]]));expect(items(f(expression,11n),'list')).toHaveLength(1);expect(f(expression,13n)).toEqual(list([list(frozen)]));
  expect(f(ts.find(t=>phase(t)===140n)!,12n)).toEqual(list(received));
  await through(r,4n);expect(at(r,PROBE,4n)[4]).toEqual(list([q(honest?1:0,1)]));expect(communicationEstimate(knowledge(r))).toEqual(list([q(honest?1:0,1)]));expect(knowledge(r,1)).toBeUndefined();console.info('M60_CELL '+JSON.stringify({honest,action:choice(r),assertion:honest,receiver:honest?1:0,mode:'Auto',draws:0}));
 }
},590000);
it('controls: unknown, false, hidden truth, late evidence and failed delivery remain distinct',async()=>{
 const base=await run(),hidden=await run({hidden:true});live(base);live(hidden);bytes(base.snapshot().state,hidden.snapshot().state);bytes(base.snapshot().outputs,hidden.snapshot().outputs);
 const negative=await run({claim:false});live(negative,false,false);expect(communicationEstimate(knowledge(negative))).toEqual(list([q(1,1)]));
 for(const o of [{unknown:true},{denied:true}]){const r=await run(o);expect(at(r,FROZEN)[4]).toEqual(list([]));expect(items(at(r,FROZEN)[6],'list')[1]).toEqual(list([]));expect(at(r,SIGNAL)[5]).toBe(false);expect(knowledge(r)).toBeUndefined();}
 const late=await run({late:true});live(late);expect(items(person(late).at(-1)!,'list')[6]).toEqual(list([false]));expect(at(late,FROZEN)[4]).toEqual(list([false]));
 for(const o of [{delivery:false},{access:false},{physical:false}]){const r=await run(o);live(r);expect(knowledge(r)).toBeUndefined();expect(knowledge(r,1)).toBeUndefined();expect(at(r,SIGNAL)[5]).toBe(o.access===false);expect(at(r,SIGNAL)[4]).toBe(o.physical!==false);}
 const noAnnex=await run({annex:false});expect(at(noAnnex,FROZEN)).toHaveLength(6);expect(at(noAnnex,FROZEN)[4]).toEqual(list([true]));expect(at(noAnnex,SIGNAL)[5]).toBe(false);expect(knowledge(noAnnex)).toBeUndefined();
 console.info('M60 controls PASS known false/unknown/denial/hidden/late/delivery/access/physical/legacy');
},590000);
it('continuation: exact repeat and saves before and after contrary receipt',async()=>{
 const {s,d}=fixture(),model=await prepareCharacterModel(s),a=await createCharacterRun(model,d),b=await createCharacterRun(model,d);await through(a,2n);await through(b,2n);exact(a,b);
 const early=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,early);for(const r of [a,b,early])await through(r,3n);exact(a,b);exact(a,early);live(a);
 const expression=outputs(a.snapshot().trace,160n).find(t=>key(f(t,6n))===key(text(CONTRARY_VERSION))&&uint(f(rec(f(t,4n),130n),3n))===90n)!,read=rec(items(f(expression,11n),'list')[0],147n);
 expect(f(read,2n)).toEqual(statePathValue(personPath(C,target)));expect(f(read,3n)).toBe(true);expect(f(read,4n)).toEqual(state(a).read(personPath(C,target)).value);
 const late=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,late);for(const r of [a,b,early,late])await through(r,4n);exact(a,b);exact(a,early);exact(a,late);console.info('M60 repeat/save2->3->4/save3->4 exact state/output/trace/save PASS');
},390000);
it('boundaries: admission, ownership, recipient privacy and reached learning rollback',async()=>{
 const {s,d}=fixture(),slots=items(decode(s.registry),'list'),decl=items(slots[18],'list'),alter=(v:CanonicalValue)=>({...s,registry:enc(list(slots.map((x,i)=>i===18?v:x)))});
 for(const v of [list([...decl.slice(0,4),actionA]),list([...decl.slice(0,4),typedIdentifier(1027,text('definition/missing-action'))]),list([...decl,actionB]),list([...decl.slice(0,3),list([text(EXPECTATION_TOPIC),items(items(items(slots[12],'list')[1],'list')[0],'list')[0],u(0)]),actionB])])await expect(prepareCharacterModel(alter(v))).rejects.toThrow();
 await expect(prepareCharacterModel({...s,rulesVersion:EMBARRASSMENT_RULES,registrySchemaVersion:EMBARRASSMENT_REGISTRY})).rejects.toThrow('declaration');
 const model=await prepareCharacterModel(s),component=await compileCharacterState(await compileCharacterModel(s)),r=await createCharacterRun(model,d);await through(r,2n);
 const snapshot=state(r),obs=list([typedIdentifier(1168,u(99999)),recipients[0],signed(3),list([false]),target]),path=knowledgePath(recipients[0]);
 expect(()=>component.stateModel.applyPatch(snapshot,{operations:[{kind:'set',path,expected:{presence:false},newValue:list([obs])}]},PERSON_OWNER)).toThrow();
 expect(()=>component.stateModel.validateState(new AuthoritativeState([...snapshot.entries(),{path,value:list([list([...items(obs,'list').slice(0,4),other])])}]))).toThrow('topic');
 const before=r.snapshot(),apply=stateModule.applyStatePatch;let reached=false;const spy=vi.spyOn(stateModule,'applyStatePatch').mockImplementation((...args)=>{const result=apply(...args);if(args[1].operations.some(o=>o.path.rootStateTypeId===1072n)){expect(communicationEstimate(result.state.read(path).value)).toEqual(list([q(0,1)]));reached=true;throw Error('M60 after receiver140');}return result;});
 try{await expect(r.settleNextInstant()).rejects.toThrow('M60 after receiver140');expect(reached).toBe(true);for(const k of ['state','outputs','trace'] as const)bytes(r.snapshot()[k],before[k]);expect(r.snapshot().clock).toBe(2n);}finally{spy.mockRestore();}
 console.info('M60 admission/owner/topic/after-receiver140 rollback PASS');
},150000);
it('native correspondence: original LYING assertion, delivery and recipient-mean projections',async()=>{
 for(const [name,pressure]of [['main',1],['main',2],['failed',2]] as const){const model=await compileLyingModel(lyingRecipe(1,pressure)),input=await compileLyingInputs(model,initialState,ordered(cases()[name]),seed),r=createLyingRuntime(model,input);await r.settle();const s=r.snapshot(),intent=nativeRecords(s.outputs,1090n)[0],execution=nativeRecords(s.outputs,1093n)[0];expect(f(rec(intent,1090n),4n)).toEqual(u(pressure));expect(f(rec(intent,1090n),5n)).toEqual(list([pressure===1]));expect(f(rec(execution,1093n),4n)).toBe(name!=='failed');expect(nativeEstimate(s.state.read(nativePath(1)).value??emptyKnowledge(),false)).toEqual(list(name==='failed'?[]:[q(pressure===1?1:0,1)]));
  while(await r.settle()){}const final=r.snapshot(),intents=nativeRecords(final.outputs,1090n),effects=nativeRecords(final.outputs,1093n);expect(intents).toHaveLength(4);expect(effects).toHaveLength(4);
  expect(intents.map(v=>f(rec(v,1090n),5n))).toEqual([true,true,false,false].map(b=>list([pressure===1?b:!b])));expect(effects.every(v=>f(rec(v,1093n),4n)===(name!=='failed'))).toBe(true);expect(nativeEstimate(final.state.read(nativePath(1)).value??emptyKnowledge(),false)).toEqual(list(name==='failed'?[]:[q(1,2)]));expect(final.queue).toHaveLength(0);
 }
 console.info('M60 native LYING law1 informing/contrary/failed full originals4 instants each PASS; phases/identities differ');
},110000);
