import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex');
const p='docs/planning/',planPath=p+'RELIANCE_HISTORY_PUBLIC_PLAN_REV2.json';
const plan=JSON.parse(fs.readFileSync(planPath)),result=JSON.parse(fs.readFileSync(p+'RELIANCE_HISTORY_PUBLIC_RESULT_REV2.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
const m=await server.ssrLoadModule('/src/campaign3/relDimensionsModel.ts'),codec=await server.ssrLoadModule('/src/campaign3/relDimensionsCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
const views=new Map(),rows=[];
for(let i=0;i<4;i++){
 const w=JSON.parse(fs.readFileSync(p+'reliance-history-public-workers-rev2/'+i+'.json'));
 assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));
 assert.deepEqual(w.results.map(r=>r.runIdentity),plan.runs.filter((_,j)=>j%4===i).map(r=>r.runIdentity));
 assert.equal(w.restores,w.results.reduce((n,r)=>n+r.prefixes,0));
 for(const [k,v] of w.views){assert(!views.has(k));const bytes=Uint8Array.from(Buffer.from(v.outputs,'hex')),obs=v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex'))),[law,goal,...names]=k.split('/');
 const r=w.results.find(r=>r.law===Number(law)&&r.goal===Number(goal)&&r.name===names.join('/'));assert(r);
 assert.equal(hash(bytes),r.outputSha256);assert.deepEqual(obs.map(hash),r.observerSha256);
 views.set(k,{outputs:data.dataItems(codec.decodeRelDimensions(bytes),'list'),observerViews:obs});}
 rows.push(...w.results);
}
assert.equal(rows.length,22);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,22);assert.equal(views.size,22);
for(const r of result.results)assert.deepEqual(rows.find(x=>x.runIdentity===r.runIdentity),r);
  const get=(name,law=1,goal=1)=>views.get(law+'/'+goal+'/'+name),f=data.dataField,key=data.dataKey,items=data.dataItems;
  const records=(name,type,law=1,goal=1)=>get(name,law,goal).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),list=canonical.list,q=canonical.rational,u=canonical.unsigned;
  const apps=(name,i=0,law=1,goal=1)=>records(name,1216n,law,goal).filter(x=>key(f(x,3n))===key(m.HOLDERS[i]));
  const lens=a=>[8n,9n,10n,11n].map(k=>f(a,k));
  const prob=(name,at,k=2,law=1,goal=1)=>{const p=records(name,1217n,law,goal).find(x=>key(f(f(x,2n),3n))===key(m.HOLDERS[0])&&key(f(f(x,2n),2n))===key(canonical.signed(at))&&key(f(x,3n))===key(u(k+1)));return f(items(f(p,6n),'list').find(x=>key(f(x,1n))===key(m.OPTIONS[0][k][0])),2n);};
  eq(f(apps('main')[0],10n),list([]));eq(f(apps('main')[1],10n),list([q(1,1)]));eq(f(apps('main')[3],10n),list([q(1,2)]));
  eq([1,2,4,7].map(at=>prob('main',at)),[q(1,2),q(7,9),q(1,2),q(1,2)]);
  eq(f(apps('reverse')[1],10n),list([q(0,1)]));eq(f(apps('reverse')[3],10n),list([q(1,2)]));eq(prob('reverse',2),q(2,9));eq(prob('reverse',4),prob('main',4));
  for(const name of ['missing','fulfilled']){eq(f(apps(name)[3],10n),list([q(1,1)]));eq(prob(name,4),q(7,9));}
  eq(f(apps('noFirst')[1],10n),list([]));eq(f(apps('noFirst')[3],10n),list([q(0,1)]));eq(prob('noFirst',4),q(2,9));
  eq(f(apps('unknown')[3],10n),list([]));eq(prob('unknown',4),q(1,2));
  for(const k of [0,1,3]){eq(lens(apps('main')[3])[k],lens(apps('fulfilled')[3])[k]);eq(prob('main',4,k),prob('fulfilled',4,k));}
  eq(f(apps('main')[3],10n),f(apps('taskGood')[3],10n));eq(prob('main',4),prob('taskGood',4));
  for(const law of [2,3])assert.notDeepEqual(prob('main',4,2,law),prob('taskGood',4,2,law));
  eq(prob('main',4,2,3),prob('fulfilled',4,2,3));
  eq(f(apps('witnessA')[3],10n),list([]));eq(prob('witnessA',4),q(1,2));eq(f(apps('witnessA',1)[3],10n),f(apps('main',1)[3],10n));
  eq(apps('main').filter(a=>key(f(a,4n))===key(m.TARGETS[0])),apps('otherTarget').filter(a=>key(f(a,4n))===key(m.TARGETS[0])));
  eq(f(apps('main',0,4)[3],10n),list([]));eq(prob('main',2,2,4),q(1,2));
  for(const t of [1209n,1210n,1216n,1218n])eq(records('main',t),records('main',t,1,2));for(const at of [2,4,7])eq(prob('main',at,2,1,2),q(1,2));
  eq(get('main').observerViews,get('hiddenWorld').observerViews);eq(get('main').observerViews,get('denied').observerViews);eq(get('main').observerViews[1],get('noA').observerViews[1]);eq(get('main').observerViews[0],get('noB').observerViews[0]);assert.notDeepEqual(get('main',5).observerViews,get('hiddenWorld',5).observerViews);
const O=p+'campaign3-history-reliance-rev1';fs.mkdirSync(O,{recursive:true});
const receipt={status:'PASS',scope:'Fresh decode and original reliance-history assertions over all22 stored worker views; no fresh simulation/prefix restore.',runs:22,storedPrefixes:176,checkerSha256:hash(fs.readFileSync('scripts/check-history-reliance.mjs')),resultSha256:hash(fs.readFileSync(p+'RELIANCE_HISTORY_PUBLIC_RESULT_REV2.json'))};
fs.writeFileSync(O+'/view-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('PASS22 stored views and original reliance-history contrasts.');
}finally{await server.close();}
