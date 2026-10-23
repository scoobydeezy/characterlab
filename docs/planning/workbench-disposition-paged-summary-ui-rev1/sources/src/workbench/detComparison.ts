import {DetWorkbenchRun} from './detAdapter';
import catalog from './detCatalog.json';
import {decodeCognitive} from '../campaign2/cognitiveCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {exactKey,exactText,fromHex} from './canonical';
import {scalar} from './nativeTimeline';

export const DET_COMPARISON_VERSION='det-prefix-comparison/0.1';
/** Read-only comparison of authenticated native runs. Natural RNG addresses are
 * retained exactly; a shared seed never supplies a cross-model coupling map. */
export function compareDet(a:DetWorkbenchRun,b:DetWorkbenchRun){
 const views=[a.snapshot(),b.snapshot()],checkpoints=[a.checkpoint(),b.checkpoint()];
 const originals=views.map(v=>{const p=catalog.programs.find(p=>p.name===v.program);if(!p)throw Error('Unknown DET comparison program');return p;});
 const models=originals.map(p=>catalog.models.find(m=>m.name===p.model)!);
 const sameProgram=originals[0].name===originals[1].name;
 if(!sameProgram&&!(originals[0].name==='baseline'&&originals[1].name==='equal-criteria'))throw Error('Undeclared DET model comparison order');
 const aligned=views[0].prefix===views[1].prefix&&views[0].clock===views[1].clock;
 const saves=checkpoints.map(c=>rec(decodeCognitive(fromHex(c.saveHex)),132n));
 const sections=Array.from(new Set(saves.flatMap(s=>[...s.fields.keys()]))).sort((a,b)=>a<b?-1:a>b?1:0).map(id=>{
  const values=saves.map(s=>s.fields.get(id));return {field:String(id),name:saves[0].schema.fields.find(f=>f.id===id)?.name??'Unknown native field',present:values.map(v=>v!==undefined),equal:aligned?(values[0]===undefined||values[1]===undefined?values[0]===values[1]:exactKey(values[0])===exactKey(values[1])):null};
 });
 const draws=saves.map(save=>items(f(save,11n),'list').flatMap(v=>{const row=rec(v,160n),event=rec(f(row,4n),130n);return items(f(row,14n),'list').map((draw,index)=>({eventId:scalar(f(event,1n)),instant:scalar(f(event,2n)),phase:scalar(f(event,3n)),index,exact:exactText(draw),canonicalHex:exactKey(draw)}));}));
 const equal=(key:'stateHash'|'saveHash'|'outputsHash'|'traceHash')=>aligned?views[0][key]===views[1][key]:null;
 return {version:DET_COMPARISON_VERSION,kind:sameProgram?'same-program-replay':'declared-model-contrast',aligned,alignment:'Same complete-prefix count and simulation instant; no semantic identity remapping.',prefixes:views.map(v=>v.prefix),clocks:views.map(v=>v.clock),sameInitialState:originals[0].initialState===originals[1].initialState,sameInputs:originals[0].orderedInputs===originals[1].orderedInputs,sameSeed:originals[0].runSeed===originals[1].runSeed,sameModel:models[0].modelIdentity===models[1].modelIdentity,sameRunIdentity:views[0].runHash===views[1].runHash,
  change:sameProgram?'No original data or model change. Exact replay equality is assessed at aligned complete prefixes.':'Original equal-criteria fixture changes both task criteria to4 and6. Model commitments and natural RNG domains remain distinct.',
  coupling:'No externally supplied coupling map. Equal seeds or equal draw counts do not establish shared natural addresses across models.',
  stateEqual:equal('stateHash'),saveEqual:equal('saveHash'),outputsEqual:equal('outputsHash'),traceEqual:equal('traceHash'),drawRecordsEqual:aligned?JSON.stringify(draws[0])===JSON.stringify(draws[1]):null,
  sections,draws,identityContributionCounts:views.map(v=>v.fields.filter(e=>e.root==='415').length),originals,models,versions:catalog.versions,checkpoints,
  scope:'Researcher replay and declared model contrast only. Draw records are actual committed trace entries, not character uncertainty. Missing identity contribution does not mean no draw occurred. Unaligned equality is unknown. No full DET failure/capacity or corpus qualification.'};
}
