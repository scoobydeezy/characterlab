import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as field,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileHearsayModel,compileHearsayInputs,hearsayRecipe,STAGES,eventId,path,owner,HOLDERS} from '../campaign3/hearsayModel';
import {createHearsayRuntime} from '../campaign3/hearsayRuntime';
import {emptyKnowledge,learn,speakerBelief} from '../campaign3/hearsayMath';
import {prepareHearsayModel,createHearsayRun,restoreHearsayRun} from '../campaign3/hearsayFactory';
import {decodeHearsay as decode} from '../campaign3/hearsayCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './hearsayFixtures';
const f=(v:CanonicalValue,id:bigint)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('test requires record');return field(v,id);};
async function setup(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const source=hearsayRecipe(law,goal),m=await compileHearsayModel(source),orderedInputs=ordered(cases()[name]),i=await compileHearsayInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createHearsayRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const s=await setup(name,law,goal);while(await s.r.settle()){}return s;}
const outputs=(s:Awaited<ReturnType<typeof run>>,type:bigint)=>records(s.r.snapshot().outputs,type);
const judgments=(s:Awaited<ReturnType<typeof run>>,i=1)=>outputs(s,1202n).filter(x=>key(f(x,3n))===key(HOLDERS[i]));
const apps=(s:Awaited<ReturnType<typeof run>>,i=1)=>outputs(s,1203n).filter(x=>key(f(f(x,2n),3n))===key(HOLDERS[i]));
const knowledge=(s:Awaited<ReturnType<typeof run>>,i=1)=>s.r.snapshot().state.read(path(i)).value??emptyKnowledge();
it('sincere mistaken testimony and direct evidence remain separate with later correction and two observers',async()=>{
 const s=await run();expect(judgments(s).map(x=>f(x,7n))).toEqual([list([]),list([q(0,1)]),list([q(0,1)]),list([q(1,1)]),list([q(1,1)])]);expect(f(judgments(s,2)[4],7n)).toEqual(list([q(0,1)]));
 expect(f(judgments(s)[4],5n)).toEqual(list([q(1,1)]));expect(f(judgments(s)[4],6n)).toEqual(list([q(0,1)]));expect(f(outputs(s,1198n)[0],5n)).toEqual(list([false]));expect(speakerBelief(knowledge(s,0))).toEqual(list([true]));
 expect(f(apps(s)[4],5n)).toEqual(list([q(0,1),q(0,1)]));
});
it('channel-blind latest differs after new hearsay and explicit same-instant conflict',async()=>{
 const base=await run(),latest=await run('main',2),tie=await run('simultaneous',2);expect(f(judgments(latest)[4],7n)).toEqual(list([q(0,1)]));expect(f(judgments(tie)[3],7n)).toEqual(list([q(0,1)]));expect(knowledge(base)).toEqual(knowledge(latest));
});
it('direct evidence can be wrong; it is neither truth nor a universal correction guarantee',async()=>{
 const base=await run(),wrong=await run('falseDirect'),none=await run('noDirect');expect(f(judgments(wrong)[3],7n)).toEqual(list([q(0,1)]));expect(f(judgments(none)[3],5n)).toEqual(list([]));expect(outputs(base,1198n)).toEqual(outputs(wrong,1198n));expect(judgments(base).slice(0,3)).toEqual(judgments(wrong).slice(0,3));
});
it('duplicate testimony is not relearned, while a previously denied recipient can later receive it',async()=>{
 const s=await run(),delayed=await run('delayedReceipt'),again=await run('duplicateAfterNew');expect(items(f(knowledge(s),1n),'list')).toHaveLength(4);expect(items(f(knowledge(s,2),1n),'list')).toHaveLength(3);expect(f(judgments(delayed)[1],7n)).toEqual(list([]));expect(f(judgments(delayed)[2],7n)).toEqual(list([q(0,1)]));expect(items(f(knowledge(again),1n),'list')).toHaveLength(3);
 const updates=outputs(again,1204n).filter(x=>key(f(x,2n))===key(HOLDERS[1]));expect(f(updates[4],3n)).toEqual(f(updates[4],4n));
});
it('missing private evidence, delivery failure and no learning do not create negative samples',async()=>{
 for(const s of [await run('unknown'),await run('main',3)])for(const j of judgments(s))expect(f(j,7n)).toEqual(list([]));
 for(const s of [await run('failed'),await run('privateDenied'),await run('noReports')]){expect(f(judgments(s)[1],7n)).toEqual(list([]));expect(f(judgments(s)[3],7n)).toEqual(list([q(1,1)]));}
});
it('observer goals affect appraisal without changing knowledge, judgments or reports',async()=>{
 const s=await run(),op=await run('main',1,2);for(const t of [1197n,1198n,1199n,1202n,1204n])expect(outputs(s,t)).toEqual(outputs(op,t));expect(f(apps(op)[4],5n)).toEqual(list([q(1,1),q(1,1)]));
});
it('whole later views preserve hidden conduct, denied private changes and nonrecipient information; Oracle violates privacy',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>,law=1)=>{const source=hearsayRecipe(law),r=await createHearsayRun(await prepareHearsayModel(source),{initialState,orderedInputs:ordered(cases()[name]),runSeed:seed});while(await r.settleNextInstant()){}return [r.observerView(0),r.observerView(1)];};
 const base=await view('main');expect(await view('hiddenTruth')).toEqual(base);expect(await view('privacy')).toEqual(await view('hiddenPrivate'));expect((await view('noA'))[1]).toEqual(base[1]);for(const n of ['noB','otherDirect'] as const)expect((await view(n))[0]).toEqual(base[0]);expect(await view('main',4)).not.toEqual(await view('hiddenTruth',4));
},120000);
it('actual phases keep current speaker acquisition and later recipient learning causal',async()=>{
 const s=await run();for(const [type,phase] of [[1197n,10n],[1202n,40n],[1203n,50n],[1198n,110n],[1199n,120n]] as const){const ts=s.r.snapshot().trace.map(x=>rec(x,160n)).filter(x=>records(items(f(x,13n),'list'),type).length);expect(ts.length).toBeGreaterThan(0);for(const t of ts)expect(f(f(t,4n),3n)).toEqual(u(phase));}expect(s.r.snapshot().randomAddresses).toEqual([]);
 const rows=cases().main;rows.push({...rows[4]});const m=await compileHearsayModel(hearsayRecipe()),r=createHearsayRuntime(m,await compileHearsayInputs(m,initialState,ordered(rows),seed));while(await r.settle()){}const js=records(r.snapshot().outputs,1202n).filter(x=>key(f(x,3n))===key(HOLDERS[2]));expect(f(js[5],7n)).toEqual(list([q(1,1)]));
});
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after recipient acquisition`,async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('hearsay fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
it('rejects conflicting visible ticket reuse, changing incident truth and forged source ownership',async()=>{
 const s=await run(),rows=cases().main;rows[1].private=true;await expect(compileHearsayInputs(s.m,initialState,ordered(rows),seed)).rejects.toThrow('CONFLICTING_TICKET');rows[1].private=false;rows[1].truth=false;await expect(compileHearsayInputs(s.m,initialState,ordered(rows),seed)).rejects.toThrow('INCIDENT_TRUTH');
 expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(0),expected:{presence:false},newValue:emptyKnowledge()}]},owner('learn-a'),s.m.authority)).toThrow();expect(()=>learn(emptyKnowledge(),outputs(s,1199n)[1],2,1)).toThrow('FOREIGN_EVIDENCE');
});
it('rejects malformed model/input, injected state, forged public handles and edited saves',async()=>{
 const s=await setup();await expect(compileHearsayInputs(s.m,enc(list([])),s.orderedInputs,seed)).rejects.toThrow('INITIAL_STATE');const profile=rec(decode(s.source.parameters),1195n),pf=new Map(profile.fields);pf.set(1n,list([]));await expect(compileHearsayModel({...s.source,parameters:enc(record(profile.schema,pf))})).rejects.toThrow();
 const r=await createHearsayRun(await prepareHearsayModel(s.source),{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const save=rec(decode(r.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restoreHearsayRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restoreHearsayRun(s.source,{initialState,orderedInputs:ordered(cases().hiddenTruth),save:r.save()})).rejects.toThrow();await expect(createHearsayRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>r.observerView(2)).toThrow();
});
