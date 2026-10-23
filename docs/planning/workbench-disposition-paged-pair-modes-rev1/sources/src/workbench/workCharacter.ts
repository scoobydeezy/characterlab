import {list,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {OPTIONS} from '../campaign3/workModel';
import {exactText,exactKey} from './canonical';
export const WORK_CHARACTER_VERSION='work-character-projection/0.1';
export const WORK_LANGUAGE_VERSION='work-character-explanation/0.1';
type R=Extract<CanonicalValue,{kind:'record'}>;
const integer=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'&&v.kind!=='unsigned')throw Error('WORK integer required');return String(v.value);};
const fraction=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='rational')throw Error('WORK rational required');return `${v.numerator}/${v.denominator}`;};
const bool=(v:CanonicalValue)=>{if(typeof v!=='boolean')throw Error('WORK Boolean required');return v;};
const option=(v:CanonicalValue)=>{const i=OPTIONS.map(exactKey).indexOf(exactKey(v));if(i<0)throw Error('Unknown WORK option');return i===0?'A':'B';};
const item=(v:CanonicalValue)=>{const id=integer(v);if(!['1','2','3'].includes(id))throw Error('Unknown WORK item');return ['','A','B','neutral C'][Number(id)];};
const itemList=(v:CanonicalValue)=>items(v,'list').map(item).join(', ')||'none';
function assertSafe(v:CanonicalValue):void{
 if(typeof v==='boolean')return;
 if(v.kind==='record'){if(v.schema.schemaVersion!==1n||[110n,410n,411n,422n,423n,766n,767n,768n,776n,777n,778n,779n].includes(v.schema.typeId))throw Error('Unsafe WORK projection record');v.fields.forEach(assertSafe);}
 else if(v.kind==='list'||v.kind==='set')v.items.forEach(assertSafe);else if(v.kind==='map')v.entries.forEach(([k,x])=>{assertSafe(k);assertSafe(x);});
}
/** Closed projection at the diagnostic boundary. Random records are never copied into a safe entry. */
export function projectWorkCharacter(outputs:readonly CanonicalValue[],candidate:number){
 if(![1,2,3,4,5,6].includes(candidate))throw Error('Unknown WORK candidate');
 const classified=outputs.map(v=>{if(typeof v==='boolean'||v.kind!=='record'||v.schema.schemaVersion!==1n||![769n,773n,774n,775n,776n,777n].includes(v.schema.typeId))throw Error('Unknown WORK output');return v;});
 const base={projection:WORK_CHARACTER_VERSION,renderer:WORK_LANGUAGE_VERSION,candidate,scope:'Evaluation-time evidence and chosen intent only. Retained task adoption, eligibility, selection and reason access remain distinct. No execution or identity reinforcement is asserted.'};
 if(candidate>=3)return {...base,suppressed:true,entries:[] as WorkCharacterEntry[],notice:'This is a retained violating control. Character narration is suppressed; inspect its labelled researcher records.'};
 const entries:WorkCharacterEntry[]=[];
 classified.forEach((r,sourceIndex)=>{
  const type=r.schema.typeId;let safe:CanonicalValue=r,kind='',human='',at='';
  if(type===774n||type===777n)return; // Raw signals are preserved under reasons; intent is read from the safe decision tuple.
  if(type===769n){kind='Admitted display';at=integer(f(r,2n));const cards=items(f(r,3n),'list').map(v=>{const c=rec(v,770n);return `${item(f(c,1n))} (display priority ${integer(f(c,2n))})`;});human=`At instant ${at}, the admitted display contains ${cards.join(', ')||'no visible cards'}; admitted reminder ${bool(f(r,4n))?'on':'off'}. Display priority controls admission, not motive strength. An empty display does not establish that tasks or hidden cards are absent.`;}
  else if(type===773n){kind='Maintained access';at=integer(f(r,2n));const source=r.fields.has(10n)?rec(f(r,10n),769n):undefined,control=integer(f(r,5n));if(!['0','1','2'].includes(control))throw Error('Unknown WORK control');
   const statuses=items(f(r,8n),'list').map((v,i)=>{const status=integer(f(rec(v,372n),1n));if(!['1','3'].includes(status))throw Error('Unknown WORK task status');return `${i===0?'A':'B'} ${status==='1'?'Open':'DeadlineMissed'}`;});if(statuses.length!==2)throw Error('WORK task roster');
   human=`At workspace instant ${at}, ${source?`the source is the admitted display from instant ${integer(f(source,2n))}`:'no earlier admitted display is available'}. Eligible items: ${items(f(r,3n),'list').map(v=>item(f(rec(v,770n),1n))).join(', ')||'none'}. Prior selection: ${itemList(f(r,6n))}; selected now: ${itemList(f(r,4n))}; accessible task grounds: ${itemList(f(r,9n))}. Recorded control: ${['none','protection of A','reminder reinstatement'][Number(control)]}. Retained task status: ${statuses.join('; ')}. Open status alone does not establish active access or eligibility inside the lifecycle window; neutral C supplies no motive ground.`;
  }else if(type===775n){kind='Recorded reasons';const raw=rec(f(r,2n),774n),workspace=rec(f(raw,2n),773n);at=integer(f(workspace,2n));const nuclei=items(f(r,3n),'list');human=`At reason evaluation for instant ${at}, ${nuclei.length} compiled reason nuclei are recorded. `+nuclei.map(v=>{const n=rec(v,407n),key=rec(f(n,1n),404n),roles=rec(f(n,2n),406n),direction=integer(f(key,4n));if(!['1','2'].includes(direction))throw Error('Unknown WORK reason direction');return `A task-grounded reason ${direction==='1'?'supports':'opposes'} option ${option(f(key,1n))}: base ${fraction(f(roles,1n))}, standing ${fraction(f(roles,2n))}, situational ${fraction(f(roles,3n))}, relevance ${fraction(f(n,3n))}; die d${integer(f(n,4n))}, modifiers ${integer(f(n,5n))}/${integer(f(n,6n))}.`;}).join(' ');}
  else if(type===776n){kind='Chosen intent';at=integer(f(r,2n));
   // Versioned diagnostic tuple, not a modified native WorkDecision record with missing required fields.
   safe=list([text('work-safe-choice/0.1'),f(r,1n),f(r,2n),f(r,4n),f(r,5n),list(r.fields.has(8n)?[f(r,8n)]:[])]);
   const tuple=items(safe,'list'),mode=integer(tuple[4]);if(!['1','2','3'].includes(mode))throw Error('Unknown WORK mode');const chosen=items(tuple[5],'list'),probabilities=items(tuple[3],'list').map(v=>{const p=rec(v,421n);return `${option(f(p,1n))} ${fraction(f(p,2n))}`;});
   human=`At instant ${at}, ${chosen.length?`the selected intent is option ${option(chosen[0])}`:'no option is selected'}. Recorded mode ${['','Auto','QuietRoll','PlayerFacingRoll'][Number(mode)]}; analytical option probabilities ${probabilities.join('; ')}. Probabilities and mechanical randomness are not epistemic confidence. Empty reason grounds do not imply a chosen action. This experiment ends at intent; no execution success or identity update is inferred.`;
  }
  assertSafe(safe);entries.push({kind,at,sourceIndex,occurrence:exactKey(f(r,1n)),human,exact:exactText(safe)});
 });
 return {...base,suppressed:false,entries,notice:entries.length?'Earlier entries retain evaluation-time evidence; later displays do not rewrite them.':'No admitted character evaluation has been recorded at this prefix.'};
}
export interface WorkCharacterEntry {kind:string;at:string;sourceIndex:number;occurrence:string;human:string;exact:string;}
