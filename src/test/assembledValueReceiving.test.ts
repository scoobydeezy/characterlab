import {createAssembledRandomSession} from '../assembled/random';
import {receivingRecord as rec} from '../assembled/codecs';
import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {jointValue,valueMotive,valueRaw,valueReasons,VALUE_MOTIVE,VALUE_RECEIVING} from '../assembled/valueReceiving';
import {VALUES_APPRAISAL,VALUES_CONTEXT,valuesPath,valuesState} from '../assembled/values';
import {compileAssembledReasons} from '../assembled/reasons';
import {cognitiveRecord as r,randomDrawRecord} from '../assembled/codecs';
import {createValuesOwner} from '../campaign3/valuesComponent';
import {receiveValues} from '../campaign3/valuesReceiving';
import {readQ,qValue} from '../campaign2/cognitiveMath';
import {list,set,text,unsigned,signed,rational as q,record,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
import {PRACTICE_SETTING,SKILL_ACTUAL,sid} from '../assembled/skill';
import {BODY_DELIVERY} from '../assembled/body';
import {source,data,mapIdentities,decode,items,key,enc} from './fixtures/assembledValueReceiving';
import {source as oldSource} from './fixtures/assembledValues';
import {outputs,through,finish,signedValue,type Run} from './fixtures/assembledComparison';
import {workLimit,replace} from './fixtures/assembledCharacter';
import {C} from './fixtures/campaign2Cognitive';
const sidOrdinal=(ns:number,n:number)=>typedIdentifier(ns,unsigned(n));
const exact=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
const reports=(run:Run,label:string)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const atDecision=(run:Run,at=5n)=>outputs(run.snapshot().outputs,409n).find(v=>signedValue(f(v,2n))===at)!;
const nuclei=(decision:CanonicalValue)=>items(f(rec(f(rec(decision,409n),3n),408n),3n),'list');
const isValue=(n:CanonicalValue)=>rec(f(rec(n,407n),1n),404n).schema.schemaVersion===2n;
const choice=(d:CanonicalValue)=>f(rec(f(rec(f(rec(d,409n),4n),419n),2n),420n),1n);
const draws=(run:Run,at=5n)=>outputs(run.snapshot().trace,160n).filter(v=>signedValue(f(rec(f(v,4n),130n),2n))===at).flatMap(v=>items(f(v,14n),'list')).map(randomDrawRecord);
const dice=r(437,[r(438,[q(1,10),q(1,5),q(3,5),q(4,5),q(9,10)]),q(0,1),r(439,[q(1,1),unsigned(3)]),r(439,[q(1,1),unsigned(3)])]);
it('math: original receiver modes, separate grounds and closed successor codec',async()=>{
 let cases=0;
 for(const sign of [-1,0,1] as const)for(const linked of [false,true])for(const currentNeed of [0,1] as const)for(const mode of ['NeedOnly','ValuesOnly','Joint'] as const){
  const owner=createValuesOwner('Accumulated');owner.admit({id:1,instant:1,target:'A',category:'Care',outcome:sign});const old=await receiveValues(owner,{instant:2,seed:0,currentNeed,goal:1,linked,mode}),v=linked?Q.of(BigInt(sign),2n):Q.of(0n),effective=jointValue(v,v.multiply(Q.of(BigInt(currentNeed))),mode);expect(old.contribution).toBe(effective.numerator+'/'+effective.denominator);
  const context=rec(old.reason,408n),raw=rec(f(context,2n),403n),sources=items(f(raw,3n),'set'),valueSource=sources.find(s=>readQ(f(rec(s,402n),2n)).equals(effective)&&key(f(rec(f(rec(s,402n),1n),401n),1n))===key(f(rec(f(rec(sources[0],402n),1n),401n),1n)))??sources[0];
  // Original canonical sources are sorted by their option identities, A then B.
  const first=sources[0],second=sources[1];expect(readQ(f(rec(first,402n),2n))).toEqual(effective);
  const successor=r(403,[f(raw,1n),f(raw,2n),set([second]),f(raw,4n),set([first])],2),ns=valueReasons(successor,dice,2),original=items(f(context,3n),'list');
  const relabeled=ns.map(n=>{const x=rec(n,407n),nk=rec(f(x,1n),404n);return isValue(n)?r(407,[r(404,[f(nk,1n),sid(1040,'Commitment'),f(nk,3n),f(nk,4n)]),...Array.from({length:6},(_,i)=>f(x,BigInt(i+2)))]):n;});expect(key(set(relabeled))).toEqual(key(set(original)));expect(ns.filter(isValue).length).toBe(sign&&linked&&(mode!=='NeedOnly'||currentNeed)?1:0);cases++;
 }
 expect(jointValue(Q.of(1n,4n),Q.of(1n,2n))).toEqual(Q.of(1n,2n));expect(jointValue(Q.of(-1n,4n),Q.of(-1n,4n))).toEqual(Q.of(-1n,4n));expect(()=>jointValue(Q.of(1n),Q.of(-1n))).toThrow('aligned');
 const owner=createValuesOwner('Accumulated');owner.admit({id:1,instant:1,target:'A',category:'Care',outcome:1});const old=await receiveValues(owner,{instant:2,seed:0,currentNeed:0,goal:1,linked:true,mode:'Joint'}),raw=rec(f(rec(old.reason,408n),2n),403n),sourceSignal=items(f(raw,3n),'set')[0],ns=valueReasons(r(403,[f(raw,1n),f(raw,2n),f(raw,3n),f(raw,4n),set([sourceSignal])],2),dice,2),value=rec(f(rec(ns.find(isValue)!,407n),1n),404n);
 expect(()=>r(404,[f(value,1n),sid(1040,'Value'),f(value,3n),f(value,4n)])).toThrow();expect(()=>r(404,[f(value,1n),sid(1040,'Commitment'),f(value,3n),f(value,4n)],2)).toThrow('Value');
 const badSource=replace(sourceSignal,1n,replace(f(rec(sourceSignal,402n),1n),3n,unsigned(2)));expect(()=>r(403,[f(raw,1n),f(raw,2n),f(raw,3n),f(raw,4n),set([badSource])],2)).toThrow('base');
 const newer=r(403,[f(raw,1n),f(raw,2n),f(raw,3n),f(raw,4n),set([sourceSignal])],2),older=await compileCharacterModel(oldSource());expect(()=>older.content.validateRecordRoles(enc(newer))).toThrow('successor');expect(decode(enc(newer))).toEqual(newer);expect(valueReasons(newer,replace(dice,2n,q(37,100)),2).filter(isValue)).toHaveLength(1);expect(()=>decode(enc(record(rec(newer,403n).schema,new Map([...rec(newer,403n).fields].filter(([n])=>n!==5n)))))).toThrow();
 const random=createAssembledRandomSession(new Uint8Array(32),undefined,2,true),reasonContext=r(408,[f(rec(old.reason,408n),1n),newer,list(valueReasons(newer,dice,2))]),all=valueReasons(newer,dice,2);random.begin();const capability=random.forResolution(sidOrdinal(1135,99),reasonContext),valueDraw=await capability.reason(all.find(isValue)!),goalDraw=await capability.reason(all.find(n=>!isValue(n)&&key(f(rec(f(rec(n,407n),1n),404n),1n))===key(f(value,1n)))!);expect(f(randomDrawRecord(valueDraw),1n)).not.toEqual(f(randomDrawRecord(goalDraw),1n));await expect(capability.reason(all.find(isValue)!)).rejects.toThrow('repeated');random.prepareCommit();random.commit();random.close();expect(random.committedAddressKeys()).toHaveLength(2);
 console.info('M34 original receiver '+cases+' cases, numeric tie/aligned domain, separate motive and old-model/version/role guards PASS');
},120000);
it('positive: acquired Values enter actual later reasons and choices with explicit coupling',async()=>{
 const m=await prepareCharacterModel(source()),maps=[];for(const linked of [true,false]){const setup=await createCharacterRun(m,data(linked));await through(setup,5n);maps.push(mapIdentities(setup));}let changed=0,common=0;
 for(let seed=0;seed<8;seed++){
  const a=await createCharacterRun(m,data(true,seed,maps[0])),b=await createCharacterRun(m,data(false,seed,maps[1]));await through(a,3n);await through(b,3n);expect(nuclei(atDecision(a,3n)).filter(isValue)).toEqual([]);expect(nuclei(atDecision(b,3n)).filter(isValue)).toEqual([]);await through(a,5n);await through(b,5n);
  const aa=atDecision(a),bb=atDecision(b),an=nuclei(aa),bn=nuclei(bb);expect(an.filter(isValue)).toHaveLength(1);expect(bn.filter(isValue)).toHaveLength(0);expect(an.filter(n=>!isValue(n))).toEqual(bn);expect(reports(a,VALUE_MOTIVE)[1][6]).toEqual(q(1,2));expect(reports(b,VALUE_MOTIVE)[1][6]).toEqual(q(0,1));
  const ac=rec(f(rec(f(aa,4n),419n),2n),420n),bc=rec(f(rec(f(bb,4n),419n),2n),420n);expect(f(ac,2n)).not.toEqual(f(bc,2n));if(key(choice(aa))!==key(choice(bb)))changed++;
  const right=new Map(draws(b).map(v=>[key(f(v,2n)),v]));let shared=0;for(const draw of [...draws(a),...draws(b)])expect(rec(f(draw,2n),113n).schema.typeId).toBe(113n);for(const x of draws(a)){const y=right.get(key(f(x,2n)));if(y){for(const field of [2n,3n,4n,7n])expect(f(x,field)).toEqual(f(y,field));shared++;}}common+=shared;
  const trace=outputs(a.snapshot().trace,160n).filter(v=>key(f(v,6n))===key(text(VALUE_RECEIVING))&&signedValue(f(rec(f(v,4n),130n),2n))===5n);expect(trace).toHaveLength(2);expect(outputs(a.snapshot().outputs,425n).some(v=>key(f(v,2n))===key(aa))).toBe(true);expect(outputs(a.snapshot().outputs,433n)).toHaveLength(2);
  console.info('M34 seed '+seed+' modes '+uint(f(ac,8n))+'/'+uint(f(bc,8n))+' draws '+draws(a).length+'/'+draws(b).length+' shared '+shared+' changed '+(key(choice(aa))!==key(choice(bb))));
 }
 expect(changed).toBeGreaterThan(0);console.info('M34 eight pairs changed='+changed+' actual shared draws='+common+'; Auto omissions are not shared draws');
},540000);
it('privacy: fixed reports, missing evidence and actual route gates',async()=>{
 const s=source(),m=await prepareCharacterModel(s),config=(await compileCharacterModel(s)).values!,base=data(),easy={...base,orderedInputs:enc(list(items(decode(base.orderedInputs),'list').map(v=>{const x=[...items(v,'list')];if(key(x[0])===key(signed(3))&&key(x[2])===key(PRACTICE_SETTING)){const p=[...items(x[3],'list')];p[3]=q(0,1);x[3]=list(p);}return list(x);})))},a=await createCharacterRun(m,easy),b=await createCharacterRun(m,base),missing=await createCharacterRun(m,data(true,0,undefined,{missingA:true}));
 for(const run of [a,b,missing])await through(run,5n);expect(reports(a,SKILL_ACTUAL)[0][7]).toBe(true);expect(reports(b,SKILL_ACTUAL)[0][7]).toBe(false);expect(reports(a,VALUE_MOTIVE)).toEqual(reports(b,VALUE_MOTIVE));expect(nuclei(atDecision(a))).toEqual(nuclei(atDecision(b)));expect(nuclei(atDecision(missing)).filter(isValue)).toHaveLength(0);
 const raw=rec(f(rec(f(atDecision(a),3n),408n),2n),403n),motive=list(reports(a,VALUE_MOTIVE)[1]),original=r(403,[f(raw,1n),f(raw,2n),f(raw,3n),f(raw,4n)]),none=r(403,[f(raw,1n),replace(f(raw,2n),3n,list([])),f(raw,3n),f(raw,4n)]);expect(items(f(rec(valueRaw(none,motive),403n),5n),'set')).toEqual([]);
 const wrong=items(motive,'list').map((v,i)=>i===2?sid(1027,'definition/unavailable'):v);expect(items(f(rec(valueRaw(original,list(wrong)),403n),5n),'set')).toEqual([]);expect(f(rec(valueRaw(original,motive),403n),3n)).toEqual(f(raw,3n));expect(f(rec(valueRaw(original,motive),403n),4n)).toEqual(f(raw,4n));
 const noGoals=r(403,[f(raw,1n),f(raw,2n),set([]),f(raw,4n),f(raw,5n)],2);expect(valueReasons(noGoals,dice)).toHaveLength(1);expect(isValue(valueReasons(noGoals,dice)[0])).toBe(true);
 const states=[a,b].map(run=>valuesState(restoreAuthoritativeState(decode(run.snapshot().state)).read(valuesPath(C)).value,config));expect(states[0]).toEqual(states[1]);console.info('M34 hidden physical truth, missing report, no/foreign candidate, no-goal Value and untouched goal meaning PASS');
},240000);
it('persistence: exact repeat3 and restore3 through10',async()=>{
 const s=source(),d=data(),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,3n);await through(b,3n);exact(a,b);const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);while(a.snapshot().clock<10n){expect(await a.settleNextInstant()).toBe(await restored.settleNextInstant());exact(a,restored);}expect(await a.settleNextInstant()).toBe(false);expect(await restored.settleNextInstant()).toBe(false);exact(a,restored);console.info('M34 repeat3/restore3 every remaining state/output/trace/save PASS');
},300000);
it('rollback: late failure preserves the whole prior character and draw ledger',async()=>{
 const s=source(),d=data(),fault={...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),...Array.from({length:16},()=>list([signed(5),unsigned(110),BODY_DELIVERY,list([C,q(0,1)]),list([])]))]))},m=await prepareCharacterModel(s),oracle=await createCharacterRun(m,fault);await through(oracle,5n);const counts=new Map<bigint,Set<string>>();for(const t of outputs(oracle.snapshot().trace,160n)){const e=rec(f(t,4n),130n),at=signedValue(f(e,2n)),ids=counts.get(at)??new Set<string>();ids.add(key(f(e,1n)));counts.set(at,ids);}const n=counts.get(5n)!.size;expect(Math.max(...[...counts].filter(([t])=>t<5n).map(([,x])=>x.size))).toBeLessThan(n);const failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(n-1))),fault);await through(failed,4n);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow('work ceiling');expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(draws(failed)).toEqual([]);console.info('M34 late5 atomic rollback '+n+' events cap'+(n-1));
},180000);

it('no-choice: retained failed fixture settles without fabricated learning',async()=>{
 const s=source(),d=data(true,0,undefined,{},q(1,2)),m=await prepareCharacterModel(s),run=await createCharacterRun(m,d);await through(run,3n);expect(uint(f(rec(f(atDecision(run,3n),4n),419n),1n))).toBe(2n);expect(outputs(run.snapshot().outputs,426n)).toHaveLength(0);expect(restoreAuthoritativeState(decode(run.snapshot().state)).read(valuesPath(C)).presence).toBe(false);const resumed=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:run.save()});exact(run,resumed);while(run.snapshot().clock<10n){expect(await run.settleNextInstant()).toBe(await resumed.settleNextInstant());exact(run,resumed);}expect(outputs(run.snapshot().outputs,426n)).toHaveLength(0);console.info('M34 retained importance1/2 NoReasons settles/replays with no fabricated expression, qualification or Value acquisition');
},240000);
