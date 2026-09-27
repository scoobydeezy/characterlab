/** encoding-access-math/0.1-candidate. Pure comparison kernels, never public ingress or state writers. */
import {ExactRational as Q,roundEven} from '../substrate/exactMath';
const zero=Object.freeze(Q.of(0n)),one=Object.freeze(Q.of(1n));
const fail=(why:string):never=>{throw new RangeError('encoding-access math: '+why);};
function nonnegative(q:Q):Q {if(!(q instanceof Q)||typeof q.numerator!=='bigint'||typeof q.denominator!=='bigint'||q.denominator<=0n||q.numerator<0n)fail('nonnegative rational');return Q.of(q.numerator,q.denominator);}
function unit(q:Q):Q {const v=nonnegative(q);if(v.compare(one)>0)fail('unit interval');return v;}
const sum=(xs:readonly Q[])=>xs.reduce((a,b)=>a.add(b),zero);
const max=(a:Q,b:Q)=>a.compare(b)>=0?a:b;
function count(n:number,max=32){if(!Number.isInteger(n)||n<0||n>max)fail('bounded count');}
function dense(xs:readonly unknown[]){if(!Array.isArray(xs)||Object.getPrototypeOf(xs)!==Array.prototype)fail('plain dense array');const ds=Object.getOwnPropertyDescriptors(xs);if(Reflect.ownKeys(ds).some(k=>k!=='length'&&(typeof k!=='string'||!/^(0|[1-9][0-9]*)$/.test(k)))||Object.values(ds).some(d=>!('value'in d))||Object.keys(ds).length!==xs.length+1)fail('plain dense array');}
function keys(xs:readonly string[]){dense(xs);count(xs.length);if(xs.some(k=>typeof k!=='string'||!k||k!==k.normalize('NFC'))||new Set(xs).size!==xs.length)fail('distinct nonempty NFC keys');}
function compareKeys(a:string,b:string){const encoder=new TextEncoder(),x=encoder.encode(a),y=encoder.encode(b);for(let i=0;i<Math.min(x.length,y.length);i++)if(x[i]!==y[i])return x[i]-y[i];return x.length-y.length;}
export function boundedEncodingResponse(value:Q):Q {const x=nonnegative(value);return x.divide(one.add(x));}
export function encodingRaw(f:{base:Q;role:Q;attention:Q;need:Q;surprise:Q;alphaN:Q;alphaS:Q}):Q {
 return unit(f.base).multiply(unit(f.role)).multiply(unit(f.attention)).multiply(one.add(nonnegative(f.alphaN).multiply(unit(f.need)))).multiply(one.add(nonnegative(f.alphaS).multiply(unit(f.surprise))));
}
export function residualAttention(pool:Q,members:number):Q {unit(pool);count(members);return members===0?zero:pool.divide(Q.of(BigInt(members)));}
export type EncodingBudget='independent'|'historical-shared'|'historical-hybrid'|'retired-flat';
export function encodingBudget(labels:readonly string[],raw:readonly Q[],law:EncodingBudget,budget=one,threshold=one):readonly Q[] {
 keys(labels);dense(raw);if(raw.length!==labels.length)fail('raw dimension');const values=raw.map(nonnegative);nonnegative(budget);nonnegative(threshold);
 if(law==='independent')return values.map(boundedEncodingResponse);
 if(law==='retired-flat')return values.map(()=>one);
 if(law==='historical-shared'){const denom=max(budget,sum(values));return values.map(x=>denom.numerator?x.divide(denom):zero);}
 if(law!=='historical-hybrid')fail('budget law');
 const important=values.map(x=>x.compare(threshold)>=0),committed=values.map((x,i)=>important[i]?boundedEncodingResponse(x):zero),leftover=max(zero,budget.subtract(sum(committed))),denom=max(leftover,sum(values.filter((_,i)=>!important[i])));
 return values.map((x,i)=>important[i]?committed[i]:denom.numerator?x.divide(denom):zero);
}
function graph(labels:readonly string[],w:readonly (readonly Q[])[],scale?:bigint){keys(labels);dense(w);w.forEach(dense);if(w.length!==labels.length||w.some(row=>row.length!==labels.length))fail('graph dimensions');if(scale!==undefined&&(typeof scale!=='bigint'||scale<=0n))fail('scale');
 return w.map((row,i)=>{const values=row.map((x,j)=>{const value=unit(x);if(i===j&&value.numerator)fail('self edge');if(scale!==undefined&&(value.numerator*scale)%value.denominator)fail('off-lattice state');return value;});if(sum(values).compare(one)>0)fail('row mass');return values;});
}
export function associationCandidate(labels:readonly string[],prior:readonly (readonly Q[])[],activation:readonly Q[],p:{scale:bigint;eta:Q;lambda:Q;elapsed:Q}) {
 const w=graph(labels,prior,p.scale);dense(activation);if(activation.length!==labels.length)fail('coactivation dimension');const z=activation.map(unit),decay=one.divide(one.add(nonnegative(p.lambda).multiply(nonnegative(p.elapsed)))),eta=nonnegative(p.eta);
 const rows=w.map((row,i)=>{const exact=row.map((value,j)=>i===j?zero:value.multiply(decay).add(eta.multiply(z[i]).multiply(z[j]))),quantized=exact.map(x=>roundEven(x.numerator*p.scale,x.denominator)),total=quantized.reduce((a,b)=>a+b,0n);let mass=quantized.slice();
  if(total>p.scale){const allocations=quantized.map((q,j)=>({j,mass:q*p.scale/total,remainder:q*p.scale%total}));let left=p.scale-allocations.reduce((a,b)=>a+b.mass,0n);const ranked=[...allocations].sort((a,b)=>a.remainder!==b.remainder?a.remainder>b.remainder?-1:1:compareKeys(labels[a.j],labels[b.j]));for(const a of ranked){if(left===0n)break;a.mass++;left--;}if(left)fail('remainder conservation');mass=allocations.map(a=>a.mass);}
  return {exact,quantized,mass,overflow:total>p.scale,values:mass.map(n=>Q.of(n,p.scale))};
 });return {rows,values:rows.map(row=>row.values)};
}
export function spreadingActivation(labels:readonly string[],weights:readonly (readonly Q[])[],base:readonly Q[],beta:Q,scale:bigint){
 const w=graph(labels,weights);unit(beta);if(beta.compare(one)>=0)fail('beta must be below one');if(typeof scale!=='bigint'||scale<=0n)fail('scale');dense(base);if(base.length!==labels.length)fail('activation dimension');const b=base.map(nonnegative),n=labels.length;
 const a=w.map((row,i)=>row.map((x,j)=>(i===j?one:zero).subtract(beta.multiply(x))));
 for(let k=0;k<n;k++){if(a[k][k].numerator===0n)fail('unexpected zero pivot');for(let i=k+1;i<n;i++){const factor=a[i][k].divide(a[k][k]);for(let j=k;j<n;j++)a[i][j]=a[i][j].subtract(factor.multiply(a[k][j]));b[i]=b[i].subtract(factor.multiply(b[k]));}}
 const exact=Array.from({length:n},()=>zero);for(let i=n-1;i>=0;i--){let rhs=b[i];for(let j=i+1;j<n;j++)rhs=rhs.subtract(a[i][j].multiply(exact[j]));exact[i]=nonnegative(rhs.divide(a[i][i]));}
 return {exact,quantized:exact.map(x=>Q.of(roundEven(x.numerator*scale,x.denominator),scale))};
}
export function presentationAccessibility(history:readonly bigint[],now:bigint,lambda:Q,exponent:number):Q {
 nonnegative(lambda);if(typeof now!=='bigint'||now<0n||!Number.isInteger(exponent)||exponent<1||exponent>16)fail('time/exponent');dense(history);count(history.length);
 let last=-1n;return sum(history.map(at=>{if(typeof at!=='bigint'||at<0n||at>now||at<last)fail('future or unordered presentation');last=at;const denominator=one.add(lambda.multiply(Q.of(now-at)));let power=one;for(let i=0;i<exponent;i++)power=power.multiply(denominator);return one.divide(power);}));
}
export function rankAccessibleEpisodes(episodes:readonly {key:string;retainedKeys:readonly string[];presentations:readonly bigint[]}[],activation:ReadonlyMap<string,Q>,now:bigint,p:{lambda:Q;exponent:number;omegaB:Q;omegaA:Q;k:number}) {
 dense(episodes);presentationAccessibility([],now,p.lambda,p.exponent);
 keys(episodes.map(e=>e.key));keys([...activation.keys()]);for(const value of activation.values())nonnegative(value);nonnegative(p.omegaB);nonnegative(p.omegaA);count(p.k);
 const scored=episodes.map(e=>{keys(e.retainedKeys);if(e.retainedKeys.some(k=>!activation.has(k)))fail('unknown retained key');const base=presentationAccessibility(e.presentations,now,p.lambda,p.exponent),pull=e.retainedKeys.length?sum(e.retainedKeys.map(k=>activation.get(k)!)).divide(Q.of(BigInt(e.retainedKeys.length))):zero;return {key:e.key,base,pull,score:p.omegaB.multiply(base).add(p.omegaA.multiply(pull))};});
 return {scored,selected:[...scored].sort((a,b)=>b.score.compare(a.score)||compareKeys(a.key,b.key)).slice(0,p.k)};
}
