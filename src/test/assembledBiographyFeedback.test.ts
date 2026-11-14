/** M111 plan9a178cc6. Same M110 calendar/keys; fixed Boolean changes receiving only.
 * Nonsocial A/B, body30/cap100/rate10/delivery90@9; readings0, Values unlinked,
 * execution/outcome reports blocked. All19 opportunities and16 acquisitions retained. */
import {it,expect} from 'vitest';
import recorded from '../../docs/planning/ASSEMBLED_CHARACTER_M110_RECEIPTS.json';
import {fixture as original,times,learning,actualDraws,snapshotView,createTraceReader,create,live,refold,learned,standing,rec,f,uint,items,key,list,readQ,ZERO,snap,through,finish,exact,bytes,qualificationParts,fraction,Q,formationSignals,type Run,type CanonicalValue} from './fixtures/assembledBiographyCalendar';
import {action} from './fixtures/assembledBiographyAlternatives';
import {changeDefinition} from './fixtures/assembledCharacter';
import {prepareCharacterModel,characterModelIdentity,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {FEEDBACK_RULES,FEEDBACK_REGISTRY,OPPORTUNITY_CONTEXT_REGISTRY} from '../assembled/model';
import {qValue} from '../campaign2/cognitiveMath';

function fixture(arm:6|0,enabled:boolean){
 const old=original(arm),s=changeDefinition({...old.s,rulesVersion:FEEDBACK_RULES,registrySchemaVersion:FEEDBACK_REGISTRY},'definition/task-reason-source',1n,enabled);
 return {s,d:old.d};
}
it('M111 feedback admission preserves old domains and model binding',async()=>{
 const on=fixture(6,true),off=fixture(6,false);
 bytes(on.d.orderedInputs,off.d.orderedInputs);bytes(on.d.initialState,off.d.initialState);bytes(on.d.runSeed,off.d.runSeed);
 const a=await prepareCharacterModel(on.s),b=await prepareCharacterModel(off.s);
 expect(characterModelIdentity(a)).not.toEqual(characterModelIdentity(b));
 await createCharacterRun(a,on.d);await createCharacterRun(b,off.d);
 await expect(prepareCharacterModel(changeDefinition(original(6).s,'definition/task-reason-source',1n,false))).rejects.toThrow('undeclared topology change');
 await expect(prepareCharacterModel({...on.s,registrySchemaVersion:OPPORTUNITY_CONTEXT_REGISTRY})).rejects.toThrow('version bundle');
 await expect(prepareCharacterModel(changeDefinition(off.s,'definition/task-reason-source',1n,qValue(Q.of(1n))))).rejects.toThrow();
 await expect(prepareCharacterModel(changeDefinition(off.s,'definition/task-reason-source',2n,qValue(Q.of(1n,2n))))).rejects.toThrow('undeclared topology change');
 console.info('M111 ADMISSION PASS:0.88 Boolean admitted/identity committed;0.87 false, mixed version, malformed Boolean and changed frozen field reject.');
},140000);

for(const [arm,enabled]of [[6,true],[6,false],[0,false]] as const){
 const label=(enabled?'enabled':'disabled')+'/'+arm;
 it('M111 full calendar '+label+(arm===6&&!enabled?' and exact continuation':''),async()=>{
  const b=fixture(arm,enabled),control=recorded.arms[String(arm) as '6'|'0'];
  const {run}=await create(b),readTrace=createTraceReader(),frozen:CanonicalValue[]=[],settlements:string[]=[];
  const rows:{i:number;at:string;chosen:string;contribution:string;before:string;after:string;authorship:string;probabilities:string[];matched:number;unmatchedNative:number;unmatchedControl:number}[]=[];
  let frame=snap(run),restored:Run|undefined,prior=ZERO,probabilityChanges=0,choiceChanges=0,historyChanges=0,nonzeroProbes=0;
  async function advance(at?:bigint){
   if(!restored){if(at===undefined)await finish(run);else await through(run,at);frame=snap(run);return;}
   for(let n=0;n<40;n++){
    if(at!==undefined&&frame.clock>=at)return;
    const next=await run.settleNextInstant();expect(await restored.settleNextInstant()).toBe(next);
    const x=run.snapshot(),y=restored.snapshot();frame=x;expect([y.clock,y.status]).toEqual([x.clock,x.status]);
    for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);
    bytes(run.save(),restored.save());bytes(run.runIdentity(),restored.runIdentity());
    settlements.push(String(x.clock)+(next?'':':exhausted'));
    if(!next){expect(at).toBeUndefined();expect(x.clock).toBe(101n);return;}
   }throw Error('M111 settlement cap');
  }
  for(const [index,at]of times.entries()){
   await advance(at);
   const observed:Run={...run,snapshot:()=>frame},view=snapshotView(frame,readTrace),p=live(observed,at,view),l=refold(observed),i=index+1,c=control.rows[index];
   // Liveness precedes every comparison; live asserts two rolling d4 alternatives.
   expect(readQ(items(p.report,'list')[1])).toEqual(prior);expect(items(p.report,'list')[2]).toBe(enabled);
   const derived=formationSignals(p.input[0],i===1?undefined:p.input[1],enabled);
   expect(derived.output).toEqual(p.source);expect(derived.report).toEqual(p.report);expect(standing(p.raw)).toEqual(standing(p.source));
   let contribution='None';
   if(learning(i)){
    expect(l.journal).toHaveLength(frozen.length+1);const q=qualificationParts(l.journal[frozen.length]);
    expect(q.accepted).toBe(true);expect(q.at.value).toBe(at);expect(q.resolution).toEqual(p.d);
    expect(readQ(q.contribution).equals(ZERO)).toBe(false);contribution=fraction(readQ(q.contribution));frozen.push(q.expression);
   }else{expect(l.journal).toHaveLength(frozen.length);expect(l.formation.P).toEqual(prior);}
   for(const [j,x]of frozen.entries())expect(qualificationParts(l.journal[j]).expression).toEqual(x);
   const draws=actualDraws(observed,at,arm,view.trace),other=new Map(c.draws.map(d=>[d.effective,d]));let matched=0;
   for(const d of draws){const e=other.get(d.effective);if(!e)continue;matched++;expect([d.span,d.result,d.attempts]).toEqual([e.span,e.result,e.attempts]);}
   expect(matched).toBeGreaterThanOrEqual(2);
   const row={i,at:String(at),chosen:action(f(p.data,1n)),contribution,before:fraction(prior),after:fraction(l.formation.P),authorship:fraction(readQ(f(p.data,7n))),probabilities:p.probabilities.map(v=>fraction(readQ(v))),matched,unmatchedNative:draws.length-matched,unmatchedControl:c.draws.length-matched};
   if(enabled){
    for(const name of ['i','at','chosen','contribution','before','after','authorship','probabilities'] as const)expect(row[name]).toEqual(c[name]);
    expect(draws.map(({local,...d})=>d)).toEqual(c.draws.map(({local,...d})=>d));
   }else{
    expect(standing(p.raw)).toHaveLength(0);expect(row.probabilities).toEqual(['1/2','1/2']);
    if(i===1)for(const name of ['chosen','contribution','before','after','authorship','probabilities'] as const)expect(row[name]).toEqual(c[name]);
    if(row.chosen!==c.chosen)choiceChanges++;if(row.after!==c.after)historyChanges++;
    if([5,18,19].includes(i)){
     if(JSON.stringify(row.probabilities)!==JSON.stringify(c.probabilities))probabilityChanges++;
     if(!prior.equals(ZERO))nonzeroProbes++;
    }
   }
   rows.push(row);prior=l.formation.P;
   console.info('M111 STEP '+JSON.stringify({label,...row}));
   if(i===5&&arm===6&&!enabled){
    const save=run.save();restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save});exact(run,restored);
    // Opposite settings cannot resume the disabled model's save.
    await expect(restoreCharacterRun(fixture(6,true).s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save})).rejects.toThrow('commitments differ');
    console.info('M111 RESTORE18 PASS plus cross-configuration rejection');
   }
  }
  await advance();const l=learned({...run,snapshot:()=>frame});expect(frame.clock).toBe(101n);expect(l.journal).toHaveLength(16);expect(l.formation.P).toEqual(prior);
  for(const [i,x]of frozen.entries())expect(qualificationParts(l.journal[i]).expression).toEqual(x);
  if(!enabled){
   expect(probabilityChanges).toBeGreaterThan(0);expect(nonzeroProbes).toBeGreaterThan(0);
   // Display is an observation, never a different state owner or replay pipeline.
   const save=run.save(),displayOnly={history:list(l.journal),display:list([qValue(l.formation.P)])},historyOnly={history:list(l.journal),display:list([])};
   expect(displayOnly.history).toEqual(historyOnly.history);expect(displayOnly.display).not.toEqual(historyOnly.display);bytes(save,run.save());
  }
  if(arm===6&&!enabled)expect(settlements).toEqual([...Array.from({length:14},(_,i)=>String(20+i*2)),'60','101','101:exhausted']);
  console.info('M111 COMPLETE '+JSON.stringify({label,rows,settlements,qualifications:l.journal.length,probabilityChanges,nonzeroProbes,choiceChanges,historyChanges,originalWitness:rows.slice(0,4).every(r=>r.chosen==='A')&&rows.slice(5,17).every(r=>r.chosen==='B')}));
 },arm===6&&!enabled?550000:380000);
}
