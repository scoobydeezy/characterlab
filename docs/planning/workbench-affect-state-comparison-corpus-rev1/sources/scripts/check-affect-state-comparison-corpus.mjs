import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';

const root='docs/planning/workbench-affect-state-comparison-corpus-rev1';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const read=path=>JSON.parse(fs.readFileSync(path));
fs.mkdirSync(root);
const write=(path,value)=>fs.writeFileSync(`${root}/${path}`,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const references=['docs/planning/workbench-affect-parity-rev1/receipt.json','docs/planning/workbench-affect-supplements-rev1/receipt.json','docs/planning/workbench-batch-parity-rev8/manifest.json'];
const [main,supp,batch]=references.map(read);
const originals=new Map([...main.results,...supp.results].map(r=>[r.id,r]));
const paths=[...new Set([...batch.sources.map(s=>s.path),...['affectSession.ts','affectComparison.ts','affectStateComparison.ts','affectProfileSources.json','AffectStateComparisonPanel.tsx'].map(p=>'src/workbench/'+p),'scripts/check-affect-state-comparison-corpus.mjs'])];
const sources=paths.map(path=>{const bytes=fs.readFileSync(path),old=batch.sources.find(s=>s.path===path);if(old)assert.equal(sha(bytes),old.sha256,path);const copy=`${root}/sources/${path}`;fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,bytes,{flag:'wx'});return{path,copy,sha256:sha(bytes)};});
write('freeze.json',{sources,references:references.map(path=>({path,sha256:sha(fs.readFileSync(path))}))});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
const results=[];const counts={pairs:0,prefixes:0,historyChecks:0,writeLinks:0,differentTerminalPairs:0};
try{
 const load=path=>server.ssrLoadModule('/src/workbench/'+path);
 const {createAffectInspection}=await load('affectSession.ts');
 const {AFFECT_CONTRASTS,compareAffect}=await load('affectComparison.ts');
 const {compareAffectStoredState:project}=await load('affectStateComparison.ts');
 assert.equal(AFFECT_CONTRASTS.length,16);
 write('declarations.json',AFFECT_CONTRASTS);
 for(const contrast of AFFECT_CONTRASTS){
  const a=await createAffectInspection(contrast.a),b=await createAffectInspection(contrast.b),prefixes=[];
  let first=null;
  do{
   const av=a.snapshot(),bv=b.snapshot();
   for(const s of [av,bv]){const old=originals.get(s.program).prefixes[s.prefix];for(const key of ['stateHash','saveHash','outputsHash'])assert.equal(s[key],old[key]);}
   const comparison=compareAffect(av,bv),before=sha(JSON.stringify(comparison)),report=project(comparison);
   const paths=[...new Set([...av.fields,...bv.fields].map(f=>f.path))].sort();
   const expected=paths.map(path=>{const x=av.fields.find(f=>f.path===path),y=bv.fields.find(f=>f.path===path);return{path,root:x?.root??y.root,a:x?.exact??'Absent',b:y?.exact??'Absent'};});
   assert.deepEqual(report.rows.at(-1).fields.map(({path,root,a,b})=>({path,root,a,b})),expected);
   if(first===null&&expected.some(f=>f.a!==f.b))first={at:av.prefix===0?null:av.clock,initial:av.prefix===0};
   assert.deepEqual(report.firstDifference,first);
   for(const old of prefixes){assert.deepEqual(report.rows.slice(0,old.report.rows.length),old.report.rows);counts.historyChecks++;}
   for(const row of report.rows)for(const f of row.fields)for(const [branch,snapshot] of [['a',av],['b',bv]]){
    const id=f[branch+'Event'];if(id===null)continue;
    const event=snapshot.timeline.find(e=>e.id===id);assert(event);assert(row.at!==null&&BigInt(event.instant)<=BigInt(row.at));
    assert(event.diffs.some(d=>d.path===f.path&&d.after===f[branch]));counts.writeLinks++;
   }
   assert.equal(sha(JSON.stringify(comparison)),before);
   prefixes.push({prefix:av.prefix,identities:[av,bv].map(s=>({program:s.program,stateHash:s.stateHash,saveHash:s.saveHash,outputsHash:s.outputsHash})),report});counts.prefixes++;
   const am=await a.advance(),bm=await b.advance();assert.equal(am,bm);if(!am)break;
  }while(true);
  assert(a.snapshot().complete&&b.snapshot().complete);
  assert.equal(prefixes.length,originals.get(contrast.a).prefixes.length);assert.equal(prefixes.length,originals.get(contrast.b).prefixes.length);
  const file=`pair-${String(results.length).padStart(2,'0')}.json`;write(file,{contrast,prefixes});
  results.push({id:contrast.id,file,sha256:sha(fs.readFileSync(root+'/'+file)),prefixes:prefixes.length,firstDifference:first});counts.pairs++;if(first!==null)counts.differentTerminalPairs++;
  console.log(`PASS stored-state comparison ${counts.pairs}/16 ${contrast.id} prefixes=${prefixes.length}`);
 }
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 write('receipt.json',{status:'PASS FULL DECLARED AFFECT STATE COMPARISON CORPUS',counts,results,scope:'All sixteen declared original AFFECT pairs through their complete horizons. Exact native current-field oracle, original three-hash identities, stable historical rows and owning-branch recorded-write links. No general causal necessity, deletion provenance, player disclosure or Campaign4 entry claim.'});
}catch(error){write('failure.json',{message:String(error),stack:error.stack,counts,results});throw error;}finally{await server.close();}
