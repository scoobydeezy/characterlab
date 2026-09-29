import {canonicalEncode,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint} from '../campaign2/canonicalData';
import {value} from '../campaign3/biologyPublicData';
import {type Appraisal} from '../campaign3/biologyPublicMath';
import {type identityBiologicalChoice} from '../campaign3/identityBiologicalChoice';
import {identityFold,qualifications} from '../campaign3/identityPublicMath';
import {type advanceBiology} from '../campaign3/biologicalDynamics';
import {type Action} from '../campaign3/biologicalIntegration';
export const hex=(v:CanonicalValue)=>Array.from(canonicalEncode(v),b=>b.toString(16).padStart(2,'0')).join('');
export function sleepSummary(outputs:readonly CanonicalValue[]){
 const records=(type:number)=>outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===BigInt(type)).map(v=>rec(v,BigInt(type)));
 const apps=records(1411),decisions=records(1414),qs=records(1434),js=records(1437),ls=records(1420),world=records(1418),feedback=records(1442);
 return apps.map((a,i)=>{
  const journal=f(js[i],3n),strength=identityFold(journal).strength;
  return {at:i+1,appraisal:value<Appraisal>(f(a,3n)),choice:value<Omit<Awaited<ReturnType<typeof identityBiologicalChoice>>,'nuclei'>>(f(decisions[i],4n)),status:Number(uint(f(qs[i],3n))),identity:`${strength.numerator}/${strength.denominator}`,qualificationCount:qualifications(journal).length,journalHex:hex(journal),learningHex:hex(f(ls[i],3n)),feedbackJournalHex:hex(f(feedback[i],3n)),physical:value<{transition:ReturnType<typeof advanceBiology>;executed:Action|null;challenge:number}>(f(world[i],2n))};
 });
}
