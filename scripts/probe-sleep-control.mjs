import fs from 'node:fs';import {createServer} from 'vite';
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const fx=await server.ssrLoadModule('/src/test/sleepControlFixtures.ts'),native=await server.ssrLoadModule('/src/test/identityPublicFixtures.ts'),d=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),b=await server.ssrLoadModule('/src/campaign3/biologyPublicData.ts'),math=await server.ssrLoadModule('/src/campaign3/identityPublicMath.ts');
 const results=[];
 for(const scenario of ['Rested','Deprived','Recovered','BlindRested','BlindDeprived','FalseRested','FailedExecution','Unmaintained']){
  const c=fx.sleepCase(scenario),{runtime}=await native.runtime(c);while(await runtime.settle()){}
  const o=runtime.snapshot().outputs,r=native.records,f=d.dataField;
  const rows=r(o,1411).map((a,i)=>({at:i+1,appraisal:b.value(f(a,3n)),choice:b.value(f(r(o,1414)[i],4n)),qualification:String(d.dataUnsigned(f(r(o,1434)[i],3n))),identity:String(math.identityFold(f(r(o,1437)[i],3n)).strength.numerator),physical:b.value(f(r(o,1418)[i],2n))}));
  results.push({scenario,rows});console.log(scenario,JSON.stringify(rows.filter(x=>[2,8,9,12].includes(x.at)).map(x=>({at:x.at,control:x.appraisal.control,inhibited:x.appraisal.inhibited,options:x.appraisal.options,choice:x.choice.chosen,probabilities:x.choice.probabilities,qualification:x.qualification}))));
 }
 fs.writeFileSync('docs/planning/SLEEP_CONTROL_EXPLORATION_REV2.json',JSON.stringify({status:'EXPLORATORY',results},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
