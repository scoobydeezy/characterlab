import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const source='docs/planning/CAMPAIGN3_IDENTITY_ABLATION_REVIEW_REV2.json',input=JSON.parse(fs.readFileSync(source));
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const {decodeCognitive:decode}=await server.ssrLoadModule('/src/campaign2/cognitiveCodecs.ts'),{canonicalEncode:enc}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const d=h=>decode(Buffer.from(h,'hex')),f=(v,n)=>v.fields.get(BigInt(n)),k=v=>Buffer.from(enc(v)).toString('hex');
 const probabilities=v=>f(v,2).items.map(p=>({action:f(f(p,1),2).payload.value,probability:`${f(p,2).numerator}/${f(p,2).denominator}`}));
 const results=[];
 for(const pair of input.pairs){assert(pair.matchedPreProbeStateAndHistory&&pair.firstThreeDecisionsEqual&&pair.probeProbabilityDifference);const a=input.results.find(x=>x.seed===pair.seed&&x.recipe==='baseline'),b=input.results.find(x=>x.seed===pair.seed&&x.recipe==='standing-access-off');
  const old=f(d(a.prefixes.find(p=>p.clock==='5').history[0]),1).items;
  for(const run of [a,b])assert.deepEqual(f(d(run.history[0]),1).items.slice(0,old.length).map(k),old.map(k));
  const x=d(a.choices[3]),y=d(b.choices[3]);assert(a.standingModifiers.every(v=>v==='0'));assert.equal(f(x,8).value,3n);assert.equal(f(y,8).value,1n);
  results.push({seed:pair.seed,historyEntriesPreservedBeforeProbe:old.length,priorEntriesRemainByteIdenticalAfterProbe:true,sharedAddresses:pair.sharedAddressesWithIdenticalFullDraws,intact:{mode:'PlayerFacingRoll',probabilities:probabilities(x),chosen:f(f(x,1),2).payload.value},ablated:{mode:'Auto',probabilities:probabilities(y),chosen:f(f(y,1),2).payload.value}});
 }
 const sha256=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');fs.writeFileSync('docs/planning/CAMPAIGN3_IDENTITY_ABLATION_SUMMARY.json',JSON.stringify({status:'BOUNDED PUBLIC IDENTITY FEEDBACK ABLATION DISCRIMINATES',source:{path:source,sha256:sha256(source)},script:{path:'scripts/summarize-campaign3-identity-ablation.mjs',sha256:sha256('scripts/summarize-campaign3-identity-ablation.mjs')},results,interpretation:'Standing changes reason activation while integer modifier remains zero. Existing history is not deleted; future updates may diverge. Whole PHEN-BIO remains open.'},null,2)+'\n');console.log(JSON.stringify(results));
}finally{await server.close();}
