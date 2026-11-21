/** M202 dc8730c7. Three actual failed nonsocial B/route1 attempts10/12/14.
 * Body30/cap100/rate10/delivery90@9, seed0; source reports11/13/15/16.
 * Original agency episodes1/2/3 map to observed native tickets10/12/14. */
import {fixture as prior,decode,items,key,enc,list,text,signed,u,C,taskB,sid,q,type CanonicalValue} from './assembledRepeatedStakeholder';
import {PRACTICE_SETTING} from '../../assembled/skill';
import {PERFORMANCE_SETTING} from '../../assembled/performance';
import {OBSTRUCTION_SOURCE} from '../../assembled/externalObstruction';
import {SK} from '../../assembled/stakeholderKnowledge';
import {INTERFERENCE,INTERFERENCE_SOURCE,INTERFERENCE_CONTEXT} from '../../assembled/interferenceExpectation';
import {DISPLAY} from '../../assembled/strategy';
export * from './assembledRepeatedStakeholder';
export type Variant='main'|'duplicate'|'repeat'|'correction';
export function fixture(variant:Variant='main'){
 const b=prior(),base=items(decode(b.d.orderedInputs),'list');
 const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
 const rows=base.filter(v=>![OBSTRUCTION_SOURCE,INTERFERENCE_SOURCE].some(t=>eq(items(v,'list')[2],t))).map(v=>{
  const a=[...items(v,'list')];
  if(eq(a[2],PRACTICE_SETTING)){const p=[...items(a[3],'list')];p[3]=q(1,1);p[5]=false;a[3]=list(p);}
  if(eq(a[2],DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=[...items(v,'list')];if(eq(x[5],u(16)))x[5]=u(17);return list(x);}))]);}
  return list(a);
 });
 const at=(v:CanonicalValue,n:number)=>eq(items(v,'list')[0],signed(n));
 const feedback=rows.find(v=>at(v,10)&&eq(items(v,'list')[2],PERFORMANCE_SETTING))!;
 if(!feedback)throw Error('M202 actual outcome template');
 rows.push(list([signed(14),...items(feedback,'list').slice(1)]));
 const contexts=rows.filter(v=>at(v,16));if(contexts.length!==7)throw Error('M202 complete17 context '+contexts.length);
 for(const v of contexts)rows.push(list([signed(17),...items(v,'list').slice(1)]));
 for(const [i,t]of[10,12,14].entries())rows.push(list([signed(t),u(30),OBSTRUCTION_SOURCE,list([text(SK),C,list(i<2?[b.people[0]]:[]),list([]),taskB,list([true,true]),list([false,false]),list([list([]),list([])])]),list([])]));
 for(const [i,t]of[11,13,15].entries())rows.push(list([signed(t),u(10),INTERFERENCE_SOURCE,list([text(INTERFERENCE),taskB,u(10+2*i),u(i+1),true,i<2]),list([])]));
 rows.push(list([signed(16),u(10),INTERFERENCE_SOURCE,list([text(INTERFERENCE),taskB,u(variant==='correction'?10:14),u(variant==='duplicate'||variant==='main'?3:4),variant!=='main',false]),list([])]));
 return {...b,variant,d:{...b.d,orderedInputs:enc(list(rows))}};
}
