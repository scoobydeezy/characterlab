import type {Frame} from '../campaign3/temporalGoalConflict';
export const make=(change:(at:number)=>Partial<Frame>=()=>({})):Frame[]=>Array.from({length:8},(_,i)=>{const at=i+1;return {at,visible:true,adoptShort:at===1,adoptLong:at===1,availableShort:true,availableLong:true,accessShort:true,accessLong:true,strengthShort:4,strengthLong:4,forecast:at===1?2:0,cancelShort:false,cancelLong:false,actualShort:true,actualLong:true,receipt:true,report:0,privateBit:false,...change(at)};});
export function temporalCases(){return {
 main:make(),shortWeak:make(()=>({strengthShort:1})),longWeak:make(()=>({strengthLong:1})),noShort:make(()=>({adoptShort:false})),noLong:make(()=>({adoptLong:false})),
 cancelShort:make(at=>({availableShort:at!==1,availableLong:at!==1,cancelShort:at===2})),cancelLong:make(at=>({availableShort:at!==1,availableLong:at!==1,cancelLong:at===2})),
 shortUnavailable:make(()=>({availableShort:false})),longUnavailable:make(()=>({availableLong:false})),shortInaccessible:make(()=>({accessShort:false})),longInaccessible:make(()=>({accessLong:false})),
 missingReceipt:make(()=>({receipt:false})),hiddenBlocked:make(()=>({receipt:false,actualShort:false,actualLong:false,privateBit:true})),
 falseReceipt:make(()=>({report:1,actualShort:false,actualLong:false})),trueReceipt:make(()=>({report:1})),
 forecastCorrection:make(at=>({receipt:false,forecast:at===1?2:at===2?1:0})),unknownFuture:make(()=>({forecast:0})),unavailableFuture:make(at=>({forecast:at===1?1:0})),
 blockedLong:make(()=>({actualLong:false})),deniedAdoption:make(at=>({visible:at!==1})),hiddenAdoption:make(at=>({visible:at!==1,adoptShort:false,adoptLong:false,privateBit:true})),expiredShort:make(at=>({accessShort:at>=5})),
 };}
