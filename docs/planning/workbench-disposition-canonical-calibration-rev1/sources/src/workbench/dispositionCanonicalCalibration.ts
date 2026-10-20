import type {CanonicalValue} from '../substrate/canonicalEncoding';
import type {TimelineEvent} from './contracts';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {equalCanonicalText} from './canonicalTextEquality';
import {dispositionCanonicalFactorSources} from './dispositionCanonicalFactorSources';
import {dispositionCalibrationFromFactors} from './dispositionCalibration';
/** Uses original recorded context and factor accounting; no full input/output formatting. */
export function dispositionCanonicalCalibration(event:Pick<TimelineEvent,'id'|'instant'|'phase'|'stage'>,input:CanonicalValue,output:CanonicalValue,reads:CanonicalValue,seamVersion:string){
 if(seamVersion!=='disposition-public/0.1-candidate')throw Error('Unqualified disposition calibration version');
 const factors=dispositionCanonicalFactorSources(event,output,reads);
 if(!factors.emitted)return dispositionCalibrationFromFactors(event,seamVersion,factors,false);
 const values=items(input,'list');if(values.length!==3||values[1]!==true)throw Error('Calibration context lineage mismatch');
 const context=rec(values[0],1429n),learning=f(context,6n),reason=rec(items(output,'list')[1],1430n);
 if(typeof learning!=='boolean'||!equalCanonicalText(context,f(reason,2n)))throw Error('Calibration context lineage mismatch');
 return dispositionCalibrationFromFactors(event,seamVersion,factors,learning);
}
