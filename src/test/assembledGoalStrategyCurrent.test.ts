import {it,expect,vi} from 'vitest';
import {start,fixture,names,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,at,type Case,type CanonicalValue} from './fixtures/assembledGoalStrategyCurrent';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {STRATEGY_EVAL,DISPLAY,LEARN,knowledgePath,planPath,PLAN_OWNER} from '../assembled/strategy';
import {PRIORITY_MOTIVE} from '../assembled/priority';
import {ACTION_BODY} from '../assembled/actionBody';
import {evaluateGoalStrategy,type RouteObservation} from '../campaign3/goalStrategyComponent';
import {safe} from './assembledIntoxicationCohort.test';
import {restorePreparedCharacterRun,createCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {prepareGoalStrategyModel,createGoalStrategyRun,restoreGoalStrategyRun} from '../campaign3/goalStrategyFactory';
import {goalStrategyRecipe} from '../campaign3/goalStrategyModel';
import * as trace from '../substrate/trace';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Exact hashes.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless evidence.
import {deflateSync,inflateSync} from 'node:zlib';
// @ts-expect-error Exact Git bytes.
import {execFileSync} from 'node:child_process';
type X=Awaited<ReturnType<typeof start>>;
const file='docs/planning/ASSEMBLED_CHARACTER_M231_EVIDENCE.json',read=(p:string)=>JSON.parse(readFileSync(p,'utf8')),saved=()=>read(file);
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')}),unzip=(s:string)=>new Uint8Array(inflateSync(Uint8Array.from(atob(s),c=>c.charCodeAt(0))));
const put=(n:string,v:unknown)=>{const d=existsSync(file)?saved():{};expect(d[n]).toBeUndefined();d[n]=v;writeFileSync(file,JSON.stringify(d,null,2)+'\n');};
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const exact=(a:X['run'],b:X['run'])=>{const as=a.snapshot(),bs=b.snapshot();expect(bs.clock).toBe(as.clock);expect(bs.status).toBe(as.status);for(const k of ['state','outputs','trace']as const)bytes(as[k],bs[k]);bytes(a.save(),b.save());};
const state=(x:X)=>restoreAuthoritativeState(decode(x.run.snapshot().state)),out=(x:X)=>items(decode(x.run.snapshot().outputs),'list');
const tag=(v:CanonicalValue,label:string)=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label));
const records=(xs:readonly CanonicalValue[],n:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n);
const goal=(x:X)=>{const s=state(x),path={rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey' as const,key:x.b.task}]};return [s.read(path).value,s.read({...path,fieldId:2n}).value,s.read({...path,fieldId:3n}).value];};
const contains=(v:CanonicalValue,w:CanonicalValue):boolean=>{if(key(v)===key(w))return true;if(typeof v==='boolean')return false;return v.kind==='list'||v.kind==='set'?v.items.some(x=>contains(x,w)):v.kind==='record'?[...v.fields.values()].some(x=>contains(x,w)):v.kind==='map'?v.entries.some(([a,b])=>contains(a,w)||contains(b,w)):false;};
const expected:Record<Case,number[]>={switchGap:[-1,0,0,1,-1,1],retained:[-1,0,0],denied:[-1,-1,-1,1],noDisplay:[-1,-1,-1,1],expiry:[-1,0,-1],duplicate:[-1,0,0],noAdoption:[-1,-1,-1]};
async function runCase(name:Case){
 const x=await start(name),rows:any[]=[];let stable:string|undefined,checkpoint:ReturnType<typeof zip>|undefined;
 await through(x.run,1n);for(let t=2;t<=x.b.last;t++){
  const before=state(x),priorGoal=goal(x),known=before.read(knowledgePath(C)).value,observations:RouteObservation[]=known?items(items(known,'list')[1],'list').map(v=>{const a=items(v,'list');return {receipt:Number(uint(a[5])),goal:'goal/delivery',route:uint(a[4])===0n?'route-a':'route-b',available:a[6]===true,observedAt:Number(uint(a[7]))-1,validUntil:Number(uint(a[8]))-1};}):[],p=before.read(planPath(x.b.task)).value,prior=p?Number(uint(items(p,'list')[1])):2;
  const control=evaluateGoalStrategy({goal:priorGoal[0]?{id:'goal/delivery',desired:'item-at-destination',status:'Active'}:null,priorRoute:prior===2?null:prior===0?'route-a':'route-b',at:t-1,observations,perceivedFailure:true});
  await through(x.run,BigInt(t));const outputs=out(x),reports=outputs.filter(v=>tag(v,STRATEGY_EVAL)).map(v=>items(v,'list')),report=reports.find(v=>uint(v[2])===BigInt(t))!,rs=items(report[3],'list'),row=rs.find(v=>key(items(v,'list')[0])===key(x.b.task)),selected=row?Number(uint(items(row,'list')[1])):2;
  const d=rec(records(outputs,409n).find(v=>at(f(rec(v,409n),2n))===BigInt(t))!,409n),status=rec(f(d,4n),419n),chosen=uint(f(status,1n))===3n?rec(f(status,2n),420n):undefined,chosenAction=chosen?f(rec(f(chosen,1n),395n),2n):undefined,action=chosenAction?x.b.actions.findIndex(a=>key(a)===key(chosenAction)):-1;
  const motive=outputs.filter(v=>tag(v,PRIORITY_MOTIVE)).map(v=>items(v,'list')).find(v=>uint(v[1])===BigInt(t))!,m=items(motive[2],'list').find(v=>key(items(v,'list')[0])===key(x.b.task)),strength=m?items(m,'list')[3]:q(0,1);
  const effects=outputs.filter(v=>tag(v,ACTION_BODY)).map(v=>items(v,'list')).filter(a=>records(outputs,433n).some(v=>{const r=rec(v,433n);if(key(f(r,1n))!==key(a[1]))return false;const attempt=rec(f(r,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n);return at(f(rec(f(intent,2n),409n),2n))===BigInt(t);}));
  console.info('M231 instant',name,t,JSON.stringify({selected,action,motive:key(strength),effects:effects.map(a=>(a[5]as {value:string}).value)}));
  expect(selected).toBe(control.selectedRoute===null?2:control.selectedRoute==='route-a'?0:1);expect(action).toBe(expected[name][t-2]);
  if(row){const availability=items(items(row,'list')[2],'list').map(v=>(items(v,'list')[0]as {value:string}).value);expect(availability).toEqual(['route-a','route-b'].map(route=>{const a=control.availability[route as 'route-a'|'route-b'];return a.kind==='Unknown'?a.reason:a.available?'KnownAvailable':'KnownUnavailable';}));}
  if(action>=0){expect(typeof strength!=='boolean'&&strength.kind==='rational'&&strength.numerator>0n).toBe(true);expect(items(f(rec(f(d,3n),408n),3n),'list').length).toBeGreaterThan(0);expect(items(f(chosen!,2n),'list')).toHaveLength(1);expect(key(f(rec(items(f(chosen!,2n),'list')[0],421n),2n))).toBe(key(q(1,1)));expect(effects).toHaveLength(1);expect((effects[0][5]as {value:string}).value).toBe(name==='switchGap'&&t===7?'Applied':'Blocked');}
  else expect(effects).toHaveLength(0);
  const g=goal(x);if(name==='noAdoption')expect(g.every(v=>v===undefined)).toBe(true);else{expect(uint(f(rec(g[0]!,372n),1n))).toBe(1n);const now=key(list(g as CanonicalValue[]));if(stable)expect(now).toBe(stable);else stable=now;}
  const ts=items(decode(x.run.snapshot().trace),'list').map(v=>rec(v,160n)),candidate=ts.find(v=>{const e=rec(f(v,4n),130n);return at(f(e,2n))===BigInt(t)&&key(f(e,5n))===key({kind:'typedIdentifier',namespaceId:1001n,payload:text('event/task-candidates')});});expect(candidate).toBeDefined();expect(contains(f(candidate!,12n),list(report))).toBe(true);
  rows.push({at:t,selected,action,goal:g.map(v=>v?key(v):null),strength:key(strength),control,availability:row?items(items(row,'list')[2],'list').map(v=>key(v)):[],effects:effects.map(a=>({action:x.b.actions.findIndex(v=>key(v)===key(a[3])),status:(a[5]as {value:string}).value}))});
  if(name==='switchGap'&&t===4)checkpoint=zip(x.run.save());
 }
 const journal=state(x).read(knowledgePath(C)).value,knowledge=journal?items(items(journal,'list')[1],'list'):[];
 if(name==='duplicate')expect(knowledge).toHaveLength(1);if(name==='expiry')expect(rows.at(-1).control.availability['route-a']).toEqual({kind:'Unknown',reason:'Expired'});
 let done=false;for(let i=0;i<48;i++){if(!await x.run.settleNextInstant()){done=true;break;}}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);
 put(name,{rows,knowledge:knowledge.map(key),checkpoint,terminal:hash(x.run.save()),registry:hash(x.b.s.registry),initial:hash(x.b.d.initialState),inputs:hash(x.b.d.orderedInputs),observer:['denied','noDisplay'].includes(name)?zip(safe(x.run,out(x))):undefined});console.info('M231 PASS',name);
}
for(const name of names)it('goal231 native '+name,()=>runCase(name),230000);
it('goal231 frozen matrix',async()=>{
 const planBytes=execFileSync('git',['show','dde8aa81:docs/planning/GOAL_STRATEGY_PUBLIC_PLAN_REV1.json']),plan=JSON.parse(planBytes.toString('utf8')),prior=read('docs/planning/GOAL_STRATEGY_PUBLIC_RESULT_REV1.json');expect(hash(planBytes)).toBe(prior.planSha256);expect(plan).toEqual(read('docs/planning/GOAL_STRATEGY_PUBLIC_PLAN_REV1.json'));
 const sources:any[]=[];for(const a of plan.artifacts){const disk=hash(readFileSync(a.path)),blob=hash(execFileSync('git',['show','dde8aa81:'+a.path]));if(a.path==='src/campaign3/goalStrategyRuntime.ts'){expect(hash(readFileSync('docs/planning/public-wrapper-quiescence-rev1/'+a.path))).toBe(disk);sources.push({...a,current:disk,disposition:'matches preserved quiescence-inventory source; original source hash differs, no source-byte equivalence claim'});}else {expect([disk,blob]).toContain(a.sha256);sources.push({...a,exactBytes:disk===a.sha256?'working-tree':'Git/dde8aa81'});}}
 const hex=(s:string)=>Uint8Array.from(s.match(/../g)!.map(v=>parseInt(v,16))),rows:any[]=[];let advancing=0,terminal=0;
 for(const row of plan.runs){const source=goalStrategyRecipe(row.law),input={initialState:hex(plan.initialState),orderedInputs:hex(row.orderedInputs),runSeed:hex(plan.runSeed)},r=await createGoalStrategyRun(await prepareGoalStrategyModel(source),input),saves=[r.save()];expect(key(decode(r.runIdentity()))).toBe(row.runIdentity);while(await r.settleNextInstant())saves.push(r.save());const old=prior.results.find((v:any)=>v.law===row.law&&v.name===row.name);
  expect(hash(r.save())).toBe(old.saveSha256);for(const [field,h]of [['state','stateSha256'],['outputs','outputSha256']]as const)expect(hash(r.snapshot()[field])).toBe(old[h]);expect([hash(r.observerView(0))]).toEqual(old.observerSha256);expect(saves.length).toBe(old.prefixes);
  for(const [i,save]of saves.entries()){const restored=await restoreGoalStrategyRun(source,{initialState:input.initialState,orderedInputs:input.orderedInputs,save});bytes(restored.save(),save);const more=await restored.settleNextInstant();expect(more).toBe(i<saves.length-1);bytes(restored.save(),saves[Math.min(i+1,saves.length-1)]);if(more)advancing++;else terminal++;}
  rows.push({law:row.law,name:row.name,prefixes:saves.map(hash),terminal:hash(r.save())});
 }expect(rows).toHaveLength(19);expect(advancing).toBe(75);expect(terminal).toBe(19);put('frozen',{sources,rows,advancing,terminal,planHash:hash(planBytes)});
},110000);
it('goal231 privacy and admission',async()=>{
 const d=saved();bytes(unzip(d.denied.observer.deflate),unzip(d.noDisplay.observer.deflate));expect(d.denied.rows).toEqual(d.noDisplay.rows);expect(new Set(names.map(n=>d[n].registry)).size).toBe(1);
 const x=await start('duplicate'),rows=items(decode(x.b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(at(a[0])===3n&&key(a[2])===key(DISPLAY)){const p=items(a[3],'list'),r=[...items(items(p[1],'list')[0],'list')];r[3]=false;a[3]=list([p[0],list([list(r)])]);}return list(a);});
 await expect(createCharacterRun(x.m,{...x.b.d,orderedInputs:enc(list(rows))})).rejects.toThrow('receipt conflict');
 const malformed=items(decode(x.b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(at(a[0])===3n&&key(a[2])===key(DISPLAY)){const p=items(a[3],'list'),r=items(items(p[1],'list')[0],'list');a[3]=list([p[0],list([list(r.slice(0,6))])]);}return list(a);});
 await expect(createCharacterRun(x.m,{...x.b.d,orderedInputs:enc(list(malformed))})).rejects.toThrow('display task');
 const model=await compileCharacterModel(x.b.s),component=await compileCharacterState(model),initial=component.initialState(x.b.d.initialState),path=knowledgePath(C);
 expect(()=>component.stateModel.applyPatch(initial,{operations:[{kind:'set',path,expected:{presence:false},newValue:list([text('assembled-strategy/0.1'),list([])])}]},PLAN_OWNER,{writableRoots:[1000n],targetPaths:[path]})).toThrow();
 put('privacyAdmission',{fullObserverEquality:true,receiptConflict:true,malformedDisplay:true,foreignKnowledgeWriter:true});
},180000);
it('goal231 repeat restore and knowledge rollback',async()=>{
 const x=await start('switchGap');await through(x.run,4n);const save=x.run.save(),old=saved().switchGap;bytes(save,unzip(old.checkpoint.deflate));
 const restore=async()=>cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save})),bad=await restore(),before=bad.snapshot(),write=trace.traceRecordValue;let hit=false;
 const spy=vi.spyOn(trace,'traceRecordValue').mockImplementation(v=>{if(v.event.dueAt===5n&&key(v.event.eventTypeId)===key(LEARN)&&v.statePatch.operations.length){expect(v.structuralMutationDiffs.length).toBeGreaterThan(0);hit=true;throw Error('M231 after knowledge write');}return write(v);});
 try{await expect(bad.settleNextInstant()).rejects.toThrow('M231 after knowledge write');expect(hit).toBe(true);expect(bad.snapshot().clock).toBe(before.clock);for(const k of ['state','outputs','trace']as const)bytes(bad.snapshot()[k],before[k]);expect(()=>bad.save()).toThrow('active quiescent');}finally{spy.mockRestore();}
 const recovered=await restore();exact(x.run,recovered);let done=false;for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();expect(await recovered.settleNextInstant()).toBe(more);expect(recovered.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[5n,7n,101n].includes(x.run.snapshot().clock))exact(x.run,recovered);if(!more){done=true;break;}}expect(done).toBe(true);expect(hash(x.run.save())).toBe(old.terminal);put('rollback',{reached:hit,checkpoint:hash(save),terminal:hash(x.run.save()),failedRunReusable:false});
},440000);
