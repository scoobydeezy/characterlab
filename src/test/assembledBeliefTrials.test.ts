import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import * as socialModule from '../assembled/social';
import {SOCIAL_TRIAL_EVIDENCE,SOCIAL_OBSERVATION,BELIEF_TRIAL_VERSION,qualifySocialTrial,socialSetting} from '../assembled/social';
import {EPISODIC_OWNER} from '../assembled/memory';
import {qValue} from '../campaign2/cognitiveMath';
import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {personPath,personMean,personHistory,SOCIAL_LEARNING,SOCIAL_UPDATE,SOCIAL_SOURCE,PERSON_OWNER} from '../assembled/social';
import {importancePath} from '../assembled/priority';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {unsigned as u,typedIdentifier} from '../substrate/canonicalEncoding';
import {dataIdentity as id} from '../campaign2/canonicalData';
import {beliefRecord as br} from '../campaign3/beliefCodecs';
import {applyBeliefEvidence,beliefAppraisal,classifyBeliefSample} from '../campaign3/beliefMath';
import {PROPOSITIONS,OBSERVER} from '../campaign3/beliefModel';
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledBeliefTrials';
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

function trialAudit(r:Run,classes:(number|undefined)[]){
 const rows=report(r,SOCIAL_TRIAL_EVIDENCE);expect(rows).toHaveLength(classes.length);
 const observations=report(r,SOCIAL_OBSERVATION).map(a=>items(a[1],'list'));
 const experiences=items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===227n).map(v=>rec(v,227n));
 let mean:CanonicalValue|undefined,last:CanonicalValue|undefined,none:CanonicalValue|undefined;
 for(const [i,a]of rows.entries()){
  expect(a).toHaveLength(5);expect(a[3]).toEqual(list(classes[i]===undefined?[]:[u(classes[i]!)]));
  const o=observations.find(o=>key(o[0])===key(a[1]))!;expect(o).toBeDefined();const display=items(a[2],'list');
  if(classes[i]===undefined){expect(display).toHaveLength(0);expect(a[4]).toEqual(list([]));expect(o[6]).toEqual(list([]));continue;}
  expect(display).toHaveLength(3);
  const sample=br(737,[a[1],OBSERVER,PROPOSITIONS[0],o[3],...display]);
  expect(classifyBeliefSample(sample)).toBe(classes[i]);expect(o[6]).toEqual(list(classes[i]!<=2?[classes[i]===1]:[]));
  const e=br(741,[typedIdentifier(1150,id(a[1]).payload),sample,u(classes[i]!)]);
  mean=applyBeliefEvidence(mean,e,1).next;last=applyBeliefEvidence(last,e,2).next;none=applyBeliefEvidence(none,e,3).next;
  const x=experiences.find(x=>key(f(x,1n))===key(items(a[4],'list')[0]))!;expect(x,'actual frozen C1 experience').toBeDefined();
  expect(items(f(x,8n),'set').map(v=>f(rec(v,216n),2n))).toContainEqual(a[1]);
  const t=trace(r).find(t=>{const output=f(t,13n);return typeof output!=='boolean'&&output.kind==='list'&&output.items.some(v=>key(v)===key(list(a)));})!;expect(t).toBeDefined();expect(f(t,6n)).toEqual(text(BELIEF_TRIAL_VERSION));
  expect(items(f(t,9n),'list')).toContainEqual(a[1]);
 }
 if(mean){expect(f(rec(mean,739n),1n)).toEqual(qValue(personMean(belief(r))!));expect(uint(f(rec(mean,739n),2n))).toBe(BigInt(personHistory(belief(r)).length));}
 else expect(belief(r)).toBeUndefined();expect(none).toBeUndefined();return {mean,last};
}
function noWrites(r:Run,after=1){
 const learned=report(r,SOCIAL_LEARNING).slice(after);expect(learned.every(a=>a[2]===false&&key(a[3])===key(a[4]))).toBe(true);
 for(const t of trace(r)){const e=rec(f(t,4n),130n),at=f(e,2n);if(key(f(e,5n))===key(SOCIAL_UPDATE)&&typeof at!=='boolean'&&at.kind==='signed'&&at.value>BigInt(after))expect(items(f(t,17n),'list')).toHaveLength(0);}
}
it('long126: original eight-plus-nine history corrects live appraisal and survives exact continuation',async()=>{
 const {b,m,r}=await create('qualified',true),duplicate=await createCharacterRun(m,b.d);
 for(const x of[r,duplicate])await through(x,8n);exact(r,duplicate);learned(r,8,1);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);
 for(const x of[r,duplicate,restored])await through(x,9n);exact(r,duplicate);exact(r,restored);learned(r,9,8,9);probe(r,b.task,9,q(1,1),q(0,1));
 for(const x of[r,duplicate,restored])await through(x,10n);exact(r,duplicate);exact(r,restored);probe(r,b.task,10,q(8,9),q(1,9));
 console.info('M126 LONG prefix8 mean1/support8; contradiction9 mean8/9; live next probe10 failure1/9; exact repeat/restore8');
 while(snap(r).clock<18n){expect(await advance(r)).toBe(true);for(const p of[duplicate,restored]){expect(await advance(p)).toBe(true);exact(r,p);}}
 learned(r,17,8,17);probe(r,b.task,18,q(8,17),q(9,17));
 const control=trialAudit(r,[...Array(8).fill(1),...Array(9).fill(2)]);expect(f(rec(control.last!,739n),1n)).toEqual(q(0,1));
 expect(beliefAppraisal(control.mean,q(1,1))!.confidence).toEqual(q(17,18));
 const updates=trace(r).filter(t=>key(f(rec(f(t,4n),130n),5n))===key(SOCIAL_UPDATE));
 expect(updates).toHaveLength(17);for(const t of updates){const ds=items(f(t,17n),'list').map(v=>rec(v,148n));expect(ds).toHaveLength(1);expect(f(ds[0],6n)).toEqual(PERSON_OWNER);}
 await finish(r,[duplicate,restored]);learned(r,17,8,17);
 console.info('M126 LONG PASS17 distinct supports:1 ->8/9 ->8/17; live failure0 ->1/9 ->9/17; captured LastObservation0/NoLearning unknown; confidence17/18 diagnostic; full queues exact');
},550000);
it('absence126: only fully observed opportunities make non-occurrence evidence',async()=>{
 const qualified=await create(),no=await create('no-opportunity'),censored=await create('censored'),denied=await create('denied'),unknown=await create('unknown');
 for(const x of[qualified,no,censored,denied])await through(x.r,1n);
 for(const x of[no,censored,denied]){bytes(snap(qualified.r).state,snap(x.r).state);bytes(snap(qualified.r).outputs,snap(x.r).outputs);}
 for(const x of[qualified,no,censored,denied,unknown])await through(x.r,7n);
 learned(qualified.r,6,1,6);probe(qualified.r,qualified.b.task,6,q(1,5),q(4,5));probe(qualified.r,qualified.b.task,7,q(1,6),q(5,6));
 trialAudit(qualified.r,[1,2,2,2,2,2]);
 for(const [x,c]of[[no,4],[censored,3],[denied,undefined]] as const){learned(x.r,1,1);probe(x.r,x.b.task,7,q(1,1),q(0,1));noWrites(x.r);trialAudit(x.r,[1,c,c,c,c,c]);}
 expect(belief(unknown.r)).toBeUndefined();trialAudit(unknown.r,[4,4,4,4,4,4]);noWrites(unknown.r,0);
 // Researcher-only failed reductions: counting mere silence predicts1/6 rather than1;
 // looking up fixed false truth predicts0 rather than evidence1; desired-true is not mean1/6.
 expect(personMean(belief(no.r))).not.toEqual({numerator:1n,denominator:6n});
 expect(personMean(belief(no.r))).not.toEqual({numerator:0n,denominator:1n});
 expect(personMean(belief(qualified.r))).not.toEqual({numerator:1n,denominator:1n});
 for(const x of[qualified,no,censored,denied,unknown])await finish(x.r);
 console.info('M126 ABSENCE PASS qualified1/6/support6 versus no-opportunity/censored/denied1/support1; all-uninformative unknown; no-op zero diffs; live appraisal, four original classes/C1 links; full queues');
},550000);
it('privacy126: hidden actual opportunity and outcome cannot alter safe state or outputs',async()=>{
 const a=await create(),b=await create('hidden'),goal=await create('qualified',false,6,true),accurate=await create('accurate');
 const normalized=(data:typeof a.b.d)=>list(items(decode(data.orderedInputs),'list').map(v=>{const x=[...items(v,'list')];if(key(x[2])===key(SOCIAL_SOURCE)){const p=[...items(x[3],'list')],s=[...items(p[1],'list')];s[1]=false;s[7]=false;p[1]=list(s);x[3]=list(p);}return list(x);}));
 expect(normalized(a.b.d)).toEqual(normalized(b.b.d));expect(a.b.s).toEqual(b.b.s);expect(a.b.d).toEqual(goal.b.d);expect(a.b.s).toEqual(accurate.b.s);
 for(let i=0;i<96;i++){const more=await advance(a.r);expect(await advance(b.r)).toBe(more);bytes(snap(a.r).state,snap(b.r).state);bytes(snap(a.r).outputs,snap(b.r).outputs);for(const x of[goal,accurate])expect(await advance(x.r)).toBe(more);expect(belief(goal.r)).toEqual(belief(a.r));if(snap(a.r).clock===1n){learned(a.r,1,1);learned(accurate.r,1,0);}if(snap(a.r).clock===7n){probe(a.r,a.b.task,7,q(1,6),q(5,6));probe(goal.r,goal.b.task,7,q(1,6),q(1,6));probe(accurate.r,accurate.b.task,7,q(0,1),q(1,1));}if(!more){learned(a.r,6,1,6);learned(b.r,6,1,6);console.info('M126 PRIVACY PASS exact safe outputs/state under hidden opportunity+outcome flip; goal-only exact belief with live failure5/6 vs1/6; fixed-false-truth accurate evidence mean0; every settled boundary/full queues');return;}}
 throw Error('privacy queue did not exhaust');
},550000);
it('boundaries126: original classification, version bounds, owner and rollback remain enforced',async()=>{
 for(const opportunity of[false,true])for(const monitored of[false,true])for(const report of[false,true]){
  const safe=list([opportunity,monitored,report]),sample=br(737,[typedIdentifier(1115,u(1)),OBSERVER,PROPOSITIONS[0],signed(1),opportunity,monitored,report]),c=classifyBeliefSample(sample);
  expect(qualifySocialTrial(safe)).toEqual({classification:BigInt(c),claim:c===1?true:c===2?false:undefined});
 }
 expect(qualifySocialTrial(list([]))).toEqual({classification:undefined,claim:undefined});
 expect(()=>socialSetting(list([]))).toThrow('social source shape');
 const b=fixture(),m=await prepareCharacterModel(b.s),old=await prepareCharacterModel(b.legacy);
 await expect(createCharacterRun(old,b.d)).rejects.toThrow('trial requires reference0.93');
 const max=fixture('qualified',false,32);await expect(createCharacterRun(m,max.d)).rejects.toThrow('affect memory presentation capacity including acquisition');await createCharacterRun(m,fixture('qualified',false,31).d);
 await expect(createCharacterRun(m,fixture('qualified',false,33).d)).rejects.toThrow('social source domain');
 const source=items(items(items(decode(b.d.orderedInputs),'list').find(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE))!,'list')[3],'list')[1];
 for(const [i,v]of[[3,u(1)],[4,u(33)],[8,u(1)]] as const){const a=[...items(source,'list')];a[i]=v;expect(()=>socialSetting(list(a))).toThrow();}
 const r=await createCharacterRun(m,b.d);await through(r,1n);const component=await compileCharacterState(await compileCharacterModel(b.s)),legacy=await compileCharacterState(await compileCharacterModel(b.legacy));
 const p=personPath(C,target),entry=personHistory(belief(r))[0],history=(n:number)=>list([text('assembled-social/0.1'),list(Array.from({length:n},(_,i)=>{const o=[...items(entry,'list')];o[0]=typedIdentifier(1115,u(5000+i));o[3]=signed(i+1);o[5]=u(i+1);return list(o);} ))]);
 const changed=(n:number)=>new AuthoritativeState([...state(r).entries().filter(e=>e.path.rootStateTypeId!==810n),{path:p,value:history(n)}]);
 component.stateModel.validateState(changed(32));expect(()=>component.stateModel.validateState(changed(33))).toThrow('history capacity');expect(()=>legacy.stateModel.validateState(changed(9))).toThrow();
 const second=[...items(entry,'list')];second[0]=typedIdentifier(1115,u(999));second[3]=signed(2);second[5]=u(2);
 const patch={operations:[{kind:'set' as const,path:p,expected:{presence:true as const,value:belief(r)!},newValue:list([text('assembled-social/0.1'),list([entry,list(second)])])}]};
 expect(()=>component.stateModel.applyPatch(state(r),patch,EPISODIC_OWNER,{writableRoots:[810n],targetPaths:[p]})).toThrow();
 const initial=restoreAuthoritativeState(decode(b.d.initialState)),injected=new AuthoritativeState([...initial.entries(),{path:p,value:belief(r)!}]);expect(()=>component.initialState(enc(injected.canonicalValue()))).toThrow();
 const fault=await createCharacterRun(m,b.d),before=fault.snapshot(),saved=fault.save(),original=socialModule.personUpdate;let reached=false;
 const spy=vi.spyOn(socialModule,'personUpdate').mockImplementation((...args)=>{original(...args);reached=true;throw Error('M126 after evidence before belief commit');});
 try{await expect(fault.settleNextInstant()).rejects.toThrow('M126 after evidence before belief commit');expect(reached).toBe(true);expect({...fault.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:saved});await through(recovered,1n);exact(r,recovered);
 console.info('M126 BOUNDARIES PASS8 original classifications;32/33 source/history; old version/malformed/wrong owner/learned S0 reject; full instant rollback and exact saved recovery');
},550000);
