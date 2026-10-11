import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex');
const p='docs/planning/',planPath=p+'REL_DIMENSIONS_PUBLIC_PLAN_REV1.json';
const plan=JSON.parse(fs.readFileSync(planPath)),result=JSON.parse(fs.readFileSync(p+'REL_DIMENSIONS_PUBLIC_RESULT_REV1.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
const m=await server.ssrLoadModule('/src/campaign3/relDimensionsModel.ts'),codec=await server.ssrLoadModule('/src/campaign3/relDimensionsCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
const views=new Map(),rows=[];
for(let i=0;i<4;i++){
 const w=JSON.parse(fs.readFileSync(p+'relDimensions-public-workers-rev1/'+i+'.json'));
 assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));
 assert.deepEqual(w.results.map(r=>r.runIdentity),plan.runs.filter((_,j)=>j%4===i).map(r=>r.runIdentity));
 assert.equal(w.restores,w.results.reduce((n,r)=>n+r.prefixes,0));
 for(const [k,v] of w.views){assert(!views.has(k));const bytes=Uint8Array.from(Buffer.from(v.outputs,'hex')),obs=v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex'))),[law,goal,...names]=k.split('/');
 const r=w.results.find(r=>r.law===Number(law)&&r.goal===Number(goal)&&r.name===names.join('/'));assert(r);
 assert.equal(hash(bytes),r.outputSha256);assert.deepEqual(obs.map(hash),r.observerSha256);
 views.set(k,{outputs:data.dataItems(codec.decodeRelDimensions(bytes),'list'),observerViews:obs});}
 rows.push(...w.results);
}
assert.equal(rows.length,23);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,23);assert.equal(views.size,23);
for(const r of result.results)assert.deepEqual(rows.find(x=>x.runIdentity===r.runIdentity),r);
  const get=(name,law=1,goal=1)=>views.get(law+'/'+goal+'/'+name),f=data.dataField,key=data.dataKey,items=data.dataItems;
  const records=(name,type,law=1,goal=1)=>get(name,law,goal).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),list=canonical.list,q=canonical.rational,u=canonical.unsigned;
  const apps=(name,i=0,law=1,goal=1)=>records(name,1216n,law,goal).filter(x=>key(f(x,3n))===key(m.HOLDERS[i]));
  const lens=a=>[8n,9n,10n,11n].map(k=>f(a,k));
  const prob=(name,k,law=1,goal=1)=>{const p=records(name,1217n,law,goal).find(x=>key(f(f(x,2n),3n))===key(m.HOLDERS[0])&&key(f(f(x,2n),2n))===key(canonical.signed(3))&&key(f(x,3n))===key(u(k+1)));return f(items(f(p,6n),'list').find(x=>key(f(x,1n))===key(m.OPTIONS[0][k][0])),2n);};
  eq(lens(apps('main')[2]),[1,0,1,0].map(n=>list([q(n,1)])));eq(lens(apps('main')[4]),[0,1,1,1].map(n=>list([q(n,1)])));eq(lens(apps('main',1)[2]),[list([]),list([q(0,1)]),list([]),list([q(0,1)])]);eq([0,1,2,3].map(k=>prob('main',k)),[q(7,9),q(2,9),q(7,9),q(2,9)]);
  for(const [name,k] of [['giftGone',0],['taskGood',1],['broken',2],['calm',3]])for(let j=0;j<4;j++){if(j===k){assert.notDeepEqual(lens(apps(name)[2])[j],lens(apps('main')[2])[j]);assert.notDeepEqual(prob(name,j),prob('main',j));}else{eq(lens(apps(name)[2])[j],lens(apps('main')[2])[j]);eq(prob(name,j),prob('main',j));}}
  eq(lens(apps('main',0,2)[2]),[0,1,2,3].map(()=>list([q(1,2)])));eq(lens(apps('main',0,3)[2]),[0,1,2,3].map(()=>list([q(0,1)])));eq(lens(apps('giftGone',0,3)[2]),lens(apps('main',0,3)[2]));assert.notDeepEqual(lens(apps('giftGone',0,2)[2]),lens(apps('main',0,2)[2]));
  for(const law of [2,3])eq(records('main',1218n),records('main',1218n,law));
  eq(apps('main').filter(x=>key(f(x,4n))===key(m.TARGETS[0])),apps('otherTarget').filter(x=>key(f(x,4n))===key(m.TARGETS[0])));eq(f(apps('witnessA')[2],9n),f(apps('main')[2],9n));eq(f(apps('witnessA')[2],8n),list([]));eq(f(apps('witnessA')[2],10n),list([]));
  eq(f(apps('missingTask')[2],9n),list([]));eq(f(apps('missingPromise')[2],10n),list([]));eq(f(apps('missingCue')[2],11n),list([]));eq(lens(apps('main',0,4)[2]),[list([]),list([]),list([]),list([q(0,1)])]);eq(lens(apps('unknown')[2]),[list([]),list([]),list([]),list([])]);eq(prob('missingTask',1),q(1,2));
  for(const t of [1209n,1210n,1216n,1218n])eq(records('main',t),records('main',t,1,2));for(let k=0;k<4;k++)eq(prob('main',k,1,2),q(1,2));
  eq(get('main').observerViews,get('hiddenWorld').observerViews);eq(get('main').observerViews,get('denied').observerViews);eq(get('main').observerViews[1],get('noA').observerViews[1]);eq(get('main').observerViews[0],get('noB').observerViews[0]);assert.notDeepEqual(get('main',5).observerViews,get('hiddenWorld',5).observerViews);
const O=p+'campaign3-history-rel-dimensions-rev1';fs.mkdirSync(O,{recursive:true});
const receipt={status:'PASS',scope:'Fresh decode and original relationship-dimension assertions over all23 stored worker views; no fresh simulation/prefix restore.',runs:23,storedPrefixes:161,checkerSha256:hash(fs.readFileSync('scripts/check-history-rel-dimensions.mjs')),resultSha256:hash(fs.readFileSync(p+'REL_DIMENSIONS_PUBLIC_RESULT_REV1.json'))};
fs.writeFileSync(O+'/view-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('PASS23 stored views and original relationship-dimension contrasts.');
}finally{await server.close();}
