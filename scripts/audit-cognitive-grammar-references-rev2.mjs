// Draft consistency audit, not runtime admission or permanent allocation.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const source='docs/planning/CAMPAIGN2_COGNITIVE_FIELD_GRAMMAR_REV1.json';
const target='docs/planning/CAMPAIGN2_COGNITIVE_GRAMMAR_REFERENCE_AUDIT_REV2.json';
assert(!fs.existsSync(target),'preserve prior receipt');
const grammar=JSON.parse(fs.readFileSync(source,'utf8'));
const records=new Set(grammar.records.map(r=>r.name));
const aliases={CharacterId:'1002/character qualifier',TaskReferentId:'1002/task qualifier',ObserverId:'1000',DefinitionId:'1027/exact receiving kind and member',ProjectionAccessorId:'1028',SeamId:'1036',EventTypeId:'1001',TransitionKindId:'1009'};
const inventory=JSON.parse(fs.readFileSync('docs/planning/CAMPAIGN2_COGNITIVE_SYMBOLIC_INVENTORY_REV4.json','utf8'));
for(const symbol of inventory.requiredIdentitySymbols)aliases[symbol]='symbolic; separate allocation required';
const existing=new Set(['110','112','149','201','237','254','266','271','272','273','274','276','277','322','361','363','371','372']);
const primitives=new Set(['u','i','q','bool','text']);
function parse(s){
 const m=/^([A-Za-z][A-Za-z0-9]*|[0-9]+)(?:\((.*)\))?$/.exec(s);assert(m,'invalid grammar '+s);
 const [_,name,body]=m;
 if(body===undefined){assert(primitives.has(name)||records.has(name)||name in aliases||existing.has(name),'unresolved '+name);return;}
 const args=[];let depth=0,start=0;
 for(let i=0;i<body.length;i++){if(body[i]==='(')depth++;if(body[i]===')')depth--;if(body[i]===','&&depth===0){args.push(body.slice(start,i));start=i+1;}}
 assert.equal(depth,0);args.push(body.slice(start));
 assert(['r','id','enum','list','set','map'].includes(name));assert.equal(args.length,name==='map'?2:1);
 if(name==='r')assert(records.has(args[0])||existing.has(args[0]),'record '+args[0]);
 else if(name==='id')assert(args[0] in aliases,'identifier '+args[0]);
 else if(name==='enum')assert(args[0] in grammar.enums,'enum '+args[0]);
 else args.forEach(parse);
}
let fields=0;for(const r of grammar.records)for(const f of r.fields){parse(f.grammar);fields++;}
// Prove the auditor rejects unresolved nested names and constructor misuse.
for(const invalid of ['map(Unknown,q)','r(CharacterId)','id(TaskWorkspace)','list(map(i,Missing))','set(q,q)','enum(Missing)'])assert.throws(()=>parse(invalid));
const unions=[];
for(const [name,variants] of Object.entries(grammar.unionRules)){
 const r=grammar.records.find(r=>r.name===name),optional=r.fields.filter(f=>f.optional).map(f=>f.name);
 for(const [tag,required] of Object.entries(variants))unions.push({record:name,variant:tag,required,forbidden:optional.filter(f=>!required.includes(f))});
}
fs.writeFileSync(target,JSON.stringify({status:'DRAFT REFERENCE AND UNION COVERAGE ONLY',source,sha256:createHash('sha256').update(fs.readFileSync(source)).digest('hex'),identifierAliases:aliases,existingRecordReferences:[...existing],records:records.size,fields,closedUnionBranches:unions,rejectionControls:6,numericAllocation:null,limits:'Alias namespaces require authority parity review; grammar reference resolution does not prove refinements, source authenticity, codecs, runtime controls or model closure.'},null,2)+'\n');
console.log(JSON.stringify({records:records.size,fields,unionBranches:unions.length,rejectedInvalidGrammars:6}));

