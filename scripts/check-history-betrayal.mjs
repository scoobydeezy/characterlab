import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex');
const p='docs/planning/',planPath=p+'BETRAYAL_PUBLIC_PLAN_REV1.json';
const plan=JSON.parse(fs.readFileSync(planPath)),result=JSON.parse(fs.readFileSync(p+'BETRAYAL_PUBLIC_RESULT_REV1.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
const m=await server.ssrLoadModule('/src/campaign3/betrayalModel.ts'),codec=await server.ssrLoadModule('/src/campaign3/betrayalCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
const views=new Map(),rows=[];
for(let i=0;i<4;i++){
 const w=JSON.parse(fs.readFileSync(p+'betrayal-public-workers-rev1/'+i+'.json'));
 assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));
 assert.deepEqual(w.results.map(r=>r.runIdentity),plan.runs.filter((_,j)=>j%4===i).map(r=>r.runIdentity));
 assert.equal(w.restores,w.results.reduce((n,r)=>n+r.prefixes,0));
 for(const [k,v] of w.views){assert(!views.has(k));const bytes=Uint8Array.from(Buffer.from(v.outputs,'hex')),obs=v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex'))),[law,goal,...names]=k.split('/');
 const r=w.results.find(r=>r.law===Number(law)&&r.goal===Number(goal)&&r.name===names.join('/'));assert(r);
 assert.equal(hash(bytes),r.outputSha256);assert.deepEqual(obs.map(hash),r.observerSha256);
 views.set(k,{outputs:data.dataItems(codec.decodeBetrayal(bytes),'list'),observerViews:obs});}
 rows.push(...w.results);
}
assert.equal(rows.length,32);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,32);assert.equal(views.size,32);
for(const r of result.results)assert.deepEqual(rows.find(x=>x.runIdentity===r.runIdentity),r);
  const get=(name,law=1,goal=1)=>views.get(law+'/'+goal+'/'+name),f=data.dataField,key=data.dataKey,items=data.dataItems;
  const records=(name,type,law=1,goal=1)=>get(name,law,goal).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),list=canonical.list,q=canonical.rational,u=canonical.unsigned;
  const apps=(name,i=0,law=1,goal=1)=>records(name,1273n,law,goal).filter(x=>key(f(x,3n))===key(m.HOLDERS[i]));
  const lens=a=>[8n,9n,10n,11n].map(k=>f(a,k));
  const prob=(name,at,k=0,law=1,goal=1)=>{const p=records(name,1274n,law,goal).find(x=>key(f(f(x,2n),3n))===key(m.HOLDERS[0])&&key(f(f(x,2n),2n))===key(canonical.signed(at))&&key(f(x,3n))===key(u(k+1)));return f(items(f(p,6n),'list').find(x=>key(f(x,1n))===key(m.OPTIONS[0][k][0])),2n);};
  eq(lens(apps('main')[2]),[1,1,1,1].map(n=>list([q(n,1)])));eq(lens(apps('main')[4]),[1,0,1,0].map(n=>list([q(n,1)])));
  eq(prob('main',3),q(7,9));eq(prob('main',5),q(1,2));eq(prob('main',3,1),prob('main',5,1));eq(f(apps('main')[2],5n),f(apps('main')[4],5n));
  eq(f(apps('constrained')[4],9n),list([q(1,1)]));eq(f(apps('constrained')[4],13n),list([q(0,1)]));eq(prob('constrained',5),q(1,2));
  for(const name of ['noExplanation','deniedExplanation','missingLink','foreignEpisode','foreignTarget']){eq(f(apps(name)[4],11n),list([q(1,1)]));eq(prob(name,5),q(7,9));eq(apps(name).slice(0,3),apps('main').slice(0,3));}
  for(const name of ['noCommit','lateCommit','sameInstantCommit']){eq(f(apps(name)[2],12n),list([]));eq(f(apps(name)[2],11n),list([]));eq(f(apps(name)[7],12n),list([]));}
  for(const name of ['negativeCommit','success'])eq(f(apps(name)[2],11n),list([q(0,1)]));eq(f(apps('negativeCommit')[2],12n),list([q(0,1)]));
  eq(f(apps('willOnly')[4],11n),list([q(1,1)]));eq(prob('willOnly',5),q(7,9));eq(prob('willOnly',5,1),q(2,9));
  eq(prob('correctionWillFalse',5),prob('main',5));eq(prob('correctionWillFalse',5,1),q(2,9));
  eq(prob('main',5,0,2),q(7,9));eq(prob('constrained',5,0,2),q(7,9));eq(prob('main',3,0,3),q(1,2));eq(prob('noExplanation',5,0,3),prob('main',5,0,3));
  for(const law of [2,3])eq(records('main',1275n),records('main',1275n,law));
  for(const name of ['witnessA','unknownIntent','unknownControl','noFailure','missingCue']){eq(f(apps(name)[2],11n),list([]));eq(prob(name,3),q(1,2));}
  eq(f(apps('witnessA')[2],9n),list([q(1,1)]));
  eq(lens(apps('main',0,4)[4]),[list([]),list([]),list([]),list([])]);eq(lens(apps('unknown')[4]),[list([]),list([]),list([]),list([])]);
  for(const t of [1266n,1267n,1273n,1275n])eq(records('main',t),records('main',t,1,2));for(let k=0;k<2;k++)eq(prob('main',3,k,1,2),q(1,2));
  eq(get('main').observerViews,get('hiddenWorld').observerViews);eq(get('main').observerViews,get('denied').observerViews);eq(get('main').observerViews[1],get('noA').observerViews[1]);eq(get('main').observerViews[0],get('noB').observerViews[0]);assert.notDeepEqual(get('main',5).observerViews,get('hiddenWorld',5).observerViews);
const O=p+'campaign3-history-betrayal-rev1';fs.mkdirSync(O,{recursive:true});
const receipt={status:'PASS',scope:'Fresh decode and original betrayal assertions over all32 stored worker views; no fresh simulation/prefix restore.',runs:32,storedPrefixes:288,checkerSha256:hash(fs.readFileSync('scripts/check-history-betrayal.mjs')),resultSha256:hash(fs.readFileSync(p+'BETRAYAL_PUBLIC_RESULT_REV1.json'))};
fs.writeFileSync(O+'/view-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('PASS32 stored views and original betrayal contrasts.');
}finally{await server.close();}
