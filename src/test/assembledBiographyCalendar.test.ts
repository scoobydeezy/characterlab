import {it,expect} from 'vitest';
import recorded from '../../docs/planning/ASSEMBLED_CHARACTER_M110_RECEIPTS.json';
import {fixture,header,times,learning,actualDraws,create,live,refold,learned,standing,ablation,rec,f,uint,items,key,decode,readQ,ZERO,snap,through,finish,exact,bytes,qualificationParts,fraction,Q,formationSignals,enumerate,type Run,type CanonicalValue} from './fixtures/assembledBiographyCalendar';
import {restoreCharacterRun} from '../assembled/character';
import {analysis,action} from './fixtures/assembledBiographyAlternatives';
type Row={i:number;at:string;chosen:string;contribution:string;before:string;after:string;authorship:string;probabilities:string[];draws:ReturnType<typeof actualDraws>};
type Receipt={arm:number;rows:Row[];terminal:number;qualifications:number;originalWitness:boolean;settlements:string[]};
const liveReceipts:Record<string,Receipt>={};

/** Owner-approved diagnostic only; never substitutes a completed M110 gate. */
async function startM110Profile(){
 const pn='node:process',process=await import(/* @vite-ignore */ pn);if(process.env.M110_PROFILE!=='1')return undefined;
 const sn='node:inspector',fn='node:fs',zn='node:zlib';
 const [{Session},fs,z]=await Promise.all([import(/* @vite-ignore */ sn),import(/* @vite-ignore */ fn),import(/* @vite-ignore */ zn)]);
 const session=new Session();session.connect();
 const post=(method:string,params:object={})=>new Promise<any>((resolve,reject)=>session.post(method,params,(error:Error|null,value:unknown)=>error?reject(error):resolve(value)));
 await post('Profiler.enable');await post('Profiler.setSamplingInterval',{interval:10000});await post('Profiler.start');
 const start=performance.now(),phases:{stage:string;ms:number;elapsed:number;next:string}[]=[];let previous=start,stage='profile setup';
 const emit=(label:string,value:unknown)=>process.stdout.write(label+' '+JSON.stringify(value)+'\n');
 return {
  mark(next:string){const now=performance.now(),row={stage,ms:Math.round(now-previous),elapsed:Math.round(now-start),next};phases.push(row);emit('M110 PROFILE PHASE',row);previous=now;stage=next;if(now-start>=120000)throw Error('M110 diagnostic stop120s; no behavioral gate claim');},
  async finish(){const now=performance.now();phases.push({stage,ms:Math.round(now-previous),elapsed:Math.round(now-start),next:'finish'});const {profile}=await post('Profiler.stop');session.disconnect();
   const bytes=z.gzipSync(JSON.stringify({source:'3e86ffa5',diagnostic:'unchanged M110 arm6, instrumented, not acceptance',phases,profile}),{level:9});if(bytes.length>5*1024*1024)throw Error('M110 profile evidence cap');fs.writeFileSync('docs/planning/ASSEMBLED_CHARACTER_M110_PROFILE.json.gz',bytes);
   emit('M110 PROFILE STORED',{elapsed:Math.round(now-start),samples:profile.samples?.length,bytes:bytes.length,lastStage:stage});
  }
 };
}

for(const arm of [6,0])it('M110 arm '+arm+' full calendar'+(arm===6?' and exact continuation':''),async()=>{
 const prof=await startM110Profile();try{prof?.mark('fixture');
 const b=fixture(arm);prof?.mark('prepare/create/advance9');const {run}=await create(b);prof?.mark('initial snapshot');const rows:Row[]=[],frozen:CanonicalValue[]=[],settlements:string[]=[];let restored:Run|undefined,prior=ZERO,normalMeaning:CanonicalValue|undefined,frame=snap(run);
 async function advance(at?:bigint){
  if(!restored){prof?.mark('advance single '+String(at));if(at!==undefined)await through(run,at);else await finish(run);prof?.mark('snapshot single');frame=snap(run);return;}
  for(let n=0;n<40;n++){
   if(at!==undefined&&frame.clock>=at)return;
   prof?.mark('settle original '+String(at));const next=await run.settleNextInstant();prof?.mark('settle restored '+String(at));expect(await restored.settleNextInstant()).toBe(next);prof?.mark('snapshot pair');
   const x=run.snapshot(),y=restored.snapshot();frame=x;expect([y.clock,y.status]).toEqual([x.clock,x.status]);
   prof?.mark('compare snapshot bytes');for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);prof?.mark('save pair and compare');bytes(run.save(),restored.save());prof?.mark('identity pair and compare');bytes(run.runIdentity(),restored.runIdentity());settlements.push(String(x.clock)+(next?'':':exhausted'));
   if(!next){expect(at).toBeUndefined();expect(x.clock).toBe(101n);return;}
  }throw Error('M110 settlement cap');
 }
 for(const [index,at]of times.entries()){
  await advance(at);prof?.mark('inspect/refold '+String(at));const observedFrame=frame,observed:Run={...run,snapshot:()=>observedFrame};const i=index+1,p=live(observed,at),l=refold(observed);expect(readQ(items(p.report,'list')[1])).toEqual(prior);
  prof?.mark('formation check '+String(at));expect(formationSignals(p.input[0],i===1?undefined:p.input[1]).output).toEqual(p.source);expect(standing(p.raw)).toEqual(standing(p.source));
  prof?.mark('qualification/probe checks '+String(at));let contribution='None';if(learning(i)){
   expect(l.journal).toHaveLength(frozen.length+1);const qual=qualificationParts(l.journal[frozen.length]);expect(qual.accepted).toBe(true);expect(qual.at.value).toBe(at);expect(qual.resolution).toEqual(p.d);expect(readQ(qual.contribution).equals(ZERO)).toBe(false);contribution=fraction(readQ(qual.contribution));frozen.push(qual.expression);
  }else{
   expect(l.journal).toHaveLength(frozen.length);expect(l.formation.P).toEqual(prior);const absent=ablation(p,b.s),a=analysis(absent.context,b.s);expect(a.probabilities.map(v=>v.probability)).toEqual([Q.of(1n,2n),Q.of(1n,2n)]);
   if(i===5)normalMeaning=f(p.raw,4n);
   if(i===19){expect(f(p.raw,4n)).not.toEqual(normalMeaning);const exactActual=await enumerate(p,b.s),exactAbsent=await enumerate(p,b.s,absent.context);expect([...exactAbsent.sum.values()]).toEqual([Q.of(1n,2n),Q.of(1n,2n)]);for(const v of items(f(p.data,2n),'list'))expect(exactActual.sum.get(key(f(rec(v,421n),1n)))).toEqual(readQ(f(rec(v,421n),2n)));}
  }
  prof?.mark('historical immutability '+String(at));for(const [j,x]of frozen.entries())expect(qualificationParts(l.journal[j]).expression).toEqual(x);
  prof?.mark('draw receipts '+String(at));rows.push({i,at:String(at),chosen:action(f(p.data,1n)),contribution,before:fraction(prior),after:fraction(l.formation.P),authorship:fraction(readQ(f(p.data,7n))),probabilities:p.probabilities.map(v=>fraction(readQ(v))),draws:actualDraws(observed,at,arm)});prior=l.formation.P;
  if(i===5&&arm===6){prof?.mark('save18/restore/exact');restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:run.save()});exact(run,restored);}
 }
 await advance();const final=learned({...run,snapshot:()=>frame});expect(final.journal).toHaveLength(16);expect(final.formation.P).toEqual(prior);for(const [i,x]of frozen.entries())expect(qualificationParts(final.journal[i]).expression).toEqual(x);
 const receipt:Receipt={arm,rows,terminal:101,qualifications:16,originalWitness:rows.slice(0,4).every(v=>v.chosen==='A')&&rows.slice(5,17).every(v=>v.chosen==='B'),settlements};
 liveReceipts[String(arm)]=receipt;console.info('M110 RECEIPT '+JSON.stringify(receipt));
 }finally{await prof?.finish();}
},arm===6?550000:380000);
it('M110 paired original-calendar receipt comparison',()=>{
 const r=recorded as unknown as {arms:Record<string,Receipt>},a=liveReceipts['6']??r.arms['6'],b=liveReceipts['0']??r.arms['0'];expect(a).toBeDefined();expect(b).toBeDefined();let matches=0,differentRoots=0,changedProbes=0;
 for(const [j,x]of a.rows.entries()){
  const y=b.rows[j];expect([x.i,x.at]).toEqual([y.i,y.at]);if(x.i<=4)continue;
  const other=new Map(y.draws.map(d=>[d.effective,d]));let common=0;for(const d of x.draws){const e=other.get(d.effective);if(!e)continue;common++;matches++;expect([d.span,d.result,d.attempts]).toEqual([e.span,e.result,e.attempts]);if(d.local!==e.local)differentRoots++;}
  expect(common).toBeGreaterThanOrEqual(2);if([5,18,19].includes(x.i)&&keyText(x.probabilities)!==keyText(y.probabilities))changedProbes++;
 }
 expect(changedProbes).toBeGreaterThan(0);expect(a.qualifications).toBe(16);expect(b.qualifications).toBe(16);expect(a.settlements.at(-1)).toBe('101:exhausted');
 console.info('M110 PAIRED PASS '+JSON.stringify({matches,differentRoots,changedProbes,originalFourPositiveTwelveContrary:[a.originalWitness,b.originalWitness],nativeChoices:[a.rows.map(v=>v.chosen).join(''),b.rows.map(v=>v.chosen).join('')]}));
});
const keyText=(x:unknown)=>JSON.stringify(x);

it("M110 source declaration diagnosis after admission failure",()=>{
 const b=fixture(6),rows=items(decode(b.d.orderedInputs),"list").slice(1),counts=new Map<string,number>();
 for(const row of rows){const a=items(row,"list"),event=a[2];if(typeof event==='boolean'||event.kind!=='typedIdentifier'||typeof event.payload==='boolean'||event.payload.kind!=='text')throw Error('source type');const name=event.payload.value;counts.set(name,(counts.get(name)??0)+1);}
 expect(times).toHaveLength(19);console.info('M110 SOURCE COUNTS '+JSON.stringify([...counts]));
},110000);

import {prepareCharacterModel,createCharacterRun} from '../assembled/character';
import {TIMED_COMPARISON_RULES,TIMED_COMPARISON_REGISTRY} from '../assembled/model';
import {canonicalEncode as encode,list as sequence,signed as atValue} from '../substrate/canonicalEncoding';
it('M110 versioned opportunity admission and rejection boundaries',async()=>{
 const b=fixture(6),model=await prepareCharacterModel(b.s),oldSource={...b.s,rulesVersion:TIMED_COMPARISON_RULES,registrySchemaVersion:TIMED_COMPARISON_REGISTRY},old=await prepareCharacterModel(oldSource);
 const rows=items(decode(b.d.orderedInputs),'list').slice(1),names=['event/assembled-identity-context','event/assembled-self-context','event/assembled-values-context','event/assembled-reason-reading'];
 const name=(v:CanonicalValue)=>{const t=items(v,'list')[2];if(typeof t==='boolean'||t.kind!=='typedIdentifier'||typeof t.payload==='boolean'||t.payload.kind!=='text')throw Error('event');return t.payload.value;};
 const all=[...names,'event/deliberation-opportunity'],templates=all.map(n=>rows.find(v=>name(v)===n)!);
 const calendar=(count:number)=>[...rows.filter(v=>!all.includes(name(v))&&name(v)!=='event/regulatory-diagnostic-probe'),...Array.from({length:count},(_,i)=>templates.map(v=>{const a=[...items(v,'list')];a[0]=atValue(i+1);return sequence(a);})).flat()];
 const data=(xs:CanonicalValue[])=>({...b.d,orderedInputs:encode(sequence(xs))});
 await createCharacterRun(model,b.d);await createCharacterRun(old,data(calendar(16)));
 await expect(createCharacterRun(old,b.d)).rejects.toThrow('identity context source domain');
 await expect(prepareCharacterModel({...b.s,registrySchemaVersion:TIMED_COMPARISON_REGISTRY})).rejects.toThrow('version bundle');
 const full=calendar(100);await createCharacterRun(model,data(full));
 for(const [i,n]of names.entries()){
  const row=rows.find(v=>name(v)===n)!,duplicates=[...rows,row];await expect(createCharacterRun(model,data(duplicates))).rejects.toThrow('duplicate');
  const over=[...full,full.find(v=>name(v)===n)!];await expect(createCharacterRun(model,data(over))).rejects.toThrow(i===3?'reason evidence version/capacity':n.includes('identity')?'identity context source domain':n.includes('self')?'self context source domain':'values context source domain');
  const moved=rows.map(v=>{if(v!==row)return v;const a=[...items(v,'list')];a[0]=atValue(101);return sequence(a);});await expect(createCharacterRun(model,data(moved))).rejects.toThrow(i===3?'reason evidence time':'context time');
  if(i<3)await expect(createCharacterRun(model,data(rows.filter(v=>v!==row)))).rejects.toThrow('context missing');
 }
 console.info('M110 ADMISSION PASS0.87:19 original and100 opportunity inputs;0.86:16 admitted/19 rejected; each source duplicate/101st/out-of-time; mandatory missing; mixed bundle rejected. No100-update runtime claim.');
},170000);
