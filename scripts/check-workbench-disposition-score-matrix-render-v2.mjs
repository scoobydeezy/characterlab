import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';import {createServer} from 'vite';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
const root='docs/planning/workbench-disposition-score-matrix-render-rev2',prior='docs/planning/workbench-disposition-resolution-rev1',projection='docs/planning/workbench-disposition-score-matrix-rev1/receipt.json',script='scripts/check-workbench-disposition-score-matrix-render-v2.mjs',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const sources=['src/workbench/DispositionScoreMatrixPanel.tsx','src/workbench/dispositionScoreMatrix.ts',script,projection,prior+'/receipt.json','package-lock.json'].map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return{path:p,sha256:sha(bytes)};});
fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
const decode=s=>s.replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
try{
 const {DispositionScoreMatrixPanel:Panel}=await server.ssrLoadModule('/src/workbench/DispositionScoreMatrixPanel.tsx');
 const {dispositionScoreMatrix:matrix}=await server.ssrLoadModule('/src/workbench/dispositionScoreMatrix.ts');
 const render=r=>renderToStaticMarkup(React.createElement(Panel,{resolution:r,onEvent:()=>{throw Error('Render invoked navigation');}}));
 const parent=JSON.parse(fs.readFileSync(prior+'/receipt.json'));let events=0,cells=0,totals=0,automatic=0,absent=0,sample;
 for(const entry of parent.results){const bytes=fs.readFileSync(prior+'/'+entry.path);assert.equal(sha(bytes),entry.sha256);
  for(const resolution of JSON.parse(gunzipSync(bytes))){
   const original=JSON.stringify(resolution),r=matrix(resolution),html=render(resolution);assert.equal(JSON.stringify(resolution),original);
   const embedded=html.match(/data-disposition-score-matrix="true">([\s\S]*?)<\/pre>/);assert(embedded);assert.deepEqual(JSON.parse(decode(embedded[1])),r);
   const shown=[...html.matchAll(/<td data-score-component="\d"[^>]*><code>(.*?)<\/code><\/td>/g)].map(m=>decode(m[1]));
   assert.deepEqual(shown,r.rows.flatMap(row=>row.values));cells+=shown.length;
   const sums=[...html.matchAll(/<td data-score-total="true"><code>(.*?)<\/code><\/td>/g)].map(m=>decode(m[1]));assert.deepEqual(sums,r.rows.map(row=>row.total));totals+=sums.length;
   for(const row of r.rows)for(let i=0;i<3;i++)assert(html.includes(`aria-label="Nucleus ${row.nucleus}, ${r.columns[i]}: ${row.values[i]}"`));
   assert(html.includes(`Inspect matrix reason event ${r.reasonEvent}`));assert(html.includes(`Inspect matrix decision event ${r.decisionEvent}`));
   if(!resolution.emitted){absent++;assert(html.includes('no emitted resolution'));assert(!html.includes('<table>'));}
   else if(resolution.mode==='Auto'){automatic++;assert(html.includes('automatic resolution without draws'));assert(!html.includes('<table>'));}
   if(r.rows.length&&!sample)sample=structuredClone(resolution);events++;
  }
 }
 assert.deepEqual({events,cells,totals,automatic,absent},{events:270,cells:1248,totals:416,automatic:42,absent:20});
 // Explicitly synthetic UI controls; these do not expand the native corpus.
 const opposing=structuredClone(sample),draw=opposing.draws[0],key=JSON.parse(draw.key);key['Direction [4]']='2';draw.key=JSON.stringify(key);draw.contribution=String(-(BigInt(draw.face)+BigInt(draw.standing)+BigInt(draw.situational)));
 const opposingHtml=render(opposing);assert(opposingHtml.includes('rgba(170,65,40,'));assert(opposingHtml.includes(`<code>-${draw.face}</code>`));
 const invalid=structuredClone(sample);invalid.draws[0].contribution='999';const rejected=render(invalid);assert(rejected.includes('role="alert"'));assert(!rejected.includes('data-score-component'));assert(!rejected.includes('data-disposition-score-matrix'));
 fs.writeFileSync(root+'/sample.html',render(sample),{flag:'wx'});fs.writeFileSync(root+'/synthetic-opposing.html',opposingHtml,{flag:'wx'});
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS DISPOSITION SCORE MATRIX SERVER RENDER',sources,counts:{events,cells,totals,automatic,absent},artifacts:['sample.html','synthetic-opposing.html'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),scope:'Exact table cells, sums, accessible labels, event-link labels and embedded projection verified against all270 authenticated retained resolutions. Automatic/absent records have no sampled table. A separately synthetic opposing row checks negative color/sign; a synthetic arithmetic mismatch withholds all matrix content. No real-browser layout, keyboard/click navigation, live UI integration or full-entry claim.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS score matrix server rendering',JSON.stringify({events,cells,totals,automatic,absent}));
}finally{await server.close();}
