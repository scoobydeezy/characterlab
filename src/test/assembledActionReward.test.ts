import {it,expect} from 'vitest';
import {start,fixture,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,at,type CanonicalValue,type Options} from './fixtures/assembledActionReward';
import {habitPath,rewardPath,habitJournal,rewardValue} from '../assembled/habit';
import {actionRewardSubject} from '../assembled/actionReward';
import {ACTION_REWARD,compileReward,rewardSource} from '../assembled/rewardExperience';
import {ACTION_BODY} from '../assembled/actionBody';
import {readQ} from '../campaign2/cognitiveMath';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {createCharacterRun,restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {createSubstitutionRun} from '../campaign3/dependenceSubstitutes';
import {substitutionCases} from './substitutionFixtures';
// @ts-expect-error Node-only receipt.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Node-only receipt.
import {createHash} from 'node:crypto';
type X=Awaited<ReturnType<typeof start>>;
const file='docs/planning/ASSEMBLED_CHARACTER_M225_EVIDENCE.json';
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const exact=(a:X['run'],b:X['run'])=>{const {state:as,outputs:ao,trace:at,...am}=a.snapshot(),{state:bs,outputs:bo,trace:bt,...bm}=b.snapshot();expect(bm).toEqual(am);bytes(as,bs);bytes(ao,bo);bytes(at,bt);bytes(a.save(),b.save());};
const fraction=(v:CanonicalValue)=>{const x=readQ(v);return x.numerator+'/'+x.denominator;};
const tag=(v:CanonicalValue,name:string)=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length>0&&key(v.items[0])===key(text(name));
const put=(name:string,value:any)=>{const d=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};expect(d[name]).toBeUndefined();d[name]=value;writeFileSync(file,JSON.stringify(d,null,2)+'\n');};
function capture(x:X,t:number,live=true){
 const os=items(decode(x.run.snapshot().outputs),'list'),candidate=os.find(v=>tag(v,'assembled-action-reward/candidates')&&uint(items(v,'list')[1])===BigInt(t));expect(candidate,'live candidate receiving').toBeDefined();
 const c=items(candidate!,'list');if(live)expect(readQ(c[2]).numerator,'live common motive').toBeGreaterThan(0n);
 const d=rec(os.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===409n&&at(f(v,2n))===BigInt(t))!,409n),ctx=rec(f(d,3n),408n),raw=rec(f(ctx,2n),403n),status=rec(f(d,4n),419n),chosen=uint(f(status,1n))===3n?rec(f(status,2n),420n):undefined;
 const action=(a:CanonicalValue)=>x.b.actions.findIndex(b=>key(a)===key(b));
 const receipt=os.filter(v=>tag(v,ACTION_REWARD+'/receipt')&&at(items(v,'list')[2])===BigInt(t)&&items(v,'list').length===9).map(v=>items(v,'list'));
 const effects=os.filter(v=>tag(v,ACTION_BODY)).map(v=>items(v,'list')).filter(a=>{const out=os.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===433n&&key(f(v,1n))===key(a[1]));if(!out)return false;const attempt=rec(f(rec(out,433n),2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n);return at(f(rec(f(intent,2n),409n),2n))===BigInt(t);});
 if(chosen){expect(items(f(ctx,3n),'list').length,'actual compiled reasons').toBeGreaterThan(0);expect(effects,'selected action reaches execution').toHaveLength(1);}
 return {at:t,motive:fraction(c[2]),beliefs:items(c[4],'list').map(v=>{const a=items(v,'list'),b=items(a[1],'list').length?rewardValue(a[1],1000000n,'observed'):undefined;return b?.mean===undefined?null:String(b.mean);}),admitted:items(c[4],'list').map(v=>items(v,'list')[6]),chosen:chosen?action(f(rec(f(chosen,1n),395n),2n)):-1,status:Number(uint(f(status,1n))),probabilities:chosen?items(f(chosen,2n),'list').map(v=>fraction(f(rec(v,421n),2n))):[],raw:hash(enc(raw)),receipts:receipt.map(a=>({gain:items(a[6],'list').map(v=>String(uint(v))),action:items(a[8],'list').map(action)})),effects:effects.map(a=>({action:action(a[3]),status:(a[5] as {value:string}).value}))};
}
async function finish(x:X){for(let n=0;await x.run.settleNextInstant();n++)expect(n).toBeLessThan(48);expect(x.run.snapshot().clock).toBe(101n);}
function learned(x:X){const state=restoreAuthoritativeState(decode(x.run.snapshot().state));return x.b.actions.map(action=>{const k=actionRewardSubject(C,action),h=habitJournal(state.read(habitPath(k)).value,1000000n,'observed'),b=rewardValue(state.read(rewardPath(k)).value,1000000n,'observed');return {count:h.length,mean:b?.mean===undefined?null:String(b.mean)};});}
it('reward225 primary acquired alternatives change ordinary execution',async()=>{
 const result:any={};
 for(const diverse of [false,true]){
  const x=await start({diverse});await through(x.run,7n);const history=learned(x),training=[4,5,6,7].map(t=>capture(x,t));console.info('M225 TRAINING',diverse,JSON.stringify({history,training}));
  expect(history.map(h=>h.count)).toEqual(diverse?[2,2]:[4,0]);expect(training.map(r=>r.chosen)).toEqual(diverse?[0,1,0,1]:[0,0,0,0]);expect(training.flatMap(r=>r.receipts.map(r=>r.gain))).toEqual(Array.from({length:4},()=>['1000']));
  await through(x.run,11n);const probes=[9,10,11].map(t=>capture(x,t));expect(probes.map(r=>r.chosen)).toEqual(diverse?[1,1,1]:[-1,-1,-1]);for(const p of probes){expect(p.admitted).toEqual([false,diverse]);expect(p.beliefs[1]).toBe(diverse?'1000':null);expect(p.probabilities).toEqual(diverse?['1/1']:[]);if(diverse){expect(p.receipts).toEqual([{gain:['1000'],action:[1]}]);expect(p.effects).toEqual([{action:1,status:'Applied'}]);}}
  const original=createSubstitutionRun('MeanHistory',substitutionCases()[diverse?'diversified':'concentrated'],0);while(await original.step()){};expect(original.snapshot().rows.slice(5).map(r=>r.intent)).toEqual(probes.map(r=>r.chosen));
  await finish(x);result[diverse?'diverse':'concentrated']={history,training,probes,original:original.snapshot().rows.map(r=>({at:r.at,belief:r.beliefBefore,admitted:r.admitted,chosen:r.intent})),initial:hash(x.b.d.initialState),inputs:hash(x.b.d.orderedInputs),registry:hash(x.b.s.registry),terminal:hash(x.run.save())};
 }
 expect(result.diverse.initial).toBe(result.concentrated.initial);expect(result.diverse.registry).toBe(result.concentrated.registry);
 put('primary',result);console.info('M225 PRIMARY PASS same model/S0; acquired B -> actual B on all three probes');
},590000);
for(const control of ['denied','withheld','noDemand','unavailable'] as const)it('reward225 control '+control,async()=>{
 const options:Options=control==='denied'?{permitted:false}:control==='withheld'?{learn:false}:control==='noDemand'?{demand:false}:{available:false};
 const x=await start(options);await through(x.run,7n);const history=learned(x),training=[4,5,6,7].map(t=>capture(x,t));if(control==='withheld')expect(training.flatMap(r=>r.receipts.map(r=>r.gain))).toEqual(Array.from({length:4},()=>['1000']));if(control==='denied')expect(training.flatMap(r=>r.receipts.map(r=>r.gain))).toEqual(Array.from({length:4},()=>[]));expect(history.map(h=>h.count)).toEqual(control==='denied'||control==='withheld'?[0,0]:[2,2]);await through(x.run,11n);const probes=[9,10,11].map(t=>capture(x,t,control!=='noDemand'));expect(probes.map(r=>r.chosen)).toEqual([-1,-1,-1]);if(control==='noDemand')expect(probes.map(r=>r.motive)).toEqual(['0/1','0/1','0/1']);await finish(x);put(control,{history,training,probes,terminal:hash(x.run.save())});console.info('M225 CONTROL PASS',control);
},590000);
it('reward225 privacy equal observed zero ignores physical success',async()=>{
 const result:any[]=[];
 for(const blocked of [false,true]){const x=await start({masked:true,blocked});await through(x.run,7n);const history=learned(x),training=[4,5,6,7].map(t=>capture(x,t));expect(history).toEqual([{count:2,mean:'0'},{count:2,mean:'0'}]);expect(training.map(r=>r.chosen)).toEqual([0,1,0,1]);expect(training.flatMap(r=>r.receipts.map(r=>r.gain))).toEqual(Array.from({length:4},()=>['0']));result.push({blocked,history,training});}
 expect(result[0].training.map((r:any)=>[r.motive,r.beliefs,r.admitted,r.chosen,r.probabilities,r.raw,r.receipts])).toEqual(result[1].training.map((r:any)=>[r.motive,r.beliefs,r.admitted,r.chosen,r.probabilities,r.raw,r.receipts]));
 expect(result[0].training.flatMap((r:any)=>r.effects.map((e:any)=>e.status))).toEqual(['Applied','Applied','Applied','Applied']);expect(result[1].training.flatMap((r:any)=>r.effects.map((e:any)=>e.status))).toEqual(['Blocked','Blocked','Blocked','Blocked']);put('privacy',result);
},590000);
it('reward225 continuation and closed learning admission',async()=>{
 console.info('M225 continuation start');const x=await start(),repeat=cachedMemory(await createCharacterRun(x.m,x.b.d));await through(x.run,7n);await through(repeat,7n);exact(x.run,repeat);console.info('M225 continuation repeated practice7');
 expect(capture(x,4).beliefs).toEqual([null,null]);expect(capture(x,5).beliefs).toEqual(['1000',null]);
 const acquired=restoreAuthoritativeState(decode(x.run.snapshot().state));expect(x.b.actions.map(a=>habitJournal(acquired.read(habitPath(actionRewardSubject(C,a))).value,1000000n,'observed').map(v=>Number(uint(items(v,'list')[2]))))).toEqual([[4,6],[5,7]]);
 const save=x.run.save(),restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));exact(x.run,restored);console.info('M225 continuation restored7');
 const state=restoreAuthoritativeState(decode(x.run.snapshot().state)),initial=restoreAuthoritativeState(decode(x.b.d.initialState)),entry=state.entries().find(e=>e.path.rootStateTypeId===821n)!;expect(entry).toBeDefined();
 await expect(createCharacterRun(x.m,{...x.b.d,initialState:enc(new AuthoritativeState([...initial.entries(),entry]).canonicalValue())})).rejects.toThrow('initial habit/reward must be absent');
 let done=false;for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();for(const r of [repeat,restored]){expect(await r.settleNextInstant()).toBe(more);expect(r.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[11n,101n].includes(x.run.snapshot().clock))exact(x.run,r);}if(!more){done=true;break;}}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);
 put('continuation',{checkpoint:hash(save),terminal:hash(x.run.save()),learned:learned(x)});console.info('M225 CONTINUATION PASS full bytes at7/11/101, complete final trace/output/save; learned S0 rejected');
},590000);
it('reward225 action and source grammar reject invalid bindings',async()=>{
 const x=await start(),b=x.b,slots=items(decode(b.s.registry),'list'),d=items(slots[57],'list'),compiled=compileReward(slots[57],true,true);
 expect(()=>compileReward(list([d[0],list([b.actions[0],b.actions[0]]),...d.slice(2)]),true,true)).toThrow('action domain');
 expect(()=>rewardSource(list([text(ACTION_REWARD),true,signed(0),true,list([text('foreign')])]),compiled)).toThrow('foreign practice action');
 expect(()=>compileReward(slots[57],true)).toThrow('declaration');
 const initial=restoreAuthoritativeState(decode(x.b.d.initialState)),foreign={path:habitPath(actionRewardSubject(C,text('foreign'))),value:list([text('assembled-habit/0.1'),list([])])};
 await expect(createCharacterRun(x.m,{...x.b.d,initialState:enc(new AuthoritativeState([...initial.entries(),foreign]).canonicalValue())})).rejects.toThrow('foreign path');
 const contrasts:any={};for(const law of ['MeanHistory','LatestHistory']as const){const r=createSubstitutionRun(law,substitutionCases().correctedConcentrated,0);while(await r.step()){}contrasts[law]=r.snapshot().rows[5].beliefBefore[0];}expect(contrasts).toEqual({MeanHistory:'4/5',LatestHistory:'0/1'});
 put('admission',{duplicate:true,foreignInstruction:true,foreignLearnedPath:true,legacyRejects:true,originalContradiction:contrasts});
});
