import {canonicalEncode,type CanonicalValue} from '../substrate/canonicalEncoding';
import {decodeSemanticValue} from '../semanticBinding/semanticCodecs';
import {RECOGNITION_CONTRACT_VERSION} from '../semanticBinding/recognition';
import {validateSemanticReferent,semanticReferentValue} from '../substrate/referentOrigin';
import {authoredReferentKey} from '../test/fixtures/referentOrigin';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataText as str} from '../campaign2/canonicalData';
import {exactKey,exactText} from './canonical';
const labels=new Map(['mina','darius','glen'].map(name=>[exactKey(semanticReferentValue(authoredReferentKey('person.'+name))),name[0].toUpperCase()+name.slice(1)]));
function atom(v:CanonicalValue,ns:bigint){if(typeof v==='boolean'||v.kind!=='typedIdentifier'||v.namespaceId!==ns)throw Error('SEM recognition identity namespace');return v.payload;}
function occurrence(v:CanonicalValue,ns:bigint){uint(atom(v,ns));return exactKey(v);}
/** Reads only the selected observer's experience/recognition slots. No truth or renderer input. */
export function projectSemRecognitionLanguage(trace:readonly CanonicalValue[],observer:CanonicalValue){
 const observerName=str(atom(observer,1000n)),entries=[];
 for(const [sourceIndex,contribution] of trace.entries()){
  const parts=items(contribution,'list');if(parts.length!==4)throw Error('SEM recognition contribution shape');
  const chain=items(parts[3],'list');if(chain.length!==4)throw Error('SEM recognition chain shape');
  const experience=rec(chain[1],227n);if(exactKey(f(experience,2n))!==exactKey(observer))continue;
  const experienceId=occurrence(f(experience,1n),1106n);
  for(const value of items(chain[3],'list')){
   const r=rec(decodeSemanticValue(canonicalEncode(value)),236n);
   if(exactKey(f(r,3n))!==exactKey(observer))throw Error('SEM recognition observer mismatch');
   if(occurrence(f(r,2n),1106n)!==experienceId)throw Error('SEM recognition experience mismatch');
   const track=rec(f(r,4n),212n);if(exactKey(f(track,1n))!==exactKey(observer))throw Error('SEM recognition track observer mismatch');
   const trackNumber=uint(f(track,2n)).toString();
   if(!items(f(experience,5n),'set').some(v=>exactKey(f(rec(v,224n),4n))===exactKey(track))&&!items(f(experience,6n),'set').some(v=>exactKey(f(rec(v,225n),4n))===exactKey(track)))throw Error('SEM recognition track outside experience');
   const resolutionId=occurrence(f(r,1n),1110n),time=uint(f(r,9n)).toString();
   if(str(f(r,10n))!==RECOGNITION_CONTRACT_VERSION)throw Error('SEM recognition language version');
   str(atom(f(r,6n),1018n));const cueIds=items(f(r,7n),'set').map(v=>occurrence(v,1108n));
   const revises=r.fields.has(8n)?occurrence(f(r,8n),1110n):null;
   const result=rec(f(r,5n),235n),tag=uint(f(result,1n));let candidate:string|null=null,label:string|null=null;
   if(tag===1n){const v=f(result,2n);validateSemanticReferent(v);candidate=exactKey(v);label=labels.get(candidate)??null;if(!label)throw Error('SEM recognition candidate label unqualified');}
   else if(tag!==2n||result.fields.has(2n))throw Error('SEM recognition resolution variant');
   const semantic={concept:tag===1n?'recognition.asserted-candidate':'recognition.withdrawn',observer:observerName,track:trackNumber,candidate,label,recordedAt:time,certainty:'not supplied',qualifiers:['observer-relative recognition','not verified world identity']};
   const human=tag===1n?`At recorded time ${time}, I recognized my track ${trackNumber} as ${label}. This is my recorded recognition, not a confirmation of who it really was.`:`At recorded time ${time}, I withdrew the recorded identity for my track ${trackNumber}.`;
   entries.push({sourceIndex,resolutionId,experienceId,revises,cueIds,semantic,human,exact:exactText(r)});
  }
 }
 return {version:'sem-recognition-language/0.1',observer:observerName,entries,scope:'Only accepted observer-relative recognition records joined to their experience. Mina/Darius/Glen labels name fixed authored candidates; they do not verify world identity. No confidence, cue interpretation, causal-role or complete-choice explanation is inferred. No record is not a no-recognition claim.'};
}
