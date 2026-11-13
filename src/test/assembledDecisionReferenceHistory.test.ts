import {it,expect} from 'vitest';
import {fixture,create,capture,snap,through,finish,exact,bytes,rec,f,items,key,uint,list,set,record,text,u,signed,q,replace,decode,outputs,type Run,type CanonicalValue} from './fixtures/assembledDecisionReference';
import {restoreCharacterRun} from '../assembled/character';
import {decisionHistoryView,decisionPresentationView,validateDecisionView,ROUNDING_DECISION_VIEW_VERSION} from '../assembled/decisionView';
import {map,typedIdentifier} from '../substrate/canonicalEncoding';
const rows=(v:CanonicalValue)=>items(items(v,'list')[1],'list');
const entry=(run:Run)=>items(rows(decode(run.decisionHistory())).find(v=>key(items(v,'list')[1])===key(signed(10)))!,'list');
function collapse(e:readonly CanonicalValue[]){
 const zero=items(e[4],'list').some(v=>{const m=rec(f(rec(v,203n),6n),204n);return f(m,3n)===true&&key(f(m,4n))===key(q(0,1));});
 return list(e.map((v,i)=>i===3&&zero?list([]):v));
}
function immutable(run:Run){
 const before=run.snapshot(),save=run.save(),id=run.runIdentity(),h=run.decisionHistory(),p=run.decisionPresentation();
 bytes(h,run.decisionHistory());bytes(p,run.decisionPresentation());h.fill(0);p.fill(0);
 expect(run.snapshot()).toEqual(before);bytes(save,run.save());bytes(id,run.runIdentity());
}
function boundaries(run:Run){
 const os=items(decode(snap(run).outputs),'list'),ts=items(decode(snap(run).trace),'list'),privateRecord=outputs(snap(run).outputs,433n)[0];
 const poisoned=os.map(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===426n?replace(v,1n,typedIdentifier(1134,list([map([[text('private'),set([privateRecord])]])]))):v);
 expect(()=>decisionHistoryView(poisoned,ts)).toThrow('unsupported nested record');
 const observation=ts.find(v=>{const t=rec(v,160n),ev=rec(f(t,4n),130n);return uint(f(ev,3n))===120n&&key(f(ev,5n))===key(typedIdentifier(1001,text('event/protocol-observation')));})!;
 expect(observation).toBeDefined();
 const corrupt=(field:bigint,value:CanonicalValue)=>ts.map(v=>v===observation?replace(v,4n,replace(f(rec(v,160n),4n),field,value)):v);
 expect(()=>decisionHistoryView(os,corrupt(8n,list([u(999999)])))).toThrow('execution parent');
 expect(()=>decisionHistoryView(os,[...ts,observation])).toThrow('ambiguous observation');
 const evidence=f(rec(observation,160n),13n);expect(()=>decisionHistoryView(os.filter(v=>key(v)!==key(evidence)),ts)).toThrow('foreign observation');
 expect(()=>decisionHistoryView(os,corrupt(2n,signed(999)))).toThrow('execution instant');
}
it('M105 history keeps frozen intent separate from visible and unknown outcomes',async()=>{
 const results: {run:Run;e:readonly CanonicalValue[]}[]=[];
 for(const observed of [true,false])for(const physical of [true,false]){
  const x=await create(fixture(physical,observed)),p=capture(x.run),e=entry(x.run);expect(uint(f(p.data,8n))).toBe(2n);
  expect(e[0]).toEqual(f(p.d,1n));expect(e[2]).toEqual(f(p.intent,1n));expect(items(e[3],'list')[0]).toEqual(f(p.expression,1n));expect(items(e[3],'list')[12]).toEqual(f(p.expression,4n));
  expect(items(e[4],'list')).toHaveLength(observed?1:0);validateDecisionView(list(e));immutable(x.run);
  if(observed){const m=rec(f(rec(items(e[4],'list')[0],203n),6n),204n),lower=f(m,2n);if(typeof lower==='boolean'||lower.kind!=='rational')throw Error('measurement');expect(lower.numerator>0n).toBe(physical);}
  if(observed&&!physical)boundaries(x.run);
  results.push({run:x.run,e});
 }
 const [success,failure,unknownSuccess,unknownFailure]=results;
 for(const x of results)expect(x.e.slice(0,4)).toEqual(success.e.slice(0,4));
 expect(success.e[4]).not.toEqual(failure.e[4]);expect(collapse(success.e)).toEqual(list(success.e));
 expect(items(collapse(failure.e),'list')[3]).toEqual(list([]));expect(items(failure.e[3],'list').length).toBeGreaterThan(0);
 expect(unknownSuccess.e).toEqual(unknownFailure.e);expect(collapse(unknownSuccess.e)).toEqual(collapse(unknownFailure.e));
 const hidden=await create(fixture(true,true,'quiet',true));capture(hidden.run);expect(entry(hidden.run)).toEqual(success.e);bytes(hidden.run.decisionPresentation(),success.run.decisionPresentation());
 for(const x of [...results,{run:hidden.run,e:entry(hidden.run)}]){await finish(x.run);expect(entry(x.run)).toEqual(x.e);}
 console.info('M105 HISTORY PASS all4 permission cells;frozen meaning identical;visible failure differs from unknown;IntentEqualsOutcome fails;hidden entry equal;closure/join negatives;all calendars101');
},570000);
it('M105 player view exposes authoritative faces without private draw records',async()=>{
 const x=await create(fixture(true,true,'balanced')),p=capture(x.run),view=decode(x.run.decisionPresentation());
 expect(items(view,'list')[0]).toEqual(text(ROUNDING_DECISION_VIEW_VERSION+'/player'));expect(uint(f(p.data,8n))).toBe(3n);
 const shown=rows(view).map(v=>items(v,'list')).find(v=>key(v[0])===key(f(p.d,1n)))!;
 expect(shown[1]).toEqual(f(p.data,1n));
 expect(shown[2]).toEqual(list(p.ds.map(d=>list([f(d,1n),f(d,2n),f(d,3n),f(d,4n),f(d,6n),f(d,7n),f(d,8n),list([]),f(d,10n)]))));
 const tie=rec(f(p.data,10n),423n);expect(shown[3]).toEqual(list(uint(f(tie,1n))===2n?[f(tie,4n)]:[]));
 validateDecisionView(view);expect(()=>validateDecisionView(f(p.ds[0],5n))).toThrow('unsupported nested record');
 for(const mode of [1,2]){const d=replace(p.d,4n,replace(f(p.d,4n),2n,replace(p.data,8n,u(mode))));expect(rows(decisionPresentationView([d]))).toHaveLength(0);}
 immutable(x.run);await finish(x.run);
 console.info('M105 PLAYER PASS exact native0.3 faces/modifiers/contributions/tie;private draw rejected;Auto/Quiet suppressed;read-only;calendar101');
},570000);
it('M105 continuation preserves every settled byte and public view after save9',async()=>{
 const b=fixture(false,true),a=await create(b,9n),repeat=await create(b,9n);exact(a.run,repeat.run);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.run.save()});exact(a.run,restored);
 const clocks:bigint[]=[];
 for(let n=0;;n++){expect(n).toBeLessThan(32);const steps=[];for(const run of [a.run,repeat.run,restored])steps.push(await run.settleNextInstant());
  expect(steps[1]).toBe(steps[0]);expect(steps[2]).toBe(steps[0]);
  // Direct snapshots avoid the fixture's memoized snapshot after direct stepping.
  const s=a.run.snapshot();for(const run of [repeat.run,restored]){expect(run.snapshot()).toEqual(s);bytes(a.run.save(),run.save());bytes(a.run.runIdentity(),run.runIdentity());bytes(a.run.decisionHistory(),run.decisionHistory());bytes(a.run.decisionPresentation(),run.decisionPresentation());}
  if(!steps[0])break;clocks.push(s.clock);
 }
 expect(a.run.snapshot().clock).toBe(101n);
 console.info('M105 CONTINUATION PASS9 -> '+clocks.join(',')+';state/output/trace/save/identity/history/player exact;exhausted');
},570000);
