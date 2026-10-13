import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
const source='src/test/perceptualClassification.test.ts',body=fs.readFileSync(source,'utf8'),end=body.indexOf("describe('SEM-001D");assert(end>0);
const prefix=body.slice(0,end).replace("import { describe, expect, it } from 'vitest';",'').replace("'./fixtures/referentOrigin'","'../test/fixtures/referentOrigin'");assert(!prefix.includes('expect('));
const hash=createHash('sha256').update(fs.readFileSync(source)).digest('hex');
fs.writeFileSync('src/workbench/semClassificationBoundaryFixture.ts',`${prefix}\nexport {DEFAULT_SUPPORT,observerId,experienceId,detectionId,continuant,transformationVersion,initialModel,feature,request,replaceRule};\nexport const originalSource={path:'${source}',sha256:'${hash}'} as const;\n`,{flag:'wx'});console.log('PASS original classification boundary helper extraction');
