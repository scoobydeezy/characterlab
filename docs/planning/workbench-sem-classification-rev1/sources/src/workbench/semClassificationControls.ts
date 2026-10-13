import * as f from './semClassificationFixture';
import {classifyContinuant,PerceptualFeatureId,PerceptualFacetId,PerceptualClassificationContractError,assertClassificationEmissionTarget,type ClassificationEmissionTarget} from '../semanticBinding/perceptualClassification';
import {perceptualClassificationEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {MINA,GLEN,projectAllObservers} from '../test/fixtures/phenSem001';
import {list} from '../substrate/canonicalEncoding';
import {exactKey,exactText,fromHex,digest} from './canonical';
import {recognitionDiagnostic} from './semRecognitionControls';
export async function runSemClassificationControls(){
 const model=f.classificationModel(),cases=[];
 const positive=f.request([f.feature(PerceptualFeatureId.ObservedMetallicSurface,true,1n)]);
 const requests=[['metallic-true',positive],['metallic-false',f.request([f.feature(PerceptualFeatureId.ObservedMetallicSurface,false,1n)])],['metallic-missing',f.request([f.feature(PerceptualFeatureId.ObservedPersonForm,true,1n)])]] as const;
 for(const [id,request] of requests){const before=recognitionDiagnostic(request),r=classifyContinuant(model,request,0n);if(recognitionDiagnostic(request)!==before)throw Error('Classification changed request');const value=list(r.classifications.map(perceptualClassificationEvidenceValue)),canonicalHex=exactKey(value);cases.push({id,request:before,facets:r.classifications.map(c=>({facet:c.perceptualFacetId,value:c.typedPerceivedValue})),canonicalHex,sha256:await digest(fromHex(canonicalHex)),exact:exactText(value)});}
 const reject=(run:()=>unknown)=>{try{run();}catch(error){if(!(error instanceof PerceptualClassificationContractError))throw error;return {code:error.code,message:error.message};}throw Error('Expected classification rejection');};
 const negatives=[
 {id:'unknown-facet',failure:reject(()=>classifyContinuant({...model,facetDefinitions:[...model.facetDefinitions,{perceptualFacetId:'perceptual-facet/appears-friendly' as PerceptualFacetId,perceivedValueType:'boolean',observationDomainValidatorId:'validator/boolean',definitionVersion:'facet/0.1-candidate'}]},positive,0n))},
 {id:'unknown-feature',failure:reject(()=>classifyContinuant(model,f.request([f.feature('perceptual-feature/looks-friendly' as PerceptualFeatureId,true,1n)]),0n))},
 {id:'wrong-value-type',failure:reject(()=>classifyContinuant(model,f.request([{...f.feature(PerceptualFeatureId.ObservedMetallicSurface,true,1n),booleanValue:'yes' as never}]),0n))},
 ];
 assertClassificationEmissionTarget('semantic-experience-assembly');
 const targets:readonly ClassificationEmissionTarget[]=['recognition-hypothesis','appraisal','affect','motive','pressure','reason','identity','relationship','world-truth'];
 const emissions=[{target:'semantic-experience-assembly',accepted:true,failure:null as {code:string;message:string}|null},...targets.map(target=>({target,accepted:false,failure:reject(()=>assertClassificationEmissionTarget(target))}))];
 const projections=projectAllObservers(),shapes=[];
 for(const observer of [MINA,GLEN]){const classifications=projections.get(observer)!.classifications,value=list(classifications.map(perceptualClassificationEvidenceValue));shapes.push({observer,fieldSets:classifications.map(c=>Object.keys(c).sort()),diagnostic:recognitionDiagnostic(classifications),canonicalHex:exactKey(value),exact:exactText(value)});}
 return {version:'sem-classification-controls/0.1',contract:'semantic-binding/0.1-candidate#SEM-001D',source:f.originalSource,cases,negatives,emissions,shapes,scope:'Original CV-SEM-017/018 component witnesses: Boolean true/false versus missing metallic classification, registered-domain/type rejection, emission boundaries and Mina/Glen field sets. Missing is not false. No recognition, appraisal, pressure, scheduler intervention or full SEM acceptance claim.'};
}
