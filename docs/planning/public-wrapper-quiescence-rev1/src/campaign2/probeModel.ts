/** Exact successor model dispatch. Inherited declarations are reused; whole profiles are probe-owned. */
import {compileProbeModelReview,PROBE_RULES} from './probeModelReview';
import {PROBE_SUCCESSOR_RULES,PROBE_SUCCESSOR_PROFILES} from './probeSuccessorReview';
import {compileBoundedModelDeclarations} from './modelPackaging';
import {firstTraceModel} from './firstTraceModel';
import {compileProbeExecution} from './probeExecution';
import {decodeProbeReview} from './probeCodecs';
import {commitManifest,createModelIdentity} from '../substrate/identity';
import {invalidModel} from './canonicalData';
export async function compileProbeModel(source:Parameters<typeof compileBoundedModelDeclarations>[0]){
 if(source.rulesVersion!==PROBE_SUCCESSOR_RULES)invalidModel('probe .2 required for authoritative accessor trace');
 const checked=await compileProbeModelReview({...source,rulesVersion:PROBE_RULES});
 const inherited=await compileBoundedModelDeclarations(firstTraceModel());
 const registry=decodeProbeReview(checked.source.registry),registryManifest=await commitManifest(registry);
 const modelIdentity=await createModelIdentity({...checked.source,rulesVersion:PROBE_SUCCESSOR_RULES,contentManifest:await commitManifest(decodeProbeReview(checked.source.content)),parameterSet:await commitManifest(decodeProbeReview(checked.source.parameters)),registryManifest});
 return {...inherited,registryManifest,modelIdentity,profiles:PROBE_SUCCESSOR_PROFILES,probe:compileProbeExecution(registry,inherited.reg)};
}
