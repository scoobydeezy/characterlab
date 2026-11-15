import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue,type Mode} from './fixtures/assembledAttentionReceiving';
import {ENCODING,validateEncoding} from '../assembled/encoding';
import {isSocialEpisodePath,MEMORY_FORMATION} from '../assembled/memory';
import {personPath,personHistory,personMean} from '../assembled/social';
import {AFFECT_RECALL} from '../assembled/affectMemory';
import {WORKSPACE} from '../assembled/workspace';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {restoreAuthoritativeState} from '../substrate/state';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue;trace?:ReturnType<typeof outputs>}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap;
const state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state));
const out=(r:Run)=>view(r).out??=decode(snap(r).outputs);
const trace=(r:Run)=>view(r).trace??=outputs(snap(r).trace,160n);
const report=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const episodes=(r:Run)=>state(r).entries().filter(e=>isSocialEpisodePath(e.path));
const belief=(r:Run)=>state(r).read(personPath(C,target)).value;
const social=(r:Run)=>report(r,'assembled-social-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(a=>key(a[2])===key(target))!;
const mean=(r:Run)=>items(social(r)[4],'list')[0];
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(64);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<64;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('full queue did not exhaust');}
async function run(mode:Mode='main',capacity=1,at=4n,attention='role-calibrated',inheritedCue=false){const b=fixture(mode,capacity,attention,inheritedCue),r=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(r,at);return {b,r};}
function live(r:Run){expect(personHistory(belief(r))).toHaveLength(2);expect(personMean(belief(r))).toEqual({numerator:1n,denominator:2n});expect(items(social(r)[4],'list')).toHaveLength(1);expect(items(report(r,JOINT_APPRAISAL).at(-1)![4],'list').some(v=>items(v,'list').length===5)).toBe(true);}
function joins(r:Run){
 for(const e of episodes(r)){const a=items(e.value,'list');expect(a).toHaveLength(8);expect(validateEncoding(a[6],a[3])).toBe(true);
  expect(report(r,ENCODING).map(v=>key(list(v)))).toContain(key(a[6]));
  // Presentation/use may change fields4/7; trace must still carry the exact acquisition annex.
  expect(trace(r).some(t=>key(f(rec(f(t,4n),130n),5n))===key(MEMORY_FORMATION)&&items(f(rec(f(t,4n),130n),6n),'list').some(x=>key(x)===key(a[6])))).toBe(true);
 }
 const selected=items(report(r,WORKSPACE).at(-1)![4],'list');expect(selected).toHaveLength(1);
 expect(items(social(r)[6],'list')[3]).toEqual(list([items(selected[0],'list')[0]]));
 expect(items(report(r,JOINT_APPRAISAL).at(-1)![6],'list').slice(1)).toContainEqual(list(social(r)));
}
it('primary120: current selected encoding changes later actual judgment with semantic belief fixed',async()=>{
 const a=await run(),b=await run('unknown');for(const {r}of [a,b])live(r);
 expect(episodes(a.r)).toHaveLength(2);expect(episodes(b.r)).toHaveLength(1);
 expect(mean(a.r)).toEqual(q(1,1));expect(mean(b.r)).toEqual(q(0,1));
 expect(personHistory(belief(a.r)).map(v=>items(v,'list').slice(1))).toEqual(personHistory(belief(b.r)).map(v=>items(v,'list').slice(1)));
 for(const {r}of [a,b]){joins(r);await finish(r);}
 console.info('M120 PRIMARY native0.89 selected A/B vs B-only; global1/2; actual contextual1/0; acquisition->recall->workspace->appraisal; full queues exhausted');
},500000);
it('gate120 facet120: permitted appearance classification differs without changing role encoding or judgment',async()=>{
 const a=await run(),b=await run('bare');for(const {r}of [a,b]){live(r);joins(r);expect(mean(r)).toEqual(q(1,1));}
 expect(outputs(out(a.r),225n).length).toBeGreaterThan(outputs(out(b.r),225n).length);
 expect(report(b.r,ENCODING)).toEqual(report(a.r,ENCODING));
 for(const {r}of [a,b])await finish(r);
 console.info('M120 FACET native perceived classification present/absent; exact encoding factors, later judgment1 unchanged');
},400000);
it('gate120 controls120: permission selection hidden role and disabled attention remain distinct',async()=>{
 const zero=await run('main',0),denied=await run('denied',1,1n),hidden=await run('hidden',1,1n),normal=await run('main',1,1n);
 live(zero.r);expect(episodes(zero.r)).toHaveLength(0);expect(mean(zero.r)).toEqual(q(1,2));
 expect(episodes(denied.r)).toHaveLength(0);expect(report(denied.r,ENCODING)).toHaveLength(0);
 expect(report(hidden.r,ENCODING)).toEqual(report(normal.r,ENCODING));expect(snap(hidden.r).state).toEqual(snap(normal.r).state);
 for(const [attention,expected]of [['role-calibrated',q(243,1000)],['disabled-attention',q(27,100)]] as const){const {r}=await run('target',1,1n,attention);expect(items(items(report(r,ENCODING)[0][8],'list')[0],'list')[6]).toEqual(expected);await finish(r);}
 for(const {r}of [zero,denied,hidden,normal])await finish(r);
 console.info('M120 CONTROLS admitted belief1/2 with capacity0/no episodes; denied no encoding; hidden role invariant; actual Target243/1000 vs27/100');
},400000);
it('gate120 continuation120: full-byte duplicate and save3 continuation',async()=>{
 const b=fixture(),m=await prepareCharacterModel(b.s),a=await createCharacterRun(m,b.d),duplicate=await createCharacterRun(m,b.d);
 await through(a,3n);await through(duplicate,3n);exact(a,duplicate);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);
 await finish(a,[duplicate,restored]);console.info('M120 CONTINUATION exact run identity/state/outputs/trace/save at every settled boundary through full queue');
},400000);


it('gate120 inherited120: retain original indirect reminder null with actual recall operands',async()=>{for(const mode of ['main','unknown'] as const){const {r}=await run(mode,1,4n,'role-calibrated',true);live(r);expect(mean(r)).toEqual(q(0,1));const recalls=report(r,AFFECT_RECALL);expect(recalls.length).toBeGreaterThan(0);for(const row of recalls)console.info('M120 inherited recall mode='+mode+' at='+key(row[1])+' gain='+key(row[3])+' scores='+key(row[4])+' selected='+key(row[5]));joins(r);await finish(r);}console.info('M120 INHERITED actual recency/association rank selects B in both histories; original null preserved');},400000);

it('reference120: current version and adopted feedback remain explicit',()=>{const b=fixture(),slots=items(decode(b.s.registry),'list');expect(b.s.rulesVersion).toBe('rules/assembled-character/0.89-candidate');expect(slots).toHaveLength(47);const declared=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>f(rec(v,171n),4n)).find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===436n)!;expect(declared).toBeDefined();expect(f(rec(declared,436n),1n),'adopted feedback TRUE').toBe(true);console.info('M120 REFERENCE0.89/47slots; formation feedback TRUE; native encoder0.1 unchanged');});
