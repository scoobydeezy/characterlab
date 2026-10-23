/** formation-source-domain-component/0.1-candidate. Trusted qualified source inputs only. */
import {reconcileFormationGovernance,type FormationSource} from './formationGovernance';
import {canonicalEncode,list,text} from '../substrate/canonicalEncoding';
const address=(s:FormationSource)=>JSON.stringify([s.character,s.source]);
const compare=(a:Uint8Array,b:Uint8Array)=>{for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])return a[i]-b[i];return a.length-b.length;};
export function extendFormationSourceDomain(prior:readonly FormationSource[],incoming:readonly FormationSource[],limit:number){
 if(!Number.isInteger(limit)||limit<0||limit>64)throw Error('FORMATION_SOURCE_LIMIT');
 reconcileFormationGovernance(prior,[],[],[],0n);reconcileFormationGovernance(incoming,[],[],[],0n);
 if(prior.length>limit)throw Error('FORMATION_SOURCE_PRIOR_LIMIT');
 const all=new Map(prior.map(s=>[address(s),s]));
 for(const s of incoming){const old=all.get(address(s));if(old&&old.kind!==s.kind)throw Error('FORMATION_SOURCE_KIND_CONFLICT');all.set(address(s),s);}
 if(all.size>limit)throw Error('FORMATION_SOURCE_LIFETIME_EXCEEDED');
 return Object.freeze([...all.values()].map(s=>Object.freeze({source:s.source,character:s.character,kind:s.kind})).sort((a,b)=>compare(canonicalEncode(list([text(a.character),text(a.source)])),canonicalEncode(list([text(b.character),text(b.source)])))));
}
