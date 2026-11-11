import {it,expect,vi} from 'vitest';
import {readQ} from '../campaign2/cognitiveMath';
import * as reasons from '../assembled/reasons';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileReasonEvidence,reasonReading,REASON_EVIDENCE,REASON_PRODUCED} from '../assembled/reasonEvidence';
import {fixture,create,capture,correspondence,snap,through,decode,items,key,enc,rec,f,uint,q,list,set,text,u,signed,sid,nativeProjection} from './fixtures/assembledReasonEvidence';
import {exact,finish} from './fixtures/assembledAffectReceiving';
import {transcript} from './fixtures/assembledDecisionAlternatives';
let same:Awaited<ReturnType<typeof create>>,collective:Awaited<ReturnType<typeof create>>,denied:Awaited<ReturnType<typeof create>>;
it('M86 native: collective support joins the actual decision without double counting',async()=>{
 same=await create(2);collective=await create(3);denied=await create(3,[false,false]);
 const a=capture(same.run),b=capture(collective.run),c=capture(denied.run);
 expect(a.produced).toHaveLength(2);expect(b.produced).toHaveLength(3);expect(c.produced).toHaveLength(0);expect(c.rejected).toHaveLength(3);
 expect(b.samples).toHaveLength(2);expect(typeof b.frozen[3]!=='boolean'&&b.frozen[3].kind==='record','real frozen SEM').toBe(true);
 correspondence(b,collective.b.s);
 const rational=(v:Parameters<typeof readQ>[0])=>{const q=readQ(v);return q.numerator+'/'+q.denominator;};
 const atomCount=(v:Parameters<typeof readQ>[0])=>{if(typeof v==='boolean'||v.kind!=='map')throw Error('basis map');return v.entries.length;};
 const details=(p:ReturnType<typeof capture>)=>({bases:p.ns.map(n=>rational(f(rec(f(rec(n,407n),2n),406n),1n))),dice:p.ns.map(n=>uint(f(rec(n,407n),4n)).toString()),probabilities:key(f(p.data,2n)),drawCount:transcript(p.data).length,coverage:items(items(p.compilation!,'list')[1],'list').flatMap(g=>items(items(g,'list')[3],'list').map(v=>{const r=items(v,'list');return {label:items(r[0],'list')[0],role:uint(r[1]).toString(),magnitude:rational(r[3]),overlap:rational(r[4]),effective:rational(r[6]),atoms:atomCount(f(rec(r[7],400n),1n))};}))});
 console.info('M86 DIAGNOSTIC '+JSON.stringify({same:details(a),collective:details(b),deniedProbabilities:key(f(c.data,2n)),nativeProbabilitiesSame:key(f(a.data,2n))===key(f(b.data,2n)),permittedChangesProbabilities:key(f(b.data,2n))!==key(f(c.data,2n))}));
 expect(key(set(a.ns.map(nativeProjection)))).toBe(key(set(b.ns.map(nativeProjection))));expect(f(a.data,2n)).toEqual(f(b.data,2n));
 expect(f(b.data,2n),'permitted evidence changes native probabilities').not.toEqual(f(c.data,2n));
 const draws=transcript(a.data);expect(draws.length,'live shared non-Auto draws').toBeGreaterThan(0);expect(draws).toEqual(transcript(b.data));
 const groups=items(items(b.compilation!,'list')[1],'list'),coverage=groups.flatMap(g=>items(items(g,'list')[3],'list').map(v=>items(v,'list')));
 for(const p of b.produced){const d=items(p,'list')[1],row=coverage.find(r=>key(r[0])===key(reasons.descriptionIdentity(d)))!;expect(row).toBeDefined();if(key(items(d,'list')[0])===key(text('combined'))){expect(row[4]).toEqual(q(1,1));expect(row[6]).toEqual(q(0,1));}else expect(row[6]).not.toEqual(q(0,1));}
 const old=collective.b.old,run=await createCharacterRun(await prepareCharacterModel(old.s),old.d);await through(run,10n);
 const outputs=items(decode(snap(run).outputs),'list'),d=outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===409n&&key(f(v,2n))===key(signed(10)))!,data=f(rec(f(rec(d,409n),4n),419n),2n);
 expect(f(rec(data,420n),2n)).toEqual(f(c.data,2n));
 console.info('M86 NATIVE PASS same/collective probabilities equal; independent permitted evidence changes probabilities; shared actual draws='+draws.length+'; denied agrees with retained0.75 probabilities');
},570000);
it('M86 privacy and missing support: denied/absent/zero sources never become motivation',async()=>{
 const hidden=await create(3,[true,true],true),partial=await create(3,[true,false]),zero=await create(3,[true,true],false,true);
 const h=capture(hidden.run),p=capture(partial.run),z=capture(zero.run),normal=capture(collective.run);
 expect(h.report).toEqual(normal.report);expect(h.ns).toEqual(normal.ns);expect(f(h.data,2n)).toEqual(f(normal.data,2n));expect(transcript(h.data)).toEqual(transcript(normal.data));
 expect(p.samples).toHaveLength(1);expect(p.produced).toHaveLength(1);expect(p.rejected.map(v=>items(v,'list')[1])).toEqual([text('MissingEvidence'),text('MissingEvidence')]);
 expect(z.produced).toHaveLength(0);expect(z.rejected.map(v=>items(v,'list')[1])).toEqual([text('Zero'),text('Zero'),text('Zero')]);
 console.info('M86 PRIVACY PASS hidden diagnostic unchanged cognition; absent second channel suppresses dependent descriptions; zero samples reject all three sources');
},570000);
it('M86 persistence and rollback: one transaction and exact continued save',async()=>{
 const a=await create(3,[true,true],false,false,9n),b=await create(3,[true,true],false,false,9n);exact(a.run,b.run);
 const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,restored);
 for(const at of [10n,11n]){for(const run of [a.run,b.run,restored])await through(run,at);exact(a.run,b.run);exact(a.run,restored);}
 for(const run of [a.run,b.run,restored])await finish(run);exact(a.run,b.run);exact(a.run,restored);
 const fault=await create(3,[true,true],false,false,9n),before=fault.run.snapshot(),original=reasons.compileDescribedReasons;let reached=false;
 const spy=vi.spyOn(reasons,'compileDescribedReasons').mockImplementation((raw,dice,max)=>{const result=original(raw,dice,max);if(items(f(rec(raw,403n),6n),'list').some(v=>key(items(v,'list')[0])===key(text('combined')))){reached=true;throw Error('M86 after actual source compilation');}return result;});
 try{await expect(fault.run.settleNextInstant()).rejects.toThrow('M86 after actual source compilation');expect(reached).toBe(true);expect({...fault.run.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 console.info('M86 PERSISTENCE PASS repeat9/restore9->10->11->101; failure after actual source compilation rolls whole instant back');
},570000);
it('M86 admission: governed descriptions and original evidence domain stay closed',async()=>{
 const b=fixture(),model=await compileCharacterModel(b.s),slot=items(decode(b.s.registry),'list')[45],rows=items(items(slot,'list')[1],'list');
 const bad=(n:number,value:ReturnType<typeof text>)=>{const d=[...items(rows[0],'list')];d[n]=value;return list([text(REASON_EVIDENCE),list([list(d)])]);};
 expect(()=>compileReasonEvidence(bad(0,text('primary')),model.strategy!,[])).toThrow('label');
 expect(()=>compileReasonEvidence(list([text(REASON_EVIDENCE),list([rows[0],rows[0]])]),model.strategy!,[])).toThrow('label');
 const d=[...items(rows[0],'list')];d[4]=set([u(3)]);expect(()=>compileReasonEvidence(list([text(REASON_EVIDENCE),list([list(d)])]),model.strategy!,[])).toThrow('channels');
 expect(()=>reasonReading(list([q(2,1),q(1,1),true,true,q(0,1)]))).toThrow('domain');
 await expect(createCharacterRun(await prepareCharacterModel(b.old.s),b.d)).rejects.toThrow('version/capacity');
 console.info('M86 ADMISSION PASS old model rejects reading input; duplicate/reserved labels and invalid channels/readings reject');
},120000);
