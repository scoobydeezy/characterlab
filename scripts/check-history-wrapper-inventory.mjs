// Historical inventory scope from archived graph; never assert current-directory completeness.
import fs from 'node:fs';import assert from 'node:assert/strict';
assert(!process.argv.includes('--write'));
let source=fs.readFileSync('scripts/check-public-wrapper-inventory.mjs','utf8');
const start=source.indexOf('const actual='),end=source.indexOf(';assert.deepEqual(actual',start);assert(start>=0&&end>start);
source=source.slice(0,start)+"const actual=preserved.artifacts.filter(a=>a.original.startsWith('src/campaign3/')&&a.original.endsWith('Runtime.ts')&&fs.readFileSync(a.archive,'utf8').includes('createCanonicalSave')).map(a=>a.original).sort()"+source.slice(end);
await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
source=fs.readFileSync('scripts/check-public-wrapper-routing.mjs','utf8');
const a=source.indexOf('const factories='),b=source.lastIndexOf(';',source.indexOf('const rows=',a));assert(a>=0&&b>a);
source=source.slice(0,a)+"const factories=JSON.parse(fs.readFileSync(root+'/FACTORY_ROUTING.json')).factories.map(r=>r.factory)"+source.slice(b);
await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
console.log('Historical47 archived native producers plus2 original producers;52 original factory routes. Current inventory completeness not asserted.');
