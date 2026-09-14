/** direct-associative-access-component/0.1-candidate: exact reference factorization, no public cue authority. */
import {ExactRational as Q,roundEven} from '../substrate/exactMath';
import {canonicalEncode,text} from '../substrate/canonicalEncoding';
import {spreadingActivation} from './encodingAccessMath';
const zero=Object.freeze(Q.of(0n));
const fail=(why:string):never=>{throw new RangeError('direct associative access: '+why);};
function keys(xs:readonly string[]){if(!Array.isArray(xs)||Object.getPrototypeOf(xs)!==Array.prototype||xs.length>32||Array.from({length:xs.length},(_,i)=>Object.hasOwn(xs,i)).some(x=>!x)||new Set(xs).size!==xs.length)fail('key set');for(const k of xs)if(typeof k!=='string'||!k||k!==k.normalize('NFC'))fail('key');}
function nonnegative(q:Q){if(!(q instanceof Q)||typeof q.numerator!=='bigint'||typeof q.denominator!=='bigint'||q.denominator<=0n||q.numerator<0n)fail('cue domain');return Object.freeze(Q.of(q.numerator,q.denominator));}
const compare=(x:string,y:string)=>{const a=canonicalEncode(text(x)),b=canonicalEncode(text(y));for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])return a[i]-b[i];return a.length-b.length;};
export function composeDirectAssociativeAccess(retained:readonly string[],graphKeys:readonly string[],weights:readonly (readonly Q[])[],cues:ReadonlyMap<string,Q>,beta:Q,scale:bigint){
 keys(retained);keys(graphKeys);keys([...cues.keys()]);const currentCue=new Map([...cues].map(([k,v])=>[k,nonnegative(v)]));
 const union=[...new Set([...retained,...graphKeys])].sort(compare);keys(union);
 const b=graphKeys.map(k=>currentCue.get(k)??zero),solved=spreadingActivation(graphKeys,weights,b,beta,scale),indices=new Map(graphKeys.map((k,i)=>[k,i])),episodic=new Set(retained);
 const rows=union.map(key=>{
  const i=indices.get(key),cueSeed=currentCue.get(key)??zero,directMatch=episodic.has(key)?cueSeed:zero;
  const learnedSpread=i===undefined?zero:solved.exact[i].subtract(b[i]);if(learnedSpread.numerator<0n)fail('negative learned spread');
  const contribution=directMatch.add(learnedSpread),quantized=Q.of(roundEven(contribution.numerator*scale,contribution.denominator),scale);
  return Object.freeze({key,episodic:episodic.has(key),graph:i!==undefined,cueSeed,directMatch,learnedSpread:Object.freeze(learnedSpread),contribution:Object.freeze(contribution),quantized:Object.freeze(quantized)});
 });
 return Object.freeze(rows);
}
