import {it,expect,vi} from 'vitest';
import {start,fixture,names,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,target,origin,destination,type Case,type CanonicalValue} from './fixtures/assembledJointCriterion';
import {itemPath} from '../assembled/itemWorld';
import {CRITERION_VERSION} from '../assembled/criterionSensing';
import {POST_ITEM_PROBE} from '../assembled/itemProbe';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {characterEvidenceRefValue} from '../semanticBinding/semanticEvidenceCodecs';
import {restorePreparedCharacterRun,createCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {start as previousStart} from './fixtures/assembledItemAttainment';
import {PROBE_SOURCE_EVENT,DELIBERATION_EVENT} from '../campaign2/orderedInputs';
import {prepareGoalStrategyModel,createGoalStrategyRun} from '../campaign3/goalStrategyFactory';
import {goalStrategyRecipe} from '../campaign3/goalStrategyModel';
import {decodeGoalStrategy} from '../campaign3/goalStrategyCodecs';
import {cases,ordered,initialState,seed} from './goalStrategyFixtures';
import * as trace from '../substrate/trace';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Exact hashes.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless evidence.
import {deflateSync,inflateSync} from 'node:zlib';
type X=Awaited<ReturnType<typeof start>>;
const file='docs/planning/ASSEMBLED_CHARACTER_M240_EVIDENCE.json',saved=()=>JSON.parse(readFileSync(file,'utf8'));
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')}),unzip=(s:string)=>new Uint8Array(inflateSync(Uint8Array.from(atob(s),c=>c.charCodeAt(0))));
const put=(n:string,v:unknown)=>{const d=existsSync(file)?saved():{};expect(d[n]).toBeUndefined();d[n]=v;writeFileSync(file,JSON.stringify(d,null,2)+'\n');};
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const exact=(a:X['run'],b:X['run'])=>{const as=a.snapshot(),bs=b.snapshot();expect(bs.clock).toBe(as.clock);expect(bs.status).toBe(as.status);for(const k of ['state','outputs','trace']as const)bytes(as[k],bs[k]);bytes(a.save(),b.save());};
const state=(x:X)=>restoreAuthoritativeState(decode(x.run.snapshot().state)),out=(x:X)=>items(decode(x.run.snapshot().outputs),'list');
const records=(xs:readonly CanonicalValue[],n:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n).map(v=>rec(v,n));
const tagged=(xs:readonly CanonicalValue[],tag:string)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const path=(x:X,fieldId=1n)=>({rootStateTypeId:373n,fieldId,selectors:[{kind:'mapKey' as const,key:x.b.task}]}),goal=(x:X)=>state(x).read(path(x)).value!;
const status=(x:X)=>Number(uint(f(rec(goal(x),372n),1n)));
const traces=(x:X)=>items(decode(x.run.snapshot().trace),'list').map(v=>rec(v,160n));
const named=(x:X,name:string,t:bigint)=>traces(x).filter(v=>{const e=rec(f(v,4n),130n);return at(f(e,2n))===t&&key(f(e,5n))===key(sid(1001,name));});

const actualAt=(outputs:readonly CanonicalValue[],t:bigint)=>records(outputs,433n).map(v=>rec(v,433n)).find(v=>{const attempt=rec(f(v,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n);return at(f(rec(f(intent,2n),409n),2n))===t;});
const location=(x:X,item:CanonicalValue)=>state(x).read(itemPath(item)).value!;
function worldHandles(v:CanonicalValue):boolean {if(typeof v==='boolean')return false;if(v.kind==='typedIdentifier')return [1601n,1602n].includes(v.namespaceId)||worldHandles(v.payload);if(v.kind==='list'||v.kind==='set')return v.items.some(worldHandles);if(v.kind==='record')return [...v.fields.values()].some(worldHandles);return false;}

async function runCase(name:Case){
 const x=await start(name),completes=['matched','external','falseCriterion'].includes(name),action=['matched','blocked'].includes(name),rows:any[]=[];let checkpoint:ReturnType<typeof zip>|undefined;
 for(const t of [1,2,3,4]){
  await through(x.run,BigInt(t));const outputs=out(x);if(t===1)continue;
  expect(status(x)).toBe(completes&&t>=3?2:1);
  const ds=records(outputs,409n).filter(v=>at(f(v,2n))===BigInt(t));expect(ds).toHaveLength(1);
  const result=rec(f(ds[0],4n),419n),chosen=uint(f(result,1n))===3n,acts=action&&t>=3&&!(completes&&t===4);expect(chosen).toBe(acts);
  const actual=actualAt(outputs,BigInt(t));expect(!!actual).toBe(acts);
  if(actual)expect(uint(f(actual,3n))).toBe(name==='blocked'?0n:2n);
  const truth=t===(name==='adoptionCriterion'?2:3)&&['matched','external','externalHidden','adoptionCriterion'].includes(name);
  expect(key(location(x,target))).toBe(key(truth?destination:origin));
  const observations=records(outputs,203n).filter(v=>at(f(v,5n))===BigInt(t)&&key(f(v,11n))===key(text(CRITERION_VERSION)));
  const observed=t===(name==='adoptionCriterion'?2:3)&&!['externalHidden','absentExternal'].includes(name);
  expect(observations).toHaveLength(observed?1:0);
  if(observed){
   const o=observations[0],positive=truth||name==='falseCriterion';expect(key(f(rec(f(o,6n),204n),2n))).toBe(key(q(positive?1:0,1)));
   const probe=named(x,'event/regulatory-diagnostic-probe',BigInt(t));expect(probe).toHaveLength(1);expect(uint(f(rec(f(probe[0],4n),130n),3n))).toBe(120n);expect(key(f(probe[0],6n))).toBe(key(text(POST_ITEM_PROBE)));
   const read=rec(items(f(probe[0],11n),'list')[0],147n);expect(key(f(read,2n))).toBe(key(statePathValue(itemPath(target))));expect(key(f(read,4n))).toBe(key(truth?destination:origin));
   const m1=records(outputs,342n).find(v=>key(f(rec(f(v,2n),337n),2n))===key(o));expect(m1).toBeDefined();
   expect(state(x).entries().some(e=>e.path.rootStateTypeId===346n&&e.path.fieldId===1n&&typeof e.value!=='boolean'&&e.value.kind==='record'&&e.value.schema.typeId===345n&&key(f(rec(e.value,345n),1n))===key(m1!))).toBe(true);
   for(const event of ['event/measurement-prediction-application','event/task-measurement-settlement']){const ts=named(x,event,BigInt(t));expect(ts).toHaveLength(1);expect(key(f(ts[0],12n))).toBe(key(m1!));expect(uint(f(rec(f(ts[0],4n),130n),3n))).toBe(140n);}
   if(completes){expect(key(f(rec(goal(x),372n),2n))).toBe(key(characterEvidenceRefValue({kind:'observation',observationId:uint((f(o,1n) as Extract<CanonicalValue,{kind:'typedIdentifier'}>).payload)})));expect(at(f(rec(goal(x),372n),3n))).toBe(3n);}
   if(name==='adoptionCriterion')expect(items(f(named(x,'event/task-measurement-settlement',2n)[0],17n),'list')).toHaveLength(0);
  }
  if(t===3&&name==='matched'){
   const all=traces(x),movement=all.findIndex(v=>key(f(v,5n))===key(sid(1036,'seam/item-location'))&&at(f(rec(f(v,4n),130n),2n))===3n);
   // Trace records are decoded afresh by named(); compare canonical event IDs.
   const probeEvent=f(rec(f(named(x,'event/regulatory-diagnostic-probe',3n)[0],4n),130n),1n),probeIndex=all.findIndex(v=>key(f(rec(f(v,4n),130n),1n))===key(probeEvent));expect(movement).toBeGreaterThanOrEqual(0);expect(probeIndex).toBeGreaterThan(movement);expect(uint(f(rec(f(all[movement],4n),130n),3n))).toBe(110n);
   expect(named(x,'event/task-identity-application',3n).filter(v=>key(f(v,5n))===key(sid(1036,'seam/assembled-identity-eligibility')))).toHaveLength(1);
  }
  if(completes&&t===4){const consumed=named(x,'event/deliberation-opportunity',4n).flatMap(r=>items(f(r,11n),'list')).map(v=>rec(v,147n)).find(r=>key(f(r,2n))===key(statePathValue(path(x))));expect(consumed).toBeDefined();expect(key(f(consumed!,4n))).toBe(key(goal(x)));}
  expect(worldHandles(list(outputs))).toBe(false);
  rows.push({at:t,status:status(x),acts:chosen,truth,criterion:observed?(truth||name==='falseCriterion'):null});
  if(t===2&&name==='matched')checkpoint=zip(x.run.save());
 }
 expect(traces(x).flatMap(r=>items(f(r,14n),'list'))).toHaveLength(0);
 let done=false;for(let n=0;n<48;n++)if(!await x.run.settleNextInstant()){done=true;break;}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);expect(status(x)).toBe(completes?2:3);
 put(name,{rows,checkpoint,terminal:hash(x.run.save()),initial:hash(x.b.d.initialState),registry:hash(x.b.s.registry),inputs:hash(x.b.d.orderedInputs),trace:zip(x.run.snapshot().trace),outputs:zip(x.run.snapshot().outputs),state:zip(x.run.snapshot().state),noDraws:true});
}
for(const name of names)it('goal240 native '+name,()=>runCase(name),240000);

it('goal240 original correspondence and source boundaries',async()=>{
 const d=saved(),mapping={matched:'fulfilled',external:'external',externalHidden:'hiddenExternal',absentExternal:'absentExternal',falseCriterion:'falseCriterion',adoptionCriterion:'adoptionCriterion'} as const,originals:any={};
 for(const name of names)expect(d[name].initial).toBe(d.matched.initial);
 const model=await prepareGoalStrategyModel(goalStrategyRecipe());
 for(const [native,name] of Object.entries(mapping)){
  const input=ordered(cases()[name]),run=await createGoalStrategyRun(model,{initialState,orderedInputs:input,runSeed:seed}),rows:any[]=[];
  for(let frame=1;frame<=3;frame++){
   expect(await run.settleNextInstant()).toBe(true);const outputs=items(decodeGoalStrategy(run.snapshot().outputs),'list'),goals=records(outputs,1004n),goal=rec(items(f(goals.at(-1)!,3n),'list')[0],993n),evaluation=records(outputs,1001n).at(-1)!,actual=records(outputs,1003n).at(-1)!;
   const criterion=records(outputs,998n).find(v=>at(f(v,3n))===BigInt(frame)&&uint(f(v,4n))===4n);
   const row={at:frame+1,status:Number(uint(f(goal,2n))),acts:uint(f(evaluation,6n))>0n,truth:f(actual,5n)===true,criterion:criterion?f(criterion,5n)===true:null};
   expect(row).toEqual(d[native].rows[frame-1]);rows.push(row);
  }
  expect(await run.settleNextInstant()).toBe(false);originals[name]={rows,inputs:hash(input),save:zip(run.save()),trace:zip(run.snapshot().trace)};
 }
 const hidden=d.externalHidden.rows.map(({truth,...r}:any)=>r),absent=d.absentExternal.rows.map(({truth,...r}:any)=>r);expect(hidden).toEqual(absent);
 // The extra physical source inputs shift generated event IDs by two. Only the
 // three stress packets carry those IDs in outputs; authenticate each reference
 // against its actual appraisal trace before comparing semantic event addresses.
 const sourceEventMapping:any[]=[];
 function normalizedHidden(name:'externalHidden'|'absentExternal'){
  const outputs=items(decode(unzip(d[name].outputs.deflate)),'list'),traces=items(decode(unzip(d[name].trace.deflate)),'list').map(v=>rec(v,160n));let count=0;
  const contains=(v:CanonicalValue,w:CanonicalValue):boolean=>key(v)===key(w)||typeof v!=='boolean'&&v.kind==='list'&&v.items.some(x=>contains(x,w));
  const normalized=outputs.map(v=>{if(typeof v==='boolean'||v.kind!=='list'||key(v.items[0])!==key(text('assembled-regulatory-stress/0.1/applied')))return v;
   const a=items(v,'list'),p=items(a[2],'list'),sources=traces.filter(t=>key(f(rec(f(t,4n),130n),1n))===key(p[3]));expect(sources.length).toBeGreaterThan(0);expect(new Set(sources.map(t=>key(f(t,4n)))).size).toBe(1);
   const event=rec(f(sources[0],4n),130n);expect(at(f(event,2n))).toBe(at(p[2]));expect(uint(f(event,3n))).toBe(50n);expect(key(f(event,5n))).toBe(key(sid(1001,'event/task-appraisal')));expect(sources.some(t=>contains(f(t,13n),p[4]))).toBe(true);
   const address=list([f(event,2n),f(event,3n),f(event,5n)]);sourceEventMapping.push({arm:name,event:String(uint(p[3])),at:String(at(p[2])),address:key(address)});count++;
   return list([...a.slice(0,2),list([...p.slice(0,3),address,...p.slice(4)]),...a.slice(3)]);
  });expect(count).toBe(3);return enc(list(normalized));
 }
 bytes(normalizedHidden('externalHidden'),normalizedHidden('absentExternal'));
 bytes(unzip(d.externalHidden.state.deflate),unzip(d.absentExternal.state.deflate));
 const x=await start('matched'),rows=items(decode(x.b.d.orderedInputs),'list'),probe=rows.find(v=>key(items(v,'list')[2])===key(PROBE_SOURCE_EVENT))!,deliberation=rows.find(v=>key(items(v,'list')[2])===key(DELIBERATION_EVENT))!;
 for(const duplicate of [probe,deliberation])await expect(createCharacterRun(x.m,{...x.b.d,orderedInputs:enc(list([...rows,duplicate]))})).rejects.toThrow('duplicate source kind/instant');
 const wrong=rows.map(v=>v===probe?list([items(v,'list')[0],u(110),...items(v,'list').slice(2)]):v);await expect(createCharacterRun(x.m,{...x.b.d,orderedInputs:enc(list(wrong))})).rejects.toThrow('time/phase domain');
 const old=await previousStart('matched');await expect(createCharacterRun(old.m,x.b.d)).rejects.toThrow('time/phase domain');
 const oldRows=rows.map(v=>key(items(v,'list')[2])===key(PROBE_SOURCE_EVENT)?list([items(v,'list')[0],u(110),...items(v,'list').slice(2)]):v);await expect(createCharacterRun(old.m,{...x.b.d,orderedInputs:enc(list(oldRows))})).rejects.toThrow('duplicate source kind/instant');
 put('correspondence',{originals,sourceEventMapping,hiddenTerminalStateExact:true,equalHiddenEvidence:true,duplicateKindRejected:true,versionBoundary:true,scope:'Goal lifecycle, action presence, physical criterion and perceived criterion at all three original instants; not whole-character equivalence. Bootstrap1, concrete relocations and deadlines are explicit native additions.'});
},240000);
it('goal240 rollback repeat and continuation',async()=>{
 const x=await start('matched');await through(x.run,2n);const save=x.run.save(),old=saved().matched;bytes(save,unzip(old.checkpoint.deflate));
 const restore=async()=>cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));
 const faults=[];
 for(const event of ['event/task-identity-application','event/task-measurement-settlement']){
  const bad=await restore(),before=bad.snapshot(),original=trace.traceRecordValue;let hit=false;
  const spy=vi.spyOn(trace,'traceRecordValue').mockImplementation(v=>{if(v.event.dueAt===3n&&key(v.event.eventTypeId)===key(sid(1001,event))){hit=true;throw Error('M240 joint fault '+event);}return original(v);});
  try{await expect(bad.settleNextInstant()).rejects.toThrow('M240 joint fault');expect(hit).toBe(true);expect(bad.snapshot().clock).toBe(before.clock);for(const k of ['state','outputs','trace']as const)bytes(bad.snapshot()[k],before[k]);expect(()=>bad.save()).toThrow('active quiescent');}finally{spy.mockRestore();}faults.push(event);
 }
 const recovered=await restore();exact(x.run,recovered);let done=false;
 for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();expect(await recovered.settleNextInstant()).toBe(more);expect(recovered.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[3n,4n,101n].includes(x.run.snapshot().clock))exact(x.run,recovered);if(!more){done=true;break;}}
 expect(done).toBe(true);expect(hash(x.run.save())).toBe(old.terminal);put('continuation',{faults,checkpoint:hash(save),terminal:hash(x.run.save()),fullBytes:true});
},400000);
it('goal240 retained 0.152 witness',async()=>{const x=await previousStart('matched');let done=false;for(let n=0;n<48;n++)if(!await x.run.settleNextInstant()){done=true;break;}expect(done).toBe(true);const old=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M239_EVIDENCE.json','utf8')).matched;expect(hash(x.run.save())).toBe(old.terminal);put('oldVersion',{terminal:hash(x.run.save()),exact:true});},200000);
