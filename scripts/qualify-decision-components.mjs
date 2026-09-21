import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'DECISION_COMPONENT_PLAN_REV1.json',outPath=p+'DECISION_COMPONENT_EXPERIMENT_REV1.json';
const hash=b=>createHash('sha256').update(b).digest('hex');
const sources=['docs/planning/DECISION_COMPARATOR_PREFLIGHT.md','src/campaign3/decisionComparators.ts','src/test/decisionComparatorFixtures.ts','src/test/decisionComparators.test.ts','src/campaign2/cognitiveArbitration.ts','src/campaign2/cognitiveMath.ts','src/campaign2/cognitiveChoice.ts'];
if(process.argv.includes('--plan')){
 fs.writeFileSync(planPath,JSON.stringify({scope:'Component experiment only; not public model qualification',status:'FROZEN before this recorded execution',laws:['Baseline','AlwaysRoll','NeverRoll','DecorativeDice','OpaqueWeightedChoice','IntentEqualsOutcome'],regimes:['settled','low','high'],seeds:Array.from({length:16},(_,i)=>i),permissions:[true,false],sources:sources.map(path=>({path,sha256:hash(fs.readFileSync(path))}))},null,2)+'\n',{flag:'wx'});
}else{
 assert(!fs.existsSync(outPath),'immutable experiment exists');const plan=JSON.parse(fs.readFileSync(planPath));for(const s of plan.sources)assert.equal(hash(fs.readFileSync(s.path)),s.sha256);
 const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
 try{
  const {decisionComparison}=await server.ssrLoadModule('/src/campaign3/decisionComparators.ts'),{decisionContext}=await server.ssrLoadModule('/src/test/decisionComparatorFixtures.ts'),{canonicalEncode:enc}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
  const digest=v=>v===undefined?null:hash(enc(v)),show=q=>`${q.numerator}/${q.denominator}`,rows=[];
  for(const law of plan.laws)for(const regime of plan.regimes)for(const seed of plan.seeds)for(const permitted of plan.permissions){
   const run=()=>decisionComparison(decisionContext(regime),new Uint8Array(32).fill(seed),law,permitted),a=await run(),b=await run();assert.deepEqual(a,b);
   rows.push({law,regime,seed,permitted,mode:a.mode,probabilities:a.analytical.probabilities.map(p=>show(p.probability)),margin:show(a.analytical.margin),contest:show(a.analytical.contest),conflictMass:show(a.analytical.conflictMass),stake:show(a.analytical.stake),authorship:show(a.analytical.authorshipPotential),chosen:digest(a.chosen),transcript:digest(a.transcript),draws:a.addresses.length,intent:digest(a.intent),expression:digest(a.expression),outcome:digest(a.outcome)});
  }
  const get=(law,regime,seed=0,permitted=true)=>rows.find(r=>r.law===law&&r.regime===regime&&r.seed===seed&&r.permitted===permitted);
  for(const seed of plan.seeds){const low=get('Baseline','low',seed),high=get('Baseline','high',seed);assert.equal(low.transcript,high.transcript);assert.equal(low.chosen,high.chosen);assert.equal(low.mode,'QuietRoll');assert.equal(high.mode,'PlayerFacingRoll');
   for(const regime of plan.regimes){const a=get('Baseline',regime,seed),b=get('Baseline',regime,seed,false);assert.equal(a.intent,b.intent);assert.equal(a.expression,b.expression);assert.notEqual(a.outcome,b.outcome);}
  }
  const divergences=plan.seeds.filter(s=>get('Baseline','high',s).chosen!==get('DecorativeDice','high',s).chosen);assert(divergences.length);assert.equal(get('Baseline','settled').draws,0);assert(get('AlwaysRoll','settled').draws>0);assert.equal(get('NeverRoll','low').mode,'Auto');assert.equal(get('OpaqueWeightedChoice','high').draws,1);assert.equal(get('IntentEqualsOutcome','high',0,false).chosen,null);
  fs.writeFileSync(outPath,JSON.stringify({status:'PASS',scope:plan.scope,planSha256:hash(fs.readFileSync(planPath)),cases:rows.length,exactReplays:rows.length,publicRuns:0,prefixRestores:0,decorativeDivergenceSeeds:divergences,rows},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({cases:rows.length,exactReplays:rows.length,decorativeDivergenceSeeds:divergences}));
 }finally{await server.close();}
}
