import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {rankAccessibleEpisodes} from '../campaign3/encodingAccessMath';
import {rankWithIndependentAssociationMembership as rank} from '../campaign3/independentAssociationAccess';
const params={lambda:Q.of(1n),exponent:1,omegaB:Q.of(1n),omegaA:Q.of(1n),k:2};
const episode=(retainedKeys:string[])=>({key:'episode',retainedKeys,presentations:[0n]});
describe('independent association membership: read-only composition',()=>{
 it('IA-A: episodic-only membership ranks via base without inserting a graph node',()=>{
  const graph=new Map<string,Q>(),result=rank([episode(['a'])],graph,1n,params);
  expect(result.selected).toHaveLength(1);expect(result.selected[0].pull.compare(Q.of(0n))).toBe(0);expect(result.selected[0].score.compare(Q.of(1n,2n))).toBe(0);expect(graph.size).toBe(0);
 });
 it('IA-B: mixed membership retains the full distinct-key denominator',()=>{
  const graph=new Map([['a',Q.of(3n,5n)],['graph-only',Q.of(9n)]]),result=rank([episode(['a','b'])],graph,1n,params);
  expect(result.selected[0].pull.compare(Q.of(3n,10n))).toBe(0);expect([...graph.keys()]).toEqual(['a','graph-only']);
 });
 it('IA-C: graph-only activation cannot create an episode; absent-both stays absent',()=>{
  const graph=new Map([['b',Q.of(1n)]]);expect(rank([],graph,1n,params).selected).toEqual([]);expect(graph.has('neither')).toBe(false);
 });
 it('IA-D: old kernel remains strict and existing complete-domain results are preserved',()=>{
  expect(()=>rankAccessibleEpisodes([episode(['a'])],new Map(),1n,params)).toThrow('unknown retained key');
  const graph=new Map([['a',Q.of(1n)]]);expect(rank([episode(['a'])],graph,1n,params)).toEqual(rankAccessibleEpisodes([episode(['a'])],graph,1n,params));
 });
 it('IA-E: invalid activation and duplicate retained keys still reject',()=>{
  expect(()=>rank([episode(['a'])],new Map([['b',Q.of(-1n)]]),1n,params)).toThrow();
  expect(()=>rank([episode(['a','a'])],new Map(),1n,params)).toThrow();
 });
});
