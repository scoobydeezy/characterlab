// Restore recorded structural identities only; never run the native scheduler.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const p='docs/planning/',dir=p+'defining-native-cohort-rev1/',out=p+'campaign3-history-defining-native-rev1/',sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,watch:null},appType:'custom'});
try{
 const ids=await server.ssrLoadModule('/src/substrate/identity.ts'),can=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),codec=await server.ssrLoadModule('/src/campaign3/definingPublicModel.ts'),rows=[];
 for(let i=0;i<68;i++){
  const path=dir+'CASE_'+String(i).padStart(2,'0')+'.json',r=JSON.parse(fs.readFileSync(path)),decode=s=>codec.parseDefiningPublic(new Uint8Array(Buffer.from(s,'hex')));
  const m=await ids.restoreModelIdentity(decode(r.modelIdentity)),run=await ids.restoreRunIdentity(decode(r.runIdentity));
  assert.equal(hex(can.canonicalEncode(run.value.fields.get(1n))),r.modelIdentity);
  for(const [field,want]of [[2n,r.initialState],[3n,r.originals],[4n,'00'.repeat(32)]]){const v=run.value.fields.get(field);assert.equal(v.kind,'bytes');assert.equal(hex(v.value),want);}
  rows.push({path,sha256:sha(path),modelDigest:hex(m.digest),runDigest:hex(run.digest)});
 }
 const v={status:'68 NATIVE MODEL/RUN IDENTITIES VERIFIED',rows,scope:'Exact recorded identity structure, model linkage, initial/original digests and fixed zero32 seed. No fresh model execution or replay.',checkerSha256:sha('scripts/check-history-defining-native-identities.mjs')};
 fs.mkdirSync(out,{recursive:true});const file=out+'identities.json';if(fs.existsSync(file))assert.deepEqual(JSON.parse(fs.readFileSync(file)),v);else fs.writeFileSync(file,JSON.stringify(v,null,2)+'\n',{flag:'wx'});console.log(v.status);
}finally{await server.close();}
