import {it,expect,vi,afterEach} from 'vitest';
// @ts-expect-error Evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Compression.
import {deflateSync,inflateSync} from 'node:zlib';
// @ts-expect-error Hash.
import {createHash} from 'node:crypto';
import {fixture,through,finish,rec,f,uint,items,key,decode,enc,list,text,signed,u,sid,taskA,taskB,countPath,countStatus,countProgress,countWorld,cachedMemory,restorePreparedCharacterRun,type Run} from './fixtures/assembledCountedGoal';
import {prepareCharacterModel,createCharacterRun} from '../assembled/character';
import {COUNT_SETTLEMENT_RULES,COUNT_SETTLEMENT_REGISTRY} from '../assembled/model';
import {COMMITMENT_REQUEST} from '../assembled/commitment';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {DeterministicScheduler} from '../substrate/scheduler';
import {scheduledEventValue} from '../substrate/persistence';
const file='docs/planning/ASSEMBLED_CHARACTER_M277_EVIDENCE.json',hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')});
const saved=()=>existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};
function put(k:string,v:unknown){const d=saved();if(d[k])expect(d[k]).toEqual(v);else{d[k]=v;writeFileSync(file,JSON.stringify(d,null,2)+'\n');}}
const unzip=(v:{hash:string;bytes:number;deflate:string})=>{const b=new Uint8Array(inflateSync(Uint8Array.from(atob(v.deflate),c=>c.charCodeAt(0))));expect(hash(b)).toBe(v.hash);expect(b.length).toBe(v.bytes);return b;};
type Case='complete'|'early'|'denied'|'hidden'|'hiddenFailed'|'carry';
function scenario(name:Case){const b=fixture(name==='hidden'?'hidden':name==='hiddenFailed'?'hiddenFailed':'actual'),rows=items(decode(b.d.orderedInputs),'list');return {s:{...b.s,rulesVersion:COUNT_SETTLEMENT_RULES,registrySchemaVersion:COUNT_SETTLEMENT_REGISTRY},d:{...b.d,orderedInputs:name==='carry'?b.d.orderedInputs:enc(list([...rows,list([signed(name==='early'?3:4),u(30),COMMITMENT_REQUEST,list([taskA,name!=='denied',true]),list([])])]))}};}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
async function start(name:Case){const b=scenario(name),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,r:cachedMemory(await createCharacterRun(m,b.d))};}
function goals(r:Run){const state=restoreAuthoritativeState(decode(r.snapshot().state));return [taskA,taskB].map(task=>({status:String(uint(f(rec(state.read(countStatus(task)).value!,372n),1n))),progress:String(countProgress(state.read(countPath(task)).value).count),world:String(countWorld(state.read(countPath(task,true)).value).count)}));}
let active:Run|undefined;afterEach(ctx=>{if(ctx.task.result?.state==='fail'&&active)put('failure-'+Object.keys(saved()).filter(k=>k.startsWith('failure')).length,{name:ctx.task.name,diagnostic:active.diagnostic()?zip(active.diagnostic()!):null});active=undefined;});
const reports=(r:Run)=>items(decode(r.snapshot().trace),'list').map(v=>rec(v,160n)).filter(v=>key(f(rec(f(v,4n),130n),5n))===key(sid(1001,'event/assembled-commitment-cancel'))).flatMap(v=>items(f(v,13n),'list')).map(v=>items(v,'list'));
it.each(['complete','early','denied','hidden','hiddenFailed'] as const)('settle277 %s actual receipt and cancellation',async name=>{
 const x=await start(name);active=x.r;await through(x.r,name==='early'?2:3);expect(goals(x.r)[0].status).toBe('1');const before=x.r.save();await through(x.r,name==='early'?3:4);const immediate=goals(x.r),report=reports(x.r).at(-1);expect(report).toBeDefined();const expected=name==='complete'?'CompletionPrecedesCancellation':name==='denied'?'Denied':'Cancelled';expect(key(report![2])).toBe(key(text(expected)));
 if(name==='complete'||name==='denied'){expect(immediate[0].status).toBe('2');expect(immediate[0].progress).toBe('1');expect(immediate[1].status).toBe('1');}
 else expect(immediate[0].status).toBe('4');
 const trace=items(decode(x.r.snapshot().trace),'list').map(v=>rec(v,160n)).find(t=>{const e=rec(f(t,4n),130n);return key(f(e,5n))===key(sid(1001,'event/assembled-commitment-cancel'));});expect(trace).toBeDefined();
 if(name==='complete'){expect(key(f(trace!,6n))).toBe(key(text('assembled-counted-goal/0.2-candidate')));expect(items(f(trace!,9n),'list')).toHaveLength(1);}
 await finish(x.r);const physical=items(decode(x.r.snapshot().trace),'list').map(v=>rec(v,160n)).filter(v=>key(f(v,5n))===key(sid(1036,'seam/assembled-counted-goal'))&&key(f(rec(f(v,4n),130n),5n))===key(sid(1001,'event/protocol-execution')));
 for(const row of physical){const input=items(f(row,12n),'list');expect(input).toHaveLength(2);rec(input[0],433n);const source=rec(input[1],130n);expect(f(source,5n)).toEqual(sid(1001,'event/assembled-counted-source'));expect(f(source,2n)).toEqual(f(rec(f(row,4n),130n),2n));const original=items(decode(x.b.d.orderedInputs),'list').map(v=>items(v,'list')).find(v=>key(v[0])===key(f(source,2n))&&key(v[2])===key(f(source,5n)));expect(original).toBeDefined();expect(f(source,6n)).toEqual(original![3]);}
 const old=saved()['before-source-disclosure']?.[name];if(old){const prior=rec(decode(unzip(old.save)),132n);expect(x.r.snapshot().state).toEqual(enc(f(prior,5n)));expect(x.r.snapshot().outputs).toEqual(enc(f(prior,12n)));}
 const final=goals(x.r);expect(final[1].status).toBe(name.startsWith('hidden')?'3':'2');put(name,{source:zip(x.b.d.orderedInputs),before:zip(before),immediate,final,report:key(list(report!)),trace:zip(enc(trace!)),save:zip(x.r.save())});console.info('M277',name,JSON.stringify(final));
},590000);
it('settle277 repeat continuation rollback and carry',async()=>{
 const x=await start('complete');active=x.r;await through(x.r,3);const checkpoint=x.r.save();expect(checkpoint).toEqual(unzip(saved().complete.before));const restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:checkpoint})),continuations=[];
 for(let i=0;i<128;i++){const a=await x.r.settleNextInstant(),b=await restored.settleNextInstant();expect(b).toBe(a);expect(restored.save()).toEqual(x.r.save());continuations.push(hash(x.r.save()));if(!a)break;if(i===127)throw Error('queue cap');}expect(x.r.save()).toEqual(unzip(saved().complete.save));
 const faults=[];for(const commit of [false,true]){const r=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:checkpoint}));let reached=false;
 const regular=DeterministicScheduler.prototype.settleNextInstant,spy=vi.spyOn(DeterministicScheduler.prototype,'settleNextInstant').mockImplementation(async function(this:DeterministicScheduler<unknown>){const before=this.exportQuiescentSnapshot();if(before.queue[0]?.dueAt!==4n)return regular.call(this);try{return await this.settleNextInstantForConformance({onBoundary(boundary,event){if(commit?boundary==='before-commit':boundary==='after-trace-validation'&&!!event&&key(event.eventTypeId)===key(sid(1001,'event/assembled-counted-learn'))){reached=true;throw Error('M277 injected fault');}}});}finally{const after=this.exportQuiescentSnapshot();expect(enc((after.state as AuthoritativeState).canonicalValue())).toEqual(enc((before.state as AuthoritativeState).canonicalValue()));expect(after.allocators).toEqual(before.allocators);expect(after.queue.map(scheduledEventValue)).toEqual(before.queue.map(scheduledEventValue));expect(after.outputs).toEqual(before.outputs);expect(after.committedTrace).toEqual(before.committedTrace);expect(after.clock).toBe(before.clock);expect(after.status).toBe('Failed');}});
 try{await expect(r.settleNextInstant()).rejects.toThrow('M277 injected fault');expect(reached).toBe(true);faults.push({commit,reached,diagnostic:hash(r.diagnostic()!)});}finally{spy.mockRestore();}}
 const a=rec(decode(unzip(saved().hidden.save)),132n),b=rec(decode(unzip(saved().hiddenFailed.save)),132n);expect(f(a,12n)).toEqual(f(b,12n));const cognition=(v:typeof a)=>restoreAuthoritativeState(f(v,5n)).entries().filter(e=>e.path.rootStateTypeId!==1611n);expect(cognition(a)).toEqual(cognition(b));
 const carry=await start('carry');await finish(carry.r);const old=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M276_EVIDENCE.json','utf8')),prior=rec(decode(unzip(old['actual-unit1'].save)),132n);expect(carry.r.snapshot().state).toEqual(enc(f(prior,5n)));expect(carry.r.snapshot().outputs).toEqual(enc(f(prior,12n)));
 put('continuation',{continuations,faults,wholeHiddenObserver:true,carry:zip(carry.r.save()),registry:zip(x.b.s.registry),parameters:zip(x.b.s.parameters),initial:zip(x.b.d.initialState),seed:zip(x.b.d.runSeed)});
},590000);

it('settle277 partial receipt remains distinct from cancellation',async()=>{
 const b=scenario('complete'),rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(COMMITMENT_REQUEST)){a[0]=signed(3);a[3]=list([taskB,true,true]);}return list(a);});b.d.orderedInputs=enc(list(rows));const m=await prepareCharacterModel(b.s),r=cachedMemory(await createCharacterRun(m,b.d));active=r;
 await through(r,2);expect(goals(r)[1]).toEqual({status:'1',progress:'1',world:'1'});const before=r.save();await through(r,3);const partial=goals(r);expect(partial[1]).toEqual({status:'4',progress:'2',world:'2'});expect(partial[0].status).toBe('1');expect(key(reports(r).at(-1)![2])).toBe(key(text('Cancelled')));
 await finish(r);expect(goals(r)[0]).toEqual({status:'2',progress:'1',world:'1'});expect(goals(r)[1]).toEqual(partial[1]);put('partial',{source:zip(b.d.orderedInputs),before:zip(before),partial,final:goals(r),save:zip(r.save())});
},590000);
