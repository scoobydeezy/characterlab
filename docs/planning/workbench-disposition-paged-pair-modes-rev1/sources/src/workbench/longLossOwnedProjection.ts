import type {LongLossSnapshot} from './longLossAdapter';
type Owned=Pick<LongLossSnapshot['state'],'actor'|'target'|'history'|'belief'|'goals'>;
/** Current owned state only. No profile, trace, physical availability or completed execution. */
export function projectLongLossOwnedState(input:Owned){return structuredClone({actor:input.actor,target:input.target,relationshipHistory:input.history,availabilityBelief:input.belief,goals:input.goals});}
