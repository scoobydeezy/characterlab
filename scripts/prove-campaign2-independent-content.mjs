// FCT-6 / VAL-Q finite semantic comparison and build-local mutation witnesses.
// In-memory Vite transforms only: no production source or model declarations are edited.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const targets=['src/campaign2/valDeclarations.ts','src/substrate/contentManifest.ts'];
const before=targets.map(path=>({path,sha256:hash(fs.readFileSync(new URL(path,root)))}));
const mutants=[
 {name:'skip-cycle-check',file:targets[1],from:'rejectContentCycles(byId);',to:'void byId;',witness:'graph/1/1'},
 {name:'skip-registry-reference-existence',file:targets[1],from:'if (!registryKeys.has(canonicalKey(reference)))',to:'if (false)',witness:'unknown-registry-reference'},
 {name:'admit-dangling-content-reference',file:targets[1],from:'if (!byId.has(canonicalKey(reference)))',to:'if (false)',extraFrom:'for (const reference of byId.get(key)!.referencedContentIds) visit(canonicalKey(reference));',extraTo:'for (const reference of byId.get(key)!.referencedContentIds) if (byId.has(canonicalKey(reference))) visit(canonicalKey(reference));',witness:'unknown-content-reference'},
 {name:'require-uncommitted-body-predicate',file:targets[0],from:'validate:()=>{}',to:"validate:()=>{throw new ContentValidationError('mutant requires body');}",witness:'graph/1/0'},
 {name:'substitute-authoritative-field',file:targets[0],from:'worldEffects:field(r,6n)',to:'worldEffects:field(r,5n)',witness:'opaque-authoritative-data/6'},
 {name:'skip-reference-uniqueness',file:targets[1],from:'if (canonicalKey(sorted[index - 1]) === canonicalKey(sorted[index]))',to:'if (false)',witness:'duplicate-registry-reference'},
 {name:'skip-reference-order-normalization',file:targets[1],from:"list(canonicalUnique(input.referencedContentIds, 'referenced content ID'))",to:'list(input.referencedContentIds)',witness:'unordered-content-references'},
];
async function compare(mutant){
 let transformed=0;
 const server=await createServer({server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]},plugins:mutant?[{
  name:'isolated-content-qualification-mutant',enforce:'pre',transform(code,id){
   if(!id.replaceAll('\\','/').endsWith('/'+mutant.file))return;
   assert.equal(code.split(mutant.from).length-1,1,'unique mutation site');transformed++;code=code.replace(mutant.from,mutant.to);if(mutant.extraFrom){assert.equal(code.split(mutant.extraFrom).length-1,1);code=code.replace(mutant.extraFrom,mutant.extraTo);}return code;
  },
 }]:[]});
 try{
  const {firstTraceModel}=await server.ssrLoadModule('/src/campaign2/firstTraceModel.ts');
  const {decodeCampaign2,campaign2SchemaByType}=await server.ssrLoadModule('/src/campaign2/codecs.ts');
  const {canonicalEncode:enc,set}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
  const {compileValDeclarations}=await server.ssrLoadModule('/src/campaign2/valDeclarations.ts');
  const {finiteContentCorpus,independentCharacterContent}=await server.ssrLoadModule('/src/test/fixtures/independentCampaign2Content.ts');
  const source=firstTraceModel(),registry=decodeCampaign2(source.registry).items[0],registryBytes=enc(registry);
  const entries=registry.items.filter(v=>v.kind==='record'&&v.schema.typeId===171n),registered=entries.map(v=>v.fields.get(1n));
  const selected=entries.filter(v=>['registry/semantic-kind','registry/domain-validator'].includes(v.fields.get(2n).payload.value));
  const compiler=compileValDeclarations(enc(set(selected)),source.registry);
  const corpus=finiteContentCorpus(campaign2SchemaByType(170n)),chosen=mutant?corpus.filter(c=>c.name===mutant.witness):corpus;
  if(mutant)assert.equal(chosen.length,1);
  const cases=[];
  for(const c of chosen){
   const expected=independentCharacterContent(c.value,registered);let actual,error;
   try{actual=(await compiler.compileContent(enc(c.value),registryBytes)).canonicalBytes;}catch(e){error=e.name;}
   const same=expected===undefined?actual===undefined:actual!==undefined&&Buffer.from(actual).equals(Buffer.from(expected));
   cases.push({name:c.name,expected:expected===undefined?'reject':'accept',actual:actual===undefined?'reject':'accept',exactAgreement:same,
    ...(expected?{expectedSha256:hash(expected)}:{}),...(actual?{actualSha256:hash(actual)}:{}),...(error?{errorClass:error}:{})});
  }
  if(mutant){assert.equal(transformed,1);assert(cases.some(c=>!c.exactAgreement),'mutant must be distinguished');}
  else{assert(cases.every(c=>c.exactAgreement),'finite implementations disagree');assert.equal(cases.filter(c=>c.name.startsWith('graph/')&&c.expected==='accept').length,30);}
  return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',cases,registrySha256:hash(registryBytes)};
 }finally{await server.close();}
}
const baseline=await compare();
console.log(`Independent baseline PASS: ${baseline.cases.length} cases.`);
const mutations=[];
for(const mutant of mutants){const result=await compare(mutant);mutations.push({...result,source:mutant.file,from:mutant.from,to:mutant.to,...(mutant.extraFrom?{extraFrom:mutant.extraFrom,extraTo:mutant.extraTo}:{})});console.log(mutant.name+': DETECTED');}
for(const s of before)assert.equal(hash(fs.readFileSync(new URL(s.path,root))),s.sha256,'production source unchanged');
assert(mutations.every(m=>m.registrySha256===baseline.registrySha256),'mutants retain exact declaration bytes');
const report={status:'COMPONENT PASS',control:'FCT-6 / VAL-Q independent character-content specialization',corpusVersion:'finite-character-content/0.1',
 modelContext:'rules/campaign2-bounded-bridge/0.2-candidate',sourceFingerprints:before,
 oracleSha256:hash(fs.readFileSync(new URL('src/test/fixtures/independentCampaign2Content.ts',root))),
 scope:'All 531 directed graphs through 3 distinct content definitions, plus explicit schema/kind/reference/data boundary cases. Shared cenc transport; independent semantic checks and transitive-closure cycle algorithm.',
 baseline,mutations,supersededMutationAttempts:[{name:'skip-content-reference-existence',result:'not distinguished by accept/reject comparison',reason:'Removing only the explicit existence check still rejects during DFS traversal of the missing node. Replaced with a two-site dangling-reference acceptance mutant; no claim that the first mutation was killed.'}],limitations:['No independent codec proof.','Acceptance/rejection and exact accepted canonical bytes compared; rejection-carrier precedence is not independently qualified here.','Fixed valid VAL declarations; full declaration/role traversal and IDN qualification are separate controls.','Not full FCT-6, VAL-A..W, ADAPT or PHEN-ADAPT closure.']};
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_INDEPENDENT_CONTENT_PROOF.json',root),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,cases:baseline.cases.length,accepted:baseline.cases.filter(c=>c.actual==='accept').length,mutants:mutations.length},null,2));
