import {describe,it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun,characterModelIdentity} from '../assembled/character';
import {ATTENTION_RULES,ATTENTION_REGISTRY} from '../assembled/model';
import {BODY_SELECTION,BODY_SELECTION_REPORT} from '../assembled/body';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {canonicalEncode as enc,list,text,signed,unsigned,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {dataItems as items,dataField as f,dataRecord as rec,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {interactionSource,interactionData,outputs} from './fixtures/assembledInteraction';
import {workLimit} from './fixtures/assembledCharacter';

type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const source=(capacity=1,permitted=true,available=true)=>{const s=interactionSource(permitted,available);return {...s,rulesVersion:ATTENTION_RULES,registrySchemaVersion:ATTENTION_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(BODY_SELECTION_REPORT),unsigned(capacity)])]))};};
const textOf=(v:CanonicalValue):string=>{if(typeof v==='boolean')throw Error('text');if(v.kind==='typedIdentifier')return textOf(v.payload);if(v.kind==='text')return v.value;throw Error('text');};
const reports=(run:Run,label:string)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const audit=(run:Run)=>{const a=reports(run,BODY_SELECTION_REPORT);expect(a).toHaveLength(1);return a[0];};
const joint=(run:Run)=>{const a=reports(run,JOINT_APPRAISAL);expect(a).toHaveLength(1);return a[0];};
const draws=(run:Run)=>outputs(run.snapshot().trace,160n).flatMap(v=>items(f(v,14n),'list'));
const choice=(run:Run)=>{const resolution=rec(f(outputs(run.snapshot().outputs,409n)[0],4n),419n);expect(uint(f(resolution,1n))).toBe(3n);return textOf(f(rec(f(rec(f(resolution,2n),420n),1n),395n),2n));};
async function finish(run:Run){let n=0;while(await run.settleNextInstant())expect(++n).toBeLessThan(32);expect(run.snapshot().clock).toBe(10n);expect(run.diagnostic()).toBeUndefined();}
const exact=(a:Run,b:Run)=>{expect(b.runIdentity()).toEqual(a.runIdentity());expect(b.snapshot()).toEqual(a.snapshot());expect(b.save()).toEqual(a.save());expect(b.diagnostic()).toEqual(a.diagnostic());};
function noOperand(run:Run){const j=joint(run);expect(j[2]).toEqual(list([]));expect(j[3]).toEqual(list([]));for(const row of items(j[4],'list'))expect(items(row,'list')[1]).toEqual(text('Unavailable'));for(const raw of outputs(run.snapshot().outputs,403n))for(const signal of items(f(raw,3n),'set'))if(uint(f(rec(f(rec(signal,402n),1n),401n),3n))===2n)expect(f(rec(signal,402n),2n)).toEqual(rational(0,1));}
function causalJoin(run:Run){
 const trace=outputs(run.snapshot().trace,160n),select=trace.find(v=>textOf(f(v,7n))==='event/assembled-body-selection')!,app=trace.find(v=>textOf(f(v,7n))==='event/task-appraisal')!;
 expect(select).toBeDefined();expect(f(rec(f(select,4n),130n),3n)).toEqual(unsigned(20));
 expect(items(f(rec(f(app,4n),130n),8n),'list')).toContainEqual(f(rec(f(select,4n),130n),1n));
 expect(items(f(app,12n),'list')[3]).toEqual(list(audit(run)));expect(f(app,6n)).toEqual(text('assembled-character-attention/0.1-candidate'));
 expect(items(f(app,11n),'list')).toHaveLength(0);expect(items(f(select,11n),'list')).toHaveLength(0);
}

describe('M4 live body selection in the shared character',()=>{
 it('capacity1 preserves all four M3 cells at seed7, complete state/outputs/draws and actual choice change',async()=>{
  const prior=await prepareCharacterModel(interactionSource()),model=await prepareCharacterModel(source());expect(characterModelIdentity(model)).not.toEqual(characterModelIdentity(prior));const choices:string[][]=[[],[]];
  for(const h of [0,1] as const)for(const b of [0,1] as const){const d=interactionData(h,b,7),a=await createCharacterRun(prior,d),n=await createCharacterRun(model,d);await finish(a);await finish(n);
   expect(n.snapshot().state).toEqual(a.snapshot().state);const filtered=items(decode(n.snapshot().outputs),'list').filter(v=>!(typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(BODY_SELECTION_REPORT))));expect(enc(list(filtered))).toEqual(a.snapshot().outputs);expect(draws(n)).toEqual(draws(a));
   expect(audit(n)[4]).toEqual(text('Selected'));expect(joint(n)[2]).toEqual(outputs(n.snapshot().outputs,461n)[0]);causalJoin(n);choices[h][b]=choice(n);
  }
  expect(choices[0]).toEqual(['definition/protocol-contact-two','definition/protocol-contact-one']);console.info('M4 selected four-cell correspondence PASS: '+JSON.stringify(choices));
 },240000);
 it('capacity0 excludes an actual permitted sample without inventing zero or allowing a body reason',async()=>{
  const run=await createCharacterRun(await prepareCharacterModel(source(0)),interactionData(0,0,7));await finish(run);
  expect(outputs(run.snapshot().outputs,461n)).toHaveLength(1);expect(outputs(run.snapshot().outputs,227n).length).toBeGreaterThan(0);expect(audit(run)[4]).toEqual(text('Capacity'));noOperand(run);causalJoin(run);expect(outputs(run.snapshot().outputs,425n)).toHaveLength(0);
 },30000);
 it('unavailable and denied differ from selected zero pressure and zero task exposure',async()=>{
  for(const [p,a] of [[false,true],[true,false]]){const run=await createCharacterRun(await prepareCharacterModel(source(1,p,a)),interactionData(0,1));await finish(run);expect(outputs(run.snapshot().outputs,463n)).toHaveLength(1);expect(audit(run)[4]).toEqual(text('Unavailable'));noOperand(run);causalJoin(run);}
  const run=await createCharacterRun(await prepareCharacterModel(source()),interactionData(1,1));await finish(run);expect(audit(run)[4]).toEqual(text('Selected'));const rows=items(joint(run)[4],'list').map(v=>items(v,'list'));expect(rows.every(row=>key(row[2])===key(rational(0,1)))).toBe(true);expect(rows[1][4]).toEqual(rational(0,1));expect(rows[1]).toHaveLength(5);
 },90000);
 it('repeat and post-learning restore match every boundary for both capacities; capacity changes cannot restore',async()=>{
  for(const capacity of [0,1]){const s=source(capacity),d=interactionData(0,0,7),model=await prepareCharacterModel(s),a=await createCharacterRun(model,d),b=await createCharacterRun(model,d);await a.settleNextInstant();await b.settleNextInstant();expect(a.snapshot().clock).toBe(1n);exact(a,b);
   await expect(restoreCharacterRun(source(1-capacity),{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()})).rejects.toThrow('commitments differ');
   const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);let n=0;for(;;){const more=await a.settleNextInstant();for(const peer of [b,restored]){expect(await peer.settleNextInstant()).toBe(more);exact(a,peer);}if(!more)break;expect(++n).toBeLessThan(32);}expect(a.snapshot().clock).toBe(10n);
  }
 },240000);
 it('hidden truth with equal body evidence cannot change cognition or draws at either capacity',async()=>{
  for(const capacity of [0,1]){const model=await prepareCharacterModel(source(capacity)),a=await createCharacterRun(model,interactionData(0,0,7,10)),b=await createCharacterRun(model,interactionData(0,0,7,11));await finish(a);await finish(b);expect(a.snapshot().state).not.toEqual(b.snapshot().state);
   const cognitive=(run:Run)=>enc(list(items(decode(run.snapshot().outputs),'list').filter(v=>!(typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===479n))));expect(cognitive(a)).toEqual(cognitive(b));expect(draws(a)).toEqual(draws(b));
  }
 },90000);
 it('no sensing and a later choice cannot reuse an earlier selected body sample',async()=>{
  for(const stale of [false,true]){const d=interactionData(0,0,7);d.orderedInputs=enc(list(items(decode(d.orderedInputs),'list').filter(row=>{const a=items(row,'list');return stale?key(a[0])!==key(signed(4)):textOf(a[2])!=='event/assembled-body-sample';}).map(row=>{const a=items(row,'list');return stale&&textOf(a[2])==='event/deliberation-opportunity'?list([signed(4),...a.slice(1)]):row;})));
   const run=await createCharacterRun(await prepareCharacterModel(source()),d);await finish(run);noOperand(run);expect(reports(run,BODY_SELECTION_REPORT)).toHaveLength(stale?1:0);const app=outputs(run.snapshot().trace,160n).find(t=>textOf(f(t,7n))==='event/task-appraisal')!;expect(items(f(app,12n),'list')[3]).toEqual(list([]));
  }
 },90000);
 it('rejects malformed capacities/version/source and rolls back selection before a failed consumer',async()=>{
  const s=source();await expect(prepareCharacterModel(source(2))).rejects.toThrow('capacity');const slots=items(decode(s.registry),'list');await expect(prepareCharacterModel({...s,registry:enc(list(slots.slice(0,7)))})).rejects.toThrow('slot count');await expect(prepareCharacterModel({...s,registrySchemaVersion:interactionSource().registrySchemaVersion})).rejects.toThrow('version bundle');
  const model=await prepareCharacterModel(s),d=interactionData(0,0),rows=items(decode(d.orderedInputs),'list');
  await expect(createCharacterRun(model,{...d,orderedInputs:enc(list([list([signed(3),unsigned(20),BODY_SELECTION,list([]),list([])])]))})).rejects.toThrow();
  await expect(createCharacterRun(model,{...d,orderedInputs:enc(list(rows.map(row=>{const a=items(row,'list');return textOf(a[2])==='event/assembled-body-sample'?list([a[0],unsigned(20),...a.slice(2)]):row;})))})).rejects.toThrow('phase');
  const only3=enc(list(rows.filter(row=>key(items(row,'list')[0])===key(signed(3))))),run=await createCharacterRun(await prepareCharacterModel(workLimit(s,6n)),{...d,orderedInputs:only3}),before=run.snapshot();
  await expect(run.settleNextInstant()).rejects.toThrow();expect({...run.snapshot(),status:before.status}).toEqual(before);expect(run.diagnostic()).toBeDefined();
 },30000);
});
