import {recurrenceFixture,taskC,taskD,decode,items,key,list,signed,u,enc} from './assembledCommitmentRecurrence';
import {WITNESS_RULES,WITNESS_REGISTRY} from '../../assembled/model';
import {W_SOURCE} from '../../assembled/commitmentWitness';
import {COMMITMENT_REQUEST} from '../../assembled/commitment';
import {PRIORITY_DISPLAY,PRIORITY_ADOPTION} from '../../assembled/priority';
import type {CanonicalValue} from '../../substrate/canonicalEncoding';
export type Mode='primary'|'swapped'|'both'|'private'|'absent';
export function witnessFixture(mode:Mode='primary',hidden=false){
 const b=recurrenceFixture(),xs=items(decode(b.d.orderedInputs),'list').map(v=>{
  if(mode!=='absent')return v;const a=[...items(v,'list')],at=(a[0] as {value:bigint}).value;
  if(key(a[2])===key(PRIORITY_DISPLAY)&&[12n,16n].includes(at)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=[...items(v,'list')];x[1]=list([]);x[5]=list([]);return list(x);}))]);}
  if(key(a[2])===key(COMMITMENT_REQUEST)&&at===14n)a[3]=list([taskC,false,false]);return list(a);
 });
 const events:CanonicalValue[]=[[12,taskC],[14,taskC],[16,taskC],[18,taskD],[19,taskD],[20,taskC]].map(([at,task])=>{let access=[at===12||at===14||at===19||at===20,at===18||at===19];if(mode==='swapped')access=access.reverse();if(mode==='both')access=[at!==16,at!==16];if(mode==='private'||mode==='absent')access=[false,false];return list([signed(at as number),u(30),W_SOURCE,list([task as CanonicalValue,...access,hidden]),list([])]);});
 return {s:{...b.s,rulesVersion:WITNESS_RULES,registrySchemaVersion:WITNESS_REGISTRY},d:{...b.d,orderedInputs:enc(list([...xs,...events]))}};
}
export * from './assembledCommitmentRecurrence';
