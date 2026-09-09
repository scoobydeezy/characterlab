import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]}});
try{
 const {firstTraceModel}=await server.ssrLoadModule('/src/campaign2/firstTraceModel.ts');
 const {compileBoundedModelDeclarations}=await server.ssrLoadModule('/src/campaign2/modelPackaging.ts');
 const {decodeCampaign2}=await server.ssrLoadModule('/src/campaign2/codecs.ts');
 const {dataItems:items,dataField:f,dataRecord:rec,dataIdentity:id}=await server.ssrLoadModule('/src/campaign2/canonicalData.ts');
 const source=firstTraceModel(),model=await compileBoundedModelDeclarations(source),slots=items(decodeCampaign2(source.registry),'list');
 const name=v=>id(v).payload.value;
 const entries=model.compiled.entries().map(v=>{const e=rec(v,171n),definition=f(e,4n);assert.equal(definition.kind,'record');return {stableId:name(f(e,1n)),kind:name(f(e,2n)),version:f(e,3n).value,definitionType:String(definition.schema.typeId)};});
 const descriptors=items(slots[0],'set').filter(v=>v.kind==='record'&&v.schema.typeId===172n).map(v=>({type:String(f(v,1n).value),version:String(f(v,2n).value)}));
 const transitions=entries.filter(e=>e.kind==='registry/transition-registration');assert.equal(transitions.length,4);
 assert.equal(model.compiled.stateModel.declaredFamilies().length,5);assert.equal(items(slots[3],'set').length,0);
 assert.equal(model.profiles.persistence,'campaign2-persistence/0.1-candidate');
 assert(!('probe' in model)&&!('measurement' in model)&&!('memory' in model));
 const sources=['src/campaign2/modelPackaging.ts','src/campaign2/factory.ts','src/campaign2/adaptationRuntime.ts','src/campaign2/orderedInputs.ts','src/campaign2/consequenceBridge.ts','src/campaign2/evidExecution.ts','src/campaign2/adaptationEvaluation.ts','src/campaign2/regulatoryReference.ts','src/substrate/persistence.ts','src/test/campaign2SchemaClosure.test.ts'];
 const report={status:'INVENTORY VERIFIED; NOT A RUNTIME OR RELEASE VERDICT',rulesVersion:source.rulesVersion,profiles:model.profiles,descriptors,descriptorCount:descriptors.length,descriptorNegativeCalls:descriptors.length*4,entries,transitions,writablePatterns:5,readOnlyPatterns:0,successorCapabilitiesAbsent:['probe','measurement','memory'],sourceFingerprints:sources.map(path=>({path,sha256:createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex')})),limits:['Descriptor negative-call count describes the separately executed test loop; this script only audits inventory.','No inference from schema presence to runtime capabilities.','No exhaustive behavioral proof or PERSIST-I positive witness.']};
 fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_BOUNDED_CLOSURE_INVENTORY.json',root),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({status:report.status,descriptors:descriptors.length,negativeCalls:report.descriptorNegativeCalls,entries:entries.length,transitions}));
}finally{await server.close();}
