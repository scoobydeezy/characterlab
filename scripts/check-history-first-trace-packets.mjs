// Read stored packets with existing codecs; no model writer, scheduler or runtime runs.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createServer} from 'vite';
const base='docs/planning/',oldDir=base+'campaign2-first-model/',dir=base+'campaign2-trace-model/';
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const oldManifest=load(oldDir+'REVIEW_MANIFEST.json'),manifest=load(dir+'REVIEW_MANIFEST.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try {
 const {decodeCampaign2:decode}=await server.ssrLoadModule('/src/campaign2/codecs.ts');
 const {canonicalEncode:enc}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {restoreModelIdentity,commitManifest}=await server.ssrLoadModule('/src/substrate/identity.ts');
 const hex=v=>Buffer.from(enc(v)).toString('hex');
 function readable(v){
  if(typeof v==='boolean')return v;
  if(v.kind==='record')return {record:`${v.schema.name}/${v.schema.typeId}/${v.schema.schemaVersion}`,fields:Object.fromEntries([...v.fields].map(([i,x])=>[`${i}:${v.schema.fields.find(f=>f.id===i).name}`,readable(x)]))};
  if(v.kind==='typedIdentifier')return {namespace:String(v.namespaceId),payload:readable(v.payload)};
  if(v.kind==='list'||v.kind==='set')return {[v.kind]:v.items.map(readable)};
  if(v.kind==='map')return {map:v.entries.map(([k,x])=>[readable(k),readable(x)])};
  if(v.kind==='bytes')return {bytes:Buffer.from(v.value).toString('hex')};
  return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,typeof x==='bigint'?String(x):x]));
 }
 const packets=[];
 for(const [root,m] of [[oldDir,oldManifest],[dir,manifest]]){
  const values={};assert.equal(m.files.length,7);
  for(const f of m.files){
   const stored=fs.readFileSync(root+f.path,'utf8').trim();assert.match(stored,/^(?:[0-9a-f]{2})+$/);
   const bytes=Buffer.from(stored,'hex');assert.equal(bytes.length,f.bytes);assert.equal(hash(bytes),f.sha256);
   const v=decode(bytes);assert.deepEqual(Buffer.from(enc(v)),bytes);assert.deepEqual(readable(v),load(root+f.name+'.json'));values[f.name]=v;
  }
  const model=await restoreModelIdentity(values['model-identity']);assert.equal(Buffer.from(model.digest).toString('hex'),m.modelDigest);
  for(const [name,field] of [['content',2n],['parameters',3n],['registry',6n]]){
   const commitment=await commitManifest(values[name]),identityName=name==='parameters'?'parameter-identity':name+'-identity';
   assert.equal(hex(model.value.fields.get(field)),hex(values[identityName]));assert.deepEqual(Buffer.from(commitment.digest),Buffer.from(values[identityName].fields.get(2n).value));
  }
  assert.equal(model.value.fields.get(1n).value,m.versions.rulesVersion);
  assert.equal(model.value.fields.get(4n).value,m.versions.numericProfileVersion);assert.equal(model.value.fields.get(5n).value,m.versions.randomAlgorithmVersion);
  assert.equal(values['content-identity'].fields.get(1n).value,m.versions.contentSchemaVersion);
  assert.equal(values['parameter-identity'].fields.get(1n).value,m.versions.parameterSchemaVersion);
  assert.equal(values['registry-identity'].fields.get(1n).value,m.versions.registrySchemaVersion);
  const slots=values.registry.items;assert.equal(slots.length,6);
  assert.equal(slots[0].items.filter(v=>v.schema.typeId===172n).length,m.counts.schemaDescriptors);
  assert.equal(slots[0].items.filter(v=>v.schema.typeId===171n).length,m.counts.semanticEntries);
  assert.equal(slots[3].items.length,m.counts.readOnlyFamilies);assert.equal(slots[4].items.length,m.counts.keyGrammars);assert.equal(slots[5].items.length,m.counts.roleConstraints);
  assert.equal(values.parameters.items.length,1);assert.equal(values.parameters.items[0].schema.typeId,133n);assert.equal(String(values.parameters.items[0].fields.get(1n).value),m.parameterValue);
  packets.push(values);
 }
 const [a,b]=packets;
 assert.deepEqual(Object.keys(a).filter(n=>hex(a[n])!==hex(b[n])),['model-identity']);
 const changed=[...a['model-identity'].fields].filter(([i,v])=>hex(v)!==hex(b['model-identity'].fields.get(i))).map(([i])=>String(i));assert.deepEqual(changed,['1']);
 assert.deepEqual(manifest.structuralOperandDiff,[{field:'1',name:'RulesVersion',oldValue:oldManifest.versions.rulesVersion,newValue:manifest.versions.rulesVersion}]);
 assert.equal(manifest.oldModelDigest,oldManifest.modelDigest);assert.equal(manifest.oldRulesVersion,oldManifest.versions.rulesVersion);
 assert.deepEqual(manifest.semanticBundle,[...oldManifest.semanticBundle,'trace/0.2-candidate','campaign2-trace-binding/0.1-candidate']);
 assert.deepEqual(manifest.profiles,{...oldManifest.profiles,trace:'campaign2-trace-binding/0.1-candidate'});
 for(const f of manifest.files){assert.equal(f.oldSha256,oldManifest.files.find(x=>x.name===f.name).sha256);assert.equal(f.comparison,f.name==='model-identity'?'RulesVersion-only change':'byte-identical');}
 const result={status:'PASS READ-ONLY FIRST/TRACE STORED PACKETS',canonicalReadablePairs:14,modelIdentities:2,manifestCommitments:6,registrySlotsPerPacket:6,changedModelFields:changed,unchangedArtifactPairs:6,checkerSha256:hash(fs.readFileSync('scripts/check-history-first-trace-packets.mjs')),scope:'Current codecs decode/re-encode exact stored packets and recompute identities; historical constructors, delete/reconstruct scripts, runtime and continuation not rerun.'};
 const out=base+'campaign3-history-first-trace-packets-rev1/packet-check.json';fs.mkdirSync(base+'campaign3-history-first-trace-packets-rev1',{recursive:true});
 if(fs.existsSync(out))assert.deepEqual(load(out),result);else fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await server.close();}
