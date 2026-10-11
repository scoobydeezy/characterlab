import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const p='docs/planning/',hex=b=>Buffer.from(b).toString('hex'),hash=b=>createHash('sha256').update(b).digest('hex'),read=f=>JSON.parse(fs.readFileSync(p+f));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const m=await server.ssrLoadModule('/src/campaign3/craving.ts'),fx=await server.ssrLoadModule('/src/test/cravingFixtures.ts'),body=await server.ssrLoadModule('/src/test/bodyOwnershipFixtures.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),d=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),codec=await server.ssrLoadModule('/src/campaign3/embodiedCodecs.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),random=await server.ssrLoadModule('/src/substrate/random.ts');
 async function sources(){
  const base=body.bodyCases().find(x=>x.name==='depleted-refill'),results={},packets={};
  for(const [name,amount,model] of [['depleted',2,'baseline'],['hidden6',6,'baseline'],['hidden9',9,'baseline'],['full',100,'baseline'],['denied',2,'denied']]){
   const initialState=c.canonicalEncode(c.set(d.dataItems(codec.decodeEmbodied(base.initialState),'set').map(v=>{const value=d.dataField(v,2n);if(value.kind!=='record'||value.schema.typeId!==454n)return v;return c.record(v.schema,new Map([...v.fields,[2n,c.record(value.schema,new Map([...value.fields,[1n,c.rational(amount,1)]]))]]));})));
   const result=await body.runBodyCase({...base,name,model,initialState},true);results[name]=result;
   const records=d.dataItems(codec.decodeEmbodied(Buffer.from(result.sourceOutputs,'hex')),'list').filter(v=>v.kind==='record'&&v.schema.typeId===464n);
   assert.equal(records.length,2);const observer=d.dataKey(d.dataField(records[0],2n));assert(records.every(v=>d.dataKey(d.dataField(v,2n))===observer));
   packets[name]={observer,pressures:result.probes.map(v=>v.mediated==='Unavailable'?null:v.mediated)};
  }
  assert.equal(new Set(Object.values(packets).map(v=>v.observer)).size,1);assert.deepEqual(packets.hidden6,packets.hidden9);
  return {status:'PASS',publicRuns:5,publicPrefixes:Object.values(results).reduce((n,v)=>n+v.prefixes,0),packets,results};
 }
 const value=await sources();assert.deepEqual(value,read('CRAVING_SOURCES_REV1.json'));
 const out=p+'campaign3-history-preserved-metadata-rev1/';fs.mkdirSync(out,{recursive:true});
 const receipt={status:'PASS',publicRuns:5,publicPrefixes:15,source:{path:p+'CRAVING_SOURCES_REV1.json',sha256:hash(fs.readFileSync(p+'CRAVING_SOURCES_REV1.json'))},producer:{path:'scripts/qualify-craving.mjs',sha256:hash(fs.readFileSync('scripts/qualify-craving.mjs'))},scope:'Five original public BODY source executions and15 prefix checks reproduce complete stored results/packets. Not new craving action or component qualification.',checkerSha256:hash(fs.readFileSync('scripts/check-history-craving-sources.mjs'))};
 const dest=out+'craving-source-check.json';if(fs.existsSync(dest))assert.deepEqual(JSON.parse(fs.readFileSync(dest)),receipt);else fs.writeFileSync(dest,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(receipt));
}finally{await server.close();}
