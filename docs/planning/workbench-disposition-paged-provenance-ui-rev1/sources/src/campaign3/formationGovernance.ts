/** formation-governance-component/0.1-candidate. Supplied finite qualified domain only. */
export type GovernanceKind='EventContinuant'|'Interoceptive';
export type FormationSource=Readonly<{source:string;character:string;kind:GovernanceKind}>;
export type GovernanceEntry=FormationSource&Readonly<{acquisition:bigint;formedAt:bigint;completeLoss:boolean}>;
export type FormationCommit=FormationSource&Readonly<{acquisition:bigint;formedAt:bigint}>;
const fail=()=>{throw new Error('FORMATION_GOVERNANCE_DOMAIN');};
const fields=(v:unknown,names:string[])=>{if(!v||typeof v!=='object'||Object.getPrototypeOf(v)!==Object.prototype||Object.keys(v).sort().join('|')!==names.sort().join('|'))fail();};
const label=(s:string)=>{if(typeof s!=='string'||!s.length||s.normalize('NFC')!==s||new TextEncoder().encode(s).length>128)fail();};
const address=(s:FormationSource)=>JSON.stringify([s.character,s.source]);
const dense=(xs:readonly unknown[])=>{if(!Array.isArray(xs)||xs.length>64||Object.keys(xs).length!==xs.length)fail();};
function source(s:FormationSource){label(s.source);label(s.character);if(s.kind!=='EventContinuant'&&s.kind!=='Interoceptive')fail();}
export function reconcileFormationGovernance(domain:readonly FormationSource[],prior:readonly GovernanceEntry[],formed:readonly FormationCommit[],survivors:readonly bigint[],now:bigint){
 dense(domain);dense(prior);dense(formed);dense(survivors);if(typeof now!=='bigint'||now<0n)fail();
 const admitted=new Map<string,FormationSource>();
 for(const s of domain){fields(s,['source','character','kind']);source(s);if(admitted.has(address(s)))fail();admitted.set(address(s),s);}
 const rows=new Map<string,GovernanceEntry>(),ids=new Set<bigint>();
 const validate=(e:FormationCommit)=>{source(e);const s=admitted.get(address(e));if(!s||s.kind!==e.kind||typeof e.acquisition!=='bigint'||e.acquisition<0n||typeof e.formedAt!=='bigint'||e.formedAt<0n||e.formedAt>now||ids.has(e.acquisition)||rows.has(address(e)))fail();ids.add(e.acquisition);};
 for(const e of prior){fields(e,['source','character','kind','acquisition','formedAt','completeLoss']);if(typeof e.completeLoss!=='boolean')fail();validate(e);rows.set(address(e),e);}
 for(const e of formed){fields(e,['source','character','kind','acquisition','formedAt']);validate(e);if(e.formedAt!==now)fail();rows.set(address(e),{...e,completeLoss:false});}
 const live=new Set<bigint>();for(const id of survivors){if(typeof id!=='bigint'||!ids.has(id)||live.has(id))fail();live.add(id);}
 for(const e of prior)if(e.completeLoss&&live.has(e.acquisition))fail();
 // Preserve original metadata; expose no payload or arbitrary caller-owned fields.
 return Object.freeze([...rows.values()].map(e=>Object.freeze({source:e.source,character:e.character,kind:e.kind,acquisition:e.acquisition,formedAt:e.formedAt,completeLoss:!live.has(e.acquisition)})).sort((a,b)=>a.acquisition<b.acquisition?-1:a.acquisition>b.acquisition?1:0));
}
