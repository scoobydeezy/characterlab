import fs from 'node:fs';import {createServer} from 'vite';
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{const m=await server.ssrLoadModule('/src/campaign3/biologicalIntegration.ts'),fx=await server.ssrLoadModule('/src/test/biologicalIntegrationFixtures.ts'),results=[];
for(const [name,{frames,config}] of Object.entries(fx.biologicalScenarios()))for(const seed of ['main','noLoad'].includes(name)?[0,1,2,3,4,5,6,7]:[7]){const run=m.createBiologicalRun('Full',frames,config,seed);while(await run.step()){}const s=run.snapshot();const row={name,seed,sequence:s.rows.map(r=>r.intent),freeDrug:s.rows.slice(8).filter(r=>r.intent==='drug').length,loadedDrug:s.rows.slice(32,40).filter(r=>r.intent==='drug').length,snapshot:s};results.push(row);console.log(JSON.stringify({name,seed,loadedDrug:row.loadedDrug,sequence:row.sequence.join(',')}));}
fs.writeFileSync('docs/planning/BIOLOGICAL_DOMAIN_EXPLORATION_REV1.json',JSON.stringify({status:'EXPLORATION ONLY',results},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
