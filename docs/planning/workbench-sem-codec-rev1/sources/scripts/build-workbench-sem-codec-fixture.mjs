import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
const path='src/test/semanticCodecs.test.ts',body=fs.readFileSync(path,'utf8'),end=body.indexOf("describe('SEM-001I.3");assert(end>0);const prefix=body.slice(0,end).replace("import { describe, expect, it } from 'vitest';",'');
fs.writeFileSync('src/workbench/semCodecFixture.ts',prefix+`\nexport {mina,darius,sem001a,continuantFile,transition};\nexport const originalSource={path:'${path}',sha256:'${createHash('sha256').update(fs.readFileSync(path)).digest('hex')}'} as const;\n`,{flag:'wx'});
