/** Internal candidate execution/persistence gate. This deliberately does not
 * expose a public prepared-model token before the exact cohort freeze. */
import {canonicalEncode as enc,list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {SaveContractError} from '../substrate/persistence';
import {failureDiagnosticValue} from '../substrate/trace';
import {dataRecord as rec,dataField as f,dataKey as key,invalidModel as fail} from '../campaign2/canonicalData';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {generalBindingContext} from './generalBindingProfile';
import {createGeneralSourceRuntime} from './generalSourceRuntime';
import type {compileGeneralModelCandidate} from './generalModelCandidate';
type Candidate=Awaited<ReturnType<typeof compileGeneralModelCandidate>>;
function bytes(value:Uint8Array){if(!(value instanceof Uint8Array)||Object.getPrototypeOf(value)!==Uint8Array.prototype)fail('GA plain canonical bytes required');return new Uint8Array(value);}
function instant(value:CanonicalValue){if(typeof value==='boolean'||value.kind!=='signed'||value.value<0n||value.value>100n)throw new SaveContractError('GA save clock');return value.value;}
export async function createGeneralCandidateRun(candidate:Candidate,seed:Uint8Array){
 const copied=bytes(seed),originals=createGeneralSourceRuntime(candidate.model).originalBytes(),identity=await candidate.runIdentity(originals,copied);
 const runtime=createGeneralSourceRuntime(candidate.model,{model:candidate.identity.value,run:identity.value});
 return Object.freeze({
  settleNextInstant:async()=>await runtime.settleNextInstant()!==undefined,
  snapshot(){const s=runtime.snapshot();return {clock:s.clock,status:s.status,state:enc(s.state.canonicalValue()),outputs:enc(list(s.outputs)),trace:enc(list(s.committedTrace))};},
  save:()=>runtime.save(),runIdentity:()=>identity.canonicalBytes.slice(),originalBytes:()=>originals.slice(),
  diagnostic(){const d=runtime.diagnostic();return d?enc(failureDiagnosticValue(identity.value,d)):undefined;},
 });
}
export async function restoreGeneralCandidateRun(candidate:Candidate,input:Uint8Array){
 const copy=bytes(input),context=generalBindingContext();
 try{
  const save=rec(decode(copy,context),132n),target=instant(f(save,4n)),runIdentity=rec(f(save,3n),104n),seed=f(runIdentity,4n);
  if(typeof seed==='boolean'||seed.kind!=='bytes')throw new SaveContractError('GA saved seed');
  if(key(f(save,2n))!==key(candidate.identity.value))throw new SaveContractError('GA save model differs');
  const run=await createGeneralCandidateRun(candidate,seed.value);
  if(key(decode(run.runIdentity(),context))!==key(runIdentity))throw new SaveContractError('GA original commitments differ');
  while(run.snapshot().clock<target){if(!await run.settleNextInstant())throw new SaveContractError('GA save clock is not a complete prefix');}
  const actual=run.save();if(actual.length!==copy.length||actual.some((v,i)=>v!==copy[i]))throw new SaveContractError('GA whole-save prefix equality failed');
  return run;
 }catch(error){if(error instanceof SaveContractError)throw error;throw new SaveContractError(error instanceof Error?error.message:String(error));}
}
