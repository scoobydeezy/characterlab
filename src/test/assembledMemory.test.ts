import {describe,it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun,characterModelIdentity} from '../assembled/character';
import {MEMORY_RULES,MEMORY_REGISTRY,ATTENTION_RULES,ATTENTION_REGISTRY,compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {RECALL,EPISODIC_OWNER,MEMORY_EVIDENCE,MEMORY_FORMATION,isBodyEpisodePath} from '../assembled/memory';
import {BODY_SAMPLE,BODY_SELECTION_REPORT,bodyId} from '../assembled/body';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {canonicalEncode as enc,list,text,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {dataItems as items,dataField as f,dataRecord as rec,dataKey as key,dataUnsigned as uint,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
import {interactionSource,interactionData,outputs,withoutChoice} from './fixtures/assembledInteraction';
import {workLimit} from './fixtures/assembledCharacter';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const source=(capacity=1,permitted=true,available=true,old=false)=>{const s=interactionSource(permitted,available);return {...s,rulesVersion:old?ATTENTION_RULES:MEMORY_RULES,registrySchemaVersion:old?ATTENTION_REGISTRY:MEMORY_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(BODY_SELECTION_REPORT),unsigned(capacity)])]))};};
const reports=(run:Run,label:string)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const entries=(run:Run)=>restoreAuthoritativeState(decode(run.snapshot().state)).entries();
const bodyEntries=(run:Run)=>entries(run).filter(e=>isBodyEpisodePath(e.path));
const traces=(run:Run,name:string)=>outputs(run.snapshot().trace,160n).filter(t=>txt(id(f(t,7n)).payload)===name);
const event=(trace:CanonicalValue)=>rec(f(rec(trace,160n),4n),130n);
const draws=(run:Run)=>outputs(run.snapshot().trace,160n).flatMap(v=>items(f(v,14n),'list'));
const exact=(a:Run,b:Run)=>{expect(b.snapshot()).toEqual(a.snapshot());expect(b.save()).toEqual(a.save());expect(b.runIdentity()).toEqual(a.runIdentity());};
async function through(run:Run,at:bigint){for(let n=0;run.snapshot().clock<at;n++){expect(n).toBeLessThan(32);expect(await run.settleNextInstant()).toBe(true);}expect(run.snapshot().clock).toBe(at);}
async function finish(run:Run){for(let n=0;await run.settleNextInstant();n++)expect(n).toBeLessThan(32);expect(run.snapshot().clock).toBe(10n);expect(run.diagnostic()).toBeUndefined();}
const predictions=(run:Run)=>entries(run).filter(e=>e.path.rootStateTypeId===362n).map(e=>[statePathValue(e.path),f(rec(e.value,361n),1n),items(f(rec(e.value,361n),2n),'set').length]);
const tasks=(run:Run)=>entries(run).filter(e=>e.path.rootStateTypeId===373n).map(e=>[statePathValue(e.path),e.path.fieldId===1n?f(rec(e.value,372n),1n):e.value]);
function joins(run:Run){
 const episode=bodyEntries(run);expect(episode).toHaveLength(1);const a=items(episode[0].value,'list');expect(a[2]).toEqual(outputs(run.snapshot().outputs,461n)[0]);expect(a[4]).toEqual(list(reports(run,BODY_SELECTION_REPORT)[0]));
 const evidence=traces(run,'event/assembled-memory-evidence')[0],formation=traces(run,'event/assembled-memory-formation')[0],recall=traces(run,'event/assembled-memory-recall')[0];
 expect(f(event(evidence),3n)).toEqual(unsigned(130));expect(f(event(formation),3n)).toEqual(unsigned(140));expect(f(event(recall),3n)).toEqual(unsigned(20));
 expect(f(event(formation),8n)).toEqual(list([f(event(evidence),1n)]));expect(f(event(recall),8n)).toEqual(list([f(event(evidence),1n)]));
 const select=traces(run,'event/assembled-body-selection').find(t=>key(f(t,6n))===key(text('assembled-character-memory/0.1-candidate')))!;expect(f(event(evidence),8n)).toEqual(list([f(event(select),1n)]));
 expect(reports(run,RECALL)[0]).toEqual([text(RECALL),signed(4),episode[0].value]);
 expect(items(f(recall,11n),'list')).toHaveLength(1);expect(items(f(formation,11n),'list')).toHaveLength(1);
 const read=rec(items(f(recall,11n),'list')[0],147n);expect(f(read,2n)).toEqual(statePathValue(episode[0].path));
 expect(a[5]).toEqual(signed(3));expect(id(a[1]).namespaceId).toBe(1125n);
}
describe('M5 selected evidence shares episodic state and settlement',()=>{
 it('retains the four-cell M3/M4 choice, appraisal, draws and later prediction/task semantics',async()=>{
  const old=await prepareCharacterModel(source(1,true,true,true)),model=await prepareCharacterModel(source());expect(characterModelIdentity(model)).not.toEqual(characterModelIdentity(old));
  for(const h of [0,1] as const)for(const b of [0,1] as const){const d=interactionData(h,b,7),a=await createCharacterRun(old,d),n=await createCharacterRun(model,d);await through(a,3n);await through(n,3n);
   expect(outputs(n.snapshot().outputs,409n)).toEqual(outputs(a.snapshot().outputs,409n));expect(reports(n,JOINT_APPRAISAL)).toEqual(reports(a,JOINT_APPRAISAL));expect(draws(n)).toEqual(draws(a));
   await finish(a);await finish(n);expect(predictions(n)).toEqual(predictions(a));expect(tasks(n)).toEqual(tasks(a));expect(draws(n)).toEqual(draws(a));joins(n);
  }console.info('M5 four-cell correspondence: exact choice/appraisal/draws through3; prediction means/support counts/task status through10');
 },240000);
 it('excluded, denied and unavailable observations form no episode or recall; selected safe evidence does',async()=>{
  for(const [capacity,p,a] of [[0,true,true],[1,false,true],[1,true,false]] as const){const run=await createCharacterRun(await prepareCharacterModel(source(capacity,p,a)),interactionData(0,0,7));await finish(run);expect(bodyEntries(run)).toHaveLength(0);expect(reports(run,RECALL)).toHaveLength(0);expect(traces(run,'event/assembled-memory-evidence')).toHaveLength(0);expect(entries(run).some(e=>e.path.rootStateTypeId===346n)).toBe(true);}
 },90000);
 it('repeat and restore with pending recall match every full boundary after formation',async()=>{
  const s=source(),m=await prepareCharacterModel(s),d=interactionData(0,0,7),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,3n);await through(b,3n);exact(a,b);expect(bodyEntries(a)).toHaveLength(1);expect(reports(a,RECALL)).toHaveLength(0);
  const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);
  for(let n=0;;n++){expect(n).toBeLessThan(32);const more=await a.settleNextInstant();for(const peer of [b,restored]){expect(await peer.settleNextInstant()).toBe(more);exact(a,peer);}if(!more)break;}joins(a);
  await expect(restoreCharacterRun(source(1,true,true,true),{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()})).rejects.toThrow('commitments differ');
 },180000);
 it('same permitted evidence hides exact body truth in memory and recall',async()=>{
  const m=await prepareCharacterModel(source()),a=await createCharacterRun(m,interactionData(0,0,7,10)),b=await createCharacterRun(m,interactionData(0,0,7,11));await finish(a);await finish(b);
  expect(bodyEntries(a)).toEqual(bodyEntries(b));expect(reports(a,RECALL)).toEqual(reports(b,RECALL));expect(a.snapshot().state).not.toEqual(b.snapshot().state);
  for(const run of [a,b])for(const t of outputs(run.snapshot().trace,160n).filter(t=>key(f(t,6n))===key(text('assembled-character-memory/0.1-candidate'))))for(const read of items(f(t,11n),'list'))expect(f(rec(f(rec(read,147n),2n),140n),1n)).toEqual(unsigned(346));
 },60000);
 it('recall remains past evidence when a later decision has no current sensing',async()=>{
  const d=interactionData(0,0,7);d.orderedInputs=enc(list(items(decode(d.orderedInputs),'list').filter(row=>key(items(row,'list')[0])!==key(signed(4))).map(row=>{const a=items(row,'list');return txt(id(a[2]).payload)==='event/deliberation-opportunity'?list([signed(4),...a.slice(1)]):row;})));
  const run=await createCharacterRun(await prepareCharacterModel(source()),d);await finish(run);expect(reports(run,RECALL)).toHaveLength(1);const joint=reports(run,JOINT_APPRAISAL)[0];expect(joint[2]).toEqual(list([]));expect(joint[3]).toEqual(list([]));for(const row of items(joint[4],'list'))expect(items(row,'list')[1]).toEqual(text('Unavailable'));
 },30000);
 it('commits simultaneous measurement/body formation together and rolls back a late stage failure',async()=>{
  const d=withoutChoice(interactionData(0,0)),rows=items(decode(d.orderedInputs),'list');d.orderedInputs=enc(list(rows.filter(row=>{const a=items(row,'list');return key(a[2])===key(BODY_SAMPLE)||key(a[0])===key(signed(4));}).map(row=>{const a=items(row,'list');return list([signed(3),...a.slice(1)]);})));const s=source(),run=await createCharacterRun(await prepareCharacterModel(s),d);await through(run,3n);
  expect(entries(run).filter(e=>e.path.rootStateTypeId===346n)).toHaveLength(2);expect(bodyEntries(run)).toHaveLength(1);expect(predictions(run)).toHaveLength(1);
  const trace=outputs(run.snapshot().trace,160n),ids=new Set(trace.map(t=>key(f(event(t),1n)))),phases=new Map(trace.map(t=>[key(f(event(t),1n)),uint(f(event(t),3n))]));expect([...phases.values()].filter(p=>p===140n).length).toBeGreaterThanOrEqual(3);
  const failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(ids.size-1))),d),before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow();expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(failed.diagnostic()).toBeDefined();
  console.info('M5 joint formation '+ids.size+' scheduled events; late failure cap '+(ids.size-1)+' rolls back full instant');
 },60000);
 it('rejects wrong owners/holders, forged episodes, authored memory events and version mismatches',async()=>{
  const s=source(),d=interactionData(0,0),model=await prepareCharacterModel(s),run=await createCharacterRun(model,d);await through(run,3n);const e=bodyEntries(run)[0],compiled=await compileCharacterModel(s),component=await compileCharacterState(compiled),initial=component.initialState(d.initialState),patch={operations:[{kind:'set' as const,path:e.path,expected:{presence:false as const},newValue:e.value}]};
  expect(()=>component.stateModel.applyPatch(initial,patch,bodyId(1025,'authority/belief-expectation'))).toThrow();
  const malformed=list(items(e.value,'list').map((v,i)=>i===5?signed(2):v));expect(()=>component.stateModel.applyPatch(initial,{operations:[{...patch.operations[0],newValue:malformed}]},EPISODIC_OWNER)).toThrow();
  const badPath={...e.path,selectors:[{kind:'mapKey' as const,key:list(items((e.path.selectors[0] as {kind:'mapKey';key:CanonicalValue}).key,'list').map((v,i)=>i===1?bodyId(1002,'foreign'):v))}]};expect(()=>component.stateModel.applyPatch(initial,{operations:[{...patch.operations[0],path:badPath}]},EPISODIC_OWNER)).toThrow();
  const forged=new AuthoritativeState([...initial.entries(),e]);await expect(createCharacterRun(model,{...d,initialState:enc(forged.canonicalValue())})).rejects.toThrow('initial learned');
  for(const [type,phase] of [[MEMORY_EVIDENCE,130],[MEMORY_FORMATION,140]] as const)await expect(createCharacterRun(model,{...d,orderedInputs:enc(list([list([signed(3),unsigned(phase),type,e.value,list([])])]))})).rejects.toThrow();
  await expect(prepareCharacterModel({...s,registrySchemaVersion:ATTENTION_REGISTRY})).rejects.toThrow('version bundle');
 },60000);
});
