import {list,text,signed,unsigned,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {INTERFERENCE_RULES,INTERFERENCE_REGISTRY} from '../../assembled/model';
import {INTERFERENCE,INTERFERENCE_QUERY,INTERFERENCE_SOURCE,INTERFERENCE_CONTEXT} from '../../assembled/interferenceExpectation';
import {source as oldSource,data as oldData,task,decode,items,key,enc} from './assembledCausalAttribution';
export const source=()=>({...oldSource(),rulesVersion:INTERFERENCE_RULES,registrySchemaVersion:INTERFERENCE_REGISTRY});
export type Options={positive?:boolean;goal?:0|1;denied?:boolean;changed?:boolean;missing?:boolean;difficulty?:CanonicalValue;duplicate?:boolean;current?:boolean;route?:0|1|null};
export function data(o:Options={}){
 const d=oldData({missing:o.missing,difficulty:o.difficulty}),t=task(),rows=[...items(decode(d.orderedInputs),'list')];
 for(const at of [3,5,7])rows.push(list([signed(at),unsigned(30),INTERFERENCE_CONTEXT,list([text(INTERFERENCE_QUERY),t,o.route===null?list([]):unsigned(o.route??0),unsigned(o.goal??1)]),list([])]));
 for(const [i,at]of [4,o.current?7:6].entries())rows.push(list([signed(at),unsigned(10),INTERFERENCE_SOURCE,list([text(INTERFERENCE),t,unsigned(o.duplicate?3:i?5:3),unsigned(o.duplicate?1:i+1),!o.denied,i?!!o.positive:!o.changed]),list([])]));
 return {...d,orderedInputs:enc(list(rows))};
}
export {task,decode,items,key,enc};
