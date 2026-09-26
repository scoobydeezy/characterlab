import fs from 'node:fs';
import {createServer} from 'vite';
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const m=await server.ssrLoadModule('/src/campaign3/costlyReward.ts'),fx=await server.ssrLoadModule('/src/test/costlyRewardFixtures.ts'),results=[];
 for(const law of m.LAWS)for(const [name,frames] of Object.entries(fx.costlyCases()))for(const seed of law==='MeanHistory'&&['main','noLoad','withheld'].includes(name)?[0,1,2,3,4,5,6,7]:[7]){
  const run=m.createCostlyRun(law,frames,seed);while(await run.step()){}
  const s=run.snapshot();results.push({law,name,seed,sequence:s.rows.map(r=>r.intent<0?'-':r.intent===0?'A':'B').join(''),harm:s.world.filter(r=>r.harm).length,rows:s.rows.map(({at,goal,maintained,rewardBelief,harmBelief,habit,admittedA,inhibited,values,intent,receipt})=>({at,goal,maintained,rewardBelief,harmBelief,habit,admittedA,inhibited,values,intent,receipt}))});
 }
 fs.writeFileSync('docs/planning/COSTLY_REWARD_EXPLORATION_REV1.json',JSON.stringify({status:'EXPLORATION ONLY',results},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify(results.map(({rows,...r})=>r),null,2));
}finally{await server.close();}
