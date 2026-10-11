import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';import {createServer} from 'vite';
const P='docs/planning/',O=P+'campaign3-history-identity-recovery-rev1/',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex'),ref=path=>({path,sha256:sha(fs.readFileSync(path))});
fs.mkdirSync(O,{recursive:true});
const save=(name,v)=>{const p=O+name;if(fs.existsSync(p))assert.deepEqual(read(p),v);else fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});};
execFileSync(process.execPath,['scripts/check-identity-recovery-closure.mjs'],{stdio:'inherit'});
save('closure-check.json',{status:'PASS',scope:'Fresh original read-only result/closure checks; recorded native execution, tests and build remain historical.',checker:ref('scripts/check-identity-recovery-closure.mjs'),closure:ref(P+'IDENTITY_RECOVERY_CLOSURE_REV1.json')});
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const fx=await server.ssrLoadModule('/src/test/identityRecoveryFixtures.ts'),m=await server.ssrLoadModule('/src/campaign3/identityBeliefPublicModel.ts'),sm=await server.ssrLoadModule('/src/campaign3/identityPublicModel.ts');
 const e=await server.ssrLoadModule('/src/campaign3/identityEligibility.ts'),ef=await server.ssrLoadModule('/src/test/identityEligibilityFixtures.ts');
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),codec=await server.ssrLoadModule('/src/campaign3/identityBeliefPublicCodecs.ts'),bd=await server.ssrLoadModule('/src/campaign3/biologyPublicData.ts'),math=await server.ssrLoadModule('/src/substrate/exactMath.ts');
 const {list,text,unsigned:u,rational:q,canonicalEncode:enc}=c,br=codec.identityBeliefPublicRecord,Q=math.ExactRational,F=s=>Q.of(...s.split('/').map(BigInt)),str=x=>`${x.numerator}/${x.denominator}`;
 const optional=s=>list(s===null?[]:[q(...s.split('/').map(BigInt))]),holders=['self','observer-a','observer-b'];
 const evidence=(x,h)=>br(1445,[u(h),m.actor('Task'),text(x.proposition),u(x.ticket),q(x.polarity,1)]);
 const state=(s,h)=>br(1446,[u(h),list(s.history.map(x=>evidence(x,h))),optional(s.estimate.value),u(s.estimate.evidence)]);
 const plan=read(P+'IDENTITY_RECOVERY_PLAN_REV1.json'),models=new Map();
 for(const x of plan.models){const model=x.family==='Source'?await sm.compileIdentityModel(sm.identityRecipe('Task',x.law)):await m.compileBeliefModel(m.beliefRecipe(x.law));assert.equal(Buffer.from(model.modelIdentity.canonicalBytes).toString('hex'),x.identity);models.set(x.family+'/'+x.law,model);}
 let sourceRows=0,beliefRows=0,views=0,repeated=0;
 for(const entry of plan.runs){
  const fc=fx.recoveryCase(entry),model=models.get((fc.sourceOnly?'Source/':'Belief/')+entry.law),compiled=await (fc.sourceOnly?sm.compileIdentityInputs:m.compileBeliefInputs)(model,fc.initialState,fc.orderedInputs,fc.runSeed);
  assert.equal(Buffer.from(compiled.runIdentity.canonicalBytes).toString('hex'),entry.runIdentity);assert.equal(Buffer.from(fc.orderedInputs).toString('hex'),entry.inputHex);assert.equal(fc.runSeed[0],entry.seed);
  const r=read(P+`IDENTITY_RECOVERY_RUN_${entry.index}_REV1.json`);assert.equal(r.sourceOnly,fc.sourceOnly);
  const component=e.createEligibilityRun(fc.sourceOnly?entry.law:'Threshold',entry.seed,fc.input.source);while(await component.step()){}
  const fresh=component.snapshot().items[1].items.map(e.eligibilitySummary).map(x=>{const {at,chosen,authorship,probabilities,contribution,strength,executed}=x;return {at,chosen,authorship,probabilities,contribution,strength,executed};});
  assert.deepEqual(fresh,r.sourceRows);sourceRows+=fresh.length;
  for(let i=0;i<6;i++){assert.equal(r.prefixes[i].at,i);assert.equal(r.prefixes[i].nextSha256,r.prefixes[Math.min(i+1,5)].saveSha256);}assert.equal(r.saveSha256,r.prefixes[5].saveSha256);
  assert.equal(r.expressionSha256.length,5);assert.equal(new Set(r.expressionSha256).size,5);assert(r.expressionSha256.every(x=>/^[a-f0-9]{64}$/.test(x)));
  const expectedPhases={'1431@60':5,'1432@70':5,'1433@80':5,'1434@130':5,...(fc.sourceOnly?{}:{'1450@50':15,'1448@130':15,'1449@140':15})};assert.deepEqual(r.phaseCounts,expectedPhases);assert.equal(r.traceCount,fc.sourceOnly?45:90);
  if(fc.sourceOnly){assert.deepEqual(r.rows,[]);assert.deepEqual(r.observerSha256,[]);continue;}
  const histories=holders.map(()=>[]),observerValues=holders.map(()=>[]);assert.equal(r.rows.length,5);
  for(const [i,row] of r.rows.entries()){
   beliefRows++;assert.equal(row.at,i+1);const n=F(fresh[i].contribution).numerator,sign=n>0n?1:n<0n?-1:0;
   const observations=holders.map((holder,h)=>{const mode=fc.input.channels[i][h];return !sign||mode==='Absent'?null:{holder,target:'target',proposition:'positive-task-fidelity',ticket:i+1,polarity:mode==='Neutral'?0:mode==='Opposite'?-sign:sign};});assert.deepEqual(row.observations,observations);
   for(let h=0;h<3;h++)if(entry.law!=='NoLearning'&&observations[h])histories[h].push(observations[h]);
   const estimates=histories.map(xs=>({value:xs.length?str(entry.law==='Latest'?Q.of(BigInt(xs.at(-1).polarity)):Q.of(BigInt(xs.reduce((n,x)=>n+x.polarity,0)),BigInt(xs.length))):null,evidence:xs.length}));assert.deepEqual(row.states,histories.map((history,h)=>({history,estimate:estimates[h]})));
   for(let h=0;h<3;h++){
    const value=i?r.rows[i-1].states[h].estimate.value:null,goal=fc.input.goals[i][h],adverse=value===null?null:str(Q.of(1n).subtract(F(value).multiply(Q.of(BigInt(goal)))).divide(Q.of(2n))),affect=adverse===null?null:[adverse,adverse];assert.deepEqual(row.appraisals[h],{estimate:value,adverse,affect});
    observerValues[h].push(br(1450,[u(h+1),u(i+1),q(goal,1),optional(value),optional(adverse),bd.data(affect)]),br(1448,[u(h+1),u(i+1),list(observations[h]?[evidence(observations[h],h+1)]:[])]),br(1449,[u(h+1),u(i+1),state(row.states[h],h+1)]));
   }
  }
  for(let h=0;h<3;h++){assert.equal(sha(enc(list(observerValues[h]))),r.observerSha256[h]);views++;}
  if(['NeutralRecovery','Reversal'].includes(entry.name)){
   const old=read(P+`IDENTITY_BELIEF_PUBLIC_RUN_${entry.seed}_REV2.json`);for(const k of ['runIdentity','saveSha256','observerSha256','rows','sourceRows','phaseCounts','traceCount'])assert.deepEqual(r[k],old[k]);
   assert.deepEqual(r.prefixes.map(({at,saveSha256,nextSha256})=>({at,sha256:saveSha256,nextSha256})),old.prefixes);repeated++;
  }
  console.log(`Recovery case ${entry.index}: component source and native stored views match.`);
 }
 const exploration=read(P+'IDENTITY_RECOVERY_EXPLORATION_REV1.json');assert.equal(exploration.status,'EXPLORATORY, NOT QUALIFICATION');assert.equal(exploration.rows.length,24);
 const roster=['Meaningful','WorkOnly','HomeOnly'].flatMap(scenario=>Array.from({length:8},(_,seed)=>({scenario,seed})));assert.deepEqual(exploration.rows.map(({scenario,seed})=>({scenario,seed})),roster);
 for(const x of exploration.rows){const run=e.createEligibilityRun('Threshold',x.seed,ef.eligibilityInputs(x.scenario));while(await run.step()){}assert.deepEqual(run.snapshot().items[1].items.map(e.eligibilitySummary),x.rows);}
 assert.equal(sourceRows,65);assert.equal(beliefRows,55);assert.equal(views,33);assert.equal(repeated,2);
 save('schema-check.json',{status:'PASS',scope:'Fresh component source execution for all13 frozen native input cases and24 preserved exploration cases; read-only native model/run identities, recorded prefix links,55 holder rows and33 whole observer-view reconstructions. No fresh native execution or Save132 restore/tests/build.',models:5,nativeCasesChecked:13,sourceRows,beliefRows,observerViews:views,exactPriorCases:repeated,historicalNativePrefixes:78,explorationCases:24,checker:ref('scripts/check-history-identity-recovery.mjs')});
 console.log('PASS recovery source replay and native stored semantic/view checks.');
}finally{await server.close();}
