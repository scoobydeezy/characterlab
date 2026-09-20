/** Existing SEM-001A/C owner reads beneath the GA tracking registrations.
 * Reconstruct from bounded counter-addressed membership reads, never a state scan.
 * This internal adapter requires a source-authenticated admitted observer. */
import {canonicalEncode as enc,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,patternMatches,type StatePath,type ActualReadRecord} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataIdentity as identity,dataText as txt,dataUnsigned as uint,dataKey as key,invalidModel as fail} from '../campaign2/canonicalData';
import {generalRecord as r,generalSubject,generalId as id,generalStagePaths} from './generalBindingProfile';
import {clonePerceptualContinuantFileState} from '../semanticBinding/perceptualContinuantFiles';
import {clonePerceptualEventFileState} from '../semanticBinding/perceptualEventFiles';

export function compileGeneralSemanticReads(validateLeaf:(path:StatePath,value:CanonicalValue)=>void){
 const who=generalSubject(),observerId=txt(identity(who.observer).payload);
 return Object.freeze({
  construct(state:AuthoritativeState,stage:'current-track'|'consequence-track',observer:CanonicalValue,requested:{continuants:boolean;events:boolean}){
   enc(observer);if(key(observer)!==key(who.observer))fail('GA SEM observer');
   if(stage!=='current-track'&&stage!=='consequence-track')fail('GA SEM consumer');
   if(typeof requested.continuants!=='boolean'||typeof requested.events!=='boolean')fail('GA SEM requested families');
   const domain=generalStagePaths(stage).reads,reads:ActualReadRecord[]=[];
   function family(root:bigint,type:bigint,limit:bigint,prefix:string){
    const read=(field:bigint,k:CanonicalValue,member:string)=>{
     const path:StatePath={rootStateTypeId:root,fieldId:field,selectors:[{kind:'mapKey',key:k}]};
     if(!domain.some(d=>patternMatches(d,path)))fail('GA SEM read outside registration');
     const result=state.read(path);if(result.presence)validateLeaf(path,result.value!);
     reads.push({accessorId:id(1028,'accessor/attention-'+prefix+'-'+member),path,presence:result.presence,value:result.value,derivedSources:[]});return result;
    };
    const counter=read(1n,who.observer,'counter'),next=counter.presence?uint(counter.value!):0n;
    if(next>limit)fail('GA SEM counter beyond component bound');
    const active:bigint[]=[];for(let ordinal=0n;ordinal<next;ordinal++)if(read(2n,r(Number(type),[who.observer,u(ordinal)]),'active').presence)active.push(ordinal);
    return {next,counterPresent:counter.presence,active};
   }
   const c=requested.continuants?family(241n,212n,30n,'continuant'):undefined;
   const e=requested.events?family(242n,213n,26n,'event'):undefined;
   const continuants=c?clonePerceptualContinuantFileState({nextTrackSequenceByObserver:new Map(c.counterPresent?[[observerId,c.next]]:[]),activePerceptualReferentIds:c.active.map(observerTrackSequence=>({observerId,observerTrackSequence}))}):undefined;
   const events=e?clonePerceptualEventFileState({nextEventSequenceByObserver:new Map(e.counterPresent?[[observerId,e.next]]:[]),activeEventFiles:e.active.map(observerEventSequence=>({observerId,observerEventSequence}))}):undefined;
   return Object.freeze({continuants:()=>continuants?clonePerceptualContinuantFileState(continuants):undefined,events:()=>events?clonePerceptualEventFileState(events):undefined,actualReadRecords:()=>structuredClone(reads)});
  },
 });
}
