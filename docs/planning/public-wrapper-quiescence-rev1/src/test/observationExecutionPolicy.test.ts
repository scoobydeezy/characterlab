import {it,expect} from 'vitest';
import {typedIdentifier,text,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {bindObservationExecutionPolicy as bind,type ObservationExecutionPolicy} from '../campaign3/observationExecutionPolicy';
import type {ObservationUsePlan} from '../campaign3/generalSourceSchedule';
const id=(s:string)=>typedIdentifier(1027,text(s));
const use=():ObservationUsePlan=>({bodySelection:false,visualSelection:false,bodyCue:false,visualCue:false,goalAssessment:null});
const empty=():ObservationExecutionPolicy=>({bodySelection:null,visualSelection:null,spatial:null,encoding:null,bodyRecall:null,goalBaselineRecall:null,eventRecall:null,goalQualification:null});
const name=(x:TypedIdentifierValue)=>(x.payload as {value:string}).value;
const kind=(x:TypedIdentifierValue)=>({'select':'GeneralBodySelectionCalibration','cue':'GeneralBodyRecallCalibration','baseline':'GeneralBodyRecallCalibration','goal':'GeneralGoalQualificationCalibration','visual':'AttentionSelectionPolicy/519','spatial':'GeneralSpatialCalibration','encoding':'GeneralEncodingCalibration','event':'GeneralEventAccessCalibration'}[name(x)]??'unknown');
it('OEP-A: sensing alone binds no cognitive policy or resolver call',()=>{let calls=0;expect(bind(use(),empty(),()=>{calls++;return ''; })).toEqual(empty());expect(calls).toBe(0);});
it('OEP-B: acquisition and current cue have independent required slots',()=>{
 for(const selected of [false,true])for(const cued of [false,true]){const p={...empty(),bodySelection:selected?id('select'):null,bodyRecall:cued?id('cue'):null};expect(bind({...use(),bodySelection:selected,bodyCue:cued},p,kind)).toEqual(p);}
 expect(()=>bind({...use(),bodyCue:true},{...empty(),bodySelection:id('select')},kind)).toThrow();
});
it('OEP-C: baseline and ordinary recall resolve independently even when their definition kind matches',()=>{
 const p={...empty(),bodyRecall:id('cue'),goalBaselineRecall:id('baseline'),goalQualification:id('goal')};const seen:string[]=[];
 const r=bind({...use(),bodyCue:true,goalAssessment:'assessment/a'},p,x=>{seen.push(name(x));return kind(x);});expect(seen).toEqual(['cue','baseline','goal']);expect(name(r.bodyRecall!)).not.toBe(name(r.goalBaselineRecall!));
 expect(()=>bind({...use(),goalAssessment:'assessment/a'},{...p,bodyRecall:null,goalBaselineRecall:null},kind)).toThrow();
});
it('OEP-D: visual selection needs all three distinct definitions; cue-only needs only event access',()=>{
 const p={...empty(),visualSelection:id('visual'),spatial:id('spatial'),encoding:id('encoding')};expect(bind({...use(),visualSelection:true},p,kind)).toEqual(p);
 for(const slot of ['visualSelection','spatial','encoding'] as const)expect(()=>bind({...use(),visualSelection:true},{...p,[slot]:null},kind)).toThrow();
 expect(bind({...use(),visualCue:true},{...empty(),eventRecall:id('event')},kind).eventRecall).toEqual(id('event'));
});
it('OEP-E: wrong kind, identity namespace and unrelated extras reject',()=>{
 const u={...use(),bodyCue:true},p={...empty(),bodyRecall:id('cue')};expect(()=>bind(u,p,()=> 'GeneralBodySelectionCalibration')).toThrow();
 expect(()=>bind(u,{...p,bodyRecall:typedIdentifier(1143,text('cue'))},kind)).toThrow();expect(()=>bind(use(),p,kind)).toThrow();
 expect(()=>bind(u,{...p,truth:id('cue')} as ObservationExecutionPolicy,kind)).toThrow();
});
it('OEP-F: hostile descriptors fail before any lookup and results detach both caller and resolver',()=>{
 let calls=0;const p={...empty(),bodyRecall:id('cue')};Object.defineProperty(p,'encoding',{get(){calls++;return null;}});
 expect(()=>bind({...use(),bodyCue:true},p,()=>{calls++;return '';})).toThrow();expect(calls).toBe(0);
 const q={...empty(),bodyRecall:id('cue')};const r=bind({...use(),bodyCue:true},q,x=>{Object.assign(x.payload,{value:'changed'});return 'GeneralBodyRecallCalibration';});Object.assign(q.bodyRecall!.payload,{value:'caller-change'});expect(name(r.bodyRecall!)).toBe('cue');
});
