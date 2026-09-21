import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,map,unsigned as u,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import {beliefRecord} from '../campaign3/beliefCodecs';
import {affectRecord as r,decodeAffect as decode} from '../campaign3/affectCodecs';
import {compileAffectModel,affectRecipe,beliefPath,PROPOSITIONS,aid} from '../campaign3/affectModel';
import {createAffectRun,prepareAffectModel,restoreAffectRun} from '../campaign3/affectFactory';
import {affectOriginals,trained} from './affectFixtures';
it('keeps new records out of inherited Boolean slots',()=>{
 const sample=beliefRecord(735,[PROPOSITIONS[0],true,false,true,true,true,false]),bad={...sample,fields:new Map(sample.fields)};bad.fields.set(4n,r(753,[map([])]));expect(()=>decode(enc(bad))).toThrow();
});
it('requires the registered belief owner and rejects cross-target evidence reuse',async()=>{
 const model=await compileAffectModel(affectRecipe()),support=typedIdentifier(1115,u(17)),estimate=beliefRecord(739,[q(1,1),u(1),{kind:'set',items:[support]}]);
 const patch={operations:[{kind:'set' as const,path:beliefPath(PROPOSITIONS[0]),expected:{presence:false as const},newValue:estimate}]};
 expect(()=>applyStatePatch(model.initial,patch,aid(1025,'authority/foreign'),model.authority)).toThrow();
 const state=new AuthoritativeState([...model.initial.entries(),...PROPOSITIONS.slice(0,2).map(p=>({path:beliefPath(p),value:estimate}))]);expect(()=>model.validateState(state)).toThrow('CROSS_TARGET_SUPPORT');
});
it('restores empty runs and rejects semantic corruption after structural parsing',async()=>{
 const source=affectRecipe(),model=await compileAffectModel(source),initialState=enc(model.initial.canonicalValue()),orderedInputs=enc(list([])),run=await createAffectRun(await prepareAffectModel(source),{initialState,orderedInputs,runSeed:new Uint8Array(32)}),saved=run.save();
 expect((await restoreAffectRun(source,{initialState,orderedInputs,save:saved})).save()).toEqual(saved);
 const parsed=rec(decode(saved),132n),fields=new Map(parsed.fields);fields.set(12n,list([r(753,[map([])])]));await expect(restoreAffectRun(source,{initialState,orderedInputs,save:enc({...parsed,fields})})).rejects.toThrow('WHOLE_EQUALITY');
});
it('restores final-code learned prefixes, rejects altered draws and continues the same random run',async()=>{
 const source=affectRecipe(),model=await compileAffectModel(source),initialState=enc(model.initial.canonicalValue()),orderedInputs=affectOriginals(trained(),1),run=await createAffectRun(await prepareAffectModel(source),{initialState,orderedInputs,runSeed:new Uint8Array(32)});for(let i=0;i<9;i++)await run.settleNextInstant();
 const saved=run.save(),restored=await restoreAffectRun(source,{initialState,orderedInputs,save:saved});expect(restored.save()).toEqual(saved);await run.settleNextInstant();await restored.settleNextInstant();expect(restored.save()).toEqual(run.save());
 const parsed=rec(decode(saved),132n),fields=new Map(parsed.fields),trace=f(parsed,11n);if(typeof trace==='boolean'||trace.kind!=='list')throw Error('trace');let changed=false;
 const tamper=(v:CanonicalValue):CanonicalValue=>{if(typeof v==='boolean')return v;if(v.kind==='record'){if(v.schema.typeId===411n&&!changed){changed=true;const fields=new Map(v.fields);fields.set(3n,u(999));return {...v,fields};}return {...v,fields:new Map([...v.fields].map(([k,x])=>[k,tamper(x)]))};}if(v.kind==='list'||v.kind==='set')return {...v,items:v.items.map(tamper)};return v;};
 fields.set(11n,tamper(trace));expect(changed).toBe(true);expect(key(fields.get(11n)!)).not.toBe(key(trace));await expect(restoreAffectRun(source,{initialState,orderedInputs,save:enc({...parsed,fields})})).rejects.toThrow('WHOLE_EQUALITY');
},120000);
