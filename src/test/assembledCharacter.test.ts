import {describe,expect,it} from 'vitest';
import {
  prepareCharacterModel,characterModelIdentity,createCharacterRun,restoreCharacterRun,
} from '../assembled/m1Control';
import {
  prepareCognitiveModel,cognitiveModelIdentity,createCognitiveRun,restoreCognitiveRun,
} from '../campaign2/cognitiveFactory';
import {source,data,deadlineSource,equalCriteriaSource} from './fixtures/campaign2Cognitive';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {decodeCognitive} from '../campaign2/cognitiveCodecs';
import {dataItems} from '../campaign2/canonicalData';

type Run=Awaited<ReturnType<typeof createCharacterRun>>;
function sameRun(actual:Run,control:Run){
  expect(actual.runIdentity()).toEqual(control.runIdentity());
  expect(actual.snapshot()).toEqual(control.snapshot());
  expect(actual.save()).toEqual(control.save());
  expect(actual.diagnostic()).toEqual(control.diagnostic());
}

describe('single character entry: predeclared M1 comparison',()=>{
  it.each([
    ['baseline',source],['deadline overlap',deadlineSource],['equal criteria',equalCriteriaSource],
  ] as const)('%s: exact boundaries, repeat, restored continuation and terminal no-op',async(name,makeSource)=>{
    const controlModel=await prepareCognitiveModel(makeSource());
    const model=await prepareCharacterModel(makeSource());
    const repeatModel=await prepareCharacterModel(makeSource());
    const identity=cognitiveModelIdentity(controlModel);
    const control=await createCognitiveRun(controlModel,data());
    const candidate=await createCharacterRun(model,data());
    const repeat=await createCharacterRun(repeatModel,data());
    const others:Run[]=[candidate,repeat];
    let settled=0,restored=false;
    function compare(){
      expect(characterModelIdentity(model)).toEqual(identity);
      expect(characterModelIdentity(repeatModel)).toEqual(identity);
      for(const run of others)sameRun(run,control);
    }
    compare();
    for(;;){
      const before=control.save();
      const advanced=await control.settleNextInstant();
      for(const run of others)expect(await run.settleNextInstant()).toBe(advanced);
      compare();
      if(!advanced){
        expect(control.save()).toEqual(before);
        break;
      }
      settled++;
      expect(settled,'32-settle safety cap reached; comparison incomplete').toBeLessThan(32);
      if(settled===2){
        const original=data(),save=candidate.save();
        const input={initialState:original.initialState,orderedInputs:original.orderedInputs,save};
        others.push(await restoreCharacterRun(makeSource(),input));
        others.push(await restoreCognitiveRun(makeSource(),input));
        restored=true;
        compare();
      }
    }
    expect(restored).toBe(true);
    // Repeat the exhausted call to ensure terminal no-op is stable for every run.
    const terminal=control.save();
    for(const run of [control,...others]){
      expect(await run.settleNextInstant()).toBe(false);
      expect(run.save()).toEqual(terminal);
    }
    compare();
    console.info('M1 '+name+': '+settled+' settled instants; all byte comparisons and both restores passed');
  },120000);

  it('rejects extra executable input through the character entry',async()=>{
    const model=await prepareCharacterModel(source());
    await expect(createCharacterRun(model,{...data(),handler:()=>{}} as never)).rejects.toThrow('data-only');
  });

  it('rejects changed original inputs when restoring through the character entry',async()=>{
    const original=data();
    const run=await createCharacterRun(await prepareCharacterModel(source()),original);
    expect(await run.settleNextInstant()).toBe(true);
    expect(await run.settleNextInstant()).toBe(true);
    const changed=enc(list(dataItems(decodeCognitive(original.orderedInputs),'list').slice(1)));
    await expect(restoreCharacterRun(source(),{
      initialState:original.initialState,orderedInputs:changed,save:run.save(),
    })).rejects.toThrow('commitments differ');
  },30000);
});
