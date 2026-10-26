import {canonicalEncode as enc,list,text,unsigned,signed,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../../substrate/state';
import {decodeEmbodied as decode} from '../../campaign3/embodiedCodecs';
import {dataItems as items,dataKey as key} from '../../campaign2/canonicalData';
import {STRATEGY_RULES,STRATEGY_REGISTRY} from '../../assembled/model';
import {STRATEGY,DISPLAY} from '../../assembled/strategy';
import {sid} from '../../assembled/skill';
import {skillSource,skillData,mapSkillInputs} from './assembledSkill';
export const taskKeys=()=>restoreAuthoritativeState(decode(skillData().initialState)).entries().filter(e=>e.path.rootStateTypeId===373n&&e.path.fieldId===1n).map(e=>(e.path.selectors[0] as {kind:'mapKey';key:CanonicalValue}).key);
export function strategySource(reverse=false){const s=skillSource();const plans=['one','two'].map(n=>sid(1027,'definition/task-instruction-'+n));if(reverse)plans.reverse();return {...s,rulesVersion:STRATEGY_RULES,registrySchemaVersion:STRATEGY_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(STRATEGY),list(taskKeys().map(task=>list([task,...plans])))])]))};}
export function frame(at:number,available:readonly boolean[],receiptStart:number,visible=true,until=8){return list([signed(at),unsigned(30),DISPLAY,list([text(STRATEGY),list(taskKeys().flatMap(task=>available.map((value,route)=>list([task,unsigned(route),unsigned(receiptStart+route),value,unsigned(at),unsigned(until),visible]))))]),list([])]);}
export function strategyData(mode:'switch'|'retain'|'denied'|'gap'='switch'){
 const base=skillData(0,7),rows=items(decode(base.orderedInputs),'list');return {...base,orderedInputs:enc(list([...rows,frame(1,[false,true],1),frame(3,mode==='retain'?[false,true]:mode==='gap'?[false,false]:[true,false],3,mode!=='denied'),...(mode==='gap'?[frame(5,[true,false],5)]:[])]))};
}
export const replaceFrames=(d:ReturnType<typeof strategyData>,frames:CanonicalValue[])=>{const base=mapSkillInputs(d,row=>key(items(row,'list')[2])===key(DISPLAY)?undefined:row);return {...base,orderedInputs:enc(list([...items(decode(base.orderedInputs),'list'),...frames]))};};
