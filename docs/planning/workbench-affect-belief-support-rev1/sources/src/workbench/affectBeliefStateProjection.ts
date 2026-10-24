import fixtures from './affectFixtures.json';
import profiles from './affectProfileSources.json';
import {canonicalDecode,RecordSchemaRegistry} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {affectSupportedSchemas} from '../campaign3/affectCodecs';
import {PROPOSITIONS,beliefPath} from '../campaign3/affectModel';
import {exactKey,exactText,fromHex} from './canonical';
import type {AffectSnapshot} from './affectSession';

const paths=PROPOSITIONS.map((p,i)=>({name:['Current cue','Baseline','Mitigation'][i],path:exactKey(statePathValue(beliefPath(p)))}));
function estimate(exact:string){
 if(exact==='Absent')return null;
 const value=JSON.parse(exact),mean=value['Mean [1]'],precision=value['Precision [2]'],support=value['Support [3]'];
 if(value.record!=='BeliefEstimate#739/1'||typeof mean!=='string'||!/^\d+\/[1-9]\d*$/.test(mean)||typeof precision!=='string'||!/^\d+$/.test(precision)||!Array.isArray(support))throw Error('Invalid stored belief estimate');
 const [n,d]=mean.split('/').map(BigInt);if(n>d)throw Error('Stored belief mean outside unit domain');
 return{mean,precision,support,plot:Number(n*1000000000n/d)/1000000000};
}
/** Replay only original committed state diffs, anchored to decoded frozen initial state. */
export function affectBeliefStateProjection(snapshot:AffectSnapshot){
 const profile=profiles.models.find(m=>m.modelHash===snapshot.modelHash),model=fixtures.models.find(m=>m.name===profile?.name);
 if(!model)throw Error('Unknown stored-belief model');
 const initial=restoreAuthoritativeState(canonicalDecode(fromHex(model.initialState),new RecordSchemaRegistry(affectSupportedSchemas()))).entries();
 const state=new Map(initial.map(e=>[exactKey(statePathValue(e.path)),exactText(e.value)]));
 const vector=()=>paths.map(p=>({...p,exact:state.get(p.path)??'Absent',estimate:estimate(state.get(p.path)??'Absent')}));
 const history:{eventId:string|null;at:string|null;vector:ReturnType<typeof vector>}[]=[{eventId:null,at:null,vector:vector()}],seen=new Set<string>();
 for(const event of snapshot.timeline){
  if(seen.has(event.id))throw Error('Duplicate state-history event');seen.add(event.id);
  const diffs=event.diffs.filter(d=>paths.some(p=>p.path===d.path));if(!diffs.length)continue;
  if(event.stage!=='apply'||new Set(diffs.map(d=>d.path)).size!==diffs.length)throw Error('Unexpected belief mutation');
  for(const diff of diffs){if((state.get(diff.path)??'Absent')!==diff.before)throw Error('Broken belief before/after history');estimate(diff.after);if(diff.after==='Absent')state.delete(diff.path);else state.set(diff.path,diff.after);}
  history.push({eventId:event.id,at:event.instant,vector:vector()});
 }
 const current=vector(),fields=snapshot.fields.filter(f=>f.root==='753');
 if(fields.some(f=>!paths.some(p=>p.path===f.path))||new Set(fields.map(f=>f.path)).size!==fields.length)throw Error('Unexpected stored belief path');
 for(const row of current)if(row.exact!==(fields.find(f=>f.path===row.path)?.exact??'Absent'))throw Error('Stored belief differs from reconstructed history');
 return{version:'affect-belief-state/0.1',modelHash:snapshot.modelHash,runHash:snapshot.runHash,saveHash:snapshot.saveHash,stateHash:snapshot.stateHash,prefix:snapshot.prefix,current,history,scope:'Three registered learned-belief means in root753; exact original initial state and committed apply mutations. Absence is not zero. Precision is recorded learning precision, not subjective certainty. This is researcher state inspection, not an independent emotion vector or proof of learning-evidence ancestry.'};
}
