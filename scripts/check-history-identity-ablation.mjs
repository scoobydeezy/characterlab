// Read-only stored evidence verification.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const source='docs/planning/CAMPAIGN3_IDENTITY_ABLATION_REVIEW_REV2.json',input=JSON.parse(fs.readFileSync(source));
const originalSummary=JSON.parse(fs.readFileSync('docs/planning/CAMPAIGN3_IDENTITY_ABLATION_SUMMARY.json')); 
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const {decodeCognitive:decode}=await server.ssrLoadModule('/src/campaign2/cognitiveCodecs.ts'),{canonicalEncode:enc}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const d=h=>decode(Buffer.from(h,'hex')),f=(v,n)=>v.fields.get(BigInt(n)),k=v=>Buffer.from(enc(v)).toString('hex');
 const probabilities=v=>f(v,2).items.map(p=>({action:f(f(p,1),2).payload.value,probability:`${f(p,2).numerator}/${f(p,2).denominator}`}));
 const results=[];
 for(const pair of input.pairs){assert(pair.matchedPreProbeStateAndHistory&&pair.firstThreeDecisionsEqual&&pair.probeProbabilityDifference);const a=input.results.find(x=>x.seed===pair.seed&&x.recipe==='baseline'),b=input.results.find(x=>x.seed===pair.seed&&x.recipe==='standing-access-off');
  assert.deepEqual(a.prefixes.filter(p=>Number(p.clock)<6),b.prefixes.filter(p=>Number(p.clock)<6));assert.deepEqual(a.choices.slice(0,3),b.choices.slice(0,3));
  const am=new Map(a.actualDraws.map(h=>[k(f(d(h),1)),h])),bm=new Map(b.actualDraws.map(h=>[k(f(d(h),1)),h]));let shared=0;
  assert.equal(am.size,a.actualDraws.length);assert.equal(bm.size,b.actualDraws.length);
  for(const [address,h] of am)if(bm.has(address)){assert.equal(h,bm.get(address));shared++;}
  assert.equal(shared,6);assert.equal(shared,pair.sharedAddressesWithIdenticalFullDraws);
  const old=f(d(a.prefixes.find(p=>p.clock==='5').history[0]),1).items;
  for(const run of [a,b])assert.deepEqual(f(d(run.history[0]),1).items.slice(0,old.length).map(k),old.map(k));
  const x=d(a.choices[3]),y=d(b.choices[3]);assert(a.standingModifiers.every(v=>v==='0'));assert.equal(f(x,8).value,3n);assert.equal(f(y,8).value,1n);
  results.push({seed:pair.seed,historyEntriesPreservedBeforeProbe:old.length,priorEntriesRemainByteIdenticalAfterProbe:true,sharedAddresses:pair.sharedAddressesWithIdenticalFullDraws,intact:{mode:'PlayerFacingRoll',probabilities:probabilities(x),chosen:f(f(x,1),2).payload.value},ablated:{mode:'Auto',probabilities:probabilities(y),chosen:f(f(y,1),2).payload.value}});
 }
 assert.deepEqual(results,originalSummary.results);
 const sha256=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
 const result={status:'PASS READ-ONLY IDENTITY ABLATION',pairs:4,historyEntriesPerPair:3,sharedDrawsPerPair:6,summaryRows:results,checkerSha256:sha256('scripts/check-history-identity-ablation.mjs'),sourceSha256:sha256(source),scope:'Stored prefixes, full shared draw records, old history and decoded decisions checked; no original runtime or writer rerun.'};
 const dir='docs/planning/campaign3-history-identity-ablation-rev1';fs.mkdirSync(dir,{recursive:true});const out=dir+'/packet-check.json';if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);else fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:result.status,pairs:4,sharedDraws:24}));

}finally{await server.close();}
