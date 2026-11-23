import {it,expect,vi} from 'vitest';
import {start,fixture,names,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,at,sid,type Case,type CanonicalValue} from './fixtures/assembledGoalFulfillmentCurrent';
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
const file='docs/planning/ASSEMBLED_CHARACTER_M232_EVIDENCE.json',saved=()=>JSON.parse(readFileSync(file,'utf8'));
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
async function runCase(name:Case){
 const x=await start(name),fulfillAt=x.b.hidden||x.b.noRoute&&x.b.count===0?Infinity:x.b.count>0?5:7,rows:any[]=[];let checkpoint:ReturnType<typeof zip>|undefined,fulfilled:string|undefined,instruction:string|undefined;
 for(const t of [1,2,3,4,...(x.b.hidden?[]:[5]),6,...(x.b.hidden?[]:[7]),8]){
  await through(x.run,BigInt(t));const outputs=out(x);if(t===1){const o=rec(records(outputs,203n).find(v=>at(f(rec(v,203n),5n))===1n)!,203n);expect(key(f(rec(f(o,6n),204n),2n))).toBe(key(q(5,1)));continue;}
  if(t===3&&!x.b.noRoute){const actual=named(x,'event/protocol-actual-fact',3n);expect(actual).toHaveLength(1);const a=named(x,'event/regulatory-adaptation',3n);expect(a).toHaveLength(1);expect(items(f(a[0],17n),'list').length).toBeGreaterThan(0);}
  if(t===4){const ap={rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey' as const,key:cr('RegulatoryAdaptationKey',{CharacterId:C,RegulatoryVariableId:sid(1029,'variable/fixture-regulation')})}]},ev=rec(records(outputs,325n).find(v=>key(f(rec(v,325n),4n))===key(statePathValue(ap)))!,325n),definition=items(items(decode(x.b.s.registry),'list')[0],'set').find(v=>key(f(rec(v,171n),1n))===key(f(ev,3n)))!;expect(at(f(rec(f(rec(definition,171n),4n),311n),6n))).toBe(1n);const value=state(x).read(ap).value,total=(x.b.noRoute?0:1)+x.b.count;if(total)expect(at(f(rec(value!,299n),1n))).toBe(BigInt(total));else expect(value).toBeUndefined();}
  const g=status(x),expected=t>=fulfillAt?2:1;console.info('M232 status',name,t,g);expect(g).toBe(expected);
  const ins=key(state(x).read(path(x,2n)).value!);if(instruction)expect(ins).toBe(instruction);else instruction=ins;
  if(g===2){if(fulfilled)expect(key(goal(x))).toBe(fulfilled);else fulfilled=key(goal(x));}
  const observation=records(outputs,203n).find(v=>at(f(rec(v,203n),5n))===BigInt(t)&&[5,7].includes(t));
  if([5,7].includes(t)){
   expect(observation).toBeDefined();const o=rec(observation!,203n);expect(key(f(rec(f(o,6n),204n),2n))).toBe(key(q(x.b.noRoute?50+x.b.count:t===5?51+x.b.count:52,10)));
   const settlement=named(x,'event/task-measurement-settlement',BigInt(t));expect(settlement).toHaveLength(1);
   const diffs=items(f(settlement[0],17n),'list').map(v=>rec(v,148n));expect(diffs).toHaveLength(t===fulfillAt?1:0);
   if(t===fulfillAt){expect(key(f(diffs[0],1n))).toBe(key(statePathValue(path(x))));expect(key(f(diffs[0],5n))).toBe(key(goal(x)));expect(key(f(rec(goal(x),372n),2n))).toBe(key(characterEvidenceRefValue({kind:'observation',observationId:uint((f(o,1n) as Extract<CanonicalValue,{kind:'typedIdentifier'}>).payload)})));expect(at(f(rec(goal(x),372n),3n))).toBe(BigInt(fulfillAt));}
  }
  if([2,3,6,8].includes(t)){
   const d=rec(records(outputs,409n).find(v=>at(f(rec(v,409n),2n))===BigInt(t))!,409n),ds=rec(f(d,4n),419n),chosen=uint(f(ds,1n))===3n?rec(f(ds,2n),420n):undefined;
   const a=chosen?x.b.actions.findIndex(a=>key(a)===key(f(rec(f(chosen,1n),395n),2n))):-1,shouldAct=t!==2&&!x.b.noRoute&&t<fulfillAt;
   const motive=tagged(outputs,PRIORITY_MOTIVE).find(v=>uint(v[1])===BigInt(t))!,m=items(motive[2],'list').find(v=>key(items(v,'list')[0])===key(x.b.task)),strength=m?items(m,'list')[3]:q(0,1);
   const strategy=tagged(outputs,STRATEGY_EVAL).find(v=>uint(v[2])===BigInt(t))!,selected=items(strategy[3],'list').find(v=>key(items(v,'list')[0])===key(x.b.task));
   expect(a).toBe(shouldAct?(x.b.hidden&&t===8?1:0):-1);if(x.b.hidden&&t===8){const row=items(selected!,'list'),monitor=items(row[3],'list');expect(uint(row[1])).toBe(1n);expect(uint(monitor[5])).toBe(2n);expect(monitor[6]).toBe(true);const history=items(items(monitor[7],'list')[1],'list');expect(history).toHaveLength(2);expect(history.every(v=>items(v,'list')[6]===false)).toBe(true);}if(shouldAct){expect(typeof strength!=='boolean'&&strength.kind==='rational'&&strength.numerator>0n).toBe(true);expect(items(f(rec(f(d,3n),408n),3n),'list').length).toBeGreaterThan(0);expect(items(f(chosen!,2n),'list')).toHaveLength(1);expect(key(f(rec(items(f(chosen!,2n),'list')[0],421n),2n))).toBe(key(q(1,1)));}
   if(t>=fulfillAt){const reads=named(x,'event/deliberation-opportunity',BigInt(t)).flatMap(v=>items(f(v,11n),'list')).map(v=>rec(v,147n));const read=reads.find(v=>key(f(v,2n))===key(statePathValue(path(x))));expect(read).toBeDefined();expect(f(read!,3n)).toBe(true);expect(key(f(read!,4n))).toBe(key(goal(x)));expect(selected).toBeUndefined();expect(key(strength)).toBe(key(q(0,1)));expect(items(f(rec(f(d,3n),408n),3n),'list')).toHaveLength(0);}
   rows.push({at:t,status:g,action:a,strength:key(strength),plan:selected?key(selected):null});
  }
  if(t===4&&name==='revealed1')checkpoint=zip(x.run.save());
 }
 const effects=tagged(out(x),ACTION_BODY);expect(effects).toHaveLength(x.b.noRoute?0:fulfillAt===5?1:fulfillAt===7?2:3);expect(effects.every(a=>key(a[5])===key(text('Blocked')))).toBe(true);
 const closure=compileLearningProtection(items(decode(x.b.s.registry),'list')[49],decode(x.b.s.registry));
 const protectedState=zip(enc(closure.state(decode(x.run.snapshot().state)))),protectedOutputs=zip(enc(closure.outputs(decode(x.run.snapshot().outputs)))),observer=zip(safe(x.run,items(closure.outputs(decode(x.run.snapshot().outputs)),'list')));
 const adaptation=state(x).entries().filter(e=>e.path.rootStateTypeId===302n).map(e=>({path:key(statePathValue(e.path)),value:key(e.value)}));
 let done=false;for(let i=0;i<48;i++){if(!await x.run.settleNextInstant()){done=true;break;}}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);expect(status(x)).toBe(Number.isFinite(fulfillAt)?2:3);if(fulfilled)expect(key(goal(x))).toBe(fulfilled);
 put(name,{registeredDisplacementStep:1,rows,adaptation,goal:key(goal(x)),checkpoint,protectedState,protectedOutputs,observer,registry:hash(x.b.s.registry),initial:hash(x.b.d.initialState),inputs:hash(x.b.d.orderedInputs),terminal:hash(x.run.save())});console.info('M232 PASS',name);
}
for(const name of names)it('goal232 native '+name,()=>runCase(name),230000);
it('goal232 privacy source and retained controls',async()=>{
 const d=saved();for(const field of ['protectedState','protectedOutputs','observer'])bytes(unzip(d.hidden1[field].deflate),unzip(d.hidden0[field].deflate));expect(d.hidden1.adaptation).not.toEqual(d.hidden0.adaptation);expect(d.hidden1.rows).toEqual(d.hidden0.rows);expect(new Set(names.map(n=>d[n].registry)).size).toBe(1);
 const x=await start('revealed1'),forged=list([signed(9),u(140),sid(1001,'event/task-measurement-settlement'),list([]),list([])]);
 await expect(createCharacterRun(x.m,{...x.b.d,orderedInputs:enc(list([...items(decode(x.b.d.orderedInputs),'list'),forged]))})).rejects.toThrow('original kind');
 const old='docs/planning/ASSEMBLED_CHARACTER_M231_EVIDENCE.json',e=JSON.parse(readFileSync(old,'utf8'));expect(e.frozen.rows).toHaveLength(19);expect(e.frozen.advancing+e.frozen.terminal).toBe(94);
 put('privacySources',{protectedStateAndOutputs:true,permittedView:true,hiddenAdaptationDifferent:true,forgedSettlementRejected:true,priorEvidenceHash:hash(readFileSync(old)),priorRuns:19,priorPrefixes:94});
},180000);
it('goal232 repeat restore and fulfillment rollback',async()=>{
 const x=await start('revealed1');await through(x.run,4n);const save=x.run.save(),old=saved().revealed1;bytes(save,unzip(old.checkpoint.deflate));
 const restore=async()=>cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save})),bad=await restore(),before=bad.snapshot(),write=trace.traceRecordValue;let hit=false;
 const spy=vi.spyOn(trace,'traceRecordValue').mockImplementation(v=>{if(v.event.dueAt===5n&&key(v.event.eventTypeId)===key(sid(1001,'event/task-measurement-settlement'))&&v.statePatch.operations.some(o=>o.path.rootStateTypeId===373n)){expect(v.structuralMutationDiffs).toHaveLength(1);hit=true;throw Error('M232 after fulfillment write');}return write(v);});
 try{await expect(bad.settleNextInstant()).rejects.toThrow('M232 after fulfillment write');expect(hit).toBe(true);expect(bad.snapshot().clock).toBe(before.clock);for(const k of ['state','outputs','trace']as const)bytes(bad.snapshot()[k],before[k]);expect(()=>bad.save()).toThrow('active quiescent');}finally{spy.mockRestore();}
 const recovered=await restore();exact(x.run,recovered);let done=false;for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();expect(await recovered.settleNextInstant()).toBe(more);expect(recovered.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[5n,8n,101n].includes(x.run.snapshot().clock))exact(x.run,recovered);if(!more){done=true;break;}}expect(done).toBe(true);expect(hash(x.run.save())).toBe(old.terminal);put('rollback',{reached:hit,checkpoint:hash(save),terminal:hash(x.run.save()),failedRunReusable:false});
},440000);

it('goal232 source diagnostic',()=>{const b=fixture('revealed1'),rows=items(items(decode(b.s.registry),'list')[0],'set'),selected=rows.filter(v=>{if(typeof v==='boolean'||v.kind!=='record')return false;const r=v.fields.get(4n);return r&&typeof r!=='boolean'&&r.kind==='record'&&[283n,311n].includes(r.schema.typeId);});console.info('M232 exact registry operands',JSON.stringify(selected,(_k,v)=>typeof v==='bigint'?String(v):v instanceof Map?[...v]:_k==='schema'?{typeId:String(v.typeId),schemaVersion:String(v.schemaVersion)}:v));},90000);
