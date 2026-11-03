import {it,expect} from 'vitest';
import {list,text,signed,unsigned,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {DELIVERY_REWARD,DELIVERY_REWARD_VERSION,deliveredReward,HABIT_OBS,HABIT_OPTIONS,habitPath,habitJournal,rewardValue} from '../assembled/habit';
import {ACTION_BODY,ACTION_BODY_EVENT} from '../assembled/actionBody';
import {BODY_DELIVERY} from '../assembled/body';
import {STRATEGY_EVAL} from '../assembled/strategy';
import {receivingRecord as rec,randomDrawRecord} from '../assembled/codecs';
import {embodiedRecord} from '../campaign3/embodiedCodecs';
import {readQ} from '../campaign2/cognitiveMath';
import {dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
import {source,data,tasks,target,decode,items,key,enc} from './fixtures/assembledDeliveryReward';
import {mapIdentities} from './fixtures/assembledValueReceiving';
import {outputs,through,signedValue,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
import {workLimit} from './fixtures/assembledCharacter';
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const traces=(r:Run)=>outputs(r.snapshot().trace,160n),event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n);
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const journal=(r:Run)=>habitJournal(state(r).read(habitPath(C)).value);
const exact=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
const diagnostic=(value:unknown)=>JSON.stringify(value,(_key,v)=>typeof v==='bigint'?String(v):v instanceof Map?[...v]:v instanceof Uint8Array?[...v]:v);
const habit=(r:Run)=>reports(r,HABIT_OPTIONS).find(a=>uint(a[1])===7n)!;
const decision=(r:Run)=>outputs(r.snapshot().outputs,409n).find(v=>signedValue(f(v,2n))===7n)!;
function selected(r:Run){const status=rec(f(decision(r),4n),419n);expect(uint(f(status,1n)),'live decision').toBe(3n);return rec(f(status,2n),420n);}
function probability(r:Run){const row=items(f(selected(r),2n),'list').map(v=>rec(v,421n)).find(v=>key(f(rec(f(v,1n),395n),2n))===key(target));return row?readQ(f(row,2n)):Q.of(0n);}
const plans=(r:Run)=>items(reports(r,STRATEGY_EVAL).find(a=>uint(a[2])===7n)![3],'list').map(v=>items(v,'list'));
function live(r:Run,history:boolean){const h=habit(r);expect(h,'live habit evaluation at7').toBeDefined();expect(items(items(h[2],'list')[3],'list'),'visible cue').toEqual([true]);expect(rewardValue(h[4]),'live corrected expectation').toMatchObject({positive:false,at:6n});expect(habitJournal(key(h[7])===key(list([]))?undefined:h[7])).toHaveLength(history?1:0);const ps=plans(r);expect(ps).toHaveLength(3);for(const t of tasks()){const p=ps.find(a=>key(a[0])===key(t))!;expect(p,'live task plan').toBeDefined();expect(p[1],'retained B').toEqual(unsigned(1));expect(items(items(p[2],'list')[0],'list')[0],'A known available').toEqual(text('KnownAvailable'));}selected(r);}
const draws=(r:Run)=>traces(r).flatMap(t=>items(f(t,14n),'list')).map(randomDrawRecord);
function coupled(a:Run,b:Run){const right=new Map(draws(b).map(v=>[key(f(v,2n)),v]));let n=0;for(const x of draws(a)){const y=right.get(key(f(x,2n)));if(y){for(const k of [2n,3n,4n,7n])expect(f(y,k)).toEqual(f(x,k));n++;}}console.info('M40 dice '+diagnostic({a:draws(a).length,b:draws(b).length,matched:n,modes:[a,b].map(r=>outputs(r.snapshot().outputs,409n).map(v=>uint(f(rec(f(rec(f(v,4n),419n),2n),420n),8n))))}));return n;}
async function mapped(amount:number,hidden=false){const m=await prepareCharacterModel(source(amount)),setup=await createCharacterRun(m,data(hidden));await through(setup,7n);const r=await createCharacterRun(m,data(hidden,mapIdentities(setup)));await through(r,7n);return r;}
function report(r:Run){return {effects:reports(r,DELIVERY_REWARD),observations:reports(r,HABIT_OBS),habit7:habit(r),plans7:plans(r),decision7:decision(r)};}
// Three physical tasks; reserve10, body channel absent equally, cue/reward/route live.
it('connection: actual gain becomes retained habit and a later feasible action',async()=>{
 const a=await mapped(40),b=await mapped(0);console.info('M40 primary '+diagnostic([a,b].map(report)));
 live(a,true);live(b,true);coupled(a,b);
 for(const [r,positive] of [[a,true],[b,false]] as const){expect(reports(r,DELIVERY_REWARD)[0][3]).toBe(positive);expect(reports(r,HABIT_OBS)[0][5]).toBe(positive);expect(habit(r)[3]).toEqual(positive?q(1,2):q(0,1));expect(items(habit(r)[6],'list')).toHaveLength(positive?3:0);expect(habit(r)[5]).toBe(positive);expect(outputs(r.snapshot().outputs,461n)).toHaveLength(0);
  const effect=traces(r).find(t=>key(f(event(t),5n))===key(ACTION_BODY_EVENT)&&signedValue(f(event(t),2n))===3n&&key(f(t,6n))===key(text(DELIVERY_REWARD_VERSION)))!;expect(effect).toBeDefined();expect(items(f(effect,12n),'list')[1]).toEqual(list(reports(r,ACTION_BODY)[0]));expect(items(f(effect,13n),'list')[0]).toEqual(list(reports(r,DELIVERY_REWARD)[0]));
 }
 expect(probability(a).compare(Q.of(0n))).toBeGreaterThan(0);expect(probability(b).equals(Q.of(0n))).toBe(true);console.info('M40 PASS: applied gain -> observed reward -> retained habit -> feasible A; probabilities '+diagnostic([probability(a),probability(b)])+'. No isolated stochastic choice claim.');
},540000);
// Same physical declarations; all performed reward reports hidden, correction6 visible.
it('hidden: physical benefit alone cannot change habit or cognition',async()=>{
 const a=await mapped(40,true),b=await mapped(0,true);console.info('M40 hidden '+diagnostic([a,b].map(report)));live(a,false);live(b,false);
 expect(reports(a,DELIVERY_REWARD)[0][3]).toBe(true);expect(reports(b,DELIVERY_REWARD)[0][3]).toBe(false);for(const r of [a,b]){expect(journal(r)).toHaveLength(0);expect(habit(r)[3]).toEqual(q(0,1));expect(habit(r)[5]).toBe(false);expect(probability(r).equals(Q.of(0n))).toBe(true);}
 expect(habit(a)).toEqual(habit(b));expect(outputs(a.snapshot().outputs,409n)).toEqual(outputs(b.snapshot().outputs,409n));expect(coupled(a,b)).toBe(draws(a).length);expect(draws(a)).toHaveLength(draws(b).length);console.info('M40 hidden truth PASS (automatic decisions need no dice)');
},480000);
// Same scenario. Negative report misrepresents real gain; queued/blocked cannot earn it.
it('evidence: false report, queued, blocked and legacy feedback remain distinct',async()=>{
 for(const mode of ['false','queued','blocked','legacy'] as const){const s=source(mode==='legacy'?0:40,mode==='queued'?2:0,mode!=='blocked',mode==='legacy'),r=await createCharacterRun(await prepareCharacterModel(s),data(false,undefined,mode==='false'?2:0));await through(r,3n);const h=journal(r);console.info('M40 control '+mode+' '+diagnostic({effects:reports(r,DELIVERY_REWARD),body:reports(r,ACTION_BODY),observations:reports(r,HABIT_OBS),journal:h}));
  if(mode==='queued'||mode==='blocked'){expect(h).toHaveLength(0);expect(reports(r,DELIVERY_REWARD)).toHaveLength(0);expect(reports(r,HABIT_OBS)).toHaveLength(0);expect(reports(r,ACTION_BODY)[0][5]).toEqual(text(mode==='queued'?'Queued':'Blocked'));if(mode==='queued'){await through(r,5n);expect(journal(r)).toHaveLength(0);expect(reports(r,DELIVERY_REWARD)).toHaveLength(0);console.info('M40 queued receipt5 supplies no unsupported past-cue credit');}}
  else {expect(h).toHaveLength(1);expect(items(h[0],'list')[5]).toBe(mode==='legacy');if(mode==='false')expect(reports(r,DELIVERY_REWARD)[0][3]).toBe(true);else {expect(reports(r,DELIVERY_REWARD)).toHaveLength(0);expect(f(rec(reports(r,ACTION_BODY)[0][6],479n),3n)).toEqual(q(0,1));}}
 }
},300000);
// Learned history and physical adaptation share one save and one continuation.
it('persistence: repeat3 and restore3 through terminal10 are byte-identical',async()=>{
 const s=source(),d=data(),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,3n);await through(b,3n);exact(a,b);expect(journal(a)).toHaveLength(1);const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);while(a.snapshot().clock<10n){expect(await a.settleNextInstant()).toBe(await restored.settleNextInstant());exact(a,restored);}expect(await a.settleNextInstant()).toBe(false);expect(await restored.settleNextInstant()).toBe(false);exact(a,restored);console.info('M40 exact repeat3/restore3..10 PASS');
},300000);
// Late instant3 failure must roll back body, reward, habit and all other shared owners.
it('rollback: late work ceiling cannot leave partial physical or learned history',async()=>{
 const s=source(),d=data(),fault={...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),...Array.from({length:16},()=>list([signed(3),unsigned(110),BODY_DELIVERY,list([C,q(0,1)]),list([])]))]))},oracle=await createCharacterRun(await prepareCharacterModel(s),fault);await through(oracle,3n);const counts=new Map<bigint,Set<string>>();for(const t of traces(oracle)){const e=event(t),at=signedValue(f(e,2n)),ids=counts.get(at)??new Set<string>();ids.add(key(f(e,1n)));counts.set(at,ids);}const n=counts.get(3n)!.size;expect(Math.max(...[...counts].filter(([t])=>t<3n).map(([,x])=>x.size))).toBeLessThan(n);expect(reports(oracle,DELIVERY_REWARD)).toHaveLength(1);expect(journal(oracle)).toHaveLength(1);const failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(n-1))),fault);const prior=[...counts.keys()].filter(t=>t<3n).reduce((a,b)=>a>b?a:b,0n);await through(failed,prior);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow('work ceiling');expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(journal(failed)).toHaveLength(0);console.info('M40 atomic rollback PASS '+(n-1)+'/'+n);
},180000);
it('admission: explicit version and actual applied gain, including saturation',async()=>{
 for(const [before,potential,applied,overflow,after,positive] of [[10,40,40,0,50,true],[100,40,0,40,100,false],[10,0,0,0,10,false]] as const)expect(deliveredReward(embodiedRecord(479,[before,potential,applied,overflow,after].map(n=>q(n,1))))).toBe(positive);
 const s=source(),slots=items(decode(s.registry),'list'),old=source(40,0,true,true);for(const declaration of [list([]),list([text('other')]),list([text(DELIVERY_REWARD),true])])await expect(prepareCharacterModel({...s,registry:enc(list([...slots.slice(0,27),declaration]))})).rejects.toThrow();for(const mismatch of [{...s,registry:old.registry},{...old,registry:s.registry}])await expect(prepareCharacterModel(mismatch)).rejects.toThrow();expect(()=>deliveredReward(embodiedRecord(479,[10,40,-1,41,9].map(n=>q(n,1))))).toThrow();console.info('M40 declaration/version/actual-vs-potential/saturation PASS');
});
