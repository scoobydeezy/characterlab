import {it,expect} from 'vitest';
import {list,set,text,map,record,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {cognitiveRecord as r,receivingRecord as rec,cloneCognitive} from '../assembled/codecs';
import {compileReasonDescriptions,compileDescribedReasons,describedRaw,prioritySourceBasis} from '../assembled/reasons';
import {dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
import {fixture,create,capture,originalComparison,nativeProjection,definition,decode,items,key,enc} from './fixtures/assembledReasonSources';
import {snap,through,finish,exact,projection} from './fixtures/assembledAffectReceiving';
import {transcript} from './fixtures/assembledDecisionAlternatives';
function replace(v:CanonicalValue,n:bigint,next:CanonicalValue){if(typeof v==='boolean'||v.kind!=='record')throw Error('record operand');return record(v.schema,new Map([...v.fields].map(([k,x])=>[k,k===n?next:x])));}
import {sid} from '../assembled/skill';
let cached:ReturnType<typeof create>|undefined;
const witness=()=>cached??(cached=create(['restatement']));
it('M85 native: duplicate descriptions carry real evidence but no extra decision weight',async()=>{
 const b=fixture(),old=await createCharacterRun(await prepareCharacterModel(b.old),b.d);await through(old,10n);
 const plain=await create(),repeated=await witness(),op=projection(old),a=capture(plain.run,false),p=capture(repeated.run,true);
 expect(key(set(a.ns.map(nativeProjection)))).toBe(key(set(op.ns.map(nativeProjection))));
 expect(a.ns).toEqual(op.ns);
 expect(key(set(p.ns.map(nativeProjection)))).toBe(key(set(a.ns.map(nativeProjection))));
 expect(f(p.data,2n)).toEqual(f(a.data,2n));expect(f(a.data,2n)).toEqual(f(op.data,2n));
 const shared=transcript(p.data);expect(shared.length).toBeGreaterThan(0);expect(shared).toEqual(transcript(a.data));
 expect(f(p.data,1n)).toEqual(f(a.data,1n));
 const oldSignals=items(f(op.raw,3n),'set').map(s=>rec(s,402n));
 for(const signal of items(f(a.raw,3n),'set')){const n=rec(signal,402n),o=oldSignals.find(o=>key(f(o,1n))===key(f(n,1n)));expect(o).toBeDefined();expect(f(n,2n)).toEqual(f(o!,2n));}
 originalComparison(p,repeated.b.s);
 console.info('M85 NATIVE PASS source0.74->0.75: same strengths/nuclei/probabilities; real repeated descriptions discounted; matched natural draws='+shared.length+'; chosen intent reaches execution');
},570000);

it('M85 grammar: closed descriptions, producer support and prior admission',async()=>{
 const w=await witness(),p=capture(w.run,true),raw=p.raw,descriptions=items(f(raw,6n),'list');
 const older=await compileCharacterModel(w.b.old),current=await compileCharacterModel(w.b.s);
 expect(()=>older.content.validateRecordRoles(enc(raw))).toThrow('successor model');
 expect(()=>older.content.validateRecordRoles(enc(p.context))).toThrow('successor model');
 expect(()=>current.content.validateRecordRoles(enc(raw))).not.toThrow();
 expect(cloneCognitive(raw)).toEqual(raw);
 expect(()=>cloneCognitive(replace(raw,6n,list([...descriptions,descriptions[0]])))).toThrow('duplicate description');
 expect(()=>cloneCognitive(replace(raw,3n,set([])))).toThrow('projection mismatch');
 const edit=(slot:number,value:CanonicalValue)=>{const d=[...items(descriptions[0],'list')];d[slot]=value;return replace(raw,6n,list([list(d),...descriptions.slice(1)]));};
 expect(()=>cloneCognitive(edit(1,sid(1040,'Invented')))).toThrow('motive');
 expect(()=>cloneCognitive(edit(0,text('')))).toThrow('label');
 const signal=rec(items(descriptions[0],'list')[2],402n),source=rec(f(signal,1n),401n);
 expect(()=>cloneCognitive(edit(2,replace(signal,1n,replace(source,3n,u(4)))))).toThrow();
 expect(()=>compileReasonDescriptions(list([text('assembled-reason-sources/0.1'),list([text('same'),text('same')])]))).toThrow('labels');
 expect(()=>compileReasonDescriptions(list([text('assembled-reason-sources/0.1'),list([text('primary')])]))).toThrow('labels');
 const legacy=r(403,[...Array.from({length:5},(_,i)=>f(raw,BigInt(i+1)))],2);
 const empty=r(403,[f(raw,1n),f(raw,2n),set(items(f(raw,3n),'set').map(v=>{const s=rec(v,402n),k=rec(f(s,1n),401n);return uint(f(k,3n))===1n?r(402,[k,f(s,2n),r(400,[map([])])]):s;})),f(raw,4n),f(raw,5n)],2);
 expect(()=>describedRaw(empty,['restatement'])).toThrow('empty evidence');
 expect(compileDescribedReasons(describedRaw(legacy,[]),definition(w.b.s)).nuclei).toEqual(compileDescribedReasons(raw,definition(w.b.s)).nuclei.map(n=>{const roles=rec(f(rec(n,407n),2n),406n),coverage=items(f(roles,4n),'list').filter(v=>key(f(rec(v,405n),5n))!==key(q(0,1)));return replace(n,2n,replace(roles,4n,list(coverage)));}));
 // Unsupported producer stays uncited; never borrow importance evidence just to pass.
 expect(prioritySourceBasis(legacy,undefined)).toEqual(legacy);
 console.info('M85 GRAMMAR PASS closed tuples/identities/roles/projections/old admission; empty-basis repetition rejected, no invented citation');
},120000);

it('M85 continuation and privacy: exact replay and hidden truth cannot alter source meaning',async()=>{
 const a=await create(['restatement'],9n),b=await create(['restatement'],9n);exact(a.run,b.run);
 const resumed=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,resumed);
 for(const at of [10n,11n]){for(const run of [a.run,b.run,resumed])await through(run,at);exact(a.run,b.run);exact(a.run,resumed);}
 for(const run of [a.run,b.run,resumed])await finish(run);exact(a.run,b.run);exact(a.run,resumed);
 const normal=capture((await witness()).run,true),hidden=capture((await create(['restatement'],10n,true)).run,true);
 expect(hidden.descriptions).toEqual(normal.descriptions);expect(hidden.ns).toEqual(normal.ns);expect(f(hidden.data,2n)).toEqual(f(normal.data,2n));
 expect(transcript(hidden.data)).toEqual(transcript(normal.data));
 console.info('M85 CONTINUATION/PRIVACY PASS exact repeat9/restore9->10->11->101; identical evidence/reasons/probabilities and draws under hidden diagnostic change');
},570000);


it('M85 math: the shared compiler preserves existing Value and native strength domains',async()=>{
 // Retained M34 permitted-outcome witness only; this is a compiler receiving test,
 // not new0.75 runtime Value coverage or invented starting psychological state.
 const old=await import('./fixtures/assembledValueReceiving'),valueReceiving=await import('../assembled/valueReceiving');
 const s=old.source(),d=old.data(true,0),run=await createCharacterRun(await prepareCharacterModel(s),d);await through(run,5n);
 const all=items(decode(snap(run).outputs),'list'),decision=all.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===409n&&key(f(v,2n))===key({kind:'signed',value:5n}))!;
 const context=rec(f(rec(decision,409n),3n),408n),raw=rec(f(context,2n),403n),dice=definition(s),actual=items(f(context,3n),'list');
 expect(actual.some(n=>rec(f(rec(n,407n),1n),404n).schema.schemaVersion===2n),'live actual acquired Value').toBe(true);
 expect(compileDescribedReasons(describedRaw(raw,[]),dice).nuclei).toEqual(actual);
 // Component operand control retains the predecessor's rational-strength domain.
 // This altered operand is never sent to a character run.
 const signals=items(f(raw,3n),'set'),modified=signals.map((v,i)=>i===0?replace(v,2n,q(4,1)):v),wide=replace(raw,3n,set(modified));
 expect(compileDescribedReasons(describedRaw(wide,[]),dice).nuclei).toEqual(valueReceiving.valueReasons(wide,dice));
 console.info('M85 MATH PASS actual retained Value/Commitment operands and raw strength4 preserve old compilation; no authored operand entered a run');
},120000);
