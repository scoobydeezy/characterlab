import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';import {createServer} from 'vite';import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
const root='docs/planning/workbench-disposition-reason-render-rev1',prior='docs/planning/workbench-disposition-reason-diagnostics-bounded-rev1',script='scripts/check-workbench-disposition-reason-render.mjs',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const sources=['src/workbench/DispositionReasonPanel.tsx','src/workbench/DispositionReasonReportPanel.tsx',script,prior+'/receipt.json','package-lock.json'].map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return{path:p,sha256:sha(bytes)};});fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const decode=s=>s.replaceAll('&quot;','"').replaceAll('&#x27;',"'").replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {DispositionReasonReportPanel:Panel}=await server.ssrLoadModule('/src/workbench/DispositionReasonReportPanel.tsx');
 const render=diagnostic=>renderToStaticMarkup(React.createElement(Panel,{diagnostic}));
 const parent=JSON.parse(fs.readFileSync(prior+'/receipt.json'));let observations=0,emitted=0,absent=0,nuclei=0,sample;
 for(const artifact of parent.results){const bytes=fs.readFileSync(prior+'/'+artifact.path);assert.equal(sha(bytes),artifact.sha256);
  for(const d of JSON.parse(gunzipSync(bytes))){
   const original=JSON.stringify(d),html=render(d),embedded=html.match(/data-disposition-reason-diagnostic="true">([\s\S]*?)<\/pre>/);assert(embedded);assert.deepEqual(JSON.parse(decode(embedded[1])),d);assert.equal(JSON.stringify(d),original);
   const cells=[...html.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(m=>decode(m[1]));
   if(d.emitted){
    emitted++;nuclei+=d.nuclei.length;
    const expected=[['Immutable constitution',d.constitution],['Prior plastic contribution',d.plastic],['Identity standing',d.standing],['Effective constitution + plastic',d.effective],['Selected final feedback',d.feedback]].flat();
    expected.push(...d.nuclei.flatMap(n=>[n.baseNet,n.standingNet,n.situationalNet,n.relevance,n.baseDie,n.standingModifier,n.situationalModifier]));assert.deepEqual(cells,expected);
    assert(html.includes(`${d.qualifiedEntries} qualified journal entries at this event.`));
    const sourcePre=[...html.matchAll(/<pre class="exact">([\s\S]*?)<\/pre>/g)].map(m=>decode(m[1]));assert.deepEqual(sourcePre,d.nuclei.flatMap(n=>[n.key,n.coverage,n.distribution]));
    for(let i=0;i<d.nuclei.length;i++)assert(html.includes(`aria-label="Compiled reason ${i+1}"`));if(!sample)sample=d;
   }else{absent++;assert.equal(cells.length,0);assert(!html.includes('<table>'));}
   assert(html.includes(decode(d.scope).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')));observations++;
  }
 }
 assert.equal(observations,parent.observations);assert.equal(emitted,parent.emitted);assert.equal(absent,parent.empty);assert.equal(nuclei,parent.nuclei);
 const empty=render(undefined);assert(!empty.includes('<table>'));assert(!empty.includes('data-disposition-reason-diagnostic'));
 fs.writeFileSync(root+'/sample.html',render(sample),{flag:'wx'});for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED REASON REPORT SERVER RENDER',sources,counts:{prefixes:parent.prefixes,observations,emitted,absent,nuclei},artifacts:[{path:'sample.html',sha256:sha(fs.readFileSync(root+'/sample.html'))}],scope:'All retained bounded diagnostic reports: exact operands, all seven nucleus terms, source/key/distribution disclosures, complete embedded diagnostic, scope and no-report/no-emission behavior. Original reports unchanged. Component extracted into the existing Reasoning panel for future worker report input. No browser layout, full15-program qualification, player-language, complete factor provenance or paged integration claim.'},null,2)+'\n',{flag:'wx'});console.log('PASS reason report renderer',JSON.stringify({observations,emitted,absent,nuclei}));
}finally{await server.close();}
