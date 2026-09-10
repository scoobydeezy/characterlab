/** Actual character-side components; live event authentication is a separate runtime gate. */
import {describe,it,expect,vi} from 'vitest';
import {list,set,text,typedIdentifier,unsigned as u,signed,rational,canonicalEncode as enc} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {cognitiveRecord as r} from '../campaign2/cognitiveCodecs';
import {workspaceOutput,appraisalOutput,concernOutput,motiveOutput,candidateOutput,rawSignalOutput} from '../campaign2/cognitiveTransforms';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint} from '../campaign2/canonicalData';
const id=(n:number,s:string)=>typedIdentifier(n,text(s)),occ=(n:number)=>typedIdentifier(n,u(1));
const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
const tasks=['a','b'].map((name,i)=>({key:r(371,[C,semanticReferentFromAuthoredContent(governedContentDefinitionId('content/task-'+name))]),specId:id(1027,'definition/task-'+name),activeFrom:1n,deadline:BigInt(10+i)}));
const criteria=tasks.map((t,i)=>({taskKey:t.key,specId:t.specId,minimum:Q.of(BigInt(4+i)),maximum:Q.of(BigInt(6+i))}));
const prediction=(n:number)=>r(361,[rational(n,1),set([r(237,[u(1),typedIdentifier(1115,u(1))])])]);
const agenda=id(1027,'definition/task-workspace');
function workspace(capacity=3,forecast=prediction(0),access=true){return workspaceOutput(occ(1128),C,agenda,r(378,[id(1027,'definition/measurement-prediction'),u(capacity),true,access]),tasks,2n,{status:()=>r(372,[u(1)]),prediction:()=>forecast}).output;}
function motive(base=true){return motiveOutput(occ(1131),concernOutput(occ(1130),appraisalOutput(occ(1129),workspace(),criteria),r(385,[rational(1,1),true])),r(392,[rational(1,10),base]));}
function candidates(alias=false,base=true){return candidateOutput(occ(1132),motive(base),true,t=>({instructionId:id(1027,'definition/task-instruction-one'),actionId:id(1027,'definition/protocol-contact-'+(alias||enc(t).toString()===enc(tasks[0].key).toString()?'one':'two'))}));}
describe('cognitive restricted character-side components',()=>{
 for(const capacity of [0,1,2,3])it('keeps capacity and forecast read gates distinct: '+capacity,()=>{
  const read=vi.fn(()=>prediction(0)),status=vi.fn(()=>r(372,[u(1)]));
  const result=workspaceOutput(occ(1128),C,agenda,r(378,[id(1027,'definition/measurement-prediction'),u(capacity),true,true]),tasks,2n,{status,prediction:read});
  expect(items(f(rec(result.output,381n),4n),'list')).toHaveLength(capacity===0?0:capacity===3?2:1);
  expect(read).toHaveBeenCalledTimes(capacity>=2?1:0);expect(status).toHaveBeenCalledTimes(2);
 });
 it('does not donate the forecast slot when access is disabled',()=>{
  const w=workspace(2,prediction(0),false);expect(items(f(rec(w,381n),4n),'list')).toHaveLength(1);expect(f(rec(w,381n),5n)).toEqual(r(380,[u(1)]));
 });
 it('performs no task or prediction reads when task access is disabled',()=>{
  const status=vi.fn(),prediction=vi.fn();workspaceOutput(occ(1128),C,agenda,r(378,[id(1027,'definition/measurement-prediction'),u(3),false,true]),tasks,2n,{status,prediction});expect(status).not.toHaveBeenCalled();expect(prediction).not.toHaveBeenCalled();
 });
 it('uses actual adoption, active half-open windows and canonical ties without implicit tasks',()=>{
  const definition=r(378,[id(1027,'definition/measurement-prediction'),u(3),true,true]);
  const selected=(at:bigint,status:(task:typeof tasks[number]['key'])=>ReturnType<typeof r>|undefined,source=tasks)=>items(f(rec(workspaceOutput(occ(1128),C,agenda,definition,source,at,{status,prediction:()=>prediction(0)}).output,381n),4n),'list').map(v=>enc(f(rec(v,379n),1n)).toString());
  expect(selected(0n,()=>r(372,[u(1)]))).toEqual([]);expect(selected(10n,()=>r(372,[u(1)]))).toEqual([enc(tasks[1].key).toString()]);
  expect(selected(2n,()=>undefined)).toEqual([]);expect(selected(2n,()=>r(372,[u(3)]))).toEqual([]);
  const ties=tasks.map(t=>({...t,deadline:10n}));expect(selected(2n,()=>r(372,[u(1)]),[...ties].reverse())).toEqual(selected(2n,()=>r(372,[u(1)]),ties));
 });
 it('preserves Unknown versus known zero and inclusive goal endpoints',()=>{
  const tags=(forecast:number,access=true)=>items(f(rec(appraisalOutput(occ(1129),workspace(3,prediction(forecast),access),criteria),384n),3n),'list').map(v=>uint(f(rec(f(rec(v,383n),2n),382n),1n)));
  expect(tags(0,false)).toEqual([1n,1n]);expect(tags(0)).toEqual([2n,2n]);expect(tags(4)).toEqual([3n,2n]);expect(tags(6)).toEqual([3n,3n]);expect(tags(7)).toEqual([4n,3n]);
 });
 it('retains options with base ablated and deduplicates complete action keys',()=>{
  expect(items(f(rec(candidates(false,false),398n),3n),'list')).toHaveLength(2);
  const options=items(f(rec(candidates(true),398n),3n),'list');expect(options).toHaveLength(1);expect(items(f(rec(options[0],397n),2n),'set')).toHaveLength(2);
 });
 it('does not read plans when plan access is disabled',()=>{const read=vi.fn();const result=candidateOutput(occ(1132),motive(),false,read);expect(read).not.toHaveBeenCalled();expect(items(f(rec(result,398n),3n),'list')).toHaveLength(0);});
 it('uses direct retained identity once per origin without feeding it into meaning',()=>{
  const options=candidates(),history=r(414,[list([r(413,[occ(1138),occ(1135),signed(1),rational(1,5)])])]);
  const absent=rawSignalOutput(occ(1133),options,true,Q.of(1n,10n),()=>undefined),known=rawSignalOutput(occ(1133),options,true,Q.of(1n,10n),()=>history);
  expect(enc(f(rec(absent.output,403n),4n))).toEqual(enc(f(rec(known.output,403n),4n)));
  const signals=items(f(rec(known.output,403n),3n),'set').filter(v=>uint(f(rec(f(rec(v,402n),1n),401n),3n))===3n);
  expect(signals).toHaveLength(2);for(const signal of signals)expect(f(rec(signal,402n),2n)).toEqual(rational(2,3));expect(known.quantizationOperations).toHaveLength(2);
 });
 it('does not read identity when standing is disabled',()=>{const read=vi.fn();rawSignalOutput(occ(1133),candidates(),false,Q.of(1n,10n),read);expect(read).not.toHaveBeenCalled();});
});
