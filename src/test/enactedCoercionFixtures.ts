import type {Frame} from '../campaign3/enactedCoercion';
export function coercionCases():Record<string,Frame[]>{
 const main:Frame[]=Array.from({length:4},(_,i)=>({at:i+1,demander:0,demand:true,penalty:1000,power:true,access:true,display:null,permitted:true}));
 const variant=(patch:Partial<Frame>,from=0)=>main.map((x,i)=>({...x,...(i>=from?patch:{})}));
 return {main,noPenalty:variant({penalty:0}),instruction:variant({penalty:250}),withheld:variant({access:false}),falseZero:variant({display:0}),hiddenPower:variant({power:false,display:1000}),explicitHigh:variant({display:1000}),failedLater:variant({permitted:false},1),otherDemander:variant({demander:1},1),noDemand:variant({demand:false}),correction:main.map((x,i)=>({...x,display:i===0?1000:0})),withheldLater:variant({access:false},1)};
}
