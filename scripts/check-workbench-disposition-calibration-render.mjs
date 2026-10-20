import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';import {createServer} from 'vite';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
const root='docs/planning/workbench-disposition-calibration-render-rev1',prior='docs/planning/workbench-disposition-calibration-rev1',script='scripts/check-workbench-disposition-calibration-render.mjs',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const sources=['src/workbench/DispositionCalibrationPanel.tsx','src/workbench/DispositionCalibrationReportPanel.tsx',script,prior+'/receipt.json','package-lock.json'].map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return{path:p,sha256:sha(bytes)};});fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const decode=s=>s.replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {DispositionCalibrationReportPanel:Panel}=await server.ssrLoadModule('/src/workbench/DispositionCalibrationReportPanel.tsx'),render=(report,error)=>renderToStaticMarkup(React.createElement(Panel,{report,error}));
 const parent=JSON.parse(fs.readFileSync(prior+'/receipt.json'));let events=0,emitted=0,nuclei=0,nonLearning=0,cells=0,sample;
 for(const artifact of parent.results){const bytes=fs.readFileSync(prior+'/'+artifact.path);assert.equal(sha(bytes),artifact.sha256);
  for(const report of JSON.parse(gunzipSync(bytes))){const original=JSON.stringify(report),html=render(report),embedded=html.match(/data-disposition-calibration="true">([\s\S]*?)<\/pre>/);assert(embedded);assert.deepEqual(JSON.parse(decode(embedded[1])),report);assert.equal(JSON.stringify(report),original);
   const shown=[...html.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(m=>decode(m[1]));
   if(report.emitted){
    emitted++;if(!report.learning)nonLearning++;nuclei+=report.nuclei.length;
    const expected=report.nuclei.flatMap(n=>[...n.roles.flatMap(row=>[row.role,row.signedTotal,row.boundedNet,row.modifier?.scaled??'die bands',row.modifier?.truncated??'—',row.modifier?.result??'—']),...n.bands.flatMap(b=>[b.cutoff,'d'+b.die,b.crossed?'Yes':'No']),...n.masses.flatMap(m=>[m.score,m.mass])]);assert.deepEqual(shown,expected);
    assert(html.includes(`Context: ${report.learning?'learning':'non-learning'}. Modifier unit: ${report.modifierUnit}.`));assert(html.includes(report.source));for(const n of report.nuclei)assert(html.includes(`Nucleus ${n.index} · d${n.die} · ${n.basePolarity}`));if(!sample)sample=report;
   }else{assert.equal(shown.length,0);assert(!html.includes('<table>'));assert(html.includes('No reason record was emitted'));}
   cells+=shown.length;events++;
  }
 }
 assert.deepEqual({events,emitted,nuclei,nonLearning},{events:270,emitted:250,nuclei:500,nonLearning:70});
 const error=render(sample,'Source failed');assert(error.includes('role="alert"'));assert(!error.includes('<table>'));assert(!error.includes('data-disposition-calibration'));const empty=render();assert(!empty.includes('<table>'));assert(!empty.includes('data-disposition-calibration'));
 fs.writeFileSync(root+'/sample.html',render(sample),{flag:'wx'});for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS CALIBRATION REPORT SERVER RENDER',sources,counts:{events,emitted,nuclei,nonLearning,cells},artifacts:[{path:'sample.html',sha256:sha(fs.readFileSync(root+'/sample.html'))}],scope:'All270 frozen reports: exact role/scaling/truncation/cap tables, die bands, score masses, context/source labels, embedded report and immutable inputs. Error overrides report; absent/undefined reports have no invented tables. Existing inspector delegates to reusable renderer. No fresh browser or paged worker integration claim.'},null,2)+'\n',{flag:'wx'});console.log('PASS calibration report renderer',JSON.stringify({events,emitted,nuclei,nonLearning,cells}));
}finally{await server.close();}
