import {simInstant} from '../substrate/time';
import {PROTOCOL_PERMISSION,PROTOCOL_PERMISSION_SOURCE,PROTOCOL_PERMISSION_VERSION,createProtocolPermission} from '../assembled/protocolPermission';
import {fixture as oldFixture,start as oldStart} from './fixtures/assembledExecutionCriterion';
import {prepareCharacterModel} from '../assembled/character';
import {AuthoritativeState} from '../substrate/state';
import {it,expect,vi} from 'vitest';
import {start,names,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,type Case,type CanonicalValue} from './fixtures/assembledProtocolPermission';
import {campaign2Record as cr} from '../campaign2/codecs';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {characterEvidenceRefValue} from '../semanticBinding/semanticEvidenceCodecs';
import {PRIORITY_MOTIVE} from '../assembled/priority';
import {ACTION_BODY} from '../assembled/actionBody';
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
const file='docs/planning/ASSEMBLED_CHARACTER_M238_EVIDENCE.json',saved=()=>JSON.parse(readFileSync(file,'utf8'));
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
 const x=await start(name),completes=name==='dynamic'||name==='default',rows:any[]=[];let checkpoint:ReturnType<typeof zip>|undefined,instruction:string|undefined,decision3:string|undefined;
 for(const t of [1,2,3,4,5,...(x.b.silent?[]:[6]),7]){
  await through(x.run,BigInt(t));const outputs=out(x);
  if(t===1){const o=rec(records(outputs,203n).find(v=>at(f(rec(v,203n),5n))===1n)!,203n);expect(key(f(rec(f(o,6n),204n),2n))).toBe(key(q(5,1)));continue;}
  expect(status(x)).toBe(completes&&t>=6?2:1);const ins=key(state(x).read(path(x,2n)).value!);if(instruction)expect(ins).toBe(instruction);else instruction=ins;
  if(t===3||t===5){
   const contacts=t===5&&!['denied','staticDenied'].includes(name)?2n:0n,actual=actualAt(outputs,BigInt(t));expect(actual).toBeDefined();expect(uint(f(actual!,3n))).toBe(contacts);
   const plan=rec(f(rec(f(actual!,2n),432n),2n),431n);expect(uint(f(plan,3n))).toBe(2n);
   const effect=tagged(outputs,ACTION_BODY).filter(v=>key(v[1])===key(f(actual!,1n)));expect(effect).toHaveLength(1);expect(key(effect[0][5])).toBe(key(text(contacts?'Applied':'Blocked')));
   const fact=named(x,'event/protocol-actual-fact',BigInt(t));expect(fact).toHaveLength(1);expect(uint(f(rec(f(rec(f(fact[0],13n),307n),2n),305n),3n))).toBe(contacts);
   const ap={rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey' as const,key:cr('RegulatoryAdaptationKey',{CharacterId:C,RegulatoryVariableId:sid(1029,'variable/fixture-regulation')})}]},a=state(x).read(ap).value;expect(a?at(f(rec(a,299n),1n)):0n).toBe(contacts);
   const execution=named(x,'event/protocol-execution',BigInt(t));expect(execution).toHaveLength(1);expect(key(f(execution[0],6n))).toBe(key(text(PROTOCOL_PERMISSION_VERSION)));
   const projection=items(f(execution[0],12n),'list'),report=items(projection[1],'list');expect(key(report[0])).toBe(key(x.b.actions[0]));
   const source=named(x,'event/protocol-permission-source',BigInt(t)),reference=items(report[1],'list');
   if(name==='default'&&t===5){expect(source).toHaveLength(0);expect(reference).toHaveLength(0);expect(report[2]).toBe(true);}else{
    expect(source).toHaveLength(1);const e=rec(f(source[0],4n),130n);expect(reference).toHaveLength(2);expect(uint(reference[0])).toBe(uint(f(e,1n)));expect(key(reference[1])).toBe(key(f(source[0],12n)));
    const executed=rec(f(execution[0],4n),130n);expect(items(f(executed,8n),'list').map(uint)).toContain(uint(reference[0]));
    expect(items(f(source[0],13n),'list')).toHaveLength(0);expect(items(f(source[0],17n),'list')).toHaveLength(0);expect(items(f(source[0],11n),'list')).toHaveLength(0);
    expect(report[2]).toBe(name==='staticDenied'||t===5&&name!=='denied');
   }
   // Physical source never becomes a public report, even when it changes contact.
   expect(tagged(outputs,PROTOCOL_PERMISSION)).toHaveLength(0);
   rows.push({at:t,contacts:Number(contacts),permission:report[2],source:reference.length?key(reference[0]):null});
   if(name==='dynamic'&&t===5)checkpoint=zip(x.run.save());
  }
  if(t===4||t===6){
   const fulfilled=completes&&t===6,o=rec(records(outputs,203n).find(v=>at(f(rec(v,203n),5n))===BigInt(t))!,203n);expect(key(f(rec(f(o,6n),204n),2n))).toBe(key(q(fulfilled?52:50,10)));
   const m1=rec(records(outputs,342n).find(v=>key(f(rec(f(rec(v,342n),2n),337n),2n))===key(o))!,342n);
   expect(state(x).entries().some(e=>e.path.rootStateTypeId===346n&&e.path.fieldId===1n&&typeof e.value!=='boolean'&&e.value.kind==='record'&&e.value.schema.typeId===345n&&key(f(rec(e.value,345n),1n))===key(m1))).toBe(true);
   const prediction=named(x,'event/measurement-prediction-application',BigInt(t)),settlement=named(x,'event/task-measurement-settlement',BigInt(t));expect(prediction).toHaveLength(1);expect(settlement).toHaveLength(1);
   for(const row of [prediction[0],settlement[0]])expect(key(f(row,12n))).toBe(key(m1));expect(items(f(prediction[0],17n),'list')).toHaveLength(1);expect(items(f(settlement[0],17n),'list')).toHaveLength(fulfilled?1:0);
   if(fulfilled){expect(key(f(rec(goal(x),372n),2n))).toBe(key(characterEvidenceRefValue({kind:'observation',observationId:uint((f(o,1n) as Extract<CanonicalValue,{kind:'typedIdentifier'}>).payload)})));expect(at(f(rec(goal(x),372n),3n))).toBe(6n);}
  }
  if([3,5,7].includes(t)){
   const d=rec(records(outputs,409n).find(v=>at(f(rec(v,409n),2n))===BigInt(t))!,409n),result=rec(f(d,4n),419n),chosen=uint(f(result,1n))===3n?rec(f(result,2n),420n):undefined,acts=!(completes&&t===7);
   expect(!!chosen).toBe(acts);if(acts){expect(items(f(rec(f(d,3n),408n),3n),'list').length).toBeGreaterThan(0);expect(items(f(chosen!,2n),'list')).toHaveLength(1);expect(key(f(rec(items(f(chosen!,2n),'list')[0],421n),2n))).toBe(key(q(1,1)));if(t!==7)expect(key(f(rec(f(chosen!,1n),395n),2n))).toBe(key(x.b.actions[0]));}
   const motive=tagged(outputs,PRIORITY_MOTIVE).find(v=>uint(v[1])===BigInt(t))!,m=items(motive[2],'list').find(v=>key(items(v,'list')[0])===key(x.b.task)),strength=m?items(m,'list')[3]:q(0,1);
   if(acts)expect(typeof strength!=='boolean'&&strength.kind==='rational'&&strength.numerator>0n).toBe(true);else{expect(key(strength)).toBe(key(q(0,1)));expect(items(f(rec(f(d,3n),408n),3n),'list')).toHaveLength(0);const consumed=named(x,'event/deliberation-opportunity',7n).flatMap(r=>items(f(r,11n),'list')).map(v=>rec(v,147n)).find(r=>key(f(r,2n))===key(statePathValue(path(x))));expect(consumed).toBeDefined();expect(key(f(consumed!,4n))).toBe(key(goal(x)));}
   rows.push({at:t,status:status(x),action:chosen?key(f(rec(f(chosen,1n),395n),2n)):null,strength:key(strength)});if(t===3)decision3=key(d);
  }
 }
 expect(traces(x).flatMap(r=>items(f(r,14n),'list'))).toHaveLength(0);
 let done=false;for(let n=0;n<48;n++)if(!await x.run.settleNextInstant()){done=true;break;}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);expect(status(x)).toBe(completes?2:3);
 put(name,{rows,decision3,goal:key(goal(x)),checkpoint,terminal:hash(x.run.save()),registry:hash(x.b.s.registry),initial:hash(x.b.d.initialState),inputs:hash(x.b.d.orderedInputs),noDraws:true});
}
for(const name of names)it('goal238 native '+name,()=>runCase(name),260000);
it('goal238 admission privacy and authenticated source',async()=>{
 const d=saved(),x=await start('dynamic');for(const n of names){expect(d[n].decision3).toBe(d.dynamic.decision3);expect(d[n].initial).toBe(d.dynamic.initial);if(n!=='staticDenied')expect(d[n].registry).toBe(d.dynamic.registry);}
 const rows=items(decode(x.b.d.orderedInputs),'list'),source=rows.find(v=>key(items(v,'list')[2])===key(PROTOCOL_PERMISSION_SOURCE))!,a=items(source,'list'),p=items(a[3],'list');
 const invalid=[list([signed(3),u(110),...a.slice(2)]),list([...a.slice(0,4),list([u(1)])]),list([...a.slice(0,3),list([p[0],sid(1004,'character/not-holder'),p[2]]),a[4]]),list([...a.slice(0,3),list([p[0],p[1],set([])]),a[4]]),list([...a.slice(0,3),list([p[0],p[1],set(x.b.permissionActions.map(action=>list([action,u(0)])))]),a[4]])];
 for(const replacement of invalid)await expect(createCharacterRun(x.m,{...x.b.d,orderedInputs:enc(list(rows.map(v=>v===source?replacement:v)))})).rejects.toThrow('protocol permission');
 await expect(createCharacterRun(x.m,{...x.b.d,orderedInputs:enc(list([...rows,source]))})).rejects.toThrow('protocol permission');
 const old=oldFixture('permitted'),m=await prepareCharacterModel(old.s);await expect(createCharacterRun(m,x.b.d)).rejects.toThrow('protocol permission version');
 // Current0.151 action domain is four (two routes are pursued in this fixture).
 expect(x.b.permissionActions).toHaveLength(4);
 // Exact original event authentication, no state writes or output; expired maps cannot carry.
 const event={eventId:1n,eventSequence:1n,dueAt:simInstant(3n),phase:100n,eventTypeId:PROTOCOL_PERMISSION_SOURCE as any,payload:a[3],dependencies:list([]),causalParentEventIds:[]},handler=createProtocolPermission(C,x.b.permissionActions,[event],C,C,4);handler.begin(3n);
 const context={event:{...event,payload:list([p[0],p[1],set(x.b.permissionActions.map(action=>list([action,true])))])},state:new AuthoritativeState([])} as any;
 expect(()=>handler.execute(context)).toThrow('unbound source');const result=handler.execute({...context,event});expect(result.nextState).toBe(context.state);expect(result.outputs).toHaveLength(0);expect(()=>handler.execute({...context,event})).toThrow('unbound source');handler.prepareCommit();handler.close();handler.begin(5n);
 expect(handler.assess({...event,dueAt:simInstant(5n),phase:110n},x.b.actions[0]).allowed).toBe(true);handler.prepareCommit();handler.close();
 const mixedEvent={...event,payload:list([p[0],p[1],set(x.b.permissionActions.map((action,i)=>list([action,i===0])))])},mixed=createProtocolPermission(C,x.b.permissionActions,[mixedEvent],C,C,4);mixed.begin(3n);
 expect(()=>mixed.prepareCommit()).toThrow('unconsumed source');mixed.execute({...context,event:mixedEvent});const execution={...mixedEvent,phase:110n,causalParentEventIds:[mixedEvent.eventId]};
 expect(mixed.assess(execution,x.b.permissionActions[0]).allowed).toBe(true);expect(mixed.assess(execution,x.b.permissionActions[1]).allowed).toBe(false);expect(()=>mixed.assess({...execution,causalParentEventIds:[]},x.b.permissionActions[0])).toThrow('unbound execution parent');mixed.prepareCommit();mixed.close();
 put('boundaries',{declaredActionCount:x.b.permissionActions.length,sameFirstChoice:true,invalidCases:invalid.length+2,forgery:true,noStateOrPublicOutput:true,references:Object.fromEntries([231,233,234,235,236,237].map(n=>[n,hash(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M'+n+'_EVIDENCE.json'))]))});
},150000);
it('goal238 fulfillment rollback and continuation',async()=>{
 const x=await start('dynamic');await through(x.run,3n);const earlier=x.run.save();await through(x.run,5n);const futureSource=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:earlier}));await through(futureSource,5n);exact(x.run,futureSource);const save=x.run.save(),old=saved().dynamic;bytes(save,unzip(old.checkpoint.deflate));const restore=async()=>cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save})),bad=await restore(),before=bad.snapshot(),write=trace.traceRecordValue;let hit=false;
 const spy=vi.spyOn(trace,'traceRecordValue').mockImplementation(v=>{if(v.event.dueAt===6n&&key(v.event.eventTypeId)===key(sid(1001,'event/task-measurement-settlement'))&&v.statePatch.operations.some(o=>o.path.rootStateTypeId===373n)){expect(v.structuralMutationDiffs).toHaveLength(1);hit=true;throw Error('M238 after fulfillment');}return write(v);});
 try{await expect(bad.settleNextInstant()).rejects.toThrow('M238 after fulfillment');expect(hit).toBe(true);expect(bad.snapshot().clock).toBe(before.clock);for(const k of ['state','outputs','trace']as const)bytes(bad.snapshot()[k],before[k]);expect(()=>bad.save()).toThrow('active quiescent');}finally{spy.mockRestore();}
 const recovered=await restore();exact(x.run,recovered);let done=false;for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();expect(await recovered.settleNextInstant()).toBe(more);expect(recovered.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[6n,7n,101n].includes(x.run.snapshot().clock))exact(x.run,recovered);if(!more){done=true;break;}}expect(done).toBe(true);expect(hash(x.run.save())).toBe(old.terminal);put('rollback',{reached:hit,futureSourceRestore3:hash(earlier),checkpoint:hash(save),terminal:hash(x.run.save()),failedRunReusable:false});
},480000);
it('goal238 retained 0.150 execution witness',async()=>{
 const x=await oldStart('permitted');let done=false;for(let n=0;n<48;n++)if(!await x.run.settleNextInstant()){done=true;break;}expect(done).toBe(true);const old=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M237_EVIDENCE.json','utf8')).permitted;expect(hash(x.run.save())).toBe(old.terminal);put('oldVersion',{terminal:hash(x.run.save()),exact:true});
},200000);
