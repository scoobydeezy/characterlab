import {useMemo} from 'react';
import type {DispositionSnapshot} from './dispositionAdapter';
import {dispositionArchitecture} from './dispositionArchitecture';
import {DispositionArchitectureReportPanel} from './DispositionArchitectureReportPanel';
export function DispositionArchitectureInspector({snapshot,onEvent}:{snapshot:DispositionSnapshot;onEvent:(id:string)=>void}){
 const result=useMemo(()=>{try{return {report:dispositionArchitecture(snapshot)};}catch(e){return {error:String(e)};}},[snapshot]);
 return <DispositionArchitectureReportPanel report={result.report} error={result.error} onEvent={onEvent}/>;
}
