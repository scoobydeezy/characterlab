import {it,expect,vi} from 'vitest';
import {start,fixture,names,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,at,sid,type Case,type CanonicalValue} from './fixtures/assembledGoalCompletionCurrent';
import {campaign2Record as cr} from '../campaign2/codecs';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {characterEvidenceRefValue} from '../semanticBinding/semanticEvidenceCodecs';
import {STRATEGY_EVAL} from '../assembled/strategy';
import {PRIORITY_MOTIVE} from '../assembled/priority';
import {ACTION_BODY} from '../assembled/actionBody';
import {PRIORITY_DISPLAY,PRIORITY_LEARN} from '../assembled/priority';
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
const file='docs/planning/ASSEMBLED_CHARACTER_M233_EVIDENCE.json',saved=()=>JSON.parse(readFileSync(file,'utf8'));
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')}),unzip=(s:string)=>new Uint8Array(inflateSync(Uint8Array.from(atob(s),c=>c.charCodeAt(0))));
const put=(n:string,v:unknown)=>{const d=existsSync(file)?saved():{};expect(d[n]).toBeUndefined();d[n]=v;writeFileSync(file,JSON.stringify(d,null,2)+'\n');};
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const exact=(a:X['run'],b:X['run'])=>{const as=a.snapshot(),bs=b.snapshot();expect(bs.clock).toBe(as.clock);expect(bs.status).toBe(as.status);for(const k of ['state','outputs','trace']as const)bytes(as[k],bs[k]);bytes(a.save(),b.save());};
const state=(x:X)=>restoreAuthoritativeState(decode(x.run.snapshot().state)),out=(x:X)=>items(decode(x.run.snapshot().outputs),'list');
const records=(xs:readonly CanonicalValue[],n:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n);
const tagged=(xs:readonly CanonicalValue[],tag:string)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const path=(x:X,fieldId=1n)=>({rootStateTypeId:373n,fieldId,selectors:[{kind:'mapKey' as const,key:x.b.task}]}),goal=(x:X)=>state(x).read(path(x)).value!;
const status=(x:X)=>goal(x)===undefined?0:Number(uint(f(rec(goal(x),372n),1n)));
const traces=(x:X)=>items(decode(x.run.snapshot().trace),'list').map(v=>rec(v,160n));
const named=(x:X,name:string,t:bigint)=>traces(x).filter(v=>{const e=rec(f(v,4n),130n);return at(f(e,2n))===t&&key(f(e,5n))===key(sid(1001,name));});
const hex=(s:string)=>Uint8Array.from(s.match(/../g)!.map(v=>parseInt(v,16)));
function observation(x:X,t:bigint,value:CanonicalValue){const o=rec(records(out(x),203n).find(v=>at(f(rec(v,203n),5n))===t)!,203n);expect(key(f(rec(f(o,6n),204n),2n))).toBe(key(value));return o;}
function settlement(x:X,t:bigint,write:boolean){const rows=named(x,'event/task-measurement-settlement',t);expect(rows).toHaveLength(1);expect(uint(f(rec(f(rows[0],4n),130n),3n))).toBe(140n);const diffs=items(f(rows[0],17n),'list');expect(diffs).toHaveLength(write?1:0);if(write){expect(key(f(rec(diffs[0],148n),1n))).toBe(key(statePathValue(path(x))));expect(key(f(rec(diffs[0],148n),5n))).toBe(key(goal(x)));}return rows[0];}
function supported(x:X,t:bigint,o:ReturnType<typeof rec>){expect(at(f(rec(goal(x),372n),3n))).toBe(t);expect(key(f(rec(goal(x),372n),2n))).toBe(key(characterEvidenceRefValue({kind:'observation',observationId:uint((f(o,1n) as Extract<CanonicalValue,{kind:'typedIdentifier'}>).payload)})));}
function decision(x:X,t:bigint,expected:number){
 const outputs=out(x),d=rec(records(outputs,409n).find(v=>at(f(rec(v,409n),2n))===t)!,409n),ds=rec(f(d,4n),419n),chosen=uint(f(ds,1n))===3n?rec(f(ds,2n),420n):undefined;
 const action=chosen?x.b.actions.findIndex(a=>key(a)===key(f(rec(f(chosen,1n),395n),2n))):-1;
 const motive=tagged(outputs,PRIORITY_MOTIVE).find(v=>uint(v[1])===t)!,m=items(motive[2],'list').find(v=>key(items(v,'list')[0])===key(x.b.task)),strength=m?items(m,'list')[3]:q(0,1),planner=tagged(outputs,STRATEGY_EVAL).find(v=>uint(v[2])===t)!,selected=items(planner[3],'list').find(v=>key(items(v,'list')[0])===key(x.b.task));
 expect(action).toBe(expected);
 if(expected>=0){expect(selected).toBeDefined();expect(uint(items(selected!,'list')[1])).toBe(BigInt(expected));expect(typeof strength!=='boolean'&&strength.kind==='rational'&&strength.numerator>0n).toBe(true);expect(items(f(rec(f(d,3n),408n),3n),'list').length).toBeGreaterThan(0);expect(items(f(chosen!,2n),'list')).toHaveLength(1);expect(key(f(rec(items(f(chosen!,2n),'list')[0],421n),2n))).toBe(key(q(1,1)));}
 if(status(x)===2){expect(selected).toBeUndefined();expect(key(strength)).toBe(key(q(0,1)));expect(items(f(rec(f(d,3n),408n),3n),'list')).toHaveLength(0);const read=named(x,'event/deliberation-opportunity',t).flatMap(v=>items(f(v,11n),'list')).map(v=>rec(v,147n)).find(v=>key(f(v,2n))===key(statePathValue(path(x))));expect(read).toBeDefined();expect(key(f(read!,4n))).toBe(key(goal(x)));}
 return {at:Number(t),status:status(x),action,strength:key(strength),planner:key(list(planner))};
}
async function runCase(name:Case){
 const x=await start(name),rows:any[]=[];let checkpoint:ReturnType<typeof zip>|undefined,terminalGoal:string|undefined,instruction:string|undefined;
 const times=x.b.main?[1,2,3,4,5,6,7,...(name==='main'?[8]:[]),9]:[1,2,3,4,5,6,...(name==='noLater'?[]:[7]),8];
 for(const t of times){await through(x.run,BigInt(t));
  if(t===1){observation(x,1n,q(5,1));expect(status(x)).toBe(0);continue;}
  const expected=x.b.main?(name==='main'&&t>=8?2:1):name==='noAdoption'||t<5?0:name==='simultaneous'&&t>=7?2:1;
  expect(status(x)).toBe(expected);console.info('M233 state',name,t,expected);
  if(expected){const ins=key(state(x).read(path(x,2n)).value!);if(instruction)expect(ins).toBe(instruction);else instruction=ins;}else for(const id of [1n,2n,3n])expect(state(x).read(path(x,id)).presence).toBe(false);
  if(expected===2){if(terminalGoal)expect(key(goal(x))).toBe(terminalGoal);else terminalGoal=key(goal(x));}
  if(x.b.main){
   if([2,3,4,5,6,7,9].includes(t))rows.push(decision(x,BigInt(t),({2:-1,3:0,4:0,5:1,6:-1,7:1,9:name==='main'?-1:1} as Record<number,number>)[t]));
   if(t===7){const contacts=records(out(x),433n);expect(contacts).toHaveLength(4);expect(contacts.every(v=>uint(f(rec(v,433n),3n))===1n)).toBe(true);const ap=state(x).entries().find(e=>e.path.rootStateTypeId===302n&&e.path.fieldId===3n)!;expect(at(f(rec(ap.value,299n),1n))).toBe(4n);}
   if(t===8){const o=observation(x,8n,q(54,10));settlement(x,8n,true);supported(x,8n,o);}
  }else{
   if([2,3,6,8].includes(t))rows.push(decision(x,BigInt(t),-1));
   if(t===5){observation(x,5n,q(52,10));const s=settlement(x,5n,false),sr=items(f(s,11n),'list').map(v=>rec(v,147n)).find(v=>key(f(v,2n))===key(statePathValue(path(x))));expect(sr).toBeDefined();expect(f(sr!,3n)).toBe(false);
    const learned=named(x,'event/assembled-priority-learn',5n);expect(learned).toHaveLength(1);expect(uint(f(rec(f(learned[0],4n),130n),3n))).toBe(140n);
    if(name!=='noAdoption'){const read=items(f(learned[0],11n),'list').map(v=>rec(v,147n)).find(v=>key(f(v,2n))===key(statePathValue(path(x))));expect(read).toBeDefined();expect(f(read!,3n)).toBe(false);const diff=items(f(learned[0],17n),'list').map(v=>rec(v,148n)).find(v=>key(f(v,1n))===key(statePathValue(path(x))));expect(diff).toBeDefined();expect(uint(f(rec(f(diff!,5n),372n),1n))).toBe(1n);}else expect(items(f(learned[0],17n),'list')).toHaveLength(0);
   }
   if(t===7){const o=observation(x,7n,q(52,10));settlement(x,7n,name==='simultaneous');if(name==='simultaneous')supported(x,7n,o);}
   if(t===4&&name==='simultaneous')checkpoint=zip(x.run.save());
  }
 }
 const effects=tagged(out(x),ACTION_BODY).map(v=>(v[5] as {value:string}).value);expect(effects).toEqual(x.b.main?['Blocked','Blocked','Blocked','Applied',...(name==='noCriterion'?['Blocked']:[])]:[]);
 let done=false;for(let n=0;n<48;n++){if(!await x.run.settleNextInstant()){done=true;break;}}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);expect(status(x)).toBe(terminalGoal?2:name==='noAdoption'?0:3);if(terminalGoal)expect(key(goal(x))).toBe(terminalGoal);
 put(name,{rows,effects,goal:goal(x)?key(goal(x)):null,checkpoint,terminal:hash(x.run.save()),registry:hash(x.b.s.registry),initial:hash(x.b.d.initialState),inputs:hash(x.b.d.orderedInputs)});console.info('M233 PASS',name);
}
for(const name of names)it('goal233 native '+name,()=>runCase(name),230000);
it('goal233 terminal adoption and retained controls',async()=>{
 const d=saved();expect(d.simultaneous.registry).toBe(d.noLater.registry);expect(d.noLater.registry).toBe(d.noAdoption.registry);expect(d.main.registry).toBe(d.noCriterion.registry);
 const old231='docs/planning/ASSEMBLED_CHARACTER_M231_EVIDENCE.json',old232='docs/planning/ASSEMBLED_CHARACTER_M232_EVIDENCE.json',e=JSON.parse(readFileSync(old231,'utf8')),prior=JSON.parse(readFileSync(old232,'utf8'));
 expect(e.frozen.rows).toHaveLength(19);expect(e.frozen.advancing+e.frozen.terminal).toBe(94);expect(at(f(rec(decode(hex(prior.externalNoRoute2.goal)),372n),3n))).toBe(5n);expect(at(f(rec(decode(hex(d.simultaneous.goal)),372n),3n))).toBe(7n);
 const x=await start('simultaneous'),inputs=items(decode(x.b.d.orderedInputs),'list'),adoption=items(inputs.find(v=>at(items(v,'list')[0])===5n&&key(items(v,'list')[2])===key(PRIORITY_DISPLAY))!,'list');
 const repeated=inputs.map(v=>{const a=items(v,'list');return at(a[0])===8n&&key(a[2])===key(PRIORITY_DISPLAY)?list([a[0],...adoption.slice(1)]):v;}),bad=cachedMemory(await createCharacterRun(x.m,{...x.b.d,orderedInputs:enc(list(repeated))}));await through(bad,7n);const before=bad.snapshot();expect(at(f(rec(restoreAuthoritativeState(decode(before.state)).read(path(x)).value!,372n),3n))).toBe(7n);
 await expect(bad.settleNextInstant()).rejects.toThrow('duplicate importance');expect(bad.snapshot().clock).toBe(7n);for(const k of ['state','outputs','trace']as const)bytes(bad.snapshot()[k],before[k]);expect(()=>bad.save()).toThrow('active quiescent');
 put('controls',{prior231:hash(readFileSync(old231)),prior232:hash(readFileSync(old232)),originalRuns:19,originalPrefixes:94,earlierAdoptionFulfilledAt:5,simultaneousFulfilledAt:7,terminalReadoptionRejected:true});
},180000);
it('goal233 mixed stage rollback and continuation',async()=>{
 const x=await start('simultaneous');await through(x.run,4n);const save=x.run.save(),old=saved().simultaneous;bytes(save,unzip(old.checkpoint.deflate));
 const restore=async()=>cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save})),bad=await restore(),before=bad.snapshot(),write=trace.traceRecordValue;let hit=false;
 const spy=vi.spyOn(trace,'traceRecordValue').mockImplementation(v=>{if(v.event.dueAt===5n&&key(v.event.eventTypeId)===key(PRIORITY_LEARN)&&v.statePatch.operations.some(o=>o.path.rootStateTypeId===373n&&o.path.fieldId===1n)){expect(v.structuralMutationDiffs).toHaveLength(3);hit=true;throw Error('M233 after simultaneous adoption write');}return write(v);});
 try{await expect(bad.settleNextInstant()).rejects.toThrow('M233 after simultaneous adoption write');expect(hit).toBe(true);expect(bad.snapshot().clock).toBe(before.clock);for(const k of ['state','outputs','trace']as const)bytes(bad.snapshot()[k],before[k]);expect(()=>bad.save()).toThrow('active quiescent');}finally{spy.mockRestore();}
 const recovered=await restore();exact(x.run,recovered);let done=false;for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();expect(await recovered.settleNextInstant()).toBe(more);expect(recovered.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[5n,7n,8n,101n].includes(x.run.snapshot().clock))exact(x.run,recovered);if(!more){done=true;break;}}expect(done).toBe(true);expect(hash(x.run.save())).toBe(old.terminal);put('rollback',{reached:hit,checkpoint:hash(save),terminal:hash(x.run.save()),failedRunReusable:false});
},440000);
