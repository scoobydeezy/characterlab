import {canonicalEncode as enc,list,set,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec} from '../campaign2/canonicalData';
import {goalStrategyRecord as r} from '../campaign3/goalStrategyCodecs';
export const initialState=enc(set([])),seed=new Uint8Array(32).fill(7);
export const display=(receipt:number,route:number,available:boolean,issuedAt=1,until=8,visible=true)=>r(991,[u(receipt),u(route),available,signed(issuedAt),signed(until),visible]);
export function original(at:number,changes:Partial<{adopt:boolean;displays:CanonicalValue[];openA:boolean;openB:boolean;blocked:boolean;competent:boolean;external:boolean;executionVisible:boolean;criterion:number}>={}) {
  const x={adopt:at===1,displays:[] as CanonicalValue[],openA:true,openB:true,blocked:true,competent:true,external:false,executionVisible:true,criterion:0,...changes};
  return r(992,[signed(at),x.adopt,list(x.displays),x.openA,x.openB,x.blocked,x.competent,x.external,x.executionVisible,u(x.criterion)]);
}
export const ordered=(values:readonly CanonicalValue[])=>enc(list(values));
export const records=(values:readonly CanonicalValue[],type:bigint)=>values.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
export function cases() {
  const a=display(1,1,true),b=display(2,2,true);
  return {
    main:[original(1,{displays:[a,b]}),original(2),original(3,{openA:false,displays:[display(3,1,false,3)]}),original(4,{openA:false,displays:[display(4,2,false,4)]}),original(5,{openA:false,displays:[display(5,2,true,5)]}),original(6,{openA:false,blocked:false,criterion:1}),original(7,{openA:false})],
    retained:[original(1,{displays:[a,b]}),original(2),original(3)],
    hiddenCause:[original(1,{displays:[a,b],blocked:false,competent:false}),original(2,{blocked:false,competent:false}),original(3,{blocked:false,competent:false})],
    noOutcome:[original(1,{displays:[a],executionVisible:false}),original(2,{executionVisible:false}),original(3,{executionVisible:false})],
    hiddenSuccess:[original(1,{displays:[a],blocked:false,executionVisible:false}),original(2,{blocked:false,executionVisible:false}),original(3,{blocked:false,executionVisible:false})],
    fulfilled:[original(1,{displays:[a]}),original(2,{blocked:false,criterion:1}),original(3)],
    external:[original(1),original(2,{external:true,criterion:1}),original(3)],
    hiddenExternal:[original(1),original(2,{external:true}),original(3)],
    absentExternal:[original(1),original(2),original(3)],
    falseCriterion:[original(1),original(2,{criterion:2}),original(3)],
    expiry:[original(1,{displays:[a]}),original(2,{displays:[display(3,1,false,2,2)]}),original(3)],
    denied:[original(1,{displays:[display(1,1,true,1,8,false)]}),original(2),original(3,{displays:[display(2,2,true,3)]}),original(4)],
    noDisplay:[original(1),original(2),original(3,{displays:[display(2,2,true,3)]}),original(4)],
    duplicate:[original(1,{displays:[a]}),original(2,{displays:[a]}),original(3)],
    adoptionCriterion:[original(1,{external:true,criterion:1}),original(2),original(3)],
    noAdoption:[original(1,{adopt:false,displays:[a,b]}),original(2),original(3)],
  };
}
