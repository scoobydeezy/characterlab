/** M82: unchanged M80 quiet/balanced scenario; only versioned permissions vary.
 * Physical A/B/third tasks (no people); body30/cap100/rate10, delivery90 at9;
 * A/B importance3/5, urgency1, threat1/2, cue true/false; seed0, calendar through101. */
import {fixture as prior,type Regime} from './assembledDecisionRegimes';
import {changeDefinition} from './assembledCharacter';
import {OUTCOME_VISIBILITY_RULES,OUTCOME_VISIBILITY_REGISTRY} from '../../assembled/model';
const cache=new Map<string,ReturnType<typeof prior>>();
export function fixture(physical=true,observed=true,regime:Regime='quiet',hidden=false){
 const k=regime+'/'+hidden;let b=cache.get(k);if(!b){b=prior(regime,hidden?'hidden':'normal');cache.set(k,b);}
 let s={...b.s,rulesVersion:OUTCOME_VISIBILITY_RULES,registrySchemaVersion:OUTCOME_VISIBILITY_REGISTRY};
 if(!physical)s=changeDefinition(s,'definition/protocol-execution',1n,false);
 if(!observed)s=changeDefinition(s,'definition/protocol-observation',4n,false);
 return {s,d:b.d,old:b.s};
}
