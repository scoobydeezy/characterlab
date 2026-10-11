// Read-only verification of stored evidence; does not run the historical writer.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),load=n=>JSON.parse(fs.readFileSync(new URL('docs/planning/'+n,root)));
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try {
 const {decodeMemory}=await server.ssrLoadModule('/src/campaign2/memoryCodecs.ts');
 const {canonicalEncode:enc,record,list,unsigned,typedIdentifier,text}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {restoreAuthoritativeState,statePathValue}=await server.ssrLoadModule('/src/substrate/state.ts');
 const {compileCorpusManifest}=await server.ssrLoadModule('/src/substrate/contentManifest.ts');
 const hex=v=>Buffer.from(enc(v)).toString('hex'),dec=h=>decodeMemory(Buffer.from(h,'hex'));
 const f=(v,n)=>v.fields.get(BigInt(n)),it=v=>v.items,eq=(a,b)=>assert.equal(hex(a),hex(b));
 const replace=(v,n,x)=>record(v.schema,new Map([...v.fields,[BigInt(n),x]]));
 const p=load('CAMPAIGN2_ADAPT_PARENT_PAIR_PROOF.json');assert.equal(p.status,'PASS');assert.equal(p.checks.length,52);assert.equal(p.timelines.length,2);
 const [a,b]=p.timelines;assert.equal(a.count,0);assert.equal(b.count,1);
 const ia=dec(a.orderedInputsHex),ib=dec(b.orderedInputsHex),entry=it(ib)[0],fact=it(entry)[3];
 eq(f(f(fact,1),3),unsigned(1));eq(f(f(it(it(ia)[0])[3],1),3),unsigned(0));
 eq(ia,list([list(it(entry).map((v,i)=>i===3?replace(fact,1,replace(f(fact,1),3,unsigned(0))):v)),it(ib)[1]]));
 assert.notEqual(a.orderedInputDigestHex,b.orderedInputDigestHex);
 const initial=restoreAuthoritativeState(dec(p.initialStateHex)).entries();assert.equal(initial.length,1);assert.equal(initial[0].path.rootStateTypeId,268n);
 assert.equal(p.runSeedHex,'00'.repeat(32));assert.equal(a.topologyHex,b.topologyHex);assert.equal(a.finalAllocatorHex,b.finalAllocatorHex);
 const adapted=p.timelines.map(t=>restoreAuthoritativeState(dec(t.afterExposureStateHex)).entries());
 const formed=p.timelines.map(t=>restoreAuthoritativeState(dec(t.afterFormationStateHex)).entries());
 assert.equal(adapted[0].length,1);assert.equal(adapted[1].length,5);
 const body=adapted[1].filter(e=>e.path.rootStateTypeId===302n);assert.deepEqual(body.map(e=>String(e.path.fieldId)).sort(),['1','2','3','4']);
 for(const e of body)assert.equal(f(e.value,1).value,1n);
 eq(adapted[0][0].value,adapted[1].find(e=>e.path.rootStateTypeId===268n).value);
 const topology=it(dec(a.topologyHex)),byId=new Map(topology.map(e=>[String(it(e)[0].value),it(e)]));
 for(let i=0;i<2;i++){
  const t=p.timelines[i],an=t.ancestry,dep=an.stateDependency,read=dec(dep.probeRead),diffs=it(dec(dep.adaptationDiffs));
  eq(f(read,2),dec(dep.path));assert.equal(f(read,3),i===1);assert.equal(diffs.length,i===0?0:4);
  if(i){const diff=diffs.find(d=>hex(f(d,1))===dep.path);assert(diff);eq(f(read,4),f(diff,5));eq(f(read,4),body.find(e=>e.path.fieldId===3n).value);}
  assert.equal(it(byId.get(an.exposureRoot)[6]).length,0);assert.equal(it(byId.get(an.probeRoot)[6]).length,0);
  for(const [child,parent] of [[an.adaptation,an.exposureRoot],[an.observation,an.probeRoot],[an.carriage,an.observation],[an.m1,an.carriage],[an.formation,an.m1]])assert(it(byId.get(child)[6]).some(x=>String(x.value)===parent));
  const episodes=formed[i].filter(e=>e.path.rootStateTypeId===346n);assert.equal(episodes.length,1);assert.equal(formed[i].length,adapted[i].length+1);
  for(const e of adapted[i]){const later=formed[i].find(x=>hex(statePathValue(x.path))===hex(statePathValue(e.path)));assert(later);eq(e.value,later.value);}
  const episode=episodes[0],recollection=dec(t.recollectionHex);assert.equal(recollection.schema.typeId,352n);eq(f(recollection,2),episode.value);
  const m1=f(episode.value,1),carriage=f(m1,2),observation=f(carriage,2),measurement=f(f(observation,6),2);
  assert.equal(m1.schema.typeId,342n);assert.equal(carriage.schema.typeId,337n);assert.equal(observation.schema.typeId,203n);
  assert.equal(measurement.numerator*10n,BigInt(50+i)*measurement.denominator);
  const recall=topology.map(it).find(e=>e[4].payload?.value==='event/measurement-exact-recall');assert(recall);assert.deepEqual(it(recall[6]).map(x=>String(x.value)),[an.carriage]);
 }
 const audit=load('PHEN_ADAPT_FIXTURE_AMENDMENT_AUDIT.json'),review=load('PHEN_ADAPT_CORPUS_PROMOTION_REVIEW.json'),accepted=load('PHEN_ADAPT_CORPUS_PROMOTION_ACCEPTED.json');
 const versions=['1.10.0-draft','1.11.0-draft','1.11.0'],rows=[audit.prior,audit.proposed,accepted];
 for(let i=0;i<versions.length;i++){
  const entries=audit.members.map(e=>({phenomenonId:typedIdentifier(23010n,text(e.name)),version:e.name==='PHEN-ADAPT-001'?versions[i]:e.version}));
  const c=await compileCorpusManifest(entries);assert.equal(Buffer.from(c.digest).toString('hex'),rows[i].digest);assert.equal(Buffer.from(c.canonicalBytes).toString('hex'),rows[i].canonicalHex);
 }
 assert.equal(review.reviewed.canonicalHex,audit.proposed.canonicalHex);assert.equal(review.requestedPromotion.canonicalHex,accepted.canonicalHex);assert.equal(review.unchangedMembers,9);
 assert.equal(new Set(rows.map(r=>r.digest)).size,3);
 for(const r of accepted.historicalArtifacts)assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL(r.path,root))).digest('hex'),r.sha256);
 console.log(JSON.stringify({status:'PASS STORED PARENT-PAIR AND THREE MANIFEST COMMITMENTS',timelines:2,recordedChecks:52,storedTopologyEvents:topology.length,manifests:3,membersPerManifest:10,scope:'Stored data joins only. No runtime execution,original-S0 replay,full trace/random-draw inspection or independent verification of all52 historical checks. No current corpus promotion.'}));
}finally{await server.close();}
