import catalog from './fatigueCatalog.json';
import type {FatigueSnapshot} from './fatigueAdapter';
import {decodeFatigue} from '../campaign3/fatigueCodecs';
import {digest,exactText,fromHex} from './canonical';

export interface FatigueContrast {id:string;a:string;b:string;kind:'model'|'input';changed:string;}
const program=(id:string)=>{const p=catalog.programs.find(p=>p.id===id);if(!p)throw Error('Unknown FATIGUE program');return p;};
const settings=(a:ReturnType<typeof program>,b:ReturnType<typeof program>)=>(['candidate','law'] as const).filter(k=>a[k]!==b[k]);
const contrasts:FatigueContrast[]=[];
for(let i=0;i<catalog.programs.length;i++)for(let j=i+1;j<catalog.programs.length;j++){
 const a=catalog.programs[i],b=catalog.programs[j],d=settings(a,b);
 if(a.orderedInputs===b.orderedInputs&&d.length===1)contrasts.push({id:`model/${a.id}/${b.id}`,a:a.id,b:b.id,kind:'model',changed:d[0]});
}
for(const p of catalog.programs.filter(p=>p.candidate===1&&p.law===1&&p.name!=='main'))contrasts.push({id:`input/${p.name}`,a:'1/1/main',b:p.id,kind:'input',changed:'Original input calendar; inspect exact field differences. Multiple changes and different horizons are not asserted to be a single intervention.'});
contrasts.push({id:'privacy/denied-absent',a:'1/1/denied',b:'1/1/absent',kind:'input',changed:'Denied versus absent sensor calendars; exact physical/display differences remain explicit.'});
contrasts.push({id:'input/motor-only-challenge',a:'3/1/main',b:'3/1/motorChallenge',kind:'input',changed:'Forced visible exercise at4 under MotorOnly; legitimate changed performance can change later admitted history.'});
contrasts.push({id:'input/any-fatigue-mild',a:'4/1/main',b:'4/1/mild',kind:'input',changed:'Severe versus mild physical grade under AnyFatigue; authentic admitted sensor grades may change.'});
contrasts.push({id:'input/rested-external-load',a:'1/1/rested',b:'1/1/externalLoad',kind:'input',changed:'External card only at5..7 with identical rested physical condition and sensor evidence. Fatigue is not a workload card.'});
export const FATIGUE_CONTRASTS:readonly FatigueContrast[]=Object.freeze(contrasts.map(c=>Object.freeze(c)));

/** Paths are display coordinates in decoded canonical input; values retain exact integer strings. */
function differences(a:unknown,b:unknown,path='$'):Array<{path:string;a:unknown;b:unknown}>{
 if(JSON.stringify(a)===JSON.stringify(b))return [];
 if(a!==null&&b!==null&&typeof a==='object'&&typeof b==='object'&&Array.isArray(a)===Array.isArray(b)){
  const x=a as Record<string,unknown>,y=b as Record<string,unknown>;
  return [...new Set([...Object.keys(x),...Object.keys(y)])].flatMap(k=>differences(x[k],y[k],`${path}/${k}`));
 }
 return [{path,a:a===undefined?{missing:true}:a,b:b===undefined?{missing:true}:b}];
}
export async function compareFatigue(id:string,a:FatigueSnapshot,b:FatigueSnapshot){
 const contrast=FATIGUE_CONTRASTS.find(c=>c.id===id);if(!contrast||a.program!==contrast.a||b.program!==contrast.b)throw Error('FATIGUE requires its declared ordered pair');
 const originals=[program(a.program),program(b.program)],changedSettings=settings(originals[0],originals[1]);
 for(const [i,s] of [a,b].entries()){
  if(s.contractVersion!==catalog.contractVersion||s.identityVersion!==catalog.identityVersion)throw Error('FATIGUE version mismatch');
  if(s.modelHash!==await digest(fromHex(originals[i].modelIdentity))||s.runHash!==await digest(fromHex(originals[i].runIdentity)))throw Error('FATIGUE original identity mismatch');
  if(!Number.isInteger(s.prefix)||s.prefix<0||s.prefix>16||s.observerHash!==await digest(fromHex(s.observerHex))||s.observerExact!==exactText(decodeFatigue(fromHex(s.observerHex))))throw Error('FATIGUE snapshot commitment mismatch');
 }
 if(contrast.kind==='model'&&(changedSettings.length!==1||originals[0].orderedInputs!==originals[1].orderedInputs))throw Error('FATIGUE model contrast mismatch');
 if(contrast.kind==='input'&&(changedSettings.length||originals[0].modelIdentity!==originals[1].modelIdentity))throw Error('FATIGUE input contrast mismatch');
 const aligned=a.prefix===b.prefix&&a.clock===b.clock,paths=[...new Set([...a.fields,...b.fields].map(f=>f.path))];
 const summary=(s:FatigueSnapshot)=>({program:s.program,prefix:s.prefix,clock:s.clock,complete:s.complete,modelHash:s.modelHash,runHash:s.runHash,stateHash:s.stateHash,saveHash:s.saveHash,outputsHash:s.outputsHash,observerHash:s.observerHash});
 return {version:'fatigue-contrast-inspection/0.1',contrast:{...contrast},changedSettings,aligned,
  inputDifferences:differences(...originals.map(p=>JSON.parse(exactText(decodeFatigue(fromHex(p.orderedInputs))))) as [unknown,unknown]),
  runSeed:catalog.runSeed,initialState:catalog.initialState,
  observerEqual:aligned?a.observerHex===b.observerHex:null,outputsEqual:aligned?a.outputsHash===b.outputsHash:null,stateEqual:aligned?a.stateHash===b.stateHash:null,saveEqual:aligned?a.saveHash===b.saveHash:null,
  fields:aligned?paths.map(path=>{const x=a.fields.find(f=>f.path===path),y=b.fields.find(f=>f.path===path);return{path,root:x?.root??y!.root,a:x?.exact??null,b:y?.exact??null,equal:x?.exact===y?.exact};}):[],
  a:summary(a),b:summary(b),
  scope:'Diagnostic comparison of committed adapter snapshots. Public observer equality is distinct from full research state/output/save equality. Sensor evidence, retained experience, external occupancy, cognitive inhibition and motor execution remain separate. MotorOnly visible outcome differences are legitimate. No character narration, general resource law or causal necessity claim. Supplied state fields rely on the qualified adapter; this report is not a standalone save authenticator.',
  alignment:'Equal committed prefix and source clock; unaligned comparisons withhold all equality results and state differences.',
  randomPolicy:'Exact original seed retained. Equal seeds alone do not establish matched draws; inspect addressed native decision records before attributing action differences.'};
}
