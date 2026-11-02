import {list,text,signed,unsigned,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {PERFORMANCE_SETTING} from '../../assembled/performance';
import {INTERFERENCE_RULES,INTERFERENCE_REGISTRY} from '../../assembled/model';
import {INTERFERENCE,INTERFERENCE_QUERY,INTERFERENCE_SOURCE,INTERFERENCE_CONTEXT} from '../../assembled/interferenceExpectation';
import {source as oldSource,data as oldData,task,decode,items,key,enc} from './assembledCausalAttribution';
export const source=()=>({...oldSource(),rulesVersion:INTERFERENCE_RULES,registrySchemaVersion:INTERFERENCE_REGISTRY});
export type Options={originalFailure?:boolean;positive?:boolean;goal?:0|1;denied?:boolean;changed?:boolean;missing?:boolean;difficulty?:CanonicalValue;duplicate?:boolean;current?:boolean;route?:0|1|null};
export function data(o:Options={}){
 const d=oldData({missing:o.missing,difficulty:o.difficulty}),t=task(),rows=items(decode(d.orderedInputs),'list').map(v=>{
  const a=[...items(v,'list')];
  if(!o.originalFailure&&key(a[0])===key(signed(3))&&key(a[2])===key(PERFORMANCE_SETTING)){
   const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=items(v,'list');return key(x[0])===key(t)?list([x[0],x[1],unsigned(2)]):v;}))]);
  }
  return list(a);
 });
 for(const at of [3,5,7])rows.push(list([signed(at),unsigned(30),INTERFERENCE_CONTEXT,list([text(INTERFERENCE_QUERY),t,o.route===null?list([]):unsigned(o.route??0),unsigned(o.goal??1)]),list([])]));
 for(const [i,at]of [4,o.current?7:6].entries())rows.push(list([signed(at),unsigned(10),INTERFERENCE_SOURCE,list([text(INTERFERENCE),t,unsigned(o.duplicate?3:i?5:3),unsigned(o.duplicate?1:i+1),!o.denied,i?!!o.positive:!o.changed]),list([])]));
 return {...d,orderedInputs:enc(list(rows))};
}
export {task,decode,items,key,enc};
