import {it,expect} from 'vitest';
import {start,fixture,names,through,rec,f,uint,items,key,decode,enc,list,text,q,C,at,sid,target,destination,type Case,type CanonicalValue} from './fixtures/assembledGoalRouteReplay';
import {itemPath} from '../assembled/itemWorld';
import {ACTION_BODY} from '../assembled/actionBody';
import {OPPORTUNITY_RESULT} from '../assembled/externalObstruction';
import {MOTOR} from '../assembled/sleepControl';
import {SKILL_ACTUAL,SKILL_UPDATE} from '../assembled/skill';
import {CRITERION_VERSION} from '../assembled/criterionSensing';
import {restoreAuthoritativeState,AuthoritativeState} from '../substrate/state';
import {compileLearningProtection} from '../assembled/learningProtection';
import {restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {prepareGoalStrategyModel,createGoalStrategyRun} from '../campaign3/goalStrategyFactory';
import {goalStrategyRecipe} from '../campaign3/goalStrategyModel';
import {decodeGoalStrategy} from '../campaign3/goalStrategyCodecs';
import {cases,ordered,initialState,seed} from './goalStrategyFixtures';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Exact hashes.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless evidence.
import {deflateSync,inflateSync} from 'node:zlib';
type X=Awaited<ReturnType<typeof start>>;
const file='docs/planning/ASSEMBLED_CHARACTER_M242_EVIDENCE.json',saved=()=>JSON.parse(readFileSync(file,'utf8'));
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')}),unzip=(s:string)=>new Uint8Array(inflateSync(Uint8Array.from(atob(s),c=>c.charCodeAt(0))));
const put=(n:string,v:unknown)=>{const d=existsSync(file)?saved():{};expect(d[n]).toBeUndefined();d[n]=v;writeFileSync(file,JSON.stringify(d,null,2)+'\n');};
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const exact=(a:X['run'],b:X['run'])=>{const as=a.snapshot(),bs=b.snapshot();expect(bs.clock).toBe(as.clock);expect(bs.status).toBe(as.status);for(const k of ['state','outputs','trace']as const)bytes(as[k],bs[k]);bytes(a.save(),b.save());};
const state=(x:X)=>restoreAuthoritativeState(decode(x.run.snapshot().state)),out=(x:X)=>items(decode(x.run.snapshot().outputs),'list');
const records=(xs:readonly CanonicalValue[],n:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n).map(v=>rec(v,n));
const tagged=(xs:readonly CanonicalValue[],tag:string)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const path=(x:X,fieldId=1n)=>({rootStateTypeId:373n,fieldId,selectors:[{kind:'mapKey' as const,key:x.b.task}]}),goal=(x:X)=>state(x).read(path(x)).value!;
const traces=(x:X)=>items(decode(x.run.snapshot().trace),'list').map(v=>rec(v,160n));

const actualAt=(outputs:readonly CanonicalValue[],t:bigint)=>records(outputs,433n).map(v=>rec(v,433n)).find(v=>{const attempt=rec(f(v,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n);return at(f(rec(f(intent,2n),409n),2n))===t;});
const location=(x:X,item:CanonicalValue)=>state(x).read(itemPath(item)).value!;
function worldHandles(v:CanonicalValue):boolean {if(typeof v==='boolean')return false;if(v.kind==='typedIdentifier')return [1601n,1602n].includes(v.namespaceId)||worldHandles(v.payload);if(v.kind==='list'||v.kind==='set')return v.items.some(worldHandles);if(v.kind==='record')return [...v.fields.values()].some(worldHandles);return false;}


import {STRATEGY_EVAL,knowledgePath,planPath} from '../assembled/strategy';
import {PRIORITY_MOTIVE} from '../assembled/priority';
import {PERFORMANCE_OBS,outcomePath} from '../assembled/performance';
import {evaluateGoalStrategy,type RouteObservation,type Candidate} from '../campaign3/goalStrategyComponent';
const contains=(v:CanonicalValue,w:CanonicalValue):boolean=>key(v)===key(w)||typeof v!=='boolean'&&(v.kind==='list'||v.kind==='set'?v.items.some(x=>contains(x,w)):v.kind==='record'?[...v.fields.values()].some(x=>contains(x,w)):false);
const candidates:Candidate[]=['SeparateGoalPlan','GoalEqualsPlan','FixedRoute','FailureAbandonsGoal'];
const routeName=(n:number)=>n===0?'route-a' as const:n===1?'route-b' as const:null;
async function runCase(name:Case){
 const x=await start(name),originalInput=ordered(cases()[name]),original=await createGoalStrategyRun(await prepareGoalStrategyModel(goalStrategyRecipe()),{initialState,orderedInputs:originalInput,runSeed:seed});
 const rows:any[]=[],controls:any[]=[];let checkpoint:ReturnType<typeof zip>|undefined,stable:string|undefined;
 try{
 await through(x.run,1n);
 for(let t=2;t<=x.b.last;t++){
  const before=state(x),priorGoal=before.read(path(x)).value,known=before.read(knowledgePath(C)).value,priorPlan=before.read(planPath(x.b.task)).value,journal=before.read(outcomePath(x.b.task)).value;
  const observations:RouteObservation[]=known?items(items(known,'list')[1],'list').map(v=>{const a=items(v,'list');return {receipt:Number(uint(a[5])),goal:'goal/delivery',route:routeName(Number(uint(a[4])))!,available:a[6]===true,observedAt:Number(uint(a[7]))-1,validUntil:Number(uint(a[8]))-1};}):[];
  const previous=priorPlan?Number(uint(items(priorPlan,'list')[1])):2,history=journal?items(items(journal,'list')[1],'list'):[];
  const input={goal:priorGoal?{id:'goal/delivery' as const,desired:'item-at-destination' as const,status:uint(f(rec(priorGoal,372n),1n))===1n?'Active' as const:'Fulfilled' as const}:null,priorRoute:routeName(previous),at:t-1,observations,perceivedFailure:history.length>0&&items(history.at(-1)!,'list')[6]===false};
  const local=candidates.map(c=>({candidate:c,result:evaluateGoalStrategy(input,c)}));
  await through(x.run,BigInt(t));expect(await original.settleNextInstant()).toBe(true);
  const outputs=out(x),originalOutputs=items(decodeGoalStrategy(original.snapshot().outputs),'list'),evaluation=records(originalOutputs,1001n).at(-1)!,actualOriginal=records(originalOutputs,1003n).at(-1)!,life=items(f(records(originalOutputs,1004n).at(-1)!,3n),'list');
  const ds=records(outputs,409n).filter(v=>at(f(v,2n))===BigInt(t));expect(ds).toHaveLength(1);const d=ds[0],result=rec(f(d,4n),419n),chosen=uint(f(result,1n))===3n?rec(f(result,2n),420n):undefined;
  const action=chosen?x.b.actions.findIndex(a=>key(a)===key(f(rec(f(chosen,1n),395n),2n)))+1:0;if(chosen)expect(action).toBeGreaterThan(0);
  const actual=actualAt(outputs,BigInt(t)),effect=actual?tagged(outputs,ACTION_BODY).find(a=>key(a[1])===key(f(actual,1n))):undefined;
  expect(!!actual).toBe(!!chosen);if(actual){expect(effect).toBeDefined();expect(uint(f(actual,3n))).toBe(2n);expect(key(effect![3])).toBe(key(x.b.actions[action-1]));}
  const feedback=tagged(outputs,PERFORMANCE_OBS).filter(a=>uint(a[2])===BigInt(t));expect(feedback.length).toBeLessThanOrEqual(1);
  const criterion=records(outputs,203n).filter(v=>at(f(v,5n))===BigInt(t)&&key(f(v,11n))===key(text(CRITERION_VERSION)));expect(criterion.length).toBeLessThanOrEqual(1);
  const oldObs=records(originalOutputs,998n).filter(v=>at(f(v,3n))===BigInt(t-1)),oldCriterion=oldObs.filter(v=>uint(f(v,4n))===4n),oldFeedback=oldObs.filter(v=>uint(f(v,4n))===3n);
  const g=state(x).read(path(x)).value;
  const row={at:t,goal:g?Number(uint(f(rec(g,372n),1n))):0,route:action,success:effect?key(effect[5])===key(text('Applied')):false,destination:key(location(x,target))===key(destination),feedback:feedback.map(a=>a[6]),criterion:criterion.map(o=>key(f(rec(f(o,6n),204n),2n))===key(q(1,1)))};
  const expected={at:t,goal:life.length?Number(uint(f(rec(life[0],993n),2n))):0,route:Number(uint(f(evaluation,6n))),success:f(actualOriginal,4n)===true,destination:f(actualOriginal,5n)===true,feedback:oldFeedback.map(v=>f(v,5n)===true),criterion:oldCriterion.map(v=>f(v,5n)===true)};
  console.info('M242',name,JSON.stringify({row,expected}));rows.push({row,expected});expect(row).toEqual(expected);
  if(g){const instruction=state(x).read(path(x,2n)).value!;expect(key(f(rec(instruction,390n),1n))).toBe(key(x.b.instruction));const identity=key(list([instruction,state(x).read(path(x,3n)).value!]));if(stable)expect(identity).toBe(stable);stable=identity;}
  const planners=tagged(outputs,STRATEGY_EVAL).filter(a=>uint(a[2])===BigInt(t));expect(planners).toHaveLength(input.goal?.status==='Active'?2:1);expect(new Set(planners.map(v=>key(list(v)))).size).toBe(1);const planner=planners[0],pr=items(planner[3],'list').find(v=>key(items(v,'list')[0])===key(x.b.task));
  if(input.goal?.status==='Active'){
   expect(pr).toBeDefined();const r=items(pr!,'list'),available=items(r[2],'list').map(v=>(items(v,'list')[0] as {value:string}).value);
   expect(available).toEqual([8n,9n].map(field=>['Missing','Expired','KnownUnavailable','KnownAvailable'][Number(uint(f(evaluation,field)))]));
   expect(Number(uint(r[1]))).toBe(action?action-1:2);expect(action).toBe(local[0].result.selectedRoute==='route-a'?1:local[0].result.selectedRoute==='route-b'?2:0);
  }
  const ts=traces(x),candidate=ts.find(v=>{const e=rec(f(v,4n),130n);return at(f(e,2n))===BigInt(t)&&key(f(e,5n))===key(sid(1001,'event/task-candidates'));});expect(candidate).toBeDefined();expect(contains(f(candidate!,12n),list(planner))).toBe(true);
  if(chosen){const motives=tagged(outputs,PRIORITY_MOTIVE).find(a=>uint(a[1])===BigInt(t))!,m=items(motives[2],'list').find(v=>key(items(v,'list')[0])===key(x.b.task));expect(m).toBeDefined();const strength=items(m!,'list')[3];expect(typeof strength!=='boolean'&&strength.kind==='rational'&&strength.numerator>0n).toBe(true);expect(items(f(rec(f(d,3n),408n),3n),'list').length).toBeGreaterThan(0);expect(items(f(chosen,2n),'list')).toHaveLength(1);expect(key(f(rec(items(f(chosen,2n),'list')[0],421n),2n))).toBe(key(q(1,1)));}
  if(name==='main'){controls.push({at:t,input,local,operands:{goal:priorGoal?key(priorGoal):null,plan:priorPlan?key(priorPlan):null,knowledge:known?key(known):null,outcomes:journal?key(journal):null}});if(t===4)checkpoint=zip(x.run.save());}
  expect(worldHandles(list(outputs))).toBe(false);
 }
 expect(await original.settleNextInstant()).toBe(false);
 const journal=state(x).read(knowledgePath(C)).value,knowledge=journal?items(items(journal,'list')[1],'list'):[];if(name==='duplicate')expect(knowledge).toHaveLength(1);
 if(name==='main'){expect(rows.map(r=>r.row.route)).toEqual([0,1,1,2,0,2,0]);expect(rows[5].row.goal).toBe(2);expect(controls.find(c=>c.at===4).local[3].result.goal).toBeNull();expect(controls.find(c=>c.at===5).local[2].result.selectedRoute).toBe('route-a');expect(controls.find(c=>c.at===6).local[1].result.goal).toBeNull();}
 let done=false;for(let n=0;n<48;n++)if(!await x.run.settleNextInstant()){done=true;break;}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);expect(traces(x).flatMap(r=>items(f(r,14n),'list'))).toHaveLength(0);
 put(name,{rows,controls,checkpoint,knowledge:knowledge.map(key),initial:hash(x.b.d.initialState),registry:hash(x.b.s.registry),inputs:hash(x.b.d.orderedInputs),terminal:hash(x.run.save()),state:zip(x.run.snapshot().state),outputs:zip(x.run.snapshot().outputs),trace:zip(x.run.snapshot().trace),original:{inputs:hash(originalInput),save:zip(original.save()),trace:zip(original.snapshot().trace)},noDraws:true});
 }catch(error){put(name+'-failure-'+Object.keys(existsSync(file)?saved():{}).filter(k=>k.startsWith(name+'-failure')).length,{rows,error:String(error),clock:String(x.run.snapshot().clock),state:zip(x.run.snapshot().state),outputs:zip(x.run.snapshot().outputs),trace:zip(x.run.snapshot().trace)});throw error;}
}
for(const name of names)it('goal242 native '+name,()=>runCase(name),240000);

it('goal242 privacy and preservation',async()=>{
 const d=saved();expect(new Set(names.map(n=>d[n].registry)).size).toBe(1);expect(new Set(names.map(n=>d[n].initial)).size).toBe(1);
 const privateTags=new Set([MOTOR,'assembled-tolerance-effect/0.1','assembled-reward-experience/0.1/physical',ACTION_BODY,'assembled-action-body-receipt/0.1',SKILL_ACTUAL,SKILL_UPDATE,OPPORTUNITY_RESULT,'external-obstruction-result/0.1','assembled-regulatory-stress/0.1/applied']);
 const observed=(name:Case)=>{const b=fixture(name),registry=decode(b.s.registry),closure=compileLearningProtection(items(registry,'list')[49],registry);return enc(list(items(closure.outputs(decode(unzip(d[name].outputs.deflate))),'list').filter(v=>!(typeof v!=='boolean'&&v.kind==='list'&&typeof v.items[0]!=='boolean'&&v.items[0]?.kind==='text'&&privateTags.has(v.items[0].value))&&!(typeof v!=='boolean'&&v.kind==='record'&&[433n,454n,457n].includes(v.schema.typeId)))));};
 bytes(observed('denied'),observed('noDisplay'));bytes(unzip(d.denied.state.deflate),unzip(d.noDisplay.state.deflate));
 bytes(observed('noOutcome'),observed('hiddenSuccess'));
 const states=['noOutcome','hiddenSuccess'].map(n=>restoreAuthoritativeState(decode(unzip(d[n].state.deflate)))),changed=states[0].entries().filter(e=>key(e.value)!==key(states[1].read(e.path).value!)).map(e=>String(e.path.rootStateTypeId)+'/'+e.path.fieldId).sort();
 expect(changed).toEqual(['1600/1','455/1','455/4']);
 const protectedState=(s:AuthoritativeState)=>enc(new AuthoritativeState(s.entries().filter(e=>!(e.path.rootStateTypeId===1600n||e.path.rootStateTypeId===455n&&[1n,4n].includes(e.path.fieldId)))).canonicalValue());bytes(protectedState(states[0]),protectedState(states[1]));
 const refs=Object.fromEntries([231,235,236,240,241].map(n=>[n,hash(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M'+n+'_EVIDENCE.json'))]));
 const old=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M231_EVIDENCE.json','utf8'));expect(old.frozen.rows).toHaveLength(19);expect(old.frozen.advancing+old.frozen.terminal).toBe(94);
 for(const name of names){const previous=old.frozen.rows.find((r:any)=>r.name===name&&r.law===1);expect(previous).toBeDefined();expect(d[name].original.save.hash).toBe(previous.terminal);}
 put('privacy',{deniedAbsentFullState:true,deniedAbsentPermittedOutputs:true,hiddenSuccessProtectedState:true,hiddenSuccessPermittedOutputs:true,changedPhysicalPaths:changed,retainedEvidence:refs,originalTerminalsExact:true});
},120000);
it('goal242 repeat and continuation',async()=>{
 const x=await start('main');await through(x.run,4n);const save=x.run.save(),old=saved().main;bytes(save,unzip(old.checkpoint.deflate));
 const recovered=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));exact(x.run,recovered);let done=false;
 for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();expect(await recovered.settleNextInstant()).toBe(more);expect(recovered.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[5n,6n,7n,8n,101n].includes(x.run.snapshot().clock))exact(x.run,recovered);if(!more){done=true;break;}}
 expect(done).toBe(true);expect(hash(x.run.save())).toBe(old.terminal);put('continuation',{checkpoint:hash(save),terminal:hash(x.run.save()),fullBytes:true,instants:[5,6,7,8,101]});
},400000);
