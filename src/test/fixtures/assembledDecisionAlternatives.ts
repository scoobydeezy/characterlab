/** M83 test-only bridge to unchanged DECISION competitor kernels.
 * Cognitive operands come from native M82/M80 runs. Only an EMPTY Values extension
 * is erased for the old reader. Nothing here writes to a character or its ledger. */
import {expect} from 'vitest';
import {list,set,record,unsigned as u,typedIdentifier,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {cognitiveRecord as cr} from '../../campaign2/cognitiveCodecs';
import {receivingRecord as rec} from '../../assembled/codecs';
import {dataField as f,dataItems as items,dataKey as key} from '../../campaign2/canonicalData';
import {createCognitiveRandomSession,type ArbitrationDraws} from '../../campaign2/cognitiveArbitration';
import {arbitrationOutput} from '../../assembled/arbitration';
import {resolveDecision,decisionDraws} from '../../campaign3/decisionMath';
import {replace} from './assembledCharacter';
export function legacyContext(value:CanonicalValue){
 const context=rec(value,408n),raw=rec(f(context,2n),403n);
 if(raw.schema.schemaVersion!==2n||items(f(raw,5n),'set').length)throw Error('M83 empty Values lane required');
 for(const n of items(f(context,3n),'list'))if(rec(f(rec(n,407n),1n),404n).schema.schemaVersion!==1n)throw Error('M83 legacy nucleus required');
 const old=cr(403,[f(raw,1n),f(raw,2n),f(raw,3n),f(raw,4n)]);
 const restored=record(raw.schema,new Map([...rec(old,403n).fields,[5n,set([])]]));
 expect(key(restored)).toBe(key(raw));
 return replace(context,2n,old);
}
export const projected=(v:CanonicalValue)=>{const r=rec(v,935n);return list(Array.from({length:10},(_,i)=>f(r,BigInt(i+5))));};
export const chosen=(v:CanonicalValue)=>rec(f(rec(f(rec(v,409n),4n),419n),2n),420n);
export const dataFields=(v:CanonicalValue)=>list(Array.from({length:10},(_,i)=>f(rec(v,420n),BigInt(i+1))));
export const transcript=(data:CanonicalValue)=>{
 const d=rec(data,420n),out=items(f(d,9n),'list').map(v=>f(rec(v,422n),5n)),tie=rec(f(d,10n),423n);
 if(key(f(tie,1n))===key(u(2)))out.push(f(tie,3n));return out;
};
export async function addressed(context:CanonicalValue,root:CanonicalValue,seed:Uint8Array,run:(draws:ArbitrationDraws)=>Promise<CanonicalValue>){
 const session=createCognitiveRandomSession(seed);session.begin();
 try{const value=await run(session.forResolution(root,context));session.prepareCommit();session.commit();session.close();return {value,addresses:session.committedAddressKeys()};}
 catch(e){session.close();throw e;}
}
export const original=(context:CanonicalValue,definition:CanonicalValue,law:number,draws:ArbitrationDraws)=>resolveDecision(typedIdentifier(1161,u(1)),10n,context,definition,law,draws);
export const current=(context:CanonicalValue,definition:CanonicalValue,root:CanonicalValue,draws:ArbitrationDraws)=>arbitrationOutput(root,10n,context,definition,draws,3);
/** Legal result tokens for exact outcome enumeration. Not a claimed RNG evaluation.
 * Keep shape/address/span, replace result and the single accepted candidate. */
export function enumeration(context:CanonicalValue,templates:readonly CanonicalValue[],a:number,b:number,t:number){
 const ns=items(f(rec(context,408n),3n),'list'),used:CanonicalValue[]=[];
 function token(i:number,result:number){const base=rec(templates[i],411n),value=replace(replace(base,3n,u(result)),7n,list([cr(410,[u(0),u(result),false])]));
  used.push(value);return value;}
 const draws:ArbitrationDraws={async reason(n){const i=ns.findIndex(v=>key(v)===key(n));if(i<0||i>1)throw Error('M83 foreign nucleus');return token(i,i===0?a:b);},
 async tie(){return token(2,t);}};
 return {draws,used};
}
export {decisionDraws};
