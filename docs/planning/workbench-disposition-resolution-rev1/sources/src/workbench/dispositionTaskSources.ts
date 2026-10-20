import type {TimelineEvent} from './contracts';
import {ExactRational as Q} from '../substrate/exactMath';
import {dispositionFactorSources} from './dispositionFactorSources';
const rec=(x:any,name:string)=>{if(!x||x.record!==name)throw Error('Task-source record mismatch');return x;};
const list=(x:any)=>{if(!Array.isArray(x)||x.length>64)throw Error('Task-source list bound');return x;};
const key=(x:any)=>JSON.stringify(x);
const q=(x:string)=>{if(typeof x!=='string'||x.length>256||! /^-?\d+\/[1-9]\d*$/.test(x))throw Error('Task-source rational required');const [n,d]=x.split('/').map(BigInt);return Q.of(n,d);};
const text=(x:Q)=>`${x.numerator}/${x.denominator}`,zero=()=>Q.of(0n);
export function dispositionTaskSources(event:TimelineEvent,seamVersion:string){
 if(seamVersion!=='disposition-public/0.1-candidate')throw Error('Unqualified task-source profile');
 const factors=dispositionFactorSources(event),header={version:'disposition-task-sources/0.1',seamVersion,eventId:event.id,instant:event.instant};
 if(!factors.emitted)return {...header,emitted:false as const,rows:[],meanings:[]};
 const reasons=JSON.parse(event.output)[1],raw=rec(reasons['Raw [4]'],'TaskRawSignalContext#403/1'),options=rec(raw['CandidateOptions [2]'],'TaskCandidateOptions#398/1');
 if(key(options)!==key(reasons['Options [3]']))throw Error('Task-source options lineage mismatch');
 const motive=rec(options['MotiveContext [2]'],'TaskMotiveContext#394/1'),concern=rec(motive['Concern [2]'],'TaskConcern#388/1'),appraisal=rec(concern['Appraisal [2]'],'TaskAppraisal#384/1'),workspace=rec(appraisal['Workspace [2]'],'TaskWorkspace#381/1'),forecast=rec(workspace['Forecast [5]'],'WorkspaceForecast#380/1');
 if(!['1','2'].includes(forecast['VariantTag [1]']))throw Error('Unknown task forecast variant');
 const evidence=forecast['VariantTag [1]']==='1'?[]:list(rec(forecast['PredictionValue [2]'],'MeasurementPrediction#361/1')['EvidenceBasis [2]']);
 const basis=evidence.map(ref=>[key({record:'ReasonEvidenceAtom#399/1','VariantTag [1]':'1','ObservationReference [2]':ref}),'1/1']);
 const unique=(values:any[],type:string,field:string)=>{const map=new Map<string,any>();for(const v of values){rec(v,type);const k=key(v[field]);if(map.has(k))throw Error('Duplicate task source');map.set(k,v);}return map;};
 const motives=unique(list(motive['Motives [3]']),'TaskMotiveItem#393/1','TaskCommitmentKey [1]'),responses=unique(list(concern['Responses [3]']),'TaskConcernItem#387/1','TaskCommitmentKey [1]'),seen=new Set<string>(),rows:object[]=[],meanings:object[]=[];
 const candidates=list(options['Candidates [3]']);if(candidates.length>2)throw Error('Task candidate bound');
 for(const v of candidates){
  const candidate=rec(v,'ProceduralCandidate#397/1'),candidateKey=candidate['Key [1]'];let total=zero();
  for(const origin of list(candidate['Origins [2]'])){
   const task=rec(origin,'ProceduralCandidateOrigin#396/1')['TaskCommitmentKey [1]'],m=motives.get(key(task)),responseEntry=responses.get(key(task)),response=responseEntry?rec(responseEntry['Response [2]'],'TaskConcernResponse#386/1'):null;
   if(response&&!['1','2'].includes(response['VariantTag [1]']))throw Error('Unknown concern response variant');
   const responseState=!response?'missing':response['VariantTag [1]']==='1'?'unavailable':'scalar',base=m?q(m['RawPressure [2]']):zero(),situation=responseState==='scalar'?q(response['Intensity [2]']):zero();
   total=total.add(base).add(situation);
   const links=([['base','1',base],['situational','2',situation]] as const).map(([role,id,strength])=>{
    const sourceKey=key({record:'TaskRawSignalKey#401/1','CandidateKey [1]':candidateKey,'TaskCommitmentKey [2]':task,'SourceRole [3]':id}),matches=factors.rows.filter(r=>r.key===sourceKey);
    if(seen.has(sourceKey))throw Error('Ambiguous task origin');seen.add(sourceKey);
    if(matches.length!==(strength.numerator===0n?0:1))throw Error('Task-source emission mismatch');
    if(matches.length){
     if(!q(matches[0].strength).equals(strength))throw Error('Task-source strength mismatch');
     const actual=list(JSON.parse(matches[0].basis)['Weights [1]']).map(([atom,w]:any[])=>[key(atom),w]),expected=role==='base'?[]:basis;
     if(key([...actual].sort())!==key([...expected].sort()))throw Error('Task-source evidence basis mismatch');
    }
    return {role,sourceKey,emitterValue:text(strength),emitted:matches.length===1};
   });
   rows.push({candidate:key(candidateKey),task:key(task),motiveOccurrence:key(motive['MotiveContextOccurrenceId [1]']),concernOccurrence:key(concern['ConcernOccurrenceId [1]']),motiveState:m?'present':'missing',basePressure:m?text(base):null,responseState,responseIntensity:responseState==='scalar'?text(situation):null,forecastState:forecast['VariantTag [1]']==='1'?'unavailable':'available',links});
  }
  const absolute=Q.of(total.numerator<0n?-total.numerator:total.numerator,total.denominator),bounded=total.divide(Q.of(1n).add(absolute)),matches=list(raw['NonIdentitySemanticPressure [4]']).filter(([k]:any[])=>key(k)===key(candidateKey));
  if(matches.length!==1||!q(matches[0][1]).equals(bounded))throw Error('Task semantic-pressure mismatch');
  meanings.push({candidate:key(candidateKey),signedTotal:text(total),nonIdentitySemanticPressure:text(bounded)});
 }
 if(factors.rows.some(r=>r.role!=='standing'&&!seen.has(r.key)))throw Error('Unaccounted task signal');
 return {...header,emitted:true as const,rows,meanings,scope:'Recorded candidate-origin/task-key joins supply base motive pressure and concern-response operands. Unavailable or missing responses remain distinct from scalar zero; all emit no situational signal under this source contract. Forecast evidence grounds only situational signals. Non-identity semantic pressure bounds base+situational totals and excludes standing feedback. This is version-bound recorded dataflow, not observer testimony or a claim that unavailable concern means no concern.'};
}
