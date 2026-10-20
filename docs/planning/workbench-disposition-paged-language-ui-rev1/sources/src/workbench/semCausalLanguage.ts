import {canonicalEncode,type CanonicalValue} from '../substrate/canonicalEncoding';
import {decodeSemanticValue} from '../semanticBinding/semanticCodecs';
import {INITIAL_CAUSAL_ROLE_RULE,EVIDENCE_PROVENANCE_CONTRACT_VERSION} from '../semanticBinding/evidenceProvenance';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataText as str} from '../campaign2/canonicalData';
import {exactKey,exactText} from './canonical';
function atom(v:CanonicalValue,ns:bigint){if(typeof v==='boolean'||v.kind!=='typedIdentifier'||v.namespaceId!==ns)throw Error('SEM causal identity namespace');return v.payload;}
const occurrence=(v:CanonicalValue,ns:bigint)=>{uint(atom(v,ns));return exactKey(v);};
export function projectSemCausalLanguage(trace:readonly CanonicalValue[],observer:CanonicalValue){
 const observerName=str(atom(observer,1000n)),entries=[];
 const own=(v:CanonicalValue)=>{if(exactKey(v)!==exactKey(observer))throw Error('SEM causal observer mismatch');};
 for(const [sourceIndex,contribution] of trace.entries()){
  const parts=items(contribution,'list');if(parts.length!==4)throw Error('SEM causal contribution shape');const chain=items(parts[3],'list');if(chain.length!==4)throw Error('SEM causal chain shape');
  const raw=rec(chain[1],227n);if(exactKey(f(raw,2n))!==exactKey(observer))continue;
  const experience=rec(decodeSemanticValue(canonicalEncode(raw)),227n),experienceId=occurrence(f(experience,1n),1106n),bindings=items(f(experience,5n),'set').map(v=>rec(v,224n));
  for(const value of items(chain[2],'list')){
   const r=rec(decodeSemanticValue(canonicalEncode(value)),240n);own(f(r,3n));if(occurrence(f(r,2n),1106n)!==experienceId)throw Error('SEM causal experience mismatch');
   const event=rec(f(r,4n),213n),track=rec(f(r,5n),212n);own(f(event,1n));own(f(track,1n));
   const eventNumber=uint(f(event,2n)).toString(),trackNumber=uint(f(track,2n)).toString();
   if(!items(f(experience,4n),'set').some(v=>exactKey(v)===exactKey(event)))throw Error('SEM causal event outside experience');
   const role=str(atom(f(r,6n),1019n)),rule=str(atom(f(r,7n),1020n)),time=uint(f(r,9n)).toString();
   if(rule!==INITIAL_CAUSAL_ROLE_RULE.causalRoleDerivationRuleId||str(f(r,10n))!==EVIDENCE_PROVENANCE_CONTRACT_VERSION)throw Error('SEM causal unqualified rule/version');
   const supports=items(f(r,8n),'set').map(value=>{
    const ref=rec(value,237n);if(uint(f(ref,1n))!==4n||ref.fields.size!==2)throw Error('SEM causal unsupported basis');
    const id=occurrence(f(ref,5n),1103n),matches=bindings.filter(b=>exactKey(f(b,1n))===id);if(matches.length!==1)throw Error('SEM causal missing or ambiguous binding');const b=matches[0];own(f(b,2n));
    if(exactKey(f(b,3n))!==exactKey(event)||exactKey(f(b,4n))!==exactKey(track))throw Error('SEM causal binding carrier mismatch');
    const er=rec(f(b,5n),223n);if(uint(f(er,1n))!==1n)throw Error('SEM causal unresolved binding');const eventRole=str(atom(f(er,2n),1003n));
    if(!INITIAL_CAUSAL_ROLE_RULE.mappings.some(m=>m.eventRoleId===eventRole&&m.causalRoleId===role))throw Error('SEM causal mapping mismatch');
    if(uint(f(b,7n))>BigInt(time))throw Error('SEM causal future support');
    return {id,eventRole,exact:exactText(b)};
   });if(!supports.length)throw Error('SEM causal empty support');
   const semantic={concept:'causal-role.recorded-interpretation',observer:observerName,event:eventNumber,track:trackNumber,role,recordedAt:time,certainty:'not supplied',qualifiers:['observer-relative role','not verified causation or responsibility']};
   entries.push({sourceIndex,evidenceId:occurrence(f(r,1n),1111n),experienceId,semantic,rule,supports,
    human:`In my recorded view at time ${time}, track ${trackNumber} had the ${role.replace('causal-role/','').replaceAll('-',' ')} role in event ${eventNumber}. This interpretation follows my perceived event-role evidence; it does not establish who caused the event.`,exact:exactText(r)});
  }
 }
 return {version:'sem-causal-role-language/0.1',observer:observerName,entries,scope:'Recorded observer-relative causal roles under the original exact-event-role mapping, joined to their same-experience perceived bindings. No truth, recognition or renderer sibling is read. This does not infer world causation, responsibility, confidence or complete choice reasons.'};
}
