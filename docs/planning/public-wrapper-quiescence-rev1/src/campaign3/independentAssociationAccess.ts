/** independent-association-access-component/0.1-candidate. Read-only composition; no graph membership writes. */
import {ExactRational as Q} from '../substrate/exactMath';
import {rankAccessibleEpisodes} from './encodingAccessMath';
type Episodes=Parameters<typeof rankAccessibleEpisodes>[0];
type ParametersForRank=Parameters<typeof rankAccessibleEpisodes>[3];
export function rankWithIndependentAssociationMembership(episodes:Episodes,graphActivation:ReadonlyMap<string,Q>,now:bigint,parameters:ParametersForRank){
 const contribution=new Map(graphActivation);
 for(const episode of episodes)for(const key of episode.retainedKeys)if(!contribution.has(key))contribution.set(key,Object.freeze(Q.of(0n)));
 return rankAccessibleEpisodes(episodes,contribution,now,parameters);
}
