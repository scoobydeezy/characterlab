import fs from 'node:fs';import {createServer} from 'vite';
const s=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try { const m=await s.ssrLoadModule('/src/campaign3/identityEligibility.ts'),f=await s.ssrLoadModule('/src/test/identityEligibilityFixtures.ts');const rows=[];
for(const scenario of ['Meaningful','WorkOnly','HomeOnly'])for(let seed=0;seed<8;seed++){const r=m.createEligibilityRun('Threshold',seed,f.eligibilityInputs(scenario));while(await r.step()){}const snapshot=r.snapshot(),rs=snapshot.items[1].items.map(m.eligibilitySummary);rows.push({scenario,seed,rows:rs});console.log(scenario,seed,rs.map(x=>x.chosen).join(''),rs.map(x=>x.strength).join(','));}
fs.writeFileSync('docs/planning/IDENTITY_RECOVERY_EXPLORATION_REV1.json',JSON.stringify({status:'EXPLORATORY, NOT QUALIFICATION',rows},null,2)+'\n',{flag:'wx'});
}finally{await s.close();}
