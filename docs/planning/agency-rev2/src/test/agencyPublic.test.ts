import { it, expect } from 'vitest';
import { canonicalEncode as enc, list, unsigned as u, record } from '../substrate/canonicalEncoding';
import { dataRecord as rec, dataField as f, dataItems as items, dataKey as key } from '../campaign2/canonicalData';
import { agencyRecord as r, decodeAgency as decode } from '../campaign3/agencyCodecs';
import { compileAgencyModel, compileAgencyInputs, agencyRecipe, STAGES, eventId, personPath, historyPath, owner, OBSERVERS } from '../campaign3/agencyModel';
import { createAgencyRuntime } from '../campaign3/agencyRuntime';
import { prepareAgencyModel, createAgencyRun, restoreAgencyRun } from '../campaign3/agencyFactory';
import { agencyObserverView } from '../campaign3/agencyMath';
import { AuthoritativeState, applyStatePatch } from '../substrate/state';
import { decodeCommit } from '../campaign3/commitCodecs';
import { cases, ordered, original, initialState, seed, records } from './agencyFixtures';

async function run(name:keyof ReturnType<typeof cases>='main',law=1) {
  const source=agencyRecipe(law),orderedInputs=ordered(cases()[name]),run=await createAgencyRun(await prepareAgencyModel(source),{initialState,orderedInputs,runSeed:seed});
  while(await run.settleNextInstant()){}
  return {run,source,orderedInputs,outputs:items(decode(run.snapshot().outputs),'list')};
}
const lastKnowledge=(outputs:readonly ReturnType<typeof r>[],i:number)=>{
  const probe=records(outputs,981n).filter(p=>key(f(p,3n))===key(OBSERVERS[i])).at(-1)!;
  return items(f(rec(f(probe,4n),979n),1n),'list').map(v=>rec(v,978n));
};
it('keeps actual frozen intent and expression equal under blockage, success and incompetence',async()=>{
  const all=await Promise.all(['blocked','success','incompetent'].map(n=>run(n as 'blocked')));
  for(const type of [403n,408n,409n,425n,426n,432n])all.forEach(x=>expect(records(x.outputs,type)).toEqual(records(all[0].outputs,type)));
  expect(all.map(x=>f(records(x.outputs,974n)[0],6n))).toEqual([false,true,false]);
  all.forEach(x=>expect(items(f(rec(f(records(x.outputs,986n)[0],3n),983n),1n),'list')).toHaveLength(1));
},30000);
it('matches failure-only B under different hidden causes while A is sensitive to the witnessed blocker',async()=>{
  const blocked=await run('blocked'),incompetent=await run('incompetent'),other=await run('otherBlocker'),both=await run('blockedIncompetent');
  expect(blocked.run.observerView(1)).toEqual(incompetent.run.observerView(1));
  expect(blocked.run.observerView(1)).toEqual(other.run.observerView(1));
  expect(blocked.run.observerView(0)).not.toEqual(other.run.observerView(0));
  for(const i of [0,1])expect(blocked.run.observerView(i)).toEqual(both.run.observerView(i));
  const hidden=await run('hidden'),success=await run('hiddenSuccess');
  for(const i of [0,1])expect(hidden.run.observerView(i)).toEqual(success.run.observerView(i));
},30000);
it('keeps access selective and updates only the next instant probe with exact alternative folds',async()=>{
  const mean=await run(),last=await run('main',2),swapped=await run('swapped');
  const knowledge=(x:Awaited<ReturnType<typeof run>>,i:number)=>lastKnowledge(x.outputs as ReturnType<typeof r>[],i);
  expect([f(knowledge(mean,0)[0],2n),f(knowledge(mean,0)[0],3n)]).toEqual([u(1),u(2)]);
  expect([f(knowledge(last,0)[0],2n),f(knowledge(last,0)[0],3n)]).toEqual([u(0),u(1)]);
  expect([f(knowledge(mean,1)[0],2n),f(knowledge(mean,1)[0],3n)]).toEqual([u(0),u(1)]);
  const probe2=records(mean.outputs,981n).find(p=>key(f(p,3n))===key(OBSERVERS[1])&&(f(p,2n) as {value:bigint}).value===2n)!;
  expect(items(f(rec(f(probe2,4n),979n),1n),'list')).toHaveLength(0);
  expect(knowledge(swapped,0)).toHaveLength(0);expect(knowledge(swapped,1)).toHaveLength(1);
},30000);
it('retains report contradiction and deduplication without rewriting old expressions',async()=>{
  const correction=await run('correction'),duplicate=await run('duplicate'),repeated=await run('repeated');
  const corrected=lastKnowledge(correction.outputs as ReturnType<typeof r>[],1)[0],dedup=lastKnowledge(duplicate.outputs as ReturnType<typeof r>[],1)[0];
  expect([f(corrected,2n),f(corrected,3n)]).toEqual([u(1),u(2)]);
  expect([f(dedup,2n),f(dedup,3n)]).toEqual([u(0),u(1)]);
  expect(lastKnowledge(repeated.outputs as ReturnType<typeof r>[],0)).toHaveLength(2);
  expect(items(f(rec(f(records(repeated.outputs,986n).at(-1)!,3n),983n),1n),'list')).toHaveLength(2);
},30000);
it('rejects each deliberate reduction or boundary-violating control on its named witness',async()=>{
  const baseline=await run('blocked'),outcome=await run('blocked',3),omniscient=await run('blocked',4),successIntent=await run('blocked',5);
  expect(lastKnowledge(baseline.outputs as ReturnType<typeof r>[],0)).toHaveLength(1);
  expect(lastKnowledge(outcome.outputs as ReturnType<typeof r>[],0)).toHaveLength(0);
  expect(lastKnowledge(baseline.outputs as ReturnType<typeof r>[],1)).toHaveLength(0);
  expect(lastKnowledge(omniscient.outputs as ReturnType<typeof r>[],1)).toHaveLength(1);
  expect(items(f(rec(f(records(successIntent.outputs,986n)[0],3n),983n),1n),'list')).toHaveLength(0);
  expect(records(successIntent.outputs,426n)).toEqual(records(baseline.outputs,426n));
},30000);
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} without partial evidence, history or RNG`,async()=>{
  const model=await compileAgencyModel(agencyRecipe()),input=await compileAgencyInputs(model,initialState,ordered(stage==='report'?cases().main:cases().repeated),seed),runtime=createAgencyRuntime(model,input);
  await runtime.settle();
  const before=runtime.snapshot();let reached=false;
  await expect(runtime.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('agency fault');}}})).rejects.toThrow();
  expect(reached).toBe(true);const after=runtime.snapshot();
  expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));
  for(const field of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[field]).toEqual(before[field]);
  expect(()=>runtime.save()).toThrow();
},30000);
it('rejects malformed originals, foreign writers/schemas and nonempty initial state',async()=>{
  const m=await compileAgencyModel(agencyRecipe());
  await expect(compileAgencyInputs(m,initialState,ordered([original(1,2)]),seed)).rejects.toThrow('REPORT_CONTEXT');
  await expect(compileAgencyInputs(m,initialState,ordered([original(1),original(2)]),seed)).rejects.toThrow('REUSED_ATTEMPT');
  await expect(compileAgencyInputs(m,initialState,ordered([original(1),original(2,2),original(3,2,1,{positive:true})]),seed)).rejects.toThrow('REPORT_CONFLICT');
  await expect(compileAgencyInputs(m,enc(list([])),ordered(cases().main),seed)).rejects.toThrow('INITIAL_STATE');
  for(const path of [personPath(1),historyPath])expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path,expected:{presence:false},newValue:r(979,[list([])])}]},owner('update-a'),m.authority)).toThrow();
  expect(()=>decodeCommit(enc(original(1)))).toThrow();expect(()=>agencyObserverView([original(1)],0)).toThrow('ROSTER');
});
it('restores exact whole saves and rejects edited RNG, original inputs and observer handles',async()=>{
  const x=await run(),save=x.run.save(),restored=await restoreAgencyRun(x.source,{initialState,orderedInputs:x.orderedInputs,save});
  expect(restored.save()).toEqual(save);const v=rec(decode(save),132n),fields=new Map(v.fields);
  expect(items(f(v,10n),'list').length).toBeGreaterThan(0);fields.set(10n,list([]));
  await expect(restoreAgencyRun(x.source,{initialState,orderedInputs:x.orderedInputs,save:enc(record(v.schema,fields))})).rejects.toThrow();
  await expect(restoreAgencyRun(x.source,{initialState,orderedInputs:ordered(cases().success),save})).rejects.toThrow();
  expect(()=>x.run.observerView(2)).toThrow('OBSERVER');
},30000);
