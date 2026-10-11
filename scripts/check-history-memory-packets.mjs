// Read-only comparison of frozen and blocked packets; never admits or runs models.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createServer} from 'vite';
const base='docs/planning/',dirs=['campaign2-measurement-memory-blocked-review','campaign2-measurement-memory-model'];
const load=p=>JSON.parse(fs.readFileSync(base+p,'utf8'));
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
  if(v.kind==='bytes')return {kind:'bytes',value:Object.fromEntries([...v.value].map((x,i)=>[String(i),x]))};
  if(v.kind==='map')return {map:v.entries.map(([k,x])=>[readable(k),readable(x)])};
  return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,typeof x==='bigint'?String(x):x]));
 }
 const packets=[];
 for(const dir of dirs){
  const m=load(dir+'/REVIEW_MANIFEST.json'),controls=load(dir+'/CONTROL_COMMITMENTS.json'),values={};
  assert.equal(m.files.length,7);assert.equal(controls.length,16);
  for(const f of m.files){
   const bytes=Buffer.from(fs.readFileSync(base+dir+'/'+f.name+'.cenc.hex','utf8').trim(),'hex'),v=decode(bytes);
   assert.equal(hash(bytes),f.sha256);assert.equal(bytes.length,f.bytes);assert.deepEqual(Buffer.from(enc(v)),bytes);
   assert.deepEqual(JSON.parse(JSON.stringify(readable(v))),load(dir+'/'+f.name+'.json'));values[f.name]=v;
   const parent=Buffer.from(fs.readFileSync(base+'campaign2-measurement-evidence-model/'+f.name+'.cenc.hex','utf8').trim(),'hex');
   assert.equal(bytes.equals(parent),f.byteIdenticalToCarriage);
  }
  const positive=await restoreModelIdentity(values['model-identity']);assert.equal(Buffer.from(positive.digest).toString('hex'),m.modelDigest);
  for(const [name,field] of [['content',2n],['parameters',3n],['registry',6n]]){
   const c=await commitManifest(values[name]),id=values[name==='parameters'?'parameter-identity':name+'-identity'];
   assert.equal(hex(id),hex(positive.value.fields.get(field)));assert.deepEqual(Buffer.from(c.digest),Buffer.from(id.fields.get(2n).value));
  }
  assert.equal(new Set(controls.map(c=>JSON.stringify([c.a,c.p,c.F,c.R]))).size,16);
  for(let i=0;i<16;i++){
   const c=controls[i],id=await restoreModelIdentity(decode(Buffer.from(c.modelIdentityHex,'hex'))),registry=decode(Buffer.from(c.registryHex,'hex'));
   assert.equal(hex(id.value),c.modelIdentityHex);assert.equal(hex(registry),c.registryHex);assert.equal(Buffer.from(id.digest).toString('hex'),c.modelDigest);
   const commitment=await commitManifest(registry);assert.deepEqual(Buffer.from(commitment.digest),Buffer.from(id.value.fields.get(6n).fields.get(2n).value));
   assert.deepEqual(m.controls[i],{a:c.a,p:c.p,F:c.F,R:c.R,modelDigest:c.modelDigest});
   for(const n of [1n,2n,3n,4n,5n])assert.equal(hex(id.value.fields.get(n)),hex(positive.value.fields.get(n)));
  }
  const allTrue=controls.find(c=>c.a&&c.p&&c.F&&c.R);assert.equal(allTrue.modelDigest,m.modelDigest);assert.equal(allTrue.registryHex,hex(values.registry));
  packets.push({m,controls,values});
 }
 const [blocked,accepted]=packets;assert.equal(blocked.m.blocker.applied,false);assert.equal(accepted.m.amendment.status,'ACCEPTED AND APPLIED');
 for(let i=0;i<16;i++){
  const a=blocked.controls[i],b=accepted.controls[i];for(const k of ['a','p','F','R'])assert.equal(a[k],b[k]);assert.notEqual(a.modelDigest,b.modelDigest);
  const x=decode(Buffer.from(a.registryHex,'hex')).items,y=decode(Buffer.from(b.registryHex,'hex')).items;
  for(let k=0;k<5;k++)assert.equal(hex(x[k]),hex(y[k]));
  const removed=x[5].items.filter(v=>!y[5].items.some(w=>hex(v)===hex(w))),added=y[5].items.filter(v=>!x[5].items.some(w=>hex(v)===hex(w)));
  assert.equal(removed.length,0);assert.equal(added.length,1);assert.equal(hex(added[0]),blocked.m.blocker.proposedAdditionHex);
  assert.deepEqual(JSON.parse(JSON.stringify(readable(added[0]))),blocked.m.blocker.proposedSlot5Addition);
 }
 console.log(JSON.stringify({status:'PASS READ-ONLY BLOCKED/SUCCESSOR PACKET COMPARISON',canonicalReadablePairs:14,modelCommitments:32,pairedRegistryAmendments:16,addedRolesPerPair:1,removedRolesPerPair:0,scope:'Current shared codec and identity recomputation of stored bytes only. Blocked specimens remain never admitted; no factory, constructor, runtime or historical negative-control execution.'}));
}finally{await server.close();}
