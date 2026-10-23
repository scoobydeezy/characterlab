import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {createServer} from 'vite';

const root='docs/planning/workbench-general-matrix-cohort-rev1';
const prior='docs/planning/workbench-general-comparison-cohort-rev1';
const native='docs/planning/workbench-general-cohort-rev1';
const sha=b=>createHash('sha256').update(b).digest('hex');
const write=(name,value)=>fs.writeFileSync(root+'/'+name,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const sources=['scripts/check-workbench-general-matrix-cohort.mjs','src/workbench/AssociationInspector.tsx','src/workbench/associationProjection.ts','src/workbench/canonical.ts','src/workbench/generalAdapter.ts','src/campaign3/generalBindingProfile.ts','package-lock.json',prior+'/receipt.json',native+'/receipt.json'].map(path=>{
 const bytes=fs.readFileSync(path),copy=root+'/sources/'+path;fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,bytes,{flag:'wx'});return{path,sha256:sha(bytes)};
});
write('freeze.json',{sources});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try {
 const {AssociationInspector}=await server.ssrLoadModule('/src/workbench/AssociationInspector.tsx');
 const {canonicalDecode,RecordSchemaRegistry}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {generalAttentionSupportedSchemas}=await server.ssrLoadModule('/src/campaign3/generalAttentionCodecs.ts');
 const {generalBindingContext}=await server.ssrLoadModule('/src/campaign3/generalBindingProfile.ts');
 const {exactText}=await server.ssrLoadModule('/src/workbench/canonical.ts');
 const registry=new RecordSchemaRegistry(generalAttentionSupportedSchemas()),scale=generalBindingContext().graphScale;
 const models=JSON.parse(fs.readFileSync(prior+'/receipt.json')).models,nativeArtifacts=JSON.parse(fs.readFileSync(native+'/receipt.json')).artifacts;
 const unescape=s=>s.replace(/&(amp|lt|gt|quot|#x27);/g,(_,x)=>({amp:'&',lt:'<',gt:'>',quot:'"','#x27':"'"}[x]));
 const gcd=(a,b)=>{while(b){[a,b]=[b,a%b];}return a;};
 const counts={programs:0,prefixes:0,absentGraphs:0,emptyGraphs:0,nodes:0,cells:0,nonzeroCells:0,asymmetricPairs:0},results=[];
 assert.equal(models.length,43);assert.equal(scale,100n);
 for(const [program,entry] of models.entries()) {
  const bytes=fs.readFileSync(prior+'/'+entry.path);assert.equal(sha(bytes),entry.sha256);
  const decoded=gunzipSync(bytes);assert.equal(sha(decoded),entry.decodedSha256);
  const snapshots=JSON.parse(decoded),nativeEntry=nativeArtifacts.find(a=>a.recipe===entry.recipe);assert(nativeEntry);
  const nativeBytes=fs.readFileSync(native+'/'+nativeEntry.path);assert.equal(sha(nativeBytes),nativeEntry.sha256);
  const oracle=JSON.parse(nativeBytes);assert.equal(snapshots.length,oracle.prefixes.length);
  const records=[];
  for(const s of snapshots) {
   const p=oracle.prefixes.find(p=>p.prefix===s.prefix);assert(p);assert.equal(s.recipe,oracle.recipe);
   for(const key of ['clock','modelHash','runHash','stateHash','saveHash'])assert.equal(s[key],p[key],key);
   const fields=s.fields.filter(f=>f.root==='631');assert(fields.length<=1);counts.prefixes++;
   if(!fields.length){assert.equal(s.graph,null);assert.equal(s.graphPath,null);counts.absentGraphs++;records.push({prefix:s.prefix,absent:true});continue;}
   const raw=JSON.parse(fields[0].exact),g=s.graph,before=JSON.stringify(g);
   assert.equal(s.graphPath,fields[0].path);assert.equal(raw.record,'AssociationGraph#625/1');
   assert.equal(g.version,'association-inspection/0.1');assert.equal(g.scale,String(scale));assert.equal(g.updatedAt,raw['LastUpdatedAt [3]']);
   const nodes=raw['Nodes [1]'],rows=raw['Rows [2]'];assert.equal(g.nodes.length,nodes.length);assert.equal(g.nodes.length,p.nodes);
   assert.equal(rows.length,nodes.length);assert.equal(g.weights.length,nodes.length);assert.equal(new Set(g.nodes.map(n=>n.id)).size,nodes.length);
   const expected=[];
   for(const [i,n] of g.nodes.entries()) {
    assert.equal(n.label,`Concept ${i+1}`);assert.deepEqual(JSON.parse(n.exact),nodes[i]);
    assert.match(n.id,/^(?:[0-9a-f]{2})+$/);assert.equal(exactText(canonicalDecode(new Uint8Array(Buffer.from(n.id,'hex')),registry)),n.exact);
    assert.equal(rows[i].record,'AssociationMassRow#624/1');assert.equal(rows[i]['Masses [1]'].length,nodes.length);assert.equal(g.weights[i].length,nodes.length);
    for(const [j,w] of g.weights[i].entries()) {
     assert.equal(w.units,rows[i]['Masses [1]'][j]);const units=BigInt(w.units);assert(units>=0n&&units<=scale);
     const divisor=gcd(units,scale);assert.equal(w.exact,`${units/divisor}/${scale/divisor}`);assert.equal(w.display,Number(units)/Number(scale));
     expected.push({label:`${n.label} to ${g.nodes[j].label}: ${w.exact}`,text:w.exact});counts.cells++;if(units)counts.nonzeroCells++;
     if(i<j&&w.units!==g.weights[j][i].units)counts.asymmetricPairs++;
    }
   }
   const html=renderToStaticMarkup(createElement(AssociationInspector,{graph:g}));
   const actual=[...html.matchAll(/<button aria-label="([^"]+)"[^>]*>([^<]+)<\/button>/g)].map(m=>({label:unescape(m[1]),text:unescape(m[2])}));
   assert.deepEqual(actual,expected);assert(html.includes(`scale ${g.scale} · updated at ${g.updatedAt}`));
   if(!nodes.length){assert(html.includes('No association nodes are present at this revision.'));counts.emptyGraphs++;}
   else {const exacts=[...html.matchAll(/<pre class="exact">([\s\S]*?)<\/pre>/g)].map(m=>unescape(m[1]));assert.deepEqual(exacts,[g.nodes[0].exact,g.nodes[0].exact]);}
   assert.equal(JSON.stringify(g),before);counts.nodes+=nodes.length;
   records.push({prefix:s.prefix,nodes:nodes.length,cells:expected.length,graphSha256:sha(before),renderSha256:sha(html),stateHash:s.stateHash,saveHash:s.saveHash});
  }
  counts.programs++;results.push({program,recipe:entry.recipe,archive:{path:prior+'/'+entry.path,sha256:entry.sha256,decodedSha256:entry.decodedSha256},native:{path:native+'/'+nativeEntry.path,sha256:nativeEntry.sha256},records});
  console.log(`PASS matrix ${program+1}/43`);
 }
 assert.equal(counts.prefixes,568);assert(counts.cells>0);assert(counts.asymmetricPairs>0);
 for(const source of sources)assert.equal(sha(fs.readFileSync(source.path)),source.sha256,source.path);
 write('receipt.json',{status:'PASS GENERAL REGISTERED MATRIX AND HEATMAP COHORT',sources,counts,results,scope:'All43 retained recipes/568 frozen-seed snapshots join native model/run/state/save identities. Exact State631/Record625 nodes, directions, units, fractions, scale and revision agree with archived projections; default server-rendered heatmap contains every directed cell and exact selected identities. No new native execution, client graph/three-axis interaction, personality-vector meaning, full browser coverage or integrated Campaign4 entry claim.'});
} catch(error) {write('failure.json',{message:String(error),stack:error.stack});throw error;}
finally {await server.close();}
