/** Explicit internal clock domain. Public model admission remains separately versioned. */
import {invalidModel} from '../campaign2/canonicalData';
export const LEGACY_TIME_LIMIT=100n,EXTENDED_TIME_LIMIT=1000000n;
export type TimeLimit=typeof LEGACY_TIME_LIMIT|typeof EXTENDED_TIME_LIMIT;
export function assertTimeLimit(limit:TimeLimit){if(limit!==LEGACY_TIME_LIMIT&&limit!==EXTENDED_TIME_LIMIT)invalidModel('unsupported explicit time domain');}
export function timeDomainVersion(legacy:string,limit:TimeLimit){assertTimeLimit(limit);return limit===LEGACY_TIME_LIMIT?legacy:legacy+'+time-domain/0.1-candidate';}
