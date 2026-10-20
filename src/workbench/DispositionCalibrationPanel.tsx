import {DispositionCalibrationReportPanel} from './DispositionCalibrationReportPanel';
import {useMemo} from 'react';
import type {TimelineEvent} from './contracts';
import {dispositionCalibration} from './dispositionCalibration';
export function DispositionCalibrationPanel({event,seamVersion}:{event:TimelineEvent;seamVersion:string}){
 const result=useMemo(()=>{try{return {report:dispositionCalibration(event,seamVersion)};}catch(e){return {error:String(e)};}},[event,seamVersion]);
 return <DispositionCalibrationReportPanel report={result.report} error={result.error}/>;
}
