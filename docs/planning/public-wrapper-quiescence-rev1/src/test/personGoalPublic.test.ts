import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as field,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compilePersonGoalModel,compilePersonGoalInputs,personGoalRecipe,STAGES,eventId,path,goalPath,owner,HOLDERS} from '../campaign3/personGoalModel';
import {createPersonGoalRuntime} from '../campaign3/personGoalRuntime';
import {emptyKnowledge,learn} from '../campaign3/personGoalMath';
import {preparePersonGoalModel,createPersonGoalRun,restorePersonGoalRun} from '../campaign3/personGoalFactory';
import {decodePersonGoal as decode} from '../campaign3/personGoalCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './personGoalFixtures';
const f=(v:CanonicalValue,id:bigint)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('test requires record');return field(v,id);};
async function setup(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const source=personGoalRecipe(law,goal),m=await compilePersonGoalModel(source),orderedInputs=ordered(cases()[name]),i=await compilePersonGoalInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createPersonGoalRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const s=await setup(name,law,goal);while(await s.r.settle()){}return s;}
const outputs=(s:Awaited<ReturnType<typeof run>>,type:bigint)=>records(s.r.snapshot().outputs,type);
const judgments=(s:Awaited<ReturnType<typeof run>>,i=0)=>outputs(s,1186n).filter(x=>key(f(x,3n))===key(HOLDERS[i]));
const apps=(s:Awaited<ReturnType<typeof run>>,i=0)=>outputs(s,1187n).filter(x=>key(f(f(x,2n),3n))===key(HOLDERS[i]));
it('infers desired destination through ambiguous motion, mistaken classification and later correction',async()=>{
 const s=await run();expect(judgments(s).map(x=>f(x,6n))).toEqual([list([]),list([]),list([q(1,2)]),list([q(1,4)]),list([q(9,10)])]);expect(f(judgments(s,1)[3],6n)).toEqual(list([q(3,4)]));
 expect(outputs(s,1181n).map(x=>f(x,4n))).toEqual([0,1,2,4,1].map(u));expect(f(apps(s)[3],5n)).toEqual(list([q(3,4),q(3,4)]));
 const goals=outputs(s,1191n);for(const g of goals)expect(g).toEqual(goals[0]);expect(f(goals[0],4n)).toEqual(u(1));
});
it('different actual strategies can express the same desired state without changing inferred goal weights',async()=>{
 const s=await run(),alt=await run('alternate');expect(judgments(s).map(x=>f(x,6n))).toEqual(judgments(alt).map(x=>f(x,6n)));expect(outputs(s,1181n).map(x=>f(x,4n))).not.toEqual(outputs(alt,1181n).map(x=>f(x,4n)));expect(s.r.snapshot().state.read(goalPath)).toEqual(alt.r.snapshot().state.read(goalPath));
});
it('failed attempts inform inference while outcome-only remains unknown; no opportunity is not an attempt',async()=>{
 const failed=await run('failed'),out=await run('failed',2),none=await run('unavailable');expect(f(judgments(failed)[4],6n)).toEqual(list([q(3,4)]));for(const j of judgments(out))expect(f(j,6n)).toEqual(list([]));for(const j of judgments(none))expect(f(j,6n)).toEqual(list([]));expect(outputs(failed,1190n)).toEqual(outputs(await run(),1190n));
});
it('unknown differs from shared-route ambiguity and retention does not multiply repeated evidence',async()=>{
 for(const s of [await run('unknown'),await run('main',3)])for(const j of judgments(s))expect(f(j,6n)).toEqual(list([]));
 const s=await run();expect(f(judgments(s)[2],6n)).toEqual(list([q(1,2)]));const rows=cases().main;rows[4]={...rows[3]};rows.push({...rows[3]});const m=await compilePersonGoalModel(personGoalRecipe()),r=createPersonGoalRuntime(m,await compilePersonGoalInputs(m,initialState,ordered(rows),seed));while(await r.settle()){}const js=records(r.snapshot().outputs,1186n).filter(x=>key(f(x,3n))===key(HOLDERS[0]));expect(f(js[5],6n)).toEqual(f(js[4],6n));
});
it('current appraisal changes with observer goal while inference, target goal and actual attempts stay fixed',async()=>{
 const s=await run(),op=await run('main',1,2);for(const t of [1181n,1190n,1182n,1183n,1186n,1188n,1191n])expect(outputs(s,t)).toEqual(outputs(op,t));expect(f(apps(op)[3],5n)).toEqual(list([q(1,4),q(1,4)]));
});
it('whole later views exclude hidden goal and other-observer information; goal Oracle violates privacy',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>,law=1)=>{const source=personGoalRecipe(law),r=await createPersonGoalRun(await preparePersonGoalModel(source),{initialState,orderedInputs:ordered(cases()[name]),runSeed:seed});while(await r.settleNextInstant()){}return [r.observerView(0),r.observerView(1)];};
 expect(await view('privacy')).toEqual(await view('hiddenGoal'));expect(await view('privacy')).toEqual(await view('deniedMirror'));const base=await view('main');expect((await view('noA'))[1]).toEqual(base[1]);for(const n of ['noB','otherMirror'] as const)expect((await view(n))[0]).toEqual(base[0]);expect(await view('privacy',4)).not.toEqual(await view('hiddenGoal',4));
},120000);
it('correcting visible motion preserves earlier judgments and actual target execution',async()=>{
 const s=await run(),accurate=await run('accurate');expect(judgments(s).slice(0,3)).toEqual(judgments(accurate).slice(0,3));expect(f(judgments(accurate)[3],6n)).toEqual(list([q(3,4)]));expect(outputs(s,1182n)).toEqual(outputs(accurate,1182n));expect(f(judgments(await run('main',2))[4],6n)).toEqual(list([q(3,4)]));
});
it('actual phases keep adoption and evidence causal; only declared target/observer reads occur',async()=>{
 const s=await run();for(const [type,phase] of [[1186n,40n],[1187n,50n],[1181n,90n],[1190n,100n],[1182n,110n],[1183n,120n],[1191n,140n],[1188n,140n]] as const){const ts=s.r.snapshot().trace.map(x=>rec(x,160n)).filter(x=>records(items(f(x,13n),'list'),type).length);expect(ts.length).toBeGreaterThan(0);for(const t of ts)expect(f(f(t,4n),3n)).toEqual(u(phase));}expect(items(f(outputs(s,1181n)[0],3n),'list')).toHaveLength(0);expect(s.r.snapshot().randomAddresses).toEqual([]);
});
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after goal adoption and observer acquisition`,async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('person goal fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
it('rejects foreign observer and target writers, malformed model/input and altered saves',async()=>{
 const s=await run();expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(1),expected:{presence:false},newValue:emptyKnowledge()}]},owner('learn-a'),s.m.authority)).toThrow();expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:goalPath,expected:{presence:false},newValue:outputs(s,1191n)[0]}]},owner('learn-a'),s.m.authority)).toThrow();
 expect(()=>learn(emptyKnowledge(),outputs(s,1183n)[2],1,1)).toThrow('FOREIGN_EVIDENCE');await expect(compilePersonGoalInputs(s.m,enc(list([])),s.orderedInputs,seed)).rejects.toThrow('INITIAL_STATE');const rows=cases().main;rows[1].desired=2;await expect(compilePersonGoalInputs(s.m,initialState,ordered(rows),seed)).rejects.toThrow('CONSTANT_GOAL');
 const profile=rec(decode(s.source.parameters),1178n),pf=new Map(profile.fields);pf.set(1n,list([]));await expect(compilePersonGoalModel({...s.source,parameters:enc(record(profile.schema,pf))})).rejects.toThrow();
 const r=await createPersonGoalRun(await preparePersonGoalModel(s.source),{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const save=rec(decode(r.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restorePersonGoalRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restorePersonGoalRun(s.source,{initialState,orderedInputs:ordered(cases().hiddenGoal),save:r.save()})).rejects.toThrow();await expect(createPersonGoalRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>r.observerView(2)).toThrow();
});
