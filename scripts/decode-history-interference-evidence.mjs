import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const p='docs/planning/',sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),ref=path=>({path,sha256:sha(path)});
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const ac=await server.ssrLoadModule('/src/campaign3/agencyCodecs.ts'),d=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),am=await server.ssrLoadModule('/src/campaign3/agencyModel.ts');
 const sources=[];
 for(const name of ['INTERFERENCE_EXPECTATION_SOURCE_RESULT_REV1.json','INTERFERENCE_EXPECTATION_SUCCESSOR_SOURCE_RESULT_REV1.json']){
  const result=JSON.parse(fs.readFileSync(p+name));
  for(const source of result.sources){
   const frames=source.views.map(view=>d.dataItems(ac.decodeAgency(new Uint8Array(Buffer.from(view,'hex'))),'list').flatMap(v=>{
    assert.notEqual(typeof v,'boolean');
    if(v.kind==='list'){assert.equal(v.items.length,4);assert.equal(d.dataKey(v.items[2]),d.dataKey(am.OBSERVERS[0]));return [];}
    assert.equal(v.kind,'record');assert([975n,976n,982n].includes(v.schema.typeId));assert.equal(d.dataKey(d.dataField(v,2n)),d.dataKey(am.OBSERVERS[0]));
    return v.schema.typeId===975n?[{episode:d.dataKey(d.dataField(v,4n)),kind:Number(d.dataUnsigned(d.dataField(v,5n))),source:d.dataKey(d.dataField(v,7n)),positive:d.dataField(v,6n)===true,id:d.dataKey(d.dataField(v,1n))}]:[];
   }));sources.push({sourceIdentity:source.sourceIdentity,original:ref(p+name),frames});
  }
 }
 assert.equal(sources.length,12);assert.equal(new Set(sources.map(s=>s.sourceIdentity)).size,12);
 const result={status:'PASS',scope:'Decode only observer A actual public observation975; reject foreign holders, preserve other allowed public records without using them as new evidence.',sources,artifacts:['scripts/decode-history-interference-evidence.mjs','src/campaign3/agencyCodecs.ts','src/campaign2/canonicalData.ts','src/campaign3/agencyModel.ts'].map(ref)};
 const out=p+'campaign3-history-interference-expectation-rev1/decoded-evidence.json';if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);else fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
 console.log('PASS12 observer-safe source histories decoded.');
}finally{await server.close();}
