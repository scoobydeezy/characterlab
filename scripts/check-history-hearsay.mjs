import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex');
const p='docs/planning/',planPath=p+'HEARSAY_PUBLIC_PLAN_REV1.json';
const plan=JSON.parse(fs.readFileSync(planPath)),result=JSON.parse(fs.readFileSync(p+'HEARSAY_PUBLIC_RESULT_REV1.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
const m=await server.ssrLoadModule('/src/campaign3/hearsayModel.ts'),codec=await server.ssrLoadModule('/src/campaign3/hearsayCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
const views=new Map(),rows=[];
for(let i=0;i<4;i++){
 const w=JSON.parse(fs.readFileSync(p+'hearsay-public-workers-rev1/'+i+'.json'));
 assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));
 assert.deepEqual(w.results.map(r=>r.runIdentity),plan.runs.filter((_,j)=>j%4===i).map(r=>r.runIdentity));
 assert.equal(w.restores,w.results.reduce((n,r)=>n+r.prefixes,0));
 for(const [k,v] of w.views){assert(!views.has(k));const bytes=Uint8Array.from(Buffer.from(v.outputs,'hex')),obs=v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex'))),[law,goal,...names]=k.split('/');
 const r=w.results.find(r=>r.law===Number(law)&&r.goal===Number(goal)&&r.name===names.join('/'));assert(r);
 assert.equal(hash(bytes),r.outputSha256);assert.deepEqual(obs.map(hash),r.observerSha256);
 views.set(k,{outputs:data.dataItems(codec.decodeHearsay(bytes),'list'),observerViews:obs});}
 rows.push(...w.results);
}
assert.equal(rows.length,23);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,23);assert.equal(views.size,23);
for(const r of result.results)assert.deepEqual(rows.find(x=>x.runIdentity===r.runIdentity),r);
  const get=(name,law=1,goal=1)=>views.get(law+'/'+goal+'/'+name),f=data.dataField,key=data.dataKey,items=data.dataItems;
  const records=(name,type,law=1,goal=1)=>get(name,law,goal).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),list=canonical.list,q=canonical.rational;
  const js=(name,i=1,law=1,goal=1)=>records(name,1202n,law,goal).filter(x=>key(f(x,3n))===key(m.HOLDERS[i]));
  const apps=(name,i=1,law=1,goal=1)=>records(name,1203n,law,goal).filter(x=>key(f(f(x,2n),3n))===key(m.HOLDERS[i]));
  const updates=(name,i=1,law=1)=>records(name,1204n,law).filter(x=>key(f(x,2n))===key(m.HOLDERS[i]));
  eq(js('main').map(x=>f(x,7n)),[list([]),list([q(0,1)]),list([q(0,1)]),list([q(1,1)]),list([q(1,1)])]);eq(f(js('main',2)[4],7n),list([q(0,1)]));eq(f(js('main')[4],5n),list([q(1,1)]));eq(f(js('main')[4],6n),list([q(0,1)]));eq(f(records('main',1198n)[0],5n),list([false]));
  eq(f(js('main',1,2)[4],7n),list([q(0,1)]));eq(f(js('simultaneous',1,2)[3],7n),list([q(0,1)]));eq(f(updates('main').at(-1),4n),f(updates('main',1,2).at(-1),4n));
  eq(f(js('falseDirect')[3],7n),list([q(0,1)]));eq(f(js('noDirect')[3],5n),list([]));eq(records('main',1198n),records('falseDirect',1198n));eq(js('main').slice(0,3),js('falseDirect').slice(0,3));
  eq(items(f(f(updates('main').at(-1),4n),1n),'list').length,4);eq(items(f(f(updates('main',2).at(-1),4n),1n),'list').length,3);eq(f(js('delayedReceipt')[1],7n),list([]));eq(f(js('delayedReceipt')[2],7n),list([q(0,1)]));
  for(const law of [1,2]){const last=updates('duplicateAfterNew',1,law).at(-1);eq(f(last,3n),f(last,4n));}
  for(const [name,law] of [['unknown',1],['main',3]])for(const j of js(name,1,law))eq(f(j,7n),list([]));for(const name of ['failed','privateDenied','noReports']){eq(f(js(name)[1],7n),list([]));eq(f(js(name)[3],7n),list([q(1,1)]));}
  for(const t of [1197n,1198n,1199n,1202n,1204n])eq(records('main',t),records('main',t,1,2));eq(f(apps('main',1,1,2)[4],5n),list([q(1,1),q(1,1)]));
  eq(get('main').observerViews,get('hiddenTruth').observerViews);eq(get('privacy').observerViews,get('hiddenPrivate').observerViews);eq(get('main').observerViews[1],get('noA').observerViews[1]);for(const n of ['noB','otherDirect'])eq(get('main').observerViews[0],get(n).observerViews[0]);assert.notDeepEqual(get('main',4).observerViews,get('hiddenTruth',4).observerViews);
const O=p+'campaign3-history-hearsay-rev1';fs.mkdirSync(O,{recursive:true});
const receipt={status:'PASS',scope:'Fresh decode and original hearsay assertions over all23 stored worker views; no fresh simulation/prefix restore.',runs:23,storedPrefixes:138,checkerSha256:hash(fs.readFileSync('scripts/check-history-hearsay.mjs')),resultSha256:hash(fs.readFileSync(p+'HEARSAY_PUBLIC_RESULT_REV1.json'))};
fs.writeFileSync(O+'/view-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('PASS23 stored views and original hearsay contrasts.');
}finally{await server.close();}
