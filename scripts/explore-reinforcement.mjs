import fs from 'node:fs';import {createServer} from 'vite';
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{const m=await server.ssrLoadModule('/src/campaign3/dependenceSubstitutes.ts'),fx=await server.ssrLoadModule('/src/test/reinforcementFixtures.ts'),rows=[];
for(let seed=0;seed<8;seed++)for(const name of ['full','withheld']){const r=m.createSubstitutionRun('MeanHistory',fx.reinforcementCases()[name],seed);while(await r.step()){}const s=r.snapshot();rows.push({seed,name,intents:s.rows.map(r=>r.intent),estimates:s.rows.map(r=>r.beliefBefore),physical:s.physical});}
fs.writeFileSync('docs/planning/REINFORCEMENT_EXPLORATION_REV1.json',JSON.stringify({status:'EXPLORATORY ONLY; all seeds0..7 retained',rows},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(rows));
}finally{await server.close();}
