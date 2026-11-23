import {compilePredictionModel} from '../campaign2/predictionModel';
import {predictionModelReviewSource} from '../campaign2/predictionModelReview';
import {compileCriterionBase} from '../assembled/criterionSensing';
import {CRITERION_VERSION,LEGACY_PROBE_VERSION,criterionSource,criterionInteger,replaceCriterionField} from '../assembled/criterionSensing';
import {CRITERION_RULES,CRITERION_REGISTRY} from '../assembled/model';
import {fixture as completion} from './fixtures/assembledGoalCompletionCurrent';
import {PROBE_SOURCE_EVENT} from '../campaign2/orderedInputs';
import {it,expect,vi} from 'vitest';
import {start,fixture,names,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,at,sid,type Case,type CanonicalValue} from './fixtures/assembledFalseCriterion';
import {campaign2Record as cr} from '../campaign2/codecs';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {characterEvidenceRefValue} from '../semanticBinding/semanticEvidenceCodecs';
import {STRATEGY_EVAL} from '../assembled/strategy';
import {PRIORITY_MOTIVE} from '../assembled/priority';
import {ACTION_BODY} from '../assembled/actionBody';
import {compileLearningProtection} from '../assembled/learningProtection';
import {safe} from './assembledIntoxicationCohort.test';
import {prepareCharacterModel,restorePreparedCharacterRun,createCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import * as trace from '../substrate/trace';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Exact hashes.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless evidence.
import {deflateSync,inflateSync} from 'node:zlib';
type X=Awaited<ReturnType<typeof start>>;
const file='docs/planning/ASSEMBLED_CHARACTER_M234_EVIDENCE.json',saved=()=>JSON.parse(readFileSync(file,'utf8'));
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')}),unzip=(s:string)=>new Uint8Array(inflateSync(Uint8Array.from(atob(s),c=>c.charCodeAt(0))));
const put=(n:string,v:unknown)=>{const d=existsSync(file)?saved():{};expect(d[n]).toBeUndefined();d[n]=v;writeFileSync(file,JSON.stringify(d,null,2)+'\n');};
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const exact=(a:X['run'],b:X['run'])=>{const as=a.snapshot(),bs=b.snapshot();expect(bs.clock).toBe(as.clock);expect(bs.status).toBe(as.status);for(const k of ['state','outputs','trace']as const)bytes(as[k],bs[k]);bytes(a.save(),b.save());};
const state=(x:X)=>restoreAuthoritativeState(decode(x.run.snapshot().state)),out=(x:X)=>items(decode(x.run.snapshot().outputs),'list');
const records=(xs:readonly CanonicalValue[],n:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n);
const tagged=(xs:readonly CanonicalValue[],tag:string)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const path=(x:X,fieldId=1n)=>({rootStateTypeId:373n,fieldId,selectors:[{kind:'mapKey' as const,key:x.b.task}]}),goal=(x:X)=>state(x).read(path(x)).value!;
const status=(x:X)=>Number(uint(f(rec(goal(x),372n),1n)));
const traces=(x:X)=>items(decode(x.run.snapshot().trace),'list').map(v=>rec(v,160n));
const named=(x:X,name:string,t:bigint)=>traces(x).filter(v=>{const e=rec(f(v,4n),130n);return at(f(e,2n))===t&&key(f(e,5n))===key(sid(1001,name));});
async function runCase(name:Case){
 const x=await start(name),fulfills=['falsePositive','positive'].includes(name),rows:any[]=[];let checkpoint:ReturnType<typeof zip>|undefined,terminalGoal:string|undefined,instruction:string|undefined;
 for(const t of [1,2,3,4,...(name==='silent'?[]:[5]),6,...(name==='silent'?[]:[7]),8]){
  await through(x.run,BigInt(t));const outputs=out(x);
  if(t===1){expect(key(f(rec(f(rec(records(outputs,203n)[0],203n),6n),204n),2n))).toBe(key(q(5,1)));continue;}
  expect(status(x)).toBe(fulfills&&t>=5?2:1);
  const ins=key(state(x).read(path(x,2n)).value!);if(instruction)expect(ins).toBe(instruction);else instruction=ins;
  if(status(x)===2){if(terminalGoal)expect(key(goal(x))).toBe(terminalGoal);else terminalGoal=key(goal(x));}
  if([5,7].includes(t)){
   const truth=rec(records(outputs,334n).find(v=>at(f(rec(v,334n),3n))===BigInt(t))!,334n);expect(at(f(truth,4n))).toBe(BigInt(50+x.b.count));
   const o=rec(records(outputs,203n).find(v=>at(f(rec(v,203n),5n))===BigInt(t))!,203n);expect(key(f(rec(f(o,6n),204n),2n))).toBe(key(q(50+x.b.count+x.b.bias,10)));expect(key(f(o,11n))).toBe(key(text(CRITERION_VERSION)));for(const field of [9n,10n])expect(items(f(o,field),'list')).toHaveLength(0);
   const m1=rec(records(outputs,342n).find(v=>key(f(rec(f(rec(v,342n),2n),337n),2n))===key(o))!,342n);expect(m1).toBeDefined();
   const memory=state(x).entries().filter(e=>e.path.rootStateTypeId===346n&&e.path.fieldId===1n&&typeof e.value!=='boolean'&&e.value.kind==='record'&&e.value.schema.typeId===345n);expect(memory).toHaveLength(t===5?2:3);expect(memory.some(e=>key(f(rec(e.value,345n),1n))===key(m1))).toBe(true);
   const pred=named(x,'event/measurement-prediction-application',BigInt(t));expect(pred).toHaveLength(1);expect(key(f(pred[0],12n))).toBe(key(m1));expect(items(f(pred[0],17n),'list')).toHaveLength(1);
   const settle=named(x,'event/task-measurement-settlement',BigInt(t));expect(settle).toHaveLength(1);expect(key(f(settle[0],12n))).toBe(key(m1));expect(items(f(settle[0],17n),'list')).toHaveLength(fulfills&&t===5?1:0);
   if(fulfills&&t===5){expect(at(f(rec(goal(x),372n),3n))).toBe(5n);expect(key(f(rec(goal(x),372n),2n))).toBe(key(characterEvidenceRefValue({kind:'observation',observationId:uint((f(o,1n) as Extract<CanonicalValue,{kind:'typedIdentifier'}>).payload)})));}
  }
  if([2,3,6,8].includes(t)){
   const d=rec(records(outputs,409n).find(v=>at(f(rec(v,409n),2n))===BigInt(t))!,409n),ds=rec(f(d,4n),419n),chosen=uint(f(ds,1n))===3n?rec(f(ds,2n),420n):undefined,action=chosen?x.b.actions.findIndex(a=>key(a)===key(f(rec(f(chosen,1n),395n),2n))):-1;
   const motives=tagged(outputs,PRIORITY_MOTIVE).find(v=>uint(v[1])===BigInt(t))!,m=items(motives[2],'list').find(v=>key(items(v,'list')[0])===key(x.b.task)),strength=m?items(m,'list')[3]:q(0,1);
   const acts=t===8&&!fulfills;expect(action).toBe(acts?0:-1);
   if(acts){expect(typeof strength!=='boolean'&&strength.kind==='rational'&&strength.numerator>0n).toBe(true);expect(items(f(rec(f(d,3n),408n),3n),'list').length).toBeGreaterThan(0);expect(items(f(chosen!,2n),'list')).toHaveLength(1);expect(key(f(rec(items(f(chosen!,2n),'list')[0],421n),2n))).toBe(key(q(1,1)));}
   if(fulfills&&t>=6){expect(key(strength)).toBe(key(q(0,1)));expect(items(f(rec(f(d,3n),408n),3n),'list')).toHaveLength(0);const read=named(x,'event/deliberation-opportunity',BigInt(t)).flatMap(v=>items(f(v,11n),'list')).map(v=>rec(v,147n)).find(v=>key(f(v,2n))===key(statePathValue(path(x))));expect(key(f(read!,4n))).toBe(key(goal(x)));}
   rows.push({at:t,status:status(x),action,strength:key(strength)});
  }
  if(t===4&&name==='falsePositive')checkpoint=zip(x.run.save());
 }
 const closure=compileLearningProtection(items(decode(x.b.s.registry),'list')[49],decode(x.b.s.registry));
 const protectedState=zip(enc(closure.state(decode(x.run.snapshot().state)))),protectedOutputs=zip(enc(closure.outputs(decode(x.run.snapshot().outputs)))),observer=zip(safe(x.run,items(closure.outputs(decode(x.run.snapshot().outputs)),'list')));
 const adaptation=state(x).entries().filter(e=>e.path.rootStateTypeId===302n).map(e=>({path:key(statePathValue(e.path)),value:key(e.value)}));
 expect(tagged(out(x),ACTION_BODY)).toHaveLength(fulfills?0:1);
 let done=false;for(let n=0;n<48;n++)if(!await x.run.settleNextInstant()){done=true;break;}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);expect(status(x)).toBe(fulfills?2:3);if(terminalGoal)expect(key(goal(x))).toBe(terminalGoal);
 put(name,{rows,adaptation,goal:key(goal(x)),checkpoint,protectedState,protectedOutputs,observer,registry:hash(x.b.s.registry),initial:hash(x.b.d.initialState),inputs:hash(x.b.d.orderedInputs),terminal:hash(x.run.save())});console.info('M234 PASS',name);
}
for(const name of names)it('criterion234 native '+name,()=>runCase(name),230000);

it('criterion234 privacy and admission',async()=>{
 const d=saved();for(const field of ['protectedState','protectedOutputs','observer'])bytes(unzip(d.falsePositive[field].deflate),unzip(d.positive[field].deflate));expect(d.falsePositive.adaptation).not.toEqual(d.positive.adaptation);expect(d.falsePositive.rows).toEqual(d.positive.rows);expect(new Set(names.map(n=>d[n].registry)).size).toBe(1);
 for(const n of [0n,1n,50n,99n,100n])for(const b of [-100n,-2n,0n,2n,100n])expect(criterionInteger(n,b)).toBe(BigInt(Math.min(100,Math.max(0,Number(n+b)))));
 const prior=await compilePredictionModel(predictionModelReviewSource()),receiving=compileCriterionBase(prior.base);
 const observed=records(items(decode(unzip(d.falsePositive.protectedOutputs.deflate)),'list'),203n)[0];expect(observed).toBeDefined();expect(()=>receiving.measurement.validateInput(observed)).not.toThrow();
 expect(()=>prior.base.measurement.validateInput(observed)).toThrow();for(const version of ['unknown',LEGACY_PROBE_VERSION])expect(()=>receiving.measurement.validateInput(replaceCriterionField(observed,11n,text(version)))).toThrow();
 expect(()=>receiving.measurement.validateInput(replaceCriterionField(observed,10n,list([text('private truth')])))).toThrow();
 const x=await start('falsePositive'),original=items(decode(x.b.d.orderedInputs),'list'),probe=original.find(v=>at(items(v,'list')[0])===5n&&key(items(v,'list')[2])===key(PROBE_SOURCE_EVENT))!,a=items(probe,'list'),payload=items(a[3],'list');
 for(const bad of [list([payload[0],payload[1],signed(101)]),list([payload[0],payload[1],signed(-101)]),list([payload[0],payload[1],u(2)]),list([text('unknown'),payload[1],signed(2)]),list([...payload,true])]){
  const rows=original.map(v=>key(v)===key(probe)?list([...a.slice(0,3),bad,a[4]]):v);await expect(createCharacterRun(x.m,{...x.b.d,orderedInputs:enc(list(rows))})).rejects.toThrow();
 }
 expect(()=>criterionSource(list([text(CRITERION_VERSION),list([]),signed(0)]))).toThrow();
 const forged=list([signed(9),u(140),sid(1001,'event/task-measurement-settlement'),list([]),list([])]);await expect(createCharacterRun(x.m,{...x.b.d,orderedInputs:enc(list([...original,forged]))})).rejects.toThrow('original kind');
 const old=completion('main'),oldModel=await prepareCharacterModel(old.s);await expect(createCharacterRun(oldModel,{...x.b.d})).rejects.toThrow();
 const references=Object.fromEntries([231,232,233].map(n=>{const p='docs/planning/ASSEMBLED_CHARACTER_M'+n+'_EVIDENCE.json';return [n,hash(readFileSync(p))];}));
 put('privacyAdmission',{protectedStateOutputsAndView:true,hiddenAdaptationDifferent:true,arithmeticCases:25,invalidSources:7,legacyRejectsSuccessor:true,producerAndSafeReferenceClosure:true,references});
},240000);
it('criterion234 rollback and continuation',async()=>{
 const x=await start('falsePositive');await through(x.run,4n);const save=x.run.save(),old=saved().falsePositive;bytes(save,unzip(old.checkpoint.deflate));
 const restore=async()=>cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save})),bad=await restore(),before=bad.snapshot(),write=trace.traceRecordValue;let hit=false;
 const spy=vi.spyOn(trace,'traceRecordValue').mockImplementation(v=>{if(v.event.dueAt===5n&&key(v.event.eventTypeId)===key(sid(1001,'event/task-measurement-settlement'))&&v.statePatch.operations.some(o=>o.path.rootStateTypeId===373n)){expect(v.structuralMutationDiffs).toHaveLength(1);hit=true;throw Error('M234 after false fulfillment');}return write(v);});
 try{await expect(bad.settleNextInstant()).rejects.toThrow('M234 after false fulfillment');expect(hit).toBe(true);expect(bad.snapshot().clock).toBe(before.clock);for(const k of ['state','outputs','trace']as const)bytes(bad.snapshot()[k],before[k]);expect(()=>bad.save()).toThrow('active quiescent');}finally{spy.mockRestore();}
 const recovered=await restore();exact(x.run,recovered);let done=false;for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();expect(await recovered.settleNextInstant()).toBe(more);expect(recovered.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[5n,8n,101n].includes(x.run.snapshot().clock))exact(x.run,recovered);if(!more){done=true;break;}}expect(done).toBe(true);expect(hash(x.run.save())).toBe(old.terminal);
 const changed=items(decode(x.b.d.orderedInputs),'list').map(v=>{const a=items(v,'list');if(at(a[0])!==5n||key(a[2])!==key(PROBE_SOURCE_EVENT))return v;const p=items(a[3],'list');return list([...a.slice(0,3),list([p[0],p[1],signed(1)]),a[4]]);});
 await expect(restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:enc(list(changed)),save})).rejects.toThrow();
 const edited=enc(replaceCriterionField(rec(decode(save),132n),11n,list([])));await expect(restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:edited})).rejects.toThrow();
 put('rollback',{reached:hit,checkpoint:hash(save),terminal:hash(x.run.save()),failedRunReusable:false,changedSourceAndSaveRejected:true});
},440000);
// Offline comparison only: no normalized value is installed into a run.
function producerProjection(v:CanonicalValue):CanonicalValue{
 if(typeof v==='boolean')return v;
 if(v.kind==='record'){const next={...v,fields:new Map([...v.fields].map(([k,x])=>[k,producerProjection(x)]))};return v.schema.typeId===203n&&key(f(v,11n))===key(text(CRITERION_VERSION))?replaceCriterionField(next,11n,text(LEGACY_PROBE_VERSION)):next;}
 if(v.kind==='list'||v.kind==='set')return {...v,items:v.items.map(producerProjection)};
 if(v.kind==='map')return {...v,entries:v.entries.map(([k,x])=>[producerProjection(k),producerProjection(x)] as const)};
 if(v.kind==='typedIdentifier')return {...v,payload:producerProjection(v.payload)};return v;
}
it('criterion234 truthful legacy control',async()=>{
 const b=completion('main'),oldModel=await prepareCharacterModel(b.s),newModel=await prepareCharacterModel({...b.s,rulesVersion:CRITERION_RULES,registrySchemaVersion:CRITERION_REGISTRY});
 const old=cachedMemory(await createCharacterRun(oldModel,b.d)),current=cachedMemory(await createCharacterRun(newModel,b.d));let done=false,compared=0;
 for(let n=0;n<48;n++){const more=await old.settleNextInstant();expect(await current.settleNextInstant()).toBe(more);expect(current.snapshot().clock).toBe(old.snapshot().clock);if(more){for(const field of ['state','outputs'] as const)bytes(enc(producerProjection(decode(current.snapshot()[field]))),old.snapshot()[field]);compared++;}else{done=true;break;}}
 expect(done).toBe(true);const prior=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M233_EVIDENCE.json','utf8'));expect(hash(old.save())).toBe(prior.main.terminal);
 put('truthfulControl',{oldTerminal:hash(old.save()),newTerminal:hash(current.save()),comparedInstants:compared,stateOutputsEquivalent:true});
},240000);
