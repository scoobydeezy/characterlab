import {it,expect} from 'vitest';
import {current,items,key,enc,list,decode} from './fixtures/assembledDefiningControls';
import {text,signed,u,exact} from './fixtures/assembledDefining';
import {RETENTION_LAWS_RULES,RETENTION_LAWS_REGISTRY,REHEARSAL_RULES,REHEARSAL_REGISTRY,compileCharacterModel} from '../assembled/model';
import {createCharacterRun,prepareCharacterModel,restoreCharacterRun} from '../assembled/character';
import {compileMemoryUse,MEMORY_USE,type MemoryUseLaw} from '../assembled/memoryUse';
import {retainedEpisodeIds,RETENTION} from '../assembled/retention';
import {retainSignificanceFirst,retainSharedProtectionTier} from '../campaign3/significanceFirstRetention';
import {retainWithUseProtection} from '../campaign3/useProtectedRetention';
import {retainByRecency} from '../campaign3/recencyRetention';
import {REHEARSAL} from '../assembled/rehearsal';
import {RECALL,isPositionEpisodePath} from '../assembled/memory';
import {SPATIAL_MEANING} from '../assembled/goalMeaning';
import {named,directions} from '../assembled/significance';
import {state,through,finish,reports,report,live17,focal,type Run} from './assembledDefining.test';
const laws:MemoryUseLaw[]=['SignificanceFirst','SharedProtection','UseOnly','AgeOnly'];
const kernels={SignificanceFirst:retainSignificanceFirst,SharedProtection:retainSharedProtectionTier,UseOnly:retainWithUseProtection,AgeOnly:retainByRecency};
// No social dependencies. Real four trials, body30/rate10, seed0, goal17,
// pressure18..30, current positions3998/3999, appraisal4000, full tail5001.
// Delay spatial goal until18 in EVERY arm: initial17 grants significance only.
export function fixture168(law:MemoryUseLaw='SignificanceFirst'){
 const b=current('High',law),slots=[...items(decode(b.s.registry),'list')],spatial=[...items(slots[37],'list')];spatial[2]=u(18);slots[37]=list(spatial);
 slots[9]=list([...items(slots[9],'list'),text('PresentationFrequency')]);
 slots.push(list([text(REHEARSAL),signed(17),list([])]));
 return {...b,s:{...b.s,rulesVersion:RETENTION_LAWS_RULES,registrySchemaVersion:RETENTION_LAWS_REGISTRY,registry:enc(list(slots))}};
}
async function start(law:MemoryUseLaw){const b=fixture168(law),m=await prepareCharacterModel(b.s);return {b,run:await createCharacterRun(m,b.d)};}
function live(run:Run,law:MemoryUseLaw){
 const keep=law==='SignificanceFirst'||law==='SharedProtection',a=report(run,SPATIAL_MEANING,4000),assessment=named(a[5],'assessment');
 expect(named(assessment,'kind')).toEqual(text('Assessed'));
 expect(named(assessment,'relation')).toEqual(text(keep?'MovingFarther':'SameDistance'));
 const operands=items(a[4],'list').map(v=>items(v,'list')[1]);
 expect(operands.map(v=>items(v,'list')[5])).toEqual([signed(keep?15:3998),signed(3999)]);
 for(const v of operands)expect(reports(run,RECALL).some(r=>key(r[1])===key(signed(4000))&&key(r[2])===key(v))).toBe(true);
}
it('policies168: exact four original laws and versioned admission',async()=>{
 console.info("M168 policy start");let comparisons=0;
 for(const tied of [true,false])for(let sig=0;sig<8;sig++)for(let use=0;use<8;use++)for(let cap=0;cap<=3;cap++){
  const rows=Array.from({length:3},(_,i)=>({acquisition:BigInt(i+1),acquiredAt:tied?1n:BigInt(i+1),kind:'body' as const,significant:!!(sig&(1<<i)),useProtection:!!(use&(1<<i))}));
  const old=rows.map(r=>({id:r.acquisition,acquiredAt:r.acquiredAt,kind:'EventContinuant' as const,units:[{key:'episode',views:[enc(list([]))],useProtection:r.useProtection,outcomeSignificanceDirections:r.significant?['MovingFarther' as const]:[]}]}));
  for(const law of laws){expect(retainedEpisodeIds(rows,4n,{body:cap,diagnostic:0},law)).toEqual(kernels[law](old,4n,{EventContinuant:cap,Interoceptive:0}).acquisitions.map(x=>x.id));comparisons++;if(comparisons%512===0)console.info("M168 policy comparisons "+comparisons);}
 }
 expect(comparisons).toBe(2048);
 const distinctive=[{acquisition:1n,acquiredAt:1n,kind:'body' as const,significant:true},{acquisition:2n,acquiredAt:2n,kind:'body' as const,useProtection:true},{acquisition:3n,acquiredAt:3n,kind:'body' as const}];
 expect(laws.map(law=>retainedEpisodeIds(distinctive,4n,{body:1,diagnostic:0},law))).toEqual([[1n],[2n],[2n],[3n]]);
 for(const law of laws){expect(compileMemoryUse(list([text(MEMORY_USE),text(law)]),true)).toBe(law);if(law==='SharedProtection'||law==='UseOnly')expect(()=>compileMemoryUse(list([text(MEMORY_USE),text(law)]))).toThrow();}
 expect(()=>compileMemoryUse(list([text(MEMORY_USE),text('Unknown')]),true)).toThrow();
 for(const law of laws){expect(()=>retainedEpisodeIds([{...distinctive[0],acquiredAt:4n}],4n,{body:1,diagnostic:0},law)).toThrow('episode');expect(()=>retainedEpisodeIds(distinctive,4n,{body:1025,diagnostic:0},law)).toThrow('capacity');}
 expect(()=>retainedEpisodeIds(distinctive,4n,{body:1,diagnostic:0},'Unknown' as MemoryUseLaw)).toThrow('law');
 const b=fixture168('SharedProtection');
 await expect(compileCharacterModel({...b.s,rulesVersion:REHEARSAL_RULES,registrySchemaVersion:REHEARSAL_REGISTRY})).rejects.toThrow('retention law');
 console.info('M168 POLICIES PASS 2048 exact original-kernel comparisons; strict significance/use/recency separation; fresh credit/capacity/law and legacy admission negatives.');
},175000);
for(const law of ['SignificanceFirst','SharedProtection','UseOnly'] as const)it('native168 '+law+': actual historical significance competes under one retained policy',async()=>{
 const a=await start(law);await through(a.run,17n);live17(a.run);
 const old=focal(a.run)!.value,fields=items(old,'list');expect(directions(fields[7])).toEqual(['MovingCloser']);expect(fields[9]).toBe(false);
 expect(named(named(report(a.run,SPATIAL_MEANING,17)[5],'assessment'),'kind')).toEqual(text('Unavailable'));
 await through(a.run,4000n);live(a.run,law);
 if(law==='UseOnly')expect(focal(a.run)).toBeUndefined();else expect(items(focal(a.run)!.value,'list').slice(0,9)).toEqual(fields.slice(0,9));
 const receipts=reports(a.run,RETENTION);expect(receipts.length).toBeGreaterThan(10);
 for(const row of receipts)expect(row[6]).toEqual(text(law));
 const first=receipts.find(r=>key(r[1])===key(signed(18)))!,meta=items(first[7],'list').map(v=>items(v,'list')),id=(fields[1] as {payload:{value:bigint}}).payload.value;
 expect(meta.find(r=>(r[0] as {value:bigint}).value===id)?.slice(1)).toEqual([false,true]);
 await finish(a.run);expect(a.run.snapshot().clock).toBe(5001n);
 console.info('M168 NATIVE PASS '+law+' actual Supported significance17, unused old15; live4000 '+(law==='UseOnly'?'SameDistance, old15 lost':'MovingFarther, old15 retained')+'; B0 receipt false/true and full queue5001.');
},390000);
it('continuation168: SharedProtection public checkpoint17 and every later byte',async()=>{
 const a=await start('SharedProtection');await through(a.run,17n);live17(a.run);const save=a.run.save();
 const b=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save});exact(a.run,b);
 await finish(a.run,[b]);expect(a.run.snapshot().clock).toBe(5001n);live(a.run,'SharedProtection');live(b,'SharedProtection');
 expect(state(a.run).entries().filter(e=>isPositionEpisodePath(e.path))).toEqual(state(b).entries().filter(e=>isPositionEpisodePath(e.path)));
 console.info('M168 CONTINUATION PASS original-input restore17 and EVERY later state/output/trace/save/run byte through5001, live appraisal both.');
},590000);
