import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
const source='src/test/recognition.test.ts',body=fs.readFileSync(source,'utf8'),end=body.indexOf("describe('SEM-001F");assert(end>0);
const prefix=body.slice(0,end).replace("import { describe, expect, it } from 'vitest';",'').replace("from './fixtures/referentOrigin'","from '../test/fixtures/referentOrigin'");assert(!prefix.includes('vitest'));assert(!prefix.includes('expect('));
const hash=createHash('sha256').update(fs.readFileSync(source)).digest('hex');
fs.writeFileSync('src/workbench/semRecognitionFixture.ts',`// Generated from ${source}; helper bodies retained verbatim. No test hooks.\n${prefix}\nexport {initialModel,experience,catalog,cue,request,observerId,track,otherTrack,version};\nexport const originalSource={path:'${source}',sha256:'${hash}'} as const;\n`,{flag:'wx'});
console.log('PASS original recognition helper extraction');
