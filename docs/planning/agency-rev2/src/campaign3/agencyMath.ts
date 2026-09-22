/** Profile-local observer operands only; no world/state accessor in the fold. */
import { list, unsigned as u, text, type CanonicalValue } from '../substrate/canonicalEncoding';
import { dataRecord as rec, dataField as f, dataItems as items, dataKey as key, dataUnsigned as uint } from '../campaign2/canonicalData';
import { agencyRecord as r, decodeAgency } from './agencyCodecs';
import { canonicalEncode as enc } from '../substrate/canonicalEncoding';
import { OBSERVERS } from './agencyModel';

export function agencyKnowledge(prior: CanonicalValue, evidence: CanonicalValue, i: number, law: number) {
  const e=rec(evidence,976n);
  if(key(f(e,2n))!==key(OBSERVERS[i])) throw Error('AGENCY_FOREIGN_EVIDENCE');
  const beliefs=new Map(items(f(rec(prior,979n),1n),'list').map(b=>[key(f(rec(b,978n),1n)),b]));
  for(const observation of items(f(e,3n),'list')) {
    const o=rec(observation,975n),kind=uint(f(o,5n));
    if(key(f(o,2n))!==key(OBSERVERS[i])||kind===1n) throw Error('AGENCY_EVIDENCE_SCOPE');
    const episode=f(o,4n),before=beliefs.get(key(episode)),support=before?[...items(f(rec(before,978n),4n),'list')]:[];
    const next=r(977,[f(o,5n),f(o,7n),f(o,6n),f(o,8n)]),same=support.find(s=>key(f(rec(s,977n),2n))===key(f(o,7n)));
    if(same) {if(key(same)!==key(next)) throw Error('AGENCY_SOURCE_CONFLICT');continue;}
    support.push(next);
    const numerator=law===2?Number(f(o,6n)===true):support.filter(s=>f(rec(s,977n),3n)===true).length;
    beliefs.set(key(episode),r(978,[episode,u(numerator),u(law===2?1:support.length),list(support)]));
  }
  return r(979,[list([...beliefs].sort(([a],[b])=>a<b?-1:1).map(([,v])=>v))]);
}

export function agencyObserverView(outputs: readonly CanonicalValue[], i: number) {
  if(i!==0&&i!==1) throw Error('AGENCY_OBSERVER');
  const privateTypes=new Set([403n,408n,409n,425n,426n,431n,432n,974n,986n,988n]);
  const view:CanonicalValue[]=[];
  for(const value of outputs) {
    decodeAgency(enc(value));
    if(typeof value==='boolean'||value.kind!=='record') throw Error('AGENCY_OUTPUT_ROSTER');
    if(privateTypes.has(value.schema.typeId)) continue;
    const type=value.schema.typeId;
    if(![975n,976n,981n,982n].includes(type)) throw Error('AGENCY_OUTPUT_ROSTER');
    const observer=f(value,type===981n?3n:2n);
    if(key(observer)!==key(OBSERVERS[i])) continue;
    // Empty evidence and corresponding no-op applications are protocol, not evidence.
    if(type===976n&&!items(f(value,3n),'list').length) continue;
    if(type===982n&&!items(f(rec(f(value,3n),976n),3n),'list').length) continue;
    view.push(type===981n?list([text('agency-belief'),f(value,2n),observer,f(value,4n)]):value);
  }
  return list(view);
}
