import {describe,it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {prepareReceivingModel,createReceivingRun,restoreReceivingRun} from '../campaign3/receivingFactory';
import {prepareEmbodiedModel} from '../campaign3/embodiedFactory';
import {decodeReceiving as decode,receivingRecord as r} from '../campaign3/receivingCodecs';
import {decodeCognitive} from '../campaign2/cognitiveCodecs';
import {AuthoritativeState} from '../substrate/state';
import {set,rational,signed} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {receivingSource,receivingVariant,receivingOriginals,initialReceiving,id} from './receivingFixtures';
const data=()=>({initialState:enc(initialReceiving().canonicalValue()),orderedInputs:enc(receivingOriginals()),runSeed:new Uint8Array(32)});
describe('receiving public factory and complete-prefix persistence',()=>{
 it('public S0 excludes missing response context, undeclared instruction and fractional initial reserve',async()=>{
  const model=await prepareReceivingModel(receivingSource),entries=initialReceiving().entries(),bad=[entries.filter(e=>e.path.rootStateTypeId!==487n),entries.map(e=>e.path.rootStateTypeId===487n?{...e,value:r(486,[set([id(1027,'component/coverage-2')])])}:e),entries.map(e=>e.path.rootStateTypeId===455n?{...e,value:r(454,[rational(81,2),signed(0)])}:e)];
  for(const rows of bad)await expect(createReceivingRun(model,{...data(),initialState:enc(new AuthoritativeState(rows).canonicalValue())})).rejects.toThrow();
  expect(()=>decodeCognitive(enc(r(486,[set([])])))).toThrow();
 });
 it('admits the exact13 frozen commitments and rejects unknown model bytes',async()=>{
  for(const name of ['baseline','slower','coarser','denied','unavailable','task-base-off','task-plan-off','execution-blocked','quiet','auto','weak-task','work25','no-coverage-control'])await expect(prepareReceivingModel(receivingVariant(name))).resolves.toBeDefined();
  await expect(prepareReceivingModel({...receivingSource,parameters:enc(list([]))})).rejects.toThrow();await expect(prepareEmbodiedModel(receivingSource)).rejects.toThrow();
 });
 it('rejects non-data inputs before invoking a getter and rejects forged model handles',async()=>{
  const model=await prepareReceivingModel(receivingSource),input=data();let called=false;
  await expect(createReceivingRun(model,{...input,get orderedInputs(){called=true;return input.orderedInputs;}})).rejects.toThrow(/data-only/);expect(called).toBe(false);
  await expect(createReceivingRun({} as never,input)).rejects.toThrow(/prepared/);
 });
 it('replays every complete prefix including RNG-ledger bytes and continues identically',async()=>{
  const input=data(),model=await prepareReceivingModel(receivingSource),original=await createReceivingRun(model,input),prefixes=[original.save()];while(await original.settleNextInstant())prefixes.push(original.save());expect(prefixes).toHaveLength(3);
  for(const save of prefixes){const restored=await restoreReceivingRun(receivingSource,{initialState:input.initialState,orderedInputs:input.orderedInputs,save});expect(restored.save()).toEqual(save);while(await restored.settleNextInstant()){}expect(restored.snapshot()).toEqual(original.snapshot());expect(restored.save()).toEqual(original.save());}
 },15000);
 it('rejects altered adoption, original pair or RNG ledger on restore',async()=>{
  const input=data(),model=await prepareReceivingModel(receivingSource),run=await createReceivingRun(model,input);await run.settleNextInstant();const save=run.save(),v=rec(decode(save),132n);
  const changed=record(v.schema,new Map([...v.fields].map(([n,x])=>[n,n===10n?list([]):x])));
  for(const trial of [{initialState:enc(initialReceiving(['b']).canonicalValue()),orderedInputs:input.orderedInputs,save},{initialState:input.initialState,orderedInputs:enc(receivingOriginals(46)),save},{initialState:input.initialState,orderedInputs:input.orderedInputs,save:enc(changed)}])await expect(restoreReceivingRun(receivingSource,trial)).rejects.toThrow();
 },15000);
});
