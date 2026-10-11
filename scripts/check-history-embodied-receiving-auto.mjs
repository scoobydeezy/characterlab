// Read preserved failed and corrected witnesses without rerunning their original writers.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const dir='docs/planning/campaign3-history-embodied-receiving-rev1',server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
const ref=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
try{
 const {decodeReceiving:decode}=await server.ssrLoadModule('/src/campaign3/receivingCodecs.ts'),f=(v,n)=>v.fields.get(BigInt(n));
 const rows=[1,4].map(revision=>{const path=`docs/planning/embodied-receiving-execution-rev${revision}/auto/outputs.cenc.hex`,outputs=decode(Buffer.from(fs.readFileSync(path,'utf8').trim(),'hex')).items,resolution=outputs.find(v=>v.schema.typeId===508n),mode=f(f(f(resolution,4),2),8).value;return {revision,mode:String(mode),source:ref(path)};});
 assert.equal(rows[0].mode,'3');assert.equal(rows[1].mode,'1');
 const result={status:'PASS',rows,meaning:'Preserved first witness actually chose PlayerFacingRoll(3); corrected admitted asymmetric witness chose Auto(1). Original failed whole packet is not qualified.',sources:['scripts/check-history-embodied-receiving-auto.mjs','scripts/review-embodied-receiving-execution.mjs','docs/planning/embodied-receiving-execution-rev1/DISPOSITION.md'].map(ref)};
 const p=dir+'/auto-witness.json';if(fs.existsSync(p))assert.deepEqual(JSON.parse(fs.readFileSync(p)),result);else fs.writeFileSync(p,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(rows));
}finally{await server.close();}
