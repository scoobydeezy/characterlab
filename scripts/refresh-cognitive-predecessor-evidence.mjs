// Correct-forward reruns of retained assays; never rewrite their historical receipts.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const names=['batch-witnesses','applicability','independent-gates','evid-reg-construction','reg-key-preservation','read-evidence','stage-boundary','write-boundary','route-separation','rule-overlap','magnitude-boundary','reference-settlement','state-invariant','adapt-rollback','fct-c','prj-substitutions','bridge-substitutions','metadata-state-scan'];
const sha=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex'),results=[];
for(const name of names){
 const script=`scripts/prove-campaign2-${name}.mjs`,original=fs.readFileSync(script,'utf8');
 const targets=[...original.matchAll(/writeFileSync\(new URL\((?:process\.argv\[2\]\?\?)?'(docs\/planning\/[^']+\.json)'/g)].map(m=>m[1]);assert.equal(targets.length,1,script+' single report output');
 const historical=targets[0],fresh=`docs/planning/COGNITIVE_PRESERVATION_${name.toUpperCase().replaceAll('-','_')}_REV1.json`;
 if(fs.existsSync(fresh)){results.push({script,historical,current:fresh,status:'EXISTING REFRESH RECEIPT',sha256:sha(fresh)});continue;}
 const before=fs.existsSync(historical)?sha(historical):undefined;let code=original.replaceAll(historical,fresh);
 // Same omission control at the current expanded input-only predicate. It still
 // removes that exact owning guard, now also protecting cognitive originals.
 if(name==='stage-boundary')code=code.replace("||task&&key(event.eventTypeId)===key(TASK_DEADLINE_EVENT))throw", "||cognitive&&key(event.eventTypeId)===key(DELIBERATION_EVENT)||task&&key(event.eventTypeId)===key(TASK_DEADLINE_EVENT))throw");
 if(name==='write-boundary')code=code.replace('decodeCampaign2(expected.outputs[i])','codec.decode(expected.outputs[i])');
 if(name==='metadata-state-scan')code=code.replace("const site='randomRelevantAuthoritativeIds:()=>list([])';", "const site=target===paths[0]?'randomRelevantAuthoritativeIds:state=>cognitive?cognitive.randomRelevantAuthoritativeIds(state):list([])':'randomRelevantAuthoritativeIds:()=>list([])';");
 code=code.replaceAll('createServer({server:', 'createServer({configFile:false,server:');
 const temp=`scripts/.cognitive-refresh-${name}.mjs`;assert(!fs.existsSync(temp));fs.writeFileSync(temp,code);
 try{await import(new URL('./.cognitive-refresh-'+name+'.mjs',import.meta.url));}finally{fs.unlinkSync(temp);}
 if(before)assert.equal(sha(historical),before,'historical report preserved');
 const report=JSON.parse(fs.readFileSync(fresh,'utf8'));results.push({script,scriptSha256:sha(script),historical,historicalSha256:before,current:fresh,status:report.status});console.log('PRESERVATION REFRESH '+name);
}
const output='docs/planning/COGNITIVE_PREDECESSOR_PRESERVATION_REV1.json';assert(!fs.existsSync(output));fs.writeFileSync(output,JSON.stringify({status:'RETAINED ASSAYS REEXECUTED',results,scope:'Exact retained finite scopes. Not a new general compiler, capability or whole Campaign2 proof.'},null,2)+'\n');
