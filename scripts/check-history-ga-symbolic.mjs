import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),rows=[];
for(const [script,variable,output]of [['scripts/review-ga-logical-topology-rev2.mjs','output','docs/planning/GA_LOGICAL_TOPOLOGY_REVIEW_REV2.json'],['scripts/review-ga-output-declarations-rev2.mjs','out','docs/planning/GA_OUTPUT_DECLARATIONS_REVIEW_REV2.json']]){
 let source=fs.readFileSync(script,'utf8');function once(a,b){assert.equal(source.split(a).length,2);source=source.replace(a,b);}
 once(`assert(!fs.existsSync(${variable}));`,`assert(fs.existsSync(${variable}));`);
 once(`fs.writeFileSync(${variable},JSON.stringify(`,`assert.deepEqual(JSON.parse(fs.readFileSync(${variable})),`);once("},null,2)+'\\n');","});");assert(!source.includes('writeFileSync'));
 try{await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));}catch(e){console.error(e.message);process.exit(1);}
 const receipt=read(output);rows.push({script:{path:script,sha256:sha(script)},receipt:{path:output,sha256:sha(output)},stageTemplates:receipt.stageTemplates,faults:receipt.faults.length});
}
const result={status:'TOPOLOGY AND OUTPUT STATIC REVIEWS REPRODUCED',rows,scope:'Full original static assertions/mutation controls and exact receipt equality;not runtime branch predicates,join-once behavior,source admission or work ceiling.',checkerSha256:sha('scripts/check-history-ga-symbolic.mjs')},out='docs/planning/campaign3-history-ga-symbolic-rev1/';fs.mkdirSync(out,{recursive:true});const file=out+'canonical-check.json';if(fs.existsSync(file))assert.deepEqual(read(file),result);else fs.writeFileSync(file,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(result));
