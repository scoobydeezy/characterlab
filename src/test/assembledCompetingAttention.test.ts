import {fixture as effectFixture} from './fixtures/assembledEffectEvidence';
import {MULTI_UNIT_RULES,MULTI_UNIT_REGISTRY} from '../assembled/model';
import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue,type Mode} from './fixtures/assembledCompetingAttention';
import {MULTI_ENCODING,validateEncoding} from '../assembled/encoding';
import * as encoder from '../assembled/encoding';
import {isSocialEpisodePath,MEMORY_FORMATION,POSITION_EPISODE} from '../assembled/memory';
import {personPath,personHistory,personMean,SOCIAL_SOURCE,SOCIAL_STAGES} from '../assembled/social';
import {WORKSPACE} from '../assembled/workspace';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {dataIdentity as id} from '../campaign2/canonicalData';
import {SemanticMutationAuthority as OWNER} from '../semanticBinding/semanticStateAuthority';
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
async function create(mode:Mode='low',capacity=1){const b=fixture(mode,capacity),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);return {b,m,r};}
function live(r:Run){expect(personHistory(belief(r))).toHaveLength(2);expect(personMean(belief(r))).toEqual({numerator:1n,denominator:2n});expect(items(social(r)[4],'list')).toHaveLength(1);expect(items(report(r,JOINT_APPRAISAL).at(-1)![4],'list').some(v=>items(v,'list').length===5)).toBe(true);}
function assessment(r:Run,count:number,selected:number,focal:boolean){
 const a=report(r,MULTI_ENCODING)[0];expect(a).toBeDefined();const audit=items(a[6],'list').map(v=>items(v,'list'));
 expect(audit).toHaveLength(count);
 expect(audit.every(v=>key(v[2])===key(text('Eligible')))).toBe(true);expect(audit.filter(v=>v[3]===true)).toHaveLength(selected);
 const targetRow=audit.find(v=>items(v[1],'list').some(x=>key(x)===key(text('causal-role/target'))))!;expect(targetRow).toBeDefined();expect(targetRow[3]).toBe(focal);
 expect(validateEncoding(list(a),a[4]),'a positive distractor cannot authorize focal memory').toBe(focal);
 const full=outputs(out(r),227n).find(v=>key(f(v,1n))===key(f(rec(a[4],227n),1n)))!;expect(full).toBeDefined();expect(items(f(full,5n),'set')).toHaveLength(count);expect(validateEncoding(list(a),full)).toBe(focal);
 const ids=items(a[3],'list').map(uint);expect(new Set(ids).size).toBe(count);
 const bindingIds=items(f(full,5n),'set').map(v=>uint(id(f(rec(v,224n),1n)).payload));expect(new Set([...bindingIds,...ids]).size).toBe(count*2);
 const first=trace(r).find(t=>key(f(rec(f(t,4n),130n),2n))===key(signed(1))&&key(f(rec(f(t,4n),130n),5n))===key(SOCIAL_STAGES[0]))!;
 expect(first).toBeDefined();expect(f(first,6n)).toEqual(text('assembled-character-encoding/0.2-candidate'));
 const ops=items(f(rec(f(first,16n),144n),1n),'list').map(v=>rec(v,145n));
 const members=ops.filter(o=>{const p=rec(f(o,1n),140n);return uint(f(p,1n))===241n&&uint(f(p,2n))===2n;});expect(members).toHaveLength(count);
 for(const d of items(f(first,17n),'list'))expect(f(rec(d,148n),6n)).toEqual(OWNER.Perception);
 return a;
}
function joins(r:Run){
 for(const e of episodes(r)){const a=items(e.value,'list');expect(validateEncoding(a[6],a[3])).toBe(true);
  expect(report(r,MULTI_ENCODING).map(v=>key(list(v)))).toContain(key(a[6]));
  expect(trace(r).some(t=>key(f(rec(f(t,4n),130n),5n))===key(MEMORY_FORMATION)&&items(f(rec(f(t,4n),130n),6n),'list').some(x=>key(x)===key(a[6])))).toBe(true);
 }
 const selected=items(report(r,WORKSPACE).at(-1)![4],'list');expect(selected).toHaveLength(1);
 expect(items(social(r)[6],'list')[3]).toEqual(list([items(selected[0],'list')[0]]));
 expect(items(report(r,JOINT_APPRAISAL).at(-1)![6],'list').slice(1)).toContainEqual(list(social(r)));
}
it('primary121: two permitted candidates compete and selected focal memory changes actual appraisal',async()=>{
 const a=await create('low'),b=await create('high');for(const {r}of [a,b])await through(r,1n);
 assessment(a.r,2,1,true);assessment(b.r,2,1,false);expect(episodes(a.r)).toHaveLength(1);expect(episodes(b.r)).toHaveLength(0);
 for(const {r}of [a,b]){await through(r,4n);live(r);joins(r);}
 expect(mean(a.r)).toEqual(q(1,1));expect(mean(b.r)).toEqual(q(0,1));expect(episodes(a.r)).toHaveLength(2);expect(episodes(b.r)).toHaveLength(1);
 expect(personHistory(belief(a.r)).map(v=>items(v,'list').slice(1))).toEqual(personHistory(belief(b.r)).map(v=>items(v,'list').slice(1)));
 for(const {r}of [a,b])await finish(r);
 console.info('M121 PRIMARY Target vs Participant selects focal; Target vs Actor excludes focal; actual2 eligible/K1; equal belief1/2, recalled judgment1/0; full queue');
},400000);
it('remaining121 controls121: capacity permission truth and lower-priority footprint',async()=>{
 const low=await create(),hidden=await create('hidden'),dense=await create('dense'),denied=await create('denied'),none=await create('none');
 for(const {r}of [low,hidden,dense,denied,none])await through(r,1n);
 const a=assessment(low.r,2,1,true),c=assessment(dense.r,3,1,true);assessment(denied.r,1,1,true);assessment(none.r,1,1,true);
 expect(items(a[8],'list').map(v=>items(v,'list').slice(1))).toEqual(items(c[8],'list').map(v=>items(v,'list').slice(1)));
 expect(report(hidden.r,MULTI_ENCODING)).toEqual(report(low.r,MULTI_ENCODING));bytes(snap(hidden.r).state,snap(low.r).state);bytes(snap(hidden.r).outputs,snap(low.r).outputs);
 expect(report(denied.r,MULTI_ENCODING)).toEqual(report(none.r,MULTI_ENCODING));bytes(snap(denied.r).state,snap(none.r).state);bytes(snap(denied.r).outputs,snap(none.r).outputs);
 for(const capacity of [0,2]){const {r}=await create('high',capacity);await through(r,1n);assessment(r,2,capacity,capacity===2);expect(episodes(r)).toHaveLength(capacity===2?1:0);await through(r,4n);live(r);expect(mean(r)).toEqual(capacity===2?q(1,1):q(1,2));await finish(r);}
 for(const {r}of [low,hidden,dense,denied,none]){await through(r,4n);live(r);expect(mean(r)).toEqual(q(1,1));await finish(r);}
 console.info('M121 CONTROLS K0/2; denied==absent; hidden truth identical; third unselected unit leaves focal factors and later judgment unchanged');
},500000);
it('remaining121 continuation121: multi-unit atomic rollback repeat and full save continuation',async()=>{
 const b=fixture(),m=await prepareCharacterModel(b.s),a=await createCharacterRun(m,b.d),duplicate=await createCharacterRun(m,b.d);
 await through(a,1n);await through(duplicate,1n);exact(a,duplicate);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);await finish(a,[duplicate,restored]);
 const fault=await createCharacterRun(m,b.d),before=fault.snapshot(),saved=fault.save(),original=encoder.encodeExperience;let reached=false;
 const spy=vi.spyOn(encoder,'encodeExperience').mockImplementation((...args)=>{const result=original(...args);expect(items(items(result.value,'list')[6],'list')).toHaveLength(2);reached=true;throw Error('M121 after multi-unit perception');});
 try{await expect(fault.settleNextInstant()).rejects.toThrow('M121 after multi-unit perception');expect(reached).toBe(true);expect({...fault.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:saved}),clean=await createCharacterRun(m,b.d);exact(recovered,clean);await finish(recovered,[clean]);exact(a,recovered);
 console.info('M121 CONTINUATION exact repeat/save1/full queues; injected post-perception failure rolls back whole instant and restores exact clean continuation');
},500000);
it('remaining121 boundaries121: no extra-source or version bypass and focal selection is mandatory',async()=>{
 const b=fixture(),m=await prepareCharacterModel(b.s),rows=items(decode(b.d.orderedInputs),'list');
 const bad=rows.map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(SOCIAL_SOURCE)&&key(a[0])===key(signed(1))){const p=[...items(a[3],'list')],role=[...items(p[7],'list')],one=items(role[2],'list')[0];role[2]=list([one,one,one]);p[7]=list(role);a[3]=list(p);}return list(a);});
 await expect(createCharacterRun(m,{...b.d,orderedInputs:enc(list(bad))})).rejects.toThrow('additional detection capacity');
 await expect(prepareCharacterModel({...b.s,rulesVersion:b.legacy.s.rulesVersion,registrySchemaVersion:b.legacy.s.registrySchemaVersion})).rejects.toThrow('encoding: declaration');
 const r=await createCharacterRun(m,b.d);await through(r,1n);const a=report(r,MULTI_ENCODING)[0],tampered=[...a];tampered[3]=list([items(a[3],'list')[0],items(a[3],'list')[0]]);expect(()=>validateEncoding(list(tampered),a[4])).toThrow('reserved claim identities');
 console.info('M121 BOUNDARIES source>2, old-version new grammar, duplicate reserved claims reject');
},180000);

it('single121: current position/effect path still uses the shared encoder under0.90',async()=>{
 const b=effectFixture('point',10),slots=[...items(decode(b.s.registry),'list')],setting=items(slots[30],'list');slots[30]=list([text(MULTI_ENCODING),...setting.slice(1)]);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(SOCIAL_SOURCE)){const p=[...items(a[3],'list')];p[7]=list([...items(p[7],'list'),list([])]);a[3]=list(p);}return list(a);});
 const s={...b.s,rulesVersion:MULTI_UNIT_RULES,registrySchemaVersion:MULTI_UNIT_REGISTRY,registry:enc(list(slots))},d={...b.d,orderedInputs:enc(list(rows))},r=await createCharacterRun(await prepareCharacterModel(s),d);
 await finish(r);const positions=state(r).entries().filter(e=>e.path.rootStateTypeId===346n&&typeof e.value!=='boolean'&&e.value.kind==='list'&&key(e.value.items[0])===key(text(POSITION_EPISODE)));
 expect(positions.length,'actual position acquisition under current single-unit source').toBeGreaterThan(0);
 for(const e of positions){const a=items(e.value,'list');expect(items(a[6],'list')[0]).toEqual(text(MULTI_ENCODING));expect(validateEncoding(a[6],a[3])).toBe(true);expect(items(items(a[6],'list')[3],'list')).toHaveLength(1);}
 console.info('M121 SINGLE actual position/effect scenario exhausts with validated encoding0.2 position episodes='+positions.length);
},240000);
