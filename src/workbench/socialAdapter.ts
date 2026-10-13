import catalog from './socialCatalog.json';
import {canonicalEncode,canonicalDecode,RecordSchemaRegistry} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {socialSupportedSchemas} from '../campaign3/socialCodecs';
import {SOCIAL_VERSION,OBSERVERS} from '../campaign3/socialModel';
import {prepareSocialModel,createSocialRun,restoreSocialRun} from '../campaign3/socialFactory';
import {digest,exactText,exactKey,fromHex,equalBytes} from './canonical';
import {projectSocialCharacter} from './socialCharacter';
import {nativeTimeline} from './nativeTimeline';
export const SOCIAL_PROGRAMS=catalog.programs.map(r=>({id:r.name,model:r.model,seed:r.seed,cohort:r.cohort}));
const schema=new RecordSchemaRegistry(socialSupportedSchemas());
// Public execution validates semantic bytes; this diagnostic read performs structural decoding.
const decode=(b:Uint8Array)=>canonicalDecode(b,schema);
function original(id:string){const row=catalog.programs.find(r=>r.name===id);if(!row)throw Error('Unknown frozen SOCIAL program');if(row.seed!==0)throw Error('SOCIAL frozen seed must be zero');return row;}
function model(name:string){const m=catalog.models.find(m=>m.name===name);if(!m)throw Error('Unknown SOCIAL model');return m;}
function source(name:string){const m=model(name);return {parameters:fromHex(m.parameters),content:fromHex(m.content),registry:fromHex(m.registry)};}
type Run=Awaited<ReturnType<typeof createSocialRun>>;
export interface SocialCheckpoint {version:'social-workbench/0.1';program:string;prefix:number;saveHex:string;saveHash:string;}
export type SocialSnapshot=ReturnType<SocialWorkbenchRun['snapshot']>;
export class SocialWorkbenchRun {
 #run:Run;#program:string;#prefix=0;#busy=false;
 #view!:{program:string;seamVersion:string;projection:string;prefix:number;complete:boolean;clock:string;modelHash:string;runHash:string;stateHash:string;saveHash:string;outputsHash:string;researchOutputs:string;observerViews:{observer:string;exact:string;hash:string;character:ReturnType<typeof projectSocialCharacter>}[];fields:{path:string;root:string;exact:string}[];timeline:ReturnType<typeof nativeTimeline>};
 private constructor(run:Run,program:string){this.#run=run;this.#program=program;}
 static async create(program='private-1-law-1-reverse-0'){
  const row=original(program),m=model(row.model),run=await createSocialRun(await prepareSocialModel(source(row.model)),{initialState:fromHex(m.initialState),orderedInputs:fromHex(row.orderedInputs),runSeed:new Uint8Array(32)});
  const identity=rec(decode(run.runIdentity()),104n);if(exactKey(f(identity,1n))!==m.modelIdentity)throw Error('SOCIAL frozen model identity mismatch');const a=new SocialWorkbenchRun(run,program);await a.#refresh();return a;
 }
 snapshot(){if(this.#busy)throw Error('SOCIAL run is advancing');return structuredClone(this.#view);}
 checkpoint():SocialCheckpoint{if(this.#busy)throw Error('SOCIAL run is advancing');return {version:'social-workbench/0.1',program:this.#program,prefix:this.#prefix,saveHex:exactHex(this.#run.save()),saveHash:this.#view.saveHash};}
 async advance(){if(this.#busy)throw Error('SOCIAL command already in flight');if(this.#prefix>=8&&!this.#view.complete)throw Error('SOCIAL inspection horizon exceeded');this.#busy=true;try{const moved=await this.#run.settleNextInstant();if(moved)this.#prefix++;await this.#refresh();return moved;}finally{this.#busy=false;}}
 static async restore(input:SocialCheckpoint){
  const c=structuredClone(input);if(!c||c.version!=='social-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>8||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid bounded SOCIAL checkpoint');
  const expected=await SocialWorkbenchRun.create(c.program),save=fromHex(c.saveHex);if(await digest(save)!==c.saveHash)throw Error('SOCIAL checkpoint digest mismatch');for(let i=0;i<c.prefix;i++)if(!await expected.advance())throw Error('SOCIAL checkpoint exceeds original horizon');if(!equalBytes(expected.#run.save(),save))throw Error('SOCIAL checkpoint program/prefix mismatch');
  const row=original(c.program),run=await restoreSocialRun(source(row.model),{initialState:fromHex(model(row.model).initialState),orderedInputs:fromHex(row.orderedInputs),save}),a=new SocialWorkbenchRun(run,c.program);a.#prefix=c.prefix;await a.#refresh();return a;
 }
 async #refresh(){const row=original(this.#program),m=model(row.model),s=this.#run.snapshot(),save=this.#run.save();
  this.#view={program:this.#program,seamVersion:SOCIAL_VERSION,projection:'Native observer diagnostics retained separately; safe baseline descriptions use admitted views, violating controls suppress narration.',prefix:this.#prefix,complete:items(f(rec(decode(save),132n),7n),'list').length===0,clock:String(s.clock),modelHash:await digest(fromHex(m.modelIdentity)),runHash:await digest(this.#run.runIdentity()),stateHash:await digest(s.state),saveHash:await digest(save),outputsHash:await digest(s.outputs),researchOutputs:exactText(decode(s.outputs)),observerViews:await Promise.all(OBSERVERS.map(async o=>{const bytes=this.#run.observerView(canonicalEncode(o));return {observer:exactKey(o),exact:exactText(decode(bytes)),hash:await digest(bytes),character:projectSocialCharacter(decode(bytes),m.settings.control)};})),fields:restoreAuthoritativeState(decode(s.state)).entries().map(e=>({path:exactKey(statePathValue(e.path)),root:String(e.path.rootStateTypeId),exact:exactText(e.value)})),timeline:nativeTimeline(items(decode(s.trace),'list'))};
 }
}
const exactHex=(b:Uint8Array)=>Array.from(b,v=>v.toString(16).padStart(2,'0')).join('');
