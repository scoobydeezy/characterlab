import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),file='src/campaign2/valDeclarations.ts';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),original=hash(fs.readFileSync(new URL(file,root)));
const mutants=[
 ...[265,266,278].map(type=>({name:'omit-role-position-'+type,from:'({265:2n,266:4n,278:2n} as Record<number,bigint>)',to:'({'+[[265,2],[266,4],[278,2]].filter(([t])=>t!==type).map(([t,f])=>t+':'+f+'n').join(',')+'} as Record<number,bigint>)'})),
 {name:'omit-declaration-map-keys',from:'{visit(k);visit(x);}',to:'{visit(x);}'},
 {name:'omit-declaration-map-values',from:'{visit(k);visit(x);}',to:'{visit(k);}'},
 {name:'traverse-identifier-declarations',from:'// Typed identifier payloads are not role-declaration containers.',to:"if(v.kind==='typedIdentifier')visit(v.payload);"},
 {name:'skip-duplicate-role-position',from:"if(constraints.has(pkey))invalid('duplicate canonical role position');",to:'void pkey;'},
 {name:'skip-validator-coverage',from:"if(referenced.size!==(characterValidator?1:0)||(characterValidator&&!referenced.has(key(characterValidator))))invalid('referenced/declared validator mismatch');",to:'void referenced;'},
 {name:'omit-runtime-map-keys',from:'{recordRoles(k);recordRoles(v);}',to:'{recordRoles(v);}'},
 {name:'omit-runtime-map-values',from:'{recordRoles(k);recordRoles(v);}',to:'{recordRoles(k);}'},
 {name:'omit-runtime-list-set',from:"else if(value.kind==='list'||value.kind==='set')value.items.forEach(recordRoles);",to:"else if(value.kind==='list'||value.kind==='set')void value;"},
];
async function compare(mutant){
 let transformed=0;
 const server=await createServer({server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]},plugins:mutant?[{
  name:'declaration-coverage-mutant',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+file))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);},
 }]:[]});
 try{
  const {compareDeclarationCoverage}=await server.ssrLoadModule('/src/test/fixtures/campaign2DeclarationComparison.ts'),cases=await compareDeclarationCoverage(),differences=cases.filter(c=>!c.agrees);
  assert.equal(cases.length,359);if(mutant){assert.equal(transformed,1);assert(differences.length>0);}else assert.equal(differences.length,0);
  return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',casesChecked:cases.length,...(mutant?{differences}:{cases})};
 }finally{await server.close();}
}
const baseline=await compare(),mutations=[];console.log('359 declaration/record cases agree');
for(const m of mutants){mutations.push({...await compare(m),source:file,from:m.from,to:m.to});console.log(m.name+': DETECTED');}
assert.equal(hash(fs.readFileSync(new URL(file,root))),original);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_DECLARATION_COVERAGE_PROOF.json',root),JSON.stringify({status:'COMPONENT PASS',corpusVersion:'finite-val-declaration/0.1',sourceFingerprint:{path:file,sha256:original},
 harnessSha256:hash(fs.readFileSync(new URL('src/test/fixtures/campaign2DeclarationComparison.ts',root))),baseline,mutations,
 limitations:['Expected labels are calculated from corpus construction, not a second general declaration compiler.',
 'Three declared role positions and seven container contexts; finite valid-shape corpus plus operand/coverage errors.',
 'Generic VAL component scope; no claim of complete factory/model construction, restore, PRJ execution or VAL closure.']},null,2)+'\n');
