import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync,gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-score-matrix-rev1',prior='docs/planning/workbench-disposition-resolution-rev1',script='scripts/check-workbench-disposition-score-matrix.mjs',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const sources=['src/workbench/dispositionScoreMatrix.ts',script,prior+'/receipt.json'].map(p=>{const bytes=fs.readFileSync(p),dest=root+'/sources/'+p;fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return{path:p,sha256:sha(bytes)};});
fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {dispositionScoreMatrix:matrix}=await server.ssrLoadModule('/src/workbench/dispositionScoreMatrix.ts'),receipt=JSON.parse(fs.readFileSync(prior+'/receipt.json')),reports=[];
 let events=0,rows=0,cells=0,automatic=0,absent=0,negativeCells=0;let sample;
 for(const result of receipt.results){
  const bytes=fs.readFileSync(prior+'/'+result.path);assert.equal(sha(bytes),result.sha256);
  for(const resolution of JSON.parse(gunzipSync(bytes))){
   const before=JSON.stringify(resolution),r=matrix(resolution);assert.equal(JSON.stringify(resolution),before);assert.deepEqual(matrix(resolution),r);events++;
   if(!resolution.emitted){absent++;assert.equal(r.availability,'no emitted resolution');}
   else if(resolution.mode==='Auto'){automatic++;assert.equal(r.availability,'automatic resolution without draws');}
   assert.equal(r.rows.length,resolution.draws.length);
   for(let i=0;i<r.rows.length;i++){
    const row=r.rows[i],draw=resolution.draws[i],sign=JSON.parse(draw.key)['Direction [4]']==='1'?1n:-1n;
    const expected=[draw.face,draw.standing,draw.situational].map(v=>String(BigInt(v)*sign));
    assert.deepEqual(row.values,expected);assert.deepEqual(row.cells.map(c=>c.exact),expected);
    assert.equal(row.total,draw.contribution);assert.equal(row.values.reduce((sum,v)=>sum+BigInt(v),0n),BigInt(draw.contribution));
    assert.equal(row.candidate,draw.candidate);assert.equal(row.key,draw.key);
    for(const c of row.cells){assert(Number.isFinite(c.normalized));assert(Math.abs(c.normalized)<=1);if(BigInt(c.exact)<0n)negativeCells++;cells++;}rows++;
   }
   if(r.rows.length&&!sample)sample=structuredClone(resolution);
   reports.push({program:result.program,report:r});
  }
 }
 assert.equal(events,270);assert.equal(rows,416);assert.equal(cells,1248);assert.equal(automatic,42);assert.equal(absent,20);
 // Synthetic rejection controls are not corpus witnesses.
 const wrong=structuredClone(sample);wrong.draws[0].contribution='999';assert.throws(()=>matrix(wrong),/contribution/);
 const direction=structuredClone(sample),key=JSON.parse(direction.draws[0].key);key['Direction [4]']='0';direction.draws[0].key=JSON.stringify(key);assert.throws(()=>matrix(direction),/identity/);
 const duplicate=structuredClone(sample);duplicate.draws=[duplicate.draws[0],duplicate.draws[0]];assert.throws(()=>matrix(duplicate),/identity/);
 const automaticDraw=structuredClone(sample);automaticDraw.mode='Auto';assert.throws(()=>matrix(automaticDraw),/Unrolled/);
 const badInteger=structuredClone(sample);badInteger.draws[0].face='01';assert.throws(()=>matrix(badInteger),/integer/);
 const absentDraw=structuredClone(sample);absentDraw.emitted=false;assert.throws(()=>matrix(absentDraw),/Unrolled/);
 const badVersion=structuredClone(sample);badVersion.version='other';assert.throws(()=>matrix(badVersion),/Unqualified/);
 const saved=gzipSync(JSON.stringify(reports)+'\n');fs.writeFileSync(root+'/reports.json.gz',saved,{flag:'wx'});
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS DISPOSITION RECORDED SCORE MATRIX',sources,counts:{programs:15,events,rows,cells,automatic,absent,negativeCells},artifact:{path:'reports.json.gz',sha256:sha(saved)},scope:'All270 authenticated resolution reports,416 native recorded draws. Exact signed components and sums agree with retained original-linked resolution evidence; deterministic detached projection and seven rejection controls pass. No new runtime execution, current UI integration, browser rendering, latent-state vector or integrated-entry acceptance claim.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS',JSON.stringify({events,rows,cells,automatic,absent,negativeCells}));
}finally{await server.close();}
