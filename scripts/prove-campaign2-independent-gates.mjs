import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),file='src/campaign2/adaptationEvaluation.ts';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex'),original=hash(fs.readFileSync(new URL(file,root)));
const mutants=[
 {name:'ignore-frozen-gate',from:'gatePrior===undefined||gatePrior===0n',to:'true'},
 {name:'invert-frozen-gate',from:'gatePrior===undefined||gatePrior===0n',to:'gatePrior===undefined||gatePrior!==0n'},
 {name:'use-target-as-gate',from:"gatePath?projection.read('gate'):undefined",to:"gatePath?projection.read('target'):undefined"},
 {name:'discard-step-sign',from:'count*step',to:'count*(step<0n?-step:step)'},
 {name:'emit-set-for-baseline',from:'if(q===0n){if(prior===undefined)',to:'if(false){if(prior===undefined)'},
 {name:'emit-unchanged-set',from:'if(q!==p){',to:'if(q!==0n||q!==p){'},
];
async function compare(mutant){
 let transformed=0;
 const server=await createServer({server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]},plugins:mutant?[{
  name:'isolated-gate-mutant',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+file))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);},
 }]:[]});
 try{
  const {compareIndependentGates}=await server.ssrLoadModule('/src/test/fixtures/campaign2GateComparison.ts'),cases=await compareIndependentGates(),differences=cases.filter(c=>!c.agrees);
  assert.equal(cases.length,72);if(mutant){assert.equal(transformed,1);assert(differences.length>0);}else assert.equal(differences.length,0);
  return {name:mutant?.name??'baseline',status:mutant?'DETECTED':'PASS',casesChecked:cases.length,...(mutant?{differences}:{cases})};
 }finally{await server.close();}
}
const baseline=await compare(),mutations=[];console.log('FrozenBaseline: 72 baseline cases agree');
for(const m of mutants){mutations.push({...await compare(m),source:file,from:m.from,to:m.to});console.log(m.name+': DETECTED');}
assert.equal(hash(fs.readFileSync(new URL(file,root))),original);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_INDEPENDENT_GATE_PROOF.json',root),JSON.stringify({status:'COMPONENT PASS',
 corpusVersion:'finite-frozen-baseline/0.1',sourceFingerprint:{path:file,sha256:original},
 harnessSha256:hash(fs.readFileSync(new URL('src/test/fixtures/campaign2GateComparison.ts',root))),baseline,mutations,
 limitations:['Uses isolated committed FrozenBaseline / signed-Step variants of the frozen first model, without editing its artifacts.',
 'Independent scalar expected results; canonical transport and production factory setup are shared.',
 'No full REG, persistence, FCT-6 or PHEN-ADAPT closure.']},null,2)+'\n');
