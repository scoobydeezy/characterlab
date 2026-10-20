import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-long-architecture-rev1',parent='docs/planning/workbench-long-navigation-rev2/receipt.json',nativeRoot='docs/planning/workbench-long-parity-rev2',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const files=new Set();
function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
for(const p of ['src/workbench/longArchitecture.ts','src/workbench/LongArchitectureInspector.tsx','src/workbench/LongWorkbench.tsx','src/campaign3/longitudinalModel.ts','CHARACTER_ARCHITECTURE.md','docs/formal/LONGITUDINAL_PUBLIC_CONTRACT_REV2.md',parent,nativeRoot+'/receipt.json','scripts/check-workbench-long-architecture.mjs'])visit(p);
const sources=[...files].sort().map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return {path:p,sha256:sha(bytes)};});
fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {longArchitectureFromParticipation:project,LONG_ARCHITECTURE_BINDINGS:bindings,LONG_ARCHITECTURE_CONTROL:control}=await server.ssrLoadModule('/src/workbench/longArchitecture.ts');
 const {compileLongitudinalModel,stageWrites,owner,STAGES}=await server.ssrLoadModule('/src/campaign3/longitudinalModel.ts');
 const catalog=read('src/workbench/longCatalog.json'),before=read(parent),native=read(nativeRoot+'/receipt.json'),architecture=fs.readFileSync('CHARACTER_ARCHITECTURE.md','utf8');
 const expectedBoxes={'867':'Episodic','868':'Relationships','870':'Person','871':'Skill','872':'IdentityEvidence','873':'Relationships'};
 const referenceRoot=r=>r.root??Object.entries(JSON.parse(r.label)).find(([k])=>k.endsWith(' [1]'))[1];
 assert.deepEqual(Object.fromEntries(bindings.map(b=>[b.root,b.box])),expectedBoxes);for(const b of bindings)assert(architecture.includes(`${b.box}[`));
 for(const m of catalog.models){
  const source=Object.fromEntries(['content','registry','parameters'].map(k=>[k,Uint8Array.from(Buffer.from(m[k],'hex'))])),model=await compileLongitudinalModel(source);
  for(const [stage]of STAGES)for(const p of stageWrites(stage,model.settings)){
   const binding=bindings.find(b=>b.root===String(p.rootStateTypeId))??control;assert.equal(binding.root,String(p.rootStateTypeId));
   assert.equal(owner(stage,model.settings).payload.value,binding.authority);
   if(binding===control)assert.equal(model.settings.representation,4);
  }
 }
 assert.equal(before.results.length,32);const results=[];let prefixes=0,mapped=0,controls=0,unclassified=0;
 for(const [index,entry]of before.results.entries()){
  const bytes=fs.readFileSync(entry.path);assert.equal(sha(bytes),entry.sha256);const input=JSON.parse(bytes);
  const n=native.results.find(p=>p.program===entry.program);assert(n);const nb=fs.readFileSync(nativeRoot+'/'+n.path);assert.equal(sha(nb),n.sha256);const expected=JSON.parse(nb).prefixes;assert.equal(input.length,expected.length);
  const reports=input.map((row,i)=>{
   assert.equal(row.prefix,i);for(const k of ['prefix','modelHash','runHash','stateHash','saveHash'])assert.equal(row.participation.identity[k],expected[i][k]);
   const original=JSON.stringify(row.participation),report=project(entry.program,catalog.contract,row.participation);
   assert.equal(report.rows.length,row.participation.rows.length);
   for(const [j,r]of report.rows.entries()){
    const prior=row.participation.rows[j];for(const k of ['path','label','reads','mutations','changes','presentAtRevision','events'])assert.deepEqual(r[k],prior[k]);
    assert.equal(r.root,referenceRoot(prior));assert.equal(r.binding?.box,expectedBoxes[r.root]);assert.equal(!!r.control,r.root==='875');
    if(r.binding)mapped++;else if(r.control)controls++;else unclassified++;
   }
   for(const b of report.boxes){
    const rows=row.participation.rows.filter(r=>expectedBoxes[referenceRoot(r)]===b.box);assert.equal(b.observedPaths,rows.length);
    for(const k of ['reads','mutations','changes'])assert.equal(b[k],rows.reduce((n,r)=>n+r[k],0));
    assert.equal(b.currentlyPresent,rows.filter(r=>r.presentAtRevision).length);assert.deepEqual(new Set(b.eventIds),new Set(rows.flatMap(r=>r.events.map(e=>e.id))));
   }
   assert.equal(JSON.stringify(row.participation),original);assert.deepEqual(project(entry.program,catalog.contract,row.participation),report);prefixes++;return report;
  });
  const filename=`program-${String(index).padStart(2,'0')}.json.gz`,compressed=gzipSync(JSON.stringify(reports),{level:9});fs.writeFileSync(root+'/'+filename,compressed,{flag:'wx'});results.push({program:entry.program,path:filename,sha256:sha(compressed),parent:{path:entry.path,sha256:entry.sha256},native:{path:nativeRoot+'/'+n.path,sha256:n.sha256}});
  if(index===0){
   const p=input[0].participation,bad=structuredClone(p);bad.rows[0].root='0';assert.throws(()=>project(entry.program,catalog.contract,bad),/root\/path/);
   const duplicate=structuredClone(p);duplicate.rows.push(duplicate.rows[0]);assert.throws(()=>project(entry.program,catalog.contract,duplicate),/duplicate/);
   assert.throws(()=>project(entry.program,'wrong',p),/profile/);
  }
 }
 assert.equal(prefixes,513);assert.equal(unclassified,0);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS LONG CANONICAL STATE CORRESPONDENCE',sources,results,counts:{programs:32,prefixes,mappedPathObservations:mapped,controlPathObservations:controls,unclassifiedPathObservations:unclassified},scope:'All513 already-qualified navigation prefixes joined to exact native identity/save records. Six root correspondences/five canonical boxes verified against accepted topology and actual model write ownership. Destructive shared-slot counts excluded. Does not establish causal edges, evaluation contribution, all successors or Campaign4 entry.'},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({status:'PASS',programs:32,prefixes,mapped,controls,unclassified}));
}finally{await server.close();}
