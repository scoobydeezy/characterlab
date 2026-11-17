/** M150: body10/seed0, two social tasks, normal recognized reports1..3.
 * A-only opportunities4/6 acquire success receipts; only6 is value-linked.
 * Both tasks live at8; unknown third task, no learned starting state. */
import {promote,prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type CanonicalValue} from './assembledSocialWitness';
import {RECEIPT_REASON_RULES,RECEIPT_REASON_REGISTRY} from '../../assembled/model';
import {RECEIPT_REASONS} from '../../assembled/receiptReasonSources';
import {VALUES,VALUES_CONTEXT} from '../../assembled/values';
import {PERFORMANCE,PERFORMANCE_SETTING} from '../../assembled/performance';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {DISPLAY} from '../../assembled/strategy';
import {unsigned as u,set} from '../../substrate/canonicalEncoding';
export function upgrade<B extends ReturnType<typeof prior>>(b:B,descriptors:CanonicalValue[]=[]){const slots=items(decode(b.s.registry),'list');return {...b,s:{...b.s,rulesVersion:RECEIPT_REASON_RULES,registrySchemaVersion:RECEIPT_REASON_REGISTRY,registry:enc(list([...slots,list([text(RECEIPT_REASONS),list(descriptors)])]))}};}
export type Mode='first'|'last'|'collective'|'duplicate'|'negative'|'zero'|'none';
export function fixture(mode:Mode='collective',permitted=true,truth=true,linked=true){
 const base=promote(prior('corrected',truth)),slots=[...items(decode(base.s.registry),'list')],strategy=items(items(slots[12],'list')[1],'list'),taskRow=items(strategy.find(v=>key(items(v,'list')[0])===key(base.taskA))!,'list');
 // compileStrategy exposes the governed plan action; source declarations remain immutable.
 const registry=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n)),instruction=registry.find(v=>key(f(v,1n))===key(taskRow[1]))!;
 const action=f(rec(f(instruction,4n),389n),1n);
 const descriptor=(label:string,positions:number[],n:number,d:number)=>list([text(label),action,base.taskA,base.taskA,set(positions.map(u)),q(n,d),u(1)]);
 const descriptors=mode==='none'?[]:mode==='first'?[descriptor('receiptFirst',[0],3,4)]:mode==='last'?[descriptor('receiptFirst',[1],3,4)]:mode==='zero'?[descriptor('receiptFirst',[0],0,1)]:mode==='negative'?[descriptor('receiptFirst',[0],-3,4)]:mode==='duplicate'?[descriptor('receiptFirst',[0],3,4),descriptor('receiptDuplicate',[0],2,3)]:[descriptor('receiptFirst',[0],3,4),descriptor('receiptLast',[1],2,3),descriptor('receiptUnion',[0,1],1,4)];
 slots[25]=list([text(VALUES),base.taskA,u(0)]);
 const b=upgrade({...base,s:{...base.s,registry:enc(list(slots))}},descriptors),original=items(decode(b.d.orderedInputs),'list'),frame=original.filter(v=>key(items(v,'list')[0])===key(signed(4)));
 const rows=original.filter(v=>![4,6,8].some(at=>key(items(v,'list')[0])===key(signed(at))));
 for(const at of [4,6,8])for(const v of frame){const a=[...items(v,'list')];a[0]=signed(at);
  if(key(a[2])===key(VALUES_CONTEXT))a[3]=list([text(VALUES),(at===8||at===6&&linked),signed(1)]);
  if(key(a[2])===key(PRIORITY_DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];r[3]=key(r[0])===key(base.taskA)||at===8&&key(r[0])===key(base.taskB)?list([q(1,1)]):list([]);return list(r);}))]);}
  if(key(a[2])===key(DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];r[5]=u(100);return list(r);}))]);}
  rows.push(list(a));
 }
 for(const at of [4,6])rows.push(list([signed(at),u(30),PERFORMANCE_SETTING,list([text(PERFORMANCE),list([list([base.taskA,permitted,u(2)])])]),list([])]));
 return {...b,d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,u,set};
export type {CanonicalValue};
