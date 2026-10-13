import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
const source='src/test/perceptualEventClassification.test.ts',body=fs.readFileSync(source,'utf8'),end=body.indexOf("describe('SEM-001E");assert(end>0);
const prefix=body.slice(0,end).replace("import { describe, expect, it } from 'vitest';",'').replace("'./fixtures/referentOrigin'","'../test/fixtures/referentOrigin'");assert(!prefix.includes('expect('));
const hash=createHash('sha256').update(fs.readFileSync(source)).digest('hex');
fs.writeFileSync('src/workbench/semEventClassificationFixture.ts',`${prefix}\nexport {SUPPORT_BASE,observerId,eventFile,continuants,detection,version,initialModel,feature,request,ropeFeatures,replaceRule};\nexport const originalSource={path:'${source}',sha256:'${hash}'} as const;\n`,{flag:'wx'});console.log('PASS original event-classification helper extraction');
