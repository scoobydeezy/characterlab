import {canonicalEncode as enc,list,text,signed,unsigned,rational,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {decodeEmbodied as decode} from '../../campaign3/embodiedCodecs';
import {dataItems as items,dataKey as key,dataIdentity as id,dataText as txt} from '../../campaign2/canonicalData';
import {SKILL_RULES,SKILL_REGISTRY} from '../../assembled/model';
import {SKILL,PRACTICE_SETTING} from '../../assembled/skill';
import {BODY_SAMPLE} from '../../assembled/body';
import {actionSource,actionData} from './assembledActionBody';
export const skillSource=(capacity=4)=>{const s=actionSource(true,0,80,capacity);return {...s,rulesVersion:SKILL_RULES,registrySchemaVersion:SKILL_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(SKILL)])]))};};
export interface PracticeOptions {practice?:boolean;permitted?:boolean;sense7?:boolean;impairment5?:CanonicalValue;phases?:number[];allPractice?:boolean;difficulty?:CanonicalValue;}
export function skillData(early=0,seed=0,o:PracticeOptions={}){
 const d=actionData(seed),rows=[...items(decode(d.orderedInputs),'list')],choice=items(rows.find(row=>txt(id(items(row,'list')[2]).payload)==='event/deliberation-opportunity')!,'list'),sample=items(rows.find(row=>key(items(row,'list')[2])===key(BODY_SAMPLE))!,'list');
 rows.push(list([signed(7),...choice.slice(1)]));if(o.sense7!==false)rows.push(list([signed(7),...sample.slice(1)]));
 for(const [i,at]of [3,5,7].entries())rows.push(list([signed(at),unsigned(30),PRACTICE_SETTING,list([text(SKILL),unsigned(o.phases?.[i]??(i?4:early)),i===1?(o.impairment5??rational(0,1)):rational(0,1),o.difficulty??rational(1,2),i===0?o.permitted!==false:true,o.allPractice===true||(i===0&&o.practice!==false)]),list([])]));
 return {...d,orderedInputs:enc(list(rows))};
}
export function mapSkillInputs(d:ReturnType<typeof skillData>,change:(row:CanonicalValue)=>CanonicalValue|undefined){return {...d,orderedInputs:enc(list(items(decode(d.orderedInputs),'list').flatMap(row=>{const x=change(row);return x===undefined?[]:[x];})))};}
