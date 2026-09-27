/** Canonical research identities; no native factory or writable authority registry. */
import {list,text,unsigned as u} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {data} from './biologyPublicData';
import {DISPOSITION_VERSION,checkedDisposition,createDispositionRun,type DispositionProfile,type DispositionFrame} from './dispositionAdaptation';
export async function dispositionIdentities(model:DispositionProfile,originals:readonly DispositionFrame[]){
 const {profile,frames}=checkedDisposition(model,originals),run=createDispositionRun(profile,frames);
 const modelIdentity=await createModelIdentity({rulesVersion:DISPOSITION_VERSION,contentSchemaVersion:DISPOSITION_VERSION,contentManifest:await commitManifest(data({source:'identity-public/0.1-candidate value grammar; disposition component18-instant source',direction:'opposed task fidelity',learningUnit:'1/1',probeUnit:'1/16',batch:4,step:'1/8',cap:'1/4',leakyTarget:'1/4',constitutionUnit:'1/8'})),parameterSchemaVersion:DISPOSITION_VERSION,parameterSet:await commitManifest(data(profile)),numericProfileVersion:'disposition-exact/0.1-candidate',randomAlgorithmVersion:'rng/disposition-input-seed-routed-sha256/0.1-candidate',registrySchemaVersion:DISPOSITION_VERSION,registryManifest:await commitManifest(list([text('Component, not native admission'),text('Sole component transition publishes journal and separate plastic field; constitution immutable'),text('Decision -> expression -> qualification -> update; before-state only')]))});
 const runIdentity=await createRunIdentity({modelIdentity,initialState:await commitManifest(run.snapshot()),orderedInputSequence:await commitManifest(data(frames)),runSeed:new Uint8Array(32)});
 return {modelIdentity,runIdentity};
}
