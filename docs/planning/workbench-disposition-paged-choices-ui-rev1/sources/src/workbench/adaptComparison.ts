import {list,text,unsigned,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {statePathValue,restoreAuthoritativeState} from '../substrate/state';
import {campaign2Record} from '../campaign2/codecs';
import {decodeMemory} from '../campaign2/memoryCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {exactKey,exactText,fromHex} from './canonical';
import {scalar} from './nativeTimeline';
import {AdaptWorkbenchRun} from './adaptAdapter';
import catalog from './adaptCatalog.json';
const id=(n:number,s:string)=>typedIdentifier(n,text(s));
const ensure=(ok:boolean,message:string)=>{if(!ok)throw Error('ADAPT comparison: '+message);};
const same=(a:CanonicalValue,b:CanonicalValue)=>exactKey(a)===exactKey(b);
const type=(v:CanonicalValue,n:bigint)=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===n;
const event=(v:CanonicalValue)=>rec(f(rec(v,160n),4n),130n);
const name=(v:CanonicalValue)=>{const t=f(event(v),5n);ensure(typeof t!=='boolean'&&t.kind==='typedIdentifier','event identity');return typeof t!=='boolean'&&t.kind==='typedIdentifier'?exactText(t.payload):'';};
const single=(rows:readonly CanonicalValue[],n:string)=>{const r=rows.filter(v=>name(v)===JSON.stringify('event/'+n));ensure(r.length===1,'one '+n);return rec(r[0],160n);};
const eid=(v:CanonicalValue)=>scalar(f(event(v),1n));
/** Accepted fixture paths are constructed from its frozen governed identities,
 * independently of observed patches. No native trace edge is synthesized. */
export function compareAdapt(a:AdaptWorkbenchRun,b:AdaptWorkbenchRun){
 const views=[a.snapshot(),b.snapshot()],checkpoints=[a.checkpoint(),b.checkpoint()];ensure(views[0].program==='count-0'&&views[1].program==='count-1','declared ordered count0/count1 pair');
 const originals=catalog.programs;ensure(originals[0].initialState===originals[1].initialState&&originals[0].runSeed===originals[1].runSeed,'common S0/seed');ensure(views[0].modelHash===views[1].modelHash,'common model');
 const initial=restoreAuthoritativeState(decodeMemory(fromHex(originals[0].initialState))).entries(),C=f(rec(initial.find(e=>e.path.rootStateTypeId===268n)!.value,267n),1n),V=id(1029,'variable/fixture-regulation');
 const keys=[campaign2Record('ToleranceKey',{CharacterId:C,ExposureReferentId:C,RegulatoryVariableId:V}),campaign2Record('SensitizationKey',{CharacterId:C,ExposureReferentId:C,RegulatoryVariableId:V}),campaign2Record('RegulatoryAdaptationKey',{CharacterId:C,RegulatoryVariableId:V}),campaign2Record('AccumulatedLoadKey',{CharacterId:C,LoadDomainId:id(1033,'load/fixture-load')})];
 const expected=keys.map((key,i)=>statePathValue({rootStateTypeId:302n,fieldId:BigInt(i+1),selectors:[{kind:'mapKey',key}]})),expectedKeys=expected.map(exactKey),aligned=views[0].prefix===views[1].prefix&&views[0].clock===views[1].clock;
 const saves=checkpoints.map(c=>rec(decodeMemory(fromHex(c.saveHex)),132n)),traces=saves.map(s=>items(f(s,11n),'list')),outputs=saves.map(s=>items(f(s,12n),'list'));
 let exposure:null|unknown=null,reveal:null|unknown=null;
 if(aligned&&views[0].prefix>=1){const rows=traces.map(ts=>ts.filter(t=>scalar(f(event(t),2n))==='2'&&scalar(f(event(t),3n))==='140'));ensure(rows.every(r=>r.length===1),'one exposure settlement per run');
  const diffs=rows.map(r=>items(f(rec(r[0],160n),17n),'list').map(v=>rec(v,148n))),dispatches=outputs.map(os=>os.filter(v=>type(v,324n))),evaluations=outputs.map(os=>os.filter(v=>type(v,325n)));
  ensure(dispatches.every(r=>r.length===1)&&same(f(rec(dispatches[0][0],324n),3n),f(rec(dispatches[1][0],324n),3n)),'same applicable rules');ensure(items(f(rec(dispatches[0][0],324n),3n),'set').length===4,'four applicable rules');
  evaluations.forEach((es,i)=>{ensure(es.length===4,'four evaluations');ensure(JSON.stringify(es.map(v=>exactKey(f(rec(v,325n),4n))).sort())===JSON.stringify([...expectedKeys].sort()),'exact evaluated target set');ensure(es.every(v=>same(f(rec(f(rec(v,325n),6n),327n),1n),unsigned(i===0?1:2))),'no-op/state-change result kinds');});
  ensure(diffs[0].length===0,'count0 no mutation');ensure(JSON.stringify(diffs[1].map(d=>exactKey(f(d,1n))).sort())===JSON.stringify([...expectedKeys].sort()),'count1 exact four mutations');
  exposure={expectedTargets:expected.map(exactText),expectedChangedPaths:[[],expectedKeys],events:rows.map(r=>eid(r[0])),evaluations:evaluations.map(es=>es.map(exactText)),actualDiffs:diffs.map(ds=>ds.map(exactText))};
  if(views[0].prefix>=2){const probe=traces.map(ts=>single(ts,'regulatory-diagnostic-probe')),reads=probe.map(t=>items(f(t,11n),'list'));ensure(reads.every(rs=>rs.length===1&&same(f(rec(rs[0],147n),2n),expected[2])),'D-only probe read');ensure(f(rec(reads[0][0],147n),3n)===false&&f(rec(reads[1][0],147n),3n)===true,'absent/present D');const write=diffs[1].find(d=>same(f(d,1n),expected[2]))!;ensure(same(f(rec(reads[1][0],147n),4n),f(write,5n)),'earlier D write equals later read');
   const chains=traces.map(ts=>['regulatory-diagnostic-probe-observation','measurement-evidence-intake','measurement-episode-evidence','measurement-episode-formation'].map(n=>single(ts,n)));
   chains.forEach((chain,i)=>chain.forEach((t,j)=>ensure(items(f(event(t),8n),'list').some(p=>scalar(p)===eid(j?chain[j-1]:probe[i])),'native observation chain')));
   ensure(probe.every(t=>items(f(event(t),8n),'list').length===0),'probe remains independent original root');
   const records=outputs.map(os=>{const observation=os.filter(v=>type(v,203n)).at(-1)!,carriage=os.find(v=>type(v,337n))!,evidence=os.find(v=>type(v,342n))!;ensure(same(f(rec(carriage,337n),2n),observation)&&same(f(rec(evidence,342n),2n),carriage),'actual observation/carriage/evidence join');return {observation:exactText(observation),carriage:exactText(carriage),evidence:exactText(evidence)};});
   reveal={dependencyKind:'State write/read dependency, not a scheduler-parent edge',path:exactText(expected[2]),probeReads:reads.map(rs=>exactText(rs[0])),probeRoots:probe.map(eid),nativeChains:chains.map(cs=>cs.map(t=>({event:eid(t),parents:items(f(event(t),8n),'list').map(scalar)}))),records};
  }
 }
 return {version:'adapt-parent-comparison/0.1',fixture:catalog.fixtureVersion,seam:catalog.seamVersion,adaptation:catalog.adaptationVersion,aligned,originals:structuredClone(originals),models:structuredClone(catalog.models),versions:structuredClone(catalog.versions),exposure,reveal,stateEqual:aligned?views[0].stateHash===views[1].stateHash:null,outputsEqual:aligned?views[0].outputsHash===views[1].outputsHash:null,randomPolicy:'Original zero seed; no draw coupling inferred. Exact random records remain in each native timeline.',runs:views.map(s=>({program:s.program,prefix:s.prefix,clock:s.clock,saveHash:s.saveHash,stateHash:s.stateHash,runHash:s.runHash})),scope:'Researcher dependency inspection of accepted parent pair. Unavailable stages remain null. No general adaptation law, character-safe narrative or new causal verdict.'};
}
