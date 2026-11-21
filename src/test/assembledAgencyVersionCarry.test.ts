import {it,expect} from 'vitest';
import {pair,labels,view,items,eq,list,u,q,text,rec,f,uint,outputs,type Case,type Run,fixture,next} from './fixtures/assembledAgencyVersionCarry';
import {prepareCharacterModel,createCharacterRun} from '../assembled/character';
import {INTERFERENCE_ACQUISITION_RULES,INTERFERENCE_ACQUISITION_REGISTRY} from '../assembled/model';
import {ACTION_BODY} from '../assembled/actionBody';
import {SKILL_ACTUAL} from '../assembled/skill';
import {PERFORMANCE_OBS} from '../assembled/performance';
import {INTERFERENCE_APPRAISAL} from '../assembled/interferenceExpectation';
import {stakeholderPath,stakeholderJournal,stakeholderBeliefs} from '../assembled/stakeholderKnowledge';
import {EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
function physical(x:{current:Run},at:bigint,intrinsic:boolean,applied:boolean){
 const r=x.current,obs=labels(r,PERFORMANCE_OBS).filter(v=>uint(v[2])===at);expect(obs).toHaveLength(1);expect(obs[0][6]).toBe(applied);expect(obs[0][7]).toBe(true);
 const out=view(r).s.outputs,decision=outputs(out,409n).find(v=>(f(v,2n) as {value:bigint}).value===at)!;expect(decision).toBeDefined();expect(uint(f(rec(f(decision,4n),419n),1n))).toBe(3n);
 const intent=outputs(out,425n).find(v=>eq(f(v,2n),decision))!;expect(intent).toBeDefined();
 expect(outputs(out,426n).filter(v=>eq(f(v,2n),intent))).toHaveLength(1);
 const execution=outputs(out,433n).find(v=>eq(f(rec(f(rec(f(v,2n),432n),2n),431n),2n),intent))!;expect(execution).toBeDefined();
 const effect=labels(r,ACTION_BODY).filter(v=>eq(v[1],f(execution,1n)));expect(effect).toHaveLength(1);expect(effect[0][5]).toEqual(text(applied?'Applied':'Blocked'));
 const sk=labels(r,SKILL_ACTUAL).filter(v=>eq(v[2],effect[0][1]));expect(sk).toHaveLength(1);expect(sk[0][6]).toBe(true);expect(sk[0][7]).toBe(intrinsic);expect(obs[0][5]).toEqual(effect[0][3]);
}
function repeatedClaims(x:{current:Run}){
 physical(x,10n,true,false);physical(x,12n,true,false);
 for(const [at,p] of [[12n,q(1,2)],[14n,q(3,4)],[16n,q(3,4)]] as const){const a=labels(x.current,INTERFERENCE_APPRAISAL).filter(v=>uint(v[1])===at);expect(a).toHaveLength(1);expect(a[0][6]).toEqual(p);}
}
it('M206 repeated pair and current continuation',async()=>{repeatedClaims(await pair('repeated',true));},570000);
it('M206 repaired physical repeated claims',async()=>{
 const b=fixture('repeated'),s={...b.s,rulesVersion:INTERFERENCE_ACQUISITION_RULES,registrySchemaVersion:INTERFERENCE_ACQUISITION_REGISTRY},current=await createCharacterRun(await prepareCharacterModel(s),b.d);
 for(let n=0;view(current).s.clock<16n;n++){expect(n).toBeLessThan(64);expect(await next(current)).toBe(true);}
 expect(view(current).s.clock).toBe(16n);repeatedClaims({current});console.info('M206 REPAIRED physical and prior appraisal PASS two real failures,1/2->3/4, exact output/intent/execution binding; full carry/restore retained from preceding receipt.');
},570000);
it('M206 passive report correction duplicate pair',async()=>{
 const x=await pair('passive');physical(x,10n,true,false);
 const beliefs=x.model.socialWitness!.observers.map(o=>stakeholderBeliefs(stakeholderJournal(view(x.current).state.read(stakeholderPath(o)).value,o,EXTENDED_TIME_LIMIT)));
 expect(beliefs).toEqual([list([list([u(10),u(1),u(2)])]),list([list([u(10),u(1),u(2)])])]);
},570000);
for(const name of ['trainedFree','untrainedBlocked','available','lost'] as Case[])it('M206 physical '+name,async()=>{
 const x=await pair(name);physical(x,name==='trainedFree'||name==='untrainedBlocked'?14n:10n,name!=='untrainedBlocked',name==='trainedFree'||name==='available');
},570000);
