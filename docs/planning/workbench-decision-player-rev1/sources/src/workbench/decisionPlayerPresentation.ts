import {OPTIONS,TASKS} from '../campaign3/decisionModel';
import {dataRecord,dataField} from '../campaign2/canonicalData';
import {readable} from './canonical';
const stable=(v:unknown):string=>v===null||typeof v!=='object'?JSON.stringify(v):Array.isArray(v)?'['+v.map(stable).join(',')+']':'{'+Object.entries(v).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([k,x])=>JSON.stringify(k)+':'+stable(x)).join(',')+'}';
type R=Record<string,unknown>;
function record(v:unknown,name:string,required:string[],optional:string[]=[]):R{if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Invalid player record');const r=v as R;if(r.record!==name||required.some(k=>!Object.hasOwn(r,k))||Object.keys(r).some(k=>k!=='record'&&!required.includes(k)&&!optional.includes(k)))throw Error('Unsupported player record fields');return r;}
const options=OPTIONS.map(v=>stable(readable(v))),grounds=TASKS.map(v=>stable(readable(dataField(dataRecord(v,371n),2n))));
const option=(v:unknown)=>{const i=options.indexOf(stable(v));if(i<0)throw Error('Unknown player option');return `option ${i===0?'A':'B'}`;};
const int=(v:unknown)=>{if(typeof v!=='string'||v.length>64||! /^-?(0|[1-9]\d*)$/.test(v))throw Error('Invalid player integer');return BigInt(v);};
/** Only contract949/950 is admitted. No character/current-state/world resolver or draw service. */
export function explainDecisionPlayer(value:unknown){
 const display=record(value,'DecisionPlayerDisplay#949/1',['Chosen [1]','Faces [2]'],['TieWinner [3]']);
 const chosen=option(display['Chosen [1]']),tieWinner=Object.hasOwn(display,'TieWinner [3]')?option(display['TieWinner [3]']):null;
 const values=display['Faces [2]'];if(!Array.isArray(values)||values.length>2)throw Error('Invalid player faces');const seen=new Set<string>();
 const reasons=values.map(v=>{const face=record(v,'DecisionPlayerFace#950/1',['Reason [1]','Die [2]','Standing [3]','Situation [4]','Face [5]','Contribution [6]']),key=record(face['Reason [1]'],'ReasonNucleusKey#404/1',['CandidateKey [1]','MotiveChannel [2]','TaskReferent [3]','Direction [4]']),id=stable(key);if(seen.has(id))throw Error('Duplicate player reason');seen.add(id);
  const target=option(key['CandidateKey [1]']),groundIndex=grounds.indexOf(stable(key['TaskReferent [3]']));if(groundIndex<0||stable(key['MotiveChannel [2]'])!==stable({namespace:'1040',identity:'Commitment'}))throw Error('Unknown player ground');const direction=key['Direction [4]'];if(direction!=='1'&&direction!=='2')throw Error('Invalid player polarity');
  const die=int(face['Die [2]']),rolled=int(face['Face [5]']),standing=int(face['Standing [3]']),situation=int(face['Situation [4]']),contribution=int(face['Contribution [6]']);if(die!==4n||rolled<1n||rolled>die||standing<-3n||standing>3n||situation<-3n||situation>3n||contribution!==(direction==='1'?1n:-1n)*(rolled+standing+situation))throw Error('Player contribution arithmetic mismatch');
  const semantic={concept:'adopted-task-commitment',ground:`task ${groundIndex===0?'A':'B'}`,option:target,polarity:direction==='1'?'supports':'opposes',certainty:null};
  return {semantic,human:`The commitment to ${semantic.ground} ${semantic.polarity} ${target}.`,die:String(die),face:String(rolled),standing:String(standing),situation:String(situation),contribution:String(contribution),sourceKey:key};
 });
 return {version:'decision-player-presentation/0.1',audience:'player',chosen,tieWinner,reasons,scope:'Only the native player presentation is rendered. Faces and contributions are actual recorded mechanics, not character evidence or subjective uncertainty. Displayed contributions need not determine the selected option under retained comparator laws. Selection does not establish execution success.'};
}
/** Extract only explicit top-level displays; no recursive search or promotion of research records. */
export function decisionPlayerPresentations(outputs:string){const values=JSON.parse(outputs);if(!Array.isArray(values))throw Error('Invalid DECISION output list');return values.flatMap((v,index)=>v?.record==='DecisionPlayerDisplay#949/1'?[{sourceIndex:index,report:explainDecisionPlayer(v)}]:[]);}
