import fixtures from './affectFixtures.json';
import profiles from './affectProfileSources.json';
import {canonicalDecode,RecordSchemaRegistry} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState,restoreStatePath,statePathValue} from '../substrate/state';
import {affectSupportedSchemas} from '../campaign3/affectCodecs';
import {exactKey,exactText,fromHex} from './canonical';
import type {AffectSnapshot} from './affectSession';
import type {compareAffect} from './affectComparison';
type Leaf={path:string;root:string;exact:string;lastWrite:string|null};
function history(snapshot:AffectSnapshot){
 const profile=profiles.models.find(m=>m.modelHash===snapshot.modelHash),model=fixtures.models.find(m=>m.name===profile?.name);if(!model)throw Error('Unknown state comparison model');
 const registry=new RecordSchemaRegistry(affectSupportedSchemas()),decode=(hex:string)=>canonicalDecode(fromHex(hex),registry),state=new Map<string,Leaf>();
 for(const e of restoreAuthoritativeState(decode(model.initialState)).entries()){const path=exactKey(statePathValue(e.path));state.set(path,{path,root:String(e.path.rootStateTypeId),exact:exactText(e.value),lastWrite:null});}
 const leaves=()=>[...state.values()].map(x=>({...x})).sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
 const rows:{at:string|null;leaves:Leaf[]}[]=[{at:null,leaves:leaves()}],seen=new Set<string>();let at:string|null=null;
 for(const event of snapshot.timeline){if(seen.has(event.id))throw Error('Duplicate state comparison event');seen.add(event.id);if(at!==event.instant){if(at!==null){if(BigInt(event.instant)<=BigInt(at))throw Error('Nonmonotonic state comparison history');rows.push({at,leaves:leaves()});}at=event.instant;}
  for(const diff of event.diffs){if((state.get(diff.path)?.exact??'Absent')!==diff.before)throw Error('Broken state comparison history');const root=String(restoreStatePath(decode(diff.path)).rootStateTypeId);if(diff.after==='Absent')state.delete(diff.path);else state.set(diff.path,{path:diff.path,root,exact:diff.after,lastWrite:event.id});}
 }
 if(at!==null)rows.push({at,leaves:leaves()});if(rows.length!==snapshot.prefix+1||(at!==null&&at!==snapshot.clock))throw Error('Incomplete state comparison horizon');
 const final=leaves().map(({lastWrite,...field})=>field),expected=[...snapshot.fields].sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);if(JSON.stringify(final)!==JSON.stringify(expected.map(f=>({path:f.path,root:f.root,exact:f.exact}))))throw Error('State comparison differs from native snapshot');return rows;
}
export function compareAffectStoredState(comparison:ReturnType<typeof compareAffect>){
 if(!comparison.aligned)throw Error('State comparison requires aligned horizons');const a=history(comparison.a),b=history(comparison.b);if(a.length!==b.length||a.some((r,i)=>r.at!==b[i].at))throw Error('State comparison calendars differ');
 const rows=a.map((r,i)=>{const other=b[i],paths=[...new Set([...r.leaves,...other.leaves].map(f=>f.path))].sort();return{at:r.at,fields:paths.map(path=>{const av=r.leaves.find(f=>f.path===path),bv=other.leaves.find(f=>f.path===path);return{path,root:av?.root??bv!.root,a:av?.exact??'Absent',b:bv?.exact??'Absent',aEvent:av?.lastWrite??null,bEvent:bv?.lastWrite??null,equal:(av?.exact??'Absent')===(bv?.exact??'Absent')};})};});
 const first=rows.find(r=>r.fields.some(f=>!f.equal));return{version:'affect-stored-state-comparison/0.1',identity:{a:{runHash:comparison.a.runHash,saveHash:comparison.a.saveHash},b:{runHash:comparison.b.runHash,saveHash:comparison.b.saveHash}},firstDifference:first?{at:first.at,initial:first.at===null}:null,rows,scope:'Exact canonical stored-leaf values after each committed instant, reconstructed from original initial state and checked before/after mutations, reconciled to both current native snapshots. Includes recorded support/precision differences. Model identity, output, choice and save differences are separate metrics. Missing leaves are Absent, not zero. Last-write links identify recorded mutations, not causal necessity.'};
}
