/** M39: M38 physical tasks and passive observers, reserve10, amount80, delay2;
 * body3/5/7, difficulty0, informational habit. Hidden control removes only sample7.
 * No authored tolerance, person belief or missing interior appraisal component. */
import {list,text,typedIdentifier} from '../../substrate/canonicalEncoding';
import type {ToleranceLaw} from '../../campaign3/toleranceEffect';
import type {ComparisonDrawMap} from '../../substrate/random';
import {TOLERANCE_RULES,TOLERANCE_REGISTRY} from '../../assembled/model';
import {TOLERANCE_DECLARATION} from '../../assembled/tolerance';
import {BODY_SAMPLE} from '../../assembled/body';
import {source as priorSource,data as priorData,decode,items,key,enc} from './assembledDelayedBody';
import {signedValue} from './assembledComparison';
export const variable=typedIdentifier(1029,text('variable/fixture-regulation'));
export function source(law:ToleranceLaw='Reciprocal',delay=2,permitted=true,amount=80){const s=priorSource(delay,permitted,amount);return {...s,rulesVersion:TOLERANCE_RULES,registrySchemaVersion:TOLERANCE_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(TOLERANCE_DECLARATION),variable,text(law)])]))};}
export function data(hidden=false,map?:ComparisonDrawMap,reserve=10){const d=priorData(true,map,reserve);return {...d,orderedInputs:enc(list(items(decode(d.orderedInputs),'list').filter(v=>{if(typeof v==='boolean'||v.kind!=='list')return true;const a=items(v,'list');return !(hidden&&a.length===5&&key(a[2])===key(BODY_SAMPLE)&&signedValue(a[0])===7n);}))) };}
export {decode,items,key,enc};
