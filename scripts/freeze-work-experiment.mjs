import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const path='docs/planning/WORK_PUBLIC_EXPERIMENT_PLAN_REV1.json';assert(!fs.existsSync(path));const hash=b=>createHash('sha256').update(b).digest('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {workInputs,workScenario}=await server.ssrLoadModule('/src/test/workFixtures.ts'),freeze=JSON.parse(fs.readFileSync('docs/planning/campaign3-work-model-rev1/FREEZE.json')),runs=[];
 function add(name,model,boards=workScenario(),seed=0){runs.push({name,model,seed,orderedInputs:Buffer.from(workInputs(boards)).toString('hex')});}
 for(const m of freeze.models)add(m.name,m.name);
 for(const candidate of [1,2])for(const support of [0,1]){
  const m=`c${candidate}-k1-s${support}`;add(m+'-low-distraction',m,workScenario({priorities:[3,1,2]}));
  add(m+'-hidden',m,workScenario().map(b=>({...b,hidden:true,order:[3,2,1]})));
  add(m+'-no-cue',m,workScenario().map(b=>({...b,cue:false})));
  add(m+'-missing-board',m,workScenario().map(b=>({...b,board:false})));
 }
 // Coupled seed grid exercises the two-ground dice and fair tie receiver.
 for(let seed=1;seed<4;seed++)for(const candidate of [1,2])add(`draw-${candidate}-${seed}`,`c${candidate}-k2-s1`,workScenario(),seed);
 fs.writeFileSync(path,JSON.stringify({date:'2026-09-21',status:'FROZEN BEFORE PUBLIC QUALIFICATION',contract:'workspace-control/0.1-candidate',modelFreezeSha256:hash(fs.readFileSync('docs/planning/campaign3-work-model-rev1/FREEZE.json')),claims:['overload and independent capacity/support/priority contrasts','inactive access with unchanged retained intention','later cue before and after expiry','stored/indexed exact output equivalence','hidden-source noninterference','named negative controls','every prefix restore and next-step whole-save equality'],runs},null,2)+'\n',{flag:'wx'});console.log('Frozen '+runs.length+' runs');
}finally{await server.close();}
