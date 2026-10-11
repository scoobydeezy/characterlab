// Read-only stored packet verification; no historical constructor or runtime runs.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createServer} from 'vite';
const dir='docs/planning/campaign2-measurement-evidence-model/';
const oldDir='docs/planning/campaign2-probe-successor-model/';
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const manifest=load(dir+'REVIEW_MANIFEST.json');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try {
 const {decodeMemory:decode}=await server.ssrLoadModule('/src/campaign2/memoryCodecs.ts');
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
 const values={},oldValues={};
 for(const f of manifest.files){
  const bytes=Buffer.from(fs.readFileSync(dir+f.name+'.cenc.hex','utf8').trim(),'hex');
  const old=Buffer.from(fs.readFileSync(oldDir+f.name+'.cenc.hex','utf8').trim(),'hex');
  assert.equal(bytes.length,f.bytes);assert.equal(hash(bytes),f.sha256);
  const v=decode(bytes);assert.deepEqual(Buffer.from(enc(v)),bytes);
  assert.deepEqual(readable(v),load(dir+f.name+'.json'));
  assert.equal(bytes.equals(old),f.byteIdenticalToProbe2);
  values[f.name]=v;oldValues[f.name]=decode(old);
 }
 assert.equal(manifest.files.length,7);
 const model=await restoreModelIdentity(values['model-identity']);
 assert.equal(Buffer.from(model.digest).toString('hex'),manifest.modelDigest);
 for(const [name,field] of [['content',2n],['parameters',3n],['registry',6n]]){
  const commitment=await commitManifest(values[name]);
  const identityName=name==='parameters'?'parameter-identity':name+'-identity';
  assert.equal(hex(model.value.fields.get(field)),hex(values[identityName]));
  assert.deepEqual(Buffer.from(commitment.digest),Buffer.from(values[identityName].fields.get(2n).value));
 }
 const changed=[...model.value.fields].filter(([i,v])=>hex(v)!==hex(oldValues['model-identity'].fields.get(i))).map(([i])=>String(i));
 assert.deepEqual(changed,manifest.changedModelFields);
 const slots=values.registry.items,oldSlots=oldValues.registry.items;
 const delta=slots.map((v,i)=>({position:i,byteIdentical:hex(v)===hex(oldSlots[i]),added:[0,5].includes(i)?v.items.filter(x=>!oldSlots[i].items.some(y=>hex(x)===hex(y))).map(readable):[],removed:[0,5].includes(i)?oldSlots[i].items.filter(x=>!v.items.some(y=>hex(x)===hex(y))).map(readable):[]}));
 assert.deepEqual(delta,manifest.registryDelta);
 assert.deepEqual(delta.map(x=>[x.added.length,x.removed.length]),[[9,1],[0,0],[0,0],[0,0],[0,0],[8,0]]);
 assert.equal(manifest.variants.length,4);assert.equal(new Set(manifest.variants.map(v=>v.modelDigest)).size,4);
 assert.deepEqual(manifest.variants.map(v=>[v.available,v.permitted]),[[false,false],[false,true],[true,false],[true,true]]);
 const positive=manifest.variants.find(v=>v.available&&v.permitted);assert.equal(positive.modelDigest,manifest.modelDigest);assert.deepEqual(positive.modelIdentity,readable(model.value));
 console.log(JSON.stringify({status:'PASS READ-ONLY STORED PACKET',canonicalReadablePairs:7,manifestCommitments:3,exactRegistrySlots:6,changedModelFields:changed,variantRepresentations:4,scope:'Stored positive packet decoded/re-encoded and identities recomputed with current shared codecs; original constructor, runtime and negative controls not rerun. Other variant digests retained as historical representations, not reconstructed.'}));
} finally {await server.close();}
