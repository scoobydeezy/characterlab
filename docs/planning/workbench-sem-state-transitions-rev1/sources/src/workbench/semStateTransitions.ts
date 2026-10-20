import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataItems as items,dataText as str} from '../campaign2/canonicalData';
import {restorePerceptualContinuantFileState,restorePerceptualEventFileState} from '../semanticBinding/semanticCodecs';
import {exactKey,exactText} from './canonical';
const roots=[{id:'241',label:'Perceptual continuant files'},{id:'242',label:'Perceptual event files'}] as const;
function state(value:CanonicalValue){const parts=items(value,'list');if(parts.length!==3||parts[2]!==true)throw Error('SEM committed state envelope');validate(parts[0],parts[1]);return parts.slice(0,2);}
function validate(a:CanonicalValue,b:CanonicalValue){rec(a,241n);rec(b,242n);restorePerceptualContinuantFileState(a);restorePerceptualEventFileState(b);}
export function semStateTransitions(trace:readonly CanonicalValue[],initial:CanonicalValue,current:CanonicalValue){
 let before=state(initial);const final=state(current),events=[];
 for(const [sourceIndex,contribution] of trace.entries()){
  const parts=items(contribution,'list');if(parts.length!==4)throw Error('SEM committed transition shape');
  const stage=str(parts[0]);if(!/^observe:character\/(mina|darius|glen)$/.test(stage))throw Error('SEM transition stage outside fixture');
  const after=parts.slice(1,3);validate(after[0],after[1]);
  const transitions=roots.map((root,i)=>({...root,before:exactText(before[i]),after:exactText(after[i]),changed:exactKey(before[i])!==exactKey(after[i]),declaredOwner:'authority/perception',canonicalBox:'Percept',observedReads:null,observedWrites:null}));
  events.push({sourceIndex,stage,transitions});before=after;
 }
 if(before.some((v,i)=>exactKey(v)!==exactKey(final[i])))throw Error('SEM terminal state/trace mismatch');
 return {version:'sem-committed-state-transitions/0.1',events,roots:roots.map(root=>({...root,canonicalBox:'Percept',declaredOwner:'authority/perception',recordedTransitions:events.length,changedTransitions:events.filter(e=>e.transitions.find(t=>t.id===root.id)!.changed).length,observedReads:null,observedWrites:null})),
  scope:'Exact consecutive committed snapshots of roots241/242, joined from the admitted initial state through the current authoritative save. Percept is the canonical Perception/Attention box; authority/perception is declared ownership. Changed values are observed; individual reads, writes and intermediate mutations are not instrumented. Null counts mean unavailable, not zero. Equal values do not prove no write. Recognition outputs are not invented recognition-state roots, and change does not establish causal necessity.'};
}
