/** Intentional successor: preserve all requirements, attach the qualified GA fixture.
 * Earlier corpus and run commitments remain historical identities. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root='docs/planning/',corpusPath=root+'PHENOMENON_CORPUS.md';
const receiptPath=root+'CORPUS_0_29_0_PROMOTION_REV1.json';assert(!fs.existsSync(receiptPath));
const qualificationPath=root+'GA_PUBLIC_QUALIFICATION_REV1.json',qualification=JSON.parse(fs.readFileSync(qualificationPath));
assert.equal(qualification.status,'BOUNDED GENERAL ATTENTION PUBLIC QUALIFICATION PASS');
const previous=fs.readFileSync(corpusPath,'utf8'),priorDigest='1ada9864e4617bf4b83b43d13dfb098049eb374610c421a175395dc33a4e9902';
assert(previous.includes('**CorpusVersion:** `corpus/0.28.0`'));
const memberPattern=/^\| `(PHEN-[A-Z]+-001)` \| `([^`]+)`/gm;
const members=[...previous.matchAll(memberPattern)].map(([,name,version])=>({name,version}));assert.equal(members.length,21);
const nextMembers=members.map(m=>m.name==='PHEN-ATTN-001'?{...m,version:'1.1.0'}:m);
const section=(text,name)=>{const start=text.indexOf('## `'+name+'` —');assert(start>=0);return text.slice(start,text.indexOf('\n---',start));};
const attention=section(previous,'PHEN-ATTN-001');assert(attention.includes('**Version:** `1.0.0-draft`'));
const addon='\n\n**Executable fixture update, 2026-09-20:** `fixture/general-attention/1.0.0`,\n'+
 '`GA_CORPUS_FIXTURE_1_0_0.md`, freezes 43 exact public models, including four\n'+
 'matched sparse/dense pairs and later cue probes. All requirements above are\n'+
 'preserved. `GA_PUBLIC_QUALIFICATION_REV1.json` and `VER-C3-GA-001` record bounded\n'+
 'qualification, exact footprint dependence, separate feedback effects and retained\n'+
 'comparators. This qualifies the declared finite domain, not general Affect, Need,\n'+
 'surprise, unrestricted role/position inference or every North-Star attention case.\n';
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},appType:'custom'});
try{
 const {compileCorpusManifest}=await server.ssrLoadModule('/src/substrate/contentManifest.ts');
 const {typedIdentifier,text}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {createExperimentIdentity}=await server.ssrLoadModule('/src/substrate/identity.ts');
 const compile=ms=>compileCorpusManifest(ms.map(m=>({phenomenonId:typedIdentifier(23010n,text(m.name)),version:m.version})));
 const hex=b=>Buffer.from(b).toString('hex'),prior=await compile(members),next=await compile(nextMembers);assert.equal(hex(prior.digest),priorDigest);
 let out=previous.replace('**CorpusVersion:** `corpus/0.28.0`','**CorpusVersion:** `corpus/0.29.0`').replace('**CorpusManifestDigest:** `'+priorDigest+'`','**CorpusManifestDigest:** `'+hex(next.digest)+'`');
 out=out.replace('| `PHEN-ATTN-001` | `1.0.0-draft` |','| `PHEN-ATTN-001` | `1.1.0` |');
 out=out.replace(attention,attention.replace('**Version:** `1.0.0-draft`','**Version:** `1.1.0`')+addon);
 const noteStart=out.indexOf('**Current commitment:**'),noteEnd=out.indexOf('\nAcceptance of this manifest',noteStart);
 assert(noteStart>=0&&noteEnd>noteStart);
 out=out.slice(0,noteStart)+'**Current commitment:** corpus/0.29.0, accepted 2026-09-20. PHEN-ATTN-001\n'+
 'advances to 1.1.0 with its requirements preserved and an exact executable GA fixture.\n'+
 'The other twenty member identities, versions and requirement sections are unchanged.\n'+
 'Bounded qualification is recorded by VER-C3-GA-001; membership does not imply that\n'+
 'other phenomena pass. See CORPUS_0_29_0_PROMOTION_REV1.json.\n\n'+
 '**Prior commitments:** corpus/0.28.0 at `'+priorDigest+'`\n'+
 'and corpus/0.27.0 at `3cb09115d90485d5975968ffca419a4960a398326b6b6339a5b1e8e8fdcec276`\n'+
 'remain distinct historical commitments. Corpus0.28.0 admitted eleven obligations\n'+
 'as three PARTIAL and eight BLOCKED; admission did not qualify them. The exact prior\n'+
 'document is preserved in CORPUS_0_28_0_PRESERVED_AT_GA.md. Earlier verdicts and GA\n'+
 'execution identities retain their originally declared corpus versions.\n'+out.slice(noteEnd);
 for(const m of members.filter(m=>m.name!=='PHEN-ATTN-001'))assert.equal(section(out,m.name),section(previous,m.name));
 assert.equal(section(out,'PHEN-ATTN-001').replace('**Version:** `1.1.0`','**Version:** `1.0.0-draft`').replace(addon,''),attention);
 const experiment=await createExperimentIdentity('corpus/0.29.0','comparison/general-attention/0.1-candidate','harness/general-attention/0.1-candidate');
 const snapshotPath=root+'CORPUS_0_28_0_PRESERVED_AT_GA.md';assert(!fs.existsSync(snapshotPath));
 fs.writeFileSync(snapshotPath,previous);fs.writeFileSync(corpusPath,out);
 const digest=b=>createHash('sha256').update(b).digest('hex'),fp=path=>({path,sha256:digest(fs.readFileSync(path))});
 const receipt={status:'CORPUS 0.29.0 COMPILED AND PINNED',corpusVersion:'corpus/0.29.0',corpusManifestDigest:hex(next.digest),canonicalHex:hex(next.canonicalBytes),priorCommitment:{version:'corpus/0.28.0',digest:priorDigest,canonicalHex:hex(prior.canonicalBytes),snapshot:fp(snapshotPath)},members:nextMembers,preservedMembers:20,changedMember:{name:'PHEN-ATTN-001',from:'1.0.0-draft',to:'1.1.0',requirementsPreserved:true,fixture:'fixture/general-attention/1.0.0'},promotionExperimentIdentity:hex(experiment.canonicalBytes),promotionExperimentDigest:hex(experiment.digest),executionExperimentIdentity:qualification.experimentIdentity,executionExperimentDigest:qualification.experimentDigest,executionProvenance:'The already completed corpus/0.28.0 public runs are promoted as unchanged evidence. No rerun, changed outcome, new model or replacement of an old identity is implied by the successor aggregate identity.',qualification:fp(qualificationPath),sources:[corpusPath,root+'GA_CORPUS_FIXTURE_1_0_0.md','scripts/promote-ga-corpus-0-29-0.mjs'].map(fp),counters:{highestAllocated:706,allocatedSinceVerdictOrCorpusMember:0}};
 fs.writeFileSync(receiptPath,JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({status:receipt.status,digest:receipt.corpusManifestDigest,members:21,preserved:20}));
}finally{await server.close();}
