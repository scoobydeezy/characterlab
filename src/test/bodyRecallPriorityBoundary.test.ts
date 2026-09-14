import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {presentationAccessibility} from '../campaign3/encodingAccessMath';
describe('body recall law decision: supplied history operands only',()=>{
 it('BRD-A: latest acquisition and completed-presentation accessibility can prefer different targets',()=>{
  const old={acquiredAt:1n,presentations:[1n,9n]},recent={acquiredAt:8n,presentations:[8n]};
  expect(recent.acquiredAt>old.acquiredAt).toBe(true);
  const oldAccess=presentationAccessibility(old.presentations,10n,Q.of(1n),1),recentAccess=presentationAccessibility(recent.presentations,10n,Q.of(1n),1);
  expect(oldAccess).toEqual(Q.of(3n,5n));expect(recentAccess).toEqual(Q.of(1n,3n));expect(oldAccess.compare(recentAccess)).toBeGreaterThan(0);
 });
});
