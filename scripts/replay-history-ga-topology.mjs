import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='docs/planning/campaign3-history-ga-topology-rev1';fs.mkdirSync(dir,{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
const fp=path=>({path,sha256:hash(fs.readFileSync(path))});
const save=(path,v)=>{if(fs.existsSync(path))assert.deepEqual(JSON.parse(fs.readFileSync(path)),v);else fs.writeFileSync(path,JSON.stringify(v,null,2)+'\n');};
const names={WorldEventId:'WorldEventOccurrenceId',EventBindingId:'EventBindingOccurrenceId',DetectionOccurrenceId:'CurrentDetectionId',EventDetectionOccurrenceId:'CurrentEventDetectionId',PerceivedBindingId:'PerceivedBindingOccurrenceId',CausalRoleEvidenceId:'CausalRoleClaimId',WorkspaceOccurrenceId:'TaskWorkspaceOccurrenceId',AppraisalOccurrenceId:'TaskAppraisalOccurrenceId'};
const builder='scripts/build-ga-output-declarations.mjs';
let recovered=fs.readFileSync(builder,'utf8').replace('GA_OUTPUT_DECLARATIONS_REV2.json','GA_OUTPUT_DECLARATIONS_REV1.json');
recovered=recovered.replace(/\b(?:WorldEventId|EventBindingId|DetectionOccurrenceId|EventDetectionOccurrenceId|PerceivedBindingId|CausalRoleEvidenceId|WorkspaceOccurrenceId|AppraisalOccurrenceId)\b/g,m=>names[m]);
const wanted=JSON.parse(fs.readFileSync('docs/planning/GA_OUTPUT_DECLARATIONS_REV1.json')).sources.at(-1).sha256;
assert.equal(hash(recovered),wanted,'Exact original builder commitment, not guessed equivalence');
const archive=dir+'/'+wanted.slice(0,16)+'-build-ga-output-declarations.mjs';
if(fs.existsSync(archive))assert.equal(fs.readFileSync(archive,'utf8'),recovered);else fs.writeFileSync(archive,recovered);
const rows=[];
for(const name of ['review-ga-logical-topology','review-ga-logical-topology-rev2','review-ga-output-declarations','review-ga-output-declarations-rev2','build-ga-output-declarations']){
 const path='scripts/'+name+'.mjs';let source=fs.readFileSync(path,'utf8'),writes=0;
 source=source.replace(/assert\(!fs.existsSync\((output|out)\)(?:,'write-once proposal')?\);/,(_,v)=>`assert(fs.existsSync(${v}));`);
 assert(!source.includes('assert(!fs.existsSync('));
 assert.equal((source.match(/fs.writeFileSync\(/g)||[]).length,1);
 source=source.replace('fs.writeFileSync(','globalThis.__historyTopologyWrite(');
 globalThis.__historyTopologyWrite=(output,text)=>{writes++;const result=JSON.parse(text);assert.deepEqual(result,JSON.parse(fs.readFileSync(output)));for(const r of result.sources)assert.deepEqual(fp(r.path),r);rows.push({script:fp(path),output:fp(output),faults:result.faults??[]});};
 try{await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));assert.equal(writes,1);}finally{delete globalThis.__historyTopologyWrite;}
}
assert.equal(rows.reduce((n,r)=>n+r.faults.length,0),49);
save(dir+'/replay.json',{status:'PASS; FOUR ORIGINAL STRUCTURAL REVIEWERS AND REV2 BUILDER REPRODUCED',checker:fp('scripts/replay-history-ga-topology.mjs'),rows,recoveredBuilder:{...fp(archive),originalPath:builder,method:'Reverse eight declaration-name substitutions and output destination; SHA exactly matches the original REV1 commitment. Not a Git recovery or chronology proof.'},names,limits:['49 symbolic fault executions do not execute runtime scheduling, branch predicates, allocation slots, future-time checks, joins, physical patches or rollback.','The superseded REV1 builder bytes are authenticated; it is not rerun as a public implementation.']});
console.log(JSON.stringify({status:'PASS',faults:49,archive:fp(archive)}));
