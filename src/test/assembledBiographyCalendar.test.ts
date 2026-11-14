import {it,expect} from 'vitest';
import recorded from '../../docs/planning/ASSEMBLED_CHARACTER_M110_RECEIPTS.json';
import {fixture,header,times,learning,actualDraws,create,live,refold,learned,standing,ablation,rec,f,uint,items,key,decode,readQ,ZERO,snap,through,finish,exact,bytes,qualificationParts,fraction,Q,formationSignals,enumerate,type Run,type CanonicalValue} from './fixtures/assembledBiographyCalendar';
import {restoreCharacterRun} from '../assembled/character';
import {analysis,action} from './fixtures/assembledBiographyAlternatives';
type Row={i:number;at:string;chosen:string;contribution:string;before:string;after:string;authorship:string;probabilities:string[];draws:ReturnType<typeof actualDraws>};
type Receipt={arm:number;rows:Row[];terminal:number;qualifications:number;originalWitness:boolean;settlements:string[]};
const liveReceipts:Record<string,Receipt>={};
for(const arm of [6,0])it('M110 arm '+arm+' full calendar'+(arm===6?' and exact continuation':''),async()=>{
 const b=fixture(arm),{run}=await create(b),rows:Row[]=[],frozen:CanonicalValue[]=[],settlements:string[]=[];let restored:Run|undefined,prior=ZERO,normalMeaning:CanonicalValue|undefined;
 async function advance(at?:bigint){
  if(!restored){if(at!==undefined)await through(run,at);else await finish(run);return;}
  for(let n=0;n<40;n++){
   if(at!==undefined&&run.snapshot().clock>=at)return;
   const next=await run.settleNextInstant();expect(await restored.settleNextInstant()).toBe(next);
   const x=run.snapshot(),y=restored.snapshot();expect([y.clock,y.status]).toEqual([x.clock,x.status]);
   for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(run.save(),restored.save());bytes(run.runIdentity(),restored.runIdentity());settlements.push(String(x.clock)+(next?'':':exhausted'));
   if(!next){expect(at).toBeUndefined();expect(x.clock).toBe(101n);return;}
  }throw Error('M110 settlement cap');
 }
 for(const [index,at]of times.entries()){
  await advance(at);const observed:Run={...run};const i=index+1,p=live(observed,at),l=refold(observed);expect(readQ(items(p.report,'list')[1])).toEqual(prior);
  expect(formationSignals(p.input[0],i===1?undefined:p.input[1]).output).toEqual(p.source);expect(standing(p.raw)).toEqual(standing(p.source));
  let contribution='None';if(learning(i)){
   expect(l.journal).toHaveLength(frozen.length+1);const qual=qualificationParts(l.journal[frozen.length]);expect(qual.accepted).toBe(true);expect(qual.at.value).toBe(at);expect(qual.resolution).toEqual(p.d);expect(readQ(qual.contribution).equals(ZERO)).toBe(false);contribution=fraction(readQ(qual.contribution));frozen.push(qual.expression);
  }else{
   expect(l.journal).toHaveLength(frozen.length);expect(l.formation.P).toEqual(prior);const absent=ablation(p,b.s),a=analysis(absent.context,b.s);expect(a.probabilities.map(v=>v.probability)).toEqual([Q.of(1n,2n),Q.of(1n,2n)]);
   if(i===5)normalMeaning=f(p.raw,4n);
   if(i===19){expect(f(p.raw,4n)).not.toEqual(normalMeaning);const exactActual=await enumerate(p,b.s),exactAbsent=await enumerate(p,b.s,absent.context);expect([...exactAbsent.sum.values()]).toEqual([Q.of(1n,2n),Q.of(1n,2n)]);for(const v of items(f(p.data,2n),'list'))expect(exactActual.sum.get(key(f(rec(v,421n),1n)))).toEqual(readQ(f(rec(v,421n),2n)));}
  }
  for(const [j,x]of frozen.entries())expect(qualificationParts(l.journal[j]).expression).toEqual(x);
  rows.push({i,at:String(at),chosen:action(f(p.data,1n)),contribution,before:fraction(prior),after:fraction(l.formation.P),authorship:fraction(readQ(f(p.data,7n))),probabilities:p.probabilities.map(v=>fraction(readQ(v))),draws:actualDraws(observed,at,arm)});prior=l.formation.P;
  if(i===5&&arm===6){restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:run.save()});exact(run,restored);}
 }
 await advance();const final=learned({...run});expect(final.journal).toHaveLength(16);expect(final.formation.P).toEqual(prior);for(const [i,x]of frozen.entries())expect(qualificationParts(final.journal[i]).expression).toEqual(x);
 const receipt:Receipt={arm,rows,terminal:101,qualifications:16,originalWitness:rows.slice(0,4).every(v=>v.chosen==='A')&&rows.slice(5,17).every(v=>v.chosen==='B'),settlements};
 liveReceipts[String(arm)]=receipt;console.info('M110 RECEIPT '+JSON.stringify(receipt));
},arm===6?550000:380000);
it('M110 paired original-calendar receipt comparison',()=>{
 const r=recorded as unknown as {arms:Record<string,Receipt>},a=liveReceipts['6']??r.arms['6'],b=liveReceipts['0']??r.arms['0'];expect(a).toBeDefined();expect(b).toBeDefined();let matches=0,differentRoots=0,changedProbes=0;
 for(const [j,x]of a.rows.entries()){
  const y=b.rows[j];expect([x.i,x.at]).toEqual([y.i,y.at]);if(x.i<=4)continue;
  const other=new Map(y.draws.map(d=>[d.effective,d]));let common=0;for(const d of x.draws){const e=other.get(d.effective);if(!e)continue;common++;matches++;expect([d.span,d.result,d.attempts]).toEqual([e.span,e.result,e.attempts]);if(d.local!==e.local)differentRoots++;}
  expect(common).toBeGreaterThanOrEqual(2);if([5,18,19].includes(x.i)&&keyText(x.probabilities)!==keyText(y.probabilities))changedProbes++;
 }
 expect(changedProbes).toBeGreaterThan(0);expect(a.qualifications).toBe(16);expect(b.qualifications).toBe(16);expect(a.settlements.at(-1)).toBe('101:exhausted');
 console.info('M110 PAIRED PASS '+JSON.stringify({matches,differentRoots,changedProbes,originalFourPositiveTwelveContrary:[a.originalWitness,b.originalWitness],nativeChoices:[a.rows.map(v=>v.chosen).join(''),b.rows.map(v=>v.chosen).join('')]}));
});
const keyText=(x:unknown)=>JSON.stringify(x);

it("M110 source declaration diagnosis after admission failure",()=>{
 const b=fixture(6),rows=items(decode(b.d.orderedInputs),"list").slice(1),counts=new Map<string,number>();
 for(const row of rows){const a=items(row,"list"),event=a[2];if(typeof event==='boolean'||event.kind!=='typedIdentifier'||typeof event.payload==='boolean'||event.payload.kind!=='text')throw Error('source type');const name=event.payload.value;counts.set(name,(counts.get(name)??0)+1);}
 expect(times).toHaveLength(19);console.info('M110 SOURCE COUNTS '+JSON.stringify([...counts]));
},110000);
