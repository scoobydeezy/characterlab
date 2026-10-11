import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex');
const p='docs/planning/',planPath=p+'ATTACHMENT_PUBLIC_PLAN_REV1.json';
const plan=JSON.parse(fs.readFileSync(planPath)),result=JSON.parse(fs.readFileSync(p+'ATTACHMENT_PUBLIC_RESULT_REV1.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
const m=await server.ssrLoadModule('/src/campaign3/attachmentModel.ts'),codec=await server.ssrLoadModule('/src/campaign3/attachmentCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
const views=new Map(),rows=[];
for(let i=0;i<4;i++){
 const w=JSON.parse(fs.readFileSync(p+'attachment-public-workers-rev1/'+i+'.json'));
 assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));
 assert.deepEqual(w.results.map(r=>r.runIdentity),plan.runs.filter((_,j)=>j%4===i).map(r=>r.runIdentity));
 assert.equal(w.restores,w.results.reduce((n,r)=>n+r.prefixes,0));
 for(const [k,v] of w.views){assert(!views.has(k));const bytes=Uint8Array.from(Buffer.from(v.outputs,'hex')),obs=v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex'))),[law,goal,...names]=k.split('/');
 const r=w.results.find(r=>r.law===Number(law)&&r.goal===Number(goal)&&r.name===names.join('/'));assert(r);
 assert.equal(hash(bytes),r.outputSha256);assert.deepEqual(obs.map(hash),r.observerSha256);
 views.set(k,{outputs:data.dataItems(codec.decodeAttachment(bytes),'list'),observerViews:obs});}
 rows.push(...w.results);
}
assert.equal(rows.length,25);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,25);assert.equal(views.size,25);
for(const r of result.results)assert.deepEqual(rows.find(x=>x.runIdentity===r.runIdentity),r);
  const get=(name,law=1,goal=1)=>views.get(law+'/'+goal+'/'+name),f=data.dataField,key=data.dataKey,items=data.dataItems;
  const records=(name,type,law=1,goal=1)=>get(name,law,goal).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),list=canonical.list,q=canonical.rational,u=canonical.unsigned;
  const apps=(name,i=0,law=1,goal=1)=>records(name,1259n,law,goal).filter(x=>key(f(x,3n))===key(m.HOLDERS[i]));
  const lens=a=>[8n,9n,10n,11n].map(k=>f(a,k));
  const prob=(name,k=0,law=1,goal=1)=>{const p=records(name,1260n,law,goal).find(x=>key(f(f(x,2n),3n))===key(m.HOLDERS[0])&&key(f(f(x,2n),2n))===key(canonical.signed(3))&&key(f(x,3n))===key(u(k+1)));return f(items(f(p,6n),'list').find(x=>key(f(x,1n))===key(m.OPTIONS[0][k][0])),2n);};
  eq(lens(apps('main')[2]),[1,1,1,0].map(n=>list([q(n,1)])));eq(f(apps('oneSupport')[2],8n),list([q(1,2)]));eq(f(apps('oneSupport')[2],9n),list([q(1,1)]));eq(prob('main'),q(7,9));eq(prob('main',1),q(1,2));assert.notDeepEqual(prob('oneSupport'),prob('main'));
  for(const name of ['selfSufficient','incidental']){eq(f(apps(name)[2],9n),f(apps('main')[2],9n));eq(f(apps(name)[2],8n),list([q(0,1)]));eq(prob(name),q(1,2));eq(f(apps(name,0,2)[2],8n),list([q(1,1)]));}
  eq(f(apps('present')[2],8n),f(apps('main')[2],8n));eq(f(apps('present')[2],10n),list([q(0,1)]));eq(prob('present'),q(1,2));
  eq(f(apps('noAlternative')[2],10n),f(apps('main')[2],10n));eq(f(apps('noAlternative')[2],11n),list([q(1,1)]));eq(prob('noAlternative',1),q(7,9));eq(f(apps('noCurrentDemand')[2],10n),list([q(1,1)]));eq(f(apps('noCurrentDemand')[2],11n),list([q(0,1)]));
  for(const law of [3,4]){eq(f(apps('main',0,law)[2],9n),list([q(1,1)]));eq(f(apps('main',0,law)[2],10n),list([q(0,1)]));eq(prob('main',0,law),q(1,2));}eq(f(apps('noAlternative',0,3)[2],10n),list([q(1,1)]));
  eq(f(apps('noHistory')[2],9n),list([]));eq(f(apps('unresolved')[2],9n),list([q(0,1)]));eq(f(apps('unresolved')[2],8n),list([q(0,1)]));eq(f(apps('witnessA')[2],9n),list([q(1,1)]));eq(f(apps('witnessA')[2],8n),list([q(0,1)]));eq(f(apps('main',1)[2],8n),list([q(0,1)]));
  eq(apps('main').filter(a=>key(f(a,4n))===key(m.TARGETS[0])),apps('otherTarget').filter(a=>key(f(a,4n))===key(m.TARGETS[0])));eq(f(apps('missingCue')[2],10n),list([]));eq(f(apps('missingCue')[2],8n),list([q(1,1)]));
  eq(f(apps('main')[6],9n),list([q(2,3)]));eq(f(apps('oneSupport')[6],9n),list([q(1,2)]));eq(f(apps('main')[6],8n),list([q(1,1)]));
  for(const t of [1252n,1253n,1259n,1261n])eq(records('main',t),records('main',t,1,2));for(const k of [0,1])eq(prob('main',k,1,2),q(1,2));
  eq(get('main').observerViews,get('hiddenWorld').observerViews);eq(get('main').observerViews,get('denied').observerViews);eq(get('main').observerViews[1],get('noA').observerViews[1]);eq(get('main').observerViews[0],get('noB').observerViews[0]);assert.notDeepEqual(get('main',5).observerViews,get('hiddenWorld',5).observerViews);
const O=p+'campaign3-history-attachment-rev1';fs.mkdirSync(O,{recursive:true});
const receipt={status:'PASS',scope:'Fresh decode and original attachment assertions over all25 stored worker views; no fresh simulation/prefix restore.',runs:25,storedPrefixes:200,checkerSha256:hash(fs.readFileSync('scripts/check-history-attachment.mjs')),resultSha256:hash(fs.readFileSync(p+'ATTACHMENT_PUBLIC_RESULT_REV1.json'))};
fs.writeFileSync(O+'/view-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('PASS25 stored views and original attachment contrasts.');
}finally{await server.close();}
