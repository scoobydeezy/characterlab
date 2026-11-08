import * as stateModule from '../substrate/state';
import {createChosenReappraisalRun} from '../campaign3/chosenReappraisal';
import {chosenFrames} from './chosenReappraisalFixtures';
import {it,expect,vi} from 'vitest';
import {list,text,unsigned as u,rational as q,set,record,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,taskA,taskB,decode,items,key,enc,type Mode} from './fixtures/assembledThreatReinterpretation';
import {receivingRecord as rec,cognitiveRecord as cr} from '../assembled/codecs';
import {dataField as f,dataUnsigned as uint,dataText as txt,dataIdentity as id} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {INTERPRETED_THREAT_VERSION,SHARED_AFFECT_APPRAISAL,reappraisalPath,framePath} from '../assembled/reappraisal';
import {RESERVE_AFFECT_REGISTRY} from '../assembled/model';
import * as factors from '../campaign3/affectFactorComparison';
import {bodyPath} from '../assembled/body';
import {reappraisalKnowledge,reappraisalFrame,REAPPRAISAL_MOTIVE,REAPPRAISAL_APPLY} from '../assembled/reappraisal';
import {validateMitigationPacket} from '../assembled/mitigation';
import {affectRecord as ar} from '../campaign3/affectCodecs';
import {affectAppraisal} from '../campaign3/affectMath';
import {beliefRecord} from '../campaign3/beliefCodecs';
import {compileAffectModel,affectRecipe} from '../campaign3/affectModel';
import {arbitrationOutput} from '../assembled/arbitration';
import {randomAddressValue,naturalRandomKeyValue} from '../substrate/random';
import {sid} from '../assembled/skill';
import {outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
const cache=new WeakMap<Run,ReturnType<Run['snapshot']>>();
const snap=(r:Run)=>{let v=cache.get(r);if(!v){v=r.snapshot();cache.set(r,v);}return v;};
async function step(r:Run){cache.delete(r);return r.settleNextInstant();}
async function through(r:Run,t:bigint){for(let n=0;snap(r).clock<t;n++){expect(n).toBeLessThan(32);expect(await step(r)).toBe(true);}expect(snap(r).clock).toBe(t);}
async function finish(r:Run){for(let n=0;await step(r);n++)expect(n).toBeLessThan(32);expect(snap(r).clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
const trace=(r:Run)=>outputs(snap(r).trace,160n),event=(t:ReturnType<typeof trace>[number])=>rec(f(t,4n),130n);
const reports=(r:Run,tag:string)=>items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const frac=(v:CanonicalValue)=>{const n=readQ(v);return n.numerator+'/'+n.denominator;};
const state=(r:Run)=>restoreAuthoritativeState(decode(snap(r).state));
const dec=(r:Run)=>outputs(snap(r).outputs,409n).find(v=>signedValue(f(v,2n))===11n)!;
const result=(d:CanonicalValue)=>{const s=rec(f(rec(d,409n),4n),419n);expect(uint(f(s,1n)),'live resolved choice').toBe(3n);return rec(f(s,2n),420n);};
const definition=(s:ReturnType<typeof fixture>['s'],name:string)=>f(rec(items(items(decode(s.registry),'list')[0],'set').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(sid(1027,'definition/'+name)))!,171n),4n);
function projection(r:Run,live=true){
 const a=reports(r,SHARED_AFFECT_APPRAISAL).find(v=>uint(v[1])===11n)!;expect(a).toBeDefined();
 const provenance=items(a[7],'list');expect(provenance[0]).toEqual(taskA);
 const decision=dec(r);expect(decision).toBeDefined();const data=result(decision),context=rec(f(decision,3n),408n),raw=rec(f(context,2n),403n);
 const signals=items(f(raw,3n),'set').map(v=>rec(v,402n)),ns=items(f(context,3n),'list').map(v=>rec(v,407n));
 const signal=(task:CanonicalValue,role:bigint)=>signals.filter(v=>{const k=rec(f(v,1n),401n);return key(f(k,2n))===key(task)&&uint(f(k,3n))===role;});
 const forTask=(task:CanonicalValue)=>ns.filter(n=>key(f(rec(f(n,1n),404n),3n))===key(f(rec(task,371n),2n)));
 if(live){for(const task of [taskA,taskB]){expect(signal(task,1n),'live positive existing base').toHaveLength(1);expect(readQ(f(signal(task,1n)[0],2n)).compare(Q.of(0n))).toBeGreaterThan(0);expect(forTask(task),'live compiled task reason').toHaveLength(1);}expect(ns).toHaveLength(2);expect(new Set(ns.map(n=>key(f(rec(f(n,1n),404n),1n)))).size,'distinct live competing actions').toBe(2);}
 const receive=trace(r).find(t=>txt(f(t,6n))===INTERPRETED_THREAT_VERSION&&signedValue(f(event(t),2n))===11n&&uint(f(event(t),3n))===80n)!;expect(receive).toBeDefined();
 const input=items(f(receive,12n),'list');expect(input[1]).toEqual(list(a));
 const producer=trace(r).find(t=>uint(f(event(t),1n))===uint(input[2])&&key(f(t,13n))===key(list(a)))!;expect(producer).toBeDefined();expect(txt(f(producer,6n))).toBe(INTERPRETED_THREAT_VERSION);
 expect(items(f(producer,11n),'list')).toHaveLength(3);expect(items(f(receive,14n),'list')).toEqual([]);
 expect(f(rec(f(receive,13n),403n),3n)).toEqual(f(raw,3n));
 const concern=trace(r).find(t=>txt(f(t,6n))===INTERPRETED_THREAT_VERSION&&signedValue(f(event(t),2n))===11n&&typeof f(t,13n)!=='boolean'&&(f(t,13n) as any).schema?.typeId===388n)!;expect(concern).toBeDefined();expect(items(f(concern,12n),'list')[1]).toEqual(list(a));
 // Actual outcome ancestry proves this context reaches execution, not just a diagnostic projection.
 expect(outputs(snap(r).outputs,433n).some(o=>{const attempt=rec(f(o,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n);return key(f(intent,2n))===key(decision);})).toBe(true);

 return {a,provenance,decision,data,context,raw,ns,signal,forTask,receive};
}
function bytes(a:Uint8Array,b:Uint8Array){expect(a.length).toBe(b.length);expect(a.every((x,i)=>x===b[i])).toBe(true);}
function exact(a:Run,b:Run){const x=snap(a),y=snap(b);expect([x.clock,x.status]).toEqual([y.clock,y.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());}
async function create(mode:Mode,at=11n){const b=fixture(mode),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);await through(r,at);return {b,m,r};}
async function exactProof(s:ReturnType<typeof fixture>['s'],runs:Run[]){
 const def=definition(s,'task-arbitration'),resolutions=runs.map(dec),rs=resolutions.map(result),contexts=resolutions.map(d=>rec(f(d,3n),408n)),ns=contexts.map(c=>items(f(c,3n),'list').map(n=>rec(n,407n)));
 expect(ns[0].map(n=>f(n,4n))).toEqual(ns[1].map(n=>f(n,4n)));
 expect(ns[0].map(n=>f(n,1n))).toEqual(ns[1].map(n=>f(n,1n)));
 const candidates=ns[0].map(n=>f(rec(f(n,1n),404n),1n)),sizes=ns[0].map(n=>uint(f(n,4n)));expect(sizes).toHaveLength(2);
 const counts=[0n,0n],total=sizes[0]*sizes[1]*2n;let changed=0;
 for(let a=0n;a<sizes[0];a++)for(let b=0n;b<sizes[1];b++)for(let tie=0n;tie<2n;tie++){
  const winners:CanonicalValue[]=[];
  for(let arm=0;arm<2;arm++){
   const occ=f(resolutions[arm],1n),draw=(value:bigint,span:bigint,n?:CanonicalValue)=>{
    const k=n?rec(f(rec(n,407n),1n),404n):undefined,c=k?rec(f(k,1n),395n):rec(candidates[0],395n);
    const address={causalRootId:id(occ),purposeId:sid(1042,k?'purpose/task-reason-face':'purpose/task-decision-tie'),subjectBindings:[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(f(c,1n))},...(k?[{subjectRoleId:sid(1043,'subject/action'),subjectId:id(f(c,2n))},{subjectRoleId:sid(1043,'subject/task'),subjectId:id(f(k,3n))}]:[])],drawIndex:0n};
    return cr(411,[randomAddressValue(address),naturalRandomKeyValue(address),u(value),u(span),u(((1n<<128n)/span)*span),false,list([cr(410,[u(0),u(value),false])])],1);
   };
   const out=await arbitrationOutput(occ,10n,contexts[arm],def,{async reason(n){const first=key(f(rec(f(rec(n,407n),1n),404n),1n))===key(candidates[0]);return draw(first?a:b,first?sizes[0]:sizes[1],n);},async tie(leaders){expect(leaders).toHaveLength(2);return draw(tie,2n);}},3),data=result(out),winner=f(data,1n);
   expect(f(data,2n)).toEqual(f(rs[arm],2n));winners.push(winner);if(key(winner)===key(candidates[0]))counts[arm]++;
  }
  if(key(winners[0])!==key(winners[1]))changed++;
 }
 console.info('M72 DIAGNOSTIC '+JSON.stringify({changed,cases:String(total),counts:counts.map(String),modes:rs.map(r=>String(uint(f(r,8n)))),probabilities:rs.map(r=>items(f(r,2n),'list').map(v=>frac(f(rec(v,421n),2n)))),nuclei:ns.map(xs=>xs.map(n=>({roles:[1n,2n,3n].map(i=>frac(f(rec(f(n,2n),406n),i))),die:String(uint(f(n,4n))),standing:String(signedValue(f(n,5n))),situation:String(signedValue(f(n,6n)))})))}));
 expect(changed).toBeGreaterThan(0);expect(counts[0]).not.toBe(counts[1]);
 for(let arm=0;arm<2;arm++){const probability=items(f(rs[arm],2n),'list').find(v=>key(f(rec(v,421n),1n))===key(candidates[0]))!;const actual=uint(f(rs[arm],8n))===1n?Q.of(key(f(rs[arm],1n))===key(candidates[0])?1n:0n):readQ(f(rec(probability,421n),2n));expect(actual.equals(Q.of(counts[arm],total))).toBe(true);}
 console.info('M72 EXACT '+JSON.stringify({cases:String(total),changed,firstCandidateWins:counts.map(String),probabilities:counts.map(n=>n+'/'+total),scope:'captured actual contexts; paired uniform faces and fair ties; no seed-pair claim'}));
 return {counts,total,changed};
}


const knowledge=(r:Run)=>reappraisalKnowledge(state(r).read(reappraisalPath(C)).value,C,true,true,true,true);
const frame=(r:Run)=>reappraisalFrame(state(r).read(framePath(C)).value);
const appraisal=(r:Run,at:number)=>reports(r,SHARED_AFFECT_APPRAISAL).find(a=>uint(a[1])===BigInt(at))!;
const motive=(r:Run)=>reports(r,REAPPRAISAL_MOTIVE).find(a=>uint(a[1])===10n)!;
function operation(r:Run,completed:boolean){
 const b=fixture(),slots=items(decode(b.s.registry),'list'),decl=items(slots[28],'list'),d=outputs(snap(r).outputs,409n).find(d=>signedValue(f(d,2n))===10n)!;
 expect(d,'actual chosen cognitive decision10').toBeDefined();const data=result(d);
 expect(f(rec(f(data,1n),395n),2n)).toEqual(decl[2]);
 expect(uint(f(data,8n))).toBe(1n);
 const outcomes=outputs(snap(r).outputs,433n).filter(o=>{const intent=rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n);return key(f(intent,2n))===key(d);});
 expect(outcomes).toHaveLength(1);expect(uint(f(outcomes[0],3n))>0n).toBe(completed);
 expect(motive(r).slice(3)).toEqual([true,q(1,1),q(1,1),q(1,1)]);
 return outcomes[0];
}
function interpreted(r:Run,completed:boolean){
 const x=projection(r),prior=appraisal(r,10);
 expect(txt(prior[5]),'live same-instant appraisal').toBe('Known');
 expect(prior[6]).toEqual(list([q(199,600),q(199,600)]));
 expect(items(prior[7],'list')[9]).toEqual(list([text('CurrentUnprotected'),list([q(1,1),q(0,1)]),list(knowledge(r).efficacy!.alternative!.supports)]));
 expect(txt(x.a[5]),'live later appraisal').toBe('Known');
 expect(items(x.provenance[4],'list')).toEqual([q(completed?0:1,1),q(1,3),q(99,100),q(0,1)]);
 expect(x.a[6]).toEqual(completed?list([q(0,1),q(0,1)]):list([q(199,600),q(199,600)]));
 const alt=knowledge(r).efficacy!.alternative!.supports;expect(alt).toHaveLength(1);
 expect(items(alt[0],'list').map(p=>validateMitigationPacket(p).glyph)).toEqual([2n,2n,2n]);
 expect(x.provenance[9]).toEqual(list([text(completed?'HypotheticalProtected':'CurrentUnprotected'),list([q(1,1),q(0,1)]),list(alt)]));
 expect(frame(r).at).toBe(completed?10n:0n);
 if(completed){const applied=trace(r).find(t=>key(f(event(t),5n))===key(REAPPRAISAL_APPLY))!;expect(applied).toBeDefined();expect(signedValue(f(event(applied),2n))).toBe(10n);expect(uint(f(event(applied),3n))).toBe(140n);
 const producer=trace(r).find(t=>txt(f(t,6n))===INTERPRETED_THREAT_VERSION&&key(f(t,13n))===key(list(x.a)))!;
 expect(items(f(producer,12n),'list')[1]).toEqual(state(r).read(framePath(C)).value);}
 return x;
}
it('M72 connection: chosen completion changes later hypothetical threat and grounded choice',async()=>{
 const A=fixture(),B=fixture('interrupted');expect(A.s).toEqual(B.s);bytes(A.d.initialState,B.d.initialState);
 const m=await prepareCharacterModel(A.s),a=await createCharacterRun(m,A.d),b=await createCharacterRun(m,B.d);
 await through(a,9n);await through(b,9n);bytes(snap(a).state,snap(b).state);bytes(snap(a).outputs,snap(b).outputs);
 const before=state(a).read(reappraisalPath(C));await through(a,10n);await through(b,10n);expect(state(a).read(bodyPath(C))).toEqual(state(b).read(bodyPath(C)));await through(a,11n);await through(b,11n);
 const outcome=operation(a,true);operation(b,false);const pa=interpreted(a,true),pb=interpreted(b,false);
 expect(items(state(a).read(framePath(C)).value!,'list')[2]).toEqual(f(outcome,1n));
 expect(state(a).read(reappraisalPath(C))).toEqual(before);expect(state(b).read(reappraisalPath(C))).toEqual(before);
 expect(pa.signal(taskA,1n)).toEqual(pb.signal(taskA,1n));expect(pa.forTask(taskB)).toEqual(pb.forTask(taskB));
 expect([pa,pb].map(p=>signedValue(f(p.forTask(taskA)[0],6n)))).toEqual([0n,2n]);
 const proof=await exactProof(A.s,[a,b]);expect(proof.counts).toEqual([36n,72n]);expect(proof.changed).toBe(36);
 for(const [scenario,native]of [['SafetyOnly',a],['Interrupted',b]] as const){
  const original=await createChosenReappraisalRun('BenefitRelative',chosenFrames(scenario),0,2);for(let i=0;i<8;i++)await original.step();
  const rows=original.snapshot().rows;expect(rows[4].means).toEqual(['1/1','0/1']);
  expect(rows[4].frameBefore!==null).toBe(frame(native).at>0n);
  expect(rows[4].affect).toEqual(scenario==='SafetyOnly'?['0/1','0/1']:['1/1','1/1']);
 }
 console.info('M72 CONNECTION PASS perceived context means -> chosen operation10 -> frame140 -> later hypothetical appraisal11 -> grounded choice36/72; original conditional semantics agree.');
},540000);
it('M72 controls: suppression unknown ineffective and hidden truth',async()=>{
 const no=await create('noFrame',11n);operation(no.r,true);interpreted(no.r,false);
 const denied=await create('denied',11n);expect(knowledge(denied.r).means[1]).toBeUndefined();expect(motive(denied.r)[3]).toBe(false);expect(frame(denied.r).at).toBe(0n);expect(txt(appraisal(denied.r,11)[5])).toBe('Known');
 const ineffective=await create('ineffective',11n);expect(knowledge(ineffective.r).means.map(v=>v!.equals(Q.of(1n)))).toEqual([true,true]);expect(motive(ineffective.r)[3]).toBe(true);expect(motive(ineffective.r)[6]).toEqual(q(0,1));expect(frame(ineffective.r).at).toBe(0n);
 const a=await create('complete',11n),b=await create('hidden',11n);operation(a.r,true);operation(b.r,true);
 expect(knowledge(a.r)).toEqual(knowledge(b.r));expect(frame(a.r)).toEqual(frame(b.r));const x=interpreted(a.r,true),y=interpreted(b.r,true);expect(x.a).toEqual(y.a);expect(x.ns).toEqual(y.ns);
 const F=fixture();await expect(prepareCharacterModel({...F.s,registrySchemaVersion:RESERVE_AFFECT_REGISTRY})).rejects.toThrow('unsupported assembled model version bundle');
 const direct=list([signed(10),u(140),REAPPRAISAL_APPLY,state(a.r).read(framePath(C)).value!,list([])]);
 await expect(createCharacterRun(await prepareCharacterModel(F.s),{...F.d,orderedInputs:enc(list([...items(decode(F.d.orderedInputs),'list'),direct]))})).rejects.toThrow();
 console.info('M72 CONTROLS PASS NoReappraisal/denied alternative/ineffective benefit/hidden truth; invalid bundle and direct frame input reject.');
},540000);
it('M72 persistence and actual frame-write rollback',async()=>{
 const {b,m,r:a}=await create('complete',9n),repeat=await createCharacterRun(m,b.d);await through(repeat,9n);exact(a,repeat);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);
 const fault=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()}),before=snap(fault),original=stateModule.applyStatePatch;let injected=false;
 const spy=vi.spyOn(stateModule,'applyStatePatch').mockImplementation((...args)=>{const result=original(...args);if(args[1].operations.some(o=>o.path.rootStateTypeId===1031n)){injected=true;throw Error('M72 after actual frame patch');}return result;});
 try{await expect(step(fault)).rejects.toThrow('M72 after actual frame patch');expect(injected).toBe(true);const after=snap(fault);expect(after.clock).toBe(before.clock);for(const k of ['state','outputs','trace'] as const)bytes(after[k],before[k]);expect(frame(fault).at).toBe(0n);}finally{spy.mockRestore();}
 for(const r of [a,repeat,restored]){await through(r,11n);operation(r,true);interpreted(r,true);await finish(r);}exact(a,repeat);exact(a,restored);
 console.info('M72 PERSISTENCE PASS exact repeat/restore9->101 and whole-instant rollback after actual frame patch10.');
},540000);
