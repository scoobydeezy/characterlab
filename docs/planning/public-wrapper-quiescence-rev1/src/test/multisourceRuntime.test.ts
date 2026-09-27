import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,signed,unsigned as u,rational} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataUnsigned as uint,dataItems as items} from '../campaign2/canonicalData';
import {multisourceRecipe,MS_STAGES,msId} from '../campaign3/multisourceModelRecipe';
import {decodeMultisource as decode} from '../campaign3/multisourcePublicCodecs';
import {generalAttentionRecord as ga} from '../campaign3/generalAttentionCodecs';
import {compileMultisourceModel} from '../campaign3/multisourceModel';
import {compileMultisourceInputs} from '../campaign3/multisourceInputs';
import {createMultisourceRuntime} from '../campaign3/multisourceRuntime';
async function runtime(){const recipe=multisourceRecipe('shared','GroundAggregate'),model=await compileMultisourceModel(recipe.source),inputs=await compileMultisourceInputs(model,recipe.initialState,recipe.orderedInputs,new Uint8Array(32).fill(7));return createMultisourceRuntime(model,inputs,model.initialState(recipe.initialState));}
it('settles actual sources through separate arbitration and execution outputs',async()=>{
 const run=await runtime();while(await run.settleNextInstant()){}const s=run.snapshot();
 expect(s.clock).toBe(100n);expect(s.outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===733n)).toHaveLength(2);
 expect(s.trace).toHaveLength(28);expect(run.save().length).toBeGreaterThan(0);
 const decision=rec(s.outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===728n)!,728n);expect(uint(f(decision,4n))).toBe(3n);
},30000);
it('rolls back the whole instant including provisional RNG addresses',async()=>{
 const run=await runtime(),before=run.snapshot();let reached=false;
 await expect(run.settleNextInstantForConformance({onBoundary(boundary,event){if(boundary==='after-trace-validation'&&event?.phase===60n){reached=true;throw Error('forced after arbitration');}}})).rejects.toThrow();
 expect(reached).toBe(true);
 const after=run.snapshot();expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(enc(list(after.outputs))).toEqual(enc(list(before.outputs)));expect(after.allocators).toEqual(before.allocators);expect(after.queue).toEqual(before.queue);expect(after.trace).toEqual(before.trace);expect(run.committedRandomAddressKeys()).toEqual([]);
},30000);
it('rolls back at every current-lane stage and the final commit barrier',async()=>{
 for(const phase of [...MS_STAGES.slice(0,13).map(s=>BigInt(s[1])),undefined]){
  const run=await runtime(),before=run.snapshot();let reached=false;
  await expect(run.settleNextInstantForConformance({onBoundary(boundary,event){if(phase===undefined?boundary==='before-commit':boundary==='after-trace-validation'&&event?.phase===phase){reached=true;throw Error('selected boundary');}}})).rejects.toThrow();
  expect(reached).toBe(true);const after=run.snapshot();expect(after.allocators).toEqual(before.allocators);expect(after.queue).toEqual(before.queue);expect(after.trace).toEqual(before.trace);expect(after.outputs).toEqual(before.outputs);expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(run.committedRandomAddressKeys()).toEqual([]);
 }
},60000);
it('does not retire tasks when the deadline transaction fails',async()=>{
 const run=await runtime();await run.settleNextInstant();await run.settleNextInstant();const before=run.snapshot(),ledger=run.committedRandomAddressKeys();let reached=false;
 await expect(run.settleNextInstantForConformance({onBoundary(boundary,event){if(boundary==='after-trace-validation'&&event?.phase===140n){reached=true;throw Error('deadline fault');}}})).rejects.toThrow();
 expect(reached).toBe(true);const after=run.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(after.queue).toEqual(before.queue);expect(after.trace).toEqual(before.trace);expect(after.outputs).toEqual(before.outputs);expect(after.allocators).toEqual(before.allocators);expect(run.committedRandomAddressKeys()).toEqual(ledger);
},30000);
it('isolates the actual generated parent from conformance observer copies',async()=>{
 const run=await runtime(),control=await runtime();let reached=false;
 await run.settleNextInstantForConformance({onBoundary(boundary,event){if(boundary==='before-event-validation'&&event?.phase===51n){reached=true;const source=rec(event.payload,719n);const fields=source.fields;if(!(fields instanceof Map))throw Error('expected detached mutable map');fields.set(1n,{kind:'typedIdentifier',namespaceId:1149n,payload:{kind:'unsigned',value:999n}});}}});
 await control.settleNextInstant();expect(reached).toBe(true);
 const actual=enc(list(run.snapshot().outputs)),expected=enc(list(control.snapshot().outputs));expect(actual.length===expected.length&&actual.every((v,i)=>v===expected[i])).toBe(true);
},30000);
it('rolls back reserve replenishment and preserves already committed RNG addresses',async()=>{
 const recipe=multisourceRecipe('independent','GroundAggregate'),model=await compileMultisourceModel(recipe.source),p=model.profile(),target=f(rec(items(f(p,5n),'list')[1],707n),1n),originals=items(decode(recipe.orderedInputs),'list'),delivery=list([signed(50),u(110),msId(1001,'event/multisource/replenish'),ga('LocalReserveReplenishment',[target,rational(30,1)]),list([])]);
 const inputs=await compileMultisourceInputs(model,recipe.initialState,enc(list([originals[0],delivery,originals[1]])),new Uint8Array(32).fill(7)),run=createMultisourceRuntime(model,inputs,model.initialState(recipe.initialState));await run.settleNextInstant();const before=run.snapshot(),ledger=run.committedRandomAddressKeys();let reached=false;
 await expect(run.settleNextInstantForConformance({onBoundary(boundary,event){if(boundary==='after-trace-validation'&&event?.phase===110n){reached=true;throw Error('replenishment fault');}}})).rejects.toThrow();
 expect(reached).toBe(true);const after=run.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(after.queue).toEqual(before.queue);expect(after.trace).toEqual(before.trace);expect(after.outputs).toEqual(before.outputs);expect(after.allocators).toEqual(before.allocators);expect(run.committedRandomAddressKeys()).toEqual(ledger);
},30000);
