// Separate numeric gate for the accepted symbolic family; no runtime qualification.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,root),'utf8');
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const tablePath='docs/formal/CONTENT_ID_ALLOCATION_TABLE.json';
const mdPath='docs/formal/CONTENT_ID_PERMANENT_ALLOCATION.md';
const reportPath='docs/formal/CONTENT_ID_ALLOCATION_AUDIT.json';
const t=JSON.parse(read(tablePath)),md=read(mdPath).replace(/\r\n/g,'\n');
const authority=read(t.authority).replace(/\r\n/g,'\n'),checks=[];
function eq(name,a,b){assert.deepEqual(a,b,name);checks.push({name,status:'PASS'});}
eq('symbolic acceptance',authority.includes('**Status: SYMBOLIC SHAPE ACCEPTED.**'),true);
eq('contract version',authority.includes('`content-definition-id/0.1-candidate`'),true);
eq('allocation lifecycle',['PENDING MACHINE AUDIT','PERMANENT AND FROZEN'].includes(t.status),true);
eq('version matches lifecycle',t.version,t.status==='PERMANENT AND FROZEN'?'content-id-allocation/0.1-candidate':'content-id-allocation/0.1-draft');
eq('Markdown status',md.includes('**Status: '+t.status+'.**'),true);
eq('Markdown version',md.includes('`'+t.version+'`'),true);
eq('one exact family',t.namespaces,[{namespace:1038,name:'GovernedContentDefinitionId',scope:'model/content',payload:'nonempty canonical UTF-8 NFC text'}]);
const rows=(s,heading)=>s.split(heading)[1].split('\n\n')[0].split('\n').slice(1).filter(l=>l.startsWith('| ')).map(l=>l.split('|').slice(1,-1).map(c=>c.trim()));
eq('complete symbolic/numeric bijection',rows(authority,'| Symbolic family | Scope | Payload grammar |\n'),t.namespaces.map(n=>[n.name,n.scope,n.payload]));
eq('complete Markdown/JSON parity',rows(md,'| Namespace | Family | Scope | Payload |\n'),t.namespaces.map(n=>[String(n.namespace),n.name,n.scope,n.payload]));
const empty=['records','members','bindings','unionVariants','finiteValues','occurrenceDefinitions','stateRoots','saveFields'];
for(const k of empty)eq('no added '+k,t[k],[]);
eq('complete table keys',Object.keys(t).sort(),['version','status','date','authority','preservedSources','namespaces',...empty].sort());
eq('complete prior inventory',t.preservedSources.map(s=>s.path),[
 'docs/formal/CAMPAIGN2_ALLOCATION_TABLE.json','docs/formal/VAL_ALLOCATION_TABLE.json',
 'docs/formal/CANONICAL_RECORD_REGISTRY.md','docs/formal/EVENT_SEMANTIC_NUMERIC_REGISTRY.md','docs/formal/STATE_MODEL.md',
 'docs/formal/ORIGIN_ALLOCATION_TABLE.json','docs/formal/ORIGIN_PERMANENT_ALLOCATION.md']);
for(const source of t.preservedSources){
 const data=read(source.path);
 eq('unchanged complete bytes: '+source.path,hash(data),source.sha256);
 if(source.path.endsWith('.json')){
  const prior=JSON.parse(data);
  eq('prior frozen: '+source.path,['ACCEPTED AND FROZEN','PERMANENT AND FROZEN'].includes(prior.status),true);
  eq('no namespace collision: '+source.path,prior.namespaces.some(n=>n.namespace===1038||n.name==='GovernedContentDefinitionId'),false);
 }else eq('no prior numeric claim: '+source.path,/\b1038\b/.test(data),false);
}
eq('no fixture promotion',t.namespaces.some(n=>[20,21,23000].includes(n.namespace)),false);
const report={version:t.version,status:'PASS: '+t.status,tableSha256:hash(read(tablePath)),markdownSha256:hash(read(mdPath)),authoritySha256:hash(read(t.authority)),allocationSnapshot:t,checks,
 limitations:['CONTENT-ID-A..H are not passed by allocation audit.','Factory activation remains gated by FCT/VAL/profile qualification.']};
if(process.argv.includes('--write'))fs.writeFileSync(new URL(reportPath,root),JSON.stringify(report,null,2)+'\n');
if(process.argv.includes('--write')||process.argv.includes('--verify'))assert.deepEqual(JSON.parse(read(reportPath)),report,'stored audit equals recomputation');
console.log(JSON.stringify({status:report.status,checks:checks.length,namespaces:1},null,2));
