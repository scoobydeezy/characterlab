import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex');
const p='docs/planning/',planPath=p+'FATIGUE_PUBLIC_PLAN_REV1.json';
const plan=JSON.parse(fs.readFileSync(planPath)),result=JSON.parse(fs.readFileSync(p+'FATIGUE_PUBLIC_RESULT_REV1.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
const m=await server.ssrLoadModule('/src/campaign3/fatigueModel.ts'),codec=await server.ssrLoadModule('/src/campaign3/fatigueCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
const fx=await server.ssrLoadModule('/src/test/fatigueFixtures.ts');
const views=new Map(),stored=JSON.parse(fs.readFileSync(p+'FATIGUE_PUBLIC_VIEWS_REV1.json'));
assert.equal(stored.planSha256,hash(fs.readFileSync(planPath)));
for(const [k,v] of stored.views){assert(!views.has(k));const bytes=Uint8Array.from(Buffer.from(v.outputs,'hex')),obs=v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex')));
const r=result.results.find(r=>r.candidate+'/'+r.law+'/'+r.name===k);assert(r);assert.equal(hash(bytes),r.outputSha256);assert.deepEqual(obs.map(hash),r.observerSha256);
views.set(k,{outputs:data.dataItems(codec.decodeFatigue(bytes),'list'),observerViews:obs});}
assert.equal(views.size,20);assert.equal(result.results.length,20);assert.equal(new Set(result.results.map(r=>r.runIdentity)).size,20);
  const get=(name,candidate=1,law=1)=>views.get(candidate+'/'+law+'/'+name),f=data.dataField,rec=data.dataRecord,items=data.dataItems;
  const records=(name,type,candidate=1,law=1)=>get(name,candidate,law).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
  const inhibit=(name,c=1)=>records(name,1339n,c).map(v=>f(v,5n));
  const impair=(name,c=1)=>records(name,1339n,c).map(v=>f(v,7n));
  assert.deepEqual(inhibit('main'),[false,false,false,true,false,false,false,true]);
  assert.deepEqual(impair('main'),[false,false,false,false,true,true,true,false]);
  for(const c of [2,3])assert(impair('main',c).every(x=>x===false));assert.deepEqual(impair('main',4),impair('main'));
  assert.equal(impair('mild')[4],false);assert.equal(impair('mild',4)[4],true);
  assert.deepEqual(inhibit('externalLoad'),inhibit('main'));assert(impair('externalLoad').every(x=>x===false));
  assert.equal(impair('missingRecovery')[7],true);assert(impair('missingOnset').every(x=>x===false));
  for(const [a,b] of [['main','falseFatigue'],['main','falseRecovery'],['main','hiddenReward'],['absent','denied']])assert.deepEqual(get(a).observerViews,get(b).observerViews);
  for(const h of records('main',837n).slice(3))assert.deepEqual(f(h,4n),f(h,5n));
  const ev=records('main',1339n);for(const i of [5,6])assert.deepEqual(f(ev[i],6n),f(ev[4],6n));for(const c of [2,3,4])for(let i=0;i<8;i++)assert.deepEqual(f(records('main',1339n,c)[i],6n),f(ev[i],6n));
  assert.equal(f(ev[2],8n),false);assert.equal(f(ev[3],8n),true);assert.equal(f(ev[3],9n).value,0n);
  assert.equal(items(f(records('main',827n)[4],3n),'list').length,2);assert.equal(items(f(records('main',827n)[7],3n),'list').length,1);
  const execution=records('main',1348n);assert.equal(f(execution[3],3n),false);assert.equal(f(execution[7],3n),false);assert(execution.slice(4,7).some(x=>f(x,3n)===true));
  assert.deepEqual(records('motorChallenge',1344n)[3],records('motorChallenge',1344n,3)[3]);assert.deepEqual(records('motorChallenge',1345n)[3],records('motorChallenge',1345n,3)[3]);assert.equal(f(records('motorChallenge',1348n)[3],3n),true);assert.equal(f(records('motorChallenge',1348n,3)[3],3n),false);
const O=p+'campaign3-history-fatigue-rev1';
const receipt={status:'PASS',scope:'Fresh decode and original assertions over20 stored views; no fresh simulation or prefix restore.',runs:20,storedPrefixes:180,checkerSha256:hash(fs.readFileSync('scripts/check-history-fatigue.mjs')),resultSha256:hash(fs.readFileSync(p+'FATIGUE_PUBLIC_RESULT_REV1.json'))};
fs.writeFileSync(O+'/view-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('PASS20 stored fatigue views and original contrasts.');
}finally{await server.close();}
