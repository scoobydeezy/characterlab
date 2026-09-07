// Review packet only. Does not construct an authoritative probe runtime.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),folder=new URL('docs/planning/campaign2-probe-model/',root);
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const prior=['campaign2-first-model','campaign2-trace-model'].flatMap(dir=>fs.readdirSync(new URL(`docs/planning/${dir}/`,root)).sort().map(name=>{const path=`docs/planning/${dir}/${name}`;return {path,sha256:hash(fs.readFileSync(new URL(path,root)))};}));
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
 const {probeModelReviewSource,compileProbeModelReview,decodeProbeReview}=await server.ssrLoadModule('/src/campaign2/probeModelReview.ts');
 const {canonicalEncode}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const source=probeModelReviewSource(),compiled=await compileProbeModelReview(source),model=compiled.modelIdentity;
 const oldFolder=new URL('docs/planning/campaign2-trace-model/',root),oldBytes=n=>Buffer.from(fs.readFileSync(new URL(n+'.cenc.hex',oldFolder),'utf8').trim(),'hex');
 const oldModel=decodeProbeReview(oldBytes('model-identity'));
 const artifacts={content:source.content,parameters:source.parameters,registry:source.registry,'content-identity':canonicalEncode(model.value.fields.get(2n)),'parameter-identity':canonicalEncode(model.value.fields.get(3n)),'registry-identity':canonicalEncode(model.value.fields.get(6n)),'model-identity':model.canonicalBytes};
 function readable(v){if(typeof v==='boolean')return v;switch(v.kind){case 'record':return {record:`${v.schema.name}/${v.schema.typeId}/${v.schema.schemaVersion}`,fields:Object.fromEntries([...v.fields].map(([id,x])=>[`${id}:${v.schema.fields.find(f=>f.id===id).name}`,readable(x)]))};case 'typedIdentifier':return {namespace:String(v.namespaceId),payload:readable(v.payload)};case 'list':case 'set':return {[v.kind]:v.items.map(readable)};case 'map':return {map:v.entries.map(([k,x])=>[readable(k),readable(x)])};case 'bytes':return {bytes:Buffer.from(v.value).toString('hex')};default:return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,typeof x==='bigint'?String(x):x]));}}
 const changedFields=[...model.value.fields].filter(([i,v])=>!Buffer.from(canonicalEncode(v)).equals(Buffer.from(canonicalEncode(oldModel.fields.get(i))))).map(([i])=>String(i));
 assert.deepEqual(changedFields,['1','6']);
 const slots=decodeProbeReview(source.registry).items,oldSlots=decodeProbeReview(oldBytes('registry')).items;
 const delta=slots.map((s,i)=>{const equal=Buffer.from(canonicalEncode(s)).equals(Buffer.from(canonicalEncode(oldSlots[i])));if(i>0&&i<5)assert(equal);const oldSet=i===0||i===5?new Set(oldSlots[i].items.map(x=>Buffer.from(canonicalEncode(x)).toString('hex'))):undefined;const added=oldSet?s.items.filter(x=>!oldSet.has(Buffer.from(canonicalEncode(x)).toString('hex'))):[];if(oldSet)for(const x of oldSet)assert(s.items.some(v=>Buffer.from(canonicalEncode(v)).toString('hex')===x));return {position:i,byteIdentical:equal,added:added.map(readable)};});
 assert.equal(delta[0].added.length,9);assert.equal(delta[5].added.length,11);
 if(process.argv.includes('--write'))fs.mkdirSync(folder,{recursive:true});
 const files=[];
 for(const [name,bytes] of Object.entries(artifacts)){
  assert.deepEqual(canonicalEncode(decodeProbeReview(bytes)),bytes);
  const unchanged=Buffer.from(bytes).equals(oldBytes(name));assert.equal(unchanged,['content','parameters','content-identity','parameter-identity'].includes(name));
  const pair={[name+'.cenc.hex']:Buffer.from(bytes).toString('hex')+'\n',[name+'.json']:JSON.stringify(readable(decodeProbeReview(bytes)),null,2)+'\n'};
  for(const [file,data] of Object.entries(pair)){if(process.argv.includes('--write'))fs.writeFileSync(new URL(file,folder),data);assert.equal(fs.readFileSync(new URL(file,folder),'utf8'),data);}
  files.push({name,bytes:bytes.length,sha256:hash(bytes),oldSha256:hash(oldBytes(name)),byteIdentical:unchanged});
 }
 const report={status:'CONCRETE BYTES ACCEPTED AND FROZEN',versions:Object.fromEntries(Object.entries(source).filter(([,v])=>typeof v==='string')),profiles:compiled.profiles,semanticBundle:compiled.semanticBundle,modelDigest:Buffer.from(model.digest).toString('hex'),changedModelFields:changedFields,registryDelta:delta,files,preservedOldArtifacts:prior,limitations:['Probe runtime authorized; materialization is not runtime qualification.','Materialization checks are not PROBE-A..P or full packaging qualification.']};
 const data=JSON.stringify(report,null,2)+'\n';if(process.argv.includes('--write'))fs.writeFileSync(new URL('REVIEW_MANIFEST.json',folder),data);assert.equal(fs.readFileSync(new URL('REVIEW_MANIFEST.json',folder),'utf8'),data);
 for(const p of prior)assert.equal(hash(fs.readFileSync(new URL(p.path,root))),p.sha256);
 console.log(JSON.stringify({modelDigest:report.modelDigest,changedModelFields:changedFields,addedSlot0:9,addedSlot5:11,preservedFiles:prior.length,status:report.status}));
}finally{await server.close();}
