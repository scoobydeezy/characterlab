/** M192 plan9984e5cb: nonsocial M191 choices; passive world blocker at10 only.
 * Body30/cap100/rate10/delivery90@9; importance3/5,severity1/2,seed0.
 * Performance reports at10 use actual outcomes. No cause or learned belief supplied. */
import {fixture as prior,create,decode,items,key,enc,list,text,signed,u,type CanonicalValue} from './assembledDecisionCurrent';
import {EXTERNAL_OBSTRUCTION_RULES,EXTERNAL_OBSTRUCTION_REGISTRY} from '../../assembled/model';
import {OBSTRUCTION,OBSTRUCTION_SOURCE} from '../../assembled/externalObstruction';
import {PERFORMANCE_SETTING} from '../../assembled/performance';
import {C} from './campaign2Cognitive';
export * from './assembledDecisionCurrent';
export {C};
export function fixture(blocker:0|1|2=1,visible=true,source=true){
 const b=prior(),slots=items(decode(b.s.registry),'list'),people=items(items(slots[19],'list')[1],'list').map(v=>items(v,'list')[0]);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const a=[...items(v,'list')];if(key(a[0])===key(signed(10))&&key(a[2])===key(PERFORMANCE_SETTING)){
   const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=items(v,'list');return list([x[0],visible,u(0)]);}))]);
  }return list(a);
 });
 if(source)rows.push(list([signed(10),u(30),OBSTRUCTION_SOURCE,list([text(OBSTRUCTION),C,list(blocker?[people[blocker-1]]:[])]),list([])]));
 return {s:{...b.s,rulesVersion:EXTERNAL_OBSTRUCTION_RULES,registrySchemaVersion:EXTERNAL_OBSTRUCTION_REGISTRY},d:{...b.d,orderedInputs:enc(list(rows))},people};
}
