/** M185 plan61513dc6: current execution and later perception, no substitute pipeline. */
import {it,expect} from 'vitest';
import {executedFixture as fixture} from './fixtures/assembledAffectCurrent';
import {startMemory,cachedMemory,type MemoryRun as Run} from './fixtures/assembledMemoryFinal';
import {decode,enc,items,key,list,text,signed,u,q,C,rec,f,uint,bytes,outputs,exact,type CanonicalValue} from './fixtures/assembledFamiliarity';
import {restoreAuthoritativeState} from '../substrate/state';
import {restoreCharacterRun} from '../assembled/character';
import {BODY_SAMPLE,bodyPath} from '../assembled/body';
import {ACTION_BODY} from '../assembled/actionBody';
import {PRACTICE_SETTING,SKILL_ACTUAL} from '../assembled/skill';
import {reappraisalPath,SHARED_AFFECT_APPRAISAL} from '../assembled/reappraisal';
import {STRESS,stressPath,stressAnchor} from '../assembled/regulatoryStress';
import {readQ} from '../campaign2/cognitiveMath';
import {dataRecord as metadataRecord} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {materializeReserve,replenishReserve,reserveBin} from '../campaign3/embodiedMath';
import {compareAffectFactors} from '../campaign3/affectFactorComparison';
const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('M185 EXECUTION time');return v.value;};
const tag=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&typeof v.items[0]!=='boolean'&&v.items[0].kind==='text'?v.items[0].value:'';
const event=(t:ReturnType<typeof rec>)=>rec(f(t,4n),130n);
function build(r:Run){const s=r.snapshot();return {s,state:restoreAuthoritativeState(decode(s.state)),trace:outputs(s.trace,160n),out:items(decode(s.outputs),'list')};}
const cache=new WeakMap<Run,ReturnType<typeof build>>();
function view(r:Run){let v=cache.get(r);if(!v||v.s!==r.snapshot()){v=build(r);cache.set(r,v);}return v;}
const reports=(r:Run,label:string)=>view(r).out.filter(v=>tag(v)===label).map(v=>items(v,'list'));
const projection=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='list'&&!tag(v)?v.items:[v];
const atRows=(r:Run,at:bigint)=>view(r).trace.filter(t=>time(f(event(t),2n))===at);
const typed=(r:Run,at:bigint,type:bigint)=>atRows(r,at).flatMap(t=>projection(f(t,13n))).filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type);
async function through(r:Run,t:bigint){for(let n=0;r.snapshot().clock<t;n++){expect(n).toBeLessThan(96);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(t);}
async function finish(r:Run){for(let n=0;await r.settleNextInstant();n++)expect(n).toBeLessThan(96);expect(r.snapshot().clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
function live(r:Run,at:bigint,status:string,expected?:CanonicalValue){
 const a=reports(r,SHARED_AFFECT_APPRAISAL).find(a=>uint(a[1])===at)!;expect(a,'live compared appraisal').toBeDefined();expect(a[5]).toEqual(text(status));
 const producer=atRows(r,at).find(t=>key(f(t,13n))===key(list(a)))!;expect(producer).toBeDefined();expect(uint(f(event(producer),3n))).toBe(50n);
 const factors=items(items(a[7],'list')[4],'list').map(v=>typeof v!=='boolean'&&v.kind==='list'?undefined:readQ(v));
 const control=compareAffectFactors({likelihood:factors[0],severity:factors[1],vulnerability:factors[2],control:factors[3]},'SplitExposure');
 expect(control.status).toBe(status);
 if(status==='Known'){expect(a[6]).toEqual(list([expected!,expected!]));if(control.status==='Known')expect(items(a[6],'list').map(readQ)).toEqual(control.coordinates);
  const adoption=items(items(a[7],'list')[6],'list')[0];expect(uint(f(rec(adoption,372n),1n)),'threat goal remains Open').toBe(1n);
 }else expect(a[6]).toEqual(list([]));
 return {a,producer};
}
function actual(r:Run,success:boolean){
 const protocol=typed(r,26n,433n);expect(protocol.length,'live protocol execution').toBeGreaterThan(0);for(const o of protocol)expect(uint(f(rec(o,433n),3n)),'common protocol permission').toBeGreaterThan(0n);
 const rows=atRows(r,26n).flatMap(t=>projection(f(t,13n))).filter(v=>tag(v)===SKILL_ACTUAL).map(v=>items(v,'list'));expect(rows.length,'actual execution assessment').toBeGreaterThan(0);const a=rows[0];for(const row of rows)expect(row).toEqual(a);
 expect(a[3]).toEqual(q(0,1));expect(a[4]).toEqual(q(0,1));expect(a[5]).toEqual(q(0,1));expect(a[6]).toBe(success);expect(a[7]).toBe(success);expect(a[8]).toBe(false);
 const effect=atRows(r,26n).flatMap(t=>projection(f(t,13n))).find(v=>tag(v)===ACTION_BODY)!;expect(effect).toBeDefined();const e=items(effect,'list');expect(e[4]).toEqual(q(80,1));expect(e[5]).toEqual(text(success?'Applied':'Blocked'));
 const body=rec(view(r).state.read(bodyPath(C)).value!,454n);
 if(success){const physical=rec(e[6],479n),source=replenishReserve(Q.of(25n),Q.of(100n),Q.of(80n));expect([1n,2n,3n,4n,5n].map(n=>readQ(f(physical,n)))).toEqual([source.before,source.potential,source.applied,source.overflow,source.after]);expect(source.applied).toEqual(Q.of(75n));expect(source.overflow).toEqual(Q.of(5n));expect(readQ(f(body,1n))).toEqual(Q.of(100n));}
 else {expect(e[6]).toEqual(list([]));expect(materializeReserve(readQ(f(body,1n)),time(f(body,2n)),Q.of(100n),Q.of(1n),26n)).toEqual(Q.of(25n));}
 const owner=atRows(r,26n).find(t=>uint(f(event(t),1n))===uint(a[1])&&items(f(t,11n),'list').some(v=>uint(f(rec(f(rec(v,147n),2n),140n),1n))===785n));expect(owner,'actual owned competence read').toBeDefined();
 return a;
}
function sensed(r:Run,success:boolean,p:ReturnType<typeof live>){
 const j=items(items(p.a[7],'list')[1],'list'),sample=rec(j[2],461n),interval=rec(f(sample,5n),462n),original=reserveBin(Q.of(success?98n:23n),Q.of(100n),Q.of(20n));
 expect([readQ(f(interval,1n)),readQ(f(interval,2n))]).toEqual([original.lower,original.upper]);expect(typeof j[3]!=='boolean'&&j[3].kind==='record'&&j[3].schema.typeId===227n).toBe(true);
 const t=atRows(r,28n).find(t=>key(f(event(t),5n))===key(BODY_SAMPLE))!;expect(t).toBeDefined();expect(items(f(t,13n),'list')).toEqual([sample]);
 const operations=items(f(t,15n),'list');expect(operations).toHaveLength(2);expect(operations[0]).toEqual(list([text('assembled-calibrated-sensing/0.1-candidate'),q(success?98:23,1),signed(0),q(0,1),q(success?98:23,1)]));expect(f(sample,6n)).toEqual(text('embodied-level-observation/0.2-candidate'));const quant=rec(operations[1],484n);expect(readQ(f(quant,1n))).toEqual(Q.of(success?98n:23n));
 const chosen=reports(r,'assembled-body-selection/0.1').find(a=>time(a[1])===28n)!;expect(chosen[4]).toEqual(text('Selected'));
}
function stress(r:Run,p:ReturnType<typeof live>,dose:number,level:number){
 const a=reports(r,STRESS+'/applied').find(a=>time(a[1])===29n)!;expect(a,'actual later physical receiver').toBeDefined();const packet=items(a[2],'list');expect(packet[4]).toEqual(list(p.a));expect(packet[3]).toEqual(f(event(p.producer),1n));expect(time(packet[2])).toBe(28n);expect(uint(a[6])).toBe(BigInt(dose));
 expect(stressAnchor(a[4])).toEqual({at:29n,level});expect(stressAnchor(view(r).state.read(stressPath(C)).value!)).toEqual({at:29n,level});return a;
}
function noTruthReads(r:Run){for(const t of view(r).trace)if(![10n,52n,110n].includes(uint(f(event(t),3n))))for(const read of items(f(t,11n),'list'))expect(uint(f(rec(f(rec(read,147n),2n),140n),1n))).not.toBe(455n);}
let oldAttempt:Promise<CanonicalValue>|undefined;
async function originalExecution(rows:readonly (readonly CanonicalValue[])[]){
 const {compileSkillModel,compileSkillInputs,skillRecipe,DEFAULT_SETTINGS}=await import('../campaign3/skillModel');
 const {createSkillRuntime}=await import('../campaign3/skillRuntime'),{skillInputs}=await import('./skillFixtures'),{skillRecord:old}=await import('../campaign3/skillCodecs'),{skillExecute}=await import('../campaign3/skillMath');
 oldAttempt??=(async()=>{const m=await compileSkillModel(skillRecipe()),i=await compileSkillInputs(m,enc(m.initial.canonicalValue()),skillInputs([{at:1}]),new Uint8Array(32)),r=createSkillRuntime(m,i);while(await r.settle()){}return r.snapshot().outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===795n)!;})();
 const attempt=await oldAttempt;expect(attempt).toBeDefined();
 for(const a of rows){const src=old(783,[signed(1),a[4],a[5],a[6],a[8],false,u(0)]),K=old(784,[a[3],u(0)]),out=rec(skillExecute(DEFAULT_SETTINGS,attempt,src,K,undefined,f(rec(attempt,795n),1n)),796n);expect([f(out,6n),f(out,7n),f(out,8n)]).toEqual([a[6],a[7],a[8]]);}
}
async function pair(observed:boolean){
 const a=await startMemory(fixture(true,observed)),b=await startMemory(fixture(false,observed));expect(a.b.s).toEqual(b.b.s);bytes(a.b.d.initialState,b.b.d.initialState);
 const left=items(decode(a.b.d.orderedInputs),'list'),right=items(decode(b.b.d.orderedInputs),'list');expect(left).toHaveLength(right.length);let differences=0;
 left.forEach((v,i)=>{if(key(v)===key(right[i]))return;differences++;const x=items(v,'list'),y=items(right[i],'list');expect(time(x[0])).toBe(26n);expect(x[2]).toEqual(PRACTICE_SETTING);const px=[...items(x[3],'list')],py=[...items(y[3],'list')];expect(px[4]).toBe(true);expect(py[4]).toBe(false);py[4]=true;expect(list(px)).toEqual(list(py));for(const j of[0,1,2,4])expect(x[j]).toEqual(y[j]);});expect(differences).toBe(1);

 for(let n=0;a.run.snapshot().clock<25n;n++){expect(n).toBeLessThan(96);for(const r of[a.run,b.run])expect(await r.settleNextInstant()).toBe(true);expect(a.run.snapshot().clock).toBe(b.run.snapshot().clock);bytes(a.run.snapshot().state,b.run.snapshot().state);bytes(a.run.snapshot().outputs,b.run.snapshot().outputs);}expect(a.run.snapshot().clock).toBe(25n);
 for(const r of[a.run,b.run])await through(r,26n);const actualA=actual(a.run,true),actualB=actual(b.run,false);await originalExecution([actualA,actualB]);
 for(const type of[425n,426n,431n]){const left=typed(a.run,26n,type),right=typed(b.run,26n,type);expect(left.length,'complete chosen meaning is live').toBeGreaterThan(0);bytes(enc(list(left)),enc(list(right)));}
 const attempts=[a.run,b.run].map(r=>typed(r,26n,433n).map(v=>f(rec(v,433n),2n)));expect(attempts[0].length).toBeGreaterThan(0);bytes(enc(list(attempts[0])),enc(list(attempts[1])));
 const belief=view(a.run).state.read(reappraisalPath(C)),frozen=[a.run,b.run].map(r=>items(decode(r.snapshot().outputs),'list'));expect(view(b.run).state.read(reappraisalPath(C))).toEqual(belief);
 const earlier=live(a.run,26n,'Known',q(2,5));expect(earlier.a).toEqual(live(b.run,26n,'Known',q(2,5)).a);
 for(const r of[a.run,b.run])await through(r,28n);
 const x=live(a.run,28n,observed?'Known':'Unavailable',q(1,4)),y=live(b.run,28n,observed?'Known':'Unavailable',q(2,5));
 if(observed){sensed(a.run,true,x);sensed(b.run,false,y);}else for(const r of[a.run,b.run])expect(atRows(r,28n).some(t=>key(f(event(t),5n))===key(BODY_SAMPLE))).toBe(false);
 expect(view(a.run).state.read(stressPath(C))).toEqual(view(b.run).state.read(stressPath(C)));
 for(const r of[a.run,b.run])await through(r,29n);
 const sa=stress(a.run,x,observed?125:0,observed?176:51),sb=stress(b.run,y,observed?200:0,observed?251:51);expect(sa[3]).toEqual(sb[3]);
 for(const r of[a.run,b.run]){expect(reports(r,SHARED_AFFECT_APPRAISAL).find(v=>uint(v[1])===26n)).toEqual(earlier.a);await finish(r);noTruthReads(r);}
 const draws=[a.run,b.run].map(r=>view(r).trace.reduce((n,t)=>n+items(f(t,14n),'list').length,0));
 for(const [i,r]of[a.run,b.run].entries()){expect(view(r).state.read(reappraisalPath(C)),'execution/stress never replace danger evidence').toEqual(belief);expect(items(decode(r.snapshot().outputs),'list').slice(0,frozen[i].length)).toEqual(frozen[i]);}
 console.info('M185 EXECUTION '+(observed?'PRIMARY':'WITHHELD')+' PASS same full intent/expression/plan; actual Applied75/Overflow5 vs Blocked; '+(observed?'samples98/23, U1/4 vs2/5, stress29=176/251':'no sample28, Unavailable appraisals, zero dose, stress29=51/51')+'; original execution/reserve/factor controls; complete101; draws='+draws.join('/')+'.');
}
it('final185 execution primary executed outcome reaches later affect',()=>pair(true),550000);
it('final185 execution withheld observation cannot infer success',()=>pair(false),550000);
it('final185 execution exact repeat and public execution continuation',async()=>{
 const a=await startMemory(fixture()),b=await startMemory(fixture());for(const r of[a.run,b.run])await through(r,25n);exact(a.run,b.run);
 const restored=cachedMemory(await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()}));exact(a.run,restored);let witnessed=false;
 for(let n=0;n<96;n++){const more=await a.run.settleNextInstant();for(const r of[b.run,restored]){expect(await r.settleNextInstant()).toBe(more);exact(a.run,r);}if(a.run.snapshot().clock===29n){stress(a.run,live(a.run,28n,'Known',q(1,4)),125,176);witnessed=true;}if(!more)break;if(n===95)throw Error('M185 EXECUTION settle cap');}
 expect(witnessed).toBe(true);for(const r of[a.run,b.run,restored]){expect(r.snapshot().clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
 console.info('M185 EXECUTION CONTINUATION PASS independent repeat and public save25 restore, every later full state/output/trace/save/run byte through101 across execution26, sensing28 and stress29.');
},550000);

it('final185 execution declared protocol and report permissions',()=>{
 { // Both native pairs already assert their complete model sources equal.
  const b=fixture(true);expect(b.s.rulesVersion).toBe('rules/assembled-character/0.129-candidate');const slots=items(decode(b.s.registry),'list'),rows=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>metadataRecord(v,171n));
  const definition=(name:string)=>{const row=rows.find(r=>{const id=f(r,1n);return typeof id!=='boolean'&&id.kind==='typedIdentifier'&&typeof id.payload!=='boolean'&&id.payload.kind==='text'&&id.payload.value===name;});expect(row).toBeDefined();return f(row!,4n);};
  expect(f(metadataRecord(definition('definition/protocol-execution'),434n),1n)).toBe(true);
  expect(f(metadataRecord(definition('definition/protocol-observation'),451n),4n)).toBe(false);
 }
 console.info('M185 EXECUTION DECLARATIONS PASS common protocol enabled, protocol observation hidden in both arms.');
});
