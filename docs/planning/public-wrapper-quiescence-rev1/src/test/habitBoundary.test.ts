import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,rational as q,signed,unsigned as u,typedIdentifier} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {habitRecord as r,decodeHabit as decode} from '../campaign3/habitCodecs';
import {receivingRecord as old} from '../campaign3/receivingCodecs';
import {habitSummary,appendHabit} from '../campaign3/habitMath';
import {habitRecipe,compileHabitModel,compileHabitInputs,beliefPath,historyPath} from '../campaign3/habitModel';
import {createHabitRuntime} from '../campaign3/habitRuntime';
import {habitInputs} from './habitFixtures';
it('retains unknown versus known negative and excludes unobserved action from learning',async()=>{
 for(const visible of [false,true]){const m=await compileHabitModel(habitRecipe()),inputs=habitInputs([{at:1,mode:1,reward:false,visible}]),i=await compileHabitInputs(m,enc(m.initial.canonicalValue()),inputs,new Uint8Array(32)),runtime=createHabitRuntime(m,i);await runtime.settle();expect(runtime.snapshot().state.read(beliefPath).presence).toBe(visible);expect(items(f(rec(runtime.snapshot().state.read(historyPath).value!,820n),1n),'list')).toHaveLength(visible?1:0);if(visible)expect(f(rec(runtime.snapshot().state.read(beliefPath).value!,822n),1n)).toBe(false);}
});
it('keeps cue folds independent and exhibits different bounded extinction laws',()=>{
 const entries=[true,true,true,false].map((reward,i)=>r(819,[typedIdentifier(1155,u(i)),signed(i+1),true,reward])),journal=r(820,[list(entries)]),residual=habitSummary({candidate:1,law:1},journal),linear=habitSummary({candidate:1,law:2},journal);expect(f(rec(residual,824n),1n)).toEqual(q(0,1));expect(f(rec(residual,824n),2n)).toEqual(q(7,16));expect(f(rec(linear,824n),2n)).toEqual(q(1,2));
 const information=r(836,[typedIdentifier(1155,u(10)),signed(10),true,false,false]);expect(appendHabit(journal,information)).toEqual({next:journal,applied:false});
});
it('does not widen inherited typed fields or summary unit domains',()=>{
 const inherited=rec(old(439,[q(1,4),u(3)]),439n),fields=new Map(inherited.fields);fields.set(2n,r(824,[q(0,1),q(0,1),u(0)]));expect(()=>decode(enc({...inherited,fields}))).toThrow();expect(()=>r(824,[q(0,1),q(2,1),u(0)])).toThrow();
});
