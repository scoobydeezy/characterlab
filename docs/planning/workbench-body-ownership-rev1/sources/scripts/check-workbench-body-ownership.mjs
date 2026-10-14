import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';import{createServer}from'vite';
const root='docs/planning/workbench-body-ownership-rev1',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const originalPath='docs/planning/BODY_OWNERSHIP_RESULT_REV1.json',planPath='docs/planning/BODY_OWNERSHIP_PLAN_REV1.json',nativePath='docs/planning/workbench-body-parity-rev1/receipt.json';
const original=JSON.parse(fs.readFileSync(originalPath)),plan=JSON.parse(fs.readFileSync(planPath)),catalog=JSON.parse(fs.readFileSync('src/workbench/bodyCatalog.json')),native=JSON.parse(fs.readFileSync(nativePath));assert.equal(native.status,'PASS BODY SOURCE ADAPTER PARITY AND CONTINUATION');assert.equal(native.counts.programs,16);
for(const a of plan.artifacts)assert.equal(sha(fs.readFileSync(a.path)),a.path===catalog.runtimeSource.path?catalog.runtimeSource.currentSha256:a.sha256,a.path);
const paths=[...new Set(['src/workbench/bodyOwnership.ts','src/workbench/bodyCatalog.json','src/workbench/canonical.ts','src/test/workbenchBodyOwnership.test.ts','src/test/embodiedFixtures.ts','src/test/fixtures/campaign2Model.ts','scripts/check-workbench-body-ownership.mjs',originalPath,planPath,nativePath,...plan.artifacts.map(a=>a.path)])];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));for(const s of sources){const target=root+'/sources/'+s.path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(s.path),{flag:'wx'});}
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {inspectBodyOwnership,BODY_OWNERSHIP_CANDIDATES}=await server.ssrLoadModule('/src/workbench/bodyOwnership.ts'),results=[];
 assert.equal(BODY_OWNERSHIP_CANDIDATES.length,5);
 for(const [i,p]of catalog.programs.entries()){
  const report=await inspectBodyOwnership(p.name);assert.deepEqual(report.raw,original.results.find(r=>r.name===p.name));
  assert.equal(report.probes.length,report.raw.probes.length);
  for(const [j,probe]of report.probes.entries()){
   assert.equal(probe.values.length,5);assert.equal(probe.at,report.raw.probes[j].at);
   for(const [k,value]of probe.values.entries()){const c=BODY_OWNERSHIP_CANDIDATES[k];assert.equal(value.candidate,c.id);assert.equal(value.authority,c.authority);const text=report.raw.probes[j][c.field];assert.deepEqual(value.pressure,text==='Unavailable'?{kind:'Unavailable'}:{kind:'Known',exact:text});}
   assert.deepEqual(probe.values[0].pressure,probe.values[1].pressure);assert.deepEqual(probe.values[0].pressure,probe.values[4].pressure);
  }
  const path=`program-${String(i).padStart(2,'0')}.json`;fs.writeFileSync(root+'/'+path,JSON.stringify(report,null,2)+'\n',{flag:'wx'});results.push({program:p.name,path,sha256:sha(fs.readFileSync(root+'/'+path)),probes:report.probes.length,effects:report.effects.length});console.log(`PASS ${i+1}/16 ${p.name}: ${report.probes.length} five-candidate probes`);
 }
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BODY OWNERSHIP INSPECTION',sources,results,counts:{sourcePrograms:16,componentCandidates:5,probes:results.reduce((n,r)=>n+r.probes,0),effects:results.reduce((n,r)=>n+r.effects,0)},scope:'Actual unchanged accepted harness invoked on all16 original source programs under explicitly identified current wrapper repair. Complete raw results equal the retained qualified BODY matrix, including canonical saves, source state/output/trace, REG declaration, probes, effects and meter final state. Five typed projections preserve Known/Unavailable, diagnostic truth, evidence and authority distinctions. This is not80 public runs, production admission of controls, browser/language/continuous pressure qualification or Campaign4 entry.'},null,2)+'\n',{flag:'wx'});console.log('PASS full BODY ownership projection');
}finally{await server.close();}
