import {it,expect,afterEach} from 'vitest';
import {intox,reappraisal,start,through,finish,restore,exact,capture,gate,put,saved,failed,oldEvidence,unpack,summary,records,tags,rec,f,items,key,uint,decode,enc,list,text,q,signed,C,u,restoreAuthoritativeState,type Run} from './fixtures/assembledActivationEffects';
import {safe} from './assembledIntoxicationCohort.test';
import {OBSERVED_RECEIPT} from '../assembled/rewardExperience';
import {habitPath,rewardPath,habitJournal,rewardValue,OBSERVED_REWARD} from '../assembled/habit';
import {MOTOR} from '../assembled/sleepControl';
import {ACTION_BODY} from '../assembled/actionBody';
import {EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
import {SHARED_AFFECT_APPRAISAL,REAPPRAISAL_MOTIVE,reappraisalPath,framePath,reappraisalFrame} from '../assembled/reappraisal';
import {semantic} from './fixtures/assembledActivationNative';
afterEach(c=>{if(c.task.result?.state==='fail')failed(c.task.name);});
const outputs=(r:Run)=>items(decode(r.snapshot().outputs),'list');
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const view=(r:Run)=>safe(r,outputs(r));
function learning(r:Run){const s=state(r);return {count:habitJournal(s.read(habitPath(C)).value,EXTENDED_TIME_LIMIT,'observed').length,mean:Number(rewardValue(s.read(rewardPath(C)).value,EXTENDED_TIME_LIMIT,'observed')?.mean),bytes:enc(list([s.read(habitPath(C)).value??list([]),s.read(rewardPath(C)).value??list([])]))};}
function receipt(r:Run){const a=tags(outputs(r),OBSERVED_RECEIPT).find(v=>v.length===8&&key(v[2])===key(signed(9)));expect(a,'live permitted consequence receipt9').toBeDefined();return a!;}
function physical(r:Run){const os=outputs(r),m=tags(os,MOTOR).find(v=>key(v[2])===key(signed(9)));expect(m,'live motor assessment9').toBeDefined();const b=tags(os,ACTION_BODY).find(v=>key(v[1])===key(m![1]));expect(b).toBeDefined();return {motor:m![6],status:key(b![5])};}
async function runIntox(name:string,scenario:'BlindSober'|'BlindSlow',saturated:boolean,end:number,positive=true){const x=await start(intox(scenario,saturated,positive));await through(x.r,end);put(name,{...capture(x.r),mapping:x.b.mapping,learning:{count:learning(x.r).count,mean:learning(x.r).mean},physical:physical(x.r)});return x;}
it('activation268 masked intoxication keeps whole observer and learning equal',async()=>{
 const a=await runIntox('masked-sober','BlindSober',false,13),b=await runIntox('masked-slow','BlindSlow',false,13);
 expect(physical(a.r)).toEqual({motor:true,status:key(text('Applied'))});expect(physical(b.r)).toEqual({motor:false,status:key(text('Blocked'))});
 expect(view(a.r)).toEqual(view(b.r));expect(learning(a.r).bytes).toEqual(learning(b.r).bytes);
 for(const x of [a,b]){expect(learning(x.r)).toMatchObject({count:1,mean:600});expect(receipt(x.r)).toHaveLength(8);expect(items(receipt(x.r)[6],'list')).toHaveLength(0);expect(items(receipt(x.r)[7],'list')).toHaveLength(1);for(const at of [9,10,11,12,13])expect(gate(x.r.snapshot().outputs,x.b.s,at).result).toBeDefined();}
 put('masked',{wholeObserverEqual:true,learnedStateEqual:true,privateAppliedBlocked:true,mean:600,count:1});console.info('M268 masked whole observer/held learning/actual execution PASS');
},590000);
it('activation268 observed zero changes weak receiving without disclosing physical success',async()=>{
 const a=await runIntox('zero-sober','BlindSober',true,10),b=await runIntox('zero-slow','BlindSlow',true,10);
 expect(physical(a.r)).toEqual({motor:true,status:key(text('Applied'))});expect(physical(b.r)).toEqual({motor:false,status:key(text('Blocked'))});expect(view(a.r)).toEqual(view(b.r));expect(learning(a.r).bytes).toEqual(learning(b.r).bytes);
 for(const x of [a,b]){expect(items(receipt(x.r)[6],'list')).toEqual([u(0)]);expect(learning(x.r)).toMatchObject({count:2,mean:300});const reason=tags(outputs(x.r),OBSERVED_REWARD+'/reasons').find(v=>key(v[1])===key(u(10)));expect(reason).toBeDefined();expect(reason![2]).toBe(true);expect(reason![5]).toEqual(q(3,10));}
 const p=gate(a.r.snapshot().outputs,a.b.s,10);expect(p.result).toBeDefined();expect(p.ns.length).toBeGreaterThan(p.oldNuclei);
 const control=await runIntox('zero159-slow','BlindSlow',true,10,false),c=gate(control.r.snapshot().outputs,control.b.s,10),old=oldEvidence('ASSEMBLED_CHARACTER_M220_INTOXICATION_EVIDENCE.json'),oldOutputs=enc(items(decode(unpack(old.value.boundary.fixedLearning.observer)),'list')[0]),o=gate(oldOutputs,control.b.original,10,false);
 expect(semantic(c.raw)).toEqual(semantic(o.raw));expect(c.prob).toEqual(o.prob);expect(semantic(p.raw)).toEqual(semantic(c.raw));expect(p.prob).not.toEqual(c.prob);
 put('zero-finding',{...summary(p),reference:summary(c),original:{path:old.path,hash:old.hash},sameProducedSemantics:true,wholeObserverEqual:true,privateAppliedBlocked:true,count:2,mean:300,classification:'Direct activation-policy difference on the same learned weak reward; known-zero evidence and private effects remain separate'});console.info('M268 observed zero/native weak reason/current reference correspondence PASS');
},590000);
function activation10(mode:'complete'|'interrupted',bytes:Uint8Array,b:ReturnType<typeof reappraisal>){
 const source=oldEvidence('ASSEMBLED_CHARACTER_M263_EVIDENCE.json'),old=source.value['reappraisal-'+(mode==='complete'?0:1)+'-gate'];
 const current=gate(bytes,b.s,10),prior=gate(unpack(old.outputs),b.original,10);
 expect(semantic(current.raw)).toEqual(semantic(prior.raw));expect(current.ns).toHaveLength(3);expect(prior.ns).toHaveLength(2);expect(current.prob).not.toEqual(prior.prob);
 put('reappraisal-'+mode+'-activation10',{candidate:summary(current),reference:summary(prior),sameProducedSemantics:true,classification:'Direct activation change at operation choice10; later producer semantics/probabilities11 preserved',source:{path:source.path,hash:source.hash}});
}
it('activation268 saved earlier reappraisal activation is classified',()=>{
 for(const mode of ['complete','interrupted'] as const){const b=reappraisal(mode),e=saved()['reappraisal-'+mode];expect(e.mapping).toEqual(b.mapping);activation10(mode,unpack(e.outputs),b);}
 console.info('M268 saved operation-choice10: same produced grounds, third active nucleus, changed actual probabilities PASS');
});
it('activation268 chosen reappraisal still changes later appraisal and actual probabilities',async()=>{
 const runs=[];for(const mode of ['complete','interrupted'] as const){
  const x=await start(reappraisal(mode));await through(x.r,11);put('reappraisal-'+mode,{...capture(x.r),mapping:x.b.mapping});activation10(mode,x.r.snapshot().outputs,x.b);
  const os=outputs(x.r),before=tags(os,SHARED_AFFECT_APPRAISAL).find(v=>uint(v[1])===10n),after=tags(os,SHARED_AFFECT_APPRAISAL).find(v=>uint(v[1])===11n),motive=tags(os,REAPPRAISAL_MOTIVE).find(v=>uint(v[1])===10n);
  expect(before,'live prior appraisal').toBeDefined();expect(after,'live later appraisal').toBeDefined();expect(motive,'live reappraisal motive').toBeDefined();expect(motive![3]).toBe(true);expect(motive![6]).toEqual(q(1,1));
  const first=gate(x.r.snapshot().outputs,x.b.s,10),second=gate(x.r.snapshot().outputs,x.b.s,11);expect(first.result).toBeDefined();expect(second.result).toBeDefined();const frame=reappraisalFrame(state(x.r).read(framePath(C)).value,1000000n);expect(frame.at).toBe(mode==='complete'?10n:0n);
  const old=oldEvidence('ASSEMBLED_CHARACTER_M263_EVIDENCE.json'),oldRun=old.value['reappraisal-'+(mode==='complete'?0:1)+'-gate'],prior=gate(unpack(oldRun.outputs),x.b.original,11);
  put('reappraisal-'+mode+'-finding',{...summary(second),original:{path:old.path,hash:old.hash},old:summary(prior),sameProducedSemantics:JSON.stringify(semantic(second.raw))===JSON.stringify(semantic(prior.raw)),frame:String(frame.at)});
  runs.push({x,before:before!,after:after!,knowledge:key(state(x.r).read(reappraisalPath(C)).value!),p:second.prob});
 }
 expect(runs[0].knowledge).toBe(runs[1].knowledge);expect(runs[0].before[6]).toEqual(runs[1].before[6]);expect(runs[0].after[6]).not.toEqual(runs[1].after[6]);expect(runs[0].p).not.toEqual(runs[1].p);put('reappraisal-finding',{knowledgeEqual:true,priorAppraisalEqual:true,operationFrameAndLaterAppraisalDiffer:true,probabilityDiffers:true});console.info('M268 completed versus interrupted reappraisal -> later affect/reasons/choice PASS');
},590000);
it('activation268 both changed mechanisms repeat and restore exactly',async()=>{
 for(const [name,b,checkpoint]of [['zero',intox('BlindSlow',true),9],['reappraisal',reappraisal('complete'),10]] as const){
  const a=await start(b),repeat=await start(b);await through(a.r,checkpoint);await through(repeat.r,checkpoint);exact(a.r,repeat.r);const restored=await restore(a);exact(a.r,restored);const clocks=[];
  for(let n=0;n<128;n++){const more=await a.r.settleNextInstant();for(const r of [repeat.r,restored]){expect(await r.settleNextInstant()).toBe(more);exact(a.r,r);}clocks.push(String(a.r.snapshot().clock));if(!more)break;if(n===127)throw Error('queue cap');}
  put(name+'-continuation',{...capture(a.r),checkpoint,clocks,fullStateOutputTraceSave:true});console.info('M268 exact continuation',name,'PASS');
 }
},590000);
