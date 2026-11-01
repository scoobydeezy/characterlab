import {list,text,signed,unsigned,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {ELIGIBILITY_RULES,ELIGIBILITY_REGISTRY} from '../../assembled/model';
import {ELIGIBILITY,IDENTITY_CONTEXT} from '../../assembled/identityEligibility';
import {expectationSource} from './assembledPerformanceExpectation';
import {learnedData,encounters,decode,items,key,enc} from './assembledLearnedDisclosure';
import {sid} from '../../assembled/skill';
export const source=()=>{const s=expectationSource();return {...s,rulesVersion:ELIGIBILITY_RULES,registrySchemaVersion:ELIGIBILITY_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(ELIGIBILITY)])]))};};
export const context=(pressure=false,significance:CanonicalValue=q(1,1),instruction=false)=>list([text(ELIGIBILITY),significance,q(pressure?1:0,2),instruction]);
export function data(pressure=false,seed=0,opts:{instruction?:boolean;trivial?:boolean}={}){const d=learnedData(seed,encounters,[]),rows=items(decode(d.orderedInputs),'list'),opportunities=rows.filter(v=>key(items(v,'list')[2])===key(sid(1001,'event/deliberation-opportunity')));return {...d,orderedInputs:enc(list([...rows,...opportunities.map(v=>{const at=items(v,'list')[0];return list([at,unsigned(30),IDENTITY_CONTEXT,context(key(at)===key(signed(3))&&pressure,key(at)===key(signed(3))?q(1,opts.trivial?4:1):q(0,1),!!opts.instruction),list([])]);})]))};}
export {decode,items,key,enc};
