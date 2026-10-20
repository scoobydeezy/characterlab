/** Presentation of admitted reports only. Input must be the native observer projection,
 * never researchOutputs or state. Native bytes/hash remain the provenance authority. */
export const COMMIT_EXPLANATION_VERSION='commit-observer-explanation/0.1';
type ObjectValue=Record<string,unknown>;
function object(v:unknown):ObjectValue{if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Invalid COMMIT projection object');return v as ObjectValue;}
function fields(v:unknown,keys:string[]){const o=object(v);if(Object.keys(o).sort().join('|')!==keys.sort().join('|'))throw Error('Unexpected COMMIT report fields');return o;}
function uint(v:unknown){if(typeof v!=='string'||!/^(0|[1-9][0-9]*)$/.test(v))throw Error('Invalid COMMIT integer');return v;}
function identifier(v:unknown):void{const o=fields(v,['namespace','identity']);uint(o.namespace);if(typeof o.identity!=='string')identifier(o.identity);}
function own(v:unknown,observer:number){const o=fields(v,['namespace','identity']);if(o.namespace!=='1000'||o.identity!==`observer/commit/${observer===0?'a':'b'}`)throw Error('COMMIT observer mismatch');}
function observation(v:unknown,observer:number){
 const o=fields(v,['record','Id [1]','Observer [2]','At [3]','Task [4]','Status [5]']);
 if(o.record!=='CommitObservation#962/1')throw Error('Unknown COMMIT observation schema');
 const id=fields(o['Id [1]'],['namespace','identity']);if(id.namespace!=='1162')throw Error('Invalid COMMIT occurrence');uint(id.identity);own(o['Observer [2]'],observer);uint(o['At [3]']);
 const task=fields(o['Task [4]'],['record','CharacterId [1]','TaskReferent [2]']);if(task.record!=='TaskCommitmentKey#371/1')throw Error('Unknown COMMIT task schema');identifier(task['CharacterId [1]']);identifier(task['TaskReferent [2]']);
 const status=o['Status [5]'];if(status!=='0'&&status!=='1'&&status!=='2')throw Error('Unknown COMMIT report status');return {o,status,id,task};
}
export function explainCommitObserver(exact:string,observer:number){
 if(observer!==0&&observer!==1)throw Error('Unknown COMMIT observer');
 const values:unknown=JSON.parse(exact);if(!Array.isArray(values))throw Error('COMMIT projection must be a list');
 const reports:{sourceIndex:number;occurrence:unknown;task:unknown;at:string;status:string;text:string;exact:string}[]=[];
 values.forEach((v,index)=>{
  if(Array.isArray(v)){if(v.length!==4||v[0]!=='known-commitments'||!Array.isArray(v[3]))throw Error('Unknown COMMIT probe');uint(v[1]);own(v[2],observer);return;}
  const r=object(v);
  if(r.record==='CommitEvidence#963/1'){observation(r['Observation [2]'],observer);return;}
  if(r.record==='CommitSocialApplication#970/1'){own(r['Observer [2]'],observer);observation(object(r['Evidence [3]'])['Observation [2]'],observer);return;}
  const {o,status,id,task}=observation(v,observer),label=status==='0'?'absent':status==='1'?'active':'retired';
  reports.push({sourceIndex:index,occurrence:id,task,at:o['At [3]'] as string,status:label,
   text:`At instant ${o['At [3]']}, Observer ${observer===0?'A':'B'} received an admitted report that this concrete commitment was ${label}. This describes the report at that instant, not the commitment's current private state.`,exact:JSON.stringify(v,null,2)});
 });
 return {version:COMMIT_EXPLANATION_VERSION,observer,reports,
  scope:'Admitted observation reports only. Knowledge probes, evidence wrappers and knowledge updates remain in the exact projection; this renderer does not summarize them.',
  empty:reports.length===0?'No admitted commitment report appears in this observer projection. This does not establish that a commitment is absent.':null};
}
