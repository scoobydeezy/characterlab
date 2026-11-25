import {it,expect,afterEach} from 'vitest';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Lossless evidence.
import {deflateSync,inflateSync} from 'node:zlib';
// @ts-expect-error Hashing.
import {createHash} from 'node:crypto';
import {fixture as prior,start,through,finish,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,u,C,sid,taskA,taskB,actionA,actionB,type Run,type CanonicalValue} from './fixtures/assembledProspectionCurrent';
import {changeDefinition,workLimit} from './fixtures/assembledCharacter';
import {POSITIVE_ACTIVATION_RULES,POSITIVE_ACTIVATION_REGISTRY,compileCharacterModel,ATTEMPT_RECEIPT_REGISTRY} from '../assembled/model';
import {POSITIVE_ACTIVATION_VERSION,REASON_SOURCE_REPORT,compileDescribedReasons} from '../assembled/reasons';
import {PRIORITY_DISPLAY,PRIORITY_MOTIVE} from '../assembled/priority';
import {prepareCharacterModel,createCharacterRun,restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {definition,analyze} from './fixtures/assembledMultiComparison';
import {randomDrawRecord} from '../assembled/codecs';
import {timedComparisonValue,type TimedEntry} from '../assembled/timedComparison';
import {dataIdentity as id} from '../campaign2/canonicalData';
import {restoreAuthoritativeState} from '../substrate/state';
const file='docs/planning/ASSEMBLED_CHARACTER_M266_EVIDENCE.json',hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')}),unzip=(v:{deflate:string})=>new Uint8Array(inflateSync(Uint8Array.from(atob(v.deflate),c=>c.charCodeAt(0))));
const store=(k:string,v:unknown)=>{v=JSON.parse(JSON.stringify(v,(_k,x)=>typeof x==='bigint'?String(x):x));const e=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};if(e[k])expect(e[k]).toEqual(v);else{e[k]=v;writeFileSync(file,JSON.stringify(e,null,2)+'\n');}};
const time=(v:CanonicalValue)=>(v as {value:bigint}).value;
const capture=(r:Run)=>{const s=r.snapshot();return {at:String(s.clock),state:zip(s.state),outputs:zip(s.outputs),trace:zip(s.trace),save:hash(r.save())};};
let active:Run|undefined;
afterEach(ctx=>{if(ctx.task.result?.state==='fail'&&active){const e=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};store('failure-'+Object.keys(e).filter(k=>k.startsWith('failure-')).length,{test:ctx.task.name,...capture(active)});}active=undefined;});
function fixture(name:Parameters<typeof prior>[0],weak=false,opening=5,lateCompetitor=false,zero=false,candidate=true){
 const b=prior(name,opening);let s=lateCompetitor?changeDefinition(b.s,'definition/task-b',6n,signed(9)):b.s;
 if(candidate)s={...changeDefinition(s,'definition/task-reason-dice',2n,q(0,1)),rulesVersion:POSITIVE_ACTIVATION_RULES,registrySchemaVersion:POSITIVE_ACTIVATION_REGISTRY};
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(PRIORITY_DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=[...items(v,'list')];if(weak&&key(x[0])===key(taskB))x[3]=list([q(0,1)]);if(zero){if(items(x[1],'list').length)x[1]=list([q(0,1)]);x[3]=list([q(0,1)]);}return list(x);}))]);}return list(a);});
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows))}};
}
const reports=(r:Run,tag:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
function gate(r:Run,t:number){
 const d=outputs(r.snapshot().outputs,409n).find(v=>time(f(v,2n))===BigInt(t));expect(d,'live actual decision').toBeDefined();const compiled=rec(f(d!,3n),408n),raw=f(compiled,2n),ns=items(f(compiled,3n),'list'),res=rec(f(d!,4n),419n),kind=uint(f(res,1n)),data=kind===3n?rec(f(res,2n),420n):undefined;
 const action=data?f(rec(f(data,1n),395n),2n):undefined,probs=data?items(f(data,2n),'list').map(v=>{const p=rec(v,421n);return {action:key(f(rec(f(p,1n),395n),2n)),p:key(f(p,2n))};}):[];
 if(action)expect(outputs(r.snapshot().outputs,433n).some(v=>{const intent=rec(f(rec(f(rec(f(v,2n),432n),2n),431n),2n),425n);return key(f(intent,2n))===key(d!);}),'actual execution').toBe(true);
 const motive=reports(r,PRIORITY_MOTIVE).find(v=>uint(v[1])===BigInt(t));expect(motive,'live motive producer').toBeDefined();
 const a=items(motive![2],'list').map(v=>items(v,'list')).find(v=>key(v[0])===key(taskA));
 const state=restoreAuthoritativeState(decode(r.snapshot().state)),goal=(task:CanonicalValue)=>state.read({rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key:task}]}).value;
 const roleValues=items(f(rec(raw,403n),3n),'set').map(v=>{const s=rec(v,402n),k=rec(f(s,1n),401n);return {option:key(f(k,1n)),task:key(f(k,2n)),role:String(uint(f(k,3n))),value:key(f(s,2n))};});
 return {at:t,kind:String(kind),action:action?key(action):null,probabilities:probs,nuclei:ns.length,motiveA:a?key(a[3]):null,factor:a?key(items(a[6],'list')[5]):null,goalA:goal(taskA)?key(goal(taskA)!):null,goalB:goal(taskB)?key(goal(taskB)!):null,rawHash:hash(enc(raw)),roleValues};
}
async function run(name:string,b:ReturnType<typeof fixture>){const x=await start(b);active=x.r;const rows=[];for(const t of [3,5,7]){await through(x.r,t);rows.push(gate(x.r,t));}store(name,{...capture(x.r),rows,source:{rules:b.s.rulesVersion,registry:hash(b.s.registry),parameters:hash(b.s.parameters),initial:hash(b.d.initialState),inputs:hash(b.d.orderedInputs),seed:hash(b.d.runSeed)}});await finish(x.r);store(name+'-terminal',{clock:String(x.r.snapshot().clock),save:hash(x.r.save())});return {x,rows};}
it('activation266 weak motives reach actual choice while old control stays exact',async()=>{
 const a=await run('weak-available',fixture('available',true)),b=await run('weak-unavailable',fixture('unavailable',true));
 expect(a.rows[0].nuclei).toBe(2);expect(b.rows[0].nuclei).toBe(2);expect(a.rows[0].probabilities).not.toEqual(b.rows[0].probabilities);expect(a.rows[0].goalA).toBe(b.rows[0].goalA);expect(a.rows[2].action).toBe(key(actionA));
 const old=await start(fixture('available',true,5,false,false,false));active=old.r;const evidence=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M264_EVIDENCE.json','utf8'));
 for(const t of [3,5,7]){await through(old.r,t);const expected=evidence['available-'+t];for(const k of ['state','outputs','trace'] as const)expect(hash(old.r.snapshot()[k])).toBe(expected[k].hash);}
 await finish(old.r);expect(hash(old.r.save())).toBe(evidence['available-terminal'].save);store('old-control',{fullBytes:true,save:hash(old.r.save()),sourceCommit:'500bb84d'});
 console.info('M266 native weak motives, actual probability change and exact old0.159 control PASS');
},590000);
it('activation266 current strong zero unavailable and denied controls',async()=>{
 const a=await run('available',fixture('available')),b=await run('unavailable',fixture('unavailable')),z=await run('zero',fixture('available',false,5,false,true)),n=await run('noRoute',fixture('noRoute')),da=await run('deniedAvailable',fixture('deniedAvailable')),db=await run('deniedUnavailable',fixture('deniedUnavailable'));
 expect(a.rows[0].nuclei).toBe(2);expect(b.rows[0].nuclei).toBe(2);expect(a.rows[0].probabilities).not.toEqual(b.rows[0].probabilities);
 for(const row of z.rows){expect(row.nuclei).toBe(0);expect(row.action).toBe(null);}expect(n.rows.every(row=>row.action!==key(actionA))).toBe(true);
 expect(hash(da.x.r.snapshot().state)).toBe(hash(db.x.r.snapshot().state));expect(hash(da.x.r.snapshot().outputs)).toBe(hash(db.x.r.snapshot().outputs));
 console.info('M266 global activation preserves zero/feasibility/denied truth boundaries PASS');
},590000);
function coupled(b:ReturnType<typeof fixture>){
 const entries:TimedEntry[]=[];for(const at of [3n,5n,7n])for(const purpose of ['task-reason-face','task-standing-rounding','task-decision-tie'])for(const task of purpose==='task-decision-tie'?[undefined]:[taskA,taskB]){
  const subjectBindings=[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(C)},...(task?[{subjectRoleId:sid(1043,'subject/action'),subjectId:id(key(task)===key(taskA)?actionA:actionB)},{subjectRoleId:sid(1043,'subject/task'),subjectId:id(f(rec(task,371n),2n))}]:[])];
  entries.push({at,purposeId:sid(1042,'purpose/'+purpose),subjectBindings,comparisonDrawKey:{keyId:sid(10006,'M266/correction/'+at+'/'+purpose+'/'+key(list(subjectBindings.map(b=>list([b.subjectRoleId,b.subjectId]))))),comparisonRoleId:sid(10005,'assembled/'+purpose)}});
 }
 return {...b,d:{...b.d,orderedInputs:enc(list([timedComparisonValue(entries),...items(decode(b.d.orderedInputs),'list')]))}};
}
it('activation266 correction with expired and surviving competition',async()=>{
 const saved=JSON.parse(readFileSync(file,'utf8'));expect(saved['corrected7-false'].rows[1].action).toBe(key(actionA));expect(saved['available7-false'].rows[1].action).toBe(key(actionA));
 const inputs=[coupled(fixture('corrected',false,7,true)),coupled(fixture('available',false,7,true))];
 for(const [i,name]of ['coupled-corrected7','coupled-available7'].entries())if(!saved[name])await run(name,inputs[i]);
 const captured=JSON.parse(readFileSync(file,'utf8')),a=captured['coupled-corrected7'],b=captured['coupled-available7'];
 for(const [i,v]of [a,b].entries()){expect(v.source.registry).toBe(hash(inputs[i].s.registry));expect(v.source.inputs).toBe(hash(inputs[i].d.orderedInputs));expect(v.source.seed).toBe(hash(inputs[i].d.runSeed));}
 const draws=(value:{trace:{deflate:string}})=>outputs(unzip(value.trace),160n).filter(v=>time(f(rec(f(v,4n),130n),2n))===3n).flatMap(v=>items(f(v,14n),'list')).map(randomDrawRecord);
 const ad=draws(a),bd=draws(b);expect(ad.length).toBeGreaterThanOrEqual(2);expect(bd.length).toBe(ad.length);for(const d of ad){const other=bd.find(v=>key(f(v,2n))===key(f(d,2n)));expect(other,'shared effective key').toBeDefined();for(const field of [3n,4n,5n,6n,7n])expect(f(other!,field)).toEqual(f(d,field));}
 expect(a.rows[0].motiveA).toBe(b.rows[0].motiveA);expect(a.rows[0].action,'same actual prior choice').toBe(b.rows[0].action);expect(a.rows[1].motiveA).toBe(key(q(1,1)));expect(b.rows[1].motiveA).toBe(key(q(1,4)));
 expect(a.rows[1].roleValues.filter((v:{task:string;role:string})=>!(v.task===key(taskA)&&v.role==='1'))).toEqual(b.rows[1].roleValues.filter((v:{task:string;role:string})=>!(v.task===key(taskA)&&v.role==='1')));expect(a.rows[1].probabilities).not.toEqual(b.rows[1].probabilities);
 store('correction-coupling',{matchedDraws3:ad.length,priorAction:a.rows[0].action,probabilityChanged5:true,fixedKey:'M266/correction'});console.info('M266 shared prior dice/history; correction changes probability with surviving competitor PASS');
},590000);
it('activation266 closed admission trace disclosure persistence and late rollback',async()=>{
 const b=fixture('corrected',false,7,true),m=await compileCharacterModel(b.s);expect(m.positiveActivation).toBe(true);expect(f(rec(definition(b.s),437n),2n)).toEqual(q(0,1));store('candidate-configuration',{rules:b.s.rulesVersion,registry:b.s.registrySchemaVersion,dice:zip(enc(definition(b.s))),arbitration:zip(enc(definition(b.s,'task-arbitration'))),model:key(m.modelIdentity.value)});
 await expect(compileCharacterModel({...b.s,registrySchemaVersion:ATTEMPT_RECEIPT_REGISTRY})).rejects.toThrow('version bundle');await expect(compileCharacterModel(changeDefinition(b.s,'definition/task-reason-dice',2n,q(37,100)))).rejects.toThrow('exactly zero');await expect(compileCharacterModel({...changeDefinition(prior('available').s,'definition/task-reason-dice',2n,q(0,1))})).rejects.toThrow();
 const a=await start(b),repeat=await start(b);active=a.r;await through(a.r,3);await through(repeat.r,3);expect(hash(a.r.save())).toBe(hash(repeat.r.save()));
 const restored=cachedMemory(await restorePreparedCharacterRun(a.m,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.r.save()})),old=await prepareCharacterModel(fixture('corrected',false,7,true,false,false).s);await expect(restorePreparedCharacterRun(old,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.r.save()})).rejects.toThrow();
 const traces=outputs(a.r.snapshot().trace,160n),stages=traces.filter(t=>key(f(t,6n))===key(text(POSITIVE_ACTIVATION_VERSION)));expect(stages.length).toBeGreaterThanOrEqual(2);expect(stages.some(v=>items(f(v,13n),'list').some(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(REASON_SOURCE_REPORT))))).toBe(true);
 const clocks=[];for(let n=0;n<128;n++){const more=await a.r.settleNextInstant();expect(await repeat.r.settleNextInstant()).toBe(more);expect(await restored.settleNextInstant()).toBe(more);for(const r of [repeat.r,restored]){for(const k of ['state','outputs','trace'] as const)expect(hash(r.snapshot()[k])).toBe(hash(a.r.snapshot()[k]));expect(hash(r.save())).toBe(hash(a.r.save()));}clocks.push(String(a.r.snapshot().clock));if(!more)break;if(n===127)throw Error('queue cap');}
 const unique=(at:number)=>[...new Set(traces.filter(v=>time(f(rec(f(v,4n),130n),2n))===BigInt(at)).map(v=>String(uint(f(rec(f(v,4n),130n),1n)))))],limit=unique(3).length-1;expect(limit).toBeGreaterThan(unique(1).length);
 const fault={r:cachedMemory(await createCharacterRun(await prepareCharacterModel(workLimit(b.s,BigInt(limit))),b.d))};const priorClocks=[...new Set(traces.map(v=>Number(time(f(rec(f(v,4n),130n),2n)))).filter(t=>t<3))].sort((a,b)=>a-b);for(const at of priorClocks)await through(fault.r,at);const before=fault.r.snapshot();expect(before.clock).toBe(2n);await expect(fault.r.settleNextInstant()).rejects.toThrow();const after=fault.r.snapshot();for(const k of ['clock','state','outputs','trace'] as const)expect(after[k]).toEqual(before[k]);
 store('boundaries',{...capture(a.r),clocks,repeat:true,restore:true,traceVersion:POSITIVE_ACTIVATION_VERSION,oldSaveRejected:true,rollback:{limit,clock:String(before.clock),pass:true}});console.info('M266 admission/trace/persistence/late rollback PASS');
},590000);
