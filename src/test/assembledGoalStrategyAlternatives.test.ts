/** M236: same current character; original alternatives are test-only local controls. */
import {it,expect} from 'vitest';
import {fixture as prior,through,rec,f,uint,items,key,decode,enc,list,text,q,C,at,sid,type CanonicalValue} from './fixtures/assembledGoalStrategyCurrent';
import {CRITERION_RULES,CRITERION_REGISTRY} from '../assembled/model';
import {prepareCharacterModel,createCharacterRun,restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {restoreAuthoritativeState,statePathValue,type StatePath} from '../substrate/state';
import {STRATEGY_EVAL,knowledgePath,planPath} from '../assembled/strategy';
import {outcomePath} from '../assembled/performance';
import {PRIORITY_MOTIVE} from '../assembled/priority';
import {ACTION_BODY} from '../assembled/actionBody';
import {evaluateGoalStrategy,type Candidate,type RouteObservation} from '../campaign3/goalStrategyComponent';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Exact evidence hashes.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless checkpoint evidence.
import {deflateSync,inflateSync} from 'node:zlib';
const file='docs/planning/ASSEMBLED_CHARACTER_M236_EVIDENCE.json',read=(p:string)=>JSON.parse(readFileSync(p,'utf8')),saved=()=>read(file);
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')}),unzip=(s:string)=>new Uint8Array(inflateSync(Uint8Array.from(atob(s),c=>c.charCodeAt(0))));
const put=(name:string,value:unknown)=>{const d=existsSync(file)?saved():{};expect(d[name]).toBeUndefined();d[name]=value;writeFileSync(file,JSON.stringify(d,null,2)+'\n');};
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
let model:ReturnType<typeof prepareCharacterModel>|undefined;
async function start(){const b=prior('switchGap'),s={...b.s,rulesVersion:CRITERION_RULES,registrySchemaVersion:CRITERION_REGISTRY},m=await(model??(model=prepareCharacterModel(s)));return {b:{...b,s},m,run:cachedMemory(await createCharacterRun(m,b.d))};}
type X=Awaited<ReturnType<typeof start>>;
const state=(x:X)=>restoreAuthoritativeState(decode(x.run.snapshot().state)),out=(x:X)=>items(decode(x.run.snapshot().outputs),'list');
const records=(xs:readonly CanonicalValue[],n:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n).map(v=>rec(v,n));
const tagged=(xs:readonly CanonicalValue[],tag:string)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const gp=(x:X,fieldId=1n):StatePath=>({rootStateTypeId:373n,fieldId,selectors:[{kind:'mapKey',key:x.b.task}]}),goal=(x:X)=>state(x).read(gp(x)).value!;
const contains=(v:CanonicalValue,w:CanonicalValue):boolean=>{if(key(v)===key(w))return true;if(typeof v==='boolean')return false;return v.kind==='list'||v.kind==='set'?v.items.some(x=>contains(x,w)):v.kind==='record'?[...v.fields.values()].some(x=>contains(x,w)):v.kind==='map'?v.entries.some(([a,b])=>contains(a,w)||contains(b,w)):false;};
const exact=(a:X['run'],b:X['run'])=>{const x=a.snapshot(),y=b.snapshot();expect(y.clock).toBe(x.clock);expect(y.status).toBe(x.status);for(const k of ['state','outputs','trace']as const)bytes(x[k],y[k]);bytes(a.save(),b.save());};
const laws:Candidate[]=['SeparateGoalPlan','GoalEqualsPlan','FixedRoute','FailureAbandonsGoal'];
it('goal236 native comparisons on actual consumed operands',async()=>{
 const x=await start(),rows:any[]=[];let stable:string|undefined,checkpoint:ReturnType<typeof zip>|undefined;
 await through(x.run,1n);
 for(let t=2;t<=7;t++){
  const before=state(x),g=before.read(gp(x)).value,p=before.read(planPath(x.b.task)).value,k=before.read(knowledgePath(C)).value,o=before.read(outcomePath(x.b.task)).value;
  const observations:RouteObservation[]=k?items(items(k,'list')[1],'list').map(v=>{const a=items(v,'list');return {receipt:Number(uint(a[5])),goal:'goal/delivery',route:uint(a[4])===0n?'route-a':'route-b',available:a[6]===true,observedAt:Number(uint(a[7]))-1,validUntil:Number(uint(a[8]))-1};}):[];
  const last=o?items(items(o,'list')[1],'list').at(-1):undefined,priorRoute=p?Number(uint(items(p,'list')[1])):2;
  const operands:Parameters<typeof evaluateGoalStrategy>[0]={goal:g?{id:'goal/delivery',desired:'item-at-destination',status:'Active'}:null,priorRoute:priorRoute===2?null:priorRoute===0?'route-a':'route-b',at:t-1,observations,perceivedFailure:last?items(last,'list')[6]===false:false};
  if(g)expect(uint(f(rec(g,372n),1n))).toBe(1n);
  const input=JSON.stringify(operands),controls=Object.fromEntries(laws.map(law=>[law,evaluateGoalStrategy(operands,law)])) as Record<Candidate,ReturnType<typeof evaluateGoalStrategy>>;expect(JSON.stringify(operands)).toBe(input);
  await through(x.run,BigInt(t));const outputs=out(x),report=tagged(outputs,STRATEGY_EVAL).find(v=>uint(v[2])===BigInt(t))!,row=items(report[3],'list').find(v=>key(items(v,'list')[0])===key(x.b.task)),selected=row?Number(uint(items(row,'list')[1])):2;
  const baseline=controls.SeparateGoalPlan;expect(selected).toBe(baseline.selectedRoute===null?2:baseline.selectedRoute==='route-a'?0:1);
  const availability=row?items(items(row,'list')[2],'list').map(v=>(items(v,'list')[0] as {value:string}).value):[];
  if(row)expect(availability).toEqual(['route-a','route-b'].map(route=>{const a=baseline.availability[route as 'route-a'|'route-b'];return a.kind==='Unknown'?a.reason:a.available?'KnownAvailable':'KnownUnavailable';}));
  const d=records(outputs,409n).find(v=>at(f(v,2n))===BigInt(t))!,ds=rec(f(d,4n),419n),chosen=uint(f(ds,1n))===3n?rec(f(ds,2n),420n):undefined,action=chosen?x.b.actions.findIndex(a=>key(a)===key(f(rec(f(chosen,1n),395n),2n))):-1;
  expect(action).toBe([-1,0,0,1,-1,1][t-2]);
  const motives=tagged(outputs,PRIORITY_MOTIVE).find(v=>uint(v[1])===BigInt(t))!,m=items(motives[2],'list').find(v=>key(items(v,'list')[0])===key(x.b.task)),strength=m?items(m,'list')[3]:q(0,1);
  expect(key(strength)).toBe(key(q(t===2?0:1,1)));
  const effects=tagged(outputs,ACTION_BODY).filter(a=>records(outputs,433n).some(v=>{if(key(f(v,1n))!==key(a[1]))return false;const attempt=rec(f(v,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n);return at(f(rec(f(intent,2n),409n),2n))===BigInt(t);}));
  if(action>=0){expect(items(f(rec(f(d,3n),408n),3n),'list').length).toBeGreaterThan(0);expect(items(f(chosen!,2n),'list')).toHaveLength(1);expect(key(f(rec(items(f(chosen!,2n),'list')[0],421n),2n))).toBe(key(q(1,1)));expect(effects).toHaveLength(1);expect(key(effects[0][3])).toBe(key(x.b.actions[action]));expect(key(effects[0][5])).toBe(key(text(t===7?'Applied':'Blocked')));}else expect(effects).toHaveLength(0);
  expect(uint(f(rec(goal(x),372n),1n))).toBe(1n);const identity=key(list([goal(x),state(x).read(gp(x,2n)).value!,state(x).read(gp(x,3n)).value!]));if(stable)expect(identity).toBe(stable);else stable=identity;
  const traces=records(items(decode(x.run.snapshot().trace),'list'),160n).filter(r=>at(f(rec(f(r,4n),130n),2n))===BigInt(t));
  const reads=traces.flatMap(r=>items(f(r,11n),'list')).map(v=>rec(v,147n)),bound:any[]=[];
  for(const path of [gp(x),...(t>2?[knowledgePath(C),planPath(x.b.task),outcomePath(x.b.task)]:[])]){const value=before.read(path),match=reads.find(r=>key(f(r,2n))===key(statePathValue(path))&&f(r,3n)===value.presence&&(!value.presence||key(f(r,4n))===key(value.value!)));expect(match,'actual prior read '+path.rootStateTypeId+'/'+path.fieldId).toBeDefined();bound.push({path:key(statePathValue(path)),read:key(match!)});}
  const candidate=traces.find(r=>key(f(rec(f(r,4n),130n),5n))===key(sid(1001,'event/task-candidates')));expect(candidate).toBeDefined();expect(contains(f(candidate!,12n),list(report))).toBe(true);
  if(t===4){expect(operands.perceivedFailure).toBe(true);expect(last).toBeDefined();expect(uint(items(last!,'list')[2])).toBe(3n);expect(controls.FailureAbandonsGoal.goal).toBeNull();expect(baseline.desireActive).toBe(true);expect(action).toBe(0);}
  if(t===5){expect(availability).toEqual(['KnownUnavailable','KnownAvailable']);expect(controls.FixedRoute.selectedRoute).toBe('route-a');expect(action).toBe(1);}
  if(t===6){expect(availability).toEqual(['KnownUnavailable','KnownUnavailable']);expect(controls.GoalEqualsPlan.goal).toBeNull();expect(baseline.desireActive).toBe(true);expect(action).toBe(-1);expect(key(strength)).toBe(key(q(1,1)));}
  rows.push({at:t,operands,controls,selected,action,motive:key(strength),availability,goal:identity,priorState:zip(enc(before.canonicalValue())),boundReads:bound,planner:key(list(report)),candidateInput:key(f(candidate!,12n)),effects:effects.map(a=>key(list(a)))});
  if(t===4)checkpoint=zip(x.run.save());
 }
 const traces=records(items(decode(x.run.snapshot().trace),'list'),160n);expect(traces.flatMap(r=>items(f(r,14n),'list'))).toHaveLength(0);
 let done=false;for(let n=0;n<48;n++)if(!await x.run.settleNextInstant()){done=true;break;}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);expect(uint(f(rec(goal(x),372n),1n))).toBe(3n);
 put('native',{rows,checkpoint,terminal:hash(x.run.save()),registry:hash(x.b.s.registry),initial:hash(x.b.d.initialState),inputs:hash(x.b.d.orderedInputs),noDraws:true});
},290000);
it('goal236 preserved alternative controls',()=>{
 const old=read('docs/planning/ASSEMBLED_CHARACTER_M231_EVIDENCE.json'),historical=read('docs/planning/GOAL_STRATEGY_PUBLIC_RESULT_REV1.json');expect(old.frozen.rows).toHaveLength(19);expect(old.frozen.advancing+old.frozen.terminal).toBe(94);
 const alternatives=[1,2,3,4].map(law=>{const prior=old.frozen.rows.find((r:any)=>r.law===law&&r.name==='main'),original=historical.results.find((r:any)=>r.law===law&&r.name==='main');expect(prior.terminal).toBe(original.saveSha256);expect(prior.prefixes).toHaveLength(8);return {law,terminal:prior.terminal,prefixes:prior.prefixes};});
 const references=Object.fromEntries([231,233,234,235].map(n=>[n,hash(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M'+n+'_EVIDENCE.json'))]));
 const native=saved().native;expect(native.rows).toHaveLength(6);for(const row of native.rows)for(const law of laws)expect(evaluateGoalStrategy(row.operands,law)).toEqual(row.controls[law]);
 put('controls',{references,alternatives,localComparisons:24,fullAlternativeNativeTrajectories:false});
});
it('goal236 exact repeat and public continuation',async()=>{
 const x=await start(),old=saved().native;await through(x.run,4n);const save=x.run.save();bytes(save,unzip(old.checkpoint.deflate));
 const restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));exact(x.run,restored);let done=false;const checkpoints:any[]=[];
 for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();expect(await restored.settleNextInstant()).toBe(more);expect(restored.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[5n,6n,7n,101n].includes(x.run.snapshot().clock)){exact(x.run,restored);checkpoints.push({at:Number(x.run.snapshot().clock),save:hash(x.run.save())});}if(!more){done=true;break;}}
 expect(done).toBe(true);expect(checkpoints.map(v=>v.at)).toEqual([5,6,7,101]);expect(hash(x.run.save())).toBe(old.terminal);put('continuation',{checkpoint:hash(save),checkpoints,terminal:hash(x.run.save())});
},440000);
