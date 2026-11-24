import {it,expect} from 'vitest';
import {fixture as prior,through,rec,f,uint,items,key,decode,enc,list,text,q,at,sid,target,origin,destination,type CanonicalValue} from './fixtures/assembledJointCriterion';
import {ITEM_EXECUTION_RULES,ITEM_EXECUTION_REGISTRY} from '../assembled/model';
import {itemPath} from '../assembled/itemWorld';
import {CRITERION_VERSION} from '../assembled/criterionSensing';
import {POST_ITEM_PROBE} from '../assembled/itemProbe';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {characterEvidenceRefValue} from '../semanticBinding/semanticEvidenceCodecs';
import {prepareCharacterModel,characterModelIdentity,createCharacterRun,restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {decodeGoalStrategy} from '../campaign3/goalStrategyCodecs';
import {cases,ordered} from './goalStrategyFixtures';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Exact hashes.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless evidence.
import {deflateSync,inflateSync} from 'node:zlib';
const names=['externalHidden','absentExternal','falseCriterion','adoptionCriterion'] as const;
type Case=typeof names[number];type Name=Case|'external';
const sourceName={external:'external',externalHidden:'hiddenExternal',absentExternal:'absentExternal',falseCriterion:'falseCriterion',adoptionCriterion:'adoptionCriterion'} as const;
const file='docs/planning/ASSEMBLED_CHARACTER_M243_EVIDENCE.json',read=(p:string)=>JSON.parse(readFileSync(p,'utf8')),saved=()=>read(file),old=read('docs/planning/ASSEMBLED_CHARACTER_M240_EVIDENCE.json'),reused=read('docs/planning/ASSEMBLED_CHARACTER_M241_EVIDENCE.json').external;
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')}),unzip=(s:string)=>new Uint8Array(inflateSync(Uint8Array.from(atob(s),c=>c.charCodeAt(0))));
const put=(n:string,v:unknown)=>{const d=existsSync(file)?saved():{};expect(d[n]).toBeUndefined();d[n]=v;writeFileSync(file,JSON.stringify(d,null,2)+'\n');};
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const fixture=(name:Name)=>{const b=prior(name);return {...b,s:{...b.s,rulesVersion:ITEM_EXECUTION_RULES,registrySchemaVersion:ITEM_EXECUTION_REGISTRY}};};
let model:ReturnType<typeof prepareCharacterModel>|undefined;
const prepared=async(name:Name)=>{const b=fixture(name),m=await(model??(model=prepareCharacterModel(b.s)));return {b,m};};
const start=async(name:Name)=>{const x=await prepared(name);return {...x,run:cachedMemory(await createCharacterRun(x.m,x.b.d))};};
type X=Awaited<ReturnType<typeof start>>;
const path=(task:CanonicalValue)=>({rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey' as const,key:task}]}),records=(xs:readonly CanonicalValue[],n:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n).map(v=>rec(v,n));
const contains=(v:CanonicalValue,w:CanonicalValue):boolean=>key(v)===key(w)||typeof v!=='boolean'&&v.kind==='list'&&v.items.some(x=>contains(x,w));
const traces=(data:any)=>items(decode(unzip(data.trace.deflate)),'list').map(v=>rec(v,160n));
const named=(ts:ReturnType<typeof traces>,name:string,t:number)=>ts.filter(v=>{const e=rec(f(v,4n),130n);return at(f(e,2n))===BigInt(t)&&key(f(e,5n))===key(sid(1001,name));});
const project=(r:any)=>({at:r.at,status:r.status,acts:r.acts,truth:r.truth,criterion:r.criterion});
function original(name:Name){
 const source=sourceName[name],d=old.correspondence.originals[source];expect(hash(ordered(cases()[source]))).toBe(d.inputs);expect(hash(unzip(d.save.deflate))).toBe(d.save.hash);
 const frozen=read('docs/planning/ASSEMBLED_CHARACTER_M231_EVIDENCE.json').frozen.rows.find((r:any)=>r.name===source&&r.law===1);expect(d.save.hash).toBe(frozen.terminal);
 const ts=items(decodeGoalStrategy(unzip(d.trace.deflate)),'list').map(v=>rec(v,160n));
 const rows=[1,2,3].map(t=>{const outputs=ts.filter(v=>at(f(rec(f(v,4n),130n),2n))===BigInt(t)).flatMap(v=>items(f(v,13n),'list')),g=rec(items(f(records(outputs,1004n).at(-1)!,3n),'list')[0],993n),evaluation=records(outputs,1001n).at(-1)!,truth=records(outputs,1003n).at(-1)!,observations=records(outputs,998n).filter(v=>uint(f(v,4n))===4n);
  expect(uint(f(evaluation,6n))).toBe(0n);expect(observations.length).toBeLessThanOrEqual(1);return {at:t+1,status:Number(uint(f(g,2n))),acts:false,truth:f(truth,5n)===true,criterion:observations.length?f(observations[0],5n)===true:null};});
 expect(rows).toEqual(d.rows);return {source,rows,inputHash:d.inputs,terminal:d.save.hash,traceHash:hash(unzip(d.trace.deflate))};
}
function handles(v:CanonicalValue):boolean {if(typeof v==='boolean')return false;if(v.kind==='typedIdentifier')return [1601n,1602n].includes(v.namespaceId)||handles(v.payload);if(v.kind==='list'||v.kind==='set')return v.items.some(handles);if(v.kind==='record')return [...v.fields.values()].some(handles);if(v.kind==='map')return v.entries.some(([a,b])=>handles(a)||handles(b));return false;}
function flow(name:Name,data:any,b:ReturnType<typeof fixture>,identity:Uint8Array){
 const ts=traces(data),outputs=items(decode(unzip(data.outputs.deflate)),'list'),state=restoreAuthoritativeState(decode(unzip(data.state.deflate)));
 expect(new Set(ts.map(v=>key(f(v,2n))))).toEqual(new Set([key(decode(identity))]));expect(ts.flatMap(v=>items(f(v,14n),'list'))).toHaveLength(0);expect(handles(list(outputs))).toBe(false);expect(records(outputs,433n)).toHaveLength(0);
 expect(data.initial).toBe(hash(b.d.initialState));expect(data.registry).toBe(hash(b.s.registry));expect(data.inputs).toBe(hash(b.d.orderedInputs));
 const rows=data.rows.map(project);expect(rows).toEqual(original(name).rows);
 for(const row of rows){const t=row.at,obs=records(outputs,203n).filter(v=>at(f(v,5n))===BigInt(t)&&key(f(v,11n))===key(text(CRITERION_VERSION)));expect(obs).toHaveLength(row.criterion===null?0:1);
  if(row.criterion===null)continue;const o=obs[0];expect(key(f(rec(f(o,6n),204n),2n))).toBe(key(q(row.criterion?1:0,1)));
  const probes=named(ts,'event/regulatory-diagnostic-probe',t);expect(probes).toHaveLength(1);expect(uint(f(rec(f(probes[0],4n),130n),3n))).toBe(120n);expect(key(f(probes[0],6n))).toBe(key(text(POST_ITEM_PROBE)));
  const worldRead=items(f(probes[0],11n),'list').map(v=>rec(v,147n)).find(v=>key(f(v,2n))===key(statePathValue(itemPath(target))));expect(worldRead).toBeDefined();expect(key(f(worldRead!,4n))).toBe(key(row.truth?destination:origin));
  const memory=records(outputs,342n).find(v=>key(f(rec(f(v,2n),337n),2n))===key(o));expect(memory).toBeDefined();
  for(const event of ['event/measurement-prediction-application','event/task-measurement-settlement']){const events=named(ts,event,t);expect(events).toHaveLength(1);expect(key(f(events[0],12n))).toBe(key(memory!));expect(uint(f(rec(f(events[0],4n),130n),3n))).toBe(140n);}
  const settle=named(ts,'event/task-measurement-settlement',t)[0],prior=items(f(settle,11n),'list').map(v=>rec(v,147n)).find(v=>key(f(v,2n))===key(statePathValue(path(b.task))));expect(prior).toBeDefined();expect(f(prior!,3n)).toBe(t!==2);
  if(t===2)expect(items(f(settle,17n),'list')).toHaveLength(0);else{expect(uint(f(rec(f(prior!,4n),372n),1n))).toBe(1n);expect(items(f(settle,17n),'list')).toHaveLength(1);const goal=rec(state.read(path(b.task)).value!,372n);expect(uint(f(goal,1n))).toBe(2n);expect(at(f(goal,3n))).toBe(BigInt(t));expect(key(f(goal,2n))).toBe(key(characterEvidenceRefValue({kind:'observation',observationId:uint((f(o,1n) as Extract<CanonicalValue,{kind:'typedIdentifier'}>).payload)})));}
 }
 const later=named(ts,'event/deliberation-opportunity',4).flatMap(v=>items(f(v,11n),'list')).map(v=>rec(v,147n)).filter(v=>key(f(v,2n))===key(statePathValue(path(b.task))));expect(later.length).toBeGreaterThan(0);expect(later.some(v=>f(v,3n)===true&&uint(f(rec(f(v,4n),372n),1n))===BigInt(rows[2].status))).toBe(true);
 return {rows,original:original(name),currentIdentity:hash(identity),traceLinked:true,noDraws:true};
}
it('goal243 reuse current external',async()=>{const x=await prepared('external'),result=flow('external',reused,x.b,characterModelIdentity(x.m));put('external',{...result,reusedFrom:'ASSEMBLED_CHARACTER_M241_EVIDENCE.json#/external',evidenceHash:hash(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M241_EVIDENCE.json')),terminal:reused.terminal});},150000);
for(const name of names)it('goal243 native '+name,async()=>{
 const x=await start(name),rows:any[]=[],expected=original(name).rows;let checkpoint:ReturnType<typeof zip>|undefined,instruction:string|undefined;
 try{for(const t of [1,2,3,4]){await through(x.run,BigInt(t));if(t===1)continue;const snap=x.run.snapshot(),state=restoreAuthoritativeState(decode(snap.state)),outputs=items(decode(snap.outputs),'list'),goal=rec(state.read(path(x.b.task)).value!,372n),ds=records(outputs,409n).filter(v=>at(f(v,2n))===BigInt(t));expect(ds).toHaveLength(1);const status=rec(f(ds[0],4n),419n);
  const obs=records(outputs,203n).filter(v=>at(f(v,5n))===BigInt(t)&&key(f(v,11n))===key(text(CRITERION_VERSION)));expect(obs.length).toBeLessThanOrEqual(1);
  const row={at:t,status:Number(uint(f(goal,1n))),acts:uint(f(status,1n))===3n,truth:key(state.read(itemPath(target)).value!)===key(destination),criterion:obs.length?key(f(rec(f(obs[0],6n),204n),2n))===key(q(1,1)):null};rows.push(row);expect(row).toEqual(expected[t-2]);
  const leaf=state.read({...path(x.b.task),fieldId:2n}).value!,identity=key(leaf);expect(key(f(rec(leaf,390n),1n))).toBe(key(x.b.instruction));if(instruction)expect(identity).toBe(instruction);instruction=identity;
  if(name==='falseCriterion'&&t===2)checkpoint=zip(x.run.save());
 }
 let done=false;for(let n=0;n<48;n++)if(!await x.run.settleNextInstant()){done=true;break;}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);
 const data={rows,checkpoint,initial:hash(x.b.d.initialState),registry:hash(x.b.s.registry),inputs:hash(x.b.d.orderedInputs),state:zip(x.run.snapshot().state),outputs:zip(x.run.snapshot().outputs),trace:zip(x.run.snapshot().trace),terminal:hash(x.run.save())};const checked=flow(name,data,x.b,characterModelIdentity(x.m));put(name,{...data,checked});
 }catch(error){put(name+'-failure-'+Object.keys(existsSync(file)?saved():{}).filter(k=>k.startsWith(name+'-failure')).length,{rows,error:String(error),state:zip(x.run.snapshot().state),outputs:zip(x.run.snapshot().outputs),trace:zip(x.run.snapshot().trace)});throw error;}
},200000);
it('goal243 hidden privacy and retained evidence',()=>{
 const d=saved(),mapping:any[]=[];
 const normalized=(name:Case)=>{const data=d[name],ts=traces(data),outputs=items(decode(unzip(data.outputs.deflate)),'list');let count=0;
  const values=outputs.map(v=>{if(typeof v==='boolean'||v.kind!=='list'||key(v.items[0])!==key(text('assembled-regulatory-stress/0.1/applied')))return v;
   const a=items(v,'list'),p=items(a[2],'list'),sources=ts.filter(t=>key(f(rec(f(t,4n),130n),1n))===key(p[3]));expect(sources.length).toBeGreaterThan(0);expect(new Set(sources.map(t=>key(f(t,4n)))).size).toBe(1);const event=rec(f(sources[0],4n),130n);expect(at(f(event,2n))).toBe(at(p[2]));expect(uint(f(event,3n))).toBe(50n);expect(key(f(event,5n))).toBe(key(sid(1001,'event/task-appraisal')));expect(sources.some(t=>contains(f(t,13n),p[4]))).toBe(true);
   const address=list([f(event,2n),f(event,3n),f(event,5n)]);mapping.push({name,id:String(uint(p[3])),address:key(address)});count++;return list([...a.slice(0,2),list([...p.slice(0,3),address,...p.slice(4)]),...a.slice(3)]);
  });expect(count).toBe(3);return enc(list(values));};
 bytes(normalized('externalHidden'),normalized('absentExternal'));bytes(unzip(d.externalHidden.state.deflate),unzip(d.absentExternal.state.deflate));
 const refs=Object.fromEntries([231,240,241,242].map(n=>[n,hash(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M'+n+'_EVIDENCE.json'))]));
 put('privacy',{fullStateExact:true,completeOutputsAfterAuthenticatedEventMapping:true,mapping,references:refs});
},120000);
it('goal243 repeat and continuation',async()=>{
 const x=await start('falseCriterion');await through(x.run,2n);const save=x.run.save(),prior=saved().falseCriterion;bytes(save,unzip(prior.checkpoint.deflate));const other=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));
 const exact=()=>{const a=x.run.snapshot(),b=other.snapshot();expect(b.clock).toBe(a.clock);expect(b.status).toBe(a.status);for(const k of ['state','outputs','trace'] as const)bytes(a[k],b[k]);bytes(x.run.save(),other.save());};exact();let done=false;
 for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();expect(await other.settleNextInstant()).toBe(more);expect(other.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[3n,4n,101n].includes(x.run.snapshot().clock))exact();if(!more){done=true;break;}}
 expect(done).toBe(true);expect(hash(x.run.save())).toBe(prior.terminal);put('continuation',{checkpoint:hash(save),terminal:hash(x.run.save()),fullBytes:true,instants:[3,4,101]});
},400000);
