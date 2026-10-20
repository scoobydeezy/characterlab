import type {CanonicalValue} from '../substrate/canonicalEncoding';
import type {TimelineEvent} from './contracts';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {readable} from './canonical';
import {equalCanonicalText} from './canonicalTextEquality';
import {dispositionCanonicalFactorSources} from './dispositionCanonicalFactorSources';
import {dispositionTaskSourcesFromOperands} from './dispositionTaskSources';
/** Project only task accounting operands; do not format the nested workspace history. */
export function dispositionCanonicalTaskSources(event:Pick<TimelineEvent,'id'|'instant'|'stage'|'phase'>,output:CanonicalValue,reads:CanonicalValue,seamVersion:string){
 if(seamVersion!=='disposition-public/0.1-candidate')throw Error('Unqualified task-source profile');
 const factors=dispositionCanonicalFactorSources(event,output,reads);
 if(!factors.emitted)return {version:'disposition-task-sources/0.1',seamVersion,eventId:event.id,instant:event.instant,emitted:false as const,rows:[],meanings:[]};
 const reasons=rec(items(output,'list')[1],1430n),raw=rec(f(reasons,4n),403n),options=rec(f(raw,2n),398n);
 if(!equalCanonicalText(options,f(reasons,3n)))throw Error('Task-source options lineage mismatch');
 const motive=rec(f(options,2n),394n),concern=rec(f(motive,2n),388n),appraisal=rec(f(concern,2n),384n),workspace=rec(f(appraisal,2n),381n),forecast=rec(f(workspace,5n),380n);
 const tag=readable(f(forecast,1n));if(tag!=='1'&&tag!=='2')throw Error('Unknown task forecast variant');
 const projectedForecast={record:'WorkspaceForecast#380/1','VariantTag [1]':tag,...(tag==='2'?{'PredictionValue [2]':{record:'MeasurementPrediction#361/1','EvidenceBasis [2]':readable(f(rec(f(forecast,2n),361n),2n))}}:{})};
 const projectedOptions={record:'TaskCandidateOptions#398/1','Candidates [3]':readable(f(options,3n)),'MotiveContext [2]':{record:'TaskMotiveContext#394/1','MotiveContextOccurrenceId [1]':readable(f(motive,1n)),'Motives [3]':readable(f(motive,3n)),'Concern [2]':{record:'TaskConcern#388/1','ConcernOccurrenceId [1]':readable(f(concern,1n)),'Responses [3]':readable(f(concern,3n)),'Appraisal [2]':{record:'TaskAppraisal#384/1','Workspace [2]':{record:'TaskWorkspace#381/1','Forecast [5]':projectedForecast}}}}};
 return dispositionTaskSourcesFromOperands(event,seamVersion,factors,{'NonIdentitySemanticPressure [4]':readable(f(raw,4n))},projectedOptions);
}
