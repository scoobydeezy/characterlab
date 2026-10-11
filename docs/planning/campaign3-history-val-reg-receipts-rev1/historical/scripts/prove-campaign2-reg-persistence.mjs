import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const reg='src/campaign2/regulatoryReference.ts',factory='src/campaign2/factory.ts',runtime='src/campaign2/adaptationRuntime.ts';
const mutants=[
 {suite:'reg',name:'reference-at-zero',file:reg,from:'signed(materializeLinear(resolved.anchor,simInstant(at),resolved.v.registry!).value)',to:'signed(materializeLinear(resolved.anchor,simInstant(0n),resolved.v.registry!).value)'},
 {suite:'reg',name:'adapted-bound-at-zero',file:reg,from:'r0=materializeLinear(resolved.anchor,simInstant(at),resolved.v.registry!).value',to:'r0=materializeLinear(resolved.anchor,simInstant(0n),resolved.v.registry!).value'},
 {suite:'reg',name:'ignore-displacement',file:reg,from:'total=r0+d',to:'total=r0'},
 {suite:'reg',name:'exclude-valid-endpoints',file:reg,from:'total<resolved.v.minimum||total>resolved.v.maximum',to:'total<=resolved.v.minimum||total>=resolved.v.maximum'},
 {suite:'reg',name:'truncate-negative-time-rate',file:'src/substrate/time.ts',from:'const delta = floorDiv(total, parameters.scale);',to:'const delta = total / parameters.scale;'},
 {suite:'persistence',name:'save-invented-anchors',file:runtime,from:'analyticalAnchors:()=>list([])',to:'analyticalAnchors:()=>list([true])'},
 {suite:'persistence',name:'save-invented-rng-ids',file:runtime,from:'randomRelevantAuthoritativeIds:()=>list([])',to:'randomRelevantAuthoritativeIds:()=>list([true])'},
 {suite:'persistence',name:'save-invented-continuing-input',file:runtime,from:'continuingRunInputs:list([])',to:'continuingRunInputs:list([true])'},
 {suite:'persistence',name:'restore-invented-anchor-derivation',file:factory,from:'analyticalAnchors:()=>list([])',to:'analyticalAnchors:()=>list([true])'},
 {suite:'persistence',name:'restore-invented-rng-derivation',file:factory,from:'randomRelevantAuthoritativeIds:()=>list([])',to:'randomRelevantAuthoritativeIds:()=>list([true])'},
 {suite:'persistence',name:'restore-validates-time-zero',file:factory,from:'m.domains.validateReferences(prepared.state,prepared.clock);',to:'m.domains.validateReferences(prepared.state,0n);'},
];
const sources=[...new Set(mutants.map(m=>m.file))].map(path=>({path,sha256:hash(fs.readFileSync(new URL(path,root)))}));
async function run(suite,mutant){
 let transformed=0;
 const server=await createServer({server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]},plugins:[{
  name:'reg-persistence-interpreter-mutant',enforce:'pre',transform(code,id){
   const normalized=id.replaceAll('\\','/');let changed=false;
   if(suite==='persistence'&&normalized.endsWith('/'+runtime)){
    const site='  const modelIdentity=f(rec(inputs.runIdentity.value,104n),1n)';assert.equal(code.split(site).length-1,1);
    code='export let qualificationRuntimeConstructionCount=0;\n'+code.replace(site,'  qualificationRuntimeConstructionCount++;\n'+site);changed=true;
   }
   if(mutant&&normalized.endsWith('/'+mutant.file)){assert.equal(code.split(mutant.from).length-1,1);transformed++;code=code.replace(mutant.from,mutant.to);changed=true;}
   if(changed)return code;
  },
 }]});
 try{
  const path=suite==='reg'?'campaign2RegComparison':'campaign2PersistenceComparison',name=suite==='reg'?'compareIndependentReg':'comparePersistenceDerivations';
  const module=await server.ssrLoadModule('/src/test/fixtures/'+path+'.ts');
  const observedRuntime=suite==='persistence'?await server.ssrLoadModule('/'+runtime):undefined;
  const cases=await module[name](observedRuntime?()=>observedRuntime.qualificationRuntimeConstructionCount:undefined),differences=cases.filter(c=>!c.agrees);
  if(mutant){assert.equal(transformed,1);assert(differences.length>0,'mutant detected');}else{assert.equal(differences.length,0);assert.equal(cases.length,suite==='reg'?252:5);}
  return {suite,name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',casesChecked:cases.length,...(mutant?{differences}:{cases})};
 }finally{await server.close();}
}
const baselines=[];for(const suite of ['reg','persistence']){baselines.push(await run(suite));console.log(suite+': baseline PASS');}
const mutations=[];for(const m of mutants){mutations.push({...await run(m.suite,m),source:m.file,from:m.from,to:m.to});console.log(m.name+': DETECTED');}
for(const s of sources)assert.equal(hash(fs.readFileSync(new URL(s.path,root))),s.sha256);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_REG_PERSISTENCE_MUTATION_PROOF.json',root),JSON.stringify({status:'COMPONENT PASS',sourceFingerprints:sources,baselines,mutations,
 supersededMutationAttempts:[{name:'restore-validates-time-zero',result:'NOT DISTINGUISHED by rejection-only assay',reason:'Runtime construction repeated the saved-time check, so restore still rejected. Added observational entry counter to require rejection before runtime construction; the same single-site mutant is now distinguished.'}],
 limitations:['REG scalar oracle is independent of production TIME arithmetic; canonical transport and VAL content setup are shared.',
 'Persistence tests compare exact empty metadata and round-trip bytes; they are not a second persistence implementation.',
 'Retained-time witness edits a canonical checkpoint clock, without claiming that its history was executed.',
 'No complete FCT-D, FCT-6, PERSIST, VAL or PHEN-ADAPT closure.']},null,2)+'\n');
