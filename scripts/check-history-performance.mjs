import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex');
const p='docs/planning/',planPath=p+'PERFORMANCE_PUBLIC_PLAN_REV1.json';
const plan=JSON.parse(fs.readFileSync(planPath)),result=JSON.parse(fs.readFileSync(p+'PERFORMANCE_PUBLIC_RESULT_REV1.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
const m=await server.ssrLoadModule('/src/campaign3/performanceModel.ts'),codec=await server.ssrLoadModule('/src/campaign3/performanceCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
const fx=await server.ssrLoadModule('/src/test/performanceFixtures.ts');
const views=new Map(),stored=JSON.parse(fs.readFileSync(p+'PERFORMANCE_PUBLIC_VIEWS_REV1.json'));
assert.equal(stored.planSha256,hash(fs.readFileSync(planPath)));
for(const [k,v] of stored.views){assert(!views.has(k));const bytes=Uint8Array.from(Buffer.from(v.outputs,'hex')),obs=v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex')));
const r=result.results.find(r=>r.law+'/'+r.name===k);assert(r);assert.equal(hash(bytes),r.outputSha256);assert.deepEqual(obs.map(hash),r.observerSha256);
views.set(k,{outputs:data.dataItems(codec.decodePerformance(bytes),'list'),observerViews:obs});}
assert.equal(views.size,22);assert.equal(result.results.length,22);assert.equal(new Set(result.results.map(r=>r.runIdentity)).size,22);
  const get=(name,law=1)=>views.get(`${law}/${name}`),f=data.dataField,rec=data.dataRecord,items=data.dataItems,key=data.dataKey;
  const records=(name,type,law=1)=>fx.records(get(name,law).outputs,type),routes=(name,law=1)=>records(name,1304n,law).map(v=>Number(f(v,6n).value));
  assert.deepEqual(routes('main'),[0,1,1,2,2,2,2,2]);assert.deepEqual(routes('main',2),[0,1,1,1,1,1,1,1]);assert.equal(routes('transientFailure',3)[2],2);
  for(const n of ['positiveFeedback','transientFailure','noFeedback','oneHiddenFailure','noAlternative'])assert.deepEqual(routes(n),[0,1,1,1,1,1,1,1]);
  assert.deepEqual(routes('gappedFailures'),[0,1,1,1,1,2,2,2]);assert.deepEqual(routes('repeatFailures'),[0,1,1,2,2,1,1,2]);assert.equal(Number(f(records('repeatFailures',1304n)[6],11n).value),1);
  assert.deepEqual(routes('noAdoption'),Array(8).fill(0));assert.equal(records('noAdoption',1301n).filter(o=>f(o,4n).value===3n).length,0);
  assert.deepEqual(routes('fulfilled'),[0,1,1,2,0,0,0,0]);assert.deepEqual(routes('external'),[0,1,0,0,0,0,0,0]);
  const e=records('main',1304n),goals=e.slice(1).map(v=>items(f(v,3n),'list')[0]);for(const g of goals)assert.deepEqual(g,goals[0]);for(const v of e.slice(1)){assert.equal(Number(f(v,8n).value),3);assert.equal(Number(f(v,9n).value),3);}
  assert.deepEqual(e.map(v=>Number(f(v,11n).value)),[0,0,1,2,0,0,0,0]);assert.equal(f(e[3],12n),true);
  const execution=records('main',1306n)[3];assert.equal(Number(f(execution,3n).value),2);assert.equal(f(execution,4n),true);assert.equal(records('main',1305n).length,7);
  assert.deepEqual(records('transientFailure',1305n).slice(0,2),records('main',1305n).slice(0,2));
  for(const [a,b] of [['main','hiddenCause'],['main','falseFailure'],['noFeedback','hiddenDenied'],['deniedDisplay','noDisplay']])assert.deepEqual(get(a).observerViews,get(b).observerViews);
  assert.notDeepEqual(get('noFeedback',4).observerViews,get('hiddenDenied',4).observerViews);
const O=p+'campaign3-history-performance-rev1';
const receipt={status:'PASS',scope:'Fresh decode and original assertions over22 stored views; no fresh simulation or prefix restore.',runs:22,storedPrefixes:198,checkerSha256:hash(fs.readFileSync('scripts/check-history-performance.mjs')),resultSha256:hash(fs.readFileSync(p+'PERFORMANCE_PUBLIC_RESULT_REV1.json'))};
fs.writeFileSync(O+'/view-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('PASS22 stored performance views and original contrasts.');
}finally{await server.close();}
