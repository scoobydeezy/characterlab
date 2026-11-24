import {target,other,origin,destination,otherPlace} from './fixtures/assembledItemAttainment';
import {ITEM_WORLD,ITEM_PROBE,ITEM_OWNER,ITEM_SOURCE,itemPath,itemAuthority,compileItemWorld,createItemWorld,withItemWorldState} from '../assembled/itemWorld';
import {start as previousStart} from './fixtures/assembledProtocolPermission';
import {prepareCharacterModel} from '../assembled/character';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {simInstant} from '../substrate/time';
import {changeDefinition} from './fixtures/assembledCharacter';
import {it,expect,vi} from 'vitest';
import {start,fixture,names,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,type Case,type CanonicalValue} from './fixtures/assembledItemAttainment';
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
const file='docs/planning/ASSEMBLED_CHARACTER_M239_EVIDENCE.json',saved=()=>JSON.parse(readFileSync(file,'utf8'));
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
const location=(x:X,item:CanonicalValue)=>state(x).read(itemPath(item)).value!;
function worldHandles(v:CanonicalValue):boolean {if(typeof v==='boolean')return false;if(v.kind==='typedIdentifier')return [1601n,1602n].includes(v.namespaceId)||worldHandles(v.payload);if(v.kind==='list'||v.kind==='set')return v.items.some(worldHandles);if(v.kind==='record')return [...v.fields.values()].some(worldHandles);return false;}
async function runCase(name:Case){
 const x=await start(name),completes=['matched','falsePositive','external'].includes(name),truth=['matched','hidden','external'].includes(name),rows:any[]=[];let checkpoint:ReturnType<typeof zip>|undefined,instruction:string|undefined,decision3:string|undefined;
 for(const t of [1,2,3,...(x.b.hidden?[]:[4]),5]){
  await through(x.run,BigInt(t));const outputs=out(x);
  if(t===1){const o=rec(records(outputs,203n).find(v=>at(f(rec(v,203n),5n))===1n)!,203n);expect(key(f(rec(f(o,6n),204n),2n))).toBe(key(q(0,1)));continue;}
  expect(status(x)).toBe(completes&&t>=4?2:1);const ins=key(state(x).read(path(x,2n)).value!);if(instruction)expect(ins).toBe(instruction);else instruction=ins;
  if(t===3){
   const actual=actualAt(outputs,3n);if(name==='external')expect(actual).toBeUndefined();else{expect(actual).toBeDefined();expect(uint(f(actual!,3n))).toBe(name==='blocked'?0n:2n);expect(uint(f(rec(f(rec(f(actual!,2n),432n),2n),431n),3n))).toBe(2n);}
   expect(key(location(x,target))).toBe(key(truth?destination:name==='wrongPlace'?otherPlace:origin));expect(key(location(x,other))).toBe(key(['wrongItem','falsePositive'].includes(name)?destination:origin));
   const movement=traces(x).filter(v=>key(f(v,5n))===key(sid(1036,'seam/item-location'))&&at(f(rec(f(v,4n),130n),2n))===3n);expect(movement).toHaveLength(name==='blocked'?0:1);if(name!=='blocked'){expect(items(f(movement[0],17n),'list')).toHaveLength(1);expect(items(f(movement[0],13n),'list')).toHaveLength(0);
   const read=rec(items(f(movement[0],11n),'list')[0],147n);expect(key(f(read,2n))).toBe(key(statePathValue(itemPath(name==='external'?target:x.b.moveItem))));expect(key(f(read,4n))).toBe(key(origin));}
   rows.push({at:3,item:key(name==='external'?target:x.b.moveItem),location:key(name==='blocked'?origin:name==='external'?destination:x.b.movePlace),actual:actual?(name==='blocked'?0:2):null});if(name==='matched')checkpoint=zip(x.run.save());
  }
  if(t===4){
   const o=rec(records(outputs,203n).find(v=>at(f(rec(v,203n),5n))===4n)!,203n);expect(key(f(rec(f(o,6n),204n),2n))).toBe(key(q(completes?1:0,1)));
   const physical=rec(records(outputs,334n).find(v=>at(f(rec(v,334n),3n))===4n)!,334n);expect(at(f(physical,4n))).toBe(truth?10n:0n);
   const probe=named(x,'event/regulatory-diagnostic-probe',4n);expect(probe).toHaveLength(1);expect(key(f(probe[0],6n))).toBe(key(text(ITEM_PROBE)));const read=rec(items(f(probe[0],11n),'list')[0],147n);expect(key(f(read,2n))).toBe(key(statePathValue(itemPath(target))));expect(key(f(read,4n))).toBe(key(location(x,target)));
   const m1=rec(records(outputs,342n).find(v=>key(f(rec(f(rec(v,342n),2n),337n),2n))===key(o))!,342n);expect(state(x).entries().some(e=>e.path.rootStateTypeId===346n&&e.path.fieldId===1n&&typeof e.value!=='boolean'&&e.value.kind==='record'&&e.value.schema.typeId===345n&&key(f(rec(e.value,345n),1n))===key(m1))).toBe(true);
   for(const name of ['event/measurement-prediction-application','event/task-measurement-settlement']){const ts=named(x,name,4n);expect(ts).toHaveLength(1);expect(key(f(ts[0],12n))).toBe(key(m1));expect(items(f(ts[0],17n),'list')).toHaveLength(name.includes('prediction')||completes?1:0);}
   if(completes){expect(key(f(rec(goal(x),372n),2n))).toBe(key(characterEvidenceRefValue({kind:'observation',observationId:uint((f(o,1n) as Extract<CanonicalValue,{kind:'typedIdentifier'}>).payload)})));expect(at(f(rec(goal(x),372n),3n))).toBe(4n);}
   rows.push({at:4,physical:truth,observed:completes,status:status(x)});
  }
  if([3,5].includes(t)&&!(t===3&&name==='external')){
   const d=rec(records(outputs,409n).find(v=>at(f(rec(v,409n),2n))===BigInt(t))!,409n),result=rec(f(d,4n),419n),chosen=uint(f(result,1n))===3n?rec(f(result,2n),420n):undefined,acts=name!=='external'&&!(completes&&t===5);expect(!!chosen).toBe(acts);
   const motive=tagged(outputs,PRIORITY_MOTIVE).find(v=>uint(v[1])===BigInt(t))!,m=items(motive[2],'list').find(v=>key(items(v,'list')[0])===key(x.b.task)),strength=m?items(m,'list')[3]:q(0,1);
   if(acts){expect(typeof strength!=='boolean'&&strength.kind==='rational'&&strength.numerator>0n).toBe(true);expect(items(f(rec(f(d,3n),408n),3n),'list').length).toBeGreaterThan(0);expect(key(f(rec(f(chosen!,1n),395n),2n))).toBe(key(x.b.actions[0]));expect(items(f(chosen!,2n),'list')).toHaveLength(1);expect(key(f(rec(items(f(chosen!,2n),'list')[0],421n),2n))).toBe(key(q(1,1)));}
   if(t===5&&completes){expect(key(strength)).toBe(key(q(0,1)));expect(items(f(rec(f(d,3n),408n),3n),'list')).toHaveLength(0);const consumed=named(x,'event/deliberation-opportunity',5n).flatMap(r=>items(f(r,11n),'list')).map(v=>rec(v,147n)).find(r=>key(f(r,2n))===key(statePathValue(path(x))));expect(consumed).toBeDefined();expect(key(f(consumed!,4n))).toBe(key(goal(x)));}
   rows.push({at:t,acts,status:status(x)});if(t===3)decision3=key(d);
  }
  expect(worldHandles(list(outputs))).toBe(false);
 }
 expect(traces(x).flatMap(r=>items(f(r,14n),'list'))).toHaveLength(0);let done=false;for(let n=0;n<48;n++)if(!await x.run.settleNextInstant()){done=true;break;}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);expect(status(x)).toBe(completes?2:3);
 if(name==='blocked'){expect(decision3).toBe(saved().matched.decision3);expect(hash(x.b.d.initialState)).toBe(saved().matched.initial);expect(key(location(x,target))).toBe(key(origin));}
 put(name,{rows,decision3,checkpoint,terminal:hash(x.run.save()),goal:key(goal(x)),initial:hash(x.b.d.initialState),registry:hash(x.b.s.registry),inputs:hash(x.b.d.orderedInputs),noDraws:true});
}
for(const name of names)it('goal239 native '+name,()=>runCase(name),230000);
it('goal239 model source and ownership boundaries',async()=>{
 const x=await start('matched'),d=saved(),slots=items(decode(x.b.s.registry),'list'),c=items(slots[59],'list');for(const name of names){expect(d[name].initial).toBe(d.matched.initial);if(name!=='external')expect(d[name].decision3).toBe(d.matched.decision3);}
 const badDeclarations=[list([c[0],c[1],c[2],list([list([items(slots[28],'list')[2],target,destination])]),c[4]]),list([c[0],c[1],c[2],list([list([sid(1027,'action/unknown'),target,destination])]),c[4]]),list([c[0],c[1],c[2],c[3],list([x.b.task,sid(1601,'unknown'),destination])]),list([c[0],c[1],c[2],c[3],list([x.b.task,target,sid(1602,'unknown')])]),list([c[0],c[1],c[2],list([items(c[3],'list')[0],items(c[3],'list')[0]]),c[4]])];
 for(const v of badDeclarations)await expect(prepareCharacterModel({...x.b.s,registry:enc(list([...slots.slice(0,59),v]))})).rejects.toThrow('item location');
 await expect(prepareCharacterModel(changeDefinition(x.b.s,'definition/task-b',3n,q(0,1)))).rejects.toThrow('item location goal');
 const initial=restoreAuthoritativeState(decode(x.b.d.initialState));for(const entries of [initial.entries().filter(e=>e.path.rootStateTypeId!==1600n),[...initial.entries(),{path:itemPath(sid(1601,'unknown')),value:origin}],initial.entries().map(e=>e.path.rootStateTypeId===1600n?{...e,value:sid(1602,'unknown')}:e)])await expect(createCharacterRun(x.m,{...x.b.d,initialState:enc(new AuthoritativeState(entries).canonicalValue())})).rejects.toThrow('item location');
 const ext=fixture('external'),extRows=items(decode(ext.d.orderedInputs),'list'),source=extRows.find(v=>key(items(v,'list')[2])===key(ITEM_SOURCE))!,a=items(source,'list');
 for(const bad of [list([a[0],u(110),...a.slice(2)]),list([...a.slice(0,3),list([text(ITEM_WORLD),target,sid(1602,'unknown')]),a[4]])])await expect(createCharacterRun(x.m,{...ext.d,orderedInputs:enc(list(extRows.map(v=>v===source?bad:v)))})).rejects.toThrow('item location');
 await expect(createCharacterRun(x.m,{...ext.d,orderedInputs:enc(list([...extRows,source]))})).rejects.toThrow('item location');
 expect(()=>compileItemWorld(list([c[0],set([target,target]),c[2],c[3],c[4]]),x.b.actions,[x.b.task])).toThrow();expect(()=>compileItemWorld(list([c[0],c[1],c[2],c[3],list([list([]),target,destination])]),x.b.actions,[x.b.task])).toThrow('criterion');
 const world=compileItemWorld(slots[59],x.b.actions,[x.b.task]),authority=itemAuthority(world),patch={operations:[{kind:'set' as const,path:itemPath(target),expected:{presence:true as const,value:origin},newValue:destination}]};expect(()=>applyStatePatch(initial,patch,sid(1025,'authority/prospective-commitments'),authority)).toThrow();expect(()=>applyStatePatch(initial,{operations:[{kind:'remove',path:itemPath(target),expectedOldValue:origin}]},ITEM_OWNER,authority)).toThrow();
 const base={validateState(){},validatePath(){},read:(s:AuthoritativeState,p:any)=>s.read(p),applyPatch(){throw Error('unused base');}} as any,owned=withItemWorldState(base,world),event={eventId:0n,eventSequence:0n,dueAt:simInstant(3n),phase:100n,eventTypeId:ITEM_SOURCE as any,payload:a[3],dependencies:list([]),causalParentEventIds:[]},handler=createItemWorld(world,C,owned,[event],C,C);handler.begin(3n);expect(()=>handler.execute({state:initial,event:{...event,payload:list([text(ITEM_WORLD),other,destination])}} as any)).toThrow('unbound source');handler.close();
 put('boundaries',{sameInitial:true,sameFirstChoice:true,worldHandlesExcluded:true,foreignOwnerRejected:true,sourceForgeryRejected:true,references:Object.fromEntries([237,238].map(n=>[n,hash(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M'+n+'_EVIDENCE.json'))]))});
},260000);
it('goal239 rollback and continuation',async()=>{
 const x=await start('matched');await through(x.run,2n);const beforeMove=x.run.save(),failedMove=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:beforeMove})),moveBefore=failedMove.snapshot(),originalTrace=trace.traceRecordValue;let moveHit=false;
 const moveSpy=vi.spyOn(trace,'traceRecordValue').mockImplementation(v=>{if(v.event.dueAt===3n&&key(v.seamId)===key(sid(1036,'seam/item-location'))&&v.statePatch.operations.some(o=>o.path.rootStateTypeId===1600n)){moveHit=true;throw Error('M239 after world write');}return originalTrace(v);});
 try{await expect(failedMove.settleNextInstant()).rejects.toThrow('M239 after world write');expect(moveHit).toBe(true);expect(failedMove.snapshot().clock).toBe(moveBefore.clock);for(const k of ['state','outputs','trace']as const)bytes(failedMove.snapshot()[k],moveBefore[k]);expect(()=>failedMove.save()).toThrow('active quiescent');}finally{moveSpy.mockRestore();}
 await through(x.run,3n);const save=x.run.save(),old=saved().matched;bytes(save,unzip(old.checkpoint.deflate));const restore=async()=>cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save})),bad=await restore(),before=bad.snapshot(),write=trace.traceRecordValue;let hit=false;
 const spy=vi.spyOn(trace,'traceRecordValue').mockImplementation(v=>{if(v.event.dueAt===4n&&key(v.event.eventTypeId)===key(sid(1001,'event/task-measurement-settlement'))&&v.statePatch.operations.some(o=>o.path.rootStateTypeId===373n)){hit=true;throw Error('M239 after fulfillment');}return write(v);});
 try{await expect(bad.settleNextInstant()).rejects.toThrow('M239 after fulfillment');expect(hit).toBe(true);expect(bad.snapshot().clock).toBe(before.clock);for(const k of ['state','outputs','trace']as const)bytes(bad.snapshot()[k],before[k]);expect(()=>bad.save()).toThrow('active quiescent');}finally{spy.mockRestore();}
 const recovered=await restore();exact(x.run,recovered);let done=false;for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();expect(await recovered.settleNextInstant()).toBe(more);expect(recovered.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[4n,5n,101n].includes(x.run.snapshot().clock))exact(x.run,recovered);if(!more){done=true;break;}}expect(done).toBe(true);expect(hash(x.run.save())).toBe(old.terminal);put('rollback',{moveHit,hit,checkpoint:hash(save),terminal:hash(x.run.save())});
},400000);
it('goal239 retained 0.151 witness',async()=>{const x=await previousStart('dynamic');let done=false;for(let n=0;n<48;n++)if(!await x.run.settleNextInstant()){done=true;break;}expect(done).toBe(true);const old=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M238_EVIDENCE.json','utf8')).dynamic;expect(hash(x.run.save())).toBe(old.terminal);put('oldVersion',{terminal:hash(x.run.save()),exact:true});},200000);
