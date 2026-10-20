import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-paged-language-ui-rev1',script='scripts/check-workbench-disposition-paged-language-ui.mjs',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));
const freeze=read(root+'/freeze.json');for(const s of freeze.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
if(process.argv.includes('--oracle')){
 fs.writeFileSync(root+'/verifier.mjs',fs.readFileSync(script),{flag:'wx'});const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
 try{const {DispositionPagedRun:Run}=await server.ssrLoadModule('/src/workbench/dispositionPagedAdapter.ts'),run=await Run.create('Plastic/ConstitutionPositive');await run.advance();const summary=run.summary(),reports=['researcher','character','player'].map(audience=>run.diagnostic(summary.saveHash,{kind:'language',eventId:'18',audience}));
  const prior='docs/planning/workbench-disposition-language-rev2',receipt=read(prior+'/receipt.json'),bytes=fs.readFileSync(prior+'/program-13.json.gz');assert.equal(sha(bytes),receipt.results.find(r=>r.program===13).sha256);assert.deepEqual(reports[0].report,JSON.parse(gunzipSync(bytes))[0]);
  fs.writeFileSync(root+'/oracle.json',JSON.stringify({summary,reports},null,2)+'\n',{flag:'wx'});console.log('PASS paged language oracle');
 }finally{await server.close();}
}else{
 assert.equal(sha(fs.readFileSync(root+'/verifier.mjs')),sha(fs.readFileSync(script)));const o=read(root+'/oracle.json'),b=read(root+'/browser.json');assert.equal(b.reports.length,3);
 for(const [i,c]of b.reports.entries()){assert.deepEqual(JSON.parse(c.envelope),o.reports[i]);assert.deepEqual(JSON.parse(c.report),o.reports[i].report);assert.deepEqual(c.hashes,['modelHash','runHash','stateHash','saveHash','projectionHash'].map(k=>o.summary[k]));assert.deepEqual(c.alerts,[]);assert.deepEqual(c.texts,o.reports[i].report.rows.map(r=>r.text));}
 assert.equal(b.draftRetained,b.reports[0].envelope);assert.deepEqual(b.finalResearcher,b.reports[0]);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED PAGED LANGUAGE AUDIT BROWSER',audiences:3,scope:'Positive constitution prefix1: exact envelope/report/text/native identity; character/player report withholding; draft audience does not relabel loaded report; researcher round trip stable. Entire inspector remains researcher-only. No player-language completion, disclosure contract or full-horizon claim.',artifacts:['browser.json','oracle.json','language.png','verifier.mjs'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))}))},null,2)+'\n',{flag:'wx'});console.log('PASS paged language browser');
}
