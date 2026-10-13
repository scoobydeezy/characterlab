import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
const source='src/test/perceptualContinuantFiles.test.ts',body=fs.readFileSync(source,'utf8'),end=body.indexOf("describe('SEM-001A");assert(end>0);
const prefix=body.slice(0,end).replace("import { describe, expect, it } from 'vitest';",''),start=prefix.indexOf('const mina =');assert(start>0);assert(!prefix.includes('expect('));
const hash=createHash('sha256').update(fs.readFileSync(source)).digest('hex');
fs.writeFileSync('src/workbench/semContinuantFixture.ts',`// Original helper bodies retained verbatim; each invocation owns its detection-label map.\n${prefix.slice(0,start)}\nexport function createContinuantFixture(){\n${prefix.slice(start)}\nreturn {mina,darius,version,observation,continuantFile,transition,failureCode,runDetections,detectionOrdinals:()=>[...DETECTION_ORDINALS].map(([label,ordinal])=>({label,ordinal:String(ordinal)}))};\n}\nexport const originalSource={path:'${source}',sha256:'${hash}'} as const;\n`,{flag:'wx'});
console.log('PASS original continuant helper factory extraction');
