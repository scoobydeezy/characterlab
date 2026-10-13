import {canonicalEncode,type CanonicalValue} from '../substrate/canonicalEncoding';
import {decodeSemanticValue,SEMANTIC_ADMITTED_TRANSFORMATION_VERSIONS} from '../semanticBinding/semanticCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataText as str} from '../campaign2/canonicalData';
import {exactKey,exactText} from './canonical';
import {EventRoleId} from '../semanticBinding/eventBindings';

export const SEM_CHARACTER_VERSION='sem-pre-recognition-projection/0.1';
const facets:Record<string,string>={
 'perceptual-facet/appears-person-like':'person-like',
 'perceptual-facet/appears-discrete-object-like':'discrete-object-like',
 'perceptual-facet/appears-interior-space-like':'interior-space-like',
 'perceptual-facet/appears-metallic':'metallic',
 'perceptual-facet/appears-elongated':'elongated',
 'perceptual-facet/appears-blunt':'blunt',
};
const roles:readonly string[]=Object.values(EventRoleId);
function atom(v:CanonicalValue,ns:bigint){if(typeof v==='boolean'||v.kind!=='typedIdentifier'||v.namespaceId!==ns)throw Error('SEM projection identity namespace');return v.payload;}
function occurrence(v:CanonicalValue,ns:bigint){uint(atom(v,ns));}
function version(v:CanonicalValue){if(!SEMANTIC_ADMITTED_TRANSFORMATION_VERSIONS.has(str(v)))throw Error('SEM projection contract version');}

/** Only the pre-recognition slot is consumed. Truth, recognition, causal-role and
 * renderer siblings are deliberately not inputs to this bounded description. */
export function projectSemCharacter(trace:readonly CanonicalValue[],observer:CanonicalValue){
 const observerName=str(atom(observer,1000n));
 const entries:{sourceIndex:number;experience:string;observedAt:string;human:string;exact:string}[]=[];
 const own=(v:CanonicalValue)=>{str(atom(v,1000n));if(exactKey(v)!==exactKey(observer))throw Error('SEM nested observer mismatch');};
 const local=(v:CanonicalValue,type:bigint)=>{const r=rec(v,type);own(f(r,1n));if(type===216n)occurrence(f(r,2n),1115n);else uint(f(r,2n));return r;};
 const support=(v:CanonicalValue)=>items(v,'set').forEach(x=>local(x,216n));
 trace.forEach((contribution,sourceIndex)=>{
  const parts=items(contribution,'list');if(parts.length!==4)throw Error('SEM trace contribution shape');
  const chain=items(parts[3],'list');if(chain.length!==4)throw Error('SEM chain shape');
  const candidate=rec(chain[1],227n);
  if(exactKey(f(candidate,2n))!==exactKey(observer))return;
  // Round-trip through the accepted registry rejects unknown fields/schema versions.
  const e=rec(decodeSemanticValue(canonicalEncode(candidate)),227n);
  own(f(e,2n));occurrence(f(e,1n),1106n);const at=uint(f(e,3n)).toString();version(f(e,9n));support(f(e,8n));
  const events=new Set(items(f(e,4n),'set').map(v=>{local(v,213n);return exactKey(v);}));
  if(items(f(e,7n),'set').length)throw Error('SEM event classification projection unavailable');
  const lines:string[]=[];
  for(const v of items(f(e,5n),'set')){
   const b=rec(v,224n);occurrence(f(b,1n),1103n);own(f(b,2n));local(f(b,3n),213n);
   if(!events.has(exactKey(f(b,3n))))throw Error('SEM event outside experience');
   const track=uint(f(local(f(b,4n),212n),2n)),role=rec(f(b,5n),223n),tag=uint(f(role,1n));
   let label:string;
   if(tag===1n){label=str(atom(f(role,2n),1003n));if(!roles.includes(label))throw Error('SEM unknown role');label=label.replace('event-role/','');}
   else if(tag===2n&&!role.fields.has(2n))label='unresolved';else throw Error('SEM role variant');
   support(f(b,6n));const when=uint(f(b,7n));version(f(b,8n));
   lines.push(`At recorded time ${when}, my track ${track} had ${label==='unresolved'?'an unresolved event role':`the perceived event role ${label}`}.`);
  }
  for(const v of items(f(e,6n),'set')){
   const c=rec(v,225n);occurrence(f(c,1n),1104n);occurrence(f(c,2n),1106n);
   if(exactKey(f(c,2n))!==exactKey(f(e,1n)))throw Error('SEM classification experience mismatch');
   own(f(c,3n));const track=uint(f(local(f(c,4n),212n),2n));
   const label=facets[str(atom(f(c,5n),1011n))],value=f(c,6n);
   if(!label||typeof value!=='boolean')throw Error('SEM unsupported perceived classification');
   str(atom(f(c,7n),1012n));items(f(c,8n),'set').forEach(x=>occurrence(x,1101n));support(f(c,9n));
   const when=uint(f(c,10n));version(f(c,11n));
   lines.push(`At recorded time ${when}, my track ${track} was classified as ${value?'':'not '}${label} in my perceptual evidence.`);
  }
  entries.push({sourceIndex,experience:exactKey(f(e,1n)),observedAt:at,human:lines.join(' '),exact:exactText(e)});
 });
 return {version:SEM_CHARACTER_VERSION,observer:observerName,entries,scope:'Pre-recognition perceived bindings and Boolean appearance classifications only. Track numbers are observer-local; appearance and perceived roles do not establish world identity, recognition or causal roles.',notice:entries.length?'Recorded evidence time is independent of scheduler time.':'No qualified pre-recognition experience is available at this prefix; this is not an absence-of-experience claim.'};
}
