/** general-source-schedule-component/0.1-candidate; compiled-data planning only. */
import {canonicalEncode,text} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import type {SourceSamplingRequest} from './requestedSourceSampling';
export interface ObservationUsePlan {readonly bodySelection:boolean;readonly visualSelection:boolean;readonly bodyCue:boolean;readonly visualCue:boolean;readonly goalAssessment:string|null}
export interface PlannedObservation {readonly at:bigint;readonly lane:'Current'|'Consequence';readonly request:SourceSamplingRequest;readonly use:ObservationUsePlan}
export interface SourceScheduleDomain {readonly initialClock:bigint;readonly horizon:bigint;readonly channels:readonly string[];readonly assessmentDefinitions:readonly string[];readonly lifecycleInstants:readonly bigint[]}
function fail():never{throw Error('GENERAL_SOURCE_SCHEDULE');}
function exact(value:unknown,names:readonly string[]){if(!value||typeof value!=='object'||Object.getPrototypeOf(value)!==Object.prototype)fail();const d=Object.getOwnPropertyDescriptors(value);if(Reflect.ownKeys(d).length!==names.length||names.some(k=>!d[k]||!('value'in d[k])))fail();}
function dense(value:unknown,max:number):asserts value is readonly unknown[]{if(!Array.isArray(value)||Object.getPrototypeOf(value)!==Array.prototype||value.length>max)fail();const d=Object.getOwnPropertyDescriptors(value);if(Reflect.ownKeys(d).length!==value.length+1||Object.values(d).some(p=>!('value'in p))||Array.from({length:value.length},(_,i)=>!d[String(i)]).some(Boolean))fail();}
function symbol(value:unknown):asserts value is string{if(typeof value!=='string'||!value||value!==value.normalize('NFC')||new TextEncoder().encode(value).length>64)fail();canonicalEncode(text(value));}
function uniqueSymbols(values:readonly string[],max:number){dense(values,max);const seen=new Set<string>();for(const v of values){symbol(v);if(seen.has(v))fail();seen.add(v);}return seen;}
/** Counts all planned selections before observing eligibility; never invokes a source. */
export function validateGeneralSourceSchedule(originals:readonly PlannedObservation[],domain:SourceScheduleDomain){
 exact(domain,['initialClock','horizon','channels','assessmentDefinitions','lifecycleInstants']);simInstant(domain.initialClock);simInstant(domain.horizon);if(domain.initialClock<0n||domain.horizon<=domain.initialClock)fail();
 const channels=uniqueSymbols(domain.channels,9),assessments=uniqueSymbols(domain.assessmentDefinitions,16);dense(domain.lifecycleInstants,32);const lifecycle=new Set<bigint>();
 for(const at of domain.lifecycleInstants){simInstant(at);if(at<=domain.initialClock||at>domain.horizon||lifecycle.has(at))fail();lifecycle.add(at);}
 dense(originals,32);let prior=domain.initialClock,visual=0,panel=0,selections=0;
 const entries=originals.map(original=>{
  exact(original,['at','lane','request','use']);simInstant(original.at);if(original.at<=prior||original.at>domain.horizon||!['Current','Consequence'].includes(original.lane))fail();prior=original.at;
  const r=original.request,u=original.use;exact(r,['bodyChannels','panel','visual']);exact(u,['bodySelection','visualSelection','bodyCue','visualCue','goalAssessment']);
  if([r.panel,r.visual,u.bodySelection,u.visualSelection,u.bodyCue,u.visualCue].some(v=>typeof v!=='boolean'))fail();
  let requested:readonly string[]|null=null;
  if(r.bodyChannels!==null){const selected=uniqueSymbols(r.bodyChannels,9);if(!selected.size||[...selected].some(c=>!channels.has(c)))fail();requested=Object.freeze([...r.bodyChannels]);}
  if(requested===null&&!r.panel&&!r.visual)fail();
  if((u.bodySelection||u.bodyCue)&&requested===null||(u.visualSelection||u.visualCue)&&!r.visual)fail();
  if(u.goalAssessment!==null){symbol(u.goalAssessment);if(!assessments.has(u.goalAssessment)||original.lane!=='Consequence'||requested===null||lifecycle.has(original.at))fail();}
  if(r.visual)visual++;if(r.panel)panel++;selections+=Number(u.bodySelection)+Number(u.visualSelection);
  return Object.freeze({at:original.at,lane:original.lane,request:Object.freeze({bodyChannels:requested,panel:r.panel,visual:r.visual}),use:Object.freeze({...u})});
 });
 if(visual>10||panel>16||selections>32)fail();
 return Object.freeze({entries:Object.freeze(entries),observations:entries.length,visualSweeps:visual,panelSweeps:panel,qualifiedSelectionSlots:selections});
}
