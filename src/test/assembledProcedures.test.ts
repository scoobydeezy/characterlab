import {describe,it,expect} from 'vitest';
import {list,text,unsigned,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {PROCEDURES,SKILL_ACTUAL,SKILL_UPDATE,SKILL_OWNER,PHASE_OWNER,skillPath,skillValue,practiced,sid} from '../assembled/skill';
import {PERFORMANCE_OBS} from '../assembled/performance';
import {ACTION_BODY} from '../assembled/actionBody';
import {dataRecord as rec,dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
import {outputs} from './fixtures/assembledInteraction';
import {workLimit} from './fixtures/assembledCharacter';
import {C} from './fixtures/campaign2Cognitive';
import {procedureSource,procedureData,A,B,PA,PB,PC,decode,items,key,enc} from './fixtures/assembledProcedures';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const labelled=(v:CanonicalValue,label:string)=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length>0&&typeof v.items[0]!=='boolean'&&v.items[0].kind==='text'&&v.items[0].value===label;
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>labelled(v,label)).map(v=>items(v,'list'));
async function through(r:Run,at:bigint){let n=0;while(r.snapshot().clock<at){expect(++n).toBeLessThanOrEqual(32);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
async function finish(r:Run){let n=0;while(await r.settleNextInstant())expect(++n).toBeLessThanOrEqual(32);expect(r.snapshot().clock).toBe(10n);expect(r.diagnostic()).toBeUndefined();}
const exact=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
const K=(r:Run,p:CanonicalValue)=>skillValue(state(r).read(skillPath(C,p)).value,p);
function automatic(r:Run){const ds=outputs(r.snapshot().outputs,409n);expect(ds).toHaveLength(3);for(const x of ds){const chosen=rec(f(rec(f(x,4n),419n),2n),420n),ps=items(f(chosen,2n),'list');expect(uint(f(chosen,8n))).toBe(1n);expect(f(chosen,3n)).toEqual(q(1,1));expect(f(chosen,4n)).toEqual(q(0,1));expect(f(chosen,9n)).toEqual(list([]));expect(ps).toHaveLength(1);expect(f(rec(ps[0],421n),2n)).toEqual(q(1,1));}expect(outputs(r.snapshot().trace,160n).flatMap(t=>items(f(t,14n),'list'))).toEqual([]);}
function learned(r:Run,trained:CanonicalValue,untrained:CanonicalValue){expect(K(r,trained)).toEqual({K:Q.of(1n,2n),count:1n});expect(K(r,untrained)).toEqual({K:Q.of(0n),count:0n});expect(state(r).read(skillPath(C,PC)).presence).toBe(false);}
describe('M27 independent procedures',()=>{
 it('positive: practice is procedure-specific and actual reports follow reciprocal execution',async()=>{
  const s=procedureSource(),m=await prepareCharacterModel(s);
  for(const trainA of [true,false]){const r=await createCharacterRun(m,procedureData(trainA));await through(r,3n);learned(r,trainA?PA:PB,trainA?PB:PA);await finish(r);automatic(r);learned(r,trainA?PA:PB,trainA?PB:PA);
   const actual=reports(r,SKILL_ACTUAL),body=reports(r,ACTION_BODY),safe=reports(r,PERFORMANCE_OBS);expect(actual.map(x=>x[10])).toEqual([trainA?PA:PB,PB,PA]);expect(actual.map(x=>x[3])).toEqual([q(0,1),q(trainA?0:1,trainA?1:2),q(trainA?1:0,trainA?2:1)]);expect(actual.map(x=>x[7])).toEqual([false,!trainA,trainA]);expect(actual.map(x=>x[8])).toEqual([true,false,false]);expect(body.map(x=>x[3])).toEqual([trainA?A:B,B,A]);expect(body.map(x=>x[5])).toEqual([text('Blocked'),text(trainA?'Blocked':'Applied'),text(trainA?'Applied':'Blocked')]);
   for(const at of [3,5,7]){const rows=safe.filter(x=>uint(x[2])===BigInt(at));expect(rows.length).toBeGreaterThan(0);expect(rows.every(x=>x[6]===(at===3?false:at===5?!trainA:trainA))).toBe(true);}
   const ts=outputs(r.snapshot().trace,160n);for(const a of actual){const executing=ts.filter(t=>key(f(rec(f(t,4n),130n),1n))===key(a[1]));expect(executing.some(t=>key(f(t,6n))===key(text('assembled-character-procedures/0.1-candidate'))&&items(f(t,11n),'list').some(v=>key(f(rec(v,147n),2n))===key(statePathValue(skillPath(C,a[10])))))).toBe(true);}
   console.info('M27 reciprocal '+JSON.stringify({train:trainA?'A':'B',competence:actual.map(x=>key(x[3])),success:actual.map(x=>x[7]),reports:safe.length,terminal:10,draws:0}));
  }
 },240000);
 it('controls: shared procedure, no/blocked practice, hidden/false feedback and impairment recovery',async()=>{
  const m=await prepareCharacterModel(procedureSource());
  let hidden:Run|undefined;for(const o of [{practice:false},{permitted:false},{visible:false},{mode:2},{impairment5:q(1,1)}]){const r=await createCharacterRun(m,procedureData(false,o));await finish(r);const actual=reports(r,SKILL_ACTUAL);if('practice'in o||'permitted'in o){expect(K(r,PB).count).toBe(0n);expect(actual.every(x=>x[7]===false)).toBe(true);}else{learned(r,PB,PA);expect(actual[1][7]).toBe(!('impairment5'in o));}if('visible'in o){expect(reports(r,PERFORMANCE_OBS)).toEqual([]);hidden=r;}if('mode'in o){expect(reports(r,PERFORMANCE_OBS).every(x=>x[6]===true)).toBe(true);expect(actual[0][7]).toBe(false);}}
  const noHidden=await createCharacterRun(m,procedureData(false,{practice:false,visible:false}));await finish(noHidden);for(const type of [381n,384n,386n,394n,398n,403n,408n,409n,425n,426n])expect(outputs(hidden!.snapshot().outputs,type)).toEqual(outputs(noHidden.snapshot().outputs,type));expect(K(noHidden,PB).count).toBe(0n);
  const shared=await createCharacterRun(await prepareCharacterModel(procedureSource(true)),procedureData(true,{impairment5:q(1,1)}));await finish(shared);expect(reports(shared,SKILL_ACTUAL).map(x=>x[7])).toEqual([false,false,true]);expect(K(shared,PA)).toEqual({K:Q.of(1n,2n),count:1n});
  const normal=await createCharacterRun(await prepareCharacterModel(procedureSource(true)),procedureData(true));await finish(normal);expect(reports(normal,SKILL_ACTUAL).map(x=>x[7])).toEqual([false,true,true]);for(const type of [425n,426n])expect(outputs(normal.snapshot().outputs,type).slice(0,2)).toEqual(outputs(shared.snapshot().outputs,type).slice(0,2));
 },480000);
 it('controls: exact repeat, restore3/5 and late atomic rollback',async()=>{
  const s=procedureSource(),d=procedureData(),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,3n);await through(b,3n);exact(a,b);const c=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,c);await through(a,5n);await through(b,5n);await through(c,5n);exact(a,b);exact(a,c);const e=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});for(const r of [a,b,c,e])await finish(r);for(const r of [b,c,e])exact(a,r);
  const traces=outputs(a.snapshot().trace,160n).filter(t=>{const at=f(rec(f(t,4n),130n),2n);return typeof at!=='boolean'&&at.kind==='signed'&&at.value===3n;}),count=new Set(traces.map(t=>key(f(rec(f(t,4n),130n),1n)))).size,failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(count-1))),d);let rejected=false;for(let i=0;i<32;i++){const before=failed.snapshot();try{expect(await failed.settleNextInstant()).toBe(true);}catch{expect(failed.diagnostic()).toBeDefined();expect(before.clock).toBeLessThan(3n);expect({...failed.snapshot(),status:before.status}).toEqual(before);rejected=true;break;}expect(failed.snapshot().clock).toBeLessThan(3n);}expect(rejected).toBe(true);console.info('M27 rollback events='+count+' cap='+(count-1));
 },300000);
 it('controls: governed mappings and exact procedural write authority',async()=>{
  const s=procedureSource(),slots=items(decode(s.registry),'list'),decl=items(slots[11],'list'),rows=items(decl[1],'list'),bad=(mapping:CanonicalValue[])=>({...s,registry:enc(list(slots.map((v,i)=>i===11?list([text(PROCEDURES),list(mapping)]):v)))});
  for(const mapping of [rows.slice(1),[rows[0],rows[0],rows[2]],[list([sid(1027,'foreign'),PA]),...rows.slice(1)],[list([items(rows[0],'list')[0],sid(1027,'wrong')]),...rows.slice(1)]])await expect(prepareCharacterModel(bad(mapping))).rejects.toThrow('procedures');
  const model=await compileCharacterModel(s),component=await compileCharacterState(model),d=procedureData(),initial=component.initialState(d.initialState),path=skillPath(C,PA),value=practiced(Q.of(0n),0n,0,PA).value,patch={operations:[{kind:'set' as const,path,expected:{presence:false as const},newValue:value}]};expect(()=>component.stateModel.applyPatch(initial,patch,PHASE_OWNER)).toThrow();expect(()=>component.stateModel.applyPatch(initial,patch,SKILL_OWNER)).not.toThrow();expect(()=>component.stateModel.validatePath(skillPath(C))).toThrow('foreign');expect(()=>component.stateModel.validatePath(skillPath(C,sid(1027,'definition/procedure/foreign')))).toThrow('foreign');expect(()=>component.stateModel.applyPatch(initial,{operations:[{...patch.operations[0],newValue:practiced(Q.of(0n),0n,0,PB).value}]},SKILL_OWNER)).toThrow('procedure');await expect(createCharacterRun(await prepareCharacterModel(s),{...d,initialState:enc(new AuthoritativeState([...initial.entries(),{path,value}]).canonicalValue())})).rejects.toThrow('initial skill');
 },60000);
});
