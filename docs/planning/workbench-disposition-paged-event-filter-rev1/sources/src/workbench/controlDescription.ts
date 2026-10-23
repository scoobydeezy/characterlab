import {decodeControl} from '../campaign3/controlCodecs';
import {list,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {exactText,fromHex} from './canonical';
const integer=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'&&v.kind!=='unsigned')throw Error('CONTROL description integer');return String(v.value);};
const fraction=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='rational')throw Error('CONTROL description fraction');return`${v.numerator}/${v.denominator}`;};
const expectation=(v:CanonicalValue|undefined)=>v===undefined?'unknown':f(rec(v,822n),1n)===true?'positive':'negative';
export interface ControlDescription{sourceIndex:number;kind:string;at:string;human:string;exact:string;}
/** Only public observer bytes enter this renderer. No model label, hidden execution,
 * research trace, current state or later report is used to explain earlier events. */
export function describeControlObserver(observerHex:string){
 if(typeof observerHex!=='string'||observerHex.length>32_000_000)throw Error('CONTROL description byte bound');
 const records=items(decodeControl(fromHex(observerHex)),'list'),entries:ControlDescription[]=[];let lastAt:string|undefined;
 for(const [sourceIndex,value]of records.entries()){
  if(typeof value==='boolean'||value.kind!=='record'||value.schema.schemaVersion!==1n||![826n,827n,1017n,1018n,1019n,1020n,1021n,836n,837n,838n,1015n,1016n].includes(value.schema.typeId))throw Error('Not a CONTROL public observer record');
  const r=value,type=r.schema.typeId;let at='',kind='',human='',projection:CanonicalValue=r;
  if(type===1015n){
   const app=rec(f(r,1n),826n);at=integer(f(app,2n));lastAt=at;kind='Control evaluation';
   human=`At instant ${at}, retained withholding goal active: ${String(f(r,2n))}; effective goal access reported by this candidate: ${String(f(r,3n))}; maintained neutral card: ${String(f(r,4n))}; inhibition applied: ${String(f(r,5n))}. Effective access is not proof of actual workspace maintenance: the RetainedEqualsMaintained control deliberately conflates them. Cue tendency operand ${fraction(f(app,5n))} and reward expectation ${expectation(app.fields.get(6n))} remain separate.`;
  }else if(type===827n){at=integer(f(rec(f(r,2n),826n),2n));kind='Available options';human=`At instant ${at}, ${items(f(r,3n),'list').length} options are admitted. Availability does not select an action or erase acquired history.`;
  }else if(type===1018n){const raw=rec(f(r,2n),1017n),options=rec(f(raw,2n),827n);at=integer(f(rec(f(options,2n),826n),2n));kind='Recorded reasons';human=`At instant ${at}, ${items(f(r,3n),'list').length} reason nuclei are compiled from the recorded inputs. Goal-based withholding and reward expectation remain independent grounds; acquired tendency is not an additional reason bonus.`;
  }else if(type===1019n){at=integer(f(r,2n));kind='Selected intent';projection=list([text('control-safe-choice/0.1'),f(r,1n),f(r,2n),f(r,4n),f(r,5n),f(r,7n)]);human=`At instant ${at}, arbitration mode ${integer(f(r,5n))} selects the recorded option. Exact analytical probabilities and the selected option are retained below. Mechanical draws are excluded; selection does not establish execution, reward or learning.`;
  }else if(type===836n){at=integer(f(r,2n));kind='Admitted outcome evidence';human=`At instant ${at}, observed target performance: ${String(f(r,4n))}; ${r.fields.has(5n)?`admitted reward report: ${f(r,5n)===true?'positive':'negative'}`:'no reward report admitted'}. Missing observed performance does not prove missing physical action.`;
  }else if(type===837n){at=integer(f(rec(f(r,2n),836n),2n));kind='History update';human=`At instant ${at}, history update applied: ${String(f(r,3n))}; retained outcome records: ${items(f(rec(f(r,4n),820n),1n),'list').length} before and ${items(f(rec(f(r,5n),820n),1n),'list').length} after. A reduction in records is not successful resistance or evidence that the original learning never occurred.`;
  }else if(type===838n){at=integer(f(rec(f(r,2n),836n),2n));kind='Reward expectation';human=`At instant ${at}, expectation update applied: ${String(f(r,3n))}; ${expectation(r.fields.get(4n))} before and ${expectation(r.fields.get(5n))} after. Unknown differs from negative. This describes admitted evidence, not current physical reward.`;
  }else if(type===1016n){if(lastAt===undefined)throw Error('CONTROL goal update lacks preceding evaluation');at=lastAt;kind='Goal lifecycle';human=`After the evaluation at instant ${at}, retained withholding goal active: ${String(f(rec(f(r,1n),1011n),1n))} before and ${String(f(rec(f(r,2n),1011n),1n))} after. This update affects later evaluations; retirement does not imply unlearning or successful completion.`;
  }else continue;
  entries.push({sourceIndex,kind,at,human,exact:exactText(projection)});
 }
 return{version:'control-observer-description/0.1',entries,scope:'Descriptions of recorded public evaluations and admitted updates, including retained diagnostic controls. Not private thought, general control law, actual workspace proof or full causal attribution. Entry order and source index refer to this exact observer prefix.'};
}
