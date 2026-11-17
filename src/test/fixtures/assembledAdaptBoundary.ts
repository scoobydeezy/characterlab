/** M147: same canonical regulatory baseline/body10, seed0, exposure2/probe4. */
import {fixture as prior,rec,f,items,key,decode,enc,list,text,signed,C} from './assembledHiddenExposure';
import {ADAPT_BOUNDARY_RULES,ADAPT_BOUNDARY_REGISTRY} from '../../assembled/model';
import {learningProtectionDeclaration} from '../../assembled/learningProtection';
export function fixture(count=0,reveal=true){const b=prior(count,reveal);return {...b,s:{...b.s,rulesVersion:ADAPT_BOUNDARY_RULES,registrySchemaVersion:ADAPT_BOUNDARY_REGISTRY,registry:enc(list([...items(decode(b.s.registry),'list'),learningProtectionDeclaration()]))}};}
export {rec,f,items,key,decode,enc,list,text,signed,C};
