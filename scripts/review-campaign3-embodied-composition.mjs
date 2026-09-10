// Corrected draft inventory and arithmetic/trace expectations; no runtime execution.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const output='docs/planning/CAMPAIGN3_EMBODIED_COMPOSED_REVIEW_REV1.json';
const typedOutput='docs/planning/CAMPAIGN3_EMBODIED_TYPED_INVENTORY_REV2.json';
assert(!fs.existsSync(output)&&!fs.existsSync(typedOutput),'preserve receipts; use a new revision');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const original='docs/planning/CAMPAIGN3_EMBODIED_TYPED_INVENTORY_REV1.json';
const previous=JSON.parse(fs.readFileSync(original));
const added={name:'LevelBinQuantization',fields:[['InputLevel','rational'],['Capacity','rational'],['BinWidth','rational'],['BinIndex','unsigned']].map(([name,type])=>({name,type,required:true})),allocation:'NONE'};
assert(!previous.records.some(r=>r.name===added.name));
const records=[...previous.records,added];assert.equal(records.length,32);
const doc='docs/planning/CAMPAIGN3_EMBODIED_COMPOSED_REVIEW_REV1.md';
const typed={status:'CORRECTED TYPE PROPOSAL; WHOLE SHAPE WITHHELD',records,typeAliases:previous.typeAliases,externalSchemaReferences:previous.externalSchemaReferences,identityRoles:previous.identityRoles,unionMatrices:previous.unionMatrices,numericTags:previous.numericTags,
 correction:'LevelBinQuantization is trace-only; no occurrence or character admission.',previous:{path:original,sha256:hash(original)},authority:{path:doc,sha256:hash(doc)}};
const expectedPath='docs/planning/CAMPAIGN3_EMBODIED_PROFILE_EXPECTATIONS_REV1.json';
const expected=JSON.parse(fs.readFileSync(expectedPath));
const parse=s=>s.split('/').map(BigInt);
function bin(q,C,w){const [n,d]=parse(q);const k=n===C*d?C/w-1n:n/(d*w);return {InputLevel:q,Capacity:`${C}/1`,BinWidth:`${w}/1`,BinIndex:String(k)};}
const operations={};let checked=0;
for(const [name,fixture] of Object.entries(expected.cases)){
 const w=name==='coarser'?20n:10n;operations[name]=[];
 for(const sample of fixture.records.filter(r=>r.kind==='sample')){
  if(sample.pressure==='Unavailable')continue;
  const op=bin(sample.reserve,100n,w),k=BigInt(op.BinIndex);
  assert.deepEqual(sample.interval,[`${k*w}/1`,`${(k+1n)*w}/1`]);
  operations[name].push({inputEvent:sample.input,operation:op});checked++;
 }
}
assert.equal(operations.baseline.length,6);assert.equal(operations.denied.length,0);assert.equal(operations.unavailable.length,0);
assert.equal(bin('0/1',100n,20n).BinIndex,'0');assert.equal(bin('20/1',100n,20n).BinIndex,'1');assert.equal(bin('100/1',100n,20n).BinIndex,'4');
const frozen=JSON.parse(fs.readFileSync('docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json'));for(const f of frozen.checks)assert.equal(hash(f.path),f.sha256,f.path);
fs.writeFileSync(typedOutput,JSON.stringify(typed,null,2)+'\n');
const report={status:'DRAFT CORRECTION CONSISTENT; NO EMB/ECOMP PASS',records:records.length,fields:records.reduce((n,r)=>n+r.fields.length,0),quantizationExamplesChecked:checked,endpointExamplesChecked:3,expectedQuantizationOperations:operations,preservedChecks:frozen.checks.length,
 limitation:'Calculated trace expectations only; production trace validation, epistemic exclusion and new codec are unexecuted.',
 typedInventory:{path:typedOutput,sha256:hash(typedOutput)},previousExpectations:{path:expectedPath,sha256:hash(expectedPath)},document:{path:doc,sha256:hash(doc)},script:{path:'scripts/review-campaign3-embodied-composition.mjs',sha256:hash('scripts/review-campaign3-embodied-composition.mjs')}};
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({records:report.records,fields:report.fields,quantizationExamples:checked,endpoints:3,preservedChecks:frozen.checks.length}));
