import {list,map,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,qValue,readQ,compileReasonNuclei,readDistribution,analyzeOptions,absolute,expectation} from '../campaign2/cognitiveMath';
import {receivingRecord as old} from './receivingCodecs';
import {betrayalRecord as r} from './betrayalCodecs';
import {HOLDERS,TARGETS,OPTIONS,TASKS,type BetrayalCompiled} from './betrayalModel';
export const emptyKnowledge=(person=false)=>r(person?1269:1268,[list([])]);
export function learn(prior:CanonicalValue,observation:CanonicalValue,i:number,t:number,person:boolean,law:number){
 const o=rec(observation,1266n),has=(k:bigint)=>items(f(o,k),'list').length>0;
 if(key(f(o,2n))!==key(HOLDERS[i])||key(f(o,3n))!==key(TARGETS[t]))throw Error('BETRAYAL_FOREIGN_EVIDENCE');
 if(law===4||(person?!(has(5n)&&(has(8n)||has(11n))||has(9n)):!has(5n)||f(o,6n)!==true||!(has(7n)||has(10n))))return prior;
 return r(person?1269:1268,[list([...items(f(rec(prior,person?1269n:1268n),1n),'list'),o])]);
}
export function appraise(id:CanonicalValue,at:bigint,i:number,t:number,history:CanonicalValue,person:CanonicalValue,cue:CanonicalValue,law:number,truth?:CanonicalValue){
 const hs=items(f(rec(history,1268n),1n),'list').map(x=>rec(x,1266n)),ps=items(f(rec(person,1269n),1n),'list').map(x=>rec(x,1266n)),episode=f(rec(cue,1267n),5n);
 const linked=(x:CanonicalValue)=>items(episode,'list').length>0&&key(f(rec(x,1266n),5n))===key(episode);
 const vals=(xs:CanonicalValue[],k:bigint)=>xs.flatMap(x=>items(f(rec(x,1266n),k),'list'));
 const value=(xs:CanonicalValue[])=>xs.length?(xs[xs.length-1]===true?ONE:ZERO):undefined;
 const incident=hs.filter(linked),outcome=incident.find(o=>items(f(o,7n),'list').length),time=(o:CanonicalValue)=>{const v=f(rec(o,1266n),4n);if(typeof v==='boolean'||v.kind!=='signed')throw Error('BETRAYAL_TIME');return v.value;};
 const commitment=outcome?value(vals(incident.filter(o=>time(o)<time(outcome)),10n)):undefined;
 let failure=outcome?value(items(f(outcome,7n),'list')):undefined,intent=value(vals(ps.filter(linked),8n)),will=value(vals(ps,9n)),control=value(vals(ps.filter(linked),11n));
 if(law===5){if(!truth)throw Error('BETRAYAL_ORACLE');const o=rec(truth,1265n);failure=f(o,5n)===true?ONE:ZERO;intent=f(o,4n)===true?ONE:ZERO;will=f(o,6n)===true?ONE:ZERO;control=f(o,24n)===true?ONE:ZERO;}
 const conjunction=(vs:(Q|undefined)[])=>vs.some(v=>v?.numerator===0n)?ZERO:vs.some(v=>v===undefined)?undefined:ONE;
 const betrayal=conjunction(law===2?[commitment,failure]:law===3?[commitment,failure,will===undefined?undefined:ONE.subtract(will)]:[commitment,failure,intent,control]);
 return r(1273,[id,signed(at),HOLDERS[i],TARGETS[t],history,person,cue,...[failure,intent,will,betrayal,commitment,control].map(x=>list(x===undefined?[]:[qValue(x)]))]);
}
export function probe(model:BetrayalCompiled,id:CanonicalValue,app:CanonicalValue,i:number,k:number){
 const lens=items(f(rec(app,1273n),k===0?11n:10n),'list'),signals:CanonicalValue[]=[],empty=old(400,[map([])]),signal=(o:number,role:number,strength:Q)=>old(402,[old(401,[OPTIONS[i][k][o],TASKS[i][k][o],u(role)]),qValue(strength),empty]);
 signals.push(signal(0,1,ONE),signal(1,1,ONE));
 if(model.goal===1&&lens.length){const v=readQ(lens[0]);signals.push(signal(0,3,k===0?v:v.multiply(Q.of(2n)).subtract(ONE)));}
 const nuclei=compileReasonNuclei(signals,f(model.content,5n)),distributions=OPTIONS[i][k].map(option=>{const n=nuclei.find(n=>key(f(rec(f(rec(n,407n),1n),404n),1n))===key(option))!;const distribution=readDistribution(f(rec(n,407n),7n));return {key:option,distribution,reasonMass:absolute(expectation(distribution))};}),analysis=analyzeOptions(distributions,ONE,ONE);
 return r(1274,[id,app,u(k+1),list(signals),list(nuclei),list(analysis.probabilities.map(p=>old(421,[p.key,qValue(p.probability)])))]);
}
