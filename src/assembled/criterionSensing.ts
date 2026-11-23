/** M234 version-bound sensor apparatus; original truth and production protocol stay intact. */
import {record,text,rational,canonicalEncode as enc,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {SchedulerContractError} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataText as txt} from '../campaign2/canonicalData';
import {INTAKE_EVENT,INTAKE_TRANSITION} from '../campaign2/measurementModel';
import {decodeCognitive} from './codecs';
import type {compilePredictionModel} from '../campaign2/predictionModel';
export const CRITERION_VERSION='assembled-criterion-sensing/0.1';
export const LEGACY_PROBE_VERSION='regulatory-diagnostic-probe/0.1-candidate';
const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','criterion sensor: '+s);};
export function replaceCriterionField(value:CanonicalValue,field:bigint,next:CanonicalValue){if(typeof value==='boolean'||value.kind!=='record')return fail('record required');return record(value.schema,new Map([...value.fields].map(([k,v])=>[k,k===field?next:v])));}
export function criterionSource(payload:CanonicalValue){
 if(typeof payload!=='boolean'&&payload.kind==='record'){rec(payload,333n);return {cue:payload,bias:0n};}
 const a=items(payload,'list');if(a.length!==3||key(a[0])!==key(text(CRITERION_VERSION))||typeof a[2]==='boolean'||a[2].kind!=='signed'||a[2].value< -100n||a[2].value>100n)fail('source requires tag, cue and signed bias -100..100');
 rec(a[1],333n);return {cue:a[1],bias:(a[2] as Extract<CanonicalValue,{kind:'signed'}>).value};
}
export function criterionInteger(truth:bigint,bias:bigint){if(truth<0n||truth>100n||bias< -100n||bias>100n)fail('integer domain');const n=truth+bias;return n<0n?0n:n>100n?100n:n;}
export function legacyCriterionObservation(value:CanonicalValue){const o=rec(value,203n);if(txt(f(o,11n))!==CRITERION_VERSION)fail('producer version');return replaceCriterionField(o,11n,text(LEGACY_PROBE_VERSION));}
type Base=Awaited<ReturnType<typeof compilePredictionModel>>['base'];
export function compileCriterionBase(base:Base):Base{
 const v=rec(base.probe.variableDefinition,280n);if(key(f(v,1n))!==key({kind:'unsigned',value:10n})||key(f(v,2n))!==key({kind:'signed',value:0n})||key(f(v,3n))!==key({kind:'signed',value:100n}))fail('requires original scale10 domain0..100');
 const validateInput=(value:CanonicalValue)=>base.measurement.validateInput(legacyCriterionObservation(value));
 const validateOutput=(value:CanonicalValue)=>{const c=rec(value,337n);validateInput(f(c,2n));base.measurement.validateOutput(replaceCriterionField(c,2n,legacyCriterionObservation(f(c,2n))));};
 const probe={...base.probe,begin(instant:bigint){const original=base.probe.begin(instant);let bias=0n;return {...original,execute(...args:Parameters<typeof original.execute>){const [event]=args;if(event.phase===110n)bias=criterionSource(event.payload).bias;const result=original.execute(...args);if(event.phase!==120n||!result.outputs.length)return result;
 const o=rec(result.outputs[0],203n),point=f(rec(f(o,6n),204n),2n);if(typeof point==='boolean'||point.kind!=='rational'||point.numerator*10n%point.denominator!==0n)fail('original exact point');
 const exact=point as Extract<CanonicalValue,{kind:'rational'}>,n=criterionInteger(exact.numerator*10n/exact.denominator,bias),q=rational(n,10n),interval=replaceCriterionField(replaceCriterionField(f(o,6n),2n,q),4n,q);
 return {...result,outputs:[replaceCriterionField(replaceCriterionField(o,6n,interval),11n,text(CRITERION_VERSION))]};}};}};
 const registration=rec(decodeCognitive(base.measurement.registration),341n),definition=rec(f(registration,3n),340n),input=rec(f(definition,1n),339n),producer=rec(f(input,2n),338n);
 const receiving=enc(replaceCriterionField(registration,3n,replaceCriterionField(definition,1n,replaceCriterionField(input,2n,replaceCriterionField(producer,2n,text(CRITERION_VERSION))))));
 const admission={...base.admission,registrations:()=>base.admission.registrations().map(r=>r.transitionKey===key(INTAKE_TRANSITION)?{...r,registration:receiving.slice()}:r),registrationForEvent:(event:CanonicalValue)=>key(event)===key(INTAKE_EVENT)?receiving.slice():base.admission.registrationForEvent(event),validateOutputs(transition:CanonicalValue,outputs:readonly Uint8Array[]){if(key(transition)!==key(INTAKE_TRANSITION))return base.admission.validateOutputs(transition,outputs);if(outputs.length!==1)fail('carriage output count');const value=decodeCognitive(outputs[0]);validateOutput(value);return [value];}};
 return {...base,probe,measurement:{...base.measurement,registration:receiving,validateInput,validateOutput},admission};
}
/** Validation-only compatibility view. Never installed or emitted as state. */
export function legacyCriterionMemory(state:AuthoritativeState,validate:(v:CanonicalValue)=>void){return new AuthoritativeState(state.entries().map(e=>{
 if(e.path.rootStateTypeId!==346n||e.path.fieldId!==1n)return e;
 const episode=rec(e.value,345n),evidence=rec(f(episode,1n),342n),carried=rec(f(evidence,2n),337n);validate(carried);
 return {...e,value:replaceCriterionField(episode,1n,replaceCriterionField(evidence,2n,replaceCriterionField(carried,2n,legacyCriterionObservation(f(carried,2n)))))};
}));}
