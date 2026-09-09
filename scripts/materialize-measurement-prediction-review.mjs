// Canonical declaration review only. No prediction runtime or activation facade.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const revision=process.argv[2]??'1';assert(/^[1-9][0-9]*$/.test(revision),'Numeric review revision required');
const root=new URL('../',import.meta.url),folder=`docs/planning/campaign2-measurement-prediction-review${revision==='1'?'':'-rev'+revision}/`;
assert(!fs.existsSync(new URL(folder,root)),'Preserve review directories; choose a revision.');
const raw=p=>fs.readFileSync(new URL(p,root)),hash=b=>crypto.createHash('sha256').update(b).digest('hex'),fp=path=>({path,sha256:hash(raw(path))});
const paths=['scripts/materialize-measurement-prediction-review.mjs','src/campaign2/predictionCodecs.ts','src/campaign2/predictionModelReview.ts','docs/formal/MEASUREMENT_PREDICTION_ALLOCATION_TABLE.json','docs/formal/MEASUREMENT_PREDICTION_CORRECTION_ALLOCATION_TABLE.json','docs/formal/MEASUREMENT_PREDICTION_OCCURRENCE_CORRECTION.md','docs/planning/CAMPAIGN2_MEASUREMENT_PREDICTION_PACKAGING.md'];
const before=paths.map(fp),checks=[];
const check=(name,p)=>{assert(p,name);checks.push({name,status:'PASS'});};
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try{
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),{canonicalEncode:enc,list,set,record,unsigned:u,text,typedIdentifier}=c;
 const {commitManifest,createModelIdentity}=await server.ssrLoadModule('/src/substrate/identity.ts');
 const review=await server.ssrLoadModule('/src/campaign2/predictionModelReview.ts');
 const codec=await server.ssrLoadModule('/src/campaign2/predictionCodecs.ts'),{decodePrediction:decode,predictionRecord:r,predictionSupportedSchemas}=codec;
 const {memoryModelSource,memoryWrapperDeclarations}=await server.ssrLoadModule('/src/campaign2/memoryModelSource.ts');
 const {prepareMemoryModel}=await server.ssrLoadModule('/src/campaign2/memoryFactory.ts');
 const {compileValDeclarations}=await server.ssrLoadModule('/src/campaign2/valDeclarations.ts');
 const {compileCampaign2StateModel}=await server.ssrLoadModule('/src/campaign2/stateModel.ts');
 const f=(v,n)=>v.fields.get(BigInt(n)),key=v=>Buffer.from(enc(v)).toString('hex'),id=(n,s)=>typedIdentifier(n,text(s));
 const schemas=predictionSupportedSchemas(),schema=t=>{const s=schemas.find(s=>s.typeId===t);assert(s);return s;};
 check('exactly eleven prediction descriptors',schemas.filter(s=>s.typeId>=359n&&s.typeId<=369n).length===11);
 check('only corrected read schemas',schema(367n).schemaVersion===2n&&schema(368n).schemaVersion===2n);
 check('retired output-rule field remains declared optional',schema(367n).fields[1].required===false);
 const oldAllocation=JSON.parse(raw('docs/formal/MEASUREMENT_PREDICTION_ALLOCATION_TABLE.json'));
 const oldSchema=n=>{const s=oldAllocation.records.find(r=>r.typeId===n);return {typeId:BigInt(n),schemaVersion:1n,name:s.name,fields:s.fields.map(f=>({id:BigInt(f.id),name:f.name,required:f.required}))};};
 const ref=n=>r(254,[u(n),u(1)]);
 // Use direct record construction for the malformed old producer value; its semantic
 // interpretation is irrelevant:367/1 itself must not enter the selected decoder.
 const legacy=record(oldSchema(367),new Map([[1n,ref(366)],[2n,record(schema(275n),new Map([[1n,u(2)],[5n,id(1009,'MeasurementEpisodeEvidenceTransition')]]))]]));
 assert.throws(()=>decode(enc(legacy)));checks.push({name:'legacy367/1 rejects',status:'PASS'});
 const contaminated=record(schema(367n),new Map([[1n,ref(366)],[2n,r(278,[u(1),r(263,[u(1127)])])]]));
 assert.throws(()=>decode(enc(contaminated)));checks.push({name:'retired field presence rejects',status:'PASS'});
 const controls=[];let normal,normalIdentity;
 for(const a of [false,true])for(const p of [false,true])for(const F of [false,true])for(const R of [false,true])for(const B of [false,true])for(const P of [false,true]){
  const source=review.predictionModelReviewSource(a,p,F,R,B,P),slots=decode(source.registry).items;
  check('six slots '+[a,p,F,R,B,P].map(Number).join(''),slots.length===6);
  const rows=slots[0].items.filter(v=>v.kind==='record'&&v.schema.typeId===171n);
  const val=rows.filter(v=>['registry/semantic-kind','registry/domain-validator'].includes(f(v,2).payload.value));
  const kinds=val.filter(v=>f(v,2).payload.value==='registry/semantic-kind');
  const compiledCodec={decode,schema};
  await compileValDeclarations(enc(set(kinds)),enc(set([])),compiledCodec).compileContent(source.content,enc(slots[0]));
  const content=await compileValDeclarations(enc(set(val)),source.registry,compiledCodec).compileContent(source.content,enc(slots[0]));
  content.validateRecordRoles(source.registry);
  compileCampaign2StateModel(enc(slots[2]),enc(slots[3]),enc(slots[4]),content,compiledCodec);
  const w=memoryWrapperDeclarations(),base=memoryModelSource(a,p,F?w.formation:w.formationAblated,R?w.recall:w.recallAblated),bs=decode(base.registry).items;
  assert.deepEqual(source.content,base.content);assert.deepEqual(source.parameters,base.parameters);
  assert.equal(key(slots[1]),key(bs[1]));assert.equal(key(slots[3]),key(bs[3]));
  const find=name=>{const found=rows.filter(v=>f(v,1).payload.value===name);assert.equal(found.length,1);return f(found[0],4);};
  const ar=find('MeasurementPredictionApplicationTransition'),rr=find('MeasurementPredictionReadTransition');
  assert.equal(ar.schema.typeId,364n);assert.equal(rr.schema.schemaVersion,2n);
  assert.equal(f(ar,7).fields.get(1n).value,B?2n:1n);assert.equal(f(rr,7).items.length,P?1:0);
  if(P){const out=f(rr,7).items[0];assert.equal(out.schema.schemaVersion,2n);assert.equal(out.fields.has(2n),false);}
  const admission=find('definition/transition-admission'),routes=f(admission,2).entries;
  assert(routes.some(([k,v])=>key(k)===key(id(1009,'MeasurementPredictionApplicationTransition'))&&key(v)===key(id(1026,'route/character-learning'))));
  assert(!routes.some(([k])=>key(k)===key(id(1009,'MeasurementPredictionReadTransition'))));
  const occurrence=f(admission,3).entries.filter(([k])=>key(k)===key(ref(366)));assert.equal(occurrence.length,1);assert.equal(occurrence[0][1].schema.typeId,278n);assert.equal(f(f(occurrence[0][1],2),1).value,1127n);
  const identity=await createModelIdentity({...source,contentManifest:await commitManifest(decode(source.content)),parameterSet:await commitManifest(decode(source.parameters)),registryManifest:await commitManifest(decode(source.registry))});
  controls.push({available:a,permitted:p,formation:F,memoryRead:R,application:B,predictionRead:P,modelDigest:Buffer.from(identity.digest).toString('hex'),registryDigest:hash(source.registry)});
  if(a&&p&&F&&R&&B&&P){normal=source;normalIdentity=identity;}
  if(controls.length%16===0)console.log('Declaration/VAL/structural review: '+controls.length+'/64');
 }
 check('64 distinct committed controls',new Set(controls.map(x=>x.modelDigest)).size===64);
 assert(normal&&normalIdentity);assert.deepEqual(paths.map(fp),before);
 const normalRows=decode(normal.registry).items[0].items;
 const readRow=normalRows.find(v=>v.kind==='record'&&v.schema.typeId===171n&&f(v,1).payload.value==='MeasurementPredictionReadTransition');
 assert.throws(()=>decode(enc(record(oldSchema(368),f(readRow,4).fields))));checks.push({name:'legacy368/1 rejects',status:'PASS'});
 await assert.rejects(prepareMemoryModel(normal));checks.push({name:'old memory factory rejects new profile',status:'PASS'});
 const old=memoryModelSource();await assert.rejects(prepareMemoryModel({...normal,rulesVersion:old.rulesVersion,registrySchemaVersion:old.registrySchemaVersion,numericProfileVersion:old.numericProfileVersion}));checks.push({name:'relabelled new records cannot enter old memory profile',status:'PASS'});
 const priorRoot='docs/planning/campaign2-measurement-memory-model/',manifest=JSON.parse(raw(priorRoot+'REVIEW_MANIFEST.json')),freeze=JSON.parse(raw(priorRoot+'FREEZE.json'));
 const preserved=[...manifest.preservedSources,...freeze.files.map(x=>({path:priorRoot+x.name,sha256:x.sha256}))];for(const p of preserved)assert.deepEqual(fp(p.path),p);
 const human=v=>{if(typeof v==='boolean')return v;switch(v.kind){case'record':return {record:v.schema.name,typeId:String(v.schema.typeId),schemaVersion:String(v.schema.schemaVersion),fields:Object.fromEntries([...v.fields].map(([k,x])=>[k+':'+v.schema.fields.find(f=>f.id===k).name,human(x)]))};case'typedIdentifier':return {namespace:String(v.namespaceId),payload:human(v.payload)};case'list':case'set':return {kind:v.kind,items:v.items.map(human)};case'map':return {kind:'map',entries:v.entries.map(([k,x])=>({key:human(k),value:human(x)}))};case'bytes':return {kind:'bytes',hex:Buffer.from(v.value).toString('hex')};case'rational':return {kind:'rational',numerator:String(v.numerator),denominator:String(v.denominator)};default:return {kind:v.kind,value:String(v.value)};}};
 fs.mkdirSync(new URL(folder,root));
 for(const [name,bytes] of [['content',normal.content],['registry',normal.registry],['parameters',normal.parameters],['model-identity',normalIdentity.canonicalBytes]]){
  fs.writeFileSync(new URL(folder+name+'.cenc.hex',root),Buffer.from(bytes).toString('hex')+'\n');
  fs.writeFileSync(new URL(folder+name+'.json',root),JSON.stringify(human(decode(bytes)),null,2)+'\n');
 }
 fs.writeFileSync(new URL(folder+'CONTROL_COMMITMENTS.json',root),JSON.stringify(controls,null,2)+'\n');
 const report={status:'REVIEW MATERIALIZATION; NOT FROZEN OR ACTIVATED',modelDigest:Buffer.from(normalIdentity.digest).toString('hex'),profiles:review.PREDICTION_PROFILES,semanticBundle:review.PREDICTION_BUNDLE,sourceVersions:Object.fromEntries(Object.entries(normal).filter(([,v])=>typeof v==='string')),checks,controls:64,sourceFingerprints:before,preservedSources:preserved,limitations:['Real VAL/CONTENT role and generic ownership construction; not a complete prediction compiler.','No prediction runtime, application, read, stage dispatcher, trace or restore executes.','Full event/work accounting and old-profile exclusion remain materialization-review gates.','PRED-A..P remain NOT PASSED.']};
 fs.writeFileSync(new URL(folder+'REVIEW_MANIFEST.json',root),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({status:report.status,controls:64,checks:checks.length,modelDigest:report.modelDigest,preserved:preserved.length},null,2));
}finally{await server.close();}
