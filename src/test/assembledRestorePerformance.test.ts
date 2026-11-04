/** Cost-only restore regression. Historical algorithm: character.ts at f4069c29.
 * Original two-task Campaign2 source, successor admission, original seed/inputs.
 * No new psychology, hand-authored outputs, or reduced equality projection. */
import {beforeAll,it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun,type CharacterModelSource} from '../assembled/character';
import {restoreRunIdentity} from '../substrate/identity';
import {SaveContractError} from '../substrate/persistence';
import {canonicalEncode as enc,list,text} from '../substrate/canonicalEncoding';
import {decodeCognitive as decode} from '../assembled/codecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {successor,replace} from './fixtures/assembledCharacter';
import {data} from './fixtures/campaign2Cognitive';

type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const exact=(a:Uint8Array,b:Uint8Array)=>{expect(a.length).toBe(b.length);expect(a.every((v,i)=>v===b[i])).toBe(true);};
function same(a:Run,b:Run){const x=a.snapshot(),y=b.snapshot();expect(x.clock).toBe(y.clock);expect(x.status).toBe(y.status);for(const k of ['state','outputs','trace'] as const)exact(x[k],y[k]);exact(a.runIdentity(),b.runIdentity());exact(a.save(),b.save());expect(a.diagnostic()).toEqual(b.diagnostic());}
// Retained old restore algorithm, not another simulation implementation.
async function legacyRestore(source:CharacterModelSource,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 const model=await prepareCharacterModel(source),save=rec(decode(input.save),132n),identity=await restoreRunIdentity(f(save,3n)),seed=f(rec(identity.value,104n),4n);
 if(typeof seed==='boolean'||seed.kind!=='bytes')throw new SaveContractError('saved seed required');
 const run=await createCharacterRun(model,{initialState:input.initialState,orderedInputs:input.orderedInputs,runSeed:seed.value});
 if(key(decode(run.runIdentity()))!==key(identity.value))throw new SaveContractError('original S0/input/model commitments differ');
 const rows=items(f(save,11n),'list');for(const v of rows)rec(v,160n);
 let count=0;
 while(count<rows.length){if(!await run.settleNextInstant())throw new SaveContractError('prefix exhausted');count=items(decode(run.snapshot().trace),'list').length;if(count>rows.length)throw new SaveContractError('prefix crosses whole-instant boundary');}
 if(key(decode(run.save()))!==key(save))throw new SaveContractError('whole-save prefix equality failed');
 return run;
}
let source:CharacterModelSource,inputs:ReturnType<typeof data>,initial:Uint8Array,saved:Uint8Array;
beforeAll(async()=>{source=successor();inputs=data();const a=await createCharacterRun(await prepareCharacterModel(source),inputs);initial=a.save();expect(await a.settleNextInstant()).toBe(true);expect(await a.settleNextInstant()).toBe(true);saved=a.save();});
const payload=(save:Uint8Array)=>({initialState:inputs.initialState,orderedInputs:inputs.orderedInputs,save});
it('old and optimized restore agree from empty and learned checkpoints through the complete run',async()=>{
 for(const save of [initial,saved]){
  const old=await legacyRestore(source,payload(save)),current=await restoreCharacterRun(source,payload(save));same(old,current);let steps=0;
  for(;;){const next=await old.settleNextInstant();expect(await current.settleNextInstant()).toBe(next);same(old,current);if(!next)break;expect(++steps).toBeLessThan(32);}
  expect(await current.settleNextInstant()).toBe(false);same(old,current);
 }
},120000);
it('old and optimized restore reject incomplete instants and altered outputs',async()=>{
 const value=rec(decode(saved),132n),rows=items(f(value,11n),'list');expect(rows.length).toBeGreaterThan(1);
 const bad=[enc(replace(value,11n,list(rows.slice(0,-1)))),enc(replace(value,12n,list([...items(f(value,12n),'list'),text('forged output')]))),enc(replace(value,11n,list([])))];
 for(const save of bad)for(const restore of [legacyRestore,restoreCharacterRun])await expect(restore(source,payload(save))).rejects.toBeInstanceOf(SaveContractError);
},60000);
it('caller save and returned snapshot mutation cannot alter restored continuation',async()=>{
 const bytes=saved.slice(),pending=restoreCharacterRun(source,payload(bytes));bytes.fill(0);const a=await pending,b=await legacyRestore(source,payload(saved));
 const snapshot=a.snapshot();snapshot.state.fill(0);snapshot.outputs.fill(0);snapshot.trace.fill(0);same(a,b);expect(await a.settleNextInstant()).toBe(await b.settleNextInstant());same(a,b);
},60000);
