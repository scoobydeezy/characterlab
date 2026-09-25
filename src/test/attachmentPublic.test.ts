import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,record,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as field,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileAttachmentModel,compileAttachmentInputs,attachmentRecipe,STAGES,eventId,path,owner,HOLDERS,TARGETS,OPTIONS} from '../campaign3/attachmentModel';
import {createAttachmentRuntime} from '../campaign3/attachmentRuntime';
import {emptyKnowledge,learn} from '../campaign3/attachmentMath';
import {prepareAttachmentModel,createAttachmentRun,restoreAttachmentRun} from '../campaign3/attachmentFactory';
import {decodeAttachment as decode} from '../campaign3/attachmentCodecs';
import {AuthoritativeState,applyStatePatch} from '../substrate/state';
import {cases,ordered,initialState,seed,records} from './attachmentFixtures';
const f=(v:CanonicalValue,id:bigint)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('test requires record');return field(v,id);};
async function setup(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const source=attachmentRecipe(law,goal),m=await compileAttachmentModel(source),orderedInputs=ordered(cases()[name]),i=await compileAttachmentInputs(m,initialState,orderedInputs,seed);return {source,m,orderedInputs,r:createAttachmentRuntime(m,i)};}
async function run(name:keyof ReturnType<typeof cases>='main',law=1,goal=1){const s=await setup(name,law,goal);while(await s.r.settle()){}return s;}
const outputs=(s:Awaited<ReturnType<typeof run>>,type:bigint)=>records(s.r.snapshot().outputs,type);
const apps=(s:Awaited<ReturnType<typeof run>>,i=0)=>outputs(s,1259n).filter(x=>key(f(x,3n))===key(HOLDERS[i]));
const lenses=(a:CanonicalValue)=>[8n,9n,10n,11n].map(k=>f(a,k));
const probability=(s:Awaited<ReturnType<typeof run>>,at:number,k:number,i=0)=>{const p=outputs(s,1260n).find(x=>key(f(f(x,2n),3n))===key(HOLDERS[i])&&key(f(f(x,2n),2n))===key({kind:'signed',value:BigInt(at)})&&key(f(x,3n))===key(u(k+1)))!;return f(items(f(p,6n),'list').find(x=>key(f(x,1n))===key(OPTIONS[i][k][0]))!,2n);};
it('repeated meaningful dependence supports target-specific missing contact despite an adequate alternative',async()=>{
 const s=await run(),one=await run('oneSupport');expect(lenses(apps(s)[2])).toEqual([1,1,1,0].map(n=>list([q(n,1)])));expect(f(apps(one)[2],8n)).toEqual(list([q(1,2)]));expect(f(apps(one)[2],9n)).toEqual(list([q(1,1)]));
 expect(probability(s,3,0)).toEqual(q(7,9));expect(probability(s,3,1)).toEqual(q(1,2));expect(probability(one,3,0)).not.toEqual(probability(s,3,0));
});
it('same positive support and person estimate do not erase the perceived-dependence distinction',async()=>{
 const base=await run();for(const name of ['selfSufficient','incidental'] as const){const s=await run(name);expect(f(apps(s)[2],9n)).toEqual(f(apps(base)[2],9n));expect(f(apps(s)[2],8n)).toEqual(list([q(0,1)]));expect(probability(s,3,0)).toEqual(q(1,2));const pooled=await run(name,2);expect(f(apps(pooled)[2],8n)).toEqual(list([q(1,1)]));}
},60000);
it('presence, practical alternatives and current demand remain separate appraisal operands',async()=>{
 const base=await run(),present=await run('present'),alt=await run('noAlternative'),demand=await run('noCurrentDemand');
 expect(f(apps(present)[2],8n)).toEqual(f(apps(base)[2],8n));expect(f(apps(present)[2],10n)).toEqual(list([q(0,1)]));expect(probability(present,3,0)).toEqual(q(1,2));
 expect(f(apps(alt)[2],10n)).toEqual(f(apps(base)[2],10n));expect(f(apps(alt)[2],11n)).toEqual(list([q(1,1)]));expect(probability(alt,3,1)).toEqual(q(7,9));
 expect(f(apps(demand)[2],10n)).toEqual(list([q(1,1)]));expect(f(apps(demand)[2],11n)).toEqual(list([q(0,1)]));
},60000);
it('utility-only and no-history controls preserve person learning but lose separation appraisal',async()=>{
 const utility=await run('main',3),no=await run('main',4),u=await run('noAlternative',3);
 for(const s of [utility,no]){expect(f(apps(s)[2],9n)).toEqual(list([q(1,1)]));expect(f(apps(s)[2],10n)).toEqual(list([q(0,1)]));expect(probability(s,3,0)).toEqual(q(1,2));}
 expect(f(apps(u)[2],10n)).toEqual(list([q(1,1)]));
});
it('missing opportunities, unresolved goals, witnesses, targets and cue absence remain distinct',async()=>{
 const base=await run(),none=await run('noHistory'),failed=await run('unresolved'),w=await run('witnessA'),other=await run('otherTarget'),cue=await run('missingCue');
 expect(f(apps(none)[2],9n)).toEqual(list([]));expect(f(apps(failed)[2],9n)).toEqual(list([q(0,1)]));expect(f(apps(failed)[2],8n)).toEqual(list([q(0,1)]));
 expect(f(apps(w)[2],9n)).toEqual(list([q(1,1)]));expect(f(apps(w)[2],8n)).toEqual(list([q(0,1)]));expect(f(apps(base,1)[2],8n)).toEqual(list([q(0,1)]));
 for(const person of [false,true])expect(base.r.snapshot().state.read(path(0,0,person))).toEqual(other.r.snapshot().state.read(path(0,0,person)));
 expect(f(apps(cue)[2],10n)).toEqual(list([]));expect(f(apps(cue)[2],8n)).toEqual(list([q(1,1)]));
},60000);
it('sample count preserves mean-learning contradiction resistance and modifier disabling preserves appraisal',async()=>{
 const base=await run(),one=await run('oneSupport'),off=await run('main',1,2);
 expect(f(apps(base)[6],9n)).toEqual(list([q(2,3)]));expect(f(apps(one)[6],9n)).toEqual(list([q(1,2)]));expect(f(apps(base)[6],8n)).toEqual(list([q(1,1)]));
 for(const t of [1252n,1253n,1259n,1261n])expect(outputs(base,t)).toEqual(outputs(off,t));for(const k of [0,1])expect(probability(off,3,k)).toEqual(q(1,2));
},60000);
it('whole later views exclude hidden truth, denied and nonrecipient evidence; Oracle fails',async()=>{
 const view=async(name:keyof ReturnType<typeof cases>,law=1)=>{const r=await createAttachmentRun(await prepareAttachmentModel(attachmentRecipe(law)),{initialState,orderedInputs:ordered(cases()[name]),runSeed:seed});while(await r.settleNextInstant()){}return [r.observerView(0),r.observerView(1)];};
 const base=await view('main');expect(await view('hiddenWorld')).toEqual(base);expect(await view('denied')).toEqual(base);expect((await view('noA'))[1]).toEqual(base[1]);expect((await view('noB'))[0]).toEqual(base[0]);expect(await view('main',5)).not.toEqual(await view('hiddenWorld',5));
},120000);
it('actual phases preserve140-to-next40 learning and frozen historical judgments',async()=>{
 const s=await setup();await s.r.settle();await s.r.settle();const before=s.r.snapshot().outputs.slice();while(await s.r.settle()){}expect(s.r.snapshot().outputs.slice(0,before.length)).toEqual(before);
 for(const [type,phase] of [[1253n,10n],[1259n,40n],[1260n,60n],[1252n,120n],[1261n,140n]] as const){const ts=s.r.snapshot().trace.map(x=>rec(x,160n)).filter(x=>records(items(f(x,13n),'list'),type).length);expect(ts.length).toBeGreaterThan(0);for(const t of ts)expect(f(f(t,4n),3n)).toEqual(u(phase));}
 expect(f(apps(s)[0],8n)).toEqual(list([q(0,1)]));expect(f(apps(s)[1],8n)).toEqual(list([q(1,2)]));expect(s.r.snapshot().randomAddresses).toEqual([]);
});
for(const stage of [...STAGES.map(([n])=>n),'commit'])it(`rolls back ${stage} after history/person acquisition`,async()=>{
 const s=await setup();for(let j=0;j<3;j++)await s.r.settle();const before=s.r.snapshot();let reached=false;await expect(s.r.settleForConformance({onBoundary(boundary,event){if(stage==='commit'?boundary==='before-commit':boundary==='after-trace-validation'&&event&&key(event.eventTypeId)===key(eventId(stage))){reached=true;throw Error('rel dimensions fault');}}})).rejects.toThrow();expect(reached).toBe(true);const after=s.r.snapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['outputs','trace','queue','allocators','randomAddresses'] as const)expect(after[k]).toEqual(before[k]);expect(()=>s.r.save()).toThrow();
});
it('rejects cross-domain/observer writers, foreign target evidence, malformed model/input and altered saves',async()=>{
 const s=await run();for(const [i,person] of [[1,false],[0,true]] as const)expect(()=>applyStatePatch(new AuthoritativeState([]),{operations:[{kind:'set',path:path(i,0,person),expected:{presence:false},newValue:emptyKnowledge(person)}]},owner('history-a'),s.m.authority)).toThrow();expect(()=>learn(emptyKnowledge(),outputs(s,1252n)[0],0,1,false,1)).toThrow('FOREIGN_EVIDENCE');
 await expect(compileAttachmentInputs(s.m,enc(list([])),s.orderedInputs,seed)).rejects.toThrow('INITIAL_STATE');const profile=rec(decode(s.source.parameters),1250n),pf=new Map(profile.fields);pf.set(1n,list([]));await expect(compileAttachmentModel({...s.source,parameters:enc(record(profile.schema,pf))})).rejects.toThrow();
 const r=await createAttachmentRun(await prepareAttachmentModel(s.source),{initialState,orderedInputs:s.orderedInputs,runSeed:seed});await r.settleNextInstant();const save=rec(decode(r.save()),132n),fields=new Map(save.fields);fields.set(11n,list([]));await expect(restoreAttachmentRun(s.source,{initialState,orderedInputs:s.orderedInputs,save:enc(record(save.schema,fields))})).rejects.toThrow();await expect(restoreAttachmentRun(s.source,{initialState,orderedInputs:ordered(cases().hiddenWorld),save:r.save()})).rejects.toThrow();await expect(createAttachmentRun({} as any,{initialState,orderedInputs:s.orderedInputs,runSeed:seed})).rejects.toThrow();expect(()=>r.observerView(2)).toThrow();
});
