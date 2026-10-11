import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';
assert(!process.argv.includes('--write'));
const P='docs/planning/',O=P+'campaign3-history-embarrassment-rev1/',sha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),ref=path=>({path,sha256:sha(path)});
execFileSync(process.execPath,['scripts/check-history-chosen-reappraisal-public-closure.mjs'],{stdio:'inherit'});
let source=fs.readFileSync('scripts/check-embarrassment-closure.mjs','utf8');const line="execFileSync(process.execPath,['scripts/check-chosen-reappraisal-public-closure.mjs'],{stdio:'inherit'});";
assert.equal(source.split(line).length,2);source=source.replace(line,'/* Predecessor checked above with authenticated historical wrapper scope. */');
await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const result={status:'PASS HISTORICAL SCOPE',scope:'Original embarrassment component closure and predecessor evidence; historical51/54 membership, not current55/58 completeness; tests/build not rerun.',checker:ref('scripts/check-history-embarrassment-closure.mjs'),original:ref(P+'EMBARRASSMENT_CLOSURE_REV1.json'),predecessor:ref(P+'campaign3-history-chosen-reappraisal-public-rev1/closure-check.json')};const out=O+'closure-check.json';if(fs.existsSync(out))assert.deepEqual(JSON.parse(fs.readFileSync(out)),result);else fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
