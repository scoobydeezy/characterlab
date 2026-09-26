import {it,expect} from 'vitest';
import {createCravingRun,restoreCravingRun,LAWS,type Law,type Frame} from '../campaign3/craving';
import {cravingCases} from './cravingFixtures';
import source from '../../docs/planning/CRAVING_SOURCES_REV1.json';
const cases=cravingCases(source.packets),observer=source.packets.depleted.observer;
function run(name:keyof typeof cases,law:Law='MeanProduct'){const r=createCravingRun(law,observer,cases[name]);while(r.step());return r.snapshot();}
it('learned relief and admitted bodily change independently change represented urge',()=>{
 const mixed=run('mixed'),good=run('reliable'),bad=run('ineffective'),full=run('full');
 expect(mixed.rows[2].belief).toBe('1/2');expect(good.rows[2].belief).toBe('1/1');expect(bad.rows[2].urge).toBe('0/1');
 expect(mixed.rows[2].urge).not.toBe(good.rows[2].urge);expect(mixed.rows[3].urge).not.toBe(mixed.rows[2].urge);expect(mixed.rows[3].belief).toBe(mixed.rows[2].belief);expect(full.rows[2].urge).toBe('0/1');
});
it('unknown, denied evidence and known ineffective are distinct; learning is causal',()=>{
 for(const name of ['unknown','withheld','denied'] as const)expect(run(name).rows[2].urge).toBeNull();
 expect(run('ineffective').rows[2].urge).toBe('0/1');
 const corrected=run('correction'),base=run('mixed');expect(corrected.rows[2]).toEqual(base.rows[2]);expect(corrected.rows[3].belief).toBe('1/3');
 expect(run('mixed','NoLearning').history).toEqual([]);
});
it('cue access, current action availability and restraint do not overwrite acquired belief',()=>{
 const base=run('mixed'),hidden=run('noCue'),recalled=run('recall');expect(hidden.history).toEqual(base.history);expect(hidden.rows[2].urge).toBeNull();expect(recalled.rows[2].urge).toBe(base.rows[2].urge);
 for(const name of ['unavailable','restrained'] as const){const x=run(name);expect(x.rows[2].urge).toBe(base.rows[2].urge);expect(x.rows[2].eligible).toBe(false);}expect(base.rows[2].eligible).toBe(true);
});
it('whole character views ignore both private report truth and aliased bodily truth',()=>{
 for(const law of LAWS){expect(run('mixed',law)).toEqual(run('falseReports',law));expect(run('hidden6',law)).toEqual(run('hidden9',law));}
 expect(source.results.hidden6.sourceState).not.toBe(source.results.hidden9.sourceState);
});
it('mean/bottleneck/latest comparators give independently calculated fractions',()=>{
 expect(source.packets.depleted.pressures).toEqual(['5/6','1/2']);
 expect(run('mixed').rows.slice(2).map(r=>r.urge)).toEqual(['5/12','1/4']);
 expect(run('mixed','MeanBottleneck').rows.slice(2).map(r=>r.urge)).toEqual(['1/2','1/2']);
 expect(run('mixed','LatestProduct').rows.slice(2).map(r=>r.urge)).toEqual(['5/6','1/2']);
});
it('all component prefixes restore; saves reject changed law, observer and source',()=>{
 const r=createCravingRun('MeanProduct',observer,cases.mixed);for(let i=0;i<=4;i++){const saved=r.save();expect(restoreCravingRun('MeanProduct',observer,cases.mixed,saved).snapshot()).toEqual(r.snapshot());expect(()=>restoreCravingRun('LatestProduct',observer,cases.mixed,saved)).toThrow();expect(()=>restoreCravingRun('MeanProduct','different',cases.mixed,saved)).toThrow();if(i<4)r.step();}
 expect(()=>restoreCravingRun('MeanProduct',observer,cases.reliable,r.save())).toThrow();const snap=r.snapshot();snap.history.length=0;expect(r.snapshot().history).toHaveLength(2);const end=r.save();expect(r.step()).toBe(false);expect(r.save()).toEqual(end);
});
it('rejects malformed pressure and out-of-domain report inputs',()=>{
 for(const body of ['2/1','2/4','1/0','-1/2']){const xs=structuredClone(cases.mixed);xs[2].body=body;expect(()=>createCravingRun('MeanProduct',observer,xs)).toThrow();}
 const xs=structuredClone(cases.mixed) as Frame[];xs[0].report=2 as 1;expect(()=>createCravingRun('MeanProduct',observer,xs)).toThrow();
});
