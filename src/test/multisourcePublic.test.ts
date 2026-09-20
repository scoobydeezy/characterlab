import {it,expect} from 'vitest';
import rejectedRegistry from '../../docs/planning/campaign3-multisource-model-rev1/shared--GroundAggregate/registry.cenc.hex?raw';
import {canonicalEncode as enc,list,record,rational,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {multisourceRecipe,msId} from '../campaign3/multisourceModelRecipe';
import {prepareMultisourceModel,createMultisourceRun,restoreMultisourceRun} from '../campaign3/multisourceFactory';
import {decodeMultisource as decode} from '../campaign3/multisourcePublicCodecs';
import {generalAttentionRecord as ga} from '../campaign3/generalAttentionCodecs';
import {receivingRecord as old} from '../campaign3/receivingCodecs';
import {compileMultisourceModel} from '../campaign3/multisourceModel';
const seed=new Uint8Array(32).fill(7);
it('rejects the preserved first cohort and data accessors without evaluating them',async()=>{
 const recipe=multisourceRecipe('shared','GroundAggregate');
 await expect(prepareMultisourceModel({...recipe.source,registry:new Uint8Array(rejectedRegistry.trim().match(/../g)!.map(x=>parseInt(x,16)))})).rejects.toThrow();
 const model=await prepareMultisourceModel(recipe.source);let read=false;const input={initialState:recipe.initialState,orderedInputs:recipe.orderedInputs,get runSeed(){read=true;return seed;}};
 await expect(createMultisourceRun(model,input)).rejects.toThrow('data-only');expect(read).toBe(false);
},30000);
it('retains equal safe outputs under hidden within-bin reserve variation',async()=>{
 const recipe=multisourceRecipe('shared','GroundAggregate'),internal=await compileMultisourceModel(recipe.source),model=await prepareMultisourceModel(recipe.source);
 const outputs:Uint8Array[]=[];
 for(const amount of [21,29]){const initial=new AuthoritativeState(internal.initialState(recipe.initialState).entries().map(e=>e.path.rootStateTypeId===649n?{path:e.path,value:old(454,[rational(amount,1),signed(0)])}:e));
  const run=await createMultisourceRun(model,{initialState:enc(initial.canonicalValue()),orderedInputs:recipe.orderedInputs,runSeed:seed});await run.settleNextInstant();outputs.push(run.snapshot().outputs);
 }expect(outputs[0]).toEqual(outputs[1]);
},30000);
it('replenishes B through its owner while A evidence remains fixed',async()=>{
 const recipe=multisourceRecipe('independent','GroundAggregate'),model=await prepareMultisourceModel(recipe.source),profile=rec(decode(recipe.source.parameters),710n),target=f(rec(items(f(profile,5n),'list')[1],707n),1n),originals=items(decode(recipe.orderedInputs),'list');
 const delivery=list([signed(50),u(110),msId(1001,'event/multisource/replenish'),ga('LocalReserveReplenishment',[target,rational(30,1)]),list([])]),run=await createMultisourceRun(model,{initialState:recipe.initialState,orderedInputs:enc(list([originals[0],delivery,originals[1]])),runSeed:seed});
 while(await run.settleNextInstant()){}
 const sources=items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===719n).map(v=>rec(v,719n)),strength=(source:CanonicalValue,name:string)=>{const a=items(f(rec(source,719n),3n),'list').map(v=>rec(v,718n)).find(v=>key(f(v,1n))===key(msId(1027,'definition/multisource/'+name)))!;return f(a,4n);};
 expect(strength(sources[0],'body-a')).toEqual(strength(sources[1],'body-a'));expect(strength(sources[0],'task-situation')).not.toEqual(strength(sources[1],'task-situation'));
},30000);
it('rejects locally valid save tampering by exact prefix reexecution',async()=>{
 const recipe=multisourceRecipe('shared','GroundAggregate'),model=await prepareMultisourceModel(recipe.source),run=await createMultisourceRun(model,{initialState:recipe.initialState,orderedInputs:recipe.orderedInputs,runSeed:seed});await run.settleNextInstant();
 const save=rec(decode(run.save()),132n),fields=new Map(save.fields);fields.set(10n,list([]));
 // The exercised arbitration uses at least one RNG address; erase only that ledger.
 expect(items(f(save,10n),'list').length).toBeGreaterThan(0);
 await expect(restoreMultisourceRun(recipe.source,{initialState:recipe.initialState,orderedInputs:recipe.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow('whole-save');
},60000);
it('authorizes no physical anchor reads when every channel is denied',async()=>{
 const recipe=multisourceRecipe('unavailable','GroundAggregate'),model=await prepareMultisourceModel(recipe.source),run=await createMultisourceRun(model,{initialState:recipe.initialState,orderedInputs:recipe.orderedInputs,runSeed:seed});await run.settleNextInstant();
 const trace=items(decode(run.snapshot().trace),'list').map(v=>rec(v,160n)),source=trace[0],reads=items(f(source,11n),'list').map(v=>rec(v,147n));
 expect(reads.some(v=>uint(f(rec(f(v,2n),140n),1n))===649n)).toBe(false);
 const outputs=items(decode(run.snapshot().outputs),'list'),observed=rec(outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===713n)!,713n),frozen=rec(outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===714n)!,714n);
 expect(observed.fields.has(8n)).toBe(false);expect(frozen.fields.has(3n)).toBe(false);
},30000);
it('settles no-option status without fabricating a chosen action',async()=>{
 const recipe=multisourceRecipe('known-zero','GroundAggregate'),internal=await compileMultisourceModel(recipe.source),model=await prepareMultisourceModel(recipe.source),initial=new AuthoritativeState(internal.initialState(recipe.initialState).entries().filter(e=>e.path.rootStateTypeId!==373n));
 const run=await createMultisourceRun(model,{initialState:enc(initial.canonicalValue()),orderedInputs:recipe.orderedInputs,runSeed:seed});await run.settleNextInstant();
 const outputs=items(decode(run.snapshot().outputs),'list'),decision=rec(outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===728n)!,728n),outcome=rec(outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===733n)!,733n);
 expect(uint(f(decision,4n))).toBe(1n);expect(decision.fields.has(5n)).toBe(false);expect(uint(f(outcome,3n))).toBe(0n);
},30000);
