import {it,expect} from 'vitest';
import plan from '../../docs/planning/BIO_COMPARISON_PLAN_REV3.json';
import {createBioComparison,bioSummary,BIO_LAWS} from '../campaign3/bioComparison';
import {laws,alternatives,action,fixture,create,live,learned,enumerate,rec,f,uint,items,key,list,readQ,ZERO,snap,through,finish,bytes,qualificationParts,fraction,Q,appendFormation,formationValue} from './fixtures/assembledBiographyAlternatives';
it('M108 original alternatives and adopted D3 on actual original evidence',async()=>{
 const all=new Map<string,{rows:ReturnType<typeof items>; summaries:ReturnType<typeof bioSummary>[]}>();
 for(const law of BIO_LAWS)for(const earlySeed of [plan.first,plan.second]){
  const run=createBioComparison(law,{earlySeed,contrarySeeds:plan.contrarySeeds});let steps=0;while(await run.step())expect(++steps).toBeLessThanOrEqual(19);expect(steps).toBe(19);
  const rows=items(items(run.snapshot(),'list')[3],'list'),summaries=rows.map(bioSummary);all.set(law+'/'+earlySeed,{rows,summaries});
  console.info('M108 ORIGINAL '+JSON.stringify({law,earlySeed,choices:summaries.map(v=>v.chosen).join(''),probes:[4,17,18].map(i=>({at:summaries[i].at,modifiers:summaries[i].modifiers,probabilities:summaries[i].probabilities,strength:summaries[i].strength}))}));
 }
 const get=(law:string,seed=plan.first)=>all.get(law+'/'+seed)!;
 for(const seed of [plan.first,plan.second]){
  expect(get('Refold',seed).rows).toEqual(get('Earned',seed).rows);
  const display=get('DisplayOnly',seed),history=get('HistoryOnly',seed),earned=get('Earned',seed);
  expect(display.rows.map(v=>list(items(v,'list').slice(0,13)))).toEqual(history.rows.map(v=>list(items(v,'list').slice(0,13))));
  expect(display.summaries[4].history).toBe(earned.summaries[4].history);expect(history.summaries[4].display).not.toBe(display.summaries[4].display);
  for(const x of [display,history])for(const i of [4,17,18]){expect(x.summaries[i].modifiers).toEqual(['0','0']);expect(x.summaries[i].probabilities).toEqual(['1/2','1/2']);}
  expect(earned.summaries[17].archive).toBe(earned.summaries[18].archive);expect(get('RecomputedHistory',seed).summaries[17].archive).not.toBe(get('RecomputedHistory',seed).summaries[18].archive);
  for(const law of BIO_LAWS)expect(get(law,seed).summaries.map(v=>v.nondecision)).toEqual(get('Earned').summaries.map(v=>v.nondecision));
 }
 for(const i of [4,17,18]){expect(get('AuthoredTrait').summaries[i].modifiers).toEqual(get('AuthoredTrait',plan.second).summaries[i].modifiers);expect(get('AuthoredTrait').summaries[i].probabilities).toEqual(get('AuthoredTrait',plan.second).summaries[i].probabilities);}
 const original=get('Earned');expect(original.summaries.slice(0,4).map(v=>v.chosen)).toEqual(['A','A','A','A']);expect(original.summaries.slice(5,17).every(v=>v.chosen==='B')).toBe(true);
 expect([original.summaries[3].strength,original.summaries[5].strength,original.summaries[16].strength]).toEqual(['111111/361111','333333/1555555','-111111/347222']);
 let state:Parameters<typeof appendFormation>[0];const steps=[];for(const [i,row]of original.rows.entries())if(i<4||i>=5&&i<17){const a=items(row,'list'),qual=rec(a[8],429n),status=rec(f(qual,3n),430n),data=rec(f(rec(f(rec(a[5],409n),4n),419n),2n),420n);expect(uint(f(status,1n))).toBe(1n);expect(readQ(f(data,7n)).compare(Q.of(1n,2n))).toBeGreaterThanOrEqual(0);
  const c=readQ(f(status,3n));expect(c).toEqual(Q.of(i<4?1n:-1n,9n));const update=appendFormation(state,f(qual,1n),BigInt(i+1),c,0);state=update.value;steps.push({at:i+1,c:fraction(c),P:fraction(update.after),gain:fraction(update.gain),delta:fraction(update.delta)});
 }
 expect(steps).toHaveLength(16);expect([steps[3].P,steps[4].P,steps[15].P]).toEqual(['4/9','1/3','-1/2']);expect(formationValue(state).entries).toHaveLength(16);
 console.info('M108 D3 CONTROL CORRESPONDENCE '+JSON.stringify(steps));
},220000);
it('M108 six alternatives on actual native history and reversed meaning',async()=>{
 const {b,run}=await create(fixture(0)),receipts=[];let authored:unknown;
 for(const at of [12n,16n,26n]){
  await through(run,at);const p=live(run,at),save=run.save(),P=readQ(items(p.report,'list')[1]);expect(P.compare(ZERO)).toBe(at===12n?-1:1);
  const variants=alternatives(run,p,b.s,at),again=alternatives(run,p,b.s,at);expect(variants.map(v=>[v.context,v.display,v.history])).toEqual(again.map(v=>[v.context,v.display,v.history]));
  const outcomes:{law:string;mode:string;probabilities:string[][];resolved:string[][];cases:number}[]=[];for(const v of variants){const exact=await enumerate(p,b.s,v.context),actual=new Map(v.analytical.probabilities.map(x=>[key(x.key),x.probability]));
   if(v.analytical.mode==='Auto'){expect([...exact.sum]).toEqual([[key(v.analytical.ranked[0].key),Q.of(1n)]]);}else expect(exact.sum).toEqual(actual);
   outcomes.push({law:v.law,mode:v.analytical.mode,probabilities:v.analytical.probabilities.map(x=>[action(x.key),fraction(x.probability)]),resolved:[...exact.sum].map(([k,p])=>[k,fraction(p)]),cases:exact.cases});
  }
  const get=(law:string)=>variants.find(v=>v.law===law)!,receipt=(law:string)=>outcomes.find(v=>v.law===law)!;
  expect(get('Earned').context).toEqual(p.context);expect(get('Refold').context).toEqual(p.context);expect(get('Refold').display).toEqual(get('Earned').display);
  for(const x of get('Earned').analytical.probabilities){const original=items(f(p.data,2n),'list').find(v=>key(f(rec(v,421n),1n))===key(x.key))!;expect(x.probability).toEqual(readQ(f(rec(original,421n),2n)));}
  expect(get('DisplayOnly').context).toEqual(get('HistoryOnly').context);expect(get('DisplayOnly').display).not.toEqual(get('HistoryOnly').display);expect(get('DisplayOnly').history).toEqual(get('Earned').history);
  for(const law of ['DisplayOnly','HistoryOnly'])expect(receipt(law).probabilities.map(x=>x[1])).toEqual(['1/2','1/2']);
  const fixed=receipt('AuthoredTrait').probabilities;if(authored)expect(fixed).toEqual(authored);else authored=fixed;expect(fixed).not.toEqual(receipt('Earned').probabilities);
  if(at===26n)expect(receipt('RecomputedHistory').probabilities).not.toEqual(receipt('Earned').probabilities);else expect(get('RecomputedHistory').context).toEqual(p.context);
  bytes(save,run.save());receipts.push({at:String(at),P:fraction(P),outcomes});
 }
 await finish(run);expect(learned(run).journal).toHaveLength(8);console.info('M108 NATIVE ALTERNATIVES '+JSON.stringify(receipts));console.info('M108 native calendar101; unchanged save after all diagnostic controls; all6 alternatives at3 live frames PASS');
},520000);
