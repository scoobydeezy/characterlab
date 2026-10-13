import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
const source='src/test/semanticRecognitionState.test.ts',body=fs.readFileSync(source,'utf8'),end=body.indexOf("describe('SEM-001I.3");assert(end>0);
const prefix=body.slice(0,end).replace("import { describe, expect, it } from 'vitest';",'').replace("from './fixtures/referentOrigin'","from '../test/fixtures/referentOrigin'");assert(!prefix.includes('vitest'));assert(!prefix.includes('expect('));
const hash=createHash('sha256').update(fs.readFileSync(source)).digest('hex');
fs.writeFileSync('src/workbench/semKnowledgeFixture.ts',`// Generated from ${source}; original helper bodies, no test hooks.\n${prefix}\nexport {model,experience,catalogEntry,catalog,mapping,identityClaimCue,request,observerId,track,version};\nexport const originalSource={path:'${source}',sha256:'${hash}'} as const;\n`,{flag:'wx'});
console.log('PASS original knowledge-state helper extraction');
