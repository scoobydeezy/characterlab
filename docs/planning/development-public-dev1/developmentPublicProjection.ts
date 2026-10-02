/** Diagnostic assembly only; never an input to a cognitive owner. */
import {type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {chosenData} from '../campaign2/cognitiveChoice';
import {OPTIONS} from './longitudinalModel';
import type {DevelopmentRow,FormationEntry} from './developmentComponent';
const fraction=(v:CanonicalValue)=>{const q=readQ(v);return `${q.numerator}/${q.denominator}`;};
const estimate=(v:CanonicalValue)=>{const xs=items(f(rec(v,1497n),1n),'list');return xs.length?fraction(xs[0]):null;};
export function developmentPublicRows(outputs:readonly CanonicalValue[]):DevelopmentRow[]{
 const rows:DevelopmentRow[]=[],current=new Map<bigint,CanonicalValue>();
 for(const v of outputs){if(typeof v==='boolean'||v.kind!=='record')continue;current.set(v.schema.typeId,v);if(v.schema.typeId!==1507n)continue;
  const get=(n:bigint)=>rec(current.get(n)!,n),formation=get(1507n),learning=get(1506n),execution=get(1504n),report=get(1505n),decision=current.get(1431n),expression=current.get(1433n),qualified=items(f(formation,7n),'list'),entry=items(f(formation,6n),'list'),belief=f(learning,7n),choice=decision?chosenData(f(rec(decision,1431n),3n)):undefined;
  const e=entry.length?rec(entry[0],1498n):undefined,formationEntry:FormationEntry|null=e?{at:Number(uint(f(e,1n))),phase:Number(uint(f(e,2n))),contribution:fraction(f(e,3n)),gain:fraction(f(e,4n)),delta:fraction(f(e,5n))}:null;
  const admitted=items(f(report,2n),'list');rows.push({at:Number(uint(f(formation,1n))),phase:Number(uint(f(formation,2n))),learningGain:fraction(f(learning,3n)),formationGain:fraction(f(formation,3n)),skillBefore:fraction(f(learning,4n)),skillAfter:fraction(f(learning,5n)),attempted:f(execution,2n)===true,executed:f(execution,4n)===true,practiced:f(execution,5n)===true,admittedReport:admitted.length?admitted[0]===true:null,beliefBefore:estimate(f(learning,6n)),beliefAfter:estimate(belief),support:Number(uint(f(rec(belief,1497n),2n))),personalityBefore:fraction(f(formation,4n)),personalityAfter:fraction(f(formation,5n)),chosen:choice?(key(f(choice,1n))===key(OPTIONS[0])?'A':'B'):null,probabilities:choice?items(f(choice,2n),'list').map(x=>fraction(f(rec(x,421n),2n))):[],authorship:choice?fraction(f(choice,7n)):null,contribution:qualified.length?fraction(f(rec(qualified[0],1434n),4n)):'0/1',expression:expression?key(expression):null,journal:key(f(get(1437n),3n)),formationEntry,forcedExecuted:f(execution,7n)===true});current.clear();
 }
 return rows;
}
