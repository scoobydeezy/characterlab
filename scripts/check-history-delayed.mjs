import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex');
const p='docs/planning/',planPath=p+'DELAYED_PUBLIC_PLAN_REV1.json';
const plan=JSON.parse(fs.readFileSync(planPath)),result=JSON.parse(fs.readFileSync(p+'DELAYED_PUBLIC_RESULT_REV1.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
const m=await server.ssrLoadModule('/src/campaign3/delayedModel.ts'),codec=await server.ssrLoadModule('/src/campaign3/delayedCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
const fx=await server.ssrLoadModule('/src/test/delayedFixtures.ts');
const views=new Map(),stored=JSON.parse(fs.readFileSync(p+'DELAYED_PUBLIC_VIEWS_REV1.json'));
assert.equal(stored.planSha256,hash(fs.readFileSync(planPath)));
for(const [k,v] of stored.views){assert(!views.has(k));const bytes=Uint8Array.from(Buffer.from(v.outputs,'hex')),obs=v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex')));
const r=result.results.find(r=>r.law+'/'+r.name===k);assert(r);assert.equal(hash(bytes),r.outputSha256);assert.deepEqual(obs.map(hash),r.observerSha256);
views.set(k,{outputs:data.dataItems(codec.decodeDelayed(bytes),'list'),observerViews:obs});}
assert.equal(views.size,26);assert.equal(result.results.length,26);assert.equal(new Set(result.results.map(r=>r.runIdentity)).size,26);
  const get=(name,law=1)=>views.get(`${law}/${name}`),f=data.dataField,rec=data.dataRecord,items=data.dataItems,key=data.dataKey;
  const records=(name,type,law=1)=>fx.records(get(name,law).outputs,type),app=(name,law=1)=>records(name,1386n,law)[1],choice=(name,law=1)=>f(records(name,1390n,law)[1],7n),prob=(name,law=1)=>f(records(name,1390n,law)[1],4n);
  const q=canonical.rational;
  assert.deepEqual(choice('main'),m.OPTIONS[1]);assert.deepEqual(choice('immediateLarge'),m.OPTIONS[0]);
  for(const [name,value] of [['main',q(1,2)],['delay2',q(1,3)],['delay4',q(1,5)],['uncertain',q(1,4)],['cost',q(1,4)]])assert.deepEqual(f(app(name),6n),value);
  assert.deepEqual(f(app('delay2',2),6n),q(1,1));assert.deepEqual(f(app('delay2',3),6n),q(1,4));
  assert.notDeepEqual(prob('delay4'),prob('delay4',2));assert.notDeepEqual(prob('delay4',3),prob('delay4',2));
  for(const n of ['unknown','unavailable'])assert.deepEqual(choice(n),m.OPTIONS[0]);assert.deepEqual(choice('absentOffer'),m.OPTIONS[2]);
  assert.notDeepEqual(f(app('unknown'),3n),f(app('unavailable'),3n));
  const truth=records('main',1399n);assert.equal(items(f(truth[1],3n),'list').length,0);const delivery=rec(items(f(truth[2],3n),'list')[0],1397n);assert.equal(f(delivery,1n).value,3n);assert.deepEqual(f(delivery,2n),q(1,1));
  assert.equal(records('main',1383n).length,6);assert.equal(items(f(rec(f(records('main',1400n).at(-1),3n),1384n),2n),'list').length,1);
  assert.equal(records('missing',1383n).length,0);assert.deepEqual(f(records('failed',1383n)[0],5n),q(0,1));
  assert.deepEqual(records('failed',1392n).slice(0,2),records('main',1392n).slice(0,2));
  assert.deepEqual(records('main',1399n),records('zeroReceipt',1399n));assert.notDeepEqual(f(records('main',1400n).at(-1),3n),f(records('zeroReceipt',1400n).at(-1),3n));
  for(const [a,b] of [['missing','hiddenMissing'],['truePromised','falseReceipt'],['lateReceipt','hiddenLate'],['deniedOffer','hiddenOffer'],['main','lateWorldChange']])assert.deepEqual(get(a).observerViews,get(b).observerViews);
  assert.equal(f(records('lateReceipt',1383n)[0],3n).value,7n);
const O=p+'campaign3-history-delayed-rev1';
const receipt={status:'PASS',scope:'Fresh decode and original assertions over26 stored views; no fresh simulation or prefix restore.',runs:26,storedPrefixes:234,checkerSha256:hash(fs.readFileSync('scripts/check-history-delayed.mjs')),resultSha256:hash(fs.readFileSync(p+'DELAYED_PUBLIC_RESULT_REV1.json'))};
fs.writeFileSync(O+'/view-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('PASS26 stored delayed views and original contrasts.');
}finally{await server.close();}
