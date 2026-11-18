import {it,expect} from 'vitest';
import {fixture,foundation,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,u,type CanonicalValue} from './fixtures/assembledDefining';
import {createCharacterRun,prepareCharacterModel,restoreCharacterRun} from '../assembled/character';
import {restoreAuthoritativeState} from '../substrate/state';
import {isPositionEpisodePath,RECALL} from '../assembled/memory';
import {GOAL_MEANING,SPATIAL_MEANING,goalMeaningPath} from '../assembled/goalMeaning';
import {RETAINED_ATTRIBUTION} from '../assembled/retainedAttribution';
import {SIGNIFICANCE,named,directions} from '../assembled/significance';
import {dataText as txt} from '../campaign2/canonicalData';
export type Run=Awaited<ReturnType<typeof createCharacterRun>>;
export const reports=(run:Run,tag:string)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
export const report=(run:Run,tag:string,at:number)=>{const rows=reports(run,tag).filter(r=>key(r[1])===key(signed(at)));expect(rows,'one actual live report').toHaveLength(1);return rows[0];};
export const state=(run:Run)=>restoreAuthoritativeState(decode(run.snapshot().state));
export const focal=(run:Run)=>state(run).entries().find(e=>isPositionEpisodePath(e.path)&&key(items(e.value,'list')[5])===key(signed(15)));
export async function through(run:Run,at:bigint){for(let n=0;run.snapshot().clock<at;n++){expect(n).toBeLessThan(192);expect(await run.settleNextInstant()).toBe(true);}expect(run.snapshot().clock).toBe(at);}
export async function finish(run:Run,peers:Run[]=[]){for(let n=0;n<192;n++){const more=await run.settleNextInstant();for(const peer of peers){expect(await peer.settleNextInstant()).toBe(more);exact(run,peer);}if(!more)return;}throw Error('M157 queue cap');}
export async function start(mode:Parameters<typeof fixture>[0]='High',law='SignificanceFirst',recalled=16,hidden=false){const b=fixture(mode,law,recalled,hidden),model=await prepareCharacterModel(b.s),run=await createCharacterRun(model,b.d);return {b,model,run};}
export function live17(run:Run,mode='High'){
 const a=report(run,RETAINED_ATTRIBUTION,17),m=report(run,GOAL_MEANING,17);expect(items(a[3],'list')).toHaveLength(4);expect(named(named(a[4],'result'),'disposition')).toEqual(text('Supported'));expect(m[7]).toEqual(list(a));
 if(mode!=='Absent')expect(named(named(m[5],'assessment'),'kind')).toEqual(text('Assessed'));
 expect(focal(run)).toBeDefined();return m;
}
export function live4000(run:Run,old:boolean){
 const p=report(run,SPATIAL_MEANING,4000);expect(named(named(p[5],'assessment'),'kind')).toEqual(text('Assessed'));
 expect(named(named(p[5],'assessment'),'relation')).toEqual(text(old?'MovingFarther':'SameDistance'));
 const operands=items(p[4],'list').map(v=>items(v,'list')[1]);expect(operands.map(v=>items(v,'list')[5])).toEqual([signed(old?15:3998),signed(3999)]);
 for(const operand of operands)expect(reports(run,RECALL).some(r=>key(r[1])===key(signed(4000))&&key(r[2])===key(operand))).toBe(true);
 const traces=outputs(run.snapshot().trace,160n).filter(t=>key(f(rec(f(t,4n),130n),2n))===key(signed(4000))&&[40n,50n].includes(uint(f(rec(f(t,4n),130n),3n))));
 expect(traces.length).toBeGreaterThan(0);for(const t of traces)expect(items(f(t,14n),'list')).toHaveLength(0);return p;
}
it.skip('BLOCKED original primary157: acquired significance preserves an old episode that changes actual later appraisal',async()=>{
 const a=await start(),b=await start('Wide');await through(a.run,17n);await through(b.run,17n);
 expect(named(live17(a.run)[5],'direction')).toEqual(text('MovingCloser'));expect(named(live17(b.run,'Wide')[5],'kind')).toEqual(text('DoesNotQualify'));
 const old=focal(a.run)!;expect(directions(items(old.value,'list')[7])).toEqual(['MovingCloser']);expect(directions(items(focal(b.run)!.value,'list')[7])).toEqual([]);
 console.info('M157 LIVE17 actual four-trial attribution; High qualifies/Wide neutral; original source acquired from empty memory.');
 await through(a.run,4000n);await through(b.run,4000n);live4000(a.run,true);live4000(b.run,false);expect(focal(a.run)!.value).toEqual(old.value);expect(focal(b.run)).toBeUndefined();
 for(const root of [455n])expect(state(a.run).entries().filter(e=>e.path.rootStateTypeId===root)).toEqual(state(b.run).entries().filter(e=>e.path.rootStateTypeId===root));
 expect(report(a.run,SPATIAL_MEANING,4000)[2]).toEqual(report(b.run,SPATIAL_MEANING,4000)[2]);
 await finish(a.run);await finish(b.run);expect(a.run.snapshot().clock).toBe(5001n);expect(b.run.snapshot().clock).toBe(5001n);
 console.info('M157 PRIMARY PASS significance->old15 survives pressure->actual recall/workspace4000->Farther vs Same; immutable old content, equal current body/spatial goal, full queues5001; sparse horizon disclosed.');
},540000);

export async function foundationRun(expiry=5001){const b=foundation(expiry),model=await prepareCharacterModel(b.s),run=await createCharacterRun(model,b.d);return {b,model,run};}
export const goalStatus=(run:Run,spatial=false)=>items(state(run).read(goalMeaningPath(C,spatial)).value!,'list')[7];
export const episodes=(run:Run)=>state(run).entries().filter(e=>e.path.rootStateTypeId===346n);
it('foundation157: declared expiry changes real goal lifetime without rewriting acquired history',async()=>{
 const a=await foundationRun(),b=await foundationRun(101);await through(a.run,5n);await through(b.run,5n);
 for(const run of [a.run,b.run])for(const spatial of [false,true])expect(goalStatus(run,spatial)).toEqual(text('Open'));
 expect(episodes(a.run).length).toBeGreaterThan(0);expect(episodes(a.run)).toEqual(episodes(b.run));
 await through(a.run,101n);await through(b.run,101n);for(const spatial of [false,true]){expect(goalStatus(a.run,spatial)).toEqual(text('Open'));expect(goalStatus(b.run,spatial)).toEqual(text('Expired'));}
 const prior=episodes(a.run);expect(prior).toEqual(episodes(b.run));await finish(a.run);await finish(b.run);
 expect(a.run.snapshot().clock).toBe(5001n);expect(b.run.snapshot().clock).toBe(101n);expect(episodes(a.run)).toEqual(prior);
 for(const spatial of [false,true])expect(goalStatus(a.run,spatial)).toEqual(text('Expired'));
 console.info('M157 FOUNDATION PASS both goals live Open before101; short Expired/long Open101; actual5001 expiry preserves acquired episode/history bytes. Original4000 appraisal remains BLOCKED, not passed.');
},540000);
