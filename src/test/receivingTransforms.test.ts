import {describe,it,expect} from 'vitest';
import {canonicalEncode as enc,list,set,map,record,rational,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {receivingRecord as r} from '../campaign3/receivingCodecs';
import {bodyOptionsOutput,mixedCandidateOutput,mixedRawOutput,mixedReasonOutput,noCoverageMixedRawOutput,noCoverageMixedReasonOutput,receivingCoverageComponent} from '../campaign3/receivingTransforms';
import {ONE,ZERO,analyzeOptions,convolve,expectation,absolute,readDistribution,readQ} from '../campaign2/cognitiveMath';
import {dataField as f,dataRecord as rec,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {C,id,occurrence,positivePressure,taskSource,def} from './receivingFixtures';
import {createReceivingRandomSession,receivingArbitrationOutput} from '../campaign3/receivingArbitration';
const pressureDef=id(1027,'definition/embodied-pressure');
function chain(adopted:readonly string[],action='two',task=true,base=true,control=false){
 const source=taskSource(action,task,base),body=bodyOptionsOutput(occurrence(1132,3),positivePressure(),pressureDef,()=>adopted.map(s=>({instructionId:id(1027,'definition/embodied-response-'+s),pressureDefinitionId:pressureDef,actionId:id(1027,'definition/protocol-contact-'+(s==='b'?'two':'one'))})));
 const candidates=mixedCandidateOutput(occurrence(1132,16),r(491,[source.candidates,body]));
 const raw=(control?noCoverageMixedRawOutput:mixedRawOutput)(occurrence(1133,17),r(498,[candidates,source.raw]),pressureDef);
 const reasons=(control?noCoverageMixedReasonOutput:mixedReasonOutput)(occurrence(1134,18),raw,def('task-reason-dice'));
 const nuclei=items(f(rec(reasons,504n),3n),'list');
 const options=items(f(rec(candidates,492n),3n),'list').map(v=>{const candidate=f(rec(v,490n),1n);let distribution=new Map([[0n,ONE]]),reasonMass=ZERO;for(const n of nuclei.filter(n=>key(f(rec(f(rec(n,503n),1n),502n),1n))===key(candidate))){const d=readDistribution(f(rec(n,503n),7n));distribution=convolve(distribution,d);reasonMass=reasonMass.add(absolute(expectation(d)));}return {key:candidate,distribution,reasonMass};});
 const analysis=options.length&&nuclei.length?analyzeOptions(options,readQ(rational(1,10)),readQ(rational(1,10))):undefined;
 return {body,candidates,raw,reasons,nuclei,analysis};
}
const probability=(x:ReturnType<typeof chain>,action:string)=>{const p=x.analysis!.probabilities.find(p=>key(p.key)===key(r(395,[C,id(1027,'definition/protocol-contact-'+action)])))!.probability;return `${p.numerator}/${p.denominator}`;};
describe('embodied receiving actual transformation components (not runtime qualification)',()=>{
 it('situational modifiers cannot create a nucleus with zero base (component/profile split)',()=>{
  const source=chain([]),raw=rec(source.raw,499n),taskSignal=rec(items(f(raw,3n),'set')[0],496n),sourceKey=rec(f(taskSignal,1n),495n);
  const modifier=r(496,[r(495,[f(sourceKey,1n),f(sourceKey,2n),u(2)]),rational(1,2),f(taskSignal,3n)]),modified=record(raw.schema,new Map([...raw.fields].map(([n,v])=>[n,n===3n?set([modifier]):v])));
  const result=mixedReasonOutput(occurrence(1134,20),modified,def('task-reason-dice'));expect(items(f(rec(result,504n),3n),'list')).toHaveLength(0);
 });
 it('the actual aggregate kernel covers {a},{b},{a,b}; pairwise-only overlap is insufficient',()=>{
  const source=chain(['a']),raws=items(f(rec(source.raw,499n),3n),'set'),body=raws.find(v=>rec(f(rec(v,496n),1n),495n).fields.has(4n))!,baseKey=rec(f(rec(body,496n),1n),495n);
  const a=r(399,[u(1),r(237,[u(1),occurrence(1115,90)])]),b=r(399,[u(1),r(237,[u(1),occurrence(1115,91)])]);
  const signals=[[a],[b],[a,b]].map((atoms,index)=>r(496,[r(495,[f(baseKey,1n),f(baseKey,2n),u(1),id(1027,'component/coverage-'+index)]),rational(3-index,4),r(400,[map(atoms.map(atom=>[atom,rational(1,1)]))])]));
  const result=receivingCoverageComponent(signals);expect(result.net.numerator).toBe(5n);expect(result.net.denominator).toBe(9n);expect(readQ(f(rec(result.trace[2],500n),3n)).equals(ONE)).toBe(true);expect(readQ(f(rec(result.trace[2],500n),5n)).equals(ZERO)).toBe(true);
 });
 it('uses real addressed RNG for independent body/task nuclei and rejects reused addresses',async()=>{
  const source=chain(['a','b'],'one'),random=createReceivingRandomSession(new Uint8Array(32)),root=occurrence(1135,19);random.begin();
  const draws=random.forResolution(root,source.reasons),resolution=rec(await receivingArbitrationOutput(root,45n,source.reasons,def('task-arbitration'),draws),508n);
  const result=rec(f(resolution,4n),507n),data=rec(f(result,2n),506n);expect(items(f(data,9n),'list')).toHaveLength(3);
  await expect(draws.reason(source.nuclei[0])).rejects.toThrow(/repeated/);random.prepareCommit();random.commit();random.close();
  expect(random.committedAddressKeys().length).toBeGreaterThanOrEqual(3);expect(random.committedAddressKeys().length).toBeLessThanOrEqual(4);
  await expect(draws.reason(source.nuclei[0])).rejects.toThrow(/expired/);
 });
 it('discards provisional RNG addresses on abort and exactly replays the draw bytes',async()=>{
  const source=chain(['a']),random=createReceivingRandomSession(new Uint8Array(32)),root=occurrence(1135,19);random.begin();
  const first=await receivingArbitrationOutput(root,45n,source.reasons,def('task-arbitration'),random.forResolution(root,source.reasons));random.close();
  expect(random.committedAddressKeys()).toEqual([]);random.begin();const second=await receivingArbitrationOutput(root,45n,source.reasons,def('task-arbitration'),random.forResolution(root,source.reasons));expect(enc(first)).toEqual(enc(second));random.close();
 });
 it('retains duplicate origins but one body nucleus and the same meaning/distribution',()=>{
  const one=chain(['a']),two=chain(['a','a-copy']);expect(items(f(rec(two.body,489n),3n),'list')).toHaveLength(2);expect(two.nuclei).toHaveLength(2);
  expect(probability(one,'one')).toBe('1/2');expect(probability(two,'one')).toBe('1/2');expect(enc(f(rec(one.raw,499n),4n))).toEqual(enc(f(rec(two.raw,499n),4n)));
  const body=two.nuclei.find(n=>key(f(rec(f(rec(n,503n),1n),502n),3n))===key(id(1040,'EmbodiedFuelDeficit')))!;
  const coverage=items(f(rec(f(rec(body,503n),2n),501n),4n),'list');expect(coverage).toHaveLength(2);expect(readQ(f(rec(coverage[1],500n),5n)).equals(ZERO)).toBe(true);
 });
 it('an honestly different no-coverage receiver changes the duplicate probability',()=>{
  const result=chain(['a','a-copy'],'two',true,true,true);expect(probability(result,'one')).toBe('2/3');
 });
 it('preserves independent task/body grounds on the same option',()=>{
  const all=chain(['a','b'],'one');expect(all.nuclei).toHaveLength(3);expect(probability(all,'one')).toBe('221/256');
  expect(probability(chain(['a','b'],'one',false),'one')).toBe('1/2');
  expect(probability(chain(['b'],'one'),'one')).toBe('1/2');
 });
 it('distinguishes no candidates from candidates without active reasons',()=>{
  const none=chain([],'two',false),inactive=chain([],'two',true,false);expect(items(f(rec(none.candidates,492n),3n),'list')).toHaveLength(0);expect(items(f(rec(inactive.candidates,492n),3n),'list')).toHaveLength(1);expect(inactive.nuclei).toHaveLength(0);
 });
 it('does not read instruction context for Known0 or Unavailable',()=>{
  const sample=r(463,[occurrence(1115,0),id(1000,'observer/embodied-subject'),id(1005,'channel/embodied-fuel-level'),{kind:'signed',value:45n},text('embodied-level-observation/0.1-candidate')]);
  const unavailable=r(464,[occurrence(1142,2),C,sample,r(481,[u(2)]),text('embodied-pressure/0.2-candidate')]);
  const positive=rec(positivePressure(),464n),zero=r(464,[f(positive,1n),C,f(positive,3n),r(481,[u(1),rational(0,1)]),text('embodied-pressure/0.2-candidate')]);
  for(const p of [unavailable,zero])expect(items(f(rec(bodyOptionsOutput(occurrence(1132,3),p,pressureDef,()=>{throw Error('forbidden read');}),489n),3n),'list')).toHaveLength(0);
 });
 it('rejects a body instruction bound to another pressure',()=>expect(()=>bodyOptionsOutput(occurrence(1132,3),positivePressure(),pressureDef,()=>[{instructionId:id(1027,'definition/embodied-response-a'),pressureDefinitionId:id(1027,'foreign'),actionId:id(1027,'definition/protocol-contact-one')}])).toThrow(/binding/));
});
