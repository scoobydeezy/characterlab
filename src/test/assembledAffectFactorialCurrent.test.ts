/** M189 plan211b4ae8: current reference factors, original source semantics. */
import {it,expect} from 'vitest';
import {fixture as memory} from './fixtures/assembledAffectMemoryCurrent';
import {startMemory,cachedMemory,type MemoryRun as Run} from './fixtures/assembledMemoryFinal';
import {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,u,type CanonicalValue} from './fixtures/assembledFamiliarity';
import {taskA,taskB} from './fixtures/assembledGroundedAffect';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q,roundEven} from '../substrate/exactMath';
import {restoreAuthoritativeState} from '../substrate/state';
import {restoreCharacterRun} from '../assembled/character';
import {compareAffectFactors} from '../campaign3/affectFactorComparison';
import {validateMitigationPacket} from '../assembled/mitigation';
import {reappraisalPath,reappraisalKnowledge,SHARED_AFFECT_APPRAISAL} from '../assembled/reappraisal';
import {POSITION_SOURCE} from '../assembled/positionPerception';
import {SOCIAL_SOURCE} from '../assembled/social';
import {BODY_DELIVERY} from '../assembled/body';
import {DISPLAY} from '../assembled/strategy';
import {PRIORITY_DISPLAY} from '../assembled/priority';
import {sid} from '../assembled/skill';
import {STRESS,stressPath,stressAnchor} from '../assembled/regulatoryStress';
let base:ReturnType<typeof memory>|undefined;
type Cell={p:0|1;s:0|1;v:0|1;c:0|1};
type Control='normal'|'hidden'|'denied';
const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('M189 time');return v.value;};
const fraction=(v:Q)=>v.numerator+'/'+v.denominator;
const normalized=(v:Q)=>{const n=v.divide(Q.of(1n).add(Q.of(v.numerator<0n?-v.numerator:v.numerator,v.denominator)));return q(n.numerator,n.denominator);};
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const knowledge=(r:Run)=>reappraisalKnowledge(state(r).read(reappraisalPath(C)).value,C,true,true,true,true);
const bits=[0,1] as const;
const cells:Cell[]=bits.flatMap(p=>bits.flatMap(s=>bits.flatMap(v=>bits.map(c=>({p,s,v,c})))));
function fixture(cell:Cell,control:Control='normal'){
 const b=structuredClone(base??(base=memory())),slots=[...items(decode(b.s.registry),'list')],affect=[...items(slots[28],'list')],social=items(slots[19],'list');affect[5]=q(cell.s,1);slots[28]=list(affect);
 slots[19]=list([social[0],list(items(social[1],'list').map(v=>list([items(v,'list')[0],list([])])))]);
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])!==key(SOCIAL_SOURCE)).map(v=>{
  const a=[...items(v,'list')],t=at(a[0]);if(![POSITION_SOURCE,DISPLAY,PRIORITY_DISPLAY].some(v=>key(v)===key(a[2])))return v;const p=[...items(a[3],'list')];
  if(key(a[2])===key(POSITION_SOURCE)){
   const annex=[...items(p[3],'list')];if(t===6n)annex[7]=!cell.c;if(t===9n)annex[7]=!!cell.p;
   if(control==='hidden')annex[1]=!annex[1];
   if(control==='denied'&&t===5n){const panel=[...items(p[2],'list')];panel[3]=false;p[2]=list(panel);}
   p[3]=list(annex);
  }else if(key(a[2])===key(DISPLAY)){
   p[1]=list(items(p[1],'list').map(v=>{const route=[...items(v,'list')];route[3]=uint(route[1])===(key(route[0])===key(taskB)?1n:0n);return list(route);}));
  }else if(key(a[2])===key(PRIORITY_DISPLAY)){
   p[1]=list(items(p[1],'list').map(v=>{const r=[...items(v,'list')],main=[taskA,taskB].some(t=>key(t)===key(r[0]));
    if(t===1n)r[1]=list([q(main?1:0,1)]);else r[3]=list([q(main?1:0,1)]);return list(r);}));
  }
  a[3]=list(p);return list(a);
 });
 rows.push(list([signed(9),u(110),BODY_DELIVERY,list([C,q(cell.v?90:0,1),false]),list([])]));
 return {s:{...b.s,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
async function through(r:Run,t:bigint){for(let n=0;r.snapshot().clock<t;n++){expect(n).toBeLessThan(96);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(t);}
async function finish(r:Run){for(let n=0;await r.settleNextInstant();n++)expect(n).toBeLessThan(96);expect(r.snapshot().clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const event=(t:ReturnType<typeof rec>)=>rec(f(t,4n),130n);
function projection(r:Run,cell:Cell,denied=false){
 const a=reports(r,SHARED_AFFECT_APPRAISAL).find(v=>uint(v[1])===10n)!;expect(a,'live actual appraisal10').toBeDefined();expect(a[5]).toEqual(text(denied?'Unavailable':'Known'));
 const k=knowledge(r),p=Q.of(BigInt(cell.p)),s=Q.of(BigInt(cell.s)),v=Q.of(cell.v?19n:99n,100n),c=Q.of(BigInt(cell.c)),E=p.multiply(s).multiply(Q.of(1n).add(v)).divide(Q.of(2n)),U=E.multiply(Q.of(1n).subtract(c)),H=E.multiply(Q.of(2n).subtract(c)).divide(Q.of(2n));
 const prov=items(a[7],'list');expect(k.efficacy!.cue!.mean).toEqual(p);expect(k.efficacy!.cue!.supports).toHaveLength(1);
 expect(items(prov[4],'list')).toEqual([q(cell.p,1),q(cell.s,1),q(v.numerator,v.denominator),denied?list([]):q(cell.c,1)]);
 expect(items(prov[8],'list').slice(0,2)).toEqual([q(100,1),q(cell.v?81:1,100)]);
 if(denied){expect(k.efficacy!.control).toBeUndefined();expect(a[6]).toEqual(list([]));}
 else{
  expect(k.efficacy!.control).toEqual(c);expect(k.efficacy!.supports).toHaveLength(2);
  expect(k.efficacy!.means.map(n=>fraction(n!))).toEqual(['1/1',cell.c?'0/1':'1/1']);
  for(const support of k.efficacy!.supports)expect(items(items(support,'list')[1],'list').map(v=>validateMitigationPacket(v).role)).toEqual(['Before','Motion','After']);
  expect(a[6]).toEqual(list([q(E.numerator,E.denominator),q(U.numerator,U.denominator)]));
  for(const [law,coordinates]of [['SplitExposure',[E,U]],['ScalarUncontrolled',[U]],['HistoricalProduct',[H]]] as const){
   const result=compareAffectFactors({likelihood:p,severity:s,vulnerability:v,control:c},law);expect(result.status).toBe('Known');if(result.status!=='Known')throw Error('M189 candidate');expect(result.coordinates).toEqual(coordinates);
  }
 }
 const d=outputs(r.snapshot().outputs,409n).find(v=>at(f(v,2n))===10n)!;expect(d,'actual decision').toBeDefined();
 const resolved=rec(f(d,4n),419n);expect(uint(f(resolved,1n)),'resolved choice').toBe(3n);const data=rec(f(resolved,2n),420n),context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n);
 const candidates=items(f(rec(f(raw,2n),398n),3n),'list');expect(candidates,'two physical alternatives').toHaveLength(2);
 const ns=items(f(context,3n),'list').map(v=>rec(v,407n)),signals=items(f(raw,3n),'set').map(v=>rec(v,402n));
 const own=(t:CanonicalValue,role:bigint)=>signals.filter(v=>key(f(rec(f(v,1n),401n),2n))===key(t)&&uint(f(rec(f(v,1n),401n),3n))===role);
 for(const task of[taskA,taskB]){expect(own(task,1n),'live base').toHaveLength(1);expect(readQ(f(own(task,1n)[0],2n)).compare(Q.of(0n))).toBeGreaterThan(0);expect(ns.filter(n=>key(f(rec(f(n,1n),404n),3n))===key(f(rec(task,371n),2n)))).toHaveLength(1);}
 const threat=ns.find(n=>key(f(rec(f(n,1n),404n),3n))===key(f(rec(taskA,371n),2n)))!,live=!denied&&U.compare(Q.of(0n))>0;
 expect(own(taskA,2n)).toHaveLength(live?1:0);expect(f(rec(f(threat,2n),406n),3n)).toEqual(live?normalized(U):q(0,1));
 const traces=outputs(r.snapshot().trace,160n),consumer=traces.find(t=>at(f(event(t),2n))===10n&&uint(f(event(t),3n))===80n&&typeof f(t,13n)!=='boolean'&&(f(t,13n) as any).schema?.typeId===403n&&typeof f(t,12n)!=='boolean'&&(f(t,12n) as any).kind==='list'&&key(items(f(t,12n),'list')[1])===key(list(a)));
 expect(consumer,'authentic affect-to-reason contribution').toBeDefined();
 const input=items(f(consumer!,12n),'list'),producer=traces.find(t=>uint(f(event(t),1n))===uint(input[2])&&key(f(t,13n))===key(list(a)));expect(producer,'actual appraisal producer').toBeDefined();
 if(live){const sig=own(taskA,2n)[0];expect(f(sig,2n)).toEqual(q(U.numerator,U.denominator));expect(items(f(rec(f(consumer!,13n),403n),3n),'set')).toContainEqual(sig);expect(items(f(raw,6n),'list').some(v=>key(items(v,'list')[2])===key(sig))).toBe(true);}
 const concern=traces.find(t=>at(f(event(t),2n))===10n&&typeof f(t,13n)!=='boolean'&&(f(t,13n) as any).schema?.typeId===388n&&typeof f(t,12n)!=='boolean'&&(f(t,12n) as any).kind==='list'&&key(items(f(t,12n),'list')[1])===key(list(a)));expect(concern,'actual concern consumer').toBeDefined();
 const row=items(f(rec(f(concern!,13n),388n),3n),'list').map(v=>rec(v,387n)).find(v=>key(f(v,1n))===key(taskA))!;const response=rec(f(row,2n),386n);if(denied){expect(uint(f(response,1n))).toBe(1n);expect(response.fields.has(2n)).toBe(false);}else{expect(uint(f(response,1n))).toBe(2n);expect(f(response,2n)).toEqual(q(U.numerator,U.denominator));}
 expect(outputs(r.snapshot().outputs,426n).some(e=>key(f(rec(f(e,2n),425n),2n))===key(d))).toBe(true);
 expect(outputs(r.snapshot().outputs,433n).some(o=>key(f(rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n),2n))===key(d))).toBe(true);
 const B=own(taskB,2n)[0],bn=ns.find(n=>key(f(rec(f(n,1n),404n),3n))===key(f(rec(taskB,371n),2n)))!;
 if(cell.p===1){
  expect(own(taskB,2n),'live competing body concern').toHaveLength(1);const joint=items(prov[1],'list'),jr=items(joint[4],'list').map(v=>items(v,'list')).find(v=>key(v[0])===key(taskB))!;expect(jr).toHaveLength(5);
  const actualConcern=rec(f(rec(f(rec(f(raw,2n),398n),2n),394n),2n),388n),br=items(f(actualConcern,3n),'list').map(v=>rec(v,387n)).find(v=>key(f(v,1n))===key(taskB))!;
  expect(f(rec(f(br,2n),386n),2n)).toEqual(jr[4]);expect(f(B,2n)).toEqual(jr[4]);expect(f(rec(f(bn,2n),406n),3n)).toEqual(normalized(readQ(jr[4])));
  const basis=f(rec(f(B,3n),400n),1n);expect(typeof basis!=='boolean'&&basis.kind==='map'&&basis.entries.some(([atom])=>{const a=rec(atom,399n);return uint(f(a,1n))===1n&&key(f(rec(f(a,2n),237n),2n))===key(f(rec(joint[2],461n),1n));}),'actual body evidence in competing source').toBe(true);
  console.info('M189 BODY INTERACTION '+JSON.stringify({cell,jointSeverity:fraction(readQ(jr[1])),jointVulnerability:fraction(readQ(jr[2])),consumedConcern:fraction(readQ(jr[4])),compiledModifier:String(at(f(bn,6n)))}));
 }
 const probabilities=items(f(data,2n),'list').map(v=>fraction(readQ(f(rec(v,421n),2n))));
 console.info('M189 CELL '+JSON.stringify({cell,denied,E:denied?'Unknown':fraction(E),U:denied?'Unknown':fraction(U),H:denied?'Unknown':fraction(H),dice:ns.map(n=>String(uint(f(n,4n)))),situation:String(at(f(threat,6n))),mode:String(uint(f(data,8n))),analytical:probabilities}));
 return {a,raw,data,E,U,H,knowledge:state(r).read(reappraisalPath(C)),competingConcern:f(B,2n)};
}
function stressConsumer(r:Run,a:readonly CanonicalValue[],U:Q){
 const out=reports(r,STRESS+'/applied').find(v=>at(v[1])===11n)!;expect(out,'actual strictly later stress').toBeDefined();
 const packet=items(out[2],'list');expect(packet[4]).toEqual(list(a));expect(at(packet[2])).toBe(10n);
 const producer=outputs(r.snapshot().trace,160n).find(t=>uint(f(event(t),1n))===uint(packet[3]))!;expect(f(producer,13n)).toEqual(list(a));expect(uint(f(event(producer),3n))).toBe(50n);
 const dose=roundEven(roundEven(U.numerator*1000n,U.denominator),2n);expect(uint(out[6])).toBe(dose);expect(stressAnchor(out[4])).toEqual({at:11n,level:Number(dose)});expect(state(r).read(stressPath(C)).value).toEqual(out[4]);
}
it('current189 declarations preserve all32 single-factor edges',()=>{
 const fixtures=cells.map(cell=>({cell,b:fixture(cell)}));let edges=0;
 for(const {cell,b:a}of fixtures)for(const axis of['p','s','v','c']as const){if(cell[axis])continue;edges++;const other={...cell,[axis]:1},b=fixtures.find(x=>Object.keys(other).every(k=>x.cell[k as keyof Cell]===other[k as keyof Cell]))!.b;bytes(a.d.initialState,b.d.initialState);
 if(axis==='s'){bytes(a.d.orderedInputs,b.d.orderedInputs);expect({...a.s,registry:null}).toEqual({...b.s,registry:null});const left=items(decode(a.s.registry),'list'),right=[...items(decode(b.s.registry),'list')],app=[...items(right[28],'list')];expect(app[5]).toEqual(q(1,1));app[5]=q(0,1);right[28]=list(app);expect(right).toEqual(left);}
 else{expect(a.s).toEqual(b.s);const left=items(decode(a.d.orderedInputs),'list'),right=items(decode(b.d.orderedInputs),'list'),diff=left.map((v,i)=>key(v)!==key(right[i])?i:-1).filter(i=>i>=0);expect(diff).toHaveLength(1);const l=items(left[diff[0]],'list'),r=items(right[diff[0]],'list'),lp=items(l[3],'list'),rp=[...items(r[3],'list')];expect(at(r[0])).toBe(axis==='c'?6n:9n);if(axis==='v'){expect(r[2]).toEqual(BODY_DELIVERY);rp[1]=lp[1];}else{expect(r[2]).toEqual(POSITION_SOURCE);const annex=[...items(rp[3],'list')];annex[7]=items(lp[3],'list')[7];rp[3]=list(annex);}expect(list([...r.slice(0,3),list(rp),...r.slice(4)])).toEqual(left[diff[0]]);}
 }expect(edges).toBe(32);console.info('M189 DECLARATIONS PASS32 edges; all other source/model fields and initial bytes fixed.');
});
for(const p of bits)it('current189 matrix p'+p,async()=>{
 const results:{cell:Cell;x:ReturnType<typeof projection>}[]=[],prefix:Uint8Array[]=[];
 for(const cell of cells.filter(c=>c.p===p)){const {run}=await startMemory(fixture(cell));await through(run,3n);if(prefix.length){bytes(run.snapshot().state,prefix[0]);bytes(run.snapshot().outputs,prefix[1]);}else prefix.push(run.snapshot().state,run.snapshot().outputs);await through(run,10n);const x=projection(run,cell);results.push({cell,x});await through(run,11n);stressConsumer(run,x.a,x.U);await finish(run);}
 for(const a of results.filter(v=>v.cell.s===0)){const b=results.find(v=>v.cell.s===1&&v.cell.v===a.cell.v&&v.cell.c===a.cell.c)!;expect(a.x.knowledge).toEqual(b.x.knowledge);}
 if(p===1){const body=results.filter(x=>x.cell.s===0&&x.cell.c===0);expect(body).toHaveLength(2);expect(body[0].x.U).toEqual(body[1].x.U);expect(body[0].x.competingConcern).not.toEqual(body[1].x.competingConcern);expect(f(body[0].x.data,2n)).not.toEqual(f(body[1].x.data,2n));const full=results.filter(x=>x.cell.s===1&&x.cell.c===1);expect(full).toHaveLength(2);expect(full[0].x.U).toEqual(full[1].x.U);expect(full[0].x.E).not.toEqual(full[1].x.E);expect(full.every(x=>x.x.H.compare(Q.of(0n))>0)).toBe(true);}
 console.info('M189 MATRIX p'+p+' PASS8 complete101 cells/24 original formulas; source, appraisal, concern, reasons, choice and expression/execution live.');
},550000);
const primary:Cell={p:1,s:1,v:1,c:1};
it('current189 controls and every-instant continuation',async()=>{
 const a=await startMemory(fixture(primary)),repeat=await startMemory(fixture(primary)),hidden=await startMemory(fixture(primary,'hidden')),denied=await startMemory(fixture(primary,'denied'));
 for(let n=0;a.run.snapshot().clock<9n;n++){expect(n).toBeLessThan(96);for(const x of[a,repeat,hidden])expect(await x.run.settleNextInstant()).toBe(true);exact(a.run,repeat.run);expect(a.run.snapshot().clock).toBe(hidden.run.snapshot().clock);bytes(a.run.snapshot().state,hidden.run.snapshot().state);bytes(a.run.snapshot().outputs,hidden.run.snapshot().outputs);}expect(a.run.snapshot().clock).toBe(9n);
 const restored=cachedMemory(await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()}));exact(a.run,restored);
 await through(denied.run,10n);projection(denied.run,primary,true);await finish(denied.run);
 for(let n=0;n<96;n++){const more=await a.run.settleNextInstant();for(const r of[repeat.run,hidden.run,restored])expect(await r.settleNextInstant()).toBe(more);exact(a.run,repeat.run);exact(a.run,restored);bytes(a.run.snapshot().state,hidden.run.snapshot().state);bytes(a.run.snapshot().outputs,hidden.run.snapshot().outputs);if(more&&a.run.snapshot().clock===10n)projection(a.run,primary);if(!more)break;if(n===95)throw Error('M189 complete queue cap');}
 expect(a.run.snapshot().clock).toBe(101n);for(const r of[a.run,repeat.run,hidden.run,restored])expect(r.diagnostic()).toBeUndefined();
 console.info('M189 CONTROLS PASS unknown control != zero; hidden truth invariant; repeat/restore9 every remaining byte through101.');
},550000);
