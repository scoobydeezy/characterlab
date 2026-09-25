import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as field,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileBetrayalModel,compileBetrayalInputs,betrayalRecipe,STAGES,eventId,path,owner,HOLDERS,TARGETS,OPTIONS} from '../campaign3/betrayalModel';
import {createBetrayalRuntime} from '../campaign3/betrayalRuntime';
import {emptyKnowledge,learn} from '../campaign3/betrayalMath';
import {prepareBetrayalModel,createBetrayalRun,restoreBetrayalRun} from '../campaign3/betrayalFactory';
import {decodeBetrayal as decode} from '../campaign3/betrayalCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './betrayalFixtures';
const f=(v:CanonicalValue,id:bigint)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('test requires record');return field(v,id);};
async function setup(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const source=betrayalRecipe(law,goal),m=await compileBetrayalModel(source),orderedInputs=ordered(cases()[name]),i=await compileBetrayalInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createBetrayalRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const s=await setup(name,law,goal);while(await s.r.settle()){}return s;}
const outputs=(s:Awaited<ReturnType<typeof run>>,type:bigint)=>records(s.r.snapshot().outputs,type);
const apps=(s:Awaited<ReturnType<typeof run>>,i=0)=>outputs(s,1273n).filter(x=>key(f(x,3n))===key(HOLDERS[i]));
const lenses=(a:CanonicalValue)=>[8n,9n,10n,11n].map(k=>f(a,k));
const probability=(s:Awaited<ReturnType<typeof run>>,at:number,k:number,i=0)=>{const p=outputs(s,1274n).find(x=>key(f(f(x,2n),3n))===key(HOLDERS[i])&&key(f(f(x,2n),2n))===key({kind:'signed',value:BigInt(at)})&&key(f(x,3n))===key(u(k+1)))!;return f(items(f(p,6n),'list').find(x=>key(f(x,1n))===key(OPTIONS[i][k][0]))!,2n);};
it('separates an earlier promise, failure, intent and control; a false explanation revises only later appraisal',async()=>{
 const s=await run(),a=apps(s);expect([8n,9n,10n,11n,12n,13n].map(k=>f(a[2],k))).toEqual([1,1,1,1,1,1].map(n=>list([q(n,1)])));
 expect(f(a[4],11n)).toEqual(list([q(0,1)]));expect(probability(s,3,0)).toEqual(q(7,9));expect(probability(s,5,0)).toEqual(q(1,2));expect(probability(s,3,1)).toEqual(probability(s,5,1));expect(f(a[2],5n)).toEqual(f(a[4],5n));
 const constrained=await run('constrained');expect(f(apps(constrained)[4],9n)).toEqual(list([q(1,1)]));expect(f(apps(constrained)[4],13n)).toEqual(list([q(0,1)]));expect(probability(constrained,5,0)).toEqual(q(1,2));
});
it('absent, denied, unlinked and foreign explanations cannot revise the incident',async()=>{
 const base=await run();for(const name of ['noExplanation','deniedExplanation','missingLink','foreignEpisode','foreignTarget'] as const){const s=await run(name);expect(f(apps(s)[4],11n)).toEqual(list([q(1,1)]));expect(probability(s,5,0)).toEqual(q(7,9));expect(apps(s).slice(0,3)).toEqual(apps(base).slice(0,3));}
},60000);
it('failure is not evidence of a prior promise and a later or simultaneous promise is not prior',async()=>{
 for(const name of ['noCommit','lateCommit','sameInstantCommit'] as const){const s=await run(name);expect(f(apps(s)[2],12n)).toEqual(list([]));expect(f(apps(s)[2],11n)).toEqual(list([]));expect(f(apps(s)[7],12n)).toEqual(list([]));}
 const negative=await run('negativeCommit'),success=await run('success');expect(f(apps(negative)[2],12n)).toEqual(list([q(0,1)]));expect(f(apps(negative)[2],11n)).toEqual(list([q(0,1)]));expect(f(apps(success)[2],11n)).toEqual(list([q(0,1)]));
},60000);
it('current willingness cannot replace incident attribution or automatically restore cooperation',async()=>{
 const base=await run(),will=await run('willOnly'),both=await run('correctionWillFalse');expect(f(apps(will)[4],11n)).toEqual(list([q(1,1)]));expect(probability(will,5,0)).toEqual(q(7,9));expect(probability(will,5,1)).toEqual(q(2,9));expect(probability(both,5,0)).toEqual(probability(base,5,0));expect(probability(both,5,1)).toEqual(q(2,9));
});
it('outcome-only and current-person-only keep journals but lose the discriminating comparison',async()=>{
 const base=await run(),outcome=await run('main',2),constrained=await run('constrained',2),person=await run('main',3),uncorrected=await run('noExplanation',3);
 expect(probability(outcome,5,0)).toEqual(q(7,9));expect(probability(constrained,5,0)).toEqual(q(7,9));expect(probability(person,3,0)).toEqual(q(1,2));expect(probability(person,5,0)).toEqual(probability(uncorrected,5,0));
 for(const s of [outcome,person])expect(s.r.snapshot().state.canonicalValue()).toEqual(base.r.snapshot().state.canonicalValue());
},60000);
it('witness history, absent outcome and missing intent/control remain unknown rather than negative',async()=>{
 for(const name of ['witnessA','unknownIntent','unknownControl','noFailure','missingCue'] as const){const s=await run(name);expect(f(apps(s)[2],11n)).toEqual(list([]));expect(probability(s,3,0)).toEqual(q(1,2));}
 const w=await run('witnessA');expect(w.r.snapshot().state.read(path(0,0)).presence).toBe(false);expect(f(apps(w)[2],9n)).toEqual(list([q(1,1)]));
 const no=await run('main',4);expect(lenses(apps(no)[4])).toEqual([list([]),list([]),list([]),list([])]);
},60000);
it('disabled modifiers preserve evidence and appraisal while removing prospective effects',async()=>{
 const base=await run(),off=await run('main',1,2);for(const t of [1266n,1267n,1273n,1275n])expect(outputs(base,t)).toEqual(outputs(off,t));for(let k=0;k<2;k++)expect(probability(off,3,k)).toEqual(q(1,2));
});
it('whole later views exclude hidden truth, denied evidence and other recipients; Oracle fails',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>,law=1)=>{const r=await createBetrayalRun(await prepareBetrayalModel(betrayalRecipe(law)),{initialState,orderedInputs:ordered(cases()[name]),runSeed:seed});while(await r.settleNextInstant()){}return [r.observerView(0),r.observerView(1)];};
 const base=await view('main');expect(await view('hiddenWorld')).toEqual(base);expect(await view('denied')).toEqual(base);expect((await view('noA'))[1]).toEqual(base[1]);expect((await view('noB'))[0]).toEqual(base[0]);expect(await view('main',5)).not.toEqual(await view('hiddenWorld',5));
},120000);
it('actual phases and immutable prefixes enforce correction140 to next40',async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();await s.r.settle();const before=s.r.snapshot().outputs.slice();while(await s.r.settle()){}expect(s.r.snapshot().outputs.slice(0,before.length)).toEqual(before);
 for(const [type,phase] of [[1267n,10n],[1273n,40n],[1274n,60n],[1266n,120n],[1275n,140n]] as const){const ts=s.r.snapshot().trace.map(x=>rec(x,160n)).filter(x=>records(items(f(x,13n),'list'),type).length);expect(ts.length).toBeGreaterThan(0);for(const t of ts)expect(f(f(t,4n),3n)).toEqual(u(phase));}
 expect(f(apps(s)[3],11n)).toEqual(list([q(1,1)]));expect(f(apps(s)[4],11n)).toEqual(list([q(0,1)]));expect(s.r.snapshot().randomAddresses).toEqual([]);
});
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after history/person acquisition`,async()=>{
 const s=await setup();for(let j=0;j<3;j++)await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('betrayal fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
it('rejects cross-domain/observer writers, foreign target evidence, malformed model/input and altered saves',async()=>{
 const s=await run();for(const [i,person] of [[1,false],[0,true]] as const)expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(i,0,person),expected:{presence:false},newValue:emptyKnowledge(person)}]},owner('history-a'),s.m.authority)).toThrow();expect(()=>learn(emptyKnowledge(),outputs(s,1266n)[0],0,1,false,1)).toThrow('FOREIGN_EVIDENCE');
 await expect(compileBetrayalInputs(s.m,enc(list([])),s.orderedInputs,seed)).rejects.toThrow('INITIAL_STATE');const profile=rec(decode(s.source.parameters),1264n),pf=new Map(profile.fields);pf.set(1n,list([]));await expect(compileBetrayalModel({...s.source,parameters:enc(record(profile.schema,pf))})).rejects.toThrow();
 const r=await createBetrayalRun(await prepareBetrayalModel(s.source),{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const save=rec(decode(r.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restoreBetrayalRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restoreBetrayalRun(s.source,{initialState,orderedInputs:ordered(cases().hiddenWorld),save:r.save()})).rejects.toThrow();await expect(createBetrayalRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>r.observerView(2)).toThrow();
});
