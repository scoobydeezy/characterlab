import {it,expect} from 'vitest';
import {compareGeneralSnapshots,GENERAL_COMPARISONS} from '../workbench/generalComparison';
import catalog from '../workbench/generalComparisonCatalog.json';
import {GeneralWorkbenchRun,type GeneralSnapshot} from '../workbench/generalAdapter';
import type {TimelineEvent} from '../workbench/contracts';
const fixture=(recipe:string):GeneralSnapshot=>{const m=catalog.models.find(m=>m.recipe===recipe)!;return {recipe,seamVersion:'test',prefix:1,clock:'1',complete:false,modelHash:m.modelHash,runHash:m.runHash,stateHash:'state',saveHash:'save',graph:null,graphPath:null,fields:[],timeline:[]};};
const event=(id:string):TimelineEvent=>({id,instant:'1',phase:'10',stage:'sample',parents:[],reads:[],diffs:[],input:'[]',output:'[]',draws:'[]',quantization:'[]'});
it('does not align unequal horizons, changed seed identities or unsupported RNG',()=>{
 const p=GENERAL_COMPARISONS[0],a=fixture(p.control),b=fixture(p.candidate);
 expect(compareGeneralSnapshots(p.id,a,{...b,clock:'2'}).status).toBe('UNALIGNED_HORIZONS');
 expect(()=>compareGeneralSnapshots(p.id,a,{...b,runHash:'another seed'})).toThrow('identity');
 expect(compareGeneralSnapshots(p.id,{...a,timeline:[{...event('1'),draws:'[1]'}]},b).status).toBe('UNQUALIFIED_RNG_CORRESPONDENCE');
});
it('preserves absence, reorders by exact identities and exposes ambiguous event slots',()=>{
 const p=GENERAL_COMPARISONS[0],a=fixture(p.control),b=fixture(p.candidate),weight={units:'1',exact:'1/2',display:0.5};
 a.graph={version:'association-inspection/0.1',scale:'2',updatedAt:'1',nodes:[{id:'a',label:'A',exact:'a'},{id:'b',label:'B',exact:'b'}],weights:[[weight,{...weight,units:'0',exact:'0/1',display:0}],[weight,weight]]};
 b.graph={...a.graph,nodes:[a.graph.nodes[1],a.graph.nodes[0]],weights:[[weight,weight],[{...weight,units:'0',exact:'0/1',display:0},weight]]};
 a.fields=[{path:'present',root:'1',exact:'0'}];b.fields=[];a.timeline=[event('1'),event('2')];b.timeline=[event('1')];
 const r=compareGeneralSnapshots(p.id,a,b);if(r.status!=='ALIGNED_COMMITTED_INSTANT')throw Error('Expected alignment');expect(r.fields[0]).toEqual({path:'present',before:'0',after:null,changed:true});expect(r.events[0].status).toBe('AMBIGUOUS_STAGE_SLOT');expect(r.events[0].outputsEqual).toBeNull();if(r.graph.status!=='IDENTITY_ALIGNED')throw Error('Expected graph');expect(r.graph.cells.every(c=>!c.changed)).toBe(true);
 b.graph.nodes=[b.graph.nodes[0]];b.graph.weights=[[weight]];b.timeline=[];const missing=compareGeneralSnapshots(p.id,a,b);if(missing.status!=='ALIGNED_COMMITTED_INSTANT'||missing.graph.status!=='IDENTITY_ALIGNED')throw Error('Expected alignment');expect(missing.graph.cells.some(c=>c.after===null)).toBe(true);expect(missing.events[0].status).toBe('MISSING_SIDE');
});
it('compares real frozen prefixes without mutating either run',async()=>{
 const p=GENERAL_COMPARISONS[0],a=await GeneralWorkbenchRun.create(p.control,catalog.seed),b=await GeneralWorkbenchRun.create(p.candidate,catalog.seed);await a.advance();await b.advance();const before=[a.checkpoint(),b.checkpoint()],r=compareGeneralSnapshots(p.id,a.snapshot(),b.snapshot());expect(r.status).toBe('ALIGNED_COMMITTED_INSTANT');expect(r.identity.modelEqual).toBe(false);expect([a.checkpoint(),b.checkpoint()]).toEqual(before);
},600000);
