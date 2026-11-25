import {replay272,candidate271,track271,failure271} from './fixtures/assembledActivationBody';
import {replay220,candidate220,correspondence220} from './fixtures/assembledEmbodimentReplay';
import {it,expect,afterEach} from 'vitest';
// @ts-expect-error Node-only lossless evidence compression.
import {deflateSync,inflateSync} from 'node:zlib';
// @ts-expect-error Node-only test receipt IO; browser project has no Node declarations.
import {createHash} from 'node:crypto';
// @ts-expect-error Node-only test receipt IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {cases,caseKey,main,type Case} from './fixtures/assembledSleepCohort';
import {currentSleep as historicalFixture,start as originalStart,state,decode,items,key,enc,list,text,u,C,rec,f,uint,at,type Run} from './fixtures/assembledEmbodimentCurrent';
import {restorePreparedCharacterRun,characterModelIdentity} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {sid,SKILL_ACTUAL,SKILL_UPDATE} from '../assembled/skill';
import {OPPORTUNITY_RESULT} from '../assembled/externalObstruction';
import {ACTION_BODY} from '../assembled/actionBody';
import {SLEEP,SLEEP_SOURCE,MOTOR,sleepAnchor,sleepPath,SLEEP_SAMPLE,SLEEP_RECEIPT,READINESS} from '../assembled/sleepControl';
import {CONTROL_VIEW,controlGoalPath,maintenancePath} from '../assembled/control';
import {habitJournal,habitPath,rewardPath,rewardValue,OBSERVED_REWARD as NUMERIC_REWARD} from '../assembled/habit';
import {REWARD_RECEIPT} from '../assembled/rewardExperience';
import {PROTECTION_CHANNEL,PROTECTION} from '../assembled/protectiveIdentity';
import {identityJournal,journalPath,qualificationParts} from '../assembled/identityEligibility';
import {formationPath,formationValue} from '../assembled/formation';
import {EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
import {cognitiveRecord as r} from '../assembled/codecs';
import {readQ} from '../campaign2/cognitiveMath';
import {CanonicalValue} from '../substrate/canonicalEncoding';
const file=replay272?'docs/planning/ASSEMBLED_CHARACTER_M272_SLEEP_EVIDENCE.json':replay220?'docs/planning/ASSEMBLED_CHARACTER_M220_SLEEP_EVIDENCE.json':'docs/planning/ASSEMBLED_CHARACTER_M218_SLEEP_EVIDENCE.json';
const fixture=(...args:Parameters<typeof historicalFixture>)=>replay272?candidate271(historicalFixture(...args),true):candidate220(historicalFixture(...args));
const start=async(...args:Parameters<typeof originalStart>)=>track271(await originalStart(...args));
afterEach(c=>{if(c.task.result?.state==='fail')failure271(c.task.name);});
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),vh=(v:CanonicalValue)=>hash(enc(v));
const eqbytes=(a:Uint8Array,b:Uint8Array)=>{expect(a.length).toBe(b.length);expect(a.every((v,i)=>v===b[i])).toBe(true);};
const tag=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='list'&&typeof v.items[0]!=='boolean'&&v.items[0]?.kind==='text'?v.items[0].value:undefined;
const tagged=(out:readonly CanonicalValue[],name:string)=>out.filter(v=>tag(v)===name).map(v=>items(v,'list'));
const records=(out:readonly CanonicalValue[],type:bigint)=>out.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
const rational=(v:CanonicalValue)=>{const a=readQ(v);return a.numerator+'/'+a.denominator;};
const positive=key(sid(1027,'definition/protocol-contact-one'));
const action=(v:CanonicalValue)=>key(f(rec(v,395n),2n))===positive?'drug':'withhold';
const jp=journalPath(r(412,[C,PROTECTION_CHANNEL],2));
const privateTags=new Set([MOTOR,'assembled-tolerance-effect/0.1','assembled-reward-experience/0.1/physical','assembled-action-body/0.1','assembled-action-body-receipt/0.1',SKILL_ACTUAL,SKILL_UPDATE,'execution-opportunity-result/0.1','external-obstruction-result/0.1','assembled-regulatory-stress/0.1/applied']);
const observerOutput=(v:CanonicalValue)=>!privateTags.has(tag(v)??'')&&!(typeof v!=='boolean'&&v.kind==='record'&&[433n,454n,457n].includes(v.schema.typeId));
function safe(run:Run,out:readonly CanonicalValue[]){return enc(list([list(out.filter(observerOutput)),decode(run.decisionHistory()),decode(run.decisionPresentation())]));}
function normalizeStoredStream(compressed:string){const a=items(decode(inflateSync(Uint8Array.from(atob(compressed),c=>c.charCodeAt(0)))),'list');return enc(list([list(items(a[0],'list').filter(observerOutput)),...a.slice(1)]));}
function capture(run:Run,logical:number,allowNoReasons=false){
 const snap=run.snapshot(),out=items(decode(snap.outputs),'list'),now=BigInt(logical+1),s=state(run),cv=tagged(out,CONTROL_VIEW).find(a=>uint(a[1])===now)!;
 expect(cv,'live current control').toBeDefined();const rd=items(cv.find(v=>tag(v)===READINESS)!,'list'),sample=items(items(rd[4],'list')[3],'list'),axes=items(sample[4],'list').map(v=>{const x=items(v,'list');return x.length?Number(uint(x[0])):null;});
 const d=records(out,409n).find(v=>at(f(v,2n))===now)!;expect(d,'actual decision').toBeDefined();const result=rec(f(d,4n),419n);const outcome=uint(f(result,1n));expect(outcome).toBe(allowNoReasons?2n:3n);const chosen=outcome===3n?rec(f(result,2n),420n):undefined,context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),pool=rec(f(raw,2n),398n);
 if(allowNoReasons){expect(items(f(context,3n),'list')).toHaveLength(0);expect(items(f(pool,3n),'list').map(v=>action(f(rec(v,397n),1n)))).toEqual(['withhold']);}
 const reward=rewardValue(s.read(rewardPath(C)).value,EXTENDED_TIME_LIMIT,'observed'),journal=identityJournal(s.read(jp).value),formed=formationValue(s.read(formationPath(C,PROTECTION_CHANNEL)).value,EXTENDED_TIME_LIMIT),physical=sleepAnchor(s.read(sleepPath(C)).value!);
 const rr=tagged(out,NUMERIC_REWARD+'/reasons').find(v=>uint(v[1])===now);expect(rr).toBeDefined();
 return {logical,sleep:axes,capacity:items(rd[2],'list').length?Number(uint(items(rd[2],'list')[0])):null,inhibited:cv[9],active:cv[2],maintained:cv[3],spare:Number(uint(cv[8])),options:items(f(pool,3n),'list').map(v=>action(f(rec(v,397n),1n))),outcome:outcome===3n?'Chosen':'NoReasons',chosen:chosen?action(f(chosen,1n)):null,probabilities:(chosen?items(f(chosen,2n),'list'):[]).map(v=>{const p=rec(v,421n);return {action:action(f(p,1n)),p:rational(f(p,2n))};}),draws:vh(chosen?f(chosen,9n):list([])),drawCount:chosen?items(f(chosen,9n),'list').length:0,journal:vh(s.read(jp).value??list([])),journalCount:journal.length,identity:formed.P.numerator+'/'+formed.P.denominator,formation:vh(s.read(formationPath(C,PROTECTION_CHANNEL)).value??list([])),learned:vh(list([s.read(habitPath(C)).value??list([]),s.read(rewardPath(C)).value??list([])])),mean:reward?.mean===undefined?null:Number(reward.mean),physicalDebt:physical.debt,goal:vh(s.read(controlGoalPath(C)).value??list([])),maintenance:vh(s.read(maintenancePath(C)).value??list([])),rewardReason:rational(rr![5])};
}
async function runCase(c:Case){
 const began=performance.now(),b=fixture(c),original=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M215_EVIDENCE.json','utf8')).runs[caseKey(c)];const legacy=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(SLEEP_SOURCE)){const p=[...items(a[3],'list')];expect(uint(p.pop()!)).toBe(0n);p[0]=text(SLEEP);a[3]=list(p);}return list(a);});expect(hash(enc(list(legacy))),'exact original scenario inputs after declaration-only normalization').toBe(original.input);expect(hash((replay272?historicalFixture(c):b).d.initialState)).toBe(original.initial);const x=await start(b),prefixes:number[]=c.law==='Full'&&c.seed===0&&main.includes(c.scenario as never)?[0,2,7,8,9]:[0],rows:ReturnType<typeof capture>[]=[],checks:any[]=[];let pending:Run|undefined,pendingRow:any;
 expect(key(items(items(decode(x.b.s.registry),'list')[57],'list')[1])).toBe(positive);console.info('M218 START',caseKey(c));
 for(let native=1;native<=13;native++){
  expect(await x.run.settleNextInstant()).toBe(true);expect(x.run.snapshot().clock).toBe(BigInt(native));
  if(pending){expect(await pending.settleNextInstant()).toBe(true);const a=x.run.save(),b=pending.save();eqbytes(a,b);pendingRow.next=hash(a);pending=undefined;}
  if(native>=2){const row=capture(x.run,native-1,c.scenario==='Unmaintained'&&[11,12].includes(native));rows.push(row);
   if(native===2){expect(row.mean).toBe(600);expect(row.journalCount).toBe(0);expect(row.chosen).toBe('drug');}
   if(native===3){expect(row.journalCount).toBe(1);expect(row.identity).not.toBe('0/1');expect(row.drawCount).toBeGreaterThan(0);expect(row.options.sort()).toEqual(['drug','withhold']);expect(row.inhibited).toBe(false);}
   if(native>3){expect(row.journal).toBe(rows[1].journal);expect(row.formation).toBe(rows[1].formation);expect(row.learned).toBe(rows[0].learned);expect(row.mean).toBe(600);}
  }
  if(prefixes.includes(native-1)){const save=x.run.save();pending=cachedMemory(await restorePreparedCharacterRun(x.handle,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));eqbytes(save,pending.save());pendingRow={logical:native-1,native,bytes:save.length,save:hash(save),terminal:false};checks.push(pendingRow);}
 }
 expect(pending).toBeUndefined();const out=items(decode(x.run.snapshot().outputs),'list'),safeBytes=safe(x.run,out);
 const physical=tagged(out,OPPORTUNITY_RESULT).map(p=>{const outcome=records(out,433n).find(o=>key(f(o,1n))===key(p[2]))!;expect(outcome).toBeDefined();const attempt=rec(f(outcome,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n),d=rec(f(intent,2n),409n),logical=Number(at(f(d,2n)))-1,body=tagged(out,ACTION_BODY).find(b=>key(b[1])===key(p[2]))!;expect(body).toBeDefined();expect(p[5]).toBe(c.scenario!=='FailedExecution');return {logical,available:p[5],status:(body[5] as {value:string}).value,chosen:action(f(rec(f(rec(f(d,4n),419n),2n),420n),1n))};});
 expect(physical.map(p=>p.logical)).toEqual([8,9,12]);for(const p of physical)expect(p.status).toBe(p.chosen==='drug'?(c.scenario==='FailedExecution'?'Blocked':'Applied'):'Withheld');
 for(const a of tagged(out,SKILL_ACTUAL)){expect(rational(a[4])).toBe('0/1');expect(rational(a[5])).toBe('0/1');expect(a[8]).toBe(false);}

 for(const logical of [8,9,12]){const v=rows[logical-1];expect(v.active).toBe(true);expect(v.spare).toBeGreaterThanOrEqual(1);expect(v.mean).toBe(600);}
 let closure=0;while(await x.run.settleNextInstant()){expect(++closure).toBeLessThanOrEqual(4);expect(x.run.snapshot().clock).toBeLessThanOrEqual(101n);}
 const save=x.run.save(),restored=await restorePreparedCharacterRun(x.handle,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save});eqbytes(save,restored.save());expect(await restored.settleNextInstant()).toBe(false);eqbytes(save,restored.save());
 checks.push({logical:12,native:Number(x.run.snapshot().clock),bytes:save.length,save:hash(save),next:hash(save),terminal:true});
 const result={...c,key:caseKey(c),model:hash(characterModelIdentity(x.handle)),input:hash(x.b.d.orderedInputs),initial:hash(x.b.d.initialState),run:hash(x.run.runIdentity()),rows,physical,decisions:hash(x.run.decisionHistory()),presentation:hash(x.run.decisionPresentation()),prefixes:checks,safe:hash(safeBytes),safeBytes:safeBytes.length,safeCompressed:['Recovered','BlindRested','BlindDeprived','FailedExecution'].includes(c.scenario)&&c.seed===0&&c.law==='Full'?deflateSync(safeBytes).toString('base64'):undefined,closureInstants:closure,terminalClock:Number(x.run.snapshot().clock),elapsed:(performance.now()-began)/1000};
 const correspondence=correspondence220('docs/planning/ASSEMBLED_CHARACTER_M218_SLEEP_EVIDENCE.json',result.key,result,true);
 const data=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{contract:'assembled-sleep-cohort/0.1',candidate:replay272?'0.160':replay220?'0.144':'0.143',runs:{}};expect(data.runs[result.key],'do not silently overwrite a passing cohort case').toBeUndefined();data.runs[result.key]={...result,...(correspondence?{correspondence}:{})};writeFileSync(file,JSON.stringify(data,null,2)+'\n');
 if(replay272){
  const priorPath='docs/planning/ASSEMBLED_CHARACTER_M220_SLEEP_EVIDENCE.json',bytes=readFileSync(priorPath),old=JSON.parse(bytes.toString()).runs[result.key],source=historicalFixture(c);
  const receiving=['logical','sleep','capacity','inhibited','active','maintained','spare','options','outcome','chosen','probabilities','draws','drawCount','journalCount','identity','mean','physicalDebt','rewardReason'];
  expect(result.input).toBe(old.input);expect(hash(source.d.initialState)).toBe(old.initial);
  expect(result.rows.length).toBe(old.rows.length);
  for(const [i,row]of result.rows.entries())for(const k of receiving)expect((row as any)[k],result.key+'/'+i+'/'+k+' preserved receiving').toEqual(old.rows[i][k]);
  for(const k of ['physical','closureInstants','terminalClock'] as const)expect(result[k]).toEqual(old[k]);
  expect(result.prefixes.map(p=>[p.logical,p.native,p.terminal])).toEqual(old.prefixes.map((p:any)=>[p.logical,p.native,p.terminal]));
  data.runs[result.key].correspondence={pass:true,prior:priorPath,hash:hash(bytes),receiving,source:{registry:hash(source.s.registry),initial:hash(source.d.initialState),inputs:hash(source.d.orderedInputs),seed:hash(source.d.runSeed)},candidate:'0.160',activation:'0'};
  writeFileSync(file,JSON.stringify(data,null,2)+'\n');
 }
 console.info('M218 PASS',result.key,checks.length,'prefixes; safe bytes',safeBytes.length,'seconds',result.elapsed.toFixed(3),'probe8',JSON.stringify(rows[7]));return result;
}
for(const c of cases)it('sleep218 '+caseKey(c),()=>runCase(c),600000);
it('compareSleep218 full frozen twenty-case gate',()=>{
 const runs=JSON.parse(readFileSync(file,'utf8')).runs as Record<string,Awaited<ReturnType<typeof runCase>>>;expect(Object.keys(runs).sort()).toEqual(cases.map(caseKey).sort());const get=(scenario:string,seed=0,law='Full')=>runs[law+'/'+scenario+'/'+seed],row=(scenario:string,at:number,seed=0,law='Full')=>get(scenario,seed,law).rows[at-1];
 const prior=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M215_EVIDENCE.json','utf8')).runs;const receiving=['logical','sleep','capacity','inhibited','active','maintained','spare','options','outcome','chosen','probabilities','draws','drawCount','journalCount','identity','mean','physicalDebt','rewardReason'];for(const [name,r]of Object.entries(runs))for(const [i,row]of r.rows.entries())for(const k of receiving)expect((row as any)[k],name+'/'+i+'/'+k).toEqual(k==='outcome'?(prior[name].rows[i].outcome??(prior[name].rows[i].chosen===null?'NoReasons':'Chosen')):prior[name].rows[i][k]);
 expect(Object.values(runs).flatMap(x=>x.prefixes)).toHaveLength(52);expect(Object.values(runs).flatMap(x=>x.prefixes).filter(x=>x.terminal)).toHaveLength(20);expect(new Set(Object.values(runs).map(x=>x.model)).size).toBe(2);
 for(const r of Object.values(runs)){expect(r.rows[1].probabilities).toEqual([{action:'drug',p:'1/2'},{action:'withhold',p:'1/2'}]);if(r.seed===0)expect(r.rows[1].journal).toBe(row('Rested',2).journal);}
 for(let seed=0;seed<4;seed++){
  const rested=row('Rested',8,seed),deprived=row('Deprived',8,seed),recovered=row('Recovered',8,seed);
  expect([rested.sleep[0],deprived.sleep[0],recovered.sleep[0]]).toEqual([100,600,600]);expect([rested.capacity,deprived.capacity,recovered.capacity]).toEqual([950,700,700]);expect([rested.inhibited,deprived.inhibited,recovered.inhibited]).toEqual([true,false,false]);expect(rested.options).toEqual(['withhold']);expect(deprived.options.sort()).toEqual(['drug','withhold']);expect(recovered.probabilities).toEqual(deprived.probabilities);expect(deprived.drawCount).toBeGreaterThan(0);expect(recovered.drawCount).toBe(deprived.drawCount);expect(recovered.draws).toBe(deprived.draws);expect(recovered.chosen).toBe(deprived.chosen);expect(recovered.physicalDebt).toBe(0);expect(deprived.physicalDebt).toBe(600);expect(rested.probabilities).not.toEqual(deprived.probabilities);
  for(const at of [9,12]){expect(row('Recovered',at,seed).inhibited).toBe(true);expect(row('Recovered',at,seed).capacity).toBe(950);}
  for(let at=1;at<=12;at++){const a=row('Rested',at,seed);for(const name of ['Deprived','Recovered']){const b=row(name,at,seed);expect(b.learned).toBe(a.learned);expect(b.journal).toBe(a.journal);expect(b.formation).toBe(a.formation);expect(b.goal).toBe(a.goal);}if(at>=3)expect(a.sleep.slice(1)).toEqual([0,0,500]);}
 }
 const stream=(name:string)=>normalizeStoredStream(get(name).safeCompressed!);eqbytes(stream('BlindRested'),stream('BlindDeprived'));expect(get('BlindRested').safe).toBe(get('BlindDeprived').safe);expect(row('BlindRested',8).physicalDebt).not.toBe(row('BlindDeprived',8).physicalDebt);expect(row('BlindRested',8).capacity).toBeNull();expect(row('BlindDeprived',8).capacity).toBeNull();
 const falseRested=row('FalseRested',8);expect(falseRested.physicalDebt).toBe(600);expect(falseRested.sleep[0]).toBe(0);expect(falseRested.capacity).toBe(1000);expect(falseRested.inhibited).toBe(true);
 expect(get('FailedExecution').decisions).toBe(get('Recovered').decisions);expect(get('FailedExecution').presentation).toBe(get('Recovered').presentation);expect(get('FailedExecution').safe).not.toBe(get('Recovered').safe);expect(get('FailedExecution').physical[0]).toMatchObject({logical:8,available:false,status:'Blocked',chosen:'drug'});expect(get('Recovered').physical[0]).toMatchObject({logical:8,available:true,status:'Applied',chosen:'drug'});const failedSafe=items(decode(stream('FailedExecution')),'list'),recoveredSafe=items(decode(stream('Recovered')),'list'),fo=items(failedSafe[0],'list'),ro=items(recoveredSafe[0],'list');expect(fo.length).toBe(ro.length);const differences:string[]=[];for(let i=0;i<fo.length;i++)if(key(fo[i])!==key(ro[i])){const a=tag(fo[i]),b=tag(ro[i]);expect(a).toBe(b);expect(a?.startsWith('assembled-reward-experience/')||a?.startsWith('assembled-numeric-reward/0.2')).toBe(true);differences.push(a!);}expect(differences.length).toBeGreaterThan(0);expect(failedSafe.slice(1)).toEqual(recoveredSafe.slice(1));console.info('M218 execution sensory interaction',JSON.stringify([...new Set(differences)]));const whole=JSON.parse(readFileSync(file,'utf8'));expect(whole.inertExecution?.pass).toBe(true);
 const originalUnmaintained=JSON.parse(readFileSync('docs/planning/SLEEP_CONTROL_RUN_16_REV1.json','utf8'));for(const at of [10,11]){expect(originalUnmaintained.semantic[at-1].choice).toMatchObject({mode:'NoActiveReasons',chosen:null,draws:[],probabilities:[]});expect(row('Unmaintained',at)).toMatchObject({outcome:'NoReasons',chosen:null,drawCount:0,probabilities:[]});}
 const unmaintained=row('Unmaintained',9);expect(unmaintained.active).toBe(true);expect(unmaintained.maintained).toBe(false);expect(unmaintained.inhibited).toBe(false);expect(unmaintained.capacity).toBe(950);expect(unmaintained.goal).toBe(row('Recovered',9).goal);expect(unmaintained.probabilities).not.toEqual(row('Recovered',9).probabilities);
 for(const name of main){const a=row(name,8,0,'NoControl');expect(a.inhibited).toBe(false);expect(a.drawCount).toBeGreaterThan(0);expect(a.probabilities).toEqual(row('Rested',8,0,'NoControl').probabilities);expect(a.chosen).toEqual(row('Rested',8,0,'NoControl').chosen);expect(a.draws).toBe(row('Rested',8,0,'NoControl').draws);expect(row(name,2,0,'NoControl').journal).toBe(row(name,2).journal);}expect(row('Rested',8,0,'NoControl').capacity).not.toBe(row('Deprived',8,0,'NoControl').capacity);
 whole.qualification={pass:true,originalRuns:20,selectedPrefixes:52,advancing:32,terminal:20,observerPrivateTags:[...privateTags],observerStreams:Object.fromEntries(['BlindRested','BlindDeprived','Recovered','FailedExecution'].map(name=>{const b=stream(name);return [name,{sha256:hash(b),bytes:b.length}];})),executionDifferenceTags:[...new Set(differences)],supplementaryInertRuns:2};writeFileSync(file,JSON.stringify(whole,null,2)+'\n');
 console.info('M218 COMPLETE20/52: all original main, hidden/biased sensing, execution, maintenance and NoControl comparisons; held acquired histories; actual probability differences;32 advancing/20 true terminal saves');
});

it('inertSleep218 fixed rested withheld execution boundary',async()=>{
 const c:Case={scenario:'Rested',law:'Full',seed:0},a=await start(fixture(c)),b=await start(fixture(c,true));for(let t=1;t<=13;t++){expect(await a.run.settleNextInstant()).toBe(true);expect(await b.run.settleNextInstant()).toBe(true);}
 const ao=items(decode(a.run.snapshot().outputs),'list'),bo=items(decode(b.run.snapshot().outputs),'list'),as=safe(a.run,ao),bs=safe(b.run,bo);eqbytes(as,bs);const ap=tagged(ao,OPPORTUNITY_RESULT),bp=tagged(bo,OPPORTUNITY_RESULT);expect(ap).toHaveLength(3);expect(bp).toHaveLength(3);expect(ap.map(p=>p[5])).toEqual([true,true,true]);expect(bp.map(p=>p[5])).toEqual([false,false,false]);
 for(const p of [...ap,...bp])expect(key(p[4])).not.toBe(positive);
 const data=JSON.parse(readFileSync(file,'utf8'));expect(data.inertExecution).toBeUndefined();data.inertExecution={pass:true,seed:0,scenario:'Rested',throughNative:13,safe:hash(as),safeBytes:as.length,safeCompressed:deflateSync(as).toString('base64'),inputs:[hash(a.b.d.orderedInputs),hash(b.b.d.orderedInputs)],runs:[hash(a.run.runIdentity()),hash(b.run.runIdentity())],opportunities:[ap.map(p=>p[5]),bp.map(p=>p[5])]};writeFileSync(file,JSON.stringify(data,null,2)+'\n');console.info('M218 INERT PASS fixed rested seed0, three blocked withholding attempts; entire safe stream byte-equal, no positive reward failure hidden');
},600000);
