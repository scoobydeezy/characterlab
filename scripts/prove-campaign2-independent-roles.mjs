// Isolated interpreter mutants; no production files or declarations are changed.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),file='src/campaign2/valDeclarations.ts';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const original=hash(fs.readFileSync(new URL(file,root)));
const condition='if(origin.namespaceId!==1037n||contentKinds.get(key(origin.payload))!==key(characterKind!))';
const mutants=[
 {name:'skip-committed-resolution',from:condition,to:'if(origin.namespaceId!==1037n)'},
 {name:'compare-stable-payload-only',from:condition,to:'if(origin.namespaceId!==1037n||!inputs.some(d=>key(d.stableId.payload)===key(asId(origin.payload).payload)))'},
 {name:'qualify-namespace-only-role',from:'if(role.fields.has(2n))qualifyCharacter(value);',to:'qualifyCharacter(value);'},
 {name:'skip-required-namespace',from:'value.namespaceId!==asUnsigned(field(role,1n))',to:'false'},
 {name:'skip-referent-shell',from:'validateSemanticReferent(value); // Structural failure precedes the narrower role.',to:'// Mutant omits structural shell validation.'},
 {name:'admit-runtime-as-character',from:condition,to:'if(origin.namespaceId===1037n&&contentKinds.get(key(origin.payload))!==key(characterKind!))'},
 {name:'replace-qualification-error-carrier',from:"throw new StateContractError('CANONICAL_ROLE_VIOLATION','referent is not an authored character in committed content');",to:"throw new ContentValidationError('referent is not an authored character in committed content');"},
];
async function run(mutant){
 let transformed=0;
 const server=await createServer({server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]},plugins:mutant?[{
  name:'independent-role-mutant',enforce:'pre',transform(code,id){
   if(!id.replaceAll('\\','/').endsWith('/'+file))return;
   assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);
  },
 }]:[]});
 try{
  const {compareIndependentRoles}=await server.ssrLoadModule('/src/test/fixtures/campaign2RoleComparison.ts');
  const {firstTraceModel}=await server.ssrLoadModule('/src/campaign2/firstTraceModel.ts');
  const model=firstTraceModel(),cases=await compareIndependentRoles(),differences=cases.filter(c=>!c.agrees);
  assert.equal(cases.length,234);
  if(mutant){assert.equal(transformed,1);assert(differences.length>0,'mutant distinguished');}else assert.equal(differences.length,0);
  return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',casesChecked:cases.length,differences,
   ...(mutant?{}:{cases}),declarationHashes:{registry:hash(model.registry),content:hash(model.content)}};
 }finally{await server.close();}
}
const baseline=await run(),mutations=[];
console.log('Baseline: 234 exact verdict agreements');
for(const mutant of mutants){mutations.push({...await run(mutant),source:file,from:mutant.from,to:mutant.to});console.log(mutant.name+': DETECTED');}
assert.equal(hash(fs.readFileSync(new URL(file,root))),original);
for(const m of mutations)assert.deepEqual(m.declarationHashes,baseline.declarationHashes);
const report={status:'COMPONENT PASS',control:'FCT-6 independent role / IDN qualification',corpusVersion:'finite-character-role/0.1',
 sourceFingerprint:{path:file,sha256:original},oracleSha256:hash(fs.readFileSync(new URL('src/test/fixtures/independentCampaign2Roles.ts',root))),
 baseline,mutations,limitations:['Finite atom/list namespace corpus, not a general independent codec.',
 'Direct qualification and decoded role admission intentionally have distinct structural-error precedence.',
 'No whole-declaration or recursive record/map-key traversal qualification claim.',
 'No global FCT-6, VAL, TRACE or PHEN-ADAPT closure.']};
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_INDEPENDENT_ROLE_PROOF.json',root),JSON.stringify(report,null,2)+'\n');
console.log('COMPONENT PASS: 234 comparisons; seven isolated mutants detected.');
