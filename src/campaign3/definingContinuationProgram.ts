/** defining-continuation-inputs/0.1-candidate. Internal typed source plan, not public admission. */
import {canonicalEncode as enc,list,text,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {definingLaws} from './definingMemoryExperiment';
import type {MeaningSpec} from './definingMeaning';
export const definingContinuationVersion='defining-continuation-inputs/0.1-candidate';
export type DefiningContinuationStage='adopt'|'historical'|'significance'|'event-rank'|'body-rank'|'publish'|'attribute'|'use'|'presentations'|'retain'|'world'|'report'|'current'|'final-rank'|'final-publish'|'final-presentations';
export interface DefiningContinuationEvent {readonly at:bigint;readonly phase:bigint;readonly stage:DefiningContinuationStage}
export interface DefiningContinuationProgram {readonly kind:'DefiningContinuationProgram'}
const programs=new WeakMap<DefiningContinuationProgram,Readonly<MeaningSpec>>();
const fields=['law','goal','rehearsals','capacity','now','cue','report','worldAfter'] as const;
const domains=[definingLaws,['High','Low','Wide','Absent'],[0,3],[0,1,8],[50,400,4000],['matching','absent'],['original','contrary','missing'],[20,30]] as const;
/** Strict plain data only: no inherited fields, getters, extra instructions, or numeric coercion. */
export function admitDefiningContinuationProgram(input:unknown):DefiningContinuationProgram {
 if(!input||typeof input!=='object'||Object.getPrototypeOf(input)!==Object.prototype||Reflect.ownKeys(input).length!==fields.length)throw Error('DEFINING_PROGRAM_SHAPE');
 const spec={} as MeaningSpec;
 for(let i=0;i<fields.length;i++){
  const name=fields[i],descriptor=Object.getOwnPropertyDescriptor(input,name);
  if(!descriptor||!('value' in descriptor)||!(domains[i] as readonly unknown[]).includes(descriptor.value))throw Error('DEFINING_PROGRAM_DOMAIN');
  Object.defineProperty(spec,name,{value:descriptor.value,enumerable:true});
 }
 const token=Object.freeze({kind:'DefiningContinuationProgram' as const});programs.set(token,Object.freeze(spec));return token;
}
export function definingContinuationSpec(program:DefiningContinuationProgram):Readonly<MeaningSpec>{const spec=programs.get(program);if(!spec)throw Error('DEFINING_PROGRAM_NOT_ADMITTED');return spec;}
/** Observer-side source projection contains neither diagnostic truth nor retention controls. */
export function definingInterpretationInputs(program:DefiningContinuationProgram){const spec=definingContinuationSpec(program);return Object.freeze({goal:spec.goal,report:spec.report});}
/** Plan phases are handler requirements, not proof that a native handler exists. */
export function definingContinuationCalendar(program:DefiningContinuationProgram):readonly DefiningContinuationEvent[]{
 const spec=definingContinuationSpec(program),events:DefiningContinuationEvent[]=[];
 const add=(at:bigint,phase:bigint,stage:DefiningContinuationStage)=>events.push(Object.freeze({at,phase,stage}));
 add(37n,140n,'adopt');add(38n,130n,'historical');add(38n,140n,'significance');
 for(let i=0;i<spec.rehearsals;i++){const at=39n+BigInt(i);for(const stage of ['event-rank','body-rank','publish'] as const)add(at,40n,stage);add(at,130n,'attribute');add(at,140n,'use');add(at,140n,'presentations');}
 add(42n,140n,'retain');add(43n,0n,'world');add(43n,120n,'report');add(43n,130n,'current');
 add(BigInt(spec.now),40n,'final-rank');add(BigInt(spec.now),40n,'final-publish');add(BigInt(spec.now),140n,'final-presentations');
 return Object.freeze(events);
}
export function definingContinuationParameterValue(program:DefiningContinuationProgram):CanonicalValue {
 const s=definingContinuationSpec(program);return list([text(definingContinuationVersion),text(s.law),text(s.goal),u(s.rehearsals),u(s.capacity),signed(s.now),text(s.cue),text(s.report),u(s.worldAfter),text('interpretation-goal/adopt37-active38-expires5001'),text('preserve inherited goal/task deadlines; settle final presentations')]);
}
export function definingContinuationProgramBytes(program:DefiningContinuationProgram):Uint8Array{return enc(list([definingContinuationParameterValue(program),list(definingContinuationCalendar(program).map(e=>list([signed(e.at),u(e.phase),text(e.stage)])))]));}
/** Only these old credit originals are superseded; deadlines remain within the horizon. */
export function definingAdmitsInheritedEvent(program:DefiningContinuationProgram,stage:string,at:bigint):boolean {
 const spec=definingContinuationSpec(program);if(typeof at!=='bigint'||at<0n)throw Error('DEFINING_PROGRAM_TIME');
 if(at<=37n)return true;
 if(stage==='goal-deadline-owner'||stage==='event/task-deadline')return at<=BigInt(spec.now);
 return false;
}
