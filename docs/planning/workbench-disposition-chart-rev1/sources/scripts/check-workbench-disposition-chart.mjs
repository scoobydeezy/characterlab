import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync,gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-chart-rev1',prior='docs/planning/workbench-disposition-comparison-rev1',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const sources=['src/workbench/dispositionChart.ts','src/workbench/DispositionChartPanel.tsx','src/workbench/DispositionComparisonPanel.tsx','src/workbench/dispositionDivergenceHistory.ts','scripts/check-workbench-disposition-chart.mjs',prior+'/receipt.json'].map(path=>{
 const b=fs.readFileSync(path),target=root+'/sources/'+path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,b,{flag:'wx'});return{path,sha256:sha(b)};
});
fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {dispositionChart:chart}=await server.ssrLoadModule('/src/workbench/dispositionChart.ts'),groups=new Map(),results=[];
 for(const a of JSON.parse(fs.readFileSync(prior+'/receipt.json')).artifacts.filter(a=>a.path.startsWith('comparison-'))){
  const bytes=fs.readFileSync(prior+'/'+a.path);assert.equal(sha(bytes),a.sha256);const r=JSON.parse(gunzipSync(bytes)),group=groups.get(r.contrast.id)??[];group.push(r);groups.set(r.contrast.id,group);
 }
 let reports=0,branches=0,absentPlastic=0;
 for(const [id,history] of groups){
  history.sort((a,b)=>a.a.prefix-b.a.prefix);const c=chart(history);assert.equal(c.rows.length,19);
  for(const row of c.rows){const r=history.find(r=>r.a.prefix===row.prefix);reports++;
   for(const b of row.branches){branches++;for(const [metric,rootId] of [['constitution','1457'],['plastic','1458']]){
    const field=r.fields.find(f=>f.root===rootId&&f[b.branch]!==null),v=b[metric];
    if(!field){assert.equal(metric,'plastic');assert.equal(r[b.branch].law,'Refold');assert.equal(v,null);absentPlastic++;continue;}
    assert.equal(v.exact,JSON.parse(field[b.branch])['Value [1]']);assert.equal(v.path,field.path);
    const [n,d]=v.exact.split('/').map(Number);assert.equal(v.plot,n/d);assert.equal(b.saveHash,r[b.branch].saveHash);
   }}
  }
  assert.deepEqual(chart(structuredClone(history)),c);const sparse=chart([history[0],history[2]]);assert.deepEqual(sparse.history.missingPrefixes,[1]);
  const invalid=structuredClone(history[0]);invalid.fields.find(f=>f.root==='1457').a='{}';assert.throws(()=>chart([invalid]),/record mismatch/);
  const path=id.replaceAll('/','-')+'.json.gz',bytes=gzipSync(JSON.stringify(c)+'\n');fs.writeFileSync(root+'/'+path,bytes,{flag:'wx'});results.push({id,path,sha256:sha(bytes)});
 }
 assert.equal(groups.size,30);assert.equal(reports,570);assert.equal(branches,1140);
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS STORED DISPOSITION CHART DATA',sources,results,counts:{contrasts:groups.size,reports,branches,absentPlastic},scope:'All archived comparison fields join exact committed branch paths/save identities. Constitution and plastic remain separate; absent Refold plastic leaves stay null. Sparse prefixes explicit; renderer only joins adjacent points. Floating plot coordinates are diagnostic. Browser rendering, full-resource bounds and general matrix/vector visualization remain separate.'},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({reports,branches,absentPlastic}));
}finally{await server.close();}
