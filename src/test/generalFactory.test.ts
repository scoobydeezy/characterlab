import {it,expect} from 'vitest';
import freeze from '../../docs/planning/campaign3-general-attention-model-rev2/FREEZE.json';
import {generalAttentionModelSource as source,prepareGeneralAttentionModel as prepare,generalAttentionModelIdentity as identity,generalAttentionInitialState as initial,generalAttentionOrderedInputs as originals,createGeneralAttentionRun as create,restoreGeneralAttentionRun as restore,type GeneralAttentionModel} from '../campaign3/generalFactory';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {generalBindingContext} from '../campaign3/generalBindingProfile';
import {dataKey as key,dataItems as items} from '../campaign2/canonicalData';
it.each(freeze.models.map(m=>m.name))('admits only the frozen exact model %s',async name=>{
 const token=await prepare(source(name));expect(key(decode(identity(token),generalBindingContext()))).toBe(freeze.models.find(m=>m.name===name)!.modelIdentity);
});
it('rejects callback/accessor/extra-field ingress without invoking getters and copies source bytes',async()=>{
 const packet=source('baseline'),pending=prepare(packet);packet.definitions.fill(0);const token=await pending;
 let called=false;const getter={...source('baseline')};Object.defineProperty(getter,'definitions',{get(){called=true;return new Uint8Array();}});
 await expect(prepare(getter)).rejects.toThrow('exact data fields');expect(called).toBe(false);
 const callbackPacket={...source('baseline'),resolver:()=>null};await expect(prepare(callbackPacket)).rejects.toThrow('exact data fields');
 await expect(create({} as GeneralAttentionModel,{initialState:initial(token),orderedInputs:originals(token),runSeed:new Uint8Array(32)})).rejects.toThrow('prepared frozen model');
 const subclass=new class extends Uint8Array{}(32);await expect(create(token,{initialState:initial(token),orderedInputs:originals(token),runSeed:subclass})).rejects.toThrow('plain byte');
 await expect(prepare({...source('baseline'),recipe:'missing-position'})).rejects.toThrow('outside frozen');
});
it('rejects invented originals and learned S0 before execution, and restores its actual public prefix',async()=>{
 const token=await prepare(source('baseline')),inputs={initialState:initial(token),orderedInputs:originals(token),runSeed:new Uint8Array(32)};
 const rows=items(decode(inputs.orderedInputs,generalBindingContext()),'list');
 await expect(create(token,{...inputs,orderedInputs:enc(list([...rows,rows[0]]))})).rejects.toThrow('original calendar differs');
 await expect(create(token,{...inputs,initialState:enc(list([]))})).rejects.toThrow('original S0 differs');
 const run=await create(token,inputs);for(let i=0;i<3;i++)await run.settleNextInstant();const saved=run.save();
 const resumed=await restore(source('baseline'),{initialState:inputs.initialState,orderedInputs:inputs.orderedInputs,save:saved});
 expect(resumed.snapshot().clock).toBe(3n);expect(key(decode(resumed.runIdentity(),generalBindingContext()))).toBe(key(decode(run.runIdentity(),generalBindingContext())));
 const detached=resumed.snapshot();detached.state.fill(0);expect(resumed.snapshot().state[0]).not.toBe(0);
 await run.settleNextInstant();await resumed.settleNextInstant();const a=run.save(),b=resumed.save();expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
},30000);
