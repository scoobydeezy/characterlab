import {it,expect} from 'vitest';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {applyStatePatch} from '../substrate/state';
import {compileControlModel,controlRecipe,goalPath,owner} from '../campaign3/controlModel';
import {controlRecord as cr,decodeControl} from '../campaign3/controlCodecs';
import {habitRecord as hr,decodeHabit} from '../campaign3/habitCodecs';
import {compileControlInputs} from '../campaign3/controlModel';
import {createControlRuntime} from '../campaign3/controlRuntime';
import {controlCases,controlInputs,seed} from './controlFixtures';
it('keeps old one-reason grammar closed while successor admits the actual two-reason contest',async()=>{
 const m=await compileControlModel(controlRecipe()),i=await compileControlInputs(m,enc(m.initial.canonicalValue()),controlInputs(controlCases().main),seed),r=createControlRuntime(m,i);while(await r.settle()){}
 const raws=r.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1017n).map(v=>rec(v,1017n)),raw=raws[4];
 expect(()=>decodeControl(enc(raw))).not.toThrow();expect(()=>hr(828,[f(raw,1n),f(raw,2n),f(raw,3n)])).toThrow('list bound');expect(()=>decodeHabit(enc(raw))).toThrow();
 const signals=f(raw,3n);if(typeof signals==='boolean'||signals.kind!=='list')throw Error('signals');expect(()=>cr(1017,[f(raw,1n),f(raw,2n),list([...signals.items,...signals.items])])).toThrow();
},30000);
it('rejects a workspace writer mutating goal state and rejects forged initial history',async()=>{
 const m=await compileControlModel(controlRecipe()),prior=m.initial.read(goalPath).value!;
 expect(()=>applyStatePatch(m.initial,{operations:[{kind:'set',path:goalPath,expected:{presence:true,value:prior},newValue:cr(1011,[true])}]},owner('appraise'),m.authority)).toThrow();
 await expect(compileControlInputs(m,enc(list([])),controlInputs(controlCases().main),seed)).rejects.toThrow('INITIAL_STATE');
});
