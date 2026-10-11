import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const P='docs/planning/',O=P+'campaign3-history-identity-belief-public-rev1/';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const ref=path=>({path,sha256:sha(fs.readFileSync(path))});
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const m=await server.ssrLoadModule('/src/campaign3/identityBeliefPublicModel.ts');
 const fx=await server.ssrLoadModule('/src/test/identityBeliefPublicFixtures.ts');
 const codec=await server.ssrLoadModule('/src/campaign3/identityBeliefPublicCodecs.ts');
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const bd=await server.ssrLoadModule('/src/campaign3/biologyPublicData.ts');
 const math=await server.ssrLoadModule('/src/substrate/exactMath.ts');
 const {list,text,unsigned:u,rational:q,canonicalEncode:enc}=c,br=codec.identityBeliefPublicRecord;
 const Q=math.ExactRational,F=s=>Q.of(...s.split('/').map(BigInt)),str=x=>`${x.numerator}/${x.denominator}`;
 const optional=s=>list(s===null?[]:[q(...s.split('/').map(BigInt))]);
 const holders=['self','observer-a','observer-b'];
 const evidence=(e,h)=>br(1445,[u(h),m.actor('Task'),text(e.proposition),u(e.ticket),q(e.polarity,1)]);
 const state=(s,h)=>br(1446,[u(h),list(s.history.map(e=>evidence(e,h))),optional(s.estimate.value),u(s.estimate.evidence)]);
 let rows=0,views=0,workers=0;
 const plans=[1,2].map(rev=>read(P+`IDENTITY_BELIEF_PUBLIC_PLAN_REV${rev}.json`));
 assert.deepEqual(plans[0].models,plans[1].models);
 assert.deepEqual(plans[0].runs,plans[1].runs);
 const models=new Map();
 for(const entry of plans[1].models){
  const model=await m.compileBeliefModel(m.beliefRecipe(entry.law));
  assert.equal(Buffer.from(model.modelIdentity.canonicalBytes).toString('hex'),entry.modelIdentity);
  models.set(entry.law,model);
  for(const h of [1,2,3]){
   assert.deepEqual(m.writes('Task','learn'+h),[m.path('Task',1447,h)]);
   assert.deepEqual(m.reads('Task','appraise'+h,entry.law),[m.path('Task',1447,h)]);
   if(['Mean','Latest','NoLearning'].includes(entry.law))assert.deepEqual(m.reads('Task','learn'+h,entry.law),[m.path('Task',1447,h)]);
  }
 }
 for(const rev of [1,2]){
  const plan=plans[rev-1],planSha=sha(fs.readFileSync(P+`IDENTITY_BELIEF_PUBLIC_PLAN_REV${rev}.json`));
  for(let part=0;part<4;part++){
   const r=read(P+`IDENTITY_BELIEF_PUBLIC_PART${part}_REV${rev}.json`);
   assert.equal(r.status,'PASS');assert.equal(r.planSha256,planSha);
   assert.deepEqual(r.completed,plan.runs.filter(x=>x.index%4===part).map(x=>P+`IDENTITY_BELIEF_PUBLIC_RUN_${x.index}_REV${rev}.json`));
  }
  for(const entry of plan.runs){
   const fc=fx.beliefCase(entry.law,entry.scenario,entry.seed);
   // Admission and identity construction only. No runtime or simulation is created.
   const compiled=await m.compileBeliefInputs(models.get(entry.law),fc.initialState,fc.orderedInputs,fc.runSeed);
   assert.equal(Buffer.from(compiled.runIdentity.canonicalBytes).toString('hex'),entry.runIdentity);
   const r=read(P+`IDENTITY_BELIEF_PUBLIC_RUN_${entry.index}_REV${rev}.json`);workers++;
   assert.equal(r.status,'PASS');assert.equal(r.planSha256,planSha);
   for(const k of ['index','law','scenario','seed','runIdentity'])assert.deepEqual(r[k],entry[k]);
   assert.equal(sha(fs.readFileSync(entry.component.path)),entry.component.sha256);
   const component=read(entry.component.path);
   assert.deepEqual(r.sourceRows,component.rows.map(({source:s})=>{const {at,chosen,authorship,probabilities,contribution,strength,executed}=s;return {at,chosen,authorship,probabilities,contribution,strength,executed};}));
   const histories=holders.map(()=>[]),observerValues=holders.map(()=>[]);let accepted=0;
   assert.equal(r.rows.length,5);assert.equal(r.prefixes.length,6);assert.equal(r.traceCount,90);
   for(let i=0;i<6;i++){assert.equal(r.prefixes[i].at,i);assert.equal(r.prefixes[i].nextSha256,r.prefixes[Math.min(i+1,5)].sha256);}
   assert.equal(r.saveSha256,r.prefixes[5].sha256);
   const choiceCount=r.sourceRows.filter(x=>x.chosen!==null).length;
   assert.deepEqual(r.phaseCounts,{'1450@50':15,'1431@60':choiceCount,'1432@70':choiceCount,'1433@80':choiceCount,'1434@130':choiceCount,'1448@130':15,'1449@140':15});
   for(const [i,row] of r.rows.entries()){
    rows++;assert.equal(row.at,i+1);
    const contribution=F(r.sourceRows[i].contribution),sign=contribution.numerator>0n?1:contribution.numerator<0n?-1:0;if(sign)accepted++;
    const observations=holders.map((holder,h)=>{const mode=fc.input.channels[i][h];return !sign||mode==='Absent'?null:{holder,target:'target',proposition:'positive-task-fidelity',ticket:i+1,polarity:mode==='Neutral'?0:mode==='Opposite'?-sign:sign};});
    assert.deepEqual(row.observations,observations);
    for(let h=0;h<3;h++)if(entry.law!=='NoLearning'&&observations[h])histories[h].push(observations[h]);
    const estimates=histories.map(xs=>({value:xs.length?str(entry.law==='Latest'?Q.of(BigInt(xs.at(-1).polarity)):Q.of(BigInt(xs.reduce((n,x)=>n+x.polarity,0)),BigInt(xs.length))):null,evidence:xs.length}));
    if(entry.law==='StandingAlias')estimates[0]={value:r.sourceRows[i].strength,evidence:accepted};
    if(entry.law==='PrivateOracle')for(const h of [1,2])estimates[h]={...estimates[0]};
    assert.deepEqual(row.states,histories.map((history,h)=>({history,estimate:estimates[h]})));
    for(let h=0;h<3;h++){
     const value=i?r.rows[i-1].states[h].estimate.value:null,goal=fc.input.goals[i][h];
     const adverse=value===null?null:str(Q.of(1n).subtract(F(value).multiply(Q.of(BigInt(goal)))).divide(Q.of(2n)));
     const appraisal={estimate:value,adverse,affect:adverse===null?null:[adverse,adverse]};
     assert.deepEqual(row.appraisals[h],appraisal);
     observerValues[h].push(br(1450,[u(h+1),u(i+1),q(goal,1),optional(value),optional(adverse),bd.data(appraisal.affect)]));
     observerValues[h].push(br(1448,[u(h+1),u(i+1),list(observations[h]?[evidence(observations[h],h+1)]:[])]));
     observerValues[h].push(br(1449,[u(h+1),u(i+1),state(row.states[h],h+1)]));
    }
   }
   for(let h=0;h<3;h++){assert.equal(sha(enc(list(observerValues[h]))),r.observerSha256[h]);views++;}
   const prior=read(P+`IDENTITY_BELIEF_PUBLIC_RUN_${entry.index}_REV1.json`);
   for(const k of ['rows','sourceRows','prefixes','saveSha256','observerSha256','runIdentity','phaseCounts','traceCount'])assert.deepEqual(r[k],prior[k]);
  }
 }
 assert.equal(workers,74);assert.equal(rows,370);assert.equal(views,222);
 const receipt={status:'PASS',scope:'Read-only original model/run identity recomputation, source/component correspondence, independent safe reports and holder learning, prior-instant appraisal arithmetic, whole observer-view byte reconstruction. No fresh native execution, restore, tests or build.',models:5,finalRuns:37,workers,rows,observerViews:views,historicalPrefixes:444,finalPrefixes:222,checker:ref('scripts/check-history-identity-belief-public-schema.mjs')};
 const out=O+'schema-check.json';if(fs.existsSync(out))assert.deepEqual(read(out),receipt);else fs.writeFileSync(out,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify(receipt));
}finally{await server.close();}
