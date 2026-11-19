/** M173 finite original68 replay; production candidate ba92eef0/rules0.126. */
import {it,expect} from 'vitest';
// @ts-ignore Node-only receipt files, never production imports.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-ignore Test-only lossless byte hashes; no simulation math.
import {createHash} from 'node:crypto';
import {definingMeaningCases} from '../campaign3/definingMeaning';
import {retainSignificanceFirst,retainSharedProtectionTier} from '../campaign3/significanceFirstRetention';
import {retainWithUseProtection} from '../campaign3/useProtectedRetention';
import {retainByRecency} from '../campaign3/recencyRetention';
import {presentationAccessibility} from '../campaign3/encodingAccessMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {characterModelIdentity} from '../assembled/character';
import {GOAL_MEANING,meaningValue} from '../assembled/goalMeaning';
import {REPORTED_MEANING} from '../assembled/reportedMeaning';
import {RETAINED_ATTRIBUTION} from '../assembled/retainedAttribution';
import {ATTRIBUTION_USE,FINAL_RECALL,isFinalQuery} from '../assembled/rehearsal';
import {directions,named} from '../assembled/significance';
import {POSITION_ACCESS,positionHistory} from '../assembled/positionPresentation';
import {isPositionEpisodePath,isBodyEpisodePath,POSITION_EPISODE,MEMORY_RECALL} from '../assembled/memory';
import {start172,live172,memory172,positions172,acquired172,final172} from './assembledEarlyDefining.test';
import {through,finish,reports,report,type Run} from './assembledDefining.test';
import {items,key,enc,list,decode} from './fixtures/assembledDefiningControls';
import {text,signed,u,rec,f,outputs,uint,type CanonicalValue} from './fixtures/assembledDefining';
const sha=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex') as string;
const cases=definingMeaningCases(),artifact='docs/planning/ASSEMBLED_CHARACTER_M173_CASES.json';
const sourceIds:Record<string,number>={'24':2,'35':3,'60':6,'71':7,'94':10,'105':11,'128':14,'139':15};
const id=(v:CanonicalValue)=>(items(v,'list')[1] as {payload:{value:bigint}}).payload.value;
const t=(v:CanonicalValue)=>(v as {value:bigint}).value;
function qualification(v:CanonicalValue){
 const str=(name:string)=>(named(v,name) as {value:string}).value,kind=str('kind');
 if(kind==='Qualifies')return {kind,direction:str('direction')};
 if(kind==='DoesNotQualify')return {kind,reason:str('reason')};
 const assessment=named(v,'assessment'),reason=str('reason');
 return key(named(assessment,'kind'))===key(text('Unavailable'))?{kind,reason,cause:(named(assessment,'reason') as {value:string}).value}:{kind,reason};
}
function retain(r:Run,law:string,capacity:number){
 const before=memory172(r),rows=before.map(e=>{const a=items(e.value,'list'),event=isPositionEpisodePath(e.path);return {id:id(e.value),kind:event?'EventContinuant' as const:'Interoceptive' as const,acquiredAt:t(a[5]),units:[{key:'episode',views:[enc(e.value)],useProtection:a[event?9:6] as boolean,outcomeSignificanceDirections:event?directions(a[7]):[]}]};});
 const kernel=law==='SignificanceFirst'?retainSignificanceFirst:law==='SharedProtection'?retainSharedProtectionTier:law==='UseOnly'?retainWithUseProtection:retainByRecency;
 return kernel(rows,37n,{EventContinuant:capacity,Interoceptive:8}).acquisitions.map(v=>v.id.toString()).sort();
}
function audit(r:Run,at:number){
 return outputs(r.snapshot().trace,160n).filter(v=>key(f(rec(f(v,4n),130n),2n))===key(signed(at)));
}
function writeAttempt(record:Record<string,unknown>){
 const data=existsSync(artifact)?JSON.parse(readFileSync(artifact,'utf8')):{version:'assembled-defining-final/0.1',candidate:'ba92eef0',rules:'0.126-candidate',attempts:[]};
 if(data.candidate!=='ba92eef0'||data.rules!=='0.126-candidate')throw Error('M173 candidate mismatch');
 data.attempts.push(record);writeFileSync(artifact,JSON.stringify(data,(_k,v)=>typeof v==='bigint'?String(v):v,2)+'\n');
}
expect(cases).toHaveLength(68);
for(const [index,spec] of cases.entries())it('defining173 '+String(index).padStart(2,'0')+' '+spec.goal+' '+spec.law,async()=>{
 const name='CASE_'+String(index).padStart(2,'0')+'.json',goldBytes=readFileSync('docs/planning/defining-native-cohort-rev1/'+name),gold=JSON.parse(goldBytes.toString('utf8'));
 expect(spec).toEqual(gold.spec);
 const receipt:Record<string,unknown>={index,spec,originalReceipt:sha(goldBytes),candidate:'0.126-candidate',status:'RUNNING'};
 let run:Run|undefined;const started=Date.now();
 try{
  const a=await start172({goal:spec.goal,law:spec.law,rehearsals:spec.rehearsals,capacity:spec.capacity,horizon:spec.now,cue:spec.cue,report:spec.report,worldAfter:spec.worldAfter});run=a.run;
  receipt.model=sha(characterModelIdentity(a.m));receipt.run=sha(run.runIdentity());receipt.initial=sha(a.b.d.initialState);receipt.inputs=sha(a.b.d.orderedInputs);
  await through(run,21n);const historic=live172(run,spec.goal),historical=qualification(historic[5]);expect(historical).toEqual(gold.historical);receipt.historical=historical;
  const source=positions172(run).map(e=>({acquiredAt:acquired172(e),acquisition:String(id(e.value)),significance:directions(items(e.value,'list')[7]),used:items(e.value,'list')[9]}));receipt.acquired=source;
  expect(source.map(x=>x.acquiredAt).sort((a,b)=>a-b)).toEqual(Object.values(sourceIds));
  console.info('M173 case'+index+' historical PASS '+JSON.stringify(historical)+'; actual early3 and16 consumed.');
  const rehearsals:unknown[]=[];
  for(const at of [34,35,36]){
   await through(run,BigInt(at));const uses=reports(run,ATTRIBUTION_USE).filter(v=>key(v[1])===key(signed(at)));
   expect(uses).toHaveLength(spec.rehearsals?16:0);
   if(spec.rehearsals){const attribution=report(run,RETAINED_ATTRIBUTION,at),result=named(attribution[4],'result');expect(named(result,'disposition')).toEqual(text('Supported'));expect(items(named(result,'consumed'),'list')).toHaveLength(16);expect(items(attribution[2],'list')[3]).toEqual(signed(4));for(const use of uses)expect(use[4]).toEqual(list(attribution));}
   rehearsals.push({at,consumed:uses.length});
  }
  receipt.rehearsals=rehearsals;
  const expected=retain(run,spec.law,spec.capacity);
  await through(run,37n);const retained=memory172(run);expect(retained.map(e=>String(id(e.value))).sort()).toEqual(expected);expect(retained.filter(e=>isBodyEpisodePath(e.path))).toHaveLength(8);
  const eventTimes=positions172(run).map(acquired172).sort((a,b)=>a-b),mapped=gold.retainedEvents.map((v:string)=>sourceIds[v]).sort((a:number,b:number)=>a-b);expect(eventTimes).toEqual(mapped);receipt.retained=eventTimes;
  const beforeReport=enc(list(retained.map(e=>e.value)));
  await through(run,38n);expect(sha(enc(list(memory172(run).map(e=>e.value))))).toBe(sha(beforeReport));const currentRow=report(run,REPORTED_MEANING,38),current=qualification(currentRow[5]);expect(current).toEqual(gold.current);receipt.current=current;receipt.currentEvidence=sha(enc(currentRow[4]));
  console.info('M173 case'+index+' retention/current PASS '+JSON.stringify({retained:eventTimes,current}));
  const before=positions172(run),priorById=new Map(before.map(e=>[id(e.value).toString(),e.value]));
  const scores=before.map(e=>{const acquiredAt=BigInt(acquired172(e)),acquisition=id(e.value),history=positionHistory(e.value),base=presentationAccessibility(history,BigInt(spec.now),Q.of(1n),1);return {acquisition,acquiredAt,base,pull:Q.of(1n),score:base.add(Q.of(1n))};});
  await through(run,BigInt(spec.now));const selected=final172(run,spec.now);expect(selected).toEqual(gold.selected.map((v:string)=>sourceIds[v]));expect(selected.length).toBeLessThanOrEqual(1);
  const final=report(run,FINAL_RECALL,spec.now);expect(final[3]).toEqual(text(spec.cue==='absent'?'Absent':'Present'));expect(final[4]).toEqual(u(1));
  const traces=audit(run,spec.now),query=traces.filter(v=>{const e=rec(f(v,4n),130n);return key(f(e,5n))===key(MEMORY_RECALL)&&isFinalQuery(f(e,6n));});expect(query).toHaveLength(1);
  const reads=items(f(query[0],11n),'list');expect(reads).toHaveLength(spec.cue==='absent'?0:before.length);
  for(const read of reads){const path=rec(f(rec(read,147n),2n),140n);expect(f(path,1n)).toEqual(u(346));expect(f(path,2n)).toEqual(u(1));}
  if(spec.cue==='matching'){const access=report(run,POSITION_ACCESS,spec.now);expect(access[2]).toEqual(text('PresentationFrequency'));expect(access[3]).toEqual(meaningValue(scores));}
  else expect(reports(run,POSITION_ACCESS).filter(v=>key(v[1])===key(signed(spec.now)))).toHaveLength(0);
  for(const e of positions172(run)){
   const old=priorById.get(id(e.value).toString())!,a=items(old,'list'),b=items(e.value,'list');expect(b.slice(0,10)).toEqual(a.slice(0,10));
   expect(positionHistory(e.value)).toEqual([...positionHistory(old),...(selected.includes(acquired172(e))?[BigInt(spec.now)]:[])]);
  }
  receipt.selected=selected;receipt.retainedButUnselectedEarly=eventTimes.includes(3)&&!selected.includes(3);
  receipt.access=scores.map(v=>({acquiredAt:v.acquiredAt,acquisition:v.acquisition,base:v.base.numerator+'/'+v.base.denominator,pull:'1/1',score:v.score.numerator+'/'+v.score.denominator,priorPresentations:positionHistory(priorById.get(v.acquisition.toString())!)}));
  receipt.finalReads=reads.length;receipt.episodic=sha(enc(list(memory172(run).map(e=>e.value))));
  await finish(run);const end=run.snapshot();expect(end.clock).toBe(5001n);expect(run.diagnostic()).toBeUndefined();
  receipt.final={clock:String(end.clock),state:sha(end.state),outputs:sha(end.outputs),trace:sha(end.trace),stateBytes:end.state.length,outputBytes:end.outputs.length,traceBytes:end.trace.length};
  receipt.status='PASS';receipt.classification='Equivalent in pinned semantic correspondence';receipt.elapsedMs=Date.now()-started;writeAttempt(receipt);
  console.info('M173 CASE PASS '+JSON.stringify({index,historical,current,retained:eventTimes,selected,elapsedMs:receipt.elapsedMs}));
 }catch(error){
  receipt.status='FAIL';receipt.error=error instanceof Error?error.message:String(error);receipt.elapsedMs=Date.now()-started;
  if(run){const s=run.snapshot();receipt.failedAt={clock:String(s.clock),state:sha(s.state),outputs:sha(s.outputs),trace:sha(s.trace)};}
  writeAttempt(receipt);throw error;
 }
},290000);
