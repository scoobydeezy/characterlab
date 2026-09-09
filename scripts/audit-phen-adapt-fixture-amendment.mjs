import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),path=new URL('docs/planning/PHENOMENON_CORPUS.md',root);
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try{
 const {compileCorpusManifest}=await server.ssrLoadModule('/src/substrate/contentManifest.ts');
 const {typedIdentifier,text}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 let document=fs.readFileSync(path,'utf8');
 const entries=[...document.matchAll(/^\| `(PHEN-[A-Z]+-001)` \| `([^`]+)`/gm)].map(([,name,version])=>({name,version}));
 assert.equal(entries.length,10);assert.equal(new Set(entries.map(e=>e.name)).size,10);
 assert.equal(entries.find(e=>e.name==='PHEN-ADAPT-001').version,'1.11.0-draft');
 assert(document.includes('**CorpusVersion:** `corpus/0.27.0-draft`'));
 const old=entries.map(e=>({...e,version:e.name==='PHEN-ADAPT-001'?'1.10.0-draft':e.version}));
 // Existing research corpus identifier namespace, retained from the historical manifest.
 // This is not allocation or promotion of a production model vocabulary.
 const compile=es=>compileCorpusManifest(es.map(e=>({phenomenonId:typedIdentifier(23010n,text(e.name)),version:e.version})));
 const prior=await compile(old),current=await compile(entries),hex=b=>Buffer.from(b).toString('hex');
 assert.equal(hex(prior.digest),'42dc63048912b666c8d7cd4b4c58273f698f1f1950b3a1714c1b12bc7eaa46fc');
 assert.notEqual(hex(current.digest),hex(prior.digest));
 if(process.argv.includes('--write')){
  document=document.replace(/\*\*CorpusManifestDigest:\*\* `[0-9a-f]+`/,'**CorpusManifestDigest:** `'+hex(current.digest)+'`');
  fs.writeFileSync(path,document);
 }
 assert(document.includes('**CorpusManifestDigest:** `'+hex(current.digest)+'`'));
 const proof=JSON.parse(fs.readFileSync(new URL('docs/planning/CAMPAIGN2_ADAPT_PARENT_PAIR_PROOF.json',root)));
 for(const c of ['Identical applicable rule set including zero-count dispatch','Exact four governed exposure mutation paths; no spill','Later probe read equals earlier committed D write'])assert(proof.checks.includes(c));
 const report={status:'PASS',scope:'Specification/manifest alignment audit only; no new behavioral qualification',amendment:'PENDING EXPLICIT ACCEPTANCE',prior:{corpusVersion:'corpus/0.26.0-draft',phenomenonVersion:'1.10.0-draft',digest:hex(prior.digest),canonicalHex:hex(prior.canonicalBytes)},proposed:{corpusVersion:'corpus/0.27.0-draft',phenomenonVersion:'1.11.0-draft',digest:hex(current.digest),canonicalHex:hex(current.canonicalBytes)},members:entries,changes:[{phenomenon:'PHEN-ADAPT-001',from:'1.10.0-draft',to:'1.11.0-draft'}],existingWitness:'52-check accepted parent pair; exact rules/paths/D-read labels present; not reexecuted by this audit',modelChanges:[],runtimeChanges:[],allocationChanges:[]};
 fs.writeFileSync(new URL('docs/planning/PHEN_ADAPT_FIXTURE_AMENDMENT_AUDIT.json',root),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({status:'PASS',members:entries.length,changedMembers:1,proposedDigest:hex(current.digest)}));
}finally{await server.close();}
