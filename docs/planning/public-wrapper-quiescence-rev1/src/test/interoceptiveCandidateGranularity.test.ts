import {describe,it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {reserveBin,atom} from '../campaign3/embodiedMath';
import {embodiedRecord as r} from '../campaign3/embodiedCodecs';
import {canonicalEncode,typedIdentifier,text,unsigned,signed} from '../substrate/canonicalEncoding';
import {selectInteroceptiveSamples as select,consumeInteroceptiveSelection as consume} from '../campaign3/interoceptiveSelection';
function view(channel:string,occurrence:number,width:number){
 const bin=reserveBin(Q.of(27n),Q.of(100n),Q.of(BigInt(width)));
 return r(461,[typedIdentifier(1115,unsigned(occurrence)),typedIdentifier(1000,text('observer/fixture')),typedIdentifier(1005,text('channel/'+channel)),signed(1),r(462,[atom(bin.lower),atom(bin.upper)]),text('embodied-level-observation/0.1-candidate')]);
}
describe('candidate granularity: actual math/codec/selector component witness',()=>{
 it('IG-A: three resolution views of one reserve compete as three sample candidates',()=>{
  const samples=[view('a',1,1),view('b',2,5),view('c',3,10)];
  const result=select(samples,2);expect(result.audit.map(x=>x.disposition)).toEqual(['Selected','Selected','Capacity']);
  expect(consume(result.view).map(canonicalEncode)).toEqual(samples.slice(0,2).map(canonicalEncode));
 });
 it('IG-B: channel-distinct duplicate readouts can consume the same two slots',()=>{
  const target=view('c',3,10);expect(consume(select([target],2).view).map(canonicalEncode)).toEqual([canonicalEncode(target)]);
  const replicated=[view('a',1,10),view('b',2,10),target];
  expect(consume(select(replicated,2).view).map(canonicalEncode)).toEqual(replicated.slice(0,2).map(canonicalEncode));
 });
});
