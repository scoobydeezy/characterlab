import {describe,it,expect} from 'vitest';
import {canonicalEncode as enc} from '../substrate/canonicalEncoding';
import {ONE} from '../campaign2/cognitiveMath';
import {dataKey as key,dataItems as items} from '../campaign2/canonicalData';
import {decisionComparison,DECISION_LAWS} from '../campaign3/decisionComparators';
import {decisionContext,REGIMES} from './decisionComparatorFixtures';
const seed=(n:number)=>new Uint8Array(32).fill(n);
describe('DECISION named comparator component matrix',()=>{
 it('normalizes exactly and separates the three registered regimes',async()=>{
  for(const regime of REGIMES){const result=await decisionComparison(decisionContext(regime),seed(0),'Baseline',true);
   expect(result.analytical.probabilities.reduce((s,p)=>s.add(p.probability),ONE.subtract(ONE)).equals(ONE)).toBe(true);
   expect(result.mode).toBe({settled:'Auto',low:'QuietRoll',high:'PlayerFacingRoll'}[regime]);
   expect(result.addresses.length===0).toBe(regime==='settled');
  }
 });
 it('uses identical authoritative faces/addresses in low and high significance',async()=>{
  for(let n=0;n<16;n++){const a=await decisionComparison(decisionContext('low'),seed(n),'Baseline',true),b=await decisionComparison(decisionContext('high'),seed(n),'Baseline',true);
   expect(enc(a.transcript)).toEqual(enc(b.transcript));expect(a.addresses).toEqual(b.addresses);expect(a.chosen).toEqual(b.chosen);expect(a.analytical.probabilities).toEqual(b.analytical.probabilities);expect(a.analytical.stake.equals(b.analytical.stake)).toBe(false);
  }
 });
 it('replays every seed/regime/law and preserves choice across post-intent interference',async()=>{
  for(const law of DECISION_LAWS)for(const regime of REGIMES)for(let n=0;n<16;n++){
   const context=decisionContext(regime),a=await decisionComparison(context,seed(n),law,true),replay=await decisionComparison(context,seed(n),law,true),blocked=await decisionComparison(context,seed(n),law,false);
   expect(replay).toEqual(a);expect(blocked.transcript).toEqual(a.transcript);expect(blocked.expression).toEqual(a.expression);
   if(law==='Baseline'){expect(blocked.intent).toEqual(a.intent);expect(blocked.outcome).not.toEqual(a.outcome);}
   if(law!=='IntentEqualsOutcome')expect(blocked.chosen).toEqual(a.chosen);
  }
 },30000);
 it('exhibits a required failure for every named alternative',async()=>{
  const settled=decisionContext('settled'),low=decisionContext('low'),high=decisionContext('high');
  expect((await decisionComparison(settled,seed(0),'AlwaysRoll',true)).addresses.length).toBeGreaterThan(0);
  expect((await decisionComparison(low,seed(0),'NeverRoll',true)).mode).toBe('Auto');
  let decorativeDivergences=0;
  for(let n=0;n<16;n++){const a=await decisionComparison(high,seed(n),'Baseline',true),b=await decisionComparison(high,seed(n),'DecorativeDice',true);expect(a.transcript).toEqual(b.transcript);if(key(a.chosen!)!==key(b.chosen!))decorativeDivergences++;}
  expect(decorativeDivergences).toBeGreaterThan(0);
  const opaque=await decisionComparison(high,seed(0),'OpaqueWeightedChoice',true);expect(items(opaque.transcript,'list')).toHaveLength(1);expect(opaque.addresses).toHaveLength(1);
  const baseline=await decisionComparison(high,seed(0),'Baseline',true);expect(items(baseline.transcript,'list').length).toBeGreaterThanOrEqual(2);
  expect((await decisionComparison(high,seed(0),'IntentEqualsOutcome',false)).chosen).toBeUndefined();expect((await decisionComparison(high,seed(0),'Baseline',false)).chosen).toBeDefined();
 });
});
