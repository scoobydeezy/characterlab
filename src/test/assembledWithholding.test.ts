import {it,expect} from 'vitest';
import {fixture,action,start,state,labels,through,at,decode,items,key,enc,list,text,u,signed,C,rec,f,uint,outputs,bytes,exact,type Run} from './fixtures/assembledWithholding';
import {CONTROL_VIEW,CONTROL_OPTIONS} from '../assembled/control';
import {compileCharacterModel,SLEEP_LOAD_RULES,SLEEP_LOAD_REGISTRY} from '../assembled/model';
import {restoreCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {planOutput,executionOutput} from '../assembled/choice';
import {ACTION_BODY,selectedBodyEffect,compileActionBody} from '../assembled/actionBody';
import {skillPath,skillValue,SKILL_ACTUAL,sid} from '../assembled/skill';
import {ExactRational as Q} from '../substrate/exactMath';
import {record,set,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('record');return record(v.schema,new Map([...v.fields].map(([k,y])=>[k,k===n?x:y])));};
const cv=(r:Run,t:number)=>labels(r,CONTROL_VIEW).find(v=>uint(v[1])===BigInt(t))!;
const eventAt=(t:CanonicalValue)=>at(f(rec(f(rec(t,160n),4n),130n),2n));
const decision=(r:Run,t:number)=>outputs(r.snapshot().outputs,409n).find(v=>at(f(v,2n))===BigInt(t))!;
function chosen(r:Run,t:number){const d=decision(r,t);expect(d).toBeDefined();const result=rec(f(d,4n),419n);return uint(f(result,1n))===3n?f(rec(f(rec(f(result,2n),420n),1n),395n),2n):undefined;}
function live(r:Run,t:number){const v=cv(r,t);expect(v).toBeDefined();expect(v[2]).toBe(true);expect(v[3]).toBe(true);expect(v[9]).toBe(true);expect(uint(v[8])).toBeGreaterThanOrEqual(1n);const report=labels(r,CONTROL_OPTIONS).find(x=>uint(x[1])===BigInt(t))!;expect(report).toBeDefined();expect(items(report[3],'list').length).toBeGreaterThan(0);}
it('admission211 zero action is versioned and cannot produce body effects',async()=>{
 const b=fixture(),m=await compileCharacterModel(b.s);expect(m.withholdingEnabled).toBe(true);expect(m.actionBody!.entries.find(e=>key(e.action)===key(action))).toMatchObject({count:0n,delay:0n});
 await expect(compileCharacterModel({...b.s,rulesVersion:SLEEP_LOAD_RULES,registrySchemaVersion:SLEEP_LOAD_REGISTRY})).rejects.toThrow('action domain/version');
 const slots=items(decode(b.s.registry),'list'),defs=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,2n))===key(sid(1023,'registry/protocol-action'))).map(v=>({action:f(rec(v,171n),1n),definition:f(rec(v,171n),4n)}));
 const act=items(slots[10],'list');for(const [amount,delay] of [[1,0],[0,1]]){const v=list([act[0],act[1],set(items(act[2],'set').map(v=>key(items(v,'list')[0])===key(action)?list([action,q(amount,1),u(delay)]):v))]);expect(()=>compileActionBody(v,Q.of(100n),defs,true,true)).toThrow('zero amount/delay');}
 console.info('M211 ADMISSION PASS current zero/no-effect action admitted; prior version and nonzero actuator/delay rejected');
},180000);
it('native211 explicit withholding survives continuation without movement learning',async()=>{
 const b=fixture();expect(f(rec(f(items(items(decode(b.s.registry),'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n)).find(v=>key(f(v,1n))===key(sid(1027,'definition/protocol-observation')))!,4n),451n),4n)).toBe(true);const x=await start(b),repeat=await start(fixture());for(const r of [x.run,repeat.run])await through(r,12n);exact(x.run,repeat.run);const before=state(x.run);expect(skillValue(before.read(skillPath(C,b.procedure)).value,b.procedure,true).K.numerator).toBeGreaterThan(0n);
 const restored=cachedMemory(await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:x.run.save()}));exact(x.run,restored);
 for(const r of [x.run,restored])await through(r,14n);exact(x.run,restored);live(x.run,14);expect(chosen(x.run,14)).toEqual(action);
 const traces=outputs(x.run.snapshot().trace,160n).filter(t=>eventAt(t)===14n),out=(type:bigint)=>traces.map(t=>f(t,13n)).filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
 const plans=out(431n),executions=out(433n);expect(plans).toHaveLength(1);expect(uint(f(plans[0],3n))).toBe(0n);expect(executions).toHaveLength(1);expect(uint(f(executions[0],3n))).toBe(0n);
 const effects=traces.flatMap(t=>{const v=f(t,13n);return typeof v!=='boolean'&&v.kind==='list'?v.items:[];}).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(ACTION_BODY))).map(v=>items(v,'list'));
 expect(effects).toHaveLength(1);expect(effects[0][3]).toEqual(action);expect(effects[0][5]).toEqual(text('Withheld'));expect(items(effects[0][6],'list')).toEqual([]);
 const skill=traces.flatMap(t=>{const v=f(t,13n);return typeof v!=='boolean'&&v.kind==='list'?v.items:[];}).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(SKILL_ACTUAL))).map(v=>items(v,'list'));expect(skill.length).toBeGreaterThan(0);for(const s of skill){expect(s[6]).toBe(false);expect(s[8]).toBe(false);}
 expect(traces.some(t=>key(f(rec(f(t,4n),130n),5n))===key(sid(1001,'event/protocol-experience')))).toBe(true);
 const intent=f(plans[0],2n),positive=planOutput(f(plans[0],1n),intent,replace(f(items(items(decode(b.s.registry),'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n)).find(v=>key(f(v,1n))===key(action))!,4n),1n,u(1))),attempt=replace(f(executions[0],2n),2n,positive),failed=rec(executionOutput(f(executions[0],1n),attempt,false),433n);expect(uint(f(rec(f(rec(f(failed,2n),432n),2n),431n),3n))).toBe(1n);expect(uint(f(failed,3n))).toBe(0n);
 expect(()=>planOutput(f(plans[0],1n),intent,replace(f(items(items(decode(b.s.registry),'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n)).find(v=>key(f(v,1n))===key(action))!,4n),1n,u(0)))).toThrow();
 for(const r of [x.run,restored])await through(r,16n);exact(x.run,restored);live(x.run,16);expect(chosen(x.run,16)).toEqual(action);
 console.info('M211 NATIVE PASS actual chosen zero request, full intent/plan/attempt/execution/C1 consequence, no physical effect or practice; failed positive request distinct; repeat12 and exact continuation12->14->16');
},600000);
it('absent211 inhibition does not invent a withholding option',async()=>{const x=await start(fixture(false));await through(x.run,14n);live(x.run,14);expect(chosen(x.run,14)).toBeUndefined();console.info('M211 ABSENT PASS both declared routes unavailable for B; A inhibited; no chosen action, no synthetic withhold');},300000);
