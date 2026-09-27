import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as field,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileRelAttributionModel,compileRelAttributionInputs,relAttributionRecipe,STAGES,eventId,path,owner,HOLDERS,TARGETS,OPTIONS} from '../campaign3/relAttributionModel';
import {createRelAttributionRuntime} from '../campaign3/relAttributionRuntime';
import {emptyKnowledge,learn} from '../campaign3/relAttributionMath';
import {prepareRelAttributionModel,createRelAttributionRun,restoreRelAttributionRun} from '../campaign3/relAttributionFactory';
import {decodeRelAttribution as decode} from '../campaign3/relAttributionCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './relAttributionFixtures';
const f=(v:CanonicalValue,id:bigint)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('test requires record');return field(v,id);};
async function setup(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const source=relAttributionRecipe(law,goal),m=await compileRelAttributionModel(source),orderedInputs=ordered(cases()[name]),i=await compileRelAttributionInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createRelAttributionRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const s=await setup(name,law,goal);while(await s.r.settle()){}return s;}
const outputs=(s:Awaited<ReturnType<typeof run>>,type:bigint)=>records(s.r.snapshot().outputs,type);
const apps=(s:Awaited<ReturnType<typeof run>>,i=0)=>outputs(s,1230n).filter(x=>key(f(x,3n))===key(HOLDERS[i]));
const lenses=(a:CanonicalValue)=>[8n,9n,10n,11n].map(k=>f(a,k));
const probability=(s:Awaited<ReturnType<typeof run>>,at:number,k:number,i=0)=>{const p=outputs(s,1231n).find(x=>key(f(f(x,2n),3n))===key(HOLDERS[i])&&key(f(f(x,2n),2n))===key({kind:'signed',value:BigInt(at)})&&key(f(x,3n))===key(u(k+1)))!;return f(items(f(p,6n),'list').find(x=>key(f(x,1n))===key(OPTIONS[i][k][0]))!,2n);};
it('revises event attribution and prospective contact while preserving original harm and current willingness',async()=>{
 const s=await run(),a=apps(s);expect(lenses(a[1])).toEqual([1,1,1,1].map(n=>list([q(n,1)])));expect(lenses(a[3])).toEqual([1,0,1,0].map(n=>list([q(n,1)])));
 expect(probability(s,2,0)).toEqual(q(2,9));expect(probability(s,4,0)).toEqual(q(7,9));expect(probability(s,2,1)).toEqual(probability(s,4,1));expect(f(a[1],5n)).toEqual(f(a[3],5n));
});
it('absent, denied, unlinked and foreign explanations cannot correct the focal event',async()=>{
 const base=await run();for(const name of ['noExplanation','deniedExplanation','missingLink','foreignEpisode','foreignTarget'] as const){const s=await run(name);expect(f(apps(s)[3],9n)).toEqual(list([q(1,1)]));expect(probability(s,4,0)).toEqual(q(2,9));expect(apps(s).slice(0,2)).toEqual(apps(base).slice(0,2));}
 const foreign=await run('foreignEpisode');expect(f(apps(foreign)[6],9n)).toEqual(list([q(0,1)]));expect(f(apps(foreign)[6],8n)).toEqual(list([]));
});
it('current willingness and event correction have independent downstream effects',async()=>{
 const base=await run(),will=await run('willOnly'),both=await run('correctionWillFalse');expect(f(apps(will)[3],9n)).toEqual(list([q(1,1)]));expect(f(apps(will)[3],10n)).toEqual(list([q(0,1)]));expect(probability(will,4,0)).toEqual(q(2,9));expect(probability(will,4,1)).toEqual(q(2,9));
 expect(probability(both,4,0)).toEqual(probability(base,4,0));expect(probability(both,4,1)).not.toEqual(probability(base,4,1));
});
it('no-revision and current-belief-only competitors retain journals but lose the evidence-linked contrast',async()=>{
 const base=await run(),initial=await run('main',2),person=await run('main',3),uncorrected=await run('noExplanation',3);
 expect(f(apps(initial)[3],9n)).toEqual(list([q(1,1)]));expect(probability(initial,4,0)).toEqual(q(2,9));expect(f(apps(person)[1],9n)).toEqual(list([q(0,1)]));expect(probability(person,4,0)).toEqual(probability(uncorrected,4,0));
 for(const s of [initial,person])expect(s.r.snapshot().state.canonicalValue()).toEqual(base.r.snapshot().state.canonicalValue());
});
it('witnessing and missing evidence do not become personal harm or known negative causation',async()=>{
 const w=await run('witnessA'),c=await run('unknownCause'),h=await run('unknownHarm'),cue=await run('missingCue'),no=await run('main',4);
 expect(f(apps(w)[3],8n)).toEqual(list([]));expect(f(apps(w)[3],9n)).toEqual(list([q(0,1)]));expect(w.r.snapshot().state.read(path(0,0)).presence).toBe(false);
 expect(f(apps(c)[3],9n)).toEqual(list([]));expect(f(apps(h)[3],8n)).toEqual(list([]));expect(f(apps(cue)[3],9n)).toEqual(list([]));expect(lenses(apps(no)[3])).toEqual([list([]),list([]),list([]),list([])]);expect(probability(c,4,0)).toEqual(q(1,2));
});
it('disabled modifiers preserve evidence and appraisal while removing distribution effects',async()=>{
 const base=await run(),off=await run('main',1,2);for(const t of [1223n,1224n,1230n,1232n])expect(outputs(base,t)).toEqual(outputs(off,t));for(let k=0;k<2;k++)expect(probability(off,4,k)).toEqual(q(1,2));
});
it('whole later views exclude hidden truth, denied evidence and other recipients; Oracle fails',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>,law=1)=>{const r=await createRelAttributionRun(await prepareRelAttributionModel(relAttributionRecipe(law)),{initialState,orderedInputs:ordered(cases()[name]),runSeed:seed});while(await r.settleNextInstant()){}return [r.observerView(0),r.observerView(1)];};
 const base=await view('main');expect(await view('hiddenWorld')).toEqual(base);expect(await view('denied')).toEqual(base);expect((await view('noA'))[1]).toEqual(base[1]);expect((await view('noB'))[0]).toEqual(base[0]);expect(await view('main',5)).not.toEqual(await view('hiddenWorld',5));
},120000);
it('actual phases and immutable prefixes enforce correction140 to next40',async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();const before=s.r.snapshot().outputs.slice();while(await s.r.settle()){}expect(s.r.snapshot().outputs.slice(0,before.length)).toEqual(before);
 for(const [type,phase] of [[1224n,10n],[1230n,40n],[1231n,60n],[1223n,120n],[1232n,140n]] as const){const ts=s.r.snapshot().trace.map(x=>rec(x,160n)).filter(x=>records(items(f(x,13n),'list'),type).length);expect(ts.length).toBeGreaterThan(0);for(const t of ts)expect(f(f(t,4n),3n)).toEqual(u(phase));}
 expect(f(apps(s)[2],9n)).toEqual(list([q(1,1)]));expect(f(apps(s)[3],9n)).toEqual(list([q(0,1)]));expect(s.r.snapshot().randomAddresses).toEqual([]);
});
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after history/person acquisition`,async()=>{
 const s=await setup();for(let j=0;j<4;j++)await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('rel dimensions fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
it('rejects cross-domain/observer writers, foreign target evidence, malformed model/input and altered saves',async()=>{
 const s=await run();for(const [i,person] of [[1,false],[0,true]] as const)expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(i,0,person),expected:{presence:false},newValue:emptyKnowledge(person)}]},owner('history-a'),s.m.authority)).toThrow();expect(()=>learn(emptyKnowledge(),outputs(s,1223n)[0],0,1,false,1)).toThrow('FOREIGN_EVIDENCE');
 await expect(compileRelAttributionInputs(s.m,enc(list([])),s.orderedInputs,seed)).rejects.toThrow('INITIAL_STATE');const profile=rec(decode(s.source.parameters),1221n),pf=new Map(profile.fields);pf.set(1n,list([]));await expect(compileRelAttributionModel({...s.source,parameters:enc(record(profile.schema,pf))})).rejects.toThrow();
 const r=await createRelAttributionRun(await prepareRelAttributionModel(s.source),{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const save=rec(decode(r.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restoreRelAttributionRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restoreRelAttributionRun(s.source,{initialState,orderedInputs:ordered(cases().hiddenWorld),save:r.save()})).rejects.toThrow();await expect(createRelAttributionRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>r.observerView(2)).toThrow();
});
