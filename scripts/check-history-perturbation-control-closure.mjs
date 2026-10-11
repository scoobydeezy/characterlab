import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
assert(!process.argv.includes('--write'));
const O='docs/planning/campaign3-history-perturbation-control-rev1/',sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),ref=path=>({path,sha256:sha(path)});
execFileSync(process.execPath,['scripts/check-history-disposition-public-closure.mjs'],{stdio:'inherit'});
for(const [family,previous]of [['sleep','disposition-public'],['intoxication','sleep-control']]){
 let source=fs.readFileSync('scripts/check-'+family+'-control-closure.mjs','utf8');
 const line="execFileSync(process.execPath,['scripts/check-"+previous+"-closure.mjs'],{stdio:'inherit'});";
 assert.equal(source.split(line).length,2);source=source.replace(line,'/* Predecessor checked above with authenticated historical wrapper scope. */');
 await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
}
const result={status:'PASS HISTORICAL SCOPE',scope:'Original sleep and intoxication closure assertions, tests/build receipts and source hashes checked. Historical wrapper50/53 membership authenticated by predecessor; current55/58 exhaustive inventory is separate. Tests/build not rerun.',checker:ref('scripts/check-history-perturbation-control-closure.mjs'),predecessor:ref('docs/planning/campaign3-history-disposition-public-rev1/closure-check.json'),originalClosures:['SLEEP','INTOXICATION'].map(f=>ref('docs/planning/'+f+'_CONTROL_CLOSURE_REV1.json'))};
const out=O+'closure-check.json';if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);else fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
