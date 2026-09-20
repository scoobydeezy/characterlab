import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,signed,unsigned as u} from '../substrate/canonicalEncoding';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {compileGeneralDeclarations,buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {createGeneralSourceRuntime,restoreGeneralSourcePrefix} from '../campaign3/generalSourceRuntime';
import {decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {generalBindingContext,generalRecord as r} from '../campaign3/generalBindingProfile';
const yieldWorker=()=>new Promise(resolve=>setTimeout(resolve,0));
const sameBytes=(a:Uint8Array,b:Uint8Array)=>a.length===b.length&&a.every((value,index)=>value===b[index]);

it('replays an actual pending attribution/qualification prefix and preserves later credit and expiry',async()=>{
 const model=await compileGeneralDeclarations(buildGeneralDeclarationPacket('credit-significance-first')),run=createGeneralSourceRuntime(model);
 while(run.snapshot().clock<37n){await run.settleNextInstant();await yieldWorker();}
 const prefix=run.prefixBytes(),restored=await restoreGeneralSourcePrefix(model,prefix);
 expect(sameBytes(restored.prefixBytes(),prefix)).toBe(true);
 expect(restored.snapshot().queue.some(e=>e.dueAt===38n)).toBe(true);
 while(run.snapshot().queue.length){await run.settleNextInstant();await restored.settleNextInstant();expect(sameBytes(restored.prefixBytes(),run.prefixBytes())).toBe(true);await yieldWorker();}
 expect(restored.snapshot().clock).toBe(100n);
},90000);

it('rejects changed allocator, pending events, state, trace and output even when the internal prefix decodes',async()=>{
 const model=await compileGeneralDeclarations(buildGeneralDeclarationPacket()),run=createGeneralSourceRuntime(model);
 // The short probe prefix has actual outputs, trace, a learned prediction and
 // pending originals. Each tamper remains canonical but lacks replay authority.
 await run.settleNextInstant();const original=items(decode(run.prefixBytes(),generalBindingContext()),'list');
 const variants=Array.from({length:5},(_,i)=>{const v=[...original];
  if(i===0){const a=rec(v[2],131n);v[2]=r(131,[u(999),f(a,2n),f(a,3n)]);}
  if(i===1)v[3]=list([]);
  if(i===2)v[1]=model.initial.build().canonicalValue();
  if(i===3)v[4]=list([]);
  if(i===4)v[5]=list([]);
  return enc(list(v));
 });
 for(const bytes of variants)await expect(restoreGeneralSourcePrefix(model,bytes)).rejects.toThrow('complete prefix equality');
 const invalidClock=[...original];invalidClock[0]=signed(99);await expect(restoreGeneralSourcePrefix(model,enc(list(invalidClock)))).rejects.toThrow('not a complete original prefix');
},60000);
