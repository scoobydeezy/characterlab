import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync,gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-language-rev2',prior='docs/planning/workbench-disposition-comparison-rev1',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const sources=['src/workbench/dispositionExplanations.ts','src/workbench/DispositionExplanationsPanel.tsx','src/workbench/DispositionReasonPanel.tsx','src/workbench/dispositionFactorSources.ts','src/workbench/dispositionReasonDiagnostics.ts','src/workbench/contracts.ts','src/substrate/exactMath.ts','scripts/check-workbench-disposition-language.mjs',prior+'/receipt.json'].map(path=>{
 const b=fs.readFileSync(path),target=root+'/sources/'+path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,b,{flag:'wx'});return {path,sha256:sha(b)};
});
fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {explainDispositionFactors:explain}=await server.ssrLoadModule('/src/workbench/dispositionExplanations.ts');
 const artifacts=new Map(JSON.parse(fs.readFileSync(prior+'/receipt.json')).artifacts.map(a=>[a.path,a.sha256])),renderings=new Map(),results=[];
 let events=0,descriptions=0,suppressed=0,gaps=0;const findings=[];
 for(let program=0;program<15;program++){
  const file=`snapshot-${program}-18.json.gz`,bytes=fs.readFileSync(prior+'/'+file);assert.equal(sha(bytes),artifacts.get(file));const s=JSON.parse(gunzipSync(bytes)),reports=[];
  for(const event of s.timeline.filter(e=>e.stage==='reasons')){
   const before=JSON.stringify(event),r=explain(event,s.seamVersion,'researcher');events++;reports.push(r);
   assert.deepEqual(explain(structuredClone(event),s.seamVersion,'researcher'),r);
   const altered=structuredClone(event);altered.reads=[];altered.input='[]';
   assert.deepEqual(explain(altered,s.seamVersion,'researcher'),r,'Unconsumed diagnostic/input fields must not add narrative knowledge');
   assert.equal(JSON.stringify(event),before);
   for(const audience of ['character','player']){
    const restricted=explain(event,s.seamVersion,audience);assert.deepEqual(restricted.rows,[]);suppressed+=r.rows.length;
    assert.deepEqual(restricted,explain({...event,id:'unrelated',instant:'999',output:'not parsed'},s.seamVersion,audience));
   }
   for(const row of r.rows){
    descriptions++;gaps+=row.issues.length;
    const key=JSON.stringify(row.semantic);if(renderings.has(key))assert.equal(row.text,renderings.get(key));else renderings.set(key,row.text);
    assert(row.text&&!/\b(I|feel|know|believe|probably|certain)\b/i.test(row.text));
    assert.equal(row.semantic.certaintyBand,'unavailable');assert.equal(row.semantic.strengthBand,'unqualified');
    assert.equal(row.mechanical.eventId,event.id);assert.equal(row.mechanical.sourceKey,row.sourceKey);
    const source=JSON.parse(event.output)[1]['Raw [4]']['Signals [3]'].find(v=>JSON.stringify(v['Key [1]'])===row.sourceKey);
    assert(source);assert.equal(row.semantic.exactStrength,source['SignedStrength [2]']);
    findings.push(...row.issues.map(issue=>({program,eventId:event.id,sourceKey:row.sourceKey,...issue})));
   }
   for(let i=0;i<r.rows.length;i++)for(let j=i+1;j<r.rows.length;j++)if(r.rows[i].text===r.rows[j].text) findings.push({program,eventId:event.id,code:JSON.stringify(r.rows[i].semantic)===JSON.stringify(r.rows[j].semantic)?'REDUNDANCY':'COLLISION',scope:'researcher sentence',sources:[r.rows[i].sourceKey,r.rows[j].sourceKey],detail:'Identical sentence requires the displayed semantic subject/source distinction; not a qualified player reason.'});
  }
  const path=`program-${program}.json.gz`,b=gzipSync(JSON.stringify(reports)+'\n');fs.writeFileSync(root+'/'+path,b,{flag:'wx'});results.push({program,path,sha256:sha(b),snapshot:{path:prior+'/'+file,sha256:sha(bytes)}});console.log(`PASS language audit ${program+1}/15`);
 }
 assert.equal(events,270);assert.equal(descriptions,750);assert.equal(suppressed,1500);assert.equal(gaps,1500);
 const b=gzipSync(JSON.stringify(findings)+'\n');fs.writeFileSync(root+'/findings.json.gz',b,{flag:'wx'});
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS DETERMINISTIC RESEARCHER LANGUAGE AUDIT; PLAYER LANGUAGE INCOMPLETE',sources,results,counts:{programs:15,events,descriptions,suppressed,gaps,uniqueSemantics:renderings.size,collisions:findings.filter(f=>f.code==='COLLISION').length,redundancy:findings.filter(f=>f.code==='REDUNDANCY').length},findings:{path:'findings.json.gz',sha256:sha(b)},scope:'750 researcher descriptions joined to exact original sources. Stable rendering for equivalent semantic records and researcher-only disclosure enforced.1500 missing-human-reason/opaque-subject findings remain open; these are repeated event observations, not unique research obligations. Character/player language, calibrated semantic bands and complete language qualification remain due. Input/read perturbations test exclusion only; no new native control is admitted.'},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
