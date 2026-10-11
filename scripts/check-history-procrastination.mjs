import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex');
const p='docs/planning/',planPath=p+'PROCRASTINATION_PUBLIC_PLAN_REV2.json';
const plan=JSON.parse(fs.readFileSync(planPath)),result=JSON.parse(fs.readFileSync(p+'PROCRASTINATION_PUBLIC_RESULT_REV2.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
const m=await server.ssrLoadModule('/src/campaign3/procrastinationModel.ts'),codec=await server.ssrLoadModule('/src/campaign3/procrastinationCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
const fx=await server.ssrLoadModule('/src/test/procrastinationFixtures.ts');
const views=new Map(),stored=JSON.parse(fs.readFileSync(p+'PROCRASTINATION_PUBLIC_VIEWS_REV2.json'));
assert.equal(stored.planSha256,hash(fs.readFileSync(planPath)));
for(const [k,v] of stored.views){assert(!views.has(k));const bytes=Uint8Array.from(Buffer.from(v.outputs,'hex')),obs=v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex')));
const r=result.results.find(r=>r.candidate+'/'+r.law+'/'+r.name===k);assert(r);assert.equal(hash(bytes),r.outputSha256);assert.deepEqual(obs.map(hash),r.observerSha256);
views.set(k,{outputs:data.dataItems(codec.decodeProcrastination(bytes),'list'),observerViews:obs});}
assert.equal(views.size,20);assert.equal(result.results.length,20);assert.equal(new Set(result.results.map(r=>r.runIdentity)).size,20);
  const get=(name,candidate=1,law=1)=>views.get(candidate+'/'+law+'/'+name),f=data.dataField,rec=data.dataRecord,items=data.dataItems;
  const records=(name,type,candidate=1,law=1)=>get(name,candidate,law).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
  const ev=(name,c=1)=>records(name,1360n,c),discount=(name,c=1)=>ev(name,c).map(v=>f(v,7n));
  assert.equal(discount('main')[1],true);assert.equal(discount('main',2)[1],false);assert.equal(discount('unknown')[1],false);assert.equal(discount('unknown',3)[1],true);assert.equal(discount('corrected')[2],true);assert.equal(discount('corrected')[3],false);assert.equal(discount('corrected',3)[3],true);assert.equal(discount('main')[5],false);
  const raw=records('main',1362n),choices=records('main',1364n),e=ev('main');const signals=items(f(raw[1],3n),'list');assert.equal(signals.length,2);assert.notDeepEqual(f(rec(signals[0],402n),1n),f(rec(signals[1],402n),1n));assert.notDeepEqual(f(rec(signals[0],402n),2n),f(rec(signals[1],402n),2n));
  assert.equal(f(e[1],2n),true);assert.equal(f(e[1],3n),true);assert.equal(f(e[1],5n),true);assert(choices.slice(1,5).some((c,i)=>f(e[i+1],2n)===true&&f(e[i+1],3n)===true&&f(e[i+1],5n)===true&&data.dataKey(f(c,7n))!==data.dataKey(items(f(rec(f(raw[i+1],2n),1376n),3n),'list')[0])));
  assert(records('main',1369n).slice(1,6).some(v=>f(v,3n)===true));assert.notDeepEqual(f(choices[1],4n),f(records('main',1364n,2)[1],4n));
  const status=(name,i,c=1)=>f(rec(f(records(name,1361n,c)[i],2n),1356n),2n).value;
  assert.equal(status('main',3,4),2n);assert.equal(status('deniedExecution',5),4n);assert.equal(status('cancelled',2),3n);
  for(const name of ['noGoal','noAccess','unavailableNow'])assert.equal(items(f(records(name,1376n)[1],3n),'list').length,1);
  assert.equal(f(ev('unknown')[1],8n),false);assert.equal(f(ev('unavailableFuture')[1],8n),true);assert.equal(f(ev('unavailableFuture')[1],9n).value,1n);
  assert.deepEqual(choices.slice(0,5),records('falseForecast',1364n).slice(0,5));assert.equal(f(ev('falseForecast')[5],5n),false);
  for(const [a,b] of [['main','falseUnitOutcome'],['unknown','denied'],['deniedExecution','hiddenPhysical']])assert.deepEqual(get(a).observerViews,get(b).observerViews);
const O=p+'campaign3-history-procrastination-rev1';
const receipt={status:'PASS',scope:'Fresh decode and original assertions over20 stored views; no fresh simulation or prefix restore.',runs:20,storedPrefixes:180,checkerSha256:hash(fs.readFileSync('scripts/check-history-procrastination.mjs')),resultSha256:hash(fs.readFileSync(p+'PROCRASTINATION_PUBLIC_RESULT_REV2.json'))};
fs.writeFileSync(O+'/view-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('PASS20 stored procrastination views and original contrasts.');
}finally{await server.close();}
