import {it,expect} from 'vitest';
import {canonicalEncode as enc} from '../substrate/canonicalEncoding';
import {dataKey as key} from '../campaign2/canonicalData';
import {compileBetrayalModel,compileBetrayalInputs,betrayalRecipe,eventId,path} from '../campaign3/betrayalModel';
import {createBetrayalRuntime} from '../campaign3/betrayalRuntime';
import {cases,ordered,initialState,seed} from './betrayalFixtures';

// The primary fault matrix runs during an explanation update. This supplement
// exercises actual history writes when the previously promised outcome arrives.
for(const stage of ['history-a','history-b','commit'])it(`restores acquired promises after a real outcome write at ${stage}`,async()=>{
 const model=await compileBetrayalModel(betrayalRecipe());
 const input=await compileBetrayalInputs(model,initialState,ordered(cases().main),seed);
 const control=createBetrayalRuntime(model,input),faulted=createBetrayalRuntime(model,input);
 await control.settle();await faulted.settle();
 const before=faulted.snapshot();await control.settle();
 for(const i of [0,1])expect(key(control.snapshot().state.read(path(i,0)).value!)).not.toEqual(key(before.state.read(path(i,0)).value!));
 let reached=false;
 await expect(faulted.settleForConformance({onBoundary(boundary,event){
  if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('outcome history fault');}
 }})).rejects.toThrow('outcome history fault');
 expect(reached).toBe(true);const after=faulted.snapshot();
 expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));
 for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);
 expect(()=>faulted.save()).toThrow();
});
