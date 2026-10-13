import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
const path='src/test/sem001JIntegratedGate.test.ts',bytes=fs.readFileSync(path),s=bytes.toString('utf8');
const take=(a,b)=>{const start=s.indexOf(a),end=s.indexOf(b,start);assert(start>=0&&end>start);return s.slice(start,end);};
const imports=s.slice(0,s.indexOf('const FORMAL_DOCS')).replace("import { describe, expect, it } from 'vitest';",'').replaceAll("'./fixtures/","'../test/fixtures/");
const helpers=take('const codeOf =',"describe('SEM-001J — no authoritative result");
const records=take('function recordTypeIds(',"describe('SEM-001J — the complete causal path");
fs.writeFileSync('src/workbench/semIntegratedFixture.ts', '// Generated native SEM-001J executable helpers. Document-ledger readers are excluded.\n'+imports+helpers+records+`\nexport {chainFor,identityBindings,recordTypeIds,ACCEPTED_NAMESPACES,OCCURRENCE_NAMESPACES,FIELD_NAMESPACE_ALIASES,NAMESPACE_BY_NAME};\nexport const originalSource={path:'${path}',sha256:'${createHash('sha256').update(bytes).digest('hex')}'} as const;\n`,{flag:'wx'});
