import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex');
const p='docs/planning/',planPath=p+'GRIEF_PUBLIC_PLAN_REV1.json';
const plan=JSON.parse(fs.readFileSync(planPath)),result=JSON.parse(fs.readFileSync(p+'GRIEF_PUBLIC_RESULT_REV1.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
const m=await server.ssrLoadModule('/src/campaign3/griefModel.ts'),codec=await server.ssrLoadModule('/src/campaign3/griefCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
const views=new Map(),rows=[];
for(let i=0;i<4;i++){
 const w=JSON.parse(fs.readFileSync(p+'grief-public-workers-rev1/'+i+'.json'));
 assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));
 assert.deepEqual(w.results.map(r=>r.runIdentity),plan.runs.filter((_,j)=>j%4===i).map(r=>r.runIdentity));
 assert.equal(w.restores,w.results.reduce((n,r)=>n+r.prefixes,0));
 for(const [k,v] of w.views){assert(!views.has(k));const bytes=Uint8Array.from(Buffer.from(v.outputs,'hex')),obs=v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex'))),[law,goal,...names]=k.split('/');
 const r=w.results.find(r=>r.law===Number(law)&&r.goal===Number(goal)&&r.name===names.join('/'));assert(r);
 assert.equal(hash(bytes),r.outputSha256);assert.deepEqual(obs.map(hash),r.observerSha256);
 views.set(k,{outputs:data.dataItems(codec.decodeGrief(bytes),'list'),observerViews:obs});}
 rows.push(...w.results);
}
assert.equal(rows.length,31);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,31);assert.equal(views.size,31);
for(const r of result.results)assert.deepEqual(rows.find(x=>x.runIdentity===r.runIdentity),r);
  const get=(name,law=1,goal=1)=>views.get(law+'/'+goal+'/'+name),f=data.dataField,key=data.dataKey,items=data.dataItems;
  const records=(name,type,law=1,goal=1)=>get(name,law,goal).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),list=canonical.list,q=canonical.rational,u=canonical.unsigned;
  const apps=(name,i=0,law=1,goal=1)=>records(name,1287n,law,goal).filter(x=>key(f(x,3n))===key(m.HOLDERS[i]));
  const lens=a=>[8n,9n,10n,11n].map(k=>f(a,k));
  const prob=(name,at=4,k=0,law=1,goal=1)=>{const p=records(name,1288n,law,goal).find(x=>key(f(f(x,2n),3n))===key(m.HOLDERS[0])&&key(f(f(x,2n),2n))===key(canonical.signed(at))&&key(f(x,3n))===key(u(k+1)));return f(items(f(p,6n),'list').find(x=>key(f(x,1n))===key(m.OPTIONS[0][k][0])),2n);};
  eq([8n,9n,10n,11n,12n,13n,14n].map(k=>f(apps('main')[3],k)),[1,1,1,0,0,1,0].map(n=>list([q(n,1)])));
  eq(prob('main'),q(7,9));eq(prob('main',4,1),q(1,2));eq(prob('temporary'),q(1,2));eq(prob('temporary',4,1),q(7,9));eq(prob('uncertain'),q(47,72));
  eq(f(apps('uncertain')[3],12n),list([q(1,2)]));eq(f(apps('uncertain')[3],10n),list([q(1,2)]));eq(f(apps('uncertain')[3],11n),list([q(1,2)]));
  for(const n of ['temporary','uncertain'])eq(f(apps(n)[3],5n),f(apps('main')[3],5n));
  eq(f(apps('oneSupport')[3],8n),list([q(1,2)]));eq(prob('oneSupport'),q(47,72));
  for(const n of ['selfSufficient','noHistory','witnessA']){eq(f(apps(n)[3],8n),list([q(0,1)]));eq(f(apps(n)[3],12n),list([q(0,1)]));eq(prob(n),q(1,2));}
  eq(f(apps('main')[7],9n),list([q(2,3)]));eq(f(apps('oneSupport')[7],9n),list([q(1,2)]));
  for(const n of ['noAlternative','noDemand']){eq(f(apps(n)[3],10n),f(apps('main')[3],10n));eq(prob(n),prob('main'));}
  eq(f(apps('noAlternative')[3],14n),list([q(1,1)]));eq(f(apps('present')[3],10n),list([q(0,1)]));eq(f(apps('present')[3],12n),list([q(0,1)]));eq(f(apps('present')[3],8n),list([q(1,1)]));
  for(const n of ['noReport','deniedReport']){eq(f(apps(n)[3],12n),list([]));eq(f(apps(n)[3],10n),list([]));eq(f(apps(n)[3],13n),list([q(1,1)]));}
  eq(f(apps('missingCue')[3],12n),list([q(0,1)]));eq(f(apps('missingCue')[3],10n),list([]));
  eq(f(apps('main')[7],12n),list([q(1,1)]));eq(prob('main',8),q(1,2));eq(prob('main',8,1),q(7,9));eq(f(apps('main')[3],5n),f(apps('main')[6],5n));
  for(const n of ['noCorrection','deniedCorrection','foreignCorrection']){eq(f(apps(n)[7],10n),list([q(1,1)]));eq(prob(n,8),q(7,9));eq(apps(n).slice(0,5),apps('main').slice(0,5));}
  eq(apps('main').filter(a=>key(f(a,4n))===key(m.TARGETS[0])),apps('otherTarget').filter(a=>key(f(a,4n))===key(m.TARGETS[0])));
  eq(prob('main',4,0,2),prob('temporary',4,0,2));eq(prob('main',4,1,2),q(7,9));eq(prob('main',4,0,3),q(1,2));eq(prob('noAlternative',4,0,3),q(7,9));
  for(const law of [2,3,6])eq(records('main',1289n),records('main',1289n,law));
  eq(f(apps('main',0,4)[3],12n),list([q(0,1)]));eq(f(apps('main',0,4)[3],10n),list([q(0,1)]));eq(f(apps('main',0,6)[3],12n),list([]));
  for(const t of [1280n,1281n,1287n,1289n])eq(records('main',t),records('main',t,1,2));for(const k of [0,1])eq(prob('main',4,k,1,2),q(1,2));
  for(const n of ['hiddenWorld','hiddenReturn','denied'])eq(get('main').observerViews,get(n).observerViews);eq(get('main').observerViews[1],get('noA').observerViews[1]);eq(get('main').observerViews[0],get('noB').observerViews[0]);assert.notDeepEqual(get('main',5).observerViews,get('hiddenReturn',5).observerViews);
const O=p+'campaign3-history-grief-rev1';fs.mkdirSync(O,{recursive:true});
const receipt={status:'PASS',scope:'Fresh decode and original grief assertions over all31 stored worker views; no fresh simulation/prefix restore.',runs:31,storedPrefixes:279,checkerSha256:hash(fs.readFileSync('scripts/check-history-grief.mjs')),resultSha256:hash(fs.readFileSync(p+'GRIEF_PUBLIC_RESULT_REV1.json'))};
fs.writeFileSync(O+'/view-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('PASS31 stored views and original grief contrasts.');
}finally{await server.close();}
