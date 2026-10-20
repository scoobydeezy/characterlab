import type {TimelineEvent} from './contracts';
import {ExactRational as Q,roundEven} from '../substrate/exactMath';
import {dispositionFactorSources} from './dispositionFactorSources';
const laws=['Plastic','Leaky','Refold','StandingOnly','Neither','JointMax','JointAdd'];
const rec=(x:any,name:string)=>{if(!x||x.record!==name)throw Error('Provenance record mismatch');return x;};
const q=(x:string)=>{if(typeof x!=='string'||x.length>256||! /^-?\d+\/[1-9]\d*$/.test(x))throw Error('Provenance rational required');const [n,d]=x.split('/').map(BigInt);return Q.of(n,d);};
const t=(x:Q)=>`${x.numerator}/${x.denominator}`,abs=(x:Q)=>Q.of(x.numerator<0n?-x.numerator:x.numerator,x.denominator);
export function dispositionProvenance(event:TimelineEvent,law:string,seamVersion:string){
 if(!laws.includes(law)||seamVersion!=='disposition-public/0.1-candidate')throw Error('Unqualified provenance profile');
 const factors=dispositionFactorSources(event),header={version:'disposition-provenance/0.1',seamVersion,law,eventId:event.id,instant:event.instant};
 if(!factors.emitted)return {...header,emitted:false as const};
 const [operands]=JSON.parse(event.output);
 const read=(root:string,type:string)=>{
  const matches=event.reads.filter(r=>JSON.parse(r.label)['RootStateTypeId [1]']===root);
  if(matches.length!==1)throw Error('Provenance requires one exact owned-state read');
  return {path:matches[0].path,value:rec(JSON.parse(matches[0].exact),type)};
 };
 const constitution=read('1457','ImmutableConstitution#1453/1'),journal=read('1436','IdentityQualificationJournal#1435/1');
 if(JSON.stringify(constitution.value)!==JSON.stringify(operands['Constitution [2]'])||JSON.stringify(journal.value)!==JSON.stringify(operands['QualifiedHistory [7]']))throw Error('Provenance read/operand mismatch');
 const entries=journal.value['Qualifications [1]'];if(!Array.isArray(entries)||entries.length>96)throw Error('Provenance history bound');
 let support=Q.of(0n),opposition=Q.of(0n),plastic=Q.of(0n),previous=0n;const occurrences=new Set<string>(),contributions:Q[]=[],history:object[]=[],batches:object[]=[];
 for(const entry of entries){
  rec(entry,'IdentityQualification#1434/1');const expression=rec(entry['Expression [2]'],'IdentityExpression#1433/1'),at=BigInt(expression['At [8]']),id=JSON.stringify(entry['Occurrence [1]']),e=q(entry['Contribution [4]']);
  if(entry['Disposition [3]']!=='1'||e.numerator===0n||abs(e).compare(Q.of(1n))>0||at<=previous||at>=BigInt(event.instant)||occurrences.has(id))throw Error('Provenance qualification invariant');
  previous=at;occurrences.add(id);contributions.push(e);
  const beforeSupport=t(support),beforeOpposition=t(opposition),s=support.add(e.numerator>0n?e:Q.of(0n)),o=opposition.add(e.numerator<0n?abs(e):Q.of(0n));
  support=Q.of(roundEven(s.numerator*1_000_000n,s.denominator),1_000_000n);opposition=Q.of(roundEven(o.numerator*1_000_000n,o.denominator),1_000_000n);
  history.push({occurrence:id,instant:String(at),contribution:t(e),beforeSupport,beforeOpposition,supportInput:t(s),oppositionInput:t(o),support:t(support),opposition:t(opposition)});
  if(contributions.length%4===0){
   const sum=contributions.slice(-4).reduce((a,b)=>a.add(b),Q.of(0n)),sign=BigInt(sum.compare(Q.of(0n))),before=t(plastic);
   if(law==='StandingOnly'||law==='Neither')plastic=Q.of(0n);
   else if(law==='Leaky')plastic=plastic.add(Q.of(sign,4n)).divide(Q.of(2n));
   else{plastic=plastic.add(Q.of(sign,8n));if(plastic.compare(Q.of(1n,4n))>0)plastic=Q.of(1n,4n);if(plastic.compare(Q.of(-1n,4n))<0)plastic=Q.of(-1n,4n);}
   batches.push({endingEntry:contributions.length,sum:t(sum),sign:String(sign),before,after:t(plastic)});
  }
 }
 const standing=support.subtract(opposition).divide(Q.of(1n).add(support).add(opposition));
 if(!standing.equals(q(operands['Standing [4]']))||!plastic.equals(q(operands['Plastic [3]'])))throw Error('Provenance history fold mismatch');
 let plasticPath:string|null=null;
 if(law==='Refold'){if(event.reads.some(r=>JSON.parse(r.label)['RootStateTypeId [1]']==='1458'))throw Error('Refold unexpectedly reads plastic state');}
 else{const stored=read('1458','PlasticDisposition#1454/1');plasticPath=stored.path;if(!plastic.equals(q(stored.value['Value [1]'])))throw Error('Provenance stored plastic mismatch');}
 const base=q(constitution.value['Value [1]']),acquired=law==='StandingOnly'?standing:law==='Neither'?Q.of(0n):law==='JointAdd'?plastic.add(standing):law==='JointMax'?(abs(plastic).compare(abs(standing))>0?plastic:standing):plastic,feedback=base.add(acquired);
 if(!base.add(plastic).equals(q(operands['Effective [5]']))||!feedback.equals(q(operands['Feedback [6]'])))throw Error('Provenance feedback law mismatch');
 const standingRows=factors.rows.filter(r=>r.role==='standing');
 if(standingRows.length!==(feedback.numerator===0n?0:2))throw Error('Provenance standing emission mismatch');
 const signals=standingRows.map(row=>{
  const key=JSON.parse(row.key),action=key['CandidateKey [1]']['ProtocolActionDefinitionId [2]'].identity;
  if(!['action/longitudinal/a','action/longitudinal/b'].includes(action))throw Error('Provenance unknown opposing candidate');
  const expected=action.endsWith('/a')?feedback:Q.of(0n).subtract(feedback);
  if(!expected.equals(q(row.strength))||JSON.parse(row.basis)['Weights [1]'].length!==0)throw Error('Provenance standing signal mismatch');
  return {sourceKey:row.key,action,strength:row.strength,basis:row.basis};
 });
 if(new Set(signals.map(s=>s.action)).size!==signals.length)throw Error('Provenance duplicate opposing candidate');
 return {...header,emitted:true as const,constitution:{path:constitution.path,value:t(base)},journalPath:journal.path,plasticPath,
  history,batches,incompleteBatchEntries:entries.length%4,support:t(support),opposition:t(opposition),standing:t(standing),plastic:t(plastic),effective:t(base.add(plastic)),acquired:t(acquired),feedback:t(feedback),signals,
  scope:'Version-bound reconstruction of recorded owned-state reads, accepted journal contributions, identity round-to-even at1e-6, four-entry plastic batches and selected feedback law. JointMax uses identity standing on equal absolute magnitudes. Refold derives plasticity from the same journal and has no plastic-state read. Opposing standing signals have empty evidence bases. This proves this recorded dataflow, not independent psychological necessity or represented self-knowledge.'};
}
