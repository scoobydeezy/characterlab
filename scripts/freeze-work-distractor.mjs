import fs from 'node:fs';import assert from 'node:assert/strict';import {createServer} from 'vite';
const path='docs/planning/WORK_DISTRACTOR_PLAN_REV1.json';assert(!fs.existsSync(path));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {workInputs,workScenario}=await server.ssrLoadModule('/src/test/workFixtures.ts'),runs=[];
 for(const c of [1,2])for(const s of [0,1])for(const variant of ['low','high']){const boards=workScenario({priorities:[2,variant==='low'?1:3,0]});runs.push({name:`distractor-${c}-${s}-${variant}`,model:`c${c}-k1-s${s}`,seed:0,orderedInputs:Buffer.from(workInputs(boards)).toString('hex')});}
 fs.writeFileSync(path,JSON.stringify({date:'2026-09-21',status:'FROZEN BEFORE SUPPLEMENTARY EXECUTION',supplementary:true,reason:'Main low-distraction fixture changed both A and B priorities. It is a priority contrast, not sufficient evidence for distractor-only causality. These pairs differ in exactly one physical card priority at time2.',runs},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
