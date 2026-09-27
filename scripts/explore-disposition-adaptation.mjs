import fs from 'node:fs';import {createServer} from 'vite';
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const m=await server.ssrLoadModule('/src/campaign3/dispositionAdaptation.ts'),math=await server.ssrLoadModule('/src/campaign3/identityPublicMath.ts'),model=await server.ssrLoadModule('/src/campaign3/identityPublicModel.ts'),codec=await server.ssrLoadModule('/src/campaign3/identityPublicCodecs.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),d=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),choice=await server.ssrLoadModule('/src/campaign2/cognitiveChoice.ts'),long=await server.ssrLoadModule('/src/campaign3/longitudinalModel.ts');
 const stages=['Learn','Learn','Learn','Learn','Probe','Gap','Probe','Learn','Learn','Learn','Learn','Probe','Learn','Learn','Learn','Learn','Probe','Probe'];
 const frames=stages.map((stage,i)=>({stage,setting:i===16?'Home':'Work',significance:4,pressure:0,active:stage!=='Gap',permitted:true,seed:255})),attempts=[];let journal=codec.identityPublicRecord(1435,[c.list([])]);
 for(let i=0;i<18;i++)if(frames[i].stage==='Learn'){
  const target=i<4?'A':'B';for(let seed=0;seed<32;seed++){
   const context=model.contextValue({...frames[i],instructed:false,movement:'Chosen'},true),run=await m.dispositionDecision(i+1,seed,context,journal,{law:'Plastic',constitution:0},m.deriveDisposition(journal,'Plastic'),true),picked=choice.chosenData(d.dataField(d.dataRecord(run.decision,1431n),3n)),chosen=d.dataKey(d.dataField(picked,1n))===d.dataKey(long.OPTIONS[0])?'A':'B';attempts.push({at:i+1,seed,chosen,target});
   if(chosen===target){frames[i].seed=seed;journal=math.appendQualification(journal,run.qualification);break;}if(seed===31)throw Error('NO WITNESS');
  }
 }
 const results=[];for(const law of m.DISPOSITION_LAWS){const run=m.createDispositionRun({law,constitution:0},frames);while(await run.step()){}const rows=m.dispositionRows(run.snapshot());results.push({law,rows});console.log(law,rows.filter(r=>r.frame.stage==='Probe').map(r=>({at:r.at,plastic:r.state.after,standing:r.strength,prob:r.probabilities,chosen:r.chosen})));}
 fs.writeFileSync('docs/planning/DISPOSITION_EXPLORATION_REV1.json',JSON.stringify({status:'EXPLORATION ONLY',frames,attempts,results},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
