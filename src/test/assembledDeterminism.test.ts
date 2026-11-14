/** M115 a0866989: current-reference RNG integration, fixed seed0 and no law change. */
import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,exact,rec,f,uint,items,key,decode,enc,list,text,signed,bytes,outputs,type Run,type CanonicalValue} from './fixtures/assembledEffectEvidence';
import {randomDrawRecord} from '../assembled/codecs';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {createCharacterRuntime} from '../assembled/runtime';
import {comparisonAddress,comparisonRoles} from '../assembled/comparison';
import {RandomRunOracle,ComparisonDrawMap,randomAddressValue,randomCandidate128,naturalRandomKeyValue,type RandomAddress,type RandomDrawRecord} from '../substrate/random';
import {typedIdentifier,unsigned} from '../substrate/canonicalEncoding';

const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('time');return v.value;};
const traces=(r:Run)=>outputs(r.snapshot().trace,160n);
const event=(v:CanonicalValue)=>rec(f(rec(v,160n),4n),130n);
const draws=(r:Run)=>traces(r).flatMap(t=>items(f(t,14n),'list')).map(randomDrawRecord);
async function through(r:Run,t:bigint){for(let i=0;r.snapshot().clock<t;i++){expect(i).toBeLessThan(32);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(t);}
async function finish(r:Run){for(let i=0;await r.settleNextInstant();i++)expect(i).toBeLessThan(32);expect(r.snapshot().clock).toBe(101n);}
const atom=(ns:number,value:string)=>typedIdentifier(ns,text(value));
type Audit={address:RandomAddress;inserted:RandomDrawRecord;actual:RandomDrawRecord};
async function insertedStep(r:Run,audit:Audit[]){
 const original=RandomRunOracle.prototype.drawBounded;
 const spy=vi.spyOn(RandomRunOracle.prototype,'drawBounded').mockImplementation(async function(this:RandomRunOracle,address,span){
  const purpose=address.purposeId.payload;if(typeof purpose==='boolean'||purpose.kind!=='text')throw Error('purpose');
  const inserted=await original.call(this,{...address,purposeId:atom(1042,'purpose/M115-unrelated/'+purpose.value)},span);
  const actual=await original.call(this,address,span);audit.push({address,inserted,actual});return actual;
 });
 try{return await r.settleNextInstant();}finally{spy.mockRestore();}
}
function noInserted(v:CanonicalValue):void{
 if(typeof v==='boolean')return;
 if(v.kind==='text')expect(v.value.includes('M115-unrelated')).toBe(false);
 else if(v.kind==='typedIdentifier')noInserted(v.payload);
 else if(v.kind==='record')for(const x of v.fields.values())noInserted(x);
 else if(v.kind==='list'||v.kind==='set')v.items.forEach(noInserted);
 else if(v.kind==='map')v.entries.forEach(([k,x])=>{noInserted(k);noInserted(x);});
}
const semanticTrace=(r:Run)=>list(traces(r).map(t=>list([...t.fields].filter(([k])=>k!==3n).map(([k,v])=>list([unsigned(k),v])))));
it('M115 unrelated draws preserve the complete native continuation',async()=>{
 const b=fixture('informative',10),m=await prepareCharacterModel(b.s),base=await createCharacterRun(m,b.d),repeat=await createCharacterRun(m,b.d),extra=await createCharacterRun(m,b.d);
 await through(base,9n);await through(repeat,9n);await through(extra,9n);exact(base,repeat);exact(base,extra);expect(draws(base)).toHaveLength(0);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:base.save()});exact(base,restored);
 const audit:Audit[]=[],settlements:string[]=[];
 for(let i=0;i<32;i++){const next=await base.settleNextInstant();expect(await repeat.settleNextInstant()).toBe(next);expect(await restored.settleNextInstant()).toBe(next);expect(await insertedStep(extra,audit)).toBe(next);for(const r of [repeat,restored,extra]){exact(base,r);expect(r.diagnostic()).toEqual(base.diagnostic());}settlements.push(String(base.snapshot().clock)+(next?'':':end'));if(!next)break;expect(i).toBeLessThan(31);}
 expect(base.snapshot().clock).toBe(101n);const actual=draws(base);expect(actual.length).toBeGreaterThanOrEqual(2);expect(new Set(actual.map(d=>key(f(d,1n)))).size).toBe(actual.length);expect(audit).toHaveLength(actual.length);
 for(let i=0;i<actual.length;i++){const d=actual[i],a=audit[i];expect(f(d,1n)).toEqual(randomAddressValue(a.address));expect(f(d,2n)).toEqual(a.actual.effectiveKey);expect(uint(f(d,3n))).toBe(a.actual.result);expect(items(f(d,7n),'list').map(x=>uint(f(rec(x,410n),2n)))).toEqual(a.actual.attempts.map(x=>x.candidate));expect(key(randomAddressValue(a.inserted.localAddress))).not.toBe(key(f(d,1n)));}
 for(const field of ['state','outputs','trace']as const)noInserted(decode(extra.snapshot()[field]));
 const address=audit[0].address,target=await randomCandidate128(b.d.runSeed,naturalRandomKeyValue(address),0),changed=await randomCandidate128(b.d.runSeed,naturalRandomKeyValue({...address,drawIndex:1n}),0);
 expect(target.candidate).not.toBe(changed.candidate);
 // Explicit bad sequential control: addresses supplied by consumers are ignored;
 // SHA words are selected by a mutable ordinal instead. Same seed and first root.
 const stream=()=>{let ordinal=0n;return async()=>randomCandidate128(b.d.runSeed,naturalRandomKeyValue({...address,drawIndex:ordinal++}),0);};
 const s0=stream(),s1=stream(),without=await s0();await s1();const withExtra=await s1();expect(without.candidate).toBe(target.candidate);expect(withExtra.candidate).toBe(changed.candidate);expect(withExtra.candidate).not.toBe(without.candidate);
 console.info('M115 INSERTION PASS '+JSON.stringify({settlements,draws:actual.length,insertions:audit.length,localWord:String(target.candidate),changedIndexWord:String(changed.candidate),sequentialControl:'fails insertion invariance'}));
},550000);

it('M115 effective-key intervention starts at the actual target arbitration',async()=>{
 const b=fixture('informative',10),m=await prepareCharacterModel(b.s),setup=await createCharacterRun(m,b.d);await through(setup,10n);
 const first=draws(setup)[0];expect(first).toBeDefined();const address=comparisonAddress(f(first,1n)),p=address.purposeId.payload;if(typeof p==='boolean'||p.kind!=='text')throw Error('purpose');
 const input=(label:string)=>({...b.d,orderedInputs:enc(list([new ComparisonDrawMap([{localRandomAddress:address,comparisonDrawKey:{keyId:atom(10006,'M115/target/'+label),comparisonRoleId:atom(10005,'assembled/'+p.value.slice(8))}}],comparisonRoles).canonicalValue,...items(decode(b.d.orderedInputs),'list')]))});
 const da=input('A'),db=input('B'),a=await createCharacterRun(m,da),other=await createCharacterRun(m,db);
 await through(a,9n);await through(other,9n);bytes(a.snapshot().state,other.snapshot().state);bytes(a.snapshot().outputs,other.snapshot().outputs);expect(semanticTrace(a)).toEqual(semanticTrace(other));expect(a.runIdentity()).not.toEqual(other.runIdentity());
 const restored=await restoreCharacterRun(b.s,{initialState:da.initialState,orderedInputs:da.orderedInputs,save:a.save()});exact(a,restored);
 await expect(restoreCharacterRun(b.s,{initialState:db.initialState,orderedInputs:db.orderedInputs,save:a.save()})).rejects.toThrow('commitments differ');
 const prefix=traces(a).length;await through(a,10n);await through(other,10n);await through(restored,10n);exact(a,restored);
 const x=draws(a)[0],y=draws(other)[0];expect(f(x,1n)).toEqual(f(first,1n));expect(f(y,1n)).toEqual(f(first,1n));expect(rec(f(x,2n),113n)).toBeDefined();expect(f(x,2n)).not.toEqual(f(y,2n));
 const word=(d:CanonicalValue)=>uint(f(rec(items(f(randomDrawRecord(d),7n),'list')[0],410n),2n));expect(word(x)).not.toBe(word(y));
 const ta=items(semanticTrace(a),'list'),tb=items(semanticTrace(other),'list'),diff=ta.findIndex((t,i)=>key(t)!==key(tb[i]));expect(diff).toBeGreaterThanOrEqual(prefix);const ev=event(traces(a)[diff]);expect(at(f(ev,2n))).toBe(10n);expect(uint(f(ev,3n))).toBe(80n);
 for(let i=0;i<32;i++){const next=await a.settleNextInstant();expect(await restored.settleNextInstant()).toBe(next);exact(a,restored);if(!next)break;expect(i).toBeLessThan(31);}await finish(other);
 expect(a.snapshot().clock).toBe(101n);
 console.info('M115 KEY PASS '+JSON.stringify({firstDivergence:diff,at:'10',phase:80,wordA:String(word(x)),wordB:String(word(y)),faceA:String(uint(f(x,3n))),faceB:String(uint(f(y,3n))),continuation:'9->101 exact'}));
},550000);

it('M115 no-draw replay and deterministic reached failure',async()=>{
 const b=fixture('informative',10),m=await prepareCharacterModel(b.s);
 const d={...b.d,orderedInputs:enc(list(items(decode(b.d.orderedInputs),'list').filter(v=>at(items(v,'list')[0])<10n)))};
 const a=await createCharacterRun(m,d),repeat=await createCharacterRun(m,d);await through(a,9n);
 const restored=await restoreCharacterRun(b.s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});await finish(a);await finish(repeat);await finish(restored);exact(a,repeat);exact(a,restored);expect(draws(a)).toHaveLength(0);expect(outputs(a.snapshot().outputs,409n)).toHaveLength(0);
 const model=await compileCharacterModel(b.s),component=await compileCharacterState(model),inputs=await compileCharacterInputs(model,component,b.d);
 const make=()=>createCharacterRuntime(model,component,inputs,component.initialState(b.d.initialState)),failA=make(),failB=make();
 const snapshot=(r:ReturnType<typeof make>)=>{const v=r.snapshot();return {...v,state:enc(v.state.canonicalValue())};};
 for(const r of [failA,failB]){for(let i=0;r.snapshot().clock<9n;i++){expect(i).toBeLessThan(32);expect(await r.settleNextInstant()).toBeDefined();}expect(r.snapshot().clock).toBe(9n);}
 expect(snapshot(failA)).toEqual(snapshot(failB));const before=snapshot(failA),ledger=failA.committedRandomAddressKeys();let reached=0;
 const spy=vi.spyOn(RandomRunOracle.prototype,'drawBounded').mockImplementation(async()=>{reached++;throw Error('M115 deterministic target fault');});
 try{for(const r of [failA,failB]){await expect(r.settleNextInstant()).rejects.toThrow('M115 deterministic target fault');expect({...snapshot(r),status:before.status}).toEqual(before);expect(r.committedRandomAddressKeys()).toEqual(ledger);expect(()=>r.save(model.modelIdentity,inputs.runIdentity)).toThrow('active quiescent');}}finally{spy.mockRestore();}
 expect(reached).toBe(2);expect(snapshot(failA)).toEqual(snapshot(failB));expect(failA.diagnostic()).toEqual(failB.diagnostic());expect(failA.diagnostic()).toBeDefined();

 console.info('M115 NO-DRAW FAILURE PASS '+JSON.stringify({noDrawFinal:'101',draws:0,matchedFaults:reached,failedAt:'10',priorClock:'9'}));
},550000);
