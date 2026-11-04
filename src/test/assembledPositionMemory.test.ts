/** M50: one holder, three physical tasks, body20/rate0/width1, seed0.
 * Body1/4, refill3, deliberate2/5; visible Actor marker and panel1..4.
 * Positions0,0,1,1; stages Before,Motion,Motion,After. No social tasks.
 * Fixed reference laws, retention6/recall4/workspace10; controls change only named gate. */
import {it,expect,vi} from 'vitest';
import {list,text,unsigned as u,signed,record,set,type CanonicalValue} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,POSITION_MEMORY_RULES,POSITION_MEMORY_REGISTRY,POSITION_RULES,POSITION_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {POSITION,POSITION_SOURCE,POSITION_AUTHORITY} from '../assembled/positionPerception';
import {POSITION_MEMORY,POSITION_EPISODE,POSITION_SELECT,validatePositionEpisode,positionExperience,groupPositionMemories,isPositionEpisodePath,isBodyEpisodePath,positionCue,createEpisodicExtension,MEMORY_FORMATION,EPISODIC_OWNER} from '../assembled/memory';
import {WORKSPACE,sharedWorkspace} from '../assembled/workspace';
import {ENCODING} from '../assembled/encoding';
import {groupPerceivedPositionTrial} from '../campaign3/perceivedTrialGrouping';
import * as retention from '../assembled/retention';
import {sid} from '../assembled/skill';
import {source as priorSource,data as priorData,decode,items,key,enc} from './fixtures/assembledWorkspaceDomain';
import {through,outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {dataField as f,dataRecord as rec,dataUnsigned as uint,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
type Options={retained?:number;recalled?:number;workspace?:number;capacity?:number;role?:number;denied?:boolean;hidden?:boolean};
function source(o:Options={}){const s=priorSource(o.workspace??10),a=[...items(decode(s.registry),'list')],r=items(a[8],'list'),e=items(a[30],'list');a[8]=list([r[0],r[1],u(o.retained??6),r[3]]);a[9]=list([items(a[9],'list')[0],u(o.recalled??4)]);a[30]=list([e[0],u(o.capacity??2),e[2]]);return {...s,rulesVersion:POSITION_MEMORY_RULES,registrySchemaVersion:POSITION_MEMORY_REGISTRY,registry:enc(list([...a,list([text(POSITION),POSITION_AUTHORITY]),list([text(POSITION_MEMORY)])]))};}
function data(o:Options={}){const d=priorData(),frames=[1,2,3,4].map(at=>list([signed(at),u(10),POSITION_SOURCE,list([text(POSITION),list([u(o.hidden&&at===3?7:at<3?0:1),u(0),u(1),true,!(o.denied&&at===3),u(at===3?o.role??1:1)]),list([u(1),text(at===1?'Before':at===4?'After':'Motion'),true,true])]),list([])]));return {...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),...frames]))};}
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const field=(v:CanonicalValue,k:string)=>items(items(v,'list').find(x=>key(items(x,'list')[0])===key(text(k)))!,'list')[1];
const positions=(r:Run)=>state(r).entries().filter(e=>isPositionEpisodePath(e.path));
const workspace=(r:Run)=>reports(r,WORKSPACE).at(-1)!;
const grouping=(r:Run)=>items(items(workspace(r)[5],'list')[1],'list');
async function run(o:Options={},at=5n){const r=await createCharacterRun(await prepareCharacterModel(source(o)),data(o));await through(r,at);return r;}
const cached=new Map<string,Promise<Run>>();const once=(o:Options={})=>{const k=JSON.stringify(o);let r=cached.get(k);if(!r){r=run(o);cached.set(k,r);}return r;};
function live(r:Run){const freezes=reports(r,POSITION+'/experience');expect(freezes).toHaveLength(4);for(const a of freezes){expect(items(a[5],'list')).toHaveLength(1);expect(rec(a[6],227n)).toBeDefined();}const selected=reports(r,ENCODING);expect(selected).toHaveLength(4);expect(selected.every(a=>items(a[8],'list').length===1)).toBe(true);}
it('connection and access: actual selected memories group only within the shared budgets',async()=>{
 const a=await once(),lost=await once({retained:5}),nine=await once({workspace:9}),narrow=await once({workspace:7}),recall=await once({recalled:3});for(const r of [a,lost,nine,narrow,recall])live(r);
 expect(positions(a)).toHaveLength(4);expect(state(a).entries().filter(e=>isBodyEpisodePath(e.path))).toHaveLength(2);expect(items(workspace(a)[4],'list')).toHaveLength(6);
 const result=grouping(a);expect(result).toHaveLength(1);expect(field(result[0],'kind')).toEqual(text('Grouped'));
 const episodes=positions(a).map(e=>e.value).sort((x,y)=>Number(signedValue(items(x,'list')[5])-signedValue(items(y,'list')[5])));
 for(const [i,name]of ['beforeExperience','startExperience','endExperience','afterExperience'].entries())expect(field(result[0],name)).toEqual(signed(uint(id(f(rec(items(episodes[i],'list')[3],227n),1n)).payload)));
 const original=episodes.map(v=>{const e=items(v,'list'),panel=items(items(e[2],'list')[5],'list');return {role:txt(panel[2]) as 'Before'|'Motion'|'After',experience:positionExperience(e[3])};});
 expect(groupPerceivedPositionTrial(original[0].experience.observerId,original[0].experience.perceptualEventReferentIds[0],original).kind).toBe('Grouped');expect(groupPositionMemories(episodes)).toEqual(workspace(a)[5]);
 console.info('M50 OPERANDS',JSON.stringify([['full',a],['retained5',lost],['workspace9',nine],['workspace7',narrow],['recall3',recall]].map(([label,r])=>{const run=r as Run;return {label,selected:items(workspace(run)[4],'list').map(v=>{const e=items(items(v,'list')[1],'list');return {tag:txt(e[0]),at:signedValue(e[5]).toString(),acquisition:uint(id(e[1]).payload).toString(),experience:uint(id(f(rec(e[3],227n),1n)).payload).toString()};}),grouping:grouping(run)};}),(k,v)=>typeof v==='bigint'?v.toString():v));
 expect(field(grouping(nine)[0],'kind')).toEqual(text('Grouped'));expect(items(workspace(nine)[4],'list')).toHaveLength(5);expect(items(workspace(nine)[4],'list').slice(0,4).every(v=>txt(items(items(v,'list')[1],'list')[0])===POSITION_EPISODE)).toBe(true);expect(items(workspace(narrow)[4],'list')).toHaveLength(3);
 expect(positions(lost)).toHaveLength(3);for(const r of [narrow,recall])expect(positions(r)).toHaveLength(4);for(const r of [lost,narrow,recall])expect(field(grouping(r)[0],'reason')).toEqual(text('IncompleteContext'));
 const trace=outputs(a.snapshot().trace,160n),ws=trace.filter(t=>key(f(t,6n))===key(text('assembled-character-workspace/0.6-candidate'))).at(-1)!;
 const deliveries=items(items(f(ws,12n),'list')[1],'list').map(v=>items(v,'list'));expect(deliveries.length).toBeGreaterThanOrEqual(2);
 for(const v of items(workspace(a)[4],'list')){const slot=items(v,'list');expect(deliveries.some(d=>key(f(rec(d[1],130n),1n))===key(slot[2])&&items(d[2],'list').some(e=>key(e)===key(slot[1])))).toBe(true);}
 for(const d of deliveries){const e=rec(d[1],130n);expect(signedValue(f(e,2n))).toBe(5n);expect(uint(f(e,3n))).toBe(20n);}
 console.info('M50 CONNECTION four positive actual freezes -> four episodes+two body -> actual phase20 recalls -> shared workspace -> original Grouped IDs. Retention5/workspace7/recall3 each IncompleteContext; original9 retains4 positions+1 body and stays Grouped.');
},600000);
it('selection and epistemic boundary: unknown, zero capacity and denial do not create placeholders',async()=>{
 const unknown=await once({role:0}),zero=await once({capacity:0}),denied=await once({denied:true}),hidden=await once({denied:true,hidden:true});
 expect(positions(unknown)).toHaveLength(3);expect(positions(zero)).toHaveLength(0);expect(positions(denied)).toHaveLength(3);expect(positions(hidden)).toEqual(positions(denied));expect(reports(hidden,POSITION+'/experience')).toEqual(reports(denied,POSITION+'/experience'));expect(hidden.snapshot().state).toEqual(denied.snapshot().state);
 for(const r of [unknown,denied,hidden])expect(field(grouping(r)[0],'reason')).toEqual(text('IncompleteContext'));
 expect(workspace(zero)).toHaveLength(5);expect(reports(unknown,ENCODING).some(a=>items(a[8],'list').length===0)).toBe(true);
 console.info('M50 SELECTION unknown role and denied sample -> three memories; encoder0 -> none; hidden denied x1/x7 same evidence, memory and state.');
},600000);
it('persistence and rollback: repeat and restore3->5; failure after formation is atomic',async()=>{
 const s=source(),d=data(),a=await run({},3n),repeat=await run({},3n);expect(repeat.snapshot()).toEqual(a.snapshot());expect(repeat.save()).toEqual(a.save());
 const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});expect(restored.snapshot()).toEqual(a.snapshot());
 const before=a.snapshot(),original=retention.prepareEpisodicRetention;let reached=false;
 const spy=vi.spyOn(retention,'prepareEpisodicRetention').mockImplementation((...args)=>{const plan=original(...args);if(!plan)return plan;return {...plan,finish(candidate){plan.finish(candidate);reached=true;throw Error('M50 post-formation');}};});
 try{await expect(a.settleNextInstant()).rejects.toThrow('M50 post-formation');expect(reached).toBe(true);expect({...a.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 await through(restored,5n);await through(repeat,5n);expect(restored.snapshot()).toEqual(repeat.snapshot());expect(restored.save()).toEqual(repeat.save());expect(field(grouping(restored)[0],'kind')).toEqual(text('Grouped'));
 console.info('M50 PERSISTENCE repeat and active-context restore3->5 exact; failure after complete formation/retention rolls back the whole instant.');
},600000);
it('admission and authority: malformed/foreign/bootstrap/forged and stale sources reject',async()=>{
 const s=source(),m=await prepareCharacterModel(s),d=data(),a=await once(),c=await compileCharacterState(await compileCharacterModel(s)),entry=positions(a)[0],episode=items(entry.value,'list'),C=items((entry.path.selectors[0] as {key:CanonicalValue}).key,'list')[1];
 await expect(createCharacterRun(m,data({role:5}))).rejects.toThrow('role');
 const old={...s,rulesVersion:POSITION_RULES,registrySchemaVersion:POSITION_REGISTRY,registry:enc(list(items(decode(s.registry),'list').slice(0,34)))};
 await expect(createCharacterRun(await prepareCharacterModel(old),d)).rejects.toThrow('grammar');
 const initial=restoreAuthoritativeState(decode(d.initialState));await expect(createCharacterRun(m,{...d,initialState:enc(new AuthoritativeState([...initial.entries(),entry]).canonicalValue())})).rejects.toThrow();
 expect(()=>c.stateModel.applyPatch(state(a),{operations:[{kind:'set',path:entry.path,expected:{presence:true,value:entry.value},newValue:entry.value}]},sid(1025,'authority/person-model'))).toThrow();
 expect(()=>c.stateModel.applyPatch(state(a),{operations:[{kind:'set',path:entry.path,expected:{presence:true,value:entry.value},newValue:entry.value}]},EPISODIC_OWNER)).toThrow('fresh');
 const change=(index:number,v:CanonicalValue)=>list(episode.map((x,i)=>i===index?v:x)),obs=items(episode[2],'list'),assessment=items(episode[6],'list');
 for(const bad of [change(2,list(obs.map((v,i)=>i===6?u(2):v))),change(4,list([])),change(5,signed(9)),change(6,list(assessment.map((v,i)=>i===1?u(0):v)))])expect(()=>validatePositionEpisode(bad)).toThrow();
 const x=rec(episode[3],227n),support=f(x,8n);expect(items(support,'set').length).toBe(2);expect(()=>validatePositionEpisode(change(3,record(x.schema,new Map([...x.fields].map(([n,v])=>[n,n===8n?set(items(support,'set').slice(0,1)):v])))))).toThrow();
 const without=new AuthoritativeState(state(a).entries().filter(e=>key(e.value)!==key(entry.value)));expect(()=>c.stateModel.applyPatch(without,{operations:[{kind:'set',path:entry.path,expected:{presence:false},newValue:entry.value}]},sid(1025,'authority/person-model'))).toThrow();
 const forged={eventId:999n,eventSequence:999n,dueAt:simInstant(5n),phase:140n,eventTypeId:MEMORY_FORMATION,payload:entry.value,dependencies:list([]),causalParentEventIds:[]};
 const model=await compileCharacterModel(s),extension=createEpisodicExtension(C,model.body!,c.stateModel,list([]),list([]),1n,model.retrieval,true,true,model.affectMemory,undefined,model.encoding,model.memoryUse,true,true);extension.begin(5n);expect(()=>extension.prepare([forged],state(a))).toThrow('unassociated');extension.close();
 for(const type of [MEMORY_FORMATION,POSITION_SELECT])await expect(createCharacterRun(m,{...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),list([signed(1),u(20),type,entry.value,list([])])]))})).rejects.toThrow();
 const ws=outputs(a.snapshot().trace,160n).filter(t=>key(f(t,6n))===key(text('assembled-character-workspace/0.6-candidate'))).at(-1)!,deliveries=items(items(f(ws,12n),'list')[1],'list').map(v=>{const a=items(v,'list'),e=rec(a[1],130n);return {character:a[0],event:{eventId:uint(f(e,1n)),dueAt:simInstant(signedValue(f(e,2n))),phase:uint(f(e,3n)),eventSequence:uint(f(e,4n)),eventTypeId:id(f(e,5n)),payload:f(e,6n),dependencies:f(e,7n),causalParentEventIds:items(f(e,8n),'list').map(uint)},episodes:items(a[2],'list')};});
 expect(sharedWorkspace(workspace(a)[3],10,5n,deliveries,0,32).report).toEqual(list(workspace(a)));
 expect(()=>sharedWorkspace(workspace(a)[3],10,6n,deliveries,0,32)).toThrow('stale');
 const pos=deliveries.find(d=>key(d.event.payload)===key(positionCue(C)))!;expect(pos).toBeDefined();
 expect(()=>sharedWorkspace(workspace(a)[3],10,5n,[{...pos,character:sid(1000,'foreign')}],0,32)).toThrow('foreign');
 const future=pos.episodes.map(v=>list(items(v,'list').map((x,i)=>i===5?signed(5):x)));expect(()=>sharedWorkspace(workspace(a)[3],10,5n,[{...pos,episodes:future}],0,32)).toThrow();
 console.info('M50 BOUNDARIES old source/malformed roles, learned bootstrap, foreign or immutable writes, forged formation/selection, altered role/context/time/encoding and stale/future/foreign deliveries reject.');
},600000);
