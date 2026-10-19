import {expect,it,vi} from 'vitest';
import {advanceSubstitutionBoundaries} from '../workbench/substitutionRunLoop';
import {SubstitutionWorkbenchRun} from '../workbench/substitutionAdapter';

function deferred(){let resolve!:()=>void;const promise=new Promise<void>(r=>{resolve=r;});return {promise,resolve};}
function client(gate?:Promise<void>,terminal=8){
 let prefix=0;
 return {snapshot:()=>({complete:prefix===terminal}),prefix:()=>prefix,
  advance:vi.fn(async()=>{await gate;if(prefix===terminal)return false;prefix++;return true;})};
}
it.each(['pause','route deactivation'])('%s completes the in-flight opportunity and permits exact continuation',async()=>{
 const gate=deferred(),c=client(gate.promise);let stop=false;const commits:number[]=[];
 const options={clients:[c],limit:8,stopped:()=>stop,alive:()=>true,committed:()=>commits.push(c.prefix())};
 const running=advanceSubstitutionBoundaries(options);
 expect(c.advance).toHaveBeenCalledTimes(1);stop=true;gate.resolve();await running;
 expect(c.prefix()).toBe(1);expect(commits).toEqual([1]);
 stop=false;await advanceSubstitutionBoundaries(options);
 expect(c.prefix()).toBe(8);expect(commits).toEqual([1,2,3,4,5,6,7,8]);
});
it('pause during the first side finishes both sides but starts no next pair boundary',async()=>{
 const gate=deferred(),a=client(gate.promise),b=client();let stop=false;const committed=vi.fn();
 const running=advanceSubstitutionBoundaries({clients:[a,b],limit:8,stopped:()=>stop,alive:()=>true,committed});
 stop=true;expect(b.advance).not.toHaveBeenCalled();gate.resolve();await running;
 expect([a.prefix(),b.prefix()]).toEqual([1,1]);expect(committed).toHaveBeenCalledTimes(1);
});
it('disposal during an in-flight response prevents the next side and publication',async()=>{
 const gate=deferred(),a=client(gate.promise),b=client();let alive=true;const committed=vi.fn();
 const running=advanceSubstitutionBoundaries({clients:[a,b],limit:8,stopped:()=>false,alive:()=>alive,committed});
 alive=false;gate.resolve();await running;
 expect(b.advance).not.toHaveBeenCalled();expect(committed).not.toHaveBeenCalled();
});
it('does no work after stop and respects step and individual terminal boundaries',async()=>{
 const a=client(undefined,1),b=client(undefined,3),options={clients:[a,b],limit:1,stopped:()=>true,alive:()=>true};
 await advanceSubstitutionBoundaries(options);expect(a.advance).not.toHaveBeenCalled();
 await advanceSubstitutionBoundaries({...options,stopped:()=>false});expect([a.prefix(),b.prefix()]).toEqual([1,1]);
 await advanceSubstitutionBoundaries({...options,stopped:()=>false,limit:8});
 expect([a.prefix(),b.prefix()]).toEqual([1,3]);expect(a.advance).toHaveBeenCalledTimes(1);expect(b.advance).toHaveBeenCalledTimes(3);
});
it('propagates a failed side without publishing a falsely committed pair',async()=>{
 const a=client(),b={snapshot:()=>({complete:false}),advance:vi.fn(async()=>{throw Error('worker failed');})},committed=vi.fn();
 await expect(advanceSubstitutionBoundaries({clients:[a,b],limit:8,stopped:()=>false,alive:()=>true,committed})).rejects.toThrow('worker failed');
 expect(a.prefix()).toBe(1);expect(committed).not.toHaveBeenCalled();expect(b.advance).toHaveBeenCalledTimes(1);
});
it('paused and uninterrupted component pairs retain identical exact checkpoints',async()=>{
 const ids=['LatestHistory/diversified','LatestHistory/falseTraining'];
 const paused=await Promise.all(ids.map(id=>SubstitutionWorkbenchRun.create(id)));
 const direct=await Promise.all(ids.map(id=>SubstitutionWorkbenchRun.create(id)));
 let stop=false;
 await advanceSubstitutionBoundaries({clients:paused,limit:8,stopped:()=>stop,alive:()=>true,committed:()=>{stop=true;}});
 expect(paused.map(c=>c.snapshot().prefix)).toEqual([1,1]);
 stop=false;await advanceSubstitutionBoundaries({clients:paused,limit:8,stopped:()=>stop,alive:()=>true});
 for(let i=0;i<8;i++)for(const c of direct)await c.advance();
 expect(paused.map(c=>c.checkpoint())).toEqual(direct.map(c=>c.checkpoint()));
},600000);
