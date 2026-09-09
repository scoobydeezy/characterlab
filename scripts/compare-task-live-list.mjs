// External research comparison, never a cognitive adapter or reference import in src/.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const output='docs/planning/TASK_LIFECYCLE_HISTORICAL_COMPARISON_REV1.json';assert(!fs.existsSync(output),'preserve prior comparison');
const paths=['reference/src/model/commitment.ts','reference/src/test/phase2_97CommitmentLifecycle.test.ts','src/campaign2/taskExecution.ts','src/campaign2/taskFactory.ts','src/campaign2/taskModel.ts','src/campaign2/taskModelReview.ts','scripts/compare-task-live-list.mjs'];
const fp=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),before=paths.map(fp);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),{AuthoritativeState}=await server.ssrLoadModule('/src/substrate/state.ts'),d=await server.ssrLoadModule('/src/campaign2/canonicalData.ts');
 const {taskRecord:r,decodeTask:decode}=await server.ssrLoadModule('/src/campaign2/taskCodecs.ts'),{taskModelReviewSource}=await server.ssrLoadModule('/src/campaign2/taskModelReview.ts'),{compileTaskModel}=await server.ssrLoadModule('/src/campaign2/taskModel.ts'),{prepareTaskModel,createTaskRun}=await server.ssrLoadModule('/src/campaign2/taskFactory.ts');
 const {commitmentSignals}=await server.ssrLoadModule('/reference/src/model/commitment.ts'),{Rational}=await server.ssrLoadModule('/reference/src/kernel/rational.ts');
 const source=taskModelReviewSource('recurrence',true,false),model=await compileTaskModel(source),id=(n,s)=>c.typedIdentifier(n,c.text(s));
 const state=new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:id(1000,'observer/bridge-subject')}]},value:r(267,[model.tasks[0].character])},...model.tasks.map(t=>({path:t.path,value:r(372,[c.unsigned(1)])}))]);
 const run=await createTaskRun(await prepareTaskModel(source),{initialState:c.canonicalEncode(state.canonicalValue()),orderedInputs:c.canonicalEncode(c.list([c.list([c.signed(2),c.unsigned(110),id(1001,'event/regulatory-diagnostic-probe'),r(333,[id(1027,'definition/regulatory-diagnostic-probe')]),c.list([])])])),runSeed:new Uint8Array(32)});
 const defs=model.tasks.map((_,i)=>({commitmentKey:`task-${i}`,stakeholder:'same-holder',fulfillingAction:'control/action',motiveChannel:'Commitment',activeObligationPressure:Rational.of(1,10)}));
 const option={actionDef:{actionKey:'control/action'}}; // Exactly the field read by the real reference component.
 const history=[];
 function observe(){const s=run.snapshot(),restored=model.stateModel.restoreState(s.state),live=model.tasks.flatMap((t,i)=>{const value=restored.read(t.path);return value.presence&&d.dataUnsigned(d.dataField(d.dataRecord(value.value,372n),1n))===1n&&t.activeFrom<=s.clock&&s.clock<t.deadline?[i]:[];});
  const control=commitmentSignals(option,live.map(i=>defs[i]));assert.deepEqual(control.map(x=>x.referent),live.map(i=>defs[i].commitmentKey));assert(control.every(x=>x.sourceRole==='MotiveGenerating'&&x.signedStrength.equals(Rational.of(1,10))));
  history.push({instant:String(s.clock),liveInstances:live,referenceSignals:control.map(x=>({referent:x.referent,role:x.sourceRole,strength:`${x.signedStrength.p}/${x.signedStrength.q}`}))});
 }
 observe();while(await run.settleNextInstant())observe();assert.deepEqual(history.map(x=>x.liveInstances),[[],[0],[0],[1],[]]);
 const simultaneous=commitmentSignals(option,defs);assert.equal(new Set(simultaneous.map(x=>x.referent)).size,2);assert(simultaneous.every(x=>x.referent!=='same-holder'));
 assert.deepEqual(paths.map(fp),before);fs.writeFileSync(output,JSON.stringify({status:'BOUNDED LIFECYCLE / ACTUAL HISTORICAL LIVE-LIST COMPARISON PASS',sourceFingerprints:before,history,sameHolderDistinctInstances:true,limitations:['Eligibility here is external test analysis of public quiescent state, not a canonical workspace or motive producer.','The reference function receives an explicitly selected live list; it does not implement the new automatic lifecycle.','Reference full identity-rich lifecycle controls execute separately in the preserved test suite.','No new Campaign2 motive, reason nucleus, identity, dice, action choice or social fulfillment is qualified.']},null,2)+'\n');console.log('PASS: '+history.length+' quiescent lifecycle checkpoints; distinct same-holder referents');
}finally{await server.close();}
