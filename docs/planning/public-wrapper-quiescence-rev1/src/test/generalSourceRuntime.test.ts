import {it,expect} from 'vitest';
import {compileGeneralDeclarations,buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {createGeneralSourceRuntime} from '../campaign3/generalSourceRuntime';
import {generalSubject} from '../campaign3/generalBindingProfile';
import {canonicalEncode as enc,unsigned as u,rational as q,list} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {generalRecord as r,generalBindingContext} from '../campaign3/generalBindingProfile';
import {decodeGeneralAttention} from '../campaign3/generalAttentionCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
it.each(['baseline','select-k0','recall-k0','denied-port','source-consequence-lane'])('settles the admitted %s source calendar through the actual scheduler',async recipe=>{
 const model=await compileGeneralDeclarations(buildGeneralDeclarationPacket(recipe)),run=createGeneralSourceRuntime(model),work:number[]=[];
 while(run.snapshot().queue.length){const result=await run.settleNextInstant();work.push(result!.executedEvents.length);expect(result!.executedEvents.every((e,i,all)=>i===0||e.phase>=all[i-1].phase)).toBe(true);model.state.restoreState(enc(run.snapshot().state.canonicalValue()));}
 expect(work).toHaveLength(11);expect(Math.max(...work)).toBeLessThanOrEqual(90);const state=run.snapshot().state,who=generalSubject();
 const ledger=rec(state.read({rootStateTypeId:630n,fieldId:1n,selectors:[{kind:'mapKey',key:who.character}]}).value!,555n);
 expect(items(f(ledger,1n),'list').length).toBeGreaterThan(0);expect(await run.settleNextInstant()).toBeUndefined();
 if(recipe==='source-consequence-lane'){
  const outputs=run.snapshot().outputs;
  expect(outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===619n)).toHaveLength(4);
  expect(outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===592n)).toHaveLength(4);
  expect(outputs.some(v=>typeof v!=='boolean'&&v.kind==='record'&&[638n,641n,643n].includes(v.schema.typeId))).toBe(false);
 }
},30000);
it('rolls back an injected terminal failure including output IDs, pending children and protocol enrollment',async()=>{
 const model=await compileGeneralDeclarations(buildGeneralDeclarationPacket()),run=createGeneralSourceRuntime(model);await run.settleNextInstant();await run.settleNextInstant();const before=run.snapshot();
 let injected=false;await expect(run.settleNextInstantForConformance({onBoundary:(boundary,event)=>{if(boundary==='after-state-validation'&&event?.phase===140n){injected=true;throw Error('injected terminal failure');}}})).rejects.toThrow(/injected terminal failure/);expect(injected).toBe(true);
 const after=run.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(after.allocators).toEqual(before.allocators);expect(after.queue).toEqual(before.queue);expect(after.outputs).toEqual(before.outputs);expect(after.committedTrace).toEqual(before.committedTrace);expect(run.diagnostic()).toBeDefined();
});
it('rejects incoherent quiescent owner state and admits actual extended trace payloads',async()=>{
 const model=await compileGeneralDeclarations(buildGeneralDeclarationPacket()),run=createGeneralSourceRuntime(model);
 for(let i=0;i<3;i++)await run.settleNextInstant();const snapshot=run.snapshot(),state=snapshot.state;
 model.validateQuiescent(state,snapshot.clock,snapshot.allocators.nextRuntimeId);
 expect(()=>model.validateQuiescent(new AuthoritativeState(state.entries().filter(e=>e.path.rootStateTypeId!==630n)),snapshot.clock)).toThrow(/required/);
 const missingHistory=new AuthoritativeState(state.entries().map(e=>e.path.rootStateTypeId===632n?{...e,value:r(595,[list([])])}:e));expect(()=>model.validateQuiescent(missingHistory,snapshot.clock)).toThrow(/history/);
 expect(()=>model.validateQuiescent(state,snapshot.clock,0n)).toThrow(/allocator/);
 expect(enc(decodeGeneralAttention(enc(list(snapshot.committedTrace)),generalBindingContext()))).toEqual(enc(list(snapshot.committedTrace)));
},30000);
it.each([['feedback-both',1,1,3,5,7,5],['source-zero-concern',1,1,1,1,1,1],['source-denied-probe',2,3,1,1,1,1],['source-no-task-access',3,3,1,1,1,1]] as const)('preserves actual source feedback branches for %s',async(recipe,status,branch,rn,rd,on,od)=>{
 const model=await compileGeneralDeclarations(buildGeneralDeclarationPacket(recipe)),run=createGeneralSourceRuntime(model);
 while(run.snapshot().queue.length)await run.settleNextInstant();
 const outputs=run.snapshot().outputs,modulations=outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[641n,643n].includes(v.schema.typeId));expect(modulations).toHaveLength(8);
 for(const value of modulations){const modulation=rec(f(rec(value,(value as ReturnType<typeof rec>).schema.typeId),3n),639n);expect(f(modulation,1n)).toEqual(u(status));expect(f(modulation,2n)).toEqual(u(branch));expect(f(modulation,3n)).toEqual(q(rn,rd));expect(f(modulation,4n)).toEqual(q(on,od));}
 expect(run.snapshot().state.entries().some(e=>e.path.rootStateTypeId===362n)).toBe(recipe!=='source-denied-probe');
},30000);
