import {sha256} from '../substrate/crypto';
import {it,expect} from 'vitest';
import {fixture,create,bound,provenance,mapping,mapped,evidence,transcript,fraction,ablation,enumerate,capture,learned,standing,withoutStanding,rec,f,uint,items,key,decode,enc,list,q,readQ,ZERO,outputs,signedValue,snap,through,finish,exact,bytes,qualificationParts,type Run} from './fixtures/assembledBiography';
import {restoreCharacterRun} from '../assembled/character';
import {bounded} from '../campaign2/cognitiveMath';
import {factoredPriority} from '../assembled/priority';
import {ExactRational as Q} from '../substrate/exactMath';
let setup:Awaited<ReturnType<typeof create>>;
async function initialize(){if(!setup)setup=await create();return setup;}
const choices=(p:ReturnType<typeof capture>)=>key(f(p.data,1n));
const chance=(p:ReturnType<typeof capture>)=>key(f(p.data,2n));
for(const start of [0,4])it('M106 lanes '+start+'..'+(start+3)+' cause acquired biography and later probability differences',async()=>{
 expect(bounded(factoredPriority(Q.of(13n,20n),Q.of(1n)))).toEqual(Q.of(13n,33n));
 for(const v of [Q.of(13n,33n),Q.of(3n,8n)]){expect(v.compare(Q.of(37n,100n))).toBeGreaterThan(0);expect(v.compare(Q.of(2n,5n))).toBeLessThan(0);}
 const setup=await initialize(),before:ReturnType<Run['snapshot']>[]=[],proofs:ReturnType<typeof evidence>[]=[],lanes:Awaited<ReturnType<typeof bound>>[]=[];
 const hash=async(s:string|Uint8Array)=>[...await sha256(typeof s==='string'?new TextEncoder().encode(s):s)].map(x=>x.toString(16).padStart(2,'0')).join('');
 for(let lane=start;lane<start+4;lane++){
  const x=await bound(fixture(),setup.run,lane),b=x.b;before.push(x.before);
  if(lane>start){bytes(before[0].state,x.before.state);bytes(before[0].outputs,x.before.outputs);}
  lanes.push(x);const e=evidence(x.run);proofs.push(e);
  if(lane>start){expect(e.early.context).toEqual(proofs[0].early.context);expect(key(provenance(x.run)(withoutStanding(e.probe.raw)))).toBe(key(provenance(lanes[0].run)(withoutStanding(proofs[0].probe.raw))));expect(f(e.probe.raw,4n)).toEqual(f(proofs[0].probe.raw,4n));expect(transcript(x.run,12n)).toEqual(transcript(lanes[0].run,12n));}
  expect(transcript(x.run,10n).length).toBeGreaterThan(0);expect(transcript(x.run,12n).length).toBeGreaterThan(1);
  const absent=ablation(e.probe,b.s);expect(standing(absent.raw)).toHaveLength(0);
  if(lane>start){const prior=ablation(proofs[0].probe,lanes[0].b.s);expect(key(provenance(x.run)(list(absent.ns)))).toBe(key(provenance(lanes[0].run)(list(prior.ns))));}
  console.info('M106 LANE '+JSON.stringify({lane,earlyWinner:choices(e.early),contribution:fraction(readQ(e.qualification.contribution)),P:fraction(e.formation.P),probeProbabilities:e.probe.probabilities.map(x=>fraction(readQ(x))),probeDraws:transcript(x.run,12n).length}));
 }
 // Global eight-lane diversity and all28 pair comparisons are checked from the
 // completed-lane receipts after both bounded batches. No lane is omitted.
 expect(new Set(proofs.map(e=>fraction(e.formation.P))).size).toBe(new Set(proofs.map(e=>choices(e.early))).size);
 expect(new Set(proofs.map(e=>chance(e.probe))).size).toBe(new Set(proofs.map(e=>choices(e.early))).size);
 // All unordered pairs: choice divergence and biography divergence correspond.
 for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){
  const different=choices(proofs[i].early)!==choices(proofs[j].early);
  expect(chance(proofs[i].probe)!==chance(proofs[j].probe)).toBe(different);
  if(different)expect(proofs[i].qualification.expression).not.toEqual(proofs[j].qualification.expression);
 }
 // Exhaustive receiving proof for each distinct acquired history; no new native scenarios.
 const representatives=proofs.filter((e,i)=>proofs.findIndex(x=>choices(x.early)===choices(e.early))===i);let cases=0;
 for(const e of representatives){
  const actual=await enumerate(e.probe,lanes[0].b.s),removed=await enumerate(e.probe,lanes[0].b.s,ablation(e.probe,lanes[0].b.s).context);cases+=actual.cases+removed.cases;
  for(const p of items(f(e.probe.data,2n),'list'))expect(actual.sum.get(key(f(rec(p,421n),1n)))).toEqual(readQ(f(rec(p,421n),2n)));
  expect([...removed.sum.values()]).toEqual([Q.of(1n,2n),Q.of(1n,2n)]);
  expect(actual.sum).not.toEqual(removed.sum);
 }
 const receipts=await Promise.all(lanes.map(async(x,i)=>{const e=proofs[i];return {lane:start+i,rebound:x.rebound,model:await hash(enc(f(rec(decode(x.run.runIdentity()),104n),1n))),before:await hash(before[i].state),beforeOutputs:await hash(before[i].outputs),earlyContext:await hash(enc(e.early.context)),earlyWinner:choices(e.early),contribution:fraction(readQ(e.qualification.contribution)),P:fraction(e.formation.P),nonStanding:await hash(key(provenance(x.run)(withoutStanding(e.probe.raw)))),meaning:await hash(key(f(e.probe.raw,4n))),probeDraws:await hash(key(list(transcript(x.run,12n)))),probabilities:e.probe.probabilities.map(v=>fraction(readQ(v)))};}));
 for(let i=0;i<lanes.length;i++){const expression=proofs[i].qualification.expression;await finish(lanes[i].run);expect(qualificationParts(learned(lanes[i].run).journal[0]).expression).toEqual(expression);}
 for(const receipt of receipts)console.info('M106 COMPLETED LANE '+JSON.stringify(receipt));
 await finish(setup.run);
 console.info('M106 BATCH PASS '+start+'..'+(start+3)+'; exact receiving cases='+cases+'; all calendars101');
},570000);
it('M106 pressure and hidden truth preserve the evidence boundary',async()=>{
 const s=await initialize(),normal=await bound(fixture(),s.run,0),hidden=await bound(fixture(false,true),s.run,0),pressure=await bound(fixture(true),s.run,0);
 const a=evidence(normal.run),h=evidence(hidden.run),p=capture(pressure.run);
 expect(h.early.d).toEqual(a.early.d);expect(h.probe.d).toEqual(a.probe.d);bytes(snap(normal.run).state,snap(hidden.run).state);
 expect(learned(pressure.run).journal).toHaveLength(0);expect(learned(pressure.run).formation.entries).toHaveLength(0);expect(standing(p.raw)).toHaveLength(0);
 expect(capture(pressure.run,10n).d).toEqual(a.early.d);expect(p.probabilities.map(readQ)).toEqual([Q.of(1n,2n),Q.of(1n,2n)]);
 expect(key(provenance(pressure.run)(withoutStanding(p.raw)))).toBe(key(provenance(normal.run)(withoutStanding(a.probe.raw))));
 for(const x of [normal,hidden,pressure])await finish(x.run);await finish(s.run);
 console.info('M106 CONTROLS PASS significance live; pressure excludes acquisition, hidden truth preserves cognition; full calendars101');
},570000);
it('M106 exact repeat and continuation retain frozen biography',async()=>{
 const s=await initialize(),b=mapped(fixture(),mapping(s.run,0)),a=await create(b,9n),repeat=await create(b,9n);exact(a.run,repeat.run);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.run.save()});exact(a.run,restored);
 for(const at of [10n,11n,12n,13n,14n,20n,40n,101n]){for(const r of [a.run,repeat.run,restored])await through(r,at);exact(a.run,repeat.run);exact(a.run,restored);}
 for(const r of [a.run,repeat.run,restored])expect(await r.settleNextInstant()).toBe(false);
 const final=a.run.snapshot();for(const r of [repeat.run,restored]){const other=r.snapshot();expect([other.clock,other.status]).toEqual([final.clock,final.status]);for(const k of ['state','outputs','trace'] as const)bytes(final[k],other[k]);bytes(a.run.save(),r.save());}
 await finish(s.run);
 expect(learned(restored).journal).toHaveLength(1);console.info('M106 PERSISTENCE PASS save9 and every remaining settlement through101; exact state/output/trace/save/identity');
},570000);
