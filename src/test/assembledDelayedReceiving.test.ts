import {it,expect} from 'vitest';
// @ts-expect-error Node evidence IO.
import {writeFileSync,readFileSync} from 'node:fs';
// @ts-expect-error Lossless evidence.
import {deflateSync,inflateSync} from 'node:zlib';
// @ts-expect-error Hashing.
import {createHash} from 'node:crypto';
import {fixture,rec,f,uint,items,key,decode,enc,list,text,q,outputs,set,sid,type CanonicalValue} from './fixtures/assembledProspectionCurrent';
import {prepareCharacterModel} from '../assembled/character';
import {compileDescribedReasons} from '../assembled/reasons';
import {cognitiveRecord as r} from '../assembled/codecs';
import {readQ,bounded} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {compileDelayedModel,compileDelayedInputs,delayedRecipe,OPTIONS} from '../campaign3/delayedModel';
import {createDelayedRuntime} from '../campaign3/delayedRuntime';
import {cases,ordered,initialState,seed} from './delayedFixtures';
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),zip=(v:CanonicalValue)=>{const b=enc(v);return {hash:hash(b),bytes:b.length,deflate:deflateSync(b).toString('base64')};};
const records=(xs:readonly CanonicalValue[],n:bigint)=>xs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n).map(v=>rec(v,n));
it('family265 exact original delayed grounds meet current reference receiving',async()=>{
 const b=fixture('available');await prepareCharacterModel(b.s);
 const defs=items(items(decode(b.s.registry),'list')[0],'set'),definition=defs.find(v=>key(f(rec(v,171n),1n))===key(sid(1027,'definition/task-reason-dice')))!;
 expect(definition,'actual current admitted task dice').toBeDefined();const dice=f(rec(definition,171n),4n),threshold=readQ(f(rec(dice,437n),2n));
 const witness=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M264_EVIDENCE.json','utf8'))['corrected-strength-unavailable-3'],captured=new Uint8Array(inflateSync(Uint8Array.from(atob(witness.outputs.deflate),c=>c.charCodeAt(0)))),template=rec(f(rec(f(outputs(captured,409n)[0],3n),408n),2n),403n);
 const comparisons:[keyof ReturnType<typeof cases>,number][]=[['main',1],['main',2],['main',3],...(['delay2','delay4','cost','uncertain','unknown','unavailable','absentOffer','immediateLarge'] as const).map(n=>[n,1] as [typeof n,number])];
 const evidence:Record<string,unknown>={scope:'Component receiving comparison, not native delayed integration',reference:{rules:b.s.rulesVersion,registry:b.s.registrySchemaVersion,registryHash:hash(b.s.registry),dice:zip(dice),threshold:threshold.numerator+'/'+threshold.denominator,coverage:'SourceCoverage',rounding:true},comparisons:[]};
 const rows:unknown[]=[];
 for(const [name,law] of comparisons){
  const source=delayedRecipe(law),m=await compileDelayedModel(source),d=ordered(cases()[name]),input=await compileDelayedInputs(m,initialState,d,seed),run=createDelayedRuntime(m,input);
  for(let n=0;await run.settle();n++)expect(n).toBeLessThan(16);
  const snap=run.snapshot(),app=records(snap.outputs,1386n)[1],raw=records(snap.outputs,1388n)[1],old=records(snap.outputs,1389n)[1],decision=records(snap.outputs,1390n)[1],signals=items(f(raw,3n),'list');
  // The pure compiler reads these exact original source keys/strengths/bases. This
  // envelope uses captured current metadata only (fields1/2/4); the compiler
  // consumes the unchanged original descriptions. Never a psychological run input.
  const descriptions=signals.map(s=>list([text('primary'),sid(1040,'Commitment'),s]));
  const envelope=r(403,[f(template,1n),f(template,2n),set(signals),f(template,4n),set([]),list(descriptions)],3);
  const current=compileDescribedReasons(envelope,dice,3,'SourceCoverage',true,true);
  if(name==='main'){expect(f(app,5n)).toEqual(q(1,8));expect(f(app,6n)).toEqual(q(1,law===2?1:2));if(law===1)expect(f(decision,7n)).toEqual(OPTIONS[1]);expect(items(f(old,3n),'list')).toHaveLength(2);expect(current.nuclei).toHaveLength(law===2?1:0);}
  if(name==='immediateLarge')expect(current.nuclei).toHaveLength(1);
  else if(law!==2)expect(current.nuclei).toHaveLength(0);
  const row={name,law,originalInputs:hash(d),source:{parameters:hash(source.parameters),content:hash(source.content),registry:hash(source.registry)},now:key(f(app,5n)),later:key(f(app,6n)),originalNuclei:items(f(old,3n),'list').length,currentNuclei:current.nuclei.length,chosen:key(f(decision,7n)),receiving:zip(list([envelope,current.report,list(current.nuclei)])),state:zip(snap.state.canonicalValue()),outputs:zip(list(snap.outputs)),trace:zip(list(snap.trace)),save:hash(run.save()),classification:name==='absentOffer'?'Equivalent zero motivation':name==='immediateLarge'?'Interaction: positive immediate survives; discounted later rejects':'Law/calibration conflict: original positive autonomous ground rejected'};
  rows.push(row);evidence.comparisons=rows;writeFileSync('docs/planning/ASSEMBLED_CHARACTER_M265_EVIDENCE.json',JSON.stringify(evidence,null,2)+'\n');
 }
 const upper=Q.of(1n,2n),boundedUpper=bounded(upper);expect(threshold.compare(boundedUpper)).toBeGreaterThan(0);
 const bounds=[];for(let d=1;d<=4;d++){const h=Q.of(1n,BigInt(1+d)),e=Q.of(1n,2n**BigInt(d));expect(h.compare(upper)).toBeLessThanOrEqual(0);expect(e.compare(upper)).toBeLessThanOrEqual(0);bounds.push({delay:d,hyperbolic:h.numerator+'/'+h.denominator,exponential:e.numerator+'/'+e.denominator});}
 evidence.bound={proof:'amount<=1, probability<=1, cost>=0 imply later<=discount<=1/2; monotone x/(1+x)<=1/3<actual activation threshold, absent modifiers',bounds,maximumBounded:boundedUpper.numerator+'/'+boundedUpper.denominator};
 evidence.result='REQUIRES explicit reference-law/activation resolution; no producer or calibration changed';
 writeFileSync('docs/planning/ASSEMBLED_CHARACTER_M265_EVIDENCE.json',JSON.stringify(evidence,null,2)+'\n');
 console.info('M26511 original runs; current threshold'+threshold.numerator+'/'+threshold.denominator+'; Hyperbolic/Exponential main2 ->0 active nuclei; legal later domain bounded<=1/3; preserved original delayed execution PASS');
},290000);

it('family265 global activation candidate preserves positive grounds and exposes its tradeoff',()=>{
 const path='docs/planning/ASSEMBLED_CHARACTER_M265_EVIDENCE.json',e=JSON.parse(readFileSync(path,'utf8'));
 const unzip=(v:{deflate:string})=>new Uint8Array(inflateSync(Uint8Array.from(atob(v.deflate),c=>c.charCodeAt(0))));
 const dice=rec(decode(unzip(e.reference.dice)),437n),candidate=r(437,[f(dice,1n),q(0,1),f(dice,3n),f(dice,4n)]),rows=[];
 for(const row of e.comparisons){const packet=items(decode(unzip(row.receiving)),'list')[0],out=compileDescribedReasons(packet,candidate,3,'SourceCoverage',true,true);expect(out.nuclei).toHaveLength(row.originalNuclei);rows.push({name:row.name,law:row.law,current:row.currentNuclei,candidate:out.nuclei.length,report:zip(list([out.report,list(out.nuclei)]))});}
 const earlier=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M264_EVIDENCE.json','utf8'))['available-3'],raw=rec(f(rec(f(outputs(unzip(earlier.outputs),409n)[0],3n),408n),2n),403n),old=compileDescribedReasons(raw,dice,3,'SourceCoverage',true,true),next=compileDescribedReasons(raw,candidate,3,'SourceCoverage',true,true);
 expect(old.nuclei).toHaveLength(0);expect(next.nuclei).toHaveLength(2);
 e.candidate={scope:'Diagnostic only; not admitted, adopted or implemented',threshold:'0/1',otherCalibrationUnchanged:true,zeroBaseStillRejected:true,comparisons:rows,priorNull:{current:old.nuclei.length,candidate:next.nuclei.length,packet:zip(raw),report:zip(list([next.report,list(next.nuclei)]))},tradeoff:'Reopens global weak-motive/subthreshold distinctions; cannot be a delayed-only override'};
 writeFileSync(path,JSON.stringify(e,null,2)+'\n');console.info('M265 candidate activation0 restores all11 original positive-ground counts; preserved M264 null changes0 ->2 nuclei; no reference change');
});
