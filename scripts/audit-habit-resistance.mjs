import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'CONTROL_PUBLIC_PLAN_REV2.json',resultPath=p+'CONTROL_PUBLIC_RESULT_REV2.json';
const hash=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const m=await server.ssrLoadModule('/src/campaign3/controlModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/controlFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/controlCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),fx=await server.ssrLoadModule('/src/test/controlFixtures.ts');
  const plan=JSON.parse(fs.readFileSync(planPath));
  for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
  const rows=[],views=new Map();let restores=0,advancing=0;
  for(const row of plan.runs) {
   const source=m.controlRecipe({candidate:row.candidate,law:row.law}),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),run=await factory.createControlRun(await factory.prepareControlModel(source),{initialState:canonical.canonicalEncode((await m.compileControlModel(m.controlRecipe())).initial.canonicalValue()),orderedInputs,runSeed:fx.seed});
   assert.equal(hex(run.runIdentity()),row.runIdentity);const saves=[run.save()];
   while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++) {
    const restored=await factory.restoreControlRun(source,{initialState:canonical.canonicalEncode((await m.compileControlModel(m.controlRecipe())).initial.canonicalValue()),orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);
    const advances=await restored.settleNextInstant();assert.equal(advances,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advances)advancing++;
   }
   const outputs=data.dataItems(codec.decodeControl(run.snapshot().outputs),'list'),observerViews=[run.observerView(0)];
   views.set(`${row.candidate}/${row.law}/${row.name}`,{outputs,observerViews});
   rows.push({...row,prefixes:saves.length,saveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputSha256:hash(run.snapshot().outputs),observerSha256:observerViews.map(hash)});
   console.log(`${row.candidate}/${row.law}/${row.name}: ${saves.length} exact prefixes`);
  }
  const get=(name,candidate=1,law=1)=>views.get(candidate+'/'+law+'/'+name),f=data.dataField,rec=data.dataRecord,items=data.dataItems;
  const records=(name,type,candidate=1,law=1)=>get(name,candidate,law).outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));
  const inhibit=(name,c=1)=>records(name,1015n,c).map(v=>f(v,5n));
  assert.deepEqual(inhibit('main'),[false,false,false,true,false,true,true,false]);
  assert.equal(inhibit('main',2)[3],false);assert.equal(inhibit('main',3)[4],true);
  assert.equal(inhibit('lost')[4],false);assert.equal(inhibit('lost',4)[4],true);
  assert.equal(items(f(records('main',827n,5)[7],3n),'list').length,1);
  assert.equal(items(f(records('main',827n)[7],3n),'list').length,2);
  assert.equal(items(f(records('main',827n,6)[4],3n),'list').length,1);
  assert.notDeepEqual(f(rec(f(records('main',1015n)[3],1n),826n),5n),f(rec(f(records('main',1015n,1,2)[3],1n),826n),5n));
  for(const [a,b] of [['hidden','absent'],['main','hiddenReward']])assert.deepEqual(get(a).observerViews,get(b).observerViews);
  assert.deepEqual(f(records('main',1015n)[4],1n),f(records('noLoad',1015n)[4],1n));
  for(const h of records('main',837n).slice(3))assert.deepEqual(f(h,4n),f(h,5n));
  for(const name of ['otherCue','unseenTraining'])assert.equal(items(f(records(name,827n)[4],3n),'list').length,1);
  assert(inhibit('noGoal').every(x=>x===false));
  const result={status:'PASS',planSha256:hash(fs.readFileSync(planPath)),models:7,runs:rows.length,restores,advancing,terminal:restores-advancing,results:rows};
  assert.deepEqual(result,JSON.parse(fs.readFileSync(resultPath)),'Frozen CONTROL replay drift');
  const summaries=rows.map(row=>{
   const r=t=>records(row.name,t,row.candidate,row.law);
   return {candidate:row.candidate,law:row.law,name:row.name,runIdentity:row.runIdentity,
    actions:r(1024n).map(v=>f(v,3n)),inhibition:r(1015n).map(v=>f(v,5n)),
    retainedGoal:r(1015n).map(v=>f(v,2n)),maintainedGoal:r(1015n).map(v=>f(v,3n)),
    optionCounts:r(827n).map(v=>items(f(v,3n),'list').length),
    historyUnchangedAfterTraining:r(837n).slice(3).every(v=>data.dataKey(f(v,4n))===data.dataKey(f(v,5n)))};
  });
  const baseline=summaries.find(r=>r.name==='main'&&r.candidate===1&&r.law===1);
  assert.deepEqual(baseline.actions,[true,true,true,false,true,false,false,true]);
  assert(baseline.historyUnchangedAfterTraining);
  assert.equal(summaries.find(r=>r.name==='noLoad').actions[4],false);
  const receipt={status:'PASS',scope:'Reconciliation of existing CONTROL public evidence for Brief12.9 clause3; no new models or runs',models:7,reexecutedRuns:17,restores,advancing,terminal:restores-advancing,
   artifacts:[planPath,resultPath,'scripts/audit-habit-resistance.mjs'].map(path=>({path,sha256:hash(fs.readFileSync(path))})),summaries};
  fs.writeFileSync(p+'HABIT_RESISTANCE_REPLAY_REV1.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
  console.log('PASS unchanged CONTROL identities/results:17 runs/142 prefixes; actual inhibited action and later return.');

} finally {await server.close();}
