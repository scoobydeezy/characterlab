import {list,map,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,qValue,readQ,compileReasonNuclei,readDistribution,analyzeOptions,absolute,expectation} from '../campaign2/cognitiveMath';
import {receivingRecord as old} from './receivingCodecs';
import {griefRecord as r} from './griefCodecs';
import {HOLDERS,TARGETS,OPTIONS,TASKS,type GriefCompiled} from './griefModel';
export const emptyKnowledge=(person=false)=>r(person?1283:1282,[list([])]);
export function learn(prior:CanonicalValue,observation:CanonicalValue,i:number,t:number,person:boolean,law:number){
 const o=rec(observation,1280n);if(key(f(o,2n))!==key(HOLDERS[i])||key(f(o,3n))!==key(TARGETS[t]))throw Error('GRIEF_FOREIGN_EVIDENCE');
 const support=items(f(o,6n),'list').length>0,future=items(f(o,10n),'list').length>0;
 if(person?!(support||future):!support||law===4||f(o,5n)!==true)return prior;
 return r(person?1283:1282,[list([...items(f(rec(prior,person?1283n:1282n),1n),'list'),o])]);
}
export function appraise(id:CanonicalValue,at:bigint,i:number,t:number,history:CanonicalValue,person:CanonicalValue,cue:CanonicalValue,law:number,truth?:CanonicalValue){
 const hs=items(f(rec(history,1282n),1n),'list').map(x=>rec(x,1280n)),ps=items(f(rec(person,1283n),1n),'list').map(x=>rec(x,1280n)),c=rec(cue,1281n),v=(o:CanonicalValue,k:bigint)=>items(f(rec(o,1280n),k),'list')[0];
 const n=hs.filter(o=>uint(v(o,6n))>0n&&v(o,7n)===true&&(v(o,8n)===true&&v(o,9n)===true)).length;
 let bond:Q|undefined=Q.of(BigInt(Math.min(n,2)),2n);
 const supportSamples=ps.filter(o=>items(f(o,6n),'list').length);
 const expected=supportSamples.length?supportSamples.reduce((a,o)=>a.add(v(o,7n)===true?Q.of(uint(v(o,6n)),2n):ZERO),ZERO).divide(Q.of(BigInt(supportSamples.length))):undefined;
 const flag=(k:bigint)=>{const a=items(f(c,k),'list');return a.length?(a[0]===true?ONE:ZERO):undefined;};
 let present=flag(5n);const alternative=flag(6n),demand=flag(7n),utility=expected!==undefined&&alternative!==undefined&&demand!==undefined?expected.multiply(demand).multiply(ONE.subtract(alternative)):undefined;
 const claims=ps.flatMap(o=>items(f(o,10n),'list'));let future=law!==6&&claims.length?Q.of(uint(claims[claims.length-1]),2n):undefined;
 if(law===3)bond=utility;
 if(law===5){if(!truth)throw Error('GRIEF_ORACLE');const o=rec(truth,1279n);present=f(o,6n)===true?ONE:ZERO;future=Q.of(uint(f(o,23n)),2n);}
 const missing=bond!==undefined&&present!==undefined?bond.multiply(ONE.subtract(present)):undefined;
 const loss=law===2?missing:missing!==undefined&&future!==undefined?missing.multiply(ONE.subtract(future)):undefined,reunion=law===2?missing:missing!==undefined&&future!==undefined?missing.multiply(future):undefined;
 return r(1287,[id,signed(at),HOLDERS[i],TARGETS[t],history,person,cue,...[bond,expected,loss,reunion,future,missing,utility].map(x=>list(x===undefined?[]:[qValue(x)]))]);
}
export function probe(model:GriefCompiled,id:CanonicalValue,app:CanonicalValue,i:number,k:number){
 const lens=items(f(rec(app,1287n),BigInt(10+k)),'list'),signals:CanonicalValue[]=[],empty=old(400,[map([])]),signal=(o:number,role:number,strength:Q)=>old(402,[old(401,[OPTIONS[i][k][o],TASKS[i][k][o],u(role)]),qValue(strength),empty]);
 signals.push(signal(0,1,ONE),signal(1,1,ONE));if(model.goal===1&&lens.length)signals.push(signal(0,3,readQ(lens[0])));
 const nuclei=compileReasonNuclei(signals,f(model.content,5n)),distributions=OPTIONS[i][k].map(option=>{const n=nuclei.find(n=>key(f(rec(f(rec(n,407n),1n),404n),1n))===key(option))!;const distribution=readDistribution(f(rec(n,407n),7n));return {key:option,distribution,reasonMass:absolute(expectation(distribution))};}),analysis=analyzeOptions(distributions,ONE,ONE);
 return r(1288,[id,app,u(k+1),list(signals),list(nuclei),list(analysis.probabilities.map(p=>old(421,[p.key,qValue(p.probability)])))]);
}
