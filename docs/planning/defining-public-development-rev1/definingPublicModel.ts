/** defining-public/0.1-candidate. Closed recipe; learned state is never caller supplied. */
import {canonicalEncode as enc,canonicalDecode,list,text,unsigned as u,signed,RecordSchemaRegistry} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {dataItems as items,dataText as txt,dataUnsigned as uint} from '../campaign2/canonicalData';
import {copyData} from './biologyPublicBytes';
import {admitDefiningContinuationProgram as admit,definingContinuationSpec as specOf} from './definingContinuationProgram';
import type {MeaningSpec} from './definingMeaning';
import {createDefiningRehearsalModel} from './definingRehearsalModel';
import {definingRehearsalSupportedSchemas} from './definingRehearsalCodecs';
import {compileGeneralModelCandidate,generalCandidateVersions} from './generalModelCandidate';
import {buildGeneralDeclarationPacket} from './generalDeclarations';
import {createDefiningPublicRuntime} from './definingPublicRuntime';
export {copyData};
export const VERSION='defining-public/0.1-candidate';
const registry=new RecordSchemaRegistry(definingRehearsalSupportedSchemas());
/** Structural decoding only. A save obtains authority solely by full original replay equality. */
export const parseDefiningPublic=(bytes:Uint8Array)=>canonicalDecode(bytes,registry);
export const equalBytes=(a:Uint8Array,b:Uint8Array)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
export function definingPublicRecipe(input:MeaningSpec){
 const s=specOf(admit(input));return {parameters:enc(list([text(VERSION),text(s.law),text(s.goal),u(s.rehearsals),u(s.capacity),signed(s.now),text(s.cue),text(s.report),u(s.worldAfter)]))};
}
export type DefiningPublicSource=ReturnType<typeof definingPublicRecipe>;
export async function compileDefiningPublicModel(input:DefiningPublicSource){
 const source=copyData(input,['parameters']),v=items(canonicalDecode(source.parameters),'list');
 if(v.length!==9||txt(v[0])!==VERSION||typeof v[5]==='boolean'||v[5].kind!=='signed')throw Error('DEFINING_PUBLIC_RECIPE');
 const spec={law:txt(v[1]),goal:txt(v[2]),rehearsals:Number(uint(v[3])),capacity:Number(uint(v[4])),now:Number(v[5].value),cue:txt(v[6]),report:txt(v[7]),worldAfter:Number(uint(v[8]))} as MeaningSpec;
 const program=admit(spec);if(!equalBytes(source.parameters,definingPublicRecipe(spec).parameters))throw Error('DEFINING_PUBLIC_EXACT_RECIPE');
 const native=await createDefiningRehearsalModel(program);
 const modelIdentity=await createModelIdentity({...generalCandidateVersions,rulesVersion:VERSION,
  contentManifest:await commitManifest(list([text(VERSION),native.modelIdentity.value])),
  registryManifest:await commitManifest(list([text('unchanged defining-native-rehearsal/0.1-candidate handlers; Save132; original-prefix replay; guarded publication'),native.modelIdentity.value])),
  parameterSet:await commitManifest(list([canonicalDecode(source.parameters),text('fixed zero32 seed; anchors root649; empty random addresses; observer view recollections and projected judgments only')]))});
 return Object.freeze({program,modelIdentity,initialState:native.initialState.slice(),originals:native.originals.slice()});
}
export type DefiningPublicCompiled=Awaited<ReturnType<typeof compileDefiningPublicModel>>;
export async function createDefiningPublicExecution(model:DefiningPublicCompiled,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const original=copyData(input,['initialState','orderedInputs','runSeed']);
 if(!equalBytes(original.initialState,model.initialState)||!equalBytes(original.orderedInputs,model.originals))throw Error('DEFINING_PUBLIC_ORIGINALS');
 if(original.runSeed.length!==32||original.runSeed.some(b=>b!==0))throw Error('DEFINING_PUBLIC_ZERO_SEED');
 const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(parseDefiningPublic(original.initialState)),orderedInputSequence:await commitManifest(parseDefiningPublic(original.orderedInputs)),runSeed:original.runSeed});
 // Each run owns fresh protocol/slot capabilities; no live compiler instance is shared.
 const base=await compileGeneralModelCandidate(buildGeneralDeclarationPacket('credit-significance-first'));
 const runtime=createDefiningPublicRuntime(base.model,model.program,{model:model.modelIdentity,run:runIdentity});
 return {runtime,runIdentity};
}
