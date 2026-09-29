// Scope the immutable predecessor audit to its original directory inventory.
// Current exhaustive inventory is checked separately by check-chosen-reappraisal-wrapper-extension.
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {syncBuiltinESMExports} from 'node:module';import {createHash} from 'node:crypto';
assert.equal(process.env.CHARACTERLAB_CHOSEN_REAPPRAISAL_PREDECESSOR_SCOPE,'1');
const original=fs.readdirSync.bind(fs),root=path.resolve('src/campaign3'),extension=JSON.parse(fs.readFileSync('docs/planning/CHOSEN_REAPPRAISAL_WRAPPER_EXTENSION_REV1.json'));
const excluded=new Set(extension.additions.map(a=>{assert.equal(createHash('sha256').update(fs.readFileSync(a.path)).digest('hex'),a.sha256);return path.basename(a.path);}));
fs.readdirSync=function(dir,...args){const rows=original(dir,...args);if(path.resolve(String(dir))!==root)return rows;return rows.filter(r=>!excluded.has(typeof r==='string'?r:r.name));};syncBuiltinESMExports();
