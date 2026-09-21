import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex');
const hex=b=>Buffer.from(b).toString('hex');
const planPath='docs/planning/LEARN_PUBLIC_EXPERIMENT_PLAN_REV1.json';
const resultPath='docs/planning/LEARN_PUBLIC_EXPERIMENT_REV1.json';
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const fx=await server.ssrLoadModule('/src/test/learnFixtures.ts');
 const model=await server.ssrLoadModule('/src/campaign3/learnModel.ts');
 const factory=await server.ssrLoadModule('/src/campaign3/learnFactory.ts');
 const codec=await server.ssrLoadModule('/src/campaign3/learnCodecs.ts');
 const data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts');
 const canonical=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const runs=[];
 for(const law of [1,2,3])for(const numeric of [1,2])for(const name of ['compatible','inconsistent','zero','repeated','hidden','missing'])runs.push({name,law,numeric});
 for(const name of ['positiveZero','repeatedEstablished','twoTargets'])runs.push({name,law:1,numeric:1});
 if(process.argv.includes('--plan')){
  const rows=[];
  for(const row of runs){const source=model.learnRecipe(row.law,row.numeric),m=await model.compileLearnModel(source),inputs=fx.originals(fx.learnCases()[row.name]),compiled=await model.compileLearnInputs(m,fx.initialState,inputs,fx.seed);rows.push({...row,modelIdentity:hex(m.modelIdentity.canonicalBytes),runIdentity:hex(compiled.runIdentity.canonicalBytes),orderedInputs:hex(inputs)});}
  fs.writeFileSync(planPath,JSON.stringify({contract:'learn-public/0.1-candidate',status:'FROZEN BEFORE PUBLIC EXECUTION',contractSha256:hash(fs.readFileSync('docs/formal/LEARN_PUBLIC_CONTRACT.md')),modelsSha256:hash(fs.readFileSync('docs/planning/campaign3-learn-model-rev1/FREEZE.json')),gates:['four exact corpus contrasts','Gated versus UnconditionalPrecision and PointOnly','hidden overflow equality','missing is not zero','prior acquired from empty S0','later50 probe only','every-prefix exact save continuation','established-prior repeated-bound limitation'],runs:rows},null,2)+'\n',{flag:'wx'});console.log('Frozen39-run plan');
 }else{
  assert(!fs.existsSync(resultPath),'immutable result exists');
  const plan=JSON.parse(fs.readFileSync(planPath));assert.equal(plan.contractSha256,hash(fs.readFileSync('docs/formal/LEARN_PUBLIC_CONTRACT.md')));assert.equal(plan.modelsSha256,hash(fs.readFileSync('docs/planning/campaign3-learn-model-rev1/FREEZE.json')));
  const results=[],views=new Map();let restores=0,advancing=0;
  for(const row of plan.runs){
   const source=model.learnRecipe(row.law,row.numeric),orderedInputs=Uint8Array.from(Buffer.from(row.orderedInputs,'hex')),handle=await factory.prepareLearnModel(source),run=await factory.createLearnRun(handle,{initialState:fx.initialState,orderedInputs,runSeed:fx.seed});assert.equal(hex(run.runIdentity()),row.runIdentity);
   const saves=[run.save()];while(await run.settleNextInstant())saves.push(run.save());
   for(let i=0;i<saves.length;i++){const restored=await factory.restoreLearnRun(source,{initialState:fx.initialState,orderedInputs,save:saves[i]});assert.deepEqual(restored.save(),saves[i]);const advanced=await restored.settleNextInstant();assert.equal(advanced,i+1<saves.length);assert.deepEqual(restored.save(),saves[Math.min(i+1,saves.length-1)]);restores++;if(advanced)advancing++;}
   const outputs=data.dataItems(codec.decodeLearn(run.snapshot().outputs),'list'),apps=fx.applications(outputs),last=apps.at(-1),posterior=last?.fields.get(4n),id=`${row.law}/${row.numeric}/${row.name}`;
   const q=v=>{const x=v;return `${x.numerator}/${x.denominator}`;};
   const states=apps.map(a=>{const v=a.fields.get(4n);return v?{mean:q(data.dataField(data.dataRecord(v,889n),1n)),precision:q(data.dataField(data.dataRecord(v,889n),2n)),applied:data.dataField(a,5n)}:{unknown:true,applied:data.dataField(a,5n)};});
   views.set(id,{state:run.snapshot().state,outputs:run.snapshot().outputs,states});
   results.push({name:row.name,law:row.law,numeric:row.numeric,runIdentity:row.runIdentity,prefixes:saves.length,finalSaveSha256:hash(run.save()),stateSha256:hash(run.snapshot().state),outputsSha256:hash(run.snapshot().outputs),trajectory:states});
   console.log('Executed '+id+' prefixes='+saves.length);
  }
  const state=(law,name)=>views.get(`${law}/1/${name}`).states.at(-1);
  assert.deepEqual(state(1,'compatible'),{mean:'2/5',precision:'50/1',applied:false});
  assert.deepEqual(state(1,'inconsistent'),{mean:'27/520',precision:'52/1',applied:true});
  assert.deepEqual(state(1,'zero'),{unknown:true,applied:false});
  assert.deepEqual(state(1,'repeated'),{mean:'13/50',precision:'4/1',applied:true});
  assert.deepEqual(state(2,'repeated'),{mean:'51/350',precision:'14/1',applied:true});
  assert.equal(state(2,'compatible').precision,'52/1');assert.equal(state(2,'zero').precision,'2/1');assert.equal(state(3,'inconsistent').mean,'1/20');
  for(const law of [1,2,3])for(const numeric of [1,2]){
   const a=views.get(`${law}/${numeric}/repeated`),b=views.get(`${law}/${numeric}/hidden`);assert.deepEqual(a.outputs,b.outputs);assert.deepEqual(a.state,b.state);
   assert.equal(views.get(`${law}/${numeric}/missing`).states.length,1);
  }
  assert.equal(state(1,'positiveZero').precision,'50/1');assert.equal(state(1,'repeatedEstablished').precision,'62/1');
  fs.writeFileSync(resultPath,JSON.stringify({status:'PASS',planSha256:hash(fs.readFileSync(planPath)),runs:results.length,restores,advancing,terminal:restores-advancing,results},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({status:'PASS',runs:results.length,restores,advancing}));
 }
}finally{await server.close();}
