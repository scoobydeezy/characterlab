import {describe,it,expect} from 'vitest';
import {prepareCharacterModel,characterModelIdentity,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {prepareCognitiveModel,cognitiveModelIdentity,createCognitiveRun} from '../campaign2/cognitiveFactory';
import {source,data,deadlineSource,equalCriteriaSource,walk,id} from './fixtures/campaign2Cognitive';
import {successor,nonPreset,changeDefinition,workLimit,duplicateRegistry,overlapAuthority,replace} from './fixtures/assembledCharacter';
import {canonicalEncode as enc,list,record,rational,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {decodeCognitive as decode} from '../campaign2/cognitiveCodecs';
import {dataRecord as rec,dataItems as items,dataField as f,dataKey as key} from '../campaign2/canonicalData';

type Run=Awaited<ReturnType<typeof createCharacterRun>>;
function exact(a:Run,b:Run){expect(a.runIdentity()).toEqual(b.runIdentity());expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());expect(a.diagnostic()).toEqual(b.diagnostic());}
function traceProjection(run:Run,model:Uint8Array,controlModel:Uint8Array,controlRun:Uint8Array){
 return enc(list(items(decode(run.snapshot().trace),'list').map(v=>{
  const row=rec(v,160n);expect(enc(f(row,2n))).toEqual(model);expect(enc(f(row,3n))).toEqual(run.runIdentity());
  return replace(replace(row,2n,decode(controlModel)),3n,decode(controlRun));
 })));
}
describe('M2a invariant admission and one continuing successor',()=>{
 it.each([['baseline',source],['deadline overlap',deadlineSource],['equal criteria',equalCriteriaSource]] as const)('%s preserves every semantic boundary and addressed draw',async(name,make)=>{
  const cm=await prepareCognitiveModel(make()),am=await prepareCharacterModel(successor(make()));
  const ci=cognitiveModelIdentity(cm),ai=characterModelIdentity(am);expect(ai).not.toEqual(ci);
  const c=await createCognitiveRun(cm,data()),a=await createCharacterRun(am,data());let steps=0,draws=0;
  function compare(){const cs=c.snapshot(),as=a.snapshot();expect({...as,trace:undefined}).toEqual({...cs,trace:undefined});expect(a.diagnostic()).toEqual(c.diagnostic());expect(traceProjection(a,ai,ci,c.runIdentity())).toEqual(cs.trace);}
  compare();for(;;){const advance=await c.settleNextInstant();expect(await a.settleNextInstant()).toBe(advance);compare();if(!advance)break;expect(++steps).toBeLessThan(32);}
  for(const v of items(decode(a.snapshot().trace),'list'))draws+=items(f(rec(v,160n),14n),'list').length;
  if(name==='baseline')expect(draws).toBeGreaterThan(0);console.info('M2a control '+name+': '+steps+' instants, '+draws+' exact coupled draws');
 },180000);
 it('non-preset prepares, learns, decides, repeats and restores the whole run',async()=>{
  const s=nonPreset();await expect(prepareCognitiveModel({...s,rulesVersion:source().rulesVersion,registrySchemaVersion:source().registrySchemaVersion})).rejects.toThrow('outside the frozen cohort');
  const model=await prepareCharacterModel(s),a=await createCharacterRun(model,data()),b=await createCharacterRun(await prepareCharacterModel(nonPreset()),data());
  const peers=[b];let steps=0;exact(a,b);
  for(;;){const advance=await a.settleNextInstant();for(const p of peers){expect(await p.settleNextInstant()).toBe(advance);exact(a,p);}if(!advance)break;expect(++steps).toBeLessThan(32);
   if(steps===2){const d=data(),restored=await restoreCharacterRun(nonPreset(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);peers.push(restored);}
  }
  expect(peers).toHaveLength(2);expect(steps).toBe(8);expect(a.snapshot().clock).toBe(17n);
  const outputs=items(decode(a.snapshot().outputs),'list').map(v=>rec(v,(v as Extract<CanonicalValue,{kind:'record'}>).schema.typeId).schema.typeId);expect(outputs).toContain(409n);expect(outputs).toContain(342n);
  let learned=false;walk(decode(a.snapshot().state),v=>{if(typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===361n)learned=true;return v;});expect(learned).toBe(true);
  const terminal=a.save();for(const p of [a,...peers]){expect(await p.settleNextInstant()).toBe(false);expect(p.save()).toEqual(terminal);}
  console.info('M2a non-preset: '+steps+' instants; learned prediction, decision, repeat and restore exact');
 },240000);
 it.each([
  ['minimum',()=>changeDefinition(successor(),'definition/task-a',3n,rational(-1,3)),/task minimum/],
  ['reversed interval',()=>changeDefinition(changeDefinition(successor(),'definition/task-a',3n,rational(9,1)),'definition/task-a',4n,rational(1,1)),/minimum exceeds/],
  ['window',()=>changeDefinition(successor(),'definition/task-a',6n,signed(0)),/task window/],
  ['gain',()=>changeDefinition(successor(),'definition/task-concern',1n,rational(6,5)),/concern gain/],
  ['pressure',()=>changeDefinition(successor(),'definition/task-motive',1n,rational(0,1)),/motive pressure/],
  ['capacity',()=>changeDefinition(successor(),'definition/task-workspace',2n,unsigned(4)),/workspace capacity/],
  ['work limit',()=>workLimit(successor(),0n),/work limit/],
  ['reference',()=>changeDefinition(successor(),'definition/task-instruction-one',1n,id(1027,'definition/task-concern')),/391/],
  ['duplicate registry',()=>duplicateRegistry(successor()),/duplicate registry/],
  ['overlapping authority',()=>overlapAuthority(successor()),/overlap/i],
  ['undeclared topology',()=>changeDefinition(successor(),'definition/task-workspace',3n,false),/undeclared topology/],
 ] as const)('rejects %s before publishing a model',async(_name,make,error)=>{await expect(prepareCharacterModel(make())).rejects.toThrow(error);});
 it('rejects unsupported versions/schema and executable or mutable source substitution',async()=>{
  await expect(prepareCharacterModel({...successor(),registrySchemaVersion:'unknown'})).rejects.toThrow('version bundle');
  const s=successor(),slots=items(decode(s.registry),'list');await expect(prepareCharacterModel({...s,registry:enc(list([record({typeId:999999n,schemaVersion:1n,name:'Unsupported',fields:[]},new Map()),...slots.slice(1)]))})).rejects.toThrow();
  let calls=0;const getter=successor();Object.defineProperty(getter,'registry',{get(){calls++;return s.registry;}});await expect(prepareCharacterModel(getter)).rejects.toThrow('accessor forbidden');expect(calls).toBe(0);
  const mutable=successor(),pending=prepareCharacterModel(mutable);mutable.registry.fill(0);mutable.parameters.fill(0);mutable.content.fill(0);expect(characterModelIdentity(await pending)).toEqual(characterModelIdentity(await prepareCharacterModel(successor())));
 });
 it('rejects invented learned S0 and foreign observer evidence, and rolls back a tiny work budget',async()=>{
  const m=await prepareCharacterModel(successor()),d=data(),run=await createCharacterRun(m,d);expect(await run.settleNextInstant()).toBe(true);
  await expect(createCharacterRun(m,{...d,initialState:run.snapshot().state})).rejects.toThrow('initial learned');
  const changed=enc(walk(decode(d.orderedInputs),v=>key(v)===key(id(1000,'observer/bridge-subject'))?id(1000,'observer/foreign'):v));const foreign=await createCharacterRun(m,{...d,orderedInputs:changed});expect(await foreign.settleNextInstant()).toBe(true);
  await expect(foreign.settleNextInstant()).rejects.toThrow();expect(foreign.snapshot().clock).toBe(1n);
  const small=await createCharacterRun(await prepareCharacterModel(workLimit(successor(),1n)),data()),before=small.snapshot();await expect(small.settleNextInstant()).rejects.toThrow();expect({...small.snapshot(),status:before.status}).toEqual(before);expect(small.diagnostic()).toBeDefined();
 },30000);
 it('binds restore to its model, inputs and every saved byte',async()=>{
  const s=successor(),d=data(),a=await createCharacterRun(await prepareCharacterModel(s),d);expect(await a.settleNextInstant()).toBe(true);const save=a.save();
  await expect(restoreCharacterRun(nonPreset(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save})).rejects.toThrow('commitments differ');
  const changed=enc(list(items(decode(d.orderedInputs),'list').slice(1)));await expect(restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:changed,save})).rejects.toThrow('commitments differ');
  // Change the canonical saved clock, leaving the original trace/prefix intact.
  const corrupted=enc(replace(rec(decode(save),132n),4n,signed(99)));await expect(restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:corrupted})).rejects.toThrow();
 },30000);
});
