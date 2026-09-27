/** biological-choice/0.1-candidate; bounded extension, frozen two-option profile untouched. */
import {ExactRational as Q} from '../substrate/exactMath';
import {ONE,ZERO,absolute,bounded,convolve,expectation,readDistribution,readQ,compileReasonNuclei,type Distribution} from '../campaign2/cognitiveMath';
import {receivingRecord as r} from './receivingCodecs';
import {multisourceBase} from './multisourceModelRecipe';
import {ACTOR,sid} from './longitudinalModel';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {dataRecord as rec,dataField as f,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {map,text,typedIdentifier,unsigned as u,rational as q} from '../substrate/canonicalEncoding';
import {RandomRunOracle,randomAddressValue} from '../substrate/random';
export const BIOLOGICAL_CHOICE_VERSION='biological-choice/0.1-candidate';
const str=(v:Q)=>`${v.numerator}/${v.denominator}`;
export interface Ground {option:string;domain:string;strength:number;standing?:number;situation?:number;}
export interface OptionDistribution {name:string;distribution:Distribution;reasonMass:Q;}
export function biologicalProbabilities(options:readonly OptionDistribution[]){
 if(!options.length||options.length>8||new Set(options.map(x=>x.name)).size!==options.length)throw Error('BIO_CHOICE_OPTIONS');
 for(const x of options){if(x.reasonMass.compare(ZERO)<0||[...x.distribution.values()].some(p=>p.compare(ZERO)<=0)||![...x.distribution.values()].reduce((a,b)=>a.add(b),ZERO).equals(ONE))throw Error('BIO_CHOICE_DISTRIBUTION');}
 return options.map((own,i)=>{let probability=ZERO;for(const [score,mass] of own.distribution){let coefficients=[ONE];for(const [j,other] of options.entries()){if(j===i)continue;let less=ZERO,equal=ZERO;for(const [s,p] of other.distribution){if(s<score)less=less.add(p);else if(s===score)equal=equal.add(p);}const next=Array.from({length:coefficients.length+1},()=>ZERO);for(const [k,v] of coefficients.entries()){next[k]=next[k].add(v.multiply(less));next[k+1]=next[k+1].add(v.multiply(equal));}coefficients=next;}const win=coefficients.reduce((v,c,k)=>v.add(c.divide(Q.of(BigInt(k+1)))),ZERO);probability=probability.add(mass.multiply(win));}return {name:own.name,probability};});
}
const cache=new Map<string,ReturnType<typeof biologicalProbabilities>>();
const baseDefinition=multisourceBase(),nucleusCache=new Map<string,ReturnType<typeof compileReasonNuclei>>();
export async function biologicalChoice(options:readonly string[],grounds:readonly Ground[],at:number,seed:number){
 if(options.length>8||grounds.length>32||new Set(options).size!==options.length||!Number.isSafeInteger(at)||at<1||!Number.isInteger(seed)||seed<0||seed>255)throw Error('BIO_CHOICE_DOMAIN');
 const valid=(s:string)=>/^[a-z][a-z0-9-]{0,31}$/.test(s);if(options.some(o=>!valid(o)))throw Error('BIO_CHOICE_NAME');const seen=new Set<string>(),definition=baseDefinition.get('task-reason-dice'),arb=rec(baseDefinition.get('task-arbitration'),440n);
 const nuclei=grounds.flatMap(g=>{if(!options.includes(g.option)||!valid(g.domain)||!Number.isInteger(g.strength)||Math.abs(g.strength)>1000||seen.has(g.option+'/'+g.domain)||[g.standing??0,g.situation??0].some(x=>!Number.isInteger(x)||Math.abs(x)>1000))throw Error('BIO_CHOICE_GROUND');seen.add(g.option+'/'+g.domain);
  const signature=JSON.stringify([g.option,g.domain,g.strength,g.situation??0,g.standing??0]);let compiled=nucleusCache.get(signature);if(!compiled){const option=r(395,[ACTOR,sid(1027,'action/biology/'+g.option)]),task=r(371,[ACTOR,semanticReferentFromAuthoredContent(sid(1038,'content/biology/'+g.domain))]);
  const signals=[g.strength,g.situation??0,g.standing??0].map((v,i)=>r(402,[r(401,[option,task,u(i+1)]),q(v,1000),r(400,[map([])])]));compiled=compileReasonNuclei(signals,definition);if(nucleusCache.size>4096)nucleusCache.clear();nucleusCache.set(signature,compiled);}return compiled.map(value=>({option:g.option,domain:g.domain,value}));
 }).sort((a,b)=>key(a.value).localeCompare(key(b.value),'en'));
 if(!options.length||!nuclei.length)return {chosen:null,mode:'NoActiveReasons',probabilities:[] as {name:string;probability:string}[],nuclei:[] as string[],draws:[] as {address:string;result:number;span:number}[],authorship:'0/1'};
 const distributions=options.slice().sort().map(name=>{let distribution=new Map([[0n,ONE]]),reasonMass=ZERO;for(const n of nuclei.filter(n=>n.option===name)){const d=readDistribution(f(rec(n.value,407n),7n));distribution=convolve(distribution,d);reasonMass=reasonMass.add(absolute(expectation(d)));}return {name,distribution,reasonMass};});
 const signature=JSON.stringify(distributions.map(o=>[o.name,[...o.distribution].map(([s,p])=>[String(s),str(p)])]));let probabilities=cache.get(signature);if(!probabilities){probabilities=biologicalProbabilities(distributions);if(cache.size>2048)cache.clear();cache.set(signature,probabilities);}
 const ranked=probabilities.slice().sort((a,b)=>b.probability.compare(a.probability)||(a.name<b.name?-1:1)),margin=ranked[0].probability.subtract(ranked[1]?.probability??ZERO),contest=ONE.subtract(margin),masses=ranked.slice(0,2).map(p=>distributions.find(o=>o.name===p.name)!.reasonMass),mass=masses.length<2?ZERO:masses[0].compare(masses[1])<0?masses[0]:masses[1],authorship=contest.multiply(bounded(mass)),mode=contest.compare(readQ(f(arb,1n)))<0?'Auto':authorship.compare(readQ(f(arb,2n)))>=0?'PlayerFacingRoll':'QuietRoll';
 const oracle=new RandomRunOracle(new Uint8Array(32).fill(seed)),draws:{address:string;result:number;span:number}[]=[],atom=(n:number,s:string)=>typedIdentifier(n,text(s));
 async function draw(span:bigint,purpose:string,option?:string,domain?:string){const bindings=[{subjectRoleId:atom(1043,'subject/actor'),subjectId:ACTOR}];if(option)bindings.push({subjectRoleId:atom(1043,'subject/action'),subjectId:sid(1027,'action/biology/'+option)});if(domain)bindings.push({subjectRoleId:atom(1043,'subject/task'),subjectId:semanticReferentFromAuthoredContent(sid(1038,'content/biology/'+domain))});const address={causalRootId:typedIdentifier(1135,u(at)),purposeId:atom(1042,purpose),subjectBindings:bindings,drawIndex:0n};const d=await oracle.drawBounded(address,span);draws.push({address:key(randomAddressValue(address)),result:Number(d.result),span:Number(span)});return d.result;}
 let chosen=ranked[0].name;if(mode!=='Auto'){const scores=new Map(options.map(o=>[o,0n]));for(const n of nuclei){const v=rec(n.value,407n),nk=rec(f(v,1n),404n),h=f(v,5n),x=f(v,6n);if(typeof h==='boolean'||h.kind!=='signed'||typeof x==='boolean'||x.kind!=='signed')throw Error('BIO_CHOICE_MODIFIER');const face=await draw(uint(f(v,4n)),'purpose/task-reason-face',n.option,n.domain),score=(face+1n+h.value+x.value)*(uint(f(nk,4n))===1n?1n:-1n);scores.set(n.option,scores.get(n.option)!+score);}const best=[...scores.values()].reduce((a,b)=>a>b?a:b),leaders=options.filter(o=>scores.get(o)===best).sort();chosen=leaders.length===1?leaders[0]:leaders[Number(await draw(BigInt(leaders.length),'purpose/task-decision-tie'))];}
 return {chosen,mode,probabilities:probabilities.map(p=>({name:p.name,probability:str(p.probability)})),nuclei:nuclei.map(n=>key(n.value)),draws,authorship:str(authorship)};
}
