import {it,expect,vi} from 'vitest';
import {start,fixture,names,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,target,origin,destination,type Case,type CanonicalValue} from './fixtures/assembledItemCompetence';
import {ITEM_EXECUTION,itemPath,createItemWorld,compileItemWorld,withItemWorldState} from '../assembled/itemWorld';
import {ACTION_BODY,ACTION_BODY_EVENT} from '../assembled/actionBody';
import {OPPORTUNITY_RESULT} from '../assembled/externalObstruction';
import {MOTOR} from '../assembled/sleepControl';
import {SKILL_ACTUAL,SKILL_UPDATE} from '../assembled/skill';
import {CRITERION_VERSION} from '../assembled/criterionSensing';
import {restoreAuthoritativeState,statePathValue,AuthoritativeState} from '../substrate/state';
import {compileLearningProtection} from '../assembled/learningProtection';
import {record} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import {characterEvidenceRefValue} from '../semanticBinding/semanticEvidenceCodecs';
import {restorePreparedCharacterRun,createCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {start as previousStart} from './fixtures/assembledJointCriterion';
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
const file='docs/planning/ASSEMBLED_CHARACTER_M241_EVIDENCE.json',saved=()=>JSON.parse(readFileSync(file,'utf8'));
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
 const x=await start(name),completes=name==='capable'||name==='external',rows:any[]=[];let checkpoint:ReturnType<typeof zip>|undefined,decision3:string|undefined,state4:ReturnType<typeof zip>|undefined;
 for(const t of [1,2,3,4]){
  await through(x.run,BigInt(t));if(t===1)continue;const outputs=out(x),actual=actualAt(outputs,BigInt(t)),acts=t>=3&&name!=='external'&&!(name==='capable'&&t===4);
  const ds=records(outputs,409n).filter(v=>at(f(v,2n))===BigInt(t));expect(ds).toHaveLength(1);expect(uint(f(rec(f(ds[0],4n),419n),1n))===3n).toBe(acts);expect(!!actual).toBe(acts);
  expect(status(x)).toBe(completes&&t>=3?2:1);const truth=completes&&t===3;expect(key(location(x,target))).toBe(key(truth?destination:origin));
  let success=false;
  if(actual){
   expect(uint(f(actual,3n))).toBe(name==='denied'?0n:2n);const report=tagged(outputs,ACTION_BODY).find(a=>key(a[1])===key(f(actual,1n)))!,skill=tagged(outputs,SKILL_ACTUAL).find(a=>key(a[2])===key(f(actual,1n)))!;
   expect(report).toBeDefined();expect(skill).toBeDefined();expect(key(report[3])).toBe(key(x.b.actions[0]));expect(key(skill[3])).toBe(key(q(0,1)));expect(skill[6]).toBe(name!=='denied');expect(skill[7]).toBe(!x.b.incompetent&&name!=='denied');expect(skill[8]).toBe(false);
   const opportunity=tagged(outputs,OPPORTUNITY_RESULT).find(a=>key(a[2])===key(f(actual,1n)));expect(opportunity).toBeDefined();expect(opportunity![5]).toBe(!x.b.obstructed);
   success=name==='capable';expect(key(report[5])).toBe(key(text(success?'Applied':'Blocked')));
   const ts=traces(x),movement=ts.filter(v=>key(f(v,5n))===key(sid(1036,'seam/item-location'))&&at(f(rec(f(v,4n),130n),2n))===BigInt(t)&&key(f(rec(f(v,4n),130n),5n))===key(ACTION_BODY_EVENT));expect(movement).toHaveLength(success?1:0);
   if(success){const m=movement[0],event=rec(f(m,4n),130n);expect(key(f(m,6n))).toBe(key(text(ITEM_EXECUTION)));expect(uint(f(event,3n))).toBe(110n);expect(key(f(event,6n))).toBe(key(actual));expect(key(items(f(m,12n),'list')[0])).toBe(key(list([actual,list(report)])));expect(items(f(m,17n),'list')).toHaveLength(1);
    const parent=items(f(event,8n),'list');expect(parent).toHaveLength(1);expect(ts.some(v=>{const e=rec(f(v,4n),130n);return key(f(e,1n))===key(parent[0])&&key(f(e,5n))===key(sid(1001,'event/protocol-execution'))&&key(f(v,13n))===key(actual);})).toBe(true);
    const moveIndex=ts.findIndex(v=>key(v)===key(m)),probeIndex=ts.findIndex(v=>{const e=rec(f(v,4n),130n);return at(f(e,2n))===BigInt(t)&&key(f(e,5n))===key(sid(1001,'event/regulatory-diagnostic-probe'));});expect(probeIndex).toBeGreaterThan(moveIndex);
   }
  }
  const os=records(outputs,203n).filter(v=>at(f(v,5n))===BigInt(t)&&key(f(v,11n))===key(text(CRITERION_VERSION))),observed=t===3&&!x.b.hidden;expect(os).toHaveLength(observed?1:0);
  if(observed){const o=os[0];expect(key(f(rec(f(o,6n),204n),2n))).toBe(key(q(truth?1:0,1)));const ts=named(x,'event/task-measurement-settlement',3n);expect(ts).toHaveLength(1);const m1=rec(f(ts[0],12n),342n);expect(key(f(rec(f(m1,2n),337n),2n))).toBe(key(o));
   if(completes){expect(at(f(rec(goal(x),372n),3n))).toBe(3n);expect(key(f(rec(goal(x),372n),2n))).toBe(key(characterEvidenceRefValue({kind:'observation',observationId:uint((f(o,1n) as Extract<CanonicalValue,{kind:'typedIdentifier'}>).payload)})));}
  }
  if(t===4&&completes){const reads=named(x,'event/deliberation-opportunity',4n).flatMap(r=>items(f(r,11n),'list')).map(v=>rec(v,147n));expect(reads.some(r=>key(f(r,2n))===key(statePathValue(path(x)))&&key(f(r,4n))===key(goal(x)))).toBe(true);}
  expect(worldHandles(list(outputs))).toBe(false);rows.push({at:t,status:status(x),acts,success,truth,criterion:observed?truth:null});if(t===2&&name==='capable')checkpoint=zip(x.run.save());if(t===3)decision3=key(ds[0]);if(t===4)state4=zip(x.run.snapshot().state);
 }
 expect(traces(x).flatMap(r=>items(f(r,14n),'list'))).toHaveLength(0);let done=false;for(let n=0;n<48;n++)if(!await x.run.settleNextInstant()){done=true;break;}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);expect(status(x)).toBe(completes?2:3);
 put(name,{rows,decision3,checkpoint,state4,initial:hash(x.b.d.initialState),registry:hash(x.b.s.registry),inputs:hash(x.b.d.orderedInputs),terminal:hash(x.run.save()),state:zip(x.run.snapshot().state),outputs:zip(x.run.snapshot().outputs),trace:zip(x.run.snapshot().trace),noDraws:true});
}
for(const name of names)it('goal241 native '+name,()=>runCase(name),240000);

it('goal241 original correspondence privacy and boundaries',async()=>{
 const d=saved(),originals:any={},mapping={capable:'fulfilled',hiddenIncompetent:'hiddenCause',hiddenObstructed:'retained'} as const,model=await prepareGoalStrategyModel(goalStrategyRecipe());
 for(const name of names)expect(d[name].initial).toBe(d.capable.initial);
 for(const name of names.filter(n=>n!=='external'))expect(d[name].decision3).toBe(d.capable.decision3);
 for(const [native,name]of Object.entries(mapping)){
  const input=ordered(cases()[name]),run=await createGoalStrategyRun(model,{initialState,orderedInputs:input,runSeed:seed}),rows:any[]=[];
  for(let frame=1;frame<=3;frame++){expect(await run.settleNextInstant()).toBe(true);const outputs=items(decodeGoalStrategy(run.snapshot().outputs),'list'),g=rec(items(f(records(outputs,1004n).at(-1)!,3n),'list')[0],993n),evaluation=records(outputs,1001n).at(-1)!,actual=records(outputs,1003n).at(-1)!,criterion=records(outputs,998n).find(v=>at(f(v,3n))===BigInt(frame)&&uint(f(v,4n))===4n);
   expect(uint(f(evaluation,6n))).toBe(d[native].rows[frame-1].acts?1n:0n);
   const row={at:frame+1,status:Number(uint(f(g,2n))),acts:uint(f(evaluation,6n))>0n,success:f(actual,4n)===true,truth:f(actual,5n)===true,criterion:criterion?f(criterion,5n)===true:null};expect(row).toEqual(d[native].rows[frame-1]);rows.push(row);
  }expect(await run.settleNextInstant()).toBe(false);originals[name]={rows,inputs:hash(input),save:zip(run.save()),trace:zip(run.snapshot().trace)};
 }
 bytes(unzip(d.hiddenIncompetent.state4.deflate),unzip(d.hiddenObstructed.state4.deflate));bytes(unzip(d.hiddenIncompetent.state.deflate),unzip(d.hiddenObstructed.state.deflate));
 // Preserve the existing M217/M235 observer projection, with production closure.
 const privateTags=new Set([MOTOR,'assembled-tolerance-effect/0.1','assembled-reward-experience/0.1/physical',ACTION_BODY,'assembled-action-body-receipt/0.1',SKILL_ACTUAL,SKILL_UPDATE,OPPORTUNITY_RESULT,'external-obstruction-result/0.1','assembled-regulatory-stress/0.1/applied']);
 const observed=(name:Case)=>{const b=fixture(name),registry=decode(b.s.registry),closure=compileLearningProtection(items(registry,'list')[49],registry);return enc(list(items(closure.outputs(decode(unzip(d[name].outputs.deflate))),'list').filter(v=>!(typeof v!=='boolean'&&v.kind==='list'&&typeof v.items[0]!=='boolean'&&v.items[0]?.kind==='text'&&privateTags.has(v.items[0].value))&&!(typeof v!=='boolean'&&v.kind==='record'&&[433n,454n,457n].includes(v.schema.typeId)))));};
 bytes(observed('hiddenIncompetent'),observed('hiddenObstructed'));
 const x=await start('capable'),outputs=items(decode(unzip(d.capable.outputs.deflate)),'list'),actual=actualAt(outputs,3n)!,assessment=list(tagged(outputs,ACTION_BODY).find(a=>key(a[1])===key(f(actual,1n)))!),a=items(assessment,'list'),world=compileItemWorld(items(decode(x.b.s.registry),'list')[59],x.b.actions,[x.b.task]),initial=restoreAuthoritativeState(decode(x.b.d.initialState));
 const base={validateState(){},validatePath(){},read:(s:AuthoritativeState,p:any)=>s.read(p),applyPatch(){throw Error('unused base');}} as any,owned=withItemWorldState(base,world),event={eventId:40n,eventSequence:40n,dueAt:simInstant(3n),phase:110n,eventTypeId:ACTION_BODY_EVENT,payload:actual,dependencies:list([]),causalParentEventIds:[39n]},handler=createItemWorld(world,C,owned,[],C,C,true);handler.begin(3n);
 for(const report of [list([...a.slice(0,1),sid(1120,'foreign'),...a.slice(2)]),list([...a.slice(0,3),sid(1027,'foreign'),...a.slice(4)]),list([...a.slice(0,5),text('Withheld'),a[6]]),list([...a.slice(0,5),text('invented'),a[6]])])expect(()=>handler.effect(event,initial,[report])).toThrow('item location');
 expect(()=>handler.effect(event,initial,[])).toThrow('assessment');expect(()=>handler.effect({...event,phase:120n},initial,[assessment])).toThrow('origin');
 const zero=record(actual.schema,new Map([...actual.fields].map(([k,v])=>[k,k===3n?u(0):v])));expect(()=>handler.effect({...event,payload:zero},initial,[assessment])).toThrow('disposition');
 const placed=handler.effect(event,initial,[assessment]);expect(placed).toBeDefined();expect(key(placed!.nextState.read(itemPath(target)).value!)).toBe(key(destination));expect(()=>handler.effect(event,initial,[assessment])).toThrow('duplicate');handler.close();
 const denied=createItemWorld(world,C,owned,[],C,C,true);denied.begin(3n);expect(denied.effect(event,initial,[list([...a.slice(0,5),text('Blocked'),a[6]])])).toBeUndefined();expect(()=>denied.execution(event,initial,actual)).toThrow('legacy');denied.close();
 const legacy=createItemWorld(world,C,owned,[],C,C);legacy.begin(3n);expect(()=>legacy.effect(event,initial,[assessment])).toThrow('version');legacy.close();
 const originalRows=items(decode(x.b.d.orderedInputs),'list');const forged=list([signed(6),u(110),ACTION_BODY_EVENT,actual,list([])]);await expect(createCharacterRun(x.m,{...x.b.d,orderedInputs:enc(list([...originalRows,forged]))})).rejects.toThrow('unknown record schema');
 const internal=list([signed(6),u(110),ACTION_BODY_EVENT,list([]),list([])]);await expect(createCharacterRun(x.m,{...x.b.d,orderedInputs:enc(list([...originalRows,internal]))})).rejects.toThrow('original kind');
 put('correspondence',{originals,firstChoiceEqual:true,initialEqual:true,hiddenStateExact:true,permittedOutputsExact:true,associationAndDuplicateGuards:true,internalSourceRejected:true});
},240000);
it('goal241 rollback repeat and continuation',async()=>{
 const x=await start('capable');await through(x.run,2n);const save=x.run.save(),old=saved().capable;bytes(save,unzip(old.checkpoint.deflate));const restore=async()=>cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save})),bad=await restore(),before=bad.snapshot(),original=trace.traceRecordValue;let hit=false;
 const spy=vi.spyOn(trace,'traceRecordValue').mockImplementation(v=>{if(v.event.dueAt===3n&&key(v.seamId)===key(sid(1036,'seam/item-location'))&&v.statePatch.operations.length){hit=true;throw Error('M241 after assessed item move');}return original(v);});
 try{await expect(bad.settleNextInstant()).rejects.toThrow('M241 after assessed item move');expect(hit).toBe(true);expect(bad.snapshot().clock).toBe(before.clock);for(const k of ['state','outputs','trace']as const)bytes(bad.snapshot()[k],before[k]);expect(()=>bad.save()).toThrow('active quiescent');}finally{spy.mockRestore();}
 const recovered=await restore();exact(x.run,recovered);let done=false;for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();expect(await recovered.settleNextInstant()).toBe(more);expect(recovered.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[3n,4n,101n].includes(x.run.snapshot().clock))exact(x.run,recovered);if(!more){done=true;break;}}
 expect(done).toBe(true);expect(hash(x.run.save())).toBe(old.terminal);put('continuation',{hit,checkpoint:hash(save),terminal:hash(x.run.save()),fullBytes:true});
},400000);
it('goal241 retained version and former competence gap',async()=>{
 const prior=await previousStart('matched');let done=false;for(let n=0;n<48;n++)if(!await prior.run.settleNextInstant()){done=true;break;}expect(done).toBe(true);const old=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M240_EVIDENCE.json','utf8')).matched;expect(hash(prior.run.save())).toBe(old.terminal);
 const x=await start('incompetent',true);await through(x.run,3n);const outputs=out(x),actual=actualAt(outputs,3n)!;expect(uint(f(actual,3n))).toBe(2n);const report=tagged(outputs,ACTION_BODY).find(a=>key(a[1])===key(f(actual,1n)))!;expect(key(report[5])).toBe(key(text('Blocked')));expect(key(location(x,target))).toBe(key(destination));expect(status(x)).toBe(2);
 put('oldVersion',{terminal:hash(prior.run.save()),exact:true,legacyGap:{physicalReport:key(list(report)),status:status(x),location:key(location(x,target)),state:zip(x.run.snapshot().state),outputs:zip(x.run.snapshot().outputs),trace:zip(x.run.snapshot().trace)},interpretation:'The old version moved on contact despite physical failure; retained as a versioned integration defect, not current acceptance.'});
},260000);
