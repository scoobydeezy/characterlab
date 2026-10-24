/** observation-execution-policy-binding/0.1-candidate; governed schema/value admission remains upstream. */
import {canonicalEncode,text,typedIdentifier,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import type {ObservationUsePlan} from './generalSourceSchedule';

const kinds={bodySelection:'GeneralBodySelectionCalibration',visualSelection:'AttentionSelectionPolicy/519',spatial:'GeneralSpatialCalibration',encoding:'GeneralEncodingCalibration',bodyRecall:'GeneralBodyRecallCalibration',goalBaselineRecall:'GeneralBodyRecallCalibration',eventRecall:'GeneralEventAccessCalibration',goalQualification:'GeneralGoalQualificationCalibration'} as const;
type Slot=keyof typeof kinds;
export type ObservationExecutionPolicy=Readonly<Record<Slot,TypedIdentifierValue|null>>;
function fail():never{throw Error('OBSERVATION_EXECUTION_POLICY');}
function exact(value:unknown,keys:readonly string[]){
 if(!value||Object.getPrototypeOf(value)!==Object.prototype)fail();
 const d=Object.getOwnPropertyDescriptors(value);
 if(Reflect.ownKeys(d).length!==keys.length||keys.some(k=>!d[k]||!('value'in d[k])))fail();
}
function copyId(id:TypedIdentifierValue){
 exact(id,['kind','namespaceId','payload']);
 if(id.kind!=='typedIdentifier'||id.namespaceId!==1027n)fail();
 exact(id.payload,['kind','value']);
 if(typeof id.payload!=='object'||id.payload.kind!=='text'||!id.payload.value)fail();
 canonicalEncode(id);
 return typedIdentifier(1027,text(id.payload.value));
}
/** Resolve only immutable model definitions. No source, clock, memory or capacity is read here. */
export function bindObservationExecutionPolicy(use:ObservationUsePlan,policy:ObservationExecutionPolicy,resolveKind:(id:TypedIdentifierValue)=>string){
 exact(use,['bodySelection','visualSelection','bodyCue','visualCue','goalAssessment']);
 if([use.bodySelection,use.visualSelection,use.bodyCue,use.visualCue].some(x=>typeof x!=='boolean'))fail();
 if(use.goalAssessment!==null){if(typeof use.goalAssessment!=='string'||!use.goalAssessment)fail();canonicalEncode(text(use.goalAssessment));}
 exact(policy,Object.keys(kinds));
 const required:Record<Slot,boolean>={bodySelection:use.bodySelection,visualSelection:use.visualSelection,spatial:use.visualSelection,encoding:use.visualSelection,bodyRecall:use.bodyCue,goalBaselineRecall:use.goalAssessment!==null,eventRecall:use.visualCue,goalQualification:use.goalAssessment!==null};
 // Validate all shapes before invoking even the trusted model resolver.
 const slots=Object.keys(kinds) as Slot[],copies={} as Record<Slot,TypedIdentifierValue|null>;
 for(const slot of slots){const id=policy[slot];if((id!==null)!==required[slot])fail();copies[slot]=id===null?null:copyId(id);}
 for(const slot of slots){const id=copies[slot];if(id!==null&&resolveKind(copyId(id))!==kinds[slot])fail();}
 return Object.freeze(copies);
}
