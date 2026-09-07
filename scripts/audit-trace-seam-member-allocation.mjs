// Mechanical allocation review only; neither acceptance nor runtime qualification.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),raw=p=>fs.readFileSync(new URL(p,root));
const read=p=>raw(p).toString('utf8'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const tablePath='docs/formal/TRACE_SEAM_MEMBER_ALLOCATION_TABLE.json';
const markdownPath='docs/formal/TRACE_SEAM_MEMBER_ALLOCATION.md';
const reportPath='docs/formal/TRACE_SEAM_MEMBER_ALLOCATION_AUDIT.json';
const t=JSON.parse(read(tablePath)),md=read(markdownPath),checks=[];
function eq(name,a,b){assert.deepEqual(a,b,name);checks.push({name,status:'PASS'});}
eq('exact authority',t.authority,'docs/planning/CAMPAIGN2_TRACE_BINDING_DECISION.md');
const authority=read(t.authority);
eq('whole mapping shape accepted',authority.includes('**Revision 2 — WHOLE MAPPING SHAPE ACCEPTED.**'),true);
eq('separate lifecycle',['REVIEW CANDIDATE','PERMANENT AND FROZEN'].includes(t.status),true);
eq('version and lifecycle',t.version,t.status==='REVIEW CANDIDATE'?'trace-seam-member-allocation/0.1-draft':'trace-seam-member-allocation/0.1-candidate');
eq('Markdown lifecycle parity',md.includes(`**Status: ${t.status}.**`),true);
eq('Markdown version parity',md.includes('`'+t.version+'`'),true);
eq('existing family only',t.existingFamily,{namespace:1036,name:'SeamId'});
const expected=[
 {namespace:1036,name:'seam/authored-adaptation-fact-source',payload:'seam/authored-adaptation-fact-source',event:'event/authored-adaptation-fact',phase:110,seamVersion:'adaptation-input/0.31-candidate'},
 {namespace:1036,name:'seam/authored-fact-observation',payload:'seam/authored-fact-observation',event:'event/fixture-consequence-observation',phase:120,seamVersion:'authored-fact-observation/0.1-candidate'},
];
eq('exact two-member surface',t.members,expected);
const rows=s=>s.split(/\r?\n/).filter(l=>l.startsWith('| ')).map(l=>l.split('|').slice(1,-1).map(c=>c.trim()));
const symbolic=rows(authority).filter(r=>r[1]?.startsWith('**symbolically accepted** '));
eq('symbolic to numeric coverage',symbolic.map(r=>({name:r[1].replace('**symbolically accepted** ',''),event:r[0].split(' / ')[0],phase:Number(r[0].split(' / ')[1]),seamVersion:r[2]})),t.members.map(({name,event,phase,seamVersion})=>({name,event,phase,seamVersion})));
eq('Markdown complete member parity',rows(md).filter(r=>r[0]==='1036'),t.members.map(m=>['1036','SeamId',m.name,m.payload,`${m.event} at phase ${m.phase}`,m.seamVersion]));
eq('unique typed members',new Set(t.members.map(m=>`${m.namespace}:${m.payload}`)).size,2);
for(const m of t.members){
 eq('allocated member has exactly one symbolic use: '+m.name,symbolic.filter(r=>r[1].endsWith(' '+m.name)).length,1);
 eq('existing namespace and no fixture promotion: '+m.name,m.namespace,1036);
 eq('exact nonempty NFC text: '+m.name,m.payload.length>0&&m.payload===m.name&&m.payload===m.payload.normalize('NFC'),true);
 eq('UTF-8 roundtrip: '+m.name,Buffer.from(m.payload,'utf8').toString('utf8'),m.payload);
}
const empty=['namespaces','records','bindings','unionVariants','finiteValues','occurrenceDefinitions','stateRoots','saveFields'];
for(const k of empty)eq('no new '+k,t[k],[]);
eq('complete table keys',Object.keys(t).sort(),['version','status','date','authority','preservedSources','existingFamily','members',...empty].sort());
const prior=JSON.parse(read('docs/formal/OBSERVATION_UNIT_ALLOCATION_TABLE.json')).preservedSources.map(s=>s.path);
prior.push(...['OBSERVATION_UNIT_ALLOCATION_TABLE.json','OBSERVATION_UNIT_PERMANENT_ALLOCATION.md','OBSERVATION_UNIT_ALLOCATION_AUDIT.json'].map(n=>'docs/formal/'+n));
const modelFolder='docs/planning/campaign2-first-model/';
const modelFiles=['content','parameters','registry','content-identity','parameter-identity','registry-identity','model-identity'].flatMap(n=>[n+'.cenc.hex',n+'.json']).concat('REVIEW_MANIFEST.json').sort();
eq('complete frozen model file inventory',fs.readdirSync(new URL(modelFolder,root)).sort(),modelFiles);
eq('complete preservation inventory',t.preservedSources.map(s=>s.path),[...prior,...modelFiles.map(n=>modelFolder+n)]);
for(const s of t.preservedSources){
 eq('preservation entry shape: '+s.path,Object.keys(s).sort(),['path','sha256']);
 eq('unchanged prior bytes: '+s.path,hash(raw(s.path)),s.sha256);
 if(s.path.endsWith('_ALLOCATION_TABLE.json')){
  const p=JSON.parse(read(s.path));
  eq('prior allocation frozen: '+s.path,['ACCEPTED AND FROZEN','PERMANENT AND FROZEN'].includes(p.status),true);
  eq('no prior member collision: '+s.path,(p.members??[]).some(old=>t.members.some(m=>old.namespace===m.namespace&&(old.name===m.name||old.payload===m.payload))),false);
 }
}
const base=JSON.parse(read('docs/formal/CAMPAIGN2_ALLOCATION_TABLE.json'));
eq('permanent SeamId namespace exists once',base.namespaces.filter(n=>n.namespace===1036&&n.name==='SeamId').length,1);
eq('existing family ownership and payload',base.namespaces.find(n=>n.namespace===1036),{name:'SeamId',namespace:1036,owner:'trace/transition substrate',payload:'text'});
eq('both scheduled event members already allocated',t.members.every(m=>base.members.some(v=>v.namespace===1001&&v.name===m.event)),true);
eq('historical frozen RulesVersion preserved',JSON.parse(read(modelFolder+'REVIEW_MANIFEST.json')).versions.rulesVersion,'rules/campaign2-bounded-bridge/0.1-candidate');
const report={version:t.version,status:'PASS: '+t.status,tableSha256:hash(raw(tablePath)),markdownSha256:hash(raw(markdownPath)),authoritySha256:hash(raw(t.authority)),allocationSnapshot:t,checks,
 limitations:['Mechanical PASS does not freeze this allocation candidate.','TRACE-C2-A..L remain FROZEN, NOT PASSED.','Trace wrappers require member allocation acceptance and new profile/RulesVersion/ModelIdentity commitment.']};
if(process.argv.includes('--write'))fs.writeFileSync(new URL(reportPath,root),JSON.stringify(report,null,2)+'\n');
if(process.argv.includes('--write')||process.argv.includes('--verify'))assert.deepEqual(JSON.parse(read(reportPath)),report,'stored audit recomputes');
console.log(JSON.stringify({status:report.status,checks:report.checks.length,newNamespaces:0,members:2,preservedFiles:t.preservedSources.length},null,2));
