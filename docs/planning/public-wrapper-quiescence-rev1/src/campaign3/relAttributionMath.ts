import {list,map,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,qValue,readQ,compileReasonNuclei,readDistribution,analyzeOptions,absolute,expectation} from '../campaign2/cognitiveMath';
import {receivingRecord as old} from './receivingCodecs';
import {relAttributionRecord as r} from './relAttributionCodecs';
import {HOLDERS,TARGETS,OPTIONS,TASKS,type RelAttributionCompiled} from './relAttributionModel';
export const emptyKnowledge=(person=false)=>r(person?1226:1225,[list([])]);
export function learn(prior:CanonicalValue,observation:CanonicalValue,i:number,t:number,person:boolean,law:number){
 const o=rec(observation,1223n),has=(k:bigint)=>items(f(o,k),'list').length>0;
 if(key(f(o,2n))!==key(HOLDERS[i])||key(f(o,3n))!==key(TARGETS[t]))throw Error('REL_ATTRIBUTION_FOREIGN_EVIDENCE');
 if(law===4||(person?!(has(5n)&&has(8n)||has(9n)):!has(5n)||f(o,6n)!==true||!has(7n)))return prior;
 return r(person?1226:1225,[list([...items(f(rec(prior,person?1226n:1225n),1n),'list'),o])]);
}
export function appraise(id:CanonicalValue,at:bigint,i:number,t:number,history:CanonicalValue,person:CanonicalValue,cue:CanonicalValue,law:number,truth?:CanonicalValue){
 const hs=items(f(rec(history,1225n),1n),'list').map(x=>rec(x,1223n)),ps=items(f(rec(person,1226n),1n),'list').map(x=>rec(x,1223n)),episode=f(rec(cue,1224n),5n);
 const linked=(x:CanonicalValue)=>items(episode,'list').length>0&&key(f(rec(x,1223n),5n))===key(episode);
 const vals=(xs:CanonicalValue[],k:bigint)=>xs.flatMap(x=>items(f(rec(x,1223n),k),'list'));
 const value=(xs:CanonicalValue[],first=false)=>xs.length?(xs[first?0:xs.length-1]===true?ONE:ZERO):undefined;
 let harm=value(vals(hs.filter(linked),7n)),cause=value(vals(ps.filter(linked),8n),law===2),will=value(vals(ps,9n));
 if(law===3)cause=will===undefined?undefined:ONE.subtract(will);
 if(law===5){if(!truth)throw Error('REL_ATTRIBUTION_ORACLE');const o=rec(truth,1222n);harm=f(o,5n)===true?ONE:ZERO;cause=f(o,4n)===true?ONE:ZERO;will=f(o,6n)===true?ONE:ZERO;}
 const caution=harm!==undefined&&cause!==undefined?harm.multiply(cause):undefined;
 return r(1230,[id,signed(at),HOLDERS[i],TARGETS[t],history,person,cue,...[harm,cause,will,caution].map(x=>list(x===undefined?[]:[qValue(x)]))]);
}
export function probe(model:RelAttributionCompiled,id:CanonicalValue,app:CanonicalValue,i:number,k:number){
 const lens=items(f(rec(app,1230n),k===0?11n:10n),'list'),signals:CanonicalValue[]=[],empty=old(400,[map([])]),signal=(o:number,role:number,strength:Q)=>old(402,[old(401,[OPTIONS[i][k][o],TASKS[i][k][o],u(role)]),qValue(strength),empty]);
 signals.push(signal(0,1,ONE),signal(1,1,ONE));
 if(model.goal===1&&lens.length){const v=readQ(lens[0]);signals.push(signal(0,3,k===0?ONE.subtract(v.multiply(Q.of(2n))):v.multiply(Q.of(2n)).subtract(ONE)));}
 const nuclei=compileReasonNuclei(signals,f(model.content,5n)),distributions=OPTIONS[i][k].map(option=>{const n=nuclei.find(n=>key(f(rec(f(rec(n,407n),1n),404n),1n))===key(option))!;const distribution=readDistribution(f(rec(n,407n),7n));return {key:option,distribution,reasonMass:absolute(expectation(distribution))};}),analysis=analyzeOptions(distributions,ONE,ONE);
 return r(1231,[id,app,u(k+1),list(signals),list(nuclei),list(analysis.probabilities.map(p=>old(421,[p.key,qValue(p.probability)])))]);
}
