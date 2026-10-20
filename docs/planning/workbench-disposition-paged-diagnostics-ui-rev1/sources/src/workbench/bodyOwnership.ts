import catalog from './bodyCatalog.json';
import {bodyCases,bodySource,runBodyCase} from '../test/bodyOwnershipFixtures';
import {bytesToHex} from '../substrate/canonicalEncoding';
import {digest,fromHex} from './canonical';
export const BODY_OWNERSHIP_CANDIDATES=[
 {id:'Mediated',authority:'Public pressure from admitted interoception and SEM settlement',field:'mediated'},
 {id:'MeterBehindSensor',authority:'Research-owned physiological meter behind the same sensor',field:'meter'},
 {id:'IndependentNeed',authority:'Boundary-violating research control using hidden body directly',field:'independent'},
 {id:'AuthoredReference',authority:'Actual REG authored operating point; not current body reserve',field:'reference'},
 {id:'CachedEvidence',authority:'Research component cache replaced only from admitted current pressure',field:'cached'},
] as const;
function pressure(value:unknown){
 if(value==='Unavailable')return {kind:'Unavailable' as const};
 if(typeof value!=='string'||!/^\d+\/[1-9]\d*$/.test(value))throw Error('Invalid BODY pressure projection');
 return {kind:'Known' as const,exact:value};
}
/** Invoke the accepted finite research harness unchanged. It creates independent
 * public source execution and separate component owners; no active UI run is read. */
export async function inspectBodyOwnership(program:string){
 const original=catalog.programs.find(p=>p.name===program),fixture=bodyCases().find(p=>p.name===program);
 if(!original||!fixture||fixture.model!==original.model||bytesToHex(fixture.initialState)!==original.initialState||bytesToHex(fixture.orderedInputs)!==original.orderedInputs)throw Error('BODY ownership original program mismatch');
 const source=bodySource(fixture.model),model=catalog.models.find(m=>m.name===fixture.model)!;
 for(const key of ['content','registry','parameters'] as const)if(bytesToHex(source[key])!==model[key])throw Error('BODY ownership source image mismatch');
 const result=await runBodyCase(fixture,false);if(result.runIdentity!==original.runIdentity)throw Error('BODY ownership run identity mismatch');
 const probes=result.probes.map(row=>({at:String(row.at),diagnosticBody:row.body,admittedSample:row.sample,admittedInterval:row.interval,ground:row.ground,cacheAt:row.cacheAt,values:BODY_OWNERSHIP_CANDIDATES.map(c=>({candidate:c.id,authority:c.authority,pressure:pressure(row[c.field])}))}));
 return {version:'body-ownership-inspection/0.1',contract:'body-ownership-comparison/0.1-candidate',program,model:fixture.model,modelHash:await digest(fromHex(model.modelIdentity)),runHash:await digest(fromHex(result.runIdentity)),sourceSaveHash:await digest(fromHex(result.save)),probes,effects:structuredClone(result.effects),raw:result,scope:'Actual accepted BODY harness over original public EMB source inputs, under separately qualified current wrapper repair. Five component ownership candidates are not five public models. Diagnostic body is truth-side; Mediated and CachedEvidence remain evidence-mediated. Known zero, Unavailable and no motive ground are distinct. Exact sampled equality does not authorize general removal or confer production character-state authority.'};
}
