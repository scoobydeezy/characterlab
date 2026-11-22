import {it,expect} from 'vitest';
// @ts-expect-error Node-only lossless evidence compression.
import {deflateSync,inflateSync} from 'node:zlib';
// @ts-expect-error Node-only test receipt IO; browser project has no Node declarations.
import {createHash} from 'node:crypto';
// @ts-expect-error Node-only test receipt IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {cohort as fixture,start,cases,caseKey,main,state,decode,items,key,enc,list,text,u,C,rec,f,uint,at,type Case,type Run} from './fixtures/assembledIntoxicationCohort';
import {restorePreparedCharacterRun,characterModelIdentity} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {sid,SKILL_ACTUAL,SKILL_UPDATE} from '../assembled/skill';
import {OPPORTUNITY_RESULT} from '../assembled/externalObstruction';
import {ACTION_BODY} from '../assembled/actionBody';
import {MOTOR,sleepAnchor,sleepPath,SLEEP_SAMPLE,SLEEP_RECEIPT,READINESS} from '../assembled/sleepControl';
import {CONTROL_VIEW,controlGoalPath,maintenancePath} from '../assembled/control';
import {habitJournal,habitPath,rewardPath,rewardValue,OBSERVED_REWARD} from '../assembled/habit';
import {REWARD_RECEIPT} from '../assembled/rewardExperience';
import {PROTECTION_CHANNEL,PROTECTION} from '../assembled/protectiveIdentity';
import {identityJournal,journalPath,qualificationParts} from '../assembled/identityEligibility';
import {formationPath,formationValue} from '../assembled/formation';
import {EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
import {cognitiveRecord as r} from '../assembled/codecs';
import {readQ} from '../campaign2/cognitiveMath';
import {CanonicalValue} from '../substrate/canonicalEncoding';
export const file='docs/planning/ASSEMBLED_CHARACTER_M217_EVIDENCE.json';
export const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),vh=(v:CanonicalValue)=>hash(enc(v));
export const eqbytes=(a:Uint8Array,b:Uint8Array)=>{expect(a.length).toBe(b.length);expect(a.every((v,i)=>v===b[i])).toBe(true);};
export const tag=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='list'&&typeof v.items[0]!=='boolean'&&v.items[0]?.kind==='text'?v.items[0].value:undefined;
const tagged=(out:readonly CanonicalValue[],name:string)=>out.filter(v=>tag(v)===name).map(v=>items(v,'list'));
const records=(out:readonly CanonicalValue[],type:bigint)=>out.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
const rational=(v:CanonicalValue)=>{const a=readQ(v);return a.numerator+'/'+a.denominator;};
const positive=key(sid(1027,'definition/protocol-contact-one'));
const action=(v:CanonicalValue)=>key(f(rec(v,395n),2n))===positive?'drug':'withhold';
const jp=journalPath(r(412,[C,PROTECTION_CHANNEL],2));
export const privateTags=new Set([MOTOR,'assembled-tolerance-effect/0.1','assembled-reward-experience/0.1/physical','assembled-action-body/0.1','assembled-action-body-receipt/0.1',SKILL_ACTUAL,SKILL_UPDATE,'execution-opportunity-result/0.1','external-obstruction-result/0.1','assembled-regulatory-stress/0.1/applied']);
const observerOutput=(v:CanonicalValue)=>!privateTags.has(tag(v)??'')&&!(typeof v!=='boolean'&&v.kind==='record'&&[433n,454n,457n].includes(v.schema.typeId));
export function safe(run:Run,out:readonly CanonicalValue[]){return enc(list([list(out.filter(observerOutput)),decode(run.decisionHistory()),decode(run.decisionPresentation())]));}
function normalizeStoredStream(compressed:string){const a=items(decode(inflateSync(Uint8Array.from(atob(compressed),c=>c.charCodeAt(0)))),'list');return enc(list([list(items(a[0],'list').filter(observerOutput)),...a.slice(1)]));}
function capture(run:Run,logical:number,allowNoReasons=false){
 const snap=run.snapshot(),out=items(decode(snap.outputs),'list'),now=BigInt(logical+1),s=state(run),cv=tagged(out,CONTROL_VIEW).find(a=>uint(a[1])===now)!;
 expect(cv,'live current control').toBeDefined();const rd=items(cv.find(v=>tag(v)===READINESS)!,'list'),sample=items(items(rd[4],'list')[3],'list'),axes=items(sample[4],'list').map(v=>{const x=items(v,'list');return x.length?Number(uint(x[0])):null;});
 const d=records(out,409n).find(v=>at(f(v,2n))===now)!;expect(d,'actual decision').toBeDefined();const result=rec(f(d,4n),419n);const outcome=uint(f(result,1n));expect(outcome).toBe(allowNoReasons?2n:3n);const chosen=outcome===3n?rec(f(result,2n),420n):undefined,context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),pool=rec(f(raw,2n),398n);
 if(allowNoReasons){expect(items(f(context,3n),'list')).toHaveLength(0);expect(items(f(pool,3n),'list').map(v=>action(f(rec(v,397n),1n)))).toEqual(['withhold']);}
 const reward=rewardValue(s.read(rewardPath(C)).value,EXTENDED_TIME_LIMIT,'observed'),journal=identityJournal(s.read(jp).value),formed=formationValue(s.read(formationPath(C,PROTECTION_CHANNEL)).value,EXTENDED_TIME_LIMIT),physical=sleepAnchor(s.read(sleepPath(C)).value!);
 const motor=tagged(out,MOTOR).find(a=>at(a[2])===now)!;expect(motor,'live physical motor assessment').toBeDefined();const rr=tagged(out,OBSERVED_REWARD+'/reasons').find(v=>uint(v[1])===now);expect(rr).toBeDefined();
 return {logical,sleep:axes,capacity:items(rd[2],'list').length?Number(uint(items(rd[2],'list')[0])):null,inhibited:cv[9],active:cv[2],maintained:cv[3],spare:Number(uint(cv[8])),options:items(f(pool,3n),'list').map(v=>action(f(rec(v,397n),1n))),outcome:outcome===3n?'Chosen':'NoReasons',chosen:chosen?action(f(chosen,1n)):null,probabilities:(chosen?items(f(chosen,2n),'list'):[]).map(v=>{const p=rec(v,421n);return {action:action(f(p,1n)),p:rational(f(p,2n))};}),draws:vh(chosen?f(chosen,9n):list([])),drawCount:chosen?items(f(chosen,9n),'list').length:0,journal:vh(s.read(jp).value??list([])),journalCount:journal.length,identity:formed.P.numerator+'/'+formed.P.denominator,formation:vh(s.read(formationPath(C,PROTECTION_CHANNEL)).value??list([])),learned:vh(list([s.read(habitPath(C)).value??list([]),s.read(rewardPath(C)).value??list([])])),mean:reward?.mean===undefined?null:Number(reward.mean),physicalDebt:physical.debt,physicalBurden:physical.burden,challenge:Number(uint(motor[4])),competence:Number(uint(motor[5])),motorAllowed:motor[6],goal:vh(s.read(controlGoalPath(C)).value??list([])),maintenance:vh(s.read(maintenancePath(C)).value??list([])),rewardReason:rational(rr![5])};
}
async function runCase(c:Case){
 const began=performance.now(),x=await start(fixture(c)),prefixes:number[]=c.law==='Full'&&c.seed===0&&main.includes(c.scenario as never)?[0,2,7,8,10,11]:[0],rows:ReturnType<typeof capture>[]=[],checks:any[]=[];let pending:Run|undefined,pendingRow:any;
 expect(key(items(items(decode(x.b.s.registry),'list')[57],'list')[1])).toBe(positive);console.info('M217 START',caseKey(c));
 for(let native=1;native<=13;native++){
  expect(await x.run.settleNextInstant()).toBe(true);expect(x.run.snapshot().clock).toBe(BigInt(native));
  if(pending){expect(await pending.settleNextInstant()).toBe(true);const a=x.run.save(),b=pending.save();eqbytes(a,b);pendingRow.next=hash(a);pending=undefined;}
  if(native>=2){const row=capture(x.run,native-1,false);rows.push(row);
   if(native===2){expect(row.mean).toBe(600);expect(row.journalCount).toBe(0);expect(row.chosen).toBe('drug');}
   if(native===3){expect(row.journalCount).toBe(1);expect(row.identity).not.toBe('0/1');expect(row.drawCount).toBeGreaterThan(0);expect(row.options.sort()).toEqual(['drug','withhold']);expect(row.inhibited).toBe(false);}
   if(native>3){expect(row.journal).toBe(rows[1].journal);expect(row.formation).toBe(rows[1].formation);expect(row.learned).toBe(rows[0].learned);expect(row.mean).toBe(600);}
  }
  if(prefixes.includes(native-1)){const save=x.run.save();pending=cachedMemory(await restorePreparedCharacterRun(x.handle,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));eqbytes(save,pending.save());pendingRow={logical:native-1,native,bytes:save.length,save:hash(save),terminal:false};checks.push(pendingRow);}
 }
 expect(pending).toBeUndefined();const out=items(decode(x.run.snapshot().outputs),'list'),safeBytes=safe(x.run,out);
 const physical=tagged(out,OPPORTUNITY_RESULT).map(p=>{const outcome=records(out,433n).find(o=>key(f(o,1n))===key(p[2]))!;expect(outcome).toBeDefined();const attempt=rec(f(outcome,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n),d=rec(f(intent,2n),409n),logical=Number(at(f(d,2n)))-1,body=tagged(out,ACTION_BODY).find(b=>key(b[1])===key(p[2]))!;expect(body).toBeDefined();expect(p[5]).toBe(c.scenario!=='Interference');return {logical,available:p[5],status:(body[5] as {value:string}).value,chosen:action(f(rec(f(rec(f(d,4n),419n),2n),420n),1n))};});
 expect(physical.map(p=>p.logical)).toEqual([8,9,10,11,12]);for(const p of physical)expect(p.status).toBe(p.chosen==='drug'?(c.scenario==='Interference'||!rows[p.logical-1].motorAllowed?'Blocked':'Applied'):'Withheld');
 for(const a of tagged(out,SKILL_ACTUAL)){expect(rational(a[4])).toBe('0/1');expect(rational(a[5])).toBe('0/1');expect(a[8]).toBe(false);}

 for(const logical of [8,9,10,11,12]){const v=rows[logical-1];expect(v.active).toBe(true);expect(v.spare).toBeGreaterThanOrEqual(1);expect(v.mean).toBe(600);}
 let closure=0;while(await x.run.settleNextInstant()){expect(++closure).toBeLessThanOrEqual(4);expect(x.run.snapshot().clock).toBeLessThanOrEqual(101n);}
 const save=x.run.save(),restored=await restorePreparedCharacterRun(x.handle,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save});eqbytes(save,restored.save());expect(await restored.settleNextInstant()).toBe(false);eqbytes(save,restored.save());
 checks.push({logical:12,native:Number(x.run.snapshot().clock),bytes:save.length,save:hash(save),next:hash(save),terminal:true});
 const result={...c,key:caseKey(c),model:hash(characterModelIdentity(x.handle)),input:hash(x.b.d.orderedInputs),initial:hash(x.b.d.initialState),run:hash(x.run.runIdentity()),rows,physical,decisions:hash(x.run.decisionHistory()),presentation:hash(x.run.decisionPresentation()),prefixes:checks,safe:hash(safeBytes),safeBytes:safeBytes.length,safeCompressed:['Sober','BlindSober','BlindSlow','Interference'].includes(c.scenario)&&c.seed===0&&c.law==='Full'?deflateSync(safeBytes).toString('base64'):undefined,closureInstants:closure,terminalClock:Number(x.run.snapshot().clock),elapsed:(performance.now()-began)/1000};
 const data=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{contract:'assembled-intoxication-cohort/0.1',candidate:'0.143',runs:{}};data.runs??={};expect(data.runs[result.key],'do not silently overwrite a passing cohort case').toBeUndefined();data.runs[result.key]=result;writeFileSync(file,JSON.stringify(data,null,2)+'\n');
 console.info('M217 PASS',result.key,checks.length,'prefixes; safe bytes',safeBytes.length,'seconds',result.elapsed.toFixed(3),'probe8',JSON.stringify(rows[7]));return result;
}
for(const c of cases)it('cohort217 '+caseKey(c),()=>runCase(c),600000);

it('compare217 full original intoxication gate',()=>{
 const whole=JSON.parse(readFileSync(file,'utf8')),runs=whole.runs as Record<string,Awaited<ReturnType<typeof runCase>>>;expect(Object.keys(runs).sort()).toEqual(cases.map(caseKey).sort());const get=(s:string,seed=0,law='Full')=>runs[law+'/'+s+'/'+seed],row=(s:string,t:number,seed=0,law='Full')=>get(s,seed,law).rows[t-1];
 const prefixes=Object.values(runs).flatMap(x=>x.prefixes);expect(prefixes).toHaveLength(55);expect(prefixes.filter(x=>x.terminal)).toHaveLength(20);expect(new Set(Object.values(runs).map(x=>x.model)).size).toBe(5);
 for(const r of Object.values(runs)){expect(r.rows[1].probabilities).toEqual([{action:'drug',p:'1/2'},{action:'withhold',p:'1/2'}]);for(const v of r.rows.slice(2)){expect(v.active).toBe(true);expect(v.maintained).toBe(true);expect(v.mean).toBe(600);expect(v.journal).toBe(r.rows[1].journal);expect(v.formation).toBe(r.rows[1].formation);expect(v.learned).toBe(r.rows[0].learned);}}
 for(let seed=0;seed<4;seed++){
  for(let t=1;t<=12;t++)for(const name of ['Slow','Fast']){expect(row(name,t,seed).learned).toBe(row('Sober',t,seed).learned);expect(row(name,t,seed).journal).toBe(row('Sober',t,seed).journal);expect(row(name,t,seed).goal).toBe(row('Sober',t,seed).goal);}
  const before=row('Slow',7,seed),soberBefore=row('Sober',7,seed);expect(before.chosen).toBe(soberBefore.chosen);expect(before.probabilities).toEqual(soberBefore.probabilities);expect(before.draws).toBe(soberBefore.draws);expect(before.challenge).toBe(0);expect(before.physicalBurden).toBe(800);
  const a=[8,9,10,11,12].map(t=>row('Slow',t,seed));expect(a.map(v=>v.sleep[2])).toEqual([700,600,500,400,300]);expect(a.map(v=>v.challenge)).toEqual([350,300,250,200,150]);expect(a.map(v=>v.capacity)).toEqual([650,700,750,800,850]);expect(a.map(v=>v.motorAllowed)).toEqual([false,false,true,true,true]);expect(a.map(v=>v.inhibited)).toEqual([false,false,false,true,true]);
  for(const name of main)for(const t of [8,9,10,11,12]){const r=row(name,t,seed);expect([r.sleep[0],r.sleep[1],r.sleep[3]]).toEqual([0,0,500]);}
  expect(row('Fast',8,seed)).toMatchObject({capacity:800,challenge:200,motorAllowed:true,inhibited:true});expect(row('Sober',8,seed).inhibited).toBe(true);expect(row('Slow',8,seed).probabilities).not.toEqual(row('Sober',8,seed).probabilities);
 }
 for(const name of main){const a=row(name,8,0,'NoControl'),b=row('Sober',8,0,'NoControl');expect(a.inhibited).toBe(false);expect(a.probabilities).toEqual(b.probabilities);expect(a.draws).toBe(b.draws);expect(a.chosen).toBe(b.chosen);}
 expect(get('Slow',0,'NoControl').physical[0]).toMatchObject({chosen:'drug',status:'Blocked'});expect(get('Fast',0,'NoControl').physical[0]).toMatchObject({chosen:'drug',status:'Applied'});
 const low=row('Slow',8,1),high=row('HighCompetence',8,1);expect(high.chosen).toBe(low.chosen);expect(high.probabilities).toEqual(low.probabilities);expect(high.draws).toBe(low.draws);expect(get('Slow',1).physical[0]).toMatchObject({chosen:'drug',status:'Blocked'});expect(get('HighCompetence',1).physical[0]).toMatchObject({chosen:'drug',status:'Applied'});
 const stream=(name:string)=>normalizeStoredStream(get(name).safeCompressed!);eqbytes(stream('BlindSober'),stream('BlindSlow'));expect(row('BlindSlow',8)).toMatchObject({capacity:null,motorAllowed:false,physicalBurden:700});expect(row('BlindSober',8).motorAllowed).toBe(true);
 expect(row('FalseSober',8)).toMatchObject({capacity:1000,inhibited:true,physicalBurden:700,motorAllowed:false});eqbytes(stream('Interference'),stream('Sober'));for(const p of get('Interference').physical){expect(p.available).toBe(false);expect(p.chosen).toBe('withhold');expect(p.status).toBe('Withheld');}
 expect(whole.boundary?.fixedMask?.pass).toBe(true);expect(whole.boundary?.fixedLearning?.pass).toBe(true);
 const learningStream=items(decode(inflateSync(Uint8Array.from(atob(whole.boundary.fixedLearning.observer.deflate),c=>c.charCodeAt(0)))),'list'),learningReason=tagged(items(learningStream[0],'list'),OBSERVED_REWARD+'/reasons').find(v=>uint(v[1])===10n)!;expect(learningReason).toBeDefined();expect(learningReason[2]).toBe(true);expect(rational(learningReason[5])).toBe('3/10');
 whole.qualification={pass:true,originalRuns:20,models:5,selectedPrefixes:55,advancing:35,terminal:20,observerPrivateTags:[...privateTags],blindBytes:stream('BlindSlow').length,interferenceBytes:stream('Interference').length};writeFileSync(file,JSON.stringify(whole,null,2)+'\n');console.info('M217 FULL PASS20 original runs/55 prefixes;5 models; all original comparisons; held history; whole masked and inert observer equality; no whole12.1 acceptance');
});
