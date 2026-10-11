import {expect,it} from 'vitest';
import {stateParticipation,participationReport} from '../workbench/participation';
import type {TimelineEvent} from '../workbench/contracts';
const event = (id:string, reads: TimelineEvent['reads'], diffs:TimelineEvent['diffs']):TimelineEvent=>({id,instant:'1',phase:'1',stage:'test',parents:[],reads,diffs,input:'',output:'',draws:'',quantization:''});
it('retains unread present paths, absent reads, no-op mutations and removed historical paths separately',()=>{
  const events = [event('1',[{path:'absent',label:'Absent root',exact:'Absent'}],[{path:'gone',label:'Deleted',before:'1',after:'Absent',changed:true},{path:'same',label:'Unchanged',before:'2',after:'2',changed:false}]),event('2',[{path:'same',label:'Unchanged',exact:'2'}],[])];
  const rows = stateParticipation(events,[{path:'same',root:'1'},{path:'quiet',root:'2'}]);
  expect(rows.map(r=>r.path)).toEqual(['absent','gone','quiet','same']);
  expect(rows.find(r=>r.path==='absent')).toMatchObject({reads:1,changes:0,presentAtRevision:false});
  expect(rows.find(r=>r.path==='gone')).toMatchObject({mutations:1,changes:1,presentAtRevision:false});
  expect(rows.find(r=>r.path==='quiet')).toMatchObject({reads:0,mutations:0,presentAtRevision:true,events:[]});
  expect(rows.find(r=>r.path==='same')).toMatchObject({reads:1,mutations:1,changes:0,presentAtRevision:true});
  const report = participationReport({modelHash:'m',runHash:'r',saveHash:'s',stateHash:'t',prefix:1},events,[]);
  report.rows[0].events[0].stage='edited'; expect(events[0].stage).toBe('test');
  expect(report.scope.causalContribution).toContain('Not established');
});
it('rejects duplicate event identities instead of double-counting a corrupted prefix',()=>{
  const e=event('1',[],[]); expect(()=>stateParticipation([e,e],[])).toThrow('Duplicate');
});
