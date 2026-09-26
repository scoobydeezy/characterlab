import fs from 'node:fs';import {createServer} from 'vite';
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{const m=await server.ssrLoadModule('/src/campaign3/biologicalIntegration.ts'),fx=await server.ssrLoadModule('/src/test/biologicalIntegrationFixtures.ts'),results=[];
for(const law of m.INTEGRATION_LAWS){const run=m.createBiologicalRun(law,fx.biologicalFrames(),fx.addictionConfig(),7);while(await run.step()){}const s=run.snapshot();results.push({law,rows:s.rows.map((r,i)=>({at:r.at,intent:r.intent,executed:s.world[i].executed,body:s.world[i].state.channels.reward,before:r.before,beliefs:r.beliefs.drug,grounds:r.grounds,control:r.control,inhibited:r.inhibited,affect:r.affect}))});console.log(law+': '+s.rows.map(r=>r.intent?.slice(0,1)??'-').join(''));}
fs.writeFileSync('docs/planning/BIOLOGICAL_INTEGRATION_EXPLORATION_REV2.json',JSON.stringify({status:'EXPLORATION ONLY',results},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
