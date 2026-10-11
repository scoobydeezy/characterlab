// Verify reviewed simple allocation grammars against their actual codec schema exports.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),root='docs/planning/',out=root+'campaign3-history-wrapper-grammars-rev1/';
const artifacts=read(root+'public-wrapper-quiescence-rev1/PRESERVATION.json').artifacts;
const candidates=artifacts.filter(a=>a.original.startsWith('docs/formal/')).filter(a=>Object.keys(read(a.original)).every(k=>['version','date','status','namespace','records','unions'].includes(k)));assert.equal(candidates.length,42);
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,watch:null},appType:'custom'}),rows=[];
try{for(const a of candidates){
 const v=read(a.original);assert.equal(sha(a.original),a.sha256);assert.equal(sha(a.archive),a.sha256);
 const codecs=fs.readdirSync('src/campaign3').filter(n=>n.endsWith('Codecs.ts')).map(n=>'src/campaign3/'+n).filter(p=>fs.readFileSync(p,'utf8').includes('../../'+a.original));assert.equal(codecs.length,1);const codec=codecs[0],old=artifacts.find(x=>x.original===codec);assert(old);assert.equal(sha(codec),old.sha256);
 const source=fs.readFileSync(codec,'utf8'),name=source.match(/export function (\w+Schema)\(name:string\|number\)/)?.[1];assert(name,codec);const mod=await server.ssrLoadModule('/'+codec);
 for(const r of v.records)assert.deepEqual(mod[name](r.typeId),{typeId:BigInt(r.typeId),schemaVersion:BigInt(r.schemaVersion),name:r.name,fields:r.fields.map(f=>({id:BigInt(f.id),name:f.name,required:f.required}))});
 rows.push({...a,codec:{path:codec,sha256:sha(codec)},records:v.records.length,fields:v.records.reduce((n,r)=>n+r.fields.length,0)});
}const result={status:'42 GRAMMARS MATCH ACTUAL CODEC SCHEMAS',rows,records:rows.reduce((n,r)=>n+r.records,0),fields:rows.reduce((n,r)=>n+r.fields,0),scope:'Declaration/export equality only; no decoder mutation tests, scheduling, runtime qualification or ownership inference. Archive copies retain pre-repair provenance.',checkerSha256:sha('scripts/check-history-wrapper-grammars.mjs')};fs.mkdirSync(out,{recursive:true});const file=out+'canonical-check.json';if(fs.existsSync(file))assert.deepEqual(read(file),result);else fs.writeFileSync(file,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(result.status,result.records,result.fields);
}finally{await server.close();}
