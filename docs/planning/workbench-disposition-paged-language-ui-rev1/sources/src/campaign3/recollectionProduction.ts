/** recollection-production/0.1-candidate; PRJ/IDN subject and source/read admission remain upstream. */
import {canonicalEncode,text,typedIdentifier} from '../substrate/canonicalEncoding';
import {recallCanonicalEventAcquisitions,type CanonicalEventRecallInput} from './canonicalEventRecall';
import {recallBodyByAcquisitionRecency,type BodyRecallCue} from './bodyRecall';
export interface RecollectionSubject {readonly observer:string;readonly character:string}
export interface RecollectionView {readonly opaque:'recollection-production-view'}
type EventWinner=ReturnType<typeof recallCanonicalEventAcquisitions>['recalled'][number];
type BodyWinner=ReturnType<typeof recallBodyByAcquisitionRecency>['recalled'][number];
type Content={readonly kind:'EventContinuant';readonly winner:EventWinner}|{readonly kind:'Interoceptive';readonly winner:BodyWinner};
interface Stored {readonly kind:Content['kind'];readonly subject:RecollectionSubject;readonly at:bigint;readonly contents:readonly Content[]}
const views=new WeakMap<object,Stored>();
type PresentationBatch={readonly observer:string;readonly character:string;readonly at:bigint;readonly presentations:readonly {readonly recollection:bigint;readonly acquisition:bigint}[]};
const published=new WeakMap<object,PresentationBatch|null>();
function subjectCopy(subject:RecollectionSubject,at:bigint){
 if(typeof at!=='bigint'||at<0n||typeof subject.observer!=='string'||!subject.observer||typeof subject.character!=='string'||!subject.character)throw Error('RECOLLECTION_SUBJECT');
 canonicalEncode(typedIdentifier(1000,text(subject.observer)));canonicalEncode(typedIdentifier(1002,text(subject.character)));
 return {observer:subject.observer,character:subject.character};
}
function stage(subject:RecollectionSubject,at:bigint,contents:readonly Content[],kind:Content['kind']):RecollectionView{
 const token=Object.freeze({opaque:'recollection-production-view' as const});views.set(token,{kind,subject:{...subject},at,contents:structuredClone(contents)});return token;
}
type EventRead=Pick<CanonicalEventRecallInput,'memory'|'graph'|'presentations'>;
function cueShape(cue:unknown,presentField:string){
 if(!cue||Object.getPrototypeOf(cue)!==Object.prototype)throw Error('RECOLLECTION_CUE');const d=Object.getOwnPropertyDescriptors(cue);
 if(!d.kind||!('value'in d.kind)||!['Absent','Present'].includes(d.kind.value))throw Error('RECOLLECTION_CUE');
 const keys=d.kind.value==='Absent'?['kind']:['kind',presentField];if(Reflect.ownKeys(d).length!==keys.length||keys.some(k=>!d[k]||!('value'in d[k])))throw Error('RECOLLECTION_CUE');
}
export function prepareEventRecollections(subject:RecollectionSubject,cue:CanonicalEventRecallInput['cue'],at:bigint,calibration:CanonicalEventRecallInput['calibration'],read:()=>EventRead){
 const holder=subjectCopy(subject,at);
 cueShape(cue,'key');if(cue.kind==='Present')canonicalEncode(cue.key);
 recallCanonicalEventAcquisitions({cue:{kind:'Absent'},now:at,calibration,memory:[],graph:{keys:[],weights:[]},presentations:new Map()});
 // Unavailable cue still validates the math configuration, without acquiring state.
 const operands=cue.kind==='Absent'?{memory:[],graph:{keys:[],weights:[]},presentations:new Map()}:read();
 const evaluation=recallCanonicalEventAcquisitions({...operands,cue,now:at,calibration});
 return {evaluation,view:stage(holder,at,evaluation.recalled.map(winner=>({kind:'EventContinuant' as const,winner})),'EventContinuant')};
}
export function prepareBodyRecollections(subject:RecollectionSubject,cue:BodyRecallCue,at:bigint,slots:number,read:()=>Parameters<typeof recallBodyByAcquisitionRecency>[0]){
 const holder=subjectCopy(subject,at);cueShape(cue,'signals');
 if(cue.kind==='Present'){if(!Array.isArray(cue.signals)||Object.values(Object.getOwnPropertyDescriptors(cue.signals)).some(d=>!('value'in d)))throw Error('RECOLLECTION_CUE');}
 const empty=recallBodyByAcquisitionRecency([],cue,at,slots),evaluation=cue.kind==='Absent'?empty:recallBodyByAcquisitionRecency(read(),cue,at,slots);
 return {evaluation,view:stage(holder,at,evaluation.recalled.map(winner=>({kind:'Interoceptive' as const,winner})),'Interoceptive')};
}
export function publishRecollections(view:RecollectionView,allocate:()=>bigint){
 const stored=views.get(view);if(!stored)throw Error('RECOLLECTION_VIEW');views.delete(view);
 const seen=new Set<bigint>();
 const recollections=stored.contents.map(content=>{const occurrence=allocate();if(typeof occurrence!=='bigint'||occurrence<0n||seen.has(occurrence))throw Error('RECOLLECTION_ALLOCATION');seen.add(occurrence);return {occurrence,subject:stored.subject.character,at:stored.at,content:structuredClone(content)};});
 const result={observer:stored.subject.observer,recollections};
 published.set(result,stored.kind!=='EventContinuant'?null:{observer:stored.subject.observer,character:stored.subject.character,at:stored.at,presentations:recollections.map(r=>({recollection:r.occurrence,acquisition:r.content.winner.id}))});
 return result;
}
export const closeRecollections=(view:RecollectionView)=>{views.delete(view);};
/** Explicit later component handoff, never automatically invoked by rank/publication. */
export function takeEventPresentation(publication:ReturnType<typeof publishRecollections>):PresentationBatch{
 const batch=published.get(publication);if(batch===undefined)throw Error('RECOLLECTION_PRESENTATION_VIEW');published.delete(publication);if(batch===null)throw Error('RECOLLECTION_PRESENTATION_BODY');return structuredClone(batch);
}
