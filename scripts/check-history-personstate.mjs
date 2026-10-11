import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex');
const p='docs/planning/',planPath=p+'PERSONSTATE_PUBLIC_PLAN_REV2.json';
const plan=JSON.parse(fs.readFileSync(planPath)),result=JSON.parse(fs.readFileSync(p+'PERSONSTATE_PUBLIC_RESULT_REV2.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
const m=await server.ssrLoadModule('/src/campaign3/personstateModel.ts'),codec=await server.ssrLoadModule('/src/campaign3/personstateCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
const views=new Map(),rows=[];
for(let i=0;i<4;i++){
 const w=JSON.parse(fs.readFileSync(p+'personstate-public-workers-rev2/'+i+'.json'));
 assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));
 assert.deepEqual(w.results.map(r=>r.runIdentity),plan.runs.filter((_,j)=>j%4===i).map(r=>r.runIdentity));
 assert.equal(w.restores,w.results.reduce((n,r)=>n+r.prefixes,0));
 for(const [k,v] of w.views){assert(!views.has(k));const bytes=Uint8Array.from(Buffer.from(v.outputs,'hex')),obs=v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex'))),[law,pressure,goal,...names]=k.split('/');
 const r=w.results.find(r=>r.law===Number(law)&&r.pressure===Number(pressure)&&r.goal===Number(goal)&&r.name===names.join('/'));assert(r);
 assert.equal(hash(bytes),r.outputSha256);assert.deepEqual(obs.map(hash),r.observerSha256);
 views.set(k,{outputs:data.dataItems(codec.decodePersonState(bytes),'list'),observerViews:obs});}
 rows.push(...w.results);
}
assert.equal(rows.length,28);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,28);assert.equal(views.size,28);
for(const r of result.results)assert.deepEqual(rows.find(x=>x.runIdentity===r.runIdentity),r);
  const math=await server.ssrLoadModule('/src/campaign3/personstateMath.ts'),choice=await server.ssrLoadModule('/src/campaign2/cognitiveChoice.ts');
  const get=(name,law=1,pressure=1,goal=1)=>views.get(law+'/'+pressure+'/'+goal+'/'+name),f=data.dataField,items=data.dataItems,key=data.dataKey;
  const records=(name,type,law=1,pressure=1,goal=1)=>get(name,law,pressure,goal).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),u=canonical.unsigned,list=canonical.list,q=canonical.rational;
  const apps=(name,i=1,law=1,pressure=1,goal=1)=>records(name,1153n,law,pressure,goal).filter(x=>key(f(x,3n))===key(m.HOLDERS[i]));
  const last=(name,i=1,law=1,pressure=1,goal=1)=>apps(name,i,law,pressure,goal)[3];
  const knowledge=(name,i=1,law=1,pressure=1,goal=1)=>f(records(name,1160n,law,pressure,goal).filter(x=>key(f(x,2n))===key(m.HOLDERS[i])).at(-1),4n);
  eq(f(last('main'),5n),list([q(2,3)]));eq(f(last('main'),6n),list([q(0,1)]));eq(f(last('main',2),5n),list([q(2,3)]));eq(f(last('main',2),6n),list([q(1,1)]));eq(f(records('main',1155n)[3],5n),list([true]));
  eq(f(last('main'),9n),list([q(1,1),q(1,1)]));eq(f(last('main',2),9n),list([q(0,1),q(0,1)]));eq(f(knowledge('main'),1n),f(knowledge('cueChanged'),1n));eq(f(last('cueChanged'),5n),f(last('main'),5n));eq(f(last('cueChanged'),9n),list([q(0,1),q(0,1)]));eq(apps('main').slice(0,3),apps('cueChanged').slice(0,3));
  eq(knowledge('main'),knowledge('main',1,1,1,2));for(const k of [5n,6n])eq(f(last('main'),k),f(last('main',1,1,1,2),k));eq(f(last('main',1,1,1,2),9n),list([q(0,1),q(0,1)]));
  eq(f(last('main',1,2),5n),list([q(1,2)]));eq(f(last('main',1,2),6n),list([q(1,2)]));eq(f(last('main',1,3),6n),list([q(2,3)]));eq(f(last('main',1,4),5n),list([]));eq(f(last('main',1,4),6n),list([q(0,1)]));assert.notDeepEqual(f(last('main',1,2),5n),f(last('cueChanged',1,2),5n));eq(f(last('main',1,3),6n),f(last('cueChanged',1,3),6n));
  eq(f(last('noHistory'),5n),list([]));eq(f(last('neutral'),5n),list([q(1,2)]));eq(f(last('negative'),5n),list([q(0,1)]));eq(f(last('missingCue'),6n),list([]));eq(f(last('missingCue'),9n),list([]));eq(f(apps('missingThenReturn')[2],6n),list([]));eq(f(last('missingThenReturn'),6n),list([q(0,1)]));
  for(const t of [425n,426n,1155n]){eq(records('main',t),records('failed',t));eq(records('main',t),records('cueChanged',t));eq(records('main',t),records('main',t,1,1,2));}eq(items(f(knowledge('failed'),1n),'list').length,0);eq(f(apps('main')[0],5n),list([]));eq(f(apps('main')[1],5n),list([q(1,1)]));eq(apps('main').slice(0,4),apps('visibleLast').slice(0,4));assert.notDeepEqual(f(knowledge('main'),1n),f(knowledge('visibleLast'),1n));
  for(const pressure of [1,3]){eq(get('main',1,pressure).observerViews,get('hiddenIntent',1,pressure).observerViews);eq(get('main',1,pressure).observerViews[1],get('noA',1,pressure).observerViews[1]);eq(get('main',1,pressure).observerViews[0],get('noB',1,pressure).observerViews[0]);eq(get('main',1,pressure).observerViews[0],get('otherCue',1,pressure).observerViews[0]);}
  eq(get('main').observerViews,get('main',1,2).observerViews);eq(get('missingCue').observerViews[0],get('deniedCueChange').observerViews[0]);assert.notDeepEqual(get('main',5).observerViews,get('hiddenIntent',5).observerViews);
  const draw=choice.chosenData(records('main',409n,1,3)[3]);assert.equal(items(f(draw,9n),'list').length,2);for(const p of items(f(draw,2n),'list'))eq(f(p,2n),q(1,2));
const O=p+'campaign3-history-personstate-rev1';fs.mkdirSync(O,{recursive:true});
const receipt={status:'PASS',scope:'Fresh decode and original person-state assertions over all28 stored worker views; no fresh simulation/prefix restore.',runs:28,storedPrefixes:168,checkerSha256:hash(fs.readFileSync('scripts/check-history-personstate.mjs')),resultSha256:hash(fs.readFileSync(p+'PERSONSTATE_PUBLIC_RESULT_REV2.json'))};
fs.writeFileSync(O+'/view-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('PASS28 stored views and original person-state contrasts.');
}finally{await server.close();}
