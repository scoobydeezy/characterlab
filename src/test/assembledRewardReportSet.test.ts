import {it,expect} from 'vitest';
import {start,fixture,through,rec,f,uint,items,key,decode,enc,list,text,signed,C,u,at,type CanonicalValue} from './fixtures/assembledRewardReportSet';
import {start as oldStart} from './fixtures/assembledRewardInformation';
import {habitPath,rewardPath,habitJournal,rewardValue} from '../assembled/habit';
import {actionRewardSubject} from '../assembled/actionReward';
import {REWARD_REPORT_SET,INFORMATION_SAMPLE,INFORMATION_RECEIPT,compileReward,rewardSource} from '../assembled/rewardExperience';
import {ACTION_BODY} from '../assembled/actionBody';
import {cognitiveRecord as evidenceAtom} from '../assembled/codecs';
import {typedIdentifier} from '../substrate/canonicalEncoding';
import {readQ} from '../campaign2/cognitiveMath';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {createCharacterRun,restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {createSubstitutionRun,LAWS,OPTIONS,type Law} from '../campaign3/dependenceSubstitutes';
import {substitutionCases} from './substitutionFixtures';
// @ts-expect-error Node-only receipt.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Node-only receipt.
import {createHash} from 'node:crypto';
type X=Awaited<ReturnType<typeof start>>;
const file='docs/planning/ASSEMBLED_CHARACTER_M227_EVIDENCE.json';
const hash=(b:Uint8Array)=>createHash('sha256').update(b).digest('hex');
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const exact=(a:X['run'],b:X['run'])=>{const {state:as,outputs:ao,trace:at,...am}=a.snapshot(),{state:bs,outputs:bo,trace:bt,...bm}=b.snapshot();expect(bm).toEqual(am);bytes(as,bs);bytes(ao,bo);bytes(at,bt);bytes(a.save(),b.save());};
const fraction=(v:CanonicalValue)=>{const x=readQ(v);return x.numerator+'/'+x.denominator;};
const fullProbability=(rows:{action:number;value:string}[])=>[0,1].map(action=>rows.find(r=>r.action===action)?.value??'0/1');
const tag=(v:CanonicalValue,name:string)=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length>0&&key(v.items[0])===key(text(name));
const put=(name:string,value:any)=>{const d=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};expect(d[name]).toBeUndefined();d[name]=value;writeFileSync(file,JSON.stringify(d,null,2)+'\n');};
const saved=()=>JSON.parse(readFileSync(file,'utf8'));
function learned(x:X){const state=restoreAuthoritativeState(decode(x.run.snapshot().state));return x.b.actions.map(action=>{const k=actionRewardSubject(C,action),h=habitJournal(state.read(habitPath(k)).value,1000000n,'informed'),b=rewardValue(state.read(rewardPath(k)).value,1000000n,'informed');return {count:h.length,mean:b?.mean===undefined?null:String(b.mean),supports:b?.supports.map(key)??[],samples:b?.samples.map(v=>{const a=items(v,'list');return {at:Number(uint(a[2])),attempted:a[4],amount:String(uint(a[6]))};})??[]};});}
function evidenceSupport(v:CanonicalValue){
 if(typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===399n&&v.schema.schemaVersion===2n){expect(uint(f(v,1n))).toBe(3n);const receipt=f(v,2n);expect(typeof receipt!=='boolean'&&receipt.kind==='typedIdentifier'&&receipt.namespaceId===1164n).toBe(true);return key(receipt);}
 return key(f(rec(v,399n),2n));
}
function capture(x:X,t:number){
 const os=items(decode(x.run.snapshot().outputs),'list'),candidate=os.find(v=>tag(v,'assembled-action-reward/candidates')&&uint(items(v,'list')[1])===BigInt(t));expect(candidate,'live candidate receiving').toBeDefined();
 const c=items(candidate!,'list');expect(readQ(c[2]).numerator,'live common task motive').toBeGreaterThan(0n);
 const d=rec(os.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===409n&&at(f(v,2n))===BigInt(t))!,409n),ctx=rec(f(d,3n),408n),raw=rec(f(ctx,2n),403n),status=rec(f(d,4n),419n),chosen=uint(f(status,1n))===3n?rec(f(status,2n),420n):undefined;
 const action=(a:CanonicalValue)=>x.b.actions.findIndex(b=>key(a)===key(b)),candidateAction=(v:CanonicalValue)=>action(f(rec(v,395n),2n));
 const signals=items(f(raw,3n),'set').map(v=>rec(v,402n)).filter(v=>key(f(rec(f(v,1n),401n),2n))===key(x.b.task)).map(v=>{const k=rec(f(v,1n),401n),basis=f(rec(f(v,3n),400n),1n);if(typeof basis==='boolean'||basis.kind!=='map')throw Error('basis');return {action:candidateAction(f(k,1n)),role:Number(uint(f(k,3n))),value:fraction(f(v,2n)),supports:basis.entries.map(([k])=>evidenceSupport(k))};}).sort((a,b)=>a.action-b.action||a.role-b.role);
 const optionSet=rec(f(raw,2n),398n),motives=items(f(rec(f(optionSet,2n),394n),3n),'list'),origins=items(f(optionSet,3n),'list').map(v=>{const option=rec(v,397n);return {action:candidateAction(f(option,1n)),origins:items(f(option,2n),'set').map(v=>{const origin=f(rec(v,396n),1n),m=motives.find(v=>key(f(rec(v,393n),1n))===key(origin));return {common:key(origin)===key(x.b.task),motive:m?fraction(f(rec(m,393n),2n)):null};})};}),reasonActions=items(f(ctx,3n),'list').map(v=>candidateAction(f(rec(f(rec(v,407n),1n),404n),1n)));
 const effects=os.filter(v=>tag(v,ACTION_BODY)).map(v=>items(v,'list')).filter(a=>{const out=os.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===433n&&key(f(v,1n))===key(a[1]));if(!out)return false;const attempt=rec(f(rec(out,433n),2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n);return at(f(rec(f(intent,2n),409n),2n))===BigInt(t);});
 if(chosen){expect(items(f(ctx,3n),'list').length,'compiled reasons').toBeGreaterThan(0);expect(effects).toHaveLength(1);}
 return {at:t,origins,reasonActions,motive:fraction(c[2]),beliefs:items(c[4],'list').map(v=>{const a=items(v,'list'),b=items(a[1],'list').length?rewardValue(a[1],1000000n,'informed'):undefined;return b?.mean===undefined?null:String(b.mean);}),habit:items(c[4],'list').map(v=>fraction(items(v,'list')[3])),admitted:items(c[4],'list').map(v=>items(v,'list')[6]),chosen:chosen?candidateAction(f(chosen,1n)):-1,probabilities:chosen?items(f(chosen,2n),'list').map(v=>({action:candidateAction(f(rec(v,421n),1n)),value:fraction(f(rec(v,421n),2n))})).sort((a,b)=>a.action-b.action):[],signals,raw:hash(enc(raw)),effects:effects.map(a=>({action:action(a[3]),status:(a[5] as {value:string}).value}))};
}
async function finish(x:X){for(let n=0;await x.run.settleNextInstant();n++)expect(n).toBeLessThan(48);expect(x.run.snapshot().clock).toBe(101n);}
async function original(name:keyof ReturnType<typeof substitutionCases>,law:Law){const r=createSubstitutionRun(law,substitutionCases()[name],0);while(await r.step()){}return {terminal:hash(r.save()),rows:r.snapshot().rows.map(row=>{const d=rec(decode(Uint8Array.from(row.resolution.match(/../g)!.map(s=>parseInt(s,16)))),409n),status=rec(f(d,4n),419n),chosen=uint(f(status,1n))===3n?rec(f(status,2n),420n):undefined;return {at:row.at,belief:row.beliefBefore,habit:row.habitBefore,admitted:row.admitted,values:row.values,chosen:row.intent,probabilities:chosen?items(f(chosen,2n),'list').map(v=>({action:OPTIONS.findIndex(o=>key(o)===key(f(rec(v,421n),1n))),value:fraction(f(rec(v,421n),2n))})).sort((a,b)=>a.action-b.action):[]};})};}
function receipts(x:X){
 const os=items(decode(x.run.snapshot().outputs),'list'),rs=os.filter(v=>tag(v,INFORMATION_RECEIPT));expect(rs).toHaveLength(2);const actions=rs.map(v=>{const a=items(v,'list'),sample=items(a[3],'list'),experience=rec(a[4],227n),support=items(f(experience,8n),'set');expect(key(f(experience,2n))).toBe(key(x.b.observer));expect(uint(f(experience,3n))).toBe(8n);expect(support).toHaveLength(1);expect(key(f(rec(support[0],216n),2n))).toBe(key(sample[1]));return x.b.actions.findIndex(v=>key(v)===key(items(items(sample[4],'list')[0],'list')[0]));});expect(actions.slice().sort()).toEqual([0,1]);expect(new Set(rs.map(v=>key(items(v,'list')[1]))).size).toBe(2);
}
it('reports227 primary corrected repertoires and changed cues reach execution',async()=>{
 const receipt=typedIdentifier(1164,u(1));expect(evidenceSupport(evidenceAtom(399,[u(3),receipt],2))).toBe(key(receipt));
 const result:any={};
 for(const [name,options,old]of [['concentrated',{diverse:false},'correctedConcentrated'],['diversified',{},'correctedDiversified'],['otherCue',{otherCue:true},'otherCue']]as const){
  const x=await start(options),diverse=name!=='concentrated';await through(x.run,7n);expect(learned(x).map(h=>h.count)).toEqual(diverse?[2,2]:[4,0]);await through(x.run,8n);receipts(x);
  const acquired=learned(x),state8=hash(x.run.snapshot().state);expect(acquired.map(h=>h.mean)).toEqual(diverse?['667','667']:['800','0']);expect(acquired.map(h=>h.count)).toEqual(diverse?[2,2]:[4,0]);for(const h of acquired){expect(h.samples.at(-1)).toEqual({at:8,attempted:false,amount:'0'});expect(h.samples.length).toBe(h.count+1);}
  await through(x.run,11n);const probes=[9,10,11].map(t=>capture(x,t));console.info('M227 PRIMARY',name,JSON.stringify({acquired,probes}));
  for(const p of probes){expect(p.beliefs).toEqual(diverse?['667','667']:['800','0']);expect(p.habit).toEqual(name==='otherCue'?['0/1','0/1']:diverse?['3/4','3/4']:['15/16','0/1']);expect(p.admitted).toEqual(diverse?[true,true]:[true,false]);expect(p.chosen).toBeGreaterThanOrEqual(0);expect(p.effects).toEqual([{action:p.chosen,status:'Applied'}]);const bases=p.signals.filter(s=>s.role===1);expect(bases.map(s=>s.value)).toEqual(diverse?['667/1000','667/1000']:['4/5']);for(const b of bases)expect(b.supports.slice().sort()).toEqual(acquired[b.action].supports.slice().sort());}
  expect(learned(x)).toEqual(acquired);const controls:any={};for(const law of LAWS)controls[law]=await original(old,law);
  const mean=controls.MeanHistory.rows.slice(5);for(const [i,p]of probes.entries()){expect(mean[i].belief).toEqual(diverse?['2/3','2/3']:['4/5','0/1']);expect(mean[i].habit).toEqual(p.habit);expect(mean[i].admitted).toEqual(p.admitted);}
  // First-probe comparison precedes any newly acquired contest identity.
  expect(fullProbability(probes[0].probabilities)).toEqual(fullProbability(mean[0].probabilities));if(!diverse)for(const p of probes){expect(p.origins.filter(o=>o.action===1).flatMap(o=>o.origins).every(o=>!o.common)).toBe(true);expect(p.reasonActions).not.toContain(1);}
  await finish(x);result[name]={acquired,state8,probes,controls,terminal:hash(x.run.save()),initial:hash(x.b.d.initialState),registry:hash(x.b.s.registry)};
 }
 expect(result.concentrated.probes[0].probabilities).not.toEqual(result.diversified.probes[0].probabilities);expect(result.diversified.probes[0].probabilities).toEqual(result.otherCue.probes[0].probabilities);
 expect(new Set(Object.values(result).map((v:any)=>v.registry)).size).toBe(1);expect(new Set(Object.values(result).map((v:any)=>v.initial)).size).toBe(1);put('primary',result);
},410000);
it('reports227 report ordering and denied presence preserve receiving',async()=>{
 const x=await start({reverse:true});await through(x.run,8n);receipts(x);expect(hash(x.run.snapshot().state)).toBe(saved().primary.diversified.state8);expect(learned(x)).toEqual(saved().primary.diversified.acquired);await through(x.run,9n);const reversed=capture(x,9),prior=saved().primary.diversified.probes[0];
 for(const field of ['motive','beliefs','habit','admitted','probabilities','signals','raw']as const)expect(reversed[field]).toEqual(prior[field]);
 const denial:any[]=[];for(const present of [false,true]){const d=await start({denied:true,bothAvailable:false,reports:present?[[0,0],[1,0]]:[]});await through(d.run,8n);const acquired=learned(d);expect(acquired.map(h=>h.mean)).toEqual(['1000','1000']);expect(items(decode(d.run.snapshot().outputs),'list').filter(v=>tag(v,INFORMATION_SAMPLE))).toHaveLength(0);await through(d.run,11n);const probes=[9,10,11].map(t=>capture(d,t));expect(probes.map(p=>p.chosen)).toEqual([1,1,1]);denial.push({acquired,probes,state:hash(d.run.snapshot().state)});}expect(denial[0]).toEqual(denial[1]);const w=await start({withheld:true,bothAvailable:false});await through(w.run,8n);receipts(w);const withheld=learned(w);expect(withheld.map(h=>h.mean)).toEqual(['1000','1000']);expect(withheld.map(h=>h.samples.length)).toEqual([2,2]);await through(w.run,11n);const withheldProbes=[9,10,11].map(t=>capture(w,t));expect(withheldProbes.map(p=>p.chosen)).toEqual([1,1,1]);expect(learned(w)).toEqual(withheld);put('orderPrivacy',{reversed,denial,withheld,withheldProbes});
},410000);
it('reports227 repeat and restore the simultaneous update',async()=>{
 const x=await start(),repeat=cachedMemory(await createCharacterRun(x.m,x.b.d));await through(x.run,8n);await through(repeat,8n);exact(x.run,repeat);console.info('M227 repeated8');
 const save=x.run.save(),restored=cachedMemory(await restorePreparedCharacterRun(x.m,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));exact(x.run,restored);console.info('M227 restored8');
 let done=false;for(let n=0;n<48;n++){const more=await x.run.settleNextInstant();for(const r of [repeat,restored]){expect(await r.settleNextInstant()).toBe(more);expect(r.snapshot().clock).toBe(x.run.snapshot().clock);if(more&&[11n,101n].includes(x.run.snapshot().clock))exact(x.run,r);}if(!more){done=true;break;}}expect(done).toBe(true);expect(x.run.snapshot().clock).toBe(101n);expect(hash(x.run.save())).toBe(saved().primary.diversified.terminal);put('continuation',{checkpoint:hash(save),terminal:hash(x.run.save()),learned:learned(x)});
},350000);
it('reports227 closed set admission and retained single report bytes',async()=>{
 const b=fixture(),decl=items(decode(b.s.registry),'list')[57],d=compileReward(decl,true,true,true,true),source=(reports:CanonicalValue[])=>list([text(REWARD_REPORT_SET),true,signed(0),true,list([]),list(reports)]),a=list([b.actions[0],u(0)]),z=list([b.actions[1],u(0)]);
 expect(()=>rewardSource(source([a,a]),d)).toThrow('duplicate report action');expect(()=>rewardSource(source([a,z,a]),d)).toThrow('report capacity');expect(()=>rewardSource(source([list([text('foreign'),u(0)])]),d)).toThrow('report action');expect(()=>rewardSource(source([list([b.actions[1],u(1001)])]),d)).toThrow('integer domain');expect(()=>compileReward(decl,true,true,true)).toThrow('declaration');
 const x=await oldStart({amount:1000}),old=compileReward(items(decode(x.b.s.registry),'list')[57],true,true,true);expect(()=>rewardSource(list([text('assembled-reward-experience/0.4'),true,signed(0),true,list([]),list([a,z])]),old)).toThrow('report capacity');
 await finish(x);const oldEvidence=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M226_EVIDENCE.json','utf8'));expect(hash(x.run.save())).toBe(oldEvidence.primary.helpful.terminal);put('admissionCompatibility',{duplicate:true,capacity:true,foreign:true,domain:true,legacyRejects:true,terminal:hash(x.run.save())});
},230000);
