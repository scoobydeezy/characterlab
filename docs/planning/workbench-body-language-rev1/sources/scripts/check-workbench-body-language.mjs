import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-body-language-rev1',nativeRoot='docs/planning/workbench-body-parity-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});const native=read(nativeRoot+'/receipt.json'),catalog=read('src/workbench/bodyCatalog.json'),files=new Set();
function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
for(const p of ['src/workbench/bodyExplanations.ts','src/workbench/BodyWorkbench.tsx','src/workbench/bodyWorker.ts','scripts/check-workbench-body-language.mjs',nativeRoot+'/receipt.json','docs/formal/BODY_OWNERSHIP_COMPARISON_CONTRACT.md','docs/formal/EMBODIED_PRESSURE_PROJECTION_CORRECTION.md'])visit(p);
const sources=[...files].sort().map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return{path:p,sha256:sha(bytes)};});fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {BodyWorkbenchRun}=await server.ssrLoadModule('/src/workbench/bodyAdapter.ts'),{explainBodyPressure}=await server.ssrLoadModule('/src/workbench/bodyExplanations.ts');
 const field=(o,n)=>Object.entries(o).find(([k])=>k.endsWith(` [${n}]`))?.[1];
 let prefixes=0,descriptions=0,knownZero=0,unavailable=0;const results=[],finals={};
 for(const [index,p]of catalog.programs.entries()){
  const entry=native.results.find(r=>r.program===p.name),bytes=fs.readFileSync(nativeRoot+'/'+entry.path);assert.equal(sha(bytes),entry.sha256);const expected=JSON.parse(bytes).prefixes,run=await BodyWorkbenchRun.create(p.name),reports=[];let previous=[];
  for(;;){
   const s=run.snapshot(),before=sha(JSON.stringify(s)),original=expected[s.prefix];assert(original);
   for(const key of ['prefix','clock','modelHash','runHash','stateHash','saveHash','outputsHash','traceHash'])assert.equal(s[key],original[key]);
   const report=explainBodyPressure(s.pressureRecords),outputs=JSON.parse(s.researchOutputs).filter(o=>o.record?.startsWith('EmbodiedPressureOutput#464/'));
   assert.equal(report.rows.length,outputs.length);assert.deepEqual(report.rows.slice(0,previous.length),previous);
   for(const [i,row]of report.rows.entries()){
    const o=outputs[i],sample=field(o,3),pressure=field(o,4),available=sample.record.startsWith('EmbodiedLevelObservation#461/');assert.deepEqual(JSON.parse(row.exact),o);assert.equal(row.at,field(sample,4));assert.equal(row.available,available);
    assert.equal(row.pressure,available?field(pressure,2):null);
    if(available){assert.deepEqual(row.interval,{lower:field(field(sample,5),1),upper:field(field(sample,5),2)});assert(row.text.includes(row.pressure));if(row.pressure==='0/1'){knownZero++;assert(row.text.includes('known zero'));}}
    else{unavailable++;assert.equal(row.interval,null);assert(row.text.includes('unavailable'));assert(row.text.includes('not a zero-pressure'));}
    descriptions++;
   }
   assert.deepEqual(explainBodyPressure([...s.pressureRecords]),report);assert.equal(sha(JSON.stringify(run.snapshot())),before);
   reports.push({prefix:s.prefix,identity:original,report});previous=report.rows;prefixes++;
   if(!await run.advance())break;
  }
  assert.equal(reports.length,expected.length);finals[p.name]=reports.at(-1).report;
  const filename=`program-${String(index).padStart(2,'0')}.json`;fs.writeFileSync(root+'/'+filename,JSON.stringify(reports,null,2)+'\n',{flag:'wx'});results.push({program:p.name,path:filename,sha256:sha(fs.readFileSync(root+'/'+filename)),native:{path:nativeRoot+'/'+entry.path,sha256:entry.sha256}});console.log(`PASS BODY language ${index+1}/16 ${p.name}`);
 }
 assert.equal(prefixes,79);assert(knownZero>0&&unavailable>0);
 assert.deepEqual(finals.alias41.rows.map(r=>r.text),finals.alias49.rows.map(r=>r.text));
 assert.deepEqual(finals.alias41.rows.map(r=>r.evidenceHex),finals.alias49.rows.map(r=>r.evidenceHex));
 assert.notDeepEqual(finals.alias41.rows.map(r=>r.text),finals.fine41.rows.map(r=>r.text));
 const valid=finals.baseline.rows[0].evidenceHex;assert.throws(()=>explainBodyPressure([valid,valid]),/Duplicate/);assert.throws(()=>explainBodyPressure(['00']),/./);assert.throws(()=>explainBodyPressure(Array(101).fill(valid)),/limit/);
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BODY ADMITTED PRESSURE LANGUAGE',sources,results,counts:{programs:16,prefixes,descriptions,knownZero,unavailable},scope:'All original79 prefixes match qualified native hashes. Every description joins an exact public admitted pressure output, historical rows stay unchanged, hidden41/49 evidence/descriptions equal, finer sample differs, known zero and Unavailable remain distinct. No hidden reserve, delivery forecast, subjective feeling, choice explanation or component-owner language claim.'},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({status:'PASS',prefixes,descriptions,knownZero,unavailable}));
}finally{await server.close();}
