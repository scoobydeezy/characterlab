// Used ONLY by check-preserved-public-wrapper-evidence.mjs. This verifies historical
// receipts against their preserved source graph; it does not test current behavior.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {syncBuiltinESMExports} from 'node:module';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
assert.equal(process.env.CHARACTERLAB_HISTORICAL_WRAPPER_CHECK,'1');
const read=fs.readFileSync.bind(fs),root=path.resolve('.'),manifest=JSON.parse(read('docs/planning/public-wrapper-quiescence-rev1/PRESERVATION.json'));
const mapping=new Map(manifest.artifacts.map(a=>{assert.equal(createHash('sha256').update(read(a.archive)).digest('hex'),a.sha256);return [path.resolve(a.original),path.resolve(a.archive)];}));
fs.readFileSync=function(file,...args){const resolved=typeof file==='number'?undefined:path.resolve(file instanceof URL?fileURLToPath(file):String(file));return read(mapping.get(resolved)??file,...args);};
syncBuiltinESMExports();
