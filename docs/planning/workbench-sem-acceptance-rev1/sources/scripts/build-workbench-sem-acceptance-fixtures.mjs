import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
export function transformAcceptance(path){
 const bytes=fs.readFileSync(path);let body=bytes.toString('utf8').replace("import { describe, expect, it } from 'vitest';",'').replaceAll("'./fixtures/","'../test/fixtures/");
 const gate=path.endsWith('sem001AcceptanceGate.test.ts');
 let extra='';
 if(gate){
  const formal=['CAMPAIGN1_SEMANTIC_BINDING_VECTORS.md','OPEN_DECISIONS.md','EVENT_SEMANTIC_NUMERIC_REGISTRY.md'];
  const tests=['phenSem001Integration.test.ts','semanticNegativeControls.test.ts'];
  extra=formal.map((n,i)=>`import formal${i} from '../../docs/formal/${n}?raw';`).join('\n')+'\n'+tests.map((n,i)=>`import test${i} from '../test/${n}?raw';`).join('\n');
  const blocks=[['FORMAL_DOCS','../../docs/formal/*.md',formal.map((n,i)=>`'../../docs/formal/${n}':formal${i}`).join(',')],['TEST_FILES','./*.test.ts',tests.map((n,i)=>`'./${n}':test${i}`).join(',')]];
  for(const [name,glob,entries]of blocks){const original=`const ${name} = import.meta.glob('${glob}', {\n  query: '?raw', import: 'default', eager: true,\n}) as Readonly<Record<string, string>>;`;const normalized=body.replaceAll('\r\n','\n');assert(normalized.includes(original));body=normalized.replace(original,`const ${name}:Readonly<Record<string,string>>={${entries}};`);}
 }
 const split=body.indexOf(gate?'const FORMAL_DOCS':"describe('SEM-001 gate item 6");assert(split>0);
 return {bytes,body,split,extra,gate};
}
export function generatedAcceptance(path){const {bytes,body,split,extra,gate}=transformAcceptance(path);return body.slice(0,split)+extra+`\nimport {createAcceptanceRecorder} from './semAcceptanceRecorder';\nexport async function ${gate?'executeSemAcceptance':'executeSemConsumerReplay'}(){\nconst {expect,it,describe,finish}=createAcceptanceRecorder();\n`+body.slice(split)+`\nreturn ${gate?'{cases:await finish(),conditions:GATE_CONDITIONS}':'{cases:await finish()}'};\n}\nexport const originalSource={path:'${path}',sha256:'${createHash('sha256').update(bytes).digest('hex')}'} as const;\n`;}
if(process.argv[1]?.endsWith('build-workbench-sem-acceptance-fixtures.mjs'))for(const [source,target]of [['sem001AcceptanceGate','semAcceptanceFixture'],['phenSem001Integration','semConsumerReplayFixture']])fs.writeFileSync(`src/workbench/${target}.ts`,generatedAcceptance(`src/test/${source}.test.ts`),{flag:'wx'});
