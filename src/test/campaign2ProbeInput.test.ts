import {describe,it,expect} from 'vitest';
import {canonicalEncode,list,set,signed,unsigned,text,typedIdentifier} from '../substrate/canonicalEncoding';
import {compileBoundedModelDeclarations} from '../campaign2/modelPackaging';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {compileProbeModelReview,probeModelReviewSource} from '../campaign2/probeModelReview';
import {probeCanonicalRecord} from '../campaign2/probeCodecs';
import {compileOrderedInputProfile,PROBE_INPUT_PROFILE,PROBE_SOURCE_EVENT,beginProbeSourceInstant,beginAuthoredSourceInstant} from '../campaign2/orderedInputs';
const entry=(at=4n)=>list([signed(at),unsigned(110),PROBE_SOURCE_EVENT,probeCanonicalRecord(333,[typedIdentifier(1027,text('definition/regulatory-diagnostic-probe'))]),list([])]);
async function fixture(){const base=await compileBoundedModelDeclarations(firstTraceModel()),model=await compileProbeModelReview(probeModelReviewSource());const profile=compileOrderedInputProfile(PROBE_INPUT_PROFILE,base.compiled.content,base.domains);return {profile,create:(entries=[entry()])=>profile.create(canonicalEncode(list(entries)),canonicalEncode(set([])),model.modelIdentity,new Uint8Array(32))};}
describe('probe InputOnly component authority; runtime qualification remains separate',()=>{
 it('authenticates exact original source, rejects altered/reused/closed source and wrong adapter',async()=>{
  const {create}=await fixture(),run=await create(),event=run.initialEvents[0],source=beginProbeSourceInstant(run,4n);
  expect(()=>source.admit({...event,eventId:99n})).toThrow();expect(()=>source.admit({...event,phase:120n})).toThrow();
  let allocated=0;expect(()=>beginAuthoredSourceInstant(run,4n).execute(event,{allocateRuntimeId:()=>BigInt(allocated++)})).toThrow();expect(allocated).toBe(0);
  expect(()=>source.admit(event)).not.toThrow();expect(()=>source.admit(event)).toThrow();source.close();expect(()=>source.admit(event)).toThrow();
 });
 it('enforces positive time, one source per probe instant and exact original pending equality',async()=>{
  const {create,profile}=await fixture();await expect(create([entry(0n)])).rejects.toThrow();await expect(create([entry(),entry()])).rejects.toThrow();
  const run=await create([entry(4n),entry(8n)]);
  await expect(profile.validatePending(run.manifestBytes,run.runIdentity.canonicalBytes,4n,[run.initialEvents[1]])).resolves.toBeUndefined();
  for(const queue of [[],run.initialEvents,[{...run.initialEvents[1],eventSequence:99n}]])await expect(profile.validatePending(run.manifestBytes,run.runIdentity.canonicalBytes,4n,queue)).rejects.toThrow();
  const restored=await profile.restoreAuthority(run.manifestBytes,run.runIdentity.canonicalBytes);expect(()=>beginProbeSourceInstant(restored,8n).admit(run.initialEvents[1])).not.toThrow();
 });
 it('old whole input profile cannot admit the probe payload',async()=>{
  const base=await compileBoundedModelDeclarations(firstTraceModel()),profile=compileOrderedInputProfile(base.profiles.orderedInput,base.compiled.content,base.domains);
  await expect(profile.create(canonicalEncode(list([entry()])),canonicalEncode(set([])),base.modelIdentity,new Uint8Array(32))).rejects.toThrow();
 });
});
