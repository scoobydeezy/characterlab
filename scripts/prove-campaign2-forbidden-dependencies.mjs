import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),file='src/campaign2/valDeclarations.ts',hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const original=hash(fs.readFileSync(new URL(file,root))),from='function qualifyCharacter(value:CanonicalValue):void {';
const dimensions=['roster','candidateDomain','recognition','body','state','activity','clock','rng','presentation','trace'];
async function execute(dimension){
 let transformed=0;
 const to=dimension?from+`\n if ((globalThis as any).__characterlabQualificationAmbient?.${dimension}!==true) throw new ContentValidationError('mutant requires ambient ${dimension}');`:undefined;
 const server=await createServer({server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]},plugins:dimension?[{
  name:'forbidden-dependency-mutant',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+file))return;assert.equal(code.split(from).length-1,1);transformed++;return code.replace(from,to);},
 }]:[]});
 try{
  const {compareForbiddenDependencies}=await server.ssrLoadModule('/src/test/fixtures/campaign2ForbiddenDependencies.ts'),cases=await compareForbiddenDependencies();
  assert.equal(cases.length,20);
  if(dimension){assert.equal(transformed,1);const absent=cases.find(c=>c.name===dimension+'/absent'),present=cases.find(c=>c.name===dimension+'/present');assert.equal(absent.actual,'ContentValidationError');assert.equal(present.actual,'ACCEPT');assert(absent.ambientReads>0&&present.ambientReads>0);}
  else assert(cases.every(c=>c.agrees));
  return {name:dimension??'baseline',status:dimension?'DETECTED':'PASS',...(dimension?{source:file,from,to}:{}),cases};
 }finally{await server.close();}
}
const baseline=await execute(),mutations=[];console.log('20 ambient-invariance cases PASS');
for(const dimension of dimensions){mutations.push(await execute(dimension));console.log(dimension+': DETECTED');}
assert.equal(hash(fs.readFileSync(new URL(file,root))),original);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_FORBIDDEN_DEPENDENCY_PROOF.json',root),JSON.stringify({status:'COMPONENT PASS',sourceFingerprint:{path:file,sha256:original},
 harnessSha256:hash(fs.readFileSync(new URL('src/test/fixtures/campaign2ForbiddenDependencies.ts',root))),baseline,mutations,
 limitations:['Ten explicit test-only Boolean ambient stand-ins; no new roster, recognition, state or stochastic semantics.',
 'Detects a direct added dependency on each stand-in and observes zero baseline reads. Not exhaustive proof against all host environment access or malicious interpreters.',
 'Only qualification of one admitted character is varied under fixed canonical declarations; complete VAL-U and release review remain open.']},null,2)+'\n');
