import fs from 'node:fs';import assert from 'node:assert/strict';import {createServer} from 'vite';
const output='docs/planning/ATTENTION_RETRIEVAL_WITNESS_SEARCH_REV1.json';assert(!fs.existsSync(output));
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const m=await server.ssrLoadModule('/src/campaign3/encodingAccessMath.ts'),{ExactRational:Q}=await server.ssrLoadModule('/src/substrate/exactMath.ts');
 const q=(n,d=1)=>Q.of(BigInt(n),BigInt(d)),zero=q(0),one=q(1),str=x=>x.numerator+'/'+x.denominator,labels=['a','b','c','d','e'],roles=[one,q(9,10),q(3,5)];
 const triples=[];for(let a=0;a<3;a++)for(let b=0;b<3;b++)for(let c=0;c<3;c++)triples.push([a,b,c]);
 let searched=0,witness;
 outer:for(const early of triples)for(const late of triples){searched++;let W=labels.map(()=>labels.map(()=>zero));const history=[];
  for(let t=2;t<=5;t++){const ids=t<5?[0,1,2]:[0,3,4],rs=t<5?early:late,z=labels.map(()=>zero);ids.forEach((id,i)=>z[id]=m.boundedEncodingResponse(q(3,10).multiply(roles[rs[i]])));
   W=m.associationCandidate(labels,W,z,{scale:100n,eta:one,lambda:zero,elapsed:q(t===2?0:1)}).values;history.push({key:'episode-'+t,retainedKeys:ids.map(i=>labels[i]),presentations:[BigInt(t)]});}
  const activation=m.spreadingActivation(labels,W,[one,zero,zero,zero,zero],q(1,2),100n).quantized,activationMap=new Map(labels.map((l,i)=>[l,activation[i]]));
  const histories=[structuredClone(history),structuredClone(history)];
  for(let t=6;t<=9;t++){const results=[one,q(7,5)].map((weight,i)=>m.rankAccessibleEpisodes(histories[i],activationMap,BigInt(t),{lambda:one,exponent:1,omegaB:one,omegaA:weight,k:2}));
   if(results[0].selected.map(r=>r.key).join()!==results[1].selected.map(r=>r.key).join()){
    witness={earlyRoles:early.map(i=>['Actor','Target','Participant'][i]),lateRoles:late.map(i=>['Actor','Target','Participant'][i]),instant:t,weights:['1/1','7/5'],graph:W.map(r=>r.map(str)),activation:activation.map(str),histories:histories.map(h=>h.map(e=>({...e,presentations:e.presentations.map(String)}))),results:results.map(r=>({selected:r.selected.map(x=>x.key),scores:r.scored.map(x=>({key:x.key,base:str(x.base),pull:str(x.pull),score:str(x.score)}))}))};break outer;}
   for(let i=0;i<2;i++)for(const winner of results[i].selected)histories[i].find(e=>e.key===winner.key).presentations.push(BigInt(t));
  }
 }
 fs.writeFileSync(output,JSON.stringify({status:witness?'COMPONENT WITNESS FOUND; NOT PUBLIC SOURCE PROOF':'NO WITNESS IN SEARCH DOMAIN',searched,witness,scope:'Exact EAM graph/rank with hypothetical positive encoded history and hypothetical presentation reinforcement. Actual source, selected capability, IDN and writers not executed.'},null,2)+'\n');console.log({searched,witness});
}finally{await server.close();}
