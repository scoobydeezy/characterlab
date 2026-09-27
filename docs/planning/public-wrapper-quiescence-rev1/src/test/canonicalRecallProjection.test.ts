import {it,expect} from 'vitest';
import {projectCanonicalRecallPartition as project} from '../campaign3/canonicalRecallProjection';
import {generalAttentionRecord as r,generalAttentionSchema as schema} from '../campaign3/generalAttentionCodecs';
import {embodiedRecord as er} from '../campaign3/embodiedCodecs';
import {attentionFixture} from './attentionFixtures';
import {selectCanonicalVisual} from '../campaign3/canonicalVisualSelection';
import {closeSelectedView} from '../campaign3/attentionSelection';
import {canonicalEncode as enc,record,list,set,unsigned as u,signed,text,typedIdentifier as tid,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
const context={admittedVersions:['formation/test']},observer=tid(1000,text('observer/a')),other=tid(1000,text('observer/b'));
const sample=()=>er(461,[tid(1115,u(10)),observer,tid(1005,text('channel/alpha')),signed(1),er(462,[q(0,1),q(10,1)]),text('embodied-level-observation/0.1-candidate')]);
const child=(protectedValue:boolean,directions:number[])=>r('SurvivingBodyChild',[r('PositiveBodySignalGroup',[tid(1045,text('interoceptive-signal/alpha')),list([r('RetainedBodyView',[sample()])])]),protectedValue,set(directions.map(u))]);
const acquisition=(n=1,at=1,who=observer,protect=false,directions:number[]=[])=>r('RetainedAcquisition',[tid(1145,u(n)),who,signed(at),tid(1143,u(n+20)),text('formation/test'),r('SurvivingBodyContent',[list([child(protect,directions)])])],context);
const ledger=(entries:CanonicalValue[])=>r('SurvivingEpisodeLedger',[list(entries)],context);
it('CRP-A: canonical body projection preserves exact source metadata and evidence with no protection fields',()=>{
 const a=acquisition(),input=ledger([a]),before=enc(input),out=project(input,observer,'Interoceptive',2n,context);
 expect(out).toHaveLength(1);expect(out[0].schema.typeId).toBe(schema('RecalledAcquisitionEvidence').typeId);
 for(const n of[1n,2n,3n,4n,5n])expect(enc(out[0].fields.get(n)!)).toEqual(enc(a.fields.get(n)!));
 expect(enc(input)).toEqual(before);
 expect(enc(project(ledger([acquisition(1,1,observer,true,[1,2])]),observer,'Interoceptive',2n,context)[0])).toEqual(enc(out[0]));
 const content=out[0].fields.get(6n) as Extract<CanonicalValue,{kind:'record'}>;expect(content.schema.typeId).toBe(schema('PositiveBodyAcquisitionContent').typeId);
 (out[0].fields as Map<bigint,CanonicalValue>).set(3n,signed(999));expect(enc(input)).toEqual(before);
});
it('CRP-B: empty or different partition cannot resurrect lost acquisitions',()=>{
 expect(project(ledger([]),observer,'Interoceptive',2n,context)).toEqual([]);
 expect(project(ledger([acquisition()]),observer,'EventContinuant',2n,context)).toEqual([]);
});
it('CRP-C: invalid siblings reject before partition filtering',()=>{
 for(const entries of[[acquisition(1,2)],[acquisition(1,1,other)],[acquisition(),acquisition()]])expect(()=>project(ledger(entries),observer,'EventContinuant',2n,context)).toThrow();
 const invalid=record(schema('SurvivingBodyChild'),new Map([[1n,u(1)],[2n,false],[3n,set([])]]));
 const content=record(schema('SurvivingBodyContent'),new Map([[1n,list([invalid])]]));
 const a=acquisition();const altered=record(a.schema,new Map([...a.fields].map(([k,v])=>[k,k===6n?content:v])));
 const input=record(schema('SurvivingEpisodeLedger'),new Map([[1n,list([altered])]]));expect(()=>project(input,observer,'EventContinuant',2n,context)).toThrow();
});
it('CRP-D: invalid receiving time, owner grammar and partition kind reject',()=>{
 expect(()=>project(ledger([]),observer,'Interoceptive',-1n,context)).toThrow();
 expect(()=>project(ledger([]),observer,'Unknown' as never,2n,context)).toThrow();
 expect(()=>project(acquisition(),observer,'Interoceptive',2n,context)).toThrow();
 expect(()=>project(ledger([]),tid(1002,text('fake')),'Interoceptive',2n,context)).toThrow();
});
it('CRP-E: event projection retains actual selected SEM operands and calibration, erasing only owner metadata',()=>{
 const f=attentionFixture(),selection=selectCanonicalVisual({kind:'Experience',experience:f.experience,claims:f.claims},1,()=>40n);
 closeSelectedView(selection.view);
 type R=Extract<CanonicalValue,{kind:'record'}>;
 const selected=(selection.selected.fields.get(4n) as Extract<CanonicalValue,{kind:'list'}>).items[0] as R;
 const unit=selected.fields.get(1n) as R,event=unit.fields.get(1n)!;
 const who=tid(1000,text(f.experience.observerId));
 const panel=r('TrialPanelPresentObservation',[tid(1115,u(0)),who,signed(1),u(0),u(1),text('formation/test')],context);
 const grouping=r('PerceivedTrialContextEvidence',[tid(1106,u(20)),event,panel],context);
 const encoding=r('RetainedEncodingUnit',[unit,selected.fields.get(2n)!,selected.fields.get(3n)!,r('EncodingFactors',[q(1,1),q(1,1),q(1,1),q(1,1)]),q(1,2)],context);
 const evidence=r('PositiveEventChildEvidence',[encoding,grouping],context),calibration=tid(1027,text('definition/encoding-test'));
 const make=(protect:boolean,tags:number[])=>r('RetainedAcquisition',[tid(1145,u(41)),who,signed(1),tid(1143,u(40)),text('formation/test'),r('SurvivingEventContent',[calibration,list([r('SurvivingEventChild',[evidence,protect,set(tags.map(u))],context)])],context)],context);
 const first=project(ledger([make(false,[])]),who,'EventContinuant',2n,context),second=project(ledger([make(true,[1,2])]),who,'EventContinuant',2n,context);
 expect(first).toHaveLength(1);expect(enc(first[0])).toEqual(enc(second[0]));
 const content=first[0].fields.get(6n) as R;expect(content.fields.get(1n)).toEqual(calibration);expect(content.fields.get(2n)).toEqual(list([evidence]));
});
