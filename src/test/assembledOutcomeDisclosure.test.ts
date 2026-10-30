import {it,expect} from 'vitest';
import {list,text,unsigned,rational as q,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,PROCEDURES_RULES,PROCEDURES_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {FROZEN,SIGNAL,RECEIVED,knowledgePath,history,OUTCOME_TOPIC,KNOWLEDGE_OWNER} from '../assembled/communication';
import {BODY_DELIVERY} from '../assembled/body';
import {C} from './fixtures/campaign2Cognitive';
import {outcomePath,PERFORMANCE_OBS} from '../assembled/performance';
import {SKILL_ACTUAL,SKILL_OWNER,sid} from '../assembled/skill';
import {dataRecord as rec,dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
import {outputs} from './fixtures/assembledInteraction';
import {workLimit} from './fixtures/assembledCharacter';
import {outcomeSource,outcomeData,topic,decode,items,key,enc} from './fixtures/assembledOutcomeDisclosure';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const recipients=items(items(items(decode(outcomeSource().registry),'list')[18],'list')[2],'list');
const received=(r:Run,i=0)=>state(r).read(knowledgePath(recipients[i])).value;
const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('signed time');return v.value;};
async function through(r:Run,t:bigint){let n=0;while(r.snapshot().clock<t){expect(++n).toBeLessThanOrEqual(32);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(t);}
async function finish(r:Run){let n=0;while(await r.settleNextInstant())expect(++n).toBeLessThanOrEqual(32);expect(r.snapshot().clock).toBe(10n);expect(r.diagnostic()).toBeUndefined();}
const exact=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
const claims=(r:Run)=>reports(r,FROZEN).map(x=>x[4]);
function automatic(r:Run){const ds=outputs(r.snapshot().outputs,409n);expect(ds).toHaveLength(3);for(const x of ds){const c=rec(f(rec(f(x,4n),419n),2n),420n);expect(uint(f(c,8n))).toBe(1n);expect(f(c,3n)).toEqual(q(1,1));expect(f(c,9n)).toEqual(list([]));for(const p of items(f(c,2n),'list'))expect(f(rec(p,421n),2n)).toEqual(q(1,1));}expect(outputs(r.snapshot().trace,160n).flatMap(t=>items(f(t,14n),'list'))).toEqual([]);}
it('positive: prior observed result reaches a recipient independently of current physical success',async()=>{
 const m=await prepareCharacterModel(outcomeSource()),runs:Run[]=[];
 for(const success of [false,true]){const r=await createCharacterRun(m,outcomeData(success));await finish(r);runs.push(r);automatic(r);expect(reports(r,SKILL_ACTUAL).map(x=>x[7])).toEqual([false,false,true]);expect(claims(r)).toEqual([list([]),list([success]),list([success])]);expect(reports(r,SIGNAL).map(x=>x[5])).toEqual([false,false,true]);expect(history(received(r))).toHaveLength(1);const observed=items(history(received(r))[0],'list');expect(observed[3]).toEqual(list([success]));expect(observed[4]).toEqual(topic());expect(received(r,1)).toBeUndefined();
  const task=items(topic(),'list')[1],source=reports(r,PERFORMANCE_OBS).find(x=>uint(x[2])===3n&&key(x[3])===key(task))!;
  const ts=outputs(r.snapshot().trace,160n).filter(t=>key(f(t,6n))===key(text('assembled-character-outcome-disclosure/0.1-candidate'))&&uint(f(rec(f(t,4n),130n),3n))===90n);expect(ts).toHaveLength(3);
  for(const t of ts){expect(items(f(t,11n),'list')).toHaveLength(1);expect(f(rec(items(f(t,11n),'list')[0],147n),2n)).toEqual(statePathValue(outcomePath(task)));expect(f(t,9n)).toEqual(at(f(rec(f(t,4n),130n),2n))===3n?list([]):list([source[1]]));}
  const journal=items(items(state(r).read(outcomePath(task)).value!,'list')[1],'list');expect(items(journal.at(-1)!,'list')[6]).toBe(true);console.info('M28 witness '+JSON.stringify({report:success,actual:[false,false,true],claims:['unknown',success,success],deliveredAt:7,recipientB:'absent',draws:0,terminal:10}));
 }
 for(const t of [409n,425n,426n])expect(outputs(runs[0].snapshot().outputs,t)).toEqual(outputs(runs[1].snapshot().outputs,t));
},180000);
it('privacy: missing and misleading feedback, route isolation, hidden practice and delivery gates',async()=>{
 const m=await prepareCharacterModel(outcomeSource()),run=async(o:Parameters<typeof outcomeData>[1],model=m)=>{const r=await createCharacterRun(model,outcomeData(false,o));await finish(r);return r;};
 const absent=await run({visible:false}),hidden=await run({visible:false,permitted:false});expect(reports(absent,SKILL_ACTUAL).at(-1)![7]).toBe(true);expect(reports(hidden,SKILL_ACTUAL).at(-1)![7]).toBe(false);
 for(const r of [absent,hidden]){expect(claims(r)).toEqual([list([]),list([]),list([])]);expect(received(r)).toBeUndefined();}
 for(const t of [381n,384n,394n,398n,403n,408n,409n,425n,426n])expect(outputs(absent.snapshot().outputs,t)).toEqual(outputs(hidden.snapshot().outputs,t));
 const missing=await run({missingA:true});expect(claims(missing)).toEqual([list([]),list([]),list([])]);expect(received(missing)).toBeUndefined();expect(reports(missing,PERFORMANCE_OBS).some(x=>uint(x[2])===5n)).toBe(true);
 const other=await run({},await prepareCharacterModel(outcomeSource(topic(true))));expect(claims(other)).toEqual([list([]),list([]),list([false])]);expect(items(history(received(other))[0],'list')[4]).toEqual(topic(true));
 for(const o of [{delivery:false},{access:false}]){const r=await run(o);expect(claims(r)).toEqual([list([]),list([false]),list([false])]);expect(received(r)).toBeUndefined();expect(received(r,1)).toBeUndefined();}
 console.info('M28 hidden physical/unknown/other-route/current-feedback/delivery/access PASS');
},360000);
it('persistence: repeat and restores3/5 at every later settled instant',async()=>{
 const s=outcomeSource(),d=outcomeData(true),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,3n);await through(b,3n);exact(a,b);const c=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,c);
 while(a.snapshot().clock<5n){expect(await a.settleNextInstant()).toBe(true);for(const r of [b,c]){expect(await r.settleNextInstant()).toBe(true);exact(a,r);}}const e=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,e);while(await a.settleNextInstant())for(const r of [b,c,e]){expect(await r.settleNextInstant()).toBe(true);exact(a,r);}expect(a.snapshot().clock).toBe(10n);expect(history(received(a))).toHaveLength(1);console.info('M28 exact repeat/restores3/5 whole-tail PASS');
},240000);
it('admission: topics, historical versions, owners and late transactional rollback',async()=>{
 const s=outcomeSource(),d=outcomeData(),m=await prepareCharacterModel(s),x=items(topic(),'list');for(const bad of [list(x.slice(0,2)),list([x[0],x[1],unsigned(2)]),list([x[0],sid(1027,'foreign'),x[2]]),list([text('foreign'),...x.slice(1)])])await expect(prepareCharacterModel(outcomeSource(bad))).rejects.toThrow();
 await expect(prepareCharacterModel({...s,rulesVersion:PROCEDURES_RULES,registrySchemaVersion:PROCEDURES_REGISTRY})).rejects.toThrow('topic');
 const compiled=await compileCharacterModel(s),component=await compileCharacterState(compiled),initial=component.initialState(d.initialState),path=knowledgePath(recipients[0]),o=list([typedIdentifier(1168,unsigned(9999)),recipients[0],signed(7),list([true]),topic()]),value=list([o]),patch={operations:[{kind:'set' as const,path,expected:{presence:false as const},newValue:value}]};expect(()=>component.stateModel.applyPatch(initial,patch,SKILL_OWNER)).toThrow();expect(()=>component.stateModel.applyPatch(initial,patch,KNOWLEDGE_OWNER)).not.toThrow();const wrong=list([...items(o,'list').slice(0,4),topic(true)]);expect(()=>component.stateModel.validateState(new AuthoritativeState([...initial.entries(),{path,value:list([wrong])}]))).toThrow('topic');await expect(createCharacterRun(m,{...d,initialState:enc(new AuthoritativeState([...initial.entries(),{path,value}]).canonicalValue())})).rejects.toThrow('initial');
 // Fault-only fixture: eight admitted zero deliveries make7 strictly busier than prior instants.
 const faultData={...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),...Array.from({length:8},()=>list([signed(7),unsigned(110),BODY_DELIVERY,list([C,q(0,1)]),list([])]))]))};
 const oracle=await createCharacterRun(m,faultData);await through(oracle,7n);expect(history(received(oracle))).toHaveLength(1);const count=new Set(outputs(oracle.snapshot().trace,160n).filter(t=>at(f(rec(f(t,4n),130n),2n))===7n).map(t=>key(f(rec(f(t,4n),130n),1n)))).size,failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(count-1))),faultData);const priorCounts=new Map<bigint,Set<string>>();for(const t of outputs(oracle.snapshot().trace,160n)){const e=rec(f(t,4n),130n),time=at(f(e,2n));if(time<7n){const ids=priorCounts.get(time)??new Set<string>();ids.add(key(f(e,1n)));priorCounts.set(time,ids);}}expect(Math.max(...[...priorCounts.values()].map(s=>s.size))).toBeLessThanOrEqual(count-1);await through(failed,6n);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow('work ceiling');expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(received(failed)).toBeUndefined();console.info('M28 late7 rollback events='+count+' cap='+(count-1));
},180000);
