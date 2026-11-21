/** M203 0227853a: original evidence boundaries on M202's current scene. */
import {fixture as prior,decode,items,key,enc,list,text,signed,u,q,rec,f,uint,taskB,type CanonicalValue} from './assembledInterferenceHistory';
import {decodeAgency} from '../../campaign3/agencyCodecs';
import {interferenceSources} from '../interferenceExpectationFixtures';
import {OBSTRUCTION_SOURCE} from '../../assembled/externalObstruction';
import {INTERFERENCE_SOURCE} from '../../assembled/interferenceExpectation';
import {PERFORMANCE_SETTING} from '../../assembled/performance';
export * from './assembledInterferenceHistory';
export type Boundary='main'|'clear'|'blocked'|'hidden'|'withheld'|'withheldChanged'|'noOpportunity';
let template:ReturnType<typeof prior>|undefined;
export function fixture(name:Boundary){
 const b=template??(template=prior('main')),spec=interferenceSources()[name],original=items(decodeAgency(spec.orderedInputs),'list').map(v=>rec(v,973n));
 const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b),rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const a=[...items(v,'list')],t=Number((a[0] as {value:bigint}).value)-9,old=original.find(v=>(f(v,1n) as {value:bigint}).value===BigInt(t));
  if(old&&eq(a[2],OBSTRUCTION_SOURCE)&&uint(f(old,2n))===1n){const p=[...items(a[3],'list')],block=Number(uint(f(old,5n)));p[2]=list(block?[b.people[block-1]]:[]);a[3]=list(p);}
  if(old&&eq(a[2],INTERFERENCE_SOURCE)&&uint(f(old,2n))===2n){const p=[...items(a[3],'list')];p[4]=items(f(old,10n),'set').some(v=>eq(v,u(1)));p[5]=f(old,9n);a[3]=list(p);}
  if(old&&eq(a[2],PERFORMANCE_SETTING)&&uint(f(old,2n))===1n){const p=items(a[3],'list'),visible=items(f(old,6n),'set').some(v=>eq(v,u(1)));a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=items(v,'list');return eq(x[0],taskB)?list([x[0],visible,x[2]]):v;}))]);}
  return list(a);
 });
 return {...b,name,original,d:{...b.d,orderedInputs:enc(list(rows))}};
}
