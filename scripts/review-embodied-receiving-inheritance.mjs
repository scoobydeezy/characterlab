// Read-only audit of symbolic references and dormant predecessor declarations.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const output='docs/planning/EMBODIED_RECEIVING_INHERITANCE_REVIEW_REV1.json';assert(!fs.existsSync(output));
const inventoryPath='docs/planning/EMBODIED_RECEIVING_SYMBOLIC_INVENTORY_REV3.json',inventory=JSON.parse(fs.readFileSync(inventoryPath));
const folder='docs/planning/campaign2-task-cognitive-model';
const fingerprint=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const paths=[inventoryPath,folder+'/FREEZE.json',folder+'/content.cenc.hex',folder+'/registry.cenc.hex','docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json','docs/formal/EMBODIED_RESERVE_ALLOCATION_TABLE.json'];
const before=paths.map(fingerprint),server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try {
 const {embodiedSupportedSchemas,decodeEmbodied}=await server.ssrLoadModule('/src/campaign3/embodiedCodecs.ts');
 const {canonicalEncode:enc}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const schemas=embodiedSupportedSchemas(),f=(v,n)=>v.fields.get(BigInt(n)),hex=v=>Buffer.from(enc(v)).toString('hex');
 const inherited=[];
 for(const [name,ref] of Object.entries(inventory.existingRecords)){const [typeId,schemaVersion]=ref.split('/').map(BigInt),s=schemas.find(s=>s.typeId===typeId&&s.schemaVersion===schemaVersion);assert(s,'missing inherited '+name);assert.equal(s.name,name,'inherited schema name differs');inherited.push({name,ref});}
 const allocation=JSON.parse(fs.readFileSync('docs/formal/TASK_COGNITIVE_ALLOCATION_TABLE.json'));
 for(const [name,namespace] of Object.entries(inventory.existingIdentityFamilies))assert.equal(allocation.identifierAliases[name],namespace,'identity family '+name);
 const read=name=>decodeEmbodied(Uint8Array.from(Buffer.from(fs.readFileSync(folder+'/'+name+'.cenc.hex','utf8').trim(),'hex')));
 const rows=read('registry').items[0].items.filter(v=>v.schema?.typeId===171n),content=read('content').items;
 const row=name=>{const matches=rows.filter(r=>f(r,1).payload?.value===name);assert.equal(matches.length,1,name);return matches[0];};
 const prediction=row('definition/measurement-prediction'),definition=f(prediction,4),task=row('definition/task-a'),spec=f(task,4);
 assert.equal(definition.schema.typeId,359n);assert.equal(f(prediction,3).value,'measurement-prediction/0.2-candidate');
 assert.equal(f(definition,3).namespaceId,1039n);assert.equal(f(definition,3).payload.value,'unit/diagnostic-regulatory-level');assert.equal(f(definition,4).value,64n);
 assert.equal(hex(f(spec,2)),hex(f(prediction,1)));
 const character=content.filter(v=>f(v,2).payload.value==='semantic-kind/character'),taskContent=content.filter(v=>f(v,1).payload.value==='content/task-a');
 assert.equal(character.length,1);assert.equal(taskContent.length,1);assert.equal(hex(f(spec,1)),hex(f(character[0],1)));
 assert.equal(f(taskContent[0],2).payload.value,'semantic-kind/task-commitment');
 for(const n of [3,7,8,10,11,13,16])assert.equal(hex(f(taskContent[0],n).items[0]),hex(f(task,1)));
 assert.equal(hex(f(taskContent[0],12).items[0]),hex(f(character[0],1)));
 const retained=[prediction,character[0],taskContent[0]].map(v=>({schema:`${v.schema.typeId}/${v.schema.schemaVersion}`,sha256:createHash('sha256').update(enc(v)).digest('hex'),canonicalHex:hex(v)}));
 assert.deepEqual(paths.map(fingerprint),before);
 fs.writeFileSync(output,JSON.stringify({status:'INHERITED REFERENCES AND ACTUAL DORMANT DIAGNOSTIC DECLARATION VERIFIED; NOT MODEL ADMISSION',inherited,identityFamilies:inventory.existingIdentityFamilies,dormantPrediction:{entryVersion:f(prediction,3).value,channel:f(definition,1).payload.value,subjectCanonicalHex:hex(f(definition,2)),unit:f(definition,3).payload.value,maxEvidenceCount:String(f(definition,4).value)},retainedExactDeclarations:retained,preservation:before,limits:['The new model must bind its body to this same qualified subject and validate the retained content with actual VAL.','Task timing/calibration may be changed only in the separately committed new model.','No prediction, REG, memory or identity state/producer is activated by retaining these declarations.','No new symbolic record is canonically encoded or allocated by this audit.']},null,2)+'\n');
 console.log(JSON.stringify({inheritedSchemas:inherited.length,identityFamilies:Object.keys(inventory.existingIdentityFamilies).length,dormantVersion:f(prediction,3).value,channel:f(definition,1).payload.value,unit:f(definition,3).payload.value}));
} finally {await server.close();}
