/** M112 f4d96821: one full native history, all established comparisons, exact continuation.
 * M110 sources/keys/seed unchanged; enabled0.88. No calibration or witness search. */
import {it,expect} from 'vitest';
import recorded from '../../docs/planning/ASSEMBLED_CHARACTER_M110_RECEIPTS.json';
import {fixture,times,learning,actualDraws,snapshotView,createTraceReader,create,live,refold,learned,standing,rec,f,uint,items,key,list,readQ,ZERO,snap,through,finish,exact,bytes,qualificationParts,fraction,Q,formationSignals,enumerate,type Run,type CanonicalValue} from './fixtures/assembledBiographyCalendar';
import {alternatives,action,appendFormation,formationValue} from './fixtures/assembledBiographyAlternatives';
import {restoreCharacterRun} from '../assembled/character';
import {FEEDBACK_RULES,FEEDBACK_REGISTRY} from '../assembled/model';

it('M112 full BIO correspondence and current reference continuation',async()=>{
 const original=fixture(6),b={s:{...original.s,rulesVersion:FEEDBACK_RULES,registrySchemaVersion:FEEDBACK_REGISTRY},d:original.d};
 const {run}=await create(b),reader=createTraceReader(),settlements:string[]=[],frozen:CanonicalValue[]=[];
 let frame=snap(run),restored:Run|undefined,authored:unknown,priorJournal:CanonicalValue|undefined;
 const reports:{at:string;P:string;outcomes:{law:string;mode:string;probabilities:string[][];resolved:string[][];cases:number}[]}[]=[];
 async function advance(at?:bigint){
  if(!restored){if(at===undefined)await finish(run);else await through(run,at);frame=snap(run);return;}
  for(let n=0;n<40;n++){
   if(at!==undefined&&frame.clock>=at)return;
   const next=await run.settleNextInstant();expect(await restored.settleNextInstant()).toBe(next);
   const x=run.snapshot(),y=restored.snapshot();frame=x;expect([x.clock,x.status]).toEqual([y.clock,y.status]);
   for(const k of ['state','outputs','trace']as const)bytes(x[k],y[k]);bytes(run.save(),restored.save());bytes(run.runIdentity(),restored.runIdentity());
   settlements.push(String(x.clock)+(next?'':':exhausted'));
   console.info('M112 EXACT '+settlements.at(-1));
   if(!next){expect(at).toBeUndefined();expect(x.clock).toBe(101n);return;}
  }throw Error('M112 settlement cap');
 }
 for(const at of [18n,44n,46n]){
  await advance(at);const observed:Run={...run,snapshot:()=>frame},view=snapshotView(frame,reader),p=live(observed,at,view),l=refold(observed),save=run.save();
  expect(l.journal).toHaveLength(at===18n?4:16);expect(readQ(items(p.report,'list')[1])).toEqual(l.formation.P);expect(items(p.report,'list')[2]).toBe(true);
  for(const [i,x]of frozen.entries())expect(qualificationParts(l.journal[i]).expression).toEqual(x);
  for(let i=frozen.length;i<l.journal.length;i++)frozen.push(qualificationParts(l.journal[i]).expression);
  if(at===44n)priorJournal=list(l.journal);if(at===46n)expect(list(l.journal)).toEqual(priorJournal);
  if(at===18n){restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});exact(run,restored);console.info('M112 RESTORE18 PASS');}
  const variants=alternatives(observed,p,b.s,at,46n),outcomes:typeof reports[number]['outcomes']=[];
  for(const v of variants){
   const exact=await enumerate(p,b.s,v.context),analytical=new Map(v.analytical.probabilities.map(x=>[key(x.key),x.probability]));
   if(v.analytical.mode==='Auto')expect([...exact.sum]).toEqual([[key(v.analytical.ranked[0].key),Q.of(1n)]]);else expect(exact.sum).toEqual(analytical);
   outcomes.push({law:v.law,mode:v.analytical.mode,probabilities:v.analytical.probabilities.map(x=>[action(x.key),fraction(x.probability)]),resolved:[...exact.sum].map(([k,p])=>[k,fraction(p)]),cases:exact.cases});
  }
  const get=(law:string)=>variants.find(v=>v.law===law)!,out=(law:string)=>outcomes.find(v=>v.law===law)!;
  expect(get('Earned').context).toEqual(p.context);expect(get('Refold').context).toEqual(p.context);expect(get('Refold').display).toEqual(get('Earned').display);
  for(const x of get('Earned').analytical.probabilities){const actual=items(f(p.data,2n),'list').find(v=>key(f(rec(v,421n),1n))===key(x.key))!;expect(x.probability).toEqual(readQ(f(rec(actual,421n),2n)));}
  expect(get('DisplayOnly').context).toEqual(get('HistoryOnly').context);expect(get('DisplayOnly').display).not.toEqual(get('HistoryOnly').display);
  for(const v of variants)expect(v.history).toEqual(list(l.journal));
  for(const law of ['DisplayOnly','HistoryOnly'])expect(out(law).probabilities.map(x=>x[1])).toEqual(['1/2','1/2']);
  if(authored)expect(out('AuthoredTrait').probabilities).toEqual(authored);else authored=out('AuthoredTrait').probabilities;
  expect(out('AuthoredTrait').probabilities).not.toEqual(out('Earned').probabilities);
  if(at===46n)expect(out('RecomputedHistory').probabilities).not.toEqual(out('Earned').probabilities);else expect(get('RecomputedHistory').context).toEqual(p.context);
  bytes(save,run.save());reports.push({at:String(at),P:fraction(l.formation.P),outcomes});
  console.info('M112 ALTERNATIVES '+JSON.stringify(reports.at(-1)));
 }
 await advance();const observed:Run={...run,snapshot:()=>frame},view=snapshotView(frame,reader),l=refold(observed);
 expect(l.journal).toHaveLength(16);for(const [i,x]of frozen.entries())expect(qualificationParts(l.journal[i]).expression).toEqual(x);
 let formation:CanonicalValue|undefined,previous=ZERO;const rows:{at:string;chosen:string;contribution:string;P:string;authorship:string}[]=[];
 for(const [index,at]of times.entries()){
  const p=live(observed,at,view),old=recorded.arms['6'].rows[index],entry=l.journal.find(v=>qualificationParts(v).at.value===at);
  expect(readQ(items(p.report,'list')[1])).toEqual(previous);
  expect(formationSignals(p.input[0],formation).output).toEqual(p.source);expect(standing(p.raw)).toEqual(standing(p.source));
  const authorship=readQ(f(p.data,7n));let contribution='None';
  if(learning(index+1)){
   expect(entry).toBeDefined();const q=qualificationParts(entry!);expect(q.accepted).toBe(true);expect(q.resolution).toEqual(p.d);
   expect(authorship.compare(Q.of(1n,2n))).toBeGreaterThanOrEqual(0);expect(readQ(q.contribution).equals(ZERO)).toBe(false);
   formation=appendFormation(formation,q.id,at,readQ(q.contribution),0).value;contribution=fraction(readQ(q.contribution));
  }else expect(entry).toBeUndefined();
  previous=formationValue(formation).P;const draws=actualDraws(observed,at,6,view.trace);
  const current={i:index+1,at:String(at),chosen:action(f(p.data,1n)),contribution,before:fraction(readQ(items(p.report,'list')[1])),after:fraction(previous),authorship:fraction(authorship),probabilities:p.probabilities.map(x=>fraction(readQ(x)))};
  for(const n of ['i','at','chosen','contribution','before','after','authorship','probabilities']as const)expect(current[n]).toEqual(old[n]);
  expect(draws.map(({local,...d})=>d)).toEqual(old.draws.map(({local,...d})=>d));
  rows.push({at:String(at),chosen:current.chosen,contribution,P:current.after,authorship:current.authorship});
 }
 expect(formationValue(formation)).toEqual(l.formation);
 const q=(s:string)=>{const [n,d]=s.split('/').map(BigInt);return Q.of(n,d);};
 expect(rows.slice(0,2).map(r=>r.chosen)).toEqual(['A','A']);expect([rows[2],rows[3],rows[5]].map(r=>r.chosen)).toEqual(['B','B','B']);
 const positive=q(rows[1].P),single=q(rows[2].P),reversed=q(rows[5].P);
 expect(positive.compare(ZERO)).toBe(1);expect(single.compare(ZERO)).toBe(1);expect(single.compare(positive)).toBe(-1);expect(reversed.compare(ZERO)).toBe(-1);
 for(const i of [2,3,5])expect(q(rows[i].contribution).compare(ZERO)).toBe(-1);
 expect(q(rows[4].P)).toEqual(q(rows[3].P)); // the intervening probe does not learn
 expect(settlements).toEqual([...Array.from({length:14},(_,i)=>String(20+i*2)),'60','101','101:exhausted']);
 console.info('M112 BIO COMPLETE '+JSON.stringify({rows,settlements,qualifications:l.journal.length,comparisons:reports.length*6,arbitrationCases:reports.flatMap(r=>r.outcomes).reduce((n,r)=>n+r.cases,0),singleContraryRetainsSign:true,sustainedContraryReverses:true,originalFourTwelve:rows.slice(0,4).every(r=>r.chosen==='A')&&rows.slice(5,17).every(r=>r.chosen==='B')}));
},550000);
