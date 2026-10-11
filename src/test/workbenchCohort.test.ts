import {expect,it} from 'vitest';
import {aggregateParticipation,type AuditMember} from '../workbench/participationCohort';
import {participationReport} from '../workbench/participation';
const member=(runHash:string,modelHash:string,paths:string[]):AuditMember=>({name:runHash,seamVersion:'seam/1',report:participationReport({runHash,modelHash,saveHash:'s',stateHash:'t',prefix:1},[],paths.map(path=>({path,root:'1'})))});
it('keeps missing observations unknown and separates identical paths in different models',()=>{
 const a=member('a','model1',['p']),b=member('b','model1',[]),c=member('c','model2',['p']);
 const result=aggregateParticipation([a,b,c]);expect(result.groups).toHaveLength(2);
 expect(result.groups[0].paths[0]).toMatchObject({observedInRuns:1,notObservedInRuns:1,readInRuns:0});
 expect(result.groups[0].paths[0].observations[1].row).toBeNull();
 result.members[0].report.rows[0].reads=42;expect(a.report.rows[0].reads).toBe(0);
});
it('rejects cumulative duplicate prefixes and invalid counts instead of inflating totals',()=>{
 const a=member('a','m',['p']);expect(()=>aggregateParticipation([a,a])).toThrow('one prefix');
 a.report.rows[0].changes=1;expect(()=>aggregateParticipation([a])).toThrow('counts');
});
it('retains unequal horizons and limits the cohort explicitly',()=>{
 const a=member('a','m',['p']),b=member('b','m',['p']);b.report.identity.prefix=9;
 expect(aggregateParticipation([a,b]).groups[0].paths[0].observations.map(o=>o.prefix)).toEqual([1,9]);
 expect(()=>aggregateParticipation(Array.from({length:65},(_,i)=>member(String(i),'m',[])))).toThrow('64');
});
