/** Independent qualification oracle; not a character-side law or production writer. */
export function expectedStanding(contributions:readonly string[]){
 let support=0n,opposition=0n;
 for(const fraction of contributions){
  const match=/^(-?\d+)\/(\d+)$/.exec(fraction);if(!match)throw Error('REFERENCE_FRACTION');let n=BigInt(match[1]);const d=BigInt(match[2]);if(d<=0n)throw Error('REFERENCE_DENOMINATOR');const negative=n<0n;if(negative)n=-n;
  const prior=negative?opposition:support,scaled=prior*d+n*1000000n,whole=scaled/d,remainder=scaled%d;
  const rounded=whole+(2n*remainder>d||2n*remainder===d&&whole%2n===1n?1n:0n);
  if(negative)opposition=rounded;else support=rounded;
 }
 let n=support-opposition,d=1000000n+support+opposition,a=n<0n?-n:n,b=d;while(b){const t=a%b;a=b;b=t;}n/=a;d/=a;return `${n}/${d}`;
}
