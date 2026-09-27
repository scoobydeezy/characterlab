import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as field,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileFearGuiltModel,compileFearGuiltInputs,fearGuiltRecipe,STAGES,eventId,path,owner,HOLDERS} from '../campaign3/fearGuiltModel';
import {createFearGuiltRuntime} from '../campaign3/fearGuiltRuntime';
import {emptyKnowledge,learn} from '../campaign3/fearGuiltMath';
import {prepareFearGuiltModel,createFearGuiltRun,restoreFearGuiltRun} from '../campaign3/fearGuiltFactory';
import {decodeFearGuilt as decode} from '../campaign3/fearGuiltCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './fearGuiltFixtures';
const f=(v:CanonicalValue,id:bigint)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('test requires record');return field(v,id);};
async function setup(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const source=fearGuiltRecipe(law,goal),m=await compileFearGuiltModel(source),orderedInputs=ordered(cases()[name]),i=await compileFearGuiltInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createFearGuiltRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const s=await setup(name,law,goal);while(await s.r.settle()){}return s;}
const outputs=(s:Awaited<ReturnType<typeof run>>,type:bigint)=>records(s.r.snapshot().outputs,type);
const judgments=(s:Awaited<ReturnType<typeof run>>,i=0)=>outputs(s,1173n).filter(x=>key(f(x,3n))===key(HOLDERS[i]));
const apps=(s:Awaited<ReturnType<typeof run>>,i=0)=>outputs(s,1174n).filter(x=>key(f(f(x,2n),3n))===key(HOLDERS[i]));
it('innocent nervousness supports mistaken guilt attribution; visible alternative revises it and possession contests it',async()=>{
 const s=await run();expect(judgments(s).map(x=>f(x,6n))).toEqual([list([]),list([q(3,4)]),list([q(3,8)]),list([q(3,4)])]);
 expect(f(judgments(s,1)[2],6n)).toEqual(list([q(3,4)]));expect(f(judgments(s,1)[3],6n)).toEqual(list([q(15,16)]));
 for(const x of outputs(s,1168n))expect(f(x,4n)).toEqual(list([q(1,1),q(1,1)]));for(const x of outputs(s,1169n))expect(f(x,3n)).toEqual(list([true]));
 expect(f(apps(s)[2],5n)).toEqual(list([q(3,8),q(3,8)]));
});
it('changing only admitted context changes later attribution, not private fear, display or earlier judgment',async()=>{
 const s=await run(),none=await run('noContext'),ex=await run('exculpatory');for(const t of [1168n,1169n])expect(outputs(s,t)).toEqual(outputs(none,t));
 expect(judgments(s).slice(0,2)).toEqual(judgments(none).slice(0,2));expect(f(judgments(none)[2],6n)).toEqual(list([q(3,4)]));expect(f(judgments(ex)[3],6n)).toEqual(list([q(3,28)]));
});
it('cue-only is a simpler competitor; no learning and unknown remain distinct from known calm',async()=>{
 const cue=await run('main',2),no=await run('main',3),unknown=await run('unknown'),calm=await run('calm'),missing=await run('noCue');
 expect(judgments(cue).slice(1).map(x=>f(x,6n))).toEqual([1,2,3].map(()=>list([q(3,4)])));
 for(const s of [no,unknown])for(const j of judgments(s))expect(f(j,6n)).toEqual(list([]));
 expect(f(judgments(calm)[1],6n)).toEqual(list([q(1,4)]));expect(f(judgments(missing)[1],6n)).toEqual(list([]));expect(f(judgments(missing)[2],6n)).toEqual(list([q(1,6)]));
});
it('goal changes appraisal but not evidence, inference or source',async()=>{
 const s=await run(),op=await run('main',1,2);for(const t of [1168n,1169n,1170n,1173n,1175n])expect(outputs(s,t)).toEqual(outputs(op,t));expect(f(apps(op)[2],5n)).toEqual(list([q(5,8),q(5,8)]));
});
it('whole subsequent received views exclude wrongdoing, private cause and other observer receipt; Oracle violates this',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>,law=1)=>{const source=fearGuiltRecipe(law),r=await createFearGuiltRun(await prepareFearGuiltModel(source),{initialState,orderedInputs:ordered(cases()[name]),runSeed:seed});while(await r.settleNextInstant()){}return [r.observerView(0),r.observerView(1)];};
 const base=await view('main');expect(await view('hiddenTruth')).toEqual(base);expect(await view('hiddenCause')).toEqual(base);expect((await view('noA'))[1]).toEqual(base[1]);expect((await view('noB'))[0]).toEqual(base[0]);expect((await view('otherContext'))[0]).toEqual(base[0]);expect(await view('noDisplay')).toEqual(await view('deniedCause'));expect(await view('main',4)).not.toEqual(await view('hiddenTruth',4));
},120000);
it('actual phases preserve consequence learning, and probes cannot multiply retained evidence',async()=>{
 const s=await run();for(const [type,phase] of [[1173n,40n],[1168n,50n],[1174n,50n],[1169n,110n],[1170n,120n],[1175n,140n]] as const){const ts=s.r.snapshot().trace.map(x=>rec(x,160n)).filter(x=>records(items(f(x,13n),'list'),type).length);expect(ts.length).toBeGreaterThan(0);for(const t of ts)expect(f(f(t,4n),3n)).toEqual(u(phase));}
 const rows=cases().main;rows.push({...rows[3]});const m=await compileFearGuiltModel(fearGuiltRecipe()),r=createFearGuiltRuntime(m,await compileFearGuiltInputs(m,initialState,ordered(rows),seed));while(await r.settle()){}const js=records(r.snapshot().outputs,1173n).filter(x=>key(f(x,3n))===key(HOLDERS[0]));expect(f(js[4],6n)).toEqual(f(js[3],6n));expect(r.snapshot().randomAddresses).toEqual([]);
});
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after acquired evidence`,async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('fear guilt fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
it('rejects foreign writers, invalid state/input, forged handles and altered saves',async()=>{
 const s=await setup();expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(1),expected:{presence:false},newValue:emptyKnowledge()}]},owner('learn-a'),s.m.authority)).toThrow();await expect(compileFearGuiltInputs(s.m,enc(list([])),s.orderedInputs,seed)).rejects.toThrow('INITIAL_STATE');
 const rows=cases().main;rows[1].truth=true;await expect(compileFearGuiltInputs(s.m,initialState,ordered(rows),seed)).rejects.toThrow('INCIDENT_TRUTH');
 const r=await createFearGuiltRun(await prepareFearGuiltModel(s.source),{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const save=rec(decode(r.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restoreFearGuiltRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restoreFearGuiltRun(s.source,{initialState,orderedInputs:ordered(cases().hiddenTruth),save:r.save()})).rejects.toThrow();await expect(createFearGuiltRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>r.observerView(2)).toThrow();
});
it('rejects altered model bytes, foreign retained evidence and unordered input',async()=>{
 const s=await run(),profile=rec(decode(s.source.parameters),1165n),fields=new Map(profile.fields);fields.set(1n,list([]));await expect(compileFearGuiltModel({...s.source,parameters:enc(record(profile.schema,fields))})).rejects.toThrow();
 expect(()=>learn(emptyKnowledge(),outputs(s,1170n)[0],1,1)).toThrow('FOREIGN_EVIDENCE');
 const inputs=items(decode(s.orderedInputs),'list');await expect(compileFearGuiltInputs(s.m,initialState,enc(list([...inputs].reverse())),seed)).rejects.toThrow('INPUT_ORDER');
});
