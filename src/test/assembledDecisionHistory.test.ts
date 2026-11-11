import {it,expect} from 'vitest';
import {list,set,map,record,text,typedIdentifier,signed,unsigned,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {createCharacterRun,prepareCharacterModel,restoreCharacterRun} from '../assembled/character';
import {decisionHistoryView,decisionPresentationView,validateDecisionView} from '../assembled/decisionView';
import {decodeCognitive as decode,receivingRecord as rec} from '../assembled/codecs';
import {dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {fixture} from './fixtures/assembledDecisionHistory';
import {changeDefinition,replace} from './fixtures/assembledCharacter';
import {snap,through,finish,bytes,exact} from './fixtures/assembledAffectReceiving';
import {outputs,type Run} from './fixtures/assembledComparison';
const rows=(v:CanonicalValue)=>items(items(v,'list')[1],'list');
const history=(r:Run)=>decode(r.decisionHistory());
const entry=(r:Run,at=10n)=>items(rows(history(r)).find(v=>key(items(v,'list')[1])===key(signed(at)))!,'list');
async function create(physical=true,observed=true,regime:'quiet'|'balanced'='quiet',hidden=false,at=10n){
 const b=fixture(physical,observed,regime,hidden),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);await through(r,at);return {b,m,r};
}
function live(r:Run){
 const s=snap(r),d=outputs(s.outputs,409n).find(v=>key(f(v,2n))===key(signed(10)))!;expect(d,'decision10').toBeDefined();
 const context=rec(f(d,3n),408n),ns=items(f(context,3n),'list');expect(ns,'two live grounds before comparison').toHaveLength(2);
 for(const v of ns){const n=rec(v,407n);expect(f(n,4n)).toEqual(unsigned(4));expect(f(rec(f(n,2n),406n),1n)).toEqual(q(3,8));}
 const intent=outputs(s.outputs,425n).find(v=>key(f(v,2n))===key(d))!;expect(intent).toBeDefined();
 const expression=outputs(s.outputs,426n).find(v=>key(f(v,2n))===key(intent))!;expect(expression).toBeDefined();
 const plan=outputs(s.outputs,431n).find(v=>key(f(v,2n))===key(intent))!;
 const attempt=outputs(s.outputs,432n).find(v=>key(f(v,2n))===key(plan))!;expect(attempt).toBeDefined();
 return {d,intent,expression,ns};
}
function collapse(safeEntry:readonly CanonicalValue[]){
 // Diagnostic competitor receives no physical count, permission, run or trace.
 const zero=items(safeEntry[4],'list').some(v=>{const m=rec(f(rec(v,203n),6n),204n);return f(m,3n)===true&&key(f(m,4n))===key(q(0,1));});
 return list(safeEntry.map((v,i)=>i===3&&zero?list([]):v));
}
function immutable(r:Run){
 const before=r.snapshot(),save=r.save(),identity=r.runIdentity(),h=r.decisionHistory(),p=r.decisionPresentation();
 bytes(h,r.decisionHistory());bytes(p,r.decisionPresentation());h.fill(0);p.fill(0);
 const after=r.snapshot();expect([after.clock,after.status]).toEqual([before.clock,before.status]);
 for(const k of ['state','outputs','trace'] as const)bytes(before[k],after[k]);bytes(save,r.save());bytes(identity,r.runIdentity());
}
function negativeControls(r:Run){
 const s=snap(r),os=items(decode(s.outputs),'list'),ts=items(decode(s.trace),'list');
 const privateRecord=outputs(s.outputs,433n)[0];expect(privateRecord).toBeDefined();
 const badID=typedIdentifier(1134,list([map([[text('nested'),set([privateRecord])]])]));
 const poisoned=os.map(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===426n?replace(v,1n,badID):v);
 expect(()=>decisionHistoryView(poisoned,ts)).toThrow('unsupported nested record');
 const safe=rec(f(rec(live(r).ns[0],407n),1n),404n);
 expect(()=>validateDecisionView(record({...safe.schema,schemaVersion:99n},safe.fields))).toThrow('unsupported nested record');
 const observation=ts.find(v=>{const t=rec(v,160n),ev=rec(f(t,4n),130n);return uint(f(ev,3n))===120n&&key(f(ev,5n))===key(typedIdentifier(1001,text('event/protocol-observation')));})!;
 expect(observation).toBeDefined();
 const corrupt=(eventField:bigint,value:CanonicalValue)=>ts.map(v=>v===observation?replace(v,4n,replace(f(rec(v,160n),4n),eventField,value)):v);
 expect(()=>decisionHistoryView(os,corrupt(8n,list([unsigned(999999)])))).toThrow('execution parent');
 expect(()=>decisionHistoryView(os,[...ts,observation])).toThrow('ambiguous observation');
 const evidence=f(rec(observation,160n),13n);
 expect(()=>decisionHistoryView(os.filter(v=>key(v)!==key(evidence)),ts)).toThrow('foreign observation');
 expect(()=>decisionHistoryView(os,corrupt(2n,signed(999)))).toThrow('execution instant');
 console.info('M82 CLOSURE PASS recursive identifier/map/set private-record and version rejection; missing/duplicate/foreign/incorrect-instant joins reject.');
}
it('M82 matrix: intent meaning survives perceived failure and unseen outcomes',async()=>{
 const results=[] as {r:Run;e:readonly CanonicalValue[];physical:boolean;observed:boolean}[];
 for(const observed of [true,false])for(const physical of [true,false]){
  const x=await create(physical,observed);const l=live(x.r),e=entry(x.r);
  expect(e[0]).toEqual(f(l.d,1n));expect(e[2]).toEqual(f(l.intent,1n));
  const ex=items(e[3],'list');expect(ex[0]).toEqual(f(l.expression,1n));expect(ex[12]).toEqual(f(l.expression,4n));
  expect(items(e[4],'list')).toHaveLength(observed?1:0);validateDecisionView(list(e));immutable(x.r);
  if(observed){const measurement=rec(f(rec(items(e[4],'list')[0],203n),6n),204n);const lower=f(measurement,2n);if(typeof lower==='boolean'||lower.kind!=='rational')throw Error('measurement rational');expect(lower.numerator>0n).toBe(physical);}
  if(observed&&!physical)negativeControls(x.r);
  console.info('M82 ARM '+JSON.stringify({physical,observed,at:10,grounds:l.ns.length,outcomes:items(e[4],'list').length}));
  results.push({r:x.r,e,physical,observed});
 }
 const [success,failure,unseenSuccess,unseenFailure]=results;
 for(const x of results)expect(x.e.slice(0,4)).toEqual(success.e.slice(0,4));
 expect(failure.e[4]).not.toEqual(success.e[4]);expect(collapse(success.e)).toEqual(list(success.e));
 expect(items(collapse(failure.e),'list')[3]).toEqual(list([]));expect(items(failure.e[3],'list').length).toBeGreaterThan(0);
 expect(unseenFailure.e).toEqual(unseenSuccess.e);expect(collapse(unseenFailure.e)).toEqual(collapse(unseenSuccess.e));
 for(const x of results){await finish(x.r);expect(entry(x.r)).toEqual(x.e);}
 console.info('M82 MATRIX PASS four live arms; observed zero retains meaning, safe-only IntentEqualsOutcome loses it; absent-observation entry10 equal; all original entries unchanged through101.');
},570000);
it('M82 player: authoritative faces are separate, hidden truth leaves views equal',async()=>{
 const quiet=await create(),hidden=await create(true,true,'quiet',true),player=await create(true,true,'balanced');
 for(const x of [quiet,hidden,player])live(x.r);
 expect(entry(hidden.r)).toEqual(entry(quiet.r));bytes(hidden.r.decisionPresentation(),quiet.r.decisionPresentation());
 expect(rows(decode(quiet.r.decisionPresentation()))).toHaveLength(0);
 const p=live(player.r),data=rec(f(rec(f(p.d,4n),419n),2n),420n);expect(uint(f(data,8n))).toBe(3n);
 const shown=rows(decode(player.r.decisionPresentation())).map(v=>items(v,'list')).find(v=>key(v[0])===key(f(p.d,1n)))!;
 expect(shown).toBeDefined();expect(shown[1]).toEqual(f(data,1n));
 const faces=items(f(data,9n),'list');expect(faces).toHaveLength(2);
 expect(shown[2]).toEqual(list(faces.map(v=>{const d=rec(v,422n);return list([f(d,1n),f(d,2n),f(d,3n),f(d,4n),f(d,6n),f(d,7n)]);})));
 const tie=rec(f(data,10n),423n);expect(shown[3]).toEqual(list(uint(f(tie,1n))===2n?[f(tie,4n)]:[]));
 // Captured Auto/Quiet mode suppression, without another scenario or reroll.
 for(const mode of [1,2]){const controlled=replace(p.d,4n,replace(f(p.d,4n),2n,replace(data,8n,unsigned(mode))));expect(rows(decisionPresentationView([controlled]))).toHaveLength(0);}
 for(const x of [quiet,hidden,player]){immutable(x.r);await finish(x.r);}
 console.info('M82 PLAYER PASS existing authoritative faces/contributions and tie only; Auto/Quiet empty; identical evidence/hidden truth leaves entry10 and player view equal; reads preserve every authoritative byte.');
},570000);
it('M82 continuation: exact restore, old-version compatibility and bounded admission',async()=>{
 const a=await create(false,true,'quiet',false,9n),b=await create(false,true,'quiet',false,9n);exact(a.r,b.r);
 const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.r.save()});exact(a.r,restored);
 for(const at of [10n,11n]){for(const r of [a.r,b.r,restored])await through(r,at);exact(a.r,b.r);exact(a.r,restored);bytes(a.r.decisionHistory(),restored.decisionHistory());bytes(a.r.decisionPresentation(),restored.decisionPresentation());}
 for(const r of [a.r,b.r,restored])await finish(r);exact(a.r,b.r);exact(a.r,restored);bytes(a.r.decisionHistory(),restored.decisionHistory());bytes(a.r.decisionPresentation(),restored.decisionPresentation());
 const fresh=fixture(),old=await createCharacterRun(await prepareCharacterModel(fresh.old),fresh.d),current=await create();await through(old,10n);
 bytes(snap(old).state,snap(current.r).state);bytes(snap(old).outputs,snap(current.r).outputs);bytes(old.decisionHistory(),current.r.decisionHistory());
 expect(old.runIdentity()).not.toEqual(current.r.runIdentity());
 await expect(prepareCharacterModel(changeDefinition(fresh.old,'definition/protocol-observation',4n,false))).rejects.toThrow();
 await expect(prepareCharacterModel(changeDefinition(fresh.s,'definition/protocol-observation',4n,unsigned(1)))).rejects.toThrow();
 await expect(prepareCharacterModel({...fresh.s,registrySchemaVersion:fresh.old.registrySchemaVersion})).rejects.toThrow();
 await expect(prepareCharacterModel(changeDefinition(fresh.s,'definition/protocol-observation',3n,unsigned(999)))).rejects.toThrow();
 console.info('M82 CONTINUATION PASS exact repeat/restore9->10->11->101 and views;0.73/0.74 state/output/view equality at10; original permission retained in identities; old denied/nonBoolean/version/unrelated-topology controls reject.');
},570000);
