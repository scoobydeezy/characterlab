import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='docs/planning/campaign3-history-affect-evidence-rev1';
fs.mkdirSync(dir,{recursive:true});
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const script='scripts/summarize-affect-public.mjs';
let source=fs.readFileSync(script,'utf8');
const once=(a,b)=>{assert.equal(source.split(a).length,2);source=source.replace(a,b);};
once("assert(!fs.existsSync(output),'immutable receipt exists');","assert(fs.existsSync(output));");
once("fs.writeFileSync(output,JSON.stringify(result,null,2)+'\\n',{flag:'wx'});","assert.deepEqual(result,JSON.parse(fs.readFileSync(output)));");
assert(!source.includes('writeFileSync'));
const result={script,sourceSha256:sha(script),checkerSha256:sha('scripts/check-history-affect-evidence.mjs'),scope:'Read-only original aggregation assertions and exact stored result equality; no scheduler,restore,unit test or supplementary run executed.'};
try {await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));result.status='PASS EXACT ORIGINAL AGGREGATE AND ELEVEN CLAIM CHECKS';}
catch(e){result.status='PRESERVED CHECK FAILURE';result.message=e.message;result.stack=e.stack;}
const p=dir+'/aggregate-check.json';
if(fs.existsSync(p))assert.deepEqual(JSON.parse(fs.readFileSync(p)),result);
else fs.writeFileSync(p,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(result));
