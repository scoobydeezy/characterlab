// Verify the existing reading aid without regenerating it or exercising runtime.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const base='docs/planning/',j=JSON.parse(fs.readFileSync(base+'CURRENT_RECORD_GLOSSARY.json')),md=fs.readFileSync(base+'CURRENT_RECORD_GLOSSARY.md','utf8');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try{
 const {cognitiveSupportedSchemas}=await server.ssrLoadModule('/src/campaign2/cognitiveCodecs.ts');
 const schemas=cognitiveSupportedSchemas().sort((a,b)=>Number(a.typeId-b.typeId)||Number(a.schemaVersion-b.schemaVersion));
 assert.deepEqual(schemas.map(s=>({id:String(s.typeId),version:String(s.schemaVersion),name:s.name})),j.records);
 const actual=md.split(/\r?\n/).filter(x=>/^\| \d+\/\d+ \|/.test(x));
 const expected=schemas.map(s=>`| ${s.typeId}/${s.schemaVersion} | ${s.name} | ${s.fields.map(f=>`${f.id}: ${f.name}`).join('; ')} |`);
 assert.deepEqual(actual,expected);assert.equal(schemas.length,298);assert.equal(new Set(schemas.map(s=>String(s.typeId))).size,297);
 const result={status:'PASS READ-ONLY HISTORICAL GLOSSARY',schemaPairs:298,distinctTypes:297,fieldRows:298,checkerSha256:hash('scripts/check-history-record-glossary.mjs'),sources:['src/campaign2/cognitiveCodecs.ts',base+'CURRENT_RECORD_GLOSSARY.json',base+'CURRENT_RECORD_GLOSSARY.md'].map(path=>({path,sha256:hash(path)})),scope:'Exact names and field-number/name rows match current scoped cognitive codec; neither whole-repository schema inventory nor runtime qualification. Original glossary untouched.'};
 const dir=base+'campaign3-history-record-glossary-rev1';fs.mkdirSync(dir,{recursive:true});const out=dir+'/packet-check.json';if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);else fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:result.status,schemaPairs:298,distinctTypes:297}));
}finally{await server.close();}
