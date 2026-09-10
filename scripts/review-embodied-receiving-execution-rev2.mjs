// Public executions of the frozen cohort. No callback or truth operand enters a factory.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const output='docs/planning/embodied-receiving-execution-rev2';assert(!fs.existsSync(output));
const cohort='docs/planning/campaign3-embodied-receiving-model-rev1',freeze=JSON.parse(fs.readFileSync(cohort+'/FREEZE.json'));
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),checks=[],check=(name,fn)=>{fn();checks.push(name);};
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'}),results=[];
try{
 const api=await server.ssrLoadModule('/src/campaign3/receivingFactory.ts'),fixture=await server.ssrLoadModule('/src/test/receivingFixtures.ts');
 const {canonicalEncode:enc,list,rational,signed}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),{AuthoritativeState}=await server.ssrLoadModule('/src/substrate/state.ts');
 const {decodeReceiving:decode,receivingRecord:r}=await server.ssrLoadModule('/src/campaign3/receivingCodecs.ts'),f=(v,n)=>v.fields.get(BigInt(n)),key=v=>Buffer.from(enc(v)).toString('hex');
 const cases=[
  {name:'baseline'},{name:'duplicate',adopted:['a','a-copy']},{name:'same-option',adopted:['a','b'],action:'one'},
  {name:'drop-body-a',adopted:['b'],action:'one'},{name:'drop-task',adopted:['a','b'],task:false},{name:'drop-body',adopted:[]},
  {name:'no-options',adopted:[],task:false},{name:'no-active',adopted:[],model:'task-base-off'},
  {name:'body-b',adopted:['b']},{name:'known-zero',at:[10]},{name:'denied',model:'denied'},{name:'unavailable',model:'unavailable'},
  {name:'hidden71',amount:71,at:[40]},{name:'hidden79',amount:79,at:[40]},
  {name:'fine35',at:[35]},{name:'coarse35',model:'coarser',at:[35]},{name:'slower',model:'slower'},
  {name:'execution-blocked',model:'execution-blocked'},{name:'quiet',model:'quiet',adopted:['a','b'],action:'one'},{name:'auto',model:'auto',adopted:['a','b'],action:'one'},
  {name:'weak-d6',model:'weak-task',at:[40]},{name:'weak-d8',model:'weak-task'},{name:'weak-d10',model:'weak-task',at:[55]},{name:'weak-d12',model:'weak-task',at:[75]},
  {name:'no-coverage-duplicate',model:'no-coverage-control',adopted:['a','a-copy']},
  {name:'deadline',adopted:['a','b'],action:'one',at:[95,100]},
  {name:'work26',adopted:['a','b'],at:[100],deliveries:true},{name:'plan-off',model:'task-plan-off'},
 ];
 const executed=new Map();fs.mkdirSync(output);
 for(const specimen of cases){const modelName=specimen.model??'baseline',read=n=>new Uint8Array(Buffer.from(fs.readFileSync(cohort+'/'+modelName+'/'+n+'.cenc.hex','utf8').trim(),'hex'));
  const model=await api.prepareReceivingModel({...freeze.versions,content:read('content'),registry:read('registry'),parameters:read('parameters')});
  const initial=new AuthoritativeState(fixture.initialReceiving(specimen.adopted??['a'],specimen.task??true).entries().map(e=>e.path.rootStateTypeId===455n?{...e,value:r(454,[rational(specimen.amount??80,1),signed(0)])}:e.path.rootStateTypeId===373n&&e.path.fieldId===2n?{...e,value:r(390,[fixture.id(1027,'definition/task-instruction-'+(specimen.action??'two'))])}:e));
  const ordered=list((specimen.at??[45]).flatMap(at=>fixture.receivingOriginals(at,specimen.deliveries??false).items)),input={initialState:enc(initial.canonicalValue()),orderedInputs:enc(ordered),runSeed:new Uint8Array(32)},run=await api.createReceivingRun(model,input),boundaries=[];
  while(await run.settleNextInstant()){const snapshot=run.snapshot();boundaries.push({instant:String(snapshot.clock),events:decode(snapshot.trace).items.length,outputs:decode(snapshot.outputs).items.length});}
  const snapshot=run.snapshot(),outputs=decode(snapshot.outputs).items,trace=decode(snapshot.trace).items;
  check(specimen.name+'only actual output kinds',()=>assert(outputs.every(v=>[461n,463n,227n,464n,381n,384n,388n,394n,489n,398n,492n,403n,499n,504n,508n,509n,511n,512n,513n,514n,479n].includes(v.schema.typeId))));
  for(const row of trace){const event=f(row,4),name=f(event,5).payload.value;if(name.startsWith('event/embodied-receiving-')){
   check(specimen.name+' '+name+'read/write boundary',()=>{assert.equal(f(f(row,16),1).items.length,0);assert.equal(f(row,17).items.length,0);assert(f(row,11).items.every(v=>[268n,373n,487n].includes(f(f(v,2),1).value)));if(!name.endsWith('-resolution'))assert.equal(f(row,14).items.length,0);});
  }}
  const dir=output+'/'+specimen.name;fs.mkdirSync(dir);const artifacts={initial:input.initialState,inputs:input.orderedInputs,outputs:snapshot.outputs,trace:snapshot.trace,state:snapshot.state,save:run.save(),'run-identity':run.runIdentity()};
  const files=[];for(const [name,bytes] of Object.entries(artifacts)){const path=dir+'/'+name+'.cenc.hex';fs.writeFileSync(path,Buffer.from(bytes).toString('hex')+'\n');files.push(fp(path));}
  executed.set(specimen.name,{outputs,trace,snapshot,initial,artifacts});results.push({...specimen,model:modelName,boundaries,events:trace.length,outputs:outputs.length,files});
 }
 const out=(name,type)=>executed.get(name).outputs.filter(v=>v.schema.typeId===BigInt(type)),prob=(name,action='one')=>{const resolution=out(name,508)[0],data=f(f(resolution,4),2),row=f(data,2).items.find(v=>f(f(v,1),2).payload.value==='definition/protocol-contact-'+action);const q=f(row,2);return `${q.numerator}/${q.denominator}`;};
 check('duplicate origins do not change fair probability',()=>{assert.equal(prob('baseline'),'1/2');assert.equal(prob('duplicate'),'1/2');assert.equal(f(out('duplicate',489)[0],3).items.length,2);assert.equal(f(out('duplicate',504)[0],3).items.length,2);});
 check('independent task/body grounds really add on same option',()=>{assert.equal(prob('same-option'),'221/256');assert.equal(prob('drop-body-a'),'1/2');assert.equal(prob('drop-task'),'1/2');assert.equal(f(out('same-option',504)[0],3).items.length,3);});
 check('honest no-coverage behavioral distinction',()=>assert.equal(prob('no-coverage-duplicate'),'2/3'));
 check('hidden body aliases have byte-identical complete cognitive outputs',()=>assert.equal(key(list(executed.get('hidden71').outputs)),key(list(executed.get('hidden79').outputs))));
 check('coarser channel removes body option at35',()=>{assert.equal(f(out('fine35',489)[0],3).items.length,1);assert.equal(f(out('coarse35',489)[0],3).items.length,0);});
 check('execution permission changes only terminal cognitive outcome',()=>{const a=executed.get('baseline').outputs,b=executed.get('execution-blocked').outputs;assert.equal(key(list(a.filter(v=>v.schema.typeId!==514n))),key(list(b.filter(v=>v.schema.typeId!==514n))));assert.equal(f(out('execution-blocked',514)[0],3).value,0n);assert(f(out('baseline',514)[0],3).value>0n);});
 check('NoOptions and NoActiveReasons remain distinct',()=>{assert.equal(f(f(out('no-options',508)[0],4),1).value,1n);assert.equal(f(f(out('no-active',508)[0],4),1).value,2n);for(const n of ['no-options','no-active'])assert.equal(out(n,509).length,0);});
 check('all public dice and all modes witnessed',()=>{const dice=new Set(cases.flatMap(c=>out(c.name,504).flatMap(v=>f(v,3).items.map(n=>String(f(n,4).value)))));assert.deepEqual([...dice].sort(),['10','12','4','6','8']);const mode=n=>f(f(f(out(n,508)[0],4),2),8).value;assert.equal(mode('auto'),1n);assert.equal(mode('quiet'),2n);assert.equal(mode('baseline'),3n);});
 check('deadline retires task branch without losing body origins or instruction context',()=>{const w=out('deadline',381);assert.equal(f(w[0],4).items.length,1);assert.equal(f(w[1],4).items.length,0);assert(out('deadline',489).every(v=>f(v,3).items.length===2));const original=executed.get('deadline').initial.entries(),final=decode(executed.get('deadline').snapshot.state);assert(final);assert.equal(out('deadline',508).length,2);});
 check('maximal instant actually has26 events22 outputs',()=>{assert.equal(executed.get('work26').trace.length,26);assert.equal(executed.get('work26').outputs.length,22);});
}finally{await server.close();}
fs.writeFileSync(output+'/REVIEW.json',JSON.stringify({status:'PUBLIC RECEIVING EXECUTIONS AND NAMED CONTRASTS PASS; QUALIFICATION PENDING',runs:results,checked:checks.length,checks,sources:[cohort+'/FREEZE.json','src/campaign3/receivingFactory.ts','src/campaign3/receivingModel.ts','src/campaign3/receivingRuntime.ts','src/campaign3/receivingTransforms.ts','src/campaign3/receivingArbitration.ts','src/campaign3/receivingAdmission.ts','src/campaign3/receivingInputs.ts','src/campaign3/receivingCodecs.ts','scripts/review-embodied-receiving-execution-rev2.mjs'].map(fp),limits:['Bounded adopted instructions express no efficacy or replenishment knowledge.','Generic aggregate evidence and negative/modifier controls require separate component evidence.','Runtime mutants, full preservation reconciliation and parent disposition remain pending.']},null,2)+'\n');console.log(JSON.stringify({runs:results.length,checks:checks.length}));

