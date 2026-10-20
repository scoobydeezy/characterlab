import {useMemo} from 'react';
import type {TimelineEvent} from './contracts';
import {dispositionResolution} from './dispositionResolution';
import {DispositionResolutionReportPanel} from './DispositionResolutionReportPanel';
export function DispositionResolutionPanel({events,event,seamVersion,onEvent}:{events:readonly TimelineEvent[];event:string;seamVersion:string;onEvent:(id:string)=>void}){
 const result=useMemo(()=>{try{return {report:dispositionResolution(events,event,seamVersion)};}catch(e){return {error:String(e)};}},[events,event,seamVersion]);
 return <DispositionResolutionReportPanel report={result.report} error={result.error} onEvent={onEvent}/>;
}
