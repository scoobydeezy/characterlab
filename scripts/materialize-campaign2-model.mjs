// Review-byte generator/verifier. Does not freeze a model or construct a scheduler.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true},appType:'custom'});
try{
  const {firstModelCandidate}=await server.ssrLoadModule('/src/campaign2/firstModelCandidate.ts');
  const {compileBoundedModelDeclarations,BOUNDED_SEMANTIC_BUNDLE}=await server.ssrLoadModule('/src/campaign2/modelPackaging.ts');
  const {decodeCampaign2}=await server.ssrLoadModule('/src/campaign2/codecs.ts');
  const source=firstModelCandidate(),compiled=await compileBoundedModelDeclarations(source);
  const folder=new URL('../docs/planning/campaign2-first-model/',import.meta.url);
  const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
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
  const artifacts={content:source.content,parameters:source.parameters,registry:source.registry};
  const model=compiled.modelIdentity.value;
  const {canonicalEncode}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
  artifacts['content-identity']=canonicalEncode(model.fields.get(2n));
  artifacts['parameter-identity']=canonicalEncode(model.fields.get(3n));
  artifacts['registry-identity']=canonicalEncode(model.fields.get(6n));
  artifacts['model-identity']=compiled.modelIdentity.canonicalBytes;
  if(process.argv.includes('--write'))fs.mkdirSync(folder,{recursive:true});
  const files=[];
  for(const [name,bytes] of Object.entries(artifacts)){
    const path=`${name}.cenc.hex`,data=Buffer.from(bytes).toString('hex')+'\n';
    const json=JSON.stringify(readable(decodeCampaign2(bytes)),null,2)+'\n';
    if(process.argv.includes('--write')){fs.writeFileSync(new URL(path,folder),data);fs.writeFileSync(new URL(`${name}.json`,folder),json);}
    assert.equal(fs.readFileSync(new URL(path,folder),'utf8'),data,path);
    assert.equal(fs.readFileSync(new URL(`${name}.json`,folder),'utf8'),json,`${name} readable parity`);
    files.push({name,path,bytes:bytes.length,sha256:hash(bytes)});
  }
  const versions=Object.fromEntries(Object.entries(source).filter(([,v])=>typeof v==='string'));
  const slots=compiled.compiled.slots(),carrier=slots[0].items;
  const report={status:'CONCRETE BYTES ACCEPTED AND FROZEN',versions,profiles:compiled.profiles,semanticBundle:BOUNDED_SEMANTIC_BUNDLE,
    parameterValue:String(compiled.parameters.maxWork),files,
    modelDigest:Buffer.from(compiled.modelIdentity.digest).toString('hex'),
    counts:{schemaDescriptors:carrier.filter(v=>v.schema.typeId===172n).length,semanticEntries:compiled.compiled.entries().length,readOnlyFamilies:slots[3].items.length,keyGrammars:slots[4].items.length,roleConstraints:slots[5].items.length,rules:compiled.adaptation.ruleCount,transitions:compiled.admission.registrations().length},
    versionAuthorities:{numeric:'docs/formal/BOUNDED_NUMERIC_PROFILE.md',random:'docs/formal/DETERMINISTIC_SUBSTRATE.md:173'},
    limitations:['Seven concrete byte artifacts and specimen values are frozen; identities remain derived.','FCT-5 is unblocked to begin; no activation or new numeric allocation.','No run, initial state, input manifest, seed or execution result is frozen by this model packet.','Component compilation is not FCT-4/6, VAL or PHEN-ADAPT qualification.']};
  const reportText=JSON.stringify(report,null,2)+'\n';
  if(process.argv.includes('--write'))fs.writeFileSync(new URL('REVIEW_MANIFEST.json',folder),reportText);
  assert.equal(fs.readFileSync(new URL('REVIEW_MANIFEST.json',folder),'utf8'),reportText,'review manifest reproducibility');
  console.log(JSON.stringify(report,null,2));
}finally{await server.close();}
