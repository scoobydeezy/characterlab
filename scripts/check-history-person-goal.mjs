import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex');
const p='docs/planning/',planPath=p+'PERSON_GOAL_PUBLIC_PLAN_REV1.json';
const plan=JSON.parse(fs.readFileSync(planPath)),result=JSON.parse(fs.readFileSync(p+'PERSON_GOAL_PUBLIC_RESULT_REV1.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
const m=await server.ssrLoadModule('/src/campaign3/personGoalModel.ts'),codec=await server.ssrLoadModule('/src/campaign3/personGoalCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
const views=new Map(),rows=[];
for(let i=0;i<4;i++){
 const w=JSON.parse(fs.readFileSync(p+'personGoal-public-workers-rev1/'+i+'.json'));
 assert.equal(w.planSha256,hash(fs.readFileSync(planPath)));
 assert.deepEqual(w.results.map(r=>r.runIdentity),plan.runs.filter((_,j)=>j%4===i).map(r=>r.runIdentity));
 assert.equal(w.restores,w.results.reduce((n,r)=>n+r.prefixes,0));
 for(const [k,v] of w.views){assert(!views.has(k));const bytes=Uint8Array.from(Buffer.from(v.outputs,'hex')),obs=v.observerViews.map(x=>Uint8Array.from(Buffer.from(x,'hex'))),[law,goal,...names]=k.split('/');
 const r=w.results.find(r=>r.law===Number(law)&&r.goal===Number(goal)&&r.name===names.join('/'));assert(r);
 assert.equal(hash(bytes),r.outputSha256);assert.deepEqual(obs.map(hash),r.observerSha256);
 views.set(k,{outputs:data.dataItems(codec.decodePersonGoal(bytes),'list'),observerViews:obs});}
 rows.push(...w.results);
}
assert.equal(rows.length,21);assert.equal(new Set(rows.map(r=>r.runIdentity)).size,21);assert.equal(views.size,21);
for(const r of result.results)assert.deepEqual(rows.find(x=>x.runIdentity===r.runIdentity),r);
  const get=(name,law=1,goal=1)=>views.get(law+'/'+goal+'/'+name),f=data.dataField,key=data.dataKey;
  const records=(name,type,law=1,goal=1)=>get(name,law,goal).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type),eq=(a,b)=>assert.deepEqual(a,b),list=canonical.list,q=canonical.rational,u=canonical.unsigned;
  const js=(name,i=0,law=1,goal=1)=>records(name,1186n,law,goal).filter(x=>key(f(x,3n))===key(m.HOLDERS[i]));
  const apps=(name,i=0,law=1,goal=1)=>records(name,1187n,law,goal).filter(x=>key(f(f(x,2n),3n))===key(m.HOLDERS[i]));
  eq(js('main').map(x=>f(x,6n)),[list([]),list([]),list([q(1,2)]),list([q(1,4)]),list([q(9,10)])]);eq(f(js('main',1)[3],6n),list([q(3,4)]));eq(f(apps('main')[3],5n),list([q(3,4),q(3,4)]));
  eq(records('main',1181n).map(x=>f(x,4n)),[0,1,2,4,1].map(u));for(const g of records('main',1191n))eq(g,records('main',1191n)[0]);
  eq(js('main').map(x=>f(x,6n)),js('alternate').map(x=>f(x,6n)));assert.notDeepEqual(records('main',1181n),records('alternate',1181n));eq(records('main',1191n),records('alternate',1191n));
  eq(f(js('failed')[4],6n),list([q(3,4)]));for(const [name,law] of [['failed',2],['unavailable',1],['unknown',1],['main',3]])for(const j of js(name,0,law))eq(f(j,6n),list([]));eq(records('failed',1190n),records('main',1190n));
  for(const t of [1181n,1190n,1182n,1183n,1186n,1188n,1191n])eq(records('main',t),records('main',t,1,2));eq(f(apps('main',0,1,2)[3],5n),list([q(1,4),q(1,4)]));
  eq(js('main').slice(0,3),js('accurate').slice(0,3));eq(f(js('accurate')[3],6n),list([q(3,4)]));eq(records('main',1182n),records('accurate',1182n));eq(f(js('main',0,2)[4],6n),list([q(3,4)]));
  eq(f(js('noAction')[4],6n),list([q(3,4)]));eq(f(js('noOutcome')[4],6n),list([q(3,4)]));
  eq(get('privacy').observerViews,get('hiddenGoal').observerViews);eq(get('privacy').observerViews,get('deniedMirror').observerViews);eq(get('main').observerViews[1],get('noA').observerViews[1]);for(const n of ['noB','otherMirror'])eq(get('main').observerViews[0],get(n).observerViews[0]);assert.notDeepEqual(get('privacy',4).observerViews,get('hiddenGoal',4).observerViews);
  eq(f(js('privacy',0,4)[1],6n),list([q(1,1)]));eq(f(js('hiddenGoal',0,4)[1],6n),list([q(0,1)]));
const O=p+'campaign3-history-person-goal-rev1';fs.mkdirSync(O,{recursive:true});
const receipt={status:'PASS',scope:'Fresh decode and original person-goal assertions over all21 stored worker views; no fresh simulation/prefix restore.',runs:21,storedPrefixes:126,checkerSha256:hash(fs.readFileSync('scripts/check-history-person-goal.mjs')),resultSha256:hash(fs.readFileSync(p+'PERSON_GOAL_PUBLIC_RESULT_REV1.json'))};
fs.writeFileSync(O+'/view-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
console.log('PASS21 stored views and original person-goal contrasts.');
}finally{await server.close();}
