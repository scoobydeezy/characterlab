import {it,expect} from 'vitest';
import {ExactRational as Q} from '../substrate/exactMath';
import {canonicalEncode as enc,typedIdentifier as tid,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {createLocalReserveSource} from '../campaign3/localReserveSource';
import {createTrialPanelSource} from '../campaign3/trialPanelSource';
import {createWindowMarkerManager} from '../campaign3/windowMarkerTransaction';
import {createWindowPanelManager} from '../campaign3/windowPanelTransaction';
import {observeGeneralSourceOpportunity} from '../campaign3/generalSourceOpportunity';
import {selectCanonicalBody as select,produceCanonicalBodyFormation as produce} from '../campaign3/canonicalBodyProduction';
import {decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import type {ContextualBodyView} from '../campaign3/contextualBodySelection';
type R=Extract<CanonicalValue,{kind:'record'}>;
const observer=tid(1000,text('observer/body')),limits={maxSignals:1,maxViewsPerSignal:1,maxBytesPerSignal:4096,capacity:1};
function sense(available=true,panelVisible=true){
 const source=createLocalReserveSource(['A','B','C'].map(k=>({key:'local-reserve/'+k,capacity:Q.of(100n),rate:Q.of(0n),amount:Q.of(0n),anchoredAt:0n})),['A','B','C'].map(k=>({channel:'channel/'+k,physical:'local-reserve/'+k,signal:'interoceptive-signal/'+k,width:Q.of(1n),available,permitted:true})));
 const panel=createTrialPanelSource([{at:1n,glyph:0,stage:'Before',visible:panelVisible,permitted:true}]);let n=0n;
 const result=observeGeneralSourceOpportunity(source,panel,undefined,createWindowPanelManager('observer/body'),createWindowMarkerManager('observer/body'),observer,1n,'Current',{bodyChannels:['channel/A'],panel:true,visual:false},()=>n++);
 return {...result.body!,context:result.context};
}
const grammar={admittedVersions:['body-formation-evidence-component/0.1-candidate','trial-panel-source-component/0.1-candidate']};
const seq=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='list')throw Error('list');return v.items;};
it('CBP-A: actual sensing yields one canonical selection then one distinct canonical acquisition',()=>{
 const input=sense(),prior=input.samples.map(enc);let n=90n;const selected=select(input,limits,()=>n++),formed=produce(selected.view,()=>n++);
 expect(n).toBe(92n);expect(selected.audit.schema.typeId).toBe(603n);expect(selected.audit.fields.get(1n)).toEqual(tid(1143,u(90)));
 if(formed.kind!=='Formation')throw Error('formation');const e=formed.evidence;expect(e.schema.typeId).toBe(549n);expect(e.fields.get(1n)).toEqual(tid(1145,u(91)));expect(e.fields.get(4n)).toEqual(tid(1143,u(90)));
 const content=e.fields.get(6n) as R,group=seq(content.fields.get(1n)!)[0] as R,view=seq(group.fields.get(2n)!)[0] as R;
 expect(group.fields.get(1n)).toEqual(tid(1045,text('interoceptive-signal/A')));expect(enc(view.fields.get(1n)!)).toEqual(prior[0]);
 const context=view.fields.get(2n) as R,panel=context.fields.get(3n) as R;expect(context.fields.get(1n)).toEqual(tid(1106,u(input.context!.experience)));expect(panel.fields.get(1n)).toEqual(tid(1115,u(input.context!.panel.observation)));
 expect(enc(decode(enc(e),grammar))).toEqual(enc(e));expect(input.samples.map(enc)).toEqual(prior);
});
it('CBP-B: zero capacity and absence preserve real selector but allocate no acquisition',()=>{
 for(const[available,capacity]of[[true,0],[false,1]] as const){let n=10n;const input=sense(available,false),s=select(input,{...limits,capacity},()=>n++);expect(produce(s.view,()=>n++)).toEqual({kind:'NoFormation',selectionId:10n});expect(n).toBe(11n);expect(s.audit.fields.has(4n)).toBe(available);}
});
it('CBP-C: raw input, counterfeit and consumed capability cannot produce acquisition',()=>{
 let calls=0;const allocate=()=>BigInt(calls++),input=sense();for(const v of[input,{}])expect(()=>produce(v as ContextualBodyView,allocate)).toThrow();expect(calls).toBe(0);
 const s=select(input,limits,()=>90n);produce(s.view,allocate);expect(()=>produce(s.view,allocate)).toThrow();expect(calls).toBe(1);
});
it('CBP-D: audit mutation cannot alter actual formation and absent panel remains absent',()=>{
 const input=sense(true,false),s=select(input,limits,()=>90n);(s.audit.fields as Map<bigint,CanonicalValue>).clear();
 const f=produce(s.view,()=>91n);if(f.kind!=='Formation')throw Error('formation');expect(f.evidence.fields.get(4n)).toEqual(tid(1143,u(90)));
 const c=f.evidence.fields.get(6n) as R,g=seq(c.fields.get(1n)!)[0] as R,v=seq(g.fields.get(2n)!)[0] as R;expect(v.fields.has(2n)).toBe(false);
});
