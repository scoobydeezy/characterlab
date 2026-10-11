import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex');
const p='docs/planning/',planPath=p+'LYING_PUBLIC_PLAN_REV1.json';
const plan=JSON.parse(fs.readFileSync(planPath)),result=JSON.parse(fs.readFileSync(p+'LYING_PUBLIC_RESULT_REV1.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
const m=await server.ssrLoadModule('/src/campaign3/lyingModel.ts'),codec=await server.ssrLoadModule('/src/campaign3/lyingCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
const views=new Map(),rows=[];
for(let i=0;i<4;i++){
 const w=JSON.parse(fs.readFileSync(p+'lying-public-workers-rev1/'+i+'.json'));
 assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));
 assert.deepEqual(w.results.map(r=>r.runIdentity),plan.runs.filter((_,j)=>j%4===i).map(r=>r.runIdentity));
 assert.equal(w.restores,w.results.reduce((n,r)=>n+r.prefixes,0));
 for(const [k,v] of w.views){assert(!views.has(k));const bytes=Uint8Array.from(Buffer.from(v.outputs,'hex')),obs=v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex'))),[law,pressure,...names]=k.split('/');
 const r=w.results.find(r=>r.law===Number(law)&&r.pressure===Number(pressure)&&r.name===names.join('/'));assert(r);
 assert.equal(hash(bytes),r.outputSha256);assert.deepEqual(obs.map(hash),r.observerSha256);
 views.set(k,{outputs:data.dataItems(codec.decodeLying(bytes),'list'),observerViews:obs});}
 rows.push(...w.results);
}
assert.equal(rows.length,30);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,30);assert.equal(views.size,30);
for(const r of result.results)assert.deepEqual(rows.find(x=>x.runIdentity===r.runIdentity),r);
  const math=await server.ssrLoadModule('/src/campaign3/lyingMath.ts'),choice=await server.ssrLoadModule('/src/campaign2/cognitiveChoice.ts');
  const get=(name,law=1,pressure=2)=>views.get(law+'/'+pressure+'/'+name),f=data.dataField,items=data.dataItems;
  const records=(name,type,law=1,pressure=2)=>get(name,law,pressure).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),u=canonical.unsigned,list=canonical.list,q=canonical.rational;
  const knowledge=(name,i,law=1,pressure=2)=>f(records(name,1095n,law,pressure).filter(v=>data.dataKey(f(v,2n))===data.dataKey(m.HOLDERS[i])).at(-1),4n);
  const value=(name,i,law=1,pressure=2)=>math.estimate(knowledge(name,i,law,pressure),law===2);
  for(const out of records('main',1093n))eq(f(out,3n),u(2));for(const out of records('main',1093n,1,1))eq(f(out,3n),u(1));
  eq(knowledge('main',0),knowledge('main',0,1,1));eq(f(records('main',1090n)[0],5n),list([false]));eq(f(records('main',1090n,1,1)[0],5n),list([true]));
  eq(value('main',1),list([q(1,2)]));eq(value('main',2),list([q(1,2)]));eq(value('main',1,2),list([q(1,1)]));
  eq(value('main',1,5),list([]));eq(records('main',1085n),records('main',1085n,5));
  eq(value('failed',1),list([]));eq(value('failed',1,4),list([q(1,2)]));for(const t of [425n,426n,1090n,1091n])eq(records('main',t),records('failed',t));
  for(const out of records('failed',1093n))eq(f(out,4n),false);
  eq(value('unknown',1),list([]));for(const out of records('unknown',1090n))eq(f(out,5n),list([]));eq(value('negative',1),list([q(1,1)]));
  eq(f(records('misleading',1093n)[0],5n),list([false]));eq(f(records('misleading',1094n)[0],3n),false);eq(f(records('misleading',1093n,1,1)[0],5n),list([true]));
  eq(value('resistant',1),list([q(2,3)]));eq(value('resistant',1,2),list([q(0,1)]));eq(value('resistant',1,5),list([]));eq(records('resistant',1085n),records('resistant',1085n,5));eq(f(records('resistant',1090n)[2],5n),list([false]));
  for(const out of records('main',409n,1,3)){const data=choice.chosenData(out);assert.equal(items(f(data,9n),'list').length,2);for(const p of items(f(data,2n),'list'))eq(f(p,2n),q(1,2));}
  for(const pressure of [2,3]){eq(get('main',1,pressure).observerViews,get('hiddenTruth',1,pressure).observerViews);eq(get('main',1,pressure).observerViews[1],get('noA',1,pressure).observerViews[1]);eq(get('main',1,pressure).observerViews[0],get('noB',1,pressure).observerViews[0]);}
  for(const t of [409n,1090n,1091n,1093n])eq(records('main',t),records('hiddenTruth',t));
  assert.notDeepEqual(get('main',3).observerViews,get('hiddenTruth',3).observerViews);assert.notDeepEqual(get('failed',6).observerViews,get('failed').observerViews);
  eq(value('noA',1),list([]));eq(value('noB',2),list([]));
const O=p+'campaign3-history-lying-rev1';fs.mkdirSync(O,{recursive:true});
const receipt={status:'PASS',scope:'Fresh decode and original lying assertions over all30 stored worker views; no fresh simulation/prefix restore.',runs:30,storedPrefixes:143,checkerSha256:hash(fs.readFileSync('scripts/check-history-lying.mjs')),resultSha256:hash(fs.readFileSync(p+'LYING_PUBLIC_RESULT_REV1.json'))};
fs.writeFileSync(O+'/view-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('PASS30 stored views and original lying contrasts.');
}finally{await server.close();}
