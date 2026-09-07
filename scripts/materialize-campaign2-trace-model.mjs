// Review-only identity construction. No new runtime version support or trace activation.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),oldFolder=new URL('docs/planning/campaign2-first-model/',root);
const folder=new URL('docs/planning/campaign2-trace-model/',root);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {firstModelCandidate}=await server.ssrLoadModule('/src/campaign2/firstModelCandidate.ts');
 const {compileBoundedModelDeclarations,BOUNDED_SEMANTIC_BUNDLE}=await server.ssrLoadModule('/src/campaign2/modelPackaging.ts');
 const {decodeCampaign2}=await server.ssrLoadModule('/src/campaign2/codecs.ts');
 const {canonicalEncode}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {commitManifest,createModelIdentity}=await server.ssrLoadModule('/src/substrate/identity.ts');
 const source=firstModelCandidate(),old=await compileBoundedModelDeclarations(source);
 const rulesVersion='rules/campaign2-bounded-bridge/0.2-candidate';
 const semanticBundle=[...BOUNDED_SEMANTIC_BUNDLE,'trace/0.2-candidate','campaign2-trace-binding/0.1-candidate'];
 const authority=fs.readFileSync(new URL('docs/formal/CAMPAIGN2_BOUNDED_RULES_02.md',root),'utf8');
 assert(authority.includes('`'+rulesVersion+'`'));assert(authority.includes('```text\n'+semanticBundle.join('\n')+'\n```'));
 const replacement=await createModelIdentity({...source,rulesVersion,
  contentManifest:await commitManifest(decodeCampaign2(source.content)),
  parameterSet:await commitManifest(decodeCampaign2(source.parameters)),
  registryManifest:await commitManifest(decodeCampaign2(source.registry))});
 const changed=[];
 for(const [field,value] of old.modelIdentity.value.fields){
  if(!Buffer.from(canonicalEncode(value)).equals(Buffer.from(canonicalEncode(replacement.value.fields.get(field)))))
   changed.push({field:String(field),name:old.modelIdentity.value.schema.fields.find(f=>f.id===field).name,oldValue:value.value,newValue:replacement.value.fields.get(field).value});
 }
 assert.deepEqual(changed,[{field:'1',name:'RulesVersion',oldValue:source.rulesVersion,newValue:rulesVersion}]);
 assert.notDeepEqual(replacement.canonicalBytes,old.modelIdentity.canonicalBytes);
 assert.notDeepEqual(replacement.digest,old.modelIdentity.digest);
 function readable(v){
  if(typeof v==='boolean')return v;
  switch(v.kind){
   case 'record':return {record:`${v.schema.name}/${v.schema.typeId}/${v.schema.schemaVersion}`,fields:Object.fromEntries([...v.fields].map(([id,value])=>[`${id}:${v.schema.fields.find(f=>f.id===id).name}`,readable(value)]))};
   case 'typedIdentifier':return {namespace:String(v.namespaceId),payload:readable(v.payload)};
   case 'list':case 'set':return {[v.kind]:v.items.map(readable)};
   case 'map':return {map:v.entries.map(([k,x])=>[readable(k),readable(x)])};
   case 'bytes':return {bytes:Buffer.from(v.value).toString('hex')};
   default:return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,typeof x==='bigint'?String(x):x]));
  }
 }
 const artifacts={content:source.content,parameters:source.parameters,registry:source.registry,
  'content-identity':canonicalEncode(replacement.value.fields.get(2n)),
  'parameter-identity':canonicalEncode(replacement.value.fields.get(3n)),
  'registry-identity':canonicalEncode(replacement.value.fields.get(6n)),
  'model-identity':replacement.canonicalBytes};
 const oldNames=fs.readdirSync(oldFolder).sort(),preserved=oldNames.map(name=>({name,sha256:hash(fs.readFileSync(new URL(name,oldFolder)))}));
 assert.equal(oldNames.length,15);
 const priorReport=JSON.parse(fs.readFileSync(new URL('REVIEW_MANIFEST.json',oldFolder),'utf8'));
 assert.deepEqual(BOUNDED_SEMANTIC_BUNDLE,priorReport.semanticBundle);
 assert.equal(Buffer.from(old.modelIdentity.canonicalBytes).toString('hex')+'\n',fs.readFileSync(new URL('model-identity.cenc.hex',oldFolder),'utf8'));
 if(process.argv.includes('--write'))fs.mkdirSync(folder,{recursive:true});
 const files=[];
 for(const [name,bytes] of Object.entries(artifacts)){
  const hex=Buffer.from(bytes).toString('hex')+'\n',json=JSON.stringify(readable(decodeCampaign2(bytes)),null,2)+'\n';
  const oldHex=fs.readFileSync(new URL(name+'.cenc.hex',oldFolder),'utf8');
  if(name!=='model-identity'){assert.equal(hex,oldHex,name+' exact bytes');assert.equal(json,fs.readFileSync(new URL(name+'.json',oldFolder),'utf8'));}
  if(process.argv.includes('--write')){fs.writeFileSync(new URL(name+'.cenc.hex',folder),hex);fs.writeFileSync(new URL(name+'.json',folder),json);}
  assert.equal(fs.readFileSync(new URL(name+'.cenc.hex',folder),'utf8'),hex);
  assert.equal(fs.readFileSync(new URL(name+'.json',folder),'utf8'),json);
  files.push({name,path:name+'.cenc.hex',bytes:bytes.length,sha256:hash(bytes),oldSha256:hash(Buffer.from(oldHex.trim(),'hex')),comparison:name==='model-identity'?'RulesVersion-only change':'byte-identical'});
 }
 const report={status:'CONCRETE BYTES ACCEPTED AND FROZEN',versions:{...priorReport.versions,rulesVersion},
  profiles:{...old.profiles,trace:'campaign2-trace-binding/0.1-candidate'},semanticBundle,
  oldRulesVersion:source.rulesVersion,oldModelDigest:Buffer.from(old.modelIdentity.digest).toString('hex'),
  modelDigest:Buffer.from(replacement.digest).toString('hex'),structuralOperandDiff:changed,files,
  preservedOldPacket:preserved,counts:priorReport.counts,parameterValue:priorReport.parameterValue,
  limitations:['Replacement identity is frozen; implementation qualification remains separate.','Old model is immutable; no save migration alias.','TRACE-C2-M COMPONENT / MATERIALIZATION PASS; remaining trace controls require implementation evidence.']};
 const reportText=JSON.stringify(report,null,2)+'\n';
 if(process.argv.includes('--write'))fs.writeFileSync(new URL('REVIEW_MANIFEST.json',folder),reportText);
 assert.equal(fs.readFileSync(new URL('REVIEW_MANIFEST.json',folder),'utf8'),reportText);
 for(const p of preserved)assert.equal(hash(fs.readFileSync(new URL(p.name,oldFolder))),p.sha256);
 console.log(JSON.stringify({status:report.status,oldModelDigest:report.oldModelDigest,modelDigest:report.modelDigest,structuralOperandDiff:changed,unchangedArtifacts:6,preservedOldFiles:15},null,2));
}finally{await server.close();}
