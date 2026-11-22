/** Direct Need: selected interoception -> adopted response -> common receiving.
 * No state/world/RNG capability, task surrogate, stored meter or efficacy assertion. */
import {list,set,map,text,unsigned,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {deficitPressure} from '../campaign3/embodiedMath';
import {dataItems as items,dataField as f,dataKey as key,dataText as txt,invalidModel} from '../campaign2/canonicalData';
import {readQ,qValue,ONE} from '../campaign2/cognitiveMath';
import {cognitiveRecord as r,receivingRecord as rec} from './codecs';
import type {BodyEvidence} from './body';
export const NEED_RESPONSES='assembled-need-responses/0.1',NEED='assembled-need-receiving/0.1-candidate';
export const NEED_MOTIVE=typedIdentifier(1040,text('EmbodiedFuelDeficit')),NEED_CRITERION=typedIdentifier(1027,text('definition/embodied-pressure'));
type Response={readonly instructionId:CanonicalValue;readonly actionId:CanonicalValue};
export function compileNeedResponses(v:CanonicalValue,plans:readonly Response[]){
 const a=items(v,'list');if(a.length!==2||txt(a[0])!==NEED_RESPONSES)invalidModel('Need response declaration');
 const ids=items(a[1],'list');if(ids.length>2||new Set(ids.map(key)).size!==ids.length)invalidModel('Need response cardinality/duplicate');
 const result=ids.map(id=>{const p=plans.find(p=>key(p.instructionId)===key(id));if(!p)invalidModel('Need response unknown governed instruction');return p!;});
 if(new Set(result.map(p=>key(p.actionId))).size!==result.length)invalidModel('Need response actions must differ');
 return Object.freeze(result);
}
function assessment(e:BodyEvidence|undefined,at:bigint,threshold:Q){
 if(e&&(e.settledEvent.dueAt!==at||e.settledEvent.phase!==20n))invalidModel('Need requires current selected evidence');
 if(!e?.sample)return {pressure:undefined,sample:list([]),experience:e?.experience??list([]),selection:e?.selection??list([])};
 if(!e.experience||!e.selection)invalidModel('Need missing settled selection');
 const sample=rec(e.sample,461n),upper=f(rec(f(sample,5n),462n),2n);
 return {pressure:deficitPressure(readQ(upper),threshold),sample,experience:e.experience,selection:e.selection};
}
export function needCandidates(input:CanonicalValue,C:CanonicalValue,responses:readonly Response[],e:BodyEvidence|undefined,at:bigint,threshold:Q){
 const a=assessment(e,at,threshold),v=rec(input,398n),options=new Map(items(f(v,3n),'list').map(o=>[key(f(rec(o,397n),1n)),o]));
 const active=a.pressure!==undefined&&a.pressure.numerator>0n;
 if(active)for(const response of responses){const candidate=r(395,[C,response.actionId]),k=key(candidate);if(!options.has(k))options.set(k,r(397,[candidate,set([])]));}
 const output=r(398,[f(v,1n),f(v,2n),list([...options].sort(([a],[b])=>a<b?-1:1).map(([,v])=>v))]);
 return {output,report:list([text(NEED),signed(at),text(a.pressure===undefined?'Unavailable':a.pressure.numerator===0n?'KnownZero':'Positive'),a.pressure===undefined?list([]):qValue(a.pressure),a.sample,a.experience,a.selection,list((active?responses:[]).map(p=>list([p.instructionId,p.actionId])))])};
}
export function needRaw(input:CanonicalValue,responses:readonly Response[],e:BodyEvidence|undefined,at:bigint,threshold:Q){
 const raw=rec(input,403n);if(raw.schema.schemaVersion!==3n)invalidModel('Need requires shared described receiving');
 const a=assessment(e,at,threshold),descriptions:CanonicalValue[]=[];
 if(a.pressure&&a.pressure.numerator>0n){const sample=rec(a.sample,461n),basis=r(400,[map([[r(399,[unsigned(1),r(237,[unsigned(1),f(sample,1n)])]),qValue(ONE)]])]);
  for(const option of items(f(rec(f(raw,2n),398n),3n),'list')){const candidate=f(rec(option,397n),1n);if(!responses.some(p=>key(p.actionId)===key(f(rec(candidate,395n),2n))))continue;
   descriptions.push(list([text('bodyPressure'),NEED_MOTIVE,r(402,[r(401,[candidate,NEED_CRITERION,unsigned(1)],3),qValue(a.pressure),basis])]));
  }
 }
 return r(403,[...Array.from({length:6},(_,i)=>f(raw,BigInt(i+1))),list(descriptions)],4);
}
