import {it,expect} from 'vitest';
import {start,fixture,through,rec,f,uint,items,key,decode,enc,list,text,C,u,at,type CanonicalValue} from './fixtures/assembledRewardInformation';
import {start as legacyStart} from './fixtures/assembledActionReward';
import {habitPath,rewardPath,habitJournal,rewardValue,informedExpectation} from '../assembled/habit';
import {actionRewardSubject} from '../assembled/actionReward';
import {REWARD_INFORMATION,REWARD_SOURCE,INFORMATION_SAMPLE,INFORMATION_RECEIPT,compileReward,rewardSource} from '../assembled/rewardExperience';
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
type X=Awaited<ReturnType<typeof start>>|Awaited<ReturnType<typeof legacyStart>>;
const file='docs/planning/ASSEMBLED_CHARACTER_M226_EVIDENCE.json';
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const exact=(a:X['run'],b:X['run'])=>{const {state:as,outputs:ao,trace:at,...am}=a.snapshot(),{state:bs,outputs:bo,trace:bt,...bm}=b.snapshot();expect(bm).toEqual(am);bytes(as,bs);bytes(ao,bo);bytes(at,bt);bytes(a.save(),b.save());};
const fraction=(v:CanonicalValue)=>{const x=readQ(v);return x.numerator+'/'+x.denominator;};
const tag=(v:CanonicalValue,name:string)=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length>0&&key(v.items[0])===key(text(name));
const mode=(x:X)=>x.b.s.rulesVersion.includes('0.147')?'informed' as const:'observed' as const;
const put=(name:string,value:any)=>{const d=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};expect(d[name]).toBeUndefined();d[name]=value;writeFileSync(file,JSON.stringify(d,null,2)+'\n');};
function learned(x:X){const state=restoreAuthoritativeState(decode(x.run.snapshot().state));return x.b.actions.map(action=>{const k=actionRewardSubject(C,action),h=habitJournal(state.read(habitPath(k)).value,1000000n,mode(x)),b=rewardValue(state.read(rewardPath(k)).value,1000000n,mode(x));return {count:h.length,mean:b?.mean===undefined?null:String(b.mean),samples:b?.samples.map(v=>{const a=items(v,'list');return {at:Number(uint(a[2])),attempted:a[4],amount:String(uint(a[6]))};})??[]};});}
function capture(x:X,t:number){
 const os=items(decode(x.run.snapshot().outputs),'list'),candidate=os.find(v=>tag(v,'assembled-action-reward/candidates')&&uint(items(v,'list')[1])===BigInt(t));expect(candidate,'live candidate receiving').toBeDefined();
 const c=items(candidate!,'list');expect(readQ(c[2]).numerator,'live common task motive').toBeGreaterThan(0n);
 const d=rec(os.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===409n&&at(f(v,2n))===BigInt(t))!,409n),ctx=rec(f(d,3n),408n),raw=rec(f(ctx,2n),403n),status=rec(f(d,4n),419n),chosen=uint(f(status,1n))===3n?rec(f(status,2n),420n):undefined;
 const action=(a:CanonicalValue)=>x.b.actions.findIndex(b=>key(a)===key(b));
 const effects=os.filter(v=>tag(v,ACTION_BODY)).map(v=>items(v,'list')).filter(a=>{const out=os.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===433n&&key(f(v,1n))===key(a[1]));if(!out)return false;const attempt=rec(f(rec(out,433n),2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n);return at(f(rec(f(intent,2n),409n),2n))===BigInt(t);});
 if(chosen){expect(items(f(ctx,3n),'list').length,'actual compiled reasons').toBeGreaterThan(0);expect(effects).toHaveLength(1);}
 return {at:t,motive:fraction(c[2]),beliefs:items(c[4],'list').map(v=>{const a=items(v,'list'),b=items(a[1],'list').length?rewardValue(a[1],1000000n,mode(x)):undefined;return b?.mean===undefined?null:String(b.mean);}),admitted:items(c[4],'list').map(v=>items(v,'list')[6]),chosen:chosen?action(f(rec(f(chosen,1n),395n),2n)):-1,probabilities:chosen?items(f(chosen,2n),'list').map(v=>fraction(f(rec(v,421n),2n))):[],raw:hash(enc(raw)),effects:effects.map(a=>({action:action(a[3]),status:(a[5] as {value:string}).value}))};
}
async function finish(x:X){for(let n=0;await x.run.settleNextInstant();n++)expect(n).toBeLessThan(48);expect(x.run.snapshot().clock).toBe(101n);}
async function original(name:keyof ReturnType<typeof substitutionCases>){const r=createSubstitutionRun('MeanHistory',substitutionCases()[name],0);while(await r.step()){}return r.snapshot().rows.map(r=>({at:r.at,belief:r.beliefBefore,chosen:r.intent}));}
it('information226 primary report knowledge reaches ordinary execution',async()=>{
 const result:any={};
 for(const [name,amount,old]of [['helpful',1000,'knownAlternative'],['failure',0,'knownFailure'],['absent',undefined,'concentrated']]as const){
  const x=await start({amount});await through(x.run,7n);expect(learned(x).map(h=>[h.count,h.mean])).toEqual([[4,'1000'],[0,null]]);await through(x.run,8n);
  const acquired=learned(x);expect(acquired.map(h=>h.count)).toEqual([4,0]);expect(acquired[1].mean).toBe(amount===undefined?null:String(amount));expect(acquired[1].samples).toEqual(amount===undefined?[]:[{at:8,attempted:false,amount:String(amount)}]);
  const os=items(decode(x.run.snapshot().outputs),'list'),receipts=os.filter(v=>tag(v,INFORMATION_RECEIPT));expect(receipts).toHaveLength(amount===undefined?0:1);
  if(receipts.length){const receipt=items(receipts[0],'list'),sample=items(receipt[3],'list');expect(key(sample[6])).toBe(key(x.b.observer));expect(key(sample[4])).toBe(key(list([list([x.b.actions[1],u(amount!)])])));expect(typeof receipt[4]!=='boolean'&&receipt[4].kind==='record','frozen C1 semantic experience').toBe(true);}
  await through(x.run,11n);const probes=[9,10,11].map(t=>capture(x,t)),positive=amount===1000;expect(probes.map(p=>p.chosen)).toEqual(positive?[1,1,1]:[-1,-1,-1]);for(const p of probes){expect(p.beliefs[1]).toBe(amount===undefined?null:String(amount));expect(p.probabilities).toEqual(positive?['1/1']:[]);expect(p.effects).toEqual(positive?[{action:1,status:'Applied'}]:[]);}
  const control=await original(old);expect(control.slice(5).map(r=>r.chosen)).toEqual(probes.map(r=>r.chosen));await finish(x);
  result[name]={acquired,probes,control,final:learned(x),registry:hash(x.b.s.registry),initial:hash(x.b.d.initialState),inputs:hash(x.b.d.orderedInputs),terminal:hash(x.run.save())};console.info('M226 PRIMARY',name,JSON.stringify({acquired,probes}));
 }
 expect(new Set(Object.values(result).map((v:any)=>v.registry)).size).toBe(1);expect(new Set(Object.values(result).map((v:any)=>v.initial)).size).toBe(1);put('primary',result);
},530000);
it('information226 denied withheld and contrary information',async()=>{
 const result:any={};
 for(const [name,options]of [['deniedPositive',{amount:1000,denied:true}],['deniedNegative',{amount:0,denied:true}],['withheld',{amount:1000,withheld:true}],['contrary',{amount:0,action:0}]]as const){
  const x=await start(options);await through(x.run,8n);const acquired=learned(x),contrary=name==='contrary';expect(acquired.map(h=>h.count)).toEqual([4,0]);expect(acquired.map(h=>h.mean)).toEqual([contrary?'800':'1000',null]);
  const os=items(decode(x.run.snapshot().outputs),'list'),samples=os.filter(v=>tag(v,INFORMATION_SAMPLE));expect(samples).toHaveLength(1);if(name.startsWith('denied'))expect(items(items(samples[0],'list')[4],'list')).toHaveLength(0);
  await through(x.run,11n);const probes=[9,10,11].map(t=>capture(x,t));expect(probes.map(p=>p.chosen)).toEqual([-1,-1,-1]);result[name]={acquired,probes};console.info('M226 CONTROL',name,JSON.stringify(result[name]));
 }
 expect(result.deniedPositive).toEqual(result.deniedNegative);const denied=await original('deniedInfo'),contrary=await original('correctedConcentrated');expect(denied.slice(5).map(r=>r.chosen)).toEqual([-1,-1,-1]);expect(contrary[5].belief[0]).toBe('4/5');const seed=await start({amount:1000}),inputs=items(decode(seed.b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(at(a[0])===9n&&key(a[2])===key(REWARD_SOURCE)){const p=[...items(a[3],'list')];p[5]=list([list([seed.b.actions[1],u(0)])]);a[3]=list(p);}return list(a);}),overlap=cachedMemory(await createCharacterRun(seed.m,{...seed.b.d,orderedInputs:enc(list(inputs))}));await through(overlap,8n);const before=overlap.snapshot();await expect(overlap.settleNextInstant()).rejects.toThrow('information and action overlap');const after=overlap.snapshot();expect(after.clock).toBe(before.clock);bytes(before.state,after.state);bytes(before.outputs,after.outputs);bytes(before.trace,after.trace);
 put('controls',{...result,denied,contraryOriginal:contrary,overlapRejectedAndRolledBack:true});
},470000);
it('information226 repeat restore and closed admission',async()=>{
 const x=await start({amount:1000}),repeat=cachedMemory(await createCharacterRun(x.m,x.b.d));await through(x.run,8n);await through(repeat,8n);exact(x.run,repeat);console.info('M226 repeated8');
 const receipt=items(items(decode(x.run.snapshot().outputs),'list').find(v=>tag(v,INFORMATION_RECEIPT))!,'list'),sample=items(receipt[3],'list'),experience=rec(receipt[4],227n),support=items(f(experience,8n),'set');expect(key(f(experience,2n))).toBe(key(x.b.observer));expect(uint(f(experience,3n))).toBe(8n);expect(support).toHaveLength(1);expect(key(f(rec(support[0],216n),1n))).toBe(key(x.b.observer));expect(key(f(rec(support[0],216n),2n))).toBe(key(sample[1]));

 const save=x.run.save(),restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));exact(x.run,restored);console.info('M226 restored8');
 const initial=restoreAuthoritativeState(decode(x.b.d.initialState)),state=restoreAuthoritativeState(decode(x.run.snapshot().state)),entry=state.entries().find(e=>e.path.rootStateTypeId===823n)!;
 await expect(createCharacterRun(x.m,{...x.b.d,initialState:enc(new AuthoritativeState(initial.entries().filter(e=>!(e.path.rootStateTypeId===268n&&e.path.selectors[0].kind==='mapKey'&&key(e.path.selectors[0].key)===key(x.b.observer)))).canonicalValue())})).rejects.toThrow('report observer must bind holder');
 await expect(createCharacterRun(x.m,{...x.b.d,initialState:enc(new AuthoritativeState([...initial.entries(),entry]).canonicalValue())})).rejects.toThrow('initial habit/reward must be absent');
 let done=false;for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();for(const r of [repeat,restored]){expect(await r.settleNextInstant()).toBe(more);expect(r.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[11n,101n].includes(x.run.snapshot().clock))exact(x.run,r);}if(!more){done=true;break;}}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);
 const d=compileReward(items(decode(x.b.s.registry),'list')[57],true,true,true),source=(report:CanonicalValue,practice:CanonicalValue=list([]))=>list([text(REWARD_INFORMATION),true,{kind:'signed' as const,value:0n},true,practice,list([report])]);
 expect(()=>rewardSource(source(list([text('foreign'),u(1)])),d)).toThrow('report action');expect(()=>rewardSource(source(list([x.b.actions[1],u(1001)])),d)).toThrow('integer domain');expect(()=>rewardSource(source(list([x.b.actions[1],u(1)]),list([x.b.actions[0]])),d)).toThrow('report and practice overlap');
 expect(()=>compileReward(items(decode(x.b.s.registry),'list')[57],true,true)).toThrow('declaration');
 const belief=rewardValue(entry.value,1000000n,'informed')!,a=[...items(entry.value,'list')];a[4]=list([u(500)]);expect(()=>rewardValue(list(a),1000000n,'informed')).toThrow('derived fields');expect(()=>informedExpectation([...belief.samples,belief.samples[0]],1000000n)).toThrow('provenance/order');
 const final=hash(x.run.save()),evidence=JSON.parse(readFileSync(file,'utf8'));expect(final).toBe(evidence.primary.helpful.terminal);put('continuation',{checkpoint:hash(save),terminal:final,learned:learned(x),perception:{observer:key(x.b.observer),at:8,supportMatched:true},admission:['missing observer binding','learned S0','foreign report','out-of-domain report','practice overlap','legacy declaration','forged mean','repeated sample']});
},355000);
it('information226 retained M225 acquired alternative witness',async()=>{
 const result:any={};for(const diverse of [false,true]){const x=await legacyStart({diverse});await through(x.run,7n);const history=learned(x);expect(history.map(h=>[h.count,h.mean])).toEqual(diverse?[[2,'1000'],[2,'1000']]:[[4,'1000'],[0,null]]);await through(x.run,11n);const probes=[9,10,11].map(t=>capture(x,t));expect(probes.map(p=>p.chosen)).toEqual(diverse?[1,1,1]:[-1,-1,-1]);await finish(x);const old=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M225_EVIDENCE.json','utf8')).primary[diverse?'diverse':'concentrated'];expect(hash(x.run.save())).toBe(old.terminal);result[diverse?'diverse':'concentrated']={history,probes,terminal:hash(x.run.save())};}put('compatibility',result);
},295000);
