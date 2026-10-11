// Original finite-cohort review, with publication replaced by exact frozen equality.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const script='scripts/review-freeze-embodied-receiving-models.mjs',sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');let source=fs.readFileSync(script,'utf8');
function replaceOnce(from,to){assert.equal(source.split(from).length,2);source=source.replace(from,to);}
replaceOnce("from 'vite'","from "+JSON.stringify(import.meta.resolve('vite')));
replaceOnce('assert(!fs.existsSync(output));','assert(fs.existsSync(output));');
replaceOnce('fs.mkdirSync(output);','assert(fs.existsSync(output));');
replaceOnce("fs.mkdirSync(output+'/'+model.name);","assert(fs.existsSync(output+'/'+model.name));");
replaceOnce("fs.copyFileSync(input+'/'+model.name+'/'+name+'.cenc.hex',destination);","assert.deepEqual(fs.readFileSync(input+'/'+model.name+'/'+name+'.cenc.hex'),fs.readFileSync(destination));");
replaceOnce("fs.writeFileSync(output+'/FREEZE.json',JSON.stringify(","assert.deepEqual(JSON.parse(fs.readFileSync(output+'/FREEZE.json')),");
replaceOnce("},null,2)+'\\n');console.log", "});console.log");
assert(!source.includes('writeFileSync')&&!source.includes('mkdirSync')&&!source.includes('copyFileSync'));
try{await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 const file='docs/planning/campaign3-embodied-receiving-model-rev1/FREEZE.json',v=JSON.parse(fs.readFileSync(file)),result={status:'13 RECEIVING MODELS /180 CHECKS /EXACT FREEZE VERIFIED',models:v.models.length,checks:v.checked,componentChecks:v.componentChecks,freeze:{path:file,sha256:sha(file)},scope:'Fresh original structural review including exact single-operand variants,16 stage declarations,identity commitments and unchanged inherited content;historical componentChecks is not freshly rerun by this adapter. No runtime qualification.',checkerSha256:sha('scripts/check-history-receiving-freeze.mjs')};
 const out='docs/planning/campaign3-history-receiving-freeze-rev1/';fs.mkdirSync(out,{recursive:true});const dest=out+'canonical-check.json';if(fs.existsSync(dest))assert.deepEqual(JSON.parse(fs.readFileSync(dest)),result);else fs.writeFileSync(dest,JSON.stringify(result,null,2)+'\n',{flag:'wx'});console.log(result.status);
}catch(e){console.error(e.message);process.exitCode=1;}
