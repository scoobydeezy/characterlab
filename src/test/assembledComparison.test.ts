import {describe,it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileComparison,comparisonAddress,comparisonRoles} from '../assembled/comparison';
import {createAssembledRandomSession} from '../assembled/random';
import {ComparisonDrawMap,RandomRunOracle,randomAddressValue} from '../substrate/random';
import {canonicalEncode as enc,list,unsigned,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {decodeCognitive as decode} from '../assembled/codecs';
import {decodeCognitive as frozenDecode} from '../campaign2/cognitiveCodecs';
import {restoreAuthoritativeState} from '../substrate/state';
import {personPath} from '../assembled/social';
import {REL_APPRAISAL,relationshipPath,relationshipHistory} from '../assembled/relationship';
import {C} from './fixtures/campaign2Cognitive';
import {target} from './fixtures/assembledSocial';
import {relationshipSource} from './fixtures/assembledRelationship';
import {workLimit,replace} from './fixtures/assembledCharacter';
import {outputs} from './fixtures/assembledComparison';
import {source,fixture,data,mappedData,atom,through,finish,draws,choice,decisions,signedValue,type Run} from './fixtures/assembledComparison';
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const exact=(a:Run,b:Run)=>{expect(b.snapshot()).toEqual(a.snapshot());expect(b.save()).toEqual(a.save());};
function assertCoupled(a:Run,b:Run){
 const aa=draws(a),bb=draws(b);for(const d of [...aa,...bb])expect(rec(f(d,2n),113n).schema.typeId).toBe(113n);
 const y=new Map(bb.map(d=>[key(f(d,2n)),d]));let common=0,differentRoots=0;
 for(const x of aa){const z=y.get(key(f(x,2n)));if(!z)continue;common++;if(key(f(x,1n))!==key(f(z,1n)))differentRoots++;
  const ax=items(f(x,7n),'list').map(v=>rec(v,410n)),az=items(f(z,7n),'list').map(v=>rec(v,410n));
  for(let i=0;i<Math.min(ax.length,az.length);i++){expect(f(ax[i],1n)).toEqual(f(az[i],1n));expect(f(ax[i],2n)).toEqual(f(az[i],2n));}
  if(key(f(x,4n))===key(f(z,4n))){expect(f(x,3n)).toEqual(f(z,3n));expect(f(x,7n)).toEqual(f(z,7n));}
 }
 return {draws:aa.length+bb.length,common,differentRoots,unmatched:aa.length+bb.length-2*common};
}
describe('M21a explicit comparison foundation',()=>{
 for(const contrast of ['breach','witness'] as const)it(contrast==='breach'?'negative matrix: cooperation versus automatic breach has no shared draws':'participation: first-decision correspondence holds entropy fixed across all eight pairs',async()=>{
  const {model,maps}=await fixture(contrast),changed:number[]=[];let common=0,differentRoots=0,total=0,unmatched=0,laterNatural=0;
  for(let seed=0;seed<8;seed++){
   const a=await createCharacterRun(model,data(true,seed,maps[0],contrast)),b=await createCharacterRun(model,data(false,seed,maps[1],contrast));await through(a,3n);await through(b,3n);
   expect(state(a).read(personPath(C,target))).toEqual(state(b).read(personPath(C,target)));
   expect(f(decisions(a)[0],3n)).not.toEqual(f(decisions(b)[0],3n));
   const reports=(r:Run)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&key(v.items[0])===key(atom(0,REL_APPRAISAL).payload)).map(v=>items(v,'list'));
   expect(reports(a).at(-1)!.slice(4,7)).toEqual([unsigned(2),false,true]);expect(reports(b).at(-1)!.slice(4,7)).toEqual([unsigned(0),contrast==='breach',false]);
   for(const run of [a,b]){const prior=state(run).read(relationshipPath(C,target)).value;expect(reports(run).at(-1)![3]).toEqual(prior??list([]));expect(relationshipHistory(prior)).toHaveLength(run===a||contrast==='breach'?2:0);}
   const mode=(r:Run)=>uint(f(rec(f(rec(f(decisions(r)[0],4n),419n),2n),420n),8n));expect(mode(a)).toBe(3n);expect(mode(b)).toBe(contrast==='witness'?3n:1n);
   const counts=assertCoupled(a,b);common+=counts.common;differentRoots+=counts.differentRoots;total+=counts.draws;unmatched+=counts.unmatched;
   if(contrast==='witness')expect(counts.common).toBeGreaterThan(0);
   if(choice(a)!==choice(b))changed.push(seed);console.info('M21a cell '+JSON.stringify({contrast,seed,a:choice(a),b:choice(b),...counts}));
   await finish(a);await finish(b);for(const run of [a,b])for(const at of [5n,7n])for(const d of draws(run,at)){expect(rec(f(d,2n),112n).schema.typeId).toBe(112n);laterNatural++;}
  }
  if(contrast==='witness'){expect(common).toBeGreaterThan(0);expect(changed.length).toBeGreaterThan(0);}else{expect(common).toBe(0);expect(unmatched).toBe(total);}
  console.info('M21a matrix '+JSON.stringify({contrast,runs:16,seeds:8,changedFirstChoices:changed,draws:total,common,differentRoots,unmatched,laterNatural}));
 },420000);
 it('participation: witness exact repeat and restore2/3 through10',async()=>{
  const {model,maps}=await fixture('witness'),d=data(false,0,maps[1],'witness'),run=await createCharacterRun(model,d),repeat=await createCharacterRun(model,d);
  await through(run,2n);const save2=run.save();await through(run,3n);const save3=run.save();await finish(run);await finish(repeat);exact(run,repeat);
  for(const save of [save2,save3]){const restored=await restoreCharacterRun(source(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save});await finish(restored);exact(run,restored);}
  console.info('M21a participation: witness repeat and restore2/3 exact through10');
 },180000);
 it('controls: exact repeat, restore2/3, map identity and inaccessible truth',async()=>{
  const {model,maps}=await fixture(),d=data(true,0,maps[0]),run=await createCharacterRun(model,d),repeat=await createCharacterRun(model,d);await through(run,2n);const save2=run.save();await through(run,3n);const save3=run.save();await finish(run);await finish(repeat);exact(run,repeat);
  for(const save of [save2,save3]){const restored=await restoreCharacterRun(source(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save});await finish(restored);exact(run,restored);}
  const renamed=new ComparisonDrawMap(maps[0].entries.map(e=>({...e,comparisonDrawKey:{...e.comparisonDrawKey,keyId:atom(10006,'renamed/'+key(e.comparisonDrawKey.keyId))}})),comparisonRoles),changed=data(true,0,renamed);
  expect((await createCharacterRun(model,changed)).runIdentity()).not.toEqual((await createCharacterRun(model,d)).runIdentity());
  await expect(restoreCharacterRun(source(),{initialState:d.initialState,orderedInputs:changed.orderedInputs,save:save3})).rejects.toThrow('commitments differ');
  // Social source hidden truth differs; declared positive display and accessible evidence stay fixed.
  const rows=items(decode(d.orderedInputs),'list').map(v=>{if(typeof v!=='boolean'&&v.kind==='record')return v;const x=[...items(v,'list')];if(key(x[2])===key(atom(1001,'event/assembled-social-source'))){const p=[...items(x[3],'list')];p[1]=!p[1];x[3]=list(p);}return list(x);});
  const hidden=await createCharacterRun(model,{...d,orderedInputs:enc(list(rows))});expect(hidden.runIdentity()).not.toEqual(run.runIdentity());await finish(hidden);expect(hidden.snapshot().state).toEqual(run.snapshot().state);expect(decisions(hidden)).toEqual(decisions(run));expect(draws(hidden)).toEqual(draws(run));
 },300000);
 it('controls: admission, natural fallback, purpose separation and atomic ledger retry',async()=>{
  const {model,maps}=await fixture(),m=maps[0],entries=m.entries;
  expect(compileComparison(m.canonicalValue).canonicalBytes).toEqual(m.canonicalBytes);
  const rows=items(f(rec(m.canonicalValue,116n),1n),'list');
  expect(()=>compileComparison(replace(m.canonicalValue,1n,list([...rows,rows[0]])))).toThrow('duplicate');
  const collision=replace(rows[1],2n,f(rec(rows[0],115n),2n));expect(()=>compileComparison(replace(m.canonicalValue,1n,list([rows[0],collision])))).toThrow('injective');
  const badRole=replace(f(rec(rows[0],115n),2n),2n,atom(10005,'wrong-purpose'));expect(()=>compileComparison(replace(m.canonicalValue,1n,list([replace(rows[0],2n,badRole)])))).toThrow('incompatible');
  await expect(createCharacterRun(await prepareCharacterModel(relationshipSource()),data(true,0,m))).rejects.toThrow('requires assembled0.21');
  const d=data(true,0,m),input=items(decode(d.orderedInputs),'list');await expect(createCharacterRun(model,{...d,orderedInputs:enc(list([...input,m.canonicalValue]))})).rejects.toThrow();
  const seed=new Uint8Array(32),address=entries[0].localRandomAddress,unrelated={...address,causalRootId:{...address.causalRootId,payload:unsigned(999999)}};
  const natural=await new RandomRunOracle(seed).drawBounded(unrelated,7n),fallback=await new RandomRunOracle(seed,m).drawBounded(unrelated,7n);expect(fallback).toEqual(natural);
  const extra={localRandomAddress:unrelated,comparisonDrawKey:{...entries[0].comparisonDrawKey,keyId:atom(10006,'unrelated')}};
  expect(await new RandomRunOracle(seed,new ComparisonDrawMap([...entries,extra],comparisonRoles)).drawBounded(address,7n)).toEqual(await new RandomRunOracle(seed,m).drawBounded(address,7n));
  const run=await createCharacterRun(model,d);await through(run,3n);const decision=decisions(run)[0],context=f(decision,3n),nucleus=items(f(rec(context,408n),3n),'list')[0],session=createAssembledRandomSession(seed,m);
  session.begin();const first=await session.forResolution(f(decision,1n),context).reason(nucleus);session.close();expect(session.committedAddressKeys()).toEqual([]);
  const admitted=draws(run)[0];expect(admitted.schema.schemaVersion).toBe(2n);expect(()=>frozenDecode(enc(admitted))).toThrow();
  expect(()=>decode(enc(record({...admitted.schema,schemaVersion:1n},admitted.fields)))).toThrow();
  expect(()=>decode(enc(record(admitted.schema,new Map([...admitted.fields].map(([k,v])=>[k,k===4n?true:v])))))).toThrow('unsigned');
  const root=f(decision,1n) as Extract<CanonicalValue,{kind:'typedIdentifier'}>,newRoot={...root,payload:unsigned(uint(root.payload)+10000n)};
  const remapped=new ComparisonDrawMap(entries.map(e=>({...e,localRandomAddress:{...e.localRandomAddress,causalRootId:newRoot}})),comparisonRoles),other=createAssembledRandomSession(seed,remapped);
  other.begin();const second=await other.forResolution(newRoot,context).reason(nucleus);other.close();
  const asRecord=(v:CanonicalValue)=>v as Extract<CanonicalValue,{kind:'record'}>;expect(f(asRecord(first),1n)).not.toEqual(f(asRecord(second),1n));expect(f(asRecord(first),2n)).toEqual(f(asRecord(second),2n));expect(f(asRecord(first),7n)).toEqual(f(asRecord(second),7n));

  session.begin();expect(await session.forResolution(f(decision,1n),context).reason(nucleus)).toEqual(first);session.prepareCommit();session.commit();session.close();expect(session.committedAddressKeys()).toHaveLength(1);
  session.begin();await expect(session.forResolution(f(decision,1n),context).reason(nucleus)).rejects.toThrow('repeated');session.close();
  // A fixed low ceiling must fail the first instant; it cannot isolate instant3 if
  // an earlier instant has more events. RNG-after-draw rollback/retry is checked above.
  const failed=await createCharacterRun(await prepareCharacterModel(workLimit(source(),1n)),d),before=failed.snapshot();
  await expect(failed.settleNextInstant()).rejects.toThrow('work ceiling');expect({...failed.snapshot(),status:before.status}).toEqual(before);
  console.info('M21a controls: map validation, strict411 versions, shifted-root entropy, natural fallback, atomic RNG ledger retry and whole-first-instant rollback');

 },180000);
});
