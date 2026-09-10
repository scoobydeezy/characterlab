import fs from 'node:fs';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const {cognitiveSupportedSchemas}=await server.ssrLoadModule('/src/campaign2/cognitiveCodecs.ts');
 const schemas=cognitiveSupportedSchemas().sort((a,b)=>Number(a.typeId-b.typeId)||Number(a.schemaVersion-b.schemaVersion));
 const names=new Map(),sources=new Set();
 function add(n,name,p){if(n<1000||n>1141||typeof name!=='string'||!name.endsWith('Id')||name.includes('/'))return;const values=names.get(n)??new Set();values.add(name);names.set(n,values);sources.add(p);}
 for(const file of fs.readdirSync('docs/formal')){const p='docs/formal/'+file;
  if(file.endsWith('_TABLE.json')){const v=JSON.parse(fs.readFileSync(p));for(const x of [...v.namespaces??[],...v.occurrenceNamespaces??[]])add(x.namespace??x.namespaceId,x.name,p);for(const [k,n]of Object.entries(v.identifierAliases??{}))add(n,k,p);}
  if(file.endsWith('.md'))for(const line of fs.readFileSync(p,'utf8').split('\n')){const m=/^\|\s*(1\d{3})\s*\|\s*([^|]+)\|/.exec(line);if(m)for(const name of m[2].replaceAll('`','').trim().split(/\s*\/\s*/))add(Number(m[1]),name,p);}
 }
 const lines=['# Current record and namespace glossary','','Generated reading aid, 2026-09-10. This is not allocation authority. Record names and','field numbers come from the actual cognitive receiving codec, including inherited','schemas and both versions of successor records. Namespaces come from formal allocation','tables. Same namespace can have several admitted role names; that is not an alias','between different identity families or a new semantic permission. Phases are scheduling','positions, not record IDs. Highest numeric ID is not the count of allocated records.','',`The current receiving codec supports **${schemas.length} record/schema pairs**, with **${new Set(schemas.map(s=>String(s.typeId))).size} distinct record type IDs**.`,`Source: scripts/generate-current-record-glossary.mjs. Frozen tables remain authoritative.`,'','## Records','','| Type/schema | Semantic name | Fields |','|---|---|---|'];
 for(const s of schemas)lines.push(`| ${s.typeId}/${s.schemaVersion} | ${s.name} | ${s.fields.map(f=>`${f.id}: ${f.name}`).join('; ')} |`);
 lines.push('','## Identifier namespaces','','| Namespace | Family / admitted role names |','|---|---|');for(const [n,v]of [...names].sort((a,b)=>a[0]-b[0]))lines.push(`| ${n} | ${[...v].sort().join(' / ')} |`);
 lines.push('','## Reading recent receipts','','Use semantic names first: AutomaticAdaptationInput (307), not “actual307”;','TaskCommitmentState (373) with its exact schema version; TaskIdentityContribution','and TaskIdentityEvidence with their actual names from the table above.','“Phase140” means the common consolidation settlement stage. The 27/26 control','means27 executed events versus a deliberately insufficient26-event work limit.','','All names above are descriptive views; no record, namespace, version or digest was','renamed by generating this file.');
 fs.writeFileSync('docs/planning/CURRENT_RECORD_GLOSSARY.md',lines.join('\n')+'\n');
 const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');fs.writeFileSync('docs/planning/CURRENT_RECORD_GLOSSARY.json',JSON.stringify({recordSchemaPairs:schemas.length,records:schemas.map(s=>({id:String(s.typeId),version:String(s.schemaVersion),name:s.name})),namespaceSources:[...sources].sort().map(path=>({path,sha256:hash(path)}))},null,2)+'\n');console.log(JSON.stringify({recordSchemaPairs:schemas.length,namespaceFamilies:names.size}));
}finally{await server.close();}

