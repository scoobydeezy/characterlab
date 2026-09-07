/** Accepted trace-binding successor; review construction only, not runtime activation. */
import {compileProbeModelReview,probeModelReviewSource,PROBE_BUNDLE,PROBE_PROFILES} from './probeModelReview';
import {decodeProbeReview} from './probeCodecs';
import {commitManifest,createModelIdentity} from '../substrate/identity';
export const PROBE_SUCCESSOR_RULES='rules/campaign2-regulatory-probe/0.2-candidate';
export const PROBE_SUCCESSOR_PROFILES=Object.freeze({...PROBE_PROFILES,trace:'campaign2-probe-trace-binding/0.2-candidate'});
export const PROBE_SUCCESSOR_BUNDLE=Object.freeze([...PROBE_BUNDLE.slice(0,-1),PROBE_SUCCESSOR_PROFILES.trace]);
export async function probeSuccessorReview(){
 const original=await compileProbeModelReview(probeModelReviewSource());
 const source={...original.source,rulesVersion:PROBE_SUCCESSOR_RULES};
 const modelIdentity=await createModelIdentity({...source,contentManifest:await commitManifest(decodeProbeReview(source.content)),parameterSet:await commitManifest(decodeProbeReview(source.parameters)),registryManifest:await commitManifest(decodeProbeReview(source.registry))});
 return {source,modelIdentity,profiles:PROBE_SUCCESSOR_PROFILES,semanticBundle:PROBE_SUCCESSOR_BUNDLE};
}
