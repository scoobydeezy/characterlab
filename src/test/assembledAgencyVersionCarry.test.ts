import {it,expect} from 'vitest';
import {pair,labels,view,items,eq,list,u,q,text,rec,f,uint,outputs,type Case} from './fixtures/assembledAgencyVersionCarry';
import {ACTION_BODY} from '../assembled/actionBody';
import {SKILL_ACTUAL} from '../assembled/skill';
import {PERFORMANCE_OBS} from '../assembled/performance';
import {INTERFERENCE_APPRAISAL} from '../assembled/interferenceExpectation';
import {stakeholderPath,stakeholderJournal,stakeholderBeliefs} from '../assembled/stakeholderKnowledge';
import {EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
function physical(x:Awaited<ReturnType<typeof pair>>,at:bigint,intrinsic:boolean,applied:boolean){
 const r=x.current,obs=labels(r,PERFORMANCE_OBS).filter(v=>uint(v[2])===at);expect(obs).toHaveLength(1);expect(obs[0][6]).toBe(applied);expect(obs[0][7]).toBe(true);
 const traces=view(r).trace.filter(t=>(f(rec(f(t,4n),130n),2n) as {value:bigint}).value===at);
 const rows=traces.flatMap(t=>{const p=f(t,13n);return typeof p!=='boolean'&&p.kind==='list'?p.items:[p];});
 const labelled=(tag:string)=>rows.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(tag))).map(v=>items(v,'list'));
 const sk=labelled(SKILL_ACTUAL);expect(sk).toHaveLength(1);expect(sk[0][6]).toBe(true);expect(sk[0][7]).toBe(intrinsic);
 const effect=labelled(ACTION_BODY);expect(effect).toHaveLength(1);expect(effect[0][5]).toEqual(text(applied?'Applied':'Blocked'));
 expect(outputs(list(rows),425n)).toHaveLength(1);expect(outputs(list(rows),426n)).toHaveLength(1);
}
it('M206 repeated pair and current continuation',async()=>{
 const x=await pair('repeated',true);physical(x,10n,true,false);physical(x,12n,true,false);
 for(const [at,p] of [[12n,q(1,2)],[14n,q(3,4)],[16n,q(3,4)]] as const){const a=labels(x.current,INTERFERENCE_APPRAISAL).filter(v=>uint(v[1])===at);expect(a).toHaveLength(1);expect(a[0][6]).toEqual(p);}
},570000);
it('M206 passive report correction duplicate pair',async()=>{
 const x=await pair('passive');physical(x,10n,true,false);
 const beliefs=x.model.socialWitness!.observers.map(o=>stakeholderBeliefs(stakeholderJournal(view(x.current).state.read(stakeholderPath(o)).value,o,EXTENDED_TIME_LIMIT)));
 expect(beliefs).toEqual([list([list([u(10),u(1),u(2)])]),list([list([u(10),u(1),u(2)])])]);
},570000);
for(const name of ['trainedFree','untrainedBlocked','available','lost'] as Case[])it('M206 physical '+name,async()=>{
 const x=await pair(name);physical(x,name==='trainedFree'||name==='untrainedBlocked'?14n:10n,name!=='untrainedBlocked',name==='trainedFree'||name==='available');
},570000);
