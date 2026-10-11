// Recheck historical repair matrix without asserting its old directory inventory is current.
import fs from 'node:fs';import assert from 'node:assert/strict';
assert(!process.argv.includes('--write'));
let source=fs.readFileSync('scripts/check-public-wrapper-repair.mjs','utf8');
for(const script of ['check-public-wrapper-inventory','check-public-wrapper-routing','check-preserved-public-wrapper-evidence']){
 const line=`execFileSync(process.execPath,['scripts/${script}.mjs'],{stdio:'inherit'});`;
 assert.equal(source.split(line).length,2);source=source.replace(line,'');
}
await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
console.log('Historical matrix/closure only; current directory inventory/routing not requalified. Preserved-source loader checked separately.');
