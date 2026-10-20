import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-chart-ui-rev1',prior='docs/planning/workbench-disposition-comparison-rev1',corpus='docs/planning/workbench-disposition-chart-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),b=read(root+'/browser.json'),receipt=read(corpus+'/receipt.json');
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {dispositionChart:chart}=await server.ssrLoadModule('/src/workbench/dispositionChart.ts'),artifacts=new Map(read(prior+'/receipt.json').artifacts.map(a=>[a.path,a.sha256]));
 for(const c of b.captures){
  const history=[];for(let p=0;p<=c.prefix;p++){const file=`comparison-${c.id.replaceAll('/','-')}-${p}.json.gz`,bytes=fs.readFileSync(prior+'/'+file);assert.equal(sha(bytes),artifacts.get(file));history.push(JSON.parse(gunzipSync(bytes)));}
  const r=chart(history);assert.deepEqual(c.report,r);assert.deepEqual(c.cells,r.rows.flatMap(row=>row.branches.flatMap(branch=>[String(row.prefix),branch.branch.toUpperCase(),branch.constitution.exact,branch.plastic?.exact??'No stored leaf (Refold)'])));
  const points=[];for(const metric of ['constitution','plastic'])for(let branch=0;branch<2;branch++)for(const row of r.rows){const v=row.branches[branch][metric];if(v)points.push({cx:String(40+row.prefix*580/18),cy:String(120-v.plot*100),title:`${branch===0?'A':'B'} prefix ${row.prefix}: ${v.exact}`});}
  assert.deepEqual(c.points,points);
 }
 assert.deepEqual(b.captures.map(c=>[c.id,c.prefix]),[['model/0/13',0],['model/0/13',1],['model/0/2',0]]);
 assert.equal(b.clearedOnSelection,true);for(const s of receipt.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED DISPOSITION CHART BROWSER',qualification:{path:corpus+'/receipt.json',sha256:sha(fs.readFileSync(corpus+'/receipt.json'))},verifier:{path:'scripts/check-workbench-disposition-chart-ui.mjs',sha256:sha(fs.readFileSync('scripts/check-workbench-disposition-chart-ui.mjs'))},artifacts:['browser.json','charts.png','charts-overview.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),scope:'Positive constitutional pair0/1 and Refold pair0: exact table, plot coordinates, accessible point titles and source reports match archived native comparisons. Selection clears old chart. No full-run browser, matrix/vector or integrated-entry claim.'},null,2)+'\n',{flag:'wx'});console.log('PASS browser chart source reports, exact tables, plotted points and Refold absence');
}finally{await server.close();}
