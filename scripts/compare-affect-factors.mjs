/** Pure research arithmetic; deliberately no runtime model or character-state admission. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const destination='docs/planning/AFFECT_FACTOR_COMPARISON_REV1.json';assert(!fs.existsSync(destination));
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const {ExactRational:Q}=await server.ssrLoadModule('/src/substrate/exactMath.ts');
 const {compareAffectFactors:project,AFFECT_CANDIDATES:candidates}=await server.ssrLoadModule('/src/campaign3/affectFactorComparison.ts');
 const q=x=>`${x.numerator}/${x.denominator}`,f=(p,s,v,c)=>({likelihood:Q.of(BigInt(p),2n),severity:Q.of(BigInt(s),2n),vulnerability:Q.of(BigInt(v),2n),control:Q.of(BigInt(c),2n)});
 const rows=[];
 for(const p of [0,1,2])for(const s of [0,1,2])for(const v of [0,1,2])for(const c of [0,1,2]){
  const input=f(p,s,v,c);rows.push({input:Object.fromEntries(Object.entries(input).map(([k,x])=>[k,q(x)])),results:Object.fromEntries(candidates.map(name=>{const result=project(input,name);assert.equal(result.status,'Known');return [name,result.coordinates.map(q)];}))});
 }
 const collision=[f(2,2,2,1),f(1,2,2,0)].map(input=>({input:Object.fromEntries(Object.entries(input).map(([k,x])=>[k,q(x)])),results:Object.fromEntries(candidates.map(name=>[name,project(input,name).coordinates.map(q)]))}));
 assert.deepEqual(collision[0].results.ScalarUncontrolled,collision[1].results.ScalarUncontrolled);assert.notDeepEqual(collision[0].results.SplitExposure,collision[1].results.SplitExposure);
 const unknown=candidates.map(name=>({name,result:project({...f(2,2,2,0),control:undefined},name)}));assert(unknown.every(x=>x.result.status==='Unavailable'));
 const result={date:'2026-09-20',scope:'Pure arithmetic component only; no evidence/source/model/public affect qualification',version:'affect-factor-comparison/0.1-candidate',factorCells:rows.length,candidateEvaluations:rows.length*candidates.length,collision,unknown,rows,codeSha256:createHash('sha256').update(fs.readFileSync('src/campaign3/affectFactorComparison.ts')).digest('hex'),disposition:'Scalar collision is demonstrated; psychological necessity and public receiver effects remain untested. Preserve all three candidates.'};
 fs.writeFileSync(destination,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log('81 cells /243 exact candidate evaluations; scalar collision preserved.');
}finally{await server.close();}
