import {list,map,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,qValue,readQ,compileReasonNuclei,readDistribution,analyzeOptions,absolute,expectation} from '../campaign2/cognitiveMath';
import {receivingRecord as old} from './receivingCodecs';
import {familiarValenceRecord as r} from './familiarValenceCodecs';
import {HOLDERS,TARGETS,OPTIONS,TASKS,type FamiliarValenceCompiled} from './familiarValenceModel';
export const emptyKnowledge=(memory=false)=>r(memory?1240:1239,[list([])]);
export function learn(prior:CanonicalValue,observation:CanonicalValue,i:number,t:number,memory:boolean,law:number){
 const o=rec(observation,1237n),has=(k:bigint)=>items(f(o,k),'list').length>0;
 if(key(f(o,2n))!==key(HOLDERS[i])||key(f(o,3n))!==key(TARGETS[t]))throw Error('FAMILIAR_VALENCE_FOREIGN_EVIDENCE');
 if(memory?(law===4||!has(6n)&&!has(7n)):f(o,5n)!==true||!has(8n)||!has(9n))return prior;
 return r(memory?1240:1239,[list([...items(f(rec(prior,memory?1240n:1239n),1n),'list'),o])]);
}
export function appraise(id:CanonicalValue,at:bigint,i:number,t:number,history:CanonicalValue,memory:CanonicalValue,cue:CanonicalValue,law:number,truth?:CanonicalValue){
 const hs=items(f(rec(history,1239n),1n),'list').map(x=>rec(x,1237n)),ms=items(f(rec(memory,1240n),1n),'list').map(x=>rec(x,1237n)),c=rec(cue,1238n);
 const comparisons=ms.map(o=>{let equal=0,unequal=0;for(const k of [5n,6n]){const a=items(f(c,k),'list'),b=items(f(o,k+1n),'list');if(a.length&&b.length){if(a[0]===b[0])equal++;else unequal++;}}const compared=equal+unequal,similarity=compared?Q.of(BigInt(equal),BigInt(compared)):undefined;return {equal,unequal,similarity,record:r(1249,[f(o,1n),u(equal),u(unequal),u(compared),list(similarity?[qValue(similarity)]:[])])};});
 const hasCurrent=[5n,6n].some(k=>items(f(c,k),'list').length),eligible=comparisons.filter(x=>x.similarity!==undefined);
 let maximum:Q|undefined,status=hasCurrent?(ms.length?2:1):0;
 if(hasCurrent&&eligible.length){maximum=eligible.reduce((a,x)=>x.similarity!.compare(a)>0?x.similarity!:a,eligible[0].similarity!);const wins=eligible.filter(x=>x.similarity!.compare(maximum!)===0),familiar=law===6?eligible.some(x=>x.equal===2):maximum.compare(ZERO)>0;status=familiar?(wins.some(x=>x.unequal>0)?5:4):3;}
 let valence=hs.length?hs.reduce((a,o)=>a.add(Q.of(uint(items(f(o,8n),'list')[0])-uint(items(f(o,9n),'list')[0]),2n)),ZERO).divide(Q.of(BigInt(hs.length))):undefined;
 if(law===2)valence=maximum===undefined?undefined:maximum.multiply(Q.of(2n)).subtract(ONE);
 if(law===3){maximum=undefined;status=0;}
 if(law===5){if(!truth)throw Error('FAMILIAR_VALENCE_ORACLE');const o=rec(truth,1236n);valence=Q.of(uint(f(o,3n))-uint(f(o,4n)),2n);}
 return r(1244,[id,signed(at),HOLDERS[i],TARGETS[t],history,memory,cue,list(maximum?[qValue(maximum)]:[]),list(valence?[qValue(valence)]:[]),u(status),list(law===3?[]:comparisons.map(x=>x.record))]);
}
export function probe(model:FamiliarValenceCompiled,id:CanonicalValue,app:CanonicalValue,i:number,k:number){
 const lens=items(f(rec(app,1244n),9n),'list'),signals:CanonicalValue[]=[],empty=old(400,[map([])]),signal=(o:number,role:number,strength:Q)=>old(402,[old(401,[OPTIONS[i][k][o],TASKS[i][k][o],u(role)]),qValue(strength),empty]);
 signals.push(signal(0,1,ONE),signal(1,1,ONE));if(model.goal===1&&lens.length)signals.push(signal(0,3,readQ(lens[0])));
 const nuclei=compileReasonNuclei(signals,f(model.content,5n)),distributions=OPTIONS[i][k].map(option=>{const n=nuclei.find(n=>key(f(rec(f(rec(n,407n),1n),404n),1n))===key(option))!;const distribution=readDistribution(f(rec(n,407n),7n));return {key:option,distribution,reasonMass:absolute(expectation(distribution))};}),analysis=analyzeOptions(distributions,ONE,ONE);
 return r(1245,[id,app,u(1),list(signals),list(nuclei),list(analysis.probabilities.map(p=>old(421,[p.key,qValue(p.probability)])))]);
}
