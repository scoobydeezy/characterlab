import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,set,signed,unsigned as u,rational,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {beliefRecord as r,decodeBelief as decode} from '../campaign3/beliefCodecs';
import {beliefRecipe,PROPOSITIONS,OBSERVER,beliefPath,compileBeliefModel,compileBeliefInputs} from '../campaign3/beliefModel';
import {createBeliefRuntime} from '../campaign3/beliefRuntime';
import {prepareBeliefModel,createBeliefRun,restoreBeliefRun} from '../campaign3/beliefFactory';
import {applyBeliefEvidence} from '../campaign3/beliefMath';
import {multisourceBase} from '../campaign3/multisourceModelRecipe';
import {applyStatePatch,AuthoritativeState} from '../substrate/state';
const frame=(report=true,opportunity=true,monitor=true,visible=true,truth=false,p=PROPOSITIONS[0])=>r(735,[p,true,truth,visible,opportunity,monitor,report]);
const originals=(frames:CanonicalValue[][])=>enc(list(frames.map((v,i)=>r(736,[signed(i+1),list(v)]))));
const initialState=enc(set([])),seed=new Uint8Array(32),is=(v:CanonicalValue,t:bigint)=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t;
async function run(frames:CanonicalValue[][],law=1,goal=-1){const source=beliefRecipe(law,goal),orderedInputs=originals(frames),run=await createBeliefRun(await prepareBeliefModel(source),{initialState,orderedInputs,runSeed:seed});while(await run.settleNextInstant()){}return {run,source,orderedInputs,outputs:items(decode(run.snapshot().outputs),'list')};}
function lastBelief(outputs:readonly CanonicalValue[]){return rec(f(rec(outputs.filter(v=>is(v,742n)).at(-1)!,742n),4n),739n);}
it('learns confidently wrong belief from misleading displays then corrects from permitted contrary evidence',async()=>{
 const wrong=await run([...Array.from({length:8},()=>[frame()]),[]]),corrected=await run([...Array.from({length:8},()=>[frame()]),[frame(false)],[]]);
 expect(f(lastBelief(wrong.outputs),1n)).toEqual(rational(1,1));expect(f(lastBelief(corrected.outputs),1n)).toEqual(rational(8,9));
 const appraisal=rec(wrong.outputs.filter(v=>is(v,743n)).at(-2)!,743n);expect(f(appraisal,6n)).toEqual(rational(8,9));
 expect(wrong.run.snapshot().status).toBe('Active');
});
it('same world truth with different displays yields different beliefs; altered hidden truth preserves all safe bytes',async()=>{
 const a=await run([[frame()],[frame()],[]]),b=await run([[frame(false)],[frame(false)],[]]),hidden=await run([[frame(true,true,true,true,true)],[frame(true,true,true,true,true)],[]]);
 expect(f(lastBelief(a.outputs),1n)).not.toEqual(f(lastBelief(b.outputs),1n));expect(a.run.snapshot().outputs).toEqual(hidden.run.snapshot().outputs);expect(a.run.snapshot().state).toEqual(hidden.run.snapshot().state);
 expect(a.run.snapshot().trace).not.toEqual(hidden.run.snapshot().trace);
});
it('goal-only intervention leaves exact belief state unchanged and changes later appraisal',async()=>{
 const a=await run([[frame()],[]],1,-1),b=await run([[frame()],[]],1,1);
 expect(a.run.snapshot().state).toEqual(b.run.snapshot().state);
 expect(f(rec(a.outputs.filter(v=>is(v,743n)).at(-2)!,743n),5n)).toEqual(rational(-1,1));
 expect(f(rec(b.outputs.filter(v=>is(v,743n)).at(-2)!,743n),5n)).toEqual(rational(1,1));
});
it('safe absence updates; censored and absent opportunity do not reinforce; denied display has no observation',async()=>{
 for(const inert of [frame(false,false),frame(false,true,false),frame(false,true,true,false)]){
  const x=await run([[frame()],...Array.from({length:5},()=>[inert]),[]]);expect(f(lastBelief(x.outputs),1n)).toEqual(rational(1,1));expect(f(lastBelief(x.outputs),2n)).toEqual(u(1));
 }
 const safe=await run([[frame()],[frame(false)],[]]);expect(f(lastBelief(safe.outputs),1n)).toEqual(rational(1,2));
 const denied=await run([[frame(false,true,true,false)],[]]);expect(denied.outputs.filter(v=>is(v,737n)||is(v,741n))).toHaveLength(0);expect(denied.run.snapshot().state).toEqual(initialState);
});
it('retains absence as unknown rather than a known zero and freezes phase50 before140 update',async()=>{
 const x=await run([[frame(false)],[]]),apps=x.outputs.filter(v=>is(v,743n)).map(v=>rec(v,743n));
 expect(apps[0].fields.has(4n)).toBe(false);expect(f(rec(f(apps[2],4n),739n),1n)).toEqual(rational(0,1));expect(apps[3].fields.has(4n)).toBe(false);
});
it('last-observation and no-learning are genuine distinct frozen competitors',async()=>{
 const frames=[[frame()],[frame(false)],[]],mean=await run(frames),last=await run(frames,2),none=await run(frames,3);
 expect(f(lastBelief(mean.outputs),1n)).toEqual(rational(1,2));expect(f(lastBelief(last.outputs),1n)).toEqual(rational(0,1));expect(none.run.snapshot().state).toEqual(initialState);
});
it('restores every complete prefix, continues identically, and rejects altered saved state or trace',async()=>{
 const source=beliefRecipe(),orderedInputs=originals([[frame()],[frame(false)],[]]),model=await prepareBeliefModel(source),run=await createBeliefRun(model,{initialState,orderedInputs,runSeed:seed});
 do{const save=run.save(),restored=await restoreBeliefRun(source,{initialState,orderedInputs,save});expect(restored.save()).toEqual(save);}while(await run.settleNextInstant());
 const saved=rec(decode(run.save()),132n),fields=new Map(saved.fields);fields.set(12n,list([]));
 await expect(restoreBeliefRun(source,{initialState,orderedInputs,save:enc({...saved,fields})})).rejects.toThrow('WHOLE_EQUALITY');
});
it('rejects duplicate targets before runtime, generated originals, nonempty initial state and accessor inputs',async()=>{
 const model=await prepareBeliefModel(beliefRecipe());
 await expect(createBeliefRun(model,{initialState,orderedInputs:originals([[frame(),frame()]]),runSeed:seed})).rejects.toThrow('DUPLICATE');
 await expect(createBeliefRun(model,{initialState,orderedInputs:enc(list([r(737,[typedIdentifier(1115,u(0)),OBSERVER,PROPOSITIONS[0],signed(1),true,true,true])])),runSeed:seed})).rejects.toThrow();
 await expect(createBeliefRun(model,{initialState:enc(set([true])),orderedInputs:originals([]),runSeed:seed})).rejects.toThrow('EMPTY');
 let called=false;await expect(createBeliefRun(model,{initialState,orderedInputs:originals([]),get runSeed(){called=true;return seed;}})).rejects.toThrow('DATA_BYTES');expect(called).toBe(false);
});
it('independent target permutation preserves safe outputs and exact learned state',async()=>{
 const a=frame(),b=frame(false,true,true,true,false,PROPOSITIONS[1]);const x=await run([[a,b],[]]),y=await run([[b,a],[]]);expect(x.run.snapshot().state).toEqual(y.run.snapshot().state);expect(x.run.snapshot().outputs).toEqual(y.run.snapshot().outputs);
});
it('rolls back all six stages and final commit, with faults proven reached',async()=>{
 for(const phase of [50n,110n,120n,124n,130n,140n,undefined]){
  const model=await compileBeliefModel(beliefRecipe()),inputs=await compileBeliefInputs(model,initialState,originals([[frame()]]),seed),runtime=createBeliefRuntime(model,inputs),before=runtime.snapshot();let reached=false;
  await expect(runtime.settleForConformance({onBoundary(boundary,event){if(phase===undefined?boundary==='before-commit':boundary==='after-trace-validation'&&event?.phase===phase){reached=true;throw Error('belief fault');}}})).rejects.toThrow();
  expect(reached).toBe(true);const after=runtime.snapshot();expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(after.queue).toEqual(before.queue);expect(after.allocators).toEqual(before.allocators);expect(after.outputs).toEqual(before.outputs);expect(after.trace).toEqual(before.trace);
 }
});
it('rejects repeated evidence, fabricated class and malformed precision/support',()=>{
 const sample=r(737,[typedIdentifier(1115,u(4)),OBSERVER,PROPOSITIONS[0],signed(1),true,true,true]),e=r(741,[typedIdentifier(1150,u(5)),sample,u(1)]),prior=applyBeliefEvidence(undefined,e,1).next;
 expect(()=>applyBeliefEvidence(prior,e,1)).toThrow('DUPLICATE_EVIDENCE');expect(()=>applyBeliefEvidence(undefined,r(741,[typedIdentifier(1150,u(5)),sample,u(2)]),1)).toThrow('CLASSIFICATION');
 expect(()=>applyBeliefEvidence(r(739,[rational(1,1),u(2),set([typedIdentifier(1115,u(4))])]),e,1)).toThrow('ESTIMATE');
});
it('preserves exact weighted/prediction-error equivalence and resistance to one contradiction',()=>{
 let prior:CanonicalValue|undefined;
 for(let i=0;i<9;i++){
  const x=i<8,old=prior,s=r(737,[typedIdentifier(1115,u(i)),OBSERVER,PROPOSITIONS[0],signed(i+1),true,true,x]),e=r(741,[typedIdentifier(1150,u(100+i)),s,u(x?1:2)]);
  prior=applyBeliefEvidence(prior,e,1).next;
  if(old){const oldMean=f(rec(old,739n),1n) as {numerator:bigint;denominator:bigint},nextMean=f(rec(prior!,739n),1n);
   // mu + (x-mu)/(n+1), calculated independently using integer numerators.
   expect(nextMean).toEqual(rational(BigInt(i)*oldMean.numerator+(x?oldMean.denominator:0n),BigInt(i+1)*oldMean.denominator));}
 }
 expect(f(rec(prior!,739n),1n)).toEqual(rational(8,9));
});
it('prevents new records being smuggled into inherited or newly typed Boolean slots',()=>{
 const sample=r(737,[typedIdentifier(1115,u(4)),OBSERVER,PROPOSITIONS[0],signed(1),true,true,true]),bad=new Map(sample.fields);bad.set(5n,r(738,[OBSERVER,PROPOSITIONS[0]]));
 expect(()=>decode(enc({...sample,fields:bad}))).toThrow('boolean');
 const workspace=rec(multisourceBase().get('task-workspace'),378n),fields=new Map(workspace.fields);fields.set(3n,sample);
 expect(()=>decode(enc({...workspace,fields}))).toThrow();
});
it('records exclusive belief reads and writes, safe evidence ancestry, and experience reservation',async()=>{
 const x=await run([[frame()],[]]),trace=items(decode(x.run.snapshot().trace),'list').map(v=>rec(v,160n));
 for(const t of trace){const phase=f(rec(f(t,4n),130n),3n) as {value:bigint},reads=items(f(t,11n),'list');
  expect(reads.length>0).toBe([50n,140n].includes(phase.value)&&!(phase.value===140n&&reads.length===0));
  for(const read of reads)expect(f(rec(f(rec(read,147n),2n),140n),1n)).toEqual(u(740));
  if(phase.value===130n)expect(items(f(t,9n),'list')).toHaveLength(1);
 }
 const freezes=x.outputs.filter(v=>is(v,744n)).map(v=>rec(v,744n));expect(freezes[0].fields.has(3n)).toBe(true);expect(freezes[1].fields.has(3n)).toBe(false);
 expect(items(f(rec(f(freezes[0],3n),227n),8n),'set')).toHaveLength(1);
});
it('rejects model-byte changes and exceeds neither finite input nor support limits',async()=>{
 const source=beliefRecipe();source.parameters=enc(r(734,[{kind:'text',value:'unaccepted'},u(1),rational(-1,1)]));await expect(prepareBeliefModel(source)).rejects.toThrow('EXACT_MODEL');
 const model=await prepareBeliefModel(beliefRecipe());await expect(createBeliefRun(model,{initialState,orderedInputs:originals(Array.from({length:33},()=>[frame()])),runSeed:seed})).rejects.toThrow('INPUT_LIMIT');
});
it('preserves earlier committed learning when a later contradictory update fails at commit',async()=>{
 const model=await compileBeliefModel(beliefRecipe()),input=await compileBeliefInputs(model,initialState,originals([[frame()],[frame(false)]]),seed),runtime=createBeliefRuntime(model,input);
 await runtime.settle();const before=runtime.snapshot();let reached=false;
 await expect(runtime.settleForConformance({onBoundary(boundary){if(boundary==='before-commit'){reached=true;throw Error('late failure');}}})).rejects.toThrow();
 expect(reached).toBe(true);const after=runtime.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(after.trace).toEqual(before.trace);expect(after.outputs).toEqual(before.outputs);expect(after.queue).toEqual(before.queue);expect(after.allocators).toEqual(before.allocators);
});
it('rejects writes through an unrelated mutation authority',async()=>{
 const model=await compileBeliefModel(beliefRecipe()),value=r(739,[rational(1,1),u(1),set([typedIdentifier(1115,u(4))])]);
 expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:beliefPath(PROPOSITIONS[0]),expected:{presence:false},newValue:value}]},typedIdentifier(1025,{kind:'text',value:'authority/perception'}),model.authority)).toThrow();
});
