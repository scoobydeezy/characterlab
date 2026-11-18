import {it,expect} from 'vitest';
import {createCharacterRun,prepareCharacterModel,restoreCharacterRun} from '../assembled/character';
import {restoreAuthoritativeState} from '../substrate/state';
import {FAMILIARITY,isAppearancePath,appearanceEpisode} from '../assembled/familiarity';
import {fixture,items,decode,key,text,uint,signed,exact,bytes,outputs,rec,f,type Mode} from './fixtures/assembledFamiliarity';
export type Run=Awaited<ReturnType<typeof createCharacterRun>>;
export async function start(mode:Mode='same'){const b=fixture(mode),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);return {b,m,r};}
export const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
export const episodes=(r:Run)=>state(r).entries().filter(e=>isAppearancePath(e.path));
export const reports=(r:Run)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(FAMILIARITY))).map(v=>items(v,'list'));
export const report=(r:Run,at:number)=>{const xs=reports(r).filter(a=>key(a[1])===key(signed(at)));expect(xs,'one actual live familiarity output').toHaveLength(1);return xs[0];};
export async function through(r:Run,at:bigint){for(let i=0;r.snapshot().clock<at;i++){expect(i).toBeLessThan(96);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
export async function finish(r:Run,peers:Run[]=[]){for(let i=0;i<96;i++){const next=await r.settleNextInstant();for(const p of peers){expect(await p.settleNextInstant()).toBe(next);exact(r,p);}if(!next)return;}throw Error('M154 full queue cap');}
it('primary154: selected neutral appearance loses actual detail and later remains familiar without identity',async()=>{
 const x=await start();await through(x.r,1n);const first=episodes(x.r);expect(first).toHaveLength(1);expect(appearanceEpisode(first[0].value)[8]).toEqual({kind:'list',items:[true]});expect(uint(report(x.r,1)[3]),'cannot self-match').toBe(1n);
 const source=appearanceEpisode(first[0].value)[2],before=outputs(x.r.snapshot().outputs,227n).find(v=>items(f(v,8n),'set').some(s=>key(f(rec(s,216n),2n))===key(source)))!;expect(before,'actual frozen experience').toBeDefined();
 await through(x.r,4n);const lost=state(x.r).read(first[0].path);expect(lost.presence).toBe(true);expect(appearanceEpisode(lost.value!)[8]).toEqual({kind:'list',items:[]});expect(appearanceEpisode(lost.value!).slice(0,8)).toEqual(appearanceEpisode(first[0].value).slice(0,8));
 const allMemory=state(x.r).entries().filter(e=>e.path.rootStateTypeId===346n);expect(allMemory.filter(e=>key(e.value).includes(key(before)))).toHaveLength(0);
 expect(allMemory.filter(e=>typeof e.value!=='boolean'&&e.value.kind==='list'&&key(e.value.items[0])===key(text('assembled-social-episode/0.1')))).toHaveLength(0);
 await through(x.r,5n);const out=report(x.r,5);expect(uint(out[3])).toBe(4n);expect(items(out[5],'list')).toContainEqual(source);expect(items(out[6],'list').map(v=>items(v,'list')[5])).toEqual([ {kind:'list',items:[]},{kind:'list',items:[]} ]);
 expect(outputs(x.r.snapshot().outputs,227n)).toContainEqual(before);
 const trace=outputs(x.r.snapshot().trace,160n).find(t=>key(f(t,13n))===key({kind:'list',items:[{kind:'list',items:out}]}))!;expect(trace,'derived output trace').toBeDefined();expect(items(f(trace,11n),'list')).toHaveLength(2);
 await finish(x.r);console.info('M154 PRIMARY PASS actual C1/attention ->346 appearance; age3 detail removal; later Familiar; no claim-memory copy; prior-only reads/full queue');
},540000);
it('continuation154: independent repeats and saves before and after fragmentation match all later bytes',async()=>{
 const x=await start(),repeat=await createCharacterRun(x.m,x.b.d);await through(x.r,1n);await through(repeat,1n);exact(x.r,repeat);
 const saved1=await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.r.save()});
 while(x.r.snapshot().clock<4n){const next=await x.r.settleNextInstant();expect(next).toBe(true);for(const peer of[repeat,saved1]){expect(await peer.settleNextInstant()).toBe(next);exact(x.r,peer);}}
 const saved4=await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.r.save()});exact(x.r,saved4);await finish(x.r,[repeat,saved1,saved4]);report(x.r,5);
 console.info('M154 CONTINUATION PASS full state/output/trace/save/identity after saves1/4 through queue exhaustion');
},540000);
it('privacy154: hidden truth and denied old exposure cannot supply familiarity',async()=>{
 const a=await start(),b=await start('hidden'),denied=await start('denied');
 for(let i=0;i<96;i++){const next=await a.r.settleNextInstant();expect(await b.r.settleNextInstant()).toBe(next);bytes(a.r.snapshot().state,b.r.snapshot().state);bytes(a.r.snapshot().outputs,b.r.snapshot().outputs);if(!next)break;if(i===95)throw Error('queue cap');}
 await finish(denied.r);expect(uint(report(denied.r,4)[3])).toBe(1n);expect(uint(report(a.r,4)[3])).toBe(4n);
 console.info('M154 PRIVACY PASS hidden truth full safe state/output equality; denied first encounter leaves no history');
},540000);
