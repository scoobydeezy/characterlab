import type {LongRoutineSnapshot} from './longRoutineAdapter';
type Owned=Pick<LongRoutineSnapshot['state'],'actor'|'history'|'cache'|'belief'|'goals'>;
/** Owned receiver records only; source metadata and execution trace are not character inputs. */
export function projectLongRoutineOwnedState(input:Owned){return structuredClone({actor:input.actor,practiceHistory:input.history,derivedCache:input.cache,rewardBelief:input.belief,goals:input.goals});}
