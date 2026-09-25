import {list,map,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,qValue,readQ,compileReasonNuclei,readDistribution,analyzeOptions,absolute,expectation} from '../campaign2/cognitiveMath';
import {receivingRecord as old} from './receivingCodecs';
import {attachmentRecord as r} from './attachmentCodecs';
import {HOLDERS,TARGETS,OPTIONS,TASKS,type AttachmentCompiled} from './attachmentModel';
export const emptyKnowledge=(person=false)=>r(person?1255:1254,[list([])]);
export function learn(prior:CanonicalValue,observation:CanonicalValue,i:number,t:number,person:boolean,law:number){
 const o=rec(observation,1252n);if(key(f(o,2n))!==key(HOLDERS[i])||key(f(o,3n))!==key(TARGETS[t]))throw Error('ATTACHMENT_FOREIGN_EVIDENCE');
 if(!items(f(o,6n),'list').length||!person&&(law===4||f(o,5n)!==true))return prior;
 return r(person?1255:1254,[list([...items(f(rec(prior,person?1255n:1254n),1n),'list'),o])]);
}
export function appraise(id:CanonicalValue,at:bigint,i:number,t:number,history:CanonicalValue,person:CanonicalValue,cue:CanonicalValue,law:number,truth?:CanonicalValue){
 const hs=items(f(rec(history,1254n),1n),'list').map(x=>rec(x,1252n)),ps=items(f(rec(person,1255n),1n),'list').map(x=>rec(x,1252n)),c=rec(cue,1253n),v=(o:CanonicalValue,k:bigint)=>items(f(rec(o,1252n),k),'list')[0];
 const n=hs.filter(o=>uint(v(o,6n))>0n&&v(o,7n)===true&&(law===2||v(o,8n)===true&&v(o,9n)===true)).length;
 let bond:Q|undefined=Q.of(BigInt(Math.min(n,2)),2n);
 const expected=ps.length?ps.reduce((a,o)=>a.add(v(o,7n)===true?Q.of(uint(v(o,6n)),2n):ZERO),ZERO).divide(Q.of(BigInt(ps.length))):undefined;
 const flag=(k:bigint)=>{const a=items(f(c,k),'list');return a.length?(a[0]===true?ONE:ZERO):undefined;};
 let present=flag(5n);const alternative=flag(6n),demand=flag(7n),utility=expected!==undefined&&alternative!==undefined&&demand!==undefined?expected.multiply(demand).multiply(ONE.subtract(alternative)):undefined;
 if(law===3)bond=utility;
 if(law===5){if(!truth)throw Error('ATTACHMENT_ORACLE');const o=rec(truth,1251n);bond=Q.of(uint(f(o,3n)),2n);present=f(o,6n)===true?ONE:ZERO;}
 const missing=bond!==undefined&&present!==undefined?bond.multiply(ONE.subtract(present)):undefined;
 return r(1259,[id,signed(at),HOLDERS[i],TARGETS[t],history,person,cue,...[bond,expected,missing,utility].map(x=>list(x===undefined?[]:[qValue(x)]))]);
}
export function probe(model:AttachmentCompiled,id:CanonicalValue,app:CanonicalValue,i:number,k:number){
 const lens=items(f(rec(app,1259n),BigInt(10+k)),'list'),signals:CanonicalValue[]=[],empty=old(400,[map([])]),signal=(o:number,role:number,strength:Q)=>old(402,[old(401,[OPTIONS[i][k][o],TASKS[i][k][o],u(role)]),qValue(strength),empty]);
 signals.push(signal(0,1,ONE),signal(1,1,ONE));if(model.goal===1&&lens.length)signals.push(signal(0,3,readQ(lens[0])));
 const nuclei=compileReasonNuclei(signals,f(model.content,5n)),distributions=OPTIONS[i][k].map(option=>{const n=nuclei.find(n=>key(f(rec(f(rec(n,407n),1n),404n),1n))===key(option))!;const distribution=readDistribution(f(rec(n,407n),7n));return {key:option,distribution,reasonMass:absolute(expectation(distribution))};}),analysis=analyzeOptions(distributions,ONE,ONE);
 return r(1260,[id,app,u(k+1),list(signals),list(nuclei),list(analysis.probabilities.map(p=>old(421,[p.key,qValue(p.probability)])))]);
}
