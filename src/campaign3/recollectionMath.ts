import {list,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint} from '../campaign2/canonicalData';
import {recollectionRecord as r} from './recollectionCodecs';
export const emptyMemory=()=>r(1044,[list([])]),emptySummary=()=>r(1047,[list([])]);
export function recollect(memory:CanonicalValue,summary:CanonicalValue,law:number,at:bigint,query:bigint,id:CanonicalValue,oracle?:boolean){
 const episode=items(f(rec(memory,1044n),1n),'list').map(v=>rec(v,1043n)).find(v=>uint(f(v,3n))===query);
 let status=0,category:readonly CanonicalValue[]=[],detail:readonly CanonicalValue[]=[],episodeRefs:readonly CanonicalValue[]=[],summaryRefs:readonly CanonicalValue[]=[];
 if(episode){category=[f(episode,4n)];detail=items(f(episode,5n),'list');episodeRefs=[f(episode,1n)];status=detail.length?1:2;
  if(!detail.length&&law!==2){const bucket=items(f(rec(summary,1047n),1n),'list').map(v=>rec(v,1046n)).find(v=>uint(f(v,1n))===uint(f(episode,4n)));
   if(law===4&&oracle!==undefined){detail=[oracle];status=3;}
   else if(bucket&&uint(f(bucket,2n))!==uint(f(bucket,3n))){detail=[uint(f(bucket,3n))>uint(f(bucket,2n))];status=3;summaryRefs=items(f(bucket,4n),'list');}
  }
 }
 return r(1049,[id,signed(at),u(query),u(status),list(category),list(detail),list(episodeRefs),list(summaryRefs)]);
}
export function consolidate(memory:CanonicalValue,summary:CanonicalValue,observation:CanonicalValue,recall:CanonicalValue,law:number,at:bigint){
 const obs=rec(observation,1042n),out=rec(recall,1049n),fragments=items(f(rec(memory,1044n),1n),'list').map(v=>rec(v,1043n)).map(v=>{
  const t=f(v,2n);if(typeof t==='boolean'||t.kind!=='signed')throw Error('RECOLLECTION_TIME');
  let detail=f(v,5n);if(law!==3&&at-t.value>=3n)detail=list([]);
  if(law===5&&uint(f(out,4n))===3n&&uint(f(out,3n))===uint(f(v,3n)))detail=f(out,6n);
  return r(1043,[f(v,1n),f(v,2n),f(v,3n),f(v,4n),detail]);
 });
 const buckets=items(f(rec(summary,1047n),1n),'list').map(v=>rec(v,1046n));
 if(uint(f(obs,5n))>0n){fragments.push(r(1043,[f(obs,1n),f(obs,3n),f(obs,4n),f(obs,5n),f(obs,6n)]));const detail=items(f(obs,6n),'list');
  if(detail.length){const category=uint(f(obs,5n)),index=buckets.findIndex(v=>uint(f(v,1n))===category),prior=index<0?undefined:buckets[index],no=prior?uint(f(prior,2n)):0n,yes=prior?uint(f(prior,3n)):0n,refs=prior?items(f(prior,4n),'list'):[];
   const next=r(1046,[u(category),u(no+(detail[0]===false?1n:0n)),u(yes+(detail[0]===true?1n:0n)),list([...refs,f(obs,1n)])]);if(index<0)buckets.push(next);else buckets[index]=next;
  }
 }
 buckets.sort((a,b)=>Number(uint(f(a,1n))-uint(f(b,1n))));return {memory:r(1044,[list(fragments)]),summary:r(1047,[list(buckets)])};
}
