import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
for(const [name,start] of [['Binding','const roleOf ='],['Causal','const dariusPreservesActor:']]){
 const path=`src/test/phenSem001${name}.test.ts`,bytes=fs.readFileSync(path),body=bytes.toString('utf8').replace("import { describe, expect, it } from 'vitest';",'').replaceAll("'./fixtures/","'../test/fixtures/"),split=body.indexOf(start);assert(split>0);
 fs.writeFileSync(`src/workbench/semPhenomenon${name}Fixture.ts`,body.slice(0,split)+`\nimport {createPhenomenonRecorder} from './semPhenomenonRecorder';\nexport function execute${name}Phenomenon(){\nconst {expect,it,describe,finish}=createPhenomenonRecorder();\n`+body.slice(split)+`\nreturn finish();\n}\nexport const originalSource={path:'${path}',sha256:'${createHash('sha256').update(bytes).digest('hex')}'} as const;\n`,{flag:'wx'});
}
