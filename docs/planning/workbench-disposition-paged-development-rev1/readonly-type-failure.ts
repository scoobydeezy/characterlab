import plan from '../../docs/planning/DISPOSITION_PUBLIC_PLAN_REV1.json';
import {dispositionCase,type DispositionCase} from '../test/dispositionAdaptationFixtures';
import {dispositionRecipe,dispositionInitial,dispositionOrdered,VERSION} from '../campaign3/dispositionPublicModel';
import {prepareDispositionModel,createDispositionPublicRun,restoreDispositionPublicRun} from '../campaign3/dispositionPublicFactory';
import {decodeDispositionPublic as decode} from '../campaign3/dispositionPublicCodecs';
import {dataItems as items,dataRecord as rec,dataField as field} from '../campaign2/canonicalData';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {bytesToHex,type CanonicalValue} from '../substrate/canonicalEncoding';
import {digest,exactKey,fromHex} from './canonical';
import {scalar} from './nativeTimeline';
import {canonicalTextPage,EXACT_TEXT_PAGE_LIMIT} from './canonicalTextStream';
import {encodeCheckpointHex,decodeCheckpointHex} from './largeCheckpointHex';
import {DISPOSITION_MAX_SAVE_BYTES,type DispositionCheckpoint} from './dispositionAdapter';
function original(id:string){const row=plan.runs.find(r=>r.law+'/'+r.name===id);if(!row)throw Error('Unknown frozen DISPOSITION program');const c=dispositionCase(row as DispositionCase);return {row,...c,source:dispositionRecipe(c.profile),initialState:dispositionInitial(),orderedInputs:dispositionOrdered(c.profile,c.frames)};}
function header(value:CanonicalValue){
 const row=rec(value,160n),event=rec(field(row,4n),130n);
 const named=(name:string)=>{const f=event.schema.fields.find(f=>f.name===name);if(!f)throw Error('Missing event header field');return field(event,f.id);};
 const type=named('EventTypeId');if(typeof type==='boolean'||type.kind!=='typedIdentifier')throw Error('Invalid event type');
 return {id:scalar(named('EventId')),instant:scalar(named('DueAt')),phase:scalar(named('Phase')),stage:scalar(type.payload).split('/').at(-1)!,parents:items(named('CausalParentEventIds'),'list').map(scalar)};
}
export type DispositionTextSelector={kind:'projection'}|{kind:'state';path:string}|{kind:'event';id:string;part:'record'|'input'|'output'|'draws'|'quantization'|'reads'|'diffs'};
type NativeRun=Awaited<ReturnType<typeof createDispositionPublicRun>>;
export type DispositionInspectionSummary=ReturnType<DispositionPagedRun['summary']>;
/** Separate diagnostic route while the original full-snapshot replay audit remains source-frozen. */
export class DispositionPagedRun{
 #run:NativeRun;#program:string;#prefix=0;#busy=false;
 #trace:CanonicalValue[]=[];#projection!:CanonicalValue;#state=new Map<string,CanonicalValue>();
 #view!:{version:'disposition-paged-inspection/0.1';program:string;seamVersion:string;constitution:string;law:string;prefix:number;complete:boolean;clock:string;modelHash:string;runHash:string;stateHash:string;saveHash:string;projectionHash:string;fields:{root:string;path:string}[];timeline:ReturnType<typeof header>[]};
 private constructor(run:NativeRun,program:string){this.#run=run;this.#program=program;}
 static async create(program='Plastic/Main'){
  const c=original(program);if(await digest(c.orderedInputs)!==c.row.inputsSha256)throw Error('DISPOSITION original input mismatch');
  const run=await createDispositionPublicRun(await prepareDispositionModel(c.source),{initialState:c.initialState,orderedInputs:c.orderedInputs,runSeed:new Uint8Array(32)});
  if(bytesToHex(run.modelIdentity())!==c.row.modelIdentity||bytesToHex(run.runIdentity())!==c.row.runIdentity)throw Error('DISPOSITION original identity mismatch');
  const a=new DispositionPagedRun(run,program);await a.#refresh();return a;
 }
 #ready(){if(this.#busy)throw Error('DISPOSITION command in flight');}
 summary(){this.#ready();return structuredClone(this.#view);}
 textPage(saveHash:string,selector:DispositionTextSelector,offset=0,limit=EXACT_TEXT_PAGE_LIMIT){
  this.#ready();if(saveHash!==this.#view.saveHash)throw Error('Stale DISPOSITION inspection revision');
  let value:CanonicalValue|undefined;
  if(selector.kind==='projection')value=this.#projection;
  else if(selector.kind==='state')value=this.#state.get(selector.path);
  else if(selector.kind==='event'){
   const index=this.#view.timeline.findIndex(e=>e.id===selector.id);if(index<0)throw Error('Unknown DISPOSITION event');
   const row=rec(this.#trace[index],160n),parts={input:12n,output:13n,draws:14n,quantization:15n,reads:11n,diffs:17n};
   if(selector.part==='record')value=row;else if(Object.hasOwn(parts,selector.part))value=field(row,parts[selector.part as keyof typeof parts]);
  }
  if(value===undefined)throw Error('Unknown DISPOSITION text selection');
  return {saveHash,selector:structuredClone(selector),...canonicalTextPage(value,offset,limit)};
 }
 checkpoint():DispositionCheckpoint{this.#ready();const save=this.#run.save();return {version:'disposition-workbench/0.1',program:this.#program,prefix:this.#prefix,runHash:this.#view.runHash,saveHash:this.#view.saveHash,saveHex:encodeCheckpointHex(save,DISPOSITION_MAX_SAVE_BYTES)};}
 async advance(){this.#ready();if(this.#view.complete)return false;this.#busy=true;try{const moved=await this.#run.settleNextInstant();if(moved)this.#prefix++;await this.#refresh();return moved;}finally{this.#busy=false;}}
 static async restore(input:DispositionCheckpoint){
  if(!input||input.version!=='disposition-workbench/0.1'||!Number.isInteger(input.prefix)||input.prefix<0||input.prefix>18||typeof input.saveHex!=='string'||input.saveHex.length>DISPOSITION_MAX_SAVE_BYTES*2)throw Error('Invalid bounded DISPOSITION checkpoint');
  const c=structuredClone(input),o=original(c.program),save=decodeCheckpointHex(c.saveHex,DISPOSITION_MAX_SAVE_BYTES);
  if(await digest(save)!==c.saveHash||await digest(fromHex(o.row.runIdentity))!==c.runHash)throw Error('DISPOSITION checkpoint identity/digest mismatch');
  const run=await restoreDispositionPublicRun(o.source,{initialState:o.initialState,orderedInputs:o.orderedInputs,save}),a=new DispositionPagedRun(run,c.program);a.#prefix=c.prefix;await a.#refresh();
  if(a.#view.timeline.length!==c.prefix*10||a.#view.clock!==String(c.prefix))throw Error('DISPOSITION checkpoint prefix mismatch');return a;
 }
 async #refresh(){
  const o=original(this.#program),s=this.#run.snapshot(),projection=this.#run.characterProjection(),trace=items(decode(s.trace),'list'),state=restoreAuthoritativeState(decode(s.state)).entries();
  const timeline=trace.map(header);if(new Set(timeline.map(e=>e.id)).size!==timeline.length)throw Error('Duplicate DISPOSITION event');
  this.#state=new Map(state.map(e=>[exactKey(statePathValue(e.path)),e.value]));this.#trace=trace;this.#projection=decode(projection);
  this.#view={version:'disposition-paged-inspection/0.1',program:this.#program,seamVersion:VERSION,constitution:o.profile.constitution===0?'0/1':o.profile.constitution+'/8',law:o.profile.law,prefix:this.#prefix,complete:this.#prefix===18,clock:String(s.clock??0),modelHash:await digest(this.#run.modelIdentity()),runHash:await digest(this.#run.runIdentity()),stateHash:await digest(s.state),saveHash:await digest(this.#run.save()),projectionHash:await digest(projection),fields:state.map(e=>({root:String(e.path.rootStateTypeId),path:exactKey(statePathValue(e.path))})),timeline};
 }
}
