import catalog from './relationshipCatalog.json';
import legacy from './relationshipLegacyCatalog.json';
const programs=[...catalog.programs,...legacy.programs],models=[...catalog.models,...legacy.models];
import {canonicalEncode,canonicalDecode,RecordSchemaRegistry} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {relationshipSupportedSchemas} from '../campaign3/relationshipCodecs';
import {RELATIONSHIP_VERSION,OBSERVERS} from '../campaign3/relationshipModel';
import {prepareRelationshipModel,createRelationshipRun,restoreRelationshipRun} from '../campaign3/relationshipFactory';
import {digest,exactText,exactKey,fromHex,equalBytes} from './canonical';
import {projectRelationshipCharacter} from './relationshipCharacter';
import {nativeTimeline} from './nativeTimeline';
export const RELATIONSHIP_PROGRAMS=programs.map(r=>({id:r.name,model:r.model,seed:r.seed,cohort:r.cohort}));
const schema=new RecordSchemaRegistry(relationshipSupportedSchemas());
// Public execution validates semantic bytes; this diagnostic read performs structural decoding.
const decode=(b:Uint8Array)=>canonicalDecode(b,schema);
function original(id:string){const row=programs.find(r=>r.name===id);if(!row)throw Error('Unknown frozen RELATIONSHIP program');if(row.seed!==0)throw Error('RELATIONSHIP frozen seed must be zero');return row;}
function model(name:string){const m=models.find(m=>m.name===name);if(!m)throw Error('Unknown RELATIONSHIP model');return m;}
function source(name:string){const m=model(name);return {parameters:fromHex(m.parameters),content:fromHex(m.content),registry:fromHex(m.registry)};}
type Run=Awaited<ReturnType<typeof createRelationshipRun>>;
export interface RelationshipCheckpoint {version:'relationship-workbench/0.1';program:string;prefix:number;saveHex:string;saveHash:string;}
export type RelationshipSnapshot=ReturnType<RelationshipWorkbenchRun['snapshot']>;
export class RelationshipWorkbenchRun {
 #run:Run;#program:string;#prefix=0;#busy=false;
 #view!:{program:string;seamVersion:string;projection:string;prefix:number;complete:boolean;clock:string;modelHash:string;runHash:string;stateHash:string;saveHash:string;outputsHash:string;researchOutputs:string;observerViews:{observer:string;exact:string;hash:string;character:ReturnType<typeof projectRelationshipCharacter>}[];fields:{path:string;root:string;exact:string}[];timeline:ReturnType<typeof nativeTimeline>};
 private constructor(run:Run,program:string){this.#run=run;this.#program=program;}
 static async create(program='candidate-1-law-1-reverse-0'){
  const row=original(program),m=model(row.model),run=await createRelationshipRun(await prepareRelationshipModel(source(row.model)),{initialState:fromHex(m.initialState),orderedInputs:fromHex(row.orderedInputs),runSeed:new Uint8Array(32)});
  const identity=rec(decode(run.runIdentity()),104n);if(exactKey(f(identity,1n))!==m.modelIdentity)throw Error('RELATIONSHIP frozen model identity mismatch');const a=new RelationshipWorkbenchRun(run,program);await a.#refresh();return a;
 }
 snapshot(){if(this.#busy)throw Error('RELATIONSHIP run is advancing');return structuredClone(this.#view);}
 checkpoint():RelationshipCheckpoint{if(this.#busy)throw Error('RELATIONSHIP run is advancing');return {version:'relationship-workbench/0.1',program:this.#program,prefix:this.#prefix,saveHex:exactHex(this.#run.save()),saveHash:this.#view.saveHash};}
 async advance(){if(this.#busy)throw Error('RELATIONSHIP command already in flight');if(this.#prefix>=12&&!this.#view.complete)throw Error('RELATIONSHIP inspection horizon exceeded');this.#busy=true;try{const moved=await this.#run.settleNextInstant();if(moved)this.#prefix++;await this.#refresh();return moved;}finally{this.#busy=false;}}
 static async restore(input:RelationshipCheckpoint){
  const c=structuredClone(input);if(!c||c.version!=='relationship-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>12||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid bounded RELATIONSHIP checkpoint');
  const expected=await RelationshipWorkbenchRun.create(c.program),save=fromHex(c.saveHex);if(await digest(save)!==c.saveHash)throw Error('RELATIONSHIP checkpoint digest mismatch');for(let i=0;i<c.prefix;i++)if(!await expected.advance())throw Error('RELATIONSHIP checkpoint exceeds original horizon');if(!equalBytes(expected.#run.save(),save))throw Error('RELATIONSHIP checkpoint program/prefix mismatch');
  const row=original(c.program),run=await restoreRelationshipRun(source(row.model),{initialState:fromHex(model(row.model).initialState),orderedInputs:fromHex(row.orderedInputs),save}),a=new RelationshipWorkbenchRun(run,c.program);a.#prefix=c.prefix;await a.#refresh();return a;
 }
 async #refresh(){const row=original(this.#program),m=model(row.model),s=this.#run.snapshot(),save=this.#run.save();
  this.#view={program:this.#program,seamVersion:m.settings.revision===1?'relationship-public/0.1-candidate':RELATIONSHIP_VERSION,projection:'Native observer diagnostics remain separate from admitted character projection; violating controls suppress narration.',prefix:this.#prefix,complete:items(f(rec(decode(save),132n),7n),'list').length===0,clock:String(s.clock),modelHash:await digest(fromHex(m.modelIdentity)),runHash:await digest(this.#run.runIdentity()),stateHash:await digest(s.state),saveHash:await digest(save),outputsHash:await digest(s.outputs),researchOutputs:exactText(decode(s.outputs)),observerViews:await Promise.all(OBSERVERS.map(async o=>{const bytes=this.#run.observerView(canonicalEncode(o));return {observer:exactKey(o),exact:exactText(decode(bytes)),hash:await digest(bytes),character:m.settings.revision===1?{...projectRelationshipCharacter(decode(bytes),5),notice:'Historical failed0.1 cohort: character descriptions are not qualified.'}:projectRelationshipCharacter(decode(bytes),m.settings.candidate)};})),fields:restoreAuthoritativeState(decode(s.state)).entries().map(e=>({path:exactKey(statePathValue(e.path)),root:String(e.path.rootStateTypeId),exact:exactText(e.value)})),timeline:nativeTimeline(items(decode(s.trace),'list'))};
 }
}
const exactHex=(b:Uint8Array)=>Array.from(b,v=>v.toString(16).padStart(2,'0')).join('');
