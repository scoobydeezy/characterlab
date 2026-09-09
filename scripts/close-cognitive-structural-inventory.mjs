// Correct-forward draft inventory: remove an unneeded canonical operand wrapper.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const prefix='docs/planning/CAMPAIGN2_COGNITIVE_';
const inventory=JSON.parse(fs.readFileSync(prefix+'SYMBOLIC_INVENTORY_REV4.json','utf8'));
const grammar=JSON.parse(fs.readFileSync(prefix+'FIELD_GRAMMAR_REV1.json','utf8'));
assert(inventory.records.some(r=>r.name==='CoverageContribution'));
for(const artifact of [inventory,grammar])artifact.records=artifact.records.filter(r=>r.name!=='CoverageContribution');
inventory.counts.records=inventory.records.length;
inventory.counts.fields=inventory.records.reduce((n,r)=>n+r.fields.length,0);
inventory.correction='CoverageContribution is a pure internal argument, not a canonical record. Its former shape remains historical draft inventory only.';
inventory.existingSchemaSuccessors=[{typeId:373,predecessorSchemaVersion:1,successorSchemaVersion:null,name:'TaskCommitmentState',fields:[{name:'Commitments',existingFieldId:1,grammar:'map(371,372)',required:true},{name:'AdoptedInstructions',fieldId:null,grammar:'map(371,AdoptedTaskInstruction)',required:true}],authority:'CAMPAIGN2_COGNITIVE_STATE_AND_OCCURRENCE_CLOSURE_DRAFT.md'}];
inventory.unresolved=['Whole relational/refinement and fixed-member closure','Authority parity of every existing identifier/schema reference','Final symbolic model declarations and adversarial whole-shape verdict','Separate permanent allocation then exact model materialization/freeze'];
grammar.sourceInventory=prefix+'SYMBOLIC_INVENTORY_REV5.json';
grammar.correction=inventory.correction;
for(const [name,value] of [['SYMBOLIC_INVENTORY_REV5.json',inventory],['FIELD_GRAMMAR_REV2.json',grammar]]){assert(!fs.existsSync(prefix+name));fs.writeFileSync(prefix+name,JSON.stringify(value,null,2)+'\n');}
console.log(JSON.stringify({records:inventory.counts.records,fields:inventory.counts.fields,existingRootSuccessors:1,allocation:false}));
