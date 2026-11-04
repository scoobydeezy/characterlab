/** M49: one holder,3 physical tasks, reserve20/rate0/width1, seed0.
 * Body1/4, refill3, deliberation2/5 remain live. Position2/3, panel1..4.
 * Mixed control uses original M45 social tasks/body10, perceived coat at1/4; no autonomous partner.
 * Absence controls: position2, sampled-absent or unsampled3, position4.
 */
import {it,expect,vi} from 'vitest';
import {list,text,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,POSITION_RULES,POSITION_REGISTRY,WORKSPACE_DOMAIN_RULES,WORKSPACE_DOMAIN_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {POSITION,POSITION_VERSION,POSITION_SOURCE,POSITION_STAGES,POSITION_AUTHORITY,windowPath,readWindow,socialWindow,windowValue,replacement} from '../assembled/positionPerception';
import {createPositionExecution} from '../assembled/positionExecution';
import {OBSERVER} from '../assembled/recognition';
import {trackState,eventState,resolutionHistory} from '../assembled/recognitionState';
import {SOCIAL_SOURCE} from '../assembled/social';
import {sid} from '../assembled/skill';
import * as phases from '../semanticBinding/phaseOrdering';
import {SemanticMutationAuthority as OWNER} from '../semanticBinding/semanticStateAuthority';
import {restorePerceptualReferentId as trackId,restorePerceptualEventReferentId as eventId} from '../semanticBinding/semanticCodecs';
import {advanceMarkerWindow,type TrackingWindow} from '../campaign3/markerWindowTracking';
import {advancePanelWindow,type PanelWindow} from '../campaign3/panelWindowPerception';
import {source as priorSource,data as priorData,decode,items,key,enc} from './fixtures/assembledWorkspaceDomain';
import {source as socialSource,data as socialData} from './fixtures/assembledMemoryUse';
import {through,outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {dataField as f,dataRecord as rec,dataUnsigned as uint,dataIdentity as id} from '../campaign2/canonicalData';
const socialBase=()=>{const s=socialSource();return {...s,rulesVersion:WORKSPACE_DOMAIN_RULES,registrySchemaVersion:WORKSPACE_DOMAIN_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text('assembled-goal-meaning/0.1'),list([]),u(1),text('BothDirections')])]))};};
const source=(mixed=false)=>{const s=mixed?socialBase():priorSource();return {...s,rulesVersion:POSITION_RULES,registrySchemaVersion:POSITION_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(POSITION),POSITION_AUTHORITY])]))};};
type Frame={at:number;x?:number;glyph?:number;seen?:boolean;permitted?:boolean;stage?:string;panelGlyph?:number;panelSeen?:boolean};
const primary:Frame[]=[{at:1,stage:'Before'},{at:2,x:0,stage:'Motion'},{at:3,x:1,stage:'Motion'},{at:4,stage:'After'}];
const row=(v:Frame)=>list([signed(v.at),u(10),POSITION_SOURCE,list([text(POSITION),list(v.x===undefined?[]:[u(v.x),u(0),u(v.glyph??1),v.seen??true,v.permitted??true]),list(v.stage===undefined?[]:[u(v.panelGlyph??1),text(v.stage),v.panelSeen??true,true])]),list([])]);
function data(frames=primary,mixed=false){const d=mixed?socialData():priorData(),rows=[...items(decode(d.orderedInputs),'list')].filter(v=>key(items(v,'list')[2])!==key(SOCIAL_SOURCE));if(mixed){const social=items(decode(socialData().orderedInputs),'list').filter(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE));for(const [i,at]of [1,4].entries()){const r=items(social[i],'list');rows.push(list([signed(at),...r.slice(1)]));}}return {...d,orderedInputs:enc(list([...rows,...frames.map(row)]))};}
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const reports=(r:Run)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(POSITION+'/experience'))).map(v=>items(v,'list'));
const at=(r:Run,n:number)=>reports(r).find(v=>signedValue(v[1])===BigInt(n))!;
const track=(r:Run,n:number)=>trackId(items(at(r,n)[3],'list')[0]);
const context=(r:Run,n:number)=>eventId(items(at(r,n)[4],'list')[0]);
function live(r:Run){for(const n of [2,3]){const a=at(r,n);expect(a).toBeDefined();expect(rec(a[6],227n)).toBeDefined();expect(items(a[3],'list')).toHaveLength(1);expect(items(a[4],'list')).toHaveLength(1);expect(items(a[5],'list')).toHaveLength(1);}}
async function run(frames=primary,mixed=false,until=4n){const r=await createCharacterRun(await prepareCharacterModel(source(mixed)),data(frames,mixed));await through(r,until);return r;}
const cached=new Map<string,Promise<Run>>();const once=(frames=primary,mixed=false)=>{const k=JSON.stringify([frames,mixed]);let r=cached.get(k);if(!r){r=run(frames,mixed);cached.set(k,r);}return r;};
function differential(r:Run,frames:Frame[]){let tracks:Parameters<typeof advanceMarkerWindow>[1]={nextTrackSequenceByObserver:new Map(),activePerceptualReferentIds:[]},events:Parameters<typeof advancePanelWindow>[1]={nextEventSequenceByObserver:new Map(),activeEventFiles:[]},tw:TrackingWindow={at:0n,observation:null,items:[]},pw:PanelWindow={at:0n};
 for(const frame of frames){const a=at(r,frame.at),obs=items(a[2],'list'),visual=items(obs[4],'list'),panel=items(obs[5],'list');
  if(frame.x!==undefined){const observation=visual.length?uint(id(visual[0]).payload):BigInt(frame.at*10),b=advanceMarkerWindow(OBSERVER,tracks,tw,{observerId:OBSERVER,observationId:observation,occurredAt:BigInt(frame.at),detections:visual.length?[{detectionId:BigInt(frame.at*100),glyph:uint(visual[3])}]:[]});tracks=b.files;tw=b.window;if(visual.length)expect(track(r,frame.at)).toEqual(b.transitions[0].perceptualReferentId);}
  const b=advancePanelWindow(OBSERVER,events,pw,frame.stage===undefined?undefined:{observer:OBSERVER,observation:panel.length?uint(id(panel[0]).payload):BigInt(frame.at*10+1),...(panel.length?{detection:BigInt(frame.at*100+1)}:{}),sample:panel.length?{kind:'Present' as const,at:BigInt(frame.at),glyph:frame.panelGlyph??1,stage:frame.stage as 'Before'|'Motion'|'After'}:{kind:'Unavailable' as const,at:BigInt(frame.at)}},visual.length?{observer:OBSERVER,observation:uint(id(visual[0]).payload),detection:BigInt(frame.at*100+1),at:BigInt(frame.at)}:undefined);events=b.files;pw=b.window;if(b.result.context)expect(context(r,frame.at)).toEqual(b.result.context);
 }
 expect(trackState(state(r))).toEqual(tracks);expect(eventState(state(r))).toEqual(events);
}
it('connection and original controls: actual positions and contexts share native SEM owners',async()=>{
 const changed=primary.map(v=>v.at===3?{...v,glyph:2}:v),panel=primary.map(v=>v.at>=3?{...v,panelGlyph:2}:v);
 const a=await once(),b=await once(changed),c=await once(panel);for(const r of [a,b,c])live(r);
 expect(track(a,2)).toEqual(track(a,3));expect(track(b,2)).not.toEqual(track(b,3));expect(context(a,2)).toEqual(context(a,3));expect(context(c,2)).not.toEqual(context(c,3));
 for(const [r,frames]of [[a,primary],[b,changed],[c,panel]] as const)differential(r,[...frames]);
 expect(items(items(at(a,2)[2],'list')[4],'list').slice(1,3)).toEqual([u(0),u(0)]);expect(items(items(at(a,3)[2],'list')[4],'list').slice(1,3)).toEqual([u(1),u(0)]);
 expect(readWindow(state(a).read(windowPath(OBSERVER,'position')).value,OBSERVER).panel).toBeUndefined();expect(eventState(state(a)).activeEventFiles).toHaveLength(0);
 const trace=outputs(a.snapshot().trace,160n).filter(t=>key(f(t,5n))===key(sid(1036,'seam/assembled-position-perception')));expect(trace).toHaveLength(16);for(const t of trace){const e=rec(f(t,4n),130n);if(uint(f(e,3n))!==10n){const parents=items(f(e,8n),'list');expect(parents).toHaveLength(1);expect(trace.some(p=>key(f(rec(f(p,4n),130n),1n))===key(parents[0]))).toBe(true);}}
 console.info('M49 CONNECTION live typed227 + observed coordinates; same/changed visual glyph and panel glyph match original windows; real shared241/242 mutations and child joins; closure ends panel.');
},600000);
it('mixed continuity: social -> visual -> social retains its own observed track',async()=>{
 const r=await once(primary,true);live(r);const s=state(r),w=socialWindow(s.read(windowPath(OBSERVER,'social')).value,OBSERVER)!;
 expect(w.at).toBe(4n);expect(w.file.observerTrackSequence).toBe(0n);expect(track(r,2).observerTrackSequence).toBe(1n);expect(track(r,3)).toEqual(track(r,2));
 const resolutions=resolutionHistory(s);expect(resolutions.length).toBeGreaterThan(0);expect(resolutions.every(x=>x.perceptualReferentId.observerTrackSequence===0n)).toBe(true);
 expect(eventState(s).activeEventFiles).toHaveLength(2);expect(eventState(s).activeEventFiles.every(x=>x.observerEventSequence!==context(r,2).observerEventSequence)).toBe(true);
 expect(new Set(trackState(s).activePerceptualReferentIds.map(x=>x.observerTrackSequence)).size).toBe(2);
 // Compare old social observation/resolution semantics in the same fixture without visuals.
 const d=data([],true),old=await createCharacterRun(await prepareCharacterModel(socialBase()),d);await through(old,4n);expect(resolutionHistory(state(old)).map(x=>x.resolution)).toEqual(resolutions.map(x=>x.resolution));
 const socialMeaning=(v:Run)=>items(decode(v.snapshot().outputs),'list').filter(x=>typeof x!=='boolean'&&x.kind==='list'&&x.items.length&&key(x.items[0])===key(text('assembled-social-people/0.1/appraisal'))).map(x=>items(x,'list'));const a=socialMeaning(r),b=socialMeaning(old);
 // New perception legitimately consumes the shared occurrence allocator. Bind the
 // old/new observation correspondence by actual person, time and complete evidence.
 const histories=(v:Run)=>state(v).entries().filter(e=>e.path.rootStateTypeId===810n).flatMap(e=>items(items(e.value,'list')[1],'list')).map(x=>items(x,'list'));const ah=histories(r),bh=histories(old),ids=new Map<string,CanonicalValue>();expect(ah).toHaveLength(bh.length);for(const h of ah){const prior=bh.find(x=>key(list(x.slice(1)))===key(list(h.slice(1))));expect(prior).toBeDefined();ids.set(key(h[0]),prior![0]);}const normalize=(v:CanonicalValue):CanonicalValue=>typeof v!=='boolean'&&v.kind==='typedIdentifier'&&v.namespaceId===1115n?(ids.get(key(v))??v):typeof v!=='boolean'&&v.kind==='list'?list(v.items.map(normalize)):v;expect(a.map(x=>normalize(list(x)))).toEqual(b.map(list));expect(a.some(row=>row.slice(1).some(x=>items(items(x,'list')[4],'list').length===1))).toBe(true);
 console.info('M49 MIXED social track0 remains0 after visual track1; recognized identity unchanged, panel context closes without removing2 social events.');
},600000);
it('epistemic absence: denied coordinates hidden; unsampled differs from observed absence',async()=>{
 const denied=primary.map(v=>v.at===2?{...v,permitted:false}:v),hidden=denied.map(v=>v.at===2?{...v,x:7}:v);const a=await once(denied),b=await once(hidden);expect(reports(a)).toEqual(reports(b));expect(a.snapshot().state).toEqual(b.snapshot().state);expect(items(at(a,2)[3],'list')).toHaveLength(0);expect(rec(at(a,2)[6],227n)).toBeDefined();
 const unsampled=primary.map(v=>v.at===3?{at:3,stage:'Motion'}:v.at===4?{...v,x:1}:v),absent=unsampled.map(v=>v.at===3?{...v,x:1,seen:false}:v);
 const c=await once(unsampled),d=await once(absent);expect(track(c,2)).toEqual(track(c,4));expect(track(d,2)).not.toEqual(track(d,4));for(const r of [c,d])expect(rec(at(r,4)[6],227n)).toBeDefined();differential(c,unsampled);differential(d,absent);
 console.info('M49 EPISTEMIC denied x0/x7 same observations/freeze/state; live panel remains; unsampled keeps matching window, observed absence breaks it.');
},600000);
it('persistence and rollback: repeat, restore active context and failure after tracking',async()=>{
 const d=data(),s=source(),r=await run(primary,false,2n),repeat=await run(primary,false,2n);expect(repeat.snapshot()).toEqual(r.snapshot());expect(repeat.save()).toEqual(r.save());const saved=r.save(),restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:saved});expect(restored.snapshot()).toEqual(r.snapshot());
 const before=r.snapshot(),original=phases.freezeAndStageSemanticExperience;let reached=false;const spy=vi.spyOn(phases,'freezeAndStageSemanticExperience').mockImplementation((...args)=>{const value=original(...args);if(args[2]===14n){reached=true;throw Error('M49 late freeze');}return value;});try{await expect(r.settleNextInstant()).rejects.toThrow('M49 late freeze');expect(reached).toBe(true);expect({...r.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 await through(restored,4n);await through(repeat,4n);const a=await once();expect(restored.snapshot()).toEqual(a.snapshot());expect(restored.save()).toEqual(a.save());expect(repeat.snapshot()).toEqual(a.snapshot());
 const bad=primary.map(v=>v.at===3?{at:3,x:1}:v),invalid=await run(bad,false,2n),prior=invalid.snapshot();await expect(invalid.settleNextInstant()).rejects.toThrow('unsampled active context');expect({...invalid.snapshot(),status:prior.status}).toEqual(prior);
 console.info('M49 PERSISTENCE repeat/save and active-context restore2->4 exact; late freeze and missing active-panel sample roll back complete instant.');
},600000);
it('admission and authority: domain, source count, forged child/bootstrap and foreign writes',async()=>{
 const s=source(),m=await prepareCharacterModel(s),base=data(),reject=async(frames:Frame[])=>expect(createCharacterRun(m,data(frames))).rejects.toThrow();
 for(const frames of [[{at:0,x:0}],[{at:101,x:0}],[{at:1,x:8}],[{at:1,stage:'Bad'}],[{at:1,x:0},{at:1,x:1}],Array.from({length:11},(_,i)=>({at:i+1,x:0})),Array.from({length:17},(_,i)=>({at:i+1,stage:'Motion'}))])await reject(frames);
 await expect(createCharacterRun(await prepareCharacterModel(priorSource()),base)).rejects.toThrow('position');
 for(const event of POSITION_STAGES)await expect(createCharacterRun(m,{...base,orderedInputs:enc(list([...items(decode(base.orderedInputs),'list'),list([signed(2),u(11),event,list([]),list([])])]))})).rejects.toThrow();
 const r=await once(),entry=state(r).entries().find(e=>e.path.rootStateTypeId===241n&&e.path.fieldId===3n)!,initial=restoreAuthoritativeState(decode(base.initialState));await expect(createCharacterRun(m,{...base,initialState:enc(new AuthoritativeState([...initial.entries(),entry]).canonicalValue())})).rejects.toThrow();
 const c=await compileCharacterState(await compileCharacterModel(s)),w=readWindow(entry.value,OBSERVER),v=windowValue({...w,visualAt:w.visualAt+1n}),patch={operations:[replacement(state(r),entry.path,v)]};
 expect(()=>c.stateModel.applyPatch(state(r),patch,sid(1025,'authority/person-model'))).toThrow();expect(()=>c.stateModel.applyPatch(state(r),{operations:[replacement(state(r),entry.path,entry.value)]},OWNER.Perception)).toThrow('clock');expect(()=>c.stateModel.read(state(r),windowPath('foreign','position'))).toThrow();
 const execution=createPositionExecution(c.stateModel,[],list([]),list([]));execution.begin(5n);const forged:Parameters<typeof execution.execute>[0]={event:{eventId:999n,eventSequence:999n,dueAt:simInstant(5n),phase:11n,eventTypeId:POSITION_STAGES[0],payload:list([]),dependencies:list([]),causalParentEventIds:[]},state:state(r),instant:simInstant(5n),allocateRuntimeId(){throw Error('forged child must not allocate');}};expect(()=>execution.execute(forged)).toThrow('unbound child');execution.close();
 console.info('M49 ADMISSION invalid times/glyph/stage/duplicates/11visual/17panel/oldversion/child/bootstrap and foreign writes reject; stale window rejected.');
},600000);
