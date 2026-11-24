import {replay220,replay224,replay247,candidate247,correspondence247} from './fixtures/assembledEmbodimentReplay';
import {it,expect} from 'vitest';
// @ts-expect-error Node-only evidence.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {reserve as historicalReserve,tolerance,start,through,state,labels,decode,items,key,enc,list,text,C,rec,f,uint,at,outputs,type Run} from './fixtures/assembledEmbodimentCurrent';
import {restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {safe,eqbytes,hash} from './assembledIntoxicationCohort.test';
// @ts-expect-error Node-only evidence compression.
import {deflateSync,inflateSync} from 'node:zlib';
import {BODY_SAMPLE} from '../assembled/body';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {readQ} from '../campaign2/cognitiveMath';
import {rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
const reserve=(...args:Parameters<typeof historicalReserve>)=>candidate247(historicalReserve(...args));
const file=replay247?'docs/planning/ASSEMBLED_CHARACTER_M247_EVIDENCE.json':replay224?'docs/planning/ASSEMBLED_CHARACTER_M224_BODY_EVIDENCE.json':replay220?'docs/planning/ASSEMBLED_CHARACTER_M220_BODY_EVIDENCE.json':'docs/planning/ASSEMBLED_CHARACTER_M218_EVIDENCE.json';
const fraction=(v:CanonicalValue)=>{const x=readQ(v);return x.numerator+'/'+x.denominator;};
const decodedStreams=new WeakMap<Uint8Array,readonly CanonicalValue[]>();
const records=(bytes:Uint8Array,id:bigint)=>{let stream=decodedStreams.get(bytes);if(!stream){stream=items(decode(bytes),'list');decodedStreams.set(bytes,stream);}return stream.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===id).map(v=>rec(v,id));};
const traceAt=(run:Run,t:bigint)=>records(run.snapshot().trace,160n).filter(v=>at(f(rec(f(v,4n),130n),2n))===t);
const projected=(v:CanonicalValue)=>{const p=f(rec(v,160n),13n);return typeof p!=='boolean'&&p.kind==='list'?p.items:[p];};
function capture(run:Run,t:bigint){
 const ts=traceAt(run,t),sample=records(run.snapshot().outputs,461n).find(v=>at(f(v,4n))===t),body=ts.find(v=>key(f(rec(f(v,4n),130n),5n))===key(BODY_SAMPLE)),produced=ts.flatMap(projected);
 const joint=produced.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length>0&&key(v.items[0])===key(text(JOINT_APPRAISAL))).map(v=>items(v,'list'));
 const reasons=produced.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===408n).map(v=>rec(v,408n));
 const quant=body?items(f(body,15n),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===484n):[],reads=body?items(f(body,11n),'list').map(v=>String(uint(f(rec(f(rec(v,147n),2n),140n),1n)))):[];
 const typed=(id:bigint)=>produced.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===id).map(v=>rec(v,id));
 const joins=joint.map(j=>{const concern=typed(388n).find(v=>key(f(v,2n))===key(j[1]));return !!concern&&typed(394n).some(v=>key(f(v,2n))===key(concern));});
 return {t:Number(t),level:quant.length?fraction(f(rec(quant[0],484n),1n)):null,reads,joins,absence:records(run.snapshot().outputs,463n).map(key),interval:sample?key(f(sample,5n)):null,sample:sample?key(sample):null,rows:joint.flatMap(j=>items(j[4],'list').map(v=>items(v,'list').map(x=>typeof x!=='boolean'&&x.kind==='rational'?fraction(x):key(x)))),net:reasons.flatMap(r=>items(f(r,3n),'list').map(v=>fraction(f(rec(f(rec(v,407n),2n),406n),3n))))};
}

const put=(name:string,value:any)=>{const d=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};expect(d[name]).toBeUndefined();
 // Retain native evidence before correspondence assertions, including a failed comparison.
 if(replay247){d[name]=value;writeFileSync(file,JSON.stringify(d,null,2)+'\n');}
 const correspondence=correspondence247(name,value);if(correspondence)value={...value,correspondence};d[name]=value;writeFileSync(file,JSON.stringify(d,null,2)+'\n');};
function native247(run:Run,times:readonly bigint[]){
 if(!replay247)return {};
 const os=items(decode(run.snapshot().outputs),'list');
 const causal=times.map(t=>{
  const ts=traceAt(run,t),produced=ts.flatMap(projected),contexts=produced.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===408n);
  const decisions=records(run.snapshot().outputs,409n).filter(v=>at(f(v,2n))===t);
  const consumed=decisions.map(d=>({context:contexts.some(c=>key(c)===key(f(d,3n))),chosen:uint(f(rec(f(d,4n),419n),1n))===3n,
   executed:os.some(o=>typeof o!=='boolean'&&o.kind==='record'&&o.schema.typeId===433n&&key(f(rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n),2n))===key(d))}));
  const raw=enc(list([...ts,...decisions,...os.filter(o=>typeof o!=='boolean'&&o.kind==='record'&&o.schema.typeId===433n)]));
  return {t:String(t),consumed,bytes:raw.length,sha256:hash(raw),deflate:deflateSync(raw).toString('base64')};
 });
 return {native:{model:'0.155',clock:String(run.snapshot().clock),causal}};
}
function live247(value:any){if(!replay247)return;for(const row of value.native.causal){expect(row.consumed.length,'actual decision at '+row.t).toBeGreaterThan(0);for(const c of row.consumed){expect(c.context,'actual context consumed').toBe(true);if(c.chosen)expect(c.executed,'chosen decision reaches execution').toBe(true);}}}

async function finish(run:Run){for(let n=0;await run.settleNextInstant();n++)expect(n).toBeLessThan(64);expect(run.snapshot().clock).toBe(101n);}
for(const profile of ['fast','slow','no-delivery'] as const)it('trajectory218 '+profile+' full current receiving path',async()=>{
 const x=await start(reserve(profile));let checkpoint:string|undefined,next:string|undefined;
 if(profile==='fast'){const repeat=await start(reserve(profile));await through(x.run,31n);const live=capture(x.run,31n);expect(live.rows.length).toBeGreaterThan(0);for(const a of live.rows)expect(a).toHaveLength(5);await through(repeat.run,31n);eqbytes(x.run.save(),repeat.run.save());const save=x.run.save();checkpoint=hash(save);const restored=cachedMemory(await restorePreparedCharacterRun(x.handle,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));eqbytes(save,restored.save());await finish(x.run);await finish(restored);eqbytes(x.run.save(),restored.save());next=hash(x.run.save());}else await finish(x.run);
 const rows=[1n,31n,41n,61n].map(t=>capture(x.run,t));console.info('M218 TRAJECTORY',profile,JSON.stringify(rows));
 expect(rows.map(r=>r.level)).toEqual(profile==='fast'?['79/1','49/1','69/1','49/1']:profile==='slow'?['159/2','129/2','179/2','159/2']:['79/1','49/1','39/1','19/1']);
 const pressures=profile==='fast'?['1/6','0/1','1/6']:profile==='slow'?['0/1','0/1','0/1']:['1/6','1/3','2/3'];for(const [i,r]of rows.slice(1).entries()){expect(r.rows.length).toBeGreaterThan(0);for(const a of r.rows){expect(a).toHaveLength(5);expect(a[2]).toBe(pressures[i]);}expect(r.net.length).toBeGreaterThan(0);if(replay224||replay247){expect(r.joins.length).toBeGreaterThan(0);expect(r.joins.every(Boolean)).toBe(true);}}
 const value={rows,checkpoint,next,input:hash(x.b.d.orderedInputs),initial:hash(x.b.d.initialState),registry:hash(x.b.s.registry),terminal:hash(x.run.save()),...native247(x.run,[31n,41n,61n])};put(profile,value);live247(value);
},600000);
for(const profile of ['alias41','alias49','fine41','denied','unavailable'] as const)it('boundary218 '+profile+' current sensing',async()=>{const x=await start(reserve(profile));await through(x.run,10n);const before=safe(x.run,items(decode(x.run.snapshot().outputs),'list')),a=capture(x.run,10n);await through(x.run,12n);const b=capture(x.run,12n);if(profile==='denied'||profile==='unavailable'){expect(a.sample).toBeNull();expect(a.level).toBeNull();expect(a.reads).not.toContain('455');expect(a.absence.length).toBeGreaterThan(0);expect(a.rows.length).toBeGreaterThan(0);for(const r of a.rows)expect(r[1]).toBe(key(text('Unavailable')));}else{for(const r of [a,b]){expect(r.rows.length).toBeGreaterThan(0);expect(r.joins.every(Boolean)).toBe(true);expect(r.net.length).toBeGreaterThan(0);for(const row of r.rows)expect(row).toHaveLength(5);}}await finish(x.run);console.info('M218 SENSING',profile,JSON.stringify([a,b]));const value={rows:[a,b],safe:hash(before),safeBytes:before.length,input:hash(x.b.d.orderedInputs),initial:hash(x.b.d.initialState),registry:hash(x.b.s.registry),safeCompressed:deflateSync(before).toString('base64'),terminal:hash(x.run.save()),...native247(x.run,[10n,12n])};put(profile,value);live247(value);},600000);

it('tolerance218 current earned delivery and receiving',async()=>{const result:any={};for(const law of ['Reciprocal','Unattenuated'] as const){const x=await start(tolerance(law));await through(x.run,7n);const effects=labels(x.run,'assembled-tolerance-effect/0.1').map(a=>({at:Number(at(a[1])),magnitude:Number(uint(a[4])),requested:fraction(a[5]),potential:fraction(a[6])})),rows=[3n,5n,7n].map(t=>capture(x.run,t));console.info('M218 TOLERANCE',law,JSON.stringify({effects,rows}));expect(effects.length).toBeGreaterThanOrEqual(3);expect(effects[0].magnitude).toBeGreaterThan(0);expect(effects[1].magnitude).toBeGreaterThan(effects[0].magnitude);for(const e of effects){expect(e.requested).toBe('40/1');expect(traceAt(x.run,BigInt(e.at)).some(t=>items(f(t,11n),'list').some(v=>uint(f(rec(f(rec(v,147n),2n),140n),1n))===302n))).toBe(true);}for(const r of rows){expect(r.rows.length).toBeGreaterThan(0);for(const a of r.rows)expect(a).toHaveLength(5);expect(r.joins.every(Boolean)).toBe(true);expect(r.net.length).toBeGreaterThan(0);}await finish(x.run);result[law]={effects,rows,input:hash(x.b.d.orderedInputs),initial:hash(x.b.d.initialState),registry:hash(x.b.s.registry),terminal:hash(x.run.save())};}expect(result.Reciprocal.effects.map((e:any)=>e.magnitude)).toEqual(result.Unattenuated.effects.map((e:any)=>e.magnitude));expect(result.Reciprocal.effects[0].potential).not.toBe(result.Unattenuated.effects[0].potential);expect(result.Reciprocal.rows[1].net).not.toEqual(result.Unattenuated.rows[1].net);put('tolerance',result);},600000);

it('compareReserve218 finite current reserve gate',()=>{
 const d=JSON.parse(readFileSync(file,'utf8'));
 const fast=reserve('fast'),slow=reserve('slow');
 const prior=replay224?JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M220_BODY_EVIDENCE.json','utf8')):undefined;
 if(replay224)for(const profile of ['fast','slow','no-delivery','alias41','alias49','fine41','denied','unavailable'] as const){const a=reserve(profile),b=historicalReserve(profile),slots=items(decode(a.s.registry),'list');expect(slots).toHaveLength(59);eqbytes(enc(list(slots.slice(0,58))),b.s.registry);expect(hash(b.s.registry)).toBe(prior[profile].registry);expect(items(items(slots[58],'list')[1],'list')).toHaveLength(0);eqbytes(a.d.orderedInputs,b.d.orderedInputs);eqbytes(a.d.initialState,b.d.initialState);eqbytes(a.d.runSeed,b.d.runSeed);expect(d[profile].correspondence.pass).toBe(true);}
 eqbytes(fast.d.initialState,slow.d.initialState);eqbytes(fast.d.orderedInputs,slow.d.orderedInputs);eqbytes(fast.d.runSeed,slow.d.runSeed);for(const [name,b]of [['fast',fast],['slow',slow]]as const){expect(d[name].input).toBe(hash(b.d.orderedInputs));expect(d[name].initial).toBe(hash(b.d.initialState));expect(d[name].registry).toBe(hash(b.s.registry));}
 expect(Object.keys(d).sort()).toEqual(['fast','slow','no-delivery','alias41','alias49','fine41','denied','unavailable'].sort());
 if(replay247)for(const profile of ['fast','slow','no-delivery','alias41','alias49','fine41','denied','unavailable'] as const){
  const b=historicalReserve(profile),a=reserve(profile),slots=items(decode(a.s.registry),'list');
  expect(slots).toHaveLength(60);eqbytes(enc(list(slots.slice(0,58))),b.s.registry);
  const old220=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M220_BODY_EVIDENCE.json','utf8'))[profile];
  const old224=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M224_BODY_EVIDENCE.json','utf8'))[profile];
  expect(hash(b.s.registry),'original registry artifact').toBe(old220.registry);
  expect(hash(b.d.initialState),'original initial artifact').toBe(old224.initial);
  expect(hash(b.d.orderedInputs),'original stimulus artifact').toBe(old224.input);
  expect(items(items(slots[58],'list')[1],'list')).toHaveLength(0);
  expect(items(items(slots[59],'list')[4],'list')).toHaveLength(0);
  eqbytes(a.d.orderedInputs,b.d.orderedInputs);eqbytes(a.d.runSeed,b.d.runSeed);
  const original=restoreAuthoritativeState(decode(b.d.initialState)),current=restoreAuthoritativeState(decode(a.d.initialState));
  expect(current.entries().length).toBe(original.entries().length+1);
  for(const e of original.entries())expect(current.read(e.path)).toEqual(original.read(e.path));
  expect(current.entries().filter(e=>e.path.rootStateTypeId===1600n)).toHaveLength(1);
  expect(d[profile].correspondence.pass).toBe(true);live247(d[profile]);
  for(const row of d[profile].native.causal){
   const raw=inflateSync(Uint8Array.from(atob(row.deflate),c=>c.charCodeAt(0)));expect(raw.length).toBe(row.bytes);expect(hash(raw)).toBe(row.sha256);
   const decisions=records(raw,409n);expect(decisions).toHaveLength(row.consumed.length);
   row.decisionSummary=decisions.map(d=>{const status=rec(f(d,4n),419n),tag=uint(f(status,1n));return {status:String(tag),probabilities:tag===3n?items(f(rec(f(status,2n),420n),2n),'list').map(v=>fraction(f(rec(v,421n),2n))):[]};});
  }
  console.info('M247 CAUSAL',profile,JSON.stringify(d[profile].native.causal.map((r:any)=>({t:r.t,consumed:r.consumed,decisions:r.decisionSummary}))));
 }
 const row=(p:string,t:number)=>d[p].rows.find((r:any)=>r.t===t);
 expect(row('fast',31).level).toBe(row('no-delivery',31).level);
 expect(row('fast',41).net).not.toEqual(row('no-delivery',41).net);
 expect(d.fast.checkpoint).toBeDefined();expect(d.fast.next).toBe(d.fast.terminal);
 eqbytes(inflateSync(Uint8Array.from(atob(d.alias41.safeCompressed),c=>c.charCodeAt(0))),inflateSync(Uint8Array.from(atob(d.alias49.safeCompressed),c=>c.charCodeAt(0))));
 expect(d.alias41.safe).toBe(d.alias49.safe);
 expect([row('alias41',10).level,row('alias49',10).level,row('fine41',10).level]).toEqual(['41/1','49/1','41/1']);
 expect(row('alias41',10).interval).toBe(row('alias49',10).interval);
 for(const [p,t,pressure]of [['alias41',10,'0/1'],['alias49',10,'0/1'],['fine41',10,'1/6'],['alias41',12,'1/3'],['alias49',12,'0/1']]as const){const r=row(p,t);expect(r.rows.length).toBeGreaterThan(0);for(const a of r.rows){expect(a).toHaveLength(5);expect(a[2]).toBe(pressure);}}
 expect([row('alias41',12).level,row('alias49',12).level]).toEqual(['39/1','47/1']);
 expect(row('alias41',12).interval).not.toBe(row('alias49',12).interval);
 expect(row('alias41',12).net).not.toEqual(row('alias49',12).net);
 d.reserveQualification={pass:true,candidate:replay247?'0.155':replay224?'0.145':replay220?'0.144':'0.143',clauses:[1,2,3,4,5],claim:'live appraisal and actual reason; no cross-model sampled-choice causality',originalControls:['M117 sixteen/79','M39 original80 null and laws']};
 writeFileSync(file,JSON.stringify(d,null,2)+'\n');console.info('M218 RESERVE current five-clause gate PASS; tolerance remains open');
});

it('diagnostic218 missing live appraisal source inventory',async()=>{
 const {fixture:original}=await import('./fixtures/assembledBodyTrajectory');
 for(const name of ['original','current']as const){const b=name==='original'?original('fast'):reserve('fast');
  const groups:Record<string,number[]>={};for(const v of items(decode(b.d.orderedInputs),'list')){const a=items(v,'list'),id=a[2] as {payload:{value:string}};const k=id.payload.value;(groups[k]??=[]).push(Number(at(a[0])));}
  console.info('M218 SOURCE INVENTORY',name,JSON.stringify(groups));
 }
});

it('diagnosticTolerance218 actual no-action chain',async()=>{
 const x=await start(tolerance());await through(x.run,3n);const ts=traceAt(x.run,3n),vs=ts.flatMap(projected),tags=['assembled-strategy-evaluation/0.1','assembled-priority-motive/0.1','assembled-control-view/0.1','assembled-habit-options/0.1'];
 const simple=(v:CanonicalValue):any=>typeof v==='boolean'?v:v.kind==='rational'?fraction(v):v.kind==='text'?v.value:v.kind==='unsigned'||v.kind==='signed'?String(v.value):v.kind==='typedIdentifier'?simple(v.payload):v.kind==='list'||v.kind==='set'?v.items.map(simple):v.kind==='record'?Object.fromEntries([...v.fields].map(([k,v])=>[String(k),simple(v)])):key(v);
 const result=vs.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&tags.some(t=>key(v.items[0])===key(text(t)))).map(simple);
 const typed=vs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[394n,398n,408n].includes(v.schema.typeId)).map(v=>{const r=rec(v,(v as any).schema.typeId);return {type:String(r.schema.typeId),rows:simple(f(r,3n))};});
 console.info('M218 NO ACTION CHAIN',JSON.stringify({result,typed}));
});

it('compareEmbodiment218 finite current receiving gate',()=>{const d=JSON.parse(readFileSync(file,'utf8'));expect(d.reserveQualification?.pass).toBe(true);expect(d.tolerance).toBeDefined();expect(Object.keys(d.tolerance).sort()).toEqual(['Reciprocal','Unattenuated']);});

import {restoreAuthoritativeState} from '../substrate/state';
