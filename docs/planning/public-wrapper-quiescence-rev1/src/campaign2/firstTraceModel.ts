/** Frozen first canonical Campaign-2 model; old declarations remain immutable. */
import {firstModelCandidate} from './firstModelCandidate';
import {TRACE_RULES} from './traceBinding';
export function firstTraceModel(){return {...firstModelCandidate(),rulesVersion:TRACE_RULES};}
