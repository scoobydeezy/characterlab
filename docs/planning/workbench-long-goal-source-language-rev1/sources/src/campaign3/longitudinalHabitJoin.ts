/** longitudinal-habit-join/0.1-candidate; unchanged native source plus component-owned habit/memory. */
import {canonicalEncode as enc,text} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {OBSERVER,longitudinalRecipe,compileLongitudinalModel} from './longitudinalModel';
import {decodeLongitudinal as decode} from './longitudinalCodecs';
import {prepareLongitudinalModel,createLongitudinalRun,restoreLongitudinalRun} from './longitudinalFactory';
import {originalInputs} from './longitudinalGoal';
import {createHabitReceiver,habitTimes,type HabitProfile} from './longitudinalHabit';
export const JOIN_VERSION='longitudinal-habit-join/0.1-candidate';
/** Unchanged native biography source plus transactionally joined receiving owners. */
export async function createLongitudinalHabitRun(input:HabitProfile){
 const receiver=createHabitReceiver(input),profile=receiver.snapshot().profile,source=longitudinalRecipe(),model=await compileLongitudinalModel(source),initialState=enc(model.initial.canonicalValue()),orderedInputs=originalInputs(),runSeed=new Uint8Array(32).fill(profile.seed);
 let native=await createLongitudinalRun(await prepareLongitudinalModel(source),{initialState,orderedInputs,runSeed});
 let busy=false;
 const read=()=>{if(busy)throw Error('LH_JOIN_BUSY');};
 const snapshot=()=>{read();return receiver.snapshot();};
 const nativeSave=()=>{read();return native.save();};
 const save=()=>{read();return enc(text(JSON.stringify({version:JOIN_VERSION,receiver:key(decode(receiver.save())),native:key(decode(native.save()))})));};
 const recallPractice=()=>{read();return receiver.recallPractice();};
 const sourceView=()=>{read();return native.observerView(enc(OBSERVER));};
 return Object.freeze({snapshot,nativeSave,save,sourceView,recallPractice,
  async step(fault?:'after-source'|'after-choice'|'before-commit'){
   if(busy)throw Error('LH_JOIN_CONCURRENT');if(receiver.snapshot().prefix===habitTimes.length)return false;
   const before=native.save();busy=true;
   try{
    if(!await native.settleNextInstant())throw Error('LH_SOURCE_ENDED');
    if(fault==='after-source')throw Error('LH_INJECTED');
    if(native.snapshot().clock!==BigInt(habitTimes[receiver.snapshot().prefix]))throw Error('LH_SOURCE_TIME');
    const view=rec(decode(native.observerView(enc(OBSERVER))),881n);
    await receiver.step(readQ(f(view,2n)),fault);return true;
   }catch(error){native=await restoreLongitudinalRun(source,{initialState,orderedInputs,save:before});throw error;}finally{busy=false;}
  }
 });
}
export async function restoreLongitudinalHabitRun(profile:HabitProfile,prefix:number,saved:Uint8Array){
 if(!Number.isInteger(prefix)||prefix<0||prefix>habitTimes.length||!(saved instanceof Uint8Array))throw Error('LH_RESTORE');
 const copy=saved.slice(),run=await createLongitudinalHabitRun(profile);for(let i=0;i<prefix;i++)await run.step();
 const actual=run.save();if(actual.length!==copy.length||actual.some((v,i)=>v!==copy[i]))throw Error('LH_SAVE_MISMATCH');return run;
}
