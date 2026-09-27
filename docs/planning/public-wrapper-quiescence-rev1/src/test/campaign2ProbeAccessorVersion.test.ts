import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,set} from '../substrate/canonicalEncoding';
import {probeModelReviewSource,compileProbeModelReview} from '../campaign2/probeModelReview';
import {probeSuccessorReview,PROBE_SUCCESSOR_RULES} from '../campaign2/probeSuccessorReview';
import {compileProbeModel} from '../campaign2/probeModel';
import {prepareCampaign2Model,createCampaign2Run} from '../campaign2/factory';
import {compileProbeTraceBinding,supportsProbeTraceProfile} from '../campaign2/traceBinding';
import {decodeProbeReview} from '../campaign2/probeCodecs';
import {dataRecord as rec,dataField as f} from '../campaign2/canonicalData';

it('PROBE-ACCESSOR-D/E: RulesVersion-only identity delta and exact runtime trace version gate',async()=>{
 const old=await compileProbeModelReview(probeModelReviewSource()),next=await probeSuccessorReview();
 const prior=rec(old.modelIdentity.value,103n),successor=rec(next.modelIdentity.value,103n);
 expect(enc(f(prior,1n))).not.toEqual(enc(f(successor,1n)));
 for(const field of [2n,3n,4n,5n,6n])expect(enc(f(prior,field))).toEqual(enc(f(successor,field)));
 for(const field of ['content','parameters','registry'] as const)expect(next.source[field]).toEqual(old.source[field]);
 expect(old.modelIdentity.digest).not.toEqual(next.modelIdentity.digest);
 const model=await prepareCampaign2Model(next.source),run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:enc(list([])),runSeed:new Uint8Array(32)});
 const runIdentity=f(rec(decodeProbeReview(run.save()),132n),3n),compiled=await compileProbeModel(next.source);
 expect(()=>compileProbeTraceBinding(successor,runIdentity,compiled.probe)).not.toThrow();
 expect(()=>compileProbeTraceBinding(prior,runIdentity,compiled.probe)).toThrow();
 expect(next.source.rulesVersion).toBe(PROBE_SUCCESSOR_RULES);
 expect(supportsProbeTraceProfile(next.profiles.trace)).toBe(true);
 for(const profile of ['campaign2-probe-trace-binding/0.1-candidate','campaign2-trace-binding/0.1-candidate','latest'])expect(supportsProbeTraceProfile(profile)).toBe(false);
});
