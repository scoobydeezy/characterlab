import {changeDefinition} from './fixtures/assembledCharacter';
import {it,expect,vi} from 'vitest';
import {start,fixture,names,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,at,sid,type Case,type CanonicalValue} from './fixtures/assembledExecutionCriterion';
import {campaign2Record as cr} from '../campaign2/codecs';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {characterEvidenceRefValue} from '../semanticBinding/semanticEvidenceCodecs';
import {STRATEGY_EVAL} from '../assembled/strategy';
import {PRIORITY_MOTIVE} from '../assembled/priority';
import {ACTION_BODY} from '../assembled/actionBody';
import {compileLearningProtection} from '../assembled/learningProtection';
import {safe} from './assembledIntoxicationCohort.test';
import {restorePreparedCharacterRun,createCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import * as trace from '../substrate/trace';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Exact hashes.
import {createHash} from 'node:crypto';
// @ts-expect-error Lossless evidence.
import {deflateSync,inflateSync} from 'node:zlib';
type X=Awaited<ReturnType<typeof start>>;
const file='docs/planning/ASSEMBLED_CHARACTER_M237_EVIDENCE.json',saved=()=>JSON.parse(readFileSync(file,'utf8'));
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

const actualAt=(outputs:readonly CanonicalValue[],t:bigint)=>records(outputs,433n).map(v=>rec(v,433n)).find(v=>{const attempt=rec(f(v,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n);return at(f(rec(f(intent,2n),409n),2n))===t;});
async function runCase(name:Case){
 const x=await start(name),completes=name==='permitted'||name==='external',rows:any[]=[];let checkpoint:ReturnType<typeof zip>|undefined,instruction:string|undefined,decision3:string|undefined,world3:unknown;
 for(const t of [1,2,3,...(x.b.silent?[]:[4]),5]){
  await through(x.run,BigInt(t));const outputs=out(x);
  if(t===1){const o=rec(records(outputs,203n).find(v=>at(f(rec(v,203n),5n))===1n)!,203n);expect(key(f(rec(f(o,6n),204n),2n))).toBe(key(q(5,1)));continue;}
  expect(status(x)).toBe(completes&&t>=4?2:1);const ins=key(state(x).read(path(x,2n)).value!);if(instruction)expect(ins).toBe(instruction);else instruction=ins;
  if(t===3){const actual=actualAt(outputs,3n);if(x.b.external)expect(actual).toBeUndefined();else{expect(actual).toBeDefined();expect(uint(f(actual!,3n))).toBe(x.b.permitted?2n:0n);const plan=rec(f(rec(f(actual!,2n),432n),2n),431n);expect(uint(f(plan,3n))).toBe(2n);const effects=tagged(outputs,ACTION_BODY).filter(v=>key(v[1])===key(f(actual!,1n)));expect(effects).toHaveLength(1);expect(key(effects[0][5])).toBe(key(text(x.b.permitted?'Applied':'Blocked')));const fact=named(x,'event/protocol-actual-fact',3n);expect(fact).toHaveLength(1);const produced=rec(f(fact[0],13n),307n);expect(uint(f(rec(f(produced,2n),305n),3n))).toBe(x.b.permitted?2n:0n);}
   const ap={rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey' as const,key:cr('RegulatoryAdaptationKey',{CharacterId:C,RegulatoryVariableId:sid(1029,'variable/fixture-regulation')})}]},a=state(x).read(ap).value,displacement=a?at(f(rec(a,299n),1n)):0n;expect(displacement).toBe(x.b.permitted||x.b.external?2n:0n);world3={actual:actual?key(actual):null,adaptation:a?key(a):null,displacement:Number(displacement)};
   if(name==='permitted')checkpoint=zip(x.run.save());
  }
  if(t===4){const o=rec(records(outputs,203n).find(v=>at(f(rec(v,203n),5n))===4n)!,203n);expect(key(f(rec(f(o,6n),204n),2n))).toBe(key(q(completes?52:50,10)));
   const m1=rec(records(outputs,342n).find(v=>key(f(rec(f(rec(v,342n),2n),337n),2n))===key(o))!,342n);expect(m1).toBeDefined();const memory=state(x).entries().filter(e=>e.path.rootStateTypeId===346n&&e.path.fieldId===1n&&typeof e.value!=='boolean'&&e.value.kind==='record'&&e.value.schema.typeId===345n);expect(memory).toHaveLength(2);expect(memory.some(e=>key(f(rec(e.value,345n),1n))===key(m1))).toBe(true);
   const prediction=named(x,'event/measurement-prediction-application',4n);expect(prediction).toHaveLength(1);expect(key(f(prediction[0],12n))).toBe(key(m1));expect(items(f(prediction[0],17n),'list')).toHaveLength(1);
   const settlement=named(x,'event/task-measurement-settlement',4n);expect(settlement).toHaveLength(1);expect(key(f(settlement[0],12n))).toBe(key(m1));expect(items(f(settlement[0],17n),'list')).toHaveLength(completes?1:0);
   if(completes){expect(key(f(rec(goal(x),372n),2n))).toBe(key(characterEvidenceRefValue({kind:'observation',observationId:uint((f(o,1n) as Extract<CanonicalValue,{kind:'typedIdentifier'}>).payload)})));expect(at(f(rec(goal(x),372n),3n))).toBe(4n);}
  }
  if([2,3,5].includes(t)&&!(t===3&&x.b.external)){
   const d=rec(records(outputs,409n).find(v=>at(f(rec(v,409n),2n))===BigInt(t))!,409n),ds=rec(f(d,4n),419n),chosen=uint(f(ds,1n))===3n?rec(f(ds,2n),420n):undefined,action=chosen?x.b.actions.findIndex(a=>key(a)===key(f(rec(f(chosen,1n),395n),2n))):-1,acts=t>2&&!x.b.external&&!(completes&&t>=4);
   const motive=tagged(outputs,PRIORITY_MOTIVE).find(v=>uint(v[1])===BigInt(t))!,m=items(motive[2],'list').find(v=>key(items(v,'list')[0])===key(x.b.task)),strength=m?items(m,'list')[3]:q(0,1);expect(action).toBe(acts?0:-1);
   if(acts){expect(typeof strength!=='boolean'&&strength.kind==='rational'&&strength.numerator>0n).toBe(true);expect(items(f(rec(f(d,3n),408n),3n),'list').length).toBeGreaterThan(0);expect(items(f(chosen!,2n),'list')).toHaveLength(1);expect(key(f(rec(items(f(chosen!,2n),'list')[0],421n),2n))).toBe(key(q(1,1)));}
   if(t===5&&completes){expect(key(strength)).toBe(key(q(0,1)));expect(items(f(rec(f(d,3n),408n),3n),'list')).toHaveLength(0);const consumed=named(x,'event/deliberation-opportunity',5n).flatMap(r=>items(f(r,11n),'list')).map(v=>rec(v,147n)).find(r=>key(f(r,2n))===key(statePathValue(path(x))));expect(consumed).toBeDefined();expect(key(f(consumed!,4n))).toBe(key(goal(x)));}
   rows.push({at:t,status:status(x),action,strength:key(strength)});if(t===3)decision3=key(d);
  }
 }
 expect(traces(x).flatMap(r=>items(f(r,14n),'list'))).toHaveLength(0);
 let done=false;for(let n=0;n<48;n++)if(!await x.run.settleNextInstant()){done=true;break;}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);expect(status(x)).toBe(completes?2:3);
 put(name,{rows,world3,decision3,goal:key(goal(x)),checkpoint,terminal:hash(x.run.save()),registry:hash(x.b.s.registry),initial:hash(x.b.d.initialState),inputs:hash(x.b.d.orderedInputs),noDraws:true});
}
for(const name of names)it('goal237 native '+name,()=>runCase(name),230000);
it('goal237 source boundaries and physical model contrast',async()=>{
 const d=saved(),a=fixture('permitted'),b=fixture('denied');bytes(a.d.orderedInputs,b.d.orderedInputs);bytes(a.d.initialState,b.d.initialState);bytes(a.d.runSeed,b.d.runSeed);expect(d.permitted.decision3).toBe(d.denied.decision3);expect(d.permitted.registry).not.toBe(d.denied.registry);
 const normalized=changeDefinition(b.s,'definition/protocol-execution',1n,true);bytes(a.s.registry,normalized.registry);
 const x=await start('permitted'),forged=list([signed(6),u(140),sid(1001,'event/task-measurement-settlement'),list([]),list([])]);await expect(createCharacterRun(x.m,{...x.b.d,orderedInputs:enc(list([...items(decode(x.b.d.orderedInputs),'list'),forged]))})).rejects.toThrow('original kind');
 const references=Object.fromEntries([231,233,234,235,236].map(n=>[n,hash(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M'+n+'_EVIDENCE.json'))]));put('controls',{references,identicalInputsAndDecision:true,onlyPhysicalPermissionDefinitionChanged:true,forgedSettlementRejected:true,originalChangingBlockageMapped:false});
},180000);
it('goal237 fulfillment rollback and continuation',async()=>{
 const x=await start('permitted');await through(x.run,3n);const save=x.run.save(),old=saved().permitted;bytes(save,unzip(old.checkpoint.deflate));const restore=async()=>cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save})),bad=await restore(),before=bad.snapshot(),write=trace.traceRecordValue;let hit=false;
 const spy=vi.spyOn(trace,'traceRecordValue').mockImplementation(v=>{if(v.event.dueAt===4n&&key(v.event.eventTypeId)===key(sid(1001,'event/task-measurement-settlement'))&&v.statePatch.operations.some(o=>o.path.rootStateTypeId===373n)){expect(v.structuralMutationDiffs).toHaveLength(1);hit=true;throw Error('M237 after fulfillment');}return write(v);});
 try{await expect(bad.settleNextInstant()).rejects.toThrow('M237 after fulfillment');expect(hit).toBe(true);expect(bad.snapshot().clock).toBe(before.clock);for(const k of ['state','outputs','trace']as const)bytes(bad.snapshot()[k],before[k]);expect(()=>bad.save()).toThrow('active quiescent');}finally{spy.mockRestore();}
 const recovered=await restore();exact(x.run,recovered);let done=false;for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();expect(await recovered.settleNextInstant()).toBe(more);expect(recovered.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[4n,5n,101n].includes(x.run.snapshot().clock))exact(x.run,recovered);if(!more){done=true;break;}}expect(done).toBe(true);expect(hash(x.run.save())).toBe(old.terminal);put('rollback',{reached:hit,checkpoint:hash(save),terminal:hash(x.run.save()),failedRunReusable:false});
},440000);
