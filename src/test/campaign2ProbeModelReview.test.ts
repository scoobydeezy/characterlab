import {describe,it,expect} from 'vitest';
import {probeModelReviewSource,compileProbeModelReview,decodeProbeReview,probeProfiles,PROBE_RULES,PROBE_REGISTRY,PROBE_PROFILES} from '../campaign2/probeModelReview';
import {canonicalEncode,list,set,record} from '../substrate/canonicalEncoding';
describe('accepted probe review packaging; no runtime activation',()=>{
 it('rejects shifted positions and missing union governance',async()=>{
  const s=probeModelReviewSource(),v=decodeProbeReview(s.registry);if(typeof v==='boolean'||v.kind!=='list')throw Error();
  await expect(compileProbeModelReview({...s,registry:canonicalEncode(list([set([]),...v.items]))})).rejects.toThrow();
  const carrier=v.items[0];if(typeof carrier==='boolean'||carrier.kind!=='set')throw Error();
  const kept=carrier.items.filter(x=>!(typeof x!=='boolean'&&x.kind==='record'&&x.schema.typeId===171n&&(()=>{const d=x.fields.get(4n);if(typeof d==='boolean'||d?.kind!=='record'||d.schema.typeId!==259n)return false;const t=d.fields.get(1n);return typeof t!=='boolean'&&t?.kind==='unsigned'&&t.value===335n;})()));
  await expect(compileProbeModelReview({...s,registry:canonicalEncode(list([set(kept),...v.items.slice(1)]))})).rejects.toThrow();
 });
 it('commits all four permission variants distinctly and canonical set permutations equally',async()=>{
  const results=[];for(const a of [false,true])for(const p of [false,true])results.push(await compileProbeModelReview(probeModelReviewSource(a,p)));
  const hex=(b:Uint8Array)=>Array.from(b).join(',');expect(new Set(results.map(r=>hex(r.modelIdentity.digest))).size).toBe(4);
  const s=probeModelReviewSource(),v=decodeProbeReview(s.registry);if(typeof v==='boolean'||v.kind!=='list')throw Error();
  const reversed=v.items.map(x=>typeof x!=='boolean'&&x.kind==='set'?set([...x.items].reverse()):x);
  const r=await compileProbeModelReview({...s,registry:canonicalEncode(list(reversed))});expect(r.modelIdentity.digest).toEqual(results[3].modelIdentity.digest);
 });
 it('rejects all old whole-profile selections and old RulesVersion',()=>{
  for(const [k,value] of Object.entries({orderedInput:'campaign2-ordered-input/0.1-candidate',persistence:'campaign2-persistence/0.1-candidate',trace:'campaign2-trace-binding/0.1-candidate'}))expect(()=>probeProfiles(PROBE_RULES,PROBE_REGISTRY,{...PROBE_PROFILES,[k]:value})).toThrow();
  expect(()=>probeProfiles('rules/campaign2-bounded-bridge/0.2-candidate',PROBE_REGISTRY)).toThrow();
 });
});
