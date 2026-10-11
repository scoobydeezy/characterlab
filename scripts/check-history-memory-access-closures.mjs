import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const checks=[];
for(const [script,original] of [['check-affect-retrieval-closure','AFFECT_RETRIEVAL'],['check-vivid-closure','VIVID'],['check-recollection-closure','RECOLLECTION']]) {
 const path=`scripts/${script}.mjs`,output=execFileSync(process.execPath,[path],{encoding:'utf8'}).trim();
 checks.push({path,sha256:sha(path),original:`docs/planning/${original}_CLOSURE_REV1.json`,originalSha256:sha(`docs/planning/${original}_CLOSURE_REV1.json`),output});
}
const v={status:'PASS',scope:'Original read-only closure checkers, no write flag. Historical test/build evidence authenticated, not rerun.',checks,checkerSha256:sha('scripts/check-history-memory-access-closures.mjs')};
const path='docs/planning/campaign3-history-memory-access-rev1/closures.json';
if(fs.existsSync(path))assert.deepEqual(JSON.parse(fs.readFileSync(path)),v);else fs.writeFileSync(path,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
console.log('PASS three original memory-access closures.');
