import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const m=await server.ssrLoadModule('/src/campaign3/controlModel.ts'),factory=await server.ssrLoadModule('/src/campaign3/controlFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/controlCodecs.ts'),d=await server.ssrLoadModule('/src/campaign2/canonicalData.ts');
 const planPath='docs/planning/CONTROL_PUBLIC_PLAN_REV2.json',plan=JSON.parse(fs.readFileSync(planPath)),rows=[];
 for(const [candidate,name] of [[1,'main'],[1,'noLoad'],[2,'main']]) {
  const row=plan.runs.find(r=>r.candidate===candidate&&r.law===1&&r.name===name),bytes=s=>Uint8Array.from(Buffer.from(s,'hex'));
  const run=await factory.createControlRun(await factory.prepareControlModel(m.controlRecipe({candidate,law:1})),{initialState:bytes(plan.initialState),orderedInputs:bytes(row.orderedInputs),runSeed:bytes(plan.runSeed)});
  assert.equal(Buffer.from(run.runIdentity()).toString('hex'),row.runIdentity);while(await run.settleNextInstant()){}
  const outputs=d.dataItems(codec.decodeControl(run.snapshot().outputs),'list'),records=t=>outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t);
  rows.push({candidate,name,actions:records(1024n).map(v=>d.dataField(v,3n)),drawsAt5:d.dataKey(d.dataField(records(1019n)[4],6n)),runIdentity:row.runIdentity});
 }
 assert.deepEqual(rows[0].actions,[true,true,true,false,true,false,false,true]);assert.equal(rows[1].actions[4],false);assert.equal(rows[0].drawsAt5,rows[2].drawsAt5);
 const fresh={status:'PASS',planSha256:createHash('sha256').update(fs.readFileSync(planPath)).digest('hex'),scope:'Same frozen runs: actual load-sensitive execution and exact matched at5 dice despite different earlier inhibition.',results:rows};
 assert.deepEqual(fresh,JSON.parse(fs.readFileSync('docs/planning/CONTROL_ACTION_WITNESS_REV1.json')));
 const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
 fs.mkdirSync('docs/planning/campaign3-history-control-rev1',{recursive:true});
 fs.writeFileSync('docs/planning/campaign3-history-control-rev1/action-check.json',JSON.stringify({status:'PASS',scope:'Fresh three-run actual action and matched draws equal original witness.',originalSha256:hash('docs/planning/CONTROL_ACTION_WITNESS_REV1.json'),checkerSha256:hash('scripts/replay-history-control-action.mjs')},null,2)+'\n',{flag:'wx'});

 console.log('PASS actual habit action under load; no-load idle; identical at5 draws after different earlier inhibition.');
}finally{await server.close();}
