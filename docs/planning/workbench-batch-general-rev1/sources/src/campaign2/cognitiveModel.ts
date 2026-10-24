/** task-cognitive-model-profile/0.1-candidate.
 * Complete data-only declaration admission, not runtime activation or S0 admission. */
import freeze from '../../docs/planning/campaign2-task-cognitive-model/FREEZE.json';
import {canonicalEncode as enc,bytesToHex} from '../substrate/canonicalEncoding';
import {createModelIdentity,commitManifest} from '../substrate/identity';
import {snapshotMemorySource} from './memoryModel';
import {compileCognitiveDeclarations} from './cognitiveDeclarations';
import {compileCampaign2StateModel} from './stateModel';
import {decodeCognitive,cognitiveSchemaByType} from './cognitiveCodecs';
import {dataItems as items,invalidModel} from './canonicalData';
import type {Campaign2ModelSource} from './factory';

export async function compileCognitiveModel(input:Campaign2ModelSource){
 const source=snapshotMemorySource(input);
 if(source.rulesVersion!=='rules/campaign2-task-cognitive/0.1-candidate'||source.registrySchemaVersion!=='campaign2-task-cognitive-registry/0.1-candidate'||source.numericProfileVersion!=='numeric/task-cognitive-exact/0.1-candidate')invalidModel('exact cognitive receiving profile required');
 const registry=decodeCognitive(source.registry),slots=items(registry,'list');
 if(slots.length!==6)invalidModel('six cognitive registry slots required');
 const content=await compileCognitiveDeclarations(source.content,source.registry);
 const structuralState=compileCampaign2StateModel(enc(slots[2]),enc(slots[3]),enc(slots[4]),content,{decode:decodeCognitive,schema:cognitiveSchemaByType});
 // Compute from all supplied canonical bytes and versions. Never accept a caller's
 // claimed digest, recipe name, prepared handler or source capability instead.
 const modelIdentity=await createModelIdentity({...source,contentManifest:await commitManifest(decodeCognitive(source.content)),registryManifest:await commitManifest(registry),parameterSet:await commitManifest(decodeCognitive(source.parameters))});
 const member=freeze.models.find(m=>m.modelDigest===bytesToHex(modelIdentity.digest));
 if(!member)invalidModel('cognitive declaration image is outside the frozen cohort');
 return Object.freeze({source,modelIdentity,content,structuralState,recipe:member.recipe,
  profiles:Object.freeze({...freeze.profiles}),semanticBundle:Object.freeze([...freeze.semanticBundle])});
}
