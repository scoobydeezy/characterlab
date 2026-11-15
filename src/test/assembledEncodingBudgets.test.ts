import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {BUDGET_ENCODING,BUDGET_ENCODING_VERSION,validateEncoding} from '../assembled/encoding';
import * as encoder from '../assembled/encoding';
import {POSITION,POSITION_SOURCE} from '../assembled/positionPerception';
import {isSocialEpisodePath,MEMORY_FORMATION,POSITION_EPISODE,validatePositionEpisode} from '../assembled/memory';
import {personPath,personHistory,personMean,SOCIAL_STAGES} from '../assembled/social';
import {WORKSPACE} from '../assembled/workspace';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {restoreAuthoritativeState} from '../substrate/state';
import {unsigned as u} from '../substrate/canonicalEncoding';
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue,type Mode,type EncodingBudget,type SelectedBudgetCalibration} from './fixtures/assembledEncodingBudgets';
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
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(64);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<64;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('full queue did not exhaust');}
async function create(...args:Parameters<typeof fixture>){const b=fixture(...args),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);return {b,m,r};}
const factorRows=(a:readonly CanonicalValue[])=>items(a[8],'list').map(v=>items(v,'list'));
const focal=(a:readonly CanonicalValue[])=>factorRows(a).find(v=>key(v[1])===key(text('causal-role/actor')))!;
function assessment(r:Run,count:number,selected:number,law:EncodingBudget,calibration:SelectedBudgetCalibration){
 const a=report(r,BUDGET_ENCODING)[0];expect(a).toBeDefined();expect(a).toHaveLength(11);
 expect(a[9]).toEqual(text(law));expect(a[10]).toEqual(text(calibration));
 const audit=items(a[6],'list').map(v=>items(v,'list'));expect(audit).toHaveLength(count);expect(audit.every(v=>key(v[2])===key(text('Eligible')))).toBe(true);expect(audit.filter(v=>v[3]===true)).toHaveLength(selected);expect(selected).toBeLessThanOrEqual(Number(uint(a[1])));
 const full=outputs(out(r),227n).find(v=>key(f(v,1n))===key(f(rec(a[4],227n),1n)))!;expect(full).toBeDefined();expect(items(f(full,5n),'set')).toHaveLength(count);expect(validateEncoding(list(a),full)).toBe(selected>0);
 const stage=trace(r).find(t=>key(f(rec(f(t,4n),130n),2n))===key(signed(1))&&key(f(rec(f(t,4n),130n),5n))===key(SOCIAL_STAGES[0]))!;expect(stage).toBeDefined();expect(f(stage,6n)).toEqual(text(BUDGET_ENCODING_VERSION));
 if(selected){expect(episodes(r)).toHaveLength(1);expect(items(episodes(r)[0].value,'list')[6]).toEqual(list(a));}else expect(episodes(r)).toHaveLength(0);
 return a;
}
function probe(r:Run,positive=true){
 // Liveness precedes any comparison: semantic and contextual quantities actually exist.
 expect(personHistory(belief(r))).toHaveLength(2);expect(personMean(belief(r))).toEqual({numerator:1n,denominator:2n});
 const judgment=social(r);expect(items(judgment[4],'list')).toHaveLength(1);expect(items(report(r,JOINT_APPRAISAL).at(-1)![4],'list').some(v=>items(v,'list').length===5)).toBe(true);
 expect(items(judgment[4],'list')[0]).toEqual(positive?q(1,1):q(1,2));
 expect(episodes(r)).toHaveLength(positive?2:0);
 for(const e of episodes(r)){const a=items(e.value,'list');expect(validateEncoding(a[6],a[3])).toBe(true);expect(report(r,BUDGET_ENCODING).map(v=>key(list(v)))).toContain(key(a[6]));expect(trace(r).some(t=>key(f(rec(f(t,4n),130n),5n))===key(MEMORY_FORMATION)&&items(f(rec(f(t,4n),130n),6n),'list').some(x=>key(x)===key(a[6])))).toBe(true);}
 if(positive){const selected=items(report(r,WORKSPACE).at(-1)![4],'list');expect(selected).toHaveLength(1);expect(items(judgment[6],'list')[3]).toEqual(list([items(selected[0],'list')[0]]));expect(items(report(r,JOINT_APPRAISAL).at(-1)![6],'list').slice(1)).toContainEqual(list(judgment));}
}
it('primary122: exact budget competitors reach real stored memory and later live judgment',async()=>{
 const cases:[EncodingBudget,SelectedBudgetCalibration,CanonicalValue,CanonicalValue][]=[
  ['historical-shared','UnitBudget',q(3,10),q(3,10)],['independent','UnitBudget',q(3,13),q(3,13)],
  ['historical-hybrid','UnitBudget',q(3,13),q(3,13)],['retired-flat','UnitBudget',q(1,1),q(1,1)],
  ['historical-shared','SmallBudget',q(1,1),q(25,34)],['historical-hybrid','SmallBudget',q(3,13),q(3,13)]];
 const common=new Map<string,CanonicalValue[]>();let models=new Set<string>();
 for(const [law,calibration,sparse,dense]of cases){
  for(const [mode,expected]of [['sparse',sparse],['dense',dense]] as const){
   const {r}=await create(mode,law,calibration);await through(r,1n);const a=assessment(r,mode==='sparse'?1:2,mode==='sparse'?1:2,law,calibration);
   expect(focal(a).slice(2,6)).toEqual([q(3,10),q(1,1),q(1,1),q(3,10)]);expect(focal(a)[6]).toEqual(expected);
   if(law==='historical-hybrid'&&calibration==='SmallBudget'&&mode==='dense')expect(factorRows(a).find(v=>key(v[1])===key(text('causal-role/participant')))![6]).toEqual(q(1,1));
   // Policy changes identity, never permitted evidence or selected capability contents.
   const projection=a.slice(3,8);if(common.has(mode))expect(projection).toEqual(common.get(mode));else common.set(mode,projection);
   models.add(key(f(trace(r)[0],2n)));await through(r,4n);probe(r);await finish(r);
   console.info('M122 ROW',law,calibration,mode,'focal',JSON.stringify(expected,(_,v)=>typeof v==='bigint'?String(v):v),'belief1/2 judgment1, full queue');
  }
 }
 expect(models.size).toBe(6);
},550000);
it('remaining122 controls122: permission capacity hidden truth and attention operand stay separate',async()=>{
 const a=await create('dense','historical-shared','SmallBudget'),hidden=await create('hidden','historical-shared','SmallBudget'),denied=await create('denied','historical-shared','SmallBudget'),sparse=await create('sparse','historical-shared','SmallBudget');
 for(const {r}of[a,hidden,denied,sparse])await through(r,1n);
 assessment(a.r,2,2,'historical-shared','SmallBudget');assessment(hidden.r,2,2,'historical-shared','SmallBudget');assessment(denied.r,1,1,'historical-shared','SmallBudget');assessment(sparse.r,1,1,'historical-shared','SmallBudget');
 for(const [x,y]of [[a,hidden],[denied,sparse]]){bytes(snap(x.r).state,snap(y.r).state);bytes(snap(x.r).outputs,snap(y.r).outputs);}
 for(const {r}of[a,hidden,denied,sparse]){await through(r,4n);probe(r);await finish(r);}
 for(const capacity of [0,1]){const {r}=await create('dense','historical-shared','SmallBudget',capacity);await through(r,1n);const e=assessment(r,2,capacity,'historical-shared','SmallBudget');if(capacity)expect(focal(e)[6]).toEqual(q(1,1));await through(r,4n);probe(r,capacity>0);await finish(r);}
 const disabled=await create('dense','historical-shared','UnitBudget',2,'disabled-attention');await through(disabled.r,1n);const e=assessment(disabled.r,2,2,'historical-shared','UnitBudget'),p=factorRows(e).find(v=>key(v[1])===key(text('causal-role/participant')))!;expect(p.slice(2)).toEqual([q(3,10),q(3,5),q(1,1),q(9,50),q(9,50)]);await through(disabled.r,4n);probe(disabled.r);await finish(disabled.r);
 console.info('M122 CONTROLS denied==absent, hidden truth invariant, K1 excluded footprint strength1, K0 no episodes/fallback1/2, disabled attention preserves causal role');
},500000);
it('remaining122 continuation122: nonreference budget exact repeat restore and atomic failure',async()=>{
 const b=fixture('dense','historical-shared','SmallBudget'),m=await prepareCharacterModel(b.s),a=await createCharacterRun(m,b.d),duplicate=await createCharacterRun(m,b.d);
 await through(a,1n);await through(duplicate,1n);exact(a,duplicate);const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);await finish(a,[duplicate,restored]);
 const fault=await createCharacterRun(m,b.d),before=fault.snapshot(),saved=fault.save(),original=encoder.encodeExperience;let reached=false;
 const spy=vi.spyOn(encoder,'encodeExperience').mockImplementation((...args)=>{const result=original(...args);expect(items(result.value,'list')[10]).toEqual(text('SmallBudget'));reached=true;throw Error('M122 after budget encoding');});
 try{await expect(fault.settleNextInstant()).rejects.toThrow('M122 after budget encoding');expect(reached).toBe(true);expect({...fault.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:saved});await finish(recovered);exact(a,recovered);
 console.info('M122 CONTINUATION exact repeat/save1/restore/full queues; post-encoding failure restores visible preinstant snapshot and saved prefix matches clean continuation');
},500000);
it('remaining122 boundaries122: declaration and memory bind the exact fixed law and calibration',async()=>{
 const b=fixture('dense','historical-shared','SmallBudget'),s=items(decode(b.s.registry),'list');
 for(const [index,value]of [[3,text('unknown')],[4,text('UnknownBudget')]] as const){const declaration=[...items(s[30],'list')];declaration[index]=value;const slots=[...s];slots[30]=list(declaration);await expect(prepareCharacterModel({...b.s,registry:enc(list(slots))})).rejects.toThrow('encoding: budget domain');}
 await expect(prepareCharacterModel({...b.s,rulesVersion:b.legacy.s.rulesVersion,registrySchemaVersion:b.legacy.s.registrySchemaVersion})).rejects.toThrow('encoding: declaration');
 const r=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(r,1n);const a=assessment(r,2,2,'historical-shared','SmallBudget');
 const modified=[...a],rows=[...items(a[8],'list')],row=[...items(rows[0],'list')];row[6]=q(1,7);rows[0]=list(row);modified[8]=list(rows);expect(()=>validateEncoding(list(modified),a[4])).toThrow('canonical factors/refs');
 for(const args of [['dense','historical-shared','UnitBudget'],['dense','independent','SmallBudget']] as const){const other=fixture(args[0],args[1],args[2]),s=await compileCharacterState(await compileCharacterModel(other.s));expect(()=>s.stateModel.validateState(state(r))).toThrow('encoding model binding');}
 const old=await compileCharacterState(await compileCharacterModel(b.legacy.s));expect(()=>old.stateModel.validateState(state(r))).toThrow('encoding model binding');await finish(r);
 console.info('M122 BOUNDARIES unknown policies, old grammar/annex, different-law or calibration state and forged strength rejected');
},180000);
it('remaining122 position122: existing position channel uses and validates the same budget encoder',async()=>{
 const b=fixture('dense','independent','UnitBudget'),rows=items(decode(b.d.orderedInputs),'list');expect(rows.some(v=>key(items(v,'list')[2])===key(POSITION_SOURCE))).toBe(false);
 const frame=list([signed(1),u(10),POSITION_SOURCE,list([text(POSITION),list([u(0),u(0),u(1),true,true,u(1)]),list([u(1),text('Before'),true,true])]),list([])]);
 const r=await createCharacterRun(await prepareCharacterModel(b.s),{...b.d,orderedInputs:enc(list([...rows,frame]))});await finish(r);
 const formed=trace(r).filter(t=>key(f(rec(f(t,4n),130n),5n))===key(MEMORY_FORMATION)).map(t=>items(f(rec(f(t,4n),130n),6n),'list')).filter(a=>key(a[0])===key(text(POSITION_EPISODE)));expect(formed.length).toBeGreaterThan(0);
 for(const p of formed){validatePositionEpisode(list(p));const e=items(p[6],'list');expect(e[0]).toEqual(text(BUDGET_ENCODING));expect(e[9]).toEqual(text('independent'));expect(focal(e)[6]).toEqual(q(3,13));expect(()=>validatePositionEpisode(list(p),{multiUnit:true,capacity:2,attention:'role-calibrated',budgetLaw:'historical-shared',budgetCalibration:'UnitBudget'})).toThrow('encoding model');}
 console.info('M122 POSITION actual formation uses same independent3/13 encoder and rejects other-model policy');
},240000);
