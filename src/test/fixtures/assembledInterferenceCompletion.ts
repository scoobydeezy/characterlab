/** M205 planbc2130fd. Original1..8 -> native10..17, fixed M202 scene.
 * Nonsocial B/route1, body30/cap100/rate10/delivery90@9, K0/difficulty1,seed0. */
import {fixture as prior,decode,items,key,enc,list,text,signed,u,taskB,rec,f,uint,type Boundary} from './assembledInterferenceBoundaries';
import {interferenceSources} from '../interferenceExpectationFixtures';
import {successorSource} from '../interferenceExpectationSuccessorFixtures';
import {decodeAgency} from '../../campaign3/agencyCodecs';
import {INTERFERENCE_ACQUISITION_RULES,INTERFERENCE_ACQUISITION_REGISTRY} from '../../assembled/model';
import {INTERFERENCE,INTERFERENCE_SOURCE} from '../../assembled/interferenceExpectation';
export * from './assembledInterferenceBoundaries';
export type Case=Boundary|'correction'|'duplicate'|'repeat'|'successorDuplicate'|'successorRepeat';
export function fixture(name:Case){
 const boundary=(['main','clear','blocked','hidden','withheld','withheldChanged','noOpportunity'] as string[]).includes(name)?name as Boundary:'main';
 const b=prior(boundary),source=name==='successorDuplicate'||name==='successorRepeat'?successorSource(name==='successorRepeat'):interferenceSources()[name as Exclude<Case,'successorDuplicate'|'successorRepeat'>].orderedInputs;
 const original=items(decodeAgency(source),'list').map(v=>rec(v,973n)),reports=original.filter(v=>uint(f(v,2n))===2n);
 let index=0;const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];
  if(key(a[2])===key(INTERFERENCE_SOURCE)){const old=reports[index++];if(old){a[0]=signed((f(old,1n) as {value:bigint}).value+9n);a[3]=list([text(INTERFERENCE),taskB,u(8n+2n*uint(f(old,3n))),f(old,8n),items(f(old,10n),'set').some(x=>key(x)===key(u(1))),f(old,9n)]);}}
  return list(a);
 });
 if(index!==4)throw Error('M205 four reserved source slots');
 return {...b,name,original,s:{...b.s,rulesVersion:INTERFERENCE_ACQUISITION_RULES,registrySchemaVersion:INTERFERENCE_ACQUISITION_REGISTRY},d:{...b.d,orderedInputs:enc(list(rows))}};
}
