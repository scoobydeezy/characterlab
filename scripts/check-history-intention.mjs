import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',hash=b=>createHash('sha256').update(b).digest('hex');
const plan=JSON.parse(fs.readFileSync(p+'INTENTION_PLAN_REV2.json')),expected=JSON.parse(fs.readFileSync(p+'INTENTION_RESULT_REV2.json')),stored=JSON.parse(fs.readFileSync(p+'INTENTION_VIEWS_REV2.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
const m=await server.ssrLoadModule('/src/campaign3/intentionForgetting.ts');
for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
const views=[];let prefixes=0;
for(const row of plan.runs){
 const full=m.runIntention(row.law,row.input),safe=m.intentionSafeView(full),prior=expected.results.find(x=>x.law===row.law&&x.name===row.name),saved=stored.views.find(x=>x.law===row.law&&x.name===row.name);
 assert.deepEqual(full,saved.full);assert.deepEqual(safe,saved.safe);
 assert.equal(hash(m.intentionBytes(full)),prior.finalSha256);assert.equal(hash(m.intentionBytes(safe)),prior.safeSha256);
 for(let i=0;i<=8;i++){const partial=m.runIntention(row.law,row.input,i);assert.deepEqual(partial.rows,full.rows.slice(0,i));assert.deepEqual(partial.world,full.world.slice(0,i));if(i){const last=full.rows[i-1];assert.deepEqual(partial.state,{goal:last.goal,cue:last.observation.cue,opportunity:last.observation.opportunity,memory:last.retained});}else assert.deepEqual(partial.state,{goal:'Absent',cue:0,opportunity:false,memory:[]});assert.equal(hash(m.intentionBytes(partial)),prior.prefixHashes[i]);prefixes++;}
 views.push({law:row.law,name:row.name,full,safe});console.log(row.law+'/'+row.name+':9 exact component prefixes');
}
  const get=(name,law='RetainedCue')=>views.find(x=>x.law===law&&x.name===name),intent=(name,law)=>get(name,law).full.rows.map(x=>x.expression.intent);
  assert.deepEqual(intent('main'),[0,0,0,0,1,0,0,0]);assert.equal(get('main').full.world[4].success,true);
  for(const name of ['lost','lostB','noCue','wrongCue','cancelled','expired','noOpportunity','denied'])assert.deepEqual(intent(name),Array(8).fill(0));
  assert.equal(intent('routeB')[4],2);assert.equal(intent('lost','NoLoss')[4],1);assert.equal(intent('lostB','NoLoss')[4],2);assert.equal(intent('noCue','PersistentAccess')[2],1);assert.deepEqual(intent('lost','PersistentAccess'),Array(8).fill(0));
  assert.equal(get('lost').full.rows[4].goal,'Open');assert.equal(get('lost').full.state.goal,'Expired');assert.equal(get('cancelled').full.state.goal,'Cancelled');assert.equal(get('main').full.state.goal,'Fulfilled');
  assert.deepEqual(get('blocked').full.rows[4].expression,get('main').full.rows[4].expression);assert.equal(get('blocked').full.world[4].success,false);assert.equal(get('hidden').full.state.goal,'Expired');
  for(const [a,b] of [['hidden','hiddenBlocked'],['falseReceipt','trueReceipt'],['denied','deniedB']])assert.deepEqual(get(a).safe,get(b).safe);
  assert.equal(intent('noNeutral')[2],1);assert.equal(intent('lateCue')[5],1);
assert.equal(views.length,54);assert.equal(prefixes,486);
const O=p+'campaign3-history-intention-rev1';fs.mkdirSync(O,{recursive:true});
fs.writeFileSync(O+'/replay-check.json',JSON.stringify({status:'PASS',scope:'Fresh54 component trajectories and486 complete prefixes; exact original full/safe/prefix hashes and original semantic assertions. Not public scheduler/save replay.',runs:54,prefixes,checkerSha256:hash(fs.readFileSync('scripts/check-history-intention.mjs')),planSha256:hash(fs.readFileSync(p+'INTENTION_PLAN_REV2.json')),resultSha256:hash(fs.readFileSync(p+'INTENTION_RESULT_REV2.json'))},null,2)+'\n',{flag:'wx'});
console.log('PASS54 fresh trajectories/486 exact component prefixes.');
}finally{await server.close();}
