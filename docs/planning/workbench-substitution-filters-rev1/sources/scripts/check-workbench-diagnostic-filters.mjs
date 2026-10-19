import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-substitution-filters-rev1',parentRoot='docs/planning/workbench-substitution-browser-programs-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),parent=JSON.parse(fs.readFileSync(parentRoot+'/receipt.json'));assert(!fs.existsSync(root));
const paths=['src/workbench/diagnosticSearch.ts','src/workbench/DiagnosticStateInspector.tsx','src/workbench/diagnosticInspector.css','src/workbench/SubstitutionWorkbench.tsx','src/test/workbenchDiagnosticSearch.test.ts','scripts/check-workbench-diagnostic-filters.mjs'];
const sources=paths.map(p=>{const bytes=fs.readFileSync(p),target=root+'/sources/'+p;fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes,{flag:'wx'});return{path:p,sha256:sha(bytes)};});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});const results=[];let comparisons=0,fields=0;
function tree(v){const out=new Map();function walk(x,p){out.set(p,JSON.stringify(x));if(x!==null&&typeof x==='object')for(const [k,c]of Object.entries(x))walk(c,p+'/'+k.replace(/~/g,'~0').replace(/\//g,'~1'));}walk(v,'');return out;}
try{
 const {indexDiagnosticState,compareDiagnosticIndexes,filterDiagnosticChanges}=await server.ssrLoadModule('/src/workbench/diagnosticSearch.ts');
 for(const file of parent.artifacts.filter(f=>f.program)){
  const bytes=fs.readFileSync(parentRoot+'/'+file.path);assert.equal(sha(bytes),file.sha256);const data=JSON.parse(gunzipSync(bytes)),states=data.rows.map(r=>JSON.parse(r.state));
  function check(a,b){
   const ai=indexDiagnosticState(a),bi=indexDiagnosticState(b);assert(!ai.error&&!bi.error);const before=tree(b),after=tree(a),actual=compareDiagnosticIndexes(ai,bi),paths=[...new Set([...after.keys(),...before.keys()])];assert.deepEqual(actual.map(r=>r.path),paths);
   const expected=paths.map(p=>({path:p,status:!before.has(p)?'added':!after.has(p)?'removed':before.get(p)===after.get(p)?'unchanged':'changed'}));
   assert.deepEqual(actual.map(({path,status})=>({path,status})),expected);
   for(const section of ['',...new Set(paths.filter(Boolean).map(p=>'/'+p.split('/')[1]))]){
    const wanted=expected.filter(r=>r.status!=='unchanged'&&(!section||r.path===section||r.path.startsWith(section+'/')));
    const found=filterDiagnosticChanges(actual,'',section,true);assert.equal(found.total,wanted.length);assert.deepEqual(found.matches.map(r=>r.path),wanted.slice(0,100).map(r=>r.path));assert.equal(found.limited,wanted.length>100);
   }
   comparisons++;fields+=actual.length;return expected.filter(r=>r.status!=='unchanged').length;
  }
  for(let n=0;n<states.length;n++){assert.equal(check(states[n],states[n]),0);if(n)results.push({program:file.program,from:n-1,to:n,forwardChanges:check(states[n],states[n-1]),reverseChanges:check(states[n-1],states[n])});}
 }
 assert.equal(comparisons,725);assert.equal(results.length,232);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS FULL ORIGINAL SUBSTITUTION DIAGNOSTIC DIFF/FILTER COHORT',sources,parent:{path:parentRoot+'/receipt.json',sha256:sha(fs.readFileSync(parentRoot+'/receipt.json'))},comparisons,fields,results,scope:'29 programs;261 self comparisons plus232 forward and232 reverse adjacent-prefix comparisons. Independent full subtree equality includes containers, additions, removals and exact original values. All top-level section changed-only results and explicit100-result limits checked. This is diagnostic structural change, not causal contribution or semantic object correspondence.'},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({status:'PASS',comparisons,fields}));
}finally{await server.close();}
