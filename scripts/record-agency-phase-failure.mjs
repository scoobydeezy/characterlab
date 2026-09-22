import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=process.cwd(),archive='docs/planning/agency-rev2/',out='docs/planning/AGENCY_PHASE_FAILURE_REV1.json';
const server=await createServer({configFile:false,plugins:[{name:'preserved-agency-imports',enforce:'pre',resolveId(source,importer){
 if(!importer||!importer.replaceAll('\\','/').includes('/'+archive)||!source.startsWith('.'))return null;
 const target=path.resolve(path.dirname(importer),source),candidates=[target,target+'.ts',target+'.json'];
 for(const candidate of candidates)if(fs.existsSync(candidate))return candidate;
 const relative=path.relative(path.join(root,archive),target);
 for(const suffix of ['', '.ts', '.json']){const candidate=path.join(root,relative+suffix);if(fs.existsSync(candidate))return candidate;}
 return null;
}}],server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const model=await server.ssrLoadModule('/'+archive+'src/campaign3/agencyModel.ts'),runtime=await server.ssrLoadModule('/'+archive+'src/campaign3/agencyRuntime.ts'),fx=await server.ssrLoadModule('/src/test/agencyFixtures.ts'),d=await server.ssrLoadModule('/src/campaign2/canonicalData.ts');
 const m=await model.compileAgencyModel(model.agencyRecipe()),input=await model.compileAgencyInputs(m,fx.initialState,fx.ordered([fx.original(1)]),fx.seed),run=runtime.createAgencyRuntime(m,input);await run.settle();
 const rows=run.snapshot().trace.map(v=>d.dataRecord(v,160n)).filter(v=>fx.records(d.dataItems(d.dataField(v,13n),'list'),425n).length);
 assert.equal(rows.length,1);const phase=d.dataField(d.dataRecord(d.dataField(rows[0],4n),130n),3n).value;
 assert.equal(phase,80n);assert.notEqual(phase,70n);
 fs.writeFileSync(out,JSON.stringify({status:'EXPECTED REGRESSION FAILURE CONFIRMED',contract:'agency-public/0.2-candidate',requiredIntentPhase:70,actualIntentPhase:Number(phase),modelIdentity:Buffer.from(m.modelIdentity.canonicalBytes).toString('hex'),preservation:archive+'PRESERVATION.json'},null,2)+'\n',{flag:'wx'});
 console.log('Preserved0.2 actually emits intent80; contract requires70.');
} finally {await server.close();}
