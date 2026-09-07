import {describe,it,expect} from 'vitest';
import {canonicalEncode,list,set,signed,unsigned,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity} from '../substrate/identity';
import {scheduledEventValue} from '../substrate/persistence';
import {simInstant,INT64_MAX} from '../substrate/time';
import {compileOrderedInputProfile,ORDERED_INPUT_PROFILE,AUTHORED_FACT_EVENT,beginAuthoredSourceInstant,type OrderedInputCompilation} from '../campaign2/orderedInputs';
import {campaign2Record as r} from '../campaign2/codecs';
import {fixtureContentContext,fixtureCharacter,fixtureRuntime,modelId} from './fixtures/campaign2Model';

const fact=(count=1n)=>r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:fixtureCharacter,ExposureReferentId:fixtureRuntime,ActualContactCount:unsigned(count)})});
const entry=(count=1n,at=2n)=>list([signed(at),unsigned(110),AUTHORED_FACT_EVENT,fact(count),list([])]);
async function fixture(){
  const content=await fixtureContentContext(),profile=compileOrderedInputProfile(ORDERED_INPUT_PROFILE,content,{hasProcedure:()=>false});
  const empty=await commitManifest(list([]));
  const model=await createModelIdentity({rulesVersion:'test/input-profile-binding',contentSchemaVersion:'test',contentManifest:empty,parameterSchemaVersion:'test',parameterSet:empty,numericProfileVersion:'test',randomAlgorithmVersion:'test',registrySchemaVersion:'test',registryManifest:empty});
  const create=(entries:CanonicalValue[])=>profile.create(canonicalEncode(list(entries)),canonicalEncode(list([])),model,new Uint8Array(32));
  return {profile,create,content,model};
}
describe('campaign2-ordered-input/0.1-candidate component controls',()=>{
  it('INPUT-ENC-A/B/C/D/G: exact positional grammar, owned admission, no extensions',async()=>{
    const {create,content}=await fixture();
    expect(()=>compileOrderedInputProfile('unknown',content,{hasProcedure:()=>false})).toThrow();
    const base=(entry() as Extract<CanonicalValue,{kind:'list'}>).items;
    for(const value of [set(base),list(base.slice(0,4)),list([...base,unsigned(0)]),fact()])await expect(create([value])).rejects.toThrow();
    for(const [position,value] of [[0,unsigned(2)],[0,signed(0)],[0,signed(-1)],[0,signed(INT64_MAX+1n)],[1,signed(110)],[1,unsigned(150)],
      [2,modelId(1001,'event/regulatory-adaptation')],[2,modelId(1000,'event/authored-adaptation-fact')],[3,list([])],[4,text('')],[4,list([unsigned(0)])]] as const){
      const changed=[...base];changed[position]=value;await expect(create([list(changed)])).rejects.toThrow();
    }
    const wrongCharacter=r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:fixtureRuntime,ExposureReferentId:fixtureRuntime,ActualContactCount:unsigned(0)})});
    await expect(create([list([base[0],base[1],base[2],wrongCharacter,base[4]])])).rejects.toThrow();
  });
  it('INPUT-ENC-E/F/H/I: exact order, duplicates, deterministic allocation and run-only changes',async()=>{
    const {create}=await fixture();
    const a=await create([entry(1n,3n),entry(2n,2n)]),b=await create([entry(2n,2n),entry(1n,3n)]),again=await create([entry(1n,3n),entry(2n,2n)]);
    expect(a.runIdentity.canonicalBytes).not.toEqual(b.runIdentity.canonicalBytes);
    expect(a.runIdentity.canonicalBytes).toEqual(again.runIdentity.canonicalBytes);
    expect(a.initialEvents.map(e=>canonicalEncode(scheduledEventValue(e)))).toEqual(again.initialEvents.map(e=>canonicalEncode(scheduledEventValue(e))));
    expect(a.initialEvents.map(e=>[e.eventId,e.eventSequence,e.dueAt,e.causalParentEventIds])).toEqual([[0n,0n,3n,[]],[1n,1n,2n,[]]]);
    const duplicates=await create([entry(),entry()]);expect(duplicates.initialEvents).toHaveLength(2);
    expect(duplicates.initialAllocators).toEqual({nextRuntimeId:0n,nextEventId:2n,nextEventSequence:2n});
    const changed=await create([entry(3n,3n),entry(2n,2n)]);
    const model=(run:CanonicalValue)=>(run as Extract<CanonicalValue,{kind:'record'}>).fields.get(1n)!;
    expect(canonicalEncode(model(a.runIdentity.value))).toEqual(canonicalEncode(model(changed.runIdentity.value)));
    expect(a.runIdentity.canonicalBytes).not.toEqual(changed.runIdentity.canonicalBytes);
  });
  it('INPUT-ENC-J and D pending equality: rejects changed manifest and full-event mutations',async()=>{
    const {profile,create}=await fixture(),run=await create([entry(1n,2n),entry(2n,4n)]);
    const check=(queue=run.initialEvents,boundary=0n,manifest:Uint8Array=run.manifestBytes)=>profile.validatePending(manifest,run.runIdentity.canonicalBytes,boundary,queue);
    await expect(check()).resolves.toBeUndefined();
    await expect(check([run.initialEvents[1]],2n)).resolves.toBeUndefined();
    await expect(check([],4n)).resolves.toBeUndefined();
    await expect(check([],0n,canonicalEncode(list([entry(9n)])))).rejects.toThrow('manifest differs');
    await expect(check([])).rejects.toThrow();await expect(check([...run.initialEvents,run.initialEvents[0]])).rejects.toThrow();
    for(const patch of [{eventId:9n},{eventSequence:9n},{dueAt:simInstant(3n)},{phase:120n},{payload:fact(9n)},{dependencies:list([unsigned(1)])},{causalParentEventIds:[0n]}]){
      await expect(check([{...run.initialEvents[0],...patch},run.initialEvents[1]])).rejects.toThrow();
    }
    await expect(check(run.initialEvents,2n)).rejects.toThrow();
  });
  it('INPUT-ENC-K partial control: trailing invalid input publishes no compiled result',async()=>{
    const {create}=await fixture();await expect(create([entry(),list([])])).rejects.toThrow();
    const zero=await create([entry(0n)]);expect(zero.initialEvents).toHaveLength(1);
  });
  it('source authority rejects forged/altered/repeated executions before occurrence allocation',async()=>{
    const {create}=await fixture(),run=await create([entry(0n)]);let allocations=0;
    const allocator={allocateRuntimeId:()=>BigInt(allocations++)};
    expect(()=>beginAuthoredSourceInstant({} as OrderedInputCompilation,2n)).toThrow();
    const sources=beginAuthoredSourceInstant(run,2n),event=structuredClone(run.initialEvents[0]);
    run.initialEvents[0]={...run.initialEvents[0],payload:fact(99n)}; // Returned data cannot mutate compiler authority.
    expect(()=>sources.execute(run.initialEvents[0],allocator)).toThrow();expect(allocations).toBe(0);
    const output=sources.execute(event,allocator) as Extract<CanonicalValue,{kind:'record'}>;
    expect(output.schema.typeId).toBe(307n);expect(output.fields.get(2n)).toEqual((event.payload as Extract<CanonicalValue,{kind:'record'}>).fields.get(1n));
    expect(allocations).toBe(1);expect(()=>sources.execute(event,allocator)).toThrow();expect(allocations).toBe(1);
    sources.close();expect(()=>sources.execute(event,allocator)).toThrow();
  });
});
