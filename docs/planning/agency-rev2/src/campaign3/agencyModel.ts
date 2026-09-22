/** agency-public/0.2-candidate: finite recipes and disjoint registered owners. */
import { canonicalEncode as enc, list, set, text, unsigned as u, rational as q, type CanonicalValue } from '../substrate/canonicalEncoding';
import { commitManifest, createModelIdentity, createRunIdentity } from '../substrate/identity';
import { AuthoritativeState, StateAuthorityRegistry, statePathPatternValue, type StatePath } from '../substrate/state';
import { compileMutationAuthorityRegistry } from '../substrate/mutationAuthority';
import { semanticReferentFromAuthoredContent } from '../substrate/referentOrigin';
import { simInstant } from '../substrate/time';
import { RANDOM_ALGORITHM_VERSION } from '../substrate/random';
import type { ScheduledEvent } from '../substrate/scheduler';
import { dataRecord as rec, dataField as f, dataItems as items, dataKey as key, dataUnsigned as uint } from '../campaign2/canonicalData';
import { receivingRecord as old } from './receivingCodecs';
import { ACTOR, sid } from './longitudinalModel';
import { copyData } from './beliefModel';
import { agencyRecord as r, decodeAgency as decode } from './agencyCodecs';
export { ACTOR, sid, copyData };
export const VERSION = 'agency-public/0.2-candidate';
export const OBSERVERS = ['a', 'b'].map(n => sid(1000, 'observer/agency/' + n));
export const BLOCKERS = ['a', 'b'].map(n => semanticReferentFromAuthoredContent(sid(1038, 'content/agency/blocker/' + n)));
export const localEpisode = (i: number, n: number) => sid(1027, `visible/agency/${i}/episode/${n}`);
export const localActor = (i: number, n: number) => semanticReferentFromAuthoredContent(sid(1038, `content/agency/${i}/identified/${n}`));
export const STAGES = [['context',40],['probe-a',40],['probe-b',40],['raw',51],['reasons',52],['decision',60],['expression',80],['plan',90],['attempt',100],['execution',110],['report',110],['observe-a',120],['observe-b',120],['evidence-a',130],['evidence-b',130],['history',140],['update-a',140],['update-b',140]] as const;
export const eventId = (name: string) => sid(1001, 'event/agency/' + name);
export const index = (name: string) => name.endsWith('-a') ? 0 : 1;
export const personPath = (i: number): StatePath => ({ rootStateTypeId:980n, fieldId:1n, selectors:[{kind:'mapKey',key:OBSERVERS[i]}] });
export const historyPath: StatePath = { rootStateTypeId:984n, fieldId:1n, selectors:[{kind:'mapKey',key:ACTOR}] };
export const pattern = (path: StatePath) => ({...path, selectors:path.selectors.map(selector=>({kind:'exact' as const,selector}))});
export const reads = (name: string): StatePath[] => name==='history' ? [historyPath] : name.startsWith('probe') || name.startsWith('update') ? [personPath(index(name))] : [];
export const writes = (name: string): StatePath[] => name==='history' ? [historyPath] : name.startsWith('update') ? [personPath(index(name))] : [];
export const owner = (name: string) => sid(1025, name==='history' ? 'authority/agency-history' : `authority/agency-observer-${index(name)}`);
const ownership = () => compileMutationAuthorityRegistry(['history','update-a','update-b'].map(name=>({authorityName:(owner(name).payload as {value:string}).value,ownedLeaves:writes(name).map(path=>({pattern:pattern(path),valueGrammar:{kind:'canonical-record' as const,recordTypeId:name==='history'?983n:979n},removalAllowed:false}))})));

export function agencyRecipe(law=1) {
  if (![1,2,3,4,5].includes(law)) throw Error('AGENCY_PROFILE');
  const modifier=old(439,[q(1,4),u(3)]), dice=old(437,[old(438,[1,2,3,4,5].map(n=>q(n,5))),q(0,1),modifier,modifier]);
  const parameters=r(971,[text(VERSION),u(law)]),content=r(972,[ACTOR,list(OBSERVERS),list(BLOCKERS),dice]);
  const stages=STAGES.map(([name,phase])=>r(987,[eventId(name),u(phase),list(reads(name).map(p=>statePathPatternValue(pattern(p)))),list(writes(name).map(p=>statePathPatternValue(pattern(p)))),owner(name)]));
  return {parameters:enc(parameters),content:enc(content),registry:enc(list([ownership().definitionValue,list(stages)]))};
}
export type AgencySource = ReturnType<typeof agencyRecipe>;
export async function compileAgencyModel(input: AgencySource) {
  const source=copyData(input,['parameters','content','registry']),profile=rec(decode(source.parameters),971n),law=Number(uint(f(profile,2n))),recipe=agencyRecipe(law);
  for(const name of ['parameters','content','registry'] as const) if(key(decode(source[name]))!==key(decode(recipe[name]))) throw Error('AGENCY_EXACT_MODEL');
  const own=ownership(),authority=new StateAuthorityRegistry(own.writableLeaves,own.authorities),content=rec(decode(source.content),972n);
  const modelIdentity=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(content),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(profile),numericProfileVersion:'agency-exact/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(decode(source.registry))});
  function validateState(state: AuthoritativeState) {
    decode(enc(state.canonicalValue()));
    for(const entry of state.entries()) {
      const pathKey=key(statePathPatternValue(pattern(entry.path))),i=[0,1].find(i=>pathKey===key(statePathPatternValue(pattern(personPath(i)))));
      if(i!==undefined) {
        const episodes=new Set<string>();
        for(const value of items(f(rec(entry.value,979n),1n),'list')) {
          const belief=rec(value,978n),episode=key(f(belief,1n));
          if(episodes.has(episode)||!Array.from({length:8},(_,n)=>key(localEpisode(i,n+1))).includes(episode)) throw Error('AGENCY_EPISODE_STATE');
          episodes.add(episode);
          const support=items(f(belief,4n),'list'),keys=support.map(s=>key(f(rec(s,977n),2n)));
          if(new Set(keys).size!==keys.length) throw Error('AGENCY_DUPLICATE_SUPPORT');
          const expectedN=law===2?Number(f(rec(support.at(-1)!,977n),3n)===true):support.filter(s=>f(rec(s,977n),3n)===true).length;
          if(uint(f(belief,2n))!==BigInt(expectedN)||uint(f(belief,3n))!==BigInt(law===2?1:support.length)) throw Error('AGENCY_BELIEF_FOLD');
        }
      } else if(pathKey===key(statePathPatternValue(pattern(historyPath)))) {
        let last=0n;
        for(const value of items(f(rec(entry.value,983n),1n),'list')) {
          const row=rec(value,985n),at=f(row,1n);
          if(typeof at==='boolean'||at.kind!=='signed'||at.value<=last) throw Error('AGENCY_HISTORY_ORDER');
          last=at.value;
          if(key(f(row,2n))!==key(f(rec(f(rec(f(row,3n),974n),3n),988n),5n))) throw Error('AGENCY_HISTORY_EXPRESSION');
        }
      } else throw Error('AGENCY_STATE_PATH');
    }
  }
  return {source,content,law,modelIdentity,authority,validateState};
}
export type AgencyCompiled = Awaited<ReturnType<typeof compileAgencyModel>>;
export async function compileAgencyInputs(model: AgencyCompiled, initialState: Uint8Array, orderedInputs: Uint8Array, runSeed: Uint8Array) {
  if(key(decode(initialState))!==key(set([]))) throw Error('AGENCY_INITIAL_STATE');
  const originals=items(decode(orderedInputs),'list');
  if(!originals.length||originals.length>8) throw Error('AGENCY_INPUT_LIMIT');
  let last=0n;const episodes=new Set<bigint>(),receipts=new Map<bigint,string>(),events:ScheduledEvent[]=[];
  for(const original of originals) {
    const v=rec(original,973n),at=f(v,1n),kind=uint(f(v,2n)),episode=uint(f(v,3n)),receipt=uint(f(v,8n));
    if(typeof at==='boolean'||at.kind!=='signed'||at.value<=last||at.value>16n) throw Error('AGENCY_TIME');last=at.value;
    if(kind===1n) {if(episodes.has(episode)) throw Error('AGENCY_REUSED_ATTEMPT');episodes.add(episode);}
    if(kind===2n) {
      if(!episodes.has(episode)||receipt===0n) throw Error('AGENCY_REPORT_CONTEXT');
      const claim=key(list([f(v,3n),f(v,9n)]));
      if(receipts.has(receipt)&&receipts.get(receipt)!==claim) throw Error('AGENCY_REPORT_CONFLICT');receipts.set(receipt,claim);
    }
    if(kind!==1n&&(f(v,4n)!==true||uint(f(v,5n))!==0n||items(f(v,6n),'set').length||items(f(v,7n),'set').length)) throw Error('AGENCY_UNUSED_WORLD');
    if(kind!==2n&&(receipt!==0n||f(v,9n)!==false||items(f(v,10n),'set').length)) throw Error('AGENCY_UNUSED_REPORT');
    for(const name of ['context','probe-a','probe-b',...(kind!==1n?['report']:[])]) events.push({eventId:BigInt(events.length),eventSequence:BigInt(events.length),dueAt:simInstant(at.value),phase:BigInt(STAGES.find(([n])=>n===name)![1]),eventTypeId:eventId(name),payload:original,dependencies:list([]),causalParentEventIds:[]});
  }
  const runIdentity=await createRunIdentity({modelIdentity:model.modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(orderedInputs)),runSeed});
  return {events,runIdentity,runSeed:runSeed.slice()};
}
