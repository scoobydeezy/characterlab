import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,time,rec,f,uint,items,key,decode,enc,list,text,q,bytes,outputs,C,exact,type Run,type CanonicalValue,type Profile} from './fixtures/assembledBodyTrajectory';
import {BODY_SAMPLE} from '../assembled/body';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {unsigned} from '../substrate/canonicalEncoding';
import {bodyCases,runBodyCase} from './bodyOwnershipFixtures';
import {createStoredBody,createPressureCache,sensedPressure} from '../campaign3/bodyOwnershipComparison';
import {ExactRational as Q} from '../substrate/exactMath';
import {exact as readQ} from '../campaign3/embodiedMath';
const rows=(r:Run)=>outputs(r.snapshot().trace,160n),event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n);
const same=(a:CanonicalValue,b:CanonicalValue)=>bytes(enc(a),enc(b));
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const body=(r:Run)=>state(r).entries().find(e=>e.path.rootStateTypeId===455n)!.value;
const rest=(r:Run)=>enc(new AuthoritativeState(state(r).entries().filter(e=>e.path.rootStateTypeId!==455n)).canonicalValue());
const atRows=(r:Run,at:bigint)=>rows(r).filter(t=>time(f(event(t),2n))===at);
const projected=(t:CanonicalValue)=>{const v=f(rec(t,160n),13n);return typeof v!=='boolean'&&v.kind==='list'?v.items:[v];};
const tagged=(r:Run,at:bigint,label:string)=>atRows(r,at).flatMap(projected).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const sample=(r:Run,at:bigint)=>outputs(r.snapshot().outputs,461n).find(s=>time(f(s,4n))===at)!;
function level(r:Run,at:bigint){const t=atRows(r,at).find(t=>key(f(event(t),5n))===key(BODY_SAMPLE))!;return f(rec(items(f(t,15n),'list')[0],484n),1n);}
function pressure(r:Run,at:bigint,expected:CanonicalValue){
 const reports=tagged(r,at,JOINT_APPRAISAL);expect(reports).toHaveLength(1);const report=reports[0],s=sample(r,at);
 expect(s,'actual permitted sample').toBeDefined();expect(report[2]).toEqual(s);expect(typeof report[3]!=='boolean'&&report[3].kind==='record'&&report[3].schema.typeId===227n).toBe(true);
 const tasks=items(report[4],'list').map(v=>items(v,'list'));expect(tasks.length,'live selected task').toBeGreaterThan(0);
 for(const task of tasks){expect(task,'live known appraisal row').toHaveLength(5);expect(task[2]).toEqual(expected);}
 const produced=atRows(r,at).flatMap(projected),typed=(n:bigint)=>produced.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n).map(v=>rec(v,n));
 const concern=typed(388n).find(c=>key(f(c,2n))===key(report[1]));expect(concern,'actual concern consumer').toBeDefined();
 const motive=typed(394n).find(m=>key(f(m,2n))===key(concern!));expect(motive,'actual motive consumes concern').toBeDefined();
 expect(typed(408n).length,'reason evaluation downstream').toBeGreaterThan(0);
 return {report,tasks,modifiers:typed(408n).flatMap(x=>items(f(x,3n),'list').map(v=>{const n=rec(v,407n);return f(n,6n);})),net:typed(408n).flatMap(x=>items(f(x,3n),'list').map(v=>f(rec(f(rec(v,407n),2n),406n),3n))),pressure:expected};
}
async function through(r:Run,at:bigint){for(let n=0;r.snapshot().clock<at;n++){expect(n).toBeLessThan(64);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
async function finish(r:Run,repeat?:Run){for(let n=0;n<64;n++){const next=await r.settleNextInstant();if(repeat){expect(await repeat.settleNextInstant()).toBe(next);exact(r,repeat);}if(!next){expect(r.snapshot().clock).toBe(101n);return;}}throw Error('settle cap64');}
const fraction=(v:CanonicalValue)=>{const n=readQ(v);return n.numerator+'/'+n.denominator;};
async function original(name:string){const c=bodyCases().find(c=>c.name===name)!;expect(c).toBeDefined();return runBodyCase(c,false);}
async function matchOriginal(r:Run,name:string,times:bigint[],offset=0n){
 const old=await original(name);expect(old.probes).toHaveLength(times.length);
 for(const [i,at]of times.entries()){const p=old.probes[i];expect(p.at).toBe(String(at-offset));expect(p.body).toBe(fraction(level(r,at)));expect(p.interval).toBe(key(f(sample(r,at),5n)));
  const upper=readQ(f(rec(f(sample(r,at),5n),462n),2n)),deficit=Q.of(60n).subtract(upper),value=deficit.numerator>0n?deficit.divide(Q.of(60n)):Q.of(0n);
  expect(p.mediated).toBe(value.numerator+'/'+value.denominator);
 }
 console.info('M117 original correspondence '+name+' '+JSON.stringify(old.probes.map(p=>({at:p.at,body:p.body,pressure:p.mediated}))));
}
it('M117 kinetics delayed delivery and exact continuation',async()=>{
 const a=fixture('fast'),b=fixture('slow'),n=fixture('no-delivery');bytes(a.d.initialState,b.d.initialState);bytes(a.d.orderedInputs,b.d.orderedInputs);bytes(a.d.runSeed,b.d.runSeed);
 const left=await createCharacterRun(await prepareCharacterModel(a.s),a.d),right=await createCharacterRun(await prepareCharacterModel(b.s),b.d),none=await createCharacterRun(await prepareCharacterModel(n.s),n.d),repeat=await createCharacterRun(await prepareCharacterModel(a.s),a.d);
 await through(left,31n);await through(repeat,31n);exact(left,repeat);const restored=await restoreCharacterRun(a.s,{initialState:a.d.initialState,orderedInputs:a.d.orderedInputs,save:left.save()});exact(left,restored);await finish(left,restored);await finish(repeat);exact(left,repeat);await finish(right);await finish(none);
 const times=[1n,31n,41n,61n],fast=[79,49,69,49],slow=[q(159,2),q(129,2),q(179,2),q(159,2)];
 expect(times.map(t=>level(left,t))).toEqual(fast.map(n=>q(n,1)));expect(times.map(t=>level(right,t))).toEqual(slow);
 for(const [i,t]of [31n,41n,61n].entries()){pressure(left,t,[q(1,6),q(0,1),q(1,6)][i]);pressure(right,t,q(0,1));pressure(none,t,[q(1,6),q(1,3),q(2,3)][i]);}
 const x=pressure(left,41n,q(0,1)),y=pressure(none,41n,q(1,3));console.info('M117 reason receiving '+JSON.stringify({fast:x.net.map(fraction),unrelieved:y.net.map(fraction),fastInteger:x.modifiers.map(v=>String(time(v))),unrelievedInteger:y.modifiers.map(v=>String(time(v)))}));expect(x.net).not.toEqual(y.net);expect(x.modifiers).toEqual(y.modifiers);
 expect(outputs(left.snapshot().outputs,479n).map(x=>[1n,2n,3n,4n,5n].map(k=>f(x,k)))).toEqual([[49,30,30,0,79].map(x=>q(x,1))]);
 for(const r of [left,right,none])expect(outputs(r.snapshot().outputs,900n)).toHaveLength(0);
 for(const [r,name]of [[left,'kinetic-fast'],[right,'kinetic-slow'],[none,'no-delivery']]as const)await matchOriginal(r,name,times);
 console.info('M117 KINETICS PASS current sample31 precedes delivery; live concern/motive/reasons; exact duplicate/restore31->101');
},550000);
function aliasTrace(a:Run,b:Run){
 const x=rows(a),y=rows(b);expect(x.length).toBe(y.length);let draws=0;
 for(let i=0;i<x.length;i++){
  const physical=key(f(event(x[i]),5n))===key(BODY_SAMPLE),omit=physical?[3n,11n,15n]:[3n];
  if(physical){
   const readsA=items(f(x[i],11n),'list').map(v=>rec(v,147n)),readsB=items(f(y[i],11n),'list').map(v=>rec(v,147n));expect(readsA.length).toBe(readsB.length);
   let bodyReads=0;for(let j=0;j<readsA.length;j++){const root=f(rec(f(readsA[j],2n),140n),1n);if(key(root)===key(unsigned(455))){bodyReads++;same(list([...readsA[j].fields].filter(([k])=>k!==4n).map(([k,v])=>list([unsigned(k),v]))),list([...readsB[j].fields].filter(([k])=>k!==4n).map(([k,v])=>list([unsigned(k),v]))));}else same(readsA[j],readsB[j]);}expect(bodyReads).toBe(1);
   const qa=items(f(x[i],15n),'list'),qb=items(f(y[i],15n),'list');expect(qa).toHaveLength(1);expect(qb).toHaveLength(1);for(const k of [2n,3n,4n])expect(f(rec(qa[0],484n),k)).toEqual(f(rec(qb[0],484n),k));
  }
  same(list([...x[i].fields].filter(([k])=>!omit.includes(k)).map(([k,v])=>list([unsigned(k),v]))),list([...y[i].fields].filter(([k])=>!omit.includes(k)).map(([k,v])=>list([unsigned(k),v]))));draws+=items(f(x[i],14n),'list').length;
 }
 return {rows:x.length,draws};
}
it('M117 hidden alias and permitted resolution',async()=>{
 const a=fixture('alias41'),b=fixture('alias49'),fine=fixture('fine41');expect(a.s).toEqual(b.s);bytes(a.d.orderedInputs,b.d.orderedInputs);bytes(a.d.runSeed,b.d.runSeed);
 const left=await createCharacterRun(await prepareCharacterModel(a.s),a.d),right=await createCharacterRun(await prepareCharacterModel(b.s),b.d),resolution=await createCharacterRun(await prepareCharacterModel(fine.s),fine.d);
 await through(left,2n);await through(right,2n);await through(resolution,2n);
 expect(body(left)).not.toEqual(body(right));bytes(rest(left),rest(right));bytes(left.snapshot().outputs,right.snapshot().outputs);const paired=aliasTrace(left,right);
 pressure(left,2n,q(0,1));pressure(right,2n,q(0,1));pressure(resolution,2n,q(1,6));expect(body(left)).toEqual(body(resolution));
 for(const [r,name]of [[left,'alias41'],[right,'alias49'],[resolution,'fine41']]as const)await matchOriginal(r,name,[2n],1n);
 const meterA=createStoredBody(Q.of(43n),Q.of(1n)).sample(2n,Q.of(20n),true),meterB=createStoredBody(Q.of(51n),Q.of(1n)).sample(2n,Q.of(20n),true);expect(meterA.mediated).toEqual(meterB.mediated);expect(meterA.independent).not.toEqual(meterB.independent);
 await through(left,3n);await through(right,3n);bytes(rest(left),rest(right));bytes(left.snapshot().outputs,right.snapshot().outputs);aliasTrace(left,right);
 const before=outputs(left.snapshot().outputs,461n).length;await through(left,4n);await through(right,4n);pressure(left,4n,q(1,3));pressure(right,4n,q(0,1));expect(outputs(left.snapshot().outputs,461n)[before]).not.toEqual(outputs(right.snapshot().outputs,461n)[before]);
 const ox=items(decode(left.snapshot().outputs),'list'),oy=items(decode(right.snapshot().outputs),'list'),different=ox.findIndex((v,i)=>key(v)!==key(oy[i]));expect(different).toBeGreaterThanOrEqual(0);expect(ox[different]).toEqual(sample(left,4n));expect(oy[different]).toEqual(sample(right,4n));
 const xx=rows(left),yy=rows(right);const first=xx.findIndex((t,i)=>key(f(event(t),5n))===key(BODY_SAMPLE)&&time(f(event(t),2n))===4n&&key(f(t,13n))!==key(f(yy[i],13n)));expect(first).toBeGreaterThan(0);
 await finish(left);await finish(right);await finish(resolution);console.info('M117 ALIAS PASS '+JSON.stringify({...paired,reveal:'4/current sample',coarse:'0/1',fine:'1/6',direct:['19/60','11/60']}));
},550000);
it('M117 denied unavailable and preserved ownership controls',async()=>{
 for(const profile of ['denied','unavailable']as Profile[]){
  const b=fixture(profile),r=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(r,2n);
  expect(outputs(r.snapshot().outputs,461n)).toHaveLength(0);expect(outputs(r.snapshot().outputs,463n)).toHaveLength(1);
  const report=tagged(r,2n,JOINT_APPRAISAL);expect(report).toHaveLength(1);expect(report[0][2]).toEqual(list([]));const tasks=items(report[0][4],'list').map(v=>items(v,'list'));expect(tasks.length).toBeGreaterThan(0);for(const x of tasks)expect(x[1]).toEqual(text('Unavailable'));
  const t=atRows(r,2n).find(t=>key(f(event(t),5n))===key(BODY_SAMPLE))!;expect(items(f(t,15n),'list')).toHaveLength(0);expect(items(f(t,11n),'list').map(v=>f(rec(f(rec(v,147n),2n),140n),1n))).not.toContainEqual(unsigned(455));
  const truth=createStoredBody(Q.of(43n),Q.of(1n)).sample(2n,Q.of(20n),false);expect(truth.mediated.kind).toBe('Unavailable');expect(truth.independent.kind).toBe('Known');
  await finish(r);console.info('M117 UNAVAILABLE PASS '+profile);
 }
},550000);
it('M117 original sixteen source ownership matrix',async()=>{
 let prefixes=0;for(const c of bodyCases()){const r=await runBodyCase(c);prefixes+=r.prefixes;console.info('M117 ORIGINAL '+c.name+' '+JSON.stringify({prefixes:r.prefixes,probes:r.probes.map(p=>({at:p.at,body:p.body,mediated:p.mediated,meter:p.meter,independent:p.independent,reference:p.reference,cached:p.cached}))}));if(c.name==='kinetic-fast'){expect(r.probes.some(p=>p.mediated!==p.reference)).toBe(true);expect(r.probes.some(p=>p.mediated!=='0/1')).toBe(true);const memoryless=sensedPressure(Q.of(80n),Q.of(10n),true);expect(memoryless).toEqual({kind:'Known',value:Q.of(0n)});}for(const p of r.probes){expect(p.mediated).toBe(p.meter);expect(p.mediated).toBe(p.cached);}}
 expect(prefixes).toBe(79);console.info('M117 ORIGINAL MATRIX PASS 16 sources/79 prefixes');
},110000);
