import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {exactKey,exactText} from './canonical';
export const SKILL_CHARACTER_VERSION='skill-character-projection/0.1';
export const SKILL_LANGUAGE_VERSION='skill-character-explanation/0.1';
type R=Extract<CanonicalValue,{kind:'record'}>;
const integer=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'&&v.kind!=='unsigned')throw Error('SKILL integer required');return String(v.value);};
const fraction=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='rational')throw Error('SKILL rational required');return String(v.numerator)+'/'+String(v.denominator);};
const belief=(v:CanonicalValue|undefined)=>{if(!v)return 'no recorded performance belief';const b=rec(v,786n);return 'recorded performance mean '+fraction(f(b,1n))+' from '+integer(f(b,2n))+' admitted reports';};
function safe(v:CanonicalValue):void{if(typeof v==='boolean')return;if(v.kind==='record'){if(v.schema.schemaVersion!==1n||[782n,783n,784n,785n,796n,798n,799n,110n,410n,411n,422n,423n].includes(v.schema.typeId))throw Error('Unsafe SKILL projection record');v.fields.forEach(safe);}else if(v.kind==='list'||v.kind==='set')v.items.forEach(safe);else if(v.kind==='map')v.entries.forEach(([k,x])=>{safe(k);safe(x);});}
function instant(r:R):string{if(r.schema.typeId===788n||r.schema.typeId===797n)return integer(f(r,2n));return instant(rec(f(r,2n),r.schema.typeId===800n?797n:r.schema.typeId-1n));}
export interface SkillCharacterEntry{kind:string;at:string;sourceIndex:number;occurrence:string;human:string;exact:string;}
/** Native outputs only. Physical execution/practice/adaptation records are classified, never exposed. */
export function projectSkillCharacter(outputs:readonly CanonicalValue[],settings:{executionLaw:number;permanent:boolean}){
 if(![1,2,3,4].includes(settings.executionLaw)||typeof settings.permanent!=='boolean')throw Error('Unknown SKILL control');
 const records=outputs.map(v=>{if(typeof v==='boolean'||v.kind!=='record'||v.schema.schemaVersion!==1n||v.schema.typeId<788n||v.schema.typeId>800n)throw Error('Unknown SKILL output');return v;});
 const base={projection:SKILL_CHARACTER_VERSION,renderer:SKILL_LANGUAGE_VERSION,scope:'Evaluation-time appraisal, chosen action chain and admitted performance evidence only. Performance belief is not private competence or general confidence.'};
 if(settings.executionLaw>=3||settings.permanent)return {...base,suppressed:true,entries:[] as SkillCharacterEntry[],notice:'Retained violating control: character narration is suppressed. Inspect labelled researcher records.'};
 const entries:SkillCharacterEntry[]=[];
 records.forEach((r,sourceIndex)=>{const t=r.schema.typeId;if([796n,798n,799n].includes(t))return;safe(r);const at=instant(r);let kind='',human='';
 if(t===788n){kind='Appraisal evidence';human='At instant '+at+', appraisal uses '+belief(r.fields.get(3n))+'. An absent belief is unknown, not observed zero. This is evidence about this exercise, not access to competence.';}
 else if(t===789n){kind='Task reason';human='At instant '+at+', the adopted task supplies '+items(f(r,3n),'list').length+' raw reason signals. Physical difficulty and impairment do not supply these reasons.';}
 else if(t===790n){kind='Compiled reasons';human='At instant '+at+', '+items(f(r,3n),'list').length+' reason nuclei are recorded. Exact factors and distributions are retained below; a mechanical reason distribution is not epistemic confidence.';}
 else if(t===791n){kind='Decision';human='At instant '+at+', '+(r.fields.has(4n)?'the exercise option is chosen':'no option is chosen')+'. This single-option contract uses Auto arbitration; choice does not establish execution success.';}
 else if(t===792n){kind='Intent';human='At instant '+at+', the recorded decision is carried into intent. Intent alone does not establish engagement or success.';}
 else if(t===793n){kind='Expression';human='At instant '+at+', the expression records '+items(f(r,3n),'list').length+' alignment entries. This is a separate stage from intent and physical performance.';}
 else if(t===794n){kind='Plan';human='At instant '+at+', '+(r.fields.has(3n)?'an exercise action is planned':'no action is planned')+'. A plan does not establish physical permission or success.';}
 else if(t===795n){kind='Attempt';human='At instant '+at+', the plan reaches the attempt stage. The character projection does not infer private competence, physical engagement or outcome from this record.';}
 else if(t===797n){kind='Admitted performance';human='At instant '+at+', '+(r.fields.has(4n)?'the admitted report indicates '+(f(r,4n)===true?'success':'failure'):'no performance result is admitted')+'. A missing report does not establish whether an unseen attempt engaged or succeeded; a displayed result can be misleading.';}
 else if(t===800n){kind='Performance learning';human='At instant '+at+', belief learning '+(f(r,3n)===true?'is applied':'is not applied')+'. Before: '+belief(r.fields.get(4n))+'. After: '+belief(r.fields.get(5n))+'. This update concerns admitted performance evidence; it does not measure procedural practice or private competence.';}
 entries.push({kind,at,sourceIndex,occurrence:exactKey(f(r,1n)),human,exact:exactText(r)});
 });
 return {...base,suppressed:false,entries,notice:entries.length?'Historical entries retain their evaluation-time evidence.':'No character evaluation recorded at this prefix.'};
}
