import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {personPath,personMean,personHistory,SOCIAL_LEARNING,SOCIAL_UPDATE,SOCIAL_SOURCE,PERSON_OWNER} from '../assembled/social';
import {importancePath} from '../assembled/priority';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {restoreAuthoritativeState} from '../substrate/state';
import {unsigned as u,typedIdentifier} from '../substrate/canonicalEncoding';
import {dataIdentity as id} from '../campaign2/canonicalData';
import {beliefRecord as br} from '../campaign3/beliefCodecs';
import {applyBeliefEvidence,beliefAppraisal} from '../campaign3/beliefMath';
import {PROPOSITIONS,OBSERVER} from '../campaign3/beliefModel';
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledBeliefReceiving';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue;trace?:ReturnType<typeof outputs>}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs),trace=(r:Run)=>view(r).trace??=outputs(snap(r).trace,160n);
const report=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const belief=(r:Run)=>state(r).read(personPath(C,target)).value;
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(96);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('full queue did not exhaust');}
async function create(...args:Parameters<typeof fixture>){const b=fixture(...args),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);return {b,m,r};}
function learned(r:Run,n:number,numerator:number,denominator=1){
 const v=belief(r);expect(v).toBeDefined();expect(personHistory(v)).toHaveLength(n);expect(personMean(v)).toEqual({numerator:BigInt(numerator),denominator:BigInt(denominator)});
 return v!;
}
function probe(r:Run,task:CanonicalValue,at:number,mean:CanonicalValue,likelihood:CanonicalValue){
 const row=report(r,'assembled-social-people/0.1/appraisal').map(a=>a.slice(1).map(v=>items(v,'list')).find(x=>key(x[2])===key(target))!).find(x=>key(x[1])===key(signed(at)))!;expect(row,'actual social appraisal').toBeDefined();expect(row[4]).toEqual(list([mean]));
 const taskRow=items(row[5],'list').map(v=>items(v,'list')).find(x=>key(x[0])===key(task))!;expect(taskRow).toBeDefined();expect(taskRow[2]).toEqual(list([likelihood]));
 expect(items(items(row[6],'list')[3],'list')).toHaveLength(0); // No recalled episode authors these probes.
 const joint=report(r,JOINT_APPRAISAL).find(a=>items(a[6],'list').slice(1).some(v=>key(v)===key(list(row))))!;expect(joint,'joint consumer of actual social appraisal').toBeDefined();
 expect(items(joint[4],'list').some(v=>items(v,'list').length===5)).toBe(true);
 expect(items(state(r).read(importancePath(task)).value!,'list')[1]).toEqual(q(0,1));return row;
}
function controlsOnActualClaims(r:Run){
 const history=personHistory(belief(r));let mean:CanonicalValue|undefined,last:CanonicalValue|undefined,none:CanonicalValue|undefined;
 for(const v of history){const a=items(v,'list'),claim=items(a[6],'list');expect(claim).toHaveLength(1);
  // Comparison-only schema correspondence: actual admitted binary claim and observation identity.
  // This does not assert an absent report was a qualifying negative opportunity.
  const sample=br(737,[a[0],OBSERVER,PROPOSITIONS[0],a[3],true,true,claim[0]]),e=br(741,[typedIdentifier(1150,id(a[0]).payload),sample,u(claim[0]===true?1:2)]);
  mean=applyBeliefEvidence(mean,e,1).next;last=applyBeliefEvidence(last,e,2).next;none=applyBeliefEvidence(none,e,3).next;
 }
 expect(f(rec(mean!,739n),1n)).toEqual(q(7,8));expect(f(rec(last!,739n),1n)).toEqual(q(0,1));expect(none).toBeUndefined();
 expect(beliefAppraisal(mean,q(1,1))).toEqual({expected:q(7,8),confidence:q(8,9)});
 console.info('M125 CAPTURED actual8 claims: weighted7/8, LastObservation0, NoLearning unknown; support-derived confidence8/9 diagnostic only');
}
function learningTrace(r:Run,applied:boolean){
 const t=trace(r).find(t=>{const e=rec(f(t,4n),130n);return key(f(e,2n))===key(signed(8))&&key(f(e,5n))===key(SOCIAL_UPDATE);})!;expect(t).toBeDefined();
 const report8=report(r,SOCIAL_LEARNING).find(a=>key(a[1])===key(signed(8)))!;expect(report8[2]).toBe(applied);
 expect(personMean(report8[3])).toEqual({numerator:1n,denominator:1n});
 const diffs=items(f(t,17n),'list').map(v=>rec(v,148n));expect(diffs).toHaveLength(applied?1:0);if(applied){expect(f(diffs[0],6n)).toEqual(PERSON_OWNER);expect(uint(f(rec(f(diffs[0],1n),140n),1n))).toBe(810n);expect(personMean(report8[4])).toEqual({numerator:7n,denominator:8n});}
 else expect(report8[4]).toEqual(report8[3]);return report8;
}
it('primary125: wrong learned belief corrects through permitted contradiction; goals change appraisal not belief',async()=>{
 const wrong=await create(),accurate=await create('accurate'),goal=await create('corrected',true);
 expect(wrong.b.d).toEqual(goal.b.d);expect(wrong.b.s).toEqual(accurate.b.s);bytes(wrong.b.d.initialState,accurate.b.d.initialState);bytes(wrong.b.d.runSeed,accurate.b.d.runSeed);
 for(const x of[wrong,accurate,goal])await through(x.r,7n);
 const old=learned(wrong.r,7,1);learned(accurate.r,7,0);expect(learned(goal.r,7,1)).toEqual(old);
 for(const x of[wrong,accurate,goal])await through(x.r,8n);
 learned(wrong.r,8,7,8);learned(accurate.r,8,0);expect(learned(goal.r,8,7,8)).toEqual(belief(wrong.r));
 probe(wrong.r,wrong.b.task,8,q(1,1),q(0,1));probe(accurate.r,accurate.b.task,8,q(0,1),q(1,1));probe(goal.r,goal.b.task,8,q(1,1),q(1,1));learningTrace(wrong.r,true);
 for(const x of[wrong,accurate,goal])await through(x.r,9n);
 probe(wrong.r,wrong.b.task,9,q(7,8),q(1,8));probe(accurate.r,accurate.b.task,9,q(0,1),q(1,1));probe(goal.r,goal.b.task,9,q(7,8),q(7,8));expect(belief(goal.r)).toEqual(belief(wrong.r));controlsOnActualClaims(wrong.r);
 for(const x of[wrong,accurate,goal])await finish(x.r);
 console.info('M125 PRIMARY fixed false truth: mean1 vs0 at7; contradiction8 gives7/8 vs0; current8 reads1, current9 reads7/8; goal-only exact belief equality and failure likelihood0/1 then1/8 vs7/8; full queues');
},550000);
it('controls125: hidden truth cannot correct belief and silence or denial is no negative evidence',async()=>{
 const main=await create(),hidden=await create('hidden'),silent=await create('silent'),denied=await create('denied');
 // Check the authored intervention premise independently of the runtime result.
 const normalized=(data:typeof main.b.d,field:number)=>list(items(decode(data.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(SOCIAL_SOURCE)){const p=[...items(a[3],'list')],o=[...items(p[1],'list')];o[field]=field===1?false:u(0);p[1]=list(o);a[3]=list(p);}return list(a);}));
 const accurate=fixture('accurate');expect(normalized(main.b.d,3)).toEqual(normalized(accurate.d,3));expect(normalized(main.b.d,1)).toEqual(normalized(hidden.b.d,1));
 const truth=items(decode(main.b.d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE)).map(v=>items(items(items(v,'list')[3],'list')[1],'list')[1]);expect(truth).toEqual(Array(8).fill(false));
 for(const x of[main,hidden,silent,denied])await through(x.r,7n);
 const prior=belief(silent.r);for(const x of[main,hidden,silent,denied])await through(x.r,9n);
 expect(belief(hidden.r)).toEqual(belief(main.r));expect(report(hidden.r,SOCIAL_LEARNING)).toEqual(report(main.r,SOCIAL_LEARNING));expect(report(hidden.r,'assembled-social-people/0.1/appraisal')).toEqual(report(main.r,'assembled-social-people/0.1/appraisal'));
 for(const x of[silent,denied]){expect(learned(x.r,7,1)).toEqual(prior);learningTrace(x.r,false);probe(x.r,x.b.task,9,q(1,1),q(0,1));}
 for(const x of[main,hidden,silent,denied])await finish(x.r);expect(belief(main.r)).toEqual(belief(hidden.r));expect(belief(silent.r)).toEqual(prior);expect(belief(denied.r)).toEqual(prior);
 console.info('M125 CONTROLS hidden truth same learned/appraisal bytes; silent and denied final sources retain mean1/support7 through full queue; no qualifying-opportunity claim');
},550000);
it('continuation125: exact repeat and save7 continuation preserve correction and later recall',async()=>{
 const {b,m,r}=await create(),duplicate=await createCharacterRun(m,b.d);await through(r,7n);await through(duplicate,7n);exact(r,duplicate);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);await finish(r,[duplicate,restored]);
 learned(r,8,7,8);console.info('M125 CONTINUATION duplicate/save7 restored exact at every settled boundary through queue exhaustion');
},550000);
