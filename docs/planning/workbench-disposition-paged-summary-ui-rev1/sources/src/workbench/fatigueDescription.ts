import {decodeFatigue} from '../campaign3/fatigueCodecs';
import {list,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {exactText,fromHex} from './canonical';
const integer=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'&&v.kind!=='unsigned')throw Error('FATIGUE description integer');return String(v.value);};
const fraction=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='rational')throw Error('FATIGUE description fraction');return`${v.numerator}/${v.denominator}`;};
const expectation=(v:CanonicalValue|undefined)=>v===undefined?'unknown':f(rec(v,822n),1n)===true?'positive':'negative';
export interface FatigueDescription{sourceIndex:number;kind:string;at:string;human:string;exact:string;}
/** Only public observer bytes enter this renderer. No model label, hidden execution,
 * research trace, current state or later report is used to explain earlier events. */
export function describeFatigueObserver(observerHex:string){
 if(typeof observerHex!=='string'||observerHex.length>32_000_000)throw Error('FATIGUE description byte bound');
 const records=items(decodeFatigue(fromHex(observerHex)),'list'),entries:FatigueDescription[]=[];let lastAt:string|undefined;
 for(const [sourceIndex,value]of records.entries()){
  if(typeof value==='boolean'||value.kind!=='record'||value.schema.schemaVersion!==1n||![826n,827n,1341n,1342n,1343n,1344n,1345n,836n,837n,838n,1339n,1340n,1349n,1352n].includes(value.schema.typeId))throw Error('Not a FATIGUE public observer record');
  const r=value,type=r.schema.typeId;let at='',kind='',human='',projection:CanonicalValue=r;
  if(type===1339n){
   const app=rec(f(r,1n),826n);at=integer(f(app,2n));lastAt=at;kind='Fatigue evaluation';
   human=`At instant ${at}, retained withholding goal active: ${String(f(r,2n))}; maintained withholding goal: ${String(f(r,3n))}; maintained neutral card: ${String(f(r,4n))}; inhibition applied: ${String(f(r,5n))}. Known fatigue: ${String(f(r,8n))}; retained diagnostic grade: ${integer(f(r,9n))}; cognitive impairment applied: ${String(f(r,7n))}. Unknown fatigue is not known rest, even when its diagnostic grade is 0. This appraisal uses prior admitted experience, not the current physical condition. Cue tendency operand ${fraction(f(app,5n))} and reward expectation ${expectation(app.fields.get(6n))} remain separate.`;
  }else if(type===827n){at=integer(f(rec(f(r,2n),826n),2n));kind='Available options';human=`At instant ${at}, ${items(f(r,3n),'list').length} options are admitted. Availability does not select an action or erase acquired history.`;
  }else if(type===1342n){const raw=rec(f(r,2n),1341n),options=rec(f(raw,2n),827n);at=integer(f(rec(f(options,2n),826n),2n));kind='Recorded reasons';human=`At instant ${at}, ${items(f(r,3n),'list').length} reason nuclei are compiled from the recorded inputs. Goal-based withholding and reward expectation remain independent grounds; acquired tendency is not an additional reason bonus.`;
  }else if(type===1343n){at=integer(f(r,2n));kind='Selected intent';projection=list([text('fatigue-safe-choice/0.1'),f(r,1n),f(r,2n),f(r,4n),f(r,5n),f(r,7n)]);human=`At instant ${at}, arbitration mode ${integer(f(r,5n))} selects the recorded option. Exact analytical probabilities and the selected option are retained below. Mechanical draws are excluded; selection does not establish execution, reward or learning.`;
  }else if(type===836n){at=integer(f(r,2n));kind='Admitted outcome evidence';human=`At instant ${at}, observed target performance: ${String(f(r,4n))}; ${r.fields.has(5n)?`admitted reward report: ${f(r,5n)===true?'positive':'negative'}`:'no reward report admitted'}. Missing observed performance does not prove missing physical action.`;
  }else if(type===837n){at=integer(f(rec(f(r,2n),836n),2n));kind='History update';human=`At instant ${at}, history update applied: ${String(f(r,3n))}; retained outcome records: ${items(f(rec(f(r,4n),820n),1n),'list').length} before and ${items(f(rec(f(r,5n),820n),1n),'list').length} after. Fatigue does not erase acquired history; withholding and reward expectation remain separate.`;
  }else if(type===838n){at=integer(f(rec(f(r,2n),836n),2n));kind='Reward expectation';human=`At instant ${at}, expectation update applied: ${String(f(r,3n))}; ${expectation(r.fields.get(4n))} before and ${expectation(r.fields.get(5n))} after. Unknown differs from negative. This describes admitted evidence, not current physical reward.`;
  }else if(type===1340n){if(lastAt===undefined)throw Error('FATIGUE goal update lacks preceding evaluation');at=lastAt;kind='Goal lifecycle';human=`After the evaluation at instant ${at}, retained withholding goal active: ${String(f(rec(f(r,1n),1335n),1n))} before and ${String(f(rec(f(r,2n),1335n),1n))} after. This update affects later evaluations; retirement does not imply unlearning or successful completion.`;
  }else if(type===1349n){at=integer(f(r,2n));kind='Admitted fatigue observation';const grades=items(f(r,3n),'list');human=`At instant ${at}, ${grades.length?'admitted fatigue grade: '+integer(grades[0])+' (0 rested, 1 mild, 2 severe)':'no fatigue grade admitted'}. This sensor report arrives after the current appraisal. It does not establish the physical condition or retroactively explain the current choice.`;
  }else if(type===1352n){const obs=rec(f(r,1n),1349n);at=integer(f(obs,2n));kind='Retained fatigue experience';const before=items(f(rec(f(r,2n),1350n),1n),'list'),after=items(f(rec(f(r,3n),1350n),1n),'list');human=`At instant ${at}, retained fatigue observations: ${before.length} before and ${after.length} after. ${items(f(obs,3n),'list').length?'The admitted grade becomes available to later appraisals.':'Missing feedback preserves the previous experience; it does not establish recovery.'} This describes retained reports, not physiology or endogenous recovery.`;
  }else continue;
  entries.push({sourceIndex,kind,at,human,exact:exactText(projection)});
 }
 return{version:'fatigue-observer-description/0.1',entries,scope:'Descriptions of recorded public evaluations and admitted updates, including retained diagnostic candidates. Not private thought, general fatigue law, physical condition proof or full causal attribution. Entry order and source index refer to this exact observer prefix.'};
}
