/** M198: M196 real nonsocial B/route1 failure10, unchanged body/calibration/seed.
 * Local actors are explicit apparatus identities. Claims11/12 are fallible speech. */
import {fixture as prior,create as priorCreate,decode,items,key,enc,list,text,signed,u,C,taskB} from './assembledExecutionStakeholder';
import {STAKEHOLDER_KNOWLEDGE_RULES,STAKEHOLDER_KNOWLEDGE_REGISTRY} from '../../assembled/model';
import {OBSTRUCTION_SOURCE} from '../../assembled/externalObstruction';
import {SK} from '../../assembled/stakeholderKnowledge';
import {semanticReferentFromAuthoredContent as ref} from '../../substrate/referentOrigin';
import {typedIdentifier as tid,type CanonicalValue} from '../../substrate/canonicalEncoding';
export * from './assembledExecutionStakeholder';
export type Mode='main'|'empty'|'aOnly';
export function fixture(o:{blocker?:0|1|2;causes?:[boolean,boolean];access?:[boolean,boolean];mode?:Mode}={}){
 const b=prior({blocker:o.blocker,access:o.access??[true,true]}),slots=[...items(decode(b.s.registry),'list')],s=[...items(slots[50],'list')];
 s[3]=list(items(s[3],'list').map((v,i)=>list([...items(v,'list'),list(b.people.map((p,j)=>list([p,ref(tid(1038,text('content/stakeholder-'+i+'-blocker-'+j)))])))])));slots[50]=list(s);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(OBSTRUCTION_SOURCE)){const p=items(a[3],'list');a[3]=list([text(SK),...p.slice(1),list(o.causes??[true,false]),list([list([]),list([])])]);}return list(a);});
 for(const at of [11,12,13,14]){const claim=(receipt:number,positive:boolean)=>list([u(10),u(receipt),positive]),empty=list([]);
 const reports:CanonicalValue[]=o.mode==='empty'?[empty,empty]:o.mode==='aOnly'?(at===11?[claim(1,false),empty]:[empty,empty]):at===11?[claim(1,false),claim(1,false)]:at===12||at===13?[empty,claim(2,true)]:[empty,empty];
 rows.push(list([signed(at),u(30),OBSTRUCTION_SOURCE,list([text(SK),C,list([]),list([]),taskB,list([false,false]),list([false,false]),list(reports)]),list([])]));}
 return {...b,s:{...b.s,rulesVersion:STAKEHOLDER_KNOWLEDGE_RULES,registrySchemaVersion:STAKEHOLDER_KNOWLEDGE_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export async function create(b=fixture(),at=10n){return {...await priorCreate(b,at),b};}
