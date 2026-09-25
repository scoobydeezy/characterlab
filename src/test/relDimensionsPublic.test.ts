import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as field,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileRelDimensionsModel,compileRelDimensionsInputs,relDimensionsRecipe,STAGES,eventId,path,owner,HOLDERS,TARGETS,OPTIONS} from '../campaign3/relDimensionsModel';
import {createRelDimensionsRuntime} from '../campaign3/relDimensionsRuntime';
import {emptyKnowledge,learn} from '../campaign3/relDimensionsMath';
import {prepareRelDimensionsModel,createRelDimensionsRun,restoreRelDimensionsRun} from '../campaign3/relDimensionsFactory';
import {decodeRelDimensions as decode} from '../campaign3/relDimensionsCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './relDimensionsFixtures';
const f=(v:CanonicalValue,id:bigint)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('test requires record');return field(v,id);};
async function setup(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const source=relDimensionsRecipe(law,goal),m=await compileRelDimensionsModel(source),orderedInputs=ordered(cases()[name]),i=await compileRelDimensionsInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createRelDimensionsRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const s=await setup(name,law,goal);while(await s.r.settle()){}return s;}
const outputs=(s:Awaited<ReturnType<typeof run>>,type:bigint)=>records(s.r.snapshot().outputs,type);
const apps=(s:Awaited<ReturnType<typeof run>>,i=0)=>outputs(s,1216n).filter(x=>key(f(x,3n))===key(HOLDERS[i]));
const lenses=(a:CanonicalValue)=>[8n,9n,10n,11n].map(k=>f(a,k));
const probability=(s:Awaited<ReturnType<typeof run>>,at:number,k:number,i=0)=>{const p=outputs(s,1217n).find(x=>key(f(f(x,2n),3n))===key(HOLDERS[i])&&key(f(f(x,2n),2n))===key({kind:'signed',value:BigInt(at)})&&key(f(x,3n))===key(u(k+1)))!;return f(items(f(p,6n),'list').find(x=>key(f(x,1n))===key(OPTIONS[i][k][0]))!,2n);};
it('derives affection without respect, respect without affection, and trust without comfort from distinct evidence',async()=>{
 const s=await run();expect(lenses(apps(s)[2])).toEqual([1,0,1,0].map(n=>list([q(n,1)])));expect(lenses(apps(s)[4])).toEqual([0,1,1,1].map(n=>list([q(n,1)])));
 expect(lenses(apps(s,1)[2])).toEqual([list([]),list([q(0,1)]),list([]),list([q(0,1)])]);
 expect([0,1,2,3].map(k=>probability(s,3,k))).toEqual([q(7,9),q(2,9),q(7,9),q(2,9)]);
});
it('selective interventions change only their appraisal and corresponding reason/dice response distribution',async()=>{
 const base=await run();for(const [name,k] of [['giftGone',0],['taskGood',1],['broken',2],['calm',3]] as const){const s=await run(name);for(let j=0;j<4;j++){if(j===k){expect(lenses(apps(s)[2])[j]).not.toEqual(lenses(apps(base)[2])[j]);expect(probability(s,3,j)).not.toEqual(probability(base,3,j));}else{expect(lenses(apps(s)[2])[j]).toEqual(lenses(apps(base)[2])[j]);expect(probability(s,3,j)).toEqual(probability(base,3,j));}}}
});
it('single-score and person-only competitors lose the tested dissociations while retaining the same underlying state',async()=>{
 const base=await run(),single=await run('main',2),person=await run('main',3);expect(lenses(apps(single)[2])).toEqual([0,1,2,3].map(()=>list([q(1,2)])));expect(lenses(apps(person)[2])).toEqual([0,1,2,3].map(()=>list([q(0,1)])));for(const s of [single,person])expect(s.r.snapshot().state.canonicalValue()).toEqual(base.r.snapshot().state.canonicalValue());
 const changed=await run('giftGone',3);expect(lenses(apps(changed)[2])).toEqual(lenses(apps(person)[2]));
});
it('observer participation and target keys govern history independently of witnessed person evidence',async()=>{
 const base=await run(),witness=await run('witnessA'),other=await run('otherTarget');expect(f(apps(base)[2],9n)).toEqual(f(apps(witness)[2],9n));const tasks=(s:Awaited<ReturnType<typeof run>>)=>items(f(s.r.snapshot().state.read(path(0,0,true)).value!,1n),'list').map(o=>f(o,7n));expect(tasks(base)).toEqual(tasks(witness));expect(witness.r.snapshot().state.read(path(0,0)).presence).toBe(false);
 for(const person of [false,true])expect(base.r.snapshot().state.read(path(0,0,person))).toEqual(other.r.snapshot().state.read(path(0,0,person)));expect(apps(base).filter(x=>key(f(x,4n))===key(TARGETS[0]))).toEqual(apps(other).filter(x=>key(f(x,4n))===key(TARGETS[0])));
});
it('missing opportunities and cues remain unknown rather than adverse; no-retention preserves only current cue appraisal',async()=>{
 const missingTask=await run('missingTask'),missingPromise=await run('missingPromise'),missingCue=await run('missingCue'),no=await run('main',4),unknown=await run('unknown');expect(f(apps(missingTask)[2],9n)).toEqual(list([]));expect(f(apps(missingPromise)[2],10n)).toEqual(list([]));expect(f(apps(missingCue)[2],11n)).toEqual(list([]));expect(lenses(apps(no)[2])).toEqual([list([]),list([]),list([]),list([q(0,1)])]);expect(lenses(apps(unknown)[2])).toEqual([list([]),list([]),list([]),list([])]);expect(probability(missingTask,3,1)).toEqual(q(1,2));
});
it('modifier-disabled control preserves appraisal and evidence but removes all distribution effects',async()=>{
 const base=await run(),off=await run('main',1,2);for(const t of [1209n,1210n,1216n,1218n])expect(outputs(base,t)).toEqual(outputs(off,t));for(let k=0;k<4;k++)expect(probability(off,3,k)).toEqual(q(1,2));
});
it('whole later views exclude hidden truth, denied evidence and nonrecipient changes; Oracle violates privacy',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>,law=1)=>{const source=relDimensionsRecipe(law),r=await createRelDimensionsRun(await prepareRelDimensionsModel(source),{initialState,orderedInputs:ordered(cases()[name]),runSeed:seed});while(await r.settleNextInstant()){}return [r.observerView(0),r.observerView(1)];};const base=await view('main');expect(await view('hiddenWorld')).toEqual(base);expect(await view('denied')).toEqual(base);expect((await view('noA'))[1]).toEqual(base[1]);expect((await view('noB'))[0]).toEqual(base[0]);expect(await view('main',5)).not.toEqual(await view('hiddenWorld',5));
},120000);
it('actual trace phases preserve later learning and immutable historical appraisals',async()=>{
 const s=await run();for(const [type,phase] of [[1210n,10n],[1216n,40n],[1217n,60n],[1209n,120n],[1218n,140n]] as const){const ts=s.r.snapshot().trace.map(x=>rec(x,160n)).filter(x=>records(items(f(x,13n),'list'),type).length);expect(ts.length).toBeGreaterThan(0);for(const t of ts)expect(f(f(t,4n),3n)).toEqual(u(phase));}expect(f(apps(s)[0],8n)).toEqual(list([]));expect(f(apps(s)[1],8n)).toEqual(list([q(1,2)]));expect(s.r.snapshot().randomAddresses).toEqual([]);
});
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after history/person acquisition`,async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('rel dimensions fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
it('rejects cross-domain/observer writers, foreign target evidence, malformed model/input and altered saves',async()=>{
 const s=await run();for(const [i,person] of [[1,false],[0,true]] as const)expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(i,0,person),expected:{presence:false},newValue:emptyKnowledge(person)}]},owner('history-a'),s.m.authority)).toThrow();expect(()=>learn(emptyKnowledge(),outputs(s,1209n)[0],0,1,false,1)).toThrow('FOREIGN_EVIDENCE');
 await expect(compileRelDimensionsInputs(s.m,enc(list([])),s.orderedInputs,seed)).rejects.toThrow('INITIAL_STATE');const profile=rec(decode(s.source.parameters),1207n),pf=new Map(profile.fields);pf.set(1n,list([]));await expect(compileRelDimensionsModel({...s.source,parameters:enc(record(profile.schema,pf))})).rejects.toThrow();
 const r=await createRelDimensionsRun(await prepareRelDimensionsModel(s.source),{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const save=rec(decode(r.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restoreRelDimensionsRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restoreRelDimensionsRun(s.source,{initialState,orderedInputs:ordered(cases().hiddenWorld),save:r.save()})).rejects.toThrow();await expect(createRelDimensionsRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>r.observerView(2)).toThrow();
});
