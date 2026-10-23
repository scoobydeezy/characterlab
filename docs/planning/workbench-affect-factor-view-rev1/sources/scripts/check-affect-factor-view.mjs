import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';import {createElement} from 'react';import {renderToStaticMarkup} from 'react-dom/server';
const root='docs/planning/workbench-affect-factor-view-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),write=(p,v)=>fs.writeFileSync(root+'/'+p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const sourcePaths=['src/workbench/affectFactorProjection.ts','src/workbench/AffectFactorView.tsx','src/workbench/AffectWorkbench.tsx','src/test/workbenchAffectFactorView.test.ts','scripts/check-affect-factor-view.mjs'];
const sources=sourcePaths.map(path=>{const b=fs.readFileSync(path),copy=root+'/sources/'+path;fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,b,{flag:'wx'});return {path,copy,sha256:sha(b)};});write('freeze.json',{sources});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {affectFactorView,AFFECT_FACTOR_AXES}=await server.ssrLoadModule('/src/workbench/affectFactorProjection.ts'),{AffectFactorView}=await server.ssrLoadModule('/src/workbench/AffectFactorView.tsx');
 const reference='docs/planning/workbench-affect-language-rev1/receipt.json',receipt=JSON.parse(fs.readFileSync(reference)),results=[],counts={programs:0,appraisals:0,missingFactors:0,knownZeroFactors:0,oneCoordinate:0,twoCoordinates:0,unavailableCoordinates:0};
 const decode=s=>s.replace(/&(amp|lt|gt|quot|#x27);/g,(_,k)=>({amp:'&',lt:'<',gt:'>',quot:'"','#x27':"'"}[k]));
 for(const entry of receipt.results){const bytes=fs.readFileSync(entry.file);assert.equal(sha(bytes),entry.sha256);const input=JSON.parse(bytes),before=JSON.stringify(input.explanations),rows=affectFactorView(input.explanations);
  for(const row of rows){counts.appraisals++;for(const f of Object.values(row.factors)){if(f===null)counts.missingFactors++;else if(BigInt(f.exact.split('/')[0])===0n)counts.knownZeroFactors++;}if(row.result.length===0)counts.unavailableCoordinates++;else if(row.result.length===1)counts.oneCoordinate++;else counts.twoCoordinates++;}
  const html=renderToStaticMarkup(createElement(AffectFactorView,{cards:input.explanations})),last=rows.at(-1);
  const exact=[...html.matchAll(/<td data-affect-factor-exact="true">([^<]+)<\/td>/g)].map(m=>decode(m[1]));
  assert.deepEqual(exact,last?AFFECT_FACTOR_AXES.map(a=>last.factors[a]?.exact??'Unavailable (not zero)'):[]);
  const provenance=[...html.matchAll(/<pre[^>]*data-affect-factor-source="true">([\s\S]*?)<\/pre>/g)].map(m=>decode(m[1]));assert.deepEqual(provenance,last?[last.provenance]:[]);
  assert.equal(JSON.stringify(input.explanations),before);counts.programs++;results.push({program:entry.program,source:entry.file,sha256:entry.sha256,appraisals:rows.length,projectionSha256:sha(JSON.stringify(rows)),renderSha256:sha(html)});
 }
 assert.equal(counts.programs,105);write('native-receipt.json',{status:'PASS RETAINED AFFECT FACTOR VIEW',reference:{path:reference,sha256:sha(fs.readFileSync(reference))},sources,counts,results,scope:'105 original main/supplementary retained evaluation artifacts. Exact recorded factors/coordinates and initial latest-appraisal rendering; no new native semantics or stored-emotion claim. Browser axis changes and history are separate.'});console.log(JSON.stringify(counts));
}catch(error){write('audit-failure.json',{message:String(error),stack:error.stack});throw error;}finally{await server.close();}
