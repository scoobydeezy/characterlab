import {describe,it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun,characterModelIdentity} from '../assembled/character';
import {canonicalEncode as enc,list,rational,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {decodeEmbodied as decode,embodiedRecord as r} from '../campaign3/embodiedCodecs';
import {exact} from '../campaign3/embodiedMath';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {interactionSource,interactionData,outputs} from './fixtures/assembledInteraction';
import {changeDefinition} from './fixtures/assembledCharacter';
import {CALIBRATED_RULES,CALIBRATED_REGISTRY,INTERACTION_REGISTRY} from '../assembled/model';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const textOf=(v:CanonicalValue):string=>{if(typeof v==='boolean')throw Error('not text');return v.kind==='typedIdentifier'?textOf(v.payload):v.kind==='text'?v.value:(()=>{throw Error('not text');})();};
const taskName=(v:CanonicalValue)=>textOf(f(rec(v,371n),2n));
function joint(run:Run){const all=items(decode(run.snapshot().outputs),'list'),reports=all.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&typeof v.items[0]!=='boolean'&&v.items[0].kind==='text'&&v.items[0].value===JOINT_APPRAISAL);expect(reports).toHaveLength(1);return items(reports[0],'list');}
function values(run:Run){return new Map(items(joint(run)[4],'list').map(v=>{const a=items(v,'list');return [taskName(a[0]),a];}));}
function choice(run:Run){const decision=outputs(run.snapshot().outputs,409n);expect(decision).toHaveLength(1);const result=rec(f(decision[0],4n),419n);expect(uint(f(result,1n))).toBe(3n);return textOf(f(rec(f(rec(f(result,2n),420n),1n),395n),2n));}
function mode(run:Run){return uint(f(rec(f(rec(f(outputs(run.snapshot().outputs,409n)[0],4n),419n),2n),420n),8n));}
function draws(run:Run){return new Map(outputs(run.snapshot().trace,160n).flatMap(t=>items(f(t,14n),'list')).map(v=>[key(f(rec(v,411n),1n)),v]));}
function situation(run:Run){const reasons=outputs(run.snapshot().outputs,408n);expect(reasons).toHaveLength(1);return new Map(items(f(reasons[0],3n),'list').map(v=>{const n=rec(v,407n),nk=rec(f(n,1n),404n);return [textOf(f(nk,3n)),exact(f(rec(f(n,2n),406n),3n))];}));}
async function finish(run:Run){let n=0;while(await run.settleNextInstant())expect(++n).toBeLessThan(32);expect(run.snapshot().clock).toBe(10n);expect(run.diagnostic()).toBeUndefined();}
function exactRuns(a:Run,b:Run){expect(b.runIdentity()).toEqual(a.runIdentity());expect(b.snapshot()).toEqual(a.snapshot());expect(b.save()).toEqual(a.save());expect(b.diagnostic()).toEqual(a.diagnostic());}
function joins(run:Run,history:0|1){
 const report=joint(run),appraisal=rec(report[1],384n),workspace=rec(f(appraisal,2n),381n),forecast=rec(f(workspace,5n),380n),prediction=rec(f(forecast,2n),361n);
 expect(f(prediction,1n)).toEqual(rational(history?9:3,1));const supports=items(f(prediction,2n),'set');expect(supports.length).toBeGreaterThan(0);
 const sample=rec(report[2],461n),experience=rec(report[3],227n);expect(f(sample,4n)).toEqual({kind:'signed',value:3n});
 expect(items(f(experience,8n),'set').map(s=>key(f(rec(s,216n),2n)))).toContain(key(f(sample,1n)));
 const trace=outputs(run.snapshot().trace,160n),find=(name:string)=>trace.find(t=>textOf(f(t,7n))===name)!;
 const freeze=find('event/assembled-body-freeze'),app=find('event/task-appraisal'),concern=find('event/task-concern'),raw=find('event/task-raw-signals');
 expect(items(f(rec(f(app,4n),130n),8n),'list').map(key)).toContain(key(f(rec(f(freeze,4n),130n),1n)));
 expect(f(app,13n)).toEqual(list([appraisal,list(report)]));expect(items(f(concern,12n),'list')[1]).toEqual(list(report));expect(items(f(raw,12n),'list')[1]).toEqual(list(report));
 for(const row of [app,concern,raw])expect(items(f(row,11n),'list')).toHaveLength(row===raw?1:0); // raw alone reads earned identity
 const rawOutput=outputs(run.snapshot().outputs,403n)[0],signals=items(f(rawOutput,3n),'set').filter(s=>uint(f(rec(f(rec(s,402n),1n),401n),3n))===2n);
 for(const signal of signals){const basis=f(rec(f(rec(signal,402n),3n),400n),1n);if(typeof basis==='boolean'||basis.kind!=='map')throw Error('basis');const supportKeys=basis.entries.map(([k])=>key(f(rec(k,399n),2n)));expect(supportKeys).toContain(key(r(237,[{kind:'unsigned',value:1n},f(sample,1n)])));for(const support of supports)expect(supportKeys).toContain(key(support));}
 expect(outputs(run.snapshot().outputs,425n)).toHaveLength(1);expect(outputs(run.snapshot().outputs,433n)).toHaveLength(1);expect(outputs(run.snapshot().outputs,342n).length).toBeGreaterThanOrEqual(2);
 // Probe1 wrote the prediction actually read at3; further genuine probe4 adds support.
 const ws=find('event/deliberation-opportunity'),reads=items(f(ws,11n),'list');const predictionRead=reads.map(v=>rec(v,147n)).find(v=>uint(f(rec(f(v,2n),140n),1n))===362n);expect(predictionRead).toBeDefined();expect(f(predictionRead!,4n)).toEqual(prediction);
 const priorWrites=trace.filter(t=>(f(rec(f(t,4n),130n),2n) as {value:bigint}).value===1n).flatMap(t=>items(f(t,17n),'list')).map(v=>rec(v,148n));expect(priorWrites.some(v=>key(f(v,5n))===key(prediction))).toBe(true);
}
const expected=[[[Q.of(11n,120n),Q.of(11n,30n)],[Q.of(1n,20n),Q.of(1n,5n)]],[[Q.of(11n,40n),Q.of(0n)],[Q.of(3n,20n),Q.of(0n)]]];
async function matrix(seeds:number[],calibrated:boolean){const model=await prepareCharacterModel(interactionSource(true,true,calibrated));let changed=0,shared=0;const allDraws=new Map<string,Map<string,CanonicalValue>>();
 for(const seed of seeds){const cells:Run[][]=[[],[]];for(const history of [0,1] as const)for(const body of [0,1] as const){const run=await createCharacterRun(model,interactionData(history,body,seed));await finish(run);cells[history][body]=run;allDraws.set(seed+'/'+history+'/'+body,draws(run));joins(run,history);
   const automatic=history===1||(calibrated&&body===0);if(automatic){expect(mode(run)).toBe(1n);expect(draws(run).size).toBe(0);}else{expect(mode(run)).toBeGreaterThan(1n);expect(draws(run).size).toBeGreaterThanOrEqual(2);}
   for(const n of items(f(outputs(run.snapshot().outputs,408n)[0],3n),'list')){const nucleus=rec(n,407n),name=textOf(f(rec(f(nucleus,1n),404n),3n)),modifier=calibrated?(history===0?(name==='content/task-b'?(body===0?2n:1n):0n):(body===0?2n:1n)):0n;expect(f(nucleus,6n)).toEqual({kind:'signed',value:modifier});}const v=values(run),s=situation(run);
   for(const [i,name] of ['content/task-a','content/task-b'].entries()){const x=expected[history][body][i];expect(v.get(name)![4]).toEqual(rational(x.numerator,x.denominator));const bounded=x.divide(Q.of(1n).add(x));if(x.equals(Q.of(0n)))expect(s.has(name)).toBe(false);else expect(s.get(name)).toEqual(bounded);
    const raw=outputs(run.snapshot().outputs,403n)[0],matching=items(f(raw,3n),'set').map(v=>rec(v,402n)).find(v=>{const k=rec(f(v,1n),401n);return uint(f(k,3n))===2n&&taskName(f(k,2n))===name;});expect(matching?f(matching,2n):rational(0,1)).toEqual(rational(x.numerator,x.denominator));}
  }
  for(const name of ['content/task-a','content/task-b']){const delta=(h:number)=>exact(values(cells[h][1]).get(name)![4]).subtract(exact(values(cells[h][0]).get(name)![4]));expect(delta(1).subtract(delta(0)).equals(Q.of(0n))).toBe(false);
   if(name==='content/task-a'){const reasonDelta=(h:number)=>situation(cells[h][1]).get(name)!.subtract(situation(cells[h][0]).get(name)!);expect(reasonDelta(1).subtract(reasonDelta(0)).equals(Q.of(0n))).toBe(false);}else{expect(situation(cells[1][0]).has(name)).toBe(false);expect(situation(cells[1][1]).has(name)).toBe(false);}}
  for(const history of [0,1]){if(choice(cells[history][0])!==choice(cells[history][1]))changed++;const a=draws(cells[history][0]),b=draws(cells[history][1]);for(const [address,draw] of a)if(b.has(address)){expect(b.get(address)).toEqual(draw);shared++;}}
  console.info('M3 unit '+(calibrated?'1/10':'1')+' seed '+seed+': '+JSON.stringify(cells.map(h=>h.map(choice)))+'; exact U/reason interaction and causal joins');
 }
 // In the candidate, low-body is Auto and high-body rolls: no fictitious draws.
 expect(shared).toBe(calibrated?0:18);console.info('M3 unit '+(calibrated?'1/10':'1')+' group '+seeds+': changed choices='+changed+', identical shared-address draws='+shared);return {changed,allDraws};
}
describe('M3 B: one learned-history x body interaction',()=>{
 it('fixed unit1 control and unit1/10 candidate, same matrix seeds0..7',async()=>{
  const control=await matrix([0,1,2,3,4,5,6,7],false),candidate=await matrix([0,1,2,3,4,5,6,7],true);
  expect(control.changed).toBe(0);expect(candidate.changed).toBeGreaterThan(0);let shared=0;
  for(const [cell,a] of control.allDraws){const b=candidate.allDraws.get(cell)!;for(const [address,draw] of a)if(b.has(address)){expect(b.get(address)).toEqual(draw);shared++;}
   for(const [address,draw] of b){const purpose=textOf(f(rec(f(rec(draw,411n),1n),110n),2n));if(purpose==='purpose/task-reason-face'){expect(a.has(address)).toBe(true);expect(a.get(address)).toEqual(draw);}}}
  expect(shared).toBeGreaterThanOrEqual(16);console.info('M3 cross-calibration exact shared-address records='+shared);
 },480000);
 it('binds the declared calibration to model identity and rejects other units or versions',async()=>{
  const control=interactionSource(true,true,false),candidate=interactionSource(),a=await prepareCharacterModel(control),b=await prepareCharacterModel(candidate);
  expect(characterModelIdentity(a)).not.toEqual(characterModelIdentity(b));
  await expect(prepareCharacterModel({...control,rulesVersion:CALIBRATED_RULES,registrySchemaVersion:CALIBRATED_REGISTRY})).rejects.toThrow('context unit');
  await expect(prepareCharacterModel({...candidate,registrySchemaVersion:INTERACTION_REGISTRY})).rejects.toThrow('version bundle');
  for(const [field,value] of [[4n,r(439,[rational(1,5),{kind:'unsigned',value:3n}])],[3n,r(439,[rational(1,10),{kind:'unsigned',value:3n}])],[4n,r(439,[rational(1,10),{kind:'unsigned',value:4n}])]] as const)await expect(prepareCharacterModel(changeDefinition(candidate,'definition/task-reason-dice',field,value))).rejects.toThrow();
  await expect(prepareCharacterModel({...candidate,rulesVersion:control.rulesVersion,registrySchemaVersion:control.registrySchemaVersion})).rejects.toThrow('topology');
  const d=interactionData(0,0),run=await createCharacterRun(b,d);await run.settleNextInstant();
  await expect(restoreCharacterRun(control,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:run.save()})).rejects.toThrow('commitments differ');
 });
 it('exact repeat and restore after learning before the later body condition in all four cells',async()=>{
  const source=interactionSource(),model=await prepareCharacterModel(source);
  for(const history of [0,1] as const)for(const body of [0,1] as const){const d=interactionData(history,body),a=await createCharacterRun(model,d),b=await createCharacterRun(model,d);await a.settleNextInstant();await b.settleNextInstant();expect(a.snapshot().clock).toBe(1n);exactRuns(a,b);
   const restored=await restoreCharacterRun(source,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exactRuns(a,restored);let steps=0;
   for(;;){const more=await a.settleNextInstant();for(const p of [b,restored]){expect(await p.settleNextInstant()).toBe(more);exactRuns(a,p);}if(!more)break;expect(++steps).toBeLessThan(32);}expect(a.snapshot().clock).toBe(10n);
   console.info('M3 continuation cell '+history+'/'+body+': '+JSON.stringify(items(f(outputs(a.snapshot().outputs,408n)[0],3n),'list').map(v=>{const n=rec(v,407n),roles=rec(f(n,2n),406n);return {task:textOf(f(rec(f(n,1n),404n),3n)),rawBounded:String(exact(f(roles,3n)).numerator)+'/'+String(exact(f(roles,3n)).denominator),situationModifier:String((f(n,6n) as {value:bigint}).value),die:String(uint(f(n,4n)))};})));
  }
 },480000);
 it('hidden body truth with identical evidence leaves every cognitive output and draw equal',async()=>{
  const model=await prepareCharacterModel(interactionSource());for(const history of [0,1] as const){const a=await createCharacterRun(model,interactionData(history,0,0,10)),b=await createCharacterRun(model,interactionData(history,0,0,11));await finish(a);await finish(b);
   expect(a.runIdentity()).not.toEqual(b.runIdentity());expect(a.snapshot().state).not.toEqual(b.snapshot().state);
   const safe=(run:Run)=>enc(list(items(decode(run.snapshot().outputs),'list').filter(v=>!(typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===479n))));expect(safe(a)).toEqual(safe(b));expect([...draws(a)]).toEqual([...draws(b)]);
  }
 },180000);
 it('without acquired history, body evidence cannot manufacture a forecast or a situational reason',async()=>{
  const d=interactionData(0,0);d.orderedInputs=enc(list(items(decode(d.orderedInputs),'list').filter(row=>(items(row,'list')[0] as {value:bigint}).value!==1n)));
  const run=await createCharacterRun(await prepareCharacterModel(interactionSource()),d);await finish(run);for(const row of values(run).values())expect(row).toHaveLength(2);for(const value of situation(run).values())expect(value.equals(Q.of(0n))).toBe(true);
 },90000);
});
