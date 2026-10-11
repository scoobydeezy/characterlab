import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex');
const p='docs/planning/',planPath=p+'FEAR_GUILT_PUBLIC_PLAN_REV1.json';
const plan=JSON.parse(fs.readFileSync(planPath)),result=JSON.parse(fs.readFileSync(p+'FEAR_GUILT_PUBLIC_RESULT_REV1.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
const m=await server.ssrLoadModule('/src/campaign3/fearGuiltModel.ts'),codec=await server.ssrLoadModule('/src/campaign3/fearGuiltCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
const views=new Map(),rows=[];
for(let i=0;i<4;i++){
 const w=JSON.parse(fs.readFileSync(p+'fearGuilt-public-workers-rev1/'+i+'.json'));
 assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));
 assert.deepEqual(w.results.map(r=>r.runIdentity),plan.runs.filter((_,j)=>j%4===i).map(r=>r.runIdentity));
 assert.equal(w.restores,w.results.reduce((n,r)=>n+r.prefixes,0));
 for(const [k,v] of w.views){assert(!views.has(k));const bytes=Uint8Array.from(Buffer.from(v.outputs,'hex')),obs=v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex'))),[law,goal,...names]=k.split('/');
 const r=w.results.find(r=>r.law===Number(law)&&r.goal===Number(goal)&&r.name===names.join('/'));assert(r);
 assert.equal(hash(bytes),r.outputSha256);assert.deepEqual(obs.map(hash),r.observerSha256);
 views.set(k,{outputs:data.dataItems(codec.decodeFearGuilt(bytes),'list'),observerViews:obs});}
 rows.push(...w.results);
}
assert.equal(rows.length,19);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,19);assert.equal(views.size,19);
for(const r of result.results)assert.deepEqual(rows.find(x=>x.runIdentity===r.runIdentity),r);
  const get=(name,law=1,goal=1)=>views.get(law+'/'+goal+'/'+name),f=data.dataField,key=data.dataKey;
  const records=(name,type,law=1,goal=1)=>get(name,law,goal).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),list=canonical.list,q=canonical.rational;
  const js=(name,i=0,law=1,goal=1)=>records(name,1173n,law,goal).filter(x=>key(f(x,3n))===key(m.HOLDERS[i]));
  const apps=(name,i=0,law=1,goal=1)=>records(name,1174n,law,goal).filter(x=>key(f(f(x,2n),3n))===key(m.HOLDERS[i]));
  eq(js('main').map(x=>f(x,6n)),[list([]),list([q(3,4)]),list([q(3,8)]),list([q(3,4)])]);
  eq(f(js('main',1)[3],6n),list([q(15,16)]));eq(f(apps('main')[2],5n),list([q(3,8),q(3,8)]));
  for(const t of [1168n,1169n])eq(records('main',t),records('noContext',t));eq(js('main').slice(0,2),js('noContext').slice(0,2));eq(f(js('noContext')[2],6n),list([q(3,4)]));eq(f(js('exculpatory')[3],6n),list([q(3,28)]));
  eq(js('main',0,2).slice(1).map(x=>f(x,6n)),[1,2,3].map(()=>list([q(3,4)])));eq(js('main',0,2).map(x=>f(x,6n)),js('noContext',0,2).map(x=>f(x,6n)));
  for(const [name,law] of [['main',3],['unknown',1]])for(const j of js(name,0,law))eq(f(j,6n),list([]));
  eq(f(js('calm')[1],6n),list([q(1,4)]));eq(f(js('noCue')[1],6n),list([]));eq(f(js('noCue')[2],6n),list([q(1,6)]));
  for(const t of [1168n,1169n,1170n,1173n,1175n])eq(records('main',t),records('main',t,1,2));eq(f(apps('main',0,1,2)[2],5n),list([q(5,8),q(5,8)]));
  for(const name of ['hiddenTruth','hiddenCause'])eq(get('main').observerViews,get(name).observerViews);
  eq(get('main').observerViews[1],get('noA').observerViews[1]);for(const name of ['noB','otherContext'])eq(get('main').observerViews[0],get(name).observerViews[0]);eq(get('noDisplay').observerViews,get('deniedCause').observerViews);
  assert.notDeepEqual(get('main',4).observerViews,get('hiddenTruth',4).observerViews);for(const j of js('main',0,4))eq(f(j,6n),list([q(0,1)]));for(const j of js('hiddenTruth',0,4))eq(f(j,6n),list([q(1,1)]));
const O=p+'campaign3-history-fear-guilt-rev1';fs.mkdirSync(O,{recursive:true});
const receipt={status:'PASS',scope:'Fresh decode and original fear/guilt assertions over all19 stored worker views; no fresh simulation/prefix restore.',runs:19,storedPrefixes:95,checkerSha256:hash(fs.readFileSync('scripts/check-history-fear-guilt.mjs')),resultSha256:hash(fs.readFileSync(p+'FEAR_GUILT_PUBLIC_RESULT_REV1.json'))};
fs.writeFileSync(O+'/view-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('PASS19 stored views and original fear/guilt contrasts.');
}finally{await server.close();}
