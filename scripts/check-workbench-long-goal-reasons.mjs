import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-long-goal-reasons-rev1',parent='docs/planning/workbench-long-goal-parity-rev1/receipt.json',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root));const qualified=read(parent),files=new Set();
function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);if(!/\.(tsx?|mjs)$/.test(p))return;for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*(?:\(\s*)?)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',stem+'.tsx',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);visit(child);}}
for(const p of ['src/workbench/longGoalReasonDiagnostics.ts','src/workbench/LongGoalReasonPanel.tsx','scripts/check-workbench-long-goal-reasons.mjs',parent])visit(p);
const sources=[...files].sort().map(path=>{const bytes=fs.readFileSync(path),dest=root+'/sources/'+path;fs.mkdirSync(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});fs.writeFileSync(dest,bytes,{flag:'wx'});return {path,sha256:sha(bytes)};});
fs.writeFileSync(root+'/manifest.json',JSON.stringify({sources,requiredCases:120,requiredRows:1920},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
const artifacts=[];let rows=0,nuclei=0,coverage=0,empty=0,negativeChecks=0;
try{
 const {inspectLongGoalReasons}=await server.ssrLoadModule('/src/workbench/longGoalReasonDiagnostics.ts');
 const {decodeReceiving}=await server.ssrLoadModule('/src/campaign3/receivingCodecs.ts'),{exactText,fromHex}=await server.ssrLoadModule('/src/workbench/canonical.ts');
 for(const c of qualified.cases){
  const bytes=fs.readFileSync(c.historicalPath);assert.equal(sha(bytes),c.historicalSha256);const old=JSON.parse(bytes),reports=[];
  assert.equal(old.state.rows.length,16);
  for(const [index,row]of old.state.rows.entries()){
   const before=JSON.stringify(row.choice.nuclei),report=inspectLongGoalReasons(row.choice.nuclei);assert.equal(JSON.stringify(row.choice.nuclei),before);
   assert.equal(report.nuclei.length,row.choice.nuclei.length);if(!report.nuclei.length)empty++;
   for(const [i,n]of report.nuclei.entries()){
    const source=JSON.parse(exactText(decodeReceiving(fromHex(row.choice.nuclei[i])))),roles=source['RoleSummary [2]'];
    assert.equal(source.record,'CompiledReasonNucleus#407/1');
    for(const [key,field]of Object.entries({baseNet:'BaseNet [1]',standingNet:'StandingNet [2]',situationalNet:'SituationalNet [3]'}))assert.equal(n[key],roles[field]);
    for(const [key,field]of Object.entries({relevance:'Relevance [3]',baseDie:'BaseDie [4]',standingModifier:'StandingModifier [5]',situationalModifier:'SituationalModifier [6]'}))assert.equal(n[key],source[field]);
    assert.deepEqual(JSON.parse(n.identity),source['Key [1]']);assert.deepEqual(JSON.parse(n.distribution),source['Distribution [7]']);
    assert.equal(n.coverage.length,roles['CoverageResults [4]'].length);
    for(const [j,operand]of n.coverage.entries()){
     const original=roles['CoverageResults [4]'][j];assert.deepEqual(JSON.parse(operand.source),original['SourceKey [1]']);
     for(const [key,field]of Object.entries({magnitude:'RawMagnitude [2]',overlap:'OverlapWithPrior [3]',independent:'IndependentFraction [4]',effective:'EffectiveMagnitude [5]'}))assert.equal(operand[key],original[field]);
     coverage++;
    }nuclei++;
   }
   if(!negativeChecks&&row.choice.nuclei.length){assert.throws(()=>inspectLongGoalReasons([row.choice.nuclei[0],row.choice.nuclei[0]]),/duplicate/);assert.throws(()=>inspectLongGoalReasons(['00']));assert.throws(()=>inspectLongGoalReasons(Array(33).fill('')));negativeChecks=3;}
   reports.push({prefix:index+1,at:row.at,nucleiHash:sha(before),report});rows++;
  }
  const filename=`case-${String(c.index).padStart(3,'0')}.json`;fs.writeFileSync(root+'/'+filename,JSON.stringify(reports)+'\n',{flag:'wx'});artifacts.push({path:filename,sha256:sha(fs.readFileSync(root+'/'+filename)),source:c.historicalPath,sourceSha256:c.historicalSha256});
  console.log(`PASS LONG goal reasons ${c.index+1}/120`);
 }
 assert.equal(rows,1920);assert.equal(artifacts.length,120);assert.equal(negativeChecks,3);
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS ALL ORIGINAL LONG GOAL RECORDED NUCLEI',sources,artifacts,counts:{cases:120,rows,nuclei,coverage,empty,negativeChecks},scope:'Every retained compiled nucleus and coverage operand is read without changing source records. Compared to exact original canonical records in120 qualified component cases. Missing raw signals/bases are not reconstructed. No full factor accounting, observer narration, independent causal explanation or browser qualification.'},null,2)+'\n',{flag:'wx'});
}catch(error){fs.writeFileSync(root+'/failure.json',JSON.stringify({error:String(error),counts:{rows,nuclei,coverage,empty},artifacts},null,2)+'\n',{flag:'wx'});throw error;}finally{await server.close();}
