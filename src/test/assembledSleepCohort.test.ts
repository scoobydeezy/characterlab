import {it,expect} from 'vitest';
// @ts-expect-error Node-only lossless evidence compression.
import {deflateSync,inflateSync} from 'node:zlib';
// @ts-expect-error Node-only test receipt IO; browser project has no Node declarations.
import {createHash} from 'node:crypto';
// @ts-expect-error Node-only test receipt IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {fixture,start,cases,caseKey,main,state,decode,items,key,enc,list,text,u,C,rec,f,uint,at,type Case,type Run} from './fixtures/assembledSleepCohort';
import {restorePreparedCharacterRun,characterModelIdentity} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {sleepAnchor,sleepPath,SLEEP_SAMPLE,SLEEP_RECEIPT,READINESS} from '../assembled/sleepControl';
import {CONTROL_VIEW,controlGoalPath,maintenancePath} from '../assembled/control';
import {habitJournal,habitPath,rewardPath,rewardValue,NUMERIC_REWARD} from '../assembled/habit';
import {REWARD_RECEIPT} from '../assembled/rewardExperience';
import {PROTECTION_CHANNEL,PROTECTION} from '../assembled/protectiveIdentity';
import {identityJournal,journalPath,qualificationParts} from '../assembled/identityEligibility';
import {formationPath,formationValue} from '../assembled/formation';
import {EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
import {cognitiveRecord as r} from '../assembled/codecs';
import {readQ} from '../campaign2/cognitiveMath';
import {CanonicalValue} from '../substrate/canonicalEncoding';
const file='docs/planning/ASSEMBLED_CHARACTER_M215_EVIDENCE.json';
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex'),vh=(v:CanonicalValue)=>hash(enc(v));
const eqbytes=(a:Uint8Array,b:Uint8Array)=>{expect(a.length).toBe(b.length);expect(a.every((v,i)=>v===b[i])).toBe(true);};
const tag=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='list'&&typeof v.items[0]!=='boolean'&&v.items[0]?.kind==='text'?v.items[0].value:undefined;
const tagged=(out:readonly CanonicalValue[],name:string)=>out.filter(v=>tag(v)===name).map(v=>items(v,'list'));
const records=(out:readonly CanonicalValue[],type:bigint)=>out.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
const rational=(v:CanonicalValue)=>{const a=readQ(v);return a.numerator+'/'+a.denominator;};
const positive=key(items(items(decode(fixture(cases[0]).s.registry),'list')[57],'list')[1]);
const action=(v:CanonicalValue)=>key(f(rec(v,395n),2n))===positive?'drug':'withhold';
const jp=journalPath(r(412,[C,PROTECTION_CHANNEL],2));
const privateTags=new Set(['assembled-reward-experience/0.1/physical','assembled-action-body/0.1','assembled-action-body-receipt/0.1','assembled-skill-actual/0.1','assembled-skill-update/0.1','execution-opportunity-result/0.1','external-obstruction-result/0.1','assembled-regulatory-stress/0.1/applied']);
function safe(run:Run,out:readonly CanonicalValue[]){return enc(list([list(out.filter(v=>!privateTags.has(tag(v)??'')&&!(typeof v!=='boolean'&&v.kind==='record'&&[433n,454n,457n].includes(v.schema.typeId)))),decode(run.decisionHistory()),decode(run.decisionPresentation())]));}
function capture(run:Run,logical:number){
 const snap=run.snapshot(),out=items(decode(snap.outputs),'list'),now=BigInt(logical+1),s=state(run),cv=tagged(out,CONTROL_VIEW).find(a=>uint(a[1])===now)!;
 expect(cv,'live current control').toBeDefined();const rd=items(cv.find(v=>tag(v)===READINESS)!,'list'),sample=items(items(rd[4],'list')[3],'list'),axes=items(sample[4],'list').map(v=>{const x=items(v,'list');return x.length?Number(uint(x[0])):null;});
 const d=records(out,409n).find(v=>at(f(v,2n))===now)!;expect(d,'actual decision').toBeDefined();const result=rec(f(d,4n),419n);expect(uint(f(result,1n))).toBe(3n);const chosen=rec(f(result,2n),420n),context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),pool=rec(f(raw,2n),398n);
 const reward=rewardValue(s.read(rewardPath(C)).value,EXTENDED_TIME_LIMIT,true),journal=identityJournal(s.read(jp).value),formed=formationValue(s.read(formationPath(C,PROTECTION_CHANNEL)).value,EXTENDED_TIME_LIMIT),physical=sleepAnchor(s.read(sleepPath(C)).value!);
 const rr=tagged(out,NUMERIC_REWARD+'/reasons').find(v=>uint(v[1])===now);expect(rr).toBeDefined();
 return {logical,sleep:axes,capacity:items(rd[2],'list').length?Number(uint(items(rd[2],'list')[0])):null,inhibited:cv[9],active:cv[2],maintained:cv[3],spare:Number(uint(cv[8])),options:items(f(pool,3n),'list').map(v=>action(f(rec(v,397n),1n))),chosen:action(f(chosen,1n)),probabilities:items(f(chosen,2n),'list').map(v=>{const p=rec(v,421n);return {action:action(f(p,1n)),p:rational(f(p,2n))};}),draws:vh(f(chosen,9n)),drawCount:items(f(chosen,9n),'list').length,journal:vh(s.read(jp).value??list([])),journalCount:journal.length,identity:formed.P.numerator+'/'+formed.P.denominator,formation:vh(s.read(formationPath(C,PROTECTION_CHANNEL)).value??list([])),learned:vh(list([s.read(habitPath(C)).value??list([]),s.read(rewardPath(C)).value??list([])])),mean:reward?.mean===undefined?null:Number(reward.mean),physicalDebt:physical.debt,goal:vh(s.read(controlGoalPath(C)).value??list([])),maintenance:vh(s.read(maintenancePath(C)).value??list([])),rewardReason:rational(rr![5])};
}
async function runCase(c:Case){
 const began=performance.now(),x=await start(fixture(c)),prefixes:number[]=c.law==='Full'&&c.seed===0&&main.includes(c.scenario as never)?[0,2,7,8,9]:[0],rows:ReturnType<typeof capture>[]=[],checks:any[]=[];let pending:Run|undefined,pendingRow:any;
 console.info('M215 START',caseKey(c));
 for(let native=1;native<=13;native++){
  expect(await x.run.settleNextInstant()).toBe(true);expect(x.run.snapshot().clock).toBe(BigInt(native));
  if(pending){expect(await pending.settleNextInstant()).toBe(true);const a=x.run.save(),b=pending.save();eqbytes(a,b);pendingRow.next=hash(a);pending=undefined;}
  if(native>=2){const row=capture(x.run,native-1);rows.push(row);
   if(native===2){expect(row.mean).toBe(600);expect(row.journalCount).toBe(0);expect(row.chosen).toBe('drug');}
   if(native===3){expect(row.journalCount).toBe(1);expect(row.identity).not.toBe('0/1');expect(row.drawCount).toBeGreaterThan(0);expect(row.options.sort()).toEqual(['drug','withhold']);expect(row.inhibited).toBe(false);}
   if(native>3){expect(row.journal).toBe(rows[1].journal);expect(row.formation).toBe(rows[1].formation);expect(row.learned).toBe(rows[0].learned);expect(row.mean).toBe(600);}
  }
  if(prefixes.includes(native-1)){const save=x.run.save();pending=cachedMemory(await restorePreparedCharacterRun(x.handle,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));eqbytes(save,pending.save());pendingRow={logical:native-1,native,bytes:save.length,save:hash(save),terminal:false};checks.push(pendingRow);}
 }
 expect(pending).toBeUndefined();const out=items(decode(x.run.snapshot().outputs),'list'),safeBytes=safe(x.run,out);
 for(const logical of [8,9,12]){const v=rows[logical-1];expect(v.active).toBe(true);expect(v.spare).toBeGreaterThanOrEqual(1);expect(v.mean).toBe(600);}
 let closure=0;while(await x.run.settleNextInstant()){expect(++closure).toBeLessThanOrEqual(4);expect(x.run.snapshot().clock).toBeLessThanOrEqual(101n);}
 const save=x.run.save(),restored=await restorePreparedCharacterRun(x.handle,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save});eqbytes(save,restored.save());expect(await restored.settleNextInstant()).toBe(false);eqbytes(save,restored.save());
 checks.push({logical:12,native:Number(x.run.snapshot().clock),bytes:save.length,save:hash(save),next:hash(save),terminal:true});
 const result={...c,key:caseKey(c),model:hash(characterModelIdentity(x.handle)),input:hash(x.b.d.orderedInputs),initial:hash(x.b.d.initialState),run:hash(x.run.runIdentity()),rows,prefixes:checks,safe:hash(safeBytes),safeBytes:safeBytes.length,safeCompressed:['Recovered','BlindRested','BlindDeprived','FailedExecution'].includes(c.scenario)&&c.seed===0&&c.law==='Full'?deflateSync(safeBytes).toString('base64'):undefined,closureInstants:closure,terminalClock:Number(x.run.snapshot().clock),elapsed:(performance.now()-began)/1000};
 const data=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{contract:'assembled-sleep-cohort/0.1',candidate:'0.141',runs:{}};expect(data.runs[result.key],'do not silently overwrite a passing cohort case').toBeUndefined();data.runs[result.key]=result;writeFileSync(file,JSON.stringify(data,null,2)+'\n');
 console.info('M215 PASS',result.key,checks.length,'prefixes; safe bytes',safeBytes.length,'seconds',result.elapsed.toFixed(3),'probe8',JSON.stringify(rows[7]));return result;
}
for(const c of cases)it('cohort215 '+caseKey(c),()=>runCase(c),600000);
it('compare215 full frozen twenty-case gate',()=>{
 const runs=JSON.parse(readFileSync(file,'utf8')).runs as Record<string,Awaited<ReturnType<typeof runCase>>>;expect(Object.keys(runs).sort()).toEqual(cases.map(caseKey).sort());const get=(scenario:string,seed=0,law='Full')=>runs[law+'/'+scenario+'/'+seed],row=(scenario:string,at:number,seed=0,law='Full')=>get(scenario,seed,law).rows[at-1];
 expect(Object.values(runs).flatMap(x=>x.prefixes)).toHaveLength(52);expect(Object.values(runs).flatMap(x=>x.prefixes).filter(x=>x.terminal)).toHaveLength(20);expect(new Set(Object.values(runs).map(x=>x.model)).size).toBe(2);
 for(let seed=0;seed<4;seed++){
  const rested=row('Rested',8,seed),deprived=row('Deprived',8,seed),recovered=row('Recovered',8,seed);
  expect([rested.sleep[0],deprived.sleep[0],recovered.sleep[0]]).toEqual([100,600,600]);expect([rested.capacity,deprived.capacity,recovered.capacity]).toEqual([950,700,700]);expect([rested.inhibited,deprived.inhibited,recovered.inhibited]).toEqual([true,false,false]);expect(rested.options).toEqual(['withhold']);expect(deprived.options.sort()).toEqual(['drug','withhold']);expect(recovered.probabilities).toEqual(deprived.probabilities);expect(recovered.draws).toBe(deprived.draws);expect(recovered.chosen).toBe(deprived.chosen);expect(recovered.physicalDebt).toBe(0);expect(deprived.physicalDebt).toBe(600);expect(rested.probabilities).not.toEqual(deprived.probabilities);
  for(const at of [9,12]){expect(row('Recovered',at,seed).inhibited).toBe(true);expect(row('Recovered',at,seed).capacity).toBe(950);}
  for(let at=1;at<=12;at++){const a=row('Rested',at,seed);for(const name of ['Deprived','Recovered']){const b=row(name,at,seed);expect(b.learned).toBe(a.learned);expect(b.journal).toBe(a.journal);expect(b.formation).toBe(a.formation);expect(b.goal).toBe(a.goal);}if(at>=3)expect(a.sleep.slice(1)).toEqual([0,0,500]);}
 }
 const stream=(name:string)=>inflateSync(Uint8Array.from(atob(get(name).safeCompressed!),c=>c.charCodeAt(0)));eqbytes(stream('BlindRested'),stream('BlindDeprived'));expect(get('BlindRested').safe).toBe(get('BlindDeprived').safe);expect(row('BlindRested',8).physicalDebt).not.toBe(row('BlindDeprived',8).physicalDebt);expect(row('BlindRested',8).capacity).toBeNull();expect(row('BlindDeprived',8).capacity).toBeNull();
 const falseRested=row('FalseRested',8);expect(falseRested.physicalDebt).toBe(600);expect(falseRested.sleep[0]).toBe(0);expect(falseRested.capacity).toBe(1000);expect(falseRested.inhibited).toBe(true);
 eqbytes(stream('FailedExecution'),stream('Recovered'));expect(get('FailedExecution').safe).toBe(get('Recovered').safe);
 const unmaintained=row('Unmaintained',9);expect(unmaintained.active).toBe(true);expect(unmaintained.maintained).toBe(false);expect(unmaintained.inhibited).toBe(false);expect(unmaintained.capacity).toBe(950);
 for(const name of main){const a=row(name,8,0,'NoControl');expect(a.inhibited).toBe(false);expect(a.probabilities).toEqual(row('Rested',8,0,'NoControl').probabilities);expect(a.chosen).toEqual(row('Rested',8,0,'NoControl').chosen);expect(a.draws).toBe(row('Rested',8,0,'NoControl').draws);expect(row(name,2,0,'NoControl').journal).toBe(row(name,2).journal);}expect(row('Rested',8,0,'NoControl').capacity).not.toBe(row('Deprived',8,0,'NoControl').capacity);
 console.info('M215 COMPLETE20/52: all original main, hidden/biased sensing, execution, maintenance and NoControl comparisons; held acquired histories; actual probability differences;32 advancing/20 true terminal saves');
});
