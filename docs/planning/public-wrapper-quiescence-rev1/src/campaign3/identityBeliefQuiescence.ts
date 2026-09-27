/** Whole-wrapper quiescence, including the native RNG ledger commit. */
import {SchedulerContractError,type ConformanceInstrumentation} from '../substrate/scheduler';
interface NativeRun<T> {settle():Promise<T>;settleForConformance(i:ConformanceInstrumentation):Promise<T>;snapshot():unknown;save():Uint8Array;diagnostic():unknown;}
export function guardIdentityBeliefSettlement<T,R extends NativeRun<T>>(runtime:R):R{
 let active=false;
 const quiescent=()=>{if(active)throw new SchedulerContractError('RUN_NOT_ACTIVE','identity-belief wrapper is not quiescent');};
 async function settle(instrumentation?:ConformanceInstrumentation){quiescent();active=true;try{return await (instrumentation?runtime.settleForConformance(instrumentation):runtime.settle());}finally{active=false;}}
 return {...runtime,settle:()=>settle(),settleForConformance:(i:ConformanceInstrumentation)=>settle(i),snapshot:()=>{quiescent();return runtime.snapshot();},save:()=>{quiescent();return runtime.save();}} as R;
}
