/** Read-only verification of the accepted promotion and preserved review commitments. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root));
const accepted=JSON.parse(read('docs/planning/PHEN_ADAPT_CORPUS_PROMOTION_ACCEPTED.json'));
for(const p of accepted.historicalArtifacts)assert.equal(createHash('sha256').update(read(p.path)).digest('hex'),p.sha256);
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try{
 const {compileCorpusManifest}=await server.ssrLoadModule('/src/substrate/contentManifest.ts');
 const {typedIdentifier,text}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const doc=read('docs/planning/PHENOMENON_CORPUS.md').toString();
 const entries=[...doc.matchAll(/^\| `(PHEN-[A-Z]+-001)` \| `([^`]+)`/gm)].map(([,name,version])=>({name,version}));
 assert.equal(entries.length,10);assert.equal(entries.find(e=>e.name==='PHEN-ADAPT-001').version,'1.11.0');
 const compile=es=>compileCorpusManifest(es.map(e=>({phenomenonId:typedIdentifier(23010n,text(e.name)),version:e.version})));
 const hex=b=>Buffer.from(b).toString('hex');
 const current=await compile(entries);
 assert.equal(hex(current.canonicalBytes),accepted.canonicalHex);
 assert.equal(hex(current.digest),'3cb09115d90485d5975968ffca419a4960a398326b6b6339a5b1e8e8fdcec276');
 assert.equal(accepted.digest,hex(current.digest));assert.equal(accepted.corpusVersion,'corpus/0.27.0');
 assert(doc.includes('**CorpusVersion:** `corpus/0.27.0`'));assert(doc.includes('**CorpusManifestDigest:** `'+accepted.digest+'`'));
 const history=JSON.parse(read('docs/planning/PHEN_ADAPT_FIXTURE_AMENDMENT_AUDIT.json'));
 for(const [version,expected] of [['1.11.0-draft',history.proposed],['1.10.0-draft',history.prior]]){
  const result=await compile(entries.map(e=>e.name==='PHEN-ADAPT-001'?{...e,version}:e));
  assert.equal(hex(result.canonicalBytes),expected.canonicalHex);assert.equal(hex(result.digest),expected.digest);
  assert.notEqual(hex(result.digest),accepted.digest);
 }
 for(const key of ['aliasOf','equivalentDigest','sameCommitmentAs'])assert(!JSON.stringify(accepted).includes('"'+key+'"'));
 console.log(JSON.stringify({status:'PASS',members:10,currentDigest:accepted.digest,historicalCommitmentsPreserved:2,changedMembersFromReviewedDraft:1,behavioralProof:'not required; not rerun'}));
}finally{await server.close();}
