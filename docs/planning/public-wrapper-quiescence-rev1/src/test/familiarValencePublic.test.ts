import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as field,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileFamiliarValenceModel,compileFamiliarValenceInputs,familiarValenceRecipe,STAGES,eventId,path,owner,HOLDERS,TARGETS,OPTIONS} from '../campaign3/familiarValenceModel';
import {createFamiliarValenceRuntime} from '../campaign3/familiarValenceRuntime';
import {emptyKnowledge,learn} from '../campaign3/familiarValenceMath';
import {prepareFamiliarValenceModel,createFamiliarValenceRun,restoreFamiliarValenceRun} from '../campaign3/familiarValenceFactory';
import {decodeFamiliarValence as decode} from '../campaign3/familiarValenceCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './familiarValenceFixtures';
const f=(v:CanonicalValue,id:bigint)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('test requires record');return field(v,id);};
async function setup(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const source=familiarValenceRecipe(law,goal),m=await compileFamiliarValenceModel(source),orderedInputs=ordered(cases()[name]),i=await compileFamiliarValenceInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createFamiliarValenceRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const s=await setup(name,law,goal);while(await s.r.settle()){}return s;}
const outputs=(s:Awaited<ReturnType<typeof run>>,type:bigint)=>records(s.r.snapshot().outputs,type);
const apps=(s:Awaited<ReturnType<typeof run>>,i=0)=>outputs(s,1244n).filter(x=>key(f(x,3n))===key(HOLDERS[i]));
const lenses=(a:CanonicalValue)=>[8n,9n].map(k=>f(a,k));
const probability=(s:Awaited<ReturnType<typeof run>>,at:number,k:number,i=0)=>{const p=outputs(s,1245n).find(x=>key(f(f(x,2n),3n))===key(HOLDERS[i])&&key(f(f(x,2n),2n))===key({kind:'signed',value:BigInt(at)})&&key(f(x,3n))===key(u(k+1)))!;return f(items(f(p,6n),'list').find(x=>key(f(x,1n))===key(OPTIONS[i][k][0]))!,2n);};
it('neutral repeated exposure supports familiarity without positive liking, independently of adverse/positive outcomes',async()=>{
 const base=await run(),positive=await run('positive'),negative=await run('adverse');
 for(const s of [base,positive,negative]){expect(f(apps(s)[2],8n)).toEqual(list([q(1,1)]));expect(f(apps(s)[2],10n)).toEqual(u(4));expect(f(apps(s)[2],11n)).toEqual(f(apps(base)[2],11n));}
 expect([base,positive,negative].map(s=>f(apps(s)[2],9n))).toEqual([0,1,-1].map(n=>list([q(n,1)])));
 expect([base,positive,negative].map(s=>probability(s,3,0))).toEqual([q(1,2),q(7,9),q(2,9)]);
},60000);
it('appearance familiarity changes with fixed outcome appraisal and prospective contact',async()=>{
 const base=await run();for(const name of ['partial','disjoint','noPriorFeatures'] as const){const s=await run(name);expect(f(apps(s)[2],8n)).not.toEqual(f(apps(base)[2],8n));expect(f(apps(s)[2],9n)).toEqual(f(apps(base)[2],9n));expect(probability(s,3,0)).toEqual(probability(base,3,0));}
 const partial=await run('partial'),strict=await run('partial',6);expect(f(apps(partial)[2],8n)).toEqual(list([q(1,2)]));expect(f(apps(partial)[2],10n)).toEqual(u(5));expect(f(apps(strict)[2],10n)).toEqual(u(3));
},60000);
it('missing current features, nonoverlap and absent outcome remain distinct from novelty and neutral valence',async()=>{
 const missing=await run('missing'),overlap=await run('noOverlap'),no=await run('noOutcome'),novel=await run('disjoint');
 expect(f(apps(missing)[2],10n)).toEqual(u(0));expect(f(apps(overlap)[2],10n)).toEqual(u(2));expect(f(apps(novel)[2],10n)).toEqual(u(3));
 expect(f(apps(no)[2],8n)).toEqual(list([q(1,1)]));expect(f(apps(no)[2],9n)).toEqual(list([]));expect(probability(no,3,0)).toEqual(q(1,2));
},60000);
it('familiar appearance transfers across identified targets without transferring their outcome history',async()=>{
 const base=await run(),other=await run('otherTarget'),witness=await run('witnessA');
 expect(f(apps(base)[3],8n)).toEqual(list([q(1,1)]));expect(f(apps(base)[3],9n)).toEqual(list([]));expect(f(apps(base)[4],9n)).toEqual(list([q(1,1)]));
 expect(base.r.snapshot().state.read(path(0,0))).toEqual(other.r.snapshot().state.read(path(0,0)));
 for(const j of [5,6])for(const k of [8n,9n,10n,11n])expect(f(apps(base)[j],k)).toEqual(f(apps(other)[j],k));
 expect(f(apps(witness)[2],8n)).toEqual(list([q(1,1)]));expect(f(apps(witness)[2],9n)).toEqual(list([]));expect(f(apps(base,1)[2],9n)).toEqual(list([]));
},60000);
it('familiarity-as-liking, valence-only and no-memory remain discriminating competitors',async()=>{
 const base=await run(),fused=await run('adverse',2),value=await run('adverse',3),no=await run('adverse',4);
 expect(f(apps(fused)[2],9n)).toEqual(list([q(1,1)]));expect(probability(fused,3,0)).toEqual(q(7,9));
 for(const s of [value,no]){expect(f(apps(s)[2],8n)).toEqual(list([]));expect(f(apps(s)[2],9n)).toEqual(list([q(-1,1)]));expect(probability(s,3,0)).toEqual(q(2,9));}
 expect(f(apps(base)[0],8n)).toEqual(list([]));
},60000);
it('disabled modifiers preserve adverse appraisal but remove its prospective distribution effect',async()=>{
 const base=await run('adverse'),off=await run('adverse',1,2);for(const t of [1237n,1238n,1244n,1246n])expect(outputs(base,t)).toEqual(outputs(off,t));expect(probability(off,3,0)).toEqual(q(1,2));expect(probability(base,3,0)).toEqual(q(2,9));
});
it('whole later public views exclude hidden truth, denied outcomes and nonrecipient changes; Oracle fails',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>,law=1)=>{const r=await createFamiliarValenceRun(await prepareFamiliarValenceModel(familiarValenceRecipe(law)),{initialState,orderedInputs:ordered(cases()[name]),runSeed:seed});while(await r.settleNextInstant()){}return [r.observerView(0),r.observerView(1)];};
 const base=await view('main');expect(await view('hiddenWorld')).toEqual(base);expect(await view('denied')).toEqual(base);expect((await view('noA'))[1]).toEqual(base[1]);expect((await view('noB'))[0]).toEqual(base[0]);expect(await view('main',5)).not.toEqual(await view('hiddenWorld',5));
},120000);
it('actual phases preserve learning140 to next40 and immutable historical outputs',async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();const before=s.r.snapshot().outputs.slice();while(await s.r.settle()){}expect(s.r.snapshot().outputs.slice(0,before.length)).toEqual(before);
 for(const [type,phase] of [[1238n,10n],[1244n,40n],[1245n,60n],[1237n,120n],[1246n,140n]] as const){const ts=s.r.snapshot().trace.map(x=>rec(x,160n)).filter(x=>records(items(f(x,13n),'list'),type).length);expect(ts.length).toBeGreaterThan(0);for(const t of ts)expect(f(f(t,4n),3n)).toEqual(u(phase));}
 expect(f(apps(s)[0],10n)).toEqual(u(1));expect(f(apps(s)[1],10n)).toEqual(u(4));expect(s.r.snapshot().randomAddresses).toEqual([]);
});
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after history/person acquisition`,async()=>{
 const s=await setup();for(let j=0;j<3;j++)await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('rel dimensions fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
it('rejects cross-domain/observer writers, foreign target evidence, malformed model/input and altered saves',async()=>{
 const s=await run();for(const [i,person] of [[1,false],[0,true]] as const)expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(i,0,person),expected:{presence:false},newValue:emptyKnowledge(person)}]},owner('history-a'),s.m.authority)).toThrow();expect(()=>learn(emptyKnowledge(),outputs(s,1237n)[0],0,1,false,1)).toThrow('FOREIGN_EVIDENCE');
 await expect(compileFamiliarValenceInputs(s.m,enc(list([])),s.orderedInputs,seed)).rejects.toThrow('INITIAL_STATE');const profile=rec(decode(s.source.parameters),1235n),pf=new Map(profile.fields);pf.set(1n,list([]));await expect(compileFamiliarValenceModel({...s.source,parameters:enc(record(profile.schema,pf))})).rejects.toThrow();
 const r=await createFamiliarValenceRun(await prepareFamiliarValenceModel(s.source),{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const save=rec(decode(r.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restoreFamiliarValenceRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restoreFamiliarValenceRun(s.source,{initialState,orderedInputs:ordered(cases().hiddenWorld),save:r.save()})).rejects.toThrow();await expect(createFamiliarValenceRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>r.observerView(2)).toThrow();
});
