import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';
const root='docs/planning/workbench-general-matrix-browser-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const freeze=read(root+'/freeze.json'),oracle=read(root+'/oracle.json'),b=read(root+'/browser.json');
for(const s of freeze.sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);assert.equal(sha(fs.readFileSync(s.copy)),s.sha256);}
const archive=fs.readFileSync(freeze.archive.path);assert.equal(sha(archive),freeze.archive.sha256);const decoded=gunzipSync(archive);assert.equal(sha(decoded),freeze.archive.decodedSha256);
const snapshots=JSON.parse(decoded);for(const o of oracle){const s=snapshots.find(s=>s.prefix===o.prefix);assert.deepEqual(o,{prefix:s.prefix,graph:s.graph,hashes:[s.modelHash,s.runHash,s.stateHash,s.saveHash]});}
const g=oracle[0].graph,table=(graph,axes)=>graph.nodes.map((n,i)=>[n.label,...axes.map(j=>graph.weights[i][j].exact)]);
assert.deepEqual(b.hashes,oracle[0].hashes);assert.deepEqual(b.heatmap,g.weights.flat().map(w=>w.exact));
assert.deepEqual(b.labels,g.weights.flatMap((row,i)=>row.map((w,j)=>`${g.nodes[i].label} to ${g.nodes[j].label}: ${w.exact}`)));
assert.deepEqual(b.directed,g.weights.flatMap((row,i)=>row.flatMap((w,j)=>w.units==='0'?[]:[`${g.nodes[i].label} → ${g.nodes[j].label}: ${w.exact}`])));
assert.notEqual(g.weights[0][1].exact,g.weights[1][0].exact);
function projection(actual,axes,degrees){
 assert.deepEqual(actual.table,table(g,axes));assert.deepEqual(actual.titles,table(g,axes).map(r=>`${r[0]}: ${r.slice(1).join(', ')}`));
 const max=Math.max(...g.weights.flat().map(w=>w.display))||1,angle=degrees*Math.PI/180;
 assert.equal(actual.points.length,g.nodes.length);
 for(const [i,p] of actual.points.entries()){
  const [x,y,z]=axes.map(j=>g.weights[i][j].display/max-.5);
  const expected={x:240+135*(x*Math.cos(angle)-z*Math.sin(angle)),y:230-150*y+65*(x*Math.sin(angle)+z*Math.cos(angle))};
  for(const key of ['x','y']){assert(Number.isFinite(Number(p[key])));assert(Math.abs(Number(p[key])-expected[key])<1e-9);}
 }
}
projection(b.initial,[0,1,2],35);assert(b.initial.caption.includes('All display axes span 0 to 63/100, the current matrix maximum. Exact coordinates below retain the original scale.'));
assert.equal(b.swapped.rotation,'360');projection(b.swapped,[2,1,0],360);
assert.deepEqual(b.repeated.table,table(g,[2,2,0]));assert.equal(b.repeated.notice,'Repeated dimensions are selected; points lie in a lower-dimensional projection.');
assert.equal(b.advanced.status,'Prefix 6 · instant 6 · Ready');assert.deepEqual(b.advanced.hashes,oracle[1].hashes);assert.deepEqual(b.advanced.table,table(oracle[1].graph,[2,2,0]));
assert.equal(b.restored.status,'Prefix 5 · instant 5 · Ready');assert.deepEqual(b.restored.hashes,oracle[0].hashes);assert.deepEqual(b.restored.table,b.repeated.table);
assert.deepEqual(JSON.parse(b.exact),g);assert.deepEqual(b.finalHashes,oracle[0].hashes);assert.deepEqual(b.alerts,[]);
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS ASYMMETRIC GENERAL MATRIX BROWSER',recipe:freeze.recipe,prefixes:[5,6],scope:'Frozen-seed native identity joins, nine heatmap cells, six nonzero directed edges, exact three-axis table and plotted coordinates at35/360 degrees, reordered/repeated target identities, live6 update and checkpoint5 restore. Exact JSON and final native hashes unchanged by view selection. Bounded client qualification, not all43 browser programs or personality semantics/integrated entry.',artifacts:['freeze.json','oracle.json','browser.json','projection.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),verifier:{path:'scripts/check-workbench-general-matrix-browser.mjs',sha256:sha(fs.readFileSync('scripts/check-workbench-general-matrix-browser.mjs'))}},null,2)+'\n',{flag:'wx'});
console.log('PASS asymmetric General matrix browser projections and restore');
