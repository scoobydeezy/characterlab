// Mechanical gate only. Review acceptance, implementation qualification and activation are separate.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const raw=p=>fs.readFileSync(new URL(p,root));
const read=p=>raw(p).toString('utf8');
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const tablePath='docs/formal/OBSERVATION_UNIT_ALLOCATION_TABLE.json';
const markdownPath='docs/formal/OBSERVATION_UNIT_PERMANENT_ALLOCATION.md';
const reportPath='docs/formal/OBSERVATION_UNIT_ALLOCATION_AUDIT.json';
const t=JSON.parse(read(tablePath)),md=read(markdownPath).replace(/\r\n/g,'\n');
const checks=[];
function eq(name,a,b){assert.deepEqual(a,b,name);checks.push({name,status:'PASS'});}
eq('exact symbolic authority',t.authority,'docs/formal/OBSERVATION_UNIT_IDENTITY.md');
const authority=read(t.authority).replace(/\r\n/g,'\n');
eq('symbolic shape accepted',authority.includes('**Status: SYMBOLIC SHAPE ACCEPTED.**'),true);
eq('exact semantic version',authority.includes('`observation-unit-identity/0.1-candidate`'),true);
eq('separate allocation lifecycle',['REVIEW CANDIDATE','PERMANENT AND FROZEN'].includes(t.status),true);
eq('allocation version matches lifecycle',t.version,t.status==='REVIEW CANDIDATE'?'observation-unit-allocation/0.1-draft':'observation-unit-allocation/0.1-candidate');
eq('Markdown lifecycle parity',md.includes(`**Status: ${t.status}.**`),true);
eq('Markdown version parity',md.includes('`'+t.version+'`'),true);
const expectedFamily={namespace:1039,name:'ObservationUnitId',scope:'model/observation vocabulary',payload:'nonempty canonical UTF-8 NFC text'};
const expectedMember={namespace:1039,name:'unit/fixture-pulse',payload:'unit/fixture-pulse',owner:'first Campaign-2 bridge profile'};
eq('one exact numeric family',t.namespaces,[expectedFamily]);
eq('one exact permanent member candidate',t.members,[expectedMember]);
const rows=(s,heading)=>{
 const start=s.indexOf(heading);assert.notEqual(start,-1,heading);
 return s.slice(start+heading.length).split('\n\n')[0].split('\n').filter(l=>l.startsWith('| ')&&!/^\|[-:| ]+\|$/.test(l)).map(l=>l.split('|').slice(1,-1).map(c=>c.trim()));
};
eq('symbolic family coverage',rows(authority,'| Symbolic family | Scope | Payload grammar |\n'),[[expectedFamily.name,expectedFamily.scope,expectedFamily.payload]]);
eq('symbolic member coverage',rows(authority,'| Family | Fixed member | Admitting owner |\n'),[[expectedFamily.name,expectedMember.name,expectedMember.owner]]);
eq('complete namespace Markdown/machine parity',rows(md,'| Namespace | Family | Scope | Payload |\n'),t.namespaces.map(n=>[String(n.namespace),n.name,n.scope,n.payload]));
eq('complete member Markdown/machine parity',rows(md,'| Namespace | Family | Member | Payload | Admitting owner |\n'),t.members.map(m=>[String(m.namespace),expectedFamily.name,m.name,m.payload,m.owner]));
eq('member belongs to sole family',t.members.every(m=>m.namespace===t.namespaces[0].namespace),true);
eq('exact NFC member text',t.members.every(m=>m.payload.length>0&&m.payload===m.payload.normalize('NFC')&&m.name===m.payload),true);
eq('member UTF-8 round trip',Buffer.from(expectedMember.payload,'utf8').toString('utf8'),expectedMember.payload);
const empty=['records','bindings','unionVariants','finiteValues','occurrenceDefinitions','stateRoots','saveFields'];
for(const k of empty)eq('no allocation of '+k,t[k],[]);
eq('complete table key set',Object.keys(t).sort(),['version','status','date','authority','preservedSources','namespaces','members',...empty].sort());
const priorPaths=['CAMPAIGN2_ALLOCATION_TABLE.json','CAMPAIGN2_PERMANENT_ALLOCATION.md','CAMPAIGN2_ALLOCATION_AUDIT.json',
 'VAL_ALLOCATION_TABLE.json','VAL_PERMANENT_ALLOCATION.md','VAL_ALLOCATION_AUDIT.json',
 'ORIGIN_ALLOCATION_TABLE.json','ORIGIN_PERMANENT_ALLOCATION.md','ORIGIN_ALLOCATION_AUDIT.json',
 'CONTENT_ID_ALLOCATION_TABLE.json','CONTENT_ID_PERMANENT_ALLOCATION.md','CONTENT_ID_ALLOCATION_AUDIT.json',
 'CANONICAL_RECORD_REGISTRY.md','EVENT_SEMANTIC_NUMERIC_REGISTRY.md','STATE_MODEL.md'].map(n=>'docs/formal/'+n);
eq('complete preserved source inventory',t.preservedSources.map(s=>s.path),priorPaths);
const priorNamespaces=[];
for(const source of t.preservedSources){
 eq('preserved source shape: '+source.path,Object.keys(source).sort(),['path','sha256']);
 eq('unchanged exact prior bytes: '+source.path,hash(raw(source.path)),source.sha256);
 const data=read(source.path);
 if(source.path.endsWith('_ALLOCATION_TABLE.json')){
  const prior=JSON.parse(data);
  eq('prior allocation frozen: '+source.path,['ACCEPTED AND FROZEN','PERMANENT AND FROZEN'].includes(prior.status),true);
  eq('no prior family collision: '+source.path,prior.namespaces.some(n=>n.namespace===1039||n.name==='ObservationUnitId'),false);
  eq('no prior member claim: '+source.path,(prior.members??[]).some(m=>m.name==='unit/fixture-pulse'||m.payload==='unit/fixture-pulse'),false);
  priorNamespaces.push(...prior.namespaces.map(n=>n.namespace));
 }else if(source.path.endsWith('.md')){
  eq('no prior numeric/family claim: '+source.path,/\|\s*(?:1039|ObservationUnitId)\s*\|/.test(data),false);
  for(const line of data.split(/\r?\n/)){
   const match=/^\|\s*(10\d\d)\s*\|/.exec(line);if(match)priorNamespaces.push(Number(match[1]));
  }
 }
}
eq('immediately follows highest prior model namespace',Math.max(...priorNamespaces.filter(n=>n>=1000&&n<1100))+1,1039);
eq('no fixture namespace promotion',[20,21,23000,24004,25012,26004].includes(t.namespaces[0].namespace),false);
eq('no runtime namespace allocation',t.namespaces.every(n=>n.namespace<1100),true);
const report={version:t.version,status:'PASS: '+t.status,tableSha256:hash(raw(tablePath)),markdownSha256:hash(raw(markdownPath)),authoritySha256:hash(raw(t.authority)),allocationSnapshot:t,checks,
 limitations:['Mechanical audit does not freeze a review candidate.','OBS-UNIT-A..I remain implementation gates, not allocation audit results.','Generic OBS and REG semantics are unchanged; activation remains gated.']};
if(process.argv.includes('--write'))fs.writeFileSync(new URL(reportPath,root),JSON.stringify(report,null,2)+'\n');
if(process.argv.includes('--write')||process.argv.includes('--verify'))assert.deepEqual(JSON.parse(read(reportPath)),report,'stored report matches recomputation');
console.log(JSON.stringify({status:report.status,checks:checks.length,namespaces:t.namespaces.length,members:t.members.length,records:t.records.length},null,2));
