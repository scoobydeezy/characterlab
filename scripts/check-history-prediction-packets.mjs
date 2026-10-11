// Read-only stored model verification; never invokes the historical materializer.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createServer} from 'vite';
const root='docs/planning/',out=root+'campaign3-history-prediction-packets-rev1/';
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try {
 const {decodePrediction:decode}=await server.ssrLoadModule('/src/campaign2/predictionCodecs.ts');
 const {canonicalEncode:enc}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {restoreModelIdentity,commitManifest}=await server.ssrLoadModule('/src/substrate/identity.ts');
 const human=v=>{if(typeof v==='boolean')return v;switch(v.kind){case'record':return {record:v.schema.name,typeId:String(v.schema.typeId),schemaVersion:String(v.schema.schemaVersion),fields:Object.fromEntries([...v.fields].map(([k,x])=>[k+':'+v.schema.fields.find(f=>f.id===k).name,human(x)]))};case'typedIdentifier':return {namespace:String(v.namespaceId),payload:human(v.payload)};case'list':case'set':return {kind:v.kind,items:v.items.map(human)};case'map':return {kind:'map',entries:v.entries.map(([k,x])=>({key:human(k),value:human(x)}))};case'bytes':return {kind:'bytes',hex:Buffer.from(v.value).toString('hex')};case'rational':return {kind:'rational',numerator:String(v.numerator),denominator:String(v.denominator)};default:return {kind:v.kind,value:String(v.value)};}};
 const directories=['campaign2-measurement-prediction-review','campaign2-measurement-prediction-review-rev2','campaign2-measurement-prediction-model'];
 const artifacts=[];
 for(const d of directories){
  const p=root+d+'/',m=load(p+'REVIEW_MANIFEST.json'),v={};
  for(const name of ['content','parameters','registry','model-identity']){
   const path=p+name+'.cenc.hex',stored=fs.readFileSync(path,'utf8').trim();assert.match(stored,/^(?:[0-9a-f]{2})+$/);
   const bytes=Buffer.from(stored,'hex');v[name]=decode(bytes);
   assert.deepEqual(Buffer.from(enc(v[name])),bytes);assert.deepEqual(human(v[name]),load(p+name+'.json'));
   artifacts.push({path,sha256:hash(fs.readFileSync(path)),decodedSha256:hash(bytes),decodedBytes:bytes.length});
  }
  const model=await restoreModelIdentity(v['model-identity']);assert.equal(Buffer.from(model.digest).toString('hex'),m.modelDigest);
  for(const [name,field] of [['content',2n],['parameters',3n],['registry',6n]]){
   const c=await commitManifest(v[name]);assert.deepEqual(Buffer.from(c.digest),Buffer.from(model.value.fields.get(field).fields.get(2n).value));
  }
  const controls=load(p+'CONTROL_COMMITMENTS.json');assert.equal(controls.length,64);
  const fields=['available','permitted','formation','memoryRead','application','predictionRead'];
  assert.deepEqual(controls.map(c=>fields.map(k=>{assert.equal(typeof c[k],'boolean');return Number(c[k]);}).join('')),Array.from({length:64},(_,i)=>i.toString(2).padStart(6,'0')));
  assert.equal(new Set(controls.map(c=>c.modelDigest)).size,64);assert.equal(new Set(controls.map(c=>c.registryDigest)).size,64);
  assert.equal(controls[63].modelDigest,m.modelDigest);assert.equal(controls[63].registryDigest,artifacts.at(-2).decodedSha256);
 }
 const result={status:'PASS READ-ONLY PREDICTION PACKETS',canonicalReadablePairs:12,modelIdentities:3,manifestCommitments:9,distinctStoredControlIdentities:64,artifacts,checkerSha256:hash(fs.readFileSync('scripts/check-history-prediction-packets.mjs')),scope:'Baseline bytes and commitments recomputed; all64 stored control selectors and digest uniqueness checked. Other63 control model bytes are not stored here and were not reconstructed. No runtime or historical materializer executed.'};
 fs.mkdirSync(out,{recursive:true});const p=out+'packet-check.json';if(fs.existsSync(p))assert.deepEqual(load(p),result);else fs.writeFileSync(p,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,artifacts:result.artifacts.length}));
}finally{await server.close();}
