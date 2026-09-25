import {list,map,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,qValue,readQ,compileReasonNuclei,readDistribution,analyzeOptions,absolute,expectation} from '../campaign2/cognitiveMath';
import {receivingRecord as old} from './receivingCodecs';
import {relDimensionsRecord as r} from './relDimensionsCodecs';
import {HOLDERS,TARGETS,OPTIONS,TASKS,type RelDimensionsCompiled} from './relDimensionsModel';
export const emptyKnowledge=(person=false)=>r(person?1212:1211,[list([])]);
export function learn(prior:CanonicalValue,observation:CanonicalValue,i:number,t:number,person:boolean,law:number){
 const o=rec(observation,1209n);if(key(f(o,2n))!==key(HOLDERS[i])||key(f(o,3n))!==key(TARGETS[t]))throw Error('REL_DIMENSIONS_FOREIGN_EVIDENCE');
 if(law===4||(person?!items(f(o,7n),'list').length:f(o,5n)!==true||!items(f(o,6n),'list').length))return prior;
 return r(person?1212:1211,[list([...items(f(rec(prior,person?1212n:1211n),1n),'list'),o])]);
}
const mean=(xs:CanonicalValue[])=>xs.length?Q.of(BigInt(xs.filter(x=>x===true).length),BigInt(xs.length)):undefined;
export function appraise(id:CanonicalValue,at:bigint,i:number,t:number,history:CanonicalValue,person:CanonicalValue,cue:CanonicalValue,law:number,truth?:CanonicalValue){
 const hs=items(f(rec(history,1211n),1n),'list').map(x=>rec(x,1209n)),ps=items(f(rec(person,1212n),1n),'list').map(x=>rec(x,1209n));
 const total=hs.flatMap(x=>items(f(x,6n),'list')).reduce((n,v)=>n+uint(v),0n),affection=hs.length?Q.of(total>4n?4n:total,4n):undefined,respect=mean(ps.flatMap(x=>items(f(x,7n),'list'))),trust=mean(hs.flatMap(x=>items(f(x,8n),'list'))),cs=items(f(rec(cue,1210n),5n),'list'),comfort=cs.length?(cs[0]===true?ZERO:ONE):undefined;
 let lenses=[affection,respect,trust,comfort];
 if(law===2){const known=lenses.filter((v):v is Q=>v!==undefined),score=known.length?known.reduce((a,b)=>a.add(b),ZERO).divide(Q.of(BigInt(known.length))):undefined;lenses=[score,score,score,score];}
 if(law===3)lenses=[respect,respect,respect,respect];
 if(law===5){if(!truth)throw Error('REL_DIMENSIONS_ORACLE');const o=rec(truth,1208n);lenses=[Q.of(uint(f(o,3n)),2n),f(o,4n)===true?ONE:ZERO,f(o,5n)===true?ONE:ZERO,f(o,6n)===true?ZERO:ONE];}
 return r(1216,[id,signed(at),HOLDERS[i],TARGETS[t],history,person,cue,...lenses.map(x=>list(x?[qValue(x)]:[]))]);
}
export function probe(model:RelDimensionsCompiled,id:CanonicalValue,app:CanonicalValue,i:number,k:number){
 const lens=items(f(rec(app,1216n),BigInt(8+k)),'list'),signals:CanonicalValue[]=[],empty=old(400,[map([])]),signal=(o:number,role:number,strength:Q)=>old(402,[old(401,[OPTIONS[i][k][o],TASKS[i][k][o],u(role)]),qValue(strength),empty]);
 signals.push(signal(0,1,ONE),signal(1,1,ONE));if(model.goal===1&&lens.length)signals.push(signal(0,3,readQ(lens[0]).multiply(Q.of(2n)).subtract(ONE)));
 const nuclei=compileReasonNuclei(signals,f(model.content,5n)),distributions=OPTIONS[i][k].map(option=>{const n=nuclei.find(n=>key(f(rec(f(rec(n,407n),1n),404n),1n))===key(option))!;const distribution=readDistribution(f(rec(n,407n),7n));return {key:option,distribution,reasonMass:absolute(expectation(distribution))};}),analysis=analyzeOptions(distributions,ONE,ONE);
 return r(1217,[id,app,u(k+1),list(signals),list(nuclei),list(analysis.probabilities.map(p=>old(421,[p.key,qValue(p.probability)])))]);
}
