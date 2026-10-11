import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex');
const p='docs/planning/',planPath=p+'COMMUNICATION_PUBLIC_PLAN_REV2.json';
const plan=JSON.parse(fs.readFileSync(planPath)),result=JSON.parse(fs.readFileSync(p+'COMMUNICATION_PUBLIC_RESULT_REV2.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
const m=await server.ssrLoadModule('/src/campaign3/communicationModel.ts'),codec=await server.ssrLoadModule('/src/campaign3/communicationCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
const views=new Map(),rows=[];
for(let i=0;i<4;i++){
 const w=JSON.parse(fs.readFileSync(p+'communication-public-workers-rev2/'+i+'.json'));
 assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));
 assert.deepEqual(w.results.map(r=>r.runIdentity),plan.runs.filter((_,j)=>j%4===i).map(r=>r.runIdentity));
 assert.equal(w.restores,w.results.reduce((n,r)=>n+r.prefixes,0));
 for(const [k,v] of w.views){assert(!views.has(k));const bytes=Uint8Array.from(Buffer.from(v.outputs,'hex')),obs=v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex'))),[law,pressure,...names]=k.split('/');
 const r=w.results.find(r=>r.law===Number(law)&&r.pressure===Number(pressure)&&r.name===names.join('/'));assert(r);
 assert.equal(hash(bytes),r.outputSha256);assert.deepEqual(obs.map(hash),r.observerSha256);
 views.set(k,{outputs:data.dataItems(codec.decodeCommunication(bytes),'list'),observerViews:obs});}
 rows.push(...w.results);
}
assert.equal(rows.length,27);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,27);assert.equal(views.size,27);
for(const r of result.results)assert.deepEqual(rows.find(x=>x.runIdentity===r.runIdentity),r);
  const math=await server.ssrLoadModule('/src/campaign3/communicationMath.ts'),choice=await server.ssrLoadModule('/src/campaign2/cognitiveChoice.ts');
  const get=(name,law=1,pressure=1)=>views.get(law+'/'+pressure+'/'+name),f=data.dataField,rec=data.dataRecord,items=data.dataItems;
  const records=(name,type,law=1,pressure=1)=>get(name,law,pressure).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),u=canonical.unsigned,list=canonical.list,q=canonical.rational;
  const knowledge=(name,i,law=1,pressure=1)=>f(records(name,1080n,law,pressure).filter(v=>data.dataKey(f(v,2n))===data.dataKey(m.HOLDERS[i])).at(-1),4n);
  const value=(name,i,law=1,pressure=1)=>math.estimate(knowledge(name,i,law,pressure),law===2);
  for(const out of records('main',1078n))eq(f(out,3n),u(1));for(const out of records('main',1078n,1,2))eq(f(out,3n),u(2));
  eq(knowledge('main',0),knowledge('main',0,1,2));eq(value('main',1),list([q(1,2)]));eq(value('main',2),list([q(1,2)]));eq(value('main',1,1,2),list([]));
  eq(value('main',1,2),list([q(0,1)]));eq(value('main',1,5),list([]));eq(records('main',1070n),records('main',1070n,5));
  eq(value('failed',1),list([]));eq(value('failed',1,4),list([q(1,2)]));for(const t of [425n,426n])eq(records('main',t),records('failed',t));
  eq(value('unknown',1),list([]));eq(value('negative',1),list([q(0,1)]));eq(value('misleading',1),list([q(1,1)]));eq(f(records('misleading',1079n)[0],3n),false);
  for(const out of records('main',409n,1,3)){const data=choice.chosenData(out);assert.equal(items(f(data,9n),'list').length,2);for(const p of items(f(data,2n),'list'))eq(f(p,2n),q(1,2));}
  eq(get('main').observerViews,get('hiddenTruth').observerViews);eq(get('main',1,2).observerViews,get('concealedChange',1,2).observerViews);
  eq(get('main').observerViews[1],get('noA').observerViews[1]);eq(get('main').observerViews[0],get('noB').observerViews[0]);
  eq(get('main',1,3).observerViews,get('hiddenTruth',1,3).observerViews);eq(get('main',1,3).observerViews[1],get('noA',1,3).observerViews[1]);
  assert.notDeepEqual(get('main',3,2).observerViews,get('concealedChange',3,2).observerViews);

const O=p+'campaign3-history-communication-rev1';fs.mkdirSync(O,{recursive:true});
const receipt={status:'PASS',scope:'Fresh decode and original communication assertions over all27 stored worker views; no fresh simulation/prefix restore.',runs:27,storedPrefixes:130,checkerSha256:hash(fs.readFileSync('scripts/check-history-communication.mjs')),resultSha256:hash(fs.readFileSync(p+'COMMUNICATION_PUBLIC_RESULT_REV2.json'))};
fs.writeFileSync(O+'/view-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('PASS27 stored views and original communication contrasts.');
}finally{await server.close();}
