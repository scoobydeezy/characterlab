import {replay249,replay250,groups249,groups250,native249} from './fixtures/assembledSubstitutionCurrent';
import {it,expect,vi} from 'vitest';
import {start,groups,through,rec,f,uint,items,key,decode,enc,list,text,at,type Case} from './fixtures/assembledSubstitutionReplay';
import {capture,learned,hash,exact,finish,original,fullProbability} from './assembledRewardReportSet.test';
import {safe} from './assembledIntoxicationCohort.test';
import {createSubstitutionRun,restoreSubstitutionRun} from '../campaign3/dependenceSubstitutes';
import {restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {REWARD_PAIRED_SENSING_VERSION} from '../assembled/rewardExperience';
import {ExactRational as Q,roundEven} from '../substrate/exactMath';
import * as trace from '../substrate/trace';
import {HABIT_LEARN} from '../assembled/habit';
import {timeDomainVersion,EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Lossless evidence.
import {deflateSync,inflateSync} from 'node:zlib';
// @ts-expect-error Exact committed artifact bytes.
import {execFileSync} from 'node:child_process';
const file=replay250?'docs/planning/ASSEMBLED_CHARACTER_M250_EVIDENCE.json':replay249?'docs/planning/ASSEMBLED_CHARACTER_M249_EVIDENCE.json':'docs/planning/ASSEMBLED_CHARACTER_M230_EVIDENCE.json',read=(p:string)=>JSON.parse(readFileSync(p,'utf8')),saved=()=>read(file);
const put=(name:string,value:unknown)=>{const d=existsSync(file)?saved():{};expect(d[name]).toBeUndefined();d[name]=value;writeFileSync(file,JSON.stringify(d,null,2)+'\n');};
const compressed=(b:Uint8Array)=>({hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')});
const unpack=(s:string)=>new Uint8Array(inflateSync(Uint8Array.from(atob(s),c=>c.charCodeAt(0))));
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const quant=(s:string|null)=>{if(s===null)return null;const [n,d]=s.split('/').map(BigInt);return String(roundEven(n*1000n,d));};
const fraction=(v:string)=>{const q=Q.of(BigInt(v),1000n);return q.numerator+'/'+q.denominator;};
async function runCase(name:Case){
 const x=await start(name),withheld=['withheldLearning','withheldInformation'].includes(name),concentrated=['concentrated','knownAlternative','knownFailure','deniedInfo','absentInfo','correctedConcentrated','restoredA','withheldInformation'].includes(name);
 await through(x.run,7n);const trained=learned(x);expect(trained.map(v=>v.count)).toEqual(withheld||name==='unseenTraining'?[0,0]:concentrated?[4,0]:[2,2]);
 await through(x.run,8n);const acquired=learned(x),checkpoint=name==='bothAvailable'?compressed(x.run.save()):undefined;
 await through(x.run,11n);const probes=[9,10,11].map(t=>capture(x,t,name!=='noDemand'));
 const originalCase=name==='withheldLearning'?'diversified':name==='withheldInformation'?'knownAlternative':name,control=await original(originalCase,withheld?'NoLearning':'MeanHistory');
 for(const [i,p]of probes.entries()){
  const c=control.rows[i+5];expect(p.beliefs).toEqual(c.belief.map(quant));
  // Later uncoupled contest outcomes legitimately acquire different histories.
  const expectedHabit=name==='bothAvailable'&&i>0?[0,1].map(action=>{const n=2+probes.slice(0,i).filter(v=>v.chosen===action).length,den=2n**BigInt(n),v=Q.of(den-1n,den);return v.numerator+'/'+v.denominator;}):c.habit;
  expect(p.habit).toEqual(expectedHabit);expect(p.admitted).toEqual(c.admitted);if(name==='noDemand')expect(p.motive).toBe('0/1');
  if(!['bothAvailable','correctedDiversified','otherCue'].includes(name))expect(p.chosen).toBe(c.chosen);
  if(i===0)expect(fullProbability(p.probabilities)).toEqual(fullProbability(c.probabilities));
  const bases=p.signals.filter(v=>v.role===1);expect(bases.map(v=>[v.action,v.value])).toEqual(p.admitted.flatMap((a,j)=>a&&p.beliefs[j]!==null&&p.beliefs[j]!=='0'?[[j,fraction(p.beliefs[j]!)]]:[]));
  if(i===0)for(const b of bases)expect(b.supports.slice().sort()).toEqual(acquired[b.action].supports.slice().sort());
  expect(p.effects).toEqual(p.chosen<0?[]:[{action:p.chosen,status:'Applied'}]);
 }
 const draws=items(decode(x.run.snapshot().trace),'list').map(v=>rec(v,160n)).filter(v=>at(f(rec(f(v,4n),130n),2n))>=9n).flatMap(v=>items(f(v,14n),'list').map(key));
 if(name==='bothAvailable')expect(draws.length).toBeGreaterThan(0);
 const final=learned(x),native=native249(x.b,x.run);await finish(x);const observer=['deniedInfo','absentInfo'].includes(name)?compressed(safe(x.run,items(decode(x.run.snapshot().outputs),'list'))):undefined;
 put(name,{...native,trained,acquired,probes,final,control,draws,checkpoint,observer,initial:hash(x.b.d.initialState),registry:hash(x.b.s.registry),inputs:hash(x.b.d.orderedInputs),terminal:hash(x.run.save())});console.info('M230 PASS',name,probes.map(p=>p.chosen).join(','),probes[0].beliefs.join(','));
}
for(const [group,names] of Object.entries(replay250?groups250:replay249?groups249:groups))for(const name of names)it((replay250?'transfer250 ':replay249?'transfer249 ':'replay230 ')+group+' '+name,()=>runCase(name),180000);
it('replay230 all original frozen runs and prefixes',async()=>{
 const plan=read('docs/planning/SUBSTITUTION_PLAN_REV1.json'),prior=read('docs/planning/SUBSTITUTION_RESULT_REV1.json'),views=read('docs/planning/SUBSTITUTION_VIEWS_REV1.json'),sources:any[]=[];
 expect(plan.models).toHaveLength(5);expect(plan.runs).toHaveLength(29);
 const pinnedPlan=execFileSync('git',['show','ec0dbfcb:docs/planning/SUBSTITUTION_PLAN_REV1.json']);expect(prior.planSha256).toBe(hash(pinnedPlan));expect(JSON.parse(pinnedPlan.toString('utf8'))).toEqual(plan);expect(views.planSha256).toBe(prior.planSha256);
 for(const a of plan.artifacts){const disk=hash(readFileSync(a.path)),git=disk===a.sha256?undefined:hash(execFileSync('git',['show','ec0dbfcb:'+a.path]));expect(disk===a.sha256||git===a.sha256).toBe(true);sources.push({path:a.path,sha256:a.sha256,exactBytes:disk===a.sha256?'working-tree':'git-blob/ec0dbfcb'});}
 const runs:any[]=[];let advancing=0,terminal=0;
 for(const row of plan.runs){
  const r=createSubstitutionRun(row.law,row.input,7),saves=[r.save()];while(await r.step())saves.push(r.save());const expected=prior.results.find((v:any)=>v.law===row.law&&v.name===row.name);
  expect(saves.map(hash)).toEqual(expected.prefixHashes);expect(hash(new TextEncoder().encode(JSON.stringify(r.snapshot())))).toBe(expected.snapshotSha256);expect(hash(new TextEncoder().encode(JSON.stringify(r.observerView())))).toBe(expected.safeSha256);
  for(const [i,save]of saves.entries()){const restored=await restoreSubstitutionRun(row.law,row.input,save,7);bytes(restored.save(),save);const more=await restored.step();expect(more).toBe(i<8);bytes(restored.save(),saves[Math.min(i+1,8)]);if(more)advancing++;else terminal++;}
  runs.push({law:row.law,name:row.name,prefixHashes:saves.map(hash),terminal:hash(r.save()),safe:expected.safeSha256});console.info('M230 frozen',row.law,row.name);
 }
 expect(advancing).toBe(232);expect(terminal).toBe(29);expect(views.views).toHaveLength(29);put('frozen',{models:5,runs,advancing,terminal,prefixes:advancing+terminal,planSha256:hash(pinnedPlan),planBytes:'git-blob/ec0dbfcb; parsed working plan equal',sources});
},110000);
it('replay230 full information privacy and finite coverage',()=>{
 const d=saved(),m229=read('docs/planning/ASSEMBLED_CHARACTER_M229_EVIDENCE.json'),a=d.deniedInfo,b=d.absentInfo;
 bytes(unpack(a.observer.deflate),unpack(b.observer.deflate));expect(a.acquired).toEqual(b.acquired);
 const cases=[...groups.A,...groups.B];expect(cases).toHaveLength(15);for(const c of cases)expect(d[c].terminal).toMatch(/^[0-9a-f]{64}$/);
 for(const c of ['diversified','falseTraining','deniedFeedback','hiddenBlocked','falseSuccess','trueSuccess','failure'])expect(m229[c].terminal).toMatch(/^[0-9a-f]{64}$/);
 expect(new Set(cases.filter(c=>c!=='noDemand').map(c=>d[c].registry).concat(m229.diversified.registry)).size).toBe(1);
 expect(d.knownAlternative.acquired[1].count).toBe(0);expect(d.knownAlternative.acquired[1].mean).toBe('1000');expect(d.knownFailure.acquired[1].mean).toBe('0');expect(d.concentrated.acquired[1].mean).toBe(null);
 expect(d.correctedConcentrated.probes[0].beliefs).toEqual(['800','0']);expect(d.correctedDiversified.probes[0].beliefs).toEqual(['667','667']);expect(d.otherCue.probes[0].habit).toEqual(['0/1','0/1']);
 put('mapping',{nativeCases:22,reference:'MeanHistory/Residual',currentVersion:'0.149',retainedM229:hash(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M229_EVIDENCE.json')),fullDeniedInfoPrivacy:true,noDemand:'task expiry maps zero motive only',quantization:'2/3 ->667/1000',lawDisposition:'adopted L5: LatestHistory zero-correction/cessation and ExpectationOnly/HistoryOnly remain original controls, not alternative native pass configurations'});
});
it('replay230 rollback after arbitration and learning',async()=>{
 const x=await start('bothAvailable'),save=unpack(saved().bothAvailable.checkpoint.deflate),restore=async()=>cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));
 const control=x.run;await through(control,8n);bytes(control.save(),save);const recovered:typeof control[]=[];const receipts:any[]=[];
 for(const boundary of ['after-arbitration','after-learning']){
  const bad=await restore(),before=bad.snapshot(),write=trace.traceRecordValue;let hit=false;
  const spy=vi.spyOn(trace,'traceRecordValue').mockImplementation(v=>{
   const arbitration=typeof v.event.eventTypeId.payload!=='boolean'&&v.event.eventTypeId.payload.kind==='text'&&v.event.eventTypeId.payload.value==='event/task-arbitration';
   const learning=key(v.event.eventTypeId)===key(HABIT_LEARN)&&v.event.phase===140n&&v.statePatch.operations.some(p=>p.path.rootStateTypeId===823n);
   if(v.event.dueAt===9n&&(boundary==='after-arbitration'?arbitration:learning)){
    if(arbitration)expect(v.randomDrawRecords.length).toBeGreaterThan(0);
    else {expect(v.seamVersion).toBe(timeDomainVersion(REWARD_PAIRED_SENSING_VERSION,EXTENDED_TIME_LIMIT));expect(v.structuralMutationDiffs.length).toBeGreaterThan(0);}
    hit=true;throw Error('M230 '+boundary);
   }return write(v);
  });
  try{await expect(bad.settleNextInstant()).rejects.toThrow('M230 '+boundary);expect(hit).toBe(true);expect(bad.snapshot().clock).toBe(before.clock);for(const k of ['state','outputs','trace']as const)bytes(bad.snapshot()[k],before[k]);expect(()=>bad.save()).toThrow('active quiescent');}finally{spy.mockRestore();}
  recovered.push(await restore());receipts.push({boundary,rolledBack:true});console.info('M230 recovered',boundary);
 }
 let done=false;for(let n=0;n<48;n++){const more=await control.settleNextInstant();for(const r of recovered){expect(await r.settleNextInstant()).toBe(more);expect(r.snapshot().clock).toBe(control.snapshot().clock);if(more&&[9n,11n,101n].includes(control.snapshot().clock))exact(control,r);}if(!more){done=true;break;}}
 expect(done).toBe(true);expect(control.snapshot().clock).toBe(101n);expect(hash(control.save())).toBe(saved().bothAvailable.terminal);put('rollback',{receipts,checkpoint:hash(save),terminal:hash(control.save()),recovery:'public restore from unchanged pre-instant save; failed runtime remains unusable'});
},440000);

it.skipIf(!replay249)('transfer249 privacy and bounded current coverage',()=>{
 expect(replay249).toBe(true);const d=saved(),names=Object.values(groups249).flat();expect(names).toHaveLength(11);
 expect(Object.keys(d).sort()).toEqual([...names].sort());
 bytes(unpack(d.deniedInfo.observer.deflate),unpack(d.absentInfo.observer.deflate));expect(d.deniedInfo.acquired).toEqual(d.absentInfo.acquired);
 for(const name of names){const v=d[name];expect(v.native.rules).toBe('rules/assembled-character/0.155-candidate');expect(v.native.mapping.pass).toBe(true);for(const label of ['state','outputs','trace4to11']){const p=v.native[label],raw=unpack(p.deflate);expect(raw.length).toBe(p.bytes);expect(hash(raw)).toBe(p.hash);}}
 expect(d.concentrated.acquired[1].mean).toBe(null);expect(d.knownFailure.acquired[1].mean).toBe('0');
 expect(d.knownAlternative.acquired[1].count).toBe(0);expect(d.knownAlternative.acquired[1].mean).toBe('1000');
 for(const name of ['diversified','knownAlternative'])expect(d[name].probes.map((p:any)=>p.chosen)).toEqual([1,1,1]);
 for(const name of ['concentrated','knownFailure','noDemand','unavailable','withheldLearning','withheldInformation'])expect(d[name].probes.map((p:any)=>p.chosen)).toEqual([-1,-1,-1]);
 expect(fullProbability(d.bothAvailable.probes[0].probabilities)).toEqual(['1/2','1/2']);
 put('mapping249',{nativeCases:11,reference:'MeanHistory/Residual',version:'0.155',privacy:true,remaining:['unseenTraining','correctedConcentrated','correctedDiversified','otherCue','restoredA','falseTraining','deniedFeedback','hiddenBlocked','falseSuccess','trueSuccess','failure'],scope:'G3a only; other11 transfer cases and family acceptance remain open'});
 console.info('M249 GATE PASS11 cases; acquired alternatives, original stimuli, unknown/zero, withheld/availability/no-demand and exact permitted privacy');
});

it.skipIf(!replay250)('transfer250 finite substitution coverage',()=>{
 const d=saved(),prior=read('docs/planning/ASSEMBLED_CHARACTER_M249_EVIDENCE.json');
 const outcome=['diversified','falseTraining','deniedFeedback','hiddenBlocked','falseSuccess','trueSuccess','failure'];
 const current=[...groups250.A,...outcome],all=[...Object.values(groups249).flat(),...current];
 expect(current).toHaveLength(12);expect(new Set(all).size).toBe(22);
 for(const name of current){expect(d[name].native.rules).toBe('rules/assembled-character/0.155-candidate');expect(d[name].native.mapping.pass).toBe(true);for(const field of ['state','outputs','trace4to11']){const p=d[name].native[field],b=unpack(p.deflate);expect(b.length).toBe(p.bytes);expect(hash(b)).toBe(p.hash);}}
 expect(d.diversified.terminal,'same current baseline, additional observer measurement').toBe(prior.diversified.terminal);
 for(let i=0;i<3;i++)for(const field of ['motive','beliefs','habit','admitted','chosen','probabilities','signals','raw','effects'])expect(d.diversified.probes[i][field]).toEqual(prior.diversified.probes[i][field]);
 expect(d.unseenTraining.probes.map((p:any)=>p.chosen)).toEqual([-1,-1,-1]);
 expect(d.correctedConcentrated.probes[0].beliefs).toEqual(['800','0']);expect(d.correctedDiversified.probes[0].beliefs).toEqual(['667','667']);
 expect(fullProbability(d.correctedDiversified.probes[0].probabilities)).toEqual(['1/2','1/2']);expect(d.otherCue.probes[0].habit).toEqual(['0/1','0/1']);expect(d.restoredA.probes.map((p:any)=>p.chosen)).toEqual([-1,-1,0]);
 expect(d.comparisons.fullSafePairs).toHaveLength(3);expect(d.comparisons.preOutcomeMeaning).toBe(true);expect(d.continuation.terminal).toBe(d.failure.terminal);
 put('mapping250',{nativeCases:22,currentCases:12,remainingCases:0,reference:'MeanHistory/Residual',version:'0.155',retainedM249:hash(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M249_EVIDENCE.json')),baselineRepeat:'full observer/expression comparison absent from M249; exact terminal/projections retained',lawDisposition:'M230 dispositions retained; no alternate native law, no habit necessity or broader12.9 qualification'});
 console.info('M250 G3 COMPLETE22 native cases, correction/availability/outcome boundaries and current failure continuation; family review next');
});
