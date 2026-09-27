import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as field,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileGriefModel,compileGriefInputs,griefRecipe,STAGES,eventId,path,owner,HOLDERS,TARGETS,OPTIONS} from '../campaign3/griefModel';
import {createGriefRuntime} from '../campaign3/griefRuntime';
import {emptyKnowledge,learn} from '../campaign3/griefMath';
import {prepareGriefModel,createGriefRun,restoreGriefRun} from '../campaign3/griefFactory';
import {decodeGrief as decode} from '../campaign3/griefCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './griefFixtures';
const f=(v:CanonicalValue,id:bigint)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('test requires record');return field(v,id);};
async function setup(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const source=griefRecipe(law,goal),m=await compileGriefModel(source),orderedInputs=ordered(cases()[name]),i=await compileGriefInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createGriefRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const s=await setup(name,law,goal);while(await s.r.settle()){}return s;}
const outputs=(s:Awaited<ReturnType<typeof run>>,type:bigint)=>records(s.r.snapshot().outputs,type);
const apps=(s:Awaited<ReturnType<typeof run>>,i=0)=>outputs(s,1287n).filter(x=>key(f(x,3n))===key(HOLDERS[i]));
const lenses=(a:CanonicalValue)=>[8n,9n,10n,11n].map(k=>f(a,k));
const probability=(s:Awaited<ReturnType<typeof run>>,at:number,k:number,i=0)=>{const p=outputs(s,1288n).find(x=>key(f(f(x,2n),3n))===key(HOLDERS[i])&&key(f(f(x,2n),2n))===key({kind:'signed',value:BigInt(at)})&&key(f(x,3n))===key(u(k+1)))!;return f(items(f(p,6n),'list').find(x=>key(f(x,1n))===key(OPTIONS[i][k][0]))!,2n);};
it('separates temporary absence, uncertain return and believed lasting loss at identical history',async()=>{
 const base=await run(),temporary=await run('temporary'),uncertain=await run('uncertain');
 expect([8n,9n,10n,11n,12n,13n,14n].map(k=>f(apps(base)[3],k))).toEqual([1,1,1,0,0,1,0].map(n=>list([q(n,1)])));
 expect(f(apps(temporary)[3],10n)).toEqual(list([q(0,1)]));expect(f(apps(temporary)[3],11n)).toEqual(list([q(1,1)]));
 expect(f(apps(uncertain)[3],10n)).toEqual(list([q(1,2)]));expect(f(apps(uncertain)[3],11n)).toEqual(list([q(1,2)]));
 for(const s of [temporary,uncertain])expect(f(apps(s)[3],5n)).toEqual(f(apps(base)[3],5n));
 expect(probability(base,4,0)).toEqual(q(7,9));expect(probability(base,4,1)).toEqual(q(1,2));expect(probability(temporary,4,0)).toEqual(q(1,2));expect(probability(temporary,4,1)).toEqual(q(7,9));expect(probability(uncertain,4,0)).toEqual(q(47,72));
});
it('loss belief alone does not author acquired relationship significance',async()=>{
 const base=await run(),one=await run('oneSupport');expect(f(apps(one)[3],8n)).toEqual(list([q(1,2)]));expect(f(apps(one)[3],12n)).toEqual(list([q(0,1)]));expect(probability(one,4,0)).toEqual(q(47,72));
 for(const name of ['selfSufficient','noHistory','witnessA'] as const){const s=await run(name);expect(f(apps(s)[3],8n)).toEqual(list([q(0,1)]));expect(f(apps(s)[3],12n)).toEqual(f(apps(base)[3],12n));expect(probability(s,4,0)).toEqual(q(1,2));}
 expect(f(apps(base)[7],9n)).toEqual(list([q(2,3)]));expect(f(apps(one)[7],9n)).toEqual(list([q(1,2)]));
},60000);
it('practical substitutes and current demand do not erase loss; presence is independent evidence',async()=>{
 const base=await run();for(const name of ['noAlternative','noDemand'] as const){const s=await run(name);expect(f(apps(s)[3],10n)).toEqual(f(apps(base)[3],10n));expect(probability(s,4,0)).toEqual(probability(base,4,0));}
 const alt=await run('noAlternative'),present=await run('present');expect(f(apps(alt)[3],14n)).toEqual(list([q(1,1)]));expect(f(apps(present)[3],10n)).toEqual(list([q(0,1)]));expect(f(apps(present)[3],12n)).toEqual(list([q(0,1)]));expect(f(apps(present)[3],8n)).toEqual(list([q(1,1)]));
},60000);
it('missing or denied report differs from known uncertainty and known no future contact',async()=>{
 for(const name of ['noReport','deniedReport'] as const){const s=await run(name);expect(f(apps(s)[3],12n)).toEqual(list([]));expect(f(apps(s)[3],10n)).toEqual(list([]));expect(f(apps(s)[3],13n)).toEqual(list([q(1,1)]));}
 const cue=await run('missingCue');expect(f(apps(cue)[3],12n)).toEqual(list([q(0,1)]));expect(f(apps(cue)[3],10n)).toEqual(list([]));
});
it('a false later correction revises appraisal without rewriting history or other targets',async()=>{
 const base=await run();expect(f(apps(base)[7],12n)).toEqual(list([q(1,1)]));expect(probability(base,8,0)).toEqual(q(1,2));expect(probability(base,8,1)).toEqual(q(7,9));expect(f(apps(base)[3],5n)).toEqual(f(apps(base)[6],5n));
 for(const name of ['noCorrection','deniedCorrection','foreignCorrection'] as const){const s=await run(name);expect(f(apps(s)[7],10n)).toEqual(list([q(1,1)]));expect(probability(s,8,0)).toEqual(q(7,9));expect(apps(s).slice(0,5)).toEqual(apps(base).slice(0,5));}
 const other=await run('otherTarget');expect(apps(other).filter(a=>key(f(a,4n))===key(TARGETS[0]))).toEqual(apps(base).filter(a=>key(f(a,4n))===key(TARGETS[0])));
},60000);
it('serious absence-only and utility-only competitors lose different distinctions while preserving journals',async()=>{
 const base=await run(),absence=await run('main',2),temporary=await run('temporary',2),utility=await run('main',3),useful=await run('noAlternative',3),noHistory=await run('main',4),noInference=await run('main',6);
 expect(probability(absence,4,0)).toEqual(probability(temporary,4,0));expect(probability(absence,4,1)).toEqual(q(7,9));expect(probability(utility,4,0)).toEqual(q(1,2));expect(probability(useful,4,0)).toEqual(q(7,9));
 for(const s of [absence,utility,noInference])expect(s.r.snapshot().state.canonicalValue()).toEqual(base.r.snapshot().state.canonicalValue());expect(f(apps(noHistory)[3],12n)).toEqual(list([q(0,1)]));expect(f(apps(noHistory)[3],10n)).toEqual(list([q(0,1)]));expect(f(apps(noInference)[3],12n)).toEqual(list([]));
},60000);
it('modifier disabling leaves learned state and appraisal intact',async()=>{
 const base=await run(),off=await run('main',1,2);for(const t of [1280n,1281n,1287n,1289n])expect(outputs(base,t)).toEqual(outputs(off,t));for(const k of [0,1])expect(probability(off,4,k)).toEqual(q(1,2));
});
it('whole later observer views exclude hidden truth, denied reports and other recipients; Oracle fails',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>,law=1)=>{const r=await createGriefRun(await prepareGriefModel(griefRecipe(law)),{initialState,orderedInputs:ordered(cases()[name]),runSeed:seed});while(await r.settleNextInstant()){}return [r.observerView(0),r.observerView(1)];};
 const base=await view('main');for(const n of ['hiddenWorld','hiddenReturn','denied'] as const)expect(await view(n)).toEqual(base);expect((await view('noA'))[1]).toEqual(base[1]);expect((await view('noB'))[0]).toEqual(base[0]);expect(await view('main',5)).not.toEqual(await view('hiddenReturn',5));
},120000);
it('actual phases and immutable prefixes keep learning140 strictly before later appraisal40',async()=>{
 const s=await setup();for(let j=0;j<4;j++)await s.r.settle();const prior=s.r.snapshot().outputs.slice();while(await s.r.settle()){}expect(s.r.snapshot().outputs.slice(0,prior.length)).toEqual(prior);
 for(const [type,phase] of [[1281n,10n],[1287n,40n],[1288n,60n],[1280n,120n],[1289n,140n]] as const){const ts=s.r.snapshot().trace.map(x=>rec(x,160n)).filter(x=>records(items(f(x,13n),'list'),type).length);expect(ts.length).toBeGreaterThan(0);for(const t of ts)expect(f(f(t,4n),3n)).toEqual(u(phase));}
 expect(f(apps(s)[2],12n)).toEqual(list([]));expect(f(apps(s)[3],12n)).toEqual(list([q(0,1)]));expect(f(apps(s)[5],12n)).toEqual(list([q(0,1)]));expect(f(apps(s)[6],12n)).toEqual(list([q(1,1)]));expect(s.r.snapshot().randomAddresses).toEqual([]);
});
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after history/person acquisition`,async()=>{
 const s=await setup();for(let j=0;j<1;j++)await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('rel dimensions fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
it('rejects cross-domain/observer writers, foreign target evidence, malformed model/input and altered saves',async()=>{
 const s=await run();for(const [i,person] of [[1,false],[0,true]] as const)expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(i,0,person),expected:{presence:false},newValue:emptyKnowledge(person)}]},owner('history-a'),s.m.authority)).toThrow();expect(()=>learn(emptyKnowledge(),outputs(s,1280n)[0],0,1,false,1)).toThrow('FOREIGN_EVIDENCE');
 await expect(compileGriefInputs(s.m,enc(list([])),s.orderedInputs,seed)).rejects.toThrow('INITIAL_STATE');const profile=rec(decode(s.source.parameters),1278n),pf=new Map(profile.fields);pf.set(1n,list([]));await expect(compileGriefModel({...s.source,parameters:enc(record(profile.schema,pf))})).rejects.toThrow();
 const r=await createGriefRun(await prepareGriefModel(s.source),{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const save=rec(decode(r.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restoreGriefRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restoreGriefRun(s.source,{initialState,orderedInputs:ordered(cases().hiddenWorld),save:r.save()})).rejects.toThrow();await expect(createGriefRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>r.observerView(2)).toThrow();
});

for(const stage of ['person-a','person-b','commit'])it(`rolls back newly learned return report at ${stage}`,async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;
 await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('return report fault');}}})).rejects.toThrow();
 expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
